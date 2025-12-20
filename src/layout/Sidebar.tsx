/**
 * Sidebar Component - Dashboard navigation
 * Uses standard Tailwind classes.
 */

import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home,
    Lightbulb,
    Megaphone,
    Palette,
    Presentation,
    Rocket,
    Users,
    MessageSquare,
    LogOut,
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';

const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Lightbulb, label: 'Idea Validation', path: '/dashboard/idea' },
    { icon: Megaphone, label: 'Marketing Strategy', path: '/dashboard/marketing' },
    { icon: Palette, label: 'Branding', path: '/dashboard/branding' },
    { icon: Presentation, label: 'Pitch Deck', path: '/dashboard/pitch' },
    { icon: Rocket, label: 'GTM Strategy', path: '/dashboard/gtm' },
    { icon: Users, label: 'Competitor Analysis', path: '/dashboard/competitors' },
    { icon: MessageSquare, label: 'AI Chatbot', path: '/dashboard/chat' },
];

export function Sidebar() {
    const location = useLocation();
    const { logout } = useAuthStore();
    const { isSidebarOpen, isSidebarCollapsed, setSidebarOpen, toggleSidebarCollapse } = useUIStore();

    const sidebarWidth = isSidebarCollapsed ? 'w-[72px]' : 'w-[280px]';

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50
          transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        {!isSidebarCollapsed && (
                            <span className="text-xl font-bold text-gray-900">Pitchrr</span>
                        )}
                    </Link>

                    {/* Mobile close button */}
                    <button
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Desktop collapse button */}
                    <button
                        className="hidden lg:flex p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        onClick={toggleSidebarCollapse}
                    >
                        {isSidebarCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-colors duration-200
                      ${isActive
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }
                    `}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {!isSidebarCollapsed && (
                                            <span className="font-medium text-sm">{item.label}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-gray-200">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!isSidebarCollapsed && (
                            <span className="font-medium text-sm">Logout</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
