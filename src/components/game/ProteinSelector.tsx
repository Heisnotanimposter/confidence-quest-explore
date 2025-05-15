import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableProteins, getAvailableSpecies, getProteinsBySpecies, Species } from "@/services/proteinDataService";
import { PaeMapType } from "@/services/proteinDataService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ProteinSelectorProps {
  selectedProtein: string;
  onProteinSelect: (proteinId: string) => void;
  selectedMapType: PaeMapType;
  onMapTypeSelect: (mapType: PaeMapType) => void;
}

const ProteinSelector = ({
  selectedProtein,
  onProteinSelect,
  selectedMapType,
  onMapTypeSelect
}: ProteinSelectorProps) => {
  const [selectedSpecies, setSelectedSpecies] = useState<Species>("Homo sapiens");
  const availableSpecies = getAvailableSpecies();
  const availableProteins = getProteinsBySpecies(selectedSpecies);

  // Update selected protein when species changes
  useEffect(() => {
    if (availableProteins.length > 0) {
      onProteinSelect(availableProteins[0].id);
    }
  }, [selectedSpecies]);

  const mapTypeDescriptions = {
    full: "Shows the entire protein's confidence map.",
    domain: "Focuses on a specific functional domain of the protein.",
    interface: "Shows confidence at the interfaces between different parts of the protein."
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Protein Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Select Species</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Choose the species to view its available proteins. Different species may have different protein structures and functions.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={selectedSpecies}
              onValueChange={(value) => setSelectedSpecies(value as Species)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a species" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecies.map((species) => (
                  <SelectItem key={species} value={species}>
                    {species}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Select Protein</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Choose a protein to explore its structure and confidence map. Each protein has unique characteristics and functions.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={selectedProtein}
              onValueChange={onProteinSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a protein" />
              </SelectTrigger>
              <SelectContent>
                {availableProteins.map((protein) => (
                  <SelectItem key={protein.id} value={protein.id}>
                    {protein.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">PAE Map Type</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>PAE (Predicted Aligned Error) maps show the confidence in protein structure predictions. Different views help understand various aspects of the protein.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={selectedMapType}
              onValueChange={(value) => onMapTypeSelect(value as PaeMapType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select map type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Protein</SelectItem>
                <SelectItem value="domain">Domain-Specific</SelectItem>
                <SelectItem value="interface">Subunit Interface</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500 mt-1">
              {mapTypeDescriptions[selectedMapType]}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProteinSelector;
