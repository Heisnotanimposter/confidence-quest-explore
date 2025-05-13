
import { PaeCell } from "@/types/game";
import { DifficultyLevel, GameMode, AudienceType } from "./GameSettingsContext";
import PaeGrid from "./PaeGrid";
import ProteinModel from "./ProteinModel";
import QuestionArea from "./QuestionArea";
import ScoreBoard from "./ScoreBoard";
import { ProteinStructure } from "@/services/proteinDataService";
import ProteinInfo from "./ProteinInfo";

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
  proteinData
}: GameLayoutProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-3 text-center">PAE Map</h2>
            <PaeGrid grid={paeGrid} onCellClick={onCellClick} selectedCell={selectedCell} />
          </div>
          
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-3 text-center">Protein Model</h2>
            <ProteinModel paeGrid={paeGrid} selectedCell={selectedCell} />
          </div>
        </div>
        
        <div className="mt-8">
          <QuestionArea 
            question={question}
            options={options}
            onAnswerSelect={onAnswerSelect}
            isLoading={isLoading}
            difficulty={difficulty}
            gameMode={gameMode}
          />
          
          <div className="mt-6">
            <ScoreBoard 
              score={score} 
              attempts={attempts} 
              onReset={onReset} 
              difficulty={difficulty} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-3 text-center">Protein Information</h2>
        <ProteinInfo 
          protein={proteinData} 
          audience={audience}
        />
      </div>
    </div>
  );
};

export default GameLayout;
