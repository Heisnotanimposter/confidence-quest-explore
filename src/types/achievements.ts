
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: PlayerStats) => boolean;
  unlockedAt?: Date;
  points: number;
  category: 'learning' | 'exploration' | 'mastery' | 'consistency';
}

export interface PlayerStats {
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
  maxStreak: number;
  proteinsExplored: string[];
  difficultiesCompleted: string[];
  gameModesUsed: string[];
  quizzesCompleted: number;
  totalPlayTime: number;
  lastPlayDate?: Date;
}

export interface ProgressTracker {
  level: number;
  experience: number;
  experienceToNext: number;
  achievements: Achievement[];
  unlockedAchievements: string[];
  stats: PlayerStats;
}
