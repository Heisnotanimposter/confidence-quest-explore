
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface QuestionAreaProps {
  question: string;
  options: string[];
  onAnswerSelect: (answer: string) => void;
  isLoading: boolean;
}

const QuestionArea = ({
  question,
  options,
  onAnswerSelect,
  isLoading
}: QuestionAreaProps) => {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-bold text-center">Challenge</h2>
      </CardHeader>
      <CardContent>
        {!question && !isLoading ? (
          <div className="text-center py-6">
            <p className="text-lg">Select a cell on the PAE map to start!</p>
            <p className="text-sm text-gray-500 mt-2">
              Click on any colored cell to learn about protein confidence.
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2">Generating a question...</p>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-lg mb-6 text-center">{question}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => onAnswerSelect(option)}
                  className="px-6 py-2 text-base"
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
