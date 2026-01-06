/**
 * Hooks Index
 * 
 * Re-exports all custom hooks.
 * 
 * USAGE:
 * import { useLocalStorage, useMediaQuery } from '@/hooks';
 * import { useIdeas, useCreateIdea } from '@/hooks';
 * import { useModuleData, useGenerateModule } from '@/hooks';
 */

export { useLocalStorage } from './useLocalStorage';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './useMediaQuery';

// API Hooks - Ideas
export {
    useIdeas,
    useIdea,
    useCreateIdea,
    useUpdateIdea,
    useDeleteIdea,
    useArchiveIdea,
    ideaKeys,
} from './useIdeas';
export type { CreateIdeaInput, UpdateIdeaInput, Idea } from './useIdeas';

// API Hooks - Modules
export {
    useAllModules,
    useModuleData,
    useGenerateModule,
    useJobStatus,
    moduleKeys,
} from './useModules';
export type { ModuleType, ModuleDataResponse, GenerateModuleResponse } from './useModules';
