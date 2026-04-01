/**
 * AI Slide Data → DeckDocument Converter
 *
 * Converts AI-generated pitch deck data (from the backend AI service)
 * into the editor-compatible DeckDocument format with positioned elements.
 *
 * AI FORMAT (input):
 *   { slides: [{ title, content, type?, bullet_points?, headline?, image?, chart? }] }
 *
 * EDITOR FORMAT (output):
 *   DeckDocument with EditorSlide[] containing SlideElement[] (text, shapes, images)
 *
 * DESIGN DECISIONS:
 * - Each AI slide becomes one EditorSlide with auto-positioned elements
 * - Title → large text element at top
 * - Content → body text element below title
 * - Bullet points → formatted text with bullet characters
 * - Headline → accent-colored subtitle text
 * - Images → ImageElement
 * - Slide types get different background colors for visual variety
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  DeckDocument,
  EditorSlide,
  SlideElement,
} from '@/types/deck-editor.types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/deck-editor.types';
import {
  createTextElement,
  createShapeElement,
  createImageElement,
} from '@/store/useDeckEditorStore';

// =============================================================================
// AI SLIDE TYPES (matches backend response)
// =============================================================================

export interface AISlide {
  title: string;
  content: string;
  type?: string;
  bullet_points?: string[];
  headline?: string;
  image?: string;
  chart?: {
    type: 'pie' | 'bar' | 'line' | 'radar' | 'none';
    title?: string;
    data: Array<{ name: string; value: number }>;
  };
}

export interface AIPitchDeckData {
  slides: AISlide[];
}

// =============================================================================
// SLIDE TYPE → BACKGROUND MAPPING
// =============================================================================

const SLIDE_BACKGROUNDS: Record<string, string> = {
  title: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  problem: '#1E293B',
  solution: '#FFFFFF',
  market: '#0F172A',
  'market_size': '#0F172A',
  product: '#FFFFFF',
  traction: '#F8FAFC',
  'business_model': '#1E293B',
  competition: '#FFFFFF',
  team: '#F8FAFC',
  financials: '#0F172A',
  ask: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  vision: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  default: '#FFFFFF',
};

function getBackgroundForSlide(type: string | undefined, index: number): string {
  if (type && SLIDE_BACKGROUNDS[type.toLowerCase()]) {
    return SLIDE_BACKGROUNDS[type.toLowerCase()];
  }
  // Alternate between light and dark for visual variety
  return index % 2 === 0 ? '#FFFFFF' : '#1E293B';
}

function isDarkBackground(bg: string): boolean {
  if (bg.includes('gradient')) return true;
  const darkColors = ['#1E293B', '#0F172A', '#111827', '#1F2937'];
  return darkColors.includes(bg);
}

// =============================================================================
// CONVERTER
// =============================================================================

/**
 * Convert AI-generated pitch deck data to DeckDocument format.
 *
 * @param aiData - The AI response containing slides
 * @param deckTitle - Optional title for the deck
 * @returns A fully-formed DeckDocument ready for the editor
 */
export function convertAIToDeckDocument(
  aiData: AIPitchDeckData,
  deckTitle: string = 'AI Pitch Deck'
): DeckDocument {
  const slides: EditorSlide[] = aiData.slides.map((aiSlide, index) =>
    convertAISlide(aiSlide, index)
  );

  return {
    title: deckTitle,
    slides,
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
  };
}

/**
 * Convert a single AI slide to an EditorSlide with positioned elements.
 */
function convertAISlide(aiSlide: AISlide, slideIndex: number): EditorSlide {
  const elements: SlideElement[] = [];
  let zIndex = 1;
  const bg = getBackgroundForSlide(aiSlide.type, slideIndex);
  const isDark = isDarkBackground(bg);
  const textColor = isDark ? '#F8FAFC' : '#1E293B';
  const subtitleColor = isDark ? '#CBD5E1' : '#64748B';
  const accentColor = isDark ? '#60A5FA' : '#3B82F6';

  const isTitle = aiSlide.type?.toLowerCase() === 'title' || slideIndex === 0;

  // ═══════════════════════════════════════════════════════════════════════════
  // DECORATIVE ACCENT BAR (top)
  // ═══════════════════════════════════════════════════════════════════════════
  elements.push(
    createShapeElement('rectangle', {
      x: 0,
      y: 0,
      width: CANVAS_WIDTH,
      height: 4,
      fill: accentColor,
      cornerRadius: 0,
      zIndex: zIndex++,
      locked: true,
      name: 'Accent bar',
    })
  );

  if (isTitle) {
    // ═════════════════════════════════════════════════════════════════════════
    // TITLE SLIDE LAYOUT (centered)
    // ═════════════════════════════════════════════════════════════════════════

    // Title — large, centered
    elements.push(
      createTextElement({
        content: aiSlide.title || 'Untitled',
        x: 80,
        y: CANVAS_HEIGHT * 0.28,
        width: CANVAS_WIDTH - 160,
        height: 80,
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        fill: textColor,
        zIndex: zIndex++,
        name: 'Title',
      })
    );

    // Divider line
    elements.push(
      createShapeElement('line', {
        x: CANVAS_WIDTH / 2 - 40,
        y: CANVAS_HEIGHT * 0.28 + 90,
        width: 80,
        height: 3,
        fill: accentColor,
        strokeWidth: 3,
        zIndex: zIndex++,
        name: 'Divider',
      })
    );

    // Content / tagline — below divider
    if (aiSlide.content) {
      elements.push(
        createTextElement({
          content: normalizeContent(aiSlide.content),
          x: 120,
          y: CANVAS_HEIGHT * 0.28 + 110,
          width: CANVAS_WIDTH - 240,
          height: 60,
          fontSize: 20,
          textAlign: 'center',
          fill: subtitleColor,
          zIndex: zIndex++,
          name: 'Tagline',
        })
      );
    }

    // Headline if present
    if (aiSlide.headline) {
      elements.push(
        createTextElement({
          content: aiSlide.headline,
          x: 120,
          y: CANVAS_HEIGHT * 0.28 + 180,
          width: CANVAS_WIDTH - 240,
          height: 40,
          fontSize: 16,
          fontStyle: 'italic',
          textAlign: 'center',
          fill: accentColor,
          zIndex: zIndex++,
          name: 'Headline',
        })
      );
    }
  } else {
    // ═════════════════════════════════════════════════════════════════════════
    // CONTENT SLIDE LAYOUT (title + body split)
    // ═════════════════════════════════════════════════════════════════════════

    const hasImage = !!aiSlide.image;
    const hasBullets = aiSlide.bullet_points && aiSlide.bullet_points.length > 0;
    const contentWidth = hasImage ? CANVAS_WIDTH * 0.55 : CANVAS_WIDTH - 120;

    // Title — top left
    elements.push(
      createTextElement({
        content: aiSlide.title || `Slide ${slideIndex + 1}`,
        x: 60,
        y: 30,
        width: contentWidth,
        height: 50,
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
        fill: textColor,
        zIndex: zIndex++,
        name: 'Title',
      })
    );

    // Divider line under title
    elements.push(
      createShapeElement('line', {
        x: 60,
        y: 85,
        width: 60,
        height: 3,
        fill: accentColor,
        strokeWidth: 3,
        zIndex: zIndex++,
        name: 'Divider',
      })
    );

    // Headline (if present)
    let contentY = 100;
    if (aiSlide.headline) {
      elements.push(
        createTextElement({
          content: aiSlide.headline,
          x: 60,
          y: contentY,
          width: contentWidth,
          height: 35,
          fontSize: 18,
          fontWeight: 'bold',
          fill: accentColor,
          zIndex: zIndex++,
          name: 'Headline',
        })
      );
      contentY += 40;
    }

    // Content paragraph
    if (aiSlide.content) {
      const contentText = normalizeContent(aiSlide.content);
      const contentHeight = hasBullets ? 60 : 120;
      elements.push(
        createTextElement({
          content: contentText,
          x: 60,
          y: contentY,
          width: contentWidth,
          height: contentHeight,
          fontSize: 16,
          fill: subtitleColor,
          lineHeight: 1.5,
          zIndex: zIndex++,
          name: 'Content',
        })
      );
      contentY += contentHeight + 10;
    }

    // Bullet points
    if (hasBullets) {
      const bulletText = aiSlide.bullet_points!
        .map((point) => `•  ${point}`)
        .join('\n');

      const bulletHeight = Math.min(
        CANVAS_HEIGHT - contentY - 30,
        aiSlide.bullet_points!.length * 28 + 10
      );

      elements.push(
        createTextElement({
          content: bulletText,
          x: 60,
          y: contentY,
          width: contentWidth,
          height: bulletHeight,
          fontSize: 14,
          fill: textColor,
          lineHeight: 1.8,
          zIndex: zIndex++,
          name: 'Bullet Points',
        })
      );
    }

    // Image (right side)
    if (hasImage && aiSlide.image) {
      elements.push(
        createImageElement(aiSlide.image, {
          x: CANVAS_WIDTH * 0.58,
          y: 30,
          width: CANVAS_WIDTH * 0.38,
          height: CANVAS_HEIGHT - 60,
          cornerRadius: 12,
          zIndex: zIndex++,
          name: 'Slide Image',
        })
      );
    }

    // Chart data → formatted text table (since Konva doesn't render Recharts)
    if (aiSlide.chart && aiSlide.chart.type !== 'none' && aiSlide.chart.data?.length > 0) {
      const chartTitle = aiSlide.chart.title || 'Data';
      const chartLines = aiSlide.chart.data
        .map((d) => `${d.name}: ${d.value}`)
        .join('\n');

      // Chart container background
      elements.push(
        createShapeElement('rectangle', {
          x: hasImage ? 60 : CANVAS_WIDTH * 0.55,
          y: CANVAS_HEIGHT * 0.55,
          width: hasImage ? contentWidth : CANVAS_WIDTH * 0.4,
          height: CANVAS_HEIGHT * 0.38,
          fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          cornerRadius: 12,
          stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          strokeWidth: 1,
          zIndex: zIndex++,
          name: 'Chart bg',
        })
      );

      elements.push(
        createTextElement({
          content: `📊 ${chartTitle}\n\n${chartLines}`,
          x: (hasImage ? 60 : CANVAS_WIDTH * 0.55) + 16,
          y: CANVAS_HEIGHT * 0.55 + 12,
          width: (hasImage ? contentWidth : CANVAS_WIDTH * 0.4) - 32,
          height: CANVAS_HEIGHT * 0.38 - 24,
          fontSize: 13,
          fill: textColor,
          lineHeight: 1.6,
          zIndex: zIndex++,
          name: 'Chart data',
        })
      );
    }
  }

  // Slide number (bottom right)
  elements.push(
    createTextElement({
      content: `${slideIndex + 1}`,
      x: CANVAS_WIDTH - 50,
      y: CANVAS_HEIGHT - 30,
      width: 30,
      height: 20,
      fontSize: 11,
      textAlign: 'right',
      fill: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
      zIndex: zIndex++,
      locked: true,
      name: 'Slide number',
    })
  );

  return {
    id: uuidv4(),
    elements,
    background: bg,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Normalize content: if it's an array, join into paragraph.
 */
function normalizeContent(content: unknown): string {
  if (Array.isArray(content)) {
    return content.join('. ');
  }
  return String(content || '');
}
