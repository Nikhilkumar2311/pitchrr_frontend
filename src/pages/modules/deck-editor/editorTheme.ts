/**
 * Editor Theme System
 *
 * Provides light/dark theme tokens for the deck editor.
 * Light mode is the default. Users can toggle via the toolbar.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// =============================================================================
// THEME TOKENS
// =============================================================================

export interface EditorThemeTokens {
  // Workspace
  workspaceBg: string;
  canvasDotColor: string;
  canvasShadow: string;

  // Panels
  panelBg: string;
  panelBorder: string;
  panelHeaderBg: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Inputs
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  inputText: string;

  // Buttons
  btnBg: string;
  btnHoverBg: string;
  btnText: string;
  btnHoverText: string;

  // Accents
  accent: string;
  accentLight: string;
  accentGlow: string;

  // Toggle active states
  toggleActiveBg: string;
  toggleActiveText: string;
  toggleActiveShadow: string;

  // Danger
  dangerText: string;
  dangerBg: string;
  dangerBorder: string;

  // Context menu
  menuBg: string;
  menuBorder: string;
  menuShadow: string;
  menuHoverBg: string;

  // Misc
  divider: string;
  unsavedBg: string;
  unsavedText: string;
  unsavedBorder: string;

  // Dropdown option bg
  optionBg: string;
  optionText: string;

  // Save button
  saveBg: string;
  saveDisabledBg: string;
  saveDisabledText: string;
}

export const lightTheme: EditorThemeTokens = {
  workspaceBg: '#F1F3F8',
  canvasDotColor: 'rgba(0,0,0,0.04)',
  canvasShadow:
    '0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08), 0 12px 48px rgba(0,0,0,0.08)',

  panelBg: '#FFFFFF',
  panelBorder: '#E8ECF4',
  panelHeaderBg: '#FAFBFC',

  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',

  inputBg: '#F8FAFC',
  inputBorder: '#E2E8F0',
  inputFocus: 'rgba(99,102,241,0.45)',
  inputText: '#1E293B',

  btnBg: 'rgba(0,0,0,0.03)',
  btnHoverBg: 'rgba(0,0,0,0.06)',
  btnText: '#64748B',
  btnHoverText: '#1E293B',

  accent: '#6366F1',
  accentLight: 'rgba(99,102,241,0.08)',
  accentGlow: 'rgba(99,102,241,0.15)',

  toggleActiveBg: 'rgba(99,102,241,0.12)',
  toggleActiveText: '#6366F1',
  toggleActiveShadow: '0 0 0 1px rgba(99,102,241,0.2)',

  dangerText: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.06)',
  dangerBorder: 'rgba(239,68,68,0.15)',

  menuBg: '#FFFFFF',
  menuBorder: '#E8ECF4',
  menuShadow: '0 8px 32px rgba(0,0,0,0.12)',
  menuHoverBg: 'rgba(0,0,0,0.03)',

  divider: '#E8ECF4',
  unsavedBg: 'rgba(245,158,11,0.08)',
  unsavedText: '#D97706',
  unsavedBorder: 'rgba(245,158,11,0.2)',

  optionBg: '#FFFFFF',
  optionText: '#1E293B',

  saveBg: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  saveDisabledBg: 'rgba(0,0,0,0.04)',
  saveDisabledText: '#94A3B8',
};

export const darkTheme: EditorThemeTokens = {
  workspaceBg: '#0F1019',
  canvasDotColor: 'rgba(255,255,255,0.03)',
  canvasShadow:
    '0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.3), 0 12px 48px rgba(0,0,0,0.4), 0 0 80px rgba(99,102,241,0.06)',

  panelBg: '#14151F',
  panelBorder: 'rgba(255,255,255,0.06)',
  panelHeaderBg: 'rgba(255,255,255,0.02)',

  textPrimary: 'rgba(255,255,255,0.85)',
  textSecondary: 'rgba(255,255,255,0.5)',
  textMuted: 'rgba(255,255,255,0.3)',

  inputBg: 'rgba(255,255,255,0.05)',
  inputBorder: 'rgba(255,255,255,0.1)',
  inputFocus: 'rgba(99,102,241,0.5)',
  inputText: 'rgba(255,255,255,0.85)',

  btnBg: 'transparent',
  btnHoverBg: 'rgba(255,255,255,0.08)',
  btnText: 'rgba(255,255,255,0.5)',
  btnHoverText: 'rgba(255,255,255,0.85)',

  accent: '#6366F1',
  accentLight: 'rgba(99,102,241,0.15)',
  accentGlow: 'rgba(99,102,241,0.25)',

  toggleActiveBg: 'rgba(99,102,241,0.2)',
  toggleActiveText: '#818CF8',
  toggleActiveShadow: '0 0 0 1px rgba(99,102,241,0.3)',

  dangerText: 'rgba(239,68,68,0.8)',
  dangerBg: 'rgba(239,68,68,0.1)',
  dangerBorder: 'rgba(239,68,68,0.2)',

  menuBg: '#1E1F2E',
  menuBorder: 'rgba(255,255,255,0.1)',
  menuShadow: '0 8px 32px rgba(0,0,0,0.5)',
  menuHoverBg: 'rgba(255,255,255,0.06)',

  divider: 'rgba(255,255,255,0.08)',
  unsavedBg: 'rgba(245,158,11,0.15)',
  unsavedText: '#FBBF24',
  unsavedBorder: 'rgba(245,158,11,0.2)',

  optionBg: '#1E1F2E',
  optionText: '#FFFFFF',

  saveBg: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  saveDisabledBg: 'rgba(255,255,255,0.06)',
  saveDisabledText: 'rgba(255,255,255,0.3)',
};

// =============================================================================
// ZUSTAND STORE
// =============================================================================

interface EditorThemeState {
  mode: 'light' | 'dark';
  tokens: EditorThemeTokens;
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark') => void;
}

export const useEditorTheme = create<EditorThemeState>()(
  persist(
    (set) => ({
      mode: 'light' as const,
      tokens: lightTheme,
      toggleMode: () =>
        set((state) => {
          const newMode = state.mode === 'light' ? 'dark' : 'light';
          return { mode: newMode, tokens: newMode === 'light' ? lightTheme : darkTheme };
        }),
      setMode: (mode: 'light' | 'dark') =>
        set({ mode, tokens: mode === 'light' ? lightTheme : darkTheme }),
    }),
    {
      name: 'pitchrr-editor-theme',
      partialize: (state) => ({ mode: state.mode }) as Pick<EditorThemeState, 'mode'>,
      merge: (persisted, current) => {
        const p = persisted as Partial<EditorThemeState> | undefined;
        const mode = p?.mode || current.mode;
        return {
          ...current,
          mode,
          tokens: mode === 'light' ? lightTheme : darkTheme,
        };
      },
    },
  ),
);
