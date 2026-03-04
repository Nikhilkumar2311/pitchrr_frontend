/**
 * Module 2: Marketing Strategy Page
 * 
 * Helps founders create a comprehensive marketing plan.
 * 
 * FEATURES:
 * - 30-day marketing plan (week-by-week)
 * - Marketing funnel design
 * - Channel strategy (online/offline)
 * - Customer persona creation
 * - AI-recommended ads strategy
 * - Social media improvements
 * 
 * DATA FLOW:
 * - Fetches idea from Core Service
 * - Generates marketing strategy via AI
 * - React Query polls for results
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Megaphone,
    Download,
    Sparkles,
    Calendar,
    Users,
    Target,
    Zap,
    Loader2,
    BarChart3,
} from 'lucide-react';
import {
    Card,
    Button,
    Textarea,
    Badge,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { MarketingStrategySkeleton } from '@/components/skeletons/MarketingStrategySkeleton';
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

/** Animation variants */
const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
};

export default function MarketingStrategy() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // Form state
    const [targetAudience, setTargetAudience] = useState('');

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
    } = useModuleData(activeIdeaId, 'marketing_strategy');

    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // Export hooks
    const { mutate: exportModule, isPending: isExporting } = useExportModule('marketing-strategy', activeIdeaId);
    const [exportJobId, setExportJobId] = useState<string | null>(null);
    const { data: exportStatus } = useExportStatus(exportJobId);

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasGenerated = moduleData?.exists && moduleData.data;
    const strategy = moduleData?.data || null;
    const isLoading = isLoadingIdeas || isLoadingIdea;
    // Use status from backend to detect pending state (survives page refresh)
    const isGenerating = isTriggering || moduleData?.status === 'IN_PROGRESS';

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    // Track the last known idea data to detect when NEW data arrives
    const [lastIdeaKey, setLastIdeaKey] = useState<string | null>(null);

    // Populate target audience from idea (only when idea data actually changes)
    useEffect(() => {
        const currentIdeaKey = idea ? `${idea.id}-${idea.targetAudience || ''}` : null;

        if (idea?.targetAudience && currentIdeaKey !== lastIdeaKey) {
            setTargetAudience(idea.targetAudience);
            setLastIdeaKey(currentIdeaKey);
        } else if (!idea && currentIdea?.targetMarket && !lastIdeaKey) {
            setTargetAudience(currentIdea.targetMarket);
            setLastIdeaKey('store-initialized');
        }
    }, [idea, currentIdea, lastIdeaKey]);

    // Sync activeIdeaId in store when idea changes to keep persistence across modules
    useEffect(() => {
        if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setActiveIdeaId(activeIdeaId);
        }
    }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

    // Handle export completion
    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
            const filename = `${idea?.title || 'idea'}_marketing_strategy.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
            downloadFile(exportStatus.downloadUrl, filename)
                .then(() => toast.success('PDF downloaded!'))
                .catch(() => toast.error('Download failed'));
            setExportJobId(null);
        } else if (exportStatus?.state === 'failed') {
            toast.error('Export failed: ' + (exportStatus.failedReason || 'Unknown error'));
            setExportJobId(null);
        }
    }, [exportStatus, idea?.title]);

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    const handleGenerate = () => {
        if (!activeIdeaId) {
            toast.error('Please create an idea first');
            return;
        }
        generateModule('marketing_strategy');
    };

    const exportToPDF = () => {
        if (!hasGenerated) {
            toast.error('Please generate strategy first');
            return;
        }
        exportModule({}, {
            onSuccess: (data) => {
                setExportJobId(data.jobId);
            },
        });
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <MarketingStrategySkeleton />;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <SEO
                title="Marketing Strategy"
                description="Create a comprehensive AI-powered marketing plan with 30-day timeline, target segments, channel strategies, and messaging frameworks."
                canonical="/dashboard/marketing"
            />

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
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
                                style={{ background: 'rgba(16,185,129,0.08)' }}
                            >
                                <Megaphone className="w-5 h-5" style={{ color: '#10B981' }} />
                            </div>
                            Marketing Strategy
                        </h1>
                        <p
                            className="mt-1 text-[14px]"
                            style={{ color: 'var(--dash-text-muted)' }}
                        >
                            How will users find and adopt this product?
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={exportToPDF}
                        disabled={!hasGenerated || isExporting || !!exportJobId}
                        isLoading={isExporting || !!exportJobId}
                        className="shrink-0"
                    >
                        <span className="flex items-center gap-2">
                            {exportJobId ? 'Exporting...' : 'Export PDF'}
                            {!exportJobId && <CreditCost cost={2} />}
                        </span>
                    </Button>
                </div>

                {/* ═══════════════════════════════════════════════
                    INPUT SECTION
                 ═══════════════════════════════════════════════ */}
                <Card>
                    <div className="mb-4">
                        <h2
                            className="text-[15px] font-semibold"
                            style={{
                                color: 'var(--dash-text)',
                                fontFamily: 'var(--dash-font-heading)',
                            }}
                        >
                            Who is your target audience?
                        </h2>
                        <p className="text-[13px] mt-0.5" style={{ color: 'var(--dash-text-muted)' }}>
                            Describe your ideal customer to generate a personalized marketing strategy
                        </p>
                    </div>
                    <Textarea
                        placeholder="Example: First-time founders aged 25-40 who have a startup idea but don't know how to validate it or create a pitch deck..."
                        rows={3}
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                    />
                    <div className="mt-5">
                        <Button
                            onClick={handleGenerate}
                            isLoading={isGenerating}
                            leftIcon={<Sparkles className="w-4 h-4" />}
                            disabled={!activeIdeaId}
                            className="w-full sm:w-auto"
                            style={{
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                            }}
                        >
                            <span className="flex items-center gap-2">
                                Generate Marketing Strategy
                                <CreditCost cost={15} />
                            </span>
                        </Button>
                        {!activeIdeaId && (
                            <p className="text-[12px] mt-2" style={{ color: 'var(--dash-text-muted)' }}>
                                Please create an idea in Idea Validation first
                            </p>
                        )}
                    </div>
                </Card>

                {/* ═══════════════════════════════════════════════
                    GENERATING STATE
                 ═══════════════════════════════════════════════ */}
                {isGenerating && (
                    <motion.div {...fadeUp}>
                        <Card
                            style={{
                                background: 'linear-gradient(135deg, rgba(16,185,129,0.04), rgba(5,150,105,0.04))',
                                border: '1px solid rgba(16,185,129,0.12)',
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                                    style={{
                                        background: 'linear-gradient(135deg, #10B981, #059669)',
                                    }}
                                >
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold text-[14px]"
                                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                    >
                                        Generating Marketing Strategy...
                                    </h3>
                                    <p className="text-[13px]" style={{ color: 'var(--dash-text-muted)' }}>
                                        This usually takes 30-60 seconds
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* ═══════════════════════════════════════════════
                    RESULTS — STACKED VERTICALLY
                 ═══════════════════════════════════════════════ */}

                {/* 30-Day Marketing Plan */}
                {hasGenerated && strategy?.timeline && (
                    <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
                        <Card>
                            <div className="mb-4">
                                <h2
                                    className="text-[15px] font-semibold flex items-center gap-2"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <Calendar className="w-4 h-4" style={{ color: '#10B981' }} />
                                    30-Day Marketing Plan
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {strategy.timeline.map((phase: { phase: string; activities: string[] }, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                        className="p-4 rounded-[10px]"
                                        style={{ background: 'rgba(0,0,0,0.02)' }}
                                    >
                                        <div
                                            className="font-semibold text-[13px] mb-2"
                                            style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                        >
                                            {phase.phase}
                                        </div>
                                        <ul className="space-y-1.5">
                                            {phase.activities?.map((task: string, j: number) => (
                                                <li key={j} className="text-[13px] flex items-start gap-2" style={{ color: 'var(--dash-text-secondary)' }}>
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#10B981' }} />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Target Segments */}
                {hasGenerated && strategy?.target_segments && (
                    <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
                        <Card>
                            <div className="mb-4">
                                <h2
                                    className="text-[15px] font-semibold flex items-center gap-2"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <Target className="w-4 h-4" style={{ color: '#10B981' }} />
                                    Target Segments
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {strategy.target_segments.map((segment: { name: string; description: string; size: string }, i: number) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-[10px]"
                                        style={{ background: 'rgba(0,0,0,0.02)' }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span
                                                className="font-semibold text-[13px]"
                                                style={{ color: 'var(--dash-text)' }}
                                            >
                                                {segment.name}
                                            </span>
                                            {segment.size && (
                                                <Badge variant="primary">{segment.size}</Badge>
                                            )}
                                        </div>
                                        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--dash-text-secondary)' }}>
                                            {segment.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Marketing Channels */}
                {hasGenerated && strategy?.channels && (
                    <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
                        <Card>
                            <div className="mb-4">
                                <h2
                                    className="text-[15px] font-semibold flex items-center gap-2"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <Zap className="w-4 h-4" style={{ color: '#10B981' }} />
                                    Marketing Channels
                                </h2>
                            </div>
                            <div className="space-y-3">
                                {strategy.channels.map((channel: { name: string; priority: string; tactics: string[] }, i: number) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-[10px]"
                                        style={{ background: 'rgba(0,0,0,0.02)' }}
                                    >
                                        <div className="flex items-center justify-between mb-2.5">
                                            <span
                                                className="font-semibold text-[13px]"
                                                style={{ color: 'var(--dash-text)' }}
                                            >
                                                {channel.name}
                                            </span>
                                            <Badge variant={channel.priority === 'high' ? 'success' : 'default'}>
                                                {channel.priority}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {channel.tactics?.map((tactic: string, j: number) => (
                                                <span
                                                    key={j}
                                                    className="px-2.5 py-1 text-[11px] font-medium rounded-full"
                                                    style={{
                                                        background: 'rgba(16,185,129,0.06)',
                                                        color: '#059669',
                                                        border: '1px solid rgba(16,185,129,0.12)',
                                                    }}
                                                >
                                                    {tactic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Messaging Framework */}
                {hasGenerated && strategy?.messaging_framework && (
                    <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
                        <Card>
                            <div className="mb-4">
                                <h2
                                    className="text-[15px] font-semibold flex items-center gap-2"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <Users className="w-4 h-4" style={{ color: '#10B981' }} />
                                    Messaging Framework
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Value Proposition */}
                                <div
                                    className="p-4 rounded-[10px]"
                                    style={{
                                        background: 'rgba(16,185,129,0.04)',
                                        border: '1px solid rgba(16,185,129,0.12)',
                                    }}
                                >
                                    <h4
                                        className="font-semibold text-[13px] mb-2"
                                        style={{ color: '#059669' }}
                                    >
                                        Value Proposition
                                    </h4>
                                    <p className="text-[13px] leading-relaxed" style={{ color: '#047857' }}>
                                        {strategy.messaging_framework.value_proposition}
                                    </p>
                                </div>
                                {/* Key Messages */}
                                <div
                                    className="p-4 rounded-[10px]"
                                    style={{
                                        background: 'rgba(79,125,243,0.04)',
                                        border: '1px solid rgba(79,125,243,0.12)',
                                    }}
                                >
                                    <h4
                                        className="font-semibold text-[13px] mb-2"
                                        style={{ color: '#4F7DF3' }}
                                    >
                                        Key Messages
                                    </h4>
                                    <ul className="space-y-1.5">
                                        {strategy.messaging_framework.key_messages?.map((msg: string, i: number) => (
                                            <li key={i} className="text-[13px] flex items-start gap-2" style={{ color: '#3B6CE7' }}>
                                                <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: '#4F7DF3' }} />
                                                {msg}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* KPIs */}
                {hasGenerated && strategy?.kpis && (
                    <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
                        <Card>
                            <div className="mb-4">
                                <h2
                                    className="text-[15px] font-semibold flex items-center gap-2"
                                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                                >
                                    <BarChart3 className="w-4 h-4" style={{ color: '#10B981' }} />
                                    Key Performance Indicators
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {strategy.kpis.map((kpi: string, i: number) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.04 }}
                                        className="px-3.5 py-2 text-[13px] font-medium rounded-[8px]"
                                        style={{
                                            background: 'rgba(0,0,0,0.02)',
                                            color: 'var(--dash-text-secondary)',
                                            border: '1px solid var(--dash-border-solid, #E8ECF4)',
                                        }}
                                    >
                                        {kpi}
                                    </motion.span>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Placeholder when not generated */}
                {!hasGenerated && !isGenerating && (
                    <Card className="flex flex-col items-center justify-center py-16 text-center">
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
                            Describe your target audience and click "Generate Marketing Strategy" to get started
                        </p>
                    </Card>
                )}
            </motion.div>
        </div>
    );
}
