/**
 * Auth Store (Zustand)
 * 
 * This store manages user authentication state.
 * 
 * WHAT IS ZUSTAND?
 * Zustand is a simple state management library.
 * Think of it as a global variable that components can:
 * 1. Read from (get user data)
 * 2. Write to (update user data)
 * 3. Subscribe to (re-render when data changes)
 * 
 * WHY ZUSTAND FOR AUTH?
 * - Auth state needs to be accessed everywhere
 * - Simple API (no Redux boilerplate)
 * - Persists across page navigation
 * 
 * IMPORTANT: This is a DUMMY auth implementation.
 * Replace with Clerk integration later.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '@/types';
import toast from 'react-hot-toast';

/**
 * Auth store interface
 * Combines state and actions in one type
 */
interface AuthStore {
    // STATE
    user: User | null;          // Currently logged in user
    isAuthenticated: boolean;   // Quick check for auth status
    isLoading: boolean;         // Loading state for async operations

    // ACTIONS
    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

/**
 * Create the auth store with persistence
 * 
 * persist() middleware automatically saves to localStorage
 * so user stays logged in after page refresh
 */
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: false,

            /**
             * Login Action
             * 
             * DUMMY IMPLEMENTATION - accepts any email/password
             * TODO: Replace with Clerk auth
             */
            login: async (credentials: LoginCredentials): Promise<boolean> => {
                set({ isLoading: true });

                try {
                    // Simulate API call delay
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // DUMMY: Create a fake user
                    // In real app, this would come from the server
                    const fakeUser: User = {
                        id: '1',
                        email: credentials.email,
                        name: credentials.email.split('@')[0], // Use email prefix as name
                        createdAt: new Date().toISOString(),
                    };

                    // Update store state
                    set({
                        user: fakeUser,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Save token (dummy)
                    localStorage.setItem('token', 'dummy-token-' + Date.now());

                    toast.success('Welcome back!');
                    return true;

                } catch (error) {
                    set({ isLoading: false });
                    toast.error('Login failed. Please try again.');
                    return false;
                }
            },

            /**
             * Register Action
             * 
             * DUMMY IMPLEMENTATION
             * TODO: Replace with Clerk auth
             */
            register: async (data: RegisterData): Promise<boolean> => {
                set({ isLoading: true });

                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Create user from registration data
                    const newUser: User = {
                        id: Date.now().toString(),
                        email: data.email,
                        name: data.name,
                        createdAt: new Date().toISOString(),
                    };

                    set({
                        user: newUser,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    localStorage.setItem('token', 'dummy-token-' + Date.now());

                    toast.success('Account created successfully!');
                    return true;

                } catch (error) {
                    set({ isLoading: false });
                    toast.error('Registration failed. Please try again.');
                    return false;
                }
            },

            /**
             * Logout Action
             * 
             * Clears all auth state and tokens
             */
            logout: () => {
                // Clear localStorage
                localStorage.removeItem('token');

                // Reset store state
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });

                toast.success('Logged out successfully');
            },

            /**
             * Set User Action
             * 
             * Directly set user (useful for Clerk integration)
             */
            setUser: (user: User | null) => {
                set({
                    user,
                    isAuthenticated: user !== null,
                });
            },
        }),
        {
            // Persistence configuration
            name: 'pitchrr-auth', // localStorage key
            // Only persist user and isAuthenticated, not isLoading
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
