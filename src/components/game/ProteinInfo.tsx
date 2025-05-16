
import React from "react";
import { AudienceType } from "./GameSettingsContext";
import { ProteinStructure } from "@/types/game";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookOpen, HelpCircle, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ProteinInfoProps {
  protein: ProteinStructure | undefined;
  audience: AudienceType;
}

const ProteinInfo: React.FC<ProteinInfoProps> = ({ protein, audience }) => {
  if (!protein) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Protein Information</CardTitle>
          <CardDescription>Select a protein to see details</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{protein.name}</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{protein.confidenceGuide}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription>AlphaFold Structure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">What is it?</h3>
          <p className="text-sm text-gray-700">{protein.description[audience]}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">What does it do?</h3>
          <p className="text-sm text-gray-700">{protein.function[audience]}</p>
        </div>
        
        {protein.disease && protein.disease[audience] && (
          <div>
            <h3 className="text-sm font-medium mb-2">Related Health Issues</h3>
            <p className="text-sm text-gray-700">{protein.disease[audience]}</p>
          </div>
        )}
        
        {audience === 'undergraduate' && (
          <div className="pt-2">
            <Separator />
            <div className="pt-4 flex flex-col gap-2">
              <h3 className="text-sm font-medium">Domains</h3>
              {protein.domains?.map((domain, index) => (
                <div key={index} className="text-xs">
                  <span className="font-medium">{domain.name}:</span> {domain.description}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <Separator />
          <div className="pt-4 flex gap-2">
            <a 
              href={protein.alphafoldLink} 
              target="_blank"
              rel="noopener noreferrer" 
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <LinkIcon size={12} /> AlphaFold DB
            </a>
            
            {audience === 'undergraduate' && (
              <a 
                href={protein.literature[0]} 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <BookOpen size={12} /> Literature
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProteinInfo;
