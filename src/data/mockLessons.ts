import { TarkibExercise, ImlaExercise, HijaiyahTraceItem } from '../types';

export const TARKIB_EXERCISES: TarkibExercise[] = [
  {
    id: 'tarkib-1',
    scrambledWords: ['إِلَى', 'الْمَدْرَسَةِ', 'يَذْهَبُ', 'الطَّالِبُ', 'صَبَاحًا'],
    correctOrder: ['يَذْهَبُ', 'الطَّالِبُ', 'إِلَى', 'الْمَدْرَسَةِ', 'صَبَاحًا'],
    translation: 'Siswa itu pergi ke sekolah pada pagi hari.',
    type: 'Jumlah Fi\'liyyah',
    grammarHint: 'Mulailah dengan fi\'il mudhari\' (يَذْهَبُ), diikuti fa\'il (الطَّالِبُ), lalu huruf jar dan majrur.'
  },
  {
    id: 'tarkib-2',
    scrambledWords: ['اللُّغَةَ', 'فِي', 'الْفَصْلِ', 'يَتَعَلَّمُ', 'التَّلَامِيذُ', 'الْعَرَبِيَّةَ'],
    correctOrder: ['يَتَعَلَّمُ', 'التَّلَامِيذُ', 'اللُّغَةَ', 'الْعَرَبِيَّةَ', 'فِي', 'الْفَصْلِ'],
    translation: 'Para murid mempelajari bahasa Arab di dalam kelas.',
    type: 'Jumlah Fi\'liyyah',
    grammarHint: 'Struktur: Fi\'il (يَتَعَلَّمُ) + Fa\'il (التَّلَامِيذُ) + Maf\'ul Bih (اللُّغَةَ الْعَرَبِيَّةَ) + Keterangan tempat.'
  },
  {
    id: 'tarkib-3',
    scrambledWords: ['نَظِيفَةٌ', 'الْمَدْرَسَةِ', 'حَدِيقَةُ', 'وَوَاسِعَةٌ'],
    correctOrder: ['حَدِيقَةُ', 'الْمَدْرَسَةِ', 'نَظِيفَةٌ', 'وَوَاسِعَةٌ'],
    translation: 'Taman sekolah itu bersih dan luas.',
    type: 'Jumlah Ismiyyah',
    grammarHint: 'Mubtada\' berbentuk mudhaf-mudhaf ilaih (حَدِيقَةُ الْمَدْرَسَةِ), khabar-nya adalah (نَظِيفَةٌ).'
  },
  {
    id: 'tarkib-4',
    scrambledWords: ['كِتَابًا', 'قَرَأَ', 'مُفِيدًا', 'مُحَمَّدٌ', 'الْمَكْتَبَةِ', 'فِي'],
    correctOrder: ['قَرَأَ', 'مُحَمَّدٌ', 'كِتَابًا', 'مُفِيدًا', 'فِي', 'الْمَكْتَبَةِ'],
    translation: 'Muhammad telah membaca buku yang bermanfaat di perpustakaan.',
    type: 'Jumlah Fi\'liyyah',
    grammarHint: 'Fi\'il Madhi (قَرَأَ) + Fa\'il (مُحَمَّدٌ) + Maf\'ul bih berserta na\'at (كِتَابًا مُفِيدًا).'
  },
  {
    id: 'tarkib-5',
    scrambledWords: ['الْأُسْتَاذُ', 'الدَّرْسَ', 'يَشْرَحُ', 'بِوُضُوحٍ', 'لِلطُّلَّابِ'],
    correctOrder: ['يَشْرَحُ', 'الْأُسْتَاذُ', 'الدَّرْسَ', 'لِلطُّلَّابِ', 'بِوُضُوحٍ'],
    translation: 'Ustadz menjelaskan pelajaran kepada para santri dengan jelas.',
    type: 'Jumlah Fi\'liyyah',
    grammarHint: 'Susun dari kata kerja (يَشْرَحُ), subjek, objek, kemudian keterangan.'
  }
];

export const IMLA_EXERCISES: ImlaExercise[] = [
  {
    id: 'imla-1',
    sentenceWithBlank: 'سَافَرَ أَحْمَدُ [...] مَكَّةَ الْمُكَرَّمَةِ بِالطَّائِرَةِ.',
    options: ['إِلَى', 'عَلَى', 'فِي', 'مِنْ'],
    correctAnswer: 'إِلَى',
    fullSentence: 'سَافَرَ أَحْمَدُ إِلَى مَكَّةَ الْمُكَرَّمَةِ بِالطَّائِرَةِ.',
    translation: 'Ahmad bepergian ke Makkah Al-Mukarramah dengan pesawat terbang.',
    ruleExplanation: 'Huruf jar "إِلَى" (ke/menuju) menunjukkan batas akhir tujuan (intihā\'ul ghāyah).'
  },
  {
    id: 'imla-2',
    sentenceWithBlank: 'الْمُعَلِّمَةُ [...] الدَّرْسَ عَلَى السَّبُّورَةِ بِإِتْقَانٍ.',
    options: ['تَكْتُبُ', 'يَكْتُبُ', 'تَكْتُبُونَ', 'كَتَبُوا'],
    correctAnswer: 'تَكْتُبُ',
    fullSentence: 'الْمُعَلِّمَةُ تَكْتُبُ الدَّرْسَ عَلَى السَّبُّورَةِ بِإِتْقَانٍ.',
    translation: 'Ibu guru menulis pelajaran di papan tulis dengan tekun.',
    ruleExplanation: 'Fi\'il mudhari\' muannats mufrad diawali huruf Ta (تَكْتُبُ) karena fa\'il adalah muannats (الْمُعَلِّمَةُ).'
  },
  {
    id: 'imla-3',
    sentenceWithBlank: 'اشْتَرَيْتُ [...] جَدِيدًا مِنَ الدُّكَّانِ.',
    options: ['قَلَمًا', 'قَلَمٌ', 'قَلَمٍ', 'الْقَلَمُ'],
    correctAnswer: 'قَلَمًا',
    fullSentence: 'اشْتَرَيْتُ قَلَمًا جَدِيدًا مِنَ الدُّكَّانِ.',
    translation: 'Saya telah membeli sebuah pena baru dari toko.',
    ruleExplanation: 'Maf\'ul bih berkedudukan manshub dengan tanda fathatain/tanwin fathah (قَلَمًا).'
  },
  {
    id: 'imla-4',
    sentenceWithBlank: 'هَذِهِ حَقِيبَةٌ [...] وَجَمِيلَةٌ.',
    options: ['صَغِيرَةٌ', 'صَغِيرًا', 'صَغِيرٍ', 'صَغِيرُ'],
    correctAnswer: 'صَغِيرَةٌ',
    fullSentence: 'هَذِهِ حَقِيبَةٌ صَغِيرَةٌ وَجَمِيلَةٌ.',
    translation: 'Ini adalah tas yang kecil dan indah.',
    ruleExplanation: 'Na\'at (sifat) mengikuti man\'ut (حَقِيبَةٌ) yang marfu\' bertanwin dhammah dan muannats.'
  },
  {
    id: 'imla-5',
    sentenceWithBlank: 'الْأَوْلَادُ [...] كُرَةَ الْقَدَمِ فِي الْمَيْدَانِ.',
    options: ['يَلْعَبُونَ', 'يَلْعَبُ', 'تَلْعَبُ', 'يَلْعَبْنَ'],
    correctAnswer: 'يَلْعَبُونَ',
    fullSentence: 'الْأَوْلَادُ يَلْعَبُونَ كُرَةَ الْقَدَمِ فِي الْمَيْدَانِ.',
    translation: 'Anak-anak laki-laki sedang bermain sepak bola di lapangan.',
    ruleExplanation: 'Pada Jumlah Ismiyyah dengan mubtada\' jama\' mudzakkar (الْأَوْلَادُ), fi\'il dalam khabar menyertai wawu jama\'ah (يَلْعَبُونَ).'
  }
];

export const WRITING_THEMES = [
  {
    id: 'yaumiyyat',
    title: 'اليَوْمِيَّاتُ فِي الْمَدْرَسَةِ',
    subTitle: 'Keseharian di Sekolah & Pesantren',
    level: 'Mubtadi / Pemula',
    guidingQuestions: [
      'فِي أَيِّ سَاعَةٍ تَسْتَيْقِظُ مِنَ النَّوْمِ؟',
      'مَاذَا تَفْعَلُ قَبْلَ الذَّهَابِ إِلَى الْمَدْرَسَةِ؟',
      'مَا هُوَ دَرْسُكَ الْمُفَضَّلُ؟'
    ],
    vocabularies: [
      { arabic: 'أَسْتَيْقِظُ', meaning: 'Saya bangun' },
      { arabic: 'أَتَنَاوَلُ الْفُطُورَ', meaning: 'Sarapan pagi' },
      { arabic: 'الْأَصْدِقَاءُ', meaning: 'Teman-teman' },
      { arabic: 'مَسْرُورًا', meaning: 'Dengan gembira' }
    ],
    starter: 'فِي كُلِّ يَوْمٍ، أَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ صَبَاحًا...'
  },
  {
    id: 'usrah',
    title: 'أُسْرَتِي السَّعِيدَةُ',
    subTitle: 'Keluargaku yang Bahagia',
    level: 'Mubtadi / Pemula',
    guidingQuestions: [
      'كَمْ عَدَدُ أَعْضَاءِ أُسْرَتِكَ؟',
      'مَا مِهْنَةُ أَبِيكَ وَأُمِّكَ؟',
      'كَيْفَ تَقْضُونَ عُطْلَةَ نِهَايَةِ الْأُسْبُوعِ؟'
    ],
    vocabularies: [
      { arabic: 'أَبِي وَأُمِّي', meaning: 'Ayah dan ibuku' },
      { arabic: 'مَوَدَّةٌ وَرَحْمَةٌ', meaning: 'Kasih sayang' },
      { arabic: 'نَجْتَمِعُ', meaning: 'Kami berkumpul' },
      { arabic: 'الْبَيْتُ', meaning: 'Rumah' }
    ],
    starter: 'أَنَا أَعِيشُ مَعَ أُسْرَتِي الْمُحِبَّةِ فِي بَيْتٍ جَمِيلٍ...'
  },
  {
    id: 'hiwayah',
    title: 'هِوَايَتِي الْمُفَضَّلَةُ',
    subTitle: 'Hobi dan Kegemaranku',
    level: 'Mutawassith / Menengah',
    guidingQuestions: [
      'مَا هِيَ هِوَايَتُكَ الَّتِي تُحِبُّهَا؟',
      'مُنْذُ مَتَى بَدَأْتَ تُمَارِسُ هَذِهِ الْهِوَايَةَ؟',
      'مَا هِيَ الْفَوَائِدُ الَّتِي تَحْصُلُ عَلَيْهَا؟'
    ],
    vocabularies: [
      { arabic: 'الْقِرَاءَةُ', meaning: 'Membaca' },
      { arabic: 'الْكِتَابَةُ', meaning: 'Menulis' },
      { arabic: 'الرِّيَاضَةُ', meaning: 'Olahraga' },
      { arabic: 'تَنْشِيطُ الْعَقْلِ', meaning: 'Menyegarkan pikiran' }
    ],
    starter: 'لِكُلِّ إِنْسَانٍ هِوَايَةٌ يُفَضِّلُهَا، وَهِوَايَتِي أَنَا هِيَ...'
  },
  {
    id: 'safar',
    title: 'رِحْلَةٌ لَا تُنْسَى',
    subTitle: 'Perjalanan yang Tak Terlupakan',
    level: 'Mutaqaddim / Mahir',
    guidingQuestions: [
      'إِلَى أَيْنَ سَافَرْتَ فِي الْعُطْلَةِ الْمَاضِيَةِ؟',
      'مَا هِيَ الْمَنَاظِرُ الطَّبِيعِيَّةُ الَّتِي شَاهَدْتَهَا؟',
      'كَيْفَ كَانَ شُعُورُكَ أَثْنَاءَ الرِّحْلَةِ؟'
    ],
    vocabularies: [
      { arabic: 'الْمَنَاظِرُ الْخَلَّابَةُ', meaning: 'Pemandangan mempesona' },
      { arabic: 'الْجِبَالُ وَالْبِحَارُ', meaning: 'Gunung & lautan' },
      { arabic: 'انْطَبَعَ فِي الذَّاكِرَةِ', meaning: 'Membekas dalam ingatan' },
      { arabic: 'الْهُدُوءُ', meaning: 'Ketenangan' }
    ],
    starter: 'فِي الْعُطْلَةِ الصَّيْفِيَّةِ الْمَاضِيَةِ، قُمْتُ بِرِحْلَةٍ شَيِّقَةٍ إِلَى...'
  }
];

export const HIJAIYAH_LETTERS: HijaiyahTraceItem[] = [
  {
    letter: 'ا',
    name: 'Alif',
    transliteration: 'A',
    isolated: 'ا',
    initial: 'ا',
    medial: 'ـا',
    final: 'ـا',
    exampleWord: 'أَمَلٌ',
    exampleMeaning: 'Harapan / Cita-cita'
  },
  {
    letter: 'ب',
    name: 'Ba',
    transliteration: 'B',
    isolated: 'ب',
    initial: 'بـ',
    medial: 'ـبـ',
    final: 'ـب',
    exampleWord: 'بَابٌ',
    exampleMeaning: 'Pintu'
  },
  {
    letter: 'ت',
    name: 'Ta',
    transliteration: 'T',
    isolated: 'ت',
    initial: 'تـ',
    medial: 'ـتـ',
    final: 'ـت',
    exampleWord: 'تَمْرٌ',
    exampleMeaning: 'Kurma'
  },
  {
    letter: 'ث',
    name: 'Tsa',
    transliteration: 'Ts',
    isolated: 'ث',
    initial: 'ثـ',
    medial: 'ـثـ',
    final: 'ـث',
    exampleWord: 'ثَمَرَةٌ',
    exampleMeaning: 'Buah'
  },
  {
    letter: 'ج',
    name: 'Jim',
    transliteration: 'J',
    isolated: 'ج',
    initial: 'جـ',
    medial: 'ـجـ',
    final: 'ـج',
    exampleWord: 'جَمِيلٌ',
    exampleMeaning: 'Indah / Tampan'
  },
  {
    letter: 'ح',
    name: 'Ha',
    transliteration: 'H',
    isolated: 'ح',
    initial: 'حـ',
    medial: 'ـحـ',
    final: 'ـح',
    exampleWord: 'حِكْمَةٌ',
    exampleMeaning: 'Kebijaksanaan'
  },
  {
    letter: 'خ',
    name: 'Kha',
    transliteration: 'Kh',
    isolated: 'خ',
    initial: 'خـ',
    medial: 'ـخـ',
    final: 'ـخ',
    exampleWord: 'خَيْرٌ',
    exampleMeaning: 'Kebaikan'
  },
  {
    letter: 'د',
    name: 'Dal',
    transliteration: 'D',
    isolated: 'د',
    initial: 'د',
    medial: 'ـد',
    final: 'ـد',
    exampleWord: 'دَرْسٌ',
    exampleMeaning: 'Pelajaran'
  },
  {
    letter: 'ر',
    name: 'Ra',
    transliteration: 'R',
    isolated: 'ر',
    initial: 'ر',
    medial: 'ـر',
    final: 'ـر',
    exampleWord: 'رِسَالَةٌ',
    exampleMeaning: 'Surat'
  },
  {
    letter: 'س',
    name: 'Sin',
    transliteration: 'S',
    isolated: 'س',
    initial: 'سـ',
    medial: 'ـسـ',
    final: 'ـس',
    exampleWord: 'سَلَامٌ',
    exampleMeaning: 'Kedamaian'
  },
  {
    letter: 'ش',
    name: 'Syin',
    transliteration: 'Sy',
    isolated: 'ش',
    initial: 'شـ',
    medial: 'ـشـ',
    final: 'ـش',
    exampleWord: 'شُكْرًا',
    exampleMeaning: 'Terima kasih'
  },
  {
    letter: 'ص',
    name: 'Shad',
    transliteration: 'Sh',
    isolated: 'ص',
    initial: 'صـ',
    medial: 'ـصـ',
    final: 'ـص',
    exampleWord: 'صَبْرٌ',
    exampleMeaning: 'Kesabaran'
  },
  {
    letter: 'ع',
    name: '\'Ain',
    transliteration: '\'',
    isolated: 'ع',
    initial: 'عـ',
    medial: 'ـعـ',
    final: 'ـع',
    exampleWord: 'عِلْمٌ',
    exampleMeaning: 'Ilmu pengetahuan'
  },
  {
    letter: 'ق',
    name: 'Qaf',
    transliteration: 'Q',
    isolated: 'ق',
    initial: 'قـ',
    medial: 'ـقـ',
    final: 'ـق',
    exampleWord: 'قَلَمٌ',
    exampleMeaning: 'Pena'
  },
  {
    letter: 'ك',
    name: 'Kaf',
    transliteration: 'K',
    isolated: 'ك',
    initial: 'كـ',
    medial: 'ـكـ',
    final: 'ـك',
    exampleWord: 'كِتَابٌ',
    exampleMeaning: 'Buku'
  },
  {
    letter: 'م',
    name: 'Mim',
    transliteration: 'M',
    isolated: 'م',
    initial: 'مـ',
    medial: 'ـمـ',
    final: 'ـم',
    exampleWord: 'مَدْرَسَةٌ',
    exampleMeaning: 'Sekolah'
  },
  {
    letter: 'ن',
    name: 'Nun',
    transliteration: 'N',
    isolated: 'ن',
    initial: 'نـ',
    medial: 'ـنـ',
    final: 'ـن',
    exampleWord: 'نُورٌ',
    exampleMeaning: 'Cahaya'
  },
  {
    letter: 'ي',
    name: 'Ya',
    transliteration: 'Y',
    isolated: 'ي',
    initial: 'يـ',
    medial: 'ـيـ',
    final: 'ـي',
    exampleWord: 'يَقِينٌ',
    exampleMeaning: 'Keyakinan'
  }
];
