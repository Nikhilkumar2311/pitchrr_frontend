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
import { useIdeaStore } from '@/store';

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
    const { activeIdeaId: storedActiveIdeaId, _hasHydrated } = useIdeaStore();

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || (_hasHydrated ? storedActiveIdeaId : null) || ideas?.[0]?.id;

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
            setEditedSlides(deckData.slides);
            setLastDataTimestamp(currentDataKey);
            setCurrentSlide(0); // Reset to first slide on new data
        }
    }, [deckData, lastDataTimestamp]);

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

    const handleSave = () => {
        toast.success('Pitch deck saved!');
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
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={handleSave}
                    >
                        Save
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
                    {/* Slide Thumbnails */}
                    <div className="lg:col-span-1 space-y-2">
                        <h3 className="font-medium text-gray-900 mb-3">Slides</h3>
                        <div className="space-y-2 max-h-125 overflow-y-auto pr-2">
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

                        {/* Generate One Pager Button */}
                        <div className="mt-4 pt-4 border-t">
                            <Button
                                onClick={() => setShowOnePager(true)}
                                className="w-full"
                                variant="secondary"
                                size="sm"
                                leftIcon={<FileText className="w-4 h-4" />}
                            >
                                Generate One Pager
                            </Button>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                Investor summary
                            </p>
                        </div>

                        {/* One Pager Modal */}
                        {showOnePager && (
                            <OnePager
                                slides={slides}
                                companyName={ideaData?.title || 'My Startup'}
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
                                    <span style={{ color: customTheme.accentColor }} className="text-xs">● Accent</span>
                                </div>
                            </Card>
                        )}

                        <Card className="min-h-100 relative">
                            {/* Slide Content */}
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="h-full"
                            >
                                <div
                                    className="h-full p-8 rounded-lg"
                                    style={{
                                        background: selectedTheme.bgColor,
                                        border: `1px solid ${selectedTheme.borderColor}`,
                                    }}
                                >
                                    <h2
                                        className="text-2xl font-bold mb-6"
                                        style={{ color: selectedTheme.headingColor }}
                                    >
                                        {slides[currentSlide]?.title}
                                    </h2>
                                    <div
                                        className="whitespace-pre-line"
                                        style={{ color: selectedTheme.textColor }}
                                    >
                                        {slides[currentSlide]?.content}
                                    </div>
                                    {slides[currentSlide]?.bullet_points && (
                                        <ul className="mt-4 space-y-2">
                                            {slides[currentSlide].bullet_points?.map((point, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2"
                                                    style={{ color: selectedTheme.textColor }}
                                                >
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full mt-2"
                                                        style={{ backgroundColor: selectedTheme.accentColor }}
                                                    />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Uploaded Image */}
                                    {slides[currentSlide]?.image && (
                                        <div className="mt-4">
                                            <img
                                                src={slides[currentSlide].image}
                                                alt="Slide image"
                                                className="w-full max-h-48 object-contain rounded-lg"
                                            />
                                        </div>
                                    )}
                                    {/* Chart Visualization */}
                                    {(() => {
                                        const chart = slides[currentSlide]?.chart;
                                        if (chart && chart.type && chart.type !== 'none' && chart.data && chart.data.length > 0) {
                                            return (
                                                <div id={`slide-chart-${currentSlide}`} className="mt-6 p-4 rounded-lg relative" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={() => {
                                                            setEditingChartSlide(currentSlide);
                                                            // Deep copy the chart data for local editing
                                                            setEditingChartData(chart.data.map(d => ({ ...d })));
                                                        }}
                                                        className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-md shadow-sm transition-all"
                                                        title="Edit Chart Data"
                                                    >
                                                        <Edit className="w-4 h-4 text-gray-600" />
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
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {isPieChart && (
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            💡 Tip: Manually adjust values to keep total at 100%
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
                                                                // Save changes to slides
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
                                    rows={4}
                                    placeholder="Enter slide content..."
                                />

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
