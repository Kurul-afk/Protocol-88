// src/hooks/useTapeAudio.ts
"use client";

import { useCallback, useRef } from "react";

export function useTapeAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const noiseBufferRef = useRef<AudioBuffer | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current && typeof window !== "undefined") {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        ctxRef.current = new AudioCtx();
      } catch {
        ctxRef.current = null;
      }
    }
    return ctxRef.current;
  }, []);

  // короткий белый шум переиспользуется под разные фильтры,
  // чтобы не аллоцировать новый буфер на каждое нажатие клавиши
  const getNoiseBuffer = useCallback((ctx: AudioContext) => {
    if (!noiseBufferRef.current) {
      const duration = 0.15;
      const size = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < size; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = buffer;
    }
    return noiseBufferRef.current;
  }, []);

  const playClick = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const variance = () => 0.85 + Math.random() * 0.3; // 0.85–1.15

    // 1) щелчок молоточка — отфильтрованный шумовой транзиент
    const noise = ctx.createBufferSource();
    noise.buffer = getNoiseBuffer(ctx);

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = (2600 + Math.random() * 1200) * variance();
    bandpass.Q.value = 4;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35 * variance(), t);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.04);

    // 2) низкий "тук" механического рычага
    const thock = ctx.createOscillator();
    thock.type = "triangle";
    thock.frequency.setValueAtTime(110 * variance(), t);
    thock.frequency.exponentialRampToValueAtTime(55, t + 0.05);

    const thockGain = ctx.createGain();
    thockGain.gain.setValueAtTime(0.18 * variance(), t);
    thockGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

    thock.connect(thockGain);
    thockGain.connect(ctx.destination);
    thock.start(t);
    thock.stop(t + 0.07);
  }, [getCtx, getNoiseBuffer]);

  /**
   * Звук возврата каретки (конец строки): механический "дзынь" колокольчика
   * + короткий скользящий шум движения каретки.
   */
  const playCarriageReturn = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // колокольчик
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

    // скольжение каретки
    const slide = ctx.createBufferSource();
    slide.buffer = getNoiseBuffer(ctx);

    const slideFilter = ctx.createBiquadFilter();
    slideFilter.type = "lowpass";
    slideFilter.frequency.setValueAtTime(1200, t + 0.05);
    slideFilter.frequency.linearRampToValueAtTime(300, t + 0.25);

    const slideGain = ctx.createGain();
    slideGain.gain.setValueAtTime(0, t);
    slideGain.gain.linearRampToValueAtTime(0.08, t + 0.08);
    slideGain.gain.linearRampToValueAtTime(0.0001, t + 0.28);

    slide.connect(slideFilter);
    slideFilter.connect(slideGain);
    slideGain.connect(ctx.destination);
    slide.start(t + 0.05);
    slide.stop(t + 0.3);
  }, [getCtx, getNoiseBuffer]);

  return { playClick, playCarriageReturn };
}
