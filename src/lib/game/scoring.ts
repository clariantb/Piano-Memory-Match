import type { DifficultyConfig, ScoreEntry } from '../types';

export function starRating(moves: number, par: number): 1 | 2 | 3 {
  if (moves <= par) return 3;
  if (moves <= Math.round(par * 1.5)) return 2;
  return 1;
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function isBetterScore(candidate: ScoreEntry, current?: ScoreEntry): boolean {
  if (!current) return true;
  if (candidate.stars > current.stars) return true;
  if (candidate.stars < current.stars) return false;
  if (candidate.moves < current.moves) return true;
  if (candidate.moves > current.moves) return false;
  return candidate.timeMs < current.timeMs;
}

export function findBestScore(
  scores: readonly ScoreEntry[],
  instrument: string,
  difficulty: string
): ScoreEntry | undefined {
  return scores
    .filter((s) => s.instrument === instrument && s.difficulty === difficulty)
    .reduce<ScoreEntry | undefined>(
      (best, current) => (isBetterScore(current, best) ? current : best),
      undefined
    );
}

export const DIFFICULTIES: readonly DifficultyConfig[] = [
  { id: 'easy', label: 'Easy', pairs: 4, cols: 4, rows: 2, parMoves: 6 },
  { id: 'medium', label: 'Medium', pairs: 8, cols: 4, rows: 4, parMoves: 14 },
  { id: 'hard', label: 'Hard', pairs: 12, cols: 4, rows: 6, parMoves: 22 },
  { id: 'expert', label: 'Expert', pairs: 16, cols: 4, rows: 8, parMoves: 32 }
];

export function getDifficulty(id: string): DifficultyConfig {
  const d = DIFFICULTIES.find((x) => x.id === id);
  if (!d) throw new Error(`Unknown difficulty: ${id}`);
  return d;
}
