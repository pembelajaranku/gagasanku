import React, { useState } from 'react';
import { ConceptType, ScreenId, StageNumber } from '../types/game';
import { OwlSpeechRow } from './OwlMascot';

interface Stage1ConceptProps {
  isCompleted: boolean;
  onGoScreen: (screen: ScreenId) => void;
  onCompleteStage: (stage: StageNumber, xp: number, stars: number, message: string) => void;
  onWrongAnswer: () => void;
  onPlaySound: (kind: 'good' | 'bad' | 'tap') => void;
}

export function Stage1Concept({
  isCompleted,
  onGoScreen,
  onCompleteStage,
  onWrongAnswer,
  onPlaySound,
}: Stage1ConceptProps) {
  const [openUtama, setOpenUtama] = useState(isCompleted);
  const [openPenjelas, setOpenPenjelas] = useState(isCompleted);
  const [selected, setSelected] = useState<ConceptType | null>(isCompleted ? 'utama' : null);
  const [feedbackState, setFeedbackState] = useState<'none' | 'good' | 'bad'>(isCompleted ? 'good' : 'none');

  const toggleCard = (which: ConceptType) => {
    onPlaySound('tap');
    if (which === 'utama') setOpenUtama((prev) => !prev);
    else setOpenPenjelas((prev) => !prev);
  };

  const handlePractice = (answer: ConceptType) => {
    setSelected(answer);
    if (answer === 'utama') {
      setFeedbackState('good');
      setOpenUtama(true);
      setOpenPenjelas(true);
      onPlaySound('good');
      onCompleteStage(1, 30, 1, 'Hebat, kamu sudah mengenali gagasan utama!');
    } else {
      setFeedbackState('bad');
      onPlaySound('bad');
      onWrongAnswer();
    }
  };

  const canProceed = isCompleted || feedbackState === 'good';
  const openedCount = (openUtama ? 1 : 0) + (openPenjelas ? 1 : 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-up">
      <div className="bg-white/95 rounded-3xl p-5 sm:p-8 shadow-[0_18px_45px_rgba(139,120,190,0.18)] border border-white">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <div className="text-sm font-extrabold text-[#6D5AA8]">
            💡 Tahap 1 <span aria-hidden="true">·</span> Kenalan dengan Gagasan
          </div>
          <button
            type="button"
            onClick={() => onGoScreen(0)}
            className="min-h-[40px] px-4 py-1.5 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-sm text-[#5B4B8A] transition-colors cursor-pointer"
          >
            🗺️ Peta
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4B3F6B] mb-4">
          Yuk, Kenali Dua Gagasan!
        </h2>

        <OwlSpeechRow>
          Sebelum bermain, ketuk kedua kartu di bawah ini untuk membuka rahasia gagasan utama dan gagasan penjelas!{' '}
          <span className="font-bold text-[#6D5AA8] tabular-nums">({openedCount}/2 terbuka)</span>
        </OwlSpeechRow>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
          <div
            role="button"
            tabIndex={0}
            aria-expanded={openUtama}
            onClick={() => toggleCard('utama')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard('utama');
              }
            }}
            className={`min-h-[148px] rounded-2xl p-5 border-2 transition-transform duration-150 cursor-pointer hover:-translate-y-0.5 ${
              openUtama
                ? 'bg-gradient-to-br from-[#EAF5FF] to-[#DCEBFF] border-[#60A5FA]'
                : 'bg-gradient-to-br from-[#F2F8FF] to-[#E6F1FF] border-[#BFDBFE]'
            }`}
          >
            <h3 className="text-lg font-extrabold text-[#3B4B75] flex items-center justify-between mb-2">
              <span>💡 Gagasan Utama</span>
              <span aria-hidden="true">{openUtama ? '✅' : '👆'}</span>
            </h3>
            {!openUtama ? (
              <p className="text-sm font-semibold text-[#5D5182]">Ketuk kartu untuk mengenalnya.</p>
            ) : (
              <div className="bg-white/85 rounded-xl p-3.5 text-sm sm:text-[0.95rem] leading-relaxed text-[#4B3F6B] animate-fade-up">
                <b>Gagasan utama</b> adalah inti atau pokok pembahasan. Gagasan ini memberi tahu kita hal paling penting yang sedang dibicarakan.
              </div>
            )}
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-expanded={openPenjelas}
            onClick={() => toggleCard('penjelas')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCard('penjelas');
              }
            }}
            className={`min-h-[148px] rounded-2xl p-5 border-2 transition-transform duration-150 cursor-pointer hover:-translate-y-0.5 ${
              openPenjelas
                ? 'bg-gradient-to-br from-[#FFFCEB] to-[#FFF2C6] border-[#FBBF24]'
                : 'bg-gradient-to-br from-[#FFFDF2] to-[#FFF6D6] border-[#FDE68A]'
            }`}
          >
            <h3 className="text-lg font-extrabold text-[#6B5016] flex items-center justify-between mb-2">
              <span>🌟 Gagasan Penjelas</span>
              <span aria-hidden="true">{openPenjelas ? '✅' : '👆'}</span>
            </h3>
            {!openPenjelas ? (
              <p className="text-sm font-semibold text-[#6F6391]">Ketuk kartu untuk mengenalnya.</p>
            ) : (
              <div className="bg-white/85 rounded-xl p-3.5 text-sm sm:text-[0.95rem] leading-relaxed text-[#4B3F6B] animate-fade-up">
                <b>Gagasan penjelas</b> adalah informasi yang menerangkan gagasan utama. Isinya dapat berupa alasan, contoh, fakta, atau rincian.
              </div>
            )}
          </div>
        </div>

        {/* Mini Detective Practice */}
        <div className="bg-gradient-to-br from-[#FFFDF8] to-[#F6F2FF] border border-[#E6DEF8] rounded-2xl p-5 my-5">
          <h3 className="text-xl font-extrabold text-[#4B3F6B] mb-2">🎮 Coba Jadi Detektif Gagasan!</h3>
          <p className="text-[#5D5182] mb-3">
            Kalimat ini berbicara tentang manfaat membawa botol minum sendiri. Menurutmu, ini termasuk gagasan yang mana?
          </p>
          <div className="bg-white border border-[#E6DEF8] rounded-xl px-4 py-3.5 text-[0.98rem] font-bold text-[#4B3F6B] mb-4">
            “Membawa botol minum sendiri ke sekolah memberikan banyak manfaat.”
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handlePractice('utama')}
              className={`min-h-[48px] rounded-2xl px-4 py-3 border-2 font-bold text-base transition-transform cursor-pointer ${
                selected === 'utama' && feedbackState === 'good'
                  ? 'border-[#34D399] bg-[#E3FBEC] text-[#11533B]'
                  : 'border-[#E6DEF8] bg-white text-[#4B3F6B] hover:border-[#A78BFA] hover:-translate-y-0.5'
              }`}
            >
              💡 Gagasan Utama
            </button>
            <button
              type="button"
              onClick={() => handlePractice('penjelas')}
              className={`min-h-[48px] rounded-2xl px-4 py-3 border-2 font-bold text-base transition-transform cursor-pointer ${
                selected === 'penjelas' && feedbackState === 'bad'
                  ? 'border-[#FB7185] bg-[#FFF0F3] text-[#9F3450] animate-shake'
                  : 'border-[#E6DEF8] bg-white text-[#4B3F6B] hover:border-[#A78BFA] hover:-translate-y-0.5'
              }`}
            >
              🌟 Gagasan Penjelas
            </button>
          </div>

          {feedbackState !== 'none' && (
            <div
              aria-live="polite"
              className={`mt-4 rounded-xl px-4 py-3 font-bold text-sm sm:text-base ${
                feedbackState === 'good'
                  ? 'bg-[#E3FBEC] text-[#166044]'
                  : 'bg-[#FFF0F3] text-[#9F3450]'
              }`}
            >
              {feedbackState === 'good'
                ? '🎉 Benar! Kalimat itu menyampaikan inti pembahasan, yaitu manfaat membawa botol minum sendiri.'
                : 'Belum tepat, coba lagi! Kalimat ini menyampaikan inti pembahasan, bukan alasan atau rincian pendukung.'}
            </div>
          )}
        </div>

        <div className="bg-[#F7F3FF] border border-[#E6DEF8] rounded-2xl px-4 py-3 text-sm sm:text-[0.95rem] text-[#5D5182] mb-5">
          Ingat: <b>gagasan utama</b> = inti pembahasan. <b>Gagasan penjelas</b> = informasi yang mendukung atau menerangkan inti.
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => onGoScreen(2)}
            className="min-h-[46px] px-7 py-2.5 rounded-full font-['Baloo_2'] font-bold text-base text-white bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] shadow-md hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-transform cursor-pointer"
          >
            Aku Siap Berlatih! ➜
          </button>
        </div>
      </div>
    </div>
  );
}
