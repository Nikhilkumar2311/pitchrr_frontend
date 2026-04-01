/**
 * ShapeNode — Konva Shape Element Renderer
 *
 * Renders various shape types:
 * - rectangle (with corner radius)
 * - circle (as ellipse/circle)
 * - triangle
 * - line (horizontal rule)
 * - star
 * - arrow
 * - diamond
 */

import { useRef, useCallback } from 'react';
import { Rect, Circle, Line, Star, Arrow, RegularPolygon, Group } from 'react-konva';
import type Konva from 'konva';
import type { ShapeElement } from '@/types/deck-editor.types';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';

interface ShapeNodeProps {
  element: ShapeElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onNodeRef: (id: string, node: Konva.Node | null) => void;
}

export function ShapeNode({
  element,
  isSelected,
  onSelect,
  onNodeRef,
}: ShapeNodeProps) {
  const nodeRef = useRef<Konva.Node>(null);
  const { updateElement, pushHistory } = useDeckEditorStore();

  const handleRef = useCallback(
    (node: Konva.Node | null) => {
      (nodeRef as React.MutableRefObject<Konva.Node | null>).current = node;
      onNodeRef(element.id, node);
    },
    [element.id, onNodeRef]
  );

  const handleDragStart = () => {
    if (element.locked) return;
    pushHistory();
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (element.locked) return;
    updateElement(element.id, {
      x: Math.round(e.target.x()),
      y: Math.round(e.target.y()),
    });
  };

  const handleTransformEnd = () => {
    const node = nodeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    updateElement(element.id, {
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.round(Math.max(10, element.width * scaleX)),
      height: Math.round(Math.max(10, element.height * scaleY)),
      rotation: Math.round(node.rotation()),
    });
  };

  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    opacity: element.opacity,
    rotation: element.rotation,
    draggable: !element.locked,
    visible: element.visible,
    onClick: () => onSelect(element.id),
    onTap: () => onSelect(element.id),
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    fill: element.fill,
    stroke: element.stroke || undefined,
    strokeWidth: element.strokeWidth || 0,
  };

  switch (element.shapeType) {
    case 'rectangle':
      return (
        <Rect
          ref={handleRef as React.RefCallback<Konva.Rect>}
          {...commonProps}
          width={element.width}
          height={element.height}
          cornerRadius={element.cornerRadius}
        />
      );

    case 'circle':
      return (
        <Group
          ref={handleRef as React.RefCallback<Konva.Group>}
          {...commonProps}
        >
          <Circle
            x={element.width / 2}
            y={element.height / 2}
            radiusX={element.width / 2}
            radiusY={element.height / 2}
            radius={Math.min(element.width, element.height) / 2}
            fill={element.fill}
            stroke={element.stroke || undefined}
            strokeWidth={element.strokeWidth || 0}
          />
        </Group>
      );

    case 'triangle':
      return (
        <Line
          ref={handleRef as React.RefCallback<Konva.Line>}
          {...commonProps}
          points={[
            element.width / 2, 0,     // top center
            element.width, element.height, // bottom right
            0, element.height,             // bottom left
          ]}
          closed={true}
        />
      );

    case 'line':
      return (
        <Line
          ref={handleRef as React.RefCallback<Konva.Line>}
          {...commonProps}
          points={[0, 0, element.width, 0]}
          stroke={element.fill}
          strokeWidth={element.strokeWidth || 3}
          fill=""
          lineCap="round"
        />
      );

    case 'star':
      return (
        <Star
          ref={handleRef as React.RefCallback<Konva.Star>}
          {...commonProps}
          x={element.x + element.width / 2}
          y={element.y + element.height / 2}
          numPoints={5}
          innerRadius={element.width * 0.2}
          outerRadius={element.width * 0.45}
        />
      );

    case 'arrow':
      return (
        <Arrow
          ref={handleRef as React.RefCallback<Konva.Arrow>}
          {...commonProps}
          points={[0, element.height / 2, element.width, element.height / 2]}
          pointerLength={12}
          pointerWidth={12}
          stroke={element.fill}
          strokeWidth={element.strokeWidth || 3}
          fill={element.fill}
        />
      );

    case 'diamond':
      return (
        <RegularPolygon
          ref={handleRef as React.RefCallback<Konva.RegularPolygon>}
          {...commonProps}
          x={element.x + element.width / 2}
          y={element.y + element.height / 2}
          sides={4}
          radius={Math.min(element.width, element.height) / 2}
        />
      );

    default:
      return null;
  }
}
