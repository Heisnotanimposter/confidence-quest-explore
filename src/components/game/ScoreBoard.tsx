import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "./GameSettingsContext";
import { RotateCcw, Trophy, Target, Flame } from "lucide-react";

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
    
    const multiplier = difficulty === 'advanced' ? 3 : 
                      difficulty === 'intermediate' ? 2 : 1;
    
    const maxPossibleScore = attempts * multiplier;
    return Math.round((score / maxPossibleScore) * 100);
  };
  
  const accuracy = getAccuracy();
  
  // Fun feedback based on accuracy
  const getFeedback = () => {
    if (attempts === 0) return { emoji: "🎯", text: "Start exploring!" };
    if (accuracy >= 80) return { emoji: "🌟", text: "Amazing!" };
    if (accuracy >= 60) return { emoji: "💪", text: "Great job!" };
    if (accuracy >= 40) return { emoji: "📈", text: "Getting there!" };
    return { emoji: "🧠", text: "Keep learning!" };
  };
  
  const feedback = getFeedback();
  
  return (
    <div className="glass-card p-4 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center mb-0.5">
              <Trophy size={13} className="text-amber-500" />
              <p className="text-xs font-medium text-muted-foreground">Score</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{score}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center mb-0.5">
              <Target size={13} className="text-game-teal" />
              <p className="text-xs font-medium text-muted-foreground">Tries</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{attempts}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center mb-0.5">
              <Flame size={13} className="text-game-coral" />
              <p className="text-xs font-medium text-muted-foreground">Accuracy</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl mb-0.5">{feedback.emoji}</p>
            <p className="text-xs font-medium text-muted-foreground">{feedback.text}</p>
          </div>
        </div>
        
        <Button onClick={onReset} variant="outline" size="sm" className="gap-1.5">
          <RotateCcw size={14} />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default ScoreBoard;
