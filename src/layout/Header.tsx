/**
 * Header Component - Professional public pages navigation
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/store";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Don't render header on dashboard routes
  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="group">
                    Get Started
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="block">
                    <Button className="w-full justify-center">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="block">
                      <Button
                        variant="secondary"
                        className="w-full justify-center"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" className="block">
                      <Button className="w-full justify-center">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
