
import { PaeCell } from "@/types/game";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface PaeGridProps {
  grid: PaeCell[][];
  onCellClick: (cell: PaeCell) => void;
  selectedCell: PaeCell | null;
}

const confidenceLabels = {
  high: "AI is very sure about this part",
  medium: "AI is somewhat sure here",
  low: "AI is mostly guessing here"
};

const PaeGrid = ({ grid, onCellClick, selectedCell }: PaeGridProps) => {
  // Function to get the CSS class for a cell based on its confidence level
  const getCellClass = (cell: PaeCell) => {
    // Determine cell size based on grid size
    const cellSizeClass = grid.length <= 5 
      ? "w-12 h-12 md:w-14 md:h-14" 
      : "w-8 h-8 md:w-11 md:h-11";
    
    let baseClass = `${cellSizeClass} rounded-lg border border-white/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-md relative`;
    
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
      baseClass += " ring-3 ring-game-highlight ring-offset-2 scale-110 shadow-lg z-10";
    }
    
    return baseClass;
  };

  // Check if a cell should show the "start here" pulse
  const isFirstInteractableCell = (cell: PaeCell) => {
    return !selectedCell && cell.row === Math.floor(grid.length / 2) && cell.col === Math.floor(grid.length / 2);
  };

  return (
    <div className="glass-card p-5 rounded-2xl">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-foreground/90">Confidence Map</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">Scientists call this a <strong>PAE map</strong>. Each colored square shows how confident AI is about a part of the protein's shape. Click any square to learn more!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex justify-center">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${grid.length}, 1fr)` }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <TooltipProvider key={`cell-${rowIndex}-${colIndex}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`${getCellClass(cell)} ${isFirstInteractableCell(cell) ? 'animate-pulse-highlight' : ''}`}
                      onClick={() => onCellClick(cell)}
                      aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}: ${confidenceLabels[cell.confidence]}`}
                    >
                      {isFirstInteractableCell(cell) && (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-game-teal whitespace-nowrap animate-bounce">
                          Click me! 👆
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p>{confidenceLabels[cell.confidence]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-5 flex justify-center gap-5">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-game-high shadow-sm"></div>
          <span className="text-xs text-foreground/70">🟢 Very sure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-game-medium shadow-sm"></div>
          <span className="text-xs text-foreground/70">🟡 Somewhat sure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-game-low shadow-sm"></div>
          <span className="text-xs text-foreground/70">🔴 Guessing</span>
        </div>
      </div>
    </div>
  );
};

export default PaeGrid;
