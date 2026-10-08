import { useState, useEffect, useRef } from 'react';

export function useLipSync(audioStream?: MediaStream | null) {
  const [mouthOpen, setMouthOpen] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioStream) {
      setMouthOpen(0);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(audioStream);
      source.connect(analyser);
      sourceRef.current = source;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const analyze = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(1, Math.max(0, (average / 128) * 1.5));
        setMouthOpen(normalized);

        animFrameRef.current = requestAnimationFrame(analyze);
      };

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      analyze();

      return () => {
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
        }
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
        setMouthOpen(0);
      };
    } catch (err) {
      console.error('useLipSync error:', err);
    }
  }, [audioStream]);

  return { mouthOpen };
}
