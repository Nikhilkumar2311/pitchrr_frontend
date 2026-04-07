/**
 * EditorCanvas — Konva Canvas with Premium Shadow
 *
 * Renders the active slide on a canvas with multi-layer shadow,
 * themed to match the workspace (light or dark).
 *
 * Shift+Click = multi-select; normal Click = single select.
 */

import { useRef, useCallback, useState, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import type Konva from 'konva';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { useEditorTheme } from './editorTheme';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/deck-editor.types';
import { TextNode, ImageNode, ShapeNode, TransformerWrapper } from './elements';

interface EditorCanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function EditorCanvas({ containerRef }: EditorCanvasProps) {
  const t = useEditorTheme((s) => s.tokens);
  const {
    deck, activeSlideIndex, selectedElementId, selectedElementIds, isTextEditing,
    selectElement, toggleSelectElement, clearSelection,
  } = useDeckEditorStore();

  const stageRef = useRef<Konva.Stage>(null);
  const nodeRefs = useRef<Map<string, Konva.Node | null>>(new Map());
  const [stageSize, setStageSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      const cw = container.clientWidth - 48;
      const ch = container.clientHeight - 48;
      const s = Math.min(cw / CANVAS_WIDTH, ch / CANVAS_HEIGHT, 1.2);
      setScale(s);
      setStageSize({ width: CANVAS_WIDTH * s, height: CANVAS_HEIGHT * s });
    };
    calculateScale();
    const ro = new ResizeObserver(calculateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef]);

  const slide = deck.slides[activeSlideIndex];
  if (!slide) return null;

  const sortedElements = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);

  const handleNodeRef = useCallback((id: string, node: Konva.Node | null) => {
    nodeRefs.current.set(id, node);
  }, []);

  const getSelectedNodeRef = (): React.RefObject<Konva.Node | null> => ({
    current: selectedElementId ? nodeRefs.current.get(selectedElementId) || null : null,
  });

  // Shift+Click = toggle multi-select; normal click = single select
  const handleElementSelect = useCallback((id: string, shiftKey?: boolean) => {
    if (shiftKey) {
      toggleSelectElement(id);
    } else {
      selectElement(id);
    }
  }, [selectElement, toggleSelectElement]);

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const target = e.target;
    if (target === e.currentTarget || target.attrs?.id === 'slide-background') {
      clearSelection();
    }
  };

  const handleStageTap = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const target = e.target;
    if (target === e.currentTarget || target.attrs?.id === 'slide-background') {
      clearSelection();
    }
  };

  const isGradient = slide.background.includes('gradient');

  const getBackgroundFill = () => {
    if (isGradient) return undefined;
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
    <div className="flex items-center justify-center" style={{ minHeight: '100%' }}>
      <div className="relative" style={{ boxShadow: t.canvasShadow, borderRadius: '8px', overflow: 'hidden' }}>
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          scaleX={scale}
          scaleY={scale}
          onClick={handleStageClick}
          onTap={handleStageTap}
          style={{ cursor: isTextEditing ? 'text' : 'default' }}
        >
          <Layer>
            <Rect id="slide-background" x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={getBackgroundFill()} {...getGradientProps()} listening={true} />
            {sortedElements.filter((el) => el.visible).map((element) => {
              const isSelected = selectedElementIds.includes(element.id);
              switch (element.type) {
                case 'text':    return <TextNode    key={element.id} element={element} isSelected={isSelected} onSelect={handleElementSelect} onNodeRef={handleNodeRef} />;
                case 'image':   return <ImageNode   key={element.id} element={element} isSelected={isSelected} onSelect={handleElementSelect} onNodeRef={handleNodeRef} />;
                case 'shape':   return <ShapeNode   key={element.id} element={element} isSelected={isSelected} onSelect={handleElementSelect} onNodeRef={handleNodeRef} />;
                default: return null;
              }
            })}
            {selectedElementId && !isTextEditing && (
              <TransformerWrapper selectedNodeRef={getSelectedNodeRef()} isTextEditing={isTextEditing} />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
