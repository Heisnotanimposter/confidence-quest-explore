
// Define confidence level type
export type ConfidenceLevel = "high" | "medium" | "low";

// Define cell data type
export interface PaeCell {
  row: number;
  col: number;
  confidence: ConfidenceLevel;
}

// Export protein structure type
export interface ProteinStructure {
  id: string;
  name: string;
  species: string;
  description: {
    elementary: string;
    highSchool: string;
    undergraduate: string;
  };
  function: {
    elementary: string;
    highSchool: string;
    undergraduate: string;
  };
  disease: {
    elementary: string | null;
    highSchool: string | null;
    undergraduate: string | null;
  };
  alphafoldLink: string;
  literature: string[];
  confidenceGuide: string;
  pdbId?: string;
  paeData: {
    full: number[][];
    domain?: number[][];
    interface?: number[][];
  };
  domains?: {
    name: string;
    start: number;
    end: number;
    description: string;
  }[];
}

// Define quiz types
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  questions: QuizQuestion[];
  answeredQuestions: {
    question: QuizQuestion;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}
