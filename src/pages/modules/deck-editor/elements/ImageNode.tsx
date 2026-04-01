/**
 * ImageNode — Konva Image Element Renderer
 *
 * Renders an image element with:
 * - Async image loading via useImage pattern
 * - Drag to move
 * - Transform to resize/rotate
 * - Corner radius and border support
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { Image, Group, Rect } from 'react-konva';
import type Konva from 'konva';
import type { ImageElement } from '@/types/deck-editor.types';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';

interface ImageNodeProps {
  element: ImageElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onNodeRef: (id: string, node: Konva.Node | null) => void;
}

export function ImageNode({
  element,
  isSelected,
  onSelect,
  onNodeRef,
}: ImageNodeProps) {
  const groupRef = useRef<Konva.Group>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const { updateElement, pushHistory } = useDeckEditorStore();

  // Load image
  useEffect(() => {
    if (!element.src) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setImage(img);
    img.onerror = () => setImage(null);
    img.src = element.src;
  }, [element.src]);

  const handleRef = useCallback(
    (node: Konva.Group | null) => {
      (groupRef as React.MutableRefObject<Konva.Group | null>).current = node;
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
    const node = groupRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    updateElement(element.id, {
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.round(Math.max(20, element.width * scaleX)),
      height: Math.round(Math.max(20, element.height * scaleY)),
      rotation: Math.round(node.rotation()),
    });
  };

  // Placeholder when image hasn't loaded yet
  if (!image) {
    return (
      <Group
        ref={handleRef}
        id={element.id}
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        opacity={element.opacity}
        draggable={!element.locked}
        visible={element.visible}
        onClick={() => onSelect(element.id)}
        onTap={() => onSelect(element.id)}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        <Rect
          width={element.width}
          height={element.height}
          fill="#F1F5F9"
          stroke="#CBD5E1"
          strokeWidth={1}
          cornerRadius={element.cornerRadius}
        />
        {/* Loading indicator: simple cross */}
        <Rect
          x={element.width / 2 - 1}
          y={element.height * 0.3}
          width={2}
          height={element.height * 0.4}
          fill="#94A3B8"
        />
        <Rect
          x={element.width * 0.3}
          y={element.height / 2 - 1}
          width={element.width * 0.4}
          height={2}
          fill="#94A3B8"
        />
      </Group>
    );
  }

  return (
    <Group
      ref={handleRef}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      opacity={element.opacity}
      draggable={!element.locked}
      visible={element.visible}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      clipFunc={
        element.cornerRadius > 0
          ? (ctx) => {
              const r = element.cornerRadius;
              const w = element.width;
              const h = element.height;
              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.lineTo(w - r, 0);
              ctx.quadraticCurveTo(w, 0, w, r);
              ctx.lineTo(w, h - r);
              ctx.quadraticCurveTo(w, h, w - r, h);
              ctx.lineTo(r, h);
              ctx.quadraticCurveTo(0, h, 0, h - r);
              ctx.lineTo(0, r);
              ctx.quadraticCurveTo(0, 0, r, 0);
              ctx.closePath();
            }
          : undefined
      }
    >
      <Image
        image={image}
        width={element.width}
        height={element.height}
      />
      {/* Border */}
      {element.borderWidth > 0 && element.borderColor !== 'transparent' && (
        <Rect
          width={element.width}
          height={element.height}
          stroke={element.borderColor}
          strokeWidth={element.borderWidth}
          cornerRadius={element.cornerRadius}
          listening={false}
        />
      )}
    </Group>
  );
}
