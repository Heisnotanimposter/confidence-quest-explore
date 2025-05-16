import { ConfidenceLevel, QuizQuestion } from "@/types/game";
import { DifficultyLevel, GameMode, AudienceType } from "@/components/game/GameSettingsContext";

// Define the response structure for question generation
interface QuestionResponse {
  question: string;
  options: string[];
  correctAnswer: string;
}

/**
 * Generate a question based on the selected cell's confidence level and game settings
 */
export async function generateQuestion(
  confidence: ConfidenceLevel,
  difficulty: DifficultyLevel,
  audience: AudienceType,
  gameMode: GameMode
): Promise<QuestionResponse> {
  try {
    // In a production environment, this would be a real API call
    // For now, we'll simulate the API response
    
    // Add a small artificial delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a question based on confidence level and difficulty
    let question = "";
    let options: string[] = [];
    let correctAnswer = "";
    
    // Adjust question complexity based on target audience and difficulty
    if (audience === "elementary") {
      if (difficulty === "beginner") {
        question = `Is this part of the protein ${confidence === "high" ? "very stable" : confidence === "medium" ? "a little wobbly" : "very wobbly"}?`;
        options = ["Yes", "No"];
        correctAnswer = "Yes";
      } else if (difficulty === "intermediate") {
        question = `What do scientists think about this part of the protein?`;
        
        if (confidence === "high") {
          options = ["They're very sure about it", "They're not sure about it"];
          correctAnswer = "They're very sure about it";
        } else if (confidence === "medium") {
          options = ["They're a little bit sure", "They're very sure about it"];
          correctAnswer = "They're a little bit sure";
        } else {
          options = ["They're not very sure", "They're very sure about it"];
          correctAnswer = "They're not very sure";
        }
      } else {
        // Advanced for elementary
        question = `If you were a scientist looking at this protein, what would you think?`;
        
        if (confidence === "high") {
          options = ["I'm confident this part is correct", "I think this part might be wrong"];
          correctAnswer = "I'm confident this part is correct";
        } else if (confidence === "medium") {
          options = ["This part might move around a bit", "This part is definitely fixed in place"];
          correctAnswer = "This part might move around a bit";
        } else {
          options = ["I'm not sure about this part", "I'm very sure about this part"];
          correctAnswer = "I'm not sure about this part";
        }
      }
    } else if (audience === "highSchool") {
      // Questions for high school students
      if (difficulty === "beginner") {
        question = `What does the ${confidence === "high" ? "green" : confidence === "medium" ? "yellow" : "red"} color indicate about this region?`;
        
        if (confidence === "high") {
          options = ["High confidence prediction", "Low confidence prediction"];
          correctAnswer = "High confidence prediction";
        } else if (confidence === "medium") {
          options = ["Medium confidence prediction", "High confidence prediction"];
          correctAnswer = "Medium confidence prediction";
        } else {
          options = ["Low confidence prediction", "High confidence prediction"];
          correctAnswer = "Low confidence prediction";
        }
      } else if (difficulty === "intermediate") {
        question = "What might this confidence level tell us about the protein structure?";
        
        if (confidence === "high") {
          options = [
            "This part is likely correctly predicted",
            "This part is likely flexible",
            "This part is likely misfolded"
          ];
          correctAnswer = "This part is likely correctly predicted";
        } else if (confidence === "medium") {
          options = [
            "This part may have some flexibility",
            "This part is definitely incorrect",
            "This part is definitely rigid"
          ];
          correctAnswer = "This part may have some flexibility";
        } else {
          options = [
            "This part has high uncertainty",
            "This part is definitely correct",
            "This part is definitely part of a helix"
          ];
          correctAnswer = "This part has high uncertainty";
        }
      } else {
        // Advanced for high school
        question = "What does the PAE value in this region suggest about the protein structure prediction?";
        
        if (confidence === "high") {
          options = [
            "Low position error, high structural certainty",
            "High position error, low structural certainty",
            "Medium position error, medium structural certainty"
          ];
          correctAnswer = "Low position error, high structural certainty";
        } else if (confidence === "medium") {
          options = [
            "Medium position error, medium structural certainty",
            "Low position error, high structural certainty",
            "No position error, perfect structural certainty"
          ];
          correctAnswer = "Medium position error, medium structural certainty";
        } else {
          options = [
            "High position error, low structural certainty",
            "Low position error, high structural certainty",
            "Medium position error with high structural certainty"
          ];
          correctAnswer = "High position error, low structural certainty";
        }
      }
    } else {
      // Questions for undergraduate students
      if (difficulty === "beginner") {
        question = `What does this ${confidence} confidence region indicate about predicted atomic coordinates?`;
        
        if (confidence === "high") {
          options = ["Low predicted error (< 5Å)", "High predicted error (> 15Å)"];
          correctAnswer = "Low predicted error (< 5Å)";
        } else if (confidence === "medium") {
          options = ["Moderate predicted error (5-15Å)", "Very high predicted error (> 30Å)"];
          correctAnswer = "Moderate predicted error (5-15Å)";
        } else {
          options = ["High predicted error (> 15Å)", "Low predicted error (< 5Å)"];
          correctAnswer = "High predicted error (> 15Å)";
        }
      } else if (difficulty === "intermediate") {
        question = "How would you interpret this region of the PAE map for structural analysis?";
        
        if (confidence === "high") {
          options = [
            "Reliable for modeling and hypothesis generation",
            "Unsuitable for any structural interpretation",
            "Only useful for secondary structure prediction"
          ];
          correctAnswer = "Reliable for modeling and hypothesis generation";
        } else if (confidence === "medium") {
          options = [
            "Suitable for general fold prediction but not atomic details",
            "Completely unreliable for any structural inference",
            "As reliable as experimentally determined structures"
          ];
          correctAnswer = "Suitable for general fold prediction but not atomic details";
        } else {
          options = [
            "Highly uncertain and should be interpreted with caution",
            "Reliable for precise atomic positioning",
            "Indicates crystallization artifacts in the model"
          ];
          correctAnswer = "Highly uncertain and should be interpreted with caution";
        }
      } else {
        // Advanced for undergraduate
        question = "In the context of AlphaFold's predicted PAE values, what structural interpretation is most appropriate for this region?";
        
        if (confidence === "high") {
          options = [
            "Well-modeled region suitable for detailed structural analysis including side-chain positions",
            "Disordered region with high conformational entropy",
            "Potential domain boundary with moderate uncertainty"
          ];
          correctAnswer = "Well-modeled region suitable for detailed structural analysis including side-chain positions";
        } else if (confidence === "medium") {
          options = [
            "Region with some flexibility or uncertainty, main-chain may be reliable but side-chains less so",
            "Completely disordered region with no defined structure",
            "Highly accurate region with experimental-level confidence"
          ];
          correctAnswer = "Region with some flexibility or uncertainty, main-chain may be reliable but side-chains less so";
        } else {
          options = [
            "Highly uncertain region, possibly disordered or incorrectly modeled",
            "Region with high confidence suitable for drug design",
            "Artifact of crystal packing forces in the model"
          ];
          correctAnswer = "Highly uncertain region, possibly disordered or incorrectly modeled";
        }
      }
    }
    
    // Special handling for tutorial mode - simplified questions
    if (gameMode === "tutorial") {
      if (confidence === "high") {
        question = "This green region means:";
        options = ["Scientists are very sure about this part", "Scientists are not sure about this part"];
        correctAnswer = "Scientists are very sure about this part";
      } else if (confidence === "medium") {
        question = "This yellow region means:";
        options = ["Scientists are somewhat sure about this part", "Scientists are completely unsure about this part"];
        correctAnswer = "Scientists are somewhat sure about this part";
      } else {
        question = "This red region means:";
        options = ["Scientists are not very sure about this part", "Scientists are very sure about this part"];
        correctAnswer = "Scientists are not very sure about this part";
      }
    }
    
    return { question, options, correctAnswer };
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
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
    // In development, simulate an API call
    const endpoint = "/api/generate-quiz";
    
    const payload = {
      proteinId,
      proteinName,
      proteinFunction,
      species,
      difficulty,
      audience,
      numQuestions
    };
    
    // This is where we'd normally make the API call to Gemini
    // For now, simulating with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate sample questions based on protein info
    // In production, this would be replaced with the actual API call
    const sampleQuestions: QuizQuestion[] = generateSampleQuizQuestions(
      proteinName, 
      proteinFunction, 
      species, 
      difficulty, 
      audience,
      numQuestions
    );
    
    return sampleQuestions;
  } catch (error) {
    console.error("Error generating protein quiz:", error);
    throw error;
  }
}

// Helper function to generate sample quiz questions (this would be replaced by the API call)
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
