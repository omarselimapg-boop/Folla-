import React, { useState } from 'react';
import { Check, Lock, Palette, Sparkles, Star, X } from 'lucide-react';
import {
  HAIR_STYLE_OPTIONS,
  OUTFIT_OPTIONS,
  SKIN_TONES,
} from '../data/challenges';
import {
  FollaAppearance,
  HairStyleId,
  OutfitId,
  SkinToneId,
} from '../types/game';
import { FollaAvatar } from './FollaAvatar';

interface AppearanceCustomizerProps {
  stars: number;
  appearance: FollaAppearance;
  unlockedOutfits: OutfitId[];
  unlockedHairStyles: HairStyleId[];
  onChangeSkinTone: (tone: SkinToneId) => void;
  onSelectOrUnlockHair: (style: HairStyleId) => void;
  onSelectOrUnlockOutfit: (outfit: OutfitId) => void;
  onClose: () => void;
}

type CustomizerTab = 'skin' | 'hair' | 'outfit';

export const AppearanceCustomizer: React.FC<AppearanceCustomizerProps> = ({
  stars,
  appearance,
  unlockedOutfits,
  unlockedHairStyles,
  onChangeSkinTone,
  onSelectOrUnlockHair,
  onSelectOrUnlockOutfit,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('outfit');

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/50 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-title"
    >
      <div className="animate-pop-in flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F6B4E]/12 text-[#0F6B4E]">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <h2 id="customizer-title" className="text-lg font-bold text-[#1C2A24] sm:text-xl">
                تخصيص مظهر فُلَّة
              </h2>
              <p className="text-xs font-medium text-[#52665C]">
                اختر لون البشرة، الحجاب أو التسريحة، والملابس الإسلامية الجميلة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-[#C78318]/12 px-3 py-1.5 text-sm font-bold text-[#9A6008]">
              <Star className="h-4 w-4 fill-[#C78318] text-[#C78318]" />
              <span className="font-mono-num tabular-nums">{stars}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق التخصيص"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Split Layout: Live Preview + Options */}
        <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto p-5 md:grid-cols-[260px_1fr]">
          {/* Live Folla Preview */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#1C2A24]/10 bg-[#FFFFFF] p-4">
            <div className="h-60 w-52 overflow-hidden rounded-t-[100px] rounded-b-2xl border-4 border-[#0F6B4E]/35 bg-[#FAF6EE] shadow-sm">
              <FollaAvatar appearance={appearance} />
            </div>
            <div className="text-center">
              <div className="text-base font-bold text-[#1C2A24]">إطلالة فُلَّة الحالية</div>
              <div className="text-xs text-[#52665C]">
                تظهر هذه الإطلالة في الغرفة وشاشة البداية
              </div>
            </div>
          </div>

          {/* Customization Controls */}
          <div className="flex flex-col gap-4">
            {/* Segmented Tab Bar */}
            <div className="flex items-center gap-1.5 rounded-xl bg-[#EFE7D6] p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('outfit')}
                className={`min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'outfit'
                    ? 'bg-[#FFFFFF] text-[#0F6B4E] shadow-sm'
                    : 'text-[#475B51] hover:text-[#1C2A24]'
                }`}
              >
                الملابس التراثية
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('hair')}
                className={`min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'hair'
                    ? 'bg-[#FFFFFF] text-[#0F6B4E] shadow-sm'
                    : 'text-[#475B51] hover:text-[#1C2A24]'
                }`}
              >
                الحجاب والتسريحات
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('skin')}
                className={`min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'skin'
                    ? 'bg-[#FFFFFF] text-[#0F6B4E] shadow-sm'
                    : 'text-[#475B51] hover:text-[#1C2A24]'
                }`}
              >
                لون البشرة
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'outfit' && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {OUTFIT_OPTIONS.map((item) => {
                  const isUnlocked = unlockedOutfits.includes(item.id);
                  const isSelected = appearance.outfit === item.id;
                  const canAfford = stars >= item.cost;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!isUnlocked && !canAfford}
                      onClick={() => onSelectOrUnlockOutfit(item.id)}
                      className={`flex min-h-20 items-center justify-between gap-3 rounded-xl border p-3.5 text-right transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                        isSelected
                          ? 'border-[#0F6B4E] bg-[#E6F4EE] ring-2 ring-[#0F6B4E]/20'
                          : 'border-[#1C2A24]/12 bg-[#FFFFFF] hover:bg-[#F5EFE2]'
                      } ${!isUnlocked && !canAfford ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-10 w-10 shrink-0 rounded-xl border-2"
                          style={{
                            backgroundColor: item.primaryColor,
                            borderColor: item.trimColor,
                          }}
                        />
                        <div>
                          <div className="text-sm font-bold text-[#1C2A24]">{item.name}</div>
                          <div className="text-xs text-[#52665C]">{item.description}</div>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-bold">
                        {isSelected ? (
                          <Check className="h-5 w-5 text-[#0F6B4E]" />
                        ) : isUnlocked ? (
                          <span className="text-[#0F6B4E]">اختيار</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#9A6008] tabular-nums">
                            <Lock className="h-3.5 w-3.5" />
                            {item.cost} ★
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'hair' && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {HAIR_STYLE_OPTIONS.map((item) => {
                  const isUnlocked = unlockedHairStyles.includes(item.id);
                  const isSelected = appearance.hairStyle === item.id;
                  const canAfford = stars >= item.cost;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!isUnlocked && !canAfford}
                      onClick={() => onSelectOrUnlockHair(item.id)}
                      className={`flex min-h-18 items-center justify-between gap-3 rounded-xl border p-3.5 text-right transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                        isSelected
                          ? 'border-[#0F6B4E] bg-[#E6F4EE] ring-2 ring-[#0F6B4E]/20'
                          : 'border-[#1C2A24]/12 bg-[#FFFFFF] hover:bg-[#F5EFE2]'
                      } ${!isUnlocked && !canAfford ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2"
                          style={{
                            backgroundColor: item.primaryColor,
                            borderColor: item.accentColor,
                          }}
                        >
                          <Sparkles className="h-4 w-4" style={{ color: item.accentColor }} />
                        </span>
                        <div>
                          <div className="text-sm font-bold text-[#1C2A24]">{item.name}</div>
                          <div className="text-xs text-[#52665C]">{item.category}</div>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-bold">
                        {isSelected ? (
                          <Check className="h-5 w-5 text-[#0F6B4E]" />
                        ) : isUnlocked ? (
                          <span className="text-[#0F6B4E]">اختيار</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#9A6008] tabular-nums">
                            <Lock className="h-3.5 w-3.5" />
                            {item.cost} ★
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'skin' && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SKIN_TONES.map((tone) => {
                  const isSelected = appearance.skinTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => onChangeSkinTone(tone.id)}
                      className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border p-3.5 text-right transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-[#0F6B4E] ${
                        isSelected
                          ? 'border-[#0F6B4E] bg-[#E6F4EE] ring-2 ring-[#0F6B4E]/20'
                          : 'border-[#1C2A24]/12 bg-[#FFFFFF] hover:bg-[#F5EFE2]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-9 w-9 shrink-0 rounded-full border border-[#1C2A24]/20"
                          style={{ backgroundColor: tone.base }}
                        />
                        <span className="text-sm font-bold text-[#1C2A24]">{tone.name}</span>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-[#0F6B4E]" />}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-auto flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
              >
                <span>حفظ الإطلالة والعودة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
