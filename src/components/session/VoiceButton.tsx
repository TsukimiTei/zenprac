'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { VoiceRecorder } from '@/lib/voice';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  accentColor?: string;
}

export default function VoiceButton({ onTranscript, disabled, accentColor = '#B8860B' }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState('');
  const recorderRef = useRef<VoiceRecorder | null>(null);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    recorderRef.current = new VoiceRecorder();
  }, []);

  // Keep ref in sync with state for keyboard handler
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    if (!recorderRef.current?.isSupported) {
      setError('浏览器不支持语音识别');
      return;
    }

    setError('');
    setInterim('');

    // Explicitly request microphone permission to trigger browser dialog
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch {
      setError('请允许麦克风权限以使用语音输入');
      return;
    }

    setIsRecording(true);

    recorderRef.current.start(
      (text, isFinal) => {
        if (isFinal) {
          onTranscript(text);
          setInterim('');
          setIsRecording(false);
        } else {
          setInterim(text);
        }
      },
      (err) => {
        setError(err);
        setIsRecording(false);
      },
      () => {
        setIsRecording(false);
      }
    );
  }, [onTranscript]);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecordingRef.current) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [startRecording, stopRecording]);

  // Global keyboard shortcut: Alt+V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'v' || e.key === 'V' || e.key === '√') && !disabled) {
        e.preventDefault();
        toggleRecording();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleRecording, disabled]);

  const isSupported = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  if (!isSupported) return null;

  return (
    <div className="relative flex flex-col items-center">
      {/* Interim text preview */}
      {interim && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-800/90 rounded-lg px-3 py-2 text-xs text-stone-300">
          {interim}
        </div>
      )}

      <button
        onClick={toggleRecording}
        disabled={disabled}
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                   transition-all duration-200 disabled:opacity-30
                   ${isRecording ? 'scale-110' : ''}`}
        style={{
          background: isRecording ? `${accentColor}60` : `${accentColor}20`,
          boxShadow: isRecording ? `0 0 20px ${accentColor}30` : 'none',
        }}
        title="语音输入 (⌥V)"
      >
        {isRecording ? (
          <div className="w-4 h-4 rounded-full animate-pulse" style={{ background: accentColor }} />
        ) : (
          <svg className="w-5 h-5" fill="none" stroke={accentColor} viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {/* Shortcut hint */}
      <span className="text-[10px] text-stone-600 mt-1 tracking-wider">⌥V</span>

      {error && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-900/80 rounded-lg px-3 py-1 text-xs text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
