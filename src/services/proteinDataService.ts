
import { ConfidenceLevel } from "@/components/game/ConfidenceGame";

// Define protein structure types for different visualizations
export type PaeMapType = 'full' | 'domain' | 'interface';

// Define protein data structure
export interface ProteinStructure {
  id: string;
  name: string;
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

// Sample protein data (in real implementation, this would come from an API or larger dataset)
const proteinDatabase: ProteinStructure[] = [
  {
    id: "p1",
    name: "Hemoglobin",
    description: {
      elementary: "Hemoglobin is a protein in your red blood cells that carries oxygen throughout your body.",
      highSchool: "Hemoglobin is a protein in red blood cells that binds to oxygen in the lungs and delivers it to tissues throughout the body.",
      undergraduate: "Hemoglobin is a tetrameric protein composed of two alpha and two beta subunits, each containing a heme group that can bind to oxygen, facilitating oxygen transport from the lungs to tissues."
    },
    function: {
      elementary: "It helps bring oxygen from your lungs to the rest of your body.",
      highSchool: "It binds oxygen in the lungs and releases it in tissues that need oxygen.",
      undergraduate: "It exhibits cooperative binding of oxygen, with the binding of one oxygen molecule increasing the affinity for subsequent oxygen molecules."
    },
    disease: {
      elementary: "If it doesn't work right, you might not get enough oxygen and feel tired.",
      highSchool: "Mutations can cause sickle cell anemia, where red blood cells become misshapen.",
      undergraduate: "Point mutations in the beta-globin gene can lead to hemoglobinopathies such as sickle cell anemia and thalassemias."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P69905",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/12788409/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3543206/"
    ],
    confidenceGuide: "High confidence indicates well-structured regions, while low confidence may suggest flexibility or uncertainty.",
    pdbId: "1HHO",
    paeData: {
      full: Array(7).fill(Array(7).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Simulate PAE data with higher values (lower confidence) between domains
          if ((i < 3 && j >= 3) || (i >= 3 && j < 3)) {
            return Math.floor(Math.random() * 15) + 10; // Higher PAE values
          }
          return Math.floor(Math.random() * 10); // Lower PAE values
        })
      )
    },
    domains: [
      {
        name: "Alpha subunit",
        start: 0,
        end: 2,
        description: "Forms part of the oxygen-binding pocket."
      },
      {
        name: "Beta subunit",
        start: 3,
        end: 6,
        description: "Contains the heme group for oxygen binding."
      }
    ]
  },
  {
    id: "p2",
    name: "Insulin",
    description: {
      elementary: "Insulin is a protein that helps your body use sugar for energy.",
      highSchool: "Insulin is a hormone that regulates blood glucose levels by facilitating glucose uptake into cells.",
      undergraduate: "Insulin is a peptide hormone produced by beta cells in the pancreatic islets, regulating carbohydrate and fat metabolism by promoting glucose uptake from the bloodstream into skeletal muscle and fat tissue."
    },
    function: {
      elementary: "It helps sugar from food get into your cells to give you energy.",
      highSchool: "It signals cells to take in glucose from the bloodstream and store excess as glycogen.",
      undergraduate: "It activates glucose transporters (primarily GLUT4) via a signaling cascade involving the insulin receptor, IRS proteins, PI3K, and Akt."
    },
    disease: {
      elementary: "If your body can't make enough insulin, you might get diabetes.",
      highSchool: "Insufficient insulin production or insulin resistance leads to diabetes mellitus.",
      undergraduate: "Autoimmune destruction of pancreatic beta cells leads to type 1 diabetes, while insulin resistance characterizes type 2 diabetes. Mutations in the insulin gene can cause neonatal diabetes."
    },
    alphafoldLink: "https://alphafold.ebi.ac.uk/entry/P01308",
    literature: [
      "https://pubmed.ncbi.nlm.nih.gov/3528824/",
      "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6826525/"
    ],
    confidenceGuide: "The disulfide bonds in insulin are reflected as high-confidence regions in the PAE map.",
    pdbId: "4INS",
    paeData: {
      full: Array(5).fill(Array(5).fill(0)).map((row, i) => 
        row.map((_, j) => {
          // Higher confidence in the core
          if (i === j || Math.abs(i - j) <= 1) {
            return Math.floor(Math.random() * 5); // Higher confidence (lower PAE)
          }
          return Math.floor(Math.random() * 10) + 5; // Lower confidence (higher PAE)
        })
      )
    },
    domains: [
      {
        name: "A chain",
        start: 0,
        end: 2,
        description: "Connected to B chain by disulfide bonds."
      },
      {
        name: "B chain",
        start: 3,
        end: 4,
        description: "Forms the functional unit with A chain."
      }
    ]
  }
];

// Convert PAE data to confidence levels
export function convertPaeToConfidence(paeValue: number): ConfidenceLevel {
  if (paeValue < 5) {
    return "high";
  } else if (paeValue < 15) {
    return "medium";
  } else {
    return "low";
  }
}

// Function to generate a grid based on the selected protein and PAE map type
export function generatePaeGrid(
  proteinId: string,
  mapType: PaeMapType = 'full',
  gridSize: number = 5
): { grid: any[][], proteinData: ProteinStructure } {
  // Find the protein
  const protein = proteinDatabase.find(p => p.id === proteinId) || proteinDatabase[0];
  
  // Get appropriate PAE data based on map type
  const paeData = protein.paeData[mapType] || protein.paeData.full;
  
  // Convert PAE data to confidence grid
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      // Map i,j to paeData indices based on available data
      const paeRow = Math.floor(i * paeData.length / gridSize);
      const paeCol = Math.floor(j * paeData[0].length / gridSize);
      
      const paeValue = paeData[paeRow][paeCol];
      const confidence = convertPaeToConfidence(paeValue);
      
      row.push({
        row: i,
        col: j,
        confidence
      });
    }
    grid.push(row);
  }
  
  return { grid, proteinData: protein };
}

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
