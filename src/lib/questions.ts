import { DailyQuestion } from '@/types';

export const DAILY_QUESTIONS: Omit<DailyQuestion, 'id'>[] = [
  // ============================================================
  // Day 1-15: Shakyamuni (释迦牟尼)
  // Style: Warm, dignified. Gentle metaphors. Calm and inviting.
  // ============================================================

  // --- Shakyamuni: Koan (公案) 50-80 chars, story|||question ---
  {
    day_number: 1,
    master_type: 'shakyamuni',
    question_text: '佛陀在灵山拈起一朵花，大家都在猜什么意思，只有迦叶笑了。|||如果你在场，你会怎样？',
    category: 'koan',
    difficulty: 'R',
    theme: '拈花微笑——言语之外的传达',
  },
  {
    day_number: 2,
    master_type: 'shakyamuni',
    question_text: '有人跟佛陀说，我失去了很多，很痛苦。佛陀问，失去之前，你真的拥有过吗？|||你怎么回答？',
    category: 'koan',
    difficulty: 'SR',
    theme: '四圣谛——苦的本质与来源',
  },
  {
    day_number: 3,
    master_type: 'shakyamuni',
    question_text: '船夫载佛陀过河，说你能渡我过苦海吗。佛陀把船桨递给了他。|||船桨是什么？',
    category: 'koan',
    difficulty: 'SSR',
    theme: '自渡——觉悟不可外求',
  },
  {
    day_number: 4,
    master_type: 'shakyamuni',
    question_text: '有人问佛陀，世上最远的距离是什么。佛陀说，你与此刻之间。|||此刻在哪里？',
    category: 'koan',
    difficulty: 'R',
    theme: '正念——当下的觉知',
  },
  {
    day_number: 5,
    master_type: 'shakyamuni',
    question_text: '一只蚂蚁背着比自己大十倍的米粒，另一只空着手走。佛陀说两个都在修行。|||它们各修的是什么？',
    category: 'koan',
    difficulty: 'SR',
    theme: '精进与放下——八正道中的中道',
  },

  // --- Shakyamuni: Huatou (话头) under 30 chars ---
  {
    day_number: 6,
    master_type: 'shakyamuni',
    question_text: '觉察到苦的那个，它苦吗？',
    category: 'huatou',
    difficulty: 'SR',
    theme: '观苦——谁在受苦',
  },
  {
    day_number: 7,
    master_type: 'shakyamuni',
    question_text: '呼与吸之间的空隙里，你是谁？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '安般念——呼吸间的无我',
  },
  {
    day_number: 8,
    master_type: 'shakyamuni',
    question_text: '一切都在变，知道在变的那个变了吗？',
    category: 'huatou',
    difficulty: 'R',
    theme: '无常——变化中的觉知',
  },
  {
    day_number: 9,
    master_type: 'shakyamuni',
    question_text: '对陌生人和亲人的慈悲，差别从哪来？',
    category: 'huatou',
    difficulty: 'R',
    theme: '慈悲——分别心与平等心',
  },
  {
    day_number: 10,
    master_type: 'shakyamuni',
    question_text: '蜡烛点蜡烛，火是从哪跑过去的？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '缘起——因果相续的真相',
  },

  // --- Shakyamuni: Life (生活禅问) under 30 chars ---
  {
    day_number: 11,
    master_type: 'shakyamuni',
    question_text: '今天吃饭时，你的心在碗里待了多久？',
    category: 'life',
    difficulty: 'R',
    theme: '正念饮食——活在当下',
  },
  {
    day_number: 12,
    master_type: 'shakyamuni',
    question_text: '上次生气时，那个怒火是什么形状？',
    category: 'life',
    difficulty: 'SR',
    theme: '观察情绪——苦的觉知',
  },
  {
    day_number: 13,
    master_type: 'shakyamuni',
    question_text: '每天走的路，用第一次的眼光看过吗？',
    category: 'life',
    difficulty: 'R',
    theme: '初心——日常中的正见',
  },
  {
    day_number: 14,
    master_type: 'shakyamuni',
    question_text: '手机里删不掉的照片，留的是什么？',
    category: 'life',
    difficulty: 'SR',
    theme: '执着——集谛在日常中的显现',
  },
  {
    day_number: 15,
    master_type: 'shakyamuni',
    question_text: '深夜听见冰箱的声音，白天怎么没听见？',
    category: 'life',
    difficulty: 'SSR',
    theme: '觉知——六根与境界的缘起',
  },

  // ============================================================
  // Day 16-30: Manjushri (文殊菩萨)
  // Style: Sharp, extremely brief. Paradox & counter-questions. Sword-like.
  // ============================================================

  // --- Manjushri: Koan (公案) 50-80 chars, story|||question ---
  {
    day_number: 16,
    master_type: 'manjushri',
    question_text: '文殊手持利剑，不斩妖魔。有人问斩什么，文殊举剑不答。|||你最坚定的信念，敢不敢放到剑下？',
    category: 'koan',
    difficulty: 'SR',
    theme: '智慧剑——斩断分别见',
  },
  {
    day_number: 17,
    master_type: 'manjushri',
    question_text: '维摩诘问什么是不二，文殊用话来答，维摩诘一声不吭。|||你既不说也不沉默，怎么答？',
    category: 'koan',
    difficulty: 'SSR',
    theme: '不二法门——超越言默',
  },
  {
    day_number: 18,
    master_type: 'manjushri',
    question_text: '学者抱来一千本经书求教，文殊全推进水里，说从湿纸里读真经。|||湿纸上还有字吗？',
    category: 'koan',
    difficulty: 'R',
    theme: '般若——知识与智慧的分野',
  },
  {
    day_number: 19,
    master_type: 'manjushri',
    question_text: '有人画了个完美的圆，文殊一剑切开。那人说你毁了它，文殊说我打开了它。|||完美被打开之后是什么？',
    category: 'koan',
    difficulty: 'SR',
    theme: '破执——对完美的执着即是牢笼',
  },
  {
    day_number: 20,
    master_type: 'manjushri',
    question_text: '镜子照见万物，从不说美也不说丑。|||你是那面镜子的话，照见自己时看到什么？',
    category: 'koan',
    difficulty: 'SSR',
    theme: '如实观照——无分别的智慧',
  },

  // --- Manjushri: Huatou (话头) under 30 chars ---
  {
    day_number: 21,
    master_type: 'manjushri',
    question_text: '你理解了空性，这个理解空不空？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '空亦复空——对空的执着',
  },
  {
    day_number: 22,
    master_type: 'manjushri',
    question_text: '你看到的月亮，是不是另一根手指？',
    category: 'huatou',
    difficulty: 'SR',
    theme: '指月之喻——概念的层层嵌套',
  },
  {
    day_number: 23,
    master_type: 'manjushri',
    question_text: '没有对立面的东西，还是东西吗？',
    category: 'huatou',
    difficulty: 'R',
    theme: '二元对立——概念如何构建世界',
  },
  {
    day_number: 24,
    master_type: 'manjushri',
    question_text: '前念灭了，后念没来，谁知道这中间？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '念头之间——觉性的直指',
  },
  {
    day_number: 25,
    master_type: 'manjushri',
    question_text: '想停止思考的那个念头，算不算思考？',
    category: 'huatou',
    difficulty: 'R',
    theme: '止念之悖——思维无法超越思维',
  },

  // --- Manjushri: Life (生活禅问) under 30 chars ---
  {
    day_number: 26,
    master_type: 'manjushri',
    question_text: '撕掉所有标签，你面前是什么？',
    category: 'life',
    difficulty: 'R',
    theme: '概念投射——日常中的分别心',
  },
  {
    day_number: 27,
    master_type: 'manjushri',
    question_text: '每个选择回头看都只有一条路，自由在哪？',
    category: 'life',
    difficulty: 'SSR',
    theme: '缘起与自由——选择的幻象',
  },
  {
    day_number: 28,
    master_type: 'manjushri',
    question_text: '是你在刷手机，还是手机在刷你？',
    category: 'life',
    difficulty: 'R',
    theme: '觉察习性——谁是主人',
  },
  {
    day_number: 29,
    master_type: 'manjushri',
    question_text: '你说不够好，好长什么样，你见过吗？',
    category: 'life',
    difficulty: 'SR',
    theme: '破概念——自我评判的空性',
  },
  {
    day_number: 30,
    master_type: 'manjushri',
    question_text: '路口每个人都觉得自己是主角，有主角吗？',
    category: 'life',
    difficulty: 'SR',
    theme: '无我——自我中心的消解',
  },

  // ============================================================
  // Day 31-45: Huineng (六祖慧能)
  // Style: Plain spoken, colloquial, like a farmer. Rough/direct.
  // ============================================================

  // --- Huineng: Koan (公案) 50-80 chars, story|||question ---
  {
    day_number: 31,
    master_type: 'huineng',
    question_text: '两个和尚看旗子在飘，一个说风动，一个说幡动。慧能说都不是，是你们的心在动。|||你刷到一条让你生气的新闻，动的是什么？',
    category: 'koan',
    difficulty: 'R',
    theme: '风幡之辩——外境与心的关系',
  },
  {
    day_number: 32,
    master_type: 'huineng',
    question_text: '神秀说心是镜子要天天擦，慧能说本来就没镜子擦什么。|||你桌上真的落了灰，你擦不擦？',
    category: 'koan',
    difficulty: 'SR',
    theme: '渐悟与顿悟——见性与做事不矛盾',
  },
  {
    day_number: 33,
    master_type: 'huineng',
    question_text: '慧能在猎人堆里混了十几年，人家吃肉他吃肉边菜。|||要是连菜都没有，你咋办？',
    category: 'koan',
    difficulty: 'R',
    theme: '随缘——戒律的灵活与本质',
  },
  {
    day_number: 34,
    master_type: 'huineng',
    question_text: '五祖半夜叫慧能来，问米舂好了没。慧能说米早熟了，就差过一遍筛子。|||你的米熟了没？差的那一筛是啥？',
    category: 'koan',
    difficulty: 'SSR',
    theme: '印证——功夫到了只欠临门一脚',
  },
  {
    day_number: 35,
    master_type: 'huineng',
    question_text: '慧能一个字不认识，却说出自性本来清净这种话。|||一辈子没读过书的人说了最深的道理，那读书到底图啥？',
    category: 'koan',
    difficulty: 'SR',
    theme: '自性——智慧不从文字来',
  },

  // --- Huineng: Huatou (话头) under 30 chars ---
  {
    day_number: 36,
    master_type: 'huineng',
    question_text: '你爹妈还没生你的时候，你在哪儿呢？',
    category: 'huatou',
    difficulty: 'SSR',
    theme: '本来面目——最经典的禅问',
  },
  {
    day_number: 37,
    master_type: 'huineng',
    question_text: '不准用词儿，你能说清自己是谁吗？',
    category: 'huatou',
    difficulty: 'SR',
    theme: '离言说——语言之外的自性',
  },
  {
    day_number: 38,
    master_type: 'huineng',
    question_text: '啥都不想的时候，谁知道啥都没想？',
    category: 'huatou',
    difficulty: 'R',
    theme: '知——觉知本身不可被觉知',
  },
  {
    day_number: 39,
    master_type: 'huineng',
    question_text: '顿悟就一瞬间的事，那之前你在哪？',
    category: 'huatou',
    difficulty: 'SR',
    theme: '顿悟——时间中的无时间',
  },
  {
    day_number: 40,
    master_type: 'huineng',
    question_text: '你听到最远的声音，听它的那个有远近吗？',
    category: 'huatou',
    difficulty: 'R',
    theme: '闻性——觉知无边界',
  },

  // --- Huineng: Life (生活禅问) under 30 chars ---
  {
    day_number: 41,
    master_type: 'huineng',
    question_text: '你洗碗的时候，到底是谁洗干净了？',
    category: 'life',
    difficulty: 'R',
    theme: '生活即修行——日用中见性',
  },
  {
    day_number: 42,
    master_type: 'huineng',
    question_text: '那个孤独要是不叫孤独，它到底是啥？',
    category: 'life',
    difficulty: 'SR',
    theme: '直觉体验——不被概念绑架',
  },
  {
    day_number: 43,
    master_type: 'huineng',
    question_text: '睡前放下手机，是你放的还是困放的？',
    category: 'life',
    difficulty: 'SSR',
    theme: '谁做主——意志与自然的边界',
  },
  {
    day_number: 44,
    master_type: 'huineng',
    question_text: '镜子里的人年年变，你凭啥觉得还是你？',
    category: 'life',
    difficulty: 'SR',
    theme: '自性不变——变化中的不变',
  },
  {
    day_number: 45,
    master_type: 'huineng',
    question_text: '努力活在当下，这个努力就不是当下了，咋整？',
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
