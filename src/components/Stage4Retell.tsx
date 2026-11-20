import React, { useEffect, useRef, useState } from 'react';
import { ScreenId, StageNumber } from '../types/game';
import { OwlSpeechRow } from './OwlMascot';

interface Stage4RetellProps {
  onGoScreen: (screen: ScreenId) => void;
  onCompleteStage: (stage: StageNumber, xp: number, stars: number, message: string) => void;
  onFinishAdventure: () => void;
  onPlaySound: (kind: 'good' | 'bad') => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionInstanceLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface IdeaEvaluation {
  kind: 'good' | 'warn';
  shortWarning?: boolean;
  checks?: { label: string; matched: boolean }[];
  matchedCount?: number;
}

export function Stage4Retell({
  onGoScreen,
  onCompleteStage,
  onFinishAdventure,
  onPlaySound,
}: Stage4RetellProps) {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState(
    'Siap mendengarkan. Kamu juga bisa mengetik langsung di bawah.'
  );
  const [evaluation, setEvaluation] = useState<IdeaEvaluation | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstanceLike | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore stop errors on unmount
        }
      }
    };
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore stop errors
      }
    }
    setListening(false);
  };

  const toggleSpeech = () => {
    const SR =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstanceLike }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstanceLike }).webkitSpeechRecognition;

    if (!SR) {
      setStatus(
        'Browser belum mendukung rekam suara otomatis. Silakan ketik ceritamu langsung di kotak bawah.'
      );
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SR();
    recognition.lang = 'id-ID';
    recognition.continuous = true;
    recognition.interimResults = true;
    const baseText = transcript.trim() ? `${transcript.trim()} ` : '';

    recognition.onstart = () => {
      setListening(true);
      setStatus('Sedang mendengarkan... Silakan berbicara dengan jelas.');
    };

    recognition.onresult = (e) => {
      let finalPart = '';
      let interimPart = '';
      for (let i = 0; i < e.results.length; i++) {
        const piece = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalPart += `${piece} `;
        else interimPart += piece;
      }
      setTranscript(`${baseText}${finalPart}${interimPart}`.trim());
    };

    recognition.onerror = (e) => {
      setStatus(`Kendala mikrofon (${e.error}). Kamu tetap bisa mengetik ceritamu di bawah.`);
    };

    recognition.onend = () => {
      setListening(false);
      setStatus((prev) =>
        prev.includes('Kendala mikrofon')
          ? prev
          : 'Rekaman selesai. Periksa atau sunting teks di bawah, lalu tekan "Periksa Ceritaku".'
      );
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleClear = () => {
    if (listening) stopListening();
    setTranscript('');
    setEvaluation(null);
    setStatus('Siap mendengarkan. Kamu juga bisa mengetik langsung di bawah.');
  };

  const handleEvaluate = () => {
    const clean = transcript.trim();
    if (clean.length < 12) {
      setEvaluation({ kind: 'warn', shortWarning: true });
      onPlaySound('bad');
      return;
    }

    const lower = clean.toLowerCase();
    const checks = [
      { label: 'Topik: botol minum', matched: /botol/.test(lower) },
      {
        label: 'Manfaat / penghematan',
        matched: /manfaat|berguna|mengurangi|menghemat|hemat|sehat|air/.test(lower),
      },
      {
        label: 'Sampah plastik / lingkungan',
        matched: /plastik|lingkungan|sampah|bersih/.test(lower),
      },
      {
        label: 'Simpulan / ajakan',
        matched: /oleh karena itu|jadi|sebaiknya|perlu|mari|ayo|kesimpulan|setiap hari/.test(lower),
      },
    ];
    const matchedCount = checks.filter((c) => c.matched).length;
    setEvaluation({
      kind: matchedCount >= 3 ? 'good' : 'warn',
      checks,
      matchedCount,
    });

    if (matchedCount >= 2) {
      onPlaySound('good');
      onCompleteStage(
        4,
        40,
        2,
        'Bagus sekali! Kamu sudah berani menyampaikan gagasanmu secara runtut.'
      );
    } else {
      onPlaySound('bad');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-up">
      <div className="bg-white/95 rounded-3xl p-5 sm:p-8 shadow-[0_18px_45px_rgba(139,120,190,0.18)] border border-white">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <div className="text-sm font-extrabold text-[#6D5AA8]">
            🎤 Tahap 4 <span aria-hidden="true">·</span> Menyampaikan Gagasan
          </div>
          <button
            type="button"
            onClick={() => {
              if (listening) stopListening();
              onGoScreen(0);
            }}
            className="min-h-[40px] px-4 py-1.5 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-sm text-[#5B4B8A] transition-colors cursor-pointer"
          >
            🗺️ Peta
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4B3F6B] mb-4">
          Ceritakan Kembali dengan Suaramu!
        </h2>

        <OwlSpeechRow>
          Sampaikan kembali isi teks menggunakan bahasamu sendiri secara runtut! Kamu bisa merekam suara atau mengetik jika mikrofon tidak tersedia.
        </OwlSpeechRow>

        <div className="bg-[#F7F3FF] border border-[#E6DEF8] rounded-2xl px-4 py-3.5 text-sm sm:text-[0.95rem] text-[#5D5182] mb-5">
          <div className="font-extrabold text-[#4B3F6B] mb-1">Panduan bercerita:</div>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Apa inti pembahasan teks?</li>
            <li>Apa saja manfaat membawa botol minum sendiri?</li>
            <li>Mengapa kebiasaan tersebut perlu dilakukan setiap hari?</li>
          </ol>
        </div>

        <div className="bg-gradient-to-br from-[#FFF7FB] to-[#F5F3FF] border-2 border-dashed border-[#FFC9DE] rounded-2xl p-5 sm:p-6 text-center my-5">
          <div className="text-4xl mb-1" aria-hidden="true">
            🎙️
          </div>
          <h3 className="text-xl font-extrabold text-[#4B3F6B] mb-1">
            Rekam atau Tulis Penjelasanmu
          </h3>
          <p className="text-sm text-[#6F6391] mb-4">
            Tekan tombol mikrofon lalu berbicaralah dengan jelas, atau tulis langsung ceritamu di kotak bawah.
          </p>

          <button
            type="button"
            onClick={toggleSpeech}
            className={`min-h-[48px] px-7 py-2.5 rounded-full font-['Baloo_2'] font-bold text-base transition-transform cursor-pointer ${
              listening
                ? 'bg-[#FB7185] text-white animate-mic-pulse'
                : 'bg-gradient-to-r from-[#FFB8D2] to-[#FF8FB8] text-[#7D254B] shadow-md hover:-translate-y-0.5'
            }`}
          >
            {listening ? '⏹ Berhenti Berbicara' : '🎤 Mulai Berbicara'}
          </button>

          <div className="text-xs sm:text-sm font-bold text-[#6F6391] mt-3 min-h-[20px]">
            {status}
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Hasil pengenalan suaramu akan muncul di sini... (atau ketik ceritamu langsung di sini)"
            aria-label="Teks cerita kembali"
            className="w-full min-h-[115px] mt-3 bg-white border-2 border-[#E6DEF8] focus:border-[#A78BFA] rounded-2xl p-4 text-[0.96rem] font-semibold text-[#4B3F6B] leading-relaxed outline-none resize-y"
          />

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleClear}
              className="min-h-[44px] px-5 py-2 rounded-full border border-[#E6DEF8] bg-white hover:bg-[#F7F3FF] font-['Baloo_2'] font-bold text-base text-[#5B4B8A] transition-colors cursor-pointer"
            >
              Hapus Teks
            </button>
            <button
              type="button"
              onClick={handleEvaluate}
              className="min-h-[44px] px-6 py-2 rounded-full font-['Baloo_2'] font-bold text-base text-white bg-gradient-to-r from-[#FFB88C] to-[#FF9A76] shadow-md hover:-translate-y-0.5 transition-transform cursor-pointer"
            >
              Periksa Ceritaku ✨
            </button>
          </div>

          {evaluation && (
            <div
              aria-live="polite"
              className={`mt-4 rounded-xl px-4 py-3.5 text-left text-sm sm:text-base ${
                evaluation.kind === 'good'
                  ? 'bg-[#E3FBEC] text-[#166044]'
                  : 'bg-[#FFF8DC] text-[#805900]'
              }`}
            >
              {evaluation.shortWarning ? (
                <p className="font-bold">
                  Ceritamu masih terlalu singkat. Coba ucapkan atau tuliskan minimal 2–3 kalimat lengkap tentang kebiasaan membawa botol minum sendiri.
                </p>
              ) : (
                <>
                  <p className="font-extrabold mb-1.5 tabular-nums">
                    Unsur gagasan yang terdeteksi: {evaluation.matchedCount}/4
                  </p>
                  <ul className="space-y-1 font-semibold">
                    {evaluation.checks?.map((c) => (
                      <li key={c.label}>
                        {c.matched ? '✅ ' : '⬜ '}
                        {c.label}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs opacity-85 mt-2.5">
                    Catatan: ini adalah pemeriksaan kata kunci sederhana untuk membantumu memastikan seluruh gagasan tersampaikan.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#F7F3FF] border border-[#E6DEF8] rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#5D5182] mb-5">
          Catatan: fitur pengenalan suara membutuhkan izin mikrofon dan browser yang mendukung <i>Speech Recognition</i> (seperti Google Chrome). Jika tidak tersedia, kamu tetap dapat mengetik penjelasanmu pada kotak di atas.
        </div>

        <button
          type="button"
          onClick={() => {
            if (listening) stopListening();
            onFinishAdventure();
          }}
          className="min-h-[46px] px-7 py-2.5 rounded-full font-['Baloo_2'] font-bold text-base text-white bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] shadow-md hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          Selesaikan Petualangan 🏆
        </button>
      </div>
    </div>
  );
}
