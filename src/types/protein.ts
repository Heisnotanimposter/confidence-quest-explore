
import { ConfidenceLevel, PaeCell } from "@/types/game";

// Define protein structure types for different visualizations
export type PaeMapType = 'full' | 'domain' | 'interface';

// Define domain structure
export interface ProteinDomain {
  name: string;
  start: number;
  end: number;
  description: string;
}

// Define protein description structure for different educational levels
export interface ProteinDescription {
  elementary: string;
  highSchool: string;
  undergraduate: string;
}

// Define protein data structure
export interface ProteinStructure {
  id: string;
  name: string;
  description: ProteinDescription;
  function: ProteinDescription;
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
  domains?: ProteinDomain[];
}
