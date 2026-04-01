/**
 * TextNode — Konva Text Element Renderer
 *
 * Renders a text element on the canvas with:
 * - Drag to move
 * - Transform (resize/rotate) via parent Transformer
 * - Double-click to enter inline text editing (HTML <textarea> overlay)
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
  isSelected,
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

    // Reset scale and apply to width/height
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

    // Create textarea overlay
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = element.content;
    textarea.style.position = 'fixed';
    textarea.style.top = `${stageBox.top + textPosition.y * scale}px`;
    textarea.style.left = `${stageBox.left + textPosition.x * scale}px`;
    textarea.style.width = `${textNode.width() * scale + 4}px`;
    textarea.style.minHeight = `${textNode.height() * scale + 4}px`;
    textarea.style.fontSize = `${element.fontSize * scale}px`;
    textarea.style.fontFamily = element.fontFamily;
    textarea.style.fontWeight = element.fontWeight;
    textarea.style.fontStyle = element.fontStyle;
    textarea.style.textAlign = element.textAlign;
    textarea.style.color = element.fill;
    textarea.style.lineHeight = String(element.lineHeight);
    textarea.style.letterSpacing = `${element.letterSpacing}px`;
    textarea.style.border = '2px solid #3B82F6';
    textarea.style.borderRadius = '4px';
    textarea.style.padding = `${element.padding * scale}px`;
    textarea.style.margin = '0';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'rgba(255,255,255,0.95)';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.transformOrigin = 'left top';
    textarea.style.zIndex = '10000';
    textarea.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';

    textarea.focus();

    const removeTextarea = () => {
      pushHistory();
      const newContent = textarea.value;
      updateElement(element.id, { content: newContent });
      document.body.removeChild(textarea);
      setTextEditing(false);
    };

    textarea.addEventListener('blur', removeTextarea);
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        textarea.removeEventListener('blur', removeTextarea);
        document.body.removeChild(textarea);
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
      // Visual feedback
      perfectDrawEnabled={false}
    />
  );
}
