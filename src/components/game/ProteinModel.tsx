
import { PaeCell } from "@/types/game";

interface ProteinModelProps {
  paeGrid: PaeCell[][];
  selectedCell: PaeCell | null;
}

const ProteinModel = ({ paeGrid, selectedCell }: ProteinModelProps) => {
  // Function to get color based on confidence
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-game-high";
      case "medium":
        return "bg-game-medium";
      case "low":
        return "bg-game-low";
      default:
        return "bg-gray-300";
    }
  };

  // Function to check if a segment should be highlighted
  const isHighlighted = (rowIndex: number, colIndex: number) => {
    if (!selectedCell) return false;
    
    // Highlight the segment corresponding to the row of the selected cell
    return selectedCell.row === rowIndex || selectedCell.col === colIndex;
  };

  // Create a simplified protein representation
  // We'll create a "chain" of elements where each element corresponds to a row/column in the grid
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center h-80">
      <div className="relative w-60 h-60">
        {/* Create protein segments in a circular arrangement */}
        {paeGrid.length > 0 &&
          paeGrid.map((row, rowIndex) => {
            // Calculate position on a circle
            const angle = (rowIndex / paeGrid.length) * Math.PI * 2;
            const radius = 80; // Circle radius
            const centerX = 120; // Center X
            const centerY = 120; // Center Y
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            // Calculate confidence as average of the row
            const avgConfidence = row.reduce((acc, cell) => {
              if (cell.confidence === "high") return acc + 3;
              if (cell.confidence === "medium") return acc + 2;
              return acc + 1;
            }, 0) / row.length;
            
            let confidenceClass = "high";
            if (avgConfidence < 2) confidenceClass = "low";
            else if (avgConfidence < 2.5) confidenceClass = "medium";
            
            const highlighted = isHighlighted(rowIndex, -1);
            
            return (
              <div
                key={`segment-${rowIndex}`}
                className={`absolute w-10 h-10 rounded-full ${getConfidenceColor(confidenceClass)} ${
                  highlighted ? "ring-4 ring-game-highlight animate-pulse-highlight" : ""
                } shadow-md flex items-center justify-center transition-all duration-300`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <span className="text-xs font-bold text-white">{rowIndex + 1}</span>
              </div>
            );
          })}
        
        {/* Connect the segments with lines to form a chain */}
        <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
          {paeGrid.length > 0 &&
            paeGrid.map((_, index) => {
              if (index === paeGrid.length - 1) return null;
              
              // Calculate positions for current and next segment
              const angle1 = (index / paeGrid.length) * Math.PI * 2;
              const angle2 = ((index + 1) / paeGrid.length) * Math.PI * 2;
              const radius = 80;
              const centerX = 120;
              const centerY = 120;
              const x1 = centerX + radius * Math.cos(angle1);
              const y1 = centerY + radius * Math.sin(angle1);
              const x2 = centerX + radius * Math.cos(angle2);
              const y2 = centerY + radius * Math.sin(angle2);
              
              // Determine if this connection should be highlighted
              const highlighted =
                isHighlighted(index, -1) || isHighlighted(index + 1, -1);
              
              return (
                <line
                  key={`connection-${index}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={highlighted ? "#60a5fa" : "#888"}
                  strokeWidth={highlighted ? 3 : 2}
                  strokeDasharray={highlighted ? "" : "4 2"}
                />
              );
            })}
        </svg>
      </div>
    </div>
  );
};

export default ProteinModel;
