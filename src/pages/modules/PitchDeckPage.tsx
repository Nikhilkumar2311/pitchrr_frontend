// features/pitchDeck/pages/PitchDeckPage.tsx
import Editor from "./Editor";
import Toolbar from "./Toolbar";
import SlidesPanel from "./SlidesPanel";
import { saveDeck, loadDeck } from "./deck.api";
import { useDeckStore } from "./useDeckStore";

const PitchDeckPage = () => {
  const { slides, setDeck } = useDeckStore();

  const handleSave = async () => {
    await saveDeck({ slides });
  };

  const handleLoad = async () => {
    const deck = await loadDeck();
    setDeck(deck);
  };

  return (
    <div className="flex gap-4 p-4">
      <SlidesPanel />

      <div className="flex flex-col gap-2">
        <Toolbar />
        <Editor />

        <div className="flex gap-2">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleLoad}>Load</button>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckPage;
