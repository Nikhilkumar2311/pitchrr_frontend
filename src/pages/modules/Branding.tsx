/**
 * Module 3: Branding Page
 * 
 * Helps founders create a brand identity.
 * 
 * FEATURES:
 * - Logo creation/upload
 * - AI-generated taglines
 * - Font suggestions
 * - Brand tone selection
 * - Brand kit preview
 * 
 * DATA FLOW:
 * - Fetches idea from Core Service
 * - Generates branding via AI
 * - React Query polls for results
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Palette,
    Save,
    Download,
    Sparkles,
    Type,
    Paintbrush,
    Loader2,
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Input,
    Badge,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { BrandingSkeleton } from '@/components/skeletons/BrandingSkeleton';
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
import { LogoEditor } from '@/components/branding';
import { CanvasLogoEditor } from '@/components/branding/CanvasLogoEditor';
import { Layers, Edit3 } from 'lucide-react';

/**
 * Brand tone options
 */
const brandTones = ['Professional', 'Friendly', 'Bold', 'Minimalist', 'Playful'];

/**
 * Color preset options
 */
const colorPresets = [
    { name: 'Ocean', primary: '#376EF9', secondary: '#06B6D4', accent: '#10B981' },
    { name: 'Sunset', primary: '#F59E0B', secondary: '#EF4444', accent: '#EC4899' },
    { name: 'Forest', primary: '#10B981', secondary: '#059669', accent: '#14B8A6' },
    { name: 'Royal', primary: '#8B5CF6', secondary: '#6366F1', accent: '#A855F7' },
    { name: 'Monochrome', primary: '#1F2937', secondary: '#4B5563', accent: '#9CA3AF' },
];

export default function Branding() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // Form state
    const [startupName, setStartupName] = useState('');
    const [selectedTone, setSelectedTone] = useState('Professional');
    const [selectedColorPreset, setSelectedColorPreset] = useState(colorPresets[0]);
    const [editorMode, setEditorMode] = useState<'simple' | 'advanced'>('simple');

    // Get current idea from store for backward compatibility
    const { currentIdea, activeIdeaId: storedActiveIdeaId, setActiveIdeaId } = useIdeaStore();
    // Read from localStorage directly on initial render to avoid async hydration delay
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;

    const { data: idea, isLoading: isLoadingIdea } = useIdea(activeIdeaId);

    const {
        data: moduleData,
    } = useModuleData(activeIdeaId, 'branding');

    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasGenerated = moduleData?.exists && moduleData.data;
    const branding = moduleData?.data || null;
    const isLoading = isLoadingIdeas || isLoadingIdea;
    // Use status from backend to detect pending state (survives page refresh)
    const isGenerating = isTriggering || moduleData?.status === 'IN_PROGRESS';

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    // Track the last known idea data to detect when NEW data arrives
    const [lastIdeaKey, setLastIdeaKey] = useState<string | null>(null);

    // Populate startup name from idea (only when idea data actually changes)
    useEffect(() => {
        const currentIdeaKey = idea ? `${idea.id}-${idea.title}` : null;

        if (idea?.title && currentIdeaKey !== lastIdeaKey) {
            setStartupName(idea.title);
            setLastIdeaKey(currentIdeaKey);
        } else if (!idea && currentIdea?.title && !lastIdeaKey) {
            setStartupName(currentIdea.title);
            setLastIdeaKey('store-initialized');
        }
    }, [idea, currentIdea, lastIdeaKey]);

    // Sync activeIdeaId in store when idea changes to keep persistence across modules
    useEffect(() => {
        if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setActiveIdeaId(activeIdeaId);
        }
    }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

    // Update color from AI response
    useEffect(() => {
        if (branding?.color_palette?.primary) {
            // Try to find matching preset or use first one
            const matchingPreset = colorPresets.find(
                p => p.primary.toLowerCase() === branding.color_palette.primary.toLowerCase()
            );
            if (matchingPreset) {
                setSelectedColorPreset(matchingPreset);
            }
        }
    }, [branding]);

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    const handleGenerate = () => {
        if (!activeIdeaId) {
            toast.error('Please create an idea first');
            return;
        }
        if (!startupName.trim()) {
            toast.error('Please enter your startup name');
            return;
        }
        generateModule('branding');
    };

    // Export hooks (ZIP for brand kit)
    const { mutate: exportModule, isPending: isExporting } = useExportModule('branding', activeIdeaId);
    const [exportJobId, setExportJobId] = useState<string | null>(null);
    const { data: exportStatus } = useExportStatus(exportJobId);

    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
            const filename = `${idea?.title || 'brand'}_kit.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
            downloadFile(exportStatus.downloadUrl, filename)
                .then(() => toast.success('Brand kit downloaded!'))
                .catch(() => toast.error('Download failed'));
            setExportJobId(null);
        } else if (exportStatus?.state === 'failed') {
            toast.error('Export failed: ' + (exportStatus.failedReason || 'Unknown error'));
            setExportJobId(null);
        }
    }, [exportStatus, idea?.title]);

    const downloadBrandKit = () => {
        if (!hasGenerated) {
            toast.error('Please generate branding first');
            return;
        }
        exportModule({}, {
            onSuccess: (data) => setExportJobId(data.jobId),
        });
    };

    const handleSave = () => {
        toast.success('Branding saved!');
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <BrandingSkeleton />;
    }

    return (
        <div className="space-y-6">
            <SEO
                title="Branding"
                description="Create your brand identity with AI. Generate logos, taglines, color palettes, typography, and brand voice guidelines."
                canonical="/dashboard/branding"
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Palette className="w-7 h-7 text-[#8B5CF6]" />
                        Branding
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Give your startup an identity
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
                        onClick={downloadBrandKit}
                    >
                        <span className="flex items-center gap-2">
                            {exportJobId ? 'Exporting...' : 'Export PDF'}
                            {!exportJobId && <CreditCost cost={2} />}
                        </span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Input & Additional Info */}
                <div className="space-y-6">
                    {/* Startup Name */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Startup Name</CardTitle>
                            <CardDescription>
                                Enter your startup name to generate branding
                            </CardDescription>
                        </CardHeader>
                        <Input
                            placeholder="e.g., Pitchrr"
                            value={startupName}
                            onChange={(e) => setStartupName(e.target.value)}
                            className="mt-4"
                        />
                    </Card>

                    {/* Brand Tone */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Tone</CardTitle>
                            <CardDescription>
                                How should your brand feel?
                            </CardDescription>
                        </CardHeader>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {brandTones.map((tone) => (
                                <button
                                    key={tone}
                                    onClick={() => setSelectedTone(tone)}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm font-medium transition-all
                                        ${selectedTone === tone
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                                    `}
                                >
                                    {tone}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Color Palette */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Paintbrush className="w-5 h-5" />
                                Color Palette
                            </CardTitle>
                            <CardDescription>
                                Choose a color scheme for your brand
                            </CardDescription>
                        </CardHeader>
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {colorPresets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => setSelectedColorPreset(preset)}
                                    className={`
                                        p-3 rounded-lg border-2 transition-all
                                        ${selectedColorPreset.name === preset.name
                                            ? 'border-blue-600 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <div className="flex gap-1 mb-2">
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                                    </div>
                                    <div className="text-xs font-medium text-gray-700">
                                        {preset.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        isLoading={isGenerating}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                        className="w-full"
                        disabled={!activeIdeaId}
                    >
                        <span className="flex items-center gap-2">
                            Generate Brand Identity
                            <CreditCost cost={10} />
                        </span>
                    </Button>
                    {!activeIdeaId && (
                        <p className="text-sm text-gray-500 text-center">
                            Please create an idea in Idea Validation first
                        </p>
                    )}

                    {/* Brand Voice - Moved to left column */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Voice</CardTitle>
                        </CardHeader>
                        <div className="mt-4">
                            {hasGenerated && branding?.brand_voice ? (
                                <>
                                    <div className="text-sm text-gray-600 mb-2">
                                        Tone: <span className="font-medium">{branding.brand_voice.tone}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {branding.brand_voice.keywords?.map((keyword: string, i: number) => (
                                            <Badge key={i} variant="primary">{keyword}</Badge>
                                        ))}
                                    </div>
                                    {branding.brand_voice.description && (
                                        <p className="text-gray-600 mt-3 text-sm">{branding.brand_voice.description}</p>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-6 text-gray-400">
                                    <div className="text-sm">Tone:</div>
                                    <p className="text-xs mt-2">Generate branding to see voice recommendations</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Font Recommendations - Moved to left column */}
                    {hasGenerated && branding?.typography && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Font Recommendations</CardTitle>
                                </CardHeader>
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <span className="text-sm text-gray-600">Heading Font</span>
                                        <span className="font-semibold" style={{ fontFamily: branding.typography.heading_font }}>
                                            {branding.typography.heading_font}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <span className="text-sm text-gray-600">Body Font</span>
                                        <span className="font-semibold" style={{ fontFamily: branding.typography.body_font }}>
                                            {branding.typography.body_font}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Color Palette from AI */}
                    {hasGenerated && branding?.color_palette && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>AI-Generated Color Palette</CardTitle>
                                    <CardDescription>Click any color to copy its hex code</CardDescription>
                                </CardHeader>
                                <div className="mt-4 flex flex-wrap gap-4">
                                    {Object.entries(branding.color_palette).map(([name, color]) => (
                                        <div
                                            key={name}
                                            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                            onClick={() => {
                                                navigator.clipboard.writeText(color as string);
                                                toast.success(`Copied ${color}`);
                                            }}
                                        >
                                            <div
                                                className="w-16 h-16 rounded-lg shadow-md border-2 border-white"
                                                style={{ backgroundColor: color as string }}
                                            />
                                            <span className="text-sm font-medium text-gray-700 capitalize">{name}</span>
                                            <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded">
                                                {(color as string).toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Preview */}
                <div className="space-y-6">
                    {/* Generating State */}
                    {isGenerating && (
                        <Card className="bg-purple-50 border-purple-200">
                            <div className="flex items-center gap-4">
                                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                                <div>
                                    <h3 className="font-medium text-purple-900">
                                        Generating Brand Identity...
                                    </h3>
                                    <p className="text-sm text-purple-700">
                                        This usually takes 30-60 seconds
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Logo Editor Card */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Logo Editor</CardTitle>
                                    <CardDescription>
                                        Create your perfect logo
                                    </CardDescription>
                                </div>
                                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setEditorMode('simple')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${editorMode === 'simple'
                                            ? 'bg-white shadow text-gray-900'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Edit3 className="w-4 h-4 inline mr-1" />
                                        Simple
                                    </button>
                                    <button
                                        onClick={() => setEditorMode('advanced')}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${editorMode === 'advanced'
                                            ? 'bg-white shadow text-gray-900'
                                            : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        <Layers className="w-4 h-4 inline mr-1" />
                                        Advanced
                                    </button>
                                </div>
                            </div>
                        </CardHeader>
                        <div className="mt-4">
                            {editorMode === 'simple' ? (
                                <LogoEditor
                                    startupName={startupName}
                                    primaryColor={branding?.color_palette?.primary || selectedColorPreset.primary}
                                    secondaryColor={branding?.color_palette?.secondary || selectedColorPreset.secondary}
                                    onDownload={() => toast.success('Logo download started!')}
                                />
                            ) : (
                                <CanvasLogoEditor
                                    startupName={startupName}
                                    primaryColor={branding?.color_palette?.primary || selectedColorPreset.primary}
                                    secondaryColor={branding?.color_palette?.secondary || selectedColorPreset.secondary}
                                />
                            )}
                        </div>
                    </Card>

                    {/* Brand Name Display */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Name</CardTitle>
                        </CardHeader>
                        <div className="mt-4 text-center">
                            <h2
                                className="text-3xl font-bold"
                                style={{ color: branding?.color_palette?.primary || selectedColorPreset.primary }}
                            >
                                {startupName || 'Your Startup'}
                            </h2>
                            {hasGenerated && branding?.taglines?.[0] && (
                                <p className="text-gray-600 mt-2 italic">
                                    "{branding.taglines[0]}"
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Taglines */}
                    {hasGenerated && branding?.taglines && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Type className="w-5 h-5" />
                                        Tagline Suggestions
                                    </CardTitle>
                                </CardHeader>
                                <div className="mt-4 space-y-3">
                                    {branding.taglines.map((tagline: string, i: number) => (
                                        <div
                                            key={i}
                                            className="p-3 rounded-lg bg-gray-50 text-gray-700 italic"
                                        >
                                            "{tagline}"
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
