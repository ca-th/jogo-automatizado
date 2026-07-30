export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export type GameScreen = 'start' | 'quiz' | 'result';
