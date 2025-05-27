
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Medal, Gift } from "lucide-react";
import { Achievement, ProgressTracker } from "@/types/achievements";
import { AchievementService } from "@/services/achievementService";

interface AchievementDisplayProps {
  newAchievements?: Achievement[];
  onDismiss?: () => void;
}

const AchievementDisplay = ({ newAchievements, onDismiss }: AchievementDisplayProps) => {
  const [progress, setProgress] = useState<ProgressTracker>(AchievementService.getProgress());
  const [showNewAchievements, setShowNewAchievements] = useState(false);

  useEffect(() => {
    if (newAchievements && newAchievements.length > 0) {
      setShowNewAchievements(true);
    }
  }, [newAchievements]);

  const handleDismissNew = () => {
    setShowNewAchievements(false);
    onDismiss?.();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <Star className="h-4 w-4" />;
      case 'exploration': return <Gift className="h-4 w-4" />;
      case 'mastery': return <Trophy className="h-4 w-4" />;
      case 'consistency': return <Medal className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-blue-100 text-blue-800';
      case 'exploration': return 'bg-green-100 text-green-800';
      case 'mastery': return 'bg-purple-100 text-purple-800';
      case 'consistency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // New Achievement Popup
  if (showNewAchievements && newAchievements && newAchievements.length > 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Trophy className="h-12 w-12 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl text-yellow-800">
              Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {newAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200"
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getCategoryColor(achievement.category)}>
                      {getCategoryIcon(achievement.category)}
                      <span className="ml-1 capitalize">{achievement.category}</span>
                    </Badge>
                    <span className="text-xs text-gray-500">+{achievement.points} XP</span>
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={handleDismissNew} className="w-full">
              Awesome! Continue Playing
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Progress Display
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Progress & Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Level {progress.level}</span>
            <span className="text-sm text-gray-500">
              {progress.experience} / {progress.experience + progress.experienceToNext} XP
            </span>
          </div>
          <Progress 
            value={(progress.experience / (progress.experience + progress.experienceToNext)) * 100} 
            className="h-2"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{progress.stats.correctAnswers}</div>
            <div className="text-xs text-blue-800">Correct Answers</div>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{progress.stats.maxStreak}</div>
            <div className="text-xs text-green-800">Best Streak</div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Recent Achievements</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {progress.achievements
              .filter(a => progress.unlockedAchievements.includes(a.id))
              .slice(-3)
              .map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
                >
                  <span>{achievement.icon}</span>
                  <span className="font-medium">{achievement.name}</span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementDisplay;
