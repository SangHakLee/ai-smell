import { SniffResult } from '../types';

export function calculateOverallScore(results: SniffResult[]): { totalScore: number; report: SniffResult[] } {
  if (results.length === 0) {
    return { totalScore: 0, report: [] };
  }
  
  const totalScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;
  
  return {
    totalScore: parseFloat(totalScore.toFixed(2)),
    report: results,
  };
}
