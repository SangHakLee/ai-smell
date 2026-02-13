import { SniffResult } from './types';

/**
 * Defines the weight for each sniffer. A higher weight means the sniffer's
 * score has a greater impact on the final result. This allows us to prioritize
 * more definitive signals of AI generation.
 */
const snifferWeights: { [key: string]: number } = {
  Domain: 2.0,      // STRONGEST signal (AI service domains are almost definitive proof)
  TechStack: 1.6,   // Very strong signal (Next.js + Tailwind + Supabase = AI starter pack)
  Meta: 1.5,        // Strong signal
  Boilerplate: 1.5, // Strong signal
  Comments: 1.4,    // Strong signal (TODOs and placeholders are dead giveaways)
  Content: 1.2,     // Medium signal
  ColorPalette: 1.1, // Medium-strong signal (AI has distinctive color preferences)
  UIKit: 1.0,       // Neutral signal
  Design: 0.8,      // Weaker signal
  default: 1.0,     // A fallback weight for any sniffers not explicitly listed.
};

export function calculateOverallScore(results: SniffResult[]): { totalScore: number; report: SniffResult[] } {
  if (results.length === 0) {
    return { totalScore: 0, report: [] };
  }

  let weightedScoreSum = 0;
  let totalWeight = 0;

  for (const result of results) {
    // Only factor in sniffers that returned a positive score. This prevents
    // sniffers that found nothing from diluting the overall score.
    if (result.score > 0) {
      const weight = snifferWeights[result.sniffer] || snifferWeights.default;
      weightedScoreSum += result.score * weight;
      totalWeight += weight;
    }
  }

  const totalScore = totalWeight > 0 ? weightedScoreSum / totalWeight : 0;

  return {
    // The final score is the weighted average, capped at 1.0 to handle cases where weights might push it over.
    totalScore: parseFloat(Math.min(totalScore, 1.0).toFixed(2)),
    report: results,
  };
}
