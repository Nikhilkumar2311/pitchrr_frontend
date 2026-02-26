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
import {
    Card,
    CardHeader,
    CardTitle,
    Button,
    Badge,
} from '@/components/ui';
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
        textColor: string;
    }> = {
        // --- Idea / Pre-Seed (warm slate-blue) ---
        'Idea': {
            icon: <Lightbulb className="w-5 h-5 text-white" />,
            gradient: 'from-sky-500 to-blue-600',
            dotColor: 'bg-sky-600',
            lineColor: 'from-sky-500 to-teal-500',
            badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
            textColor: 'text-sky-700',
        },
        'Idea Stage': {
            icon: <Lightbulb className="w-5 h-5 text-white" />,
            gradient: 'from-sky-500 to-blue-600',
            dotColor: 'bg-sky-600',
            lineColor: 'from-sky-500 to-teal-500',
            badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
            textColor: 'text-sky-700',
        },
        'Pre-Seed': {
            icon: <Lightbulb className="w-5 h-5 text-white" />,
            gradient: 'from-blue-500 to-cyan-600',
            dotColor: 'bg-blue-600',
            lineColor: 'from-blue-500 to-teal-500',
            badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
            textColor: 'text-blue-700',
        },
        // --- Proof of Concept / Prototype (teal) ---
        'Proof of Concept': {
            icon: <Star className="w-5 h-5 text-white" />,
            gradient: 'from-teal-500 to-emerald-600',
            dotColor: 'bg-teal-600',
            lineColor: 'from-teal-500 to-emerald-500',
            badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
            textColor: 'text-teal-700',
        },
        'Prototype': {
            icon: <Star className="w-5 h-5 text-white" />,
            gradient: 'from-emerald-500 to-teal-600',
            dotColor: 'bg-emerald-600',
            lineColor: 'from-emerald-500 to-cyan-500',
            badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            textColor: 'text-emerald-700',
        },
        // --- Seed / Early Stage (green) ---
        'Seed': {
            icon: <Sprout className="w-5 h-5 text-white" />,
            gradient: 'from-emerald-500 to-green-600',
            dotColor: 'bg-emerald-600',
            lineColor: 'from-emerald-500 to-indigo-500',
            badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            textColor: 'text-emerald-700',
        },
        'Seed Stage': {
            icon: <Sprout className="w-5 h-5 text-white" />,
            gradient: 'from-emerald-500 to-green-600',
            dotColor: 'bg-emerald-600',
            lineColor: 'from-emerald-500 to-indigo-500',
            badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            textColor: 'text-emerald-700',
        },
        'Early Stage': {
            icon: <Sprout className="w-5 h-5 text-white" />,
            gradient: 'from-cyan-500 to-teal-600',
            dotColor: 'bg-cyan-600',
            lineColor: 'from-cyan-500 to-indigo-500',
            badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
            textColor: 'text-cyan-700',
        },
        // --- Growth (indigo) ---
        'Growth': {
            icon: <Rocket className="w-5 h-5 text-white" />,
            gradient: 'from-indigo-500 to-blue-700',
            dotColor: 'bg-indigo-600',
            lineColor: 'from-indigo-500 to-slate-500',
            badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            textColor: 'text-indigo-700',
        },
        'Growth Stage': {
            icon: <Rocket className="w-5 h-5 text-white" />,
            gradient: 'from-indigo-500 to-blue-700',
            dotColor: 'bg-indigo-600',
            lineColor: 'from-indigo-500 to-slate-500',
            badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            textColor: 'text-indigo-700',
        },
        // --- Scale-up (deep violet) ---
        'Scale-up': {
            icon: <Rocket className="w-5 h-5 text-white" />,
            gradient: 'from-violet-600 to-indigo-700',
            dotColor: 'bg-violet-600',
            lineColor: 'from-violet-600 to-slate-600',
            badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
            textColor: 'text-violet-700',
        },
        // --- Established (slate/charcoal — mature, premium feel) ---
        'Established': {
            icon: <Star className="w-5 h-5 text-white" />,
            gradient: 'from-slate-600 to-gray-800',
            dotColor: 'bg-slate-700',
            lineColor: 'from-slate-600 to-gray-600',
            badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
            textColor: 'text-slate-700',
        },
    };

    // Fallback colors by index for any unrecognized stage names
    const fallbackConfigs = [
        {
            icon: <Lightbulb className="w-5 h-5 text-white" />,
            gradient: 'from-sky-500 to-blue-600', dotColor: 'bg-sky-600', lineColor: 'from-sky-500 to-teal-500',
            badgeBg: 'bg-sky-50 text-sky-700 border-sky-200', textColor: 'text-sky-700',
        },
        {
            icon: <Sprout className="w-5 h-5 text-white" />,
            gradient: 'from-emerald-500 to-green-600', dotColor: 'bg-emerald-600', lineColor: 'from-emerald-500 to-indigo-500',
            badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', textColor: 'text-emerald-700',
        },
        {
            icon: <Rocket className="w-5 h-5 text-white" />,
            gradient: 'from-indigo-500 to-blue-700', dotColor: 'bg-indigo-600', lineColor: 'from-indigo-500 to-slate-500',
            badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200', textColor: 'text-indigo-700',
        },
    ];

    // =========================================================================
    // RENDER
    // =========================================================================

    if (isLoadingIdeas) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl" />
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
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <HandCoins className="w-7 h-7 text-[#06B6D4]" />
                        Grants & Funding
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Discover grants, schemes, and funding opportunities for your startup
                    </p>
                </div>
                <Button
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    disabled={!activeIdeaId}
                >
                    <span className="flex items-center gap-2">
                        {hasGenerated ? 'Refresh Recommendations' : 'Get Recommendations'}
                        <CreditCost cost={10} />
                    </span>
                </Button>
            </div>

            {/* No idea state */}
            {!activeIdeaId && (
                <Card className="bg-gray-50 border-dashed border-2">
                    <div className="text-center py-8">
                        <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="font-medium text-gray-700">Create an idea first</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Go to Idea Validation to submit your startup idea, then come back for personalized recommendations.
                        </p>
                    </div>
                </Card>
            )}

            {/* Generating State */}
            {isGenerating && (
                <Card className="bg-cyan-50 border-cyan-200">
                    <div className="flex items-center gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                        <div>
                            <h3 className="font-medium text-cyan-900">
                                Finding the best grants for you...
                            </h3>
                            <p className="text-sm text-cyan-700">
                                Analyzing your startup profile against for best grants. This usually takes 30-60 seconds.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* ================================================================= */}
            {/* SECTION 1: Recommended for your Startup                           */}
            {/* ================================================================= */}
            {recommendations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            Recommended for your Startup
                        </h2>
                        <p className="text-sm text-gray-500">
                            Handpicked based on your startup's industry, stage, and profile
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map((rec, index) => (
                            <motion.div
                                key={`rec-${index}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full bg-gradient-to-br from-cyan-50 to-white border-cyan-200 hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-base">{rec.title}</CardTitle>
                                            {rec.official_url && (
                                                <a
                                                    href={rec.official_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-cyan-600 hover:text-cyan-800 shrink-0"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                        {rec.category && (
                                            <Badge variant="primary" size="sm">{rec.category}</Badge>
                                        )}
                                    </CardHeader>
                                    <p className="text-sm text-gray-600 mt-2">{rec.reason}</p>
                                    {rec.funding && (
                                        <p className="text-xs text-gray-500 mt-2">
                                            💰 Funding: {rec.funding}
                                        </p>
                                    )}
                                </Card>
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
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Your Grant Application Roadmap
                        </h2>
                        <p className="text-sm text-gray-500">
                            Follow this stage-wise journey to maximize your funding opportunities
                        </p>
                    </div>

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
                                        {/* Stage icon circle */}
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ring-4 ring-white z-10`}>
                                            {config.icon}
                                        </div>
                                        {/* Connector line */}
                                        {!isLast && (
                                            <div className={`w-0.5 flex-1 mt-2 bg-gradient-to-b ${config.lineColor} min-h-[40px]`} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className={`font-bold text-base ${config.textColor}`}>
                                                {stage.stage}
                                            </h3>
                                            {!isLast && (
                                                <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{stage.description}</p>

                                        {/* Recommended grants for this stage */}
                                        {stage.grants && stage.grants.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                                    Relevant Grants
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {stage.grants.map((g, i) => (
                                                        <span
                                                            key={i}
                                                            className={`text-xs px-2.5 py-1 rounded-full border ${config.badgeBg}`}
                                                        >
                                                            {g}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Checklist */}
                                        {stage.checklist && stage.checklist.length > 0 && (
                                            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                                                                className="flex items-start gap-2.5 w-full text-left group py-0.5"
                                                            >
                                                                {done ? (
                                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                                                ) : (
                                                                    <Circle className="w-4 h-4 text-gray-300 mt-0.5 shrink-0 group-hover:text-gray-500 transition-colors" />
                                                                )}
                                                                <span className={`text-sm leading-snug ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
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
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        Browse All Grants
                    </h2>
                </div>

                {/* Search */}
                <div className="mb-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search grants by name, description, or sector..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                        />
                    </div>
                </div>

                {/* Category pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                            ${activeCategory === 'all'
                                ? 'bg-cyan-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All ({grants.length})
                    </button>
                    {grantCategories.map((cat, idx) => (
                        <button
                            key={`cat-${idx}-${cat.label}`}
                            onClick={() => setActiveCategory(cat.label)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                                ${activeCategory === cat.label
                                    ? 'bg-cyan-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat.label} ({cat.grants.length})
                        </button>
                    ))}
                </div>

                {/* Grant cards — responsive grid */}
                {filteredGrants.length === 0 ? (
                    <Card className="bg-gray-50 text-center py-8">
                        <p className="text-gray-500">No grants found matching your search.</p>
                    </Card>
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
// GRANT CARD — Small clickable card
// =============================================================================

function GrantCard({ grant }: { grant: Grant }) {
    const category = getCategoryLabel(grant);
    const sector = getSectorLabel(grant);
    const url = grant.official_url || grant.applicationUrl;

    return (
        <Card
            className={`h-full border-gray-200 hover:shadow-md transition-shadow
                ${url ? 'cursor-pointer hover:border-cyan-300' : ''}`}
            onClick={() => url && window.open(url, '_blank', 'noopener,noreferrer')}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">
                        {grant.title || 'Untitled Grant'}
                    </CardTitle>
                    {url && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 hover:text-cyan-800 shrink-0"
                            onClick={e => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                    <Badge variant="primary" size="sm">{category}</Badge>
                    {sector !== 'Sector-Agnostic' && (
                        <Badge variant="default" size="sm">{sector}</Badge>
                    )}
                </div>
            </CardHeader>

            {grant.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{grant.description}</p>
            )}

            {grant.funding && (
                <p className="text-xs text-gray-500 mt-2">
                    💰 Funding: ₹{grant.funding}
                </p>
            )}
        </Card>
    );
}
