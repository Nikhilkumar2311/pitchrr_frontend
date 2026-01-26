/**
 * Module 6: Competitor Analysis Page
 * 
 * Helps founders understand their competitive landscape.
 * 
 * FEATURES:
 * - Competitor list (initially 3, load more with credits)
 * - Feature comparison table
 * - Competitor SWOT (strengths & weaknesses)
 * - "What You Offer" editable table
 * 
 * DATA FLOW:
 * - Fetches idea from Core Service
 * - Generates competitor analysis via AI
 * - React Query polls for results
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Save,
    Download,
    Sparkles,
    Loader2,
    Coins,
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Badge,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore, getStoredActiveIdeaId } from '@/store';
import { CompetitorAnalysisSkeleton } from '@/components/skeletons/CompetitorAnalysisSkeleton';
import { CreditCost, SEO } from '@/components/common';
import {
    useIdeas,
    useIdea,
    useModuleData,
    useGenerateModule,
    useExportModule,
    useExportStatus,
} from '@/hooks';
import { downloadFile } from '@/utils';

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

    // State for visible competitors
    const [visibleCount, setVisibleCount] = useState(INITIAL_COMPETITOR_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    // Get active idea from store (also sync read from localStorage on initial mount)
    const { activeIdeaId: storedActiveIdeaId, setIdea } = useIdeaStore();
    // Read from localStorage directly on initial render to avoid async hydration delay
    const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    // Priority: URL param > zustand store > localStorage sync read > first idea
    const activeIdeaId = urlIdeaId || storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;

    const { data: idea } = useIdea(activeIdeaId);


    const { data: moduleData } = useModuleData(activeIdeaId, 'competitor_analysis');


    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasAnalyzed = moduleData?.exists && moduleData.data;
    const analysisData = moduleData?.data || null;
    const allCompetitors: Competitor[] = analysisData?.competitors || [];
    const competitors = allCompetitors.slice(0, visibleCount);
    const hasMoreCompetitors = allCompetitors.length > visibleCount;
    const remainingCount = allCompetitors.length - visibleCount;
    const isLoading = isLoadingIdeas;
    // Use status from backend to detect pending state (survives page refresh)
    const isAnalyzing = isTriggering || moduleData?.status === 'IN_PROGRESS';

    // Sync activeIdeaId in store when idea changes to keep persistence across modules
    useEffect(() => {
        if (idea && activeIdeaId && activeIdeaId !== storedActiveIdeaId) {
            setIdea({
                id: idea.id,
                title: idea.title,
                description: idea.description,
                problem: idea.problemSolved || undefined,
                targetMarket: idea.targetAudience || undefined,
                industry: idea.industry || undefined,
            });
        }
    }, [idea, activeIdeaId, storedActiveIdeaId, setIdea]);

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    const handleAnalyze = () => {
        if (!activeIdeaId) {
            toast.error('Please create an idea first');
            return;
        }
        generateModule('competitor_analysis');
    };

    // Export hooks
    const { mutate: exportModule, isPending: isExporting } = useExportModule('competitor-analysis', activeIdeaId);
    const [exportJobId, setExportJobId] = useState<string | null>(null);
    const { data: exportStatus } = useExportStatus(exportJobId);

    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
            const filename = 'competitor_analysis.pdf';
            downloadFile(exportStatus.downloadUrl, filename)
                .then(() => toast.success('PDF downloaded!'))
                .catch(() => toast.error('Download failed'));
            setExportJobId(null);
        } else if (exportStatus?.state === 'failed') {
            toast.error('Export failed: ' + (exportStatus.failedReason || 'Unknown error'));
            setExportJobId(null);
        }
    }, [exportStatus]);

    const exportToPDF = () => {
        if (!hasAnalyzed) {
            toast.error('Please analyze competitors first');
            return;
        }
        exportModule({}, {
            onSuccess: (data) => setExportJobId(data.jobId),
        });
    };

    const handleSave = () => {
        toast.success('Competitor analysis saved!');
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        // Simulate credit deduction - this would call the API in production
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVisibleCount(prev => prev + 3);
        toast.success(`Loaded more competitors! (${CREDITS_PER_LOAD} credits used)`);
        setIsLoadingMore(false);
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <CompetitorAnalysisSkeleton />;
    }

    return (
        <div className="space-y-6">
            <SEO
                title="Competitor Analysis"
                description="Analyze your competitive landscape with AI. Discover competitors, compare features, find market gaps, and identify your unique advantages."
                canonical="/dashboard/competitors"
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-7 h-7 text-[#06B6D4]" />
                        Competitor Analysis
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Understand where your idea stands in the market
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
                        disabled={!hasAnalyzed || isExporting || !!exportJobId}
                        isLoading={isExporting || !!exportJobId}
                        onClick={exportToPDF}
                    >
                        <span className="flex items-center gap-2">
                            {exportJobId ? 'Exporting...' : 'Export PDF'}
                            {!exportJobId && <CreditCost cost={2} />}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Generate Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Analyze Competitors</CardTitle>
                    <CardDescription>
                        Let AI research and analyze your competitive landscape
                    </CardDescription>
                </CardHeader>
                <Button
                    onClick={handleAnalyze}
                    isLoading={isAnalyzing}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    className="mt-4"
                    disabled={!activeIdeaId}
                >
                    <span className="flex items-center gap-2">
                        {hasAnalyzed ? 'Re-analyze with AI' : 'Analyze with AI'}
                        <CreditCost cost={15} />
                    </span>
                </Button>
                {!activeIdeaId && (
                    <p className="text-sm text-gray-500 mt-2">
                        Please create an idea in Idea Validation first
                    </p>
                )}
            </Card>

            {/* Generating State */}
            {isAnalyzing && (
                <Card className="bg-cyan-50 border-cyan-200">
                    <div className="flex items-center gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                        <div>
                            <h3 className="font-medium text-cyan-900">
                                Analyzing Competitors...
                            </h3>
                            <p className="text-sm text-cyan-700">
                                Researching your market. This usually takes 30-60 seconds.
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Competitor Cards */}
            {competitors.length > 0 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {competitors.map((competitor, index) => (
                            <motion.div
                                key={competitor.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="relative h-full">
                                    <CardHeader>
                                        <CardTitle>{competitor.name}</CardTitle>
                                        <CardDescription>{competitor.website || competitor.description}</CardDescription>
                                    </CardHeader>

                                    <div className="mt-4 space-y-3">
                                        {competitor.pricing && (
                                            <div className="text-sm">
                                                <span className="text-gray-500">Pricing: </span>
                                                <span className="font-medium">{competitor.pricing}</span>
                                            </div>
                                        )}

                                        <div>
                                            <div className="text-sm font-medium text-green-700 mb-1">Strengths</div>
                                            <div className="flex flex-wrap gap-1">
                                                {competitor.strengths?.map((s, i) => (
                                                    <Badge key={i} variant="success" size="sm">{s}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium text-red-700 mb-1">Weaknesses</div>
                                            <div className="flex flex-wrap gap-1">
                                                {competitor.weaknesses?.map((w, i) => (
                                                    <Badge key={i} variant="danger" size="sm">{w}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMoreCompetitors && (
                        <div className="flex justify-center">
                            <Button
                                variant="secondary"
                                onClick={handleLoadMore}
                                isLoading={isLoadingMore}
                                leftIcon={<Coins className="w-4 h-4" />}
                            >
                                Load {Math.min(remainingCount, 3)} More ({CREDITS_PER_LOAD} credits)
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Market Overview */}
            {hasAnalyzed && analysisData?.market_overview && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Market Overview</CardTitle>
                            <CardDescription>
                                The competitive landscape for your startup
                            </CardDescription>
                        </CardHeader>
                        <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200">
                            <p className="text-gray-700">{analysisData.market_overview}</p>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Competitive Advantages & Market Gaps */}
            {hasAnalyzed && (analysisData?.competitive_advantages || analysisData?.gaps_in_market) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Competitive Positioning</CardTitle>
                            <CardDescription>
                                How your startup differentiates from competitors
                            </CardDescription>
                        </CardHeader>
                        <div className="mt-4 space-y-4">
                            {analysisData.competitive_advantages && analysisData.competitive_advantages.length > 0 && (
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                    <div className="font-medium text-green-800 mb-2">Your Competitive Advantages</div>
                                    <ul className="space-y-1">
                                        {analysisData.competitive_advantages.map((adv: string, i: number) => (
                                            <li key={i} className="text-sm text-green-700">• {adv}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {analysisData.gaps_in_market && analysisData.gaps_in_market.length > 0 && (
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <div className="font-medium text-blue-800 mb-2">Market Gaps & Opportunities</div>
                                    <ul className="space-y-1">
                                        {analysisData.gaps_in_market.map((gap: string, i: number) => (
                                            <li key={i} className="text-sm text-blue-700">• {gap}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Strategic Recommendations */}
            {hasAnalyzed && analysisData?.positioning_recommendations && analysisData.positioning_recommendations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Strategic Recommendations</CardTitle>
                            <CardDescription>
                                How to position against competitors
                            </CardDescription>
                        </CardHeader>
                        <ul className="mt-4 space-y-2">
                            {analysisData.positioning_recommendations.map((rec: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg">
                                    <span className="shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-cyan-800">{rec}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
