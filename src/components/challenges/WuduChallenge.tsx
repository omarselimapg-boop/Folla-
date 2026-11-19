import React, { useMemo, useState } from 'react';
import { Check, Droplets, HelpCircle, RotateCcw, X } from 'lucide-react';
import { WUDU_STEPS, WuduStep } from '../../data/challenges';
import { soundEngine } from '../../utils/sound';

interface WuduChallengeProps {
  onComplete: (bonusStars: number) => void;
  onCancel: () => void;
}

function shuffleSteps(items: WuduStep[]): WuduStep[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // Ensure it's not accidentally already in exact order
  if (copy.every((s, idx) => s.order === idx + 1)) {
    [copy[0], copy[copy.length - 1]] = [copy[copy.length - 1], copy[0]];
  }
  return copy;
}

export const WuduChallenge: React.FC<WuduChallengeProps> = ({
  onComplete,
  onCancel,
}) => {
  const [pool, setPool] = useState<WuduStep[]>(() => shuffleSteps(WUDU_STEPS));
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>(
    'اضغط على الخطوة الأولى للوضوء بالترتيب الصحيح.'
  );
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [hintStepId, setHintStepId] = useState<string | null>(null);

  const nextExpectedOrder = completedCount + 1;
  const isFinished = completedCount === WUDU_STEPS.length;

  const placedSteps = useMemo(
    () => WUDU_STEPS.slice(0, completedCount),
    [completedCount]
  );

  const handlePickStep = (step: WuduStep) => {
    if (isFinished) return;

    if (step.order === nextExpectedOrder) {
      soundEngine.playDrop();
      const nextCount = completedCount + 1;
      setCompletedCount(nextCount);
      setPool((prev) => prev.filter((item) => item.id !== step.id));
      setWrongId(null);
      setHintStepId(null);

      if (nextCount === WUDU_STEPS.length) {
        soundEngine.playCelebration();
        setFeedback('أحسنت! أتممت خطوات الوضوء كاملة كما علّمنا النبي ﷺ.');
      } else {
        setFeedback(`ممتاز! ${step.title}: ${step.detail}`);
      }
    } else {
      soundEngine.playOops();
      setMistakes((m) => m + 1);
      setWrongId(step.id);
      const expectedStep = WUDU_STEPS[nextExpectedOrder - 1];
      setFeedback(
        `ليس بعد! تذكّر أن الخطوة ${nextExpectedOrder} هي قبل ذلك (${expectedStep.title.split(' ')[0]}...).`
      );
      window.setTimeout(() => setWrongId(null), 400);
    }
  };

  const handleShowHint = () => {
    soundEngine.playTap();
    const expected = WUDU_STEPS[nextExpectedOrder - 1];
    if (expected) {
      setHintStepId(expected.id);
      setFeedback(`تلميح: ابحث عن "${expected.title}"`);
    }
  };

  const handleRestart = () => {
    soundEngine.playTap();
    setPool(shuffleSteps(WUDU_STEPS));
    setCompletedCount(0);
    setMistakes(0);
    setWrongId(null);
    setHintStepId(null);
    setFeedback('اضغط على الخطوة الأولى للوضوء بالترتيب الصحيح.');
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/50 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wudu-challenge-title"
    >
      <div className="animate-pop-in flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0E7490]/12 text-[#0E7490]">
              <Droplets className="h-6 w-6" />
            </div>
            <div>
              <h2 id="wudu-challenge-title" className="text-lg font-bold text-[#1C2A24] sm:text-xl">
                تحدي ترتيب خطوات الوضوء
              </h2>
              <p className="text-xs font-medium text-[#52665C] tabular-nums">
                الخطوات المكتملة: {completedCount} / {WUDU_STEPS.length} · الأخطاء: {mistakes}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isFinished && (
              <button
                type="button"
                onClick={handleShowHint}
                className="flex h-11 items-center gap-1.5 rounded-xl border border-[#C78318]/35 bg-[#C78318]/10 px-3.5 text-sm font-bold text-[#9A6008] transition-colors hover:bg-[#C78318]/20 focus-visible:outline-2 focus-visible:outline-[#0F6B4E]"
              >
                <HelpCircle className="h-4 w-4" />
                <span>تلميح</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleRestart}
              aria-label="إعادة الترتيب"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6] focus-visible:outline-2 focus-visible:outline-[#0F6B4E]"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              aria-label="إغلاق التحدي"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6] focus-visible:outline-2 focus-visible:outline-[#0F6B4E]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        <div
          className={`border-b px-5 py-3 text-sm font-semibold ${
            isFinished
              ? 'border-[#0F6B4E]/20 bg-[#E6F4EE] text-[#0F6B4E]'
              : wrongId
                ? 'border-[#C2412D]/20 bg-[#FCECE9] text-[#9E2E1D]'
                : 'border-[#1C2A24]/10 bg-[#F3EDE0] text-[#2B3D34]'
          }`}
        >
          {feedback}
        </div>

        {/* Playfield */}
        <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 md:grid-cols-2">
          {/* Ordered Timeline Slots */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-sm font-bold text-[#475B51]">
              مسار الوضوء الصحيح
            </h3>
            <div className="space-y-2">
              {WUDU_STEPS.map((step, index) => {
                const isDone = index < completedCount;
                const isCurrent = index === completedCount;
                const placed = placedSteps[index];

                return (
                  <div
                    key={step.id}
                    className={`flex min-h-12 items-center justify-between rounded-xl border px-3.5 py-2 transition-colors duration-150 ${
                      isDone
                        ? 'border-[#0E7490]/35 bg-[#FFFFFF]'
                        : isCurrent
                          ? 'border-dashed border-[#0E7490] bg-[#0E7490]/6'
                          : 'border-[#1C2A24]/10 bg-[#EFE7D6]/55'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono-num flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums ${
                          isDone
                            ? 'bg-[#0E7490] text-white'
                            : isCurrent
                              ? 'bg-[#0E7490]/20 text-[#0E7490]'
                              : 'bg-[#1C2A24]/10 text-[#52665C]'
                        }`}
                      >
                        {step.order}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-[#1C2A24]">
                          {isDone ? placed.title : isCurrent ? 'اختر الخطوة التالية...' : 'خطوة قادمة'}
                        </div>
                        {isDone && (
                          <div className="text-xs text-[#475B51]">{placed.detail}</div>
                        )}
                      </div>
                    </div>
                    {isDone && <Check className="h-4 w-4 shrink-0 text-[#0E7490]" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Choices Pool or Victory CTA */}
          <div className="flex flex-col justify-between gap-4">
            {!isFinished ? (
              <div>
                <h3 className="mb-2.5 text-sm font-bold text-[#475B51]">
                  الخطوات المتبقية (اضغط بالترتيب)
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {pool.map((step) => {
                    const isHinted = hintStepId === step.id;
                    const isWrong = wrongId === step.id;
                    return (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => handlePickStep(step)}
                        className={`flex min-h-13 items-center justify-between rounded-xl border px-4 py-3 text-right transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                          isWrong
                            ? 'border-[#C2412D] bg-[#FCECE9] text-[#9E2E1D] -translate-x-1'
                            : isHinted
                              ? 'border-[#C78318] bg-[#FFF8E6] text-[#1C2A24] ring-2 ring-[#C78318]/35'
                              : 'border-[#1C2A24]/15 bg-[#FFFFFF] text-[#1C2A24] hover:border-[#0E7490] hover:bg-[#F2F9FA]'
                        }`}
                      >
                        <span className="text-sm font-bold sm:text-base">
                          {step.title}
                        </span>
                        <Droplets className="h-4 w-4 shrink-0 text-[#0E7490]/70" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-[#0F6B4E]/25 bg-[#FFFFFF] p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F6B4E]/12 text-[#0F6B4E]">
                  <Check className="h-9 w-9" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2A24]">
                  بارك الله فيك! وضوء صحيح ومتقن
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-[#475B51]">
                  تذكّرت فُلَّة أن الطهارة شطر الإيمان، وأن الاقتصاد في الماء أثناء الوضوء من سنن نبينا الكريم.
                </p>
                <button
                  type="button"
                  onClick={() => onComplete(mistakes === 0 ? 5 : 0)}
                  className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0F6B4E] px-7 py-3 text-base font-bold text-white shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:bg-[#0B573F] focus-visible:outline-2 focus-visible:outline-[#0F6B4E]"
                >
                  <span>استلام النجوم والعودة</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
