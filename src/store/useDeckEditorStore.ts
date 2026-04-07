/**
 * Pitch Deck Editor — Zustand Store
 *
 * Central state management for the slide editor.
 * Handles slides, elements, selection, undo/redo, clipboard, and dirty-tracking.
 *
 * ARCHITECTURE:
 * - All mutations go through store actions (single source of truth)
 * - History is pushed BEFORE each mutation for undo/redo
 * - `isDirty` tracks unsaved changes
 *
 * USAGE:
 *   import { useDeckEditorStore } from '@/store/useDeckEditorStore';
 *   const { addElement, undo, redo } = useDeckEditorStore();
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  DeckDocument,
  EditorSlide,
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
  ShapeType,
  HistorySnapshot,
  ClipboardData,
} from '@/types/deck-editor.types';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MAX_HISTORY_SIZE,
} from '@/types/deck-editor.types';

// =============================================================================
// HELPERS — Element Factories
// =============================================================================

function createDefaultSlide(background = '#FFFFFF'): EditorSlide {
  return {
    id: uuidv4(),
    elements: [],
    background,
  };
}

function getNextZIndex(elements: SlideElement[]): number {
  if (elements.length === 0) return 1;
  return Math.max(...elements.map((el) => el.zIndex)) + 1;
}

export function createTextElement(
  overrides: Partial<TextElement> = {}
): TextElement {
  return {
    id: uuidv4(),
    type: 'text',
    x: 100,
    y: 100,
    width: 300,
    height: 60,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    zIndex: 0,
    locked: false,
    visible: true,
    content: 'Double click to edit',
    fontSize: 24,
    fontFamily: 'Inter',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left',
    lineHeight: 1.4,
    letterSpacing: 0,
    fill: '#1E293B',
    padding: 8,
    ...overrides,
  };
}

export function createImageElement(
  src: string,
  overrides: Partial<ImageElement> = {}
): ImageElement {
  return {
    id: uuidv4(),
    type: 'image',
    x: 100,
    y: 100,
    width: 300,
    height: 200,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    zIndex: 0,
    locked: false,
    visible: true,
    src,
    objectFit: 'cover',
    cornerRadius: 0,
    borderColor: 'transparent',
    borderWidth: 0,
    ...overrides,
  };
}

export function createShapeElement(
  shapeType: ShapeType,
  overrides: Partial<ShapeElement> = {}
): ShapeElement {
  const defaults: Record<ShapeType, Partial<ShapeElement>> = {
    rectangle: { width: 200, height: 120, cornerRadius: 8 },
    circle: { width: 150, height: 150, cornerRadius: 0 },
    triangle: { width: 160, height: 140, cornerRadius: 0 },
    line: { width: 300, height: 4, cornerRadius: 0 },
    star: { width: 150, height: 150, cornerRadius: 0 },
    arrow: { width: 250, height: 40, cornerRadius: 0 },
    diamond: { width: 150, height: 150, cornerRadius: 0 },
  };

  return {
    id: uuidv4(),
    type: 'shape',
    shapeType,
    x: 150,
    y: 150,
    width: 200,
    height: 120,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    zIndex: 0,
    locked: false,
    visible: true,
    fill: '#3B82F6',
    stroke: 'transparent',
    strokeWidth: 0,
    cornerRadius: 0,
    ...defaults[shapeType],
    ...overrides,
  };
}

// =============================================================================
// STORE INTERFACE
// =============================================================================

interface DeckEditorState {
  // Core data
  deck: DeckDocument;
  activeSlideIndex: number;
  selectedElementId: string | null;
  selectedElementIds: string[]; // multi-select via Shift+Click

  // Editor state
  isDirty: boolean;
  isTextEditing: boolean; // true when inline-editing text on canvas

  // History (undo/redo)
  undoStack: HistorySnapshot[];
  redoStack: HistorySnapshot[];

  // Clipboard
  clipboard: ClipboardData | null;

  // =========================================================================
  // DECK ACTIONS
  // =========================================================================
  setDeck: (deck: DeckDocument) => void;
  setTitle: (title: string) => void;
  markSaved: () => void;
  resetEditor: () => void;

  // =========================================================================
  // SLIDE ACTIONS
  // =========================================================================
  addSlide: (background?: string) => void;
  deleteSlide: (index: number) => void;
  duplicateSlide: (index: number) => void;
  setActiveSlide: (index: number) => void;
  setSlideBackground: (background: string) => void;
  reorderSlides: (fromIndex: number, toIndex: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;

  // =========================================================================
  // ELEMENT ACTIONS
  // =========================================================================
  addElement: (element: SlideElement) => void;
  addText: (overrides?: Partial<TextElement>) => void;
  addImage: (src: string, overrides?: Partial<ImageElement>) => void;
  addShape: (shapeType: ShapeType, overrides?: Partial<ShapeElement>) => void;
  updateElement: (id: string, updates: Partial<SlideElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  moveGroup: (groupId: string, dx: number, dy: number) => void;

  // Selection
  selectElement: (id: string | null) => void;
  toggleSelectElement: (id: string) => void; // Shift+Click multi-select
  clearSelection: () => void;
  groupSelected: () => void;
  groupOverlapping: (id: string) => void; // group all elements inside the selected one's bounds
  ungroupElement: (id: string) => void;

  // Layer ordering
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  // Text editing mode
  setTextEditing: (editing: boolean) => void;

  // =========================================================================
  // HISTORY (UNDO / REDO)
  // =========================================================================
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // =========================================================================
  // CLIPBOARD (COPY / PASTE)
  // =========================================================================
  copyElement: () => void;
  pasteElement: () => void;

  // =========================================================================
  // COMPUTED / GETTERS
  // =========================================================================
  getActiveSlide: () => EditorSlide | undefined;
  getSelectedElement: () => SlideElement | undefined;
}

// =============================================================================
// DEFAULT DECK
// =============================================================================

function createDefaultDeck(): DeckDocument {
  return {
    title: 'Untitled Deck',
    slides: [
      createDefaultSlide('#FFFFFF'),
    ],
    canvasWidth: CANVAS_WIDTH,
    canvasHeight: CANVAS_HEIGHT,
  };
}

// =============================================================================
// STORE IMPLEMENTATION
// =============================================================================

export const useDeckEditorStore = create<DeckEditorState>((set, get) => ({
  // Initial state
  deck: createDefaultDeck(),
  activeSlideIndex: 0,
  selectedElementId: null,
  selectedElementIds: [],
  isDirty: false,
  isTextEditing: false,
  undoStack: [],
  redoStack: [],
  clipboard: null,

  // ===========================================================================
  // DECK ACTIONS
  // ===========================================================================

  setDeck: (deck) =>
    set({
      deck,
      activeSlideIndex: 0,
      selectedElementId: null,
      selectedElementIds: [],
      isDirty: false,
      undoStack: [],
      redoStack: [],
    }),

  setTitle: (title) =>
    set((state) => ({
      deck: { ...state.deck, title },
      isDirty: true,
    })),

  markSaved: () => set({ isDirty: false }),

  resetEditor: () =>
    set({
      deck: createDefaultDeck(),
      activeSlideIndex: 0,
      selectedElementId: null,
      selectedElementIds: [],
      isDirty: false,
      undoStack: [],
      redoStack: [],
      clipboard: null,
    }),

  // ===========================================================================
  // SLIDE ACTIONS
  // ===========================================================================

  addSlide: (background = '#FFFFFF') => {
    get().pushHistory();
    set((state) => {
      const newSlides = [...state.deck.slides, createDefaultSlide(background)];
      return {
        deck: { ...state.deck, slides: newSlides },
        activeSlideIndex: newSlides.length - 1,
        selectedElementId: null,
        isDirty: true,
      };
    });
  },

  deleteSlide: (index) => {
    const state = get();
    if (state.deck.slides.length <= 1) return; // Cannot delete the only slide

    state.pushHistory();
    set((s) => {
      const newSlides = s.deck.slides.filter((_, i) => i !== index);
      const newActiveIndex = Math.min(s.activeSlideIndex, newSlides.length - 1);
      return {
        deck: { ...s.deck, slides: newSlides },
        activeSlideIndex: newActiveIndex,
        selectedElementId: null,
        isDirty: true,
      };
    });
  },

  duplicateSlide: (index) => {
    get().pushHistory();
    set((state) => {
      const slide = state.deck.slides[index];
      if (!slide) return state;

      const duplicated: EditorSlide = {
        ...JSON.parse(JSON.stringify(slide)),
        id: uuidv4(),
        elements: slide.elements.map((el) => ({
          ...JSON.parse(JSON.stringify(el)),
          id: uuidv4(),
        })),
      };

      const newSlides = [...state.deck.slides];
      newSlides.splice(index + 1, 0, duplicated);

      return {
        deck: { ...state.deck, slides: newSlides },
        activeSlideIndex: index + 1,
        selectedElementId: null,
        isDirty: true,
      };
    });
  },

  setActiveSlide: (index) =>
    set({
      activeSlideIndex: index,
      selectedElementId: null,
      isTextEditing: false,
    }),

  setSlideBackground: (background) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      slides[state.activeSlideIndex] = {
        ...slides[state.activeSlideIndex],
        background,
      };
      return {
        deck: { ...state.deck, slides },
        isDirty: true,
      };
    });
  },

  reorderSlides: (fromIndex, toIndex) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      const [moved] = slides.splice(fromIndex, 1);
      slides.splice(toIndex, 0, moved);
      return {
        deck: { ...state.deck, slides },
        activeSlideIndex: toIndex,
        isDirty: true,
      };
    });
  },

  nextSlide: () => {
    const state = get();
    const next = state.activeSlideIndex + 1;
    if (next < state.deck.slides.length) {
      set({ activeSlideIndex: next, selectedElementId: null, isTextEditing: false });
    }
  },

  prevSlide: () => {
    const state = get();
    const prev = state.activeSlideIndex - 1;
    if (prev >= 0) {
      set({ activeSlideIndex: prev, selectedElementId: null, isTextEditing: false });
    }
  },

  // ===========================================================================
  // ELEMENT ACTIONS
  // ===========================================================================

  addElement: (element) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      const el = {
        ...element,
        zIndex: getNextZIndex(slide.elements),
      };
      slide.elements = [...slide.elements, el];
      slides[state.activeSlideIndex] = slide;
      return {
        deck: { ...state.deck, slides },
        selectedElementId: el.id,
        isDirty: true,
      };
    });
  },

  addText: (overrides) => {
    const el = createTextElement(overrides);
    get().addElement(el);
  },

  addImage: (src, overrides) => {
    const el = createImageElement(src, overrides);
    get().addElement(el);
  },

  addShape: (shapeType, overrides) => {
    const el = createShapeElement(shapeType, overrides);
    get().addElement(el);
  },

  updateElement: (id, updates) => {
    // Don't push history for every drag move — history is pushed by onDragStart / onTransformStart
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      slide.elements = slide.elements.map((el) =>
        el.id === id ? { ...el, ...updates } as SlideElement : el
      );
      slides[state.activeSlideIndex] = slide;
      return {
        deck: { ...state.deck, slides },
        isDirty: true,
      };
    });
  },

  moveGroup: (groupId, dx, dy) => {
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      slide.elements = slide.elements.map((el) =>
        el.groupId === groupId
          ? { ...el, x: el.x + dx, y: el.y + dy } as SlideElement
          : el
      );
      slides[state.activeSlideIndex] = slide;
      return {
        deck: { ...state.deck, slides },
        isDirty: true,
      };
    });
  },

  deleteElement: (id) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      slide.elements = slide.elements.filter((el) => el.id !== id);
      slides[state.activeSlideIndex] = slide;
      return {
        deck: { ...state.deck, slides },
        selectedElementId:
          state.selectedElementId === id ? null : state.selectedElementId,
        isDirty: true,
      };
    });
  },

  duplicateElement: (id) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      const original = slide.elements.find((el) => el.id === id);
      if (!original) return state;

      const duplicated: SlideElement = {
        ...JSON.parse(JSON.stringify(original)),
        id: uuidv4(),
        x: original.x + 20,
        y: original.y + 20,
        zIndex: getNextZIndex(slide.elements),
        name: original.name ? `${original.name} (copy)` : undefined,
      };

      slide.elements = [...slide.elements, duplicated];
      slides[state.activeSlideIndex] = slide;

      return {
        deck: { ...state.deck, slides },
        selectedElementId: duplicated.id,
        isDirty: true,
      };
    });
  },

  // Selection
  selectElement: (id) => set({ selectedElementId: id, selectedElementIds: id ? [id] : [], isTextEditing: false }),
  toggleSelectElement: (id) => {
    const state = get();
    const ids = [...state.selectedElementIds];
    if (ids.includes(id)) {
      const filtered = ids.filter((eid) => eid !== id);
      set({ selectedElementIds: filtered, selectedElementId: filtered[filtered.length - 1] || null, isTextEditing: false });
    } else {
      ids.push(id);
      set({ selectedElementIds: ids, selectedElementId: id, isTextEditing: false });
    }
  },
  clearSelection: () =>
    set({ selectedElementId: null, selectedElementIds: [], isTextEditing: false }),
  groupSelected: () => {
    const state = get();
    if (state.selectedElementIds.length < 2) return;
    state.pushHistory();
    const groupId = uuidv4().slice(0, 12);
    set((s) => {
      const slides = [...s.deck.slides];
      const slide = { ...slides[s.activeSlideIndex] };
      slide.elements = slide.elements.map((el) =>
        s.selectedElementIds.includes(el.id)
          ? { ...el, groupId } as SlideElement
          : el
      );
      slides[s.activeSlideIndex] = slide;
      return { deck: { ...s.deck, slides }, isDirty: true };
    });
  },
  ungroupElement: (id) => {
    const state = get();
    const slide = state.deck.slides[state.activeSlideIndex];
    const el = slide?.elements.find((e) => e.id === id);
    if (!el?.groupId) return;
    const gid = el.groupId;
    state.pushHistory();
    set((s) => {
      const slides = [...s.deck.slides];
      const sl = { ...slides[s.activeSlideIndex] };
      sl.elements = sl.elements.map((e) =>
        e.groupId === gid ? { ...e, groupId: undefined } as SlideElement : e
      );
      slides[s.activeSlideIndex] = sl;
      return { deck: { ...s.deck, slides }, isDirty: true };
    });
  },
  groupOverlapping: (id) => {
    const state = get();
    const slide = state.deck.slides[state.activeSlideIndex];
    const anchor = slide?.elements.find((e) => e.id === id);
    if (!anchor) return;
    // Find elements whose center falls inside the anchor's bounding box
    const ax = anchor.x, ay = anchor.y;
    const aw = anchor.width * (anchor.scaleX ?? 1);
    const ah = anchor.height * (anchor.scaleY ?? 1);
    const inside = slide.elements.filter((el) => {
      const cx = el.x + (el.width * (el.scaleX ?? 1)) / 2;
      const cy = el.y + (el.height * (el.scaleY ?? 1)) / 2;
      return cx >= ax && cx <= ax + aw && cy >= ay && cy <= ay + ah;
    });
    if (inside.length < 2) return;
    state.pushHistory();
    const groupId = uuidv4().slice(0, 12);
    set((s) => {
      const slides = [...s.deck.slides];
      const sl = { ...slides[s.activeSlideIndex] };
      const ids = new Set(inside.map((e) => e.id));
      sl.elements = sl.elements.map((el) =>
        ids.has(el.id) ? { ...el, groupId } as SlideElement : el
      );
      slides[s.activeSlideIndex] = sl;
      return { deck: { ...s.deck, slides }, isDirty: true };
    });
  },

  // Layer ordering
  bringForward: (id) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      const sorted = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((el) => el.id === id);
      if (idx < sorted.length - 1) {
        const temp = sorted[idx].zIndex;
        sorted[idx] = { ...sorted[idx], zIndex: sorted[idx + 1].zIndex };
        sorted[idx + 1] = { ...sorted[idx + 1], zIndex: temp };
      }
      slide.elements = sorted;
      slides[state.activeSlideIndex] = slide;
      return { deck: { ...state.deck, slides }, isDirty: true };
    });
  },

  sendBackward: (id) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      const sorted = [...slide.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((el) => el.id === id);
      if (idx > 0) {
        const temp = sorted[idx].zIndex;
        sorted[idx] = { ...sorted[idx], zIndex: sorted[idx - 1].zIndex };
        sorted[idx - 1] = { ...sorted[idx - 1], zIndex: temp };
      }
      slide.elements = sorted;
      slides[state.activeSlideIndex] = slide;
      return { deck: { ...state.deck, slides }, isDirty: true };
    });
  },

  bringToFront: (id) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      const maxZ = getNextZIndex(slide.elements);
      slide.elements = slide.elements.map((el) =>
        el.id === id ? { ...el, zIndex: maxZ } : el
      );
      slides[state.activeSlideIndex] = slide;
      return { deck: { ...state.deck, slides }, isDirty: true };
    });
  },

  sendToBack: (id) => {
    get().pushHistory();
    set((state) => {
      const slides = [...state.deck.slides];
      const slide = { ...slides[state.activeSlideIndex] };
      const minZ = Math.min(...slide.elements.map((el) => el.zIndex));
      slide.elements = slide.elements.map((el) =>
        el.id === id ? { ...el, zIndex: minZ - 1 } : el
      );
      slides[state.activeSlideIndex] = slide;
      return { deck: { ...state.deck, slides }, isDirty: true };
    });
  },

  // Text editing mode
  setTextEditing: (editing) => set({ isTextEditing: editing }),

  // ===========================================================================
  // HISTORY (UNDO / REDO)
  // ===========================================================================

  pushHistory: () =>
    set((state) => {
      const snapshot: HistorySnapshot = {
        slides: JSON.parse(JSON.stringify(state.deck.slides)),
        activeSlideIndex: state.activeSlideIndex,
      };
      const undoStack = [...state.undoStack, snapshot].slice(-MAX_HISTORY_SIZE);
      return { undoStack, redoStack: [] }; // Clear redo on new action
    }),

  undo: () =>
    set((state) => {
      if (state.undoStack.length === 0) return state;

      const undoStack = [...state.undoStack];
      const snapshot = undoStack.pop()!;

      // Save current state to redo stack
      const redoSnapshot: HistorySnapshot = {
        slides: JSON.parse(JSON.stringify(state.deck.slides)),
        activeSlideIndex: state.activeSlideIndex,
      };

      return {
        undoStack,
        redoStack: [...state.redoStack, redoSnapshot],
        deck: { ...state.deck, slides: snapshot.slides },
        activeSlideIndex: snapshot.activeSlideIndex,
        selectedElementId: null,
        isDirty: true,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.redoStack.length === 0) return state;

      const redoStack = [...state.redoStack];
      const snapshot = redoStack.pop()!;

      // Save current state to undo stack
      const undoSnapshot: HistorySnapshot = {
        slides: JSON.parse(JSON.stringify(state.deck.slides)),
        activeSlideIndex: state.activeSlideIndex,
      };

      return {
        redoStack,
        undoStack: [...state.undoStack, undoSnapshot],
        deck: { ...state.deck, slides: snapshot.slides },
        activeSlideIndex: snapshot.activeSlideIndex,
        selectedElementId: null,
        isDirty: true,
      };
    }),

  // ===========================================================================
  // CLIPBOARD (COPY / PASTE)
  // ===========================================================================

  copyElement: () => {
    const state = get();
    const slide = state.deck.slides[state.activeSlideIndex];
    if (!slide || !state.selectedElementId) return;

    const element = slide.elements.find(
      (el) => el.id === state.selectedElementId
    );
    if (!element) return;

    set({
      clipboard: {
        elements: [JSON.parse(JSON.stringify(element))],
        sourceSlideId: slide.id,
      },
    });
  },

  pasteElement: () => {
    const state = get();
    if (!state.clipboard || state.clipboard.elements.length === 0) return;

    state.pushHistory();
    set((s) => {
      const slides = [...s.deck.slides];
      const slide = { ...slides[s.activeSlideIndex] };

      const pastedElements = s.clipboard!.elements.map((el) => ({
        ...JSON.parse(JSON.stringify(el)),
        id: uuidv4(),
        x: el.x + 30,
        y: el.y + 30,
        zIndex: getNextZIndex(slide.elements),
      }));

      slide.elements = [...slide.elements, ...pastedElements];
      slides[s.activeSlideIndex] = slide;

      return {
        deck: { ...s.deck, slides },
        selectedElementId: pastedElements[0]?.id || null,
        isDirty: true,
      };
    });
  },

  // ===========================================================================
  // COMPUTED / GETTERS
  // ===========================================================================

  getActiveSlide: () => {
    const state = get();
    return state.deck.slides[state.activeSlideIndex];
  },

  getSelectedElement: () => {
    const state = get();
    const slide = state.deck.slides[state.activeSlideIndex];
    if (!slide || !state.selectedElementId) return undefined;
    return slide.elements.find((el) => el.id === state.selectedElementId);
  },
}));
