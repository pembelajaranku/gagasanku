import React, { useEffect } from 'react';
import { STAGES, ScreenId, StageNumber } from '../types/game';
import { OwlHeroSvg, TitleLockupSvg } from './OwlMascot';

interface TitleMapScreenProps {
  done: Set<StageNumber>;
  onStartAdventure: () => void;
  onSelectStage: (stage: ScreenId) => void;
}

export function TitleMapScreen({ done, onStartAdventure, onSelectStage }: TitleMapScreenProps) {
  const completedCount = done.size;
  const startLabel =
    completedCount === 4
      ? 'Lihat Hasil Petualangan 🏆'
      : completedCount > 0
        ? `Lanjut ke Tahap ${completedCount + 1} 🚀`
        : 'Mulai Petualangan 🚀';

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStartAdventure();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStartAdventure]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-up">
      {/* Hero / Title Showcase with calm negative space & bespoke SVG backdrop */}
      <section className="relative overflow-hidden bg-white/95 rounded-3xl p-6 sm:p-9 shadow-[0_18px_45px_rgba(139,120,190,0.18)] border border-white">
        {/* Atmospheric storybook meadow silhouette at bottom */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 120"
          preserveAspectRatio="none"
          className="pointer-events-none absolute bottom-0 inset-x-0 w-full h-20 opacity-45"
        >
          <path d="M0 95 Q180 40 390 82 T800 68 L800 120 L0 120 Z" fill="#D8F5E5" />
          <path d="M0 105 Q260 68 540 94 T800 84 L800 120 L0 120 Z" fill="#EDE6FF" />
        </svg>

        <div className="relative z-10 text-center">
          <TitleLockupSvg />
          <p className="text-[#6F6391] font-bold text-base sm:text-lg mt-1 mb-6 max-w-xl mx-auto">
            Petualangan mengenali, menyusun, dan menyampaikan gagasan secara runtut
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 max-w-2xl mx-auto text-left mb-7">
            <OwlHeroSvg className="w-24 h-24 sm:w-28 sm:h-28" />
            <div className="flex-1 bg-[#F9F6FF] border border-[#E6DEF8] rounded-2xl p-4 sm:p-5 text-[#4B3F6B] leading-relaxed shadow-xs">
              Halo, teman-teman! 👋 Aku <b>Owi</b>. Yuk, kita berpetualang membaca teks, mengenali gagasan utama dan penjelas, menyusunnya, lalu menceritakannya kembali!
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={onStartAdventure}
              className="min-h-[48px] px-8 py-3 rounded-full font-['Baloo_2'] font-bold text-lg text-white bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] shadow-[0_8px_22px_rgba(139,92,246,0.36)] hover:-translate-y-0.5 active:scale-95 transition-transform cursor-pointer"
            >
              {startLabel}
            </button>
            <p className="text-xs font-semibold text-[#6F6391]">
              Klik tahap atau tekan Enter/Space untuk langsung bermain · Klik/Seret kartu saat menyusun
            </p>
          </div>
        </div>
      </section>

      {/* Peta Petualangan */}
      <section className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-[0_14px_36px_rgba(139,120,190,0.14)] border border-white">
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#4B3F6B]">🗺️ Peta Petualangan</h2>
          <p className="text-sm font-semibold text-[#6F6391] mt-1">
            Selesaikan setiap tahap untuk membuka tahap berikutnya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-3xl mx-auto">
          {STAGES.map((stage, idx) => {
            const isDone = done.has(stage.id);
            const prevStage = idx > 0 ? STAGES[idx - 1].id : null;
            const isLocked = prevStage !== null && !done.has(prevStage);

            return (
              <button
                key={stage.id}
                type="button"
                disabled={isLocked}
                onClick={() => onSelectStage(stage.id)}
                className={`min-h-[76px] flex items-center gap-3.5 text-left rounded-2xl p-4 border-2 transition-transform duration-150 ${
                  isLocked
                    ? 'bg-[#F8F6FC] border-[#EDE6FF] opacity-60 grayscale-[0.45] cursor-not-allowed'
                    : isDone
                      ? 'bg-gradient-to-br from-[#F0FFF8] to-white border-[#86EFAC] hover:-translate-y-0.5 shadow-sm cursor-pointer'
                      : 'bg-gradient-to-br from-white to-[#F8F4FF] border-[#E6DEF8] hover:-translate-y-0.5 hover:border-[#A78BFA] shadow-sm cursor-pointer'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EDE6FF] to-[#DFF3FF] grid place-items-center text-2xl shrink-0"
                >
                  {stage.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-['Baloo_2'] font-extrabold text-base text-[#5B4B8A] truncate">
                    Tahap {stage.id}: {stage.title}
                  </span>
                  <span className="block text-xs sm:text-sm text-[#6F6391] leading-snug">
                    {stage.desc}
                  </span>
                </span>
                <span aria-hidden="true" className="text-lg shrink-0">
                  {isDone ? '✅' : isLocked ? '🔒' : '➡️'}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
