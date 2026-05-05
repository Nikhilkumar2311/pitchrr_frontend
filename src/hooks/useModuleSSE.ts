/**
 * useModuleSSE — Server-Sent Events hook for real-time module updates
 *
 * Replaces polling with push notifications for module generation status.
 *
 * FLOW:
 *   1. Module page triggers generation → mutation succeeds
 *   2. Page calls `connect()` with the ideaId
 *   3. This hook opens a fetch-based SSE connection to GET /events/modules/:ideaId
 *   4. When the worker completes/fails, the server pushes an event
 *   5. This hook invalidates the React Query cache → data auto-refetches once
 *   6. Connection auto-closes after receiving the completion event
 *
 * WHY fetch() instead of EventSource?
 *   EventSource doesn't support custom Authorization headers.
 *   We use the same fetch + ReadableStream approach as the chatbot.
 */

import { useRef, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAuthToken } from '@/services/api';
import { moduleKeys, type ModuleType } from './useModules';
import { creditKeys } from './useCredits';

interface SSEEvent {
    event: string;
    moduleType?: string;
    status?: string;
    ideaId?: string;
    error?: string;
}

interface UseModuleSSEOptions {
    /** Called when a module completes */
    onComplete?: (moduleType: string) => void;
    /** Called when a module fails */
    onError?: (moduleType: string, error: string) => void;
}

export function useModuleSSE(options?: UseModuleSSEOptions) {
    const queryClient = useQueryClient();
    const abortRef = useRef<AbortController | null>(null);
    const activeRef = useRef(false);

    /**
     * Open an SSE connection to listen for module events.
     * Call this after triggering generation.
     */
    const connect = useCallback(async (ideaId: string) => {
        // Don't open multiple connections for the same idea
        if (activeRef.current) return;
        activeRef.current = true;

        // Get auth token for the request
        const token = await getAuthToken();
        const API_BASE = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001/api/v1';

        const abort = new AbortController();
        abortRef.current = abort;

        try {
            const response = await fetch(`${API_BASE}/events/modules/${ideaId}`, {
                method: 'GET',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                signal: abort.signal,
            });

            if (!response.ok || !response.body) {
                console.warn('[SSE] Connection failed, falling back to polling');
                activeRef.current = false;
                return false; // Signal caller to fall back to polling
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            const processStream = async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });

                        // Parse SSE format: "data: {json}\n\n"
                        const events = buffer.split('\n\n');
                        buffer = events.pop() || ''; // Keep incomplete chunk

                        for (const eventStr of events) {
                            if (!eventStr.trim()) continue;

                            for (const line of eventStr.split('\n')) {
                                if (!line.startsWith('data: ')) continue;
                                const data = line.slice(6);

                                try {
                                    const event: SSEEvent = JSON.parse(data);

                                    if (event.event === 'module_complete') {
                                        // Invalidate the specific module query → triggers single refetch
                                        const moduleType = event.moduleType?.toLowerCase() as ModuleType;
                                        if (moduleType && ideaId) {
                                            queryClient.invalidateQueries({
                                                queryKey: moduleKeys.single(ideaId, moduleType),
                                            });
                                            // Also refresh all modules (for dashboard sidebar)
                                            queryClient.invalidateQueries({
                                                queryKey: moduleKeys.allForIdea(ideaId),
                                            });
                                            // Refresh credits balance
                                            queryClient.invalidateQueries({
                                                queryKey: creditKeys.stats(),
                                            });
                                        }

                                        options?.onComplete?.(event.moduleType || '');

                                        // Close connection — job is done
                                        disconnect();
                                        return;
                                    }

                                    if (event.event === 'module_failed') {
                                        const moduleType = event.moduleType?.toLowerCase() as ModuleType;
                                        if (moduleType && ideaId) {
                                            queryClient.invalidateQueries({
                                                queryKey: moduleKeys.single(ideaId, moduleType),
                                            });
                                        }

                                        options?.onError?.(
                                            event.moduleType || '',
                                            event.error || 'Generation failed',
                                        );

                                        // Close connection — job is done (failed)
                                        disconnect();
                                        return;
                                    }

                                    if (event.event === 'timeout') {
                                        // Server closed the connection — fall back to polling
                                        disconnect();
                                        return;
                                    }

                                    // 'connected' event — connection established, nothing to do
                                } catch {
                                    // Non-JSON line (heartbeat comment) — ignore
                                }
                            }
                        }
                    }
                } catch (err: any) {
                    if (err.name !== 'AbortError') {
                        console.warn('[SSE] Stream read error:', err.message);
                    }
                } finally {
                    activeRef.current = false;
                }
            };

            processStream();
            return true; // SSE connected successfully

        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.warn('[SSE] Connection error:', err.message);
            }
            activeRef.current = false;
            return false;
        }
    }, [queryClient, options]);

    /**
     * Close the SSE connection.
     */
    const disconnect = useCallback(() => {
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
        activeRef.current = false;
    }, []);

    /**
     * Check if SSE is currently connected.
     */
    const isConnected = useCallback(() => activeRef.current, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return { connect, disconnect, isConnected };
}
