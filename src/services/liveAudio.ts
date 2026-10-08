/**
 * Audio streaming client for Gemini 3.8 Live API
 * Inputs: 16kHz PCM mono audio from microphone -> WebSocket
 * Outputs: 24kHz audio from Gemini Live -> AudioContext playback
 */

export class LiveAudioSession {
  private ws: WebSocket | null = null;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private isConnected: boolean = false;
  private isMuted: boolean = false;
  private playbackQueue: AudioBuffer[] = [];
  private isPlaying: boolean = false;
  private nextPlayTime: number = 0;

  public onTranscript?: (text: string) => void;
  public onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error', errorMsg?: string) => void;
  public onVolumeChange?: (volume: number) => void;

  constructor() {}

  public async start() {
    try {
      this.onStatusChange?.('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = async () => {
        this.isConnected = true;
        this.onStatusChange?.('connected');
        await this.setupMicrophone();
        this.setupAudioPlayback();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            this.onStatusChange?.('error', msg.error);
            return;
          }
          if (msg.interrupted) {
            this.clearAudioQueue();
          }
          if (msg.text) {
            this.onTranscript?.(msg.text);
          }
          if (msg.audio) {
            this.playAudioChunk(msg.audio);
          }
        } catch (e) {
          console.error('Failed to parse WS message:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.error('Live WS error:', err);
        this.onStatusChange?.('error', 'WebSocket connection error');
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.cleanup();
        this.onStatusChange?.('disconnected');
      };
    } catch (err: any) {
      this.onStatusChange?.('error', err.message || 'Failed to start Live Voice session');
    }
  }

  private async setupMicrophone() {
    try {
      this.inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const source = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      // ScriptProcessorNode for raw 16kHz PCM capture
      this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);
      source.connect(this.processor);
      this.processor.connect(this.inputAudioCtx.destination);

      this.processor.onaudioprocess = (e) => {
        if (!this.isConnected || this.isMuted) return;

        const inputData = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += Math.abs(inputData[i]);
        }
        const avgVolume = sum / inputData.length;
        this.onVolumeChange?.(Math.min(1, avgVolume * 6));

        // Convert Float32Array to 16-bit PCM little-endian
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert Int16Array to Base64
        const uint8 = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < uint8.byteLength; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64 = btoa(binary);

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ audio: base64 }));
        }
      };
    } catch (err: any) {
      console.error('Microphone access denied or error:', err);
      this.onStatusChange?.('error', 'Microphone access denied: ' + err.message);
    }
  }

  private setupAudioPlayback() {
    this.outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: 24000,
    });
    this.nextPlayTime = this.outputAudioCtx.currentTime;
  }

  private playAudioChunk(base64Audio: string) {
    if (!this.outputAudioCtx) return;

    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Check if it's a WAV file or raw PCM 16-bit 24kHz
      let audioBuffer: AudioBuffer | null = null;

      // Handle raw PCM 16-bit LE (24kHz)
      const samplesCount = Math.floor(bytes.length / 2);
      const float32 = new Float32Array(samplesCount);
      const dataView = new DataView(bytes.buffer);

      for (let i = 0; i < samplesCount; i++) {
        const int16 = dataView.getInt16(i * 2, true);
        float32[i] = int16 / 32768.0;
      }

      audioBuffer = this.outputAudioCtx.createBuffer(1, samplesCount, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = this.outputAudioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioCtx.destination);

      const now = this.outputAudioCtx.currentTime;
      if (this.nextPlayTime < now) {
        this.nextPlayTime = now + 0.05;
      }
      source.start(this.nextPlayTime);
      this.nextPlayTime += audioBuffer.duration;
    } catch (err) {
      console.error('Error playing audio chunk:', err);
    }
  }

  private clearAudioQueue() {
    this.playbackQueue = [];
    if (this.outputAudioCtx) {
      this.nextPlayTime = this.outputAudioCtx.currentTime;
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  public getMediaStream(): MediaStream | null {
    return this.mediaStream;
  }

  public stop() {
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.onStatusChange?.('disconnected');
  }

  private cleanup() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.inputAudioCtx) {
      this.inputAudioCtx.close().catch(() => {});
      this.inputAudioCtx = null;
    }
    if (this.outputAudioCtx) {
      this.outputAudioCtx.close().catch(() => {});
      this.outputAudioCtx = null;
    }
  }
}
