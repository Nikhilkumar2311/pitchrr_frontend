/**
 * PitchDeckList — Deck listing + AI generation page
 *
 * This is the main entry point when user clicks "Pitch Deck" in sidebar.
 * Shows:
 * - Generate new pitch deck with AI (uses existing PitchDeck.tsx flow)
 * - List of all saved decks from PitchDeckEditor table
 * - Click a deck → opens the visual editor at /dashboard/pitch/:deckId
 * - Create new blank deck option
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
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { CreditCost, SEO } from '@/components/common';
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

  // Context menu
  const [contextDeckId, setContextDeckId] = useState<string | null>(null);

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
      // Invalidate to fetch the newly auto-saved deck
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
    if (confirm('Delete this deck permanently?')) {
      deleteDeck(deckId);
    }
    setContextDeckId(null);
  };

  // =========================================================================
  // DISPLAY DECKS — prefer idea-specific, fallback to all user decks
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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Presentation className="w-7 h-7 text-[#F59E0B]" />
            Pitch Deck
          </h1>
          <p className="mt-1 text-gray-600">
            Create, edit, and manage your pitch decks
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasGenerated && (
            <>
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
      <Card>
        <CardHeader>
          <CardTitle>Generate with AI</CardTitle>
          <CardDescription>
            Create a professional 12-slide investor pitch deck from your startup idea
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
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
            <p className="text-sm text-gray-500 mt-2">
              Please create an idea in Idea Validation first
            </p>
          )}
          {isGenerating && (
            <div className="flex items-center gap-3 mt-4 text-amber-700 bg-amber-50 rounded-lg px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">
                AI is generating your pitch deck... This takes 30-60 seconds.
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Deck Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Your Decks {displayDecks.length > 0 && (
            <span className="text-sm font-normal text-gray-500 ml-1">
              ({displayDecks.length})
            </span>
          )}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 h-48 animate-pulse"
              >
                <div className="h-28 bg-gray-100 rounded-t-xl" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-50 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayDecks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No pitch decks yet</p>
            <p className="text-sm text-gray-400 mt-1">
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
                transition={{ delay: index * 0.05 }}
                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 
                           hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                onClick={() => navigate(`/dashboard/pitch/${deck.id}`)}
              >
                {/* Thumbnail / Gradient preview */}
                <div className="h-28 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 
                                flex items-center justify-center relative">
                  <Presentation className="w-10 h-10 text-gray-300 group-hover:text-blue-400 transition-colors" />
                  {/* Context menu button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextDeckId(contextDeckId === deck.id ? null : deck.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-md bg-white/80 
                               opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {/* Context menu */}
                  {contextDeckId === deck.id && (
                    <div
                      className="absolute top-10 right-2 bg-white border border-gray-200 
                                 rounded-lg shadow-lg z-10 py-1 min-w-[140px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-full px-3 py-2 text-left text-sm text-red-600 
                                   hover:bg-red-50 flex items-center gap-2"
                        onClick={() => handleDeleteDeck(deck.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm truncate">
                    {deck.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
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
    </div>
  );
}
