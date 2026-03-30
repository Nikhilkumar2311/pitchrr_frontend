/**
 * Auth Context - Custom Authentication Provider
 * 
 * Replaces ClerkProvider with our own JWT-based auth system.
 * Provides: user, isSignedIn, isLoaded, login, register, logout, getToken
 * 
 * Token Strategy:
 * - Access token: stored in memory (never in localStorage)
 * - Refresh token: httpOnly cookie (managed by backend)
 * - Auto-refresh: background timer refreshes access token before expiry
 */

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    type ReactNode,
} from 'react';
import api from '@/services/api';

// User shape matching what our backend returns
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
    emailVerified?: boolean;
    authProvider?: string;
    // Clerk-compatible aliases for existing code
    firstName?: string;
    fullName?: string;
    username?: string;
    imageUrl?: string;
    primaryEmailAddress?: { emailAddress: string };
}

interface AuthContextType {
    // State
    user: AuthUser | null;
    isSignedIn: boolean;
    isLoaded: boolean;

    // Actions
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
    resendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
    forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
    resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    getToken: () => Promise<string | null>;
    signOut: () => Promise<void>; // Alias for logout (Clerk compat)
}

const AuthContext = createContext<AuthContextType | null>(null);

// In-memory access token (never stored in localStorage)
let accessToken: string | null = null;

// Core API URL for direct auth calls (bypassing the interceptor for auth endpoints)
const API_BASE = import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    /**
     * Format user to be compatible with existing Clerk-based code
     */
    const formatUser = (raw: any): AuthUser => ({
        id: raw.id,
        email: raw.email,
        name: raw.name,
        avatarUrl: raw.avatarUrl,
        emailVerified: raw.emailVerified,
        authProvider: raw.authProvider,
        // Clerk-compatible aliases
        firstName: raw.name?.split(' ')[0] || raw.name,
        fullName: raw.name,
        username: raw.email?.split('@')[0],
        imageUrl: raw.avatarUrl,
        primaryEmailAddress: { emailAddress: raw.email },
    });

    /**
     * Schedule access token refresh (5 minutes before expiry)
     */
    const scheduleRefresh = useCallback(() => {
        if (refreshTimer.current) clearTimeout(refreshTimer.current);
        // Refresh 5 minutes before the 15-minute expiry = refresh at 10 min
        refreshTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include', // send httpOnly cookie
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    accessToken = data.accessToken;
                    scheduleRefresh(); // Schedule next refresh
                } else {
                    // Refresh failed — force logout
                    accessToken = null;
                    setUser(null);
                }
            } catch {
                accessToken = null;
                setUser(null);
            }
        }, 10 * 60 * 1000); // 10 minutes
    }, []);

    /**
     * Try to restore session from refresh token on mount
     */
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const res = await fetch(`${API_BASE}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (res.ok) {
                    const data = await res.json();
                    accessToken = data.accessToken;

                    // Fetch user profile
                    const meRes = await fetch(`${API_BASE}/auth/me`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (meRes.ok) {
                        const userData = await meRes.json();
                        setUser(formatUser(userData));
                        scheduleRefresh();
                    }
                }
            } catch {
                // No valid session — user is not signed in
            } finally {
                setIsLoaded(true);
            }
        };

        restoreSession();

        return () => {
            if (refreshTimer.current) clearTimeout(refreshTimer.current);
        };
    }, [scheduleRefresh]);

    /**
     * Get current access token (for API requests)
     */
    const getToken = useCallback(async (): Promise<string | null> => {
        return accessToken;
    }, []);

    /**
     * Login with email + password
     */
    const login = useCallback(async (
        email: string,
        password: string,
    ): Promise<{ success: boolean; error?: string; needsVerification?: boolean }> => {
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                const needsVerify = data.message?.includes('verify your email');
                return { success: false, error: data.message, needsVerification: needsVerify };
            }

            accessToken = data.accessToken;
            setUser(formatUser(data.user));
            scheduleRefresh();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Login failed' };
        }
    }, [scheduleRefresh]);

    /**
     * Register new account
     */
    const register = useCallback(async (
        name: string,
        email: string,
        password: string,
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.message };
            }

            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Registration failed' };
        }
    }, []);

    /**
     * Verify email with OTP
     */
    const verifyEmail = useCallback(async (
        email: string,
        code: string,
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE}/auth/verify-email`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.message };
            }

            // Auto-login after verification
            accessToken = data.accessToken;
            setUser(formatUser(data.user));
            scheduleRefresh();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.message || 'Verification failed' };
        }
    }, [scheduleRefresh]);

    /**
     * Resend verification OTP
     */
    const resendOtp = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            return { success: res.ok, error: !res.ok ? data.message : undefined };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }, []);

    /**
     * Forgot password — send OTP
     */
    const forgotPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            return { success: res.ok, error: !res.ok ? data.message : undefined };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }, []);

    /**
     * Reset password with OTP
     */
    const resetPassword = useCallback(async (
        email: string,
        code: string,
        newPassword: string,
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const res = await fetch(`${API_BASE}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            });
            const data = await res.json();
            return { success: res.ok, error: !res.ok ? data.message : undefined };
        } catch (err: any) {
            return { success: false, error: err.message };
        }
    }, []);

    /**
     * Logout — revoke refresh token + clear state
     */
    const logout = useCallback(async () => {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
        } catch {
            // Ignore errors — we're logging out anyway
        } finally {
            accessToken = null;
            setUser(null);
            if (refreshTimer.current) {
                clearTimeout(refreshTimer.current);
                refreshTimer.current = null;
            }
        }
    }, []);

    const value: AuthContextType = {
        user,
        isSignedIn: !!user,
        isLoaded,
        login,
        register,
        verifyEmail,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
        getToken,
        signOut: logout, // Clerk compat alias
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Hook to access auth context.
 * Drop-in replacement for Clerk's useAuth, useUser, useClerk
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}

// Alias — some components use useUser pattern
export function useUser() {
    const auth = useAuth();
    return {
        user: auth.user,
        isLoaded: auth.isLoaded,
        isSignedIn: auth.isSignedIn,
    };
}

// Alias — some components use useClerk pattern
export function useClerk() {
    const auth = useAuth();
    return {
        signOut: auth.logout,
    };
}

/**
 * Handle Google OAuth callback
 * Called from the /auth/callback route
 */
export function handleGoogleCallback(token: string) {
    accessToken = token;
}
