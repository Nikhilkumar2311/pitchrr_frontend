/**
 * Ideas React Query Hooks
 * 
 * Hooks for managing startup ideas via the Core Service API.
 * 
 * DATA FLOW:
 * Frontend → Core Service (authenticated) → Database
 * 
 * All requests automatically include Clerk JWT via api.ts interceptor.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { trackIdeaSubmitted, trackIdeaDeleted } from '@/utils/analytics';

// =============================================================================
// TYPES
// =============================================================================

/** Input for creating a new idea */
export interface CreateIdeaInput {
    title: string;
    description: string;
    industry?: string;
    targetAudience?: string;
    problemSolved?: string;
    startupStage?: string;
    amount?: string;
}

/** Input for updating an existing idea */
export interface UpdateIdeaInput {
    title?: string;
    description?: string;
    industry?: string;
    targetAudience?: string;
    problemSolved?: string;
    startupStage?: string;
    amount?: string;
}

/** Startup idea returned from API */
export interface Idea {
    id: string;
    title: string;
    description: string;
    industry: string | null;
    targetAudience: string | null;
    problemSolved: string | null;
    startupStage: string | null;
    amount: string | null;
    userId: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
}

// =============================================================================
// QUERY KEYS
// =============================================================================

export const ideaKeys = {
    all: ['ideas'] as const,
    lists: () => [...ideaKeys.all, 'list'] as const,
    list: () => [...ideaKeys.lists()] as const,
    details: () => [...ideaKeys.all, 'detail'] as const,
    detail: (id: string) => [...ideaKeys.details(), id] as const,
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Fetch all ideas for the current user.
 * 
 * Usage:
 * ```tsx
 * const { data: ideas, isLoading } = useIdeas();
 * ```
 */
export function useIdeas() {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: ideaKeys.list(),
        queryFn: async (): Promise<Idea[]> => {
            const { data } = await api.get('/ideas');
            return data;
        },
        enabled: !!isSignedIn,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Fetch a single idea by ID.
 * 
 * Usage:
 * ```tsx
 * const { data: idea, isLoading } = useIdea(ideaId);
 * ```
 */
export function useIdea(ideaId: string | undefined) {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: ideaKeys.detail(ideaId || ''),
        queryFn: async (): Promise<Idea> => {
            const { data } = await api.get(`/ideas/${ideaId}`);
            return data;
        },
        enabled: !!isSignedIn && !!ideaId,
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Create a new startup idea.
 * 
 * Usage:
 * ```tsx
 * const { mutate: createIdea, isPending } = useCreateIdea();
 * 
 * createIdea({
 *     title: 'My Startup',
 *     description: 'A great idea...'
 * }, {
 *     onSuccess: (newIdea) => {
 *         navigate(`/dashboard/idea/${newIdea.id}`);
 *     }
 * });
 * ```
 */
export function useCreateIdea() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateIdeaInput): Promise<Idea> => {
            const { data } = await api.post('/ideas', input);
            return data;
        },
        onSuccess: (newIdea) => {
            // Add new idea to the cache
            queryClient.setQueryData<Idea[]>(ideaKeys.list(), (old) => {
                if (!old) return [newIdea];
                return [newIdea, ...old];
            });
            // Also add to individual cache
            queryClient.setQueryData(ideaKeys.detail(newIdea.id), newIdea);

            // Track analytics event
            trackIdeaSubmitted(newIdea.id, newIdea.title);

            toast.success('Idea created!');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create idea';
            toast.error(message);
        },
    });
}

/**
 * Update an existing idea.
 * 
 * Usage:
 * ```tsx
 * const { mutate: updateIdea } = useUpdateIdea(ideaId);
 * updateIdea({ title: 'New Title' });
 * ```
 */
export function useUpdateIdea(ideaId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateIdeaInput): Promise<Idea> => {
            const { data } = await api.put(`/ideas/${ideaId}`, input);
            return data;
        },
        onSuccess: (updatedIdea) => {
            // Update in list cache
            queryClient.setQueryData<Idea[]>(ideaKeys.list(), (old) => {
                if (!old) return [updatedIdea];
                return old.map((idea) =>
                    idea.id === ideaId ? updatedIdea : idea
                );
            });
            // Update individual cache
            queryClient.setQueryData(ideaKeys.detail(ideaId), updatedIdea);
            toast.success('Idea updated!');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update idea';
            toast.error(message);
        },
    });
}

/**
 * Delete an idea.
 * 
 * Usage:
 * ```tsx
 * const { mutate: deleteIdea } = useDeleteIdea();
 * deleteIdea(ideaId);
 * ```
 */
export function useDeleteIdea() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ideaId: string): Promise<void> => {
            await api.delete(`/ideas/${ideaId}`);
        },
        onSuccess: (_, ideaId) => {
            // Remove from list cache
            queryClient.setQueryData<Idea[]>(ideaKeys.list(), (old) => {
                if (!old) return [];
                return old.filter((idea) => idea.id !== ideaId);
            });
            // Invalidate individual cache
            queryClient.removeQueries({ queryKey: ideaKeys.detail(ideaId) });

            // Track analytics event
            trackIdeaDeleted(ideaId);

            toast.success('Idea deleted');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to delete idea';
            toast.error(message);
        },
    });
}

/**
 * Archive an idea.
 * 
 * Usage:
 * ```tsx
 * const { mutate: archiveIdea } = useArchiveIdea();
 * archiveIdea(ideaId);
 * ```
 */
export function useArchiveIdea() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ideaId: string): Promise<Idea> => {
            const { data } = await api.post(`/ideas/${ideaId}/archive`);
            return data;
        },
        onSuccess: (archivedIdea, ideaId) => {
            // Update in list cache
            queryClient.setQueryData<Idea[]>(ideaKeys.list(), (old) => {
                if (!old) return [];
                return old.map((idea) =>
                    idea.id === ideaId ? archivedIdea : idea
                );
            });
            // Update individual cache
            queryClient.setQueryData(ideaKeys.detail(ideaId), archivedIdea);
            toast.success('Idea archived');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to archive idea';
            toast.error(message);
        },
    });
}
