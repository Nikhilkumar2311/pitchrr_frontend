// components/SlidesPanel.tsx
import { useDeckStore } from "./useDeckStore";

const SlidesPanel = () => {
  const { slides, setActiveSlide, addSlide } = useDeckStore();

  return (
    <div>
      <button onClick={addSlide}>+ Slide</button>

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          onClick={() => setActiveSlide(index)}
          style={{
            border: "1px solid black",
            padding: 5,
            margin: 5,
            cursor: "pointer",
          }}
        >
          Slide {index + 1}
        </div>
      ))}
    </div>
  );
};

export default SlidesPanel;
