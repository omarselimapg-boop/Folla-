import React, { useEffect, useRef, useState } from 'react';
import {
  Brush,
  Check,
  Download,
  Eraser,
  Flower2,
  Heart,
  Image as ImageIcon,
  Moon,
  RotateCcw,
  Save,
  Sparkles,
  Star,
  Trash2,
  Trees,
  Undo2,
  X,
} from 'lucide-react';
import { BADGES, DRAWING_VALUE_PROMPTS } from '../data/challenges';
import { SavedDrawing } from '../types/game';
import { soundEngine } from '../utils/sound';

interface DrawingStudioModalProps {
  initialTab?: 'studio' | 'gallery';
  drawings: SavedDrawing[];
  earnedBadgesCount: number;
  day: number;
  onSaveDrawing: (drawing: Omit<SavedDrawing, 'id' | 'daySaved'>) => void;
  onDeleteDrawing: (id: string) => void;
  onClose: () => void;
}

const BRUSH_COLORS = [
  { id: 'emerald', label: 'أخضر زمردي', hex: '#0F6B4E' },
  { id: 'gold', label: 'ذهبي مشرق', hex: '#C78318' },
  { id: 'sky', label: 'أزرق سماوي', hex: '#1E6B8A' },
  { id: 'rose', label: 'وردي ياسمين', hex: '#B85D6F' },
  { id: 'brown', label: 'بني دافئ', hex: '#6B4423' },
  { id: 'ink', label: 'كحلي داكن', hex: '#1C2A24' },
];

const BRUSH_SIZES = [
  { id: 'thin', label: 'رفيع', size: 4 },
  { id: 'medium', label: 'متوسط', size: 9 },
  { id: 'thick', label: 'عريض', size: 16 },
];

type StampType = 'star' | 'crescent' | 'heart' | 'flower' | 'tree' | null;

const CANVAS_W = 640;
const CANVAS_H = 380;

export const DrawingStudioModal: React.FC<DrawingStudioModalProps> = ({
  initialTab = 'studio',
  drawings,
  earnedBadgesCount,
  day,
  onSaveDrawing,
  onDeleteDrawing,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'gallery'>(initialTab);
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [drawingTitle, setDrawingTitle] = useState('');
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0].hex);
  const [isEraser, setIsEraser] = useState(false);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].size);
  const [activeStamp, setActiveStamp] = useState<StampType>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const activePrompt = DRAWING_VALUE_PROMPTS[selectedPromptIdx];

  const initBlankCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFDF8';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Subtle decorative corner border inside drawing
    ctx.strokeStyle = 'rgba(199, 131, 24, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, CANVAS_W - 20, CANVAS_H - 20);

    historyRef.current = [ctx.getImageData(0, 0, CANVAS_W, CANVAS_H)];
    setHasDrawn(false);
  };

  useEffect(() => {
    if (activeTab === 'studio') {
      // Only initialize if canvas is empty (first mount on studio tab)
      const canvas = canvasRef.current;
      if (canvas && historyRef.current.length === 0) {
        initBlankCanvas();
      }
    }
  }, [activeTab]);

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_H,
    };
  };

  const pushSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    historyRef.current = [
      ...historyRef.current.slice(-15),
      ctx.getImageData(0, 0, CANVAS_W, CANVAS_H),
    ];
  };

  const drawStampAt = (ctx: CanvasRenderingContext2D, stamp: Exclude<StampType, null>, x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = brushColor;
    ctx.strokeStyle = '#1C2A24';
    ctx.lineWidth = 2;

    if (stamp === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerA = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const innerA = outerA + Math.PI / 5;
        ctx.lineTo(Math.cos(outerA) * 20, Math.sin(outerA) * 20);
        ctx.lineTo(Math.cos(innerA) * 9, Math.sin(innerA) * 9);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (stamp === 'heart') {
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.bezierCurveTo(-22, -2, -16, -20, 0, -8);
      ctx.bezierCurveTo(16, -20, 22, -2, 0, 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (stamp === 'crescent') {
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0.35 * Math.PI, 1.65 * Math.PI, false);
      ctx.arc(7, -2, 14, 1.55 * Math.PI, 0.45 * Math.PI, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (stamp === 'flower') {
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2) / 6;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 11, Math.sin(a) * 11, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#FAF6EE';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (stamp === 'tree') {
      ctx.fillStyle = '#6B4423';
      ctx.fillRect(-5, 4, 10, 20);
      ctx.strokeRect(-5, 4, 10, 20);
      ctx.fillStyle = brushColor === '#6B4423' ? '#0F6B4E' : brushColor;
      ctx.beginPath();
      ctx.arc(0, -8, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getCanvasPoint(e);

    if (activeStamp) {
      soundEngine.playChime(1.1);
      drawStampAt(ctx, activeStamp, pt.x, pt.y);
      pushSnapshot();
      setHasDrawn(true);
      return;
    }

    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = pt;

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#FFFDF8' : brushColor;
    ctx.fill();
    setHasDrawn(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || activeStamp) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getCanvasPoint(e);
    const prev = lastPointRef.current || pt;

    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = isEraser ? '#FFFDF8' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPointRef.current = pt;
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    pushSnapshot();
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length <= 1) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    soundEngine.playTap();
    const nextHistory = historyRef.current.slice(0, -1);
    historyRef.current = nextHistory;
    ctx.putImageData(nextHistory[nextHistory.length - 1], 0, 0);
  };

  const handleClear = () => {
    soundEngine.playTap();
    initBlankCanvas();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const finalTitle = drawingTitle.trim() || `لوحة ${activePrompt.valueFocus}`;

    onSaveDrawing({
      title: finalTitle,
      valueFocus: activePrompt.valueFocus,
      dataUrl,
    });

    setSavedToast(true);
    setDrawingTitle('');
    initBlankCanvas();
    window.setTimeout(() => {
      setSavedToast(false);
      setActiveTab('gallery');
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/55 p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-title"
    >
      <div className="animate-pop-in flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B85D6F]/15 text-[#B85D6F]">
              <Brush className="h-6 w-6" />
            </div>
            <div>
              <h2 id="studio-title" className="text-lg font-bold text-[#1C2A24] sm:text-xl">
                مرسم القيم ومعرض الإنجازات
              </h2>
              <p className="text-xs font-medium text-[#52665C] tabular-nums">
                ارسمي صوراً تعبيرية للقيم الإسلامية واحفظيها في معرض إنجازاتك ({drawings.length} لوحة محفوظة)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Segmented Switcher */}
            <div className="flex items-center gap-1 rounded-xl bg-[#EFE7D6] p-1">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveTab('studio');
                }}
                className={`min-h-10 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === 'studio'
                    ? 'bg-[#FFFFFF] text-[#0F6B4E] shadow-sm'
                    : 'text-[#475B51] hover:text-[#1C2A24]'
                }`}
              >
                مرسم القيم
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveTab('gallery');
                }}
                className={`min-h-10 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap tabular-nums ${
                  activeTab === 'gallery'
                    ? 'bg-[#FFFFFF] text-[#0F6B4E] shadow-sm'
                    : 'text-[#475B51] hover:text-[#1C2A24]'
                }`}
              >
                معرض الإنجازات ({drawings.length})
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق المرسم والمعرض"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Drawing Studio */}
        {activeTab === 'studio' ? (
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 sm:p-5 lg:grid-cols-[290px_1fr]">
            {/* Left/Start Panel: Value Prompt + Tools */}
            <div className="flex flex-col gap-3.5">
              {/* Islamic Value Selector */}
              <div className="rounded-xl border border-[#1C2A24]/10 bg-[#FFFFFF] p-3.5">
                <div className="mb-2 text-xs font-bold text-[#475B51]">
                  اختر القيمة الإسلامية للرسمة:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DRAWING_VALUE_PROMPTS.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setSelectedPromptIdx(idx);
                      }}
                      className={`min-h-9 rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                        idx === selectedPromptIdx
                          ? 'bg-[#0F6B4E] text-white'
                          : 'border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]'
                      }`}
                    >
                      {p.valueFocus}
                    </button>
                  ))}
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-[#0F6B4E] font-semibold">
                  {activePrompt.prompt}
                </p>
              </div>

              {/* Colors & Eraser */}
              <div className="rounded-xl border border-[#1C2A24]/10 bg-[#FFFFFF] p-3.5">
                <div className="mb-2 text-xs font-bold text-[#475B51]">الألوان والأداة</div>
                <div className="flex flex-wrap items-center gap-2">
                  {BRUSH_COLORS.map((c) => {
                    const active = !isEraser && brushColor === c.hex;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        aria-label={c.label}
                        onClick={() => {
                          soundEngine.playTap();
                          setBrushColor(c.hex);
                          setIsEraser(false);
                          setActiveStamp(null);
                        }}
                        className={`h-9 w-9 rounded-full border-2 transition-transform ${
                          active ? 'scale-110 border-[#1C2A24] ring-2 ring-[#0F6B4E]/30' : 'border-black/15'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    );
                  })}

                  <button
                    type="button"
                    aria-label="ممحاة"
                    onClick={() => {
                      soundEngine.playTap();
                      setIsEraser(true);
                      setActiveStamp(null);
                    }}
                    className={`flex h-9 items-center gap-1 rounded-lg border px-2.5 text-xs font-bold ${
                      isEraser
                        ? 'border-[#0F6B4E] bg-[#E6F4EE] text-[#0F6B4E]'
                        : 'border-[#1C2A24]/15 bg-[#FAF6EE] text-[#1C2A24]'
                    }`}
                  >
                    <Eraser className="h-3.5 w-3.5" />
                    <span>ممحاة</span>
                  </button>
                </div>

                {/* Brush Sizes */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#52665C]">الحجم:</span>
                  {BRUSH_SIZES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setBrushSize(s.size);
                        setActiveStamp(null);
                      }}
                      className={`min-h-8 rounded-lg px-2.5 text-xs font-bold ${
                        brushSize === s.size && !activeStamp
                          ? 'bg-[#1C2A24] text-white'
                          : 'bg-[#FAF6EE] text-[#1C2A24] border border-[#1C2A24]/12'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expressive Stamps */}
              <div className="rounded-xl border border-[#1C2A24]/10 bg-[#FFFFFF] p-3.5">
                <div className="mb-2 text-xs font-bold text-[#475B51]">
                  أختام تعبيرية (اضغط ثم انقر على اللوحة):
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: 'star' as const, label: 'نجمة', icon: <Star className="h-4 w-4" /> },
                    { id: 'crescent' as const, label: 'هلال', icon: <Moon className="h-4 w-4" /> },
                    { id: 'heart' as const, label: 'قلب', icon: <Heart className="h-4 w-4" /> },
                    { id: 'flower' as const, label: 'زهرة', icon: <Flower2 className="h-4 w-4" /> },
                    { id: 'tree' as const, label: 'شجرة', icon: <Trees className="h-4 w-4" /> },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      title={st.label}
                      onClick={() => {
                        soundEngine.playTap();
                        setActiveStamp((prev) => (prev === st.id ? null : st.id));
                        setIsEraser(false);
                      }}
                      className={`flex h-10 flex-col items-center justify-center rounded-lg border text-[10px] font-bold ${
                        activeStamp === st.id
                          ? 'border-[#C78318] bg-[#FFF8E6] text-[#9A6008]'
                          : 'border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]'
                      }`}
                    >
                      {st.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title + Save CTA */}
              <div className="rounded-xl border border-[#1C2A24]/10 bg-[#FFFFFF] p-3.5 space-y-2.5">
                <label htmlFor="drawing-title-input" className="block text-xs font-bold text-[#475B51]">
                  عنوان اللوحة (اختياري):
                </label>
                <input
                  id="drawing-title-input"
                  type="text"
                  maxLength={40}
                  value={drawingTitle}
                  onChange={(e) => setDrawingTitle(e.target.value)}
                  placeholder={`مثلاً: لوحة ${activePrompt.valueFocus}`}
                  className="w-full rounded-lg border border-[#1C2A24]/15 bg-[#FAF6EE] px-3 py-2 text-sm text-[#1C2A24] focus:border-[#0F6B4E] focus:outline-none"
                />

                <button
                  type="button"
                  disabled={!hasDrawn}
                  onClick={handleSave}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F6B4E] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0B573F] disabled:opacity-50"
                >
                  {savedToast ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>تم الحفظ في المعرض!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>حفظ في معرض الإنجازات (+10 ★)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Canvas Drawing Board */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#475B51]">
                  {activeStamp
                    ? 'انقر داخل اللوحة لوضع الختم، أو اختر أداة الفرشاة للرسم الحر'
                    : 'ارسمي بأصبعك أو بالفأرة بحرية!'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="flex min-h-9 items-center gap-1 rounded-lg border border-[#1C2A24]/12 bg-[#FFFFFF] px-3 text-xs font-bold text-[#1C2A24] hover:bg-[#EFE7D6]"
                  >
                    <Undo2 className="h-3.5 w-3.5" />
                    <span>تراجع</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex min-h-9 items-center gap-1 rounded-lg border border-[#C2412D]/20 bg-[#FCECE9] px-3 text-xs font-bold text-[#9E2E1D] hover:bg-[#F9DDD7]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>مسح اللوحة</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center rounded-2xl border border-[#1C2A24]/15 bg-[#EFE7D6] p-3">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_W}
                  height={CANVAS_H}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  className="w-full max-w-[640px] cursor-crosshair touch-none rounded-xl border border-[#1C2A24]/15 bg-[#FFFDF8] shadow-inner"
                  style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Tab 2: Achievements Gallery */
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {/* Summary Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#0F6B4E]/20 bg-[#FFFFFF] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F6B4E]/12 text-[#0F6B4E]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1C2A24]">
                    معرض إنجازات فُلَّة
                  </h3>
                  <p className="text-xs font-medium text-[#52665C] tabular-nums">
                    الرسومات المحفوظة: {drawings.length} · الشارات المكتسبة: {earnedBadgesCount} / {BADGES.length} · اليوم الحالي: {day}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setActiveTab('studio');
                }}
                className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-5 py-2 text-sm font-bold text-white hover:bg-[#0B573F]"
              >
                <Brush className="h-4 w-4" />
                <span>رسم لوحة جديدة</span>
              </button>
            </div>

            {drawings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#1C2A24]/20 bg-[#FFFFFF] p-10 text-center">
                <ImageIcon className="h-12 w-12 text-[#73857B]" />
                <h4 className="text-lg font-bold text-[#1C2A24]">
                  المعرض ينتظر لوحتك الأولى!
                </h4>
                <p className="max-w-md text-sm text-[#52665C]">
                  انتقلي إلى «مرسم القيم»، وعبّري بالرسم عن الصدق أو الرحمة أو الشكر ثم احفظي لوحتك هنا.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setActiveTab('studio');
                  }}
                  className="mt-1 flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                >
                  <Brush className="h-4 w-4" />
                  <span>ابدئي الرسم الآن</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {drawings.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/12 bg-[#FFFFFF] shadow-sm"
                  >
                    <div className="aspect-[640/380] w-full overflow-hidden bg-[#FFFDF8] border-b border-[#1C2A24]/10">
                      <img
                        src={item.dataUrl}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-2 p-3.5">
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#0F6B4E]">
                          <span>{item.valueFocus}</span>
                          <span className="text-[#52665C] tabular-nums">
                            اليوم {item.daySaved}
                          </span>
                        </div>
                        <h4 className="mt-1 truncate text-sm font-bold text-[#1C2A24]">
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-[#1C2A24]/8 pt-2">
                        <a
                          href={item.dataUrl}
                          download={`${item.title}.jpg`}
                          className="flex min-h-9 items-center gap-1.5 rounded-lg bg-[#FAF6EE] px-3 py-1.5 text-xs font-bold text-[#0F6B4E] hover:bg-[#E6F4EE]"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>تنزيل</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => onDeleteDrawing(item.id)}
                          aria-label={`حذف ${item.title}`}
                          className="flex min-h-9 items-center gap-1 rounded-lg bg-[#FCECE9] px-3 py-1.5 text-xs font-bold text-[#9E2E1D] hover:bg-[#F9DDD7]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>حذف</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
