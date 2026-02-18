/**
 * DashboardLayout Component
 * Uses standard Tailwind classes.
 */

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Briefcase, MessageSquare } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AIFloatingButton } from '@/components/common/AIFloatingButton';
import { CreditsDisplay } from '@/components/common/CreditsDisplay';
import { useUIStore } from '@/store';
import { useFeedback } from '@/context/FeedbackContext';

export function DashboardLayout() {
    const { isSidebarCollapsed, setSidebarOpen } = useUIStore();
    const { openFeedback } = useFeedback();
    const location = useLocation();
    const navigate = useNavigate();

    const mainMargin = isSidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]';
    const isChatbotPage = location.pathname.includes('/chat');
    const isServicesPage = location.pathname.includes('/services');

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

                        {/* Feedback Button */}
                        <button
                            onClick={openFeedback}
                            className="flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors mr-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">Feedback</span>
                        </button>

                        {/* Our Services Button */}
                        <button
                            onClick={() => navigate('/dashboard/services')}
                            className={`flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${isServicesPage
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-200'
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:shadow-sm hover:border-blue-300'
                                }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            <span className="hidden sm:inline">Our Services</span>
                        </button>

                        {/* Credits Display */}
                        <CreditsDisplay />
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Floating AI Button — hidden on chatbot page */}
            {!isChatbotPage && <AIFloatingButton />}
        </div>
    );
}

