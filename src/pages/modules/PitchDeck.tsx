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

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Presentation,
    Download,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Edit,
    Loader2,
    FileText,
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
import { CreditCost, SEO } from '@/components/common';
import {
    useIdea,
    useIdeas,
    useModuleData,
    useGenerateModule,
    useExportModule,
    useExportStatus,
} from '@/hooks';
import { downloadFile } from '@/utils';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';

interface Slide {
    title: string;
    content: string;
    type?: string;
    bullet_points?: string[];
    headline?: string;
    image?: string; // Base64 image data
    chart?: {
        type: 'pie' | 'bar' | 'line' | 'radar' | 'none';
        title?: string;
        data: Array<{ name: string; value: number }>;
    };
}

import { SlideChart } from '@/components/pitch-deck/SlideChart';
import { SlideDecorations } from '@/components/pitch-deck/SlideDecorations';
import { ImageUploader } from '@/components/pitch-deck/ImageUploader';
import { OnePager } from '@/components/pitch-deck/OnePager';

// Pitch Deck Theme Definitions
interface Theme {
    name: string;
    bgColor: string;
    textColor: string;
    headingColor: string;
    accentColor: string;
    borderColor: string;
    tooltipBg?: string;
    tooltipText?: string;
}

const themes: Theme[] = [
    {
        name: 'Dark',
        bgColor: '#1F2937',
        textColor: '#D1D5DB',
        headingColor: '#FFFFFF',
        accentColor: '#F59E0B',
        borderColor: '#374151',
        tooltipBg: '#111827',
        tooltipText: '#F9FAFB',
    },
    {
        name: 'Light',
        bgColor: '#FFFFFF',
        textColor: '#4B5563',
        headingColor: '#111827',
        accentColor: '#3B82F6',
        borderColor: '#E5E7EB',
        tooltipBg: '#FFFFFF',
        tooltipText: '#111827',
    },
    {
        name: 'Gradient Blue',
        bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#E0E7FF',
        headingColor: '#FFFFFF',
        accentColor: '#FCD34D',
        borderColor: '#818CF8',
        tooltipBg: '#4C1D95',
        tooltipText: '#EDE9FE',
    },
    {
        name: 'Corporate Green',
        bgColor: '#064E3B',
        textColor: '#A7F3D0',
        headingColor: '#ECFDF5',
        accentColor: '#34D399',
        borderColor: '#047857',
        tooltipBg: '#022C22',
        tooltipText: '#D1FAE5',
    },
    {
        name: 'Startup Orange',
        bgColor: '#7C2D12',
        textColor: '#FED7AA',
        headingColor: '#FFF7ED',
        accentColor: '#FB923C',
        borderColor: '#9A3412',
        tooltipBg: '#431407',
        tooltipText: '#FFEDD5',
    },
    {
        name: 'Warm Sunset',
        bgColor: 'linear-gradient(135deg, #F97316 0%, #EC4899 100%)',
        textColor: '#FFF1F2',
        headingColor: '#FFFFFF',
        accentColor: '#FEF08A',
        borderColor: '#FB7185',
        tooltipBg: '#881337',
        tooltipText: '#FFE4E6',
    },
    {
        name: 'Ocean',
        bgColor: 'linear-gradient(135deg, #0EA5E9 0%, #2DD4BF 100%)',
        textColor: '#F0FDFA',
        headingColor: '#FFFFFF',
        accentColor: '#FCD34D',
        borderColor: '#22D3EE',
        tooltipBg: '#164E63',
        tooltipText: '#CFFAFE',
    },
    {
        name: 'Midnight',
        bgColor: '#0F172A',
        textColor: '#94A3B8',
        headingColor: '#F8FAFC',
        accentColor: '#38BDF8',
        borderColor: '#1E293B',
        tooltipBg: '#020617',
        tooltipText: '#E2E8F0',
    },
    {
        name: 'Rose',
        bgColor: '#831843',
        textColor: '#FECDD3',
        headingColor: '#FFF1F2',
        accentColor: '#FB7185',
        borderColor: '#9F1239',
        tooltipBg: '#500724',
        tooltipText: '#FFE4E6',
    },
    {
        name: 'Minimal',
        bgColor: '#FAFAFA',
        textColor: '#525252',
        headingColor: '#171717',
        accentColor: '#171717',
        borderColor: '#E5E5E5',
        tooltipBg: '#FFFFFF',
        tooltipText: '#171717',
    },
];

export default function PitchDeck() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // Current slide index and theme
    const [currentSlide, setCurrentSlide] = useState(0);
    const [editedSlides, setEditedSlides] = useState<Slide[]>([]);
    const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[1]); // Light theme as default

    // Custom theme state
    const [showCustomTheme, setShowCustomTheme] = useState(false);
    const [customTheme, setCustomTheme] = useState<Theme>({
        name: 'Custom',
        bgColor: '#1F2937',
        textColor: '#D1D5DB',
        headingColor: '#FFFFFF',
        accentColor: '#3B82F6',
        borderColor: '#374151',
        tooltipBg: '#FFFFFF', // White background - visible on all themes
        tooltipText: '#1F2937', // Dark text for contrast
    });

    // Chart editing state - store chart data locally during editing
    const [editingChartSlide, setEditingChartSlide] = useState<number | null>(null);
    const [editingChartData, setEditingChartData] = useState<Array<{ name: string; value: number }>>([]);

    // One Pager state
    const [showOnePager, setShowOnePager] = useState(false);

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    // Get active idea from store
    const { activeIdeaId: storedActiveIdeaId, setActiveIdeaId } = useIdeaStore();
    // Read from localStorage directly on initial render to avoid async hydration delay
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;

    const { data: ideaData, isLoading: isLoadingIdea } = useIdea(activeIdeaId);

    const {
        data: moduleData,
    } = useModuleData(activeIdeaId, 'pitch_deck');

    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasGenerated = moduleData?.exists && moduleData.data;
    const deckData = moduleData?.data || null;
    const slides: Slide[] = editedSlides.length > 0 ? editedSlides : (deckData?.slides || []);
    const isLoading = isLoadingIdeas || isLoadingIdea;
    // Use status from backend to detect pending state (survives page refresh)
    const isGenerating = isTriggering || moduleData?.status === 'IN_PROGRESS';

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    // Track the last known data to detect when NEW data arrives
    const [lastDataTimestamp, setLastDataTimestamp] = useState<string | null>(null);

    // Initialize edited slides when AI data arrives or changes
    useEffect(() => {
        // Use a simple hash of slide count + first slide title to detect changes
        const currentDataKey = deckData?.slides ?
            `${deckData.slides.length}-${deckData.slides[0]?.title}` : null;

        if (deckData?.slides && currentDataKey !== lastDataTimestamp) {
            // Normalize content: if content is an array, join to string paragraph
            const normalizedSlides = deckData.slides.map((s: any) => ({
                ...s,
                content: Array.isArray(s.content) ? s.content.join('. ') : (s.content || ''),
            }));
            setEditedSlides(normalizedSlides);
            setLastDataTimestamp(currentDataKey);
            setCurrentSlide(0); // Reset to first slide on new data
        }
    }, [deckData, lastDataTimestamp]);

    // Sync activeIdeaId in store when idea changes to keep persistence across modules
    useEffect(() => {
        if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setActiveIdeaId(activeIdeaId);
        }
    }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    const handleGenerate = () => {
        if (!activeIdeaId) {
            toast.error('Please create an idea first');
            return;
        }
        // Clear old slides when regenerating
        setEditedSlides([]);
        setLastDataTimestamp(null);
        generateModule('pitch_deck');
    };

    // Export hooks (ZIP for pitch deck)
    const { mutate: exportModule, isPending: isExporting } = useExportModule('pitch-deck', activeIdeaId);
    const [exportJobId, setExportJobId] = useState<string | null>(null);
    const { data: exportStatus } = useExportStatus(exportJobId);

    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
            const filename = `${ideaData?.title || 'pitch'}_deck.pptx`.replace(/[^a-zA-Z0-9_.-]/g, '_');
            downloadFile(exportStatus.downloadUrl, filename)
                .then(() => toast.success('Pitch deck downloaded!'))
                .catch(() => toast.error('Download failed'));
            setExportJobId(null);
        } else if (exportStatus?.state === 'failed') {
            toast.error('Export failed: ' + (exportStatus.failedReason || 'Unknown error'));
            setExportJobId(null);
        }
    }, [exportStatus, ideaData?.title]);

    const exportToPPT = async () => {
        if (!hasGenerated) {
            toast.error('Please generate pitch deck first');
            return;
        }

        try {
            // Note: Chart images capture disabled due to html2canvas CSS compatibility issues
            // Charts will be rendered as formatted data tables in the PPTX

            // Pass theme and slides to the export
            exportModule({
                theme: selectedTheme,
                slides: slides,
            } as any, {
                onSuccess: (data) => setExportJobId(data.jobId),
            });
        } catch (err) {
            toast.error('Failed to prepare export');
            console.error('Export preparation failed:', err);
        }
    };

    /**
     * Update slide content
     */
    const updateSlideContent = (content: string) => {
        const baseSlides = editedSlides.length > 0 ? [...editedSlides] : slides.map(s => ({ ...s }));
        baseSlides[currentSlide] = { ...baseSlides[currentSlide], content };
        setEditedSlides(baseSlides);
    };

    /**
     * Update slide image
     */
    const updateSlideImage = (image: string | undefined) => {
        const baseSlides = editedSlides.length > 0 ? [...editedSlides] : slides.map(s => ({ ...s }));
        baseSlides[currentSlide] = { ...baseSlides[currentSlide], image };
        setEditedSlides(baseSlides);
    };

    /**
     * Update slide bullet points
     */
    const updateSlideBulletPoints = (bulletPoints: string[]) => {
        const baseSlides = editedSlides.length > 0 ? [...editedSlides] : slides.map(s => ({ ...s }));
        baseSlides[currentSlide] = { ...baseSlides[currentSlide], bullet_points: bulletPoints };
        setEditedSlides(baseSlides);
    };

    /**
     * Add a new bullet point
     */
    const addBulletPoint = () => {
        const currentBulletPoints = slides[currentSlide]?.bullet_points || [];
        updateSlideBulletPoints([...currentBulletPoints, '']);
    };

    /**
     * Update a specific bullet point
     */
    const updateBulletPoint = (index: number, value: string) => {
        const currentBulletPoints = [...(slides[currentSlide]?.bullet_points || [])];
        currentBulletPoints[index] = value;
        updateSlideBulletPoints(currentBulletPoints);
    };

    /**
     * Remove a bullet point
     */
    const removeBulletPoint = (index: number) => {
        const currentBulletPoints = [...(slides[currentSlide]?.bullet_points || [])];
        currentBulletPoints.splice(index, 1);
        updateSlideBulletPoints(currentBulletPoints);
    };

    /**
     * Update custom theme color
     */
    const updateCustomTheme = (key: keyof Theme, value: string) => {
        setCustomTheme(prev => ({ ...prev, [key]: value }));
    };

    /**
     * Apply custom theme
     */
    const applyCustomTheme = () => {
        setSelectedTheme(customTheme);
        setShowCustomTheme(false);
        toast.success('Custom theme applied!');
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
            <SEO
                title="Pitch Deck"
                description="Generate investor-ready pitch decks with AI. Create professional 12-slide presentations with customizable themes and export to PPT."
                canonical="/dashboard/pitch"
            />

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
                        leftIcon={<FileText className="w-4 h-4" />}
                        onClick={() => setShowOnePager(true)}
                        disabled={!hasGenerated}
                    >
                        Generate One Pager
                    </Button>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
                        disabled={!hasGenerated || isExporting || !!exportJobId}
                        isLoading={isExporting || !!exportJobId}
                        onClick={exportToPPT}
                    >
                        <span className="flex items-center gap-2">
                            {exportJobId ? 'Exporting...' : 'Export PPT'}
                            {!exportJobId && <CreditCost cost={5} />}
                        </span>
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
                                Creating 12 investor-ready slides. This usually takes 30-60 seconds.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Slide Preview & Editor */}
            {slides.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Slide Thumbnails â€” mini themed previews */}
                    <div className="lg:col-span-1 space-y-2 lg:sticky lg:top-4 lg:self-start">
                        <h3 className="font-medium text-gray-900 mb-3 text-[14px]">Slides</h3>
                        <div className="space-y-2 lg:max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
                            {slides.map((slide, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className="w-full rounded-lg text-left transition-all overflow-hidden"
                                    style={{
                                        border: currentSlide === index
                                            ? '2px solid #3B82F6'
                                            : '1px solid #E5E7EB',
                                        boxShadow: currentSlide === index
                                            ? '0 0 0 2px rgba(59, 130, 246, 0.2)'
                                            : 'none',
                                    }}
                                >
                                    {/* Mini slide preview */}
                                    <div
                                        className="relative w-full px-3 py-2.5"
                                        style={{
                                            background: selectedTheme.bgColor,
                                            aspectRatio: '16 / 9',
                                        }}
                                    >
                                        {/* Decorative corner accent */}
                                        <div
                                            className="absolute top-0 right-0 w-6 h-6 rounded-bl-full opacity-20"
                                            style={{ background: selectedTheme.accentColor }}
                                        />
                                        {/* Mini slide number */}
                                        <span
                                            className="absolute bottom-1 right-1.5 text-[8px] font-bold opacity-40"
                                            style={{ color: selectedTheme.textColor }}
                                        >
                                            {index + 1}
                                        </span>
                                        {/* Mini title */}
                                        <div
                                            className="text-[10px] font-bold leading-tight truncate"
                                            style={{ color: selectedTheme.headingColor }}
                                        >
                                            {slide.title || slide.type || `Slide ${index + 1}`}
                                        </div>
                                        {/* Mini content preview */}
                                        <div
                                            className="text-[8px] leading-tight mt-0.5 line-clamp-3 opacity-60"
                                            style={{ color: selectedTheme.textColor }}
                                        >
                                            {slide.content?.substring(0, 120)}
                                        </div>
                                        {/* Mini bullet previews */}
                                        {slide.bullet_points && slide.bullet_points.length > 0 && (
                                            <div className="mt-1 space-y-0.5">
                                                {slide.bullet_points.slice(0, 3).map((point, bi) => (
                                                    <div key={bi} className="flex items-start gap-1">
                                                        <div
                                                            className="w-[3px] h-[3px] rounded-full mt-[3px] shrink-0"
                                                            style={{ background: selectedTheme.accentColor }}
                                                        />
                                                        <span
                                                            className="text-[6px] leading-tight truncate"
                                                            style={{ color: selectedTheme.textColor, opacity: 0.55 }}
                                                        >
                                                            {point.substring(0, 50)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* One Pager Modal */}
                        {showOnePager && activeIdeaId && (
                            <OnePager
                                slides={slides}
                                companyName={ideaData?.title || 'My Startup'}
                                ideaId={activeIdeaId}
                                onClose={() => setShowOnePager(false)}
                            />
                        )}
                    </div>

                    {/* Slide Preview */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Theme Selector */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">Theme:</span>
                            <div className="flex flex-wrap gap-2">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.name}
                                        onClick={() => setSelectedTheme(theme)}
                                        className={`
                                            w-8 h-8 rounded-full border-2 transition-all
                                            ${selectedTheme.name === theme.name
                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}
                                        style={{
                                            background: theme.bgColor.includes('gradient')
                                                ? theme.bgColor
                                                : theme.bgColor
                                        }}
                                        title={theme.name}
                                    />
                                ))}
                                {/* Custom Theme Button */}
                                <button
                                    onClick={() => setShowCustomTheme(!showCustomTheme)}
                                    className={`
                                        w-8 h-8 rounded-full border-2 border-dashed transition-all flex items-center justify-center
                                        ${showCustomTheme ? 'border-blue-500 bg-blue-50' : 'border-gray-400 hover:border-blue-400 hover:bg-gray-50'}
                                    `}
                                    title="Create Custom Theme"
                                >
                                    <span className="text-gray-500 text-lg leading-none">+</span>
                                </button>
                            </div>
                            <span className="text-xs text-gray-500 ml-2">{selectedTheme.name}</span>
                        </div>

                        {/* Custom Theme Panel */}
                        {showCustomTheme && (
                            <Card className="p-4 bg-gray-50 border-blue-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-gray-800">Create Custom Theme</h4>
                                    <Button size="sm" onClick={applyCustomTheme}>Apply Theme</Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { key: 'bgColor', label: 'Background' },
                                        { key: 'textColor', label: 'Text' },
                                        { key: 'headingColor', label: 'Heading' },
                                        { key: 'accentColor', label: 'Accent' },
                                    ].map(({ key, label }) => (
                                        <div key={key} className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-600">{label}</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={customTheme[key as keyof Theme] as string}
                                                    onChange={(e) => updateCustomTheme(key as keyof Theme, e.target.value)}
                                                    className="w-8 h-8 rounded cursor-pointer border"
                                                />
                                                <input
                                                    type="text"
                                                    value={customTheme[key as keyof Theme] as string}
                                                    onChange={(e) => updateCustomTheme(key as keyof Theme, e.target.value)}
                                                    className="flex-1 px-2 py-1 text-xs font-mono border rounded w-20"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Live Preview */}
                                <div
                                    className="mt-3 p-3 rounded-lg text-center"
                                    style={{ background: customTheme.bgColor, border: `1px solid ${customTheme.borderColor}` }}
                                >
                                    <span style={{ color: customTheme.headingColor }} className="font-bold text-sm">Preview Heading</span>
                                    <p style={{ color: customTheme.textColor }} className="text-xs mt-1">Sample text content</p>
                                    <span style={{ color: customTheme.accentColor }} className="text-xs">â— Accent</span>
                                </div>
                            </Card>
                        )}

                        {/* â”€â”€ 16:9 Slide Preview â”€â”€ */}
                        <div className="relative rounded-xl overflow-hidden shadow-lg" style={{ aspectRatio: '16 / 9' }}>
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <div
                                    className="absolute inset-0 p-8 flex flex-col overflow-hidden"
                                    style={{
                                        background: selectedTheme.bgColor,
                                        border: `1px solid ${selectedTheme.borderColor}`,
                                    }}
                                >
                                    {/* Theme-Specific Decorative Elements */}
                                    <SlideDecorations
                                        themeName={selectedTheme.name}
                                        accentColor={selectedTheme.accentColor}
                                        isTitleSlide={currentSlide === 0 || slides[currentSlide]?.type?.toLowerCase() === 'title'}
                                    />


                                    {/* â”€â”€â”€ Slide-Type-Specific Layouts â”€â”€â”€ */}
                                    {(() => {
                                        const slide = slides[currentSlide];
                                        if (!slide) return null;
                                        const slideType = slide.type?.toLowerCase() || '';

                                        // === TITLE SLIDE ===
                                        if (slideType === 'title' || currentSlide === 0) {
                                            return (
                                                <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
                                                    <div className="absolute w-48 h-48 rounded-full opacity-[0.06]" style={{ background: selectedTheme.accentColor }} />
                                                    <h2 className="text-3xl font-extrabold mb-3 relative z-10" style={{ color: selectedTheme.headingColor }}>
                                                        {slide.title}
                                                    </h2>
                                                    <div className="w-16 h-1 rounded-full mb-4" style={{ background: selectedTheme.accentColor }} />
                                                    <p className="text-base max-w-md leading-relaxed" style={{ color: selectedTheme.textColor, opacity: 0.85 }}>
                                                        {slide.content}
                                                    </p>
                                                    {slide.headline && (
                                                        <p className="text-sm mt-3 font-medium italic" style={{ color: selectedTheme.accentColor }}>
                                                            {slide.headline}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        }

                                        // === TRACTION SLIDE ===
                                        if (slideType === 'traction') {
                                            return (
                                                <div className="flex flex-col relative z-10 overflow-hidden">
                                                    <h2 className="text-xl font-bold mb-3" style={{ color: selectedTheme.headingColor }}>{slide.title}</h2>
                                                    <div className="w-10 h-0.5 rounded-full mb-3" style={{ background: selectedTheme.accentColor }} />
                                                    {slide.content && <p className="text-xs mb-3 line-clamp-2" style={{ color: selectedTheme.textColor, opacity: 0.7 }}>{slide.content}</p>}
                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 content-start">
                                                        {slide.bullet_points?.slice(0, 6).map((point, i) => (
                                                            <div key={i} className="rounded-lg p-2 text-center" style={{ background: `${selectedTheme.accentColor}15`, border: `1px solid ${selectedTheme.accentColor}25` }}>
                                                                <div className="text-sm font-bold" style={{ color: selectedTheme.accentColor }}>
                                                                    {point.match(/[\d₹$%,]+[\w]*/) ? point.match(/[\d₹$%,]+[\w]*/)?.[0] : `#${i + 1}`}
                                                                </div>
                                                                <div className="text-[10px] mt-0.5 leading-tight line-clamp-2" style={{ color: selectedTheme.textColor, opacity: 0.8 }}>
                                                                    {point.replace(/[\d₹$%,]+[\w]*\s*[-–:]?\s*/, '') || point}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // === TEAM SLIDE ===
                                        if (slideType === 'team') {
                                            return (
                                                <div className="flex flex-col relative z-10 overflow-hidden">
                                                    <h2 className="text-xl font-bold mb-3" style={{ color: selectedTheme.headingColor }}>{slide.title}</h2>
                                                    <div className="w-10 h-0.5 rounded-full mb-3" style={{ background: selectedTheme.accentColor }} />
                                                    {slide.content && <p className="text-xs mb-3 line-clamp-2" style={{ color: selectedTheme.textColor, opacity: 0.7 }}>{slide.content}</p>}
                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 content-start">
                                                        {slide.bullet_points?.map((member, i) => {
                                                            const parts = member.split(/[-–:]/);
                                                            const name = parts[0]?.trim() || member;
                                                            const role = parts.slice(1).join('-').trim() || '';
                                                            return (
                                                                <div key={i} className="flex items-center gap-2 rounded-lg p-2" style={{ background: `${selectedTheme.accentColor}10`, border: `1px solid ${selectedTheme.accentColor}18` }}>
                                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: selectedTheme.accentColor }}>
                                                                        {name.charAt(0)}
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="text-xs font-semibold truncate" style={{ color: selectedTheme.headingColor }}>{name}</div>
                                                                        {role && <div className="text-[10px] truncate" style={{ color: selectedTheme.textColor, opacity: 0.7 }}>{role}</div>}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // === ASK / FINANCIALS SLIDE ===
                                        if (slideType === 'ask' || slideType === 'financials') {
                                            return (
                                                <div className="flex flex-col relative z-10 overflow-hidden">
                                                    <h2 className="text-lg font-bold mb-1" style={{ color: selectedTheme.headingColor }}>{slide.title}</h2>
                                                    <div className="w-10 h-0.5 rounded-full mb-2" style={{ background: selectedTheme.accentColor }} />
                                                    {slide.headline && (
                                                        <div className="text-center mb-2">
                                                            <div className="text-2xl font-extrabold" style={{ color: selectedTheme.accentColor }}>{slide.headline}</div>
                                                        </div>
                                                    )}
                                                    {slide.content && <p className="text-xs text-center mb-2 line-clamp-2" style={{ color: selectedTheme.textColor, opacity: 0.8 }}>{slide.content}</p>}
                                                    {slide.bullet_points && slide.bullet_points.length > 0 && (
                                                        <div className="grid grid-cols-2 gap-1.5 content-start">
                                                            {slide.bullet_points.slice(0, 6).map((point, i) => (
                                                                <div key={i} className="flex items-start gap-1.5 text-xs p-1.5 rounded-lg" style={{ background: `${selectedTheme.accentColor}0A` }}>
                                                                    <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: selectedTheme.accentColor }} />
                                                                    <span className="line-clamp-2" style={{ color: selectedTheme.textColor }}>{point}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        // === DEFAULT LAYOUT ===
                                        return (
                                            <div className="flex flex-col relative z-10">
                                                <h2 className="text-xl font-bold mb-1" style={{ color: selectedTheme.headingColor }}>{slide.title}</h2>
                                                <div className="w-10 h-0.5 rounded-full mb-4" style={{ background: selectedTheme.accentColor }} />
                                                {slide.bullet_points && slide.bullet_points.length > 0 ? (
                                                    <div className="flex gap-6">
                                                        {slide.content && (
                                                            <div className="flex-1">
                                                                <p className="text-sm leading-relaxed" style={{ color: selectedTheme.textColor, opacity: 0.85 }}>{slide.content}</p>
                                                            </div>
                                                        )}
                                                        <div className={`${slide.content ? 'flex-1' : 'w-full'}`}>
                                                            <ul className="space-y-2">
                                                                {slide.bullet_points.map((point, i) => (
                                                                    <li key={i} className="flex items-start gap-2.5 text-sm">
                                                                        <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: selectedTheme.accentColor }} />
                                                                        <span style={{ color: selectedTheme.textColor }}>{point}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm whitespace-pre-line leading-relaxed" style={{ color: selectedTheme.textColor }}>{slide.content}</div>
                                                )}
                                                {slide.image && (
                                                    <div className="mt-3">
                                                        <img src={slide.image} alt="Slide image" className="w-full max-h-32 object-contain rounded-lg" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    {/* Chart Visualization */}
                                    {(() => {
                                        const chart = slides[currentSlide]?.chart;
                                        if (chart && chart.type && chart.type !== 'none' && chart.data && chart.data.length > 0) {
                                            return (
                                                <div id={`slide-chart-${currentSlide}`} className="mt-3 rounded-lg relative overflow-hidden" style={{ zIndex: 10, maxHeight: '50%' }}>
                                                    <button
                                                        onClick={() => {
                                                            setEditingChartSlide(currentSlide);
                                                            setEditingChartData(chart.data.map(d => ({ ...d })));
                                                        }}
                                                        className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white rounded-md shadow-sm transition-all z-20"
                                                        title="Edit Chart Data"
                                                    >
                                                        <Edit className="w-3.5 h-3.5 text-gray-600" />
                                                    </button>
                                                    <SlideChart
                                                        type={chart.type}
                                                        title={chart.title}
                                                        data={chart.data}
                                                        theme={{
                                                            textColor: selectedTheme.textColor,
                                                            accentColor: selectedTheme.accentColor,
                                                            tooltipBg: selectedTheme.tooltipBg,
                                                            tooltipText: selectedTheme.tooltipText,
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {/* Chart Editor Modal */}
                                    {editingChartSlide !== null && slides[editingChartSlide]?.chart && editingChartData.length > 0 && (() => {
                                        const chart = slides[editingChartSlide].chart!;
                                        const isPieChart = chart.type === 'pie';
                                        const total = editingChartData.reduce((sum, item) => sum + item.value, 0);

                                        return (
                                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                                <Card className="w-full max-w-md p-6 bg-white m-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-lg font-bold">Edit Chart Data</h3>
                                                        {isPieChart && (
                                                            <span className={`text-sm px-2 py-1 rounded ${Math.abs(total - 100) < 0.1 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                                Total: {total.toFixed(1)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3 max-h-75 overflow-y-auto">
                                                        {editingChartData.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={item.name}
                                                                    onChange={(e) => {
                                                                        const newData = [...editingChartData];
                                                                        newData[idx] = { ...newData[idx], name: e.target.value };
                                                                        setEditingChartData(newData);
                                                                    }}
                                                                    className="flex-1 px-2 py-1 border rounded text-sm"
                                                                    placeholder="Label"
                                                                />
                                                                <div className="flex items-center gap-1">
                                                                    <input
                                                                        type="number"
                                                                        value={item.value}
                                                                        onChange={(e) => {
                                                                            const newValue = parseFloat(e.target.value) || 0;
                                                                            const newData = [...editingChartData];
                                                                            newData[idx] = { ...newData[idx], value: newValue };
                                                                            setEditingChartData(newData);
                                                                        }}
                                                                        className="w-20 px-2 py-1 border rounded text-sm"
                                                                        placeholder="Value"
                                                                    />
                                                                    {isPieChart && <span className="text-xs text-gray-500">%</span>}
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        const newData = editingChartData.filter((_, i) => i !== idx);
                                                                        setEditingChartData(newData);
                                                                    }}
                                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                                    title="Remove"
                                                                >
                                                                    âœ•
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {isPieChart && (
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            ðŸ’¡ Tip: Manually adjust values to keep total at 100%
                                                        </p>
                                                    )}
                                                    <div className="flex justify-between mt-4">
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingChartData([...editingChartData, { name: 'New', value: isPieChart ? 10 : 100 }]);
                                                            }}
                                                        >
                                                            + Add Item
                                                        </Button>
                                                        <div className="flex gap-2">
                                                            <Button variant="secondary" size="sm" onClick={() => {
                                                                setEditingChartSlide(null);
                                                                setEditingChartData([]);
                                                            }}>
                                                                Cancel
                                                            </Button>
                                                            <Button size="sm" onClick={() => {
                                                                const baseSlides = editedSlides.length > 0 ? [...editedSlides] : slides.map(s => ({ ...s }));
                                                                baseSlides[editingChartSlide] = {
                                                                    ...baseSlides[editingChartSlide],
                                                                    chart: { ...chart, data: editingChartData }
                                                                };
                                                                setEditedSlides(baseSlides);
                                                                setEditingChartSlide(null);
                                                                setEditingChartData([]);
                                                                toast.success('Chart updated!');
                                                            }}>
                                                                Done
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </motion.div>

                            {/* Navigation overlay */}
                            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.15))' }}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => goToSlide('prev')}
                                    disabled={currentSlide === 0}
                                    leftIcon={<ChevronLeft className="w-4 h-4" />}
                                    className="text-white/80 hover:text-white"
                                >
                                    Prev
                                </Button>
                                <span className="text-xs text-white/60 font-medium">
                                    {currentSlide + 1} / {slides.length}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => goToSlide('next')}
                                    disabled={currentSlide === slides.length - 1}
                                    rightIcon={<ChevronRight className="w-4 h-4" />}
                                    className="text-white/80 hover:text-white"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>

                        {/* Editor */}
                        <Card className="mt-4 p-4">
                            <CardHeader className="p-0 pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Edit className="w-5 h-5" />
                                    Edit Slide Content
                                </CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <Textarea
                                    value={slides[currentSlide]?.content || ''}
                                    onChange={(e) => updateSlideContent(e.target.value)}
                                    rows={3}
                                    placeholder="Enter slide headline/content..."
                                />

                                {/* Bullet Points Editor */}
                                {slides[currentSlide]?.bullet_points && slides[currentSlide].bullet_points.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Bullet Points
                                        </label>
                                        <div className="space-y-2">
                                            {slides[currentSlide].bullet_points.map((point, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 shrink-0"></span>
                                                    <input
                                                        type="text"
                                                        value={point}
                                                        onChange={(e) => updateBulletPoint(idx, e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Enter bullet point..."
                                                    />
                                                    <button
                                                        onClick={() => removeBulletPoint(idx)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Remove bullet point"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={addBulletPoint}
                                            className="mt-2"
                                        >
                                            + Add Bullet Point
                                        </Button>
                                    </div>
                                )}

                                {/* Show "Add Bullet Points" button if none exist */}
                                {(!slides[currentSlide]?.bullet_points || slides[currentSlide].bullet_points.length === 0) && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={addBulletPoint}
                                    >
                                        + Add Bullet Points
                                    </Button>
                                )}

                                {/* Image Upload Section */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Slide Image
                                    </label>
                                    <ImageUploader
                                        image={slides[currentSlide]?.image}
                                        onImageChange={updateSlideImage}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )
            }

            {/* Placeholder when no slides */}
            {
                !hasGenerated && !isGenerating && slides.length === 0 && (
                    <Card className="flex flex-col items-center justify-center py-12 text-center">
                        <Presentation className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">
                            No slides yet
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs">
                            Click "Generate Pitch Deck" to create your investor-ready presentation
                        </p>
                    </Card>
                )
            }
        </div>
    );
}
