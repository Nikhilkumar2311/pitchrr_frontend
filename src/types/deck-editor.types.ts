/**
 * Pitch Deck Editor — Type Definitions
 *
 * All types for the Canva/PowerPoint-style editor.
 * Every type is JSON-serializable for backend persistence.
 *
 * HIERARCHY:
 *   DeckDocument → EditorSlide[] → SlideElement[]
 *
 * ELEMENT TYPES:
 *   text   — Rich text with font controls
 *   image  — URL or base64 image
 *   shape  — Rectangle, circle, triangle, line, star, arrow
 */

// =============================================================================
// ELEMENT TYPES
// =============================================================================

export type ElementType = 'text' | 'image' | 'shape';

export type ShapeType =
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'line'
  | 'star'
  | 'arrow'
  | 'diamond';

export type FontWeight = 'normal' | 'bold';
export type FontStyle = 'normal' | 'italic';
export type TextDecoration = 'none' | 'underline' | 'line-through';
export type TextAlign = 'left' | 'center' | 'right';
export type ObjectFit = 'cover' | 'contain' | 'fill';

// =============================================================================
// BASE ELEMENT
// =============================================================================

/** Common properties shared by all elements */
export interface BaseElement {
  id: string;
  type: ElementType;

  // Position & size
  x: number;
  y: number;
  width: number;
  height: number;

  // Transform
  rotation: number;     // degrees
  scaleX: number;
  scaleY: number;

  // Appearance
  opacity: number;      // 0–1

  // Layer ordering
  zIndex: number;

  // Interaction
  locked: boolean;
  visible: boolean;

  // Optional name for layer panel
  name?: string;
}

// =============================================================================
// TEXT ELEMENT
// =============================================================================

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;

  // Typography
  fontSize: number;
  fontFamily: string;
  fontWeight: FontWeight;
  fontStyle: FontStyle;
  textDecoration: TextDecoration;
  textAlign: TextAlign;
  lineHeight: number;      // multiplier (1.2, 1.5, etc.)
  letterSpacing: number;   // px

  // Colors
  fill: string;            // text color

  // Padding inside text box
  padding: number;
}

// =============================================================================
// IMAGE ELEMENT
// =============================================================================

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;             // URL, data URL, or base64
  objectFit: ObjectFit;

  // Image effects
  cornerRadius: number;
  borderColor: string;
  borderWidth: number;
}

// =============================================================================
// SHAPE ELEMENT
// =============================================================================

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;

  // Fill
  fill: string;

  // Stroke
  stroke: string;
  strokeWidth: number;

  // Shape-specific
  cornerRadius: number;     // for rectangle
  points?: number[];         // for custom shapes / star points count
}

// =============================================================================
// UNION TYPE
// =============================================================================

export type SlideElement = TextElement | ImageElement | ShapeElement;

// =============================================================================
// SLIDE
// =============================================================================

export interface EditorSlide {
  id: string;
  elements: SlideElement[];

  // Background
  background: string;          // CSS color or gradient string
  backgroundImage?: string;    // Optional background image URL
}

// =============================================================================
// DECK DOCUMENT
// =============================================================================

export interface DeckDocument {
  id?: string;                 // Database ID (undefined for unsaved)
  title: string;

  // Slides
  slides: EditorSlide[];

  // Canvas dimensions (16:9 default)
  canvasWidth: number;         // default: 960
  canvasHeight: number;        // default: 540

  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// EDITOR STATE TYPES
// =============================================================================

/** Snapshot for undo/redo history */
export interface HistorySnapshot {
  slides: EditorSlide[];
  activeSlideIndex: number;
}

/** Clipboard for copy/paste */
export interface ClipboardData {
  elements: SlideElement[];
  sourceSlideId: string;
}

// =============================================================================
// DEFAULTS / FACTORIES
// =============================================================================

/** Default canvas dimensions (16:9) */
export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;

/** Maximum undo/redo history size */
export const MAX_HISTORY_SIZE = 50;

/** Available font families */
export const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Palatino',
  'Garamond',
  'Comic Sans MS',
  'Impact',
] as const;

/** Preset background colors */
export const PRESET_BACKGROUNDS = [
  '#FFFFFF',
  '#F8FAFC',
  '#F1F5F9',
  '#1E293B',
  '#0F172A',
  '#111827',
  '#1F2937',
  '#7C3AED',
  '#2563EB',
  '#059669',
  '#DC2626',
  '#D97706',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
] as const;

/** Font size presets */
export const FONT_SIZE_PRESETS = [
  { label: 'Small', value: 14 },
  { label: 'Body', value: 18 },
  { label: 'Large', value: 24 },
  { label: 'Heading 3', value: 32 },
  { label: 'Heading 2', value: 42 },
  { label: 'Heading 1', value: 56 },
  { label: 'Display', value: 72 },
] as const;
