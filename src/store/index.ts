/**
 * Store Index
 * 
 * Re-exports all stores for cleaner imports.
 * Usage: import { useAuthStore, useUIStore, useIdeaStore } from '@/store';
 */

export { useUIStore } from './uiStore';
export { useIdeaStore, getStoredActiveIdeaId } from './ideaStore';
export type { StartupIdea } from './ideaStore';
