import React, { useEffect, useState } from 'react';
import { ConceptType, QUIZ_BANK, QuizQuestion, READING_PARAGRAPHS, ScreenId, StageNumber } from '../types/game';
import { fisherYatesShuffle } from '../utils/audio';
import { OwlSpeechRow } from './OwlMascot';

interface Stage2QuizProps {
  isCompleted: boolean;
  onGoScreen: (screen: ScreenId) => void;
  onCompleteStage: (stage: StageNumber, xp: number, stars: number, message: string) => void;
  onWrongAnswer: () => void;
  onShowNotice: (icon: string, title: string, message: string) => void;
  onPlaySound: (kind: 'good' | 'bad') => void;
}

export function Stage2Quiz({
  isCompleted,
  onGoScreen,
  onCompleteStage,
  onWrongAnswer,
  onShowNotice,
  onPlaySound,
}: Stage2QuizProps) {
  const [textVisible, setTextVisible] = useState(true);
  const [speakingText, setSpeakingText] = useState(false);

  const [quizDeck, setQuizDeck] = useState<QuizQuestion[]>(() => fisherYatesShuffle(QUIZ_BANK));
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizLocked, setQuizLocked] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<ConceptType | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingText(false);
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      onShowNotice('ℹ️', 'Tidak Didukung', 'Browser kamu belum mendukung fitur pembacaan teks otomatis.');
      return;
    }
    if (speakingText) {
      stopSpeech();
      return;
    }
    window.speechSynthesis.cancel();
    const fullBody = READING_PARAGRAPHS.join(' ');
    const utterance = new SpeechSynthesisUtterance(`Kebiasaan Membawa Botol Minum. ${fullBody}`);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingText(false);
    utterance.onerror = () => setSpeakingText(false);
    setSpeakingText(true);
    window.speechSynthesis.speak(utterance);
  };

  const restartQuiz = () => {
    setQuizDeck(fisherYatesShuffle(QUIZ_BANK));
    setQuizIndex(0);
    setQuizScore(0);
    setQuizLocked(false);
    setSelectedChoice(null);
    setQuizFinished(false);
  };

  const currentQuestion = quizDeck[quizIndex];

  const handleAnswer = (answer: ConceptType) => {
    if (quizLocked || !currentQuestion) return;
    setQuizLocked(true);
    setSelectedChoice(answer);
    const isOk = answer === currentQuestion.type;
    if (isOk) {
      setQuizScore((s) => s + 1);
      onPlaySound('good');
    } else {
      onPlaySound('bad');
      onWrongAnswer();
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < quizDeck.length - 1) {
      setQuizIndex((i) => i + 1);
      setQuizLocked(false);
      setSelectedChoice(null);
      return;
    }
    setQuizFinished(true);
    const rewardXP = 30 + quizScore * 5;
    const rewardStars = quizScore >= 2 ? 2 : 1;
    onCompleteStage(2, rewardXP, rewardStars, `Kamu menuntaskan kuis dengan skor ${quizScore}/${quizDeck.length}!`);
  };

  const canProceed = isCompleted || quizFinished;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-up">
      <div className="bg-white/95 rounded-3xl p-5 sm:p-8 shadow-[0_18px_45px_rgba(139,120,190,0.18)] border border-white">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <div className="text-sm font-extrabold text-[#6D5AA8]">
            🔍 Tahap 2 <span aria-hidden="true">·</span> Berburu Gagasan dalam Teks
          </div>
          <button
            type="button"
            onClick={() => {
              stopSpeech();
              onGoScreen(0);
            }}
            className="min-h-[40px] px-4 py-1.5 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-sm text-[#5B4B8A] transition-colors cursor-pointer"
          >
            🗺️ Peta
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4B3F6B] mb-4">
          Tentukan Jenis Gagasannya!
        </h2>

        <OwlSpeechRow>
          Baca teks lengkap terlebih dahulu, lalu tentukan apakah tiap paragraf pada kuis berisi gagasan utama atau gagasan penjelas!
        </OwlSpeechRow>

        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <button
            type="button"
            onClick={() => setTextVisible((v) => !v)}
            className="min-h-[42px] px-4 py-2 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-sm text-[#5B4B8A] transition-colors cursor-pointer"
          >
            {textVisible ? '📖 Sembunyikan Teks Lengkap' : '📖 Tampilkan Teks Lengkap'}
          </button>
          <button
            type="button"
            onClick={handleToggleSpeak}
            className="min-h-[42px] px-4 py-2 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-sm text-[#5B4B8A] transition-colors cursor-pointer"
          >
            {speakingText ? '⏹ Hentikan Suara' : '🔊 Bacakan Teks'}
          </button>
        </div>

        {textVisible && (
          <article className="bg-gradient-to-br from-[#FFFDF8] to-[#FFF8EE] border-2 border-dashed border-[#FDE2B8] rounded-2xl p-5 sm:p-6 mb-5 text-[#4A3F63] leading-relaxed">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#7C3AED] text-center mb-3">
              Kebiasaan Membawa Botol Minum
            </h3>
            <div className="space-y-3 text-[0.97rem]">
              {READING_PARAGRAPHS.map((para, idx) => (
                <p key={idx} className="indent-5">
                  {para}
                </p>
              ))}
            </div>
          </article>
        )}

        {/* Quiz Card */}
        <div className="bg-gradient-to-br from-[#FFFDF8] to-[#F5F2FF] border border-[#E6DEF8] rounded-2xl p-5 my-5">
          {!quizFinished && currentQuestion ? (
            <>
              <div className="text-sm font-extrabold text-[#7C3AED] mb-1 tabular-nums">
                Soal {quizIndex + 1} dari {quizDeck.length}
              </div>
              <h3 className="text-xl font-extrabold text-[#4B3F6B] mb-3">Baca paragraf berikut!</h3>
              <div className="bg-white border border-[#E6DEF8] rounded-xl p-4 text-[0.98rem] leading-relaxed text-[#4B3F6B] mb-4">
                {currentQuestion.text}
              </div>
              <p className="font-extrabold text-[#4B3F6B] mb-3">Paragraf ini berisi...</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['utama', 'penjelas'] as const).map((optionType) => {
                  const isCorrectOption = currentQuestion.type === optionType;
                  const isSelectedWrong = quizLocked && selectedChoice === optionType && !isCorrectOption;
                  const isHighlightedCorrect = quizLocked && isCorrectOption;

                  return (
                    <button
                      key={optionType}
                      type="button"
                      disabled={quizLocked}
                      onClick={() => handleAnswer(optionType)}
                      className={`min-h-[48px] rounded-2xl px-4 py-3 border-2 font-bold text-base transition-transform ${
                        isHighlightedCorrect
                          ? 'border-[#34D399] bg-[#E3FBEC] text-[#11533B]'
                          : isSelectedWrong
                            ? 'border-[#FB7185] bg-[#FFF0F3] text-[#9F3450] animate-shake'
                            : 'border-[#E6DEF8] bg-white text-[#4B3F6B] hover:border-[#A78BFA] hover:-translate-y-0.5 cursor-pointer'
                      } disabled:cursor-default`}
                    >
                      {optionType === 'utama' ? '💡 Gagasan Utama' : '🌟 Gagasan Penjelas'}
                    </button>
                  );
                })}
              </div>

              {quizLocked && (
                <div
                  aria-live="polite"
                  className={`mt-4 rounded-xl px-4 py-3 font-bold text-sm sm:text-base ${
                    selectedChoice === currentQuestion.type
                      ? 'bg-[#E3FBEC] text-[#166044]'
                      : 'bg-[#FFF0F3] text-[#9F3450]'
                  }`}
                >
                  {selectedChoice === currentQuestion.type
                    ? `🎉 Tepat sekali! ${currentQuestion.why}`
                    : `Belum tepat. Jawaban yang benar adalah ${
                        currentQuestion.type === 'utama' ? 'Gagasan Utama' : 'Gagasan Penjelas'
                      }. ${currentQuestion.why}`}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!quizLocked}
                  onClick={handleNextQuestion}
                  className="min-h-[44px] px-6 py-2 rounded-full font-['Baloo_2'] font-bold text-base text-white bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] shadow-md hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed transition-transform cursor-pointer"
                >
                  {quizIndex === quizDeck.length - 1 ? 'Lihat Hasil ➜' : 'Soal Berikutnya ➜'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-extrabold text-[#7C3AED] mb-1 tabular-nums">
                Latihan selesai · Skor {quizScore}/{quizDeck.length}
              </div>
              <h3 className="text-xl font-extrabold text-[#4B3F6B] mb-2">
                Hebat! Saatnya Mengingat Triknya
              </h3>
              <p className="text-[#5D5182] mb-3">
                Kamu sudah menyelesaikan semua soal berburu gagasan.
              </p>
              <div
                aria-live="polite"
                className={`rounded-xl px-4 py-3 font-bold text-sm sm:text-base ${
                  quizScore >= 2 ? 'bg-[#E3FBEC] text-[#166044]' : 'bg-[#FFF0F3] text-[#9F3450]'
                }`}
              >
                Skormu {quizScore} dari {quizDeck.length}.{' '}
                {quizScore === 3
                  ? 'Sempurna!'
                  : quizScore >= 2
                    ? 'Bagus, terus berlatih!'
                    : 'Pelajari kembali trik di bawah ini, lalu kamu boleh mengulangi kuis.'}
              </div>

              {quizScore < quizDeck.length && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={restartQuiz}
                    className="min-h-[44px] px-5 py-2 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-sm text-[#5B4B8A] cursor-pointer"
                  >
                    🔄 Ulangi Kuis
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {(quizFinished || isCompleted) && (
          <div className="bg-[#F7F3FF] border border-[#E6DEF8] rounded-2xl p-4 sm:p-5 text-sm sm:text-[0.95rem] text-[#5D5182] space-y-1.5 mb-5 animate-fade-up">
            <h3 className="text-lg font-extrabold text-[#4B3F6B]">🦉 Trik Mudah Membedakannya</h3>
            <p>
              <b>Gagasan utama:</b> tanyakan, “Apa inti yang sedang dibicarakan?”
            </p>
            <p>
              <b>Gagasan penjelas:</b> tanyakan, “Informasi apa yang menerangkan atau mendukung inti tersebut?”
            </p>
            <p>
              Tips: gagasan utama biasanya bersifat umum, sedangkan gagasan penjelas berisi alasan, contoh, atau rincian yang lebih khusus.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => {
              stopSpeech();
              onGoScreen(3);
            }}
            className="min-h-[46px] px-7 py-2.5 rounded-full font-['Baloo_2'] font-bold text-base text-white bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] shadow-md hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed transition-transform cursor-pointer"
          >
            Lanjut Menyusun Gagasan ➜
          </button>
        </div>
      </div>
    </div>
  );
}
