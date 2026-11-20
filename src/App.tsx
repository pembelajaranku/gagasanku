import { useCallback, useEffect, useState } from 'react';
import { ConfettiBurst } from './components/ConfettiBurst';
import { FeedbackModal } from './components/FeedbackModal';
import { Stage1Concept } from './components/Stage1Concept';
import { Stage2Quiz } from './components/Stage2Quiz';
import { Stage3Sort } from './components/Stage3Sort';
import { Stage4Retell } from './components/Stage4Retell';
import { TitleMapScreen } from './components/TitleMapScreen';
import { TopHud } from './components/TopHud';
import { VictoryScreen } from './components/VictoryScreen';
import {
  ModalPayload,
  PersistedProgress,
  STORAGE_KEY,
  ScreenId,
  StageNumber,
} from './types/game';
import { SoundKind, playSound } from './utils/audio';

function loadInitialProgress(): PersistedProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { xp: 0, stars: 0, hearts: 3, muted: false, done: [] };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedProgress>;
    const validDone = Array.isArray(parsed.done)
      ? parsed.done.filter((n): n is StageNumber => n === 1 || n === 2 || n === 3 || n === 4)
      : [];
    return {
      xp: Number(parsed.xp) || 0,
      stars: Number(parsed.stars) || 0,
      hearts: Number(parsed.hearts) > 0 ? Number(parsed.hearts) : 3,
      muted: Boolean(parsed.muted),
      done: validDone,
    };
  } catch {
    return { xp: 0, stars: 0, hearts: 3, muted: false, done: [] };
  }
}

export default function App() {
  const initial = loadInitialProgress();

  const [screen, setScreen] = useState<ScreenId>(0);
  const [xp, setXp] = useState<number>(initial.xp);
  const [stars, setStars] = useState<number>(initial.stars);
  const [hearts, setHearts] = useState<number>(initial.hearts);
  const [muted, setMuted] = useState<boolean>(initial.muted);
  const [done, setDone] = useState<Set<StageNumber>>(() => new Set(initial.done));
  const [modal, setModal] = useState<ModalPayload | null>(null);
  const [confettiKey, setConfettiKey] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [sessionNonce, setSessionNonce] = useState<number>(1);

  useEffect(() => {
    try {
      const payload: PersistedProgress = {
        xp,
        stars,
        hearts,
        muted,
        done: Array.from(done),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [xp, stars, hearts, muted, done]);

  const handlePlaySound = useCallback(
    (kind: SoundKind) => {
      playSound(kind, muted);
    },
    [muted]
  );

  const goScreen = useCallback((next: ScreenId) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartAdventure = useCallback(() => {
    if (done.size >= 4) {
      goScreen(5);
    } else {
      const nextStage = (done.size + 1) as StageNumber;
      goScreen(nextStage);
    }
  }, [done.size, goScreen]);

  const handleLoseHeart = useCallback(() => {
    if (hearts <= 1) {
      setHearts(3);
      setModal({
        icon: '💗',
        title: 'Tetap Semangat!',
        message:
          'Nyawamu sempat habis, tapi Owi sudah mengisi ulang semangatmu menjadi 3! Yuk, baca lagi dengan tenang.',
      });
    } else {
      setHearts(hearts - 1);
    }
  }, [hearts]);

  const handleCompleteStage = useCallback(
    (stage: StageNumber, rewardXP: number, rewardStars: number, message: string) => {
      if (done.has(stage)) return;
      setDone((prev) => {
        if (prev.has(stage)) return prev;
        const next = new Set(prev);
        next.add(stage);
        return next;
      });
      setXp((x) => x + rewardXP);
      setStars((s) => s + rewardStars);
      playSound('win', muted);
      setModal({
        icon: '🌟',
        title: `Tahap ${stage} Selesai!`,
        message: `${message} Kamu memperoleh +${rewardXP} XP dan +${rewardStars} ⭐!`,
      });
    },
    [done, muted]
  );

  const handleFinishAdventure = useCallback(() => {
    if (!done.has(4)) {
      setDone((prev) => {
        if (prev.has(4)) return prev;
        const next = new Set(prev);
        next.add(4);
        return next;
      });
      setXp((x) => x + 25);
      setStars((s) => s + 1);
    }
    playSound('win', muted);
    setConfettiKey((k) => k + 1);
    setShowConfetti(true);
    goScreen(5);
  }, [done, muted, goScreen]);

  useEffect(() => {
    if (!showConfetti) return;
    const timer = window.setTimeout(() => setShowConfetti(false), 4200);
    return () => window.clearTimeout(timer);
  }, [showConfetti, confettiKey]);

  const handleRestart = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setXp(0);
    setStars(0);
    setHearts(3);
    setDone(new Set());
    setModal(null);
    setShowConfetti(false);
    setSessionNonce((n) => n + 1);
    goScreen(0);
  }, [goScreen]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="storybook-bg" aria-hidden="true" />

      <TopHud
        xp={xp}
        stars={stars}
        hearts={hearts}
        completedCount={done.size}
        muted={muted}
        activeScreen={screen}
        onToggleMute={() => setMuted((m) => !m)}
        onGoHome={() => goScreen(0)}
      />

      <main className="flex-1 pb-10">
        {screen === 0 && (
          <TitleMapScreen
            done={done}
            onStartAdventure={handleStartAdventure}
            onSelectStage={goScreen}
          />
        )}

        {screen === 1 && (
          <Stage1Concept
            key={`s1-${sessionNonce}`}
            isCompleted={done.has(1)}
            onGoScreen={goScreen}
            onCompleteStage={handleCompleteStage}
            onWrongAnswer={handleLoseHeart}
            onPlaySound={handlePlaySound}
          />
        )}

        {screen === 2 && (
          <Stage2Quiz
            key={`s2-${sessionNonce}`}
            isCompleted={done.has(2)}
            onGoScreen={goScreen}
            onCompleteStage={handleCompleteStage}
            onWrongAnswer={handleLoseHeart}
            onShowNotice={(icon, title, message) => setModal({ icon, title, message })}
            onPlaySound={handlePlaySound}
          />
        )}

        {screen === 3 && (
          <Stage3Sort
            key={`s3-${sessionNonce}`}
            isCompleted={done.has(3)}
            onGoScreen={goScreen}
            onCompleteStage={handleCompleteStage}
            onWrongAnswer={handleLoseHeart}
            onPlaySound={handlePlaySound}
          />
        )}

        {screen === 4 && (
          <Stage4Retell
            key={`s4-${sessionNonce}`}
            onGoScreen={goScreen}
            onCompleteStage={handleCompleteStage}
            onFinishAdventure={handleFinishAdventure}
            onPlaySound={handlePlaySound}
          />
        )}

        {screen === 5 && (
          <VictoryScreen
            xp={xp}
            stars={stars}
            onRestart={handleRestart}
            onGoScreen={goScreen}
          />
        )}
      </main>

      <FeedbackModal modal={modal} onClose={() => setModal(null)} />
      <ConfettiBurst key={confettiKey} active={showConfetti} />
    </div>
  );
}
