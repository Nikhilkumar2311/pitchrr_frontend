import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

/**
 * Hook to fetch/sync the user from our backend database.
 * This ensures the user exists in our DB and returns their profile.
 */
export function useDBUser() {
    const { isSignedIn, user } = useAuth();

    return useQuery({
        queryKey: ['dbUser', user?.id],
        queryFn: async () => {
            try {
                const { data } = await api.post('/auth/sync');
                return data;
            } catch (error) {
                console.error('[useDBUser] Sync failed:', error);
                throw error;
            }
        },
        enabled: !!isSignedIn && !!user,
        staleTime: 5 * 60 * 1000,
    });
}
