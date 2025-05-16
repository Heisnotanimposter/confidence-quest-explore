
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuizQuestion } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, HelpCircle, Info } from "lucide-react";
import { DifficultyLevel, AudienceType } from "./GameSettingsContext";

interface ProteinQuizProps {
  proteinId: string;
  proteinName: string;
  questions: QuizQuestion[] | null;
  isLoading: boolean;
  onGenerateQuiz: () => void;
  onAnswerSubmit: (question: QuizQuestion, answer: string) => void;
  difficulty: DifficultyLevel;
  audience: AudienceType;
  score: number;
  attempts: number;
}

const ProteinQuiz: React.FC<ProteinQuizProps> = ({
  proteinId,
  proteinName,
  questions,
  isLoading,
  onGenerateQuiz,
  onAnswerSubmit,
  difficulty,
  audience,
  score,
  attempts,
}) => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;

  // Handle answer selection
  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    onAnswerSubmit(currentQuestion, selectedAnswer);
    
    if (selectedAnswer === currentQuestion.correctAnswer) {
      toast({
        title: "Correct!",
        description: "You've selected the right answer.",
        variant: "default",
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${currentQuestion.correctAnswer}`,
        variant: "destructive",
      });
    }
    
    setShowExplanation(true);
  };

  // Handle moving to the next question
  const handleNextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      toast({
        title: "Quiz Completed",
        description: "You've completed all questions in this quiz!",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Protein Quiz</h3>
          <Button onClick={onGenerateQuiz} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate New Quiz"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Test your knowledge about {proteinName}
        </p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4">Generating quiz questions with Gemini AI...</p>
          </div>
        ) : !questions || questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="mb-4">No quiz questions available for this protein yet.</p>
            <p className="text-sm text-muted-foreground mb-6">
              Click "Generate New Quiz" to create questions about {proteinName}.
            </p>
            <Button onClick={onGenerateQuiz}>Generate Quiz</Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium px-2 py-1 bg-muted rounded-md">
                Difficulty: {difficulty}
              </span>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-lg font-medium">{currentQuestion?.question}</p>
            </div>

            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`w-full justify-start text-left p-4 h-auto ${
                    showExplanation
                      ? option === currentQuestion.correctAnswer
                        ? "border-2 border-green-500"
                        : selectedAnswer === option
                        ? "border-2 border-red-500"
                        : ""
                      : ""
                  }`}
                  onClick={() => handleAnswerSelection(option)}
                  disabled={showExplanation}
                >
                  <div className="flex items-start gap-2">
                    <div className="min-w-5">
                      {showExplanation && option === currentQuestion.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : showExplanation && selectedAnswer === option ? (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : (
                        <span className="h-5 w-5 rounded-full border flex items-center justify-center">
                          {String.fromCharCode(97 + index)}
                        </span>
                      )}
                    </div>
                    <div>{option}</div>
                  </div>
                </Button>
              ))}
            </div>

            {showExplanation && currentQuestion?.explanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2 mb-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Explanation</h4>
                </div>
                <p className="text-sm">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <div className="text-sm">
          Score: {score} | Attempts: {attempts}
        </div>
        <div className="space-x-2">
          {currentQuestion && !showExplanation && (
            <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
              Submit Answer
            </Button>
          )}
          {showExplanation && (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < (questions?.length || 0) - 1
                ? "Next Question"
                : "Finish Quiz"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProteinQuiz;
