/**
 * Module 5: GTM (Go-To-Market) Strategy Page
 * 
 * Helps founders plan their market launch.
 * 
 * FEATURES:
 * - Target users/early adopters
 * - Pricing strategy
 * - Launch plan timeline
 * - Growth loops
 * - Key metrics (KPIs)
 * 
 * DATA FLOW:
 * - Fetches idea from Core Service
 * - Generates GTM strategy via AI
 * - React Query polls for results
 *
 * DESIGN:
 * - Result sections shown ONLY after generation (no pre-rendered empty boxes)
 * - NO outer panel borders on result sections — headings + content flow openly
 * - Soft coral/warm accent (#F97066) instead of harsh red
 * - Design tokens for all colors
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Rocket,
    Save,
    Download,
    Sparkles,
    Target,
    DollarSign,
    Calendar,
    TrendingUp,
    BarChart3,
    Loader2,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { GTMStrategySkeleton } from '@/components/skeletons/GTMStrategySkeleton';
import { CreditCost, SEO } from '@/components/common';
import {
    useIdea,
    useIdeas,
    useModuleData,
    useGenerateModule,
    useExportModule,
    useExportStatus,
} from '@/hooks';
import { downloadFile, toRupee } from '@/utils';

export default function GTMStrategy() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();
    const [productDescription, setProductDescription] = useState('');

    const { currentIdea, activeIdeaId: storedActiveIdeaId, setActiveIdeaId } = useIdeaStore();
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);

    // API HOOKS
    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;
    const { data: idea, isLoading: isLoadingIdea } = useIdea(activeIdeaId);
    const { data: moduleData } = useModuleData(activeIdeaId, 'gtm_strategy');
    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // DERIVED STATE
    const hasGenerated = moduleData?.exists && moduleData.data;
    const strategy = moduleData?.data || null;
    const isLoading = isLoadingIdeas || isLoadingIdea;
    const isGenerating = isTriggering || moduleData?.status === 'IN_PROGRESS';

    // EFFECTS
    const [lastIdeaKey, setLastIdeaKey] = useState<string | null>(null);

    useEffect(() => {
        const currentIdeaKey = idea ? `${idea.id}-${idea.description}` : null;
        if (idea?.description && currentIdeaKey !== lastIdeaKey) {
            setProductDescription(idea.description);
            setLastIdeaKey(currentIdeaKey);
        } else if (!idea && currentIdea?.description && !lastIdeaKey) {
            setProductDescription(currentIdea.description);
            setLastIdeaKey('store-initialized');
        }
    }, [idea, currentIdea, lastIdeaKey]);

    useEffect(() => {
        if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setActiveIdeaId(activeIdeaId);
        }
    }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

    // HANDLERS
    const handleGenerate = () => {
        if (!activeIdeaId) { toast.error('Please create an idea first'); return; }
        generateModule('gtm_strategy');
    };

    const { mutate: exportModule, isPending: isExporting } = useExportModule('gtm-strategy', activeIdeaId);
    const [exportJobId, setExportJobId] = useState<string | null>(null);
    const { data: exportStatus } = useExportStatus(exportJobId);

    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
            const filename = `${idea?.title || 'idea'}_gtm_strategy.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
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
        if (!hasGenerated) { toast.error('Please generate strategy first'); return; }
        exportModule({}, { onSuccess: (data) => setExportJobId(data.jobId) });
    };

    const handleSave = () => { toast.success('GTM strategy saved!'); };

    // Phase colors for launch timeline
    const phaseColors = [
        { bg: 'rgba(249,112,102,0.06)', border: '#F97066', text: '#E05A50' },
        { bg: 'rgba(251,146,60,0.06)', border: '#FB923C', text: '#EA580C' },
        { bg: 'rgba(52,211,153,0.06)', border: '#34D399', text: '#059669' },
        { bg: 'rgba(129,140,248,0.06)', border: '#818CF8', text: '#6366F1' },
    ];

    // RENDER
    if (isLoading) return <GTMStrategySkeleton />;

    return (
        <div className="max-w-5xl mx-auto space-y-7">
            <SEO
                title="Go-To-Market Strategy"
                description="Create a comprehensive launch strategy with AI."
                canonical="/dashboard/gtm"
            />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1
                        className="text-2xl font-bold flex items-center gap-2"
                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                    >
                        <Rocket className="w-7 h-7" style={{ color: '#F97066' }} />
                        GTM Strategy
                    </h1>
                    <p className="mt-1 text-[14px]" style={{ color: 'var(--dash-text-muted)' }}>
                        How will this product launch and grow?
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer"
                        style={{ color: 'var(--dash-text-muted)', border: '1px solid var(--dash-border-solid, #E8ECF4)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        <Save className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                        onClick={exportToPDF}
                        disabled={!hasGenerated || isExporting || !!exportJobId}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all cursor-pointer disabled:opacity-40"
                        style={{ color: 'var(--dash-text-muted)', border: '1px solid var(--dash-border-solid, #E8ECF4)' }}
                        onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        {(isExporting || !!exportJobId) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        {exportJobId ? 'Exporting...' : 'Export PDF'}
                        {!exportJobId && <CreditCost cost={2} />}
                    </button>
                </div>
            </div>

            {/* Input Section — this one keeps a subtle panel since it's interactive */}
            <div
                className="p-5 rounded-[14px]"
                style={{ border: '1px solid var(--dash-border-solid, #E8ECF4)' }}
            >
                <h2
                    className="text-[18px] font-bold flex items-center gap-2 mb-1"
                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                >
                    <Sparkles className="w-4 h-4" style={{ color: '#F97066' }} />
                    Describe Your Product
                </h2>
                <p className="text-[13px] mb-3" style={{ color: 'var(--dash-text-muted)' }}>
                    Tell us about your product to generate a tailored GTM strategy
                </p>
                <textarea
                    placeholder="Example: An AI-powered platform that helps first-time founders validate their startup ideas..."
                    rows={3}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-[10px] text-[13px] outline-none transition-all resize-none"
                    style={{
                        background: 'rgba(0,0,0,0.015)',
                        border: '1px solid var(--dash-border-solid, #E8ECF4)',
                        color: 'var(--dash-text)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#F97066'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,112,102,0.08)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--dash-border-solid, #E8ECF4)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <div className="flex items-center gap-3 mt-3">
                    <Button
                        onClick={handleGenerate}
                        isLoading={isGenerating}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                        disabled={!activeIdeaId}
                        style={{ background: 'linear-gradient(135deg, #F97066, #E05A50)' }}
                    >
                        <span className="flex items-center gap-2">
                            Generate GTM Strategy
                            <CreditCost cost={15} />
                        </span>
                    </Button>
                    {!activeIdeaId && (
                        <p className="text-[12px]" style={{ color: 'var(--dash-text-muted)' }}>
                            Please create an idea in Idea Validation first
                        </p>
                    )}
                </div>
            </div>

            {/* Generating State */}
            {isGenerating && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 px-5 py-4 rounded-[12px]"
                    style={{
                        background: 'linear-gradient(135deg, rgba(249,112,102,0.06), rgba(249,112,102,0.02))',
                        border: '1px solid rgba(249,112,102,0.15)',
                    }}
                >
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#F97066' }} />
                    <div>
                        <h3 className="font-medium text-[14px]" style={{ color: 'var(--dash-text)' }}>
                            Generating GTM Strategy...
                        </h3>
                        <p className="text-[13px]" style={{ color: 'var(--dash-text-muted)' }}>
                            Building your launch plan, pricing, and growth strategies. This usually takes 30-60 seconds.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* ================================================================= */}
            {/* RESULTS — only shown after generation, NO outer boxes             */}
            {/* ================================================================= */}
            {hasGenerated && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>
                            AI-Generated Strategy
                        </span>
                        <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                    </div>

                    {/* Target Users + Pricing — single column */}
                    <div className="space-y-8">
                        {/* Target Users */}
                        {strategy?.target_segments && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <h3
                                    className="text-[18px] font-bold flex items-center gap-2 mb-4"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <Target className="w-4 h-4" style={{ color: '#F97066' }} />
                                    Target Users
                                </h3>
                                <div className="space-y-2.5">
                                    {strategy.target_segments.map((segment: { name: string; description: string; priority: string }, i: number) => (
                                        <div
                                            key={i}
                                            className="p-3.5 rounded-[10px] transition-all"
                                            style={{ background: 'rgba(0,0,0,0.018)' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.018)'; }}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-[13px]" style={{ color: 'var(--dash-text)' }}>
                                                    {segment.name}
                                                </span>
                                                <span
                                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
                                                    style={{
                                                        background: segment.priority === 'high'
                                                            ? 'rgba(52,211,153,0.1)'
                                                            : segment.priority === 'medium'
                                                                ? 'rgba(251,146,60,0.1)'
                                                                : 'rgba(0,0,0,0.04)',
                                                        color: segment.priority === 'high'
                                                            ? '#059669'
                                                            : segment.priority === 'medium'
                                                                ? '#EA580C'
                                                                : 'var(--dash-text-muted)',
                                                    }}
                                                >
                                                    {segment.priority}
                                                </span>
                                            </div>
                                            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--dash-text-secondary)' }}>
                                                {segment.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Pricing Strategy */}
                        {strategy?.pricing_strategy && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <h3
                                    className="text-[18px] font-bold flex items-center gap-2 mb-4"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <DollarSign className="w-4 h-4" style={{ color: '#34D399' }} />
                                    Pricing Strategy
                                </h3>
                                <div
                                    className="p-4 rounded-[12px]"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(52,211,153,0.04), rgba(129,140,248,0.04))',
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[12px]" style={{ color: 'var(--dash-text-muted)' }}>
                                            Pricing Model
                                        </span>
                                        <span
                                            className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                                            style={{ background: 'rgba(52,211,153,0.12)', color: '#059669' }}
                                        >
                                            {strategy.pricing_strategy.model?.toUpperCase() || 'FREEMIUM'}
                                        </span>
                                    </div>
                                    <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--dash-text-secondary)' }}>
                                        {toRupee(strategy.pricing_strategy.description)}
                                    </p>
                                    {strategy.pricing_strategy.tiers && (
                                        <div
                                            className="space-y-2.5 pt-3"
                                            style={{ borderTop: '1px solid rgba(52,211,153,0.1)' }}
                                        >
                                            {strategy.pricing_strategy.tiers.map((tier: { name: string; price: string }, i: number) => (
                                                <div key={i} className="flex justify-between items-center text-[13px]">
                                                    <span style={{ color: 'var(--dash-text-secondary)' }}>{tier.name}</span>
                                                    <span className="font-semibold" style={{ color: 'var(--dash-text)' }}>{toRupee(tier.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Launch Plan Timeline — full width, NO outer box */}
                    {strategy?.launch_plan && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3
                                className="text-[18px] font-bold flex items-center gap-2 mb-4"
                                style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                            >
                                <Calendar className="w-4 h-4" style={{ color: '#FB923C' }} />
                                Launch Plan Timeline
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {strategy.launch_plan.map((phase: { phase: string; timeline: string; activities: string[] }, i: number) => {
                                    const color = phaseColors[i % phaseColors.length];
                                    return (
                                        <div
                                            key={i}
                                            className="p-4 rounded-[12px] relative"
                                            style={{ background: color.bg, borderLeft: `3px solid ${color.border}` }}
                                        >
                                            <div className="font-semibold text-[13px] mb-0.5" style={{ color: color.text }}>
                                                {phase.phase}
                                            </div>
                                            <div className="text-[11px] mb-2.5" style={{ color: 'var(--dash-text-muted)' }}>
                                                {phase.timeline}
                                            </div>
                                            <ul className="space-y-1.5">
                                                {phase.activities?.map((task: string, j: number) => (
                                                    <li key={j} className="text-[12px] flex items-start gap-2" style={{ color: 'var(--dash-text-secondary)' }}>
                                                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color.border }} />
                                                        {task}
                                                    </li>
                                                ))}
                                            </ul>
                                            {i < strategy.launch_plan.length - 1 && (
                                                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                                                    <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--dash-border-solid, #E8ECF4)' }} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Growth + KPIs — single column */}
                    <div className="space-y-8">
                        {/* Growth Strategies */}
                        {strategy?.growth_strategies && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <h3
                                    className="text-[18px] font-bold flex items-center gap-2 mb-4"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <TrendingUp className="w-4 h-4" style={{ color: '#818CF8' }} />
                                    Growth Strategies
                                </h3>
                                <div className="space-y-2.5">
                                    {strategy.growth_strategies.map((item: { strategy: string; description: string }, i: number) => (
                                        <div
                                            key={i}
                                            className="p-3.5 rounded-[10px] transition-all"
                                            style={{ background: 'rgba(0,0,0,0.018)' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.018)'; }}
                                        >
                                            <div className="font-semibold text-[13px] mb-1" style={{ color: 'var(--dash-text)' }}>
                                                {item.strategy}
                                            </div>
                                            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--dash-text-secondary)' }}>
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Key Metrics */}
                        {strategy?.kpis && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3
                                    className="text-[18px] font-bold flex items-center gap-2 mb-4"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <BarChart3 className="w-4 h-4" style={{ color: '#FBBF24' }} />
                                    Key Metrics (KPIs)
                                </h3>
                                <div className="space-y-2">
                                    {strategy.kpis.map((kpi: { metric: string; target: string; timeframe: string }, i: number) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-3 rounded-[10px] transition-all"
                                            style={{ background: 'rgba(0,0,0,0.018)' }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.018)'; }}
                                        >
                                            <span className="text-[13px]" style={{ color: 'var(--dash-text-secondary)' }}>
                                                {kpi.metric}
                                            </span>
                                            <span
                                                className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                style={{ background: 'rgba(251,191,36,0.1)', color: '#D97706' }}
                                            >
                                                {kpi.target}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-3 text-[12px]" style={{ color: 'var(--dash-text-muted)' }}>
                                    Track these metrics from day one to measure growth and make data-driven decisions.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
