/**
 * Module 6: Competitor Analysis Page
 * 
 * Helps founders understand their competitive landscape.
 * 
 * FEATURES:
 * - Competitor cards (initially 3, load more)
 * - Market overview
 * - Competitive advantages & market gaps
 * - Strategic recommendations
 * 
 * DESIGN:
 * - Result sections hidden until AI generates data
 * - No Card/Badge wrappers — inline styled panels
 * - Design tokens for all colors
 * - 18px headings with icons
 * - max-w-5xl centered layout
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Download,
    Sparkles,
    Loader2,
    Coins,
    Globe,
    Shield,
    Crosshair,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    Zap,
} from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { CompetitorAnalysisSkeleton } from '@/components/skeletons/CompetitorAnalysisSkeleton';
import { CreditCost, SEO } from '@/components/common';
import {
    useIdeas,
    useModuleData,
    useGenerateModule,
    useExportModule,
    useExportStatus,
} from '@/hooks';
import { downloadFile, toRupee } from '@/utils';

interface Competitor {
    name: string;
    website?: string;
    pricing?: string;
    description?: string;
    strengths: string[];
    weaknesses: string[];
}

const INITIAL_COMPETITOR_COUNT = 3;
const CREDITS_PER_LOAD = 5;

export default function CompetitorAnalysis() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();
    const [visibleCount, setVisibleCount] = useState(INITIAL_COMPETITOR_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // API HOOKS
    const { activeIdeaId: storedActiveIdeaId, setActiveIdeaId } = useIdeaStore();
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);
    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;
    const { data: moduleData } = useModuleData(activeIdeaId, 'competitor_analysis');
    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // DERIVED STATE
    const hasAnalyzed = moduleData?.exists && moduleData.data;
    const analysisData = moduleData?.data || null;
    const allCompetitors: Competitor[] = analysisData?.competitors || [];
    const competitors = allCompetitors.slice(0, visibleCount);
    const hasMoreCompetitors = allCompetitors.length > visibleCount;
    const remainingCount = allCompetitors.length - visibleCount;
    const isLoading = isLoadingIdeas;
    const isAnalyzing = isTriggering || moduleData?.status === 'IN_PROGRESS';

    useEffect(() => {
        if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setActiveIdeaId(activeIdeaId);
        }
    }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

    // HANDLERS
    const handleAnalyze = () => {
        if (!activeIdeaId) { toast.error('Please create an idea first'); return; }
        generateModule('competitor_analysis');
    };

    const { mutate: exportModule, isPending: isExporting } = useExportModule('competitor-analysis', activeIdeaId);
    const [exportJobId, setExportJobId] = useState<string | null>(null);
    const { data: exportStatus } = useExportStatus(exportJobId);

    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
            downloadFile(exportStatus.downloadUrl, 'competitor_analysis.pdf')
                .then(() => toast.success('PDF downloaded!'))
                .catch(() => toast.error('Download failed'));
            setExportJobId(null);
        } else if (exportStatus?.state === 'failed') {
            toast.error('Export failed: ' + (exportStatus.failedReason || 'Unknown error'));
            setExportJobId(null);
        }
    }, [exportStatus]);

    const exportToPDF = () => {
        if (!hasAnalyzed) { toast.error('Please analyze competitors first'); return; }
        exportModule({}, { onSuccess: (data) => setExportJobId(data.jobId) });
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVisibleCount(prev => prev + 3);
        toast.success(`Loaded more competitors! (${CREDITS_PER_LOAD} credits used)`);
        setIsLoadingMore(false);
    };

    // RENDER
    if (isLoading) return <CompetitorAnalysisSkeleton />;

    return (
        <div className="max-w-5xl mx-auto space-y-7">
            <SEO
                title="Competitor Analysis"
                description="Analyze your competitive landscape with AI."
                canonical="/dashboard/competitors"
            />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1
                        className="text-2xl font-bold flex items-center gap-2"
                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                    >
                        <Users className="w-7 h-7" style={{ color: '#06B6D4' }} />
                        Competitor Analysis
                    </h1>
                    <p className="mt-1 text-[14px]" style={{ color: 'var(--dash-text-muted)' }}>
                        Understand where your idea stands in the market
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportToPDF}
                        disabled={!hasAnalyzed || isExporting || !!exportJobId}
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

            {/* Input Section */}
            <div
                className="p-5 rounded-[14px]"
                style={{ border: '1px solid var(--dash-border-solid, #E8ECF4)' }}
            >
                <h2
                    className="text-[18px] font-bold flex items-center gap-2 mb-1"
                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                >
                    <Sparkles className="w-4 h-4" style={{ color: '#06B6D4' }} />
                    Analyze Competitors
                </h2>
                <p className="text-[13px] mb-4" style={{ color: 'var(--dash-text-muted)' }}>
                    Let AI research and analyze your competitive landscape
                </p>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleAnalyze}
                        isLoading={isAnalyzing}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                        disabled={!activeIdeaId}
                        style={{ background: 'linear-gradient(135deg, #06B6D4, #0891B2)' }}
                    >
                        <span className="flex items-center gap-2">
                            {hasAnalyzed ? 'Re-analyze with AI' : 'Analyze with AI'}
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
            {isAnalyzing && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 px-5 py-4 rounded-[12px]"
                    style={{
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.06), rgba(6,182,212,0.02))',
                        border: '1px solid rgba(6,182,212,0.15)',
                    }}
                >
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#06B6D4' }} />
                    <div>
                        <h3 className="font-medium text-[14px]" style={{ color: 'var(--dash-text)' }}>
                            Analyzing Competitors...
                        </h3>
                        <p className="text-[13px]" style={{ color: 'var(--dash-text-muted)' }}>
                            Researching your market and competitive landscape. This usually takes 30-60 seconds.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* ================================================================= */}
            {/* RESULTS — only shown after generation                             */}
            {/* ================================================================= */}
            {hasAnalyzed && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#94A3B8' }}>
                            AI-Generated Analysis
                        </span>
                        <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                    </div>

                    {/* Competitor Cards — single column, no Card wrapper */}
                    {competitors.length > 0 && (
                        <div>
                            <h3
                                className="text-[18px] font-bold flex items-center gap-2 mb-4"
                                style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                            >
                                <Users className="w-4 h-4" style={{ color: '#06B6D4' }} />
                                Competitors ({allCompetitors.length})
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {competitors.map((competitor, index) => (
                                    <motion.div
                                        key={competitor.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 rounded-[12px] transition-all"
                                        style={{ background: 'rgba(0,0,0,0.018)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.018)'; }}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-[14px]" style={{ color: 'var(--dash-text)' }}>
                                                    {competitor.name}
                                                </h4>
                                                {(competitor.website || competitor.description) && (
                                                    <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: 'var(--dash-text-muted)' }}>
                                                        {competitor.website || competitor.description}
                                                    </p>
                                                )}
                                            </div>
                                            {competitor.pricing && (
                                                <span
                                                    className="text-[11px] font-semibold px-2.5 py-1 rounded-[6px] shrink-0 whitespace-nowrap"
                                                    style={{ background: 'rgba(6,182,212,0.08)', color: '#0891B2' }}
                                                >
                                                    {toRupee(competitor.pricing)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 mt-3">
                                            {/* Strengths */}
                                            {competitor.strengths?.length > 0 && (
                                                <div className="flex-1">
                                                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1" style={{ color: '#059669' }}>
                                                        <CheckCircle className="w-3 h-3" />
                                                        Strengths
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {competitor.strengths.map((s, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-[11px] px-2 py-0.5 rounded-full"
                                                                style={{ background: 'rgba(52,211,153,0.1)', color: '#059669' }}
                                                            >
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Weaknesses */}
                                            {competitor.weaknesses?.length > 0 && (
                                                <div className="flex-1">
                                                    <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1" style={{ color: '#DC2626' }}>
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Weaknesses
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {competitor.weaknesses.map((w, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-[11px] px-2 py-0.5 rounded-full"
                                                                style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626' }}
                                                            >
                                                                {w}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Load More */}
                            {hasMoreCompetitors && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-[13px] font-medium transition-all cursor-pointer disabled:opacity-50"
                                        style={{
                                            color: '#06B6D4',
                                            background: 'rgba(6,182,212,0.06)',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.12)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(6,182,212,0.06)'; }}
                                    >
                                        {isLoadingMore ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Coins className="w-3.5 h-3.5" />
                                        )}
                                        Load {Math.min(remainingCount, 3)} More ({CREDITS_PER_LOAD} credits)
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Market Overview */}
                    {analysisData?.market_overview && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3
                                className="text-[18px] font-bold flex items-center gap-2 mb-3"
                                style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                            >
                                <Globe className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                                Market Overview
                            </h3>
                            <div
                                className="p-4 rounded-[12px]"
                                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.04), rgba(6,182,212,0.04))' }}
                            >
                                <p className="text-[13px] leading-[1.7]" style={{ color: 'var(--dash-text-secondary)' }}>
                                    {analysisData.market_overview}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Competitive Advantages & Market Gaps */}
                    {(analysisData?.competitive_advantages || analysisData?.gaps_in_market) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <h3
                                className="text-[18px] font-bold flex items-center gap-2 mb-4"
                                style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                            >
                                <Shield className="w-4 h-4" style={{ color: '#10B981' }} />
                                Competitive Positioning
                            </h3>

                            <div className="space-y-4">
                                {analysisData.competitive_advantages?.length > 0 && (
                                    <div>
                                        <div className="text-[12px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: '#059669' }}>
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            Your Competitive Advantages
                                        </div>
                                        <div className="space-y-1.5">
                                            {analysisData.competitive_advantages.map((adv: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-2.5 p-2.5 rounded-[8px]"
                                                    style={{ background: 'rgba(52,211,153,0.05)' }}
                                                >
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                                                        style={{ background: '#34D399' }}
                                                    />
                                                    <span className="text-[13px]" style={{ color: 'var(--dash-text-secondary)' }}>
                                                        {adv}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysisData.gaps_in_market?.length > 0 && (
                                    <div>
                                        <div className="text-[12px] font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: '#0891B2' }}>
                                            <Crosshair className="w-3.5 h-3.5" />
                                            Market Gaps & Opportunities
                                        </div>
                                        <div className="space-y-1.5">
                                            {analysisData.gaps_in_market.map((gap: string, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex items-start gap-2.5 p-2.5 rounded-[8px]"
                                                    style={{ background: 'rgba(6,182,212,0.04)' }}
                                                >
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                                                        style={{ background: '#22D3EE' }}
                                                    />
                                                    <span className="text-[13px]" style={{ color: 'var(--dash-text-secondary)' }}>
                                                        {gap}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Strategic Recommendations */}
                    {analysisData?.positioning_recommendations?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3
                                className="text-[18px] font-bold flex items-center gap-2 mb-4"
                                style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                            >
                                <Zap className="w-4 h-4" style={{ color: '#F59E0B' }} />
                                Strategic Recommendations
                            </h3>
                            <div className="space-y-2">
                                {analysisData.positioning_recommendations.map((rec: string, i: number) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-3 rounded-[10px] transition-all"
                                        style={{ background: 'rgba(0,0,0,0.018)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.018)'; }}
                                    >
                                        <span
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.12))',
                                                color: '#D97706',
                                            }}
                                        >
                                            {i + 1}
                                        </span>
                                        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--dash-text-secondary)' }}>
                                            {rec}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
