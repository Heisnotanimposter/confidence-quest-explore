
import { Achievement, PlayerStats, ProgressTracker } from "@/types/achievements";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Answer your first question correctly",
    icon: "🌟",
    condition: (stats) => stats.correctAnswers >= 1,
    points: 10,
    category: "learning"
  },
  {
    id: "curious_explorer",
    name: "Curious Explorer",
    description: "Explore 3 different proteins",
    icon: "🔍",
    condition: (stats) => stats.proteinsExplored.length >= 3,
    points: 25,
    category: "exploration"
  },
  {
    id: "streak_starter",
    name: "Streak Starter",
    description: "Get 5 questions correct in a row",
    icon: "⚡",
    condition: (stats) => stats.maxStreak >= 5,
    points: 20,
    category: "consistency"
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Complete your first protein quiz",
    icon: "📚",
    condition: (stats) => stats.quizzesCompleted >= 1,
    points: 15,
    category: "learning"
  },
  {
    id: "confidence_master",
    name: "Confidence Master",
    description: "Answer 25 questions correctly",
    icon: "🎯",
    condition: (stats) => stats.correctAnswers >= 25,
    points: 50,
    category: "mastery"
  },
  {
    id: "difficulty_climber",
    name: "Difficulty Climber",
    description: "Try all three difficulty levels",
    icon: "🏔️",
    condition: (stats) => stats.difficultiesCompleted.length >= 3,
    points: 30,
    category: "exploration"
  },
  {
    id: "protein_expert",
    name: "Protein Expert",
    description: "Explore 10 different proteins",
    icon: "🧬",
    condition: (stats) => stats.proteinsExplored.length >= 10,
    points: 75,
    category: "mastery"
  },
  {
    id: "quiz_champion",
    name: "Quiz Champion",
    description: "Complete 5 protein quizzes",
    icon: "🏆",
    condition: (stats) => stats.quizzesCompleted >= 5,
    points: 40,
    category: "mastery"
  }
];

export class AchievementService {
  private static readonly STORAGE_KEY = "protein_game_progress";

  static getProgress(): ProgressTracker {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      return {
        ...progress,
        achievements: ACHIEVEMENTS,
        stats: {
          ...progress.stats,
          lastPlayDate: progress.stats.lastPlayDate ? new Date(progress.stats.lastPlayDate) : undefined
        }
      };
    }

    return {
      level: 1,
      experience: 0,
      experienceToNext: 100,
      achievements: ACHIEVEMENTS,
      unlockedAchievements: [],
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        streak: 0,
        maxStreak: 0,
        proteinsExplored: [],
        difficultiesCompleted: [],
        gameModesUsed: [],
        quizzesCompleted: 0,
        totalPlayTime: 0
      }
    };
  }

  static saveProgress(progress: ProgressTracker): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  static updateStats(
    currentProgress: ProgressTracker,
    updates: Partial<PlayerStats>
  ): { progress: ProgressTracker; newAchievements: Achievement[] } {
    const newStats = { ...currentProgress.stats, ...updates };
    const newAchievements: Achievement[] = [];

    // Check for new achievements
    for (const achievement of ACHIEVEMENTS) {
      if (
        !currentProgress.unlockedAchievements.includes(achievement.id) &&
        achievement.condition(newStats)
      ) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date()
        });
      }
    }

    // Calculate experience gain
    const experienceGain = newAchievements.reduce((sum, ach) => sum + ach.points, 0);
    let newExperience = currentProgress.experience + experienceGain;
    let newLevel = currentProgress.level;
    let experienceToNext = currentProgress.experienceToNext;

    // Level up logic
    while (newExperience >= experienceToNext) {
      newExperience -= experienceToNext;
      newLevel++;
      experienceToNext = newLevel * 100; // Each level requires more XP
    }

    const updatedProgress: ProgressTracker = {
      ...currentProgress,
      level: newLevel,
      experience: newExperience,
      experienceToNext: experienceToNext - newExperience,
      unlockedAchievements: [
        ...currentProgress.unlockedAchievements,
        ...newAchievements.map(a => a.id)
      ],
      stats: newStats
    };

    this.saveProgress(updatedProgress);
    return { progress: updatedProgress, newAchievements };
  }
}
