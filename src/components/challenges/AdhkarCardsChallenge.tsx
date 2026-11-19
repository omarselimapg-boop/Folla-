import React, { useMemo, useState } from 'react';
import { Check, HelpCircle, Sparkles, X } from 'lucide-react';
import { ADHKAR_SETS, AdhkarPair } from '../../data/challenges';
import { soundEngine } from '../../utils/sound';

interface AdhkarCardsChallengeProps {
  roundIndex: number;
  onComplete: (bonusStars: number) => void;
  onCancel: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const AdhkarCardsChallenge: React.FC<AdhkarCardsChallengeProps> = ({
  roundIndex,
  onComplete,
  onCancel,
}) => {
  const pairs: AdhkarPair[] = ADHKAR_SETS[roundIndex % ADHKAR_SETS.length];

  const shuffledAdhkar = useMemo(() => shuffle(pairs), [pairs]);
  const [selectedSituationId, setSelectedSituationId] = useState<string | null>(null);
  const [selectedDhikrId, setSelectedDhikrId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState(false);
  const [hintId, setHintId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>(
    'اختر موقفاً من اليمين ثم اختر الذكر المناسب له من اليسار.'
  );

  const isDone = matchedIds.length === pairs.length;

  const tryMatch = (sitId: string | null, dhkId: string | null) => {
    if (!sitId || !dhkId) return;
    if (sitId === dhkId) {
      const pair = pairs.find((p) => p.id === sitId);
      soundEngine.playChime(1.1);
      setMatchedIds((prev) => [...prev, sitId]);
      setSelectedSituationId(null);
      setSelectedDhikrId(null);
      setHintId(null);
      if (pair) {
        setFeedback(`صحيح! ${pair.situation}: "${pair.dhikr}" — ${pair.lesson}`);
      }
      if (matchedIds.length + 1 === pairs.length) {
        soundEngine.playCelebration();
      }
    } else {
      soundEngine.playOops();
      setWrongPair(true);
      setFeedback('تطابق غير صحيح، تذكّر المعنى وحاول مرة أخرى.');
      window.setTimeout(() => {
        setWrongPair(false);
        setSelectedSituationId(null);
        setSelectedDhikrId(null);
      }, 450);
    }
  };

  const handleSelectSituation = (id: string) => {
    if (matchedIds.includes(id) || wrongPair) return;
    soundEngine.playTap();
    setSelectedSituationId(id);
    tryMatch(id, selectedDhikrId);
  };

  const handleSelectDhikr = (id: string) => {
    if (matchedIds.includes(id) || wrongPair) return;
    soundEngine.playTap();
    setSelectedDhikrId(id);
    tryMatch(selectedSituationId, id);
  };

  const handleHint = () => {
    soundEngine.playTap();
    const remaining = pairs.find((p) => !matchedIds.includes(p.id));
    if (remaining) {
      setHintId(remaining.id);
      setFeedback(`تلميح: طابق البطاقتين المميزتين باللون الذهبي!`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/50 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adhkar-title"
    >
      <div className="animate-pop-in flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F6B4E]/12 text-[#0F6B4E]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h2 id="adhkar-title" className="text-lg font-bold text-[#1C2A24] sm:text-xl">
                تحدي بطاقات الأذكار والآداب
              </h2>
              <p className="text-xs font-medium text-[#52665C] tabular-nums">
                الأزواج المطابقة: {matchedIds.length} / {pairs.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isDone && (
              <button
                type="button"
                onClick={handleHint}
                className="flex h-11 items-center gap-1.5 rounded-xl border border-[#C78318]/35 bg-[#C78318]/10 px-3.5 text-sm font-bold text-[#9A6008] hover:bg-[#C78318]/20"
              >
                <HelpCircle className="h-4 w-4" />
                <span>تلميح</span>
              </button>
            )}
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

        {/* Lesson Banner */}
        <div
          className={`border-b px-5 py-3 text-sm font-semibold ${
            isDone
              ? 'border-[#0F6B4E]/20 bg-[#E6F4EE] text-[#0F6B4E]'
              : wrongPair
                ? 'border-[#C2412D]/20 bg-[#FCECE9] text-[#9E2E1D]'
                : 'border-[#1C2A24]/10 bg-[#F3EDE0] text-[#2B3D34]'
          }`}
        >
          {feedback}
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {!isDone ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#475B51]">الموقف اليومي</h3>
                {pairs.map((p) => {
                  const matched = matchedIds.includes(p.id);
                  const selected = selectedSituationId === p.id;
                  const hinted = hintId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={matched}
                      onClick={() => handleSelectSituation(p.id)}
                      className={`flex min-h-14 w-full items-center justify-between rounded-xl border px-4 py-3 text-right text-sm font-bold transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                        matched
                          ? 'border-[#0F6B4E]/30 bg-[#E6F4EE] text-[#0F6B4E]'
                          : selected
                            ? wrongPair
                              ? 'border-[#C2412D] bg-[#FCECE9] text-[#9E2E1D]'
                              : 'border-[#0F6B4E] bg-[#FFFFFF] text-[#0F6B4E] ring-2 ring-[#0F6B4E]/25 scale-[1.01]'
                            : hinted
                              ? 'border-[#C78318] bg-[#FFF8E6] text-[#1C2A24]'
                              : 'border-[#1C2A24]/15 bg-[#FFFFFF] text-[#1C2A24] hover:bg-[#F3EDE0]'
                      }`}
                    >
                      <span>{p.situation}</span>
                      {matched && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#475B51]">الذكر النبوي</h3>
                {shuffledAdhkar.map((p) => {
                  const matched = matchedIds.includes(p.id);
                  const selected = selectedDhikrId === p.id;
                  const hinted = hintId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={matched}
                      onClick={() => handleSelectDhikr(p.id)}
                      className={`flex min-h-14 w-full items-center justify-between rounded-xl border px-4 py-3 text-right text-sm font-bold transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                        matched
                          ? 'border-[#0F6B4E]/30 bg-[#E6F4EE] text-[#0F6B4E]'
                          : selected
                            ? wrongPair
                              ? 'border-[#C2412D] bg-[#FCECE9] text-[#9E2E1D]'
                              : 'border-[#0F6B4E] bg-[#FFFFFF] text-[#0F6B4E] ring-2 ring-[#0F6B4E]/25 scale-[1.01]'
                            : hinted
                              ? 'border-[#C78318] bg-[#FFF8E6] text-[#1C2A24]'
                              : 'border-[#1C2A24]/15 bg-[#FFFFFF] text-[#1C2A24] hover:bg-[#F3EDE0]'
                      }`}
                    >
                      <span className="font-display text-base">{p.dhikr}</span>
                      {matched && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#0F6B4E]/25 bg-[#FFFFFF] p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F6B4E]/12 text-[#0F6B4E]">
                <Check className="h-9 w-9" />
              </div>
              <h3 className="text-xl font-bold text-[#1C2A24]">
                ما شاء الله! حفظت فُلَّة أذكار اليوم
              </h3>
              <p className="max-w-md text-sm leading-relaxed text-[#475B51]">
                ذكر الله في كل أوقاتنا يحفظنا ويجعل يومنا مليئاً بالبركة والطمأنينة.
              </p>
              <button
                type="button"
                onClick={() => onComplete(hintId ? 0 : 3)}
                className="mt-2 flex min-h-12 items-center gap-2 rounded-xl bg-[#0F6B4E] px-7 py-3 text-base font-bold text-white shadow-sm hover:bg-[#0B573F]"
              >
                <span>استلام النجوم والعودة</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
