import React, { useState } from 'react';
import {
  BookHeart,
  BookOpen,
  Brush,
  Check,
  Droplets,
  Gift,
  HeartHandshake,
  Lamp,
  Mic,
  Palette,
  ScrollText,
  Smile,
  Sparkles,
  Sprout,
  Star,
} from 'lucide-react';
import {
  CHALLENGES_META,
  PROPHET_STORIES,
  ROOM_KEEPSAKES,
  WARDROBE_THEMES,
} from '../data/challenges';
import {
  ChallengeId,
  FloatingFeedback,
  MeterKey,
  SaveProgress,
  TimeOfDay,
} from '../types/game';
import { FollaAvatar } from './FollaAvatar';

interface FollaSanctuaryProps {
  save: SaveProgress;
  timeOfDay: TimeOfDay;
  dialogue: string;
  follaBounce: boolean;
  floatingItems: FloatingFeedback[];
  onQuickCare: (action: 'smile' | 'water' | 'dhikr') => void;
  onStartChallenge: (id: ChallengeId) => void;
  onOpenProphetsStories: () => void;
  onOpenCustomizer: () => void;
  onOpenStudio: () => void;
  onFinishDay: () => void;
}

const CHALLENGE_ICONS: Record<ChallengeId, React.ReactNode> = {
  wudu: <Droplets className="h-5 w-5 text-[#0E7490]" />,
  charity_catch: <HeartHandshake className="h-5 w-5 text-[#C78318]" />,
  adhkar_cards: <Sparkles className="h-5 w-5 text-[#0F6B4E]" />,
  values_story: <BookHeart className="h-5 w-5 text-[#B85D6F]" />,
  words_light: <BookOpen className="h-5 w-5 text-[#6D4C9E]" />,
  recite_ayahs: <Mic className="h-5 w-5 text-[#0F6B4E]" />,
};

const TIME_TINTS: Record<TimeOfDay, string> = {
  morning: 'rgba(255, 248, 232, 0.08)',
  noon: 'rgba(255, 255, 255, 0.0)',
  afternoon: 'rgba(235, 195, 130, 0.12)',
  evening: 'rgba(28, 42, 58, 0.22)',
};

const FEEDBACK_COLORS: Record<MeterKey | 'stars' | 'points', string> = {
  purity: 'text-[#0E7490]',
  faith: 'text-[#0F6B4E]',
  manners: 'text-[#9A6008]',
  knowledge: 'text-[#6D4C9E]',
  stars: 'text-[#C78318]',
  points: 'text-[#0F6B4E]',
};

export const FollaSanctuary: React.FC<FollaSanctuaryProps> = ({
  save,
  timeOfDay,
  dialogue,
  follaBounce,
  floatingItems,
  onQuickCare,
  onStartChallenge,
  onOpenProphetsStories,
  onOpenCustomizer,
  onOpenStudio,
  onFinishDay,
}) => {
  const [roomBgFailed, setRoomBgFailed] = useState(false);

  const activeTheme =
    WARDROBE_THEMES.find((t) => t.id === save.activeWardrobe) ||
    WARDROBE_THEMES[0];

  const unlockedKeepsakesList = ROOM_KEEPSAKES.filter((k) =>
    save.unlockedKeepsakes.includes(k.id)
  );

  const dayGoalMet = save.completedToday.length >= 3;

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-[#F4ECE0] select-none">
      {/* Sanctuary Room Backdrop */}
      {!roomBgFailed ? (
        <img
          src="/src/assets/images/folla_room_sanctuary_1795025923689.jpg"
          alt="غرفة فُلَّة المشرقة"
          referrerPolicy="no-referrer"
          onError={() => setRoomBgFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #EFE5D3 0%, #F7F1E6 65%, #DFD1B8 100%)',
          }}
        />
      )}

      {/* Subtle Time-of-Day Ambient Lighting */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-300"
        style={{ backgroundColor: TIME_TINTS[timeOfDay] }}
      />

      {/* Soft bottom vignette so bottom challenge dock remains crisp */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56"
        style={{
          background:
            'linear-gradient(0deg, rgba(28, 42, 36, 0.58) 0%, rgba(28, 42, 36, 0.18) 55%, rgba(28, 42, 36, 0) 100%)',
        }}
      />

      {/* Center Playfield Stage */}
      <main className="relative z-10 flex h-full w-full flex-col items-center justify-between pt-24 pb-4 px-3 sm:pt-24 sm:pb-5 sm:px-6">
        {/* Unlocked Room Keepsakes Shelf & Finish Day */}
        <div className="flex w-full max-w-6xl items-start justify-between gap-2">
          {unlockedKeepsakesList.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FAF6EE]/92 px-3 py-2 shadow-sm">
              <span className="text-xs font-bold text-[#475B51]">تذكارات الغرفة:</span>
              {unlockedKeepsakesList.map((item) => (
                <div
                  key={item.id}
                  title={item.meaning}
                  className="flex items-center gap-1.5 rounded-lg bg-[#FFFFFF] px-2.5 py-1 text-xs font-bold text-[#1C2A24] border border-[#1C2A24]/10"
                >
                  {item.iconKey === 'lantern' && <Lamp className="h-3.5 w-3.5 text-[#C78318]" />}
                  {item.iconKey === 'olive' && <Sprout className="h-3.5 w-3.5 text-[#0F6B4E]" />}
                  {item.iconKey === 'charity_box' && <Gift className="h-3.5 w-3.5 text-[#B85D6F]" />}
                  {item.iconKey === 'prayer_mat' && <Sparkles className="h-3.5 w-3.5 text-[#1E6B8A]" />}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div />
          )}

          {dayGoalMet && (
            <button
              type="button"
              onClick={onFinishDay}
              className="animate-pop-in flex min-h-11 items-center gap-2 rounded-xl bg-[#C78318] px-4 py-2 text-sm font-bold text-white shadow-md transition-transform duration-150 hover:scale-[1.03] hover:bg-[#AD7011] focus-visible:outline-2 focus-visible:outline-white whitespace-nowrap shrink-0"
            >
              <Star className="h-4 w-4 fill-current" />
              <span>إنهاء اليوم {save.day}</span>
            </button>
          )}
        </div>

        {/* Center Hero: Live Customized Folla Avatar + Dialogue + Quick Care */}
        <div className="relative flex flex-col items-center gap-3 my-auto">
          {/* Speech Bubble */}
          <div className="max-w-md rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE]/96 px-5 py-2.5 text-center shadow-md">
            <p className="text-sm font-bold leading-relaxed text-[#1C2A24] sm:text-base">
              {dialogue}
            </p>
          </div>

          {/* Floating Positive Feedback Numbers */}
          <div className="pointer-events-none relative h-0 w-full flex justify-center">
            {floatingItems.map((item) => (
              <span
                key={item.id}
                className={`animate-pop-in absolute -top-2 text-sm font-extrabold drop-shadow-sm ${FEEDBACK_COLORS[item.meter]}`}
              >
                {item.text}
              </span>
            ))}
          </div>

          {/* Folla Framed Live Customized Avatar */}
          <div
            onClick={() => onQuickCare('smile')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onQuickCare('smile');
              }
            }}
            aria-label="فُلَّة - اضغط للتفاعل وإلقاء السلام"
            className={`group relative cursor-pointer rounded-t-[96px] rounded-b-3xl border-4 bg-[#FAF6EE] p-1.5 shadow-lg transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F6B4E] ${
              follaBounce ? 'scale-105 -translate-y-1.5' : 'animate-gentle-float hover:scale-[1.02]'
            }`}
            style={{
              borderColor: activeTheme.ringColor,
              backgroundColor: '#FAF6EE',
            }}
          >
            <div
              className="h-44 w-40 overflow-hidden rounded-t-[88px] rounded-b-2xl sm:h-52 sm:w-48"
              style={{ backgroundColor: activeTheme.frameTint }}
            >
              <FollaAvatar appearance={save.appearance} />
            </div>
          </div>

          {/* Direct Nurturing Quick-Care Controls + Customizer Shortcut */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onQuickCare('smile')}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FAF6EE]/95 px-3.5 py-2 text-xs font-bold text-[#1C2A24] shadow-sm transition-transform duration-150 hover:scale-[1.03] hover:bg-[#FFFFFF] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] whitespace-nowrap"
            >
              <Smile className="h-4 w-4 text-[#C78318]" />
              <span>السلام والابتسام</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickCare('water')}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FAF6EE]/95 px-3.5 py-2 text-xs font-bold text-[#1C2A24] shadow-sm transition-transform duration-150 hover:scale-[1.03] hover:bg-[#FFFFFF] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] whitespace-nowrap"
            >
              <Droplets className="h-4 w-4 text-[#0E7490]" />
              <span>شرب الماء بسم الله</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickCare('dhikr')}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FAF6EE]/95 px-3.5 py-2 text-xs font-bold text-[#1C2A24] shadow-sm transition-transform duration-150 hover:scale-[1.03] hover:bg-[#FFFFFF] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] whitespace-nowrap"
            >
              <Sparkles className="h-4 w-4 text-[#0F6B4E]" />
              <span>تسبيح وذكر</span>
            </button>

            <button
              type="button"
              onClick={onOpenCustomizer}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-[#0F6B4E]/30 bg-[#E6F4EE]/95 px-3.5 py-2 text-xs font-bold text-[#0F6B4E] shadow-sm transition-transform duration-150 hover:scale-[1.03] hover:bg-[#FFFFFF] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] whitespace-nowrap"
            >
              <Palette className="h-4 w-4" />
              <span>تغيير المظهر</span>
            </button>

            <button
              type="button"
              onClick={onOpenStudio}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-[#B85D6F]/30 bg-[#FDF0F3]/95 px-3.5 py-2 text-xs font-bold text-[#9E3E52] shadow-sm transition-transform duration-150 hover:scale-[1.03] hover:bg-[#FFFFFF] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] whitespace-nowrap"
            >
              <Brush className="h-4 w-4" />
              <span>مرسم القيم</span>
            </button>
          </div>
        </div>

        {/* Bottom Interactive Stations Dock: 5 Challenges + Prophets' Stories */}
        <section
          aria-label="تحديات اليوم وقصص الأنبياء"
          className="w-full max-w-6xl rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE]/95 p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#1C2A24]">
              تحديات اليوم وقصص الأنبياء
            </h2>
            <span className="text-xs font-semibold text-[#52665C] tabular-nums">
              أُنجز {save.completedToday.length} من 3 تحديات لإنهاء اليوم
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {CHALLENGES_META.map((ch) => {
              const isDone = save.completedToday.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => onStartChallenge(ch.id)}
                  className={`flex min-h-16 flex-col items-start justify-between gap-1.5 rounded-xl border p-2.5 text-right transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                    isDone
                      ? 'border-[#0F6B4E]/35 bg-[#E6F4EE]'
                      : 'border-[#1C2A24]/12 bg-[#FFFFFF] hover:border-[#0F6B4E]/50'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-1.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF6EE] border border-[#1C2A24]/10">
                      {CHALLENGE_ICONS[ch.id]}
                    </span>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#0F6B4E]">
                        <Check className="h-3.5 w-3.5" />
                        <span>مكتمل</span>
                      </span>
                    ) : (
                      <span className="font-mono-num text-[11px] font-bold text-[#9A6008] tabular-nums">
                        +{ch.rewardStars} ★
                      </span>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="truncate text-xs font-bold text-[#1C2A24]">
                      {ch.title}
                    </div>
                    <div className="truncate text-[11px] text-[#52665C]">
                      يرفع: {ch.meterLabel} · +{ch.rewardPoints} ن
                    </div>
                  </div>
                </button>
              );
            })}

            {/* 6th Station: Prophets' Stories Section */}
            <button
              type="button"
              onClick={onOpenProphetsStories}
              className="flex min-h-16 flex-col items-start justify-between gap-1.5 rounded-xl border border-[#1E6B8A]/35 bg-[#EDF6FA] p-2.5 text-right transition-transform duration-150 hover:-translate-y-0.5 hover:border-[#1E6B8A] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#1E6B8A]"
            >
              <div className="flex w-full items-center justify-between gap-1.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFFFFF] border border-[#1E6B8A]/20">
                  <ScrollText className="h-5 w-5 text-[#1E6B8A]" />
                </span>
                <span className="font-mono-num text-[11px] font-bold text-[#1E6B8A] tabular-nums">
                  {save.completedProphetStories.length}/{PROPHET_STORIES.length}
                </span>
              </div>

              <div className="w-full">
                <div className="truncate text-xs font-bold text-[#1C2A24]">
                  قصص الأنبياء
                </div>
                <div className="truncate text-[11px] text-[#1E6B8A] font-semibold">
                  حكايات مصورة وأسئلة
                </div>
              </div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
