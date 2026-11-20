import React from 'react';
import { ScreenId } from '../types/game';

interface VictoryScreenProps {
  xp: number;
  stars: number;
  onRestart: () => void;
  onGoScreen: (screen: ScreenId) => void;
}

export function VictoryScreen({ xp, stars, onRestart, onGoScreen }: VictoryScreenProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-up">
      <div className="bg-white/95 rounded-3xl p-6 sm:p-10 shadow-[0_18px_45px_rgba(139,120,190,0.2)] border border-white text-center">
        <div className="text-6xl sm:text-7xl mb-3 animate-bob" aria-hidden="true">
          🏆
        </div>
        <div className="text-sm font-extrabold text-[#6D5AA8] mb-1">Petualangan Selesai</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#7C3AED] via-[#0284C7] to-[#059669] bg-clip-text text-transparent mb-2">
          Hebat Sekali!
        </h1>
        <p className="text-[#6F6391] font-bold mb-6">
          Kamu telah menyelesaikan seluruh petualangan Susun Gagasanku!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-6">
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[#EAF5FF] to-[#DCEBFF] border-2 border-[#BFDBFE]">
            <div className="text-2xl mb-1" aria-hidden="true">
              ⚡
            </div>
            <div className="font-['Baloo_2'] text-4xl font-extrabold text-[#3B4B75] tabular-nums">
              {xp}
            </div>
            <div className="text-sm font-bold text-[#5D5182]">XP diperoleh</div>
          </div>
          <div className="rounded-2xl p-5 bg-gradient-to-br from-[#FFFCEB] to-[#FFF2C6] border-2 border-[#FDE68A]">
            <div className="text-2xl mb-1" aria-hidden="true">
              ⭐
            </div>
            <div className="font-['Baloo_2'] text-4xl font-extrabold text-[#6B5016] tabular-nums">
              {stars}
            </div>
            <div className="text-sm font-bold text-[#5D5182]">Bintang diperoleh</div>
          </div>
        </div>

        <p className="text-[#4B3F6B] leading-relaxed max-w-xl mx-auto mb-7">
          Ingat urutannya: <b>gagasan utama → gagasan penjelas → penutup</b>. Terus berlatih agar semakin terampil menyampaikan gagasan secara jelas dan runtut!
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="min-h-[46px] px-7 py-2.5 rounded-full font-['Baloo_2'] font-bold text-base text-white bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] shadow-md hover:-translate-y-0.5 transition-transform cursor-pointer"
          >
            🔄 Main Lagi
          </button>
          <button
            type="button"
            onClick={() => onGoScreen(0)}
            className="min-h-[46px] px-6 py-2.5 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-base text-[#5B4B8A] transition-colors cursor-pointer"
          >
            Kembali ke Peta
          </button>
        </div>
      </div>
    </div>
  );
}
