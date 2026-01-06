/**
 * Module 6: Competitor Analysis Page
 * 
 * Helps founders understand their competitive landscape.
 * 
 * FEATURES:
 * - Competitor list
 * - Feature comparison table
 * - Competitor SWOT (strengths & weaknesses)
 * - Pricing comparison
 * 
 * DATA FLOW:
 * - Fetches idea from Core Service
 * - Generates competitor analysis via AI
 * - React Query polls for results
 */

import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    Save,
    Download,
    Sparkles,
    Check,
    X,
    Loader2,
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
import { CompetitorAnalysisSkeleton } from '@/components/skeletons/CompetitorAnalysisSkeleton';
import {
    useIdeas,
    useModuleData,
    useGenerateModule,
} from '@/hooks';

interface Competitor {
    name: string;
    website?: string;
    pricing?: string;
    description?: string;
    strengths: string[];
    weaknesses: string[];
}

export default function CompetitorAnalysis() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();
    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || ideas?.[0]?.id;

    const {
        data: moduleData,
        isFetching: isPolling,
    } = useModuleData(activeIdeaId, 'competitor_analysis');

    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasAnalyzed = moduleData?.exists && moduleData.data;
    const analysisData = moduleData?.data || null;
    const competitors: Competitor[] = analysisData?.competitors || [];
    const isLoading = isLoadingIdeas;
    const isAnalyzing = isTriggering || (isPolling && !hasAnalyzed);

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

    const handleSave = () => {
        toast.success('Competitor analysis saved!');
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <CompetitorAnalysisSkeleton />;
    }

    return (
        <div className="space-y-6">
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
                        disabled={!hasAnalyzed}
                    >
                        Export PDF
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
                    {hasAnalyzed ? 'Re-analyze with AI' : 'Analyze with AI'}
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
            )}

            {/* Competitive Positioning */}
            {hasAnalyzed && analysisData?.positioning && (
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
                            {analysisData.positioning.unique_value && (
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                    <div className="font-medium text-green-800 mb-2">Your Unique Value</div>
                                    <p className="text-green-700">{analysisData.positioning.unique_value}</p>
                                </div>
                            )}
                            {analysisData.positioning.gaps && (
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <div className="font-medium text-blue-800 mb-2">Market Gaps</div>
                                    <ul className="space-y-1">
                                        {analysisData.positioning.gaps.map((gap: string, i: number) => (
                                            <li key={i} className="text-sm text-blue-700">• {gap}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Feature Comparison Table */}
            {hasAnalyzed && analysisData?.feature_comparison && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Feature Comparison</CardTitle>
                            <CardDescription>
                                How your startup compares to competitors
                            </CardDescription>
                        </CardHeader>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">
                                            Feature
                                        </th>
                                        <th className="text-center py-3 px-4 font-medium text-blue-600">
                                            Your Startup
                                        </th>
                                        {competitors.slice(0, 3).map((c) => (
                                            <th key={c.name} className="text-center py-3 px-4 font-medium text-gray-700">
                                                {c.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {analysisData.feature_comparison.map((feature: { feature: string; your_startup: boolean; competitors: Record<string, boolean> }, i: number) => (
                                        <tr
                                            key={feature.feature}
                                            className={i % 2 === 0 ? 'bg-gray-50' : ''}
                                        >
                                            <td className="py-3 px-4 text-gray-900">
                                                {feature.feature}
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                {feature.your_startup ? (
                                                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <X className="w-5 h-5 text-red-400 mx-auto" />
                                                )}
                                            </td>
                                            {competitors.slice(0, 3).map((c) => (
                                                <td key={c.name} className="text-center py-3 px-4">
                                                    {feature.competitors[c.name] ? (
                                                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-red-400 mx-auto" />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Recommendations */}
            {hasAnalyzed && analysisData?.recommendations && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Strategic Recommendations</CardTitle>
                        </CardHeader>
                        <ul className="mt-4 space-y-2">
                            {analysisData.recommendations.map((rec: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-cyan-50 rounded-lg">
                                    <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
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
