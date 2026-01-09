import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import api from '@/services/api';

/**
 * Hook to fetch/sync the user from our backend database.
 * This ensures the user exists in our DB and returns their profile.
 * 
 * Uses the Clerk ID to sync. Calls CORE SERVICE (port 3001).
 */
export function useDBUser() {
    const { isSignedIn } = useAuth();
    const { user: clerkUser } = useClerkUser();

    return useQuery({
        queryKey: ['dbUser', clerkUser?.id],
        queryFn: async () => {
            try {
                // We use POST /auth/sync to "Get or Create" the user in our DB
                // This goes to CORE SERVICE (port 3001)
                const { data } = await api.post('/auth/sync');
                return data;
            } catch (error) {
                console.error('[useDBUser] Sync failed:', error);
                throw error;
            }
        },
        enabled: !!isSignedIn && !!clerkUser,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
}
