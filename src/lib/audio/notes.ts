export const DIATONIC: readonly string[] = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

export const CHROMATIC_2_OCT: readonly string[] = [
  'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5'
];

export function notesForPairs(count: number): readonly string[] {
  if (count <= DIATONIC.length) return DIATONIC.slice(0, count);
  if (count <= CHROMATIC_2_OCT.length) return CHROMATIC_2_OCT.slice(0, count);
  throw new Error(`No predefined note set for ${count} pairs`);
}

export function noteLabel(note: string): string {
  return note.replace(/[0-9]+$/, '');
}

export const WIN_FANFARE: readonly string[] = ['C5', 'E5', 'G5', 'C6'];
