/**
 * Module: Grants & Funding
 *
 * Helps founders discover grants, schemes, and funding opportunities.
 *
 * THREE SECTIONS:
 * 1. "Recommended for your Startup" — AI-picked grants from the dataset
 * 2. "Stage-wise Roadmap"           — Visual timeline: Idea → Seed → Growth
 * 3. "Browse All Grants"            — Responsive card grid, click to visit
 *
 * DATA FLOW:
 * - Static data from grantsData.ts (for Browse section)
 * - AI-generated data via useModuleData hook (for Recommendation + Roadmap)
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HandCoins,
    Sparkles,
    Loader2,
    ExternalLink,
    Search,
    Lightbulb,
    Sprout,
    Rocket,
    CheckCircle2,
    Circle,
    Star,
    Filter,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { SEO, CreditCost } from '@/components/common';
import {
    useIdeas,
    useModuleData,
    useGenerateModule,
} from '@/hooks';
import {
    grants,
    getGrantCategories,
    getCategoryLabel,
    getCategoryLabels,
    getSectorLabel,
    type Grant,
} from '@/data/grantsData';

// =============================================================================
// TYPES
// =============================================================================

interface RoadmapStage {
    stage: string;
    icon: string;
    description: string;
    grants: string[];
    checklist: string[];
}

interface RecommendedGrant {
    title: string;
    reason: string;
    official_url?: string;
    category?: string;
    funding?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function Grants() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // Local UI state
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [visibleCount, setVisibleCount] = useState(24);

    // =========================================================================
    // API HOOKS (same pattern as other modules)
    // =========================================================================

    const { activeIdeaId: storedActiveIdeaId, setActiveIdeaId } = useIdeaStore();
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;

    const { data: moduleData } = useModuleData(activeIdeaId, 'grants');
    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // =========================================================================
    // DERIVED STATE
    // =========================================================================

    const hasGenerated = moduleData?.exists && moduleData.data;

    // Safety: data could be a JSON string or a parsed object depending on how it was stored
    const aiData = useMemo(() => {
        const raw = moduleData?.data;
        if (!raw) return null;
        if (typeof raw === 'string') {
            try { return JSON.parse(raw); } catch { return null; }
        }
        return raw;
    }, [moduleData?.data]);

    const recommendations: RecommendedGrant[] = aiData?.recommendations || [];
    const roadmap: RoadmapStage[] = aiData?.roadmap || [];
    const isGenerating = isTriggering || moduleData?.status === 'IN_PROGRESS';

    // Static grant categories
    const grantCategories = useMemo(() => getGrantCategories(), []);

    // Filtered grants for browse
    const filteredGrants = useMemo(() => {
        let list = grants;

        if (activeCategory !== 'all') {
            list = list.filter(g =>
                getCategoryLabels(g).some(cat => cat.toLowerCase() === activeCategory.toLowerCase())
            );
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(g =>
                (g.title?.toLowerCase().includes(q)) ||
                (g.description?.toLowerCase().includes(q)) ||
                (g.organization?.toLowerCase().includes(q)) ||
                (getSectorLabel(g).toLowerCase().includes(q))
            );
        }

        return list;
    }, [activeCategory, searchQuery]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(24);
    }, [activeCategory, searchQuery]);

    // Sync active idea
    useEffect(() => {
        if (activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setActiveIdeaId(activeIdeaId);
        }
    }, [activeIdeaId, storedActiveIdeaId, setActiveIdeaId]);

    // =========================================================================
    // HANDLERS
    // =========================================================================

    const handleGenerate = () => {
        if (!activeIdeaId) {
            toast.error('Please create an idea first');
            return;
        }
        generateModule('grants');
    };

    const toggleStep = (stepKey: string) => {
        setCompletedSteps(prev => {
            const next = new Set(prev);
            next.has(stepKey) ? next.delete(stepKey) : next.add(stepKey);
            return next;
        });
    };

    const stageConfig: Record<string, {
        icon: React.ReactNode;
        gradient: string;
        dotColor: string;
        lineColor: string;
        badgeBg: string;
        badgeBorder: string;
        textColor: string;
    }> = {
        'Idea': {
            icon: <Lightbulb className="w-5 h-5 text-white" />,
            gradient: 'from-sky-500 to-blue-600',
            dotColor: '#0284C7', lineColor: 'from-sky-500 to-teal-500',
            badgeBg: '#EFF6FF', badgeBorder: '#BFDBFE', textColor: '#1D4ED8',
        },
        'Idea Stage': {
            icon: <Lightbulb className="w-5 h-5 text-white" />,
            gradient: 'from-sky-500 to-blue-600',
            dotColor: '#0284C7', lineColor: 'from-sky-500 to-teal-500',
            badgeBg: '#EFF6FF', badgeBorder: '#BFDBFE', textColor: '#1D4ED8',
        },
        'Pre-Seed': {
            icon: <Lightbulb className="w-5 h-5 text-white" />,
            gradient: 'from-blue-500 to-cyan-600',
            dotColor: '#2563EB', lineColor: 'from-blue-500 to-teal-500',
            badgeBg: '#DBEAFE', badgeBorder: '#93C5FD', textColor: '#1D4ED8',
        },
        'Proof of Concept': {
            icon: <Star className="w-5 h-5 text-white" />,
            gradient: 'from-teal-500 to-emerald-600',
            dotColor: '#0D9488', lineColor: 'from-teal-500 to-emerald-500',
            badgeBg: '#F0FDFA', badgeBorder: '#99F6E4', textColor: '#0F766E',
        },
        'Prototype': {
            icon: <Star className="w-5 h-5 text-white" />,
            gradient: 'from-emerald-500 to-teal-600',
            dotColor: '#059669', lineColor: 'from-emerald-500 to-cyan-500',
            badgeBg: '#ECFDF5', badgeBorder: '#A7F3D0', textColor: '#047857',
        },
        'Seed': {
            icon: <Sprout className="w-5 h-5 text-white" />,
            gradient: 'from-emerald-500 to-green-600',
            dotColor: '#059669', lineColor: 'from-emerald-500 to-indigo-500',
            badgeBg: '#ECFDF5', badgeBorder: '#A7F3D0', textColor: '#047857',
        },
        'Seed Stage': {
            icon: <Sprout className="w-5 h-5 text-white" />,
            gradient: 'from-emerald-500 to-green-600',
            dotColor: '#059669', lineColor: 'from-emerald-500 to-indigo-500',
            badgeBg: '#ECFDF5', badgeBorder: '#A7F3D0', textColor: '#047857',
        },
        'Early Stage': {
            icon: <Sprout className="w-5 h-5 text-white" />,
            gradient: 'from-cyan-500 to-teal-600',
            dotColor: '#0891B2', lineColor: 'from-cyan-500 to-indigo-500',
            badgeBg: '#ECFEFF', badgeBorder: '#A5F3FC', textColor: '#0E7490',
        },
        'Growth': {
            icon: <Rocket className="w-5 h-5 text-white" />,
            gradient: 'from-indigo-500 to-blue-700',
            dotColor: '#4F46E5', lineColor: 'from-indigo-500 to-slate-500',
            badgeBg: '#EEF2FF', badgeBorder: '#C7D2FE', textColor: '#4338CA',
        },
        'Growth Stage': {
            icon: <Rocket className="w-5 h-5 text-white" />,
            gradient: 'from-indigo-500 to-blue-700',
            dotColor: '#4F46E5', lineColor: 'from-indigo-500 to-slate-500',
            badgeBg: '#EEF2FF', badgeBorder: '#C7D2FE', textColor: '#4338CA',
        },
        'Scale-up': {
            icon: <Rocket className="w-5 h-5 text-white" />,
            gradient: 'from-violet-600 to-indigo-700',
            dotColor: '#7C3AED', lineColor: 'from-violet-600 to-slate-600',
            badgeBg: '#F5F3FF', badgeBorder: '#DDD6FE', textColor: '#6D28D9',
        },
        'Established': {
            icon: <Star className="w-5 h-5 text-white" />,
            gradient: 'from-slate-600 to-gray-800',
            dotColor: '#475569', lineColor: 'from-slate-600 to-gray-600',
            badgeBg: '#F8FAFC', badgeBorder: '#E2E8F0', textColor: '#334155',
        },
    };

    // Fallback colors by index for any unrecognized stage names
    const fallbackConfigs = [
        {
            icon: <Lightbulb className="w-5 h-5 text-white" />,
            gradient: 'from-sky-500 to-blue-600', dotColor: '#0284C7', lineColor: 'from-sky-500 to-teal-500',
            badgeBg: '#EFF6FF', badgeBorder: '#BFDBFE', textColor: '#1D4ED8',
        },
        {
            icon: <Sprout className="w-5 h-5 text-white" />,
            gradient: 'from-emerald-500 to-green-600', dotColor: '#059669', lineColor: 'from-emerald-500 to-indigo-500',
            badgeBg: '#ECFDF5', badgeBorder: '#A7F3D0', textColor: '#047857',
        },
        {
            icon: <Rocket className="w-5 h-5 text-white" />,
            gradient: 'from-indigo-500 to-blue-700', dotColor: '#4F46E5', lineColor: 'from-indigo-500 to-slate-500',
            badgeBg: '#EEF2FF', badgeBorder: '#C7D2FE', textColor: '#4338CA',
        },
    ];

    // =========================================================================
    // RENDER
    // =========================================================================

    if (isLoadingIdeas) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 rounded w-48" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                <div className="h-4 rounded w-64" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-32 rounded-xl" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <SEO
                title="Grants & Funding"
                description="Discover grants, government schemes, accelerators, and funding opportunities tailored to your startup."
                canonical="/dashboard/grants"
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1
                        className="text-2xl font-bold flex items-center gap-2"
                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                    >
                        <HandCoins className="w-7 h-7" style={{ color: '#06B6D4' }} />
                        Grants & Funding
                    </h1>
                    <p className="mt-1 text-[14px]" style={{ color: 'var(--dash-text-muted)' }}>
                        Discover grants, schemes, and funding opportunities for your startup
                    </p>
                </div>
                <Button
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    disabled={!activeIdeaId}
                    style={{
                        background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
                    }}
                >
                    <span className="flex items-center gap-2">
                        {hasGenerated ? 'Refresh Recommendations' : 'Get Recommendations'}
                        <CreditCost cost={10} />
                    </span>
                </Button>
            </div>

            {/* No idea state */}
            {!activeIdeaId && (
                <div
                    className="text-center py-8 rounded-[12px]"
                    style={{
                        background: 'rgba(0,0,0,0.015)',
                        border: '2px dashed var(--dash-border-solid, #E8ECF4)',
                    }}
                >
                    <Lightbulb className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--dash-text-muted)' }} />
                    <h3
                        className="font-medium text-[15px]"
                        style={{ color: 'var(--dash-text)' }}
                    >
                        Create an idea first
                    </h3>
                    <p className="text-[13px] mt-1" style={{ color: 'var(--dash-text-muted)' }}>
                        Go to Idea Validation to submit your startup idea, then come back for personalized recommendations.
                    </p>
                </div>
            )}

            {/* Generating State — inline strip */}
            {isGenerating && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 px-5 py-4 rounded-[12px]"
                    style={{
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(8,145,178,0.04))',
                        border: '1px solid rgba(6,182,212,0.18)',
                    }}
                >
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#06B6D4' }} />
                    <div>
                        <h3 className="font-medium text-[14px]" style={{ color: 'var(--dash-text)' }}>
                            Finding the best grants for you...
                        </h3>
                        <p className="text-[13px]" style={{ color: 'var(--dash-text-muted)' }}>
                            Analyzing your startup profile for the best grants. This usually takes 30-60 seconds.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* ================================================================= */}
            {/* SECTION 1: Recommended for your Startup                           */}
            {/* ================================================================= */}
            {recommendations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Section divider */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                        <span
                            className="text-[11px] font-bold uppercase tracking-widest"
                            style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
                        >
                            AI Recommendations
                        </span>
                        <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                    </div>

                    <h2
                        className="text-[18px] font-bold flex items-center gap-2 mb-1"
                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                    >
                        <Star className="w-4 h-4" style={{ color: '#F59E0B' }} />
                        Recommended for your Startup
                    </h2>
                    <p className="text-[13px] mb-4" style={{ color: 'var(--dash-text-muted)' }}>
                        Handpicked based on your startup's industry, stage, and profile
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {recommendations.map((rec, index) => (
                            <motion.div
                                key={`rec-${index}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 rounded-[12px] h-full transition-all"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(6,182,212,0.04), rgba(255,255,255,0.8))',
                                    border: '1px solid var(--dash-border-solid, #E8ECF4)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                                    e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = 'var(--dash-border-solid, #E8ECF4)';
                                }}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3
                                        className="font-semibold text-[14px] leading-snug flex-1"
                                        style={{ color: 'var(--dash-text)' }}
                                    >
                                        {rec.title}
                                    </h3>
                                    {rec.official_url && (
                                        <a
                                            href={rec.official_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 ml-2"
                                            style={{ color: '#06B6D4' }}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                {rec.category && (
                                    <span
                                        className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-2"
                                        style={{
                                            background: 'rgba(6,182,212,0.08)',
                                            color: '#0891B2',
                                            border: '1px solid rgba(6,182,212,0.15)',
                                        }}
                                    >
                                        {rec.category}
                                    </span>
                                )}
                                <p className="text-[13px] mt-1" style={{ color: 'var(--dash-text-secondary)' }}>
                                    {rec.reason}
                                </p>
                                {rec.funding && (
                                    <p className="text-[12px] mt-2" style={{ color: 'var(--dash-text-muted)' }}>
                                        💰 Funding: {rec.funding}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ================================================================= */}
            {/* SECTION 2: Stage-wise Roadmap (Visual Timeline)                   */}
            {/* ================================================================= */}
            {roadmap.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2
                        className="text-[18px] font-bold flex items-center gap-2 mb-1"
                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                    >
                        <ArrowRight className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                        Your Grant Application Roadmap
                    </h2>
                    <p className="text-[13px] mb-5" style={{ color: 'var(--dash-text-muted)' }}>
                        Follow this stage-wise journey to maximize your funding opportunities
                    </p>

                    <div className="relative">
                        {roadmap.map((stage, stageIdx) => {
                            const config = stageConfig[stage.stage] || fallbackConfigs[stageIdx % fallbackConfigs.length];
                            const isLast = stageIdx === roadmap.length - 1;

                            return (
                                <motion.div
                                    key={`stage-${stageIdx}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: stageIdx * 0.2 }}
                                    className="relative flex gap-4 md:gap-6 pb-8"
                                >
                                    {/* Timeline column */}
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ring-4 ring-white z-10`}>
                                            {config.icon}
                                        </div>
                                        {!isLast && (
                                            <div className={`w-0.5 flex-1 mt-2 bg-gradient-to-b ${config.lineColor} min-h-[40px]`} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-[15px]" style={{ color: config.textColor }}>
                                                {stage.stage}
                                            </h3>
                                            {!isLast && (
                                                <ArrowRight className="w-4 h-4 hidden sm:block" style={{ color: 'var(--dash-border-solid, #E8ECF4)' }} />
                                            )}
                                        </div>
                                        <p className="text-[13px] mb-3" style={{ color: 'var(--dash-text-secondary)' }}>
                                            {stage.description}
                                        </p>

                                        {/* Relevant grants for this stage */}
                                        {stage.grants && stage.grants.length > 0 && (
                                            <div className="mb-3">
                                                <p
                                                    className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                                                    style={{ color: 'var(--dash-text-muted)', letterSpacing: '0.06em' }}
                                                >
                                                    Relevant Grants
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {stage.grants.map((g, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                                                            style={{
                                                                background: config.badgeBg,
                                                                color: config.textColor,
                                                                border: `1px solid ${config.badgeBorder}`,
                                                            }}
                                                        >
                                                            {g}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Checklist */}
                                        {stage.checklist && stage.checklist.length > 0 && (
                                            <div
                                                className="rounded-[10px] p-3"
                                                style={{
                                                    background: 'rgba(0,0,0,0.015)',
                                                    border: '1px solid var(--dash-border-solid, #E8ECF4)',
                                                }}
                                            >
                                                <p
                                                    className="text-[11px] font-bold uppercase tracking-wider mb-2"
                                                    style={{ color: 'var(--dash-text-muted)', letterSpacing: '0.06em' }}
                                                >
                                                    Checklist
                                                </p>
                                                <div className="space-y-1.5">
                                                    {stage.checklist.map((item, i) => {
                                                        const key = `${stageIdx}-${i}`;
                                                        const done = completedSteps.has(key);
                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => toggleStep(key)}
                                                                className="flex items-start gap-2.5 w-full text-left group py-0.5 cursor-pointer"
                                                            >
                                                                {done ? (
                                                                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#22C55E' }} />
                                                                ) : (
                                                                    <Circle className="w-4 h-4 mt-0.5 shrink-0 transition-colors" style={{ color: 'var(--dash-border-solid, #E8ECF4)' }} />
                                                                )}
                                                                <span
                                                                    className="text-[13px] leading-snug"
                                                                    style={{
                                                                        color: done ? 'var(--dash-text-muted)' : 'var(--dash-text-secondary)',
                                                                        textDecoration: done ? 'line-through' : 'none',
                                                                    }}
                                                                >
                                                                    {item}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* ================================================================= */}
            {/* SECTION 3: Browse All Grants (Card Grid)                          */}
            {/* ================================================================= */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h2
                    className="text-[18px] font-bold flex items-center gap-2 mb-4"
                    style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                >
                    <Filter className="w-4 h-4" style={{ color: '#8B5CF6' }} />
                    Browse All Grants
                </h2>

                {/* Search */}
                <div className="mb-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--dash-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search grants by name, description, or sector..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] text-[13px] outline-none transition-all"
                            style={{
                                background: 'rgba(0,0,0,0.015)',
                                border: '1px solid var(--dash-border-solid, #E8ECF4)',
                                color: 'var(--dash-text)',
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.08)'; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--dash-border-solid, #E8ECF4)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                    </div>
                </div>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer"
                        style={{
                            background: activeCategory === 'all'
                                ? 'linear-gradient(135deg, #06B6D4, #0891B2)'
                                : 'rgba(0,0,0,0.02)',
                            color: activeCategory === 'all' ? '#fff' : 'var(--dash-text-secondary)',
                            border: activeCategory === 'all'
                                ? '1px solid transparent'
                                : '1px solid var(--dash-border-solid, #E8ECF4)',
                        }}
                    >
                        All ({grants.length})
                    </button>
                    {grantCategories.map((cat, idx) => (
                        <button
                            key={`cat-${idx}-${cat.label}`}
                            onClick={() => setActiveCategory(cat.label)}
                            className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer"
                            style={{
                                background: activeCategory === cat.label
                                    ? 'linear-gradient(135deg, #06B6D4, #0891B2)'
                                    : 'rgba(0,0,0,0.02)',
                                color: activeCategory === cat.label ? '#fff' : 'var(--dash-text-secondary)',
                                border: activeCategory === cat.label
                                    ? '1px solid transparent'
                                    : '1px solid var(--dash-border-solid, #E8ECF4)',
                            }}
                        >
                            {cat.label} ({cat.grants.length})
                        </button>
                    ))}
                </div>

                {/* Grant cards — responsive grid */}
                {filteredGrants.length === 0 ? (
                    <div
                        className="text-center py-8 rounded-[12px]"
                        style={{
                            background: 'rgba(0,0,0,0.015)',
                            border: '1px solid var(--dash-border-solid, #E8ECF4)',
                        }}
                    >
                        <p className="text-[14px]" style={{ color: 'var(--dash-text-muted)' }}>
                            No grants found matching your search.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {filteredGrants.slice(0, visibleCount).map((grant, index) => (
                                <motion.div
                                    key={`grant-${index}-${grant.title}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.01, 0.3) }}
                                >
                                    <GrantCard grant={grant} />
                                </motion.div>
                            ))}
                        </div>
                        {filteredGrants.length > visibleCount && (
                            <div className="flex justify-center pt-6">
                                <Button
                                    variant="secondary"
                                    onClick={() => setVisibleCount(prev => prev + 20)}
                                    className="px-8"
                                >
                                    Load More ({filteredGrants.length - visibleCount} remaining)
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}

// =============================================================================
// GRANT CARD — Small clickable card (design-system styled)
// =============================================================================

function GrantCard({ grant }: { grant: Grant }) {
    const category = getCategoryLabel(grant);
    const sector = getSectorLabel(grant);
    const url = grant.official_url || grant.applicationUrl;

    return (
        <div
            className={`h-full p-4 rounded-[12px] transition-all ${url ? 'cursor-pointer' : ''}`}
            style={{
                background: 'rgba(0,0,0,0.015)',
                border: '1px solid var(--dash-border-solid, #E8ECF4)',
            }}
            onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                if (url) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--dash-border-solid, #E8ECF4)';
            }}
        >
            <div className="flex items-start justify-between mb-2">
                <h3
                    className="font-semibold text-[14px] line-clamp-2 leading-snug flex-1"
                    style={{ color: 'var(--dash-text)' }}
                >
                    {grant.title || 'Untitled Grant'}
                </h3>
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 ml-2"
                        style={{ color: '#06B6D4' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
                <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                        background: 'rgba(6,182,212,0.08)',
                        color: '#0891B2',
                        border: '1px solid rgba(6,182,212,0.15)',
                    }}
                >
                    {category}
                </span>
                {sector !== 'Sector-Agnostic' && (
                    <span
                        className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                            background: 'rgba(0,0,0,0.03)',
                            color: 'var(--dash-text-muted)',
                            border: '1px solid var(--dash-border-solid, #E8ECF4)',
                        }}
                    >
                        {sector}
                    </span>
                )}
            </div>

            {grant.description && (
                <p className="text-[13px] line-clamp-3" style={{ color: 'var(--dash-text-secondary)' }}>
                    {grant.description}
                </p>
            )}

            {grant.funding && (
                <p className="text-[12px] mt-2" style={{ color: 'var(--dash-text-muted)' }}>
                    💰 Funding: ₹{grant.funding}
                </p>
            )}
        </div>
    );
}
