/**
 * TextNode — Konva Text Element with In-Place Editing
 *
 * - Double-click to edit text directly on the canvas
 * - The Konva text hides, and a transparent HTML textarea appears in its place
 * - On blur or Ctrl+Enter, the edit is saved
 */

import { useRef, useCallback } from 'react';
import { Text } from 'react-konva';
import type Konva from 'konva';
import type { TextElement } from '@/types/deck-editor.types';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';

interface TextNodeProps {
  element: TextElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onNodeRef: (id: string, node: Konva.Node | null) => void;
}

export function TextNode({
  element,
  isSelected: _isSelected,
  onSelect,
  onNodeRef,
}: TextNodeProps) {
  const nodeRef = useRef<Konva.Text>(null);
  const { updateElement, pushHistory, setTextEditing } = useDeckEditorStore();

  const handleRef = useCallback(
    (node: Konva.Text | null) => {
      (nodeRef as React.MutableRefObject<Konva.Text | null>).current = node;
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
      width: Math.round(Math.max(20, node.width() * scaleX)),
      height: Math.round(Math.max(10, node.height() * scaleY)),
      rotation: Math.round(node.rotation()),
    });
  };

  const handleDblClick = () => {
    if (element.locked) return;

    const stage = nodeRef.current?.getStage();
    if (!stage) return;

    setTextEditing(true);

    const textNode = nodeRef.current!;
    const textPosition = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const scale = stage.scaleX();

    // Hide the Konva text while editing
    textNode.hide();
    textNode.getLayer()?.batchDraw();

    // Create transparent textarea overlay positioned exactly on the text
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = element.content;

    // Position exactly over the Konva text
    Object.assign(textarea.style, {
      position: 'fixed',
      top: `${stageBox.top + textPosition.y * scale}px`,
      left: `${stageBox.left + textPosition.x * scale}px`,
      width: `${textNode.width() * scale + 4}px`,
      minHeight: `${textNode.height() * scale + 4}px`,
      fontSize: `${element.fontSize * scale}px`,
      fontFamily: element.fontFamily,
      fontWeight: element.fontWeight,
      fontStyle: element.fontStyle,
      textAlign: element.textAlign,
      color: element.fill,
      lineHeight: String(element.lineHeight),
      letterSpacing: `${element.letterSpacing}px`,
      padding: `${element.padding * scale}px`,
      margin: '0',
      overflow: 'hidden',
      outline: 'none',
      resize: 'none',
      transformOrigin: 'left top',
      zIndex: '10000',
      // Truly transparent — no visible border/bg, just a blinking cursor
      background: 'none',
      backgroundColor: 'transparent',
      border: '2px solid rgba(99,102,241,0.5)',
      borderRadius: '2px',
      boxShadow: '0 0 0 2px rgba(99,102,241,0.12)',
      // Reset browser defaults
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
    });

    textarea.focus();

    const removeTextarea = () => {
      pushHistory();
      const newContent = textarea.value;
      updateElement(element.id, { content: newContent });

      // Show the Konva text again
      textNode.show();
      textNode.getLayer()?.batchDraw();

      if (document.body.contains(textarea)) {
        document.body.removeChild(textarea);
      }
      setTextEditing(false);
    };

    textarea.addEventListener('blur', removeTextarea);
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        textarea.removeEventListener('blur', removeTextarea);
        // Show the Konva text again without saving
        textNode.show();
        textNode.getLayer()?.batchDraw();
        if (document.body.contains(textarea)) {
          document.body.removeChild(textarea);
        }
        setTextEditing(false);
      }
      // Ctrl+Enter to confirm
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        textarea.blur();
      }
    });
  };

  return (
    <Text
      ref={handleRef}
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      text={element.content}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fontStyle={
        `${element.fontWeight === 'bold' ? 'bold' : ''} ${element.fontStyle}`.trim() || 'normal'
      }
      textDecoration={element.textDecoration === 'none' ? '' : element.textDecoration}
      align={element.textAlign}
      fill={element.fill}
      opacity={element.opacity}
      rotation={element.rotation}
      lineHeight={element.lineHeight}
      letterSpacing={element.letterSpacing}
      padding={element.padding}
      draggable={!element.locked}
      visible={element.visible}
      onClick={() => onSelect(element.id)}
      onTap={() => onSelect(element.id)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
      perfectDrawEnabled={false}
    />
  );
}
