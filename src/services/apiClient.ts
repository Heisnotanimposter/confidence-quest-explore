
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

/**
 * Generate a question using the Gemini API based on the selected cell
 * @param confidence - The confidence level of the selected cell
 * @param row - The row index of the selected cell
 * @param col - The column index of the selected cell
 * @returns A promise that resolves to a question response
 */
export const generateQuestion = async (
  confidence: string,
  row: number,
  col: number
): Promise<QuestionResponse> => {
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
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling the question generation API:', error);
    
    // Return a fallback question if the API call fails
    return {
      question: `How confident are we about this part of the protein?`,
      options: ["Very confident", "Somewhat confident", "Not confident"],
      correctAnswer: confidence === "high" ? "Very confident" : 
                    confidence === "medium" ? "Somewhat confident" : 
                    "Not confident"
    };
  }
};
