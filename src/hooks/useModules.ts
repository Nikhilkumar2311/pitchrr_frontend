/**
 * Modules React Query Hooks
 * 
 * Hooks for AI module generation and data fetching via Core Service.
 * 
 * DATA FLOW:
 * 1. Frontend calls useGenerateModule → Core queues job
 * 2. Core returns 202 + jobId
 * 3. Frontend polls with useModuleData (refetchInterval)
 * 4. When data.exists === true, display results
 * 
 * ASYNC PATTERN:
 * Generation is async (30-120 seconds), so we poll for results.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { trackModuleGenerated, trackCreditUsed, trackPitchDeckCreated } from '@/utils/analytics';
import { creditKeys } from './useCredits';

// =============================================================================
// TYPES
// =============================================================================

/** Module types matching backend enum */
export type ModuleType =
    | 'idea_validation'
    | 'marketing_strategy'
    | 'branding'
    | 'pitch_deck'
    | 'gtm_strategy'
    | 'competitor_analysis'
    | 'startup_chatbot'
    | 'grants';

/** Module generation response from Core Service */
export interface GenerateModuleResponse {
    message: string;
    jobId: string;
    moduleType: string;
    creditsDeducted: number;
}

/** Module data response */
export interface ModuleDataResponse {
    moduleType: string;
    data: any | null;
    exists: boolean;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

/** All modules data response */
export interface AllModulesResponse {
    [key: string]: ModuleDataResponse;
}

/** Job status response */
export interface JobStatusResponse {
    jobId: string;
    state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
    progress: number | object;
    data: any;
    failedReason?: string;
    finishedOn?: number;
}

// =============================================================================
// QUERY KEYS
// =============================================================================

export const moduleKeys = {
    all: ['modules'] as const,
    allForIdea: (ideaId: string) => [...moduleKeys.all, ideaId] as const,
    single: (ideaId: string, moduleType: ModuleType) =>
        [...moduleKeys.all, ideaId, moduleType] as const,
    job: (jobId: string) => ['job', jobId] as const,
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Fetch all module data for an idea.
 * 
 * Usage:
 * ```tsx
 * const { data: modules, isLoading } = useAllModules(ideaId);
 * if (modules?.idea_validation?.exists) {
 *     // Show validation results
 * }
 * ```
 */
export function useAllModules(ideaId: string | undefined) {
    const { isSignedIn } = useAuth();

    return useQuery({
        queryKey: moduleKeys.allForIdea(ideaId || ''),
        queryFn: async (): Promise<AllModulesResponse> => {
            const { data } = await api.get(`/ideas/${ideaId}/modules`);
            return data;
        },
        enabled: !!isSignedIn && !!ideaId,
        staleTime: 60 * 1000, // 1 minute
    });
}

/**
 * Fetch specific module data with automatic polling when generating.
 * 
 * Usage:
 * ```tsx
 * const { data, isLoading, isPolling } = useModuleData(ideaId, 'idea_validation');
 * 
 * if (isLoading) return <Spinner />;
 * if (!data?.exists) return <GeneratingState />;
 * return <ValidationResults data={data.data} />;
 * ```
 * 
 * @param ideaId - The idea ID
 * @param moduleType - The module type to fetch
 * @param options.pollWhileGenerating - If true, polls every 5s while data doesn't exist (default: true)
 */
export function useModuleData(
    ideaId: string | undefined,
    moduleType: ModuleType,
    options?: { pollWhileGenerating?: boolean; disablePolling?: boolean }
) {
    const { isSignedIn } = useAuth();
    const queryClient = useQueryClient();
    const pollWhileGenerating = options?.pollWhileGenerating ?? true;
    const disablePolling = options?.disablePolling ?? false;

    return useQuery({
        queryKey: moduleKeys.single(ideaId || '', moduleType),
        queryFn: async (): Promise<ModuleDataResponse> => {
            const { data } = await api.get(
                `/ideas/${ideaId}/modules/${moduleType}`
            );
            return data;
        },
        enabled: !!isSignedIn && !!ideaId,
        staleTime: 60 * 1000, // 1 minute fresh
        refetchInterval: (pollWhileGenerating && !disablePolling)
            ? (query) => {
                const data = query.state.data;
                // Stop polling if:
                // 1. Data exists and status is not IN_PROGRESS, OR
                // 2. Status is COMPLETED or FAILED
                if (data?.exists && data?.status !== 'IN_PROGRESS') {
                    // Refresh credit balance — credits are deducted on successful generation
                    queryClient.invalidateQueries({ queryKey: creditKeys.stats() });
                    return false;
                }
                if (data?.status === 'COMPLETED' || data?.status === 'FAILED') {
                    // Refresh credit balance — credits are deducted on successful generation
                    queryClient.invalidateQueries({ queryKey: creditKeys.stats() });
                    return false;
                }
                // Otherwise poll every 5 seconds
                return 5000;
            }
            : false,
    });
}

/**
 * Generate module data using AI.
 * Returns immediately with jobId.
 *
 * After successful trigger, opens an SSE connection to receive
 * real-time push notifications when the job completes/fails.
 * This replaces the previous polling approach.
 *
 * Usage:
 * ```tsx
 * const { mutate: generateModule, isPending } = useGenerateModule(ideaId);
 *
 * // Trigger generation
 * generateModule('idea_validation', {
 *     onSuccess: (response) => {
 *         console.log('Job queued:', response.jobId);
 *         // SSE will automatically notify when complete
 *     }
 * });
 * ```
 */
export function useGenerateModule(ideaId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (moduleType: ModuleType): Promise<GenerateModuleResponse> => {
            const { data } = await api.post(
                `/ideas/${ideaId}/modules/${moduleType}/generate`
            );
            return data;
        },
        onSuccess: async (response, moduleType) => {
            // Show toast with credits info
            toast.success(
                `Generating ${formatModuleName(moduleType)}...`,
                { duration: 4000 }
            );

            // Track analytics event
            trackModuleGenerated(moduleType, ideaId, response.creditsDeducted);
            if (response.creditsDeducted > 0) {
                trackCreditUsed('module_generation', response.creditsDeducted, ideaId);
            }

            // Invalidate module data (sets status to IN_PROGRESS for skeleton)
            queryClient.invalidateQueries({
                queryKey: moduleKeys.single(ideaId, moduleType),
            });

            // Open SSE connection for real-time push notification
            // Falls back to polling (via useModuleData refetchInterval) if SSE fails
            try {
                const { getAuthToken } = await import('@/services/api');
                const token = await getAuthToken();
                const API_BASE = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001/api/v1';

                const sseResponse = await fetch(`${API_BASE}/events/modules/${ideaId}`, {
                    method: 'GET',
                    headers: {
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                });

                if (!sseResponse.ok || !sseResponse.body) {
                    console.warn('[SSE] Connection failed, falling back to polling');
                    return;
                }

                const reader = sseResponse.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                const processStream = async () => {
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            buffer += decoder.decode(value, { stream: true });
                            const events = buffer.split('\n\n');
                            buffer = events.pop() || '';

                            for (const eventStr of events) {
                                if (!eventStr.trim()) continue;
                                for (const line of eventStr.split('\n')) {
                                    if (!line.startsWith('data: ')) continue;
                                    try {
                                        const event = JSON.parse(line.slice(6));

                                        if (event.event === 'module_complete' || event.event === 'module_failed') {
                                            // Invalidate the module query → triggers a single refetch
                                            const evtModule = event.moduleType?.toLowerCase() as ModuleType;
                                            if (evtModule) {
                                                queryClient.invalidateQueries({
                                                    queryKey: moduleKeys.single(ideaId, evtModule),
                                                });
                                                queryClient.invalidateQueries({
                                                    queryKey: moduleKeys.allForIdea(ideaId),
                                                });
                                                queryClient.invalidateQueries({
                                                    queryKey: creditKeys.stats(),
                                                });
                                            }
                                            // Close SSE — job is done
                                            reader.cancel();
                                            return;
                                        }

                                        if (event.event === 'timeout') {
                                            reader.cancel();
                                            return;
                                        }
                                    } catch {
                                        // heartbeat or non-JSON — ignore
                                    }
                                }
                            }
                        }
                    } catch (err: any) {
                        if (err.name !== 'AbortError') {
                            console.warn('[SSE] Stream error:', err.message);
                        }
                    }
                };

                // Process in background — don't block the mutation callback
                processStream();
            } catch {
                // SSE setup failed — polling fallback is still active
                console.warn('[SSE] Setup failed, polling fallback active');
            }
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to start generation';

            // Handle 402 Payment Required - insufficient credits
            if (error?.response?.status === 402) {
                toast.error('Insufficient credits. Redirecting to store...');
                // Redirect to credits store after a short delay
                setTimeout(() => {
                    window.location.href = '/dashboard/store/credits';
                }, 1500);
            } else {
                toast.error(message);
            }
        },
    });
}

/**
 * Check job status (optional - for showing progress).
 * 
 * Usage:
 * ```tsx
 * const { data: jobStatus } = useJobStatus(jobId, { enabled: isGenerating });
 * // Show progress: jobStatus?.progress
 * ```
 */
export function useJobStatus(
    jobId: string | undefined,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: moduleKeys.job(jobId || ''),
        queryFn: async (): Promise<JobStatusResponse | null> => {
            const { data } = await api.get(`/jobs/${jobId}`);
            return data;
        },
        enabled: !!jobId && (options?.enabled ?? true),
        refetchInterval: (query) => {
            const state = query.state.data?.state;
            // Stop polling when job is done
            if (state === 'completed' || state === 'failed') {
                return false;
            }
            return 2000; // Poll every 2 seconds
        },
    });
}

// =============================================================================
// HELPERS
// =============================================================================

/** Format module type to human-readable name */
function formatModuleName(moduleType: ModuleType): string {
    const names: Record<ModuleType, string> = {
        idea_validation: 'Idea Validation',
        marketing_strategy: 'Marketing Strategy',
        branding: 'Branding',
        pitch_deck: 'Pitch Deck',
        gtm_strategy: 'GTM Strategy',
        competitor_analysis: 'Competitor Analysis',
        startup_chatbot: 'AI Chatbot',
        grants: 'Grants & Funding',
    };
    return names[moduleType] || moduleType;
}

// =============================================================================
// EXPORT HOOKS
// =============================================================================

/** Export job response */
export interface ExportJobResponse {
    jobId: string;
}

/** Export status response */
export interface ExportStatusResponse {
    id: string;
    state: 'waiting' | 'active' | 'completed' | 'failed' | 'NOT_FOUND';
    progress: number;
    result: any | null;
    downloadUrl: string | null;
    failedReason: string | null;
}

/** 
 * Generic hook to export any module as PDF/ZIP
 * @param moduleType - The module type slug (e.g., 'idea-validation', 'pitch-deck')
 * @param ideaId - The idea ID
 */
export function useExportModule(moduleType: string, ideaId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation<ExportJobResponse & { newBalance?: number }, Error, { chartImages?: Record<string, string>; slideImages?: string[] }>({
        mutationFn: async (data = {}) => {
            if (!ideaId) throw new Error('No idea selected');
            const response = await api.post(`/export/${moduleType}/${ideaId}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            // Update credits cache directly with new balance from response
            if (data.newBalance !== undefined) {
                queryClient.setQueryData(['credits', 'stats'], (old: any) => ({
                    ...old,
                    balance: data.newBalance,
                }));
            }

            // Track analytics event for pitch deck export
            if (ideaId) {
                trackPitchDeckCreated(ideaId, 'pdf');
            }

            toast.success('Export started! Your file will be ready shortly.');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Export failed';
            toast.error(message);
        },
    });
}

/** 
 * Hook to export pitch deck as PDF (legacy - uses generic hook)
 */
export function useExportPitchDeck(ideaId: string | undefined) {
    return useExportModule('pitch-deck', ideaId);
}

/**
 * Hook to check export job status
 */
export function useExportStatus(jobId: string | null, options?: { enabled?: boolean }) {
    return useQuery<ExportStatusResponse>({
        queryKey: ['export-status', jobId],
        queryFn: async () => {
            if (!jobId) throw new Error('No job ID');
            const response = await api.get(`/export/status/${jobId}`);
            return response.data;
        },
        enabled: !!jobId && (options?.enabled !== false),
        refetchInterval: (query) => {
            const data = query.state.data;
            // Stop polling when completed or failed
            if (data?.state === 'completed' || data?.state === 'failed' || data?.state === 'NOT_FOUND') {
                return false;
            }
            return 2000; // Poll every 2 seconds
        },
    });
}

/**
 * Hook to export one-pager as PDF (extracted from pitch deck slides)
 * @param ideaId - The idea ID
 */
export function useExportOnePager(ideaId: string | undefined) {
    const queryClient = useQueryClient();

    return useMutation<ExportJobResponse & { newBalance?: number; creditCost?: number }, Error, { templateId?: string; websiteUrl?: string; slides?: any[]; logoBase64?: string; accentColor?: string }>({
        mutationFn: async (data = {}) => {
            if (!ideaId) throw new Error('No idea selected');
            const response = await api.post(`/export/one-pager/${ideaId}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            // Update credits cache directly with new balance from response
            if (data.newBalance !== undefined) {
                queryClient.setQueryData(['credits', 'stats'], (old: any) => ({
                    ...old,
                    balance: data.newBalance,
                }));
            }

            // Track analytics event
            if (ideaId) {
                trackPitchDeckCreated(ideaId, 'one-pager');
            }

            toast.success('Exporting one-pager! Your file will be ready shortly.');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Export failed';

            // Handle 402 Payment Required - insufficient credits
            if (error?.response?.status === 402) {
                toast.error('Insufficient credits. Redirecting to store...');
                setTimeout(() => {
                    window.location.href = '/dashboard/store/credits';
                }, 1500);
            } else {
                toast.error(message);
            }
        },
    });
}
