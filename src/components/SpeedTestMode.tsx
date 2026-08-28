import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, GraduationCap, RotateCcw, Sparkles, Trophy, Zap } from 'lucide-react';

interface SpeedTestModeProps {
  onGoToTraining?: () => void;
  onGoToWeakKeyLab?: () => void;
}

const BENCHMARK_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
  'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
  'most', 'us', 'system', 'build', 'speed', 'touch', 'master', 'focus', 'flow', 'strike', 'clean', 'great',
  'craft', 'sharp', 'fluid', 'tempo', 'rhythm', 'ninja', 'expert', 'action', 'precision', 'anchor'
];

export const SpeedTestMode: React.FC<SpeedTestModeProps> = ({
  onGoToTraining,
  onGoToWeakKeyLab,
}) => {
  const [duration, setDuration] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [charHistory, setCharHistory] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [highScore, setHighScore] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('typeninja-high-score') || '0';
    setHighScore(parseInt(saved, 10) || 0);
    resetTest(duration);
  }, []);

  const resetTest = (selectedDuration: number = duration) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const shuffled = [...BENCHMARK_WORDS, ...BENCHMARK_WORDS, ...BENCHMARK_WORDS].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setTimeLeft(selectedDuration);
    setDuration(selectedDuration);
    setIsTestRunning(false);
    setIsFinished(false);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setCharHistory({});
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Timer loop
  useEffect(() => {
    if (isTestRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            endTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestRunning, timeLeft]);

  const endTest = () => {
    setIsTestRunning(false);
    setIsFinished(true);

    const minutes = duration / 60;
    const finalWpm = Math.round((correctKeystrokes / 5) / minutes);
    if (finalWpm > highScore) {
      setHighScore(finalWpm);
      localStorage.setItem('typeninja-high-score', finalWpm.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (!isTestRunning || (currentWordIndex === 0 && currentCharIndex === 0)) return;

      if (currentCharIndex > 0) {
        const prevCharIdx = currentCharIndex - 1;
        const key = `${currentWordIndex}-${prevCharIdx}`;
        if (charHistory[key] === 'correct') {
          setCorrectKeystrokes((c) => Math.max(0, c - 1));
        }
        setCharHistory((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        setCurrentCharIndex(prevCharIdx);
      } else if (currentWordIndex > 0) {
        const prevWordIdx = currentWordIndex - 1;
        const prevWordLength = words[prevWordIdx].length;
        const key = `${prevWordIdx}-${prevWordLength}`;
        if (charHistory[key] === 'correct') {
          setCorrectKeystrokes((c) => Math.max(0, c - 1));
        }
        setCharHistory((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
        setCurrentWordIndex(prevWordIdx);
        setCurrentCharIndex(prevWordLength);
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      if (!isTestRunning && !isFinished) {
        setIsTestRunning(true);
      }

      const currentWord = words[currentWordIndex] || '';
      const currentWordWithSpace = currentWord + ' ';
      const targetChar = currentWordWithSpace[currentCharIndex];

      const isCorrect = e.key === targetChar;
      const historyKey = `${currentWordIndex}-${currentCharIndex}`;

      setTotalKeystrokes((t) => t + 1);
      if (isCorrect) {
        setCorrectKeystrokes((c) => c + 1);
      }
      setCharHistory((prev) => ({
        ...prev,
        [historyKey]: isCorrect ? 'correct' : 'incorrect',
      }));

      const nextCharIdx = currentCharIndex + 1;
      if (nextCharIdx >= currentWordWithSpace.length) {
        setCurrentWordIndex((w) => w + 1);
        setCurrentCharIndex(0);
      } else {
        setCurrentCharIndex(nextCharIdx);
      }
    }
  };

  const elapsedSeconds = duration - timeLeft;
  const currentMinutes = elapsedSeconds > 0 ? elapsedSeconds / 60 : 1 / 60;
  const liveWpm = Math.round((correctKeystrokes / 5) / currentMinutes);
  const liveAcc = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-in fade-in">
      <input
        ref={inputRef}
        type="text"
        className="sr-only"
        autoFocus
        onKeyDown={handleKeyDown}
        value=""
        onChange={() => {}}
      />

      {/* Speed Test Banner */}
      <div className="bg-[#00E5FF] brutal-border-thick brutal-shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-white text-xs font-black uppercase px-2.5 py-1 brutal-border mb-2">
            Freeform Speed Benchmark
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            Speed Test Arena
          </h1>
          <p className="text-xs sm:text-sm font-bold text-black/80">
            Type as fast as you can. Full backspace error-correction enabled.
          </p>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center gap-2">
          {[15, 30, 60, 120].map((sec) => (
            <button
              key={sec}
              onClick={() => resetTest(sec)}
              className={`px-3.5 py-2 text-xs font-black uppercase brutal-border transition-all brutal-btn-press ${
                duration === sec
                  ? 'bg-black text-white brutal-shadow-sm'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {sec}s Test
            </button>
          ))}
        </div>
      </div>

      {/* Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FFDE03] p-3 brutal-border brutal-shadow-sm text-center">
          <div className="text-[10px] font-black uppercase text-black/75">Timer</div>
          <div className="text-3xl font-black text-black">{timeLeft}s</div>
        </div>

        <div className="bg-[#6BCB77] p-3 brutal-border brutal-shadow-sm text-center">
          <div className="text-[10px] font-black uppercase text-black/75">Live Net WPM</div>
          <div className="text-3xl font-black text-black">{liveWpm}</div>
        </div>

        <div className="bg-[#FFFDF7] p-3 brutal-border brutal-shadow-sm text-center">
          <div className="text-[10px] font-black uppercase text-black/75">Accuracy</div>
          <div className="text-3xl font-black text-black">{liveAcc}%</div>
        </div>

        <div className="bg-white p-3 brutal-border brutal-shadow-sm text-center">
          <div className="text-[10px] font-black uppercase text-black/75">All-Time High</div>
          <div className="text-3xl font-black text-black">{highScore} WPM</div>
        </div>
      </div>

      {/* Typing Stream Canvas */}
      {!isFinished ? (
        <div
          onClick={() => inputRef.current?.focus()}
          className="bg-white brutal-border-thick brutal-shadow-lg p-6 font-mono-code text-xl sm:text-2xl leading-loose min-h-[220px] max-h-[280px] overflow-hidden cursor-text select-none relative"
        >
          {!isTestRunning && (
            <div className="absolute top-2 right-3 text-[10px] font-black uppercase bg-[#FFDE03] px-2.5 py-1 brutal-border shadow-sm animate-bounce">
              ⌨️ Click anywhere & start typing to start {duration}s timer...
            </div>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {words.slice(0, 45).map((word, wIdx) => {
              const wordWithSpace = word + ' ';
              const isCurrentWord = wIdx === currentWordIndex;

              return (
                <span
                  key={wIdx}
                  className={`inline-block ${
                    isCurrentWord ? 'bg-yellow-100 px-1 brutal-border' : ''
                  }`}
                >
                  {wordWithSpace.split('').map((char, cIdx) => {
                    const historyKey = `${wIdx}-${cIdx}`;
                    const status = charHistory[historyKey];
                    const isCurrentChar = isCurrentWord && cIdx === currentCharIndex;

                    let charColor = 'text-gray-400';
                    if (status === 'correct') {
                      charColor = 'text-black font-bold';
                    } else if (status === 'incorrect') {
                      charColor = 'bg-[#FF6B6B] text-white px-0.5 brutal-border';
                    }

                    return (
                      <span
                        key={cIdx}
                        className={`relative ${charColor} ${
                          isCurrentChar ? 'bg-[#FFDE03] text-black font-black' : ''
                        }`}
                      >
                        {char === ' ' ? '\u00A0' : char}
                        {isCurrentChar && (
                          <span className="absolute -bottom-1 left-0 right-0 h-1 bg-black animate-caret" />
                        )}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-[#FFFDF7] brutal-border-thick brutal-shadow-xl p-8 text-center animate-in zoom-in-95">
          <div className="inline-block bg-[#00E5FF] p-4 brutal-border brutal-shadow mb-4">
            <Trophy className="w-12 h-12 text-black" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-1">
            Benchmark Complete!
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-600 mb-6">
            Tested over {duration} seconds with {totalKeystrokes} total keystrokes.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-[#FFDE03] p-4 brutal-border text-center">
              <div className="text-xs font-black uppercase">Net Speed</div>
              <div className="text-4xl font-black">{liveWpm}</div>
              <div className="text-[10px] font-bold">WPM</div>
            </div>

            <div className="bg-[#6BCB77] p-4 brutal-border text-center">
              <div className="text-xs font-black uppercase">Accuracy</div>
              <div className="text-4xl font-black">{liveAcc}%</div>
              <div className="text-[10px] font-bold">Precision</div>
            </div>

            <div className="bg-white p-4 brutal-border text-center col-span-2 sm:col-span-1">
              <div className="text-xs font-black uppercase">Record</div>
              <div className="text-4xl font-black">{highScore}</div>
              <div className="text-[10px] font-bold">Best WPM</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => resetTest(duration)}
              className="px-6 py-3 bg-black text-white font-black uppercase tracking-wider text-sm brutal-border brutal-shadow hover:bg-neutral-800 flex items-center justify-center gap-2 brutal-btn-press"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Test</span>
            </button>

            {onGoToTraining && (
              <button
                onClick={onGoToTraining}
                className="px-6 py-3 bg-[#FFDE03] text-black font-black uppercase tracking-wider text-sm brutal-border brutal-shadow hover:bg-[#ffe338] flex items-center justify-center gap-2 brutal-btn-press"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Jump into Training Course</span>
              </button>
            )}

            {onGoToWeakKeyLab && (
              <button
                onClick={onGoToWeakKeyLab}
                className="px-5 py-3 bg-[#FF6B6B] text-black font-black uppercase tracking-wider text-sm brutal-border brutal-shadow hover:bg-[#ff8585] flex items-center justify-center gap-2 brutal-btn-press"
              >
                <Sparkles className="w-4 h-4" />
                <span>Weak-Key Lab</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Training Academy Callout Banner */}
      {onGoToTraining && (
        <div className="bg-[#FFFDF7] brutal-border-thick brutal-shadow p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFDE03] brutal-border flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                Want Structured Touch Typing Training?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-600">
                Practice 5 progressive modules from Home Row anchors up to 65+ WPM Mastery.
              </p>
            </div>
          </div>

          <button
            onClick={onGoToTraining}
            className="px-5 py-2.5 bg-black text-[#FFDE03] font-black uppercase text-xs sm:text-sm tracking-wider brutal-border brutal-shadow hover:bg-neutral-800 flex items-center gap-2 shrink-0 brutal-btn-press"
          >
            <span>Open Training Sessions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
