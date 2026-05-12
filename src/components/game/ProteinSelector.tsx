import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableSpecies, getProteinsBySpecies, Species, getProteinById } from "@/services/proteinDataService";
import { PaeMapType } from "@/services/proteinDataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useGameSettings } from "./GameSettingsContext";

interface ProteinSelectorProps {
  selectedProtein: string;
  onProteinSelect: (proteinId: string) => void;
  selectedMapType: PaeMapType;
  onMapTypeSelect: (mapType: PaeMapType) => void;
}

// Friendly names and metadata for proteins
const proteinMeta: Record<string, { emoji: string; hook: string; whyMatters: string; friendlySpecies: string; difficulty: string }> = {
  p1: { emoji: "🩸", hook: "The oxygen delivery truck in your blood", whyMatters: "Mutations cause sickle cell disease", friendlySpecies: "Human", difficulty: "beginner" },
  p2: { emoji: "💉", hook: "The sugar traffic controller", whyMatters: "When it breaks → diabetes", friendlySpecies: "Human", difficulty: "beginner" },
  p3: { emoji: "💪", hook: "Muscle's personal oxygen storage", whyMatters: "Keeps muscles working during exercise", friendlySpecies: "Human", difficulty: "beginner" },
  p5: { emoji: "🛡️", hook: "The guardian against cancer", whyMatters: "Mutated in 50% of all cancers", friendlySpecies: "Human", difficulty: "intermediate" },
  p6: { emoji: "🧬", hook: "DNA's repair crew chief", whyMatters: "Mutations increase breast cancer risk", friendlySpecies: "Human", difficulty: "advanced" },
  p7: { emoji: "⏳", hook: "The aging clock controller", whyMatters: "Helps us understand why we age", friendlySpecies: "Baker's yeast", difficulty: "intermediate" },
  p8: { emoji: "🥛", hook: "The milk sugar breaker", whyMatters: "Fundamental tool in genetics labs", friendlySpecies: "E. coli", difficulty: "intermediate" },
  p9: { emoji: "📡", hook: "Bacteria's DNA antenna", whyMatters: "How bacteria share superpowers", friendlySpecies: "Soil bacteria", difficulty: "advanced" },
  p10: { emoji: "🏰", hook: "The fortress builder", whyMatters: "How bacteria survive tough times", friendlySpecies: "Soil bacteria", difficulty: "advanced" },
  p11: { emoji: "🦟", hook: "Malaria's disguise master", whyMatters: "Key target for malaria vaccines", friendlySpecies: "Malaria parasite", difficulty: "advanced" },
  p12: { emoji: "🪰", hook: "The immune system's doorbell", whyMatters: "Inspired human immunity research", friendlySpecies: "Fruit fly", difficulty: "intermediate" },
  p13: { emoji: "🕷️", hook: "Lyme disease's surface coat", whyMatters: "Target for Lyme disease vaccine", friendlySpecies: "Lyme bacteria", difficulty: "advanced" },
  p14: { emoji: "🦠", hook: "The stomach troublemaker", whyMatters: "Linked to stomach ulcers & cancer", friendlySpecies: "H. pylori", difficulty: "advanced" },
  p15: { emoji: "🐭", hook: "Cancer guardian (mouse version)", whyMatters: "Helps model human cancer", friendlySpecies: "Mouse", difficulty: "intermediate" },
};

// Friendly species names
const friendlySpeciesNames: Record<string, string> = {
  "Homo sapiens": "🧑 Human",
  "Saccharomyces cerevisiae": "🍞 Baker's Yeast",
  "Bacillus subtilis": "🌍 Soil Bacteria",
  "Plasmodium falciparum": "🦟 Malaria Parasite",
  "Drosophila melanogaster": "🪰 Fruit Fly",
  "Borreliella burgdorferi B31": "🕷️ Lyme Bacteria",
  "Helicobacter pylori 26695": "🦠 H. pylori",
  "Mus musculus": "🐭 Mouse",
  "Escherichia coli K12 MG1655": "🧫 E. coli",
  "Aequorea victoria": "✨ Jellyfish",
};

const ProteinSelector = ({
  selectedProtein,
  onProteinSelect,
  selectedMapType,
  onMapTypeSelect
}: ProteinSelectorProps) => {
  const [selectedSpecies, setSelectedSpecies] = useState<Species>("Homo sapiens");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const { audience } = useGameSettings();
  const availableSpecies = getAvailableSpecies();
  const availableProteins = getProteinsBySpecies(selectedSpecies);

  // Update selected protein when species changes
  useEffect(() => {
    if (availableProteins.length > 0) {
      onProteinSelect(availableProteins[0].id);
    }
  }, [selectedSpecies]);

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case "beginner": return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">🌱 Easy</span>;
      case "intermediate": return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⚡ Medium</span>;
      case "advanced": return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">🔥 Hard</span>;
      default: return null;
    }
  };

  return (
    <Card className="mb-4 glass-card border-0 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gradient">🧬 Choose Your Protein</CardTitle>
        <p className="text-sm text-muted-foreground">Pick a protein to explore — each one has a unique story!</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Species Selector */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground/80">From which creature?</label>
            <Select
              value={selectedSpecies}
              onValueChange={(value) => setSelectedSpecies(value as Species)}
            >
              <SelectTrigger className="bg-white/80">
                <SelectValue placeholder="Choose a creature" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecies.map((species) => (
                  <SelectItem key={species} value={species}>
                    {friendlySpeciesNames[species] || species}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Protein Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableProteins.map((protein) => {
            const meta = proteinMeta[protein.id];
            const isSelected = selectedProtein === protein.id;
            
            return (
              <button
                key={protein.id}
                onClick={() => onProteinSelect(protein.id)}
                className={`protein-card text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                  isSelected 
                    ? 'border-game-teal bg-game-teal/5 shadow-lg glow-teal' 
                    : 'border-transparent bg-white/60 hover:bg-white/90 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{meta?.emoji || "🧬"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{protein.name}</span>
                      {meta && getDifficultyBadge(meta.difficulty)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {meta?.hook || "A fascinating protein to explore"}
                    </p>
                    {meta?.whyMatters && (
                      <p className="text-xs text-game-coral/80 mt-1 font-medium">
                        💡 {meta.whyMatters}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Advanced options (PAE Map Type) - hidden for beginners */}
        {audience !== 'elementary' && (
          <div className="pt-2">
            <button 
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ChevronDown size={12} className={`transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`} />
              {showAdvancedOptions ? 'Hide advanced options' : 'Show map type options'}
            </button>
            
            {showAdvancedOptions && (
              <div className="mt-3 p-3 bg-white/50 rounded-lg animate-slide-up">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm font-medium text-foreground/80">Confidence Map View</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Scientists call this a "PAE map" — it shows how confident AI is about different parts of the protein structure.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={selectedMapType}
                  onValueChange={(value) => onMapTypeSelect(value as PaeMapType)}
                >
                  <SelectTrigger className="bg-white/80">
                    <SelectValue placeholder="Select map view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">🗺️ Full Protein</SelectItem>
                    <SelectItem value="domain">🔍 Specific Region</SelectItem>
                    <SelectItem value="interface">🤝 Connection Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProteinSelector;
