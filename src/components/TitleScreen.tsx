import React, { useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { getLevelProgress } from '../data/challenges';
import { SaveProgress } from '../types/game';
import { FollaAvatar } from './FollaAvatar';

interface TitleScreenProps {
  save: SaveProgress;
  isMuted: boolean;
  onToggleMute: () => void;
  onStart: () => void;
  onResetSave: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  save,
  isMuted,
  onToggleMute,
  onStart,
  onResetSave,
}) => {
  const [backdropFailed, setBackdropFailed] = useState(false);
  const hasExistingProgress =
    save.day > 1 ||
    save.points > 0 ||
    save.totalChallengesWon > 0 ||
    save.earnedBadges.length > 0;

  const { current } = getLevelProgress(save.points);

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-[#FAF6EE] text-[#1C2A24] select-none">
      {/* Illustrated Key-Art Backdrop */}
      {!backdropFailed ? (
        <img
          src="/src/assets/images/folla_title_courtyard_1795025923131.jpg"
          alt="حديقة فُلَّة المشرقة"
          referrerPolicy="no-referrer"
          onError={() => setBackdropFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #F6EFE0 0%, #E7F0E9 55%, #DCE9E2 100%)',
          }}
        />
      )}

      {/* Measured contrast scrim over the right/start half in RTL */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(270deg, rgba(250, 246, 238, 0.94) 0%, rgba(250, 246, 238, 0.84) 44%, rgba(250, 246, 238, 0.25) 78%, rgba(250, 246, 238, 0.08) 100%)',
        }}
      />

      {/* Top-left subtle audio toggle */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'تشغيل الصوت' : 'كتم الصوت'}
          className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FAF6EE]/90 px-3.5 text-sm font-semibold text-[#1C2A24] shadow-sm transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B4E]"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4 text-[#C2412D]" />
          ) : (
            <Volume2 className="h-4 w-4 text-[#0F6B4E]" />
          )}
          <span className="whitespace-nowrap">
            {isMuted ? 'الصوت مكتوم' : 'الصوت مفعّل'}
          </span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 flex h-full w-full items-center px-6 py-8 md:px-14 lg:px-20">
        <div className="flex w-full max-w-xl flex-col items-start gap-6">
          {/* Bespoke SVG Title Lockup & Geometric Emblem */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#C78318]/30 bg-[#FAF6EE] shadow-sm">
              <svg viewBox="0 0 64 64" className="h-11 w-11" aria-hidden="true">
                <rect
                  x="16"
                  y="16"
                  width="32"
                  height="32"
                  rx="3"
                  fill="none"
                  stroke="#0F6B4E"
                  strokeWidth="2.5"
                />
                <rect
                  x="16"
                  y="16"
                  width="32"
                  height="32"
                  rx="3"
                  transform="rotate(45 32 32)"
                  fill="none"
                  stroke="#C78318"
                  strokeWidth="2.5"
                />
                <circle cx="32" cy="32" r="7" fill="#0F6B4E" />
                <path
                  d="M34.5 28.5a4.5 4.5 0 1 0 0 7 3.6 3.6 0 1 1 0-7z"
                  fill="#FAF6EE"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-[#0F6B4E]">
                لعبة تفاعلية للأطفال · مبادئ الدين والأخلاق
              </p>
              <h1
                className="font-display mt-0.5 text-4xl font-bold leading-tight text-[#1C2A24] md:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                حديقة فُلَّة
              </h1>
            </div>
          </div>

          <p className="max-w-md text-base leading-relaxed text-[#2F4239] md:text-lg">
            رافق الطفلة{' '}
            <strong className="font-bold text-[#0F6B4E]">فُلَّة</strong> في
            يومها، وخصّص إطلالتها وتعلّم معها العبادات وقصص الأنبياء واجمع الشارات والمستويات.
          </p>

          {/* Compact Folla Live Customized Medallion Preview */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#1C2A24]/10 bg-[#FFFFFF]/90 p-3.5 shadow-sm">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-[#0F6B4E]/30 bg-[#FAF6EE]">
              <FollaAvatar appearance={save.appearance} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-[#1C2A24]">
                مرحباً! أنا فُلَّة
              </span>
              <span className="text-xs font-medium text-[#52665C] tabular-nums">
                {hasExistingProgress
                  ? `المستوى ${current.level} (${current.title}) · ${save.points} نقطة · ${save.earnedBadges.length} شارة`
                  : 'تحديات تفاعلية · قصص الأنبياء · تخصيص الشخصية · شارات ومستويات'}
              </span>
            </div>
          </div>

          {/* Primary Start CTA + Optional Reset */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={onStart}
              className="flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#0F6B4E] px-8 py-3.5 text-lg font-bold text-white shadow-md transition-transform duration-150 hover:scale-[1.02] hover:bg-[#0B573F] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B4E] whitespace-nowrap shrink-0"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>{hasExistingProgress ? 'متابعة اللعب' : 'ابدأ اللعب'}</span>
            </button>

            {hasExistingProgress && (
              <button
                type="button"
                onClick={onResetSave}
                className="flex min-h-11 items-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FAF6EE] px-4 py-2.5 text-sm font-semibold text-[#475B51] transition-colors duration-150 hover:bg-[#EFE7D6] hover:text-[#1C2A24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B4E] whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
                <span>رحلة جديدة</span>
              </button>
            )}
          </div>

          {/* Single flat control-hint line */}
          <p className="text-xs font-medium text-[#4A5E54]">
            انقر على محطات الغرفة وقصص الأنبياء · الأسهم للعبة الصدقة · Enter للبدء · Esc للإيقاف المؤقت
          </p>
        </div>
      </div>
    </div>
  );
};
