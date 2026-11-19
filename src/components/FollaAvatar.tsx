import React from 'react';
import {
  HAIR_STYLE_OPTIONS,
  OUTFIT_OPTIONS,
  SKIN_TONES,
} from '../data/challenges';
import { FollaAppearance } from '../types/game';

interface FollaAvatarProps {
  appearance: FollaAppearance;
  className?: string;
}

export const FollaAvatar: React.FC<FollaAvatarProps> = ({
  appearance,
  className = 'h-full w-full',
}) => {
  const skin =
    SKIN_TONES.find((s) => s.id === appearance.skinTone) ?? SKIN_TONES[1];
  const hair =
    HAIR_STYLE_OPTIONS.find((h) => h.id === appearance.hairStyle) ??
    HAIR_STYLE_OPTIONS[0];
  const outfit =
    OUTFIT_OPTIONS.find((o) => o.id === appearance.outfit) ?? OUTFIT_OPTIONS[0];

  const isHijab = appearance.hairStyle.startsWith('hijab_');

  return (
    <svg
      viewBox="0 0 220 240"
      className={className}
      role="img"
      aria-label="الطفلة المسلمة فُلَّة"
    >
      {/* Soft warm storybook backdrop */}
      <defs>
        <radialGradient id="follaBgGrad" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="100%" stopColor="#F5ECD9" />
        </radialGradient>
      </defs>
      <rect width="220" height="240" fill="url(#follaBgGrad)" />

      {/* Subtle geometric arch motif behind Folla */}
      <path
        d="M36 240 V106 C36 52 72 22 110 22 C148 22 184 52 184 106 V240 Z"
        fill="none"
        stroke={outfit.trimColor}
        strokeWidth="1.5"
        opacity="0.55"
      />

      {/* Hair Back Layer for non-hijab styles */}
      {!isHijab && appearance.hairStyle === 'braids' && (
        <g stroke="#1E1410" strokeWidth="2.2">
          {/* Left braid */}
          <path
            d="M66 108 C56 132 54 158 58 184"
            fill="none"
            stroke={hair.primaryColor}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <circle cx="58" cy="130" r="6.5" fill={hair.primaryColor} />
          <circle cx="56" cy="146" r="6.5" fill={hair.primaryColor} />
          <circle cx="57" cy="162" r="6" fill={hair.primaryColor} />
          <rect x="52" y="170" width="11" height="5" rx="2.5" fill={hair.accentColor} />

          {/* Right braid */}
          <path
            d="M154 108 C164 132 166 158 162 184"
            fill="none"
            stroke={hair.primaryColor}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <circle cx="162" cy="130" r="6.5" fill={hair.primaryColor} />
          <circle cx="164" cy="146" r="6.5" fill={hair.primaryColor} />
          <circle cx="163" cy="162" r="6" fill={hair.primaryColor} />
          <rect x="157" y="170" width="11" height="5" rx="2.5" fill={hair.accentColor} />
        </g>
      )}

      {!isHijab && appearance.hairStyle === 'bun_ribbon' && (
        <g stroke="#1E1410" strokeWidth="2.2">
          {/* Top bun */}
          <circle cx="110" cy="40" r="22" fill={hair.primaryColor} />
          {/* Ribbon bow */}
          <path
            d="M92 52 Q110 60 128 52 L124 44 Q110 50 96 44 Z"
            fill={hair.accentColor}
          />
          <circle cx="110" cy="49" r="5" fill={hair.accentColor} />
        </g>
      )}

      {!isHijab && appearance.hairStyle === 'wavy_headband' && (
        <g stroke="#1E1410" strokeWidth="2.2">
          <path
            d="M58 95 C46 130 50 165 62 186 C70 176 72 155 72 135 Z"
            fill={hair.primaryColor}
          />
          <path
            d="M162 95 C174 130 170 165 158 186 C150 176 148 155 148 135 Z"
            fill={hair.primaryColor}
          />
        </g>
      )}

      {/* Hijab Back Drape */}
      {isHijab && (
        <path
          d="M54 102 C54 55 80 34 110 34 C140 34 166 55 166 102 C168 145 174 176 172 198 C142 206 78 206 48 198 C46 176 52 145 54 102 Z"
          fill={hair.primaryColor}
          stroke="#2C241E"
          strokeWidth="2.4"
        />
      )}

      {/* Neck */}
      <rect
        x="98"
        y="138"
        width="24"
        height="24"
        rx="8"
        fill={skin.shadow}
        stroke="#2C241E"
        strokeWidth="2"
      />

      {/* Modest Cultural Outfit / Dress Body */}
      <g>
        {/* Main Garment */}
        <path
          d="M52 240 L64 172 C68 156 85 150 110 150 C135 150 152 156 156 172 L168 240 Z"
          fill={outfit.primaryColor}
          stroke="#2C241E"
          strokeWidth="2.5"
        />
        {/* Long modest sleeves */}
        <path
          d="M65 168 L44 218 L63 224 L74 185"
          fill={outfit.primaryColor}
          stroke="#2C241E"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M155 168 L176 218 L157 224 L146 185"
          fill={outfit.primaryColor}
          stroke="#2C241E"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        {/* Sleeve Cuffs */}
        <path d="M45 212 L64 218" stroke={outfit.trimColor} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M175 212 L156 218" stroke={outfit.trimColor} strokeWidth="4.5" strokeLinecap="round" />

        {/* Modest Collar & Cultural Embroidery Panel */}
        <path
          d="M92 152 Q110 165 128 152"
          fill="none"
          stroke={outfit.trimColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {appearance.outfit === 'mint_dress' && (
          <g fill={outfit.trimColor}>
            <circle cx="110" cy="178" r="3" />
            <circle cx="101" cy="186" r="2.3" fill={outfit.patternColor} />
            <circle cx="119" cy="186" r="2.3" fill={outfit.patternColor} />
            <circle cx="110" cy="194" r="3" />
            <path d="M74 202 Q110 212 146 202" fill="none" stroke={outfit.trimColor} strokeWidth="2.5" />
          </g>
        )}

        {appearance.outfit === 'andalus_abaya' && (
          <g>
            <line x1="110" y1="158" x2="110" y2="240" stroke={outfit.trimColor} strokeWidth="3.5" />
            <path
              d="M96 176 L110 168 L124 176 L110 184 Z"
              fill="none"
              stroke={outfit.trimColor}
              strokeWidth="2"
            />
            <path
              d="M96 204 L110 196 L124 204 L110 212 Z"
              fill="none"
              stroke={outfit.trimColor}
              strokeWidth="2"
            />
          </g>
        )}

        {appearance.outfit === 'jasmine_thobe' && (
          <g>
            <rect
              x="93"
              y="164"
              width="34"
              height="62"
              rx="4"
              fill="none"
              stroke={outfit.trimColor}
              strokeWidth="2.5"
            />
            <path
              d="M100 176 L110 169 L120 176 M100 192 L110 185 L120 192 M100 208 L110 201 L120 208"
              fill="none"
              stroke={outfit.patternColor}
              strokeWidth="2.3"
              strokeLinecap="round"
            />
          </g>
        )}

        {appearance.outfit === 'fajr_kaftan' && (
          <g>
            <line x1="110" y1="158" x2="110" y2="240" stroke={outfit.trimColor} strokeWidth="4" />
            <rect
              x="72"
              y="196"
              width="76"
              height="9"
              rx="4"
              fill={outfit.trimColor}
              stroke="#2C241E"
              strokeWidth="1.6"
            />
            <circle cx="110" cy="200.5" r="3.5" fill={outfit.primaryColor} />
          </g>
        )}

        {/* Hands gently folded */}
        <ellipse cx="98" cy="224" rx="10" ry="7.5" fill={skin.base} stroke="#2C241E" strokeWidth="2" />
        <ellipse cx="122" cy="224" rx="10" ry="7.5" fill={skin.base} stroke="#2C241E" strokeWidth="2" />
      </g>

      {/* Head & Face */}
      <ellipse
        cx="110"
        cy="103"
        rx="41"
        ry="43"
        fill={skin.base}
        stroke="#2C241E"
        strokeWidth="2.4"
      />

      {/* Ears for non-hijab hairstyles */}
      {!isHijab && (
        <g fill={skin.base} stroke="#2C241E" strokeWidth="2">
          <ellipse cx="68" cy="105" rx="5.5" ry="8" />
          <ellipse cx="152" cy="105" rx="5.5" ry="8" />
        </g>
      )}

      {/* Cheek Blush */}
      <ellipse cx="83" cy="113" rx="8.5" ry="5" fill={skin.blush} opacity="0.48" />
      <ellipse cx="137" cy="113" rx="8.5" ry="5" fill={skin.blush} opacity="0.48" />

      {/* Expressive Kind Eyes */}
      <g>
        {/* Eyebrows */}
        <path d="M82 86 Q91 81 99 85" fill="none" stroke="#2C241E" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M121 85 Q129 81 138 86" fill="none" stroke="#2C241E" strokeWidth="2.4" strokeLinecap="round" />

        {/* Eyes */}
        <ellipse cx="91" cy="99" rx="6.2" ry="7.2" fill="#231712" />
        <ellipse cx="129" cy="99" rx="6.2" ry="7.2" fill="#231712" />
        {/* Eye catchlights */}
        <circle cx="89" cy="96.5" r="2.2" fill="#FFFFFF" />
        <circle cx="127" cy="96.5" r="2.2" fill="#FFFFFF" />
        <circle cx="93" cy="102" r="1" fill="#FFFFFF" />
        <circle cx="131" cy="102" r="1" fill="#FFFFFF" />
      </g>

      {/* Cute Nose & Warm Smile */}
      <path d="M108 107 Q110 110 112 107" fill="none" stroke={skin.shadow} strokeWidth="2" strokeLinecap="round" />
      <path
        d="M96 119 Q110 131 124 119"
        fill="none"
        stroke="#7D3B32"
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Front Hairline for non-hijab styles */}
      {!isHijab && (
        <g>
          <path
            d="M68 96 C68 62 90 50 110 50 C130 50 152 62 152 96 C142 74 126 67 110 73 C94 67 78 74 68 96 Z"
            fill={hair.primaryColor}
            stroke="#1E1410"
            strokeWidth="2.2"
          />
          {appearance.hairStyle === 'wavy_headband' && (
            <g>
              <path
                d="M72 78 Q110 54 148 78"
                fill="none"
                stroke={hair.accentColor}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="90" cy="67" r="4" fill="#FAF6EE" stroke={hair.accentColor} strokeWidth="1.5" />
              <circle cx="110" cy="62" r="4.5" fill="#FAF6EE" stroke={hair.accentColor} strokeWidth="1.5" />
              <circle cx="130" cy="67" r="4" fill="#FAF6EE" stroke={hair.accentColor} strokeWidth="1.5" />
            </g>
          )}
        </g>
      )}

      {/* Hijab Front Frame & Drapes */}
      {isHijab && (
        <g>
          {/* Inner Underscarf */}
          <path
            d="M71 86 C75 62 93 52 110 52 C127 52 145 62 149 86 C137 72 122 68 110 68 C98 68 83 72 71 86 Z"
            fill="#FFFFFF"
            stroke="#2C241E"
            strokeWidth="1.8"
          />
          {/* Outer Hijab Wrap framing the face */}
          <path
            d="M68 102 C68 68 86 50 110 50 C134 50 152 68 152 102 C152 128 134 150 110 152 C86 150 68 128 68 102 Z M60 100 C60 144 82 178 110 182 C138 178 160 144 160 100 C160 56 138 36 110 36 C82 36 60 56 60 100 Z"
            fill={hair.primaryColor}
            fillRule="evenodd"
            stroke="#2C241E"
            strokeWidth="2.2"
          />
          {/* Graceful shoulder drape */}
          <path
            d="M73 142 Q110 172 152 152 C156 168 150 192 126 196 C98 194 75 174 73 142 Z"
            fill={hair.primaryColor}
            stroke="#2C241E"
            strokeWidth="2.2"
          />

          {/* Hijab decorative accents */}
          {appearance.hairStyle === 'hijab_floral' && (
            <g>
              <circle cx="75" cy="118" r="5" fill={hair.accentColor} />
              <circle cx="75" cy="118" r="2" fill="#FAF6EE" />
              <circle cx="84" cy="128" r="4" fill={hair.accentColor} />
              <circle cx="84" cy="128" r="1.6" fill="#FAF6EE" />
            </g>
          )}
          {appearance.hairStyle === 'hijab_gold' && (
            <g>
              <path
                d="M78 65 Q110 48 142 65"
                fill="none"
                stroke={hair.accentColor}
                strokeWidth="3"
                strokeDasharray="3 4"
                strokeLinecap="round"
              />
              <circle cx="110" cy="166" r="4.5" fill={hair.accentColor} stroke="#FAF6EE" strokeWidth="1.2" />
            </g>
          )}
          {appearance.hairStyle === 'hijab_classic' && (
            <circle cx="110" cy="162" r="3.5" fill={hair.accentColor} />
          )}
        </g>
      )}
    </svg>
  );
};
