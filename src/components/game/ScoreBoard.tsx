import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "./GameSettingsContext";
import { Award } from "lucide-react";

interface ScoreBoardProps {
  score: number;
  attempts: number;
  onReset: () => void;
  difficulty: DifficultyLevel;
}

const ScoreBoard = ({ score, attempts, onReset, difficulty }: ScoreBoardProps) => {
  // Calculate accuracy percentage based on difficulty multiplier
  const getAccuracy = () => {
    if (attempts === 0) return 0;
    
    // Get the points multiplier for the current difficulty
    const multiplier = difficulty === 'advanced' ? 3 : 
                      difficulty === 'intermediate' ? 2 : 1;
    
    // Calculate the maximum possible score for the number of attempts
    const maxPossibleScore = attempts * multiplier;
    
    // Calculate accuracy as a percentage of the maximum possible score
    return Math.round((score / maxPossibleScore) * 100);
  };
  
  // Get points multiplier based on difficulty
  const getMultiplier = () => {
    switch (difficulty) {
      case 'beginner': return '×1';
      case 'intermediate': return '×2';
      case 'advanced': return '×3';
      default: return '×1';
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Score</p>
            <p className="text-3xl font-bold">{score}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Attempts</p>
            <p className="text-3xl font-bold">{attempts}</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Accuracy</p>
            <p className="text-3xl font-bold">{getAccuracy()}%</p>
          </div>
          
          <div className="text-center flex items-center gap-1">
            <div>
              <p className="text-sm font-medium text-gray-600">Difficulty</p>
              <div className="flex items-center justify-center">
                <Award size={16} className="text-yellow-500" />
                <p className="text-xl font-bold capitalize ml-1">
                  {difficulty} {getMultiplier()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button onClick={onReset} variant="outline">
            Reset Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
