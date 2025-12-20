/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication.
 * Redirects to login page if user is not logged in.
 * 
 * HOW IT WORKS:
 * 1. Check if user is authenticated (from Zustand store)
 * 2. If yes → render the child components (the page)
 * 3. If no → redirect to /login
 * 
 * USAGE:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    // Get auth status from Zustand store
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Get current location (URL) for redirect after login
    const location = useLocation();

    // If not authenticated, redirect to login
    // "state" saves where the user was trying to go, so we can redirect back after login
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace  // Replace current history entry (don't add to history)
            />
        );
    }

    // User is authenticated, render the protected content
    return <>{children}</>;
}
