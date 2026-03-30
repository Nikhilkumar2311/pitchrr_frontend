/**
 * Sidebar Component - Dashboard navigation
 * Premium styling with gradient active indicators.
 */

import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Lightbulb,
  Megaphone,
  Palette,
  Presentation,
  Rocket,
  Users,
  MessageSquare,
  HandCoins,
  BarChart3,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUIStore } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Lightbulb, label: "Idea Validation", path: "/dashboard/idea" },
  {
    icon: Megaphone,
    label: "Marketing Strategy",
    path: "/dashboard/marketing",
  },
  { icon: Palette, label: "Branding", path: "/dashboard/branding" },
  { icon: Presentation, label: "Pitch Deck", path: "/dashboard/pitch" },
  { icon: Rocket, label: "GTM Strategy", path: "/dashboard/gtm" },
  { icon: Users, label: "Competitor Analysis", path: "/dashboard/competitors" },
  { icon: HandCoins, label: "Grants & Funding", path: "/dashboard/grants" },
  { icon: MessageSquare, label: "AI Chatbot", path: "/dashboard/chat" },
  { icon: BarChart3, label: "My Posts", path: "/dashboard/my-posts" },
];

export function Sidebar() {
  const location = useLocation();
  const { logout: signOut } = useAuth();
  const {
    isSidebarOpen,
    isSidebarCollapsed,
    setSidebarOpen,
    toggleSidebarCollapse,
  } = useUIStore();
  const { ideaId } = useParams<{ ideaId?: string }>();

  const activeIdeaId = ideaId;

  const sidebarWidth = isSidebarCollapsed ? "w-[72px]" : "w-[260px]";

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          transition-all duration-300 ease-in-out
          ${sidebarWidth}
          ${isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{
          background: 'var(--dash-bg, #F8FAFF)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between h-[56px] px-4"
        >
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

          {/* Mobile close button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={toggleSidebarCollapse}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          {!isSidebarCollapsed && (
            <div className="px-4 mb-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--dash-text-muted)' }}
              >
                Workspace
              </span>
            </div>
          )}
          <ul className="space-y-0.5 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const linkPath = activeIdeaId && item.path.includes('/dashboard/') && item.path !== '/dashboard'
                ? `${item.path}/${activeIdeaId}`
                : item.path;
              const isActive = location.pathname === item.path || location.pathname === linkPath;

              return (
                <li key={item.path}>
                  <Link
                    to={linkPath}
                    className={`
                      relative flex items-center gap-3 px-3 py-2 rounded-[var(--dash-radius-sm,8px)]
                      transition-all duration-200 group
                    `}
                    style={{
                      fontFamily: 'var(--dash-font-body)',
                      ...(isActive
                        ? {
                          background: 'rgba(79,125,243,0.06)',
                          color: '#4F7DF3',
                        }
                        : {
                          color: 'var(--dash-text-muted)',
                        }),
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
                        e.currentTarget.style.color = 'var(--dash-text-secondary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = 'var(--dash-text-muted)';
                      }
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {/* Active gradient accent bar */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                        style={{ background: 'linear-gradient(180deg, #4F7DF3, #7A5CFF)' }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className="w-[18px] h-[18px] shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="text-[13px] font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all cursor-pointer"
            style={{
              color: 'var(--dash-text-muted)',
              fontFamily: 'var(--dash-font-body)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.05)';
              e.currentTarget.style.color = '#EF4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--dash-text-muted)';
            }}
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            {!isSidebarCollapsed && (
              <span className="text-[13px] font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
