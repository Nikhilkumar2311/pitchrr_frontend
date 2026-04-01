/**
 * EditorCanvas — Main Konva Canvas for the Pitch Deck Editor
 *
 * Responsibilities:
 * - Renders the active slide with all elements via react-konva Stage/Layer
 * - Handles element selection, drag, and transform
 * - Auto-scales the canvas to fit the available container
 * - Draws the slide background (solid color or gradient)
 * - Renders a Transformer around the selected element
 *
 * SCALING:
 *   The canvas is designed at 960×540 (16:9) but rendered at whatever
 *   size the container provides, using stage.scale().
 */

import { useRef, useCallback, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';
import type Konva from 'konva';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/deck-editor.types';
import { TextNode, ImageNode, ShapeNode, TransformerWrapper } from './elements';

interface EditorCanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function EditorCanvas({ containerRef }: EditorCanvasProps) {
  const {
    deck,
    activeSlideIndex,
    selectedElementId,
    isTextEditing,
    selectElement,
    clearSelection,
    updateElement,
    pushHistory,
  } = useDeckEditorStore();

  const stageRef = useRef<Konva.Stage>(null);
  const nodeRefs = useRef<Map<string, Konva.Node | null>>(new Map());

  // Canvas scaling
  const [stageSize, setStageSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const [scale, setScale] = useState(1);

  // Calculate scale to fit container
  useEffect(() => {
    const calculateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth - 32; // padding
      const containerHeight = container.clientHeight - 32;

      const scaleX = containerWidth / CANVAS_WIDTH;
      const scaleY = containerHeight / CANVAS_HEIGHT;
      const newScale = Math.min(scaleX, scaleY, 1.2); // Cap max zoom at 1.2x

      setScale(newScale);
      setStageSize({
        width: CANVAS_WIDTH * newScale,
        height: CANVAS_HEIGHT * newScale,
      });
    };

    calculateScale();

    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  // Active slide
  const slide = deck.slides[activeSlideIndex];
  if (!slide) return null;

  // Sort elements by zIndex for rendering order
  const sortedElements = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);

  // Store node refs for Transformer
  const handleNodeRef = useCallback((id: string, node: Konva.Node | null) => {
    nodeRefs.current.set(id, node);
  }, []);

  // Get selected node ref
  const getSelectedNodeRef = (): React.RefObject<Konva.Node | null> => {
    return {
      current: selectedElementId ? nodeRefs.current.get(selectedElementId) || null : null,
    };
  };

  // Click on empty space → deselect
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const target = e.target;
    // If clicked on the stage or the background rect, deselect
    if (target === e.currentTarget || target.attrs?.id === 'slide-background') {
      clearSelection();
    }
  };

  // Parse background (support gradients)
  const isGradient = slide.background.includes('gradient');

  // For gradient fill, we parse it for Konva
  const getBackgroundFill = () => {
    if (isGradient) {
      // Parse CSS gradient to Konva gradient
      // Simple linear gradient: "linear-gradient(135deg, #color1 0%, #color2 100%)"
      const colors = slide.background.match(/#[0-9a-fA-F]{6}/g);
      if (colors && colors.length >= 2) {
        return undefined; // Use fillLinearGradient props instead
      }
    }
    return slide.background;
  };

  const getGradientProps = () => {
    if (!isGradient) return {};
    const colors = slide.background.match(/#[0-9a-fA-F]{6}/g);
    if (!colors || colors.length < 2) return {};

    return {
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: CANVAS_WIDTH, y: CANVAS_HEIGHT },
      fillLinearGradientColorStops: [0, colors[0], 1, colors[1]],
    };
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '100%' }}
    >
      <div
        className="relative"
        style={{
          boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          scaleX={scale}
          scaleY={scale}
          onClick={handleStageClick}
          onTap={handleStageClick}
          style={{ cursor: isTextEditing ? 'text' : 'default' }}
        >
          <Layer>
            {/* Slide Background */}
            <Rect
              id="slide-background"
              x={0}
              y={0}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              fill={getBackgroundFill()}
              {...getGradientProps()}
              listening={true}
            />

            {/* Elements */}
            {sortedElements
              .filter((el) => el.visible)
              .map((element) => {
                const isSelected = element.id === selectedElementId;

                switch (element.type) {
                  case 'text':
                    return (
                      <TextNode
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={selectElement}
                        onNodeRef={handleNodeRef}
                      />
                    );
                  case 'image':
                    return (
                      <ImageNode
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={selectElement}
                        onNodeRef={handleNodeRef}
                      />
                    );
                  case 'shape':
                    return (
                      <ShapeNode
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={selectElement}
                        onNodeRef={handleNodeRef}
                      />
                    );
                  default:
                    return null;
                }
              })}

            {/* Transformer */}
            {selectedElementId && !isTextEditing && (
              <TransformerWrapper
                selectedNodeRef={getSelectedNodeRef()}
                isTextEditing={isTextEditing}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
