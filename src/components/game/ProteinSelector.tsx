
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableProteins } from "@/services/proteinDataService";
import { PaeMapType } from "@/types/protein";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const availableProteins = getAvailableProteins();

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Real Protein Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Protein</label>
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
            <label className="text-sm font-medium">PAE Map Type</label>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProteinSelector;
