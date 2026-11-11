/**
 * Header Component - Floating pill-style navigation
 * Centered content-width bar with rounded corners and frosted glass
 */

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Play, X } from "lucide-react";
import { useUIStore } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/common/UserAvatar";
import { useFeedback } from "@/context/FeedbackContext";
import { useState } from "react";
import toast from "react-hot-toast";

export function Header() {
    const { setAuthModalOpen, setAuthModalView } = useUIStore();
    const { user, isLoaded, isDemo, loginAsDemo, logout: signOut } = useAuth();
    const { openFeedback } = useFeedback();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (location.pathname.startsWith("/dashboard")) {
        return null;
    }

    const handleSignIn = () => {
        setAuthModalView("signin");
        setAuthModalOpen(true);
    };

    const handleDemo = () => {
        loginAsDemo();
        toast.success("Demo mode loaded!");
        navigate("/dashboard");
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
            <div
                className="max-w-[900px] mx-auto rounded-2xl border"
                style={{
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(20px) saturate(1.5)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                    borderColor: "rgba(0,0,0,0.06)",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)",
                }}
            >
                <nav className="flex items-center justify-between h-14 px-5">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <img
                            src="/logo.svg"
                            alt="Pitchrr"
                            className="h-8 transition-transform hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden lg:flex items-center gap-1">
                        <Link
                            to="/explore"
                            className="nav-link-hover"
                            data-active={isActive("/explore") || undefined}
                        >
                            Explore
                        </Link>
                        <button
                            onClick={openFeedback}
                            className="nav-link-hover"
                        >
                            Feedback
                        </button>
                        {user && (
                            <Link
                                to="/dashboard"
                                className="nav-link-hover"
                                data-active={isActive("/dashboard") || undefined}
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Desktop Right Actions */}
                    <div className="hidden lg:flex items-center gap-2.5">
                        {!isLoaded ? (
                            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                        ) : user ? (
                            <div className="flex items-center gap-2.5">
                                {isDemo && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Demo
                                    </span>
                                )}
                                <div className="relative group">
                                    <UserAvatar
                                        name={user.firstName || user.username || user.primaryEmailAddress?.emailAddress}
                                        imageUrl={user.imageUrl}
                                    />
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-xs font-semibold text-gray-900 truncate">
                                                {user.fullName || "User"}
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
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDemo}
                                    className="px-3.5 py-1.5 text-[12px] font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                                    style={{
                                        background: "rgba(16, 185, 129, 0.1)",
                                        color: "#059669",
                                        border: "1px solid rgba(16, 185, 129, 0.3)",
                                    }}
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                    Live Demo
                                </button>
                                <button
                                    onClick={handleSignIn}
                                    className="btn-gradient px-4 py-1.5 text-[12px] rounded-lg"
                                >
                                    Sign In
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </nav>

                {/* Mobile Navigation */}
                <div
                    className={`lg:hidden grid transition-all duration-300 ease-in-out ${mobileOpen
                            ? "grid-rows-[1fr] opacity-100 mt-2"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className="border-t border-gray-100/50 py-3 px-2 space-y-1">
                            <Link
                                to="/explore"
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary-blue)] hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Explore
                            </Link>
                            <button
                                onClick={() => { openFeedback(); setMobileOpen(false); }}
                                className="block w-full text-left px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:text-[var(--color-primary-blue)] hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Feedback
                            </button>
                            <div className="pt-2 px-2 space-y-2">
                                {!user ? (
                                    <>
                                        <button
                                            onClick={() => { handleDemo(); setMobileOpen(false); }}
                                            className="w-full py-2.5 text-[13px] font-semibold rounded-lg inline-flex items-center justify-center gap-2 cursor-pointer"
                                            style={{
                                                background: "rgba(16, 185, 129, 0.1)",
                                                color: "#059669",
                                                border: "1px solid rgba(16, 185, 129, 0.3)",
                                            }}
                                        >
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                            Try Live Demo
                                        </button>
                                        <button
                                            onClick={() => { handleSignIn(); setMobileOpen(false); }}
                                            className="btn-gradient w-full py-2.5 text-[13px] rounded-lg"
                                        >
                                            Sign In
                                        </button>
                                    </>
                                ) : (
                                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                                        <button className="btn-gradient w-full py-2.5 text-[13px] rounded-lg inline-flex items-center justify-center gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
