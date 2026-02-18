/**
 * Header Component - Professional public pages navigation
 */

import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { useUIStore } from "@/store";
import { useUser, useClerk } from "@clerk/clerk-react";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useFeedback } from "@/context/FeedbackContext";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
];

export function Header() {
    const { setAuthModalOpen } = useUIStore();
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const { openFeedback } = useFeedback();
    const location = useLocation();

    // Don't render header on dashboard routes
    if (location.pathname.startsWith("/dashboard")) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <img
                                src="/logo.svg"
                                alt="Pitchrr"
                                className="h-8 relative z-10 transition-transform group-hover:scale-105"
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300" />
                            </a>
                        ))}
                        <button
                            onClick={openFeedback}
                            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group"
                        >
                            Feedback
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 transition-all duration-300" />
                        </button>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {!isLoaded ? (
                            <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/dashboard">
                                    <Button
                                        variant="secondary"
                                        leftIcon={<LayoutDashboard className="w-4 h-4" />}
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <div className="relative group">
                                    <UserAvatar
                                        name={user.firstName || user.username || user.primaryEmailAddress?.emailAddress}
                                        imageUrl={user.imageUrl}
                                    />
                                    {/* Quick Dropdown Mock (to be improved) */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                {user.fullName || 'User'}
                                            </p>
                                            <p className="text-[10px] text-gray-500 truncate">
                                                {user.primaryEmailAddress?.emailAddress}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Button
                                className="group"
                                onClick={() => setAuthModalOpen(true)}
                            >
                                Get Started
                            </Button>
                        )}
                    </div>

                </nav>
            </div>

        </header>
    );
}

