/**
 * CreditsDisplay Component
 *
 * Shows current credit balance in the dashboard header with a plus button
 * to navigate to the credits store.
 */

import { Link } from 'react-router-dom';
import { Coins, Plus } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useCredits } from '@/hooks';

export function CreditsDisplay() {
    const { isSignedIn, isLoaded } = useAuth();
    const { data: credits, isLoading } = useCredits();

    // Don't render if not authenticated
    if (!isLoaded || !isSignedIn) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 h-9 px-3 bg-gray-100 rounded-lg animate-pulse">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <div className="w-12 h-4 bg-gray-300 rounded" />
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1">
            {/* Credit Balance */}
            <div className="flex items-center gap-2 h-9 px-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">
                    {credits?.balance ?? 0}
                </span>
            </div>

            {/* Add Credits Button */}
            <Link
                to="/dashboard/store/credits"
                className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all shadow-sm hover:shadow-md"
                title="Buy Credits"
            >
                <Plus className="w-4 h-4 text-white" />
            </Link>
        </div>
    );
}

