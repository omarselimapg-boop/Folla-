import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Star,
  X,
} from 'lucide-react';
import { PROPHET_STORIES } from '../data/challenges';
import { ProphetStory } from '../types/game';
import { soundEngine } from '../utils/sound';

interface ProphetsStoriesModalProps {
  completedStoryIds: string[];
  onCompleteStory: (storyId: string) => void;
  onClose: () => void;
}

export const ProphetsStoriesModal: React.FC<ProphetsStoriesModalProps> = ({
  completedStoryIds,
  onCompleteStory,
  onClose,
}) => {
  const [selectedStory, setSelectedStory] = useState<ProphetStory | null>(null);
  const [phase, setPhase] = useState<'reading' | 'quiz' | 'done'>('reading');
  const [chapterIndex, setChapterIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [imgFailedMap, setImgFailedMap] = useState<Record<string, boolean>>({});

  const openStory = (story: ProphetStory) => {
    soundEngine.playTap();
    setSelectedStory(story);
    setPhase('reading');
    setChapterIndex(0);
    setQuestionIndex(0);
    setPickedOption(null);
  };

  const handleNextChapter = () => {
    if (!selectedStory) return;
    soundEngine.playTap();
    if (chapterIndex < selectedStory.chapters.length - 1) {
      setChapterIndex((c) => c + 1);
    } else {
      setPhase('quiz');
      setQuestionIndex(0);
      setPickedOption(null);
    }
  };

  const handleAnswerOption = (optIdx: number) => {
    if (!selectedStory) return;
    const q = selectedStory.questions[questionIndex];
    setPickedOption(optIdx);
    if (optIdx === q.correctIndex) {
      soundEngine.playChime(1.1);
    } else {
      soundEngine.playOops();
    }
  };

  const handleNextQuestion = () => {
    if (!selectedStory) return;
    soundEngine.playTap();
    if (questionIndex < selectedStory.questions.length - 1) {
      setQuestionIndex((q) => q + 1);
      setPickedOption(null);
    } else {
      soundEngine.playCelebration();
      setPhase('done');
      onCompleteStory(selectedStory.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/55 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prophets-stories-title"
    >
      <div className="animate-pop-in flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E6B8A]/12 text-[#1E6B8A]">
              <ScrollText className="h-6 w-6" />
            </div>
            <div>
              <h2 id="prophets-stories-title" className="text-lg font-bold text-[#1C2A24] sm:text-xl">
                {selectedStory ? selectedStory.prophetName : 'قصص الأنبياء للأطفال'}
              </h2>
              <p className="text-xs font-medium text-[#52665C] tabular-nums">
                {selectedStory
                  ? `${selectedStory.title} · القيمة: ${selectedStory.valueFocus}`
                  : `قصص مبسطة برسوم توضيحية وأسئلة تفاعلية · أُكمل ${completedStoryIds.length} من ${PROPHET_STORIES.length}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedStory && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setSelectedStory(null);
                }}
                className="flex h-11 items-center gap-1.5 rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] px-3.5 text-sm font-bold text-[#1C2A24] hover:bg-[#EFE7D6]"
              >
                <ChevronRight className="h-4 w-4" />
                <span>كل القصص</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق قسم قصص الأنبياء"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {!selectedStory ? (
            /* Story Library Grid */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PROPHET_STORIES.map((story) => {
                const isDone = completedStoryIds.includes(story.id);
                const failed = imgFailedMap[story.id];

                return (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => openStory(story)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/12 bg-[#FFFFFF] text-right shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:border-[#0F6B4E]/50 focus-visible:outline-2 focus-visible:outline-[#0F6B4E]"
                  >
                    <div className="relative h-40 w-full overflow-hidden bg-[#EFE7D6]">
                      {!failed ? (
                        <img
                          src={story.imagePath}
                          alt={story.title}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setImgFailedMap((prev) => ({ ...prev, [story.id]: true }))
                          }
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E6F4EE] to-[#EFE7D6] text-lg font-bold text-[#0F6B4E]">
                          {story.prophetName}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-2 p-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#1E6B8A]">
                            {story.prophetName}
                          </span>
                          {isDone ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-[#0F6B4E]">
                              <Check className="h-3.5 w-3.5" />
                              <span>مكتملة</span>
                            </span>
                          ) : (
                            <span className="font-mono-num text-xs font-bold text-[#9A6008] tabular-nums">
                              +15 ★ · +60 نقطة
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1 text-base font-bold text-[#1C2A24]">
                          {story.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#1C2A24]/8 pt-2.5 text-xs font-semibold text-[#52665C]">
                        <span>القيمة: {story.valueFocus}</span>
                        <span className="flex items-center gap-1 text-[#0F6B4E]">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>اقرأ القصة</span>
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Active Story Reader + Quiz */
            <div className="mx-auto flex max-w-2xl flex-col gap-5">
              {/* Illustrated Scene Banner */}
              <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-[#1C2A24]/12 bg-[#EFE7D6] sm:h-60">
                {!imgFailedMap[selectedStory.id] ? (
                  <img
                    src={selectedStory.imagePath}
                    alt={selectedStory.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setImgFailedMap((prev) => ({
                        ...prev,
                        [selectedStory.id]: true,
                      }))
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E6F4EE] to-[#EFE7D6] text-xl font-bold text-[#0F6B4E]">
                    {selectedStory.title}
                  </div>
                )}
              </div>

              {phase === 'reading' && (
                <div className="animate-pop-in flex flex-col gap-4 rounded-2xl border border-[#1C2A24]/12 bg-[#FFFFFF] p-5 sm:p-6">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1E6B8A] tabular-nums">
                    <span>الفقرة {chapterIndex + 1} من {selectedStory.chapters.length}</span>
                    <span>{selectedStory.valueFocus}</span>
                  </div>

                  <p className="text-base leading-loose text-[#1C2A24] sm:text-lg">
                    {selectedStory.chapters[chapterIndex]}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={chapterIndex === 0}
                      onClick={() => {
                        soundEngine.playTap();
                        setChapterIndex((c) => Math.max(0, c - 1));
                      }}
                      className="flex min-h-11 items-center gap-1.5 rounded-xl border border-[#1C2A24]/15 bg-[#FAF6EE] px-4 py-2 text-sm font-bold text-[#1C2A24] disabled:opacity-40"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span>السابق</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextChapter}
                      className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                    >
                      <span>
                        {chapterIndex < selectedStory.chapters.length - 1
                          ? 'التالي'
                          : 'الانتقال للأسئلة التفاعلية'}
                      </span>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {phase === 'quiz' && (
                <div className="animate-pop-in flex flex-col gap-4 rounded-2xl border border-[#1C2A24]/12 bg-[#FFFFFF] p-5 sm:p-6">
                  {(() => {
                    const q = selectedStory.questions[questionIndex];
                    const answeredCorrectly = pickedOption === q.correctIndex;
                    return (
                      <>
                        <div className="flex items-center justify-between text-xs font-bold text-[#1E6B8A] tabular-nums">
                          <span>
                            سؤال الفهم {questionIndex + 1} من {selectedStory.questions.length}
                          </span>
                          <span>تأمل القصة واختر الإجابة الصحيحة</span>
                        </div>

                        <h3 className="text-base font-bold text-[#1C2A24] sm:text-lg">
                          {q.question}
                        </h3>

                        <div className="space-y-2.5">
                          {q.options.map((opt, idx) => {
                            const isPicked = pickedOption === idx;
                            const isRight = isPicked && idx === q.correctIndex;
                            const isWrong = isPicked && idx !== q.correctIndex;

                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={answeredCorrectly}
                                onClick={() => handleAnswerOption(idx)}
                                className={`flex min-h-13 w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-right text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                                  isRight
                                    ? 'border-[#0F6B4E] bg-[#E6F4EE] text-[#0F6B4E]'
                                    : isWrong
                                      ? 'border-[#C2412D] bg-[#FCECE9] text-[#9E2E1D]'
                                      : 'border-[#1C2A24]/15 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]'
                                }`}
                              >
                                <span>{opt}</span>
                                {isRight && <Check className="h-5 w-5 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>

                        {pickedOption !== null && (
                          <div
                            className={`animate-pop-in rounded-xl border p-4 ${
                              answeredCorrectly
                                ? 'border-[#0F6B4E]/30 bg-[#E6F4EE]'
                                : 'border-[#C2412D]/30 bg-[#FCECE9]'
                            }`}
                          >
                            <p className="text-sm font-bold text-[#1C2A24]">
                              {answeredCorrectly
                                ? 'إجابة موفقة! أحسنت يا بطل'
                                : 'حاول مرة أخرى! تذكّر أحداث القصة'}
                            </p>
                            {answeredCorrectly && (
                              <>
                                <p className="mt-1 text-xs leading-relaxed text-[#2F4239]">
                                  {q.explanation}
                                </p>
                                <button
                                  type="button"
                                  onClick={handleNextQuestion}
                                  className="mt-3 flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                                >
                                  <span>
                                    {questionIndex < selectedStory.questions.length - 1
                                      ? 'السؤال التالي'
                                      : 'إتمام القصة واستلام المكافأة'}
                                  </span>
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {phase === 'done' && (
                <div className="animate-pop-in flex flex-col items-center gap-4 rounded-2xl border border-[#0F6B4E]/25 bg-[#FFFFFF] p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F6B4E]/12 text-[#0F6B4E]">
                    <Star className="h-8 w-8 fill-[#C78318] text-[#C78318]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1C2A24]">
                    بارك الله فيك! أتممت قصة {selectedStory.prophetName}
                  </h3>
                  <p className="max-w-md text-sm text-[#475B51]">
                    تعلّمت فُلَّة اليوم قيمة <strong>{selectedStory.valueFocus}</strong> واكتسبت نجوماً ونقاطاً جديدة.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTap();
                      setSelectedStory(null);
                    }}
                    className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                  >
                    <span>العودة لقائمة قصص الأنبياء</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
