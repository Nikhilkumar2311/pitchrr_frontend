/**
 * DeckEditorPage — Main Pitch Deck Editor Page
 *
 * Full-screen 3-panel layout with light/dark theme toggle:
 * ┌─────────────────────────────────────────────────┐
 * │  EditorToolbar (top bar with theme toggle)      │
 * ├──────────┬──────────────────┬───────────────────┤
 * │  Slides  │                  │  Properties       │
 * │  Panel   │    Canvas        │  Panel            │
 * │  (left)  │    (center)      │  (right)          │
 * │  210px   │    flex-1        │  290px            │
 * └──────────┴──────────────────┴───────────────────┘
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Presentation } from 'lucide-react';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { useDeck, useSaveDeck, useCreateDeck } from '@/hooks/useDeckEditor';
import type { DeckDocument } from '@/types/deck-editor.types';
import { useEditorTheme } from './editorTheme';
import EditorToolbar from './EditorToolbar';
import EditorCanvas from './EditorCanvas';
import EditorSlidesPanel from './EditorSlidesPanel';
import EditorPropertiesPanel from './EditorPropertiesPanel';

export default function DeckEditorPage() {
  const { deckId } = useParams<{ deckId?: string }>();
  const navigate = useNavigate();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [hasLoadedDeck, setHasLoadedDeck] = useState(false);
  const t = useEditorTheme((s) => s.tokens);

  const {
    isTextEditing,
    selectedElementId,
    isDirty,
    setDeck,
    deleteElement,
    duplicateElement,
    clearSelection,
    undo,
    redo,
    addText,
    copyElement,
    pasteElement,
    markSaved,
    nextSlide,
    prevSlide,
  } = useDeckEditorStore();

  // =========================================================================
  // API HOOKS
  // =========================================================================
  const {
    data: deckRecord,
    isLoading: isLoadingDeck,
    error: loadError,
  } = useDeck(deckId);

  const { mutate: saveDeck, isPending: isSaving } = useSaveDeck();
  const { mutate: createDeck, isPending: isCreating } = useCreateDeck();

  // =========================================================================
  // LOAD DECK FROM DB
  // =========================================================================
  useEffect(() => {
    if (deckRecord && !hasLoadedDeck) {
      const deckData = deckRecord.data as DeckDocument;
      setDeck({ ...deckData, id: deckRecord.id, title: deckRecord.title });
      setHasLoadedDeck(true);
    }
  }, [deckRecord, hasLoadedDeck, setDeck]);

  useEffect(() => {
    return () => { setHasLoadedDeck(false); };
  }, [deckId]);

  // =========================================================================
  // SAVE HANDLER
  // =========================================================================
  const handleSave = useCallback(() => {
    const currentDeck = useDeckEditorStore.getState().deck;
    if (deckId) {
      saveDeck(
        { deckId, title: currentDeck.title, data: currentDeck },
        { onSuccess: () => { markSaved(); } },
      );
    } else {
      createDeck(
        { title: currentDeck.title, data: currentDeck },
        { onSuccess: (saved) => { markSaved(); navigate(`/dashboard/pitch/${saved.id}`, { replace: true }); } },
      );
    }
  }, [deckId, saveDeck, createDeck, markSaved, navigate]);

  // =========================================================================
  // KEYBOARD SHORTCUTS
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        isTextEditing || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' || target.isContentEditable
      ) {
        if (e.key === 'Escape') clearSelection();
        return;
      }
      const isCtrl = e.ctrlKey || e.metaKey;
      if (isCtrl && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); return; }
      if ((isCtrl && e.shiftKey && e.key === 'z') || (isCtrl && e.key === 'y')) { e.preventDefault(); redo(); return; }
      if (isCtrl && e.key === 'c') { e.preventDefault(); copyElement(); return; }
      if (isCtrl && e.key === 'v') { e.preventDefault(); pasteElement(); return; }
      if (isCtrl && e.key === 'd') { e.preventDefault(); if (selectedElementId) duplicateElement(selectedElementId); return; }
      if (isCtrl && e.key === 's') { e.preventDefault(); handleSave(); return; }
      if (e.key === 'Delete' || e.key === 'Backspace') { if (selectedElementId) { e.preventDefault(); deleteElement(selectedElementId); } return; }
      if (e.key === 'Escape') { clearSelection(); return; }
      if ((e.key === 't' || e.key === 'T') && !isCtrl) { addText(); return; }
      // Arrow keys to navigate slides when no element is selected
      if (!selectedElementId && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) { e.preventDefault(); nextSlide(); return; }
      if (!selectedElementId && (e.key === 'ArrowLeft' || e.key === 'ArrowUp')) { e.preventDefault(); prevSlide(); return; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTextEditing, selectedElementId, deleteElement, duplicateElement, clearSelection, undo, redo, addText, copyElement, pasteElement, handleSave, nextSlide, prevSlide]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (isDirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // =========================================================================
  // LOADING STATE
  // =========================================================================
  if (deckId && isLoadingDeck) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] -m-6" style={{ background: t.workspaceBg }}>
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            <Presentation className="w-7 h-7 text-white" />
          </div>
          <Loader2 className="w-5 h-5 animate-spin absolute -bottom-1 -right-1" style={{ color: t.accent }} />
        </div>
        <p className="text-sm mt-2 font-medium" style={{ color: t.textSecondary }}>Loading your deck...</p>
      </div>
    );
  }

  if (deckId && loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] -m-6 gap-4" style={{ background: t.workspaceBg }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: t.dangerBg }}>
          <Presentation className="w-7 h-7" style={{ color: t.dangerText }} />
        </div>
        <p className="text-sm font-medium" style={{ color: t.dangerText }}>Failed to load deck</p>
        <button onClick={() => navigate('/dashboard/pitch')} className="text-sm flex items-center gap-1.5 transition-colors" style={{ color: t.accent }}>
          <ArrowLeft className="w-4 h-4" /> Back to decks
        </button>
      </div>
    );
  }

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -m-6 -mt-6" style={{ background: t.workspaceBg }}>
      <EditorToolbar onSave={handleSave} isSaving={isSaving || isCreating} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[190px] lg:w-[210px] flex-shrink-0">
          <EditorSlidesPanel />
        </div>
        <div
          ref={canvasContainerRef}
          className="flex-1 overflow-auto flex items-center justify-center p-6"
          style={{
            background: t.workspaceBg,
            backgroundImage: `radial-gradient(circle at 1px 1px, ${t.canvasDotColor} 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        >
          <EditorCanvas containerRef={canvasContainerRef} />
        </div>
        <div className="w-[270px] lg:w-[290px] flex-shrink-0">
          <EditorPropertiesPanel />
        </div>
      </div>
    </div>
  );
}
