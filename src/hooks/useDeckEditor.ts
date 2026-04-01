/**
 * Deck Editor React Query Hooks
 *
 * CRUD hooks for pitch deck editor, matching the backend endpoints:
 *   POST   /deck-editor           → createDeck
 *   GET    /deck-editor           → listDecks
 *   GET    /deck-editor/idea/:id  → listDecksByIdea
 *   GET    /deck-editor/:id       → getDeck
 *   PUT    /deck-editor/:id       → updateDeck
 *   DELETE /deck-editor/:id       → deleteDeck
 *
 * USAGE:
 *   import { useUserDecks, useDeck, useSaveDeck, useCreateDeck } from '@/hooks/useDeckEditor';
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import toast from 'react-hot-toast';
import type { DeckDocument } from '@/types/deck-editor.types';

// =============================================================================
// TYPES
// =============================================================================

export interface DeckListItem {
  id: string;
  title: string;
  ideaId: string | null;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DeckRecord {
  id: string;
  userId: string;
  ideaId: string | null;
  title: string;
  data: DeckDocument;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// QUERY KEYS
// =============================================================================

export const deckEditorKeys = {
  all: ['deck-editor'] as const,
  list: () => [...deckEditorKeys.all, 'list'] as const,
  byIdea: (ideaId: string) => [...deckEditorKeys.all, 'idea', ideaId] as const,
  single: (id: string) => [...deckEditorKeys.all, 'detail', id] as const,
};

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get all decks for the current user.
 */
export function useUserDecks() {
  return useQuery<DeckListItem[]>({
    queryKey: deckEditorKeys.list(),
    queryFn: async () => {
      const { data } = await api.get('/deck-editor');
      return data;
    },
  });
}

/**
 * Get decks for a specific idea.
 */
export function useDecksByIdea(ideaId: string | undefined) {
  return useQuery<DeckListItem[]>({
    queryKey: deckEditorKeys.byIdea(ideaId || ''),
    queryFn: async () => {
      const { data } = await api.get(`/deck-editor/idea/${ideaId}`);
      return data;
    },
    enabled: !!ideaId,
  });
}

/**
 * Get a single deck with full data.
 */
export function useDeck(deckId: string | undefined) {
  return useQuery<DeckRecord>({
    queryKey: deckEditorKeys.single(deckId || ''),
    queryFn: async () => {
      const { data } = await api.get(`/deck-editor/${deckId}`);
      return data;
    },
    enabled: !!deckId,
  });
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new deck.
 */
export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      data: DeckDocument;
      ideaId?: string;
    }) => {
      const { data } = await api.post('/deck-editor', payload);
      return data as DeckRecord;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: deckEditorKeys.list() });
      if (data.ideaId) {
        queryClient.invalidateQueries({
          queryKey: deckEditorKeys.byIdea(data.ideaId),
        });
      }
      toast.success('Deck created!');
    },
    onError: () => {
      toast.error('Failed to create deck');
    },
  });
}

/**
 * Update/save a deck.
 */
export function useSaveDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      deckId,
      ...updates
    }: {
      deckId: string;
      title?: string;
      data?: DeckDocument;
      thumbnail?: string;
    }) => {
      const { data } = await api.put(`/deck-editor/${deckId}`, updates);
      return data as DeckRecord;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: deckEditorKeys.single(data.id),
      });
      queryClient.invalidateQueries({ queryKey: deckEditorKeys.list() });
      toast.success('Deck saved!');
    },
    onError: () => {
      toast.error('Failed to save deck');
    },
  });
}

/**
 * Delete a deck.
 */
export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deckId: string) => {
      await api.delete(`/deck-editor/${deckId}`);
      return deckId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deckEditorKeys.list() });
      toast.success('Deck deleted');
    },
    onError: () => {
      toast.error('Failed to delete deck');
    },
  });
}
