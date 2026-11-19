import React, { useEffect, useRef, useState } from 'react';
import { Heart, HeartHandshake, RotateCcw, Star, X } from 'lucide-react';
import { soundEngine } from '../../utils/sound';

interface CharityCatchChallengeProps {
  onComplete: (bonusStars: number) => void;
  onCancel: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  vy: number;
  radius: number;
  kind: 'good' | 'bad';
  label: string;
  color: string;
  symbol: string;
  windup: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const GOOD_DEEDS = [
  { label: 'تمرة صدقة', color: '#0F6B4E', symbol: '★' },
  { label: 'غرس شجرة', color: '#15803D', symbol: '✿' },
  { label: 'ابتسامة', color: '#C78318', symbol: '☺' },
  { label: 'كتاب علم', color: '#1E6B8A', symbol: '◈' },
  { label: 'مساعدة جار', color: '#0E7490', symbol: '♥' },
];

const BAD_HABITS = [
  { label: 'إسراف ماء', color: '#C2412D', symbol: '!' },
  { label: 'غضب', color: '#B91C1C', symbol: '✕' },
  { label: 'كلام مؤذٍ', color: '#991B1B', symbol: '✕' },
];

const TARGET_SCORE = 10;

export const CharityCatchChallenge: React.FC<CharityCatchChallengeProps> = ({
  onComplete,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hudState, setHudState] = useState<{
    score: number;
    hearts: number;
    status: 'playing' | 'won' | 'lost';
    lastEvent: string;
  }>({
    score: 0,
    hearts: 3,
    status: 'playing',
    lastEvent: 'حرّك سلة فُلَّة بالأسهم أو بالسحب لالتقاط أعمال الخير',
  });

  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 720;
    const H = 430;
    canvas.width = W;
    canvas.height = H;

    const heldKeys = new Set<string>();
    let pointerTargetX: number | null = null;
    let basketX = W / 2;
    const basketY = H - 48;
    const basketW = 108;
    const basketH = 34;
    let squashTimer = 0;
    let hitstopTimer = 0;
    let shakeTimer = 0;
    let flashTimer = 0;

    let score = 0;
    let hearts = 3;
    let status: 'playing' | 'won' | 'lost' = 'playing';
    let spawnTimer = 0.4;
    let nextId = 1;
    const items: FallingItem[] = [];
    const particles: Particle[] = [];

    const spawnBurst = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 70 + Math.random() * 140;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 30,
          life: 0.45,
          maxLife: 0.45,
          color,
          size: 3 + Math.random() * 3.5,
        });
      }
    };

    const spawnItem = () => {
      const progressRatio = score / TARGET_SCORE;
      const isBad = Math.random() < 0.27 + progressRatio * 0.1;
      const template = isBad
        ? BAD_HABITS[Math.floor(Math.random() * BAD_HABITS.length)]
        : GOOD_DEEDS[Math.floor(Math.random() * GOOD_DEEDS.length)];
      items.push({
        id: nextId++,
        x: 56 + Math.random() * (W - 112),
        y: -24,
        vy: (130 + Math.random() * 65) * (1 + progressRatio * 0.45),
        radius: 24,
        kind: isBad ? 'bad' : 'good',
        label: template.label,
        color: template.color,
        symbol: template.symbol,
        windup: isBad ? 0.55 : 0,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'KeyA' || e.code === 'KeyD') {
        heldKeys.add(e.code);
        pointerTargetX = null;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      heldKeys.delete(e.code);
    };

    const handleBlur = () => {
      heldKeys.clear();
      pointerTargetX = null;
    };

    const updatePointer = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0) return;
      const scaleX = W / rect.width;
      pointerTargetX = (clientX - rect.left) * scaleX;
    };

    const handlePointerDown = (e: PointerEvent) => {
      updatePointer(e.clientX);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.buttons > 0 || e.pointerType === 'mouse') {
        updatePointer(e.clientX);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);

    let lastTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      if (status === 'playing') {
        if (hitstopTimer > 0) {
          hitstopTimer = Math.max(0, hitstopTimer - dt);
        } else {
          // Move basket
          const moveSpeed = 460;
          let dir = 0;
          if (heldKeys.has('ArrowLeft') || heldKeys.has('KeyA')) dir -= 1;
          if (heldKeys.has('ArrowRight') || heldKeys.has('KeyD')) dir += 1;

          if (dir !== 0) {
            basketX += dir * moveSpeed * dt;
          } else if (pointerTargetX !== null) {
            const diff = pointerTargetX - basketX;
            basketX += Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed * 1.3 * dt);
          }
          basketX = Math.max(basketW / 2 + 16, Math.min(W - basketW / 2 - 16, basketX));

          if (squashTimer > 0) squashTimer = Math.max(0, squashTimer - dt);
          if (shakeTimer > 0) shakeTimer = Math.max(0, shakeTimer - dt);
          if (flashTimer > 0) flashTimer = Math.max(0, flashTimer - dt);

          // Spawn items
          spawnTimer -= dt;
          if (spawnTimer <= 0) {
            spawnItem();
            spawnTimer = Math.max(0.55, 1.05 - (score / TARGET_SCORE) * 0.35);
          }

          // Update items
          for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (item.windup > 0) {
              item.windup = Math.max(0, item.windup - dt);
              item.y += 28 * dt;
            } else {
              item.y += item.vy * dt;
            }

            // Catch check
            const inX = Math.abs(item.x - basketX) <= basketW / 2 + item.radius * 0.55;
            const inY = item.y + item.radius >= basketY - basketH / 2 && item.y - item.radius <= basketY + basketH / 2;

            if (inX && inY) {
              items.splice(i, 1);
              if (item.kind === 'good') {
                score += 1;
                squashTimer = 0.16;
                soundEngine.playChime(1 + score * 0.03);
                spawnBurst(item.x, basketY - 12, item.color, 12);
                const msg = `التقطت: ${item.label}!`;
                if (score >= TARGET_SCORE) {
                  status = 'won';
                  soundEngine.playCelebration();
                  setHudState({
                    score,
                    hearts,
                    status: 'won',
                    lastEvent: 'ما شاء الله! امتلأت سلة فُلَّة بأعمال الخير والصدقة.',
                  });
                } else {
                  setHudState({ score, hearts, status: 'playing', lastEvent: msg });
                }
              } else {
                hearts = Math.max(0, hearts - 1);
                hitstopTimer = 0.055;
                shakeTimer = 0.22;
                flashTimer = 0.14;
                soundEngine.playOops();
                spawnBurst(item.x, basketY - 12, '#C2412D', 14);
                if (hearts <= 0) {
                  status = 'lost';
                  setHudState({
                    score,
                    hearts: 0,
                    status: 'lost',
                    lastEvent: 'انتهت المحاولات! حاول مجدداً وتجنّب الغضب والإسراف.',
                  });
                } else {
                  setHudState({
                    score,
                    hearts,
                    status: 'playing',
                    lastEvent: `انتبه! تجنّب (${item.label}) للحفاظ على القيم الطيبة.`,
                  });
                }
              }
              continue;
            }

            if (item.y > H + 40) {
              items.splice(i, 1);
            }
          }
        }
      }

      // Update particles even after win
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 240 * dt;
        p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Render Arena
      ctx.save();
      if (shakeTimer > 0) {
        const mag = (shakeTimer / 0.22) * 6;
        ctx.translate((Math.random() - 0.5) * mag, (Math.random() - 0.5) * mag);
      }

      // Sky & Courtyard backdrop
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#E8F2EE');
      skyGrad.addColorStop(0.75, '#FAF6EE');
      skyGrad.addColorStop(1, '#EADEC6');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle courtyard arch silhouettes in background
      ctx.fillStyle = 'rgba(15, 107, 78, 0.06)';
      for (let ax = 60; ax < W; ax += 180) {
        ctx.beginPath();
        ctx.arc(ax + 60, 140, 62, Math.PI, 0);
        ctx.lineTo(ax + 122, H - 56);
        ctx.lineTo(ax - 2, H - 56);
        ctx.closePath();
        ctx.fill();
      }

      // Courtyard floor
      ctx.fillStyle = '#DFCFAF';
      ctx.fillRect(0, H - 56, W, 56);
      ctx.fillStyle = 'rgba(28, 42, 36, 0.12)';
      ctx.fillRect(0, H - 56, W, 2);

      // Draw Falling Items
      items.forEach((item) => {
        ctx.save();
        ctx.translate(item.x, item.y);

        // Windup telegraph ring for bad habits
        if (item.kind === 'bad') {
          ctx.beginPath();
          ctx.arc(0, 0, item.radius + 7, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(194, 65, 45, 0.35)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Token circle
        ctx.beginPath();
        ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.kind === 'good' ? '#FFFFFF' : '#FCECE9';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = item.color;
        ctx.stroke();

        // Symbol
        ctx.fillStyle = item.color;
        ctx.font = 'bold 18px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.symbol, 0, -1);

        // Label below token
        ctx.font = 'bold 12px Cairo, sans-serif';
        ctx.fillStyle = '#1C2A24';
        ctx.fillText(item.label, 0, item.radius + 13);

        ctx.restore();
      });

      // Draw Folla's Woven Basket
      ctx.save();
      ctx.translate(basketX, basketY);
      const sq = squashTimer > 0 ? Math.sin((squashTimer / 0.16) * Math.PI) : 0;
      ctx.scale(1 + sq * 0.14, 1 - sq * 0.14);

      ctx.fillStyle = flashTimer > 0 ? '#C2412D' : '#C78318';
      ctx.beginPath();
      ctx.roundRect(-basketW / 2, -basketH / 2, basketW, basketH, [8, 8, 18, 18]);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#7A4D08';
      ctx.stroke();

      // Basket weave stripe
      ctx.fillStyle = '#FAF6EE';
      ctx.font = 'bold 13px Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('سلة الخير', 0, 1);
      ctx.restore();

      // Draw Particles
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.restore();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
    };
  }, [runId]);

  const handleRestart = () => {
    soundEngine.playTap();
    setHudState({
      score: 0,
      hearts: 3,
      status: 'playing',
      lastEvent: 'حرّك سلة فُلَّة بالأسهم أو بالسحب لالتقاط أعمال الخير',
    });
    setRunId((id) => id + 1);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/55 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="charity-catch-title"
    >
      <div className="animate-pop-in flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C78318]/15 text-[#9A6008]">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h2 id="charity-catch-title" className="text-lg font-bold text-[#1C2A24]">
                تحدي حصاد الصدقة والرفق
              </h2>
              <p className="text-xs font-medium text-[#52665C]">
                {hudState.lastEvent}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg bg-[#0F6B4E]/10 px-3 py-1.5 text-sm font-bold text-[#0F6B4E]">
              <Star className="h-4 w-4 fill-[#0F6B4E]" />
              <span className="font-mono-num tabular-nums">
                {hudState.score} / {TARGET_SCORE}
              </span>
            </div>

            <div className="flex items-center gap-1" aria-label={`المحاولات المتبقية ${hudState.hearts}`}>
              {[1, 2, 3].map((idx) => (
                <Heart
                  key={idx}
                  className={`h-5 w-5 ${
                    idx <= hudState.hearts
                      ? 'fill-[#C2412D] text-[#C2412D]'
                      : 'text-[#1C2A24]/20'
                  }`}
                />
              ))}
            </div>

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

        {/* Isolated Canvas Playfield */}
        <div className="relative flex flex-1 items-center justify-center bg-[#EFE7D6] p-3">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[720px] touch-none rounded-xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-inner"
            style={{ aspectRatio: '720 / 430' }}
          />

          {/* Result Overlay when won or lost */}
          {hudState.status !== 'playing' && (
            <div className="absolute inset-3 flex items-center justify-center rounded-xl bg-[#1C2A24]/55 p-4">
              <div className="animate-pop-in flex max-w-sm flex-col items-center gap-4 rounded-2xl bg-[#FAF6EE] p-6 text-center shadow-lg">
                <h3 className="text-xl font-bold text-[#1C2A24]">
                  {hudState.status === 'won'
                    ? 'عمل رائع يا بطل الخير!'
                    : 'حاول مرة أخرى!'}
                </h3>
                <p className="text-sm leading-relaxed text-[#475B51]">
                  {hudState.status === 'won'
                    ? 'جمعت فُلَّة 10 أعمال طيبة من الصدقة والابتسام والرفق دون استسلام للغضب.'
                    : 'لا بأس، المسلم يتعلم من أخطائه. حرّك السلة بهدوء لالتقاط أعمال الخير.'}
                </p>
                <div className="flex items-center gap-3">
                  {hudState.status === 'won' ? (
                    <button
                      type="button"
                      onClick={() => onComplete(hudState.hearts === 3 ? 5 : 0)}
                      className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                    >
                      <span>استلام النجوم والعودة</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>العب مجدداً</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Hint Footer */}
        <div className="border-t border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-2.5 text-center text-xs font-semibold text-[#52665C]">
          تحرك بمفاتيح الأسهم (يمين / يسار) أو A / D أو حرّك المؤشر داخل اللوحة
        </div>
      </div>
    </div>
  );
};
