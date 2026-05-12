
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { QuizQuestion, QuizResult } from "@/types/game";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Info, Trophy, BookOpen, Sparkles } from "lucide-react";
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
        title: "🎉 Correct!",
        description: "Great thinking!",
        variant: "default",
      });
    } else {
      toast({
        title: "Not quite!",
        description: `The answer was: ${currentQuestion.correctAnswer}. You'll get the next one! 💪`,
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
      const correctAnswers = answeredQuestions.filter(q => q.isCorrect).length;
      
      const results: QuizResult = {
        score: correctAnswers,
        totalQuestions: questions.length,
        correctAnswers,
        questions: questions,
        answeredQuestions
      };
      
      setQuizResults(results);
      setQuizCompleted(true);
      
      const percentage = Math.round((correctAnswers / questions.length) * 100);
      const message = percentage >= 80 ? "Amazing! You're a natural! 🌟" :
                      percentage >= 60 ? "Great job! Keep it up! 💪" :
                      percentage >= 40 ? "Good effort! You're learning fast! 📈" :
                      "Keep exploring — every expert started as a beginner! 🧠";
      
      toast({
        title: `Quiz Complete! ${percentage >= 80 ? '🏆' : '✨'}`,
        description: message,
      });
    }
  };

  const handleStartNewQuiz = () => {
    onGenerateQuiz();
  };

  const progressPercentage = questions && questions.length > 0
    ? ((currentQuestionIndex + (showExplanation ? 1 : 0)) / questions.length) * 100
    : 0;

  // Get encouraging result feedback
  const getResultFeedback = (results: QuizResult) => {
    const pct = Math.round((results.correctAnswers / results.totalQuestions) * 100);
    if (pct >= 80) return { emoji: "🏆", title: "Outstanding!", subtitle: "You really understand this protein!" };
    if (pct >= 60) return { emoji: "⭐", title: "Well done!", subtitle: "You're building solid knowledge!" };
    if (pct >= 40) return { emoji: "💪", title: "Good effort!", subtitle: "Try again to improve your score!" };
    return { emoji: "🧠", title: "Keep learning!", subtitle: "Every expert started here — try again!" };
  };

  return (
    <Card className="w-full glass-card border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-game-teal" />
            <h3 className="text-lg font-semibold text-gradient">Deep Dive Quiz</h3>
          </div>
          <Button 
            onClick={onGenerateQuiz} 
            disabled={isLoading}
            size="sm"
            className="gap-1.5"
          >
            <Sparkles size={14} />
            {isLoading ? "Creating..." : questions ? "New Quiz" : "Start Quiz"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Test what you've learned about {proteinName}
        </p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-game-teal border-r-transparent mb-4"></div>
            <p className="text-sm text-muted-foreground">Crafting questions just for you... ✨</p>
          </div>
        ) : !questions || questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <span className="text-4xl mb-4">📝</span>
            <p className="text-sm text-foreground/80 mb-2">Ready to test your knowledge?</p>
            <p className="text-xs text-muted-foreground mb-4 max-w-sm">
              Click "Start Quiz" above to get personalized questions about {proteinName}. 
              Questions adapt to your level!
            </p>
          </div>
        ) : quizCompleted && quizResults ? (
          <div className="space-y-5">
            {/* Celebration header */}
            <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-amber-50 to-transparent rounded-xl">
              <span className="text-5xl mb-2 animate-celebrate">
                {getResultFeedback(quizResults).emoji}
              </span>
              <h3 className="text-xl font-bold text-foreground">
                {getResultFeedback(quizResults).title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {getResultFeedback(quizResults).subtitle}
              </p>
              <p className="text-lg font-semibold mt-3 text-game-teal">
                {quizResults.correctAnswers} / {quizResults.totalQuestions} correct
                ({Math.round((quizResults.correctAnswers / quizResults.totalQuestions) * 100)}%)
              </p>
              <Progress 
                value={(quizResults.correctAnswers / quizResults.totalQuestions) * 100} 
                className="h-2 mt-3 max-w-xs" 
              />
            </div>

            {/* What you learned summary */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-1.5">
                <Info size={14} className="text-game-teal" />
                What you learned:
              </h4>
              {quizResults.answeredQuestions.map((item, index) => (
                <div key={index} className={`p-3 rounded-xl text-sm ${item.isCorrect ? 'bg-green-50/80' : 'bg-red-50/80'}`}>
                  <div className="flex items-start gap-2">
                    {item.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-xs text-foreground/80">{item.question.question}</p>
                      {!item.isCorrect && (
                        <p className="text-xs text-foreground/60 mt-1">
                          Answer: <span className="text-green-600 font-medium">{item.question.correctAnswer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <Button onClick={handleStartNewQuiz} className="gap-1.5">
                <Sparkles size={14} />
                Try Another Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-1.5" />
            </div>

            <div className="p-4 bg-primary/5 rounded-xl">
              <p className="text-base font-medium leading-relaxed">{currentQuestion?.question}</p>
            </div>

            <div className="space-y-2">
              {currentQuestion?.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`w-full justify-start text-left p-3.5 h-auto text-sm interactive-hover ${
                    showExplanation
                      ? option === currentQuestion.correctAnswer
                        ? "border-2 border-green-400 bg-green-50"
                        : selectedAnswer === option
                        ? "border-2 border-red-300 bg-red-50"
                        : ""
                      : ""
                  }`}
                  onClick={() => handleAnswerSelection(option)}
                  disabled={showExplanation}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="min-w-5 mt-0.5">
                      {showExplanation && option === currentQuestion.correctAnswer ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : showExplanation && selectedAnswer === option ? (
                        <XCircle className="h-4 w-4 text-red-400" />
                      ) : (
                        <span className="h-5 w-5 rounded-full border flex items-center justify-center text-xs">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    <div>{option}</div>
                  </div>
                </Button>
              ))}
            </div>

            {showExplanation && currentQuestion?.explanation && (
              <div className="p-4 bg-teal-50/80 border-l-3 border-game-teal rounded-r-xl animate-fade-in-up">
                <div className="flex gap-2 mb-1.5">
                  <Info className="h-4 w-4 text-game-teal flex-shrink-0 mt-0.5" />
                  <h4 className="font-medium text-sm text-teal-800">Why?</h4>
                </div>
                <p className="text-sm text-teal-700 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {currentQuestion && !quizCompleted && (
        <CardFooter className="flex justify-end pt-2 gap-2">
          {!showExplanation ? (
            <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} size="sm">
              Check Answer
            </Button>
          ) : (
            <Button onClick={handleNextQuestion} size="sm" className="gap-1">
              {currentQuestionIndex < (questions?.length || 0) - 1 ? "Next →" : "See Results 🎉"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProteinQuiz;
