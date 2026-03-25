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
import { useEffect, useRef, type ReactNode } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { setTokenGetter } from '@/services/api';
import { setUserId } from '@/utils/analytics';
import { useIdeaStore } from '@/store';

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

/**
 * Clears all user-specific data from the client.
 * Called when a user signs out to prevent data leaking to the next session.
 */
function clearAllUserData() {
    // 1. Clear React Query cache (all cached API responses)
    queryClient.clear();

    // 2. Clear zustand persisted idea store
    useIdeaStore.getState().clearIdea();
    localStorage.removeItem('pitchrr-idea-storage');

    // 3. Clear chatbot message history from localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pitchrr_chatbot_messages_')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
}

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    const { getToken } = useAuth();
    const { user, isSignedIn } = useUser();
    const wasSignedIn = useRef(false);

    // Connect Clerk token to our axios instance
    useEffect(() => {
        setTokenGetter(() => getToken());
    }, [getToken]);

    // Track sign-in state and clear data on sign-out
    useEffect(() => {
        if (isSignedIn) {
            wasSignedIn.current = true;
        } else if (wasSignedIn.current) {
            // User just signed out — clean up all cached user data
            wasSignedIn.current = false;
            clearAllUserData();
        }
    }, [isSignedIn]);

    // Set user ID for Google Analytics when authenticated
    useEffect(() => {
        if (isSignedIn && user?.id) {
            setUserId(user.id);
        }
    }, [isSignedIn, user?.id]);

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
