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
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Presentation,
    Save,
    Download,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Edit,
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
import { useIdeaStore } from '@/store';

export default function PitchDeck() {
    const STORAGE_KEY = 'pitchrr_pitch_deck';

    // Current slide index
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    // Slides data
    const [slides, setSlides] = useState([
        {
            type: 'Problem',
            title: 'The Problem',
            content: 'Describe the problem your startup solves...',
        },
        {
            type: 'Solution',
            title: 'Our Solution',
            content: 'Explain how your product solves this problem...',
        },
        {
            type: 'Market',
            title: 'Market Opportunity',
            content: 'Describe the size and potential of your target market...',
        },
        {
            type: 'Product',
            title: 'Our Product',
            content: 'Show what you\'ve built and how it works...',
        },
        {
            type: 'Traction',
            title: 'Traction & Milestones',
            content: 'Share your progress, users, revenue, or key metrics...',
        },
        {
            type: 'Team',
            title: 'The Team',
            content: 'Introduce your founding team and their expertise...',
        },
        {
            type: 'Ask',
            title: 'The Ask',
            content: 'What are you raising? How will you use the funds?',
        },
    ]);

    /**
     * Load saved data from localStorage
     */
    const { currentIdea } = useIdeaStore();

    /**
     * Load saved data from localStorage OR autofill from store
     */
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.slides) {
                    setSlides(data.slides);
                    setHasGenerated(true);
                } else if (currentIdea) {
                    // Saved state exists but no slides yet? Try to hydrate from current idea
                    hydrateSlidesFromIdea();
                }
            } catch (e) {
                console.error('Failed to load saved data:', e);
            }
        } else if (currentIdea) {
            hydrateSlidesFromIdea();
        }
    }, [currentIdea]);

    const hydrateSlidesFromIdea = () => {
        if (!currentIdea) return;

        const newSlides = [...slides];
        // Problem
        if (currentIdea.problem) newSlides[0].content = currentIdea.problem;
        // Solution
        if (currentIdea.solution) newSlides[1].content = currentIdea.solution;
        // Market
        if (currentIdea.targetMarket) newSlides[2].content = `Target Market: ${currentIdea.targetMarket}`;

        setSlides(newSlides);
    };

    /**
     * Save to localStorage
     */
    const saveToLocalStorage = () => {
        const data = {
            slides,
            lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        toast.success('Saved!', { duration: 1500 });
    };

    /**
     * Update slide content
     */
    const updateSlideContent = (content: string) => {
        const newSlides = [...slides];
        newSlides[currentSlide] = { ...newSlides[currentSlide], content };
        setSlides(newSlides);
    };

    /**
     * Generate slides with AI (mock)
     */
    const generateWithAI = async () => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const generatedSlides = [
            {
                type: 'Problem',
                title: 'The Problem',
                content: 'First-time founders spend months figuring out if their idea is viable, often wasting time and resources on ideas that won\'t work.',
            },
            {
                type: 'Solution',
                title: 'Our Solution',
                content: 'Pitchrr is an AI-powered platform that validates startup ideas and creates investor-ready materials in days, not months.',
            },
            {
                type: 'Market',
                title: 'Market Size',
                content: 'TAM: $50B global startup ecosystem\nSAM: $5B early-stage founder tools\nSOM: $500M initial target market',
            },
            {
                type: 'Product',
                title: 'Product Overview',
                content: '7 AI-powered modules: Idea Validation, Marketing Strategy, Branding, Pitch Deck, GTM Strategy, Competitor Analysis, AI Mentor',
            },
            {
                type: 'Traction',
                title: 'Early Traction',
                content: '• 1,000+ founders signed up\n• 500+ pitch decks created\n• 85% idea validation accuracy\n• 4.8/5 user satisfaction',
            },
            {
                type: 'Team',
                title: 'Our Team',
                content: 'Ex-YC founders, former Google engineers, and startup advisors with 50+ years combined experience.',
            },
            {
                type: 'Ask',
                title: 'The Ask',
                content: 'Raising $2M Seed\n\n50% - Product Development\n30% - Marketing & Growth\n20% - Team Expansion',
            },
        ];

        setSlides(generatedSlides);
        setHasGenerated(true);
        setIsGenerating(false);
        saveToLocalStorage();
        toast.success('Pitch deck generated!');
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
                        onClick={saveToLocalStorage}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
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
                    onClick={generateWithAI}
                    isLoading={isGenerating}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    className="mt-4"
                >
                    {hasGenerated ? 'Regenerate with AI' : 'Generate Pitch Deck'}
                </Button>
            </Card>

            {/* Slide Preview & Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Slide Thumbnails */}
                <div className="lg:col-span-1 space-y-2">
                    <h3 className="font-medium text-gray-900)] mb-3">Slides</h3>
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
                                    <span className="text-sm font-medium text-gray-900">
                                        {slide.type}
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
        </div>
    );
}
