import { DailyQuestion } from '@/types';

export const DAILY_QUESTIONS: Omit<DailyQuestion, 'id'>[] = [
  // ============================================================
  // Day 1-15: Shakyamuni (释迦牟尼)
  // Themes: Four Noble Truths, Eightfold Path, dependent origination, compassion
  // ============================================================

  // --- Shakyamuni: Koan (经典公案改编) ---
  {
    day_number: 1,
    master_type: 'shakyamuni',
    question_text: '佛陀在灵山会上拈花，迦叶微笑。如果你在场，你不笑也不哭，佛陀会对你说什么？',
    category: 'koan',
    difficulty: 'R',
    theme: '拈花微笑——言语之外的传达',
  },
  {
    day_number: 2,
    master_type: 'shakyamuni',
    question_text: '一个人说"我很痛苦"，佛陀说"痛苦从何处来？"那人说"从失去中来。"佛陀问："失去之前，你拥有过什么？"——你如何回答？',
    category: 'koan',
    difficulty: 'SR',
    theme: '四圣谛——苦的本质与来源',
  },
  {
    day_number: 3,
    master_type: 'shakyamuni',
    question_text: '佛陀渡河，船夫说"我载你过河，你能载我过苦海吗？"佛陀将船桨递给船夫。——船桨是什么？',
    category: 'koan',
    difficulty: 'SSR',
    theme: '自渡——觉悟不可外求',
  },
  {
    day_number: 4,
    master_type: 'shakyamuni',
    question_text: '有人问佛陀："世间最远的距离是什么？"佛陀说："你与此刻之间。"——此刻在哪里？',
    category: 'koan',
    difficulty: 'R',
    theme: '正念——当下的觉知',
  },
  {
    day_number: 5,
    master_type: 'shakyamuni',
    question_text: '一只蚂蚁背着一粒比自己大十倍的米，另一只蚂蚁空手而行。佛陀说两者都在修行。——它们各自修的是什么？',
    category: 'koan',
    difficulty: 'SR',
    theme: '精进与放下——八正道中的中道',
  },

  // --- Shakyamuni: Huatou (话头/禅问) ---
  {
    day_number: 6,
    master_type: 'shakyamuni',
    question_text: '你说"我在受苦"。那个觉察到苦的，它苦不苦？',
    category: 'huatou',
    difficulty: 'SR',
    theme: '观苦——谁在受苦',
  },
  {
    day_number: 7,
    master_type: 'shakyamuni',
    question_text: '此刻你呼吸着。呼与吸之间那个空隙里，你是谁？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '安般念——呼吸间的无我',
  },
  {
    day_number: 8,
    master_type: 'shakyamuni',
    question_text: '如果一切都在变化，那么"我在变化"这个认知，它变了吗？',
    category: 'huatou',
    difficulty: 'R',
    theme: '无常——变化中的觉知',
  },
  {
    day_number: 9,
    master_type: 'shakyamuni',
    question_text: '你对一个陌生人和你最爱的人，生起的慈悲有什么不同？那个不同从哪里来？',
    category: 'huatou',
    difficulty: 'R',
    theme: '慈悲——分别心与平等心',
  },
  {
    day_number: 10,
    master_type: 'shakyamuni',
    question_text: '一根蜡烛点燃另一根蜡烛。火是从第一根跑到第二根的吗？那你的烦恼是从哪里"传"到哪里的？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '缘起——因果相续的真相',
  },

  // --- Shakyamuni: Life (生活禅问) ---
  {
    day_number: 11,
    master_type: 'shakyamuni',
    question_text: '今天你吃饭的时候，有多少口是真正在"吃"？你的心在饭碗里待了多久？',
    category: 'life',
    difficulty: 'R',
    theme: '正念饮食——活在当下',
  },
  {
    day_number: 12,
    master_type: 'shakyamuni',
    question_text: '你最近一次生气时，如果你停下来三秒钟，只是看着那个怒火——它是什么颜色、什么形状、什么温度？',
    category: 'life',
    difficulty: 'SR',
    theme: '观察情绪——苦的觉知',
  },
  {
    day_number: 13,
    master_type: 'shakyamuni',
    question_text: '你每天走过的那条路，如果用第一次走的眼光去看，你会发现什么？',
    category: 'life',
    difficulty: 'R',
    theme: '初心——日常中的正见',
  },
  {
    day_number: 14,
    master_type: 'shakyamuni',
    question_text: '你手机里删不掉的那张照片，你留住的到底是那个瞬间，还是你对"失去"的恐惧？',
    category: 'life',
    difficulty: 'SR',
    theme: '执着——集谛在日常中的显现',
  },
  {
    day_number: 15,
    master_type: 'shakyamuni',
    question_text: '深夜失眠时，你听到冰箱的嗡嗡声。白天你为什么听不到？是声音变了，还是你变了？',
    category: 'life',
    difficulty: 'SSR',
    theme: '觉知——六根与境界的缘起',
  },

  // ============================================================
  // Day 16-30: Manjushri (文殊菩萨)
  // Themes: Wisdom, emptiness, non-duality, breaking conceptual thinking
  // ============================================================

  // --- Manjushri: Koan (经典公案改编) ---
  {
    day_number: 16,
    master_type: 'manjushri',
    question_text: '文殊持剑，不斩妖魔，斩的是什么？如果你面前有一个你最坚定的信念，你敢让这把剑落下吗？',
    category: 'koan',
    difficulty: 'SR',
    theme: '智慧剑——斩断分别见',
  },
  {
    day_number: 17,
    master_type: 'manjushri',
    question_text: '维摩诘居士问文殊："何为不二法门？"文殊以言作答。维摩诘以沉默作答。——你既不说话也不沉默，如何作答？',
    category: 'koan',
    difficulty: 'SSR',
    theme: '不二法门——超越言默',
  },
  {
    day_number: 18,
    master_type: 'manjushri',
    question_text: '一个学者抱着一千本经书来问道，文殊将所有经书推入水中，说"请从湿透的纸中读出真经。"——湿透的纸上还有字吗？',
    category: 'koan',
    difficulty: 'R',
    theme: '般若——知识与智慧的分野',
  },
  {
    day_number: 19,
    master_type: 'manjushri',
    question_text: '有人画了一幅完美的圆，文殊在圆上切了一刀。那人说"你毁了它"，文殊说"我打开了它。"——完美被打开之后是什么？',
    category: 'koan',
    difficulty: 'SR',
    theme: '破执——对完美的执着即是牢笼',
  },
  {
    day_number: 20,
    master_type: 'manjushri',
    question_text: '一面镜子照见万物，但镜子从不说"这是美的，那是丑的"。如果你是那面镜子，你照见自己时，看到的是什么？',
    category: 'koan',
    difficulty: 'SSR',
    theme: '如实观照——无分别的智慧',
  },

  // --- Manjushri: Huatou (话头/禅问) ---
  {
    day_number: 21,
    master_type: 'manjushri',
    question_text: '你说"我理解了空性"。那么这个"理解"，是空还是不空？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '空亦复空——对空的执着',
  },
  {
    day_number: 22,
    master_type: 'manjushri',
    question_text: '指向月亮的手指不是月亮。那么你现在看到的月亮，是不是另一根手指？',
    category: 'huatou',
    difficulty: 'SR',
    theme: '指月之喻——概念的层层嵌套',
  },
  {
    day_number: 23,
    master_type: 'manjushri',
    question_text: '你能想出一个完全没有对立面的东西吗？如果能，它还是"东西"吗？',
    category: 'huatou',
    difficulty: 'R',
    theme: '二元对立——概念如何构建世界',
  },
  {
    day_number: 24,
    master_type: 'manjushri',
    question_text: '"前念已灭，后念未生"——这中间，是什么在知道"中间"？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '念头之间——觉性的直指',
  },
  {
    day_number: 25,
    master_type: 'manjushri',
    question_text: '你正在思考"不要思考"。那个想要停止思考的念头，算不算思考？',
    category: 'huatou',
    difficulty: 'R',
    theme: '止念之悖——思维无法超越思维',
  },

  // --- Manjushri: Life (生活禅问) ---
  {
    day_number: 26,
    master_type: 'manjushri',
    question_text: '你给事物贴标签："这份工作无聊""那个人讨厌"。如果撕掉所有标签，你面前的世界长什么样？',
    category: 'life',
    difficulty: 'R',
    theme: '概念投射——日常中的分别心',
  },
  {
    day_number: 27,
    master_type: 'manjushri',
    question_text: '你以为自己在做选择，但回头看，每个"选择"是不是都只能走到你走到的那一步？自由意志是真的，还是另一个故事？',
    category: 'life',
    difficulty: 'SSR',
    theme: '缘起与自由——选择的幻象',
  },
  {
    day_number: 28,
    master_type: 'manjushri',
    question_text: '你刷手机时那种停不下来的感觉——到底是你在看手机，还是手机在看你？',
    category: 'life',
    difficulty: 'R',
    theme: '觉察习性——谁是主人',
  },
  {
    day_number: 29,
    master_type: 'manjushri',
    question_text: '你说"我不够好"。这句话说了无数遍之后，你有没有看过"好"这个字的脸？它到底长什么样？',
    category: 'life',
    difficulty: 'SR',
    theme: '破概念——自我评判的空性',
  },
  {
    day_number: 30,
    master_type: 'manjushri',
    question_text: '你站在十字路口等红灯，四个方向的人都在等。每个人都觉得自己是主角。——真的有主角吗？',
    category: 'life',
    difficulty: 'SR',
    theme: '无我——自我中心的消解',
  },

  // ============================================================
  // Day 31-45: Huineng (六祖慧能)
  // Themes: Sudden enlightenment, original nature, everyday zen
  // ============================================================

  // --- Huineng: Koan (经典公案改编) ---
  {
    day_number: 31,
    master_type: 'huineng',
    question_text: '慧能说"不是风动，不是幡动，仁者心动。"现在你刷到一条让你愤怒的新闻——是新闻动了，还是你的心动了？',
    category: 'koan',
    difficulty: 'R',
    theme: '风幡之辩——外境与心的关系',
  },
  {
    day_number: 32,
    master_type: 'huineng',
    question_text: '神秀说"时时勤拂拭"，慧能说"本来无一物"。你的桌子上真的积了灰，你是擦还是不擦？',
    category: 'koan',
    difficulty: 'SR',
    theme: '渐悟与顿悟——见性与做事不矛盾',
  },
  {
    day_number: 33,
    master_type: 'huineng',
    question_text: '猎人们吃肉，慧能只吃肉边菜。如果没有菜，只有肉，慧能会怎么做？——你会怎么做？',
    category: 'koan',
    difficulty: 'R',
    theme: '随缘——戒律的灵活与本质',
  },
  {
    day_number: 34,
    master_type: 'huineng',
    question_text: '五祖半夜传法，问慧能"米熟了没有？"慧能说"米熟久矣，犹欠筛在。"——你的米熟了吗？欠的那一筛是什么？',
    category: 'koan',
    difficulty: 'SSR',
    theme: '印证——功夫到了只欠临门一脚',
  },
  {
    day_number: 35,
    master_type: 'huineng',
    question_text: '慧能不识字，却说出了"何期自性本自清净"。一个从未读过书的人说出了最深的道理——那读书是为了什么？',
    category: 'koan',
    difficulty: 'SR',
    theme: '自性——智慧不从文字来',
  },

  // --- Huineng: Huatou (话头/禅问) ---
  {
    day_number: 36,
    master_type: 'huineng',
    question_text: '你的父母未生你之前，你的本来面目是什么？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '本来面目——最经典的禅问',
  },
  {
    day_number: 37,
    master_type: 'huineng',
    question_text: '此刻，不用任何词语，你能"说出"你是谁吗？',
    category: 'huatou',
    difficulty: 'SR',
    theme: '离言说——语言之外的自性',
  },
  {
    day_number: 38,
    master_type: 'huineng',
    question_text: '你闭上眼什么都不想的时候，那个"什么都不想"是谁在知道？',
    category: 'huatou',
    difficulty: 'R',
    theme: '知——觉知本身不可被觉知',
  },
  {
    day_number: 39,
    master_type: 'huineng',
    question_text: '如果顿悟是一瞬间的事，那一瞬间之前你在哪里？之后你又在哪里？',
    category: 'huatou',
    difficulty: 'SR',
    theme: '顿悟——时间中的无时间',
  },
  {
    day_number: 40,
    master_type: 'huineng',
    question_text: '你现在听到的最远的声音是什么？听到它的那个"听"，有远近吗？',
    category: 'huatou',
    difficulty: 'R',
    theme: '闻性——觉知无边界',
  },

  // --- Huineng: Life (生活禅问) ---
  {
    day_number: 41,
    master_type: 'huineng',
    question_text: '你洗碗的时候，是你在洗碗，还是碗在洗你？当水流过碗面的那一刻，谁更干净了？',
    category: 'life',
    difficulty: 'R',
    theme: '生活即修行——日用中见性',
  },
  {
    day_number: 42,
    master_type: 'huineng',
    question_text: '你在人群中突然感到孤独。那个孤独如果不叫"孤独"，它其实是什么感觉？只是感觉，不加名字。',
    category: 'life',
    difficulty: 'SR',
    theme: '直觉体验——不被概念绑架',
  },
  {
    day_number: 43,
    master_type: 'huineng',
    question_text: '今晚睡觉前，你放下手机的那个动作——是你决定放下的，还是困意替你放下的？那个"放下"的瞬间，谁是主人？',
    category: 'life',
    difficulty: 'SSR',
    theme: '谁做主——意志与自然的边界',
  },
  {
    day_number: 44,
    master_type: 'huineng',
    question_text: '你每天照镜子，镜中人年年在变。但你总觉得"还是我"。那个从未变过的"我"，你能在镜子里找到吗？',
    category: 'life',
    difficulty: 'SR',
    theme: '自性不变——变化中的不变',
  },
  {
    day_number: 45,
    master_type: 'huineng',
    question_text: '你为了"活在当下"而努力，但"努力活在当下"这件事本身，已经不是当下了。——那你到底该怎么办？',
    category: 'life',
    difficulty: 'SSR',
    theme: '无功用行——刻意即偏离',
  },
];

/** Get today's question based on day of year */
export function getTodayQuestion(): Omit<DailyQuestion, 'id'> {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = (dayOfYear - 1) % DAILY_QUESTIONS.length;
  return DAILY_QUESTIONS[index];
}
