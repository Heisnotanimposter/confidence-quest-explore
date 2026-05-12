//index.tsx
import { useState } from "react";
import ConfidenceGame from "@/components/game/ConfidenceGame";
import { GameSettingsProvider } from "@/components/game/GameSettingsContext";
import { ChevronDown, ChevronUp, Dna, Sparkles, Brain } from "lucide-react";

const Index = () => {
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-6 md:pt-12 md:pb-8">
          {/* Floating decorative elements */}
          <div className="absolute top-4 left-8 opacity-20 animate-float">
            <Dna size={40} className="text-game-teal" />
          </div>
          <div className="absolute top-12 right-12 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
            <Brain size={36} className="text-game-coral" />
          </div>
          <div className="absolute bottom-4 left-1/4 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
            <Sparkles size={28} className="text-purple-400" />
          </div>

          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-game-teal/10 text-game-teal px-4 py-1.5 rounded-full text-sm font-medium mb-4 animate-fade-in-up">
              <Sparkles size={14} />
              Interactive Learning Experience
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="text-gradient">Confidence Quest</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover how AI predicts the building blocks of life — 
              and how <span className="font-semibold text-game-teal">confident</span> it really is
            </p>

            {/* What is this? Expandable */}
            <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => setShowExplainer(!showExplainer)}
                className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-game-teal transition-colors duration-300 mb-4"
              >
                {showExplainer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showExplainer ? "Got it!" : "What is this? 🤔"}
              </button>

              {showExplainer && (
                <div className="glass-card rounded-2xl p-6 text-left space-y-4 animate-slide-up">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌤️</span>
                    <div>
                      <p className="font-medium text-foreground/90">Think about weather forecasts</p>
                      <p className="text-sm text-foreground/60">
                        When the forecast says "90% chance of rain" — that's <strong className="text-game-teal">high confidence</strong>. 
                        "50% chance?" That's <strong className="text-amber-500">medium confidence</strong>.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🧬</span>
                    <div>
                      <p className="font-medium text-foreground/90">AI does the same with proteins</p>
                      <p className="text-sm text-foreground/60">
                        AI predicts the 3D shapes of proteins (the tiny machines inside your body). 
                        Some parts it's very sure about, other parts... not so much.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎮</span>
                    <div>
                      <p className="font-medium text-foreground/90">This game teaches you how to read those predictions</p>
                      <p className="text-sm text-foreground/60">
                        Click on the colorful grid below, answer fun questions, and you'll quickly understand 
                        something that even many scientists are still learning!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Game Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <GameSettingsProvider>
          <ConfidenceGame />
        </GameSettingsProvider>
      </main>
      
      <footer className="text-center py-6 text-sm text-foreground/40">
        <p>Built with ❤️ to make science accessible to everyone</p>
        <p className="text-xs mt-1">Powered by AlphaFold data & Gemini AI</p>
      </footer>
    </div>
  );
};

export default Index;
