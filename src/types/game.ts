
// Define confidence level type
export type ConfidenceLevel = "high" | "medium" | "low";

// Define cell data type
export interface PaeCell {
  row: number;
  col: number;
  confidence: ConfidenceLevel;
}

// Export protein structure type - fixing the error in imports
export interface ProteinStructure {
  id: string;
  name: string;
  species: string;
  description: {
    elementary: string;
    highSchool: string;
    undergraduate: string;
  };
  function: {
    elementary: string;
    highSchool: string;
    undergraduate: string;
  };
  disease: {
    elementary: string | null;
    highSchool: string | null;
    undergraduate: string | null;
  };
  alphafoldLink: string;
  literature: string[];
  confidenceGuide: string;
  pdbId?: string;
  paeData: {
    full: number[][];
    domain?: number[][];
    interface?: number[][];
  };
  domains?: {
    name: string;
    start: number;
    end: number;
    description: string;
  }[];
}
