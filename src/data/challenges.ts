import {
  BadgeDefinition,
  ChallengeId,
  HairStyleId,
  MeterKey,
  OutfitId,
  ProphetStory,
  RoomKeepsake,
  SkinToneId,
  SurahRecitation,
  WardrobeTheme,
} from '../types/game';

export interface ChallengeMeta {
  id: ChallengeId;
  title: string;
  subtitle: string;
  meter: MeterKey;
  meterLabel: string;
  rewardStars: number;
  rewardPoints: number;
  meterBoost: number;
}

export const CHALLENGES_META: ChallengeMeta[] = [
  {
    id: 'wudu',
    title: 'ترتيب خطوات الوضوء',
    subtitle: 'رتّب خطوات الوضوء الصحيحة بالماء الطهور',
    meter: 'purity',
    meterLabel: 'الطهارة',
    rewardStars: 15,
    rewardPoints: 50,
    meterBoost: 24,
  },
  {
    id: 'charity_catch',
    title: 'حصاد الصدقة والرفق',
    subtitle: 'التقط أعمال الخير وتجنب الإسراف والغضب',
    meter: 'manners',
    meterLabel: 'الأخلاق',
    rewardStars: 20,
    rewardPoints: 65,
    meterBoost: 24,
  },
  {
    id: 'adhkar_cards',
    title: 'بطاقات الأذكار والآداب',
    subtitle: 'طابق كل موقف يومي بالذكر النبوي المناسب',
    meter: 'faith',
    meterLabel: 'العبادة',
    rewardStars: 15,
    rewardPoints: 50,
    meterBoost: 24,
  },
  {
    id: 'values_story',
    title: 'ميزان الأخلاق والصدق',
    subtitle: 'ساعد فُلَّة في اختيار التصرف الإسلامي الحكيم',
    meter: 'manners',
    meterLabel: 'الأخلاق',
    rewardStars: 15,
    rewardPoints: 55,
    meterBoost: 20,
  },
  {
    id: 'words_light',
    title: 'حروف النور والقيم',
    subtitle: 'اكتشف كلمات القيم الإسلامية في شبكة الحروف',
    meter: 'knowledge',
    meterLabel: 'العلم',
    rewardStars: 20,
    rewardPoints: 65,
    meterBoost: 25,
  },
  {
    id: 'recite_ayahs',
    title: 'رتل آيات',
    subtitle: 'سجّل تلاوتك لقصار السور بالميكروفون',
    meter: 'faith',
    meterLabel: 'العبادة',
    rewardStars: 20,
    rewardPoints: 65,
    meterBoost: 24,
  },
];

export const METER_INFO: Record<MeterKey, { label: string; color: string; trackBg: string }> = {
  purity: {
    label: 'الطهارة',
    color: '#0E7490',
    trackBg: 'rgba(14, 116, 144, 0.14)',
  },
  faith: {
    label: 'العبادة',
    color: '#0F6B4E',
    trackBg: 'rgba(15, 107, 78, 0.14)',
  },
  manners: {
    label: 'الأخلاق',
    color: '#C78318',
    trackBg: 'rgba(199, 131, 24, 0.16)',
  },
  knowledge: {
    label: 'العلم',
    color: '#6D4C9E',
    trackBg: 'rgba(109, 76, 158, 0.14)',
  },
};

export interface SkinToneOption {
  id: SkinToneId;
  name: string;
  base: string;
  shadow: string;
  blush: string;
}

export const SKIN_TONES: SkinToneOption[] = [
  { id: 'fair', name: 'بشرة فاتحة', base: '#FDE4D2', shadow: '#EFC6AB', blush: '#F49D96' },
  { id: 'warm', name: 'بشرة دافئة', base: '#F4CBAE', shadow: '#DDA783', blush: '#E58A7E' },
  { id: 'wheat', name: 'بشرة قمحية', base: '#E2AF86', shadow: '#C88D60', blush: '#D47B6A' },
  { id: 'olive', name: 'بشرة سمراء ذهبية', base: '#C68B59', shadow: '#A86E3E', blush: '#B86655' },
  { id: 'bronze', name: 'بشرة برونزية عميقة', base: '#96613D', shadow: '#794B2C', blush: '#8E493C' },
];

export interface HairStyleOption {
  id: HairStyleId;
  name: string;
  category: 'حجاب محتشم' | 'تسريحة منزلية';
  cost: number;
  primaryColor: string;
  accentColor: string;
}

export const HAIR_STYLE_OPTIONS: HairStyleOption[] = [
  {
    id: 'hijab_classic',
    name: 'حجاب كريمي ناعم',
    category: 'حجاب محتشم',
    cost: 0,
    primaryColor: '#FAF2DF',
    accentColor: '#C78318',
  },
  {
    id: 'hijab_floral',
    name: 'شال الياسمين المزهّر',
    category: 'حجاب محتشم',
    cost: 0,
    primaryColor: '#E5F2EC',
    accentColor: '#B85D6F',
  },
  {
    id: 'hijab_gold',
    name: 'طرحة أندلسية مطرزة',
    category: 'حجاب محتشم',
    cost: 20,
    primaryColor: '#F6E7C8',
    accentColor: '#0F6B4E',
  },
  {
    id: 'braids',
    name: 'ضفيرتان جميلتان',
    category: 'تسريحة منزلية',
    cost: 0,
    primaryColor: '#3B2820',
    accentColor: '#C78318',
  },
  {
    id: 'bun_ribbon',
    name: 'شعر مرفوع بشريط وردي',
    category: 'تسريحة منزلية',
    cost: 15,
    primaryColor: '#4A3126',
    accentColor: '#B85D6F',
  },
  {
    id: 'wavy_headband',
    name: 'خصلات مموجة بطوق أزهار',
    category: 'تسريحة منزلية',
    cost: 20,
    primaryColor: '#2E1F19',
    accentColor: '#0F6B4E',
  },
];

export interface OutfitOption {
  id: OutfitId;
  name: string;
  description: string;
  cost: number;
  primaryColor: string;
  trimColor: string;
  patternColor: string;
}

export const OUTFIT_OPTIONS: OutfitOption[] = [
  {
    id: 'mint_dress',
    name: 'فستان النعناع المطرز',
    description: 'فستان محتشم مطرز بأوراق الربيع',
    cost: 0,
    primaryColor: '#5BA98B',
    trimColor: '#F5E7C6',
    patternColor: '#C78318',
  },
  {
    id: 'andalus_abaya',
    name: 'عباءة الزمرد الأندلسية',
    description: 'عباءة تقليدية أنيقة بحواف ذهبية',
    cost: 0,
    primaryColor: '#0F6B4E',
    trimColor: '#E6B956',
    patternColor: '#FAF6EE',
  },
  {
    id: 'jasmine_thobe',
    name: 'ثوب الياسمين التراثي',
    description: 'ثوب عربي أصيل بتطريز تراثي دافئ',
    cost: 20,
    primaryColor: '#9E3E52',
    trimColor: '#F3D28C',
    patternColor: '#FAF6EE',
  },
  {
    id: 'fajr_kaftan',
    name: 'قفطان الفجر السماوي',
    description: 'قفطان مغربي محتشم بحزام ذهبي',
    cost: 25,
    primaryColor: '#1E6B8A',
    trimColor: '#E8C067',
    patternColor: '#E6F4F8',
  },
];

export interface LevelInfo {
  level: number;
  title: string;
  minPoints: number;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: 'برعمة الخير', minPoints: 0 },
  { level: 2, title: 'زهرة الصدق', minPoints: 120 },
  { level: 3, title: 'نجمة الأمانة', minPoints: 280 },
  { level: 4, title: 'حافظة القيم', minPoints: 480 },
  { level: 5, title: 'قدوة الحديقة', minPoints: 750 },
  { level: 6, title: 'سفيرة النور', minPoints: 1100 },
];

export function getLevelProgress(points: number) {
  let current = LEVELS[0];
  let next: LevelInfo | null = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].minPoints) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
    }
  }
  const progressPct = next
    ? Math.min(
        100,
        Math.round(
          ((points - current.minPoints) / (next.minPoints - current.minPoints)) *
            100
        )
      )
    : 100;
  return { current, next, progressPct };
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'wudu_master',
    title: 'شارة الطهارة المتقنة',
    description: 'إتمام تحدي ترتيب خطوات الوضوء بنجاح',
    color: '#0E7490',
    iconType: 'droplet',
  },
  {
    id: 'charity_heart',
    title: 'شارة قلب الصدقة',
    description: 'جمع أعمال الخير في تحدي حصاد الصدقة',
    color: '#C78318',
    iconType: 'heart',
  },
  {
    id: 'dhikr_tongue',
    title: 'شارة الذاكرة للّه',
    description: 'مطابقة جميع بطاقات الأذكار والآداب اليومية',
    color: '#0F6B4E',
    iconType: 'sparkle',
  },
  {
    id: 'honest_heart',
    title: 'شارة الصادقة الأمينة',
    description: 'اختيار التصرف الحكيم في ميزان الأخلاق',
    color: '#B85D6F',
    iconType: 'scale',
  },
  {
    id: 'light_seeker',
    title: 'شارة باحثة النور',
    description: 'اكتشاف كلمات القيم في شبكة حروف النور',
    color: '#6D4C9E',
    iconType: 'book',
  },
  {
    id: 'prophets_friend',
    title: 'شارة محبة قصص الأنبياء',
    description: 'إتمام أول قصة من قصص الأنبياء والإجابة على أسئلتها',
    color: '#1E6B8A',
    iconType: 'scroll',
  },
  {
    id: 'prophets_scholar',
    title: 'شارة حافظة سير الأنبياء',
    description: 'إتمام جميع قصص الأنبياء الأربع بنجاح',
    color: '#9A6008',
    iconType: 'star',
  },
  {
    id: 'style_care',
    title: 'شارة أناقة فُلَّة',
    description: 'تخصيص مظهر فُلَّة بلمستك الخاصة',
    color: '#0F6B4E',
    iconType: 'palette',
  },
  {
    id: 'quran_reciter',
    title: 'شارة المرتّلة الصغيرة',
    description: 'تسجيل محاولة تلاوة قصار السور في تحدي رتل آيات',
    color: '#0F6B4E',
    iconType: 'mic',
  },
  {
    id: 'young_artist',
    title: 'شارة الرسامة المبدعة',
    description: 'رسم لوحة تعبيرية عن القيم الإسلامية وحفظها في معرض الإنجازات',
    color: '#B85D6F',
    iconType: 'brush',
  },
];

export interface DrawingPrompt {
  id: string;
  valueFocus: string;
  prompt: string;
}

export const DRAWING_VALUE_PROMPTS: DrawingPrompt[] = [
  {
    id: 'honesty',
    valueFocus: 'الصدق والأمانة',
    prompt: 'ارسمي قلباً مضيئاً أو نجوماً تعبّر عن الصدق والأمانة',
  },
  {
    id: 'mercy',
    valueFocus: 'الرحمة والرفق',
    prompt: 'ارسمي حديقة فيها طيور وأزهار تسقيها فُلَّة برفق',
  },
  {
    id: 'charity',
    valueFocus: 'الصدقة والعطاء',
    prompt: 'ارسمي شجرة مثمرة أو هدية نشاركها مع الجيران',
  },
  {
    id: 'gratitude',
    valueFocus: 'شكر الله والعبادة',
    prompt: 'ارسمي مسجداً صغيراً أو هلالاً وفانوساً تحت سماء جميلة',
  },
  {
    id: 'parents',
    valueFocus: 'بر الوالدين',
    prompt: 'ارسمي بيتاً دافئاً وابتسامة جميلة تسعد أمي وأبي',
  },
];

export const SHORT_SURAHS: SurahRecitation[] = [
  {
    id: 'ikhlas',
    name: 'سورة الإخلاص',
    meaning: 'تعلّمنا أن الله واحد أحد لا شريك له، وهو الصمد الذي نلجأ إليه في كل أمورنا.',
    ayahs: [
      'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾',
      'اللَّهُ الصَّمَدُ ﴿٢﴾',
      'لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾',
      'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾',
    ],
  },
  {
    id: 'kawthar',
    name: 'سورة الكوثر',
    meaning: 'تعلّمنا شكر الله على نعمه الكثيرة بالمحافظة على الصلاة والعمل الصالح.',
    ayahs: [
      'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ﴿١﴾',
      'فَصَلِّ لِرَبِّكَ وَانْحَرْ ﴿٢﴾',
      'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ ﴿٣﴾',
    ],
  },
  {
    id: 'asr',
    name: 'سورة العصر',
    meaning: 'تعلّمنا قيمة الوقت وأهمية الإيمان والعمل الصالح والتواصي بالحق والصبر.',
    ayahs: [
      'وَالْعَصْرِ ﴿١﴾',
      'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ﴿٢﴾',
      'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿٣﴾',
    ],
  },
  {
    id: 'falaq',
    name: 'سورة الفلق',
    meaning: 'نستعيذ بالله رب الصبح المشرق ليحفظنا من كل سوء في الليل والنهار.',
    ayahs: [
      'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾',
      'مِن شَرِّ مَا خَلَقَ ﴿٢﴾',
      'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾',
      'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ﴿٤﴾',
      'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾',
    ],
  },
  {
    id: 'nas',
    name: 'سورة الناس',
    meaning: 'نحفظ قلوبنا بالالتجاء إلى الله ملك الناس وإله الناس ليحمينا من الوسوسة.',
    ayahs: [
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾',
      'مَلِكِ النَّاسِ ﴿٢﴾',
      'إِلَٰهِ النَّاسِ ﴿٣﴾',
      'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾',
      'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾',
      'مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾',
    ],
  },
];

export const PROPHET_STORIES: ProphetStory[] = [
  {
    id: 'nuh',
    prophetName: 'نبي الله نوح عليه السلام',
    title: 'السفينة المباركة والصبر الجميل',
    valueFocus: 'الصبر والتوكل على الله',
    imagePath: '/src/assets/images/story_nuh_ark_1795050284204.jpg',
    chapters: [
      'دعا نبي الله نوح عليه السلام قومه إلى عبادة الله وحده مئات السنين بلطف وحكمة، وصبر على أذاهم صبراً عظيماً.',
      'أمره الله تعالى أن يصنع سفينة خشبية كبيرة على اليابسة بمساعدة المؤمنين، وحفظ فيها من كل نوع من الحيوانات والطيور زوجين اثنين.',
      'عندما جاء الطوفان، أنجى الله نوحاً والمؤمنين في السفينة برحمته، ثم استقرت السفينة بأمان على الجبل، وعادت الحياة مطمئنة بنعمة الله.',
    ],
    questions: [
      {
        question: 'ما الصفة العظيمة التي نتعلمها من دعوة نبي الله نوح عليه السلام؟',
        options: [
          'الغضب السريع والتوقف عن المحاولة',
          'الصبر الطويل والتوكل على الله',
          'إهمال مساعدة الآخرين',
        ],
        correctIndex: 1,
        explanation: 'صبر نوح عليه السلام مئات السنين في الدعوة إلى الخير وتوكّل على الله في كل خطوة.',
      },
      {
        question: 'لماذا أمر الله نوحاً أن يحمل معه في السفينة من كل الكائنات زوجين؟',
        options: [
          'رحمةً بالمخلوقات لتبقى الحياة مستمرة على الأرض',
          'للسباق في البحر فقط',
          'لإخفاء السفينة عن الغيوم',
        ],
        correctIndex: 0,
        explanation: 'الرحمة بالحيوان والطيور وسائر المخلوقات من أعظم مقاصد ديننا الحنيف.',
      },
    ],
  },
  {
    id: 'ibrahim',
    prophetName: 'نبي الله إبراهيم عليه السلام',
    title: 'التفكّر في السماء وبناء البيت الحرام',
    valueFocus: 'التفكّر والتوحيد وطاعة الله',
    imagePath: '/src/assets/images/story_ibrahim_sky_1795050284275.jpg',
    chapters: [
      'نظر نبي الله إبراهيم عليه السلام إلى النجوم والقمر والشمس في السماء ليتأمل عظمة الخالق، وعرف أن كل هذه المخلوقات تغيب وتنتهي، أما الله وحده فهو الباقي الذي خلق كل شيء.',
      'دعا إبراهيم عليه السلام الناس بالحكمة والموعظة الحسنة إلى عبادة الله الواحد، وكان قدوة في الكرم وإكرام الضيف وحسن الخلق.',
      'ومع ابنه إسماعيل عليه السلام، رفع قواعد الكعبة المشرفة في مكة، ودعيا الله أن يتقبل عملهما وأن يبارك في هذا البلد الأمين.',
    ],
    questions: [
      {
        question: 'ماذا فعل نبي الله إبراهيم عندما نظر إلى النجوم والقمر والشمس؟',
        options: [
          'تفكّر في خلق السماوات والأرض ليصل إلى عظمة الله الخالق',
          'نام مبكراً دون تأمل',
          'أحصى عدد السحب فقط',
        ],
        correctIndex: 0,
        explanation: 'التفكّر في بديع خلق الله يقوّي الإيمان في قلوبنا.',
      },
      {
        question: 'من الذي ساعد نبي الله إبراهيم في رفع قواعد الكعبة المشرفة؟',
        options: [
          'ابنه إسماعيل عليه السلام',
          'أهل قريش المتأخرون',
          'تجار المسافرين',
        ],
        correctIndex: 0,
        explanation: 'تعاون إبراهيم وابنه إسماعيل عليهما السلام في بناء الكعبة ودعوا: ربنا تقبّل منا.',
      },
    ],
  },
  {
    id: 'yunus',
    prophetName: 'نبي الله يونس عليه السلام',
    title: 'نداء الأمل والتسبيح في الظلمات',
    valueFocus: 'الاستغفار والأمل في رحمة الله',
    imagePath: '/src/assets/images/story_yunus_sea_1795050285520.jpg',
    chapters: [
      'خرج نبي الله يونس عليه السلام في سفينة في البحر، واشتدت الأمواج فوقع في البحر والتقمه حوت ضخم بأمر الله دون أن يؤذيه.',
      'في ظلمة البحر وبطن الحوت، لم ييأس يونس عليه السلام، بل دعا ربه بقلب خاشع: «لا إله إلا أنت سبحانك إني كنت من الظالمين».',
      'استجاب الله لدعائه الصادق وأخرجه سالماً إلى الشاطئ، وأنبت له شجرة يقطين لطيفة تظلله وتقوّيه، وعاد لقومه فآمنوا جميعاً.',
    ],
    questions: [
      {
        question: 'ما الدعاء المبارك الذي قاله نبي الله يونس عليه السلام في الشدة؟',
        options: [
          'لا إله إلا أنت سبحانك إني كنت من الظالمين',
          'أريد العودة سريعاً إلى القرية',
          'السفينة كبيرة جداً',
        ],
        correctIndex: 0,
        explanation: 'دعاء يونس عليه السلام يعلّمنا أن التسبيح والاعتراف بالخطأ يفرّجان الكرب بإذن الله.',
      },
      {
        question: 'ماذا نتعلم عندما نواجه موقفاً صعباً في حياتنا؟',
        options: [
          'أن نيأس ونستسلم للحزن',
          'أن ندعو الله بأمل وثقة أنه يسمعنا ويرحمنا',
          'أن نغضب من أصدقائنا',
        ],
        correctIndex: 1,
        explanation: 'المؤمن لا يفقد الأمل أبداً، ويلجأ إلى الله بالدعاء في كل وقت.',
      },
    ],
  },
  {
    id: 'sulaiman',
    prophetName: 'نبي الله سليمان عليه السلام',
    title: 'وادي النمل والشكر على النعم',
    valueFocus: 'شكر النعمة والرحمة بالكائنات',
    imagePath: '/src/assets/images/story_sulaiman_valley_1795050285633.jpg',
    chapters: [
      'أنعم الله على نبي الله سليمان عليه السلام بملك عظيم، وعلّمه فهم لغة الطيور والنمل، فكان دائم الشكر لله على هذه النعم.',
      'ذات يوم وهو يسير بجيشه، سمع نملة صغيرة تنادي أخواتها: يا أيها النمل ادخلوا مساكنكم لا يحطمنكم سليمان وجنوده وهم لا يشعرون.',
      'فتبسّم سليمان عليه السلام ضاحكاً من قولها، وأوقف جيشه رفقاً بالنمل الصغير، ودعا ربه: «رب أوزعني أن أشكر نعمتك التي أنعمت عليّ».',
    ],
    questions: [
      {
        question: 'كيف تصرف نبي الله سليمان عندما سمع كلام النملة الصغيرة؟',
        options: [
          'تبسّم برفق وحمى النمل من الأذى وشكر الله',
          'تجاهل الصوت وأسرع بالمشي',
          'غضب من النملة',
        ],
        correctIndex: 0,
        explanation: 'أظهر نبي الله سليمان رفقاً عظيماً بأصغر المخلوقات وشكر الله على نعمته.',
      },
      {
        question: 'كيف نشكر الله مثل نبي الله سليمان عندما يرزقنا نعماً جميلة؟',
        options: [
          'نقول الحمد لله ونستخدم النعم في الخير ومساعدة الناس',
          'نتفاخر أمام أصدقائنا',
          'نسرف في الأكل والماء',
        ],
        correctIndex: 0,
        explanation: 'الشكر يكون بالقلب واللسان والعمل الصالح النافع للناس.',
      },
    ],
  },
];

export interface WuduStep {
  id: string;
  order: number;
  title: string;
  detail: string;
}

export const WUDU_STEPS: WuduStep[] = [
  { id: 'niyyah', order: 1, title: 'النية والتسمية', detail: 'أنوي الوضوء في قلبي وأقول: بسم الله' },
  { id: 'hands', order: 2, title: 'غسل الكفين', detail: 'أغسل كفّيّ ثلاث مرات بالماء الطهور' },
  { id: 'mouth', order: 3, title: 'المضمضة والاستنشاق', detail: 'أتمضمض وأستنشق ثلاث مرات برفق' },
  { id: 'face', order: 4, title: 'غسل الوجه', detail: 'أغسل وجهي كاملاً ثلاث مرات' },
  { id: 'arms', order: 5, title: 'غسل اليدين للمرفقين', detail: 'أغسل اليمنى ثم اليسرى إلى المرفقين' },
  { id: 'head', order: 6, title: 'مسح الرأس والأذنين', detail: 'أمسح رأسي وأذنيّ بالماء مرة واحدة' },
  { id: 'feet', order: 7, title: 'غسل الرجلين للكعبين', detail: 'أغسل اليمنى ثم اليسرى إلى الكعبين' },
];

export interface AdhkarPair {
  id: string;
  situation: string;
  dhikr: string;
  lesson: string;
}

export const ADHKAR_SETS: AdhkarPair[][] = [
  [
    {
      id: 'eat',
      situation: 'قبل تناول الطعام',
      dhikr: 'بسم الله',
      lesson: 'نبدأ طعامنا بذكر الله ليبارك لنا فيه',
    },
    {
      id: 'wake',
      situation: 'عند الاستيقاظ صباحاً',
      dhikr: 'الحمد لله الذي أحيانا',
      lesson: 'نشكر الله كل صباح على نعمة الحياة والعافية',
    },
    {
      id: 'home',
      situation: 'عند دخول المنزل',
      dhikr: 'السلام عليكم ورحمة الله',
      lesson: 'إفشاء السلام ينشر المحبة والبركة في البيت',
    },
    {
      id: 'sleep',
      situation: 'قبل النوم ليلاً',
      dhikr: 'باسمك اللهم أموت وأحيا',
      lesson: 'ننام مطمئنين في حفظ الله ورعايته',
    },
  ],
  [
    {
      id: 'finish_eat',
      situation: 'بعد الفراغ من الطعام',
      dhikr: 'الحمد لله الذي أطعمنا',
      lesson: 'شكر النعمة سبب في دوامها وزيادتها',
    },
    {
      id: 'sneeze',
      situation: 'عند العطاس',
      dhikr: 'الحمد لله',
      lesson: 'نحمد الله وندعو لأخينا: يرحمك الله',
    },
    {
      id: 'gratitude',
      situation: 'عند شكر من ساعدنا',
      dhikr: 'جزاكم الله خيراً',
      lesson: 'أجمل شكر هو الدعاء لمن أحسن إلينا بالخير',
    },
    {
      id: 'leave_home',
      situation: 'عند الخروج من البيت',
      dhikr: 'توكلت على الله',
      lesson: 'نستعين بالله في كل خطواتنا خارج المنزل',
    },
  ],
];

export interface StoryChoice {
  label: string;
  isVirtuous: boolean;
  reaction: string;
  wisdom: string;
}

export interface MoralStory {
  id: string;
  title: string;
  setting: string;
  dilemma: string;
  choices: StoryChoice[];
}

export const MORAL_STORIES: MoralStory[] = [
  {
    id: 'lost_coin',
    title: 'القطعة النقدية في فناء المدرسة',
    setting: 'وجدت فُلَّة قطعة نقدية قرب مقعد اللعب أثناء الاستراحة.',
    dilemma: 'كيف تتصرف فُلَّة في هذا الموقف؟',
    choices: [
      {
        label: 'تحتفظ بها في حقيبتها لشراء الحلوى دون إخبار أحد',
        isVirtuous: false,
        reaction: 'شعرت فُلَّة بالقلق لأن صاحبة المال قد تكون حزينة لفقدانه.',
        wisdom: 'الأمانة من أعظم صفات المسلم؛ نرد اللقطة والمال إلى أصحابه.',
      },
      {
        label: 'تسلمها للمعلمة وتبحث معها عن صاحبتها',
        isVirtuous: true,
        reaction: 'فرحت فُلَّة كثيراً عندما عادت النقود إلى زميلتها الصغيرة!',
        wisdom: 'الأمانة تجلب ثقة الناس ورضا الله، كما كان نبينا يُلقب بالصادق الأمين.',
      },
      {
        label: 'تتركها على الأرض وتبتعد مسرعة',
        isVirtuous: false,
        reaction: 'قد تضيع النقود مرة أخرى ولن تصل إلى صاحبتها.',
        wisdom: 'حفظ أمانات الآخرين وإيصالها لأهلها عمل نبيل ومحبوب.',
      },
    ],
  },
  {
    id: 'water_saving',
    title: 'صنبور الماء أثناء الوضوء',
    setting: 'لاحظت فُلَّة أن الماء يتدفق بغزارة بينما تتوضأ لصلاة العصر.',
    dilemma: 'ماذا تفعل فُلَّة عملاً بسنة النبي ﷺ؟',
    choices: [
      {
        label: 'تخفف فتح الصنبور وتستخدم الماء بقدر الحاجة فقط',
        isVirtuous: true,
        reaction: 'ابتسمت فُلَّة وهي تتوضأ بهدوء وتعتني بنعمة الماء.',
        wisdom: 'علّمنا النبي ﷺ عدم الإسراف في الماء ولو كنا على نهر جارٍ.',
      },
      {
        label: 'تترك الصنبور مفتوحاً بقوة حتى تنتهي من الحديث مع صديقتها',
        isVirtuous: false,
        reaction: 'أُهدر الكثير من الماء النقي دون فائدة.',
        wisdom: 'الماء نعمة عظيمة من الله، وشكر النعمة يكون بالحفاظ عليها.',
      },
    ],
  },
  {
    id: 'broken_cup',
    title: 'الكوب المزخرف المكسور',
    setting: 'سقط كوب أم فُلَّة المفضل دون قصد بينما كانت ترتب الطاولة.',
    dilemma: 'ماذا تقول فُلَّة لوالدتها عندما تسأل عما حدث؟',
    choices: [
      {
        label: 'تقول: القطة هي التي أسقطت الكوب',
        isVirtuous: false,
        reaction: 'شعرت فُلَّة بضيق في قلبها لأنها لم تقل الحقيقة.',
        wisdom: 'الصدق يهدي إلى البر، والكذب يبعد الطمأنينة عن القلب.',
      },
      {
        label: 'تعتذر بصدق وتخبر والدتها أنها أسقطته دون قصد وتساعد في التنظيف',
        isVirtuous: true,
        reaction: 'عانقت الأم فُلَّة وشكرتها على صدقها وشجاعتها.',
        wisdom: 'الصدق منجاة، والاعتذار الجميل يزيد المحبة بين الأبناء والوالدين.',
      },
    ],
  },
  {
    id: 'sharing_dates',
    title: 'تمرات الحديقة ومشاركة الجار',
    setting: 'قطفت فُلَّة سلة صغيرة من التمر والياسمين مع جدتها.',
    dilemma: 'ما أجمل تصرف تقوم به فُلَّة؟',
    choices: [
      {
        label: 'تهدي طبقاً لطيفاً للجارة المسنّة وتسلّم عليها بابتسامة',
        isVirtuous: true,
        reaction: 'دعت الجارة لفُلَّة بالخير والبركة فامتلأ قلبها سروراً.',
        wisdom: 'الإحسان إلى الجار وإدخال السرور على قلوب الناس من أحب الأعمال إلى الله.',
      },
      {
        label: 'تخفي السلة كلها حتى لا يشاركها أحد',
        isVirtuous: false,
        reaction: 'تذوقت التمر وحدها لكنها افتقدت فرحة المشاركة.',
        wisdom: 'الكرم والمشاركة يضاعفان البركة والمحبة بين الجيران.',
      },
    ],
  },
];

export interface WordPuzzleRound {
  id: string;
  word: string;
  clue: string;
  lesson: string;
  gridSize: number;
  cells: string[];
  targetPath: number[];
}

export const CLEAN_WORD_ROUNDS: WordPuzzleRound[] = [
  {
    id: 'sidq',
    word: 'صدق',
    clue: 'قول الحقيقة دائماً في كل المواقف',
    lesson: 'الصدق يهدي إلى البر، والبر يهدي إلى الجنة.',
    gridSize: 5,
    cells: [
      'م', 'ن', 'ب', 'ت', 'ر',
      'ح', 'ص', 'د', 'ق', 'ل',
      'و', 'ي', 'ع', 'ف', 'ك',
      'س', 'ج', 'ه', 'ز', 'ط',
      'غ', 'ش', 'ظ', 'ض', 'خ',
    ],
    targetPath: [6, 7, 8],
  },
  {
    id: 'amanah',
    word: 'أمانة',
    clue: 'حفظ أغراض الآخرين وأسرارهم وردّ الحقوق',
    lesson: 'الأمانة دليل على نقاء القلب وقوة الإيمان.',
    gridSize: 5,
    cells: [
      'أ', 'م', 'ا', 'ن', 'ة',
      'س', 'ر', 'ب', 'ح', 'ل',
      'ك', 'و', 'د', 'ي', 'ع',
      'ت', 'ف', 'ج', 'ق', 'ط',
      'ز', 'ش', 'ض', 'غ', 'ظ',
    ],
    targetPath: [0, 1, 2, 3, 4],
  },
  {
    id: 'rahmah',
    word: 'رحمة',
    clue: 'الرفق بالحيوان واللطف مع الصغير والكبير',
    lesson: 'الراحمون يرحمهم الرحمن؛ ارحموا من في الأرض يرحمكم من في السماء.',
    gridSize: 5,
    cells: [
      'ع', 'ل', 'ر', 'ب', 'س',
      'ي', 'ف', 'ح', 'ك', 'ن',
      'ت', 'و', 'م', 'ج', 'د',
      'ق', 'ص', 'ة', 'ض', 'ط',
      'غ', 'ش', 'ز', 'خ', 'ظ',
    ],
    targetPath: [2, 7, 12, 17],
  },
  {
    id: 'salah',
    word: 'صلاة',
    clue: 'الركن الثاني من أركان الإسلام وصلة العبد بربه',
    lesson: 'الصلاة نور للقلب وطمأنينة للروح خمس مرات كل يوم.',
    gridSize: 5,
    cells: [
      'ب', 'ت', 'ج', 'د', 'ر',
      'م', 'س', 'و', 'ك', 'ف',
      'ص', 'ل', 'ا', 'ة', 'ن',
      'ع', 'غ', 'ح', 'ي', 'ق',
      'ز', 'ش', 'ط', 'ظ', 'خ',
    ],
    targetPath: [10, 11, 12, 13],
  },
  {
    id: 'taawun',
    word: 'تعاون',
    clue: 'مساعدة الأهل والأصدقاء في أعمال الخير',
    lesson: 'قال تعالى: وتعاونوا على البر والتقوى.',
    gridSize: 5,
    cells: [
      'ت', 'ع', 'ا', 'و', 'ن',
      'ب', 'ي', 'س', 'م', 'ل',
      'ر', 'ح', 'د', 'ق', 'ك',
      'ج', 'ف', 'ض', 'ص', 'ه',
      'ط', 'ز', 'ش', 'غ', 'ظ',
    ],
    targetPath: [0, 1, 2, 3, 4],
  },
];

export const WARDROBE_THEMES: WardrobeTheme[] = [
  {
    id: 'mint',
    name: 'نعناع الحديقة',
    cost: 0,
    ringColor: '#0F6B4E',
    accentBg: 'bg-[#0F6B4E]',
    accentText: 'text-[#0F6B4E]',
    frameTint: 'rgba(15, 107, 78, 0.08)',
  },
  {
    id: 'jasmine',
    name: 'ياسمين الصباح',
    cost: 20,
    ringColor: '#B85D6F',
    accentBg: 'bg-[#B85D6F]',
    accentText: 'text-[#B85D6F]',
    frameTint: 'rgba(184, 93, 111, 0.08)',
  },
  {
    id: 'fajr',
    name: 'زرقة الفجر',
    cost: 35,
    ringColor: '#1E6B8A',
    accentBg: 'bg-[#1E6B8A]',
    accentText: 'text-[#1E6B8A]',
    frameTint: 'rgba(30, 107, 138, 0.08)',
  },
  {
    id: 'saffron',
    name: 'ذهب السحر',
    cost: 50,
    ringColor: '#C78318',
    accentBg: 'bg-[#C78318]',
    accentText: 'text-[#C78318]',
    frameTint: 'rgba(199, 131, 24, 0.09)',
  },
];

export const ROOM_KEEPSAKES: RoomKeepsake[] = [
  {
    id: 'lantern',
    name: 'فانوس النور',
    meaning: 'يذكّرنا بأن العلم والأخلاق ينيران طريقنا',
    cost: 15,
    iconKey: 'lantern',
  },
  {
    id: 'olive',
    name: 'شتلة الزيتون',
    meaning: 'غرس الشجر والعناية بالطبيعة صدقة جارية',
    cost: 25,
    iconKey: 'olive',
  },
  {
    id: 'charity_box',
    name: 'حصالة الصدقة',
    meaning: 'ندخر فيها قليلاً كل يوم لمساعدة المحتاجين',
    cost: 30,
    iconKey: 'charity_box',
  },
  {
    id: 'prayer_mat',
    name: 'سجادة الصلاة المزخرفة',
    meaning: 'نحافظ على صلواتنا الخمس بخشوع وسكينة',
    cost: 40,
    iconKey: 'prayer_mat',
  },
];

export const FOLLA_GREETINGS: string[] = [
  'السلام عليكم يا صديقي! هل نستعد اليوم لتعلم قيمة جديدة معاً؟',
  'ابتسامتك في وجه أخيك صدقة جميلة يحبها الله!',
  'ما أجمل أن نبدأ أعمالنا بقول: بسم الله الرحمن الرحيم.',
  'الرفق واللطف يزيّنان كل عمل نقوم به في يومنا.',
  'هيا نعتني بطهارتنا وصلاتنا وعلمنا لنرتقي كل يوم!',
];
