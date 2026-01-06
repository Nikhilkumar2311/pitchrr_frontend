import { useQuery } from '@tanstack/react-query';
import { useAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import { authApi } from '@/services/api';

/**
 * Hook to fetch/sync the user from our backend database.
 * This ensures the user exists in our DB and returns their profile.
 * 
 * Uses the Clerk ID to sync. Calls AUTH SERVICE (port 3000).
 */
export function useDBUser() {
    const { isSignedIn } = useAuth();
    const { user: clerkUser } = useClerkUser();

    return useQuery({
        queryKey: ['dbUser', clerkUser?.id],
        queryFn: async () => {
            try {
                // We use POST /auth/sync to "Get or Create" the user in our DB
                // This goes to AUTH SERVICE (port 3000)
                const { data } = await authApi.post('/auth/sync');
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
