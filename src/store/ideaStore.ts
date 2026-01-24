/**
 * Idea Store
 * Global store for managing the current startup idea across all modules
 * This allows auto-filling idea information when user enters or generates an idea
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StartupIdea {
    id?: string;
    title: string;
    description: string;
    problem?: string;
    solution?: string;
    targetMarket?: string;
    industry?: string;
}

interface IdeaState {
    currentIdea: StartupIdea | null;
    isIdeaSet: boolean;
    activeIdeaId: string | null;

    // Actions
    setIdea: (idea: StartupIdea) => void;
    updateIdea: (updates: Partial<StartupIdea>) => void;
    clearIdea: () => void;
    setActiveIdeaId: (id: string | null) => void;
}

export const useIdeaStore = create<IdeaState>()(
    persist(
        (set) => ({
            currentIdea: null,
            isIdeaSet: false,
            activeIdeaId: null,

            setIdea: (idea) => set({
                currentIdea: idea,
                isIdeaSet: true,
                activeIdeaId: idea.id || null
            }),

            updateIdea: (updates) => set((state) => ({
                currentIdea: state.currentIdea
                    ? { ...state.currentIdea, ...updates }
                    : null,
            })),

            clearIdea: () => set({ currentIdea: null, isIdeaSet: false, activeIdeaId: null }),

            setActiveIdeaId: (id) => set({ activeIdeaId: id }),
        }),
        {
            name: 'pitchrr-idea-storage',
        }
    )
);
