/**
 * useMediaQuery Hook
 * 
 * A hook that returns whether a media query matches.
 * 
 * USAGE:
 * const isMobile = useMediaQuery('(max-width: 640px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * 
 * WHY THIS HOOK?
 * - Responsive logic in JavaScript
 * - Complements Tailwind CSS breakpoints
 * - Useful for conditional rendering
 */

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        // Check if window is defined (for SSR compatibility)
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        // Update state when media query changes
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Add listener
        mediaQuery.addEventListener('change', handleChange);

        // Set initial value
        setMatches(mediaQuery.matches);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

/**
 * Convenience hooks for common breakpoints
 * These match Tailwind CSS default breakpoints
 */
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 639px)');
}

export function useIsTablet(): boolean {
    return useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
    return useMediaQuery('(min-width: 1024px)');
}
