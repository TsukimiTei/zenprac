// Master types
export type MasterType = 'shakyamuni' | 'manjushri' | 'huineng';

// Enlightenment levels
export type EnlightenmentLevel = 'N' | 'R' | 'SR' | 'SSR';

// Session modes
export type SessionMode = 'master_question' | 'free' | 'daily';

// Growth stages
export type GrowthStage = 'mountain_gate' | 'bamboo_path' | 'stream_rest' | 'cloud_seeking' | 'moonlight' | 'gateless_gate';

// Hidden evaluation from AI
export interface HiddenEval {
  round_score: number; // 0-10
  dimension_scores: {
    semantic: number;  // 0-10 core zen concepts
    thinking: number;  // 0-10 non-dual thinking
    attitude: number;  // 0-10 letting go, naturalness
  };
  spark: boolean;        // breakthrough moment >=8 in any dimension
  direction_hint: string;
  should_end: boolean;
  end_reason: 'max_rounds' | 'natural_closure' | 'breakthrough' | null;
}

// Chat message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  hidden_eval?: HiddenEval;
  created_at: string;
}

// Session
export interface Session {
  id: string;
  user_id: string;
  master_type: MasterType;
  mode: SessionMode;
  messages: ChatMessage[];
  final_level: EnlightenmentLevel | null;
  final_score: number | null;
  is_completed: boolean;
  created_at: string;
  zen_card_id?: string;
}

// Zen Card
export interface ZenCard {
  id: string;
  session_id: string;
  user_id: string;
  master_type: MasterType;
  core_question: string;
  core_answer: string;
  master_comment: string;
  enlightenment_level: EnlightenmentLevel;
  score: number;
  created_at: string;
}

// User Profile
export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  total_sessions: number;
  total_score: number;
  current_stage: GrowthStage;
  created_at: string;
  updated_at: string;
}

// Daily Question
export interface DailyQuestion {
  id: string;
  day_number: number;
  master_type: MasterType;
  question_text: string;
  category: 'koan' | 'huatou' | 'life';
  difficulty: EnlightenmentLevel;
  theme: string;
}

// Session stats for today
export interface DailyStats {
  sessions_today: number;
  remaining: number;
}
