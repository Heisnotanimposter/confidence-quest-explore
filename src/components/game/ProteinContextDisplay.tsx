
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProteinStructure } from "@/types/game";
import { AudienceType } from "./GameSettingsContext";
import { Heart, Shield, Zap, Users, Globe, Microscope } from "lucide-react";

interface ProteinContextDisplayProps {
  protein: ProteinStructure | undefined;
  audience: AudienceType;
}

const ProteinContextDisplay: React.FC<ProteinContextDisplayProps> = ({ protein, audience }) => {
  if (!protein) return null;

  const getRealWorldApplications = () => {
    const applications = {
      elementary: [
        { icon: <Heart className="h-4 w-4" />, title: "Health", description: "Helps doctors understand diseases" },
        { icon: <Shield className="h-4 w-4" />, title: "Medicine", description: "Creates new treatments" },
        { icon: <Zap className="h-4 w-4" />, title: "Energy", description: "Powers our body's processes" }
      ],
      highSchool: [
        { icon: <Heart className="h-4 w-4" />, title: "Drug Discovery", description: "Identifying therapeutic targets and designing medications" },
        { icon: <Shield className="h-4 w-4" />, title: "Disease Research", description: "Understanding protein misfolding in diseases" },
        { icon: <Microscope className="h-4 w-4" />, title: "Biotechnology", description: "Engineering proteins for industrial applications" }
      ],
      undergraduate: [
        { icon: <Heart className="h-4 w-4" />, title: "Precision Medicine", description: "Personalized therapeutics based on protein variants" },
        { icon: <Shield className="h-4 w-4" />, title: "Structural Biology", description: "Understanding function through 3D architecture" },
        { icon: <Globe className="h-4 w-4" />, title: "Computational Biology", description: "AI-driven protein design and prediction" }
      ]
    };
    return applications[audience] || applications.elementary;
  };

  const getInterestingFacts = () => {
    const facts = {
      elementary: [
        "🔬 Scientists can now predict protein shapes using computers!",
        "🧬 Proteins are made of building blocks called amino acids",
        "⚡ Some proteins work like tiny motors in our cells"
      ],
      highSchool: [
        "🏆 AlphaFold revolutionized protein structure prediction in 2020",
        "🔄 Protein folding happens in milliseconds but took decades to understand",
        "🎯 One misfolded protein can cause serious diseases like Alzheimer's"
      ],
      undergraduate: [
        "📊 AlphaFold has predicted structures for over 200 million proteins",
        "⚙️ PAE values help validate experimental structures from X-ray crystallography",
        "🔬 Confidence scores guide which regions need experimental validation"
      ]
    };
    return facts[audience] || facts.elementary;
  };

  return (
    <div className="space-y-4">
      {/* Real-world Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Real-World Impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getRealWorldApplications().map((app, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-blue-600 mt-0.5">{app.icon}</div>
              <div>
                <h4 className="font-semibold text-blue-800">{app.title}</h4>
                <p className="text-sm text-blue-700">{app.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Interesting Facts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Did You Know?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {getInterestingFacts().map((fact, index) => (
            <div key={index} className="p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
              <p className="text-sm text-gray-700">{fact}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Confidence Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Understanding Confidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-100 rounded">
              <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
              <span className="text-xs font-medium">High</span>
              <p className="text-xs text-gray-600">Very reliable</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded">
              <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
              <span className="text-xs font-medium">Medium</span>
              <p className="text-xs text-gray-600">Somewhat reliable</p>
            </div>
            <div className="p-2 bg-red-100 rounded">
              <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
              <span className="text-xs font-medium">Low</span>
              <p className="text-xs text-gray-600">Less reliable</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">What this means:</p>
            {audience === 'elementary' ? (
              <p>Green areas are like puzzle pieces that fit perfectly. Red areas are like pieces that might not fit quite right.</p>
            ) : audience === 'highSchool' ? (
              <p>Higher confidence regions indicate more reliable structural predictions, while lower confidence suggests flexibility or uncertainty.</p>
            ) : (
              <p>PAE values reflect the expected positional error between residue pairs, with implications for functional annotation and experimental validation priorities.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProteinContextDisplay;
