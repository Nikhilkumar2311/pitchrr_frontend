// store/useDeckStore.ts
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Deck, Slide, SlideElement, TextElement } from "./deck";

interface DeckState {
  slides: Slide[];
  activeSlideIndex: number;

  addText: () => void;
  updateElement: (id: string, updates: Partial<SlideElement>) => void;
  addSlide: () => void;
  setActiveSlide: (index: number) => void;
  setDeck: (deck: Deck) => void;
}

export const useDeckStore = create<DeckState>((set, get) => ({
  slides: [
    {
      id: uuidv4(),
      elements: [],
    },
  ],
  activeSlideIndex: 0,

  addText: () =>
    set((state) => {
      const slides = [...state.slides];

      const newText: TextElement = {
        id: uuidv4(),
        type: "text",
        text: "Double click to edit",
        x: 100,
        y: 100,
        fontSize: 20,
        fill: "#000",
      };

      slides[state.activeSlideIndex].elements.push(newText);

      return { slides };
    }),

  updateElement: (id, updates) =>
    set((state) => {
      const slides = [...state.slides];
      const slide = slides[state.activeSlideIndex];

      slide.elements = slide.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el,
      );

      return { slides };
    }),

  addSlide: () =>
    set((state) => ({
      slides: [...state.slides, { id: uuidv4(), elements: [] }],
    })),

  setActiveSlide: (index) => set({ activeSlideIndex: index }),

  setDeck: (deck) => set({ slides: deck.slides }),
}));
