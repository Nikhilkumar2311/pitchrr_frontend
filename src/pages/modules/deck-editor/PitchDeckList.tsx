/**
 * PitchDeckList — Premium Deck Listing + AI Generation Page
 *
 * Features:
 * - Generate new pitch deck with AI
 * - List of all saved decks with beautiful cards
 * - Generate One Pager (restored)
 * - Export PPT
 * - Create blank deck
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Presentation,
  Plus,
  Sparkles,
  Calendar,
  Clock,
  MoreVertical,
  Trash2,
  Pencil,
  Loader2,
  FileText,
  Download,
  Layers,
  Wand2,
} from 'lucide-react';
import {
  Button,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { CreditCost, SEO } from '@/components/common';
import { OnePager } from '@/components/pitch-deck/OnePager';
import {
  useIdea,
  useIdeas,
  useModuleData,
  useGenerateModule,
  useExportModule,
  useExportStatus,
  useUserDecks,
  useDecksByIdea,
  useCreateDeck,
  useDeleteDeck,
  deckEditorKeys,
} from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import type { DeckListItem } from '@/hooks';
import { downloadFile } from '@/utils';
import { convertAIToDeckDocument } from '@/utils/deckConverter';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/deck-editor.types';

export default function PitchDeckList() {
  const navigate = useNavigate();
  const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();
  const queryClient = useQueryClient();

  // =========================================================================
  // IDEA HOOKS
  // =========================================================================
  const { activeIdeaId: storedActiveIdeaId, setActiveIdeaId } = useIdeaStore();
  const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);
  const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
  const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;
  const { data: ideaData, isLoading: isLoadingIdea } = useIdea(activeIdeaId);

  // Module data (to check if AI has generated)
  const { data: moduleData } = useModuleData(activeIdeaId, 'pitch_deck');
  const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

  const hasGenerated = moduleData?.exists && moduleData.data;
  const isGenerating = isTriggering || moduleData?.status === 'IN_PROGRESS';

  // =========================================================================
  // DECK LIST HOOKS
  // =========================================================================
  const { data: userDecks, isLoading: isLoadingDecks } = useUserDecks();
  const { data: ideaDecks } = useDecksByIdea(activeIdeaId);
  const { mutate: createDeck, isPending: isCreatingDeck } = useCreateDeck();
  const { mutate: deleteDeck } = useDeleteDeck();

  // Export hooks
  const { mutate: exportModule, isPending: isExporting } = useExportModule('pitch-deck', activeIdeaId);
  const [exportJobId, setExportJobId] = useState<string | null>(null);
  const { data: exportStatus } = useExportStatus(exportJobId);

  // One Pager state
  const [showOnePager, setShowOnePager] = useState(false);

  // Context menu
  const [contextDeckId, setContextDeckId] = useState<string | null>(null);

  // Delete confirmation
  const [deletingDeckId, setDeletingDeckId] = useState<string | null>(null);

  // Sync idea
  useEffect(() => {
    if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
      setActiveIdeaId(activeIdeaId);
    }
  }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

  // Export status watcher
  useEffect(() => {
    if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
      const filename = `${ideaData?.title || 'pitch'}_deck.pptx`.replace(/[^a-zA-Z0-9_.-]/g, '_');
      downloadFile(exportStatus.downloadUrl, filename)
        .then(() => toast.success('Pitch deck downloaded!'))
        .catch(() => toast.error('Download failed'));
      setExportJobId(null);
    } else if (exportStatus?.state === 'failed') {
      toast.error('Export failed');
      setExportJobId(null);
    }
  }, [exportStatus, ideaData?.title]);

  // Refetch decks list automatically after AI generation completes
  const prevGenerating = useRef(isGenerating);
  useEffect(() => {
    if (prevGenerating.current && !isGenerating && moduleData?.status === 'COMPLETED') {
      queryClient.invalidateQueries({ queryKey: deckEditorKeys.list() });
      if (activeIdeaId) {
        queryClient.invalidateQueries({ queryKey: deckEditorKeys.byIdea(activeIdeaId) });
      }
    }
    prevGenerating.current = isGenerating;
  }, [isGenerating, moduleData?.status, activeIdeaId, queryClient]);

  // =========================================================================
  // HANDLERS
  // =========================================================================

  const handleGenerate = () => {
    if (!activeIdeaId) {
      toast.error('Please create an idea first');
      return;
    }
    generateModule('pitch_deck');
  };

  const handleCreateBlankDeck = () => {
    const blankDeck = {
      title: 'Untitled Pitch Deck',
      slides: [
        {
          id: crypto.randomUUID(),
          elements: [],
          background: '#FFFFFF',
        },
      ],
      canvasWidth: CANVAS_WIDTH,
      canvasHeight: CANVAS_HEIGHT,
    };

    createDeck(
      { title: 'Untitled Pitch Deck', data: blankDeck, ideaId: activeIdeaId },
      {
        onSuccess: (saved) => {
          navigate(`/dashboard/pitch/${saved.id}`);
        },
      },
    );
  };

  const handleOpenInEditor = () => {
    if (!moduleData?.data?.slides) return;

    const deckTitle = ideaData?.title
      ? `${ideaData.title} - Pitch Deck`
      : 'AI Pitch Deck';

    const deckDocument = convertAIToDeckDocument(
      { slides: moduleData.data.slides },
      deckTitle,
    );

    createDeck(
      { title: deckDocument.title, data: deckDocument, ideaId: activeIdeaId },
      {
        onSuccess: (saved) => {
          navigate(`/dashboard/pitch/${saved.id}`);
        },
      },
    );
  };

  const handleExportPPT = () => {
    if (!hasGenerated) return;
    exportModule(
      { slides: moduleData!.data.slides } as any,
      { onSuccess: (data) => setExportJobId(data.jobId) },
    );
  };

  const handleDeleteDeck = (deckId: string) => {
    setContextDeckId(null);
    setDeletingDeckId(deckId);
  };

  const confirmDelete = () => {
    if (deletingDeckId) {
      deleteDeck(deletingDeckId);
      toast.success('Deck deleted');
    }
    setDeletingDeckId(null);
  };

  // =========================================================================
  // DISPLAY DECKS
  // =========================================================================
  const displayDecks: DeckListItem[] = (ideaDecks && ideaDecks.length > 0)
    ? ideaDecks
    : (userDecks || []);

  const isLoading = isLoadingIdeas || isLoadingIdea || isLoadingDecks;

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="space-y-6">
      <SEO
        title="Pitch Deck"
        description="Generate investor-ready pitch decks with AI and edit them in a visual editor."
        canonical="/dashboard/pitch"
      />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold flex items-center gap-3"
            style={{ fontFamily: 'var(--dash-font-heading)', color: 'var(--dash-text)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)' }}
            >
              <Presentation className="w-5 h-5 text-white" />
            </div>
            Pitch Deck
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--dash-text-muted)' }}>
            Create, edit, and manage investor-ready pitch decks
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hasGenerated && (
            <>
              <Button
                variant="secondary"
                leftIcon={<FileText className="w-4 h-4" />}
                onClick={() => setShowOnePager(true)}
              >
                One Pager
              </Button>
              <Button
                variant="secondary"
                leftIcon={<Download className="w-4 h-4" />}
                disabled={isExporting || !!exportJobId}
                isLoading={isExporting || !!exportJobId}
                onClick={handleExportPPT}
              >
                <span className="flex items-center gap-2">
                  {exportJobId ? 'Exporting...' : 'Export PPT'}
                  {!exportJobId && <CreditCost cost={5} />}
                </span>
              </Button>
              <Button
                variant="secondary"
                leftIcon={<Pencil className="w-4 h-4" />}
                onClick={handleOpenInEditor}
                disabled={isCreatingDeck}
                isLoading={isCreatingDeck}
              >
                {isCreatingDeck ? 'Creating...' : 'Open in Editor'}
              </Button>
            </>
          )}
          <Button
            variant="secondary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreateBlankDeck}
            disabled={isCreatingDeck}
          >
            New Blank
          </Button>
        </div>
      </div>

      {/* Generate Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))',
          border: '1px solid rgba(99,102,241,0.12)',
          boxShadow: '0 4px 24px rgba(99,102,241,0.06)',
        }}
      >
        {/* Decorative glow */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="relative p-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            >
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}>
                Generate with AI
              </h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--dash-text-muted)' }}>
                Create a professional 12-slide investor pitch deck from your startup idea
              </p>
              <div className="mt-4">
                <Button
                  onClick={handleGenerate}
                  isLoading={isGenerating}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  disabled={!activeIdeaId}
                >
                  <span className="flex items-center gap-2">
                    {hasGenerated ? 'Regenerate with AI' : 'Generate Pitch Deck'}
                    <CreditCost cost={20} />
                  </span>
                </Button>
                {!activeIdeaId && (
                  <p className="text-xs mt-2" style={{ color: 'var(--dash-text-muted)' }}>
                    Please create an idea in Idea Validation first
                  </p>
                )}
                {isGenerating && (
                  <div
                    className="flex items-center gap-3 mt-4 rounded-xl px-4 py-3"
                    style={{
                      background: 'rgba(245,158,11,0.08)',
                      border: '1px solid rgba(245,158,11,0.15)',
                    }}
                  >
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#F59E0B' }} />
                    <span className="text-sm font-medium" style={{ color: '#D97706' }}>
                      AI is generating your pitch deck... This takes 30-60 seconds.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deck Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--dash-text)' }}>
            <Layers className="w-5 h-5" style={{ color: 'var(--dash-text-muted)' }} />
            Your Decks
            {displayDecks.length > 0 && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full ml-1"
                style={{ background: 'rgba(99,102,241,0.1)', color: '#6366F1' }}
              >
                {displayDecks.length}
              </span>
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl h-52 animate-pulse"
                style={{ background: 'var(--dash-surface)', border: '1px solid var(--dash-border-solid)' }}
              >
                <div className="h-32 rounded-t-xl" style={{ background: 'rgba(0,0,0,0.03)' }} />
                <div className="p-3 space-y-2">
                  <div className="h-4 rounded w-2/3" style={{ background: 'rgba(0,0,0,0.04)' }} />
                  <div className="h-3 rounded w-1/3" style={{ background: 'rgba(0,0,0,0.03)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayDecks.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{
              background: 'var(--dash-surface)',
              border: '1px solid var(--dash-border-solid)',
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))' }}
            >
              <Presentation className="w-8 h-8" style={{ color: 'rgba(99,102,241,0.4)' }} />
            </div>
            <p className="font-semibold" style={{ color: 'var(--dash-text-secondary)' }}>
              No pitch decks yet
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--dash-text-muted)' }}>
              Generate one with AI or create a blank deck to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayDecks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="group relative rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  background: 'var(--dash-surface)',
                  border: '1px solid var(--dash-border-solid)',
                  boxShadow: 'var(--dash-shadow-card)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                  e.currentTarget.style.boxShadow = 'var(--dash-shadow-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--dash-border-solid)';
                  e.currentTarget.style.boxShadow = 'var(--dash-shadow-card)';
                }}
                onClick={() => navigate(`/dashboard/pitch/${deck.id}`)}
              >
                {/* Thumbnail */}
                <div
                  className="h-32 flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.06) 50%, rgba(236,72,153,0.06) 100%)',
                  }}
                >
                  <Presentation className="w-10 h-10 transition-colors" style={{ color: 'rgba(99,102,241,0.25)' }} />
                  {/* Context menu button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextDeckId(contextDeckId === deck.id ? null : deck.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {contextDeckId === deck.id && (
                    <div
                      className="absolute top-10 right-2 rounded-xl py-1 min-w-[140px] z-10"
                      style={{
                        background: 'var(--dash-surface)',
                        border: '1px solid var(--dash-border-solid)',
                        boxShadow: 'var(--dash-shadow-float)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2"
                        style={{ color: '#EF4444' }}
                        onClick={() => handleDeleteDeck(deck.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--dash-text)' }}>
                    {deck.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: 'var(--dash-text-muted)' }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(deck.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(deck.updatedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* One Pager Modal */}
      {showOnePager && activeIdeaId && (
        <OnePager
          slides={moduleData?.data?.slides || []}
          companyName={ideaData?.title || 'Company'}
          ideaId={activeIdeaId}
          onClose={() => setShowOnePager(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingDeckId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeletingDeckId(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl p-6 w-[380px] max-w-[90vw]"
            style={{
              background: 'var(--dash-surface, #FFFFFF)',
              border: '1px solid var(--dash-border-solid, #E8ECF4)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)' }}>
                <Trash2 className="w-5 h-5" style={{ color: '#EF4444' }} />
              </div>
              <div>
                <h3 className="text-base font-semibold" style={{ color: 'var(--dash-text)' }}>Delete Deck</h3>
                <p className="text-sm" style={{ color: 'var(--dash-text-muted)' }}>This action cannot be undone</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-end mt-6">
              <button
                onClick={() => setDeletingDeckId(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: 'var(--dash-text-secondary)', background: 'rgba(0,0,0,0.04)' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: '#EF4444' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#DC2626'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#EF4444'; }}
              >
                Delete Permanently
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
