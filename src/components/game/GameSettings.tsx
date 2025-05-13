
import { useGameSettings } from './GameSettingsContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3x3, BookOpen, Target, Users } from "lucide-react";

const GameSettings = () => {
  const {
    difficulty, 
    setDifficulty,
    gameMode,
    setGameMode,
    audience,
    setAudience,
    gridSize,
    setGridSize
  } = useGameSettings();

  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-bold text-center">Game Settings</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target size={18} />
              <label className="text-sm font-medium">Difficulty</label>
            </div>
            <Select
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <label className="text-sm font-medium">Game Mode</label>
            </div>
            <Select
              value={gameMode}
              onValueChange={(value) => setGameMode(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="challenge">Challenge</SelectItem>
                <SelectItem value="explore">Explore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <label className="text-sm font-medium">Audience</label>
            </div>
            <Select
              value={audience}
              onValueChange={(value) => setAudience(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">Elementary</SelectItem>
                <SelectItem value="highSchool">High School</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Grid3x3 size={18} />
              <label className="text-sm font-medium">Grid Size</label>
            </div>
            <Select
              value={gridSize.toString()}
              onValueChange={(value) => setGridSize(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select grid size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3×3</SelectItem>
                <SelectItem value="5">5×5</SelectItem>
                <SelectItem value="7">7×7</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSettings;
