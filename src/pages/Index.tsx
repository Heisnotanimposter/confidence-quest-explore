
import { useState, useEffect } from "react";
import ConfidenceGame from "@/components/game/ConfidenceGame";
import { GameSettingsProvider } from "@/components/game/GameSettingsContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-game-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Confidence Challenge</h1>
          <p className="text-lg text-gray-700">
            Learn about protein structure prediction confidence with real AlphaFold data!
          </p>
        </header>
        
        <main>
          <GameSettingsProvider>
            <ConfidenceGame />
          </GameSettingsProvider>
        </main>
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Educational game for understanding PAE Viewer concepts using real AlphaFold data</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
