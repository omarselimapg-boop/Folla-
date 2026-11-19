import React from 'react';
import {
  Award,
  BookOpen,
  Check,
  Droplets,
  Heart,
  Lock,
  Mic,
  Palette,
  Scale,
  ScrollText,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { BADGES, LEVELS, getLevelProgress } from '../data/challenges';
import { BadgeDefinition, SaveProgress } from '../types/game';

interface RewardsModalProps {
  save: SaveProgress;
  onClose: () => void;
}

const BADGE_ICONS: Record<BadgeDefinition['iconType'], React.ReactNode> = {
  droplet: <Droplets className="h-6 w-6" />,
  heart: <Heart className="h-6 w-6" />,
  sparkle: <Sparkles className="h-6 w-6" />,
  scale: <Scale className="h-6 w-6" />,
  book: <BookOpen className="h-6 w-6" />,
  scroll: <ScrollText className="h-6 w-6" />,
  star: <Star className="h-6 w-6" />,
  palette: <Palette className="h-6 w-6" />,
  mic: <Mic className="h-6 w-6" />,
};

export const RewardsModal: React.FC<RewardsModalProps> = ({ save, onClose }) => {
  const { current, next, progressPct } = getLevelProgress(save.points);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/50 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rewards-title"
    >
      <div className="animate-pop-in flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C78318]/15 text-[#9A6008]">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h2 id="rewards-title" className="text-lg font-bold text-[#1C2A24] sm:text-xl">
                لوحة المكافآت والشارات والمستويات
              </h2>
              <p className="text-xs font-medium text-[#52665C] tabular-nums">
                اجمع النقاط عبر التحديات وقصص الأنبياء لترتقي بمستواك وتفتح جميع الشارات
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق لوحة المكافآت"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          {/* Level & Points Hero Banner */}
          <section className="rounded-2xl border border-[#0F6B4E]/20 bg-[#FFFFFF] p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#0F6B4E] text-white">
                  <span className="text-[11px] font-semibold opacity-85">المستوى</span>
                  <span className="font-mono-num text-2xl font-extrabold tabular-nums">
                    {current.level}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1C2A24]">{current.title}</h3>
                  <p className="mt-0.5 text-sm font-semibold text-[#52665C] tabular-nums">
                    مجموع النقاط: <span className="font-mono-num text-[#0F6B4E]">{save.points}</span> نقطة
                    <span className="mx-2 text-[#1C2A24]/25">·</span>
                    الشارات المكتسبة: <span className="font-mono-num text-[#9A6008]">{save.earnedBadges.length} / {BADGES.length}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-[#C78318]/12 px-4 py-2 text-sm font-bold text-[#9A6008]">
                <Star className="h-5 w-5 fill-[#C78318] text-[#C78318]" />
                <span className="font-mono-num tabular-nums">{save.stars} نجمة متاحة</span>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-[#475B51]">
                <span>
                  {next
                    ? `التقدم نحو المستوى ${next.level} (${next.title})`
                    : 'بلغت أعلى مستوى في حديقة فُلَّة!'}
                </span>
                <span className="font-mono-num tabular-nums">
                  {next ? `${save.points} / ${next.minPoints} نقطة` : `${save.points} نقطة`}
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-[#EFE7D6]">
                <div
                  className="h-full rounded-full bg-[#0F6B4E] transition-transform duration-300 origin-right"
                  style={{ transform: `scaleX(${Math.max(0.03, progressPct / 100)})` }}
                />
              </div>
            </div>

            {/* Level Ladder Preview */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {LEVELS.map((lvl) => {
                const reached = save.points >= lvl.minPoints;
                return (
                  <div
                    key={lvl.level}
                    className={`rounded-xl border px-3 py-2 text-center ${
                      reached
                        ? 'border-[#0F6B4E]/35 bg-[#E6F4EE] text-[#0F6B4E]'
                        : 'border-[#1C2A24]/10 bg-[#FAF6EE] text-[#6B7E74]'
                    }`}
                  >
                    <div className="font-mono-num text-xs font-bold tabular-nums">
                      م {lvl.level}
                    </div>
                    <div className="truncate text-xs font-bold">{lvl.title}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Collectible Badges Grid */}
          <section>
            <h3 className="mb-3 text-base font-bold text-[#1C2A24]">
              الشارات الإسلامية ({save.earnedBadges.length} من {BADGES.length})
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {BADGES.map((badge) => {
                const earned = save.earnedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-3.5 rounded-xl border p-4 transition-colors ${
                      earned
                        ? 'border-[#0F6B4E]/30 bg-[#FFFFFF] shadow-sm'
                        : 'border-[#1C2A24]/10 bg-[#EFE7D6]/60 opacity-75'
                    }`}
                  >
                    <div
                      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2"
                      style={{
                        backgroundColor: earned ? `${badge.color}18` : '#E5DDD0',
                        borderColor: earned ? badge.color : 'rgba(28,42,36,0.15)',
                        color: earned ? badge.color : '#73857B',
                      }}
                    >
                      {BADGE_ICONS[badge.iconType]}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#1C2A24]">
                          {badge.title}
                        </span>
                        {earned ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-[#0F6B4E]">
                            <Check className="h-3.5 w-3.5" />
                            <span>مفتوحة</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-[#73857B]">
                            <Lock className="h-3.5 w-3.5" />
                            <span>مقفلة</span>
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#475B51]">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
