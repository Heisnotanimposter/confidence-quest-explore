
import { ConfidenceLevel, PaeCell } from "@/types/game";
import { ProteinStructure, PaeMapType } from "@/types/protein";
import proteinDatabase from "@/data/proteinDatabase";

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
): { grid: PaeCell[][], proteinData: ProteinStructure } {
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
