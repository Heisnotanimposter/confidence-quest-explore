
// Define confidence level type
export type ConfidenceLevel = "high" | "medium" | "low";

// Define cell data type
export interface PaeCell {
  row: number;
  col: number;
  confidence: ConfidenceLevel;
}
