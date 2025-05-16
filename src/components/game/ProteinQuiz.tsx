
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuizQuestion, QuizResult } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, HelpCircle, Info, Trophy } from "lucide-react";
import { DifficultyLevel, AudienceType } from "./GameSettingsContext";
import { Progress } from "@/components/ui/progress";

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
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<{
    question: QuizQuestion;
    userAnswer: string;
    isCorrect: boolean;
  }[]>([]);

  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;

  // Effect to reset quiz state when new questions are loaded
  useEffect(() => {
    if (questions && questions.length > 0) {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuizCompleted(false);
      setQuizResults(null);
      setAnsweredQuestions([]);
    }
  }, [questions]);

  // Handle answer selection
  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    onAnswerSubmit(currentQuestion, selectedAnswer);
    
    // Add to answered questions
    const updatedAnsweredQuestions = [
      ...answeredQuestions,
      {
        question: currentQuestion,
        userAnswer: selectedAnswer,
        isCorrect
      }
    ];
    
    setAnsweredQuestions(updatedAnsweredQuestions);
    
    if (isCorrect) {
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

  // Handle moving to the next question or completing the quiz
  const handleNextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz is complete
      const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
      
      // Create quiz results
      const results: QuizResult = {
        score: correctAnswers,
        totalQuestions: questions.length,
        correctAnswers,
        questions: questions,
        answeredQuestions
      };
      
      setQuizResults(results);
      setQuizCompleted(true);
      
      toast({
        title: "Quiz Completed",
        description: `You've scored ${correctAnswers} out of ${questions.length}!`,
      });
    }
  };

  // Handle starting a new quiz
  const handleStartNewQuiz = () => {
    onGenerateQuiz();
  };

  // Calculate progress percentage
  const progressPercentage = questions && questions.length > 0
    ? ((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100
    : 0;

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
        ) : quizCompleted && quizResults ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
              <Trophy className="h-12 w-12 text-yellow-500 mb-2" />
              <h3 className="text-xl font-bold">Quiz Completed!</h3>
              <p className="text-lg mt-2">
                You scored {quizResults.correctAnswers} out of {quizResults.totalQuestions}
                ({Math.round((quizResults.correctAnswers / quizResults.totalQuestions) * 100)}%)
              </p>
              <div className="w-full mt-4">
                <Progress value={(quizResults.correctAnswers / quizResults.totalQuestions) * 100} className="h-2" />
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h4 className="font-medium text-lg">Question Summary:</h4>
              {quizResults.answeredQuestions.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-start gap-2">
                    {item.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">Q{index + 1}: {item.question.question}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Your answer: <span className={item.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {item.userAnswer}
                        </span>
                      </p>
                      {!item.isCorrect && (
                        <p className="text-sm text-gray-600">
                          Correct answer: <span className="text-green-600 font-medium">{item.question.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button onClick={handleStartNewQuiz} size="lg">
                Start New Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium px-2 py-1 bg-muted rounded-md">
                  Difficulty: {difficulty}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
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
          {currentQuestion && !showExplanation && !quizCompleted && (
            <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
              Submit Answer
            </Button>
          )}
          {showExplanation && !quizCompleted && (
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
