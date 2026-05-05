/**
 * Module 1: Idea Validation Page
 * 
 * This module helps founders validate their startup idea.
 * 
 * FEATURES:
 * - Idea summary input
 * - AI-generated viability score (0-100)
 * - Risk heat map (market, execution, competition, tech)
 * - SWOT analysis (Strengths & Weaknesses only for Phase 1)
 * - Market demand snapshot
 * 
 * DATA FLOW:
 * - User enters idea → saved to Core Service
 * - User triggers AI analysis → Core queues job → AI generates
 * - React Query polls for results → displays when ready
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Lightbulb,
    Download,
    Sparkles,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Minus,
    Shield,
    Compass,
    BarChart3,
} from 'lucide-react';
import {
    Button,
    Input,
    Textarea,
    Select,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { IdeaValidationSkeleton } from '@/components/skeletons/IdeaValidationSkeleton';
import { AIGeneratingSkeleton } from '@/components/skeletons/AIGeneratingSkeleton';
import { CreditCost, SEO } from '@/components/common';
import {
    useIdea,
    useIdeas,
    useCreateIdea,
    useUpdateIdea,
    useModuleData,
    useGenerateModule,
    useExportModule,
    useExportStatus,
} from '@/hooks';
import { downloadFile } from '@/utils';
import api from '@/services/api';

/**
 * Risk level type
 */
type RiskLevel = 'low' | 'medium' | 'high';

/**
 * Get badge variant for risk level
 */
// const getRiskBadge = (level: RiskLevel) => {
//     switch (level) {
//         case 'low': return 'success' as const;
//         case 'medium': return 'warning' as const;
//         case 'high': return 'danger' as const;
//     }
// };

/** Animation variants */
const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

export default function IdeaValidation() {
    const navigate = useNavigate();

    // Get ideaId from URL if present (e.g., /dashboard/idea/:ideaId)
    // If no ideaId, we'll use the first idea from the list or create a new one
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // Startup stage options (from grantsData.ts startup_stage values)
    const STARTUP_STAGES = [
        'Idea',
        'Pre-Seed',
        'Proof of Concept',
        'Prototype',
        'Seed',
        'Early Stage',
        'Growth',
        'Scale-up',
        'Established',
    ];

    // Form state
    const [ideaSummary, setIdeaSummary] = useState('');
    const [ideaTitle, setIdeaTitle] = useState('');
    const [industry, setIndustry] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [startupStage, setStartupStage] = useState('');
    const [amount, setAmount] = useState('');

    // Get global idea from store (for backward compatibility with Generate Idea flow)
    const { currentIdea, setIdea, updateIdea: updateStoreIdea, activeIdeaId: storedActiveIdeaId } = useIdeaStore();
    // Read from localStorage directly on initial render to avoid async hydration delay
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    // Fetch all ideas to get the current one if no URL param
    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();

    // Determine which idea to use: URL param > zustand store > localStorage sync read > first idea
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;

    // Fetch the active idea
    const { data: idea, isLoading: isLoadingIdea } = useIdea(activeIdeaId);

    // Create new idea
    const { mutate: createIdea } = useCreateIdea();

    // Update existing idea
    const { mutate: updateIdea } = useUpdateIdea(activeIdeaId || '');

    // Fetch module data (with automatic polling while generating)
    const {
        data: moduleData,
    } = useModuleData(activeIdeaId, 'idea_validation');

    // Generate module (trigger AI analysis)
    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasAnalysis = moduleData?.exists && moduleData.data;
    const analysis = moduleData?.data || null;
    const isLoading = isLoadingIdeas || isLoadingIdea;
    // Use status from backend to detect pending state (survives page refresh)
    const isAnalyzing = isTriggering || moduleData?.status === 'IN_PROGRESS';

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    // Track the last known idea data to detect when NEW data arrives
    const [lastIdeaKey, setLastIdeaKey] = useState<string | null>(null);

    // Populate form when idea is loaded from API (only when idea data actually changes)
    useEffect(() => {
        // Create a unique key from the idea data
        const currentIdeaKey = idea ? `${idea.id}-${idea.title}-${idea.description}` : null;

        // Only update form if this is a NEW idea or the idea data actually changed
        if (idea && currentIdeaKey !== lastIdeaKey) {
            setIdeaTitle(idea.title);
            setIdeaSummary(idea.description);
            setIndustry(idea.industry || '');
            setTargetAudience(idea.targetAudience || '');
            setStartupStage(idea.startupStage || '');
            setAmount(idea.amount || '');
            setLastIdeaKey(currentIdeaKey);
            // Also update the store for cross-module compatibility
            setIdea({
                id: idea.id,
                title: idea.title,
                description: idea.description,
                problem: idea.problemSolved || undefined,
                targetMarket: idea.targetAudience || undefined,
                industry: idea.industry || undefined,
                startupStage: idea.startupStage || undefined,
                amount: idea.amount || undefined,
            });
        }
    }, [idea, lastIdeaKey, setIdea]);

    // Populate from store if no idea in DB (new user flow) - only once
    useEffect(() => {
        if (!idea && currentIdea && !lastIdeaKey) {
            setIdeaTitle(currentIdea.title || '');
            setIdeaSummary(currentIdea.description || '');
            setIndustry(currentIdea.industry || '');
            setTargetAudience(currentIdea.targetMarket || '');
            setStartupStage(currentIdea.startupStage || '');
            setAmount(currentIdea.amount || '');
            setLastIdeaKey('store-initialized');
        }
    }, [idea, currentIdea, lastIdeaKey]);

    // ==========================================================================
    // DEBOUNCED AUTO-SAVE
    // ==========================================================================

    const formInitializedRef = useRef(false);
    const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Mark form as initialized after first load from API/store
    useEffect(() => {
        if (lastIdeaKey && !formInitializedRef.current) {
            // Delay slightly to skip the initial field-set from API
            const t = setTimeout(() => { formInitializedRef.current = true; }, 500);
            return () => clearTimeout(t);
        }
    }, [lastIdeaKey]);

    // Auto-save on field changes (debounced 1.5s) — silent, no toast
    useEffect(() => {
        if (!formInitializedRef.current || !activeIdeaId) return;
        if (!ideaSummary.trim()) return; // Don't save empty

        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

        autoSaveTimerRef.current = setTimeout(async () => {
            try {
                await api.put(`/ideas/${activeIdeaId}`, {
                    title: ideaTitle || 'Untitled Idea',
                    description: ideaSummary,
                    industry: industry || undefined,
                    targetAudience: targetAudience || undefined,
                    startupStage: startupStage || undefined,
                    amount: amount || undefined,
                });

                // Also update store for cross-module compatibility
                updateStoreIdea({
                    title: ideaTitle || 'Untitled Idea',
                    description: ideaSummary,
                    industry: industry || undefined,
                    targetMarket: targetAudience || undefined,
                    startupStage: startupStage || undefined,
                    amount: amount || undefined,
                });
            } catch (e) {
                // Silent fail — don't bother user with save errors during typing
                console.error('Auto-save failed:', e);
            }
        }, 1500);

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        };
    }, [ideaTitle, ideaSummary, industry, targetAudience, startupStage, amount]);

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    /**
     * Trigger AI analysis
     */
    const handleAnalyze = async () => {
        if (!ideaSummary.trim()) {
            toast.error('Please describe your idea first');
            return;
        }
        if (!startupStage) {
            toast.error('Please select a startup stage');
            return;
        }

        // Cancel any pending auto-save
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

        // If no idea exists yet, create one first and then trigger generation
        if (!activeIdeaId) {
            createIdea({
                title: ideaTitle || 'Untitled Idea',
                description: ideaSummary,
                industry: industry || undefined,
                targetAudience: targetAudience || undefined,
                startupStage: startupStage || undefined,
                amount: amount || undefined,
            }, {
                onSuccess: async (newIdea) => {
                    navigate(`/dashboard/idea/${newIdea.id}`, { replace: true });
                    try {
                        toast.success('Idea saved! Starting AI analysis...');
                        await api.post(`/ideas/${newIdea.id}/modules/idea_validation/generate`);
                    } catch (err: any) {
                        if (err?.response?.status === 402) {
                            toast.error('Insufficient credits. Please add more credits to continue.');
                        } else {
                            toast.error('Failed to start generation');
                        }
                    }
                }
            });
            return;
        }

        // Always save all current fields before generating
        updateIdea({
            title: ideaTitle || 'Untitled Idea',
            description: ideaSummary,
            industry: industry || undefined,
            targetAudience: targetAudience || undefined,
            startupStage: startupStage || undefined,
            amount: amount || undefined,
        }, {
            onSuccess: () => {
                generateModule('idea_validation');
            }
        });
    };

    /**
     * Export to PDF
     */
    const { mutate: exportModule, isPending: isExporting } = useExportModule('idea-validation', activeIdeaId);
    const [exportJobId, setExportJobId] = useState<string | null>(null);

    const { data: exportStatus } = useExportStatus(exportJobId);

    // Handle export completion
    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
            // Use downloadFile utility for proper cross-origin download
            const filename = `${idea?.title || 'idea'}_validation.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
            downloadFile(exportStatus.downloadUrl, filename)
                .then(() => toast.success('PDF downloaded!'))
                .catch(() => toast.error('Download failed'));
            setExportJobId(null);
        } else if (exportStatus?.state === 'failed') {
            toast.error('Export failed: ' + (exportStatus.failedReason || 'Unknown error'));
            setExportJobId(null);
        }
    }, [exportStatus, idea?.title]);

    const exportToPDF = () => {
        if (!hasAnalysis) {
            toast.error('Please generate analysis first');
            return;
        }
        exportModule({}, {
            onSuccess: (data) => {
                setExportJobId(data.jobId);
            },
        });
    };

    // Score helpers
    const getScoreColor = (score: number) =>
        score >= 70 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
    const getScoreLabel = (score: number) =>
        score >= 70 ? 'Strong Potential' : score >= 50 ? 'Promising' : 'Needs Work';

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <IdeaValidationSkeleton />;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <SEO
                title="Idea Validation"
                description="Validate your startup idea with AI-powered analysis. Get viability scores, risk assessments, SWOT analysis, and market demand insights."
                canonical="/dashboard/idea"
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
                                style={{
                                    background: 'rgba(79,125,243,0.08)',
                                }}
                            >
                                <Lightbulb className="w-5 h-5" style={{ color: '#4F7DF3' }} />
                            </div>
                            Idea Validation
                        </h1>
                        <p
                            className="mt-1 text-[14px]"
                            style={{ color: 'var(--dash-text-muted)' }}
                        >
                            Answer one question: "Is this idea worth pursuing?"
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={exportToPDF}
                        disabled={!hasAnalysis || isExporting || !!exportJobId}
                        isLoading={isExporting || !!exportJobId}
                    >
                        <span className="flex items-center gap-2">
                            {exportJobId ? 'Exporting...' : 'Export PDF'}
                            {!exportJobId && <CreditCost cost={2} />}
                        </span>
                    </Button>
                </div>

                {/* ═══════════════════════════════════════════════
                    SECTION 1 — IDEA INPUT (soft panel)
                 ═══════════════════════════════════════════════ */}
                <div
                    className="rounded-[14px] p-5 sm:p-6"
                    style={{
                        background: 'rgba(0,0,0,0.012)',
                        border: '1px solid var(--dash-border-solid, #E8ECF4)',
                    }}
                >
                    <h2
                        className="text-[15px] font-semibold"
                        style={{
                            color: 'var(--dash-text)',
                            fontFamily: 'var(--dash-font-heading)',
                        }}
                    >
                        Describe Your Idea
                    </h2>
                    <p className="text-[13px] mt-0.5 mb-5" style={{ color: 'var(--dash-text-muted)' }}>
                        Tell us about your startup idea. The more detail you provide, the better the analysis.
                    </p>

                    {/* Startup Name */}
                    <Input
                        placeholder="Startup Name"
                        value={ideaTitle}
                        onChange={(e) => setIdeaTitle(e.target.value)}
                    />

                    {/* Industry + Target Audience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <Input
                            placeholder="Industry (e.g. FinTech, HealthTech)"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                        />
                        <Input
                            placeholder="Target Audience (e.g. College students)"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                        />
                    </div>

                    {/* Stage + Funding */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <Select
                            value={startupStage}
                            onChange={(val) => setStartupStage(val)}
                            placeholder="Startup Stage *"
                            required
                            options={STARTUP_STAGES.map(stage => ({ value: stage, label: stage }))}
                        />
                        <Input
                            placeholder="Funding needed (optional, e.g. ₹10,00,000)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    {/* Idea Description */}
                    <Textarea
                        placeholder="What problem does this startup solve? Who is the target user? What makes it unique? Example: An AI-powered tool that helps first-time founders validate their startup ideas and create investor-ready pitch decks in days instead of months..."
                        rows={6}
                        value={ideaSummary}
                        onChange={(e) => setIdeaSummary(e.target.value)}
                        className="mt-3"
                    />

                    {/* Analyze Button */}
                    <div className="mt-5">
                        <Button
                            onClick={handleAnalyze}
                            isLoading={isAnalyzing}
                            leftIcon={<Sparkles className="w-4 h-4" />}
                            style={{
                                background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                            }}
                        >
                            <span className="flex items-center gap-2">
                                {hasAnalysis ? 'Re-Analyze' : 'Analyze Idea'}
                                <CreditCost cost={10} />
                            </span>
                        </Button>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════
                    GENERATING STATE (inline strip)
                 ═══════════════════════════════════════════════ */}
                {isAnalyzing && (
                    <AIGeneratingSkeleton
                        moduleType="idea_validation"
                        moduleName="Analysis"
                    />
                )}

                {/* ═══════════════════════════════════════════════
                    SECTION 2 — AI ANALYSIS RESULTS
                 ═══════════════════════════════════════════════ */}

                {/* Idea Score — open section */}
                {hasAnalysis && !isAnalyzing && (
                    <motion.div
                        {...fadeUp}
                        transition={{ delay: 0.05 }}
                    >
                        {/* Section divider label */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                            <span
                                className="text-[11px] font-bold uppercase tracking-widest"
                                style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
                            >
                                AI Analysis
                            </span>
                            <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                        </div>

                        <h2
                            className="text-[18px] font-bold flex items-center gap-2 mb-4"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            <Sparkles className="w-4 h-4" style={{ color: '#4F7DF3' }} />
                            Idea Score
                        </h2>

                        {/* Score + Label row */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-baseline gap-2">
                                <span
                                    className="text-[40px] font-bold leading-none"
                                    style={{
                                        color: getScoreColor(analysis.idea_score),
                                        fontFamily: 'var(--dash-font-heading)',
                                    }}
                                >
                                    {analysis.idea_score}
                                </span>
                                <span
                                    className="text-[14px] font-medium"
                                    style={{ color: 'var(--dash-text-muted)' }}
                                >
                                    / 100
                                </span>
                            </div>
                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: getScoreColor(analysis.idea_score),
                                    background: `${getScoreColor(analysis.idea_score)}10`,
                                    borderRadius: 8,
                                    padding: '5px 12px',
                                    border: `1px solid ${getScoreColor(analysis.idea_score)}20`,
                                }}
                            >
                                {getScoreLabel(analysis.idea_score)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)' }}>
                            <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${analysis.idea_score}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ background: `linear-gradient(90deg, ${getScoreColor(analysis.idea_score)}, ${getScoreColor(analysis.idea_score)}90)` }}
                            />
                        </div>

                        {/* Summary */}
                        {analysis.summary && (
                            <p
                                className="mt-3 text-[13px] leading-relaxed"
                                style={{ color: 'var(--dash-text-muted)' }}
                            >
                                {analysis.summary}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Risk Assessment — open section */}
                {hasAnalysis && !isAnalyzing && analysis.risk_heat_map && (
                    <motion.div
                        {...fadeUp}
                        transition={{ delay: 0.1 }}
                    >
                        <h2
                            className="text-[18px] font-bold flex items-center gap-2 mb-4"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            <Shield className="w-4 h-4" style={{ color: '#4F7DF3' }} />
                            Risk Assessment
                        </h2>

                        <div className="space-y-2">
                            {analysis.risk_heat_map.map((risk: { category: string; level: RiskLevel; description: string }) => {
                                const riskColors: Record<string, string> = {
                                    low: '#22C55E',
                                    medium: '#F59E0B',
                                    high: '#EF4444',
                                };
                                const col = riskColors[risk.level] || '#94A3B8';
                                return (
                                    <div
                                        key={risk.category}
                                        className="flex items-center justify-between p-3.5 rounded-[10px]"
                                        style={{ background: 'rgba(0,0,0,0.015)' }}
                                    >
                                        <span
                                            className="text-[13px] font-medium capitalize"
                                            style={{ color: 'var(--dash-text-secondary)' }}
                                        >
                                            {risk.category} Risk
                                        </span>
                                        <span
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: col,
                                                background: `${col}10`,
                                                borderRadius: 6,
                                                padding: '3px 10px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.03em',
                                            }}
                                        >
                                            {risk.level}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feasibility */}
                        <div
                            className="mt-3 p-3.5 rounded-[10px] flex items-center justify-between"
                            style={{
                                background: 'linear-gradient(135deg, rgba(79,125,243,0.03), rgba(122,92,255,0.03))',
                                border: '1px solid rgba(79,125,243,0.08)',
                            }}
                        >
                            <span
                                className="text-[13px] font-semibold"
                                style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                            >
                                Overall Feasibility
                            </span>
                            {(() => {
                                const feasColors: Record<string, string> = {
                                    low: '#EF4444',
                                    medium: '#F59E0B',
                                    high: '#22C55E',
                                };
                                const fc = feasColors[analysis.feasibility] || '#F59E0B';
                                return (
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: fc,
                                            background: `${fc}10`,
                                            borderRadius: 6,
                                            padding: '3px 10px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.03em',
                                        }}
                                    >
                                        {analysis.feasibility?.toUpperCase() || 'MEDIUM'}
                                    </span>
                                );
                            })()}
                        </div>
                    </motion.div>
                )}

                {/* SWOT Analysis — open section */}
                {hasAnalysis && !isAnalyzing && analysis.swot && (
                    <motion.div
                        {...fadeUp}
                        transition={{ delay: 0.15 }}
                    >
                        <h2
                            className="text-[18px] font-bold flex items-center gap-2 mb-1"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            <Compass className="w-4 h-4" style={{ color: '#4F7DF3' }} />
                            SWOT Analysis
                        </h2>
                        <p className="text-[13px] mb-4" style={{ color: 'var(--dash-text-muted)' }}>
                            Key strengths and weaknesses identified
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Strengths */}
                            <div
                                className="p-4 rounded-[12px]"
                                style={{
                                    background: 'rgba(34,197,94,0.03)',
                                    border: '1px solid rgba(34,197,94,0.1)',
                                }}
                            >
                                <h4
                                    className="font-semibold text-[13px] flex items-center gap-2 mb-3"
                                    style={{ color: '#16A34A' }}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Strengths
                                </h4>
                                <ul className="space-y-2">
                                    {analysis.swot.strengths?.map((item: string, i: number) => (
                                        <li key={i} className="text-[13px] flex items-start gap-2" style={{ color: 'var(--dash-text-secondary)' }}>
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#22C55E' }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Weaknesses */}
                            <div
                                className="p-4 rounded-[12px]"
                                style={{
                                    background: 'rgba(239,68,68,0.03)',
                                    border: '1px solid rgba(239,68,68,0.1)',
                                }}
                            >
                                <h4
                                    className="font-semibold text-[13px] flex items-center gap-2 mb-3"
                                    style={{ color: '#DC2626' }}
                                >
                                    <AlertTriangle className="w-4 h-4" />
                                    Weaknesses
                                </h4>
                                <ul className="space-y-2">
                                    {analysis.swot.weaknesses?.map((item: string, i: number) => (
                                        <li key={i} className="text-[13px] flex items-start gap-2" style={{ color: 'var(--dash-text-secondary)' }}>
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#EF4444' }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Market Demand Snapshot — open section */}
                {hasAnalysis && !isAnalyzing && analysis.market_demand_snapshot && (
                    <motion.div
                        {...fadeUp}
                        transition={{ delay: 0.2 }}
                    >
                        <h2
                            className="text-[18px] font-bold flex items-center gap-2 mb-1"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            <BarChart3 className="w-4 h-4" style={{ color: '#4F7DF3' }} />
                            Market Demand Snapshot
                        </h2>
                        <p className="text-[13px] mb-4" style={{ color: 'var(--dash-text-muted)' }}>
                            Current market demand and trend analysis
                        </p>
                        <div className="space-y-2">
                            {analysis.market_demand_snapshot.map((signal: { source: string; signal_type: string; interpretation: string; trend?: string }, i: number) => {
                                const interpretation = signal.interpretation?.toLowerCase() || '';
                                const isPositive = signal.trend === 'up' ||
                                    interpretation.includes('growing') ||
                                    interpretation.includes('high') ||
                                    interpretation.includes('strong') ||
                                    interpretation.includes('increasing');
                                const isNegative = signal.trend === 'down' ||
                                    interpretation.includes('declining') ||
                                    interpretation.includes('low') ||
                                    interpretation.includes('weak') ||
                                    interpretation.includes('decreasing') ||
                                    interpretation.includes('saturated');

                                return (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3.5 rounded-[10px]"
                                        style={{ background: 'rgba(0,0,0,0.015)' }}
                                    >
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: '#94A3B8' }}>
                                                {signal.source}
                                            </div>
                                            <div className="text-[13px] font-medium mt-0.5" style={{ color: 'var(--dash-text)' }}>
                                                {signal.signal_type}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isPositive ? (
                                                <TrendingUp className="w-4 h-4" style={{ color: '#22C55E' }} />
                                            ) : isNegative ? (
                                                <TrendingDown className="w-4 h-4" style={{ color: '#EF4444' }} />
                                            ) : (
                                                <Minus className="w-4 h-4" style={{ color: '#F59E0B' }} />
                                            )}
                                            <span
                                                className="text-[12px] font-medium"
                                                style={{
                                                    color: isPositive ? '#16A34A' : isNegative ? '#DC2626' : '#D97706'
                                                }}
                                            >
                                                {signal.interpretation}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════════════
                    SECTION 3 — RECOMMENDATIONS (open section)
                 ═══════════════════════════════════════════════ */}
                {hasAnalysis && !isAnalyzing && analysis.recommendations && (
                    <motion.div
                        {...fadeUp}
                        transition={{ delay: 0.25 }}
                    >
                        <h2
                            className="text-[18px] font-bold flex items-center gap-2 mb-1"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            <CheckCircle className="w-4 h-4" style={{ color: '#4F7DF3' }} />
                            Recommendations
                        </h2>
                        <p className="text-[13px] mb-4" style={{ color: 'var(--dash-text-muted)' }}>
                            Actionable next steps to strengthen your idea
                        </p>
                        <div className="space-y-2">
                            {analysis.recommendations.map((rec: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.06 }}
                                    className="flex items-start gap-3 p-3.5 rounded-[10px] transition-colors duration-200"
                                    style={{ background: 'rgba(0,0,0,0.015)' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(79,125,243,0.04)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(0,0,0,0.015)';
                                    }}
                                >
                                    <span
                                        className="shrink-0 w-6 h-6 rounded-[6px] flex items-center justify-center text-[11px] font-bold text-white"
                                        style={{
                                            background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--dash-text-secondary)' }}>
                                        {rec}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Empty state placeholder — open section */}
                {!hasAnalysis && !isAnalyzing && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div
                            className="w-14 h-14 rounded-[12px] flex items-center justify-center mb-4"
                            style={{ background: 'rgba(0,0,0,0.03)' }}
                        >
                            <Sparkles className="w-6 h-6" style={{ color: '#94A3B8' }} />
                        </div>
                        <h3
                            className="text-[15px] font-semibold"
                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                        >
                            Results will appear here
                        </h3>
                        <p className="text-[13px] mt-1 max-w-xs" style={{ color: 'var(--dash-text-muted)' }}>
                            Describe your idea and click "Analyze Idea" to get started
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
