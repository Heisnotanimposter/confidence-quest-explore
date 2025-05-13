
import { ConfidenceLevel } from "@/types/game";
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
