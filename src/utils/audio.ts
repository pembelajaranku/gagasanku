export type SoundKind = 'good' | 'bad' | 'win' | 'tap';

export function playSound(kind: SoundKind, muted: boolean): void {
  if (muted) return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes =
      kind === 'good'
        ? [660, 880, 1046]
        : kind === 'bad'
          ? [220, 165]
          : kind === 'tap'
            ? [540, 680]
            : [523, 659, 784, 1046];

    notes.forEach((hz, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === 'bad' ? 'triangle' : 'sine';
      osc.frequency.value = hz;
      gain.gain.setValueAtTime(0.0001, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(kind === 'tap' ? 0.06 : 0.11, now + i * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.2);
    });

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 950);
  } catch {
    // Ignore audio context restrictions
  }
}

export function fisherYatesShuffle<T>(source: readonly T[]): T[] {
  const arr = [...source];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
