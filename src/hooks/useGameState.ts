import { useState } from "react";
import { PaeCell, ConfidenceLevel, QuizQuestion, QuizResult } from "@/types/game";
import { generatePaeGrid, PaeMapType, getProteinById } from "@/services/proteinDataService";
import { generateQuestion, generateProteinQuiz } from "@/services/apiClient";
import { toast } from "sonner";
import { DifficultyLevel, GameMode, AudienceType } from "@/components/game/GameSettingsContext";

export function useGameState(
  difficulty: DifficultyLevel,
  gameMode: GameMode,
  audience: AudienceType,
  gridSize: number
) {
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
  // State for selected protein
  const [selectedProtein, setSelectedProtein] = useState("p1");
  // State for selected map type
  const [selectedMapType, setSelectedMapType] = useState<PaeMapType>("full");
  // State for protein data
  const [proteinData, setProteinData] = useState(getProteinById("p1"));
  
  // States for quiz functionality
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);

  // Function to generate grid based on selected protein
  const generateProteinGrid = () => {
    const { grid, proteinData } = generatePaeGrid(selectedProtein, selectedMapType, gridSize);
    setPaeGrid(grid);
    setProteinData(proteinData);
    setSelectedCell(null);
    // Reset quiz when changing protein
    setQuizQuestions(null);
    setQuizResults(null);
  };

  // Handle cell click in the PAE grid
  const handleCellClick = async (cell: PaeCell) => {
    setSelectedCell(cell);
    setIsLoading(true);
    
    try {
      // Generate a question based on the selected cell and current settings
      // Now include protein information when available
      const questionData = await generateQuestion(
        cell.confidence,
        difficulty,
        audience,
        gameMode,
        proteinData?.name,
        proteinData?.function[audience]
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

  // Generate a quiz for the current protein
  const handleGenerateQuiz = async () => {
    if (!proteinData) return;
    
    setQuizLoading(true);
    setQuizResults(null);
    
    try {
      console.log("Generating quiz for:", proteinData.name);
      const questions = await generateProteinQuiz(
        proteinData.id,
        proteinData.name,
        proteinData.function[audience],
        proteinData.species,
        difficulty,
        audience,
        5 // Generate 5 questions
      );
      
      if (questions && questions.length > 0) {
        setQuizQuestions(questions);
        toast.success(`Generated ${questions.length} questions about ${proteinData.name}`);
      } else {
        toast.error("Couldn't generate quiz questions. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      toast.error("Failed to generate a quiz. Please try again.");
      
      // Provide fallback questions based on the protein data
      const fallbackQuestions: QuizQuestion[] = [
        {
          question: `What is the main function of ${proteinData.name}?`,
          options: [
            proteinData.function[audience].substring(0, 100),
            "Energy production in cells",
            "DNA replication and repair",
            "Cell signaling and communication"
          ],
          correctAnswer: proteinData.function[audience].substring(0, 100),
          explanation: `${proteinData.name}'s primary function is related to ${proteinData.function[audience].substring(0, 100)}`
        },
        {
          question: `Which species is ${proteinData.name} from in our database?`,
          options: [
            proteinData.species,
            "Drosophila melanogaster",
            "Escherichia coli",
            "Saccharomyces cerevisiae"
          ],
          correctAnswer: proteinData.species,
          explanation: `${proteinData.name} in our database is from ${proteinData.species}`
        }
      ];
      
      setQuizQuestions(fallbackQuestions);
    } finally {
      setQuizLoading(false);
    }
  };

  // Handle quiz answer submission
  const handleQuizAnswerSubmit = (question: QuizQuestion, answer: string) => {
    // Update attempts count
    setAttempts(attempts + 1);
    
    // Check if the answer is correct
    if (answer === question.correctAnswer) {
      // Increase score - award more points for harder difficulties
      const pointsMultiplier = difficulty === 'advanced' ? 3 : 
                              difficulty === 'intermediate' ? 2 : 1;
      setScore(score + pointsMultiplier);
    }
  };

  // Reset the game
  const handleReset = () => {
    generateProteinGrid();
    setSelectedCell(null);
    setScore(0);
    setAttempts(0);
    setCurrentQuestion("");
    setOptions([]);
    setQuizQuestions(null);
    setQuizResults(null);
    toast.info("Game reset! Try to beat your previous score!");
  };

  return {
    paeGrid,
    selectedCell,
    score,
    attempts,
    isLoading,
    currentQuestion,
    options,
    correctAnswer,
    selectedProtein,
    selectedMapType,
    proteinData,
    quizQuestions,
    quizLoading,
    quizResults,
    generateProteinGrid,
    handleCellClick,
    handleAnswerSelect,
    handleReset,
    handleGenerateQuiz,
    handleQuizAnswerSubmit,
    setSelectedProtein,
    setSelectedMapType
  };
}
