import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Radio, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { LiveAudioSession } from '../../services/liveAudio';
import { useLipSync } from '../../hooks/useLipSync';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const sessionRef = useRef<LiveAudioSession | null>(null);

  const { mouthOpen } = useLipSync(audioStream);

  useEffect(() => {
    if (isOpen) {
      const session = new LiveAudioSession();
      sessionRef.current = session;

      session.onStatusChange = (newStatus, err) => {
        setStatus(newStatus);
        if (err) setErrorMessage(err);
        if (newStatus === 'connected') {
          setAudioStream(session.getMediaStream());
        } else {
          setAudioStream(null);
        }
      };

      session.onVolumeChange = (vol) => {
        setVolume(vol);
      };

      session.onTranscript = (text) => {
        setTranscript((prev) => prev + ' ' + text);
      };

      session.start();

      return () => {
        session.stop();
        sessionRef.current = null;
        setAudioStream(null);
      };
    } else {
      if (sessionRef.current) {
        sessionRef.current.stop();
        sessionRef.current = null;
      }
      setAudioStream(null);
    }
  }, [isOpen]);

  const toggleMute = () => {
    if (sessionRef.current) {
      const next = !isMuted;
      sessionRef.current.setMute(next);
      setIsMuted(next);
    }
  };

  const handleClose = () => {
    if (sessionRef.current) {
      sessionRef.current.stop();
      sessionRef.current = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col items-center">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800 mb-6 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
                <span>SARA Live Voice</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  gemini-3.8-live
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Low-latency, real-time duplex audio</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        <div className="mb-6 flex items-center space-x-2">
          {status === 'connecting' && (
            <span className="text-xs text-amber-400 flex items-center space-x-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Connecting to Gemini Live API WebSocket...</span>
            </span>
          )}
          {status === 'connected' && (
            <span className="text-xs text-emerald-400 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Connection Active (24kHz Audio Output / 16kHz Input)</span>
            </span>
          )}
          {status === 'error' && (
            <span className="text-xs text-rose-400 flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage || 'Connection failed'}</span>
            </span>
          )}
        </div>

        {/* Live Audio Visualizer Waves */}
        <div className="w-full flex items-center justify-center h-44 my-2 relative">
          <div className="flex items-center space-x-1.5">
            {[40, 65, 30, 80, 50, 95, 35, 75, 45, 90, 60, 85, 35, 70, 50].map((baseHeight, i) => {
              const dynHeight = Math.max(12, Math.min(130, baseHeight * (0.3 + (volume + mouthOpen) * 1.2)));
              return (
                <div
                  key={i}
                  style={{ height: `${dynHeight}px` }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-75"
                />
              );
            })}
          </div>

          {/* Central Pulsing Sphere with Lip-Sync Mouth Animation */}
          <div
            style={{ transform: `scale(${1 + Math.max(volume, mouthOpen) * 0.4})` }}
            className="absolute w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex flex-col items-center justify-center transition-transform duration-75 pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex flex-col items-center justify-center relative">
              <Mic className="w-6 h-6 text-emerald-300 mb-1" />
              {/* Dynamic Lip-Sync Mouth Bar */}
              <div 
                style={{ width: `${Math.max(6, mouthOpen * 28)}px`, height: `${Math.max(2, mouthOpen * 8)}px` }}
                className="bg-emerald-300 rounded-full transition-all duration-75"
              />
            </div>
          </div>
        </div>

        {/* Live Transcription Box */}
        <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 min-h-[70px] max-h-[110px] overflow-y-auto custom-scrollbar">
          <p className="text-[10px] uppercase font-semibold text-slate-500 mb-1 tracking-wider">Live Transcript</p>
          <p className="italic text-slate-400">
            {transcript || 'Speak naturally. SARA will listen, reason, and speak back with real-time audio.'}
          </p>
        </div>

        {/* Bottom Control Bar */}
        <div className="w-full mt-6 pt-4 border-t border-slate-800 flex items-center justify-between z-10">
          <button
            onClick={toggleMute}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium border transition ${
              isMuted
                ? 'bg-rose-950/40 text-rose-300 border-rose-800/80 hover:bg-rose-900/60'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
          </button>

          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            End Conversation
          </button>
        </div>
      </div>
    </div>
  );
};
