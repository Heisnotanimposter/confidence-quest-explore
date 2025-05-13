
import { useState, useEffect } from "react";
import PaeGrid from "./PaeGrid";
import ProteinModel from "./ProteinModel";
import QuestionArea from "./QuestionArea";
import ScoreBoard from "./ScoreBoard";
import GameSettings from "./GameSettings";
import { useGameSettings } from "./GameSettingsContext";
import { generateQuestion } from "@/services/apiClient";
import { toast } from "sonner";

// Define confidence level type
export type ConfidenceLevel = "high" | "medium" | "low";

// Define cell data type
export interface PaeCell {
  row: number;
  col: number;
  confidence: ConfidenceLevel;
}

// Main game component
const ConfidenceGame = () => {
  const { difficulty, gameMode, audience, gridSize } = useGameSettings();
  
  // State for the PAE grid
  const [paeGrid, setPaeGrid] = useState<PaeCell[][]>([]);
  // State for the selected cell
  const [selectedCell, setSelectedCell] = useState<PaeCell | null>(null);
  // State for the score
  const [score, setScore] = useState(0);
  // State for the total attempts
  const [attempts, setAttempts] = useState(0);
  // State for loading question
  const [isLoading, setIsLoading] = useState(false);
  // State for current question
  const [currentQuestion, setCurrentQuestion] = useState("");
  // State for question options
  const [options, setOptions] = useState<string[]>([]);
  // State for the correct answer
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Initialize the grid with random confidence levels
  useEffect(() => {
    initializeGrid();
  }, [gridSize]); // Reinitialize when grid size changes

  // Function to initialize the grid with random confidence levels
  const initializeGrid = () => {
    const newGrid: PaeCell[][] = [];
    const confidenceLevels: ConfidenceLevel[] = ["high", "medium", "low"];
    
    // Keep track of how many of each confidence level we've used
    const countMap: Record<ConfidenceLevel, number> = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    // Target counts for balanced distribution
    const targetCount = Math.floor((gridSize * gridSize) / 3);
    
    for (let i = 0; i < gridSize; i++) {
      const row: PaeCell[] = [];
      for (let j = 0; j < gridSize; j++) {
        // Select a confidence level that hasn't exceeded its target count
        // For advanced difficulty, make the patterns more complex
        let availableLevels = confidenceLevels;
        
        if (difficulty === "beginner") {
          // In beginner mode, make clear patterns - rows tend to have similar confidence
          if (i % 3 === 0) availableLevels = ["high"];
          else if (i % 3 === 1) availableLevels = ["medium"];
          else availableLevels = ["low"];
        } 
        else if (difficulty === "intermediate") {
          // In intermediate, ensure balanced distribution
          availableLevels = confidenceLevels.filter(
            level => countMap[level] < targetCount
          );
          
          // If all have met targets, allow any
          if (availableLevels.length === 0) {
            availableLevels = confidenceLevels;
          }
        }
        // For advanced, use the random distribution
        
        // Randomly select from available levels
        const randomIndex = Math.floor(Math.random() * availableLevels.length);
        const confidence = availableLevels[randomIndex];
        
        // Update count
        countMap[confidence]++;
        
        row.push({
          row: i,
          col: j,
          confidence
        });
      }
      newGrid.push(row);
    }
    
    setPaeGrid(newGrid);
  };

  // Handle cell click in the PAE grid
  const handleCellClick = async (cell: PaeCell) => {
    setSelectedCell(cell);
    setIsLoading(true);
    
    try {
      // Generate a question based on the selected cell and current settings
      const questionData = await generateQuestion(
        cell.confidence,
        cell.row,
        cell.col,
        difficulty,
        audience,
        gameMode
      );
      
      setCurrentQuestion(questionData.question);
      setOptions(questionData.options);
      setCorrectAnswer(questionData.correctAnswer);
    } catch (error) {
      console.error("Failed to generate question:", error);
      toast.error("Failed to generate a question. Please try again.");
      
      // Fallback to a default question based on difficulty
      if (difficulty === "beginner") {
        setCurrentQuestion("How confident are we about this part of the protein?");
        
        if (cell.confidence === "high") {
          setOptions(["Very confident", "Not confident"]);
          setCorrectAnswer("Very confident");
        } else if (cell.confidence === "medium") {
          setOptions(["Somewhat confident", "Not confident"]);
          setCorrectAnswer("Somewhat confident");
        } else {
          setOptions(["Very confident", "Not confident"]);
          setCorrectAnswer("Not confident");
        }
      } else {
        // More complex questions for higher difficulties
        setCurrentQuestion("What does this part of the PAE map tell us about the protein structure?");
        
        if (cell.confidence === "high") {
          setOptions([
            "This region is well-predicted",
            "This region has high uncertainty",
            "This region may have errors"
          ]);
          setCorrectAnswer("This region is well-predicted");
        } else if (cell.confidence === "medium") {
          setOptions([
            "This region is somewhat flexible",
            "This region is completely disordered",
            "This region is rigid"
          ]);
          setCorrectAnswer("This region is somewhat flexible");
        } else {
          setOptions([
            "This region has high uncertainty",
            "This region is well-predicted",
            "This region is rigid"
          ]);
          setCorrectAnswer("This region has high uncertainty");
        }
      }
    }
    
    setIsLoading(false);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    // Update attempts count
    setAttempts(attempts + 1);
    
    // Check if the answer is correct
    if (answer === correctAnswer) {
      // Increase score - award more points for harder difficulties
      const pointsMultiplier = difficulty === 'advanced' ? 3 : 
                              difficulty === 'intermediate' ? 2 : 1;
      setScore(score + pointsMultiplier);
      toast.success(`Correct answer! +${pointsMultiplier} points 🎉`);
    } else {
      toast.error(`Incorrect. The correct answer is: ${correctAnswer}`);
    }
    
    // Reset selected cell after answering
    setTimeout(() => {
      setSelectedCell(null);
      setCurrentQuestion("");
      setOptions([]);
    }, 2000);
  };

  // Reset the game
  const handleReset = () => {
    initializeGrid();
    setSelectedCell(null);
    setScore(0);
    setAttempts(0);
    setCurrentQuestion("");
    setOptions([]);
    toast.info("Game reset! Try to beat your previous score!");
  };

  // Render tutorial info if in tutorial mode
  const renderTutorialInfo = () => {
    if (gameMode === 'tutorial') {
      return (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold text-lg mb-2">Tutorial Mode</h3>
          <p className="mb-2">Welcome to the Confidence Challenge tutorial!</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click on any colored cell in the PAE map on the left.</li>
            <li>Notice how the corresponding part of the protein model highlights.</li>
            <li>Answer the question about protein confidence that appears below.</li>
            <li>Green cells indicate high confidence, yellow is medium, and red is low.</li>
          </ol>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8">
      <GameSettings />
      
      {renderTutorialInfo()}
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-3 text-center">PAE Map</h2>
          <PaeGrid grid={paeGrid} onCellClick={handleCellClick} selectedCell={selectedCell} />
        </div>
        
        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-3 text-center">Protein Model</h2>
          <ProteinModel paeGrid={paeGrid} selectedCell={selectedCell} />
        </div>
      </div>
      
      <QuestionArea 
        question={currentQuestion}
        options={options}
        onAnswerSelect={handleAnswerSelect}
        isLoading={isLoading}
        difficulty={difficulty}
        gameMode={gameMode}
      />
      
      <ScoreBoard 
        score={score} 
        attempts={attempts} 
        onReset={handleReset} 
        difficulty={difficulty} 
      />
    </div>
  );
};

export default ConfidenceGame;
