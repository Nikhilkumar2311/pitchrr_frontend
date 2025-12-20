/**
 * Application Router Configuration
 * 
 * This file defines all routes in the app using React Router v6.
 * 
 * KEY CONCEPTS:
 * 1. Lazy Loading - Pages are loaded only when needed (better performance)
 * 2. Protected Routes - Some routes require authentication
 * 3. Layouts - Some routes share common UI (sidebar, header)
 * 
 * ROUTE STRUCTURE:
 * /                    - Landing page (public)
 * /login               - Login page (public)
 * /register            - Register page (public)
 * /dashboard           - Dashboard (protected)
 * /dashboard/idea      - Module 1: Idea Validation
 * /dashboard/marketing - Module 2: Marketing Strategy
 * /dashboard/branding  - Module 3: Branding
 * /dashboard/pitch     - Module 4: Pitch Deck
 * /dashboard/gtm       - Module 5: GTM Strategy
 * /dashboard/competitors - Module 6: Competitor Analysis
 * /dashboard/chat      - Module 7: AI Chatbot
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Components
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { PageLoader } from '@/components/ui/PageLoader';

/**
 * LAZY LOADING EXPLAINED
 * 
 * Instead of: import Landing from '@/pages/Landing'
 * We use:     lazy(() => import('@/pages/Landing'))
 * 
 * WHY?
 * - The page code is NOT included in the initial bundle
 * - It's downloaded ONLY when the user navigates to that route
 * - Result: Faster initial page load
 * 
 * The Suspense component shows a loading indicator while the page loads.
 */

// Lazy load all pages
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));

// Lazy load module pages
const IdeaValidation = lazy(() => import('@/pages/modules/IdeaValidation'));
const MarketingStrategy = lazy(() => import('@/pages/modules/MarketingStrategy'));
const Branding = lazy(() => import('@/pages/modules/Branding'));
const PitchDeck = lazy(() => import('@/pages/modules/PitchDeck'));
const GTMStrategy = lazy(() => import('@/pages/modules/GTMStrategy'));
const CompetitorAnalysis = lazy(() => import('@/pages/modules/CompetitorAnalysis'));
const StartupChatbot = lazy(() => import('@/pages/modules/StartupChatbot'));

// Layouts - named export needs different lazy import
const DashboardLayout = lazy(() =>
    import('@/layout/DashboardLayout').then(mod => ({ default: mod.DashboardLayout }))
);

/**
 * Helper component for lazy loaded routes
 * Shows a loading spinner while the page is being loaded
 */
function LazyPage({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<PageLoader />}>
            {children}
        </Suspense>
    );
}

/**
 * Router Configuration
 * 
 * createBrowserRouter is the recommended way to create routes in React Router v6.
 * It enables data loading and other advanced features.
 */
const router = createBrowserRouter([
    // PUBLIC ROUTES (no authentication required)
    {
        path: '/',
        element: <LazyPage><Landing /></LazyPage>,
    },
    {
        path: '/login',
        element: <LazyPage><Login /></LazyPage>,
    },
    {
        path: '/register',
        element: <LazyPage><Register /></LazyPage>,
    },

    // PROTECTED ROUTES (authentication required)
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <LazyPage>
                    <DashboardLayout />
                </LazyPage>
            </ProtectedRoute>
        ),
        children: [
            // Dashboard home
            {
                index: true, // This is shown at /dashboard
                element: <LazyPage><Dashboard /></LazyPage>,
            },
            // Module 1: Idea Validation
            {
                path: 'idea',
                element: <LazyPage><IdeaValidation /></LazyPage>,
            },
            // Module 2: Marketing Strategy
            {
                path: 'marketing',
                element: <LazyPage><MarketingStrategy /></LazyPage>,
            },
            // Module 3: Branding
            {
                path: 'branding',
                element: <LazyPage><Branding /></LazyPage>,
            },
            // Module 4: Pitch Deck
            {
                path: 'pitch',
                element: <LazyPage><PitchDeck /></LazyPage>,
            },
            // Module 5: GTM Strategy
            {
                path: 'gtm',
                element: <LazyPage><GTMStrategy /></LazyPage>,
            },
            // Module 6: Competitor Analysis
            {
                path: 'competitors',
                element: <LazyPage><CompetitorAnalysis /></LazyPage>,
            },
            // Module 7: Startup AI Chatbot
            {
                path: 'chat',
                element: <LazyPage><StartupChatbot /></LazyPage>,
            },
        ],
    },
]);

/**
 * AppRouter Component
 * 
 * Export this and use it in App.tsx
 */
export function AppRouter() {
    return <RouterProvider router={router} />;
}
