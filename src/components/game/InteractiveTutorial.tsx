
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Sparkles, Target, HelpCircle, Lightbulb } from "lucide-react";
import { GameMode, DifficultyLevel, AudienceType } from "./GameSettingsContext";

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  analogy?: string;
  funFact?: string;
  interaction?: {
    type: 'click' | 'select' | 'observe';
    target: string;
    description: string;
  };
}

interface InteractiveTutorialProps {
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  audience: AudienceType;
  onComplete: () => void;
  currentStep?: number;
}

const InteractiveTutorial = ({
  gameMode,
  difficulty,
  audience,
  onComplete,
  currentStep = 0
}: InteractiveTutorialProps) => {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const getTutorialSteps = (): TutorialStep[] => {
    const baseSteps: TutorialStep[] = [
      {
        id: "introduction",
        title: audience === 'elementary' ? "Welcome, Explorer! 🚀" : "Welcome to Confidence Quest!",
        content: audience === 'elementary' 
          ? "Proteins are like tiny machines inside your body. They help you breathe, think, grow, and fight off colds! Scientists use super-smart computers to figure out what these machines look like."
          : audience === 'highSchool'
          ? "Proteins are complex molecules that perform essential functions in every living thing. Scientists now use AI (like AlphaFold) to predict their 3D shapes — but some predictions are better than others."
          : "Protein structure prediction algorithms like AlphaFold2 model the 3D conformation of proteins from amino acid sequences. This game teaches you to interpret the confidence metrics of these predictions.",
        analogy: audience === 'elementary'
          ? "🏗️ Think of proteins like LEGO buildings — a computer tries to guess how all the pieces fit together, just from looking at the pieces!"
          : audience === 'highSchool'
          ? "🧩 Imagine solving a 3D jigsaw puzzle where you only have the piece shapes, but no picture on the box. That's what AI does with proteins!"
          : "🎯 Consider protein folding as navigating a vast energy landscape — AlphaFold uses attention mechanisms to predict residue-residue distances and angles.",
        funFact: audience === 'elementary'
          ? "💡 Fun fact: Your body has over 20,000 different types of proteins! Each one has a unique shape, like a snowflake."
          : audience === 'highSchool'
          ? "💡 Fun fact: AlphaFold predicted the structure of nearly every known protein — over 200 million structures!"
          : "💡 The AlphaFold Protein Structure Database contains predicted structures for ~214 million proteins, covering nearly all cataloged proteins known to science."
      },
      {
        id: "pae_explanation",
        title: audience === 'elementary' ? "Reading the Color Map 🎨" : "Understanding the Confidence Map",
        content: audience === 'elementary'
          ? "See that colorful grid? Each colored square tells you how sure the computer is about that part of the protein. Green = very sure! Yellow = kinda sure. Red = just guessing."
          : audience === 'highSchool'
          ? "The Confidence Map (scientists call it a 'PAE map') uses colors to show how reliable each part of the prediction is. Green areas are highly confident, yellow areas have some uncertainty, and red areas are less reliable."
          : "PAE (Predicted Aligned Error) values represent the expected position error in Ångströms between residue pairs. Low PAE (green) indicates high confidence in the relative positions of residue pairs.",
        analogy: audience === 'elementary'
          ? "🚦 It's like a traffic light! Green = go ahead and trust this. Yellow = maybe, be careful. Red = stop and question it!"
          : audience === 'highSchool'
          ? "🌤️ It's like a weather forecast. \"90% chance of rain\" = green (very confident). \"50% chance\" = yellow (uncertain). \"We have no idea\" = red."
          : "📊 Think of it as a distance error matrix — diagonal elements represent self-confidence, while off-diagonal elements capture the certainty of spatial relationships between distant residues.",
        funFact: audience === 'elementary'
          ? "💡 Fun fact: The computer can be 99% sure about some parts, and only 10% sure about other parts — all in the same protein!"
          : "💡 Generally, structured regions (alpha helices, beta sheets) show high confidence, while flexible loops and disordered regions show lower confidence."
      },
      {
        id: "interaction_guide",
        title: audience === 'elementary' ? "Your Turn! 👆" : "How to Explore",
        content: audience === 'elementary'
          ? "Now it's your turn! Click on any colored square in the map. A question will pop up — try to answer it using what you just learned about the colors!"
          : "Click on any cell in the Confidence Map to learn about that region. The 3D model will highlight the corresponding area, and you'll get a question to test your understanding.",
        interaction: {
          type: 'click',
          target: 'pae-cell',
          description: audience === 'elementary' 
            ? "Try clicking on a green square first — it should be the easiest to answer! 🟢"
            : "Click on cells of different colors to see how the questions change based on confidence level."
        },
        funFact: audience === 'elementary'
          ? "💡 Fun fact: Real scientists click on these maps every day to check if the computer did a good job predicting the protein shape!"
          : "💡 Researchers use PAE maps to identify domain boundaries and assess the reliability of predicted protein-protein interactions."
      },
      {
        id: "interpretation",
        title: audience === 'elementary' ? "You're a Scientist Now! 🧑‍🔬" : "Interpreting Your Results",
        content: audience === 'elementary'
          ? "Great job! Every time you answer a question, you're learning what real scientists know. Keep exploring different proteins — each one has its own story!"
          : audience === 'highSchool'
          ? "As you answer questions, notice how different proteins have different confidence patterns. Well-folded proteins tend to be greener, while proteins with flexible regions show more red and yellow."
          : "Pay attention to the patterns in the PAE map: block-diagonal structure indicates well-folded domains, off-diagonal low-confidence regions suggest uncertain inter-domain arrangements, and uniform low confidence may indicate intrinsically disordered regions.",
        funFact: audience === 'elementary'
          ? "💡 Fun fact: Some proteins are so important that when they break, they can cause diseases. Learning about confidence helps scientists design medicines!"
          : "💡 Understanding prediction confidence is crucial for drug design — high-confidence regions are better targets for structure-based drug design."
      }
    ];

    if (difficulty === 'advanced') {
      baseSteps.push({
        id: "advanced_concepts",
        title: "Advanced: Domain Analysis",
        content: "Advanced mode lets you explore domain interactions, allosteric networks, and the relationship between prediction confidence and functional regions. Try switching between 'Full Protein', 'Specific Region', and 'Connection Points' views.",
        analogy: "🔬 Like reading a satellite weather map with pressure systems — multiple layers of data reveal deeper patterns about the protein's architecture.",
        funFact: "💡 AlphaFold-Multimer extends these concepts to protein complexes, where inter-chain PAE is particularly informative for assessing interaction confidence."
      });
    }

    return baseSteps;
  };

  const steps = getTutorialSteps();
  const progress = ((activeStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, activeStep]);
      setActiveStep(activeStep + 1);
    } else {
      setCompletedSteps([...completedSteps, activeStep]);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (gameMode !== 'tutorial') return null;

  const currentStepData = steps[activeStep];

  return (
    <Card className="w-full max-w-4xl mx-auto mb-6 glass-card border-0 shadow-lg animate-fade-in-up">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-game-teal" />
            <CardTitle className="text-lg text-gradient">Guided Tour</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {audience === 'elementary' ? '🧒 Easy mode' : audience === 'highSchool' ? '🧑‍🔬 Standard' : '🎓 Advanced'}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-muted-foreground">
            Skip →
          </Button>
        </div>
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {activeStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground/90">
            {currentStepData.title}
          </h3>
          
          <p className="text-foreground/70 leading-relaxed">
            {currentStepData.content}
          </p>

          {currentStepData.analogy && (
            <div className="p-4 bg-amber-50/80 border-l-3 border-amber-400 rounded-r-xl">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800 text-sm mb-1">Analogy</p>
                  <p className="text-amber-700 text-sm">{currentStepData.analogy}</p>
                </div>
              </div>
            </div>
          )}

          {currentStepData.funFact && (
            <div className="p-4 bg-purple-50/80 border-l-3 border-purple-400 rounded-r-xl">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-purple-700 text-sm">{currentStepData.funFact}</p>
              </div>
            </div>
          )}

          {currentStepData.interaction && (
            <div className="p-4 bg-teal-50/80 border-l-3 border-game-teal rounded-r-xl">
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-game-teal mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-teal-800 text-sm mb-1">Try This!</p>
                  <p className="text-teal-700 text-sm">{currentStepData.interaction.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeStep === 0}
            size="sm"
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeStep
                    ? 'bg-game-teal w-6'
                    : completedSteps.includes(index)
                    ? 'bg-game-high'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            size="sm"
            className="gap-1"
          >
            {activeStep === steps.length - 1 ? "Let's Go!" : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveTutorial;
