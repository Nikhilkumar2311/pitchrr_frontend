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
    Download,
    Sparkles,
    Type,
    Paintbrush,

    Layers,
    Edit3,
    LayoutGrid,
} from 'lucide-react';
import {
    Button,
    Input,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { BrandingSkeleton } from '@/components/skeletons/BrandingSkeleton';
import { AIGeneratingSkeleton } from '@/components/skeletons/AIGeneratingSkeleton';
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
import { CanvasLogoEditor } from '@/components/branding/CanvasLogoEditor';
import { LogoPresets } from '@/components/branding/LogoPresets';
import { StartupCard } from '@/components/branding/StartupCard';

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
    const [editorMode, setEditorMode] = useState<'presets' | 'advanced'>('presets');
    const [initialCanvasLogo, setInitialCanvasLogo] = useState<string | null>(null);

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

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <BrandingSkeleton />;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <SEO
                title="Branding"
                description="Create your brand identity with AI. Generate logos, taglines, color palettes, typography, and brand voice guidelines."
                canonical="/dashboard/branding"
            />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
            >
                {/* ═══════════════════════════════════════════════
                    PAGE HEADER
                 ═══════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1
                            className="text-2xl font-bold flex items-center gap-2.5"
                            style={{
                                color: 'var(--dash-text)',
                                fontFamily: 'var(--dash-font-heading)',
                            }}
                        >
                            <div
                                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                                style={{ background: 'rgba(139,92,246,0.08)' }}
                            >
                                <Palette className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                            </div>
                            Branding
                        </h1>
                        <p
                            className="mt-1 text-[14px]"
                            style={{ color: 'var(--dash-text-muted)' }}
                        >
                            Give your startup an identity
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
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

                {/* ═══════════════════════════════════════════════
                    INPUT SECTION (soft panel)
                 ═══════════════════════════════════════════════ */}
                <div
                    className="rounded-[14px] p-5 sm:p-6"
                    style={{
                        background: 'rgba(0,0,0,0.012)',
                        border: '1px solid var(--dash-border-solid, #E8ECF4)',
                    }}
                >
                    {/* Startup Name */}
                    <div className="mb-5">
                        <h2
                            className="text-[15px] font-semibold"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            Startup Name
                        </h2>
                        <p className="text-[13px] mt-0.5 mb-3" style={{ color: 'var(--dash-text-muted)' }}>
                            Enter your startup name to generate branding
                        </p>
                        <Input
                            placeholder="e.g., Pitchrr"
                            value={startupName}
                            onChange={(e) => setStartupName(e.target.value)}
                        />
                    </div>

                    {/* Brand Tone */}
                    <div className="mb-5">
                        <h2
                            className="text-[15px] font-semibold"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            Brand Tone
                        </h2>
                        <p className="text-[13px] mt-0.5 mb-3" style={{ color: 'var(--dash-text-muted)' }}>
                            How should your brand feel?
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {brandTones.map((tone) => (
                                <button
                                    key={tone}
                                    onClick={() => setSelectedTone(tone)}
                                    className="px-4 py-2 rounded-[8px] text-[13px] font-medium transition-all cursor-pointer"
                                    style={{
                                        background: selectedTone === tone
                                            ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                                            : 'rgba(0,0,0,0.02)',
                                        color: selectedTone === tone ? '#fff' : 'var(--dash-text-secondary)',
                                        border: selectedTone === tone
                                            ? '1px solid transparent'
                                            : '1px solid var(--dash-border-solid, #E8ECF4)',
                                    }}
                                >
                                    {tone}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        isLoading={isGenerating}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                        disabled={!activeIdeaId}
                        style={{
                            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                        }}
                    >
                        <span className="flex items-center gap-2">
                            Generate Brand Identity
                            <CreditCost cost={10} />
                        </span>
                    </Button>
                    {!activeIdeaId && (
                        <p className="text-[12px] mt-2" style={{ color: 'var(--dash-text-muted)' }}>
                            Please create an idea in Idea Validation first
                        </p>
                    )}
                </div>

                {/* ═══════════════════════════════════════════════
                    GENERATING STATE (content-aware skeleton)
                 ═══════════════════════════════════════════════ */}
                {isGenerating && (
                    <AIGeneratingSkeleton
                        moduleType="branding"
                        moduleName="Brand Identity"
                    />
                )}

                {/* ═══════════════════════════════════════════════
                    RESULTS
                 ═══════════════════════════════════════════════ */}

                {/* Logo Editor — only shown after branding is generated */}
                {hasGenerated && !isGenerating && (
                    <div>
                        {/* Section divider label */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                            <span
                                className="text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
                            >
                                AI Branding
                            </span>
                            <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <h2
                                className="text-[18px] font-bold flex items-center gap-2"
                                style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                            >
                                <Edit3 className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                                Logo Editor
                            </h2>
                            <div
                                className="flex gap-1 p-1 rounded-[8px]"
                                style={{ background: 'rgba(0,0,0,0.03)' }}
                            >

                                <button
                                    onClick={() => setEditorMode('advanced')}
                                    className="px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1.5"
                                    style={{
                                        background: editorMode === 'advanced' ? 'white' : 'transparent',
                                        color: editorMode === 'advanced' ? 'var(--dash-text)' : 'var(--dash-text-muted)',
                                        boxShadow: editorMode === 'advanced' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    }}
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    Advanced
                                </button>
                                <button
                                    onClick={() => setEditorMode('presets')}
                                    className="px-3 py-1.5 rounded-[6px] text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1.5"
                                    style={{
                                        background: editorMode === 'presets' ? 'white' : 'transparent',
                                        color: editorMode === 'presets' ? 'var(--dash-text)' : 'var(--dash-text-muted)',
                                        boxShadow: editorMode === 'presets' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    }}
                                >
                                    <LayoutGrid className="w-3.5 h-3.5" />
                                    Presets
                                </button>
                            </div>
                        </div>

                        <div>
                            {editorMode === 'presets' ? (
                                <LogoPresets
                                    startupName={startupName}
                                    primaryColor={branding?.color_palette?.primary || selectedColorPreset.primary}
                                    secondaryColor={branding?.color_palette?.secondary || selectedColorPreset.secondary}
                                    headingFont={branding?.typography?.heading_font || 'Inter'}
                                    aiLogos={branding?.ai_logos || []}
                                    onEditInCanvas={(logoUrl) => {
                                        setInitialCanvasLogo(logoUrl);
                                        setEditorMode('advanced');
                                    }}
                                />
                            ) : (
                                <CanvasLogoEditor
                                    startupName={startupName}
                                    primaryColor={branding?.color_palette?.primary || selectedColorPreset.primary}
                                    secondaryColor={branding?.color_palette?.secondary || selectedColorPreset.secondary}
                                    aiLogos={branding?.ai_logos || []}
                                    initialLogoUrl={initialCanvasLogo}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Brand Name Display */}
                <div
                    className="text-center py-6 rounded-[12px]"
                    style={{ background: 'rgba(0,0,0,0.015)' }}
                >
                    <h2
                        className="text-3xl font-bold"
                        style={{ color: branding?.color_palette?.primary || selectedColorPreset.primary }}
                    >
                        {startupName || 'Your Startup'}
                    </h2>
                    {hasGenerated && !isGenerating && branding?.taglines?.[0] && (
                        <p
                            className="mt-2 italic text-[14px]"
                            style={{ color: 'var(--dash-text-muted)' }}
                        >
                            "{branding.taglines[0]}"
                        </p>
                    )}
                </div>

                {/* Taglines */}
                {hasGenerated && !isGenerating && branding?.taglines && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2
                            className="text-[18px] font-bold flex items-center gap-2 mb-4"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            <Type className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                            Tagline Suggestions
                        </h2>
                        <div className="space-y-2">
                            {branding.taglines.map((tagline: string, i: number) => (
                                <div
                                    key={i}
                                    className="p-3.5 rounded-[10px] text-[13px] italic"
                                    style={{
                                        background: 'rgba(0,0,0,0.015)',
                                        color: 'var(--dash-text-secondary)',
                                    }}
                                >
                                    "{tagline}"
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Brand Voice */}
                <div>
                    <h2
                        className="text-[18px] font-bold flex items-center gap-2 mb-4"
                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                    >
                        <Sparkles className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                        Brand Voice
                    </h2>
                    {hasGenerated && !isGenerating && branding?.brand_voice ? (
                        <div>
                            <div
                                className="text-[13px] mb-3"
                                style={{ color: 'var(--dash-text-secondary)' }}
                            >
                                Tone: <span className="font-semibold" style={{ color: 'var(--dash-text)' }}>
                                    {branding.brand_voice.tone}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {branding.brand_voice.keywords?.map((keyword: string, i: number) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: '#8B5CF6',
                                            background: 'rgba(139,92,246,0.06)',
                                            borderRadius: 6,
                                            padding: '4px 10px',
                                            border: '1px solid rgba(139,92,246,0.1)',
                                        }}
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                            {branding.brand_voice.description && (
                                <p
                                    className="mt-3 text-[13px] leading-relaxed"
                                    style={{ color: 'var(--dash-text-secondary)' }}
                                >
                                    {branding.brand_voice.description}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div
                            className="text-center py-8 rounded-[10px]"
                            style={{ background: 'rgba(0,0,0,0.015)' }}
                        >
                            <p className="text-[13px]" style={{ color: 'var(--dash-text-muted)' }}>
                                Generate branding to see voice recommendations
                            </p>
                        </div>
                    )}
                </div>

                {/* Font Recommendations */}
                {hasGenerated && !isGenerating && branding?.typography && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2
                            className="text-[18px] font-bold flex items-center gap-2 mb-4"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            <Type className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                            Font Recommendations
                        </h2>
                        <div className="space-y-2">
                            <div
                                className="flex items-center justify-between p-3.5 rounded-[10px]"
                                style={{ background: 'rgba(0,0,0,0.015)' }}
                            >
                                <span className="text-[13px]" style={{ color: 'var(--dash-text-secondary)' }}>
                                    Heading Font
                                </span>
                                <span
                                    className="font-semibold text-[14px]"
                                    style={{ fontFamily: branding.typography.heading_font, color: 'var(--dash-text)' }}
                                >
                                    {branding.typography.heading_font}
                                </span>
                            </div>
                            <div
                                className="flex items-center justify-between p-3.5 rounded-[10px]"
                                style={{ background: 'rgba(0,0,0,0.015)' }}
                            >
                                <span className="text-[13px]" style={{ color: 'var(--dash-text-secondary)' }}>
                                    Body Font
                                </span>
                                <span
                                    className="font-semibold text-[14px]"
                                    style={{ fontFamily: branding.typography.body_font, color: 'var(--dash-text)' }}
                                >
                                    {branding.typography.body_font}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* AI-Generated Color Palette */}
                {hasGenerated && !isGenerating && branding?.color_palette && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h2
                            className="text-[18px] font-bold flex items-center gap-2 mb-1"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            <Paintbrush className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                            AI-Generated Color Palette
                        </h2>
                        <p className="text-[13px] mb-4" style={{ color: 'var(--dash-text-muted)' }}>
                            Click any color to copy its hex code
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(branding.color_palette).map(([name, color]) => (
                                <div
                                    key={name}
                                    className="flex flex-col items-center gap-2 p-3 rounded-[10px] cursor-pointer transition-all"
                                    style={{ background: 'rgba(0,0,0,0.015)' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(color as string);
                                        toast.success(`Copied ${color}`);
                                    }}
                                >
                                    <div
                                        className="w-14 h-14 rounded-[8px]"
                                        style={{
                                            backgroundColor: color as string,
                                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                                        }}
                                    />
                                    <span
                                        className="text-[12px] font-medium capitalize"
                                        style={{ color: 'var(--dash-text-secondary)' }}
                                    >
                                        {name}
                                    </span>
                                    <span
                                        className="text-[11px] font-mono px-2 py-0.5 rounded-[4px]"
                                        style={{
                                            background: 'rgba(0,0,0,0.03)',
                                            color: 'var(--dash-text-muted)',
                                        }}
                                    >
                                        {(color as string).toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Startup Card Generator */}
                {hasGenerated && !isGenerating && branding && (
                    <StartupCard
                        startupName={startupName}
                        primaryColor={branding?.color_palette?.primary || selectedColorPreset.primary}
                        secondaryColor={branding?.color_palette?.secondary || selectedColorPreset.secondary}
                        accentColor={branding?.color_palette?.accent}
                        headingFont={branding?.typography?.heading_font || 'Inter'}
                        bodyFont={branding?.typography?.body_font || 'Inter'}
                        tagline={branding?.taglines?.[0] || ''}
                        logoUrl={branding?.ai_logos?.[0]?.url}
                        brandValues={branding?.brand_voice?.keywords || []}
                        positioning={branding?.brand_voice?.description || ''}
                    />
                )}
            </motion.div>
        </div>
    );
}
