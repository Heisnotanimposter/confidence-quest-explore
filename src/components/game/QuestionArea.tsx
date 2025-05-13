import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DifficultyLevel, GameMode } from "./GameSettingsContext";
import { HelpCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

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
    if (!question) return null;
    
    // For beginners, show more detailed help
    if (difficulty === 'beginner') {
      return (
        <div className="flex items-center justify-center mt-4 text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <HelpCircle size={16} className="mr-2 flex-shrink-0" />
          <span className="text-sm">
            Tip: Look at the color of the cell to help determine the answer. 
            Green cells indicate high confidence, yellow is medium, and red is low confidence.
          </span>
        </div>
      );
    } 
    // For intermediate, show a simpler hint
    else if (difficulty === 'intermediate') {
      return (
        <div className="flex items-center justify-center mt-3 text-gray-600">
          <HelpCircle size={16} className="mr-1" />
          <span className="text-xs">
            Remember: The colors in the PAE map represent prediction confidence
          </span>
        </div>
      );
    }
    
    return null;
  };

  // Tutorial-specific help content
  const renderTutorialHelp = () => {
    if (gameMode === 'tutorial' && question) {
      return (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 text-sm text-gray-700">
          <p className="font-medium mb-2">Tutorial Help:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The colors in the PAE map show how confident scientists are about each part of the protein.</li>
            <li>Green areas (high confidence): Scientists are very sure about this structure.</li>
            <li>Yellow areas (medium confidence): There is some uncertainty about this structure.</li>
            <li>Red areas (low confidence): This part of the structure is less certain.</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  // Handle radio button selection
  const handleRadioChange = (value: string) => {
    setSelectedAnswer(value);
  };

  // Handle submit button click
  const handleSubmit = () => {
    if (selectedAnswer) {
      onAnswerSelect(selectedAnswer);
      setSelectedAnswer(null);
    }
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
            {renderTutorialHelp()}
            
            <div className="mt-6">
              <RadioGroup className="flex flex-col space-y-3">
                {options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg border
                    ${selectedAnswer === option ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}
                    cursor-pointer transition-colors`}
                  >
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${index}`}
                      checked={selectedAnswer === option}
                      onChange={() => handleRadioChange(option)}
                    />
                    <span className="text-base">{option}</span>
                  </label>
                ))}
              </RadioGroup>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="px-8 py-2"
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionArea;
