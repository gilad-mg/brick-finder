"use client";

import * as React from "react";

const STORAGE_KEY = "brickfinder:sound";

type SoundEffect = "click" | "pop";

interface SoundContext {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
  play: (sfx?: SoundEffect) => void;
  reduced: boolean;
}

const SoundCtx = React.createContext<SoundContext | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);
  const audioCacheRef = React.useRef<Map<SoundEffect, HTMLAudioElement>>(new Map());

  /* eslint-disable react-hooks/set-state-in-effect -- hydration: read localStorage on mount */
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "1") setEnabledState(true);
    } catch {
      /* ignore */
    }
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(reducedMq.matches);
    const update = () => setReduced(reducedMq.matches);
    reducedMq.addEventListener("change", update);
    setHydrated(true);
    return () => reducedMq.removeEventListener("change", update);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setEnabled = React.useCallback((v: boolean) => {
    setEnabledState(v);
    try {
      window.localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = React.useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  const play = React.useCallback(
    (sfx: SoundEffect = "click") => {
      if (!enabled || reduced || !hydrated) return;
      try {
        let audio = audioCacheRef.current.get(sfx);
        if (!audio) {
          audio = new Audio(`/sounds/${sfx}.wav`);
          audio.volume = 0.4;
          audio.preload = "auto";
          audioCacheRef.current.set(sfx, audio);
        }
        audio.currentTime = 0;
        void audio.play().catch(() => {
          /* user gesture not yet performed */
        });
      } catch {
        /* ignore */
      }
    },
    [enabled, reduced, hydrated],
  );

  const value = React.useMemo<SoundContext>(
    () => ({ enabled, toggle, setEnabled, play, reduced }),
    [enabled, toggle, setEnabled, play, reduced],
  );

  return <SoundCtx.Provider value={value}>{children}</SoundCtx.Provider>;
}

export function useSoundFx(): SoundContext {
  const ctx = React.useContext(SoundCtx);
  if (!ctx) {
    return {
      enabled: false,
      toggle: () => undefined,
      setEnabled: () => undefined,
      play: () => undefined,
      reduced: false,
    };
  }
  return ctx;
}
