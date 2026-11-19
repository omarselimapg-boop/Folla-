import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Mic,
  Play,
  RotateCcw,
  Square,
  Star,
  Volume2,
  X,
} from 'lucide-react';
import { SHORT_SURAHS } from '../../data/challenges';
import { soundEngine } from '../../utils/sound';

interface ReciteAyahsChallengeProps {
  onComplete: (bonusStars: number) => void;
  onCancel: () => void;
}

type ReciteStatus =
  | 'idle'
  | 'requesting'
  | 'recording'
  | 'recorded'
  | 'permission_error'
  | 'manual_mode';

export const ReciteAyahsChallenge: React.FC<ReciteAyahsChallengeProps> = ({
  onComplete,
  onCancel,
}) => {
  const [selectedSurahIdx, setSelectedSurahIdx] = useState(0);
  const [status, setStatus] = useState<ReciteStatus>('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [voiceActiveMs, setVoiceActiveMs] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [readAyahs, setReadAyahs] = useState<number[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const playbackRef = useRef<HTMLAudioElement | null>(null);

  const surah = SHORT_SURAHS[selectedSurahIdx];

  const stopMediaResources = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try {
        recorderRef.current.stop();
      } catch {
        // Ignore stop errors
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopMediaResources();
      if (playbackRef.current) {
        playbackRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const handleSelectSurah = (idx: number) => {
    if (status === 'recording' || status === 'requesting') return;
    soundEngine.playTap();
    setSelectedSurahIdx(idx);
    setStatus('idle');
    setElapsedSec(0);
    setVoiceActiveMs(0);
    setReadAyahs([]);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  const handleStartRecording = async () => {
    soundEngine.playTap();
    setErrorMessage('');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('permission_error');
      setErrorMessage(
        'متصفحك الحالي لا يدعم تسجيل الصوت بالميكروفون. يمكنك استخدام وضع القراءة التفاعلية.'
      );
      return;
    }

    setStatus('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioCtx) {
        setStatus('permission_error');
        setErrorMessage('تعذر تهيئة نظام الصوت في المتصفح.');
        stopMediaResources();
        return;
      }

      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      chunksRef.current = [];
      if (typeof MediaRecorder !== 'undefined') {
        const recorder = new MediaRecorder(stream);
        recorderRef.current = recorder;
        recorder.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) {
            chunksRef.current.push(ev.data);
          }
        };
        recorder.onstop = () => {
          if (chunksRef.current.length > 0) {
            const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
          }
        };
        recorder.start();
      }

      setStatus('recording');
      setElapsedSec(0);
      setVoiceActiveMs(0);

      const startedAt = performance.now();
      timerRef.current = window.setInterval(() => {
        setElapsedSec(Math.floor((performance.now() - startedAt) / 1000));
      }, 250);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let lastFrame = performance.now();

      const drawWave = (now: number) => {
        const dtMs = Math.min(now - lastFrame, 100);
        lastFrame = now;

        analyser.getByteTimeDomainData(dataArray);
        let sumSq = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = (dataArray[i] - 128) / 128;
          sumSq += v * v;
        }
        const rms = Math.sqrt(sumSq / dataArray.length);
        if (rms > 0.025) {
          setVoiceActiveMs((prev) => prev + dtMs);
        }

        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const W = canvas.width;
            const H = canvas.height;
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#F3EDE0';
            ctx.fillRect(0, 0, W, H);

            const barCount = 28;
            const barWidth = (W - 24) / barCount;
            const energy = Math.min(1, rms * 5.2);

            for (let b = 0; b < barCount; b++) {
              const waveShape = Math.sin((b / barCount) * Math.PI);
              const jitter = 0.65 + 0.35 * Math.sin(now * 0.008 + b * 0.7);
              const h = Math.max(6, energy * (H - 14) * waveShape * jitter);
              const x = 12 + b * barWidth + 2;
              const y = (H - h) / 2;

              ctx.fillStyle = rms > 0.025 ? '#0F6B4E' : '#B6C4BC';
              ctx.beginPath();
              ctx.roundRect(x, y, Math.max(4, barWidth - 4), h, 3);
              ctx.fill();
            }
          }
        }

        rafRef.current = requestAnimationFrame(drawWave);
      };

      rafRef.current = requestAnimationFrame(drawWave);
    } catch (err) {
      stopMediaResources();
      setStatus('permission_error');
      const name = err instanceof Error ? err.name : '';
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setErrorMessage(
          'تم رفض إذن الميكروفون. يمكنك السماح للمتصفح باستخدام الميكروفون والمحاولة مجدداً، أو استخدام القراءة التفاعلية.'
        );
      } else {
        setErrorMessage(
          'لم نتمكن من العثور على ميكروفون متصل. يمكنك المحاولة مجدداً أو القراءة بصوتك في الوضع التفاعلي.'
        );
      }
    }
  };

  const handleStopRecording = () => {
    soundEngine.playChime(1.05);
    stopMediaResources();
    setStatus('recorded');
  };

  const handleTogglePlayback = () => {
    if (!audioUrl) return;
    if (isPlayingBack && playbackRef.current) {
      playbackRef.current.pause();
      setIsPlayingBack(false);
      return;
    }
    const audio = new Audio(audioUrl);
    playbackRef.current = audio;
    setIsPlayingBack(true);
    audio.onended = () => setIsPlayingBack(false);
    audio.play().catch(() => setIsPlayingBack(false));
  };

  const handleToggleManualAyah = (idx: number) => {
    soundEngine.playChime(1 + idx * 0.05);
    setReadAyahs((prev) =>
      prev.includes(idx) ? prev : [...prev, idx]
    );
  };

  const isClearRecitation = elapsedSec >= 3 && voiceActiveMs >= 900;
  const earnedBonusStars =
    status === 'recorded'
      ? isClearRecitation && voiceActiveMs >= 2500
        ? 5
        : isClearRecitation
          ? 2
          : 0
      : readAyahs.length === surah.ayahs.length
        ? 0
        : 0;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#1C2A24]/55 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recite-title"
    >
      <div className="animate-pop-in flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] shadow-xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C2A24]/10 bg-[#FFFFFF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F6B4E]/12 text-[#0F6B4E]">
              <Mic className="h-6 w-6" />
            </div>
            <div>
              <h2 id="recite-title" className="text-lg font-bold text-[#1C2A24] sm:text-xl">
                تحدي رتل آيات
              </h2>
              <p className="text-xs font-medium text-[#52665C]">
                اختر سورة من قصار السور وسجّل تلاوتك العطرة بالميكروفون لكسب النجوم
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopMediaResources();
              onCancel();
            }}
            aria-label="إغلاق تحدي رتل آيات"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Surah Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#1C2A24]/10 bg-[#F3EDE0] px-5 py-3">
          {SHORT_SURAHS.map((s, idx) => {
            const active = idx === selectedSurahIdx;
            return (
              <button
                key={s.id}
                type="button"
                disabled={status === 'recording' || status === 'requesting'}
                onClick={() => handleSelectSurah(idx)}
                className={`min-h-10 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#0F6B4E] text-white shadow-sm'
                    : 'bg-[#FFFFFF] text-[#1C2A24] border border-[#1C2A24]/12 hover:bg-[#FAF6EE]'
                } disabled:opacity-60`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {/* Quran Display Card */}
          <div className="rounded-2xl border border-[#C78318]/30 bg-[#FFFFFF] p-5 text-center shadow-sm">
            <div className="font-display text-lg font-bold text-[#0F6B4E]">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>

            <div className="mt-4 space-y-2.5">
              {surah.ayahs.map((ayah, idx) => {
                const marked = readAyahs.includes(idx);
                if (status === 'manual_mode') {
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleManualAyah(idx)}
                      className={`font-display flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-xl sm:text-2xl leading-loose transition-colors ${
                        marked
                          ? 'border-[#0F6B4E]/40 bg-[#E6F4EE] text-[#0F6B4E]'
                          : 'border-[#1C2A24]/12 bg-[#FAF6EE] text-[#1C2A24] hover:bg-[#EFE7D6]'
                      }`}
                    >
                      <span>{ayah}</span>
                      {marked && <Check className="h-5 w-5 shrink-0" />}
                    </button>
                  );
                }

                return (
                  <p
                    key={idx}
                    className="font-display text-xl font-bold leading-loose text-[#1C2A24] sm:text-2xl"
                  >
                    {ayah}
                  </p>
                );
              })}
            </div>

            <p className="mt-4 border-t border-[#1C2A24]/10 pt-3 text-xs font-medium text-[#52665C]">
              {surah.meaning}
            </p>
          </div>

          {/* Microphone Recording & Feedback Controls */}
          {status === 'idle' && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#1C2A24]/10 bg-[#FFFFFF] p-5 text-center">
              <p className="text-sm font-semibold text-[#2F4239]">
                اضغط على زر التسجيل لطلب إذن الميكروفون ثم اقرأ <strong>{surah.name}</strong> بصوت واضح وهادئ.
              </p>
              <button
                type="button"
                onClick={handleStartRecording}
                className="flex min-h-12 items-center gap-2.5 rounded-xl bg-[#0F6B4E] px-7 py-3 text-base font-bold text-white shadow-sm transition-transform duration-150 hover:scale-[1.02] hover:bg-[#0B573F]"
              >
                <Mic className="h-5 w-5" />
                <span>السماح بالميكروفون وبدء التسجيل</span>
              </button>
            </div>
          )}

          {status === 'requesting' && (
            <div className="rounded-2xl border border-[#0F6B4E]/25 bg-[#E6F4EE] p-5 text-center text-sm font-bold text-[#0F6B4E]">
              جاري طلب إذن الميكروفون من المتصفح... يرجى الموافقة لبدء التلاوة.
            </div>
          )}

          {status === 'recording' && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#0F6B4E]/35 bg-[#FFFFFF] p-5 text-center">
              <div className="flex items-center gap-3 text-sm font-bold text-[#0F6B4E]">
                <Mic className="h-5 w-5 text-[#C2412D]" />
                <span>جاري تسجيل تلاوتك الآن...</span>
                <span className="font-mono-num rounded-lg bg-[#FAF6EE] px-2.5 py-1 text-[#1C2A24] tabular-nums">
                  {elapsedSec} ث
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={520}
                height={68}
                className="w-full max-w-lg rounded-xl border border-[#1C2A24]/10"
              />

              <button
                type="button"
                onClick={handleStopRecording}
                className="flex min-h-12 items-center gap-2 rounded-xl bg-[#C2412D] px-7 py-3 text-base font-bold text-white shadow-sm hover:bg-[#A63524]"
              >
                <Square className="h-4 w-4 fill-current" />
                <span>إيقاف التسجيل وإنهاء القراءة</span>
              </button>
            </div>
          )}

          {status === 'recorded' && (
            <div className="animate-pop-in flex flex-col items-center gap-4 rounded-2xl border border-[#0F6B4E]/30 bg-[#E6F4EE] p-5 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F6B4E] text-white">
                <Star className="h-6 w-6 fill-[#FAF6EE]" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1C2A24]">
                  {isClearRecitation
                    ? 'ما شاء الله! تلاوة جميلة ومباركة'
                    : 'أحسنتِ على المحاولة!'}
                </h3>
                <p className="mt-1 text-sm text-[#2F4239] tabular-nums">
                  {isClearRecitation
                    ? `سجّلتِ قراءة ${surah.name} لمدة ${elapsedSec} ثوانٍ بصوت مسموع وواضح.`
                    : 'كان التسجيل قصيراً أو هادئاً جداً؛ يمكنك إعادة القراءة بصوت أوضح لكسب نجوم إضافية أو استلام مكافأتك الآن.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {audioUrl && (
                  <button
                    type="button"
                    onClick={handleTogglePlayback}
                    className="flex min-h-11 items-center gap-2 rounded-xl border border-[#0F6B4E]/30 bg-[#FFFFFF] px-4 py-2.5 text-sm font-bold text-[#0F6B4E] hover:bg-[#FAF6EE]"
                  >
                    {isPlayingBack ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 fill-current" />
                    )}
                    <span>{isPlayingBack ? 'جاري التشغيل...' : 'استمع لتلاوتك'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FFFFFF] px-4 py-2.5 text-sm font-bold text-[#1C2A24] hover:bg-[#FAF6EE]"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>إعادة التسجيل</span>
                </button>

                <button
                  type="button"
                  onClick={() => onComplete(earnedBonusStars)}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0B573F]"
                >
                  <Star className="h-4 w-4 fill-current" />
                  <span className="tabular-nums">
                    استلام المكافأة (+{20 + earnedBonusStars} نجمة)
                  </span>
                </button>
              </div>
            </div>
          )}

          {status === 'permission_error' && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#C78318]/35 bg-[#FFF8E6] p-5 text-center">
              <p className="text-sm font-bold text-[#9A6008]">{errorMessage}</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                >
                  <Mic className="h-4 w-4" />
                  <span>إعادة طلب إذن الميكروفون</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTap();
                    setStatus('manual_mode');
                    setReadAyahs([]);
                  }}
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FFFFFF] px-5 py-2.5 text-sm font-bold text-[#1C2A24] hover:bg-[#FAF6EE]"
                >
                  <span>القراءة التفاعلية بدون ميكروفون</span>
                </button>
              </div>
            </div>
          )}

          {status === 'manual_mode' && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#0F6B4E]/25 bg-[#FFFFFF] p-4 text-center">
              <p className="text-sm font-semibold text-[#2F4239] tabular-nums">
                اقرأ كل آية بصوتك ثم اضغط عليها لتحديدها ({readAyahs.length} / {surah.ayahs.length})
              </p>
              {readAyahs.length === surah.ayahs.length && (
                <button
                  type="button"
                  onClick={() => onComplete(0)}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0B573F]"
                >
                  <Check className="h-4 w-4" />
                  <span>إتمام التلاوة واستلام النجوم (+20 نجمة)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
