
import { PaeCell } from "./ConfidenceGame";

interface PaeGridProps {
  grid: PaeCell[][];
  onCellClick: (cell: PaeCell) => void;
  selectedCell: PaeCell | null;
}

const PaeGrid = ({ grid, onCellClick, selectedCell }: PaeGridProps) => {
  // Function to get the CSS class for a cell based on its confidence level
  const getCellClass = (cell: PaeCell) => {
    // Determine cell size based on grid size
    const cellSizeClass = grid.length <= 5 
      ? "w-12 h-12 md:w-16 md:h-16" 
      : "w-8 h-8 md:w-12 md:h-12";
    
    let baseClass = `${cellSizeClass} border border-gray-300 transition-all duration-300 cursor-pointer hover:opacity-80`;
    
    // Add confidence level color
    if (cell.confidence === "high") {
      baseClass += " bg-game-high";
    } else if (cell.confidence === "medium") {
      baseClass += " bg-game-medium";
    } else {
      baseClass += " bg-game-low";
    }
    
    // Add highlight if this is the selected cell
    if (
      selectedCell && 
      selectedCell.row === cell.row && 
      selectedCell.col === cell.col
    ) {
      baseClass += " ring-4 ring-game-highlight scale-105";
    }
    
    return baseClass;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-center">
        <table>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {row.map((cell, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`}>
                    <div
                      className={getCellClass(cell)}
                      onClick={() => onCellClick(cell)}
                      title={`Confidence: ${cell.confidence}`}
                    >
                      {/* Cell content could go here if needed */}
                      {grid.length > 5 && (
                        <span className="text-xs text-white font-bold opacity-70">
                          {rowIndex + 1},{colIndex + 1}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-game-high mr-1"></div>
          <span className="text-sm">High confidence</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-game-medium mr-1"></div>
          <span className="text-sm">Medium confidence</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-game-low mr-1"></div>
          <span className="text-sm">Low confidence</span>
        </div>
      </div>
    </div>
  );
};

export default PaeGrid;
