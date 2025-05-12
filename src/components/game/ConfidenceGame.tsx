import { useState, useEffect } from "react";
import PaeGrid from "./PaeGrid";
import ProteinModel from "./ProteinModel";
import QuestionArea from "./QuestionArea";
import ScoreBoard from "./ScoreBoard";
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
  // State for the 5x5 PAE grid
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
  }, []);

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
    const targetCount = Math.floor((5 * 5) / 3); // ~8-9 of each type
    
    for (let i = 0; i < 5; i++) {
      const row: PaeCell[] = [];
      for (let j = 0; j < 5; j++) {
        // Select a confidence level that hasn't exceeded its target count
        let availableLevels = confidenceLevels.filter(
          level => countMap[level] < targetCount
        );
        
        // If all have met targets, allow any
        if (availableLevels.length === 0) {
          availableLevels = confidenceLevels;
        }
        
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
      // Generate a question based on the selected cell
      const questionData = await generateQuestion(cell);
      setCurrentQuestion(questionData.question);
      setOptions(questionData.options);
      setCorrectAnswer(questionData.correctAnswer);
    } catch (error) {
      console.error("Failed to generate question:", error);
      toast.error("Failed to generate a question. Please try again.");
      // Fallback to a default question
      setCurrentQuestion("How confident are we about this part of the protein?");
      
      if (cell.confidence === "high") {
        setOptions(["Very confident", "Somewhat confident", "Not confident"]);
        setCorrectAnswer("Very confident");
      } else if (cell.confidence === "medium") {
        setOptions(["Very confident", "Somewhat confident", "Not confident"]);
        setCorrectAnswer("Somewhat confident");
      } else {
        setOptions(["Very confident", "Somewhat confident", "Not confident"]);
        setCorrectAnswer("Not confident");
      }
    }
    
    setIsLoading(false);
  };

  // Generate a question based on the selected cell
  const generateQuestion = async (cell: PaeCell): Promise<{
    question: string;
    options: string[];
    correctAnswer: string;
  }> => {
    // In a real implementation, this would call the Gemini API
    // For now, we'll simulate with predefined questions based on confidence level
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate question based on confidence level
    if (cell.confidence === "high") {
      return {
        question: "Is this part of the protein structure very reliable?",
        options: ["Yes", "No"],
        correctAnswer: "Yes"
      };
    } else if (cell.confidence === "medium") {
      return {
        question: "How much might this part of the protein move?",
        options: ["Not at all", "A little", "A lot"],
        correctAnswer: "A little"
      };
    } else {
      return {
        question: "Do we have enough information about this region?",
        options: ["Yes", "No"],
        correctAnswer: "No"
      };
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    // Update attempts count
    setAttempts(attempts + 1);
    
    // Check if the answer is correct
    if (answer === correctAnswer) {
      // Increase score
      setScore(score + 1);
      toast.success("Correct answer! 🎉");
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

  return (
    <div className="flex flex-col gap-8">
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
      />
      
      <ScoreBoard score={score} attempts={attempts} onReset={handleReset} />
    </div>
  );
};

export default ConfidenceGame;
