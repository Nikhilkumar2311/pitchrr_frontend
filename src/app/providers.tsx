/**
 * Global Providers
 * 
 * This file wraps the app with all necessary providers:
 * 1. React Query - for server state management
 * 2. Toast notifications - for user feedback
 * 
 * WHAT IS A PROVIDER?
 * A provider is a React component that makes something available
 * to all components inside it. Think of it as a "context" that
 * child components can access.
 * 
 * WHY SEPARATE THIS FILE?
 * - Keeps main.tsx clean
 * - Easy to add more providers
 * - Clear separation of concerns
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';

/**
 * Create React Query client
 * 
 * WHAT IS REACT QUERY?
 * React Query manages "server state" - data that comes from APIs.
 * It handles:
 * - Caching responses
 * - Refetching stale data
 * - Loading/error states
 * - Deduplication (same request made twice? only one network call)
 * 
 * DEFAULT OPTIONS EXPLAINED:
 * - staleTime: 5 min - Data is considered "fresh" for 5 minutes
 * - gcTime: 30 min - Cached data is garbage collected after 30 min
 * - retry: 1 - Only retry failed requests once
 * - refetchOnWindowFocus: false - Don't refetch when tab regains focus
 */
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is fresh for 5 minutes
            staleTime: 5 * 60 * 1000,

            // Cache data for 30 minutes
            gcTime: 30 * 60 * 1000,

            // Only retry once on failure
            retry: 1,

            // Don't auto-refetch when window regains focus
            // (prevents unexpected refetches)
            refetchOnWindowFocus: false,
        },
    },
});

/**
 * Props for Providers component
 */
interface ProvidersProps {
    children: ReactNode;
}

/**
 * Providers Component
 * 
 * Wraps the app with all necessary providers.
 * Order matters! Outer providers are available to inner ones.
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {/* Main app content */}
            {children}

            {/* Toast notifications container */}
            {/* 
        TOAST CONFIGURATION:
        - position: top-right (standard location)
        - duration: 4 seconds
        - Styled to match our design system
      */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#111827',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        borderRadius: '0.5rem',
                        padding: '12px 16px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </QueryClientProvider>
    );
}
