'use client';

import { useState } from 'react';

interface SpeakerButtonProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  accentColor?: string;
}

export default function SpeakerButton({ enabled, onToggle, accentColor = '#B8860B' }: SpeakerButtonProps) {
  return (
    <button
      onClick={() => onToggle(!enabled)}
      className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
      style={{
        background: enabled ? `${accentColor}20` : 'transparent',
      }}
      title={enabled ? '关闭语音播放' : '开启语音播放'}
    >
      {enabled ? (
        <svg className="w-4 h-4" fill="none" stroke={accentColor} viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="#6b7280" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      )}
    </button>
  );
}
