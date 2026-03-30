import { HiddenEval, EnlightenmentLevel } from '@/types';

/**
 * Calculate final enlightenment level based on all rounds' evaluations
 * Uses "Peak + Trend" dual-track evaluation:
 * - SSR (顿悟): Any single round_score >= 9, OR spark 2+ times and last round >= 8
 *   → Works even with 1 round. 禅可以一句话的事。
 * - SR (渐悟): max >= 7 with spark, OR upward trend (needs 4+ rounds)
 *   → 1-round SR possible if score >= 7 and spark
 * - R (初触): At least 1 round with round_score >= 5
 * - N (未悟): All rounds below 5
 */
export function calculateEnlightenmentLevel(evals: HiddenEval[]): EnlightenmentLevel {
  if (evals.length === 0) return 'N';

  const scores = evals.map(e => e.round_score);
  const maxScore = Math.max(...scores);
  const sparkCount = evals.filter(e => e.spark).length;
  const lastScore = scores[scores.length - 1];

  // SSR: Sudden enlightenment
  if (maxScore >= 9) return 'SSR';
  if (sparkCount >= 2 && lastScore >= 8) return 'SSR';

  // SR: Gradual enlightenment
  if (scores.length >= 4) {
    const mid = Math.floor(scores.length / 2);
    const firstHalfAvg = scores.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const secondHalfAvg = scores.slice(mid).reduce((a, b) => a + b, 0) / (scores.length - mid);
    if (secondHalfAvg > firstHalfAvg + 2 && maxScore >= 7) return 'SR';
  }
  // Also SR if max >= 7 and spark appeared at least once
  if (maxScore >= 7 && sparkCount >= 1) return 'SR';

  // R: Initial touch
  if (maxScore >= 5) return 'R';

  // N: Not yet
  return 'N';
}

/**
 * Parse hidden evaluation from AI response
 * Extracts the JSON between |||EVAL_START||| and |||EVAL_END|||
 */
export function parseHiddenEval(content: string): { cleanContent: string; eval: HiddenEval | null } {
  const evalRegex = /\|\|\|EVAL_START\|\|\|([\s\S]*?)\|\|\|EVAL_END\|\|\|/;
  const match = content.match(evalRegex);

  const cleanContent = content.replace(evalRegex, '').replace(/\|\|\|SAFETY_FLAG\|\|\|/g, '').trim();

  if (!match) {
    return { cleanContent, eval: null };
  }

  try {
    const parsed = JSON.parse(match[1].trim());
    return { cleanContent, eval: parsed.hidden_eval || parsed };
  } catch {
    return { cleanContent, eval: null };
  }
}

/**
 * Check if safety flag was triggered
 */
export function hasSafetyFlag(content: string): boolean {
  return content.includes('|||SAFETY_FLAG|||');
}

/**
 * Get growth stage based on total weighted sessions
 */
export function getGrowthStage(totalSessions: number): string {
  if (totalSessions >= 201) return 'gateless_gate';
  if (totalSessions >= 121) return 'moonlight';
  if (totalSessions >= 61) return 'cloud_seeking';
  if (totalSessions >= 31) return 'stream_rest';
  if (totalSessions >= 11) return 'bamboo_path';
  return 'mountain_gate';
}
