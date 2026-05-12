import { useGameSettings } from './GameSettingsContext';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Compass, Brain, Grid3x3 } from "lucide-react";

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
    <Card className="mb-6 glass-card border-0 shadow-md">
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold text-center text-gradient">Customize Your Experience</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-game-coral" />
              <label className="text-sm font-medium text-foreground/80">Challenge Level</label>
            </div>
            <Select
              value={difficulty}
              onValueChange={(value) => setDifficulty(value as any)}
            >
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="How hard?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">🌱 Easy</SelectItem>
                <SelectItem value="intermediate">⚡ Medium</SelectItem>
                <SelectItem value="advanced">🔥 Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-game-teal" />
              <label className="text-sm font-medium text-foreground/80">How to Learn</label>
            </div>
            <Select
              value={gameMode}
              onValueChange={(value) => setGameMode(value as any)}
            >
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Choose your path" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tutorial">🗺️ Guided Tour</SelectItem>
                <SelectItem value="challenge">🎯 Quiz Me!</SelectItem>
                <SelectItem value="explore">🔍 Free Explore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-purple-500" />
              <label className="text-sm font-medium text-foreground/80">Explain it like I'm...</label>
            </div>
            <Select
              value={audience}
              onValueChange={(value) => setAudience(value as any)}
            >
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Who are you?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">🧒 10 years old</SelectItem>
                <SelectItem value="highSchool">🧑‍🔬 In biology class</SelectItem>
                <SelectItem value="undergraduate">🎓 A science major</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Grid3x3 size={16} className="text-blue-500" />
              <label className="text-sm font-medium text-foreground/80">Detail Level</label>
            </div>
            <Select
              value={gridSize.toString()}
              onValueChange={(value) => setGridSize(parseInt(value))}
            >
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="How much detail?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Simple (3×3)</SelectItem>
                <SelectItem value="5">Standard (5×5)</SelectItem>
                <SelectItem value="7">Detailed (7×7)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSettings;
