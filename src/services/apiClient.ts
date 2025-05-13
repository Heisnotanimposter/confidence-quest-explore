
import { DifficultyLevel, GameMode, AudienceType } from "@/components/game/GameSettingsContext";
import { PaeMapType } from "./proteinDataService";

/**
 * API Client for connecting to the backend Gemini service
 */

// Get the backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface QuestionResponse {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionParams {
  confidence: string;
  row: number;
  col: number;
  difficulty?: DifficultyLevel;
  audience?: AudienceType;
  gameMode?: GameMode;
  proteinName?: string;
  proteinFunction?: string;
  mapType?: PaeMapType;
}

/**
 * Generate a question using the Gemini API based on the selected cell
 * @param confidence - The confidence level of the selected cell
 * @param row - The row index of the selected cell
 * @param col - The column index of the selected cell
 * @param difficulty - The current difficulty level
 * @param audience - The target audience
 * @param gameMode - The current game mode
 * @param proteinName - Optional protein name for context
 * @param proteinFunction - Optional protein function for context
 * @param mapType - Optional PAE map type
 * @returns A promise that resolves to a question response
 */
export const generateQuestion = async ({
  confidence,
  row,
  col,
  difficulty = 'beginner',
  audience = 'elementary',
  gameMode = 'challenge',
  proteinName = '',
  proteinFunction = '',
  mapType = 'full'
}: QuestionParams): Promise<QuestionResponse> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confidence,
        row,
        col,
        difficulty,
        audience,
        gameMode,
        proteinName,
        proteinFunction,
        mapType
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling the question generation API:', error);
    
    // Return a fallback question if the API call fails
    // Adjust complexity based on difficulty
    if (difficulty === 'advanced') {
      return {
        question: `What can we infer about the protein structure based on this ${confidence} confidence region?`,
        options: confidence === "high" 
          ? ["This region is likely well-structured and correctly predicted", "This region may contain prediction errors", "This region is likely disordered"] 
          : confidence === "medium" 
          ? ["This region may have some flexibility", "This region is likely rigid", "This region is completely disordered"] 
          : ["This region may contain prediction errors", "This region is well-predicted", "This region likely needs additional sampling"],
        correctAnswer: confidence === "high" 
          ? "This region is likely well-structured and correctly predicted" 
          : confidence === "medium" 
          ? "This region may have some flexibility" 
          : "This region may contain prediction errors"
      };
    } else if (difficulty === 'intermediate') {
      return {
        question: `What does this ${confidence} confidence value tell us?`,
        options: ["High certainty in the prediction", "Medium certainty in the prediction", "Low certainty in the prediction"],
        correctAnswer: confidence === "high" 
          ? "High certainty in the prediction" 
          : confidence === "medium" 
          ? "Medium certainty in the prediction" 
          : "Low certainty in the prediction"
      };
    } else {
      // Beginner
      return {
        question: `How confident are we about this part of the protein?`,
        options: ["Very confident", "Somewhat confident", "Not confident"],
        correctAnswer: confidence === "high" 
          ? "Very confident" 
          : confidence === "medium" 
          ? "Somewhat confident" 
          : "Not confident"
      };
    }
  }
};

// Overload generateQuestion for backward compatibility
export const generateQuestion = async (
  confidence: string,
  row: number,
  col: number,
  difficulty: DifficultyLevel = 'beginner',
  audience: AudienceType = 'elementary',
  gameMode: GameMode = 'challenge'
): Promise<QuestionResponse> => {
  return generateQuestion({
    confidence,
    row, 
    col,
    difficulty,
    audience,
    gameMode
  });
};
