/**
 * TransformerWrapper — Konva Transformer for selected elements
 *
 * Attaches a Transformer (resize/rotate handles) to the currently selected node.
 * Used by EditorCanvas to show controls around the active element.
 */

import { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';
import type Konva from 'konva';

interface TransformerWrapperProps {
  selectedNodeRef: React.RefObject<Konva.Node | null>;
  isTextEditing: boolean;
}

export function TransformerWrapper({
  selectedNodeRef,
  isTextEditing,
}: TransformerWrapperProps) {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && selectedNodeRef.current) {
      trRef.current.nodes([selectedNodeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedNodeRef.current]);

  if (isTextEditing) return null;

  return (
    <Transformer
      ref={trRef}
      rotateEnabled={true}
      enabledAnchors={[
        'top-left',
        'top-center',
        'top-right',
        'middle-left',
        'middle-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ]}
      boundBoxFunc={(oldBox, newBox) => {
        // Minimum size constraints
        if (Math.abs(newBox.width) < 20 || Math.abs(newBox.height) < 5) {
          return oldBox;
        }
        return newBox;
      }}
      anchorSize={8}
      anchorCornerRadius={2}
      anchorStroke="#3B82F6"
      anchorFill="#FFFFFF"
      borderStroke="#3B82F6"
      borderStrokeWidth={1.5}
      anchorStrokeWidth={1.5}
      padding={2}
      rotateAnchorOffset={25}
      rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
    />
  );
}
