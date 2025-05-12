
import { Button } from "@/components/ui/button";

interface ScoreBoardProps {
  score: number;
  attempts: number;
  onReset: () => void;
}

const ScoreBoard = ({ score, attempts, onReset }: ScoreBoardProps) => {
  // Calculate accuracy percentage
  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  
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
            <p className="text-3xl font-bold">{accuracy}%</p>
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
