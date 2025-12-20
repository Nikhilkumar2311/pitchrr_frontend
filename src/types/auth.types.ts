/**
 * TypeScript Type Definitions for User & Authentication
 * 
 * This file defines the shape of user data and auth-related types.
 * Used throughout the app for type safety.
 * 
 * WHY SEPARATE TYPE FILES?
 * - Single source of truth for data shapes
 * - Easy to update when API changes
 * - Better IDE autocomplete
 */

/**
 * User object - represents a logged-in user
 */
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string; // Optional profile picture URL
    createdAt: string;
}

/**
 * Login credentials sent to the server
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * Registration data for new users
 */
export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

/**
 * Auth state stored in Zustand
 */
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

/**
 * Auth actions available in the store
 */
export interface AuthActions {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
}
