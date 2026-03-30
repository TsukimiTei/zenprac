import { HiddenEval, EnlightenmentLevel } from '@/types';

/**
 * Calculate final enlightenment level based on all rounds' evaluations
 *
 * Stricter "Peak + Trend" dual-track evaluation:
 * - SSR (顿悟): Single round >= 9, needs at least 2 rounds of dialogue
 * - SR (渐悟): Sustained quality — needs 3+ user rounds, max >= 7, and either spark or upward trend
 * - R (初触): At least 1 round >= 5, with 2+ user rounds
 * - N (未悟): Default. Short/shallow sessions stay here.
 */
export function calculateEnlightenmentLevel(evals: HiddenEval[]): EnlightenmentLevel {
  if (evals.length === 0) return 'N';

  const scores = evals.map(e => e.round_score);
  const maxScore = Math.max(...scores);
  const sparkCount = evals.filter(e => e.spark).length;
  const rounds = scores.length;

  // SSR: Sudden enlightenment — requires genuine breakthrough
  // Must have at least 2 eval rounds (meaning user engaged meaningfully)
  if (rounds >= 2 && maxScore >= 9) return 'SSR';
  if (rounds >= 3 && sparkCount >= 2 && scores[scores.length - 1] >= 8) return 'SSR';

  // SR: Gradual enlightenment — requires sustained depth
  // Must have at least 3 eval rounds
  if (rounds >= 3) {
    // Path 1: Upward trend with high peak
    if (rounds >= 4) {
      const mid = Math.floor(rounds / 2);
      const firstHalfAvg = scores.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
      const secondHalfAvg = scores.slice(mid).reduce((a, b) => a + b, 0) / (rounds - mid);
      if (secondHalfAvg > firstHalfAvg + 2 && maxScore >= 7) return 'SR';
    }
    // Path 2: High peak with spark — but need 3+ rounds to prove it's not a fluke
    if (maxScore >= 8 && sparkCount >= 1) return 'SR';
  }

  // R: Initial touch — user engaged and showed some depth
  // Need at least 2 rounds and a score >= 5
  if (rounds >= 2 && maxScore >= 5) return 'R';
  // Single round can get R only with score >= 6
  if (rounds === 1 && maxScore >= 6) return 'R';

  // N: Not yet — most sessions land here, and that's fine
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
