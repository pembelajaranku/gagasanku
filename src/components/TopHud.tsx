import React from 'react';
import { Volume2, VolumeX, Map } from 'lucide-react';
import { ScreenId } from '../types/game';

interface TopHudProps {
  xp: number;
  stars: number;
  hearts: number;
  completedCount: number;
  muted: boolean;
  activeScreen: ScreenId;
  onToggleMute: () => void;
  onGoHome: () => void;
}

export function TopHud({
  xp,
  stars,
  hearts,
  completedCount,
  muted,
  activeScreen,
  onToggleMute,
  onGoHome,
}: TopHudProps) {
  const progressPct = Math.round((completedCount / 4) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E6DEF8]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onGoHome}
          title="Kembali ke Peta Petualangan"
          className="flex items-center gap-2 font-['Baloo_2'] font-extrabold text-base sm:text-lg text-[#5B4B8A] hover:text-[#7C3AED] transition-colors whitespace-nowrap shrink-0 min-h-[40px] px-1 cursor-pointer"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            🦉
          </span>
          <span>Susun Gagasanku!</span>
        </button>

        <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-xs mx-4">
          <div
            className="flex-1 h-2.5 bg-[#EFE9FB] rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Progres tahap petualangan"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#38BDF8] to-[#34D399] transition-[width] duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-[#6F6391] tabular-nums whitespace-nowrap shrink-0">
            {completedCount}/4 tahap
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-xs sm:text-sm font-extrabold text-[#4B3F6B] tabular-nums">
            <span title="Poin Pengalaman" className="whitespace-nowrap">
              ⚡ {xp} <span className="hidden sm:inline text-[#6F6391] font-bold">XP</span>
            </span>
            <span className="text-[#D8CEF2]" aria-hidden="true">
              ·
            </span>
            <span title="Bintang" className="whitespace-nowrap">
              ⭐ {stars}
            </span>
            <span className="text-[#D8CEF2]" aria-hidden="true">
              ·
            </span>
            <span title="Nyawa Semangat" className="whitespace-nowrap">
              💗 {hearts}
            </span>
          </div>

          {activeScreen !== 0 && (
            <button
              type="button"
              onClick={onGoHome}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xl border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] text-xs font-extrabold text-[#5B4B8A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Kembali ke Peta"
            >
              <Map className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Peta</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Aktifkan suara' : 'Bisukan suara'}
            title={muted ? 'Aktifkan Suara' : 'Bisukan Suara'}
            className="w-10 h-10 rounded-xl border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] grid place-items-center text-[#5B4B8A] transition-colors shrink-0 cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
