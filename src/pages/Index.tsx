//index.tsx
import { useState, useEffect } from "react";
import ConfidenceGame from "@/components/game/ConfidenceGame";
import { GameSettingsProvider } from "@/components/game/GameSettingsContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-game-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Gemini Alphafold</h1>
          <p className="text-lg text-gray-700">
            Learn about protein structure prediction confidence with real AlphaFold data!
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
            <h3 className="font-bold text-lg mb-2">How to Use</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click on any colored cell in the PAE map on the left.</li>
              <li>Notice how the corresponding part of the protein model highlights.</li>
              <li>Answer the question about protein confidence that appears below.</li>
              <li>Green cells indicate high confidence, yellow is medium, and red is low.</li>
            </ol>
          </div>
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
