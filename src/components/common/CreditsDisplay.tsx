/**
 * CreditsDisplay Component
 *
 * Shows current credit balance in dashboard header.
 */

import { Link } from 'react-router-dom';
import { Coins, Plus } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export function CreditsDisplay() {
    const { isSignedIn, isLoaded } = useAuth();

    // Fetch credits with automatic refetch every 5 seconds for real-time updates
    const { data: credits, isLoading } = useQuery({
        queryKey: ['credits', 'stats'],
        queryFn: async () => {
            const response = await api.get('/credits');
            return response.data;
        },
        refetchInterval: 5000,
        enabled: isLoaded && isSignedIn,
    });

    // Don't render if not authenticated
    if (!isLoaded || !isSignedIn) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 h-8 px-3 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-3.5 h-3.5 bg-gray-300 rounded" />
                <div className="w-10 h-3.5 bg-gray-300 rounded" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1">
            {/* Credit Balance */}
            <div
                className="flex items-center gap-2 h-8 px-3 rounded-lg text-[13px] font-semibold"
                style={{
                    background: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.15)',
                    color: '#B45309',
                    fontFamily: 'var(--dash-font-body)',
                }}
            >
                <Coins className="w-3.5 h-3.5" />
                <span>{credits?.balance ?? 0}</span>
            </div>

            {/* Add Credits Button */}
            <Link
                to="/dashboard/store/credits"
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                    background: 'var(--dash-gradient)',
                    boxShadow: '0 2px 6px rgba(79,125,243,0.2)',
                }}
                title="Buy Credits"
            >
                <Plus className="w-3.5 h-3.5 text-white" />
            </Link>
        </div>
    );
}
