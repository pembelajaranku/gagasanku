import React, { useState } from 'react';
import { CORRECT_ORDER, ScreenId, SortItem, StageNumber } from '../types/game';
import { fisherYatesShuffle } from '../utils/audio';
import { OwlSpeechRow } from './OwlMascot';

interface Stage3SortProps {
  isCompleted: boolean;
  onGoScreen: (screen: ScreenId) => void;
  onCompleteStage: (stage: StageNumber, xp: number, stars: number, message: string) => void;
  onWrongAnswer: () => void;
  onPlaySound: (kind: 'good' | 'bad' | 'tap') => void;
}

function shuffleNotSolved(): SortItem[] {
  let candidate = fisherYatesShuffle(CORRECT_ORDER);
  let attempts = 0;
  while (candidate.every((item, idx) => item.id === CORRECT_ORDER[idx].id) && attempts < 10) {
    candidate = fisherYatesShuffle(CORRECT_ORDER);
    attempts++;
  }
  return candidate;
}

export function Stage3Sort({
  isCompleted,
  onGoScreen,
  onCompleteStage,
  onWrongAnswer,
  onPlaySound,
}: Stage3SortProps) {
  const [items, setItems] = useState<SortItem[]>(() =>
    isCompleted ? [...CORRECT_ORDER] : shuffleNotSolved()
  );
  const [movedId, setMovedId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'good' | 'warn'>(isCompleted ? 'good' : 'none');

  const handleShuffle = () => {
    onPlaySound('tap');
    setItems(shuffleNotSolved());
    setMovedId(null);
    setFeedback('none');
  };

  const moveItem = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setItems(next);
    setMovedId(moved.id);
    onPlaySound('tap');
  };

  const handleDrop = (targetIndex: number) => {
    if (!draggedId) return;
    const fromIndex = items.findIndex((x) => x.id === draggedId);
    if (fromIndex === -1 || fromIndex === targetIndex) {
      setDraggedId(null);
      setOverId(null);
      return;
    }
    const next = [...items];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(targetIndex, 0, moved);
    setItems(next);
    setMovedId(moved.id);
    setDraggedId(null);
    setOverId(null);
    onPlaySound('tap');
  };

  const handleCheck = () => {
    const isCorrect = items.every((item, idx) => item.id === CORRECT_ORDER[idx].id);
    if (isCorrect) {
      setFeedback('good');
      onPlaySound('good');
      onCompleteStage(3, 50, 2, 'Susunan gagasanmu sudah sangat runtut!');
    } else {
      setFeedback('warn');
      onPlaySound('bad');
      onWrongAnswer();
    }
  };

  const canProceed = isCompleted || feedback === 'good';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-up">
      <div className="bg-white/95 rounded-3xl p-5 sm:p-8 shadow-[0_18px_45px_rgba(139,120,190,0.18)] border border-white">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <div className="text-sm font-extrabold text-[#6D5AA8]">
            🧩 Tahap 3 <span aria-hidden="true">·</span> Misi Menyusun Gagasan
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
          Susun Gagasan Menjadi Runtut!
        </h2>

        <OwlSpeechRow>
          Seret kartu (atau gunakan tombol panah <b>↑ ↓</b>) untuk menyusun isi teks agar mudah dipahami dari pembuka hingga penutup!
        </OwlSpeechRow>

        <div className="bg-[#F7F3FF] border border-[#E6DEF8] rounded-2xl px-4 py-3 text-sm sm:text-[0.95rem] text-[#5D5182] mb-5">
          Bacalah setiap kalimat dengan cermat. Temukan gagasan yang paling umum sebagai pembuka, lanjutkan dengan penjelasan pendukung, lalu akhiri dengan simpulan.
        </div>

        <div className="space-y-3 my-5">
          {items.map((item, idx) => {
            const isDragging = draggedId === item.id;
            const isOver = overId === item.id && draggedId !== item.id;
            const isMoved = movedId === item.id;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDraggedId(item.id)}
                onDragEnd={() => {
                  setDraggedId(null);
                  setOverId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverId(item.id);
                }}
                onDragLeave={() => setOverId((prev) => (prev === item.id ? null : prev))}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(idx);
                }}
                className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border-2 transition-transform duration-150 cursor-grab active:cursor-grabbing ${
                  isDragging
                    ? 'opacity-45 scale-[0.98] border-[#A78BFA] bg-[#FAF7FF]'
                    : isOver
                      ? 'border-[#34D399] bg-[#F0FFF8]'
                      : isMoved
                        ? 'border-[#A78BFA] bg-[#FAF7FF]'
                        : 'border-[#EDE6FF] bg-white shadow-xs'
                }`}
              >
                <span aria-hidden="true" className="text-[#A89CC8] text-lg select-none px-0.5">
                  ⠿
                </span>
                <span className="w-9 h-9 rounded-full bg-[#EDE6FF] text-[#5B4B8A] font-black grid place-items-center shrink-0 tabular-nums">
                  {idx + 1}
                </span>
                <span className="flex-1 font-bold text-[#4B3F6B] leading-snug text-sm sm:text-base">
                  {item.text}
                </span>
                <div className="flex flex-col sm:flex-row gap-1.5 shrink-0">
                  <button
                    type="button"
                    aria-label={`Pindahkan kartu ${idx + 1} ke atas`}
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, -1)}
                    className="w-11 h-11 rounded-xl bg-[#F0EBFF] hover:bg-[#E2D7FE] text-[#5B4B8A] font-black text-base grid place-items-center disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`Pindahkan kartu ${idx + 1} ke bawah`}
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 1)}
                    className="w-11 h-11 rounded-xl bg-[#F0EBFF] hover:bg-[#E2D7FE] text-[#5B4B8A] font-black text-base grid place-items-center disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    ↓
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleShuffle}
            className="min-h-[44px] px-5 py-2 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-base text-[#5B4B8A] transition-colors cursor-pointer"
          >
            🔀 Acak Kartu
          </button>
          <button
            type="button"
            onClick={handleCheck}
            className="min-h-[44px] px-6 py-2 rounded-full font-['Baloo_2'] font-bold text-base bg-gradient-to-r from-[#6EE7B7] to-[#34D399] text-[#0D4E35] shadow-sm hover:-translate-y-0.5 transition-transform cursor-pointer"
          >
            Periksa Susunanku ✓
          </button>
        </div>

        {feedback !== 'none' && (
          <div
            aria-live="polite"
            className={`mt-4 rounded-xl px-4 py-3 font-bold text-sm sm:text-base ${
              feedback === 'good'
                ? 'bg-[#E3FBEC] text-[#166044]'
                : 'bg-[#FFF8DC] text-[#805900]'
            }`}
          >
            {feedback === 'good'
              ? '🎉 Tepat sekali! Kamu berhasil menyusun isi teks secara runtut dari gagasan utama, gagasan penjelas, hingga penutup.'
              : 'Belum tepat. Coba perhatikan kata penghubungnya (seperti "juga" dan "oleh karena itu"), lalu susun dari yang paling umum hingga simpulan.'}
          </div>
        )}

        <div className="mt-5">
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => onGoScreen(4)}
            className="min-h-[46px] px-7 py-2.5 rounded-full font-['Baloo_2'] font-bold text-base text-white bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] shadow-md hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed transition-transform cursor-pointer"
          >
            Lanjut Berbicara 🎤
          </button>
        </div>
      </div>
    </div>
  );
}
