import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DifficultyLevel, GameMode } from "./GameSettingsContext";
import { HelpCircle } from "lucide-react";

interface QuestionAreaProps {
  question: string;
  options: string[];
  onAnswerSelect: (answer: string) => void;
  isLoading: boolean;
  difficulty: DifficultyLevel;
  gameMode: GameMode;
}

const QuestionArea = ({
  question,
  options,
  onAnswerSelect,
  isLoading,
  difficulty,
  gameMode
}: QuestionAreaProps) => {
  // Render appropriate message based on game mode when no question is selected
  const renderInitialMessage = () => {
    if (gameMode === 'explore') {
      return (
        <>
          <p className="text-lg">Explore Mode: Click on any cell to learn about that region</p>
          <p className="text-sm text-gray-500 mt-2">
            In this mode, you can freely explore the PAE map without being scored.
          </p>
        </>
      );
    } else if (gameMode === 'tutorial') {
      return (
        <>
          <p className="text-lg">Tutorial Mode: Click on any colored cell to start!</p>
          <p className="text-sm text-gray-500 mt-2">
            This mode will guide you through understanding protein confidence scores.
          </p>
        </>
      );
    } else {
      return (
        <>
          <p className="text-lg">Select a cell on the PAE map to start!</p>
          <p className="text-sm text-gray-500 mt-2">
            Click on any colored cell to learn about protein confidence.
          </p>
        </>
      );
    }
  };

  // Render help tooltip based on difficulty
  const renderHelp = () => {
    if (question && difficulty === 'beginner') {
      return (
        <div className="flex items-center justify-center mt-2 text-gray-500">
          <HelpCircle size={16} className="mr-1" />
          <span className="text-xs">
            Tip: Look at the color of the cell to help determine the answer
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-center">
          {gameMode === 'challenge' ? 'Challenge' : gameMode === 'explore' ? 'Exploration' : 'Tutorial'}
        </h2>
      </CardHeader>
      <CardContent>
        {!question && !isLoading ? (
          <div className="text-center py-6">
            {renderInitialMessage()}
          </div>
        ) : isLoading ? (
          <div className="text-center py-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2">Generating a question...</p>
          </div>
        ) : (
          <div className="py-4">
            <p className={`text-lg mb-6 text-center ${difficulty === 'advanced' ? 'font-medium' : ''}`}>
              {question}
            </p>
            
            {renderHelp()}
            
            <div className="flex flex-col gap-3 justify-center mt-4">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => onAnswerSelect(option)}
                  className="px-6 py-2 text-base w-full"
                  variant={difficulty === 'advanced' ? (index % 2 === 0 ? 'default' : 'outline') : 'default'}
                >
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
