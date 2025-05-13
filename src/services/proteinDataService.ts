
import { PaeMapType, ProteinStructure } from "@/types/protein";
import { convertPaeToConfidence, generatePaeGrid } from "@/utils/paeUtils";
import proteinDatabase from "@/data/proteinDatabase";

// Function to get all available proteins
export function getAvailableProteins(): { id: string, name: string }[] {
  return proteinDatabase.map(protein => ({
    id: protein.id,
    name: protein.name
  }));
}

// Function to get a specific protein by ID
export function getProteinById(id: string): ProteinStructure | undefined {
  return proteinDatabase.find(protein => protein.id === id);
}

// Re-export everything needed from the service
export { 
  convertPaeToConfidence,
  generatePaeGrid,
  proteinDatabase
};
export type { PaeMapType };
