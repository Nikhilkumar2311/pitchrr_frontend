/**
 * Breadcrumbs Component
 * Uses standard Tailwind classes.
 */

import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const pathNames: Record<string, string> = {
    dashboard: 'Dashboard',
    idea: 'Idea Validation',
    marketing: 'Marketing Strategy',
    branding: 'Branding',
    pitch: 'Pitch Deck',
    gtm: 'GTM Strategy',
    competitors: 'Competitor Analysis',
    chat: 'AI Chatbot',
    store: 'Store',
    credits: 'Buy Credits',
};

export function Breadcrumbs() {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Build breadcrumb items
    const breadcrumbs = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = pathNames[segment] || segment;
        const isLast = index === pathSegments.length - 1;

        return { label, path, isLast };
    });

    return (
        <nav className="hidden sm:flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            {/* Home icon */}
            <Link
                to="/dashboard"
                className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors"
            >
                <Home className="w-4 h-4" />
            </Link>

            {/* Breadcrumb items */}
            {breadcrumbs.map((crumb) => (
                <div key={crumb.path} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    {crumb.isLast ? (
                        <span className="font-medium text-gray-900">
                            {crumb.label}
                        </span>
                    ) : (
                        <Link
                            to={crumb.path}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
