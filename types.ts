export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export enum AppState {
  HOME = 'HOME',
  NOTES = 'NOTES',
  QUIZ_CONFIG = 'QUIZ_CONFIG',
  QUIZ_LOADING = 'QUIZ_LOADING',
  QUIZ_ACTIVE = 'QUIZ_ACTIVE',
  QUIZ_RESULTS = 'QUIZ_RESULTS'
}

export interface QuizResult {
  score: number;
  total: number;
  history: {
    questionId: string;
    userAnswerIndex: number;
    isCorrect: boolean;
  }[];
}