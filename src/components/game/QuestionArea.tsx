import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DifficultyLevel, GameMode } from "./GameSettingsContext";
import { HelpCircle, Sparkles, Target, Compass } from "lucide-react";

interface QuestionAreaProps {
  question: string;
  options: string[];
  onAnswerSelect: (answer: string) => void;
  isLoading: boolean;
  difficulty: DifficultyLevel;
  gameMode: GameMode;
}

const modeConfig = {
  challenge: { icon: Target, title: "Quiz Time! 🎯", color: "text-game-coral" },
  explore: { icon: Compass, title: "Let's Explore 🔍", color: "text-game-teal" },
  tutorial: { icon: Sparkles, title: "Learning Together ✨", color: "text-purple-500" }
};

const QuestionArea = ({
  question,
  options,
  onAnswerSelect,
  isLoading,
  difficulty,
  gameMode
}: QuestionAreaProps) => {
  const mode = modeConfig[gameMode];
  const ModeIcon = mode.icon;

  // Render appropriate message based on game mode when no question is selected
  const renderInitialMessage = () => {
    if (gameMode === 'explore') {
      return (
        <div className="text-center space-y-3">
          <div className="text-4xl animate-float">🔍</div>
          <p className="text-lg font-medium text-foreground/80">Ready to explore!</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Click any colored square on the Confidence Map above to discover what AI thinks about that part of the protein.
          </p>
        </div>
      );
    } else if (gameMode === 'tutorial') {
      return (
        <div className="text-center space-y-3">
          <div className="text-4xl animate-float">🧑‍🔬</div>
          <p className="text-lg font-medium text-foreground/80">Let's start learning!</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Click any colored square above. I'll ask you a fun question about what that color means!
          </p>
        </div>
      );
    } else {
      return (
        <div className="text-center space-y-3">
          <div className="text-4xl animate-float">🎯</div>
          <p className="text-lg font-medium text-foreground/80">Ready for a challenge?</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Click a colored square on the Confidence Map to get your first question. How many can you get right?
          </p>
        </div>
      );
    }
  };

  // Render help tooltip based on difficulty
  const renderHelp = () => {
    if (question && difficulty === 'beginner') {
      return (
        <div className="flex items-center justify-center mt-3 p-2 bg-amber-50 rounded-lg">
          <HelpCircle size={14} className="mr-1.5 text-amber-500" />
          <span className="text-xs text-amber-700">
            💡 Hint: Look at the color of the square you clicked — it tells you the answer!
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card border-0 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-center gap-2">
          <ModeIcon size={18} className={mode.color} />
          <h2 className="text-lg font-semibold text-foreground/90">{mode.title}</h2>
        </div>
      </CardHeader>
      <CardContent>
        {!question && !isLoading ? (
          <div className="py-6">
            {renderInitialMessage()}
          </div>
        ) : isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-game-teal border-r-transparent mb-3"></div>
            <p className="text-sm text-muted-foreground">Thinking of a good question... 🤔</p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <p className={`text-base md:text-lg text-center leading-relaxed ${difficulty === 'advanced' ? 'font-medium' : ''}`}>
              {question}
            </p>
            
            {renderHelp()}
            
            <div className="flex flex-col gap-2.5 mt-4 max-w-lg mx-auto">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => onAnswerSelect(option)}
                  className="px-5 py-3 text-sm md:text-base w-full text-left justify-start h-auto whitespace-normal interactive-hover"
                  variant={index % 2 === 0 ? 'default' : 'outline'}
                >
                  <span className="mr-2 opacity-60">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionArea;
