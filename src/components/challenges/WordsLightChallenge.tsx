import React, { useState } from 'react';
import { BookOpen, Check, HelpCircle, RotateCcw, X } from 'lucide-react';
import { CLEAN_WORD_ROUNDS } from '../../data/challenges';
import { soundEngine } from '../../utils/sound';

interface WordsLightChallengeProps {
  startRound: number;
  onComplete: (bonusStars: number) => void;
  onCancel: () => void;
}

export const WordsLightChallenge: React.FC<WordsLightChallengeProps> = ({
  startRound,
  onComplete,
  onCancel,
}) => {
  const [stage, setStage] = useState<0 | 1>(0);
  const round = CLEAN_WORD_ROUNDS[(startRound + stage) % CLEAN_WORD_ROUNDS.length];

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [hintTier, setHintTier] = useState<0 | 1 | 2 | 3>(0);
  const [solved, setSolved] = useState(false);
  const [errorTile, setErrorTile] = useState<number | null>(null);

  const nextExpectedIndex = round.targetPath[selectedIndices.length];

  const handleTileClick = (index: number) => {
    if (solved) return;
    if (selectedIndices.includes(index)) return;

    if (index === nextExpectedIndex) {
      soundEngine.playChime(1 + selectedIndices.length * 0.08);
      const next = [...selectedIndices, index];
      setSelectedIndices(next);
      setErrorTile(null);

      if (next.length === round.targetPath.length) {
        setSolved(true);
        soundEngine.playCelebration();
      }
    } else {
      soundEngine.playOops();
      setErrorTile(index);
      window.setTimeout(() => setErrorTile(null), 350);
    }
  };

  const handleHint = () => {
    soundEngine.playTap();
    setHintTier((t) => (t < 3 ? ((t + 1) as 1 | 2 | 3) : 3));
  };

  const handleNextWord = () => {
    soundEngine.playTap();
    if (stage === 0) {
      setStage(1);
      setSelectedIndices([]);
      setHintTier(0);
      setSolved(false);
    } else {
      onComplete(hintTier === 0 ? 5 : 0);
    }
  };

  const handleResetSelection = () => {
    soundEngine.playTap();
    setSelectedIndices([]);
  };

  const targetFirstIndex = round.targetPath[0];
  const targetRow = Math.floor(targetFirstIndex / round.gridSize) + 1;
  const targetCol = (targetFirstIndex % round.gridSize) + 1;

  const builtLetters = selectedIndices.map((idx) => round.cells[idx]).join('');

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/50 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="words-light-title"
    >
      <div className="animate-pop-in flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D4C9E]/12 text-[#6D4C9E]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 id="words-light-title" className="text-lg font-bold text-[#1C2A24]">
                تحدي حروف النور والقيم
              </h2>
              <p className="text-xs font-medium text-[#52665C] tabular-nums">
                الكلمة {stage + 1} من 2 · اضغط الحروف بالترتيب لتكوين القيمة الإسلامية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!solved && (
              <button
                type="button"
                onClick={handleHint}
                className="flex h-11 items-center gap-1.5 rounded-xl border border-[#C78318]/35 bg-[#C78318]/10 px-3.5 text-sm font-bold text-[#9A6008] hover:bg-[#C78318]/20"
              >
                <HelpCircle className="h-4 w-4" />
                <span>تلميح ({hintTier}/3)</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleResetSelection}
              aria-label="إعادة تحديد الحروف"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              aria-label="إغلاق التحدي"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Clue & Progress Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#F3EDE0] px-5 py-3">
          <div>
            <span className="text-xs font-bold text-[#6D4C9E]">الدليل: </span>
            <span className="text-sm font-bold text-[#1C2A24]">{round.clue}</span>
            <span className="mr-2 text-xs text-[#52665C] tabular-nums">
              ({round.word.length} أحرف)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {round.targetPath.map((_, i) => (
              <div
                key={i}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg font-bold ${
                  i < selectedIndices.length
                    ? 'border-[#0F6B4E] bg-[#0F6B4E] text-white'
                    : 'border-[#1C2A24]/20 bg-[#FFFFFF] text-[#73857B]'
                }`}
              >
                {i < selectedIndices.length ? round.cells[selectedIndices[i]] : '·'}
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Tier Hint Note */}
        {hintTier > 0 && !solved && (
          <div className="border-b border-[#C78318]/20 bg-[#FFF8E6] px-5 py-2 text-xs font-bold text-[#9A6008]">
            {hintTier >= 1 && `تلميح 1: تبدأ الكلمة بحرف "${round.word[0]}" · `}
            {hintTier >= 2 && `تلميح 2: تقع في الصف ${targetRow} والعمود ${targetCol} · `}
            {hintTier >= 3 && `تلميح 3: الحرف التالي مظلّل بالذهبي في الشبكة!`}
          </div>
        )}

        {/* Grid + Victory Panel */}
        <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto p-5">
          {!solved ? (
            <div
              className="grid gap-2.5"
              style={{
                gridTemplateColumns: `repeat(${round.gridSize}, minmax(48px, 60px))`,
              }}
            >
              {round.cells.map((char, idx) => {
                const isSelected = selectedIndices.includes(idx);
                const isError = errorTile === idx;
                const isHintNext = hintTier >= 3 && idx === nextExpectedIndex;
                const isHintFirst = hintTier >= 2 && idx === targetFirstIndex && !isSelected;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTileClick(idx)}
                    className={`flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-xl border text-xl font-extrabold transition-transform duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                      isSelected
                        ? 'border-[#0F6B4E] bg-[#0F6B4E] text-white shadow-sm'
                        : isError
                          ? 'border-[#C2412D] bg-[#FCECE9] text-[#9E2E1D]'
                          : isHintNext || isHintFirst
                            ? 'border-[#C78318] bg-[#FFF8E6] text-[#9A6008] ring-2 ring-[#C78318]/35'
                            : 'border-[#1C2A24]/15 bg-[#FFFFFF] text-[#1C2A24] hover:border-[#6D4C9E] hover:bg-[#F5F2FA]'
                    }`}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="animate-pop-in flex max-w-md flex-col items-center gap-4 rounded-2xl border border-[#0F6B4E]/25 bg-[#FFFFFF] p-6 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F6B4E]/12 text-[#0F6B4E]">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F6B4E]">{builtLetters}</h3>
              <p className="text-sm leading-relaxed text-[#2F4239]">{round.lesson}</p>
              <button
                type="button"
                onClick={handleNextWord}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
              >
                <span>{stage === 0 ? 'الكلمة التالية' : 'استلام النجوم والعودة'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
