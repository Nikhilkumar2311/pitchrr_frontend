// types/deck.ts
export type ElementType = "text" | "image";

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  fontSize: number;
  fill: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  width: number;
  height: number;
}

export type SlideElement = TextElement | ImageElement;

export interface Slide {
  id: string;
  elements: SlideElement[];
}

export interface Deck {
  slides: Slide[];
}
