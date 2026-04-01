// components/Toolbar.tsx
import { useDeckStore } from "./useDeckStore";

const Toolbar = () => {
  const { addText } = useDeckStore();

  return (
    <div style={{ marginBottom: 10 }}>
      <button onClick={addText}>Add Text</button>
    </div>
  );
};

export default Toolbar;
