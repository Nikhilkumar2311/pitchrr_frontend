/**
 * DashboardLayout Component
 * Premium SaaS workspace layout with frosted glass top bar.
 */

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Briefcase, MessageSquare, RotateCcw, LogOut, Sparkles } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { AIFloatingButton } from '@/components/common/AIFloatingButton';
import { CreditsDisplay } from '@/components/common/CreditsDisplay';
import { useUIStore, useIdeaStore } from '@/store';
import { useFeedback } from '@/context/FeedbackContext';
import { useAuth } from '@/context/AuthContext';
import { resetDemoData } from '@/demo/demoStore';
import '@/styles/dashboard.css';

export function DashboardLayout() {
    const { isSidebarCollapsed, setSidebarOpen } = useUIStore();
    const { setActiveIdeaId } = useIdeaStore();
    const { openFeedback } = useFeedback();
    const { isDemo, logout } = useAuth();
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();

    const mainMargin = isSidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]';
    const isChatbotPage = location.pathname.includes('/chat');
    const isServicesPage = location.pathname.includes('/services');

    const handleResetDemo = () => {
        const fresh = resetDemoData();
        setActiveIdeaId(fresh.ideas[0]?.id || null);
        queryClient.invalidateQueries();
        toast.success('Demo data reset to defaults!');
    };

    const handleExitDemo = async () => {
        await logout();
        queryClient.clear();
        navigate('/');
        toast.success('Exited demo mode');
    };

    return (
        <div className="dashboard-layout min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className={`${mainMargin} transition-all duration-300`}>
                {isDemo && (
                    <div
                        className="px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs"
                        style={{
                            background: 'linear-gradient(90deg, rgba(16,185,129,0.12), rgba(79,125,243,0.1))',
                            borderBottom: '1px solid rgba(16,185,129,0.2)',
                            color: '#065F46',
                        }}
                    >
                        <div className="flex items-center gap-2 font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>
                                <strong>Interactive Demo Mode</strong> — Running locally with sample startup data (no backend required)
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleResetDemo}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold bg-white/80 hover:bg-white text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Reset Data
                            </button>
                            <button
                                onClick={handleExitDemo}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold bg-white/80 hover:bg-white text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                            >
                                <LogOut className="w-3 h-3" />
                                Exit Demo
                            </button>
                        </div>
                    </div>
                )}

                {/* Top Bar — frosted glass */}
                <div
                    className="sticky top-0 z-30"
                    style={{
                        background: 'rgba(248,250,255,0.8)',
                        backdropFilter: 'blur(16px) saturate(1.4)',
                        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                    }}
                >
                    <div className="flex items-center gap-4 px-5 lg:px-8 h-[56px]">
                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-white/60 transition-colors"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Breadcrumbs */}
                        <Breadcrumbs />

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Feedback Button */}
                        <button
                            onClick={openFeedback}
                            className="flex items-center gap-2 h-8 px-3.5 rounded-lg text-[13px] font-medium transition-colors"
                            style={{
                                color: 'var(--dash-text-muted)',
                                fontFamily: 'var(--dash-font-body)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                                e.currentTarget.style.color = 'var(--dash-text)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--dash-text-muted)';
                            }}
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Feedback</span>
                        </button>

                        {/* Our Services Button */}
                        <button
                            onClick={() => navigate('/dashboard/services')}
                            className="flex items-center gap-2 h-8 px-3.5 rounded-lg text-[13px] font-semibold transition-all duration-200"
                            style={{
                                fontFamily: 'var(--dash-font-body)',
                                ...(isServicesPage
                                    ? {
                                        background: 'var(--dash-gradient)',
                                        color: 'white',
                                        boxShadow: '0 2px 8px rgba(79,125,243,0.25)',
                                    }
                                    : {
                                        border: '1px solid var(--dash-border-solid)',
                                        color: 'var(--dash-text-secondary)',
                                        background: 'white',
                                    }),
                            }}
                        >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Our Services</span>
                        </button>

                        {/* Credits Display */}
                        <CreditsDisplay />
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-5 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Floating AI Button — hidden on chatbot page */}
            {!isChatbotPage && <AIFloatingButton />}
        </div>
    );
}
