'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'zenprac_dev_flags';

export interface DevFlags {
  disableDailyLimit: boolean;
}

const DEFAULT_FLAGS: DevFlags = {
  disableDailyLimit: false,
};

export function getDevFlags(): DevFlags {
  if (typeof window === 'undefined') return DEFAULT_FLAGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_FLAGS, ...JSON.parse(raw) } : DEFAULT_FLAGS;
  } catch {
    return DEFAULT_FLAGS;
  }
}

export default function DevPanel() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [flags, setFlags] = useState<DevFlags>(DEFAULT_FLAGS);

  useEffect(() => {
    setMounted(true);
    setFlags(getDevFlags());
  }, []);

  // Only render after mount to avoid hydration mismatch
  if (!mounted) return null;

  const toggle = (key: keyof DevFlags) => {
    const next = { ...flags, [key]: !flags[key] };
    setFlags(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    // Reload so all pages pick up the change
    window.location.reload();
  };

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-[9999] w-10 h-10 rounded-full bg-white/10 hover:bg-white/20
                   backdrop-blur-sm border border-white/10 flex items-center justify-center
                   text-xs transition-all duration-300 shadow-lg"
        title="Dev Panel"
      >
        ⚙
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-16 right-4 z-[9999] w-64 bg-black/90 backdrop-blur-md border border-white/10
                        rounded-2xl p-4 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-xs tracking-widest font-mono">DEV PANEL</span>
            <button onClick={() => setOpen(false)} className="text-stone-500 hover:text-stone-300 text-xs">✕</button>
          </div>

          <label className="flex items-center justify-between gap-3 cursor-pointer group">
            <span className="text-stone-300 text-sm">禁用每日限制</span>
            <button
              onClick={() => toggle('disableDailyLimit')}
              className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
                flags.disableDailyLimit ? 'bg-amber-600' : 'bg-stone-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                  flags.disableDailyLimit ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </label>
        </div>
      )}
    </>
  );
}
