/**
 * DashboardLayout Component
 * Uses standard Tailwind classes.
 */

import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AIFloatingButton } from '@/components/common/AIFloatingButton';
import { CreditsDisplay } from '@/components/common/CreditsDisplay';
import { useUIStore } from '@/store';

export function DashboardLayout() {
    const { isSidebarCollapsed, setSidebarOpen } = useUIStore();

    const mainMargin = isSidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className={`${mainMargin} transition-all duration-300`}>
                {/* Top Bar */}
                <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center gap-4 px-4 lg:px-8 h-16">
                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Breadcrumbs */}
                        <Breadcrumbs />

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Credits Display */}
                        <CreditsDisplay />
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Floating AI Button */}
            <AIFloatingButton />
        </div>
    );
}
