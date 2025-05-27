
import { useState, useEffect } from "react";
import { useGameState } from "./useGameState";
import { AchievementService } from "@/services/achievementService";
import { Achievement, ProgressTracker } from "@/types/achievements";
import { DifficultyLevel, GameMode, AudienceType } from "@/components/game/GameSettingsContext";
import { toast } from "sonner";

export function useGameStateWithAchievements(
  difficulty: DifficultyLevel,
  gameMode: GameMode,
  audience: AudienceType,
  gridSize: number
) {
  const gameState = useGameState(difficulty, gameMode, audience, gridSize);
  const [progress, setProgress] = useState<ProgressTracker>(AchievementService.getProgress());
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // Track achievements when game state changes
  useEffect(() => {
    const currentStats = progress.stats;
    
    // Update stats based on game state
    const updatedStats = {
      ...currentStats,
      totalQuestions: gameState.attempts,
      correctAnswers: gameState.score / (difficulty === 'advanced' ? 3 : difficulty === 'intermediate' ? 2 : 1),
      proteinsExplored: currentStats.proteinsExplored.includes(gameState.selectedProtein) 
        ? currentStats.proteinsExplored 
        : [...currentStats.proteinsExplored, gameState.selectedProtein],
      difficultiesCompleted: currentStats.difficultiesCompleted.includes(difficulty)
        ? currentStats.difficultiesCompleted
        : [...currentStats.difficultiesCompleted, difficulty],
      gameModesUsed: currentStats.gameModesUsed.includes(gameMode)
        ? currentStats.gameModesUsed
        : [...currentStats.gameModesUsed, gameMode],
      lastPlayDate: new Date()
    };

    const { progress: newProgress, newAchievements: achievements } = AchievementService.updateStats(
      progress,
      updatedStats
    );

    setProgress(newProgress);
    
    if (achievements.length > 0) {
      setNewAchievements(achievements);
      // Show toast for each new achievement
      achievements.forEach(achievement => {
        toast.success(`🏆 Achievement Unlocked: ${achievement.name}!`, {
          description: achievement.description,
          duration: 5000,
        });
      });
    }
  }, [gameState.score, gameState.attempts, gameState.selectedProtein, difficulty, gameMode]);

  const dismissNewAchievements = () => {
    setNewAchievements([]);
  };

  return {
    ...gameState,
    progress,
    newAchievements,
    dismissNewAchievements
  };
}
