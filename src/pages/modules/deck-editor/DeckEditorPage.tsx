/**
 * DeckEditorPage — Main Pitch Deck Editor Page
 *
 * Full-screen layout with 3-panel design:
 * ┌─────────────────────────────────────────────────┐
 * │  EditorToolbar (top bar)                        │
 * ├──────────┬──────────────────┬───────────────────┤
 * │  Slides  │                  │  Properties       │
 * │  Panel   │    Canvas        │  Panel            │
 * │  (left)  │    (center)      │  (right)          │
 * │  200px   │    flex-1        │  280px             │
 * └──────────┴──────────────────┴───────────────────┘
 *
 * FEATURES:
 * - Loads existing deck from DB by deckId URL param
 * - Creates new blank deck if no deckId
 * - Saves to DB via API (Ctrl+S or Save button)
 * - Back to decks list navigation
 *
 * KEYBOARD SHORTCUTS:
 * - Ctrl+Z: Undo        - Ctrl+C: Copy
 * - Ctrl+Shift+Z: Redo  - Ctrl+V: Paste
 * - Ctrl+D: Duplicate   - Ctrl+S: Save
 * - Delete: Delete      - Escape: Deselect
 * - T: Add text
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useDeckEditorStore } from '@/store/useDeckEditorStore';
import { useDeck, useSaveDeck, useCreateDeck } from '@/hooks/useDeckEditor';
import type { DeckDocument } from '@/types/deck-editor.types';
import EditorToolbar from './EditorToolbar';
import EditorCanvas from './EditorCanvas';
import EditorSlidesPanel from './EditorSlidesPanel';
import EditorPropertiesPanel from './EditorPropertiesPanel';

export default function DeckEditorPage() {
  const { deckId } = useParams<{ deckId?: string }>();
  const navigate = useNavigate();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [hasLoadedDeck, setHasLoadedDeck] = useState(false);

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
  } = useDeckEditorStore();

  // =========================================================================
  // API HOOKS
  // =========================================================================

  // Load existing deck from DB
  const {
    data: deckRecord,
    isLoading: isLoadingDeck,
    error: loadError,
  } = useDeck(deckId);

  // Save mutation
  const { mutate: saveDeck, isPending: isSaving } = useSaveDeck();

  // Create mutation (for new decks without deckId)
  const { mutate: createDeck, isPending: isCreating } = useCreateDeck();

  // =========================================================================
  // LOAD DECK FROM DB
  // =========================================================================

  useEffect(() => {
    if (deckRecord && !hasLoadedDeck) {
      // Load the deck data from the DB into the store
      const deckData = deckRecord.data as DeckDocument;
      setDeck({
        ...deckData,
        id: deckRecord.id,
        title: deckRecord.title,
      });
      setHasLoadedDeck(true);
    }
  }, [deckRecord, hasLoadedDeck, setDeck]);

  // Reset editor when component unmounts or deckId changes
  useEffect(() => {
    return () => {
      setHasLoadedDeck(false);
    };
  }, [deckId]);

  // =========================================================================
  // SAVE HANDLER
  // =========================================================================

  const handleSave = useCallback(() => {
    const currentDeck = useDeckEditorStore.getState().deck;

    if (deckId) {
      // Update existing deck
      saveDeck(
        {
          deckId,
          title: currentDeck.title,
          data: currentDeck,
        },
        {
          onSuccess: () => {
            markSaved();
          },
        },
      );
    } else {
      // Create a new deck (no deckId in URL)
      createDeck(
        {
          title: currentDeck.title,
          data: currentDeck,
        },
        {
          onSuccess: (saved) => {
            markSaved();
            // Navigate to the saved deck URL so future saves are updates
            navigate(`/dashboard/pitch/${saved.id}`, { replace: true });
          },
        },
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
        isTextEditing ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        if (e.key === 'Escape') clearSelection();
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && !e.shiftKey && e.key === 'z') {
        e.preventDefault(); undo(); return;
      }
      if ((isCtrl && e.shiftKey && e.key === 'z') || (isCtrl && e.key === 'y')) {
        e.preventDefault(); redo(); return;
      }
      if (isCtrl && e.key === 'c') {
        e.preventDefault(); copyElement(); return;
      }
      if (isCtrl && e.key === 'v') {
        e.preventDefault(); pasteElement(); return;
      }
      if (isCtrl && e.key === 'd') {
        e.preventDefault();
        if (selectedElementId) duplicateElement(selectedElementId);
        return;
      }
      if (isCtrl && e.key === 's') {
        e.preventDefault(); handleSave(); return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) { e.preventDefault(); deleteElement(selectedElementId); }
        return;
      }
      if (e.key === 'Escape') { clearSelection(); return; }
      if ((e.key === 't' || e.key === 'T') && !isCtrl) { addText(); return; }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isTextEditing, selectedElementId, deleteElement, duplicateElement,
    clearSelection, undo, redo, addText, copyElement, pasteElement, handleSave,
  ]);

  // Warn before closing with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // =========================================================================
  // LOADING STATE
  // =========================================================================

  if (deckId && isLoadingDeck) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100 -m-6">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm text-gray-500">Loading deck...</p>
      </div>
    );
  }

  if (deckId && loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100 -m-6 gap-3">
        <p className="text-sm text-red-500">Failed to load deck</p>
        <button
          onClick={() => navigate('/dashboard/pitch')}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to new deck
        </button>
      </div>
    );
  }

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100 -m-6 -mt-6">
      {/* Top Toolbar */}
      <EditorToolbar onSave={handleSave} isSaving={isSaving || isCreating} />

      {/* Main 3-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Slides Panel */}
        <div className="w-[180px] lg:w-[200px] flex-shrink-0">
          <EditorSlidesPanel />
        </div>

        {/* Center: Canvas */}
        <div
          ref={canvasContainerRef}
          className="flex-1 overflow-auto flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        >
          <EditorCanvas containerRef={canvasContainerRef} />
        </div>

        {/* Right: Properties Panel */}
        <div className="w-[260px] lg:w-[280px] flex-shrink-0">
          <EditorPropertiesPanel />
        </div>
      </div>
    </div>
  );
}
