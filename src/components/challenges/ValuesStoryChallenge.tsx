import React, { useState } from 'react';
import { BookHeart, Check, ChevronLeft, X } from 'lucide-react';
import { MORAL_STORIES, StoryChoice } from '../../data/challenges';
import { soundEngine } from '../../utils/sound';

interface ValuesStoryChallengeProps {
  startIndex: number;
  onComplete: (bonusStars: number) => void;
  onCancel: () => void;
}

export const ValuesStoryChallenge: React.FC<ValuesStoryChallengeProps> = ({
  startIndex,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<0 | 1>(0);
  const [selectedChoice, setSelectedChoice] = useState<StoryChoice | null>(null);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [hasFailedCurrent, setHasFailedCurrent] = useState(false);
  const [portraitFailed, setPortraitFailed] = useState(false);

  const story = MORAL_STORIES[(startIndex + step) % MORAL_STORIES.length];

  const handleChoose = (choice: StoryChoice) => {
    setSelectedChoice(choice);
    if (choice.isVirtuous) {
      soundEngine.playChime(1.05);
      if (!hasFailedCurrent) {
        setFirstTryCount((c) => c + 1);
      }
    } else {
      soundEngine.playOops();
      setHasFailedCurrent(true);
    }
  };

  const handleNext = () => {
    soundEngine.playTap();
    if (step === 0) {
      setStep(1);
      setSelectedChoice(null);
      setHasFailedCurrent(false);
    } else {
      soundEngine.playCelebration();
      onComplete(firstTryCount === 2 ? 5 : 0);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/50 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="values-story-title"
    >
      <div className="animate-pop-in flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C78318]/15 text-[#9A6008]">
              <BookHeart className="h-6 w-6" />
            </div>
            <div>
              <h2 id="values-story-title" className="text-lg font-bold text-[#1C2A24]">
                تحدي ميزان الأخلاق والصدق
              </h2>
              <p className="text-xs font-medium text-[#52665C] tabular-nums">
                القصة {step + 1} من 2 · {story.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="إغلاق التحدي"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Story Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[200px_1fr]">
            {/* Folla Illustration */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-48 w-48 overflow-hidden rounded-2xl border border-[#1C2A24]/12 bg-[#FFFFFF] shadow-sm">
                {!portraitFailed ? (
                  <img
                    src="/src/assets/images/folla_character_learn_1795025925030.jpg"
                    alt="فُلَّة تفكر وتتعلم"
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#E7F0E9] text-lg font-bold text-[#0F6B4E]">
                    حكاية فُلَّة
                  </div>
                )}
              </div>
            </div>

            {/* Dilemma & Choices */}
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-[#1C2A24]/10 bg-[#FFFFFF] p-4">
                <h3 className="text-base font-bold text-[#0F6B4E]">{story.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#1C2A24]">
                  {story.setting}
                </p>
                <p className="mt-2 text-sm font-bold text-[#2B3D34]">{story.dilemma}</p>
              </div>

              <div className="space-y-2.5">
                {story.choices.map((choice, idx) => {
                  const isPicked = selectedChoice?.label === choice.label;
                  const showRight = isPicked && choice.isVirtuous;
                  const showWrong = isPicked && !choice.isVirtuous;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={Boolean(selectedChoice?.isVirtuous)}
                      onClick={() => handleChoose(choice)}
                      className={`flex min-h-13 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-right text-sm font-bold transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                        showRight
                          ? 'border-[#0F6B4E] bg-[#E6F4EE] text-[#0F6B4E]'
                          : showWrong
                            ? 'border-[#C2412D] bg-[#FCECE9] text-[#9E2E1D]'
                            : 'border-[#1C2A24]/15 bg-[#FFFFFF] text-[#1C2A24] hover:border-[#0F6B4E] hover:bg-[#F3EDE0]'
                      }`}
                    >
                      <span>{choice.label}</span>
                      {showRight && <Check className="h-5 w-5 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedChoice && (
                <div
                  className={`animate-pop-in rounded-xl border p-4 ${
                    selectedChoice.isVirtuous
                      ? 'border-[#0F6B4E]/30 bg-[#E6F4EE]'
                      : 'border-[#C2412D]/30 bg-[#FCECE9]'
                  }`}
                >
                  <p className="text-sm font-bold text-[#1C2A24]">
                    {selectedChoice.reaction}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#2F4239]">
                    الحكمة: {selectedChoice.wisdom}
                  </p>

                  {selectedChoice.isVirtuous && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="mt-3 flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                    >
                      <span>{step === 0 ? 'القصة التالية' : 'إنهاء التحدي واستلام النجوم'}</span>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
