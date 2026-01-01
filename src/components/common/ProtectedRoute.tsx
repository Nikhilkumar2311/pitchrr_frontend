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
import { useAuth } from '@clerk/clerk-react';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    // Get auth status from Clerk
    const { isLoaded, isSignedIn } = useAuth();
    const location = useLocation();

    // Show loading state while Clerk loads
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isSignedIn) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // User is authenticated, render the protected content
    return <>{children}</>;
}
