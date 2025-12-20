/**
 * PageLoader Component
 * 
 * Full-page and component loading indicators with standard Tailwind classes.
 */

import { Loader2 } from 'lucide-react';

export function PageLoader() {
    return (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
}

export function ComponentLoader() {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
    );
}
