import { MasterType, GrowthStage, EnlightenmentLevel } from '@/types';

export const MAX_DAILY_SESSIONS = 10;

// Master configurations
export const MASTERS: Record<MasterType, {
  name: string;
  title: string;
  description: string;
  specialty: string;
  theme: {
    primary: string;
    secondary: string;
    bg: string;
    bgGradient: string;
    text: string;
    accent: string;
    bubbleBg: string;
    bubbleText: string;
    userBubbleBg: string;
    userBubbleText: string;
  };
  voiceId: string;
  voiceSpeed: number;
  ambientSound: string; // URL to ambient loop audio
}> = {
  shakyamuni: {
    name: '释迦牟尼',
    title: '佛陀',
    description: '以四谛八正道指引众生，庄严慈悲',
    specialty: '四谛八正道、因果缘起',
    theme: {
      primary: '#B8860B',
      secondary: '#DAA520',
      bg: '#1a1408',
      bgGradient: 'from-amber-950 via-yellow-950 to-amber-900',
      text: '#F5DEB3',
      accent: '#FFD700',
      bubbleBg: 'bg-amber-900/60',
      bubbleText: 'text-amber-100',
      userBubbleBg: 'bg-amber-800/40',
      userBubbleText: 'text-amber-50',
    },
    voiceId: 'alloy',
    voiceSpeed: 0.82,
    ambientSound: 'https://cdn.pixabay.com/audio/2024/11/04/audio_4956b4eff1.mp3', // temple bells
  },
  manjushri: {
    name: '文殊菩萨',
    title: '智慧之主',
    description: '以般若智慧破除无明，清冷空灵',
    specialty: '智慧空性、般若波罗蜜',
    theme: {
      primary: '#4A90D9',
      secondary: '#87CEEB',
      bg: '#0a0f1a',
      bgGradient: 'from-slate-950 via-blue-950 to-indigo-950',
      text: '#E0E8F0',
      accent: '#87CEEB',
      bubbleBg: 'bg-blue-900/60',
      bubbleText: 'text-blue-100',
      userBubbleBg: 'bg-blue-800/40',
      userBubbleText: 'text-blue-50',
    },
    voiceId: 'echo',
    voiceSpeed: 0.88,
    ambientSound: 'https://cdn.pixabay.com/audio/2022/02/23/audio_ea70ad08e0.mp3', // singing bowl
  },
  huineng: {
    name: '六祖慧能',
    title: '禅宗六祖',
    description: '直指人心、见性成佛，朴素自然',
    specialty: '顿悟见性、本来面目',
    theme: {
      primary: '#6B8E23',
      secondary: '#8FBC8F',
      bg: '#0f1a0a',
      bgGradient: 'from-stone-950 via-green-950 to-emerald-950',
      text: '#D4E4D4',
      accent: '#8FBC8F',
      bubbleBg: 'bg-green-900/60',
      bubbleText: 'text-green-100',
      userBubbleBg: 'bg-green-800/40',
      userBubbleText: 'text-green-50',
    },
    voiceId: 'fable',
    voiceSpeed: 0.95,
    ambientSound: 'https://cdn.pixabay.com/audio/2022/08/31/audio_419263fc12.mp3', // forest stream birds
  },
};

// Session modes
export const SESSION_MODES: Record<string, {
  name: string;
  description: string;
  icon: string;
}> = {
  master_question: {
    name: '禅师出题',
    description: '由禅师为你选择参禅话题，随缘而发',
    icon: '🎯',
  },
  daily: {
    name: '当日禅题',
    description: '每日一题，与天下修行者同参此问',
    icon: '📿',
  },
  free: {
    name: '自由参禅',
    description: '以你心中所想为起点，自在参禅',
    icon: '🌊',
  },
};

// Growth stages
export const GROWTH_STAGES: Record<GrowthStage, {
  name: string;
  description: string;
  minSessions: number;
  color: string;
  bgColor: string;
}> = {
  mountain_gate: {
    name: '山门初叩',
    description: '清晨薄雾中的山门台阶，一切刚刚开始',
    minSessions: 0,
    color: '#8B9DAF',
    bgColor: 'from-slate-800 to-blue-900',
  },
  bamboo_path: {
    name: '竹径寻声',
    description: '沿着竹林小径前行，远处隐约有钟声',
    minSessions: 11,
    color: '#4CAF50',
    bgColor: 'from-green-800 to-emerald-900',
  },
  stream_rest: {
    name: '溪畔静坐',
    description: '走到山间溪流旁，坐下来听水声',
    minSessions: 31,
    color: '#80CBC4',
    bgColor: 'from-teal-800 to-cyan-900',
  },
  cloud_seeking: {
    name: '云中问道',
    description: '云雾缭绕的山腰，视野时隐时现',
    minSessions: 61,
    color: '#9C89B8',
    bgColor: 'from-purple-800 to-indigo-900',
  },
  moonlight: {
    name: '月下独照',
    description: '山顶月光洒下，四周安静通透',
    minSessions: 121,
    color: '#C0C0C0',
    bgColor: 'from-gray-700 to-slate-800',
  },
  gateless_gate: {
    name: '无门之门',
    description: '无需路径，本身即是禅意',
    minSessions: 201,
    color: '#F5F5F5',
    bgColor: 'from-gray-100 to-white',
  },
};

// Enlightenment levels
export const ENLIGHTENMENT_LEVELS: Record<EnlightenmentLevel, {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  points: number;
}> = {
  N: {
    name: '未悟',
    description: '此次参禅已记录',
    color: '#9E9E9E',
    bgColor: 'bg-gray-700',
    points: 0,
  },
  R: {
    name: '初触',
    description: '心有所感，已在路上',
    color: '#4CAF50',
    bgColor: 'bg-green-700',
    points: 1,
  },
  SR: {
    name: '渐悟',
    description: '渐入佳境，慧根初显',
    color: '#9C27B0',
    bgColor: 'bg-purple-700',
    points: 3,
  },
  SSR: {
    name: '顿悟',
    description: '电光石火，直指本心',
    color: '#FFD700',
    bgColor: 'bg-yellow-600',
    points: 10,
  },
};
