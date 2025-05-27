
import { ConfidenceLevel, QuizQuestion } from "@/types/game";
import { DifficultyLevel, GameMode, AudienceType } from "@/components/game/GameSettingsContext";

// Define the response structure for question generation
interface QuestionResponse {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Get the API URL from environment variables with fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Test backend connection
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    console.log('Testing backend connection to:', `${BACKEND_URL}/api/health`);
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend health check:', data);
      return data.status === 'healthy' && data.gemini_configured;
    }
    return false;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
}

/**
 * Generate a question based on the selected cell's confidence level and game settings
 */
export async function generateQuestion(
  confidence: ConfidenceLevel,
  difficulty: DifficultyLevel,
  audience: AudienceType,
  gameMode: GameMode,
  proteinName?: string,
  proteinFunction?: string
): Promise<QuestionResponse> {
  try {
    // First test if backend is available
    const backendAvailable = await testBackendConnection();
    if (!backendAvailable) {
      console.warn('Backend not available, using fallback questions');
      throw new Error('Backend not available');
    }

    const endpoint = `${BACKEND_URL}/api/generate-question`;
    
    const payload = {
      confidence,
      difficulty,
      audience,
      gameMode,
      proteinName,
      proteinFunction
    };
    
    console.log('Sending question generation request to:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Question API response:", data);
    
    // Validate response structure
    if (!data.question || !data.options || !data.correctAnswer) {
      throw new Error('Invalid response structure from API');
    }
    
    return data;
    
  } catch (error) {
    console.error("Error generating question:", error);
    
    // Enhanced fallback questions based on confidence level and difficulty
    return generateFallbackQuestion(confidence, difficulty, audience, proteinName);
  }
}

/**
 * Generate fallback questions when API is not available
 */
function generateFallbackQuestion(
  confidence: ConfidenceLevel,
  difficulty: DifficultyLevel,
  audience: AudienceType,
  proteinName?: string
): QuestionResponse {
  const proteinContext = proteinName ? ` for ${proteinName}` : '';
  
  if (difficulty === "beginner") {
    return {
      question: `How confident are we about this part of the protein${proteinContext}?`,
      options: confidence === "high" ? ["Very confident", "Not confident"] : 
               confidence === "medium" ? ["Somewhat confident", "Not confident"] :
               ["Very confident", "Not confident"],
      correctAnswer: confidence === "high" ? "Very confident" : 
                     confidence === "medium" ? "Somewhat confident" : 
                     "Not confident"
    };
  } else if (difficulty === "intermediate") {
    return {
      question: `What does this ${confidence} confidence value tell us about the protein structure${proteinContext}?`,
      options: ["High prediction certainty", "Medium prediction certainty", "Low prediction certainty"],
      correctAnswer: confidence === "high" ? "High prediction certainty" : 
                     confidence === "medium" ? "Medium prediction certainty" : 
                     "Low prediction certainty"
    };
  } else { // advanced
    return {
      question: `What structural insights can we derive from this ${confidence} confidence region${proteinContext}?`,
      options: [
        "This region is likely well-structured and correctly predicted",
        "This region may contain prediction errors or flexibility",
        "This region is completely disordered",
        "This region represents a binding site"
      ],
      correctAnswer: confidence === "high" ? "This region is likely well-structured and correctly predicted" : 
                     "This region may contain prediction errors or flexibility"
    };
  }
}

/**
 * Generate a quiz with multiple questions about a specific protein
 */
export async function generateProteinQuiz(
  proteinId: string,
  proteinName: string,
  proteinFunction: string,
  species: string,
  difficulty: DifficultyLevel,
  audience: AudienceType,
  numQuestions: number = 5
): Promise<QuizQuestion[]> {
  try {
    // First test if backend is available
    const backendAvailable = await testBackendConnection();
    if (!backendAvailable) {
      console.warn('Backend not available, using fallback quiz');
      return generateFallbackQuiz(proteinName, proteinFunction, species, difficulty, audience, numQuestions);
    }

    const endpoint = `${BACKEND_URL}/api/generate-quiz`;
    
    const payload = {
      proteinId,
      proteinName,
      proteinFunction,
      species,
      difficulty,
      audience,
      numQuestions
    };
    
    console.log('Sending quiz generation request to:', endpoint, payload);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Quiz API response:", data);
    
    // Validate response is an array of questions
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid quiz response format');
    }
    
    // Validate each question has required fields
    const validQuestions = data.filter(q => 
      q.question && q.options && Array.isArray(q.options) && q.correctAnswer && q.explanation
    );
    
    if (validQuestions.length === 0) {
      throw new Error('No valid questions in response');
    }
    
    return validQuestions;
    
  } catch (error) {
    console.error("Error generating protein quiz:", error);
    return generateFallbackQuiz(proteinName, proteinFunction, species, difficulty, audience, numQuestions);
  }
}

/**
 * Generate fallback quiz questions when API is not available
 */
function generateFallbackQuiz(
  proteinName: string,
  proteinFunction: string,
  species: string,
  difficulty: DifficultyLevel,
  audience: AudienceType,
  numQuestions: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [
    {
      question: `What is the primary function of ${proteinName}?`,
      options: [
        proteinFunction,
        "Energy production in cells",
        "DNA replication and repair",
        "Cell membrane transport"
      ],
      correctAnswer: proteinFunction,
      explanation: `${proteinName} primarily functions to ${proteinFunction.toLowerCase()}. This is its main biological role.`
    },
    {
      question: `Which organism does ${proteinName} come from in our database?`,
      options: [
        species,
        "Homo sapiens",
        "Escherichia coli",
        "Saccharomyces cerevisiae"
      ],
      correctAnswer: species,
      explanation: `In our protein database, ${proteinName} is from ${species}.`
    }
  ];

  // Add difficulty-specific questions
  if (difficulty === "advanced") {
    questions.push({
      question: `What type of structural analysis would be most informative for studying ${proteinName}?`,
      options: [
        "AlphaFold prediction analysis",
        "Basic sequence alignment",
        "Simple BLAST search",
        "Phylogenetic tree construction"
      ],
      correctAnswer: "AlphaFold prediction analysis",
      explanation: `AlphaFold predictions provide detailed 3D structural information that helps understand how ${proteinName} performs its function.`
    });
  }

  if (difficulty !== "beginner") {
    questions.push({
      question: `How might mutations in ${proteinName} affect its function?`,
      options: [
        "Could impair its ability to perform its normal function",
        "Would have no effect on the protein",
        "Would always improve its function",
        "Would only affect protein color"
      ],
      correctAnswer: "Could impair its ability to perform its normal function",
      explanation: `Mutations in ${proteinName} could potentially disrupt its structure and impair its ability to ${proteinFunction.toLowerCase()}.`
    });
  }

  return questions.slice(0, numQuestions);
}
