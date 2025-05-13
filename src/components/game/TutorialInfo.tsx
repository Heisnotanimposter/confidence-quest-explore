
import { AudienceType, GameMode } from "./GameSettingsContext";

interface TutorialInfoProps {
  gameMode: GameMode;
  audience?: AudienceType;
}

const TutorialInfo = ({ gameMode, audience = 'elementary' }: TutorialInfoProps) => {
  if (gameMode !== 'tutorial') {
    return null;
  }

  // Render tutorial content based on audience level
  const renderAudienceSpecificContent = () => {
    switch (audience) {
      case 'elementary':
        return (
          <>
            <p className="mb-2">Welcome to the Confidence Challenge tutorial! Let's learn about proteins!</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click on any colored square in the PAE map on the left.</li>
              <li>The colors tell us how sure scientists are about that part of the protein:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><span className="text-green-600 font-medium">Green</span> = Scientists are very sure</li>
                  <li><span className="text-yellow-500 font-medium">Yellow</span> = Scientists are kind of sure</li>
                  <li><span className="text-red-500 font-medium">Red</span> = Scientists are not very sure</li>
                </ul>
              </li>
              <li>Answer the question that appears by selecting your answer and clicking "Submit".</li>
              <li>Don't worry about making mistakes - this is for learning!</li>
            </ol>
          </>
        );
        
      case 'highSchool':
        return (
          <>
            <p className="mb-2">Welcome to the Confidence Challenge tutorial! Understanding protein structure prediction confidence.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select any cell in the Predicted Aligned Error (PAE) map on the left.</li>
              <li>The colors represent different confidence levels in the structure prediction:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><span className="text-green-600 font-medium">Green</span> = High confidence (low predicted error)</li>
                  <li><span className="text-yellow-500 font-medium">Yellow</span> = Medium confidence (moderate predicted error)</li>
                  <li><span className="text-red-500 font-medium">Red</span> = Low confidence (high predicted error)</li>
                </ul>
              </li>
              <li>Notice how the protein model highlights when you select a region.</li>
              <li>Answer questions about structure prediction confidence to test your understanding.</li>
            </ol>
          </>
        );
        
      case 'undergraduate':
        return (
          <>
            <p className="mb-2">Welcome to the Confidence Challenge tutorial on AlphaFold predicted aligned error (PAE) interpretation.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select a cell in the PAE matrix to explore structure prediction confidence.</li>
              <li>The PAE map represents pairwise predicted errors between residues:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><span className="text-green-600 font-medium">Green</span> = High confidence regions (PAE &lt; 5Å)</li>
                  <li><span className="text-yellow-500 font-medium">Yellow</span> = Medium confidence (PAE 5-15Å)</li>
                  <li><span className="text-red-500 font-medium">Red</span> = Low confidence (PAE &gt; 15Å)</li>
                </ul>
              </li>
              <li>Note how confidence patterns often correlate with structural features like domains and interfaces.</li>
              <li>The tutorial will present increasingly complex questions about PAE interpretation and its implications for structural biology research.</li>
            </ol>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="font-bold text-lg mb-2">Tutorial Mode</h3>
      {renderAudienceSpecificContent()}
    </div>
  );
};

export default TutorialInfo;
