
import { ConfidenceLevel, QuizQuestion } from "@/types/game";
import { DifficultyLevel, GameMode, AudienceType } from "@/components/game/GameSettingsContext";

// Define the response structure for question generation
interface QuestionResponse {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Get the API URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

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
    
    // Parse the JSON response
    const data = await response.text();
    console.log("Raw API response:", data);
    
    try {
      // Try to parse the response as JSON directly
      const jsonData = JSON.parse(data);
      return jsonData;
    } catch (parseError) {
      // If direct parsing fails, look for JSON in the text (common with some LLM APIs)
      console.error("Error parsing direct JSON response:", parseError);
      
      // Fallback to find JSON in string (sometimes models wrap JSON in markdown or text)
      const jsonMatch = data.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const jsonFromText = JSON.parse(jsonMatch[0]);
          return jsonFromText;
        } catch (err) {
          console.error("Failed to extract JSON from response", err);
        }
      }
      
      // If all parsing fails, return a default response
      throw new Error("Failed to parse API response");
    }
  } catch (error) {
    console.error("Error generating question:", error);
    
    // Fallback questions based on confidence level and difficulty
    if (difficulty === "beginner") {
      return {
        question: `Is this part of the protein ${confidence === "high" ? "very stable" : confidence === "medium" ? "a little wobbly" : "very wobbly"}?`,
        options: ["Yes", "No"],
        correctAnswer: "Yes"
      };
    } else {
      return {
        question: "What does this confidence level tell us?",
        options: ["High certainty", "Medium certainty", "Low certainty"],
        correctAnswer: confidence === "high" ? "High certainty" : confidence === "medium" ? "Medium certainty" : "Low certainty"
      };
    }
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
      body: JSON.stringify(payload),
      mode: 'cors' // Explicitly set CORS mode
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    // Parse the response data
    const data = await response.text();
    console.log("Raw API quiz response:", data);
    
    try {
      // Try to parse the response as JSON directly
      const questions = JSON.parse(data);
      return questions;
    } catch (parseError) {
      console.error("Error parsing direct JSON quiz response:", parseError);
      
      // Try to extract JSON from the response text
      const jsonMatch = data.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const jsonFromText = JSON.parse(jsonMatch[0]);
          return jsonFromText;
        } catch (err) {
          console.error("Failed to extract JSON array from quiz response", err);
        }
      }
      
      throw new Error("Failed to parse quiz API response");
    }
  } catch (error) {
    console.error("Error generating protein quiz:", error);
    throw error;
  }
}

// Helper function to generate sample quiz questions (this would be replaced by the API call)
// This is just kept as a fallback in case the API call fails
function generateSampleQuizQuestions(
  proteinName: string,
  proteinFunction: string,
  species: string,
  difficulty: DifficultyLevel,
  audience: AudienceType,
  numQuestions: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  // Common question templates based on protein name and function
  const questionTemplates = [
    {
      question: `Which of the following statements BEST describes the primary function of ${proteinName} in ${species}?`,
      options: [
        `To ${proteinFunction.toLowerCase()}`,
        `To catalyze the breakdown of glucose for energy production`,
        `To act as a structural protein, maintaining cellular shape`,
        `To initiate cellular division following growth signals`,
        `To provide immunological defense against pathogens`
      ],
      correctAnswer: `To ${proteinFunction.toLowerCase()}`,
      explanation: `${proteinName}'s primary role is to ${proteinFunction.toLowerCase()}. The other options describe functions performed by different proteins in the cell.`
    },
    {
      question: `Which cellular compartment would you most likely find ${proteinName} in ${species}?`,
      options: [
        "Nucleus",
        "Mitochondria",
        "Cytoplasm",
        "Endoplasmic Reticulum",
        "Golgi Apparatus"
      ],
      correctAnswer: "Cytoplasm",
      explanation: `Based on its function to ${proteinFunction.toLowerCase()}, ${proteinName} is primarily located in the cytoplasm where it can interact with its substrates and binding partners.`
    },
    {
      question: `What best describes the structure of ${proteinName}?`,
      options: [
        "A single polypeptide chain",
        "Multiple subunits forming a complex",
        "A transmembrane protein with seven helical domains",
        "A fibrous protein with repetitive sequences",
        "A nucleoprotein complex containing both DNA and protein"
      ],
      correctAnswer: "Multiple subunits forming a complex",
      explanation: `${proteinName} typically exists as a multi-subunit complex, which allows it to perform its function of ${proteinFunction.toLowerCase()} more efficiently.`
    },
    {
      question: `If there was a mutation in the gene encoding ${proteinName}, what might be a possible consequence?`,
      options: [
        `Impaired ability to ${proteinFunction.toLowerCase()}`,
        "No effect due to redundancy in protein function",
        "Increased efficiency in its normal function",
        "Change in cellular location only",
        "Conversion to a completely different protein"
      ],
      correctAnswer: `Impaired ability to ${proteinFunction.toLowerCase()}`,
      explanation: `Mutations in ${proteinName} often lead to reduced or impaired function, which can affect its ability to ${proteinFunction.toLowerCase()}. This can have significant consequences depending on how essential this protein is for cellular function.`
    },
    {
      question: `Which experimental technique would be MOST useful for studying the interaction of ${proteinName} with its binding partners?`,
      options: [
        "Co-immunoprecipitation",
        "PCR (Polymerase Chain Reaction)",
        "Gel Electrophoresis",
        "Light Microscopy",
        "Mass Spectrometry"
      ],
      correctAnswer: "Co-immunoprecipitation",
      explanation: `Co-immunoprecipitation (Co-IP) is particularly useful for studying protein-protein interactions. It would help identify which proteins interact with ${proteinName} during its function to ${proteinFunction.toLowerCase()}.`
    }
  ];
  
  // Generate more specialized questions based on protein name
  if (proteinName.toLowerCase().includes("hemoglobin")) {
    questions.push({
      question: `Which of the following statements BEST describes the primary function of hemoglobin in ${species}?`,
      options: [
        "To transport oxygen from the lungs to the tissues and carbon dioxide from the tissues to the lungs",
        "To catalyze the breakdown of glucose for energy production in red blood cells",
        "To act as a structural protein within red blood cell membranes, maintaining their shape",
        "To initiate the blood clotting cascade following injury",
        "To provide immunological defense against pathogens in the bloodstream"
      ],
      correctAnswer: "To transport oxygen from the lungs to the tissues and carbon dioxide from the tissues to the lungs",
      explanation: "Hemoglobin's well-known role is oxygen transport. The other options describe functions performed by different proteins in the blood and red blood cells."
    });
  } else if (proteinName.toLowerCase().includes("insulin")) {
    questions.push({
      question: `What is the primary physiological role of insulin?`,
      options: [
        "To lower blood glucose levels by promoting glucose uptake into cells",
        "To raise blood glucose levels when they are too low",
        "To break down fats in the digestive system",
        "To transport oxygen in the bloodstream",
        "To fight against pathogens in the blood"
      ],
      correctAnswer: "To lower blood glucose levels by promoting glucose uptake into cells",
      explanation: "Insulin is a hormone that regulates blood glucose by promoting its uptake into cells, thereby lowering blood glucose levels. This is critical for maintaining proper energy metabolism."
    });
  }
  
  // Adjust difficulty based on the settings
  if (difficulty === "beginner") {
    // For beginners, simplify options and questions
    return questions.slice(0, numQuestions).map(q => ({
      ...q,
      options: q.options.slice(0, 3), // Limit to fewer options
      explanation: q.explanation.split('.')[0] + '.' // Shorter explanation
    }));
  } else if (difficulty === "advanced") {
    // For advanced, use all options and add more technical details
    return questions.slice(0, numQuestions).map(q => ({
      ...q,
      question: `${q.question} Provide the most scientifically accurate answer.`,
      explanation: `${q.explanation} This demonstrates important principles in protein structure-function relationships and biochemistry.`
    }));
  }
  
  // Return standard questions for intermediate
  return questions.slice(0, numQuestions);
}
