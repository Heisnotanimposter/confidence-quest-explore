
import { GameMode } from "./GameSettingsContext";

interface TutorialInfoProps {
  gameMode: GameMode;
}

const TutorialInfo = ({ gameMode }: TutorialInfoProps) => {
  if (gameMode !== 'tutorial') {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="font-bold text-lg mb-2">Tutorial Mode</h3>
      <p className="mb-2">Welcome to the Confidence Challenge tutorial!</p>
      <ol className="list-decimal pl-5 space-y-2">
        <li>Click on any colored cell in the PAE map on the left.</li>
        <li>Notice how the corresponding part of the protein model highlights.</li>
        <li>Answer the question about protein confidence that appears below.</li>
        <li>Green cells indicate high confidence, yellow is medium, and red is low.</li>
      </ol>
    </div>
  );
};

export default TutorialInfo;
