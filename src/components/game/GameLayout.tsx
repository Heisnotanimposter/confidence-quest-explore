
import { useState } from "react";
import { PaeCell, ProteinStructure, QuizQuestion } from "@/types/game";
import { DifficultyLevel, GameMode, AudienceType } from "./GameSettingsContext";
import PaeGrid from "./PaeGrid";
import QuestionArea from "./QuestionArea";
import ScoreBoard from "./ScoreBoard";
import ProteinInfo from "./ProteinInfo";
import ProteinModel3D from './ProteinModel3D';
import ProteinQuiz from './ProteinQuiz';
import { ChevronDown, ChevronUp } from "lucide-react";

interface GameLayoutProps {
  paeGrid: PaeCell[][];
  selectedCell: PaeCell | null;
  onCellClick: (cell: PaeCell) => void;
  question: string;
  options: string[];
  onAnswerSelect: (answer: string) => void;
  isLoading: boolean;
  score: number;
  attempts: number;
  onReset: () => void;
  difficulty: DifficultyLevel;
  gameMode: GameMode;
  audience: AudienceType;
  proteinData: ProteinStructure | undefined;
  quizQuestions: QuizQuestion[] | null;
  quizLoading: boolean;
  onGenerateQuiz: () => void;
  onQuizAnswerSubmit: (question: QuizQuestion, answer: string) => void;
}

const GameLayout = ({
  paeGrid,
  selectedCell,
  onCellClick,
  question,
  options,
  onAnswerSelect,
  isLoading,
  score,
  attempts,
  onReset,
  difficulty,
  gameMode,
  audience,
  proteinData,
  quizQuestions,
  quizLoading,
  onGenerateQuiz,
  onQuizAnswerSubmit
}: GameLayoutProps) => {
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content — Confidence Map + Questions */}
      <div className="lg:col-span-2 space-y-6">
        {/* Primary interaction: Confidence Map + Question Area side by side on desktop */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <PaeGrid grid={paeGrid} onCellClick={onCellClick} selectedCell={selectedCell} />
          </div>
          <div className="w-full md:w-1/2">
            <QuestionArea 
              question={question}
              options={options}
              onAnswerSelect={onAnswerSelect}
              isLoading={isLoading}
              difficulty={difficulty}
              gameMode={gameMode}
            />
          </div>
        </div>

        {/* Score Board */}
        <ScoreBoard 
          score={score} 
          attempts={attempts} 
          onReset={onReset} 
          difficulty={difficulty} 
        />

        {/* 3D Model — Progressive Disclosure (expandable deep-dive) */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <button 
            onClick={() => setShow3D(!show3D)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🧊</span>
              <div className="text-left">
                <h3 className="font-semibold text-sm text-foreground/90">3D Shape Preview</h3>
                <p className="text-xs text-muted-foreground">See how the protein looks in 3D — colors match the map above</p>
              </div>
            </div>
            {show3D ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
          </button>
          
          {show3D && (
            <div className="animate-slide-up">
              <ProteinModel3D 
                paeGrid={paeGrid} 
                selectedCell={selectedCell} 
                gridSize={paeGrid.length}
              />
            </div>
          )}
        </div>
        
        {/* Protein Quiz — Progressive Disclosure */}
        <ProteinQuiz
          proteinId={proteinData?.id || ''}
          proteinName={proteinData?.name || 'Unknown Protein'}
          questions={quizQuestions}
          isLoading={quizLoading}
          onGenerateQuiz={onGenerateQuiz}
          onAnswerSubmit={onQuizAnswerSubmit}
          difficulty={difficulty}
          audience={audience}
          score={score}
          attempts={attempts}
        />
      </div>
      
      {/* Sidebar — Protein Information */}
      <div>
        <ProteinInfo 
          protein={proteinData} 
          audience={audience}
        />
      </div>
    </div>
  );
};

export default GameLayout;
