// components/Editor.tsx
import { Stage, Layer, Text as KonvaText } from "react-konva";
import { useDeckStore } from "./useDeckStore";
import type { TextElement } from "./deck";
import type { KonvaEventObject } from "konva/lib/Node";

const Editor = () => {
  const { slides, activeSlideIndex, updateElement } = useDeckStore();
  const slide = slides[activeSlideIndex];

  return (
    <Stage width={800} height={500} style={{ border: "1px solid #ccc" }}>
      <Layer>
        {slide.elements.map((el) => {
          if (el.type === "text") {
            const textEl = el as TextElement;

            return (
              <KonvaText
                key={textEl.id}
                text={textEl.text}
                x={textEl.x}
                y={textEl.y}
                fontSize={textEl.fontSize}
                fill={textEl.fill}
                draggable
                onDragEnd={(e: KonvaEventObject<DragEvent>) => {
                  updateElement(textEl.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                  });
                }}
                onDblClick={() => {
                  const newText = prompt("Edit text", textEl.text);
                  if (newText !== null) {
                    updateElement(textEl.id, { text: newText });
                  }
                }}
              />
            );
          }
          return null;
        })}
      </Layer>
    </Stage>
  );
};

export default Editor;
