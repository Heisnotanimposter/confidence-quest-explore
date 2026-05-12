
import React from "react";
import { AudienceType } from "./GameSettingsContext";
import { ProteinStructure } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, HelpCircle, LinkIcon, Sparkles, Heart, Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ProteinInfoProps {
  protein: ProteinStructure | undefined;
  audience: AudienceType;
}

const ProteinInfo: React.FC<ProteinInfoProps> = ({ protein, audience }) => {
  if (!protein) {
    return (
      <Card className="h-full glass-card border-0">
        <CardHeader>
          <CardTitle className="text-lg">📋 Protein Details</CardTitle>
          <CardDescription>Pick a protein above to see its story!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">🧬</span>
            <p className="text-sm text-muted-foreground">
              Choose a protein from the cards above to learn about its story, superpower, and why it matters to you.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto glass-card border-0">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-gradient">
            {audience === 'elementary' ? `Meet ${protein.name}! ✨` : protein.name}
          </CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-sm">{protein.confidenceGuide}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription className="text-xs">
          {audience === 'elementary' 
            ? `From: ${protein.species === 'Homo sapiens' ? 'Your body! 🧑' : protein.species}`
            : `${protein.species} • AlphaFold Structure`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Story / Description */}
        <div className="p-3 bg-primary/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-game-teal" />
            <h3 className="text-sm font-semibold text-foreground/90">
              {audience === 'elementary' ? "What is it? 🤔" : "Overview"}
            </h3>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">{protein.description[audience]}</p>
        </div>
        
        {/* Superpower / Function */}
        <div className="p-3 bg-amber-50/80 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-foreground/90">
              {audience === 'elementary' ? "Its Superpower ⚡" : "Function"}
            </h3>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">{protein.function[audience]}</p>
        </div>
        
        {/* Why it matters / Disease relevance */}
        {protein.disease && protein.disease[audience] && (
          <div className="p-3 bg-rose-50/80 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Heart size={14} className="text-rose-400" />
              <h3 className="text-sm font-semibold text-foreground/90">
                {audience === 'elementary' ? "Why Should You Care? 💡" : "Health Relevance"}
              </h3>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed">{protein.disease[audience]}</p>
          </div>
        )}
        
        {/* Domain info - only for non-elementary */}
        {audience !== 'elementary' && protein.domains && (
          <div className="pt-1">
            <Separator className="mb-3" />
            <div className="flex items-center gap-2 mb-2">
              <Layers size={14} className="text-blue-500" />
              <h3 className="text-sm font-semibold text-foreground/90">Structure Domains</h3>
            </div>
            <div className="space-y-1.5">
              {protein.domains.map((domain, index) => (
                <div key={index} className="text-xs p-2 bg-blue-50/60 rounded-lg">
                  <span className="font-medium text-blue-700">{domain.name}</span>
                  <span className="text-foreground/50 ml-1">— {domain.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Links - only for non-elementary */}
        {audience !== 'elementary' && (
          <div className="pt-1">
            <Separator className="mb-3" />
            <div className="flex gap-3 flex-wrap">
              <a 
                href={protein.alphafoldLink} 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-xs text-game-teal hover:text-game-teal/80 flex items-center gap-1 transition-colors"
              >
                <LinkIcon size={11} /> AlphaFold DB
              </a>
              
              {audience === 'undergraduate' && (
                <a 
                  href={protein.literature[0]} 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-xs text-game-teal hover:text-game-teal/80 flex items-center gap-1 transition-colors"
                >
                  <BookOpen size={11} /> Research Paper
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProteinInfo;
