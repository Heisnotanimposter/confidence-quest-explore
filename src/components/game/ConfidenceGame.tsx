
import { useEffect } from "react";
import { useGameSettings } from "./GameSettingsContext";
import { useGameState } from "@/hooks/useGameState";
import GameSettings from "./GameSettings";
import ProteinSelector from "./ProteinSelector";
import TutorialInfo from "./TutorialInfo";
import GameLayout from "./GameLayout";

// Main game component
const ConfidenceGame = () => {
  const { difficulty, gameMode, audience, gridSize } = useGameSettings();
  
  const {
    paeGrid, 
    selectedCell,
    score,
    attempts,
    isLoading,
    currentQuestion,
    options,
    correctAnswer,
    selectedProtein,
    selectedMapType,
    proteinData,
    generateProteinGrid,
    handleCellClick,
    handleAnswerSelect,
    handleReset,
    setSelectedProtein,
    setSelectedMapType
  } = useGameState(difficulty, gameMode, audience, gridSize);

  // Initialize the grid with real protein data
  useEffect(() => {
    generateProteinGrid();
  }, [selectedProtein, selectedMapType, gridSize]);

  // Handle protein selection
  const handleProteinSelect = (proteinId: string) => {
    setSelectedProtein(proteinId);
  };

  // Handle PAE map type selection
  const handleMapTypeSelect = (mapType: any) => {
    setSelectedMapType(mapType);
  };

  return (
    <div className="flex flex-col gap-8">
      <GameSettings />
      
      <TutorialInfo gameMode={gameMode} />
      
      <ProteinSelector 
        selectedProtein={selectedProtein}
        onProteinSelect={handleProteinSelect}
        selectedMapType={selectedMapType}
        onMapTypeSelect={handleMapTypeSelect}
      />
      
      <GameLayout
        paeGrid={paeGrid}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
        question={currentQuestion}
        options={options}
        onAnswerSelect={handleAnswerSelect}
        isLoading={isLoading}
        score={score}
        attempts={attempts}
        onReset={handleReset}
        difficulty={difficulty}
        gameMode={gameMode}
        audience={audience}
        proteinData={proteinData}
      />
    </div>
  );
};

export default ConfidenceGame;
