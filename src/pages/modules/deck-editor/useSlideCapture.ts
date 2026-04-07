/**
 * useSlideCapture — Captures all slides as base64 PNG images using Konva.
 *
 * Creates an offscreen Konva Stage, renders each slide with all its elements,
 * and captures them as high-resolution PNG data URIs.
 *
 * Usage:
 *   const { captureAllSlides, isCapturing } = useSlideCapture();
 *   const images = await captureAllSlides(); // string[]
 */

import { useState, useCallback } from 'react';
import Konva from 'konva';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/deck-editor.types';
import type { SlideElement, TextElement, ImageElement, ShapeElement } from '@/types/deck-editor.types';

export function useSlideCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const deck = useDeckEditorStore((s) => s.deck);

  const captureAllSlides = useCallback(async (): Promise<string[]> => {
    setIsCapturing(true);
    const images: string[] = [];

    try {
      for (const slide of deck.slides) {
        const dataUrl = await captureSlide(slide.elements, slide.background);
        images.push(dataUrl);
      }
    } finally {
      setIsCapturing(false);
    }

    return images;
  }, [deck.slides]);

  return { captureAllSlides, isCapturing };
}

/**
 * Renders a single slide to an offscreen Konva Stage and exports as PNG.
 */
async function captureSlide(
  elements: SlideElement[],
  background: string,
): Promise<string> {
  // Create a temporary container (offscreen)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = `${CANVAS_WIDTH}px`;
  container.style.height = `${CANVAS_HEIGHT}px`;
  document.body.appendChild(container);

  const stage = new Konva.Stage({
    container,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  // Draw background
  const isGradient = background.includes('gradient');
  const bgRect = new Konva.Rect({
    x: 0,
    y: 0,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  });

  if (isGradient) {
    const colors = background.match(/#[0-9a-fA-F]{6}/g);
    if (colors && colors.length >= 2) {
      bgRect.fillLinearGradientStartPoint({ x: 0, y: 0 });
      bgRect.fillLinearGradientEndPoint({ x: CANVAS_WIDTH, y: CANVAS_HEIGHT });
      bgRect.fillLinearGradientColorStops([0, colors[0], 1, colors[1]]);
    } else {
      bgRect.fill('#FFFFFF');
    }
  } else {
    bgRect.fill(background || '#FFFFFF');
  }

  layer.add(bgRect);

  // Sort elements by z-index
  const sorted = [...elements]
    .filter((e) => e.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  // Render each element
  for (const el of sorted) {
    if (el.type === 'text') {
      const te = el as TextElement;
      const node = new Konva.Text({
        x: te.x,
        y: te.y,
        width: te.width,
        height: te.height,
        text: te.content,
        fontSize: te.fontSize,
        fontFamily: te.fontFamily,
        fontStyle: `${te.fontWeight === 'bold' ? 'bold' : ''} ${te.fontStyle}`.trim() || 'normal',
        textDecoration: te.textDecoration === 'none' ? '' : te.textDecoration,
        align: te.textAlign,
        fill: te.fill,
        opacity: te.opacity,
        rotation: te.rotation,
        lineHeight: te.lineHeight,
        letterSpacing: te.letterSpacing,
        padding: te.padding,
      });
      layer.add(node);

    } else if (el.type === 'image') {
      const ie = el as ImageElement;
      // Load image and wait for it
      try {
        const img = await loadImage(ie.src);
        const node = new Konva.Image({
          x: ie.x,
          y: ie.y,
          width: ie.width,
          height: ie.height,
          image: img,
          opacity: ie.opacity,
          rotation: ie.rotation,
          cornerRadius: ie.cornerRadius,
          stroke: ie.borderColor,
          strokeWidth: ie.borderWidth,
        });
        layer.add(node);
      } catch {
        // If image fails to load, skip
      }

    } else if (el.type === 'shape') {
      const se = el as ShapeElement;
      let node: Konva.Shape;

      switch (se.shapeType) {
        case 'rectangle':
          node = new Konva.Rect({
            x: se.x, y: se.y, width: se.width, height: se.height,
            fill: se.fill, stroke: se.stroke, strokeWidth: se.strokeWidth,
            opacity: se.opacity, rotation: se.rotation,
            cornerRadius: se.cornerRadius,
          });
          break;
        case 'circle':
          node = new Konva.Ellipse({
            x: se.x + se.width / 2, y: se.y + se.height / 2,
            radiusX: se.width / 2, radiusY: se.height / 2,
            fill: se.fill, stroke: se.stroke, strokeWidth: se.strokeWidth,
            opacity: se.opacity, rotation: se.rotation,
          });
          break;
        case 'triangle':
          node = new Konva.RegularPolygon({
            x: se.x + se.width / 2, y: se.y + se.height / 2,
            sides: 3, radius: Math.min(se.width, se.height) / 2,
            fill: se.fill, stroke: se.stroke, strokeWidth: se.strokeWidth,
            opacity: se.opacity, rotation: se.rotation,
          });
          break;
        case 'line':
          node = new Konva.Line({
            points: [se.x, se.y + se.height / 2, se.x + se.width, se.y + se.height / 2],
            stroke: se.stroke || se.fill, strokeWidth: se.strokeWidth || 2,
            opacity: se.opacity, rotation: se.rotation,
          });
          break;
        case 'star':
          node = new Konva.Star({
            x: se.x + se.width / 2, y: se.y + se.height / 2,
            numPoints: 5,
            innerRadius: Math.min(se.width, se.height) / 4,
            outerRadius: Math.min(se.width, se.height) / 2,
            fill: se.fill, stroke: se.stroke, strokeWidth: se.strokeWidth,
            opacity: se.opacity, rotation: se.rotation,
          });
          break;
        case 'arrow':
          node = new Konva.Arrow({
            points: [se.x, se.y + se.height / 2, se.x + se.width, se.y + se.height / 2],
            pointerLength: 10, pointerWidth: 10,
            fill: se.fill, stroke: se.stroke || se.fill,
            strokeWidth: se.strokeWidth || 2,
            opacity: se.opacity, rotation: se.rotation,
          });
          break;
        case 'diamond':
          node = new Konva.RegularPolygon({
            x: se.x + se.width / 2, y: se.y + se.height / 2,
            sides: 4, radius: Math.min(se.width, se.height) / 2,
            fill: se.fill, stroke: se.stroke, strokeWidth: se.strokeWidth,
            opacity: se.opacity, rotation: se.rotation + 45,
          });
          break;
        default:
          node = new Konva.Rect({
            x: se.x, y: se.y, width: se.width, height: se.height,
            fill: se.fill, stroke: se.stroke, strokeWidth: se.strokeWidth,
            opacity: se.opacity, rotation: se.rotation,
          });
      }
      layer.add(node);
    }
  }

  layer.draw();

  // Export at 2x resolution for high quality
  const dataUrl = stage.toDataURL({
    pixelRatio: 2,
    mimeType: 'image/png',
  });

  // Cleanup
  stage.destroy();
  document.body.removeChild(container);

  return dataUrl;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
