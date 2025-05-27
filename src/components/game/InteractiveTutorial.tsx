
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, BookOpen, Target, HelpCircle } from "lucide-react";
import { GameMode, DifficultyLevel, AudienceType } from "./GameSettingsContext";

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  analogy?: string;
  interaction?: {
    type: 'click' | 'select' | 'observe';
    target: string;
    description: string;
  };
  visualAid?: string;
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
        title: "Welcome to Protein Confidence Explorer!",
        content: audience === 'elementary' 
          ? "Proteins are like tiny machines in our bodies. Scientists use computers to guess what they look like!"
          : audience === 'highSchool'
          ? "Proteins are complex molecules that perform essential functions in living organisms. Scientists use computational methods to predict their 3D structures."
          : "Protein structure prediction uses computational algorithms to model the three-dimensional conformation of proteins from their amino acid sequences.",
        analogy: audience === 'elementary'
          ? "🏗️ Think of proteins like LEGO buildings - scientists try to predict how all the pieces fit together!"
          : audience === 'highSchool'
          ? "🧩 Imagine trying to solve a 3D puzzle where you only know what pieces you have, but not how they connect."
          : "🎯 Consider protein folding as an optimization problem in a vast conformational space with multiple energy minima."
      },
      {
        id: "pae_explanation",
        title: "Understanding Confidence Maps",
        content: audience === 'elementary'
          ? "The colorful grid shows how sure scientists are about different parts of the protein. Green means very sure, yellow means somewhat sure, and red means not very sure."
          : audience === 'highSchool'
          ? "The Predicted Aligned Error (PAE) map shows the confidence level for each part of the protein structure. Colors indicate prediction reliability."
          : "PAE values represent the expected position error between residue pairs in the predicted structure, providing insights into local and global confidence.",
        analogy: audience === 'elementary'
          ? "🚦 It's like a traffic light system - green means 'go ahead and trust this', yellow means 'be careful', and red means 'stop and question this'!"
          : audience === 'highSchool'
          ? "📊 Think of it as a weather forecast confidence map - some areas have highly reliable predictions, others are more uncertain."
          : "🎨 Consider it as a probability density map where each pixel represents the certainty of spatial relationships between residue pairs."
      },
      {
        id: "interaction_guide",
        title: "How to Explore",
        content: "Click on any colored cell in the PAE map to learn about that region. The 3D model will highlight the corresponding area.",
        interaction: {
          type: 'click',
          target: 'pae-cell',
          description: 'Try clicking on a green, yellow, or red cell to see what happens!'
        }
      },
      {
        id: "interpretation",
        title: "Reading the Results",
        content: audience === 'elementary'
          ? "When you click a cell, you'll get a question about how confident we should be. Use the colors to help you answer!"
          : audience === 'highSchool'
          ? "Questions will test your understanding of prediction confidence and structural biology concepts."
          : "Questions will challenge your interpretation of PAE values in the context of protein structure validation and reliability assessment."
      }
    ];

    if (difficulty === 'advanced') {
      baseSteps.push({
        id: "advanced_concepts",
        title: "Advanced Interpretation",
        content: "Advanced mode explores domain interactions, allosteric networks, and the relationship between prediction confidence and functional regions.",
        analogy: "🔬 Like reading a complex scientific instrument - multiple layers of information reveal deeper insights about protein architecture."
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
    <Card className="w-full max-w-4xl mx-auto mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Interactive Tutorial</CardTitle>
            <Badge variant="outline">{audience} level</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Skip Tutorial
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Step {activeStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-800">
            {currentStepData.title}
          </h3>
          
          <p className="text-gray-700 leading-relaxed">
            {currentStepData.content}
          </p>

          {currentStepData.analogy && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <div className="flex items-start gap-2">
                <HelpCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800 mb-1">Visual Analogy:</p>
                  <p className="text-yellow-700">{currentStepData.analogy}</p>
                </div>
              </div>
            </div>
          )}

          {currentStepData.interaction && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <div className="flex items-start gap-2">
                <Target className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 mb-1">Try This:</p>
                  <p className="text-green-700">{currentStepData.interaction.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeStep
                    ? 'bg-blue-600'
                    : completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {activeStep === steps.length - 1 ? 'Complete Tutorial' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveTutorial;
