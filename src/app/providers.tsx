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
import { HelmetProvider } from 'react-helmet-async';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '@/services/api';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    const { getToken } = useAuth();

    // Connect Clerk token to our axios instance
    useEffect(() => {
        setTokenGetter(() => getToken());
    }, [getToken]);

    return (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                {children}
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
        </HelmetProvider>
    );
}
