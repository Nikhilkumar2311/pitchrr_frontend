/**
 * UI Store (Zustand)
 * 
 * Manages UI-related global state like:
 * - Sidebar open/closed
 * - Modal states
 * - Theme settings
 * 
 * WHY A SEPARATE UI STORE?
 * - Keeps auth logic separate from UI logic
 * - Easy to find UI-related state
 * - Can be easily extended for new UI features
 */

import { create } from 'zustand';

interface UIStore {
    // Sidebar state
    isSidebarOpen: boolean;
    isSidebarCollapsed: boolean; // For desktop: full vs mini sidebar

    // Auth Modal state
    isAuthModalOpen: boolean;

    // Actions
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebarCollapse: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setAuthModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    // Initial state
    isSidebarOpen: false,        // Mobile sidebar drawer
    isSidebarCollapsed: false,   // Desktop sidebar collapse
    isAuthModalOpen: false,

    // Toggle sidebar open/closed (mobile)
    toggleSidebar: () => set((state) => ({
        isSidebarOpen: !state.isSidebarOpen
    })),

    // Set sidebar state directly
    setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),

    // Toggle sidebar collapse (desktop)
    toggleSidebarCollapse: () => set((state) => ({
        isSidebarCollapsed: !state.isSidebarCollapsed
    })),

    // Set collapse state directly
    setSidebarCollapsed: (collapsed: boolean) => set({
        isSidebarCollapsed: collapsed
    }),

    // Auth Modal actions
    setAuthModalOpen: (open: boolean) => set({ isAuthModalOpen: open }),
}));
