'use client';

import { useEffect, useRef, useState } from 'react';

interface AmbientSoundProps {
  src: string;
  playing: boolean;
  volume?: number; // 0-1, default 0.15
  fadeMs?: number; // fade duration in ms, default 3000
}

/**
 * Ambient sound player for meditation sessions.
 * - Loops continuously while `playing` is true
 * - Fades in/out smoothly
 * - Low default volume so it doesn't compete with TTS
 * - Requires user interaction before playing (browser autoplay policy)
 */
export default function AmbientSound({ src, playing, volume = 0.15, fadeMs = 3000 }: AmbientSoundProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Track user interaction for autoplay policy
  useEffect(() => {
    const handler = () => setHasInteracted(true);
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  // Create audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [src]);

  // Handle play/pause with fade
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    if (playing) {
      // Fade in
      audio.volume = 0;
      audio.play().catch(() => {});
      const steps = 30;
      const stepMs = fadeMs / steps;
      const stepVol = volume / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(stepVol * currentStep, volume);
        if (currentStep >= steps) {
          clearInterval(fadeIntervalRef.current!);
          fadeIntervalRef.current = null;
        }
      }, stepMs);
    } else {
      // Fade out
      const startVol = audio.volume;
      if (startVol === 0) { audio.pause(); return; }
      const steps = 20;
      const stepMs = fadeMs / steps;
      const stepVol = startVol / steps;
      let currentStep = 0;

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(startVol - stepVol * currentStep, 0);
        if (currentStep >= steps) {
          clearInterval(fadeIntervalRef.current!);
          fadeIntervalRef.current = null;
          audio.pause();
        }
      }, stepMs);
    }

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [playing, hasInteracted, volume, fadeMs]);

  return null; // No visual component
}
