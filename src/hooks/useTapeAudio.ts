// src/hooks/useTapeAudio.ts
"use client";

import { useCallback } from "react";

let sharedCtx: AudioContext | null = null;
let unlockAttached = false;
const bufferCache = new Map<string, AudioBuffer | null>();
let loadStarted = false;

const SOUND_PATHS = {
  keys: ["/sounds/typewriter-1.mp3", "/sounds/typewriter-2.mp3"],
  vhsPowerOn: "/sounds/vhs-power-on.mp3",
};

function getSharedCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedCtx) {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      sharedCtx = new AudioCtx();
    } catch {
      sharedCtx = null;
    }
  }
  if (sharedCtx && !unlockAttached) {
    unlockAttached = true;
    const unlock = () => sharedCtx?.resume().catch(() => {});
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true });
  }
  return sharedCtx;
}

async function loadBuffer(
  ctx: AudioContext,
  path: string,
): Promise<AudioBuffer | null> {
  if (bufferCache.has(path)) return bufferCache.get(path) ?? null;
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("not found");
    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    bufferCache.set(path, audioBuffer);
    return audioBuffer;
  } catch {
    bufferCache.set(path, null);
    return null;
  }
}

function preloadAll(ctx: AudioContext) {
  if (loadStarted) return;
  loadStarted = true;
  [...SOUND_PATHS.keys, SOUND_PATHS.vhsPowerOn].forEach((path) =>
    loadBuffer(ctx, path),
  );
}

function playBuffer(
  ctx: AudioContext,
  buffer: AudioBuffer,
  gainValue = 0.5,
  rateVariance = 0,
) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  if (rateVariance > 0) {
    src.playbackRate.value = 1 + (Math.random() - 0.5) * rateVariance;
  }
  const gain = ctx.createGain();
  gain.gain.value = gainValue;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

// ---- fallback, если carriage-return сэмпла нет и появится позже ----
function synthCarriageReturn(ctx: AudioContext) {
  const t = ctx.currentTime;
  const bell = ctx.createOscillator();
  bell.type = "sine";
  bell.frequency.setValueAtTime(1900, t);
  const bellGain = ctx.createGain();
  bellGain.gain.setValueAtTime(0.12, t);
  bellGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
  bell.connect(bellGain);
  bellGain.connect(ctx.destination);
  bell.start(t);
  bell.stop(t + 0.45);
}

async function loadAndGetDuration(
  ctx: AudioContext,
  path: string,
): Promise<AudioBuffer | null> {
  return loadBuffer(ctx, path);
}

export function useTapeAudio() {
  const playClick = useCallback(() => {
    const ctx = getSharedCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    preloadAll(ctx);

    const path =
      SOUND_PATHS.keys[Math.floor(Math.random() * SOUND_PATHS.keys.length)];
    const buffer = bufferCache.get(path);
    if (buffer) {
      // playbackRate ±8% на каждый удар — чтобы серия из двух сэмплов
      // не звучала одинаково при частой посимвольной печати
      playBuffer(ctx, buffer, 0.7, 0.16);
    }
    // если буфер ещё не загрузился (первые вызовы до завершения fetch) —
    // просто пропускаем звук на этот символ, не подменяя синтезом:
    // проглатывание одного клика из сотни незаметно, а внедрять
    // параллельно два разных тембра (сэмпл + синтез) звучало бы хуже
  }, []);

  const playCarriageReturn = useCallback(() => {
    const ctx = getSharedCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    synthCarriageReturn(ctx);
  }, []);

  const playVhsPowerOnAsync = useCallback(async (): Promise<number> => {
    const ctx = getSharedCtx();
    if (!ctx) return 0;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    preloadAll(ctx);

    const buffer = await loadAndGetDuration(ctx, SOUND_PATHS.vhsPowerOn);
    if (buffer) {
      playBuffer(ctx, buffer, 0.7);
      return buffer.duration;
    }
    return 0;
  }, []);

  return { playClick, playCarriageReturn, playVhsPowerOn: playVhsPowerOnAsync };
}
