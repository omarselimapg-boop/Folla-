import { useCallback, useEffect, useState } from 'react';
import { Award, Home, Play, RotateCcw, Star } from 'lucide-react';
import { AppearanceCustomizer } from './components/AppearanceCustomizer';
import { DrawingStudioModal } from './components/DrawingStudioModal';
import { FollaSanctuary } from './components/FollaSanctuary';
import { GameHud } from './components/GameHud';
import { KeepsakeDrawer } from './components/KeepsakeDrawer';
import { ProphetsStoriesModal } from './components/ProphetsStoriesModal';
import { RewardsModal } from './components/RewardsModal';
import { TitleScreen } from './components/TitleScreen';
import { AdhkarCardsChallenge } from './components/challenges/AdhkarCardsChallenge';
import { CharityCatchChallenge } from './components/challenges/CharityCatchChallenge';
import { ReciteAyahsChallenge } from './components/challenges/ReciteAyahsChallenge';
import { ValuesStoryChallenge } from './components/challenges/ValuesStoryChallenge';
import { WordsLightChallenge } from './components/challenges/WordsLightChallenge';
import { WuduChallenge } from './components/challenges/WuduChallenge';
import {
  BADGES,
  CHALLENGES_META,
  FOLLA_GREETINGS,
  HAIR_STYLE_OPTIONS,
  OUTFIT_OPTIONS,
  PROPHET_STORIES,
  ROOM_KEEPSAKES,
  WARDROBE_THEMES,
  getLevelProgress,
} from './data/challenges';
import {
  ChallengeId,
  FloatingFeedback,
  GameState,
  HairStyleId,
  MeterKey,
  OutfitId,
  SaveProgress,
  SavedDrawing,
  SkinToneId,
  TimeOfDay,
} from './types/game';
import { soundEngine } from './utils/sound';

const STORAGE_KEY = 'folla_islamic_garden_v2';

const DEFAULT_SAVE: SaveProgress = {
  day: 1,
  stars: 15,
  points: 0,
  totalChallengesWon: 0,
  meters: {
    purity: 45,
    faith: 45,
    manners: 50,
    knowledge: 40,
  },
  completedToday: [],
  unlockedWardrobes: ['mint'],
  activeWardrobe: 'mint',
  unlockedKeepsakes: [],
  appearance: {
    skinTone: 'warm',
    hairStyle: 'hijab_classic',
    outfit: 'mint_dress',
  },
  unlockedOutfits: ['mint_dress', 'andalus_abaya'],
  unlockedHairStyles: ['hijab_classic', 'hijab_floral', 'braids'],
  earnedBadges: [],
  completedProphetStories: [],
  hasCustomizedAppearance: false,
  drawings: [],
  storyIndex: 0,
  wordRoundIndex: 0,
  adhkarRoundIndex: 0,
};

function loadProgress(): SaveProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('folla_islamic_garden_v1');
    if (!raw) return DEFAULT_SAVE;
    const parsed = JSON.parse(raw) as Partial<SaveProgress>;
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      meters: {
        ...DEFAULT_SAVE.meters,
        ...(parsed.meters || {}),
      },
      appearance: {
        ...DEFAULT_SAVE.appearance,
        ...(parsed.appearance || {}),
      },
      drawings: Array.isArray(parsed.drawings) ? parsed.drawings : [],
    };
  } catch {
    return DEFAULT_SAVE;
  }
}

function getTimeOfDay(completedCount: number): TimeOfDay {
  if (completedCount === 0) return 'morning';
  if (completedCount === 1) return 'noon';
  if (completedCount === 2) return 'afternoon';
  return 'evening';
}

const CHALLENGE_BADGE_MAP: Record<ChallengeId, string> = {
  wudu: 'wudu_master',
  charity_catch: 'charity_heart',
  adhkar_cards: 'dhikr_tongue',
  values_story: 'honest_heart',
  words_light: 'light_seeker',
  recite_ayahs: 'quran_reciter',
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [save, setSave] = useState<SaveProgress>(() => loadProgress());
  const [activeChallenge, setActiveChallenge] = useState<ChallengeId | null>(null);
  const [keepsakesOpen, setKeepsakesOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [prophetsOpen, setProphetsOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [badgeToast, setBadgeToast] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(() => soundEngine.isMuted());
  const [dialogue, setDialogue] = useState(FOLLA_GREETINGS[0]);
  const [follaBounce, setFollaBounce] = useState(false);
  const [floatingItems, setFloatingItems] = useState<FloatingFeedback[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch {
      // Ignore storage errors
    }
  }, [save]);

  const showBadgeToast = useCallback((badgeId: string) => {
    const badge = BADGES.find((b) => b.id === badgeId);
    if (!badge) return;
    setBadgeToast(`تم فتح شارة جديدة: ${badge.title}`);
    window.setTimeout(() => setBadgeToast(null), 3600);
  }, []);

  const triggerBounce = useCallback(() => {
    setFollaBounce(true);
    window.setTimeout(() => setFollaBounce(false), 240);
  }, []);

  const pushFloating = useCallback((text: string, meter: MeterKey | 'stars' | 'points') => {
    const id = Date.now() + Math.random();
    setFloatingItems((prev) => [...prev.slice(-3), { id, text, meter }]);
    window.setTimeout(() => {
      setFloatingItems((prev) => prev.filter((item) => item.id !== id));
    }, 1100);
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const handleStartGame = useCallback(() => {
    soundEngine.playChime();
    setGameState('PLAYING');
  }, []);

  const handleResetSave = useCallback(() => {
    soundEngine.playTap();
    setSave(DEFAULT_SAVE);
    setDialogue(FOLLA_GREETINGS[0]);
    setActiveChallenge(null);
    setKeepsakesOpen(false);
    setCustomizerOpen(false);
    setRewardsOpen(false);
    setProphetsOpen(false);
    setStudioOpen(false);
    setGameState('PLAYING');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'TITLE_MENU') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleStartGame();
        }
        return;
      }

      if (e.key === 'Escape') {
        if (activeChallenge) {
          setActiveChallenge(null);
          return;
        }
        if (studioOpen) {
          setStudioOpen(false);
          return;
        }
        if (prophetsOpen) {
          setProphetsOpen(false);
          return;
        }
        if (customizerOpen) {
          setCustomizerOpen(false);
          return;
        }
        if (rewardsOpen) {
          setRewardsOpen(false);
          return;
        }
        if (keepsakesOpen) {
          setKeepsakesOpen(false);
          return;
        }
        if (gameState === 'PLAYING') {
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          setGameState('PLAYING');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    activeChallenge,
    keepsakesOpen,
    customizerOpen,
    rewardsOpen,
    prophetsOpen,
    studioOpen,
    handleStartGame,
  ]);

  const handleQuickCare = (action: 'smile' | 'water' | 'dhikr') => {
    soundEngine.playChime(action === 'water' ? 1.15 : 1);
    triggerBounce();

    if (action === 'smile') {
      setDialogue('وعليكم السلام ورحمة الله! تبسُّمك في وجه أخيك صدقة.');
      pushFloating('+4 الأخلاق · +10 نقاط', 'manners');
      setSave((prev) => ({
        ...prev,
        points: prev.points + 10,
        meters: {
          ...prev.meters,
          manners: Math.min(100, prev.meters.manners + 4),
        },
      }));
    } else if (action === 'water') {
      setDialogue('بسم الله قبل الشرب، والحمد لله بعده! الماء نعمة عظيمة.');
      pushFloating('+4 الطهارة · +10 نقاط', 'purity');
      setSave((prev) => ({
        ...prev,
        points: prev.points + 10,
        meters: {
          ...prev.meters,
          purity: Math.min(100, prev.meters.purity + 4),
        },
      }));
    } else {
      setDialogue('سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر.');
      pushFloating('+4 العبادة · +10 نقاط', 'faith');
      setSave((prev) => ({
        ...prev,
        points: prev.points + 10,
        meters: {
          ...prev.meters,
          faith: Math.min(100, prev.meters.faith + 4),
        },
      }));
    }
  };

  const handleChallengeComplete = (id: ChallengeId, bonusStars: number) => {
    const meta = CHALLENGES_META.find((c) => c.id === id);
    if (!meta) return;

    const alreadyDoneToday = save.completedToday.includes(id);
    const earnedStars =
      (alreadyDoneToday ? Math.ceil(meta.rewardStars / 2) : meta.rewardStars) +
      bonusStars;
    const earnedPoints = meta.rewardPoints + bonusStars * 4;
    const badgeId = CHALLENGE_BADGE_MAP[id];
    const isNewBadge = badgeId && !save.earnedBadges.includes(badgeId);

    soundEngine.playCelebration();
    triggerBounce();
    setActiveChallenge(null);

    setSave((prev) => {
      const nextCompleted = alreadyDoneToday
        ? prev.completedToday
        : [...prev.completedToday, id];
      const nextMeters = {
        ...prev.meters,
        [meta.meter]: Math.min(100, prev.meters[meta.meter] + meta.meterBoost),
      };
      const nextBadges =
        badgeId && !prev.earnedBadges.includes(badgeId)
          ? [...prev.earnedBadges, badgeId]
          : prev.earnedBadges;

      return {
        ...prev,
        stars: prev.stars + earnedStars,
        points: prev.points + earnedPoints,
        totalChallengesWon: prev.totalChallengesWon + 1,
        meters: nextMeters,
        completedToday: nextCompleted,
        earnedBadges: nextBadges,
        storyIndex: id === 'values_story' ? prev.storyIndex + 2 : prev.storyIndex,
        wordRoundIndex: id === 'words_light' ? prev.wordRoundIndex + 2 : prev.wordRoundIndex,
        adhkarRoundIndex: id === 'adhkar_cards' ? prev.adhkarRoundIndex + 1 : prev.adhkarRoundIndex,
      };
    });

    if (isNewBadge) {
      showBadgeToast(badgeId);
    }

    setDialogue(
      `ما شاء الله! أتممنا "${meta.title}" وحصلنا على ${earnedStars} نجمة و${earnedPoints} نقطة!`
    );
    pushFloating(`+${earnedStars} ★ · +${earnedPoints} ن`, 'stars');
  };

  const handleCompleteProphetStory = (storyId: string) => {
    const alreadyDone = save.completedProphetStories.includes(storyId);
    const earnedStars = alreadyDone ? 5 : 15;
    const earnedPoints = alreadyDone ? 25 : 60;

    const nextStoryIds = alreadyDone
      ? save.completedProphetStories
      : [...save.completedProphetStories, storyId];

    let newlyEarnedBadge: string | null = null;
    const nextBadges = [...save.earnedBadges];
    if (!nextBadges.includes('prophets_friend')) {
      nextBadges.push('prophets_friend');
      newlyEarnedBadge = 'prophets_friend';
    }
    if (
      nextStoryIds.length >= PROPHET_STORIES.length &&
      !nextBadges.includes('prophets_scholar')
    ) {
      nextBadges.push('prophets_scholar');
      newlyEarnedBadge = 'prophets_scholar';
    }

    setSave((prev) => ({
      ...prev,
      stars: prev.stars + earnedStars,
      points: prev.points + earnedPoints,
      completedProphetStories: nextStoryIds,
      earnedBadges: nextBadges,
      meters: {
        ...prev.meters,
        knowledge: Math.min(100, prev.meters.knowledge + 18),
        faith: Math.min(100, prev.meters.faith + 12),
      },
    }));

    if (newlyEarnedBadge) {
      showBadgeToast(newlyEarnedBadge);
    }

    setDialogue(
      `قصة جميلة ومباركة! تعلمنا منها حكمة عظيمة وكسبنا ${earnedPoints} نقطة.`
    );
  };

  const handleChangeSkinTone = (skinTone: SkinToneId) => {
    soundEngine.playTap();
    const unlockBadge = !save.earnedBadges.includes('style_care');
    setSave((prev) => ({
      ...prev,
      hasCustomizedAppearance: true,
      earnedBadges: unlockBadge
        ? [...prev.earnedBadges, 'style_care']
        : prev.earnedBadges,
      appearance: { ...prev.appearance, skinTone },
    }));
    if (unlockBadge) showBadgeToast('style_care');
  };

  const handleSelectOrUnlockHair = (hairStyle: HairStyleId) => {
    const option = HAIR_STYLE_OPTIONS.find((h) => h.id === hairStyle);
    if (!option) return;

    const unlockBadge = !save.earnedBadges.includes('style_care');

    if (save.unlockedHairStyles.includes(hairStyle)) {
      soundEngine.playTap();
      setSave((prev) => ({
        ...prev,
        hasCustomizedAppearance: true,
        earnedBadges: unlockBadge
          ? [...prev.earnedBadges, 'style_care']
          : prev.earnedBadges,
        appearance: { ...prev.appearance, hairStyle },
      }));
    } else if (save.stars >= option.cost) {
      soundEngine.playCelebration();
      setSave((prev) => ({
        ...prev,
        stars: prev.stars - option.cost,
        unlockedHairStyles: [...prev.unlockedHairStyles, hairStyle],
        hasCustomizedAppearance: true,
        earnedBadges: unlockBadge
          ? [...prev.earnedBadges, 'style_care']
          : prev.earnedBadges,
        appearance: { ...prev.appearance, hairStyle },
      }));
    }
    if (unlockBadge) showBadgeToast('style_care');
  };

  const handleSelectOrUnlockOutfit = (outfit: OutfitId) => {
    const option = OUTFIT_OPTIONS.find((o) => o.id === outfit);
    if (!option) return;

    const unlockBadge = !save.earnedBadges.includes('style_care');

    if (save.unlockedOutfits.includes(outfit)) {
      soundEngine.playTap();
      setSave((prev) => ({
        ...prev,
        hasCustomizedAppearance: true,
        earnedBadges: unlockBadge
          ? [...prev.earnedBadges, 'style_care']
          : prev.earnedBadges,
        appearance: { ...prev.appearance, outfit },
      }));
    } else if (save.stars >= option.cost) {
      soundEngine.playCelebration();
      setSave((prev) => ({
        ...prev,
        stars: prev.stars - option.cost,
        unlockedOutfits: [...prev.unlockedOutfits, outfit],
        hasCustomizedAppearance: true,
        earnedBadges: unlockBadge
          ? [...prev.earnedBadges, 'style_care']
          : prev.earnedBadges,
        appearance: { ...prev.appearance, outfit },
      }));
    }
    if (unlockBadge) showBadgeToast('style_care');
  };

  const handleFinishDay = () => {
    soundEngine.playCelebration();
    setGameState('DAY_COMPLETE');
  };

  const handleStartNextDay = () => {
    soundEngine.playChime();
    setSave((prev) => ({
      ...prev,
      day: prev.day + 1,
      stars: prev.stars + 10,
      points: prev.points + 40,
      completedToday: [],
      meters: {
        purity: Math.max(40, prev.meters.purity - 12),
        faith: Math.max(40, prev.meters.faith - 12),
        manners: Math.max(45, prev.meters.manners - 10),
        knowledge: Math.max(40, prev.meters.knowledge - 10),
      },
    }));
    setDialogue(`صباح الخير في اليوم ${save.day + 1}! هيا نبدأ يومنا بذكر الله.`);
    setGameState('PLAYING');
  };

  const handleUnlockOrSelectWardrobe = (id: string) => {
    const theme = WARDROBE_THEMES.find((t) => t.id === id);
    if (!theme) return;
    if (save.unlockedWardrobes.includes(id)) {
      soundEngine.playTap();
      setSave((prev) => ({ ...prev, activeWardrobe: id }));
    } else if (save.stars >= theme.cost) {
      soundEngine.playCelebration();
      setSave((prev) => ({
        ...prev,
        stars: prev.stars - theme.cost,
        unlockedWardrobes: [...prev.unlockedWardrobes, id],
        activeWardrobe: id,
      }));
    }
  };

  const handleUnlockKeepsake = (id: string) => {
    const item = ROOM_KEEPSAKES.find((k) => k.id === id);
    if (!item || save.unlockedKeepsakes.includes(id) || save.stars < item.cost) return;
    soundEngine.playCelebration();
    setSave((prev) => ({
      ...prev,
      stars: prev.stars - item.cost,
      unlockedKeepsakes: [...prev.unlockedKeepsakes, id],
    }));
  };

  const handleSaveDrawing = (drawing: Omit<SavedDrawing, 'id' | 'daySaved'>) => {
    soundEngine.playCelebration();
    triggerBounce();
    const isNewBadge = !save.earnedBadges.includes('young_artist');
    const newEntry: SavedDrawing = {
      ...drawing,
      id: `draw_${Date.now()}`,
      daySaved: save.day,
    };

    setSave((prev) => ({
      ...prev,
      stars: prev.stars + 10,
      points: prev.points + 30,
      drawings: [newEntry, ...prev.drawings].slice(0, 12),
      earnedBadges: isNewBadge
        ? [...prev.earnedBadges, 'young_artist']
        : prev.earnedBadges,
      meters: {
        ...prev.meters,
        knowledge: Math.min(100, prev.meters.knowledge + 10),
        manners: Math.min(100, prev.meters.manners + 10),
      },
    }));

    if (isNewBadge) {
      showBadgeToast('young_artist');
    }

    setDialogue(`ما أجمل لوحتك عن "${drawing.valueFocus}"! حُفظت في معرض الإنجازات.`);
    pushFloating('+10 ★ · +30 ن', 'stars');
  };

  const handleDeleteDrawing = (id: string) => {
    soundEngine.playTap();
    setSave((prev) => ({
      ...prev,
      drawings: prev.drawings.filter((d) => d.id !== id),
    }));
  };

  if (gameState === 'TITLE_MENU') {
    return (
      <TitleScreen
        save={save}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onStart={handleStartGame}
        onResetSave={handleResetSave}
      />
    );
  }

  const timeOfDay = getTimeOfDay(save.completedToday.length);
  const { current: currentLevel } = getLevelProgress(save.points);

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      <GameHud
        day={save.day}
        stars={save.stars}
        points={save.points}
        earnedBadgesCount={save.earnedBadges.length}
        timeOfDay={timeOfDay}
        meters={save.meters}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onPause={() => {
          soundEngine.playTap();
          setGameState('PAUSED');
        }}
        onOpenKeepsakes={() => {
          soundEngine.playTap();
          setKeepsakesOpen(true);
        }}
        onOpenCustomizer={() => {
          soundEngine.playTap();
          setCustomizerOpen(true);
        }}
        onOpenRewards={() => {
          soundEngine.playTap();
          setRewardsOpen(true);
        }}
        onOpenStudio={() => {
          soundEngine.playTap();
          setStudioOpen(true);
        }}
      />

      {/* New Badge Unlock Toast */}
      {badgeToast && (
        <div className="pointer-events-none fixed top-20 left-1/2 z-50 -translate-x-1/2">
          <div className="animate-pop-in flex items-center gap-2 rounded-xl border border-[#C78318] bg-[#FAF6EE] px-5 py-2.5 text-sm font-bold text-[#9A6008] shadow-lg">
            <Award className="h-5 w-5 text-[#C78318]" />
            <span>{badgeToast}</span>
          </div>
        </div>
      )}

      <FollaSanctuary
        save={save}
        timeOfDay={timeOfDay}
        dialogue={dialogue}
        follaBounce={follaBounce}
        floatingItems={floatingItems}
        onQuickCare={handleQuickCare}
        onStartChallenge={(id) => {
          soundEngine.playTap();
          setActiveChallenge(id);
        }}
        onOpenProphetsStories={() => {
          soundEngine.playTap();
          setProphetsOpen(true);
        }}
        onOpenCustomizer={() => {
          soundEngine.playTap();
          setCustomizerOpen(true);
        }}
        onOpenStudio={() => {
          soundEngine.playTap();
          setStudioOpen(true);
        }}
        onFinishDay={handleFinishDay}
      />

      {/* Active Mini-Challenge Modals */}
      {activeChallenge === 'wudu' && (
        <WuduChallenge
          onComplete={(bonus) => handleChallengeComplete('wudu', bonus)}
          onCancel={() => {
            soundEngine.playTap();
            setActiveChallenge(null);
          }}
        />
      )}

      {activeChallenge === 'charity_catch' && (
        <CharityCatchChallenge
          onComplete={(bonus) => handleChallengeComplete('charity_catch', bonus)}
          onCancel={() => {
            soundEngine.playTap();
            setActiveChallenge(null);
          }}
        />
      )}

      {activeChallenge === 'adhkar_cards' && (
        <AdhkarCardsChallenge
          roundIndex={save.adhkarRoundIndex}
          onComplete={(bonus) => handleChallengeComplete('adhkar_cards', bonus)}
          onCancel={() => {
            soundEngine.playTap();
            setActiveChallenge(null);
          }}
        />
      )}

      {activeChallenge === 'values_story' && (
        <ValuesStoryChallenge
          startIndex={save.storyIndex}
          onComplete={(bonus) => handleChallengeComplete('values_story', bonus)}
          onCancel={() => {
            soundEngine.playTap();
            setActiveChallenge(null);
          }}
        />
      )}

      {activeChallenge === 'words_light' && (
        <WordsLightChallenge
          startRound={save.wordRoundIndex}
          onComplete={(bonus) => handleChallengeComplete('words_light', bonus)}
          onCancel={() => {
            soundEngine.playTap();
            setActiveChallenge(null);
          }}
        />
      )}

      {activeChallenge === 'recite_ayahs' && (
        <ReciteAyahsChallenge
          onComplete={(bonus) => handleChallengeComplete('recite_ayahs', bonus)}
          onCancel={() => {
            soundEngine.playTap();
            setActiveChallenge(null);
          }}
        />
      )}

      {/* Prophets Stories Section Modal */}
      {prophetsOpen && (
        <ProphetsStoriesModal
          completedStoryIds={save.completedProphetStories}
          onCompleteStory={handleCompleteProphetStory}
          onClose={() => {
            soundEngine.playTap();
            setProphetsOpen(false);
          }}
        />
      )}

      {/* Folla Appearance Customizer Modal */}
      {customizerOpen && (
        <AppearanceCustomizer
          stars={save.stars}
          appearance={save.appearance}
          unlockedOutfits={save.unlockedOutfits}
          unlockedHairStyles={save.unlockedHairStyles}
          onChangeSkinTone={handleChangeSkinTone}
          onSelectOrUnlockHair={handleSelectOrUnlockHair}
          onSelectOrUnlockOutfit={handleSelectOrUnlockOutfit}
          onClose={() => {
            soundEngine.playTap();
            setCustomizerOpen(false);
          }}
        />
      )}

      {/* Rewards, Levels & Badges Modal */}
      {rewardsOpen && (
        <RewardsModal
          save={save}
          onClose={() => {
            soundEngine.playTap();
            setRewardsOpen(false);
          }}
        />
      )}

      {/* Keepsakes Wardrobe Modal */}
      {keepsakesOpen && (
        <KeepsakeDrawer
          stars={save.stars}
          unlockedWardrobes={save.unlockedWardrobes}
          activeWardrobe={save.activeWardrobe}
          unlockedKeepsakes={save.unlockedKeepsakes}
          onClose={() => {
            soundEngine.playTap();
            setKeepsakesOpen(false);
          }}
          onUnlockOrSelectWardrobe={handleUnlockOrSelectWardrobe}
          onUnlockKeepsake={handleUnlockKeepsake}
        />
      )}

      {/* Drawing Studio & Achievements Gallery Modal */}
      {studioOpen && (
        <DrawingStudioModal
          drawings={save.drawings}
          earnedBadgesCount={save.earnedBadges.length}
          day={save.day}
          onSaveDrawing={handleSaveDrawing}
          onDeleteDrawing={handleDeleteDrawing}
          onClose={() => {
            soundEngine.playTap();
            setStudioOpen(false);
          }}
        />
      )}

      {/* Pause Modal */}
      {gameState === 'PAUSED' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2A24]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-title"
        >
          <div className="animate-pop-in flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-[#1C2A24]/15 bg-[#FAF6EE] p-6 text-center shadow-xl">
            <h2 id="pause-title" className="text-2xl font-bold text-[#1C2A24]">
              استراحة قصيرة
            </h2>
            <p className="text-sm text-[#475B51] tabular-nums">
              اليوم {save.day} · المستوى {currentLevel.level} ({currentLevel.title}) · {save.stars} نجمة
            </p>
            <div className="flex w-full flex-col gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setGameState('PLAYING');
                }}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F6B4E] px-5 py-3 text-base font-bold text-white hover:bg-[#0B573F]"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>استكمال اللعب</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTap();
                  setGameState('TITLE_MENU');
                }}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#1C2A24]/15 bg-[#FFFFFF] px-5 py-2.5 text-sm font-bold text-[#1C2A24] hover:bg-[#EFE7D6]"
              >
                <Home className="h-4 w-4" />
                <span>العودة للشاشة الرئيسية</span>
              </button>
              <button
                type="button"
                onClick={handleResetSave}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#C2412D]/25 bg-[#FCECE9] px-5 py-2.5 text-sm font-bold text-[#9E2E1D] hover:bg-[#F9DDD7]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>بدء رحلة جديدة</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day Complete / Victory Modal */}
      {gameState === 'DAY_COMPLETE' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2A24]/55 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="day-complete-title"
        >
          <div className="animate-pop-in flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-[#C78318]/35 bg-[#FAF6EE] p-7 text-center shadow-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C78318]/15 text-[#C78318]">
              <Award className="h-9 w-9" />
            </div>
            <h2 id="day-complete-title" className="text-2xl font-bold text-[#1C2A24]">
              هنيئاً لك! أتممت اليوم {save.day}
            </h2>
            <p className="text-sm leading-relaxed text-[#475B51]">
              تعلّمت فُلَّة اليوم {save.completedToday.length} تحديات إسلامية رائعة، ووصلت إلى المستوى {currentLevel.level} ({currentLevel.title}).
            </p>

            <div className="grid w-full grid-cols-2 gap-2.5 rounded-xl border border-[#1C2A24]/10 bg-[#FFFFFF] p-4 text-sm font-bold">
              <div className="flex items-center justify-between text-[#0E7490]">
                <span>الطهارة</span>
                <span className="font-mono-num tabular-nums">{save.meters.purity}%</span>
              </div>
              <div className="flex items-center justify-between text-[#0F6B4E]">
                <span>العبادة</span>
                <span className="font-mono-num tabular-nums">{save.meters.faith}%</span>
              </div>
              <div className="flex items-center justify-between text-[#9A6008]">
                <span>الأخلاق</span>
                <span className="font-mono-num tabular-nums">{save.meters.manners}%</span>
              </div>
              <div className="flex items-center justify-between text-[#6D4C9E]">
                <span>العلم</span>
                <span className="font-mono-num tabular-nums">{save.meters.knowledge}%</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-bold text-[#9A6008]">
              <Star className="h-4 w-4 fill-[#C78318] text-[#C78318]" />
              <span>مكافأة إتمام اليوم: +10 نجوم و +40 نقطة</span>
            </div>

            <button
              type="button"
              onClick={handleStartNextDay}
              className="mt-1 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F6B4E] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-[#0B573F]"
            >
              <span>الانتقال إلى اليوم {save.day + 1}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
