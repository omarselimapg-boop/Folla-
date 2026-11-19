import React from 'react';
import { Check, Lock, Star, X, Lamp, Sprout, Gift, Sparkles } from 'lucide-react';
import { ROOM_KEEPSAKES, WARDROBE_THEMES } from '../data/challenges';
import { RoomKeepsake } from '../types/game';

interface KeepsakeDrawerProps {
  stars: number;
  unlockedWardrobes: string[];
  activeWardrobe: string;
  unlockedKeepsakes: string[];
  onClose: () => void;
  onUnlockOrSelectWardrobe: (id: string) => void;
  onUnlockKeepsake: (id: string) => void;
}

const KEEPSAKE_ICONS: Record<RoomKeepsake['iconKey'], React.ReactNode> = {
  lantern: <Lamp className="h-6 w-6 text-[#C78318]" />,
  olive: <Sprout className="h-6 w-6 text-[#0F6B4E]" />,
  charity_box: <Gift className="h-6 w-6 text-[#B85D6F]" />,
  prayer_mat: <Sparkles className="h-6 w-6 text-[#1E6B8A]" />,
  quran_stand: <Sparkles className="h-6 w-6 text-[#0F6B4E]" />,
  books: <Sparkles className="h-6 w-6 text-[#6D4C9E]" />,
};

export const KeepsakeDrawer: React.FC<KeepsakeDrawerProps> = ({
  stars,
  unlockedWardrobes,
  activeWardrobe,
  unlockedKeepsakes,
  onClose,
  onUnlockOrSelectWardrobe,
  onUnlockKeepsake,
}) => {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keepsakes-title"
    >
      <div className="animate-pop-in flex max-h-[88dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-6 py-4">
          <div>
            <h2 id="keepsakes-title" className="text-xl font-bold text-[#1C2A24]">
              خزانة فُلَّة والهدايا
            </h2>
            <p className="text-xs font-medium text-[#52665C]">
              استبدل النجوم الذهبية بألوان لإطلالة فُلَّة وتذكارات تزيّن غرفتها
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-[#C78318]/12 px-3 py-1.5 text-sm font-bold text-[#9A6008]">
              <Star className="h-4 w-4 fill-[#C78318] text-[#C78318]" />
              <span className="font-mono-num tabular-nums">{stars}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] transition-colors hover:bg-[#EFE7D6] focus-visible:outline-2 focus-visible:outline-[#0F6B4E]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Wardrobe Themes */}
          <section>
            <h3 className="mb-3 text-base font-bold text-[#1C2A24]">
              ألوان إطار وإطلالة فُلَّة
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {WARDROBE_THEMES.map((theme) => {
                const isUnlocked = unlockedWardrobes.includes(theme.id);
                const isActive = activeWardrobe === theme.id;
                const canAfford = stars >= theme.cost;

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => onUnlockOrSelectWardrobe(theme.id)}
                    disabled={!isUnlocked && !canAfford}
                    className={`flex min-h-14 items-center justify-between rounded-xl border p-3.5 text-right transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                      isActive
                        ? 'border-[#0F6B4E] bg-[#FFFFFF] ring-2 ring-[#0F6B4E]/20'
                        : 'border-[#1C2A24]/12 bg-[#FFFFFF] hover:bg-[#F5EFE2]'
                    } ${!isUnlocked && !canAfford ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-8 w-8 shrink-0 rounded-lg border border-black/10"
                        style={{ backgroundColor: theme.ringColor }}
                      />
                      <div>
                        <div className="text-sm font-bold text-[#1C2A24]">
                          {theme.name}
                        </div>
                        <div className="text-xs text-[#52665C] tabular-nums">
                          {isActive
                            ? 'مُختار حالياً'
                            : isUnlocked
                              ? 'متاح للاختيار'
                              : `${theme.cost} نجمة`}
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0">
                      {isActive ? (
                        <Check className="h-5 w-5 text-[#0F6B4E]" />
                      ) : isUnlocked ? (
                        <span className="text-xs font-bold text-[#0F6B4E]">تفعيل</span>
                      ) : (
                        <Lock className="h-4 w-4 text-[#73857B]" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Room Keepsakes */}
          <section>
            <h3 className="mb-3 text-base font-bold text-[#1C2A24]">
              تذكارات الغرفة والقيم
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ROOM_KEEPSAKES.map((item) => {
                const isUnlocked = unlockedKeepsakes.includes(item.id);
                const canAfford = stars >= item.cost;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onUnlockKeepsake(item.id)}
                    disabled={isUnlocked || !canAfford}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 text-right transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                      isUnlocked
                        ? 'border-[#0F6B4E]/35 bg-[#E9F3EE]'
                        : 'border-[#1C2A24]/12 bg-[#FFFFFF] hover:bg-[#F5EFE2]'
                    } ${!isUnlocked && !canAfford ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FAF6EE] border border-[#1C2A24]/10">
                      {KEEPSAKE_ICONS[item.iconKey]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#1C2A24]">
                          {item.name}
                        </span>
                        <span className="text-xs font-bold tabular-nums text-[#9A6008]">
                          {isUnlocked ? 'في الغرفة' : `${item.cost} نجمة`}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[#475B51]">
                        {item.meaning}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
