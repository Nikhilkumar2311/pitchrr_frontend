// features/pitchDeck/api/deck.api.ts
import axios from "axios";
import type { Deck } from "./deck";

const API = "http://localhost:5000";

export const saveDeck = async (deck: Deck) => {
  const res = await axios.post(`${API}/save`, deck);
  return res.data;
};

export const loadDeck = async (): Promise<Deck> => {
  const res = await axios.get(`${API}/load`);
  return res.data;
};
