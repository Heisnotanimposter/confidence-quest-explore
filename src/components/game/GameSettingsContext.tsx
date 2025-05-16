import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the available difficulty levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Define the available game modes
export type GameMode = 'tutorial' | 'challenge' | 'explore';

// Define the audience type
export type AudienceType = 'elementary' | 'highSchool' | 'undergraduate';

interface GameSettings {
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  audience: AudienceType;
  setAudience: (audience: AudienceType) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
}

const GameSettingsContext = createContext<GameSettings | undefined>(undefined);

export const useGameSettings = (): GameSettings => {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
};

interface GameSettingsProviderProps {
  children: ReactNode;
}

export const GameSettingsProvider: React.FC<GameSettingsProviderProps> = ({ children }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('advanced');
  const [gameMode, setGameMode] = useState<GameMode>('explore');
  const [audience, setAudience] = useState<AudienceType>('undergraduate');
  const [gridSize, setGridSize] = useState<number>(7);

  return (
    <GameSettingsContext.Provider
      value={{
        difficulty,
        setDifficulty,
        gameMode,
        setGameMode,
        audience, 
        setAudience,
        gridSize,
        setGridSize
      }}
    >
      {children}
    </GameSettingsContext.Provider>
  );
};
