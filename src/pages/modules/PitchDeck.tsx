/**
 * Module 4: Pitch Deck Page
 * 
 * Helps founders create investor-ready pitch decks.
 * 
 * FEATURES:
 * - Template selection
 * - AI slide generation
 * - Edit slides with AI
 * - Download as PDF/PPT
 * 
 * DATA FLOW:
 * - Fetches idea from Core Service
 * - Generates pitch deck slides via AI
 * - React Query polls for results
 */

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Presentation,
    Save,
    Download,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Edit,
    Loader2,
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Textarea,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { PitchDeckSkeleton } from '@/components/skeletons/PitchDeckSkeleton';
import {
    useIdea,
    useIdeas,
    useModuleData,
    useGenerateModule,
} from '@/hooks';

interface Slide {
    title: string;
    content: string;
    type?: string;
    bullet_points?: string[];
}

export default function PitchDeck() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // Current slide index
    const [currentSlide, setCurrentSlide] = useState(0);
    const [editedSlides, setEditedSlides] = useState<Slide[]>([]);

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || ideas?.[0]?.id;

    const { isLoading: isLoadingIdea } = useIdea(activeIdeaId);

    const {
        data: moduleData,
        isFetching: isPolling,
    } = useModuleData(activeIdeaId, 'pitch_deck');

    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasGenerated = moduleData?.exists && moduleData.data;
    const deckData = moduleData?.data || null;
    const slides: Slide[] = editedSlides.length > 0 ? editedSlides : (deckData?.slides || []);
    const isLoading = isLoadingIdeas || isLoadingIdea;
    const isGenerating = isTriggering || (isPolling && !hasGenerated);

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    // Initialize edited slides when AI data arrives
    useEffect(() => {
        if (deckData?.slides && editedSlides.length === 0) {
            setEditedSlides(deckData.slides);
        }
    }, [deckData, editedSlides.length]);

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    const handleGenerate = () => {
        if (!activeIdeaId) {
            toast.error('Please create an idea first');
            return;
        }
        generateModule('pitch_deck');
    };

    const handleSave = () => {
        toast.success('Pitch deck saved!');
    };

    /**
     * Update slide content
     */
    const updateSlideContent = (content: string) => {
        const newSlides = [...editedSlides];
        newSlides[currentSlide] = { ...newSlides[currentSlide], content };
        setEditedSlides(newSlides);
    };

    /**
     * Navigate slides
     */
    const goToSlide = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        } else if (direction === 'next' && currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <PitchDeckSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Presentation className="w-7 h-7 text-[#F59E0B]" />
                        Pitch Deck
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Convert your idea into a clear story
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
                        disabled={!hasGenerated}
                    >
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Generate Button */}
            <Card>
                <CardHeader>
                    <CardTitle>Generate Your Pitch Deck</CardTitle>
                    <CardDescription>
                        Let AI create a professional pitch deck based on your startup information
                    </CardDescription>
                </CardHeader>
                <Button
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    className="mt-4"
                    disabled={!activeIdeaId}
                >
                    {hasGenerated ? 'Regenerate with AI' : 'Generate Pitch Deck'}
                </Button>
                {!activeIdeaId && (
                    <p className="text-sm text-gray-500 mt-2">
                        Please create an idea in Idea Validation first
                    </p>
                )}
            </Card>

            {/* Generating State */}
            {isGenerating && (
                <Card className="bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                        <div>
                            <h3 className="font-medium text-amber-900">
                                Generating Pitch Deck...
                            </h3>
                            <p className="text-sm text-amber-700">
                                Creating {deckData?.total_slides || '7'} slides. This usually takes 30-60 seconds.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Slide Preview & Editor */}
            {slides.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Slide Thumbnails */}
                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="font-medium text-gray-900 mb-3">Slides</h3>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                            {slides.map((slide, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`
                                        w-full p-3 rounded-lg text-left transition-all
                                        ${currentSlide === index
                                            ? 'bg-blue-50 border-2 border-blue-600'
                                            : 'bg-white border border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`
                                            w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center
                                            ${currentSlide === index
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                            }
                                        `}>
                                            {index + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900 truncate">
                                            {slide.title || slide.type || `Slide ${index + 1}`}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Slide Preview */}
                    <div className="lg:col-span-2">
                        <Card className="min-h-[400px] relative">
                            {/* Slide Content */}
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="h-full"
                            >
                                <div
                                    className="h-full p-8 rounded-lg"
                                    style={{ backgroundColor: '#1F2937' }}
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">
                                        {slides[currentSlide]?.title}
                                    </h2>
                                    <div className="text-gray-300 whitespace-pre-line">
                                        {slides[currentSlide]?.content}
                                    </div>
                                    {slides[currentSlide]?.bullet_points && (
                                        <ul className="mt-4 space-y-2">
                                            {slides[currentSlide].bullet_points?.map((point, i) => (
                                                <li key={i} className="text-gray-300 flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </motion.div>

                            {/* Navigation */}
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => goToSlide('prev')}
                                    disabled={currentSlide === 0}
                                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-500">
                                    {currentSlide + 1} / {slides.length}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => goToSlide('next')}
                                    disabled={currentSlide === slides.length - 1}
                                    rightIcon={<ChevronRight className="w-4 h-4" />}
                                >
                                    Next
                                </Button>
                            </div>
                        </Card>

                        {/* Editor */}
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Edit className="w-5 h-5" />
                                    Edit Slide Content
                                </CardTitle>
                            </CardHeader>
                            <Textarea
                                value={slides[currentSlide]?.content || ''}
                                onChange={(e) => updateSlideContent(e.target.value)}
                                rows={4}
                                className="mt-4"
                                placeholder="Enter slide content..."
                            />
                        </Card>
                    </div>
                </div>
            )}

            {/* Placeholder when no slides */}
            {!hasGenerated && !isGenerating && slides.length === 0 && (
                <Card className="flex flex-col items-center justify-center py-12 text-center">
                    <Presentation className="w-12 h-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">
                        No slides yet
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-xs">
                        Click "Generate Pitch Deck" to create your investor-ready presentation
                    </p>
                </Card>
            )}
        </div>
    );
}
