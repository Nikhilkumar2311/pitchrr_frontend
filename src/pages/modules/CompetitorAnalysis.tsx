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

import { useState, useEffect } from 'react';
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
    Plus,
    Coins,
    Trash2,
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Badge,
    Input,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { useIdeaStore } from '@/store';
import { CompetitorAnalysisSkeleton } from '@/components/skeletons/CompetitorAnalysisSkeleton';
import { CreditCost, SEO } from '@/components/common';
import {
    useIdeas,
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

interface UniqueAdvantage {
    id: string;
    feature: string;
    description: string;
}

const INITIAL_COMPETITOR_COUNT = 3;
const CREDITS_PER_LOAD = 5;

export default function CompetitorAnalysis() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // State for visible competitors
    const [visibleCount, setVisibleCount] = useState(INITIAL_COMPETITOR_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // State for unique advantages
    const [uniqueAdvantages, setUniqueAdvantages] = useState<UniqueAdvantage[]>([
        { id: '1', feature: 'AI-Powered Analysis', description: 'Competitors use manual processes' },
        { id: '2', feature: 'Real-time Updates', description: 'Others only update monthly' },
    ]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newAdvantage, setNewAdvantage] = useState({ feature: '', description: '' });

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    // Get active idea from store
    const { activeIdeaId: storedActiveIdeaId, _hasHydrated } = useIdeaStore();

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || (_hasHydrated ? storedActiveIdeaId : null) || ideas?.[0]?.id;

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
    const allCompetitors: Competitor[] = analysisData?.competitors || [];
    const competitors = allCompetitors.slice(0, visibleCount);
    const hasMoreCompetitors = allCompetitors.length > visibleCount;
    const remainingCount = allCompetitors.length - visibleCount;
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

    const handleAddAdvantage = () => {
        if (!newAdvantage.feature.trim()) return;
        const id = Date.now().toString();
        setUniqueAdvantages(prev => [...prev, { ...newAdvantage, id }]);
        setNewAdvantage({ feature: '', description: '' });
        toast.success('Advantage added!');
    };

    const handleDeleteAdvantage = (id: string) => {
        setUniqueAdvantages(prev => prev.filter(a => a.id !== id));
        toast.success('Advantage removed');
    };

    const handleEditAdvantage = (id: string, field: 'feature' | 'description', value: string) => {
        setUniqueAdvantages(prev =>
            prev.map(a => a.id === id ? { ...a, [field]: value } : a)
        );
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

            {/* Your Unique Advantages */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        What You Offer That Competitors Don't
                    </CardTitle>
                    <CardDescription>
                        Add your unique selling points that set you apart
                    </CardDescription>
                </CardHeader>
                <div className="mt-4 space-y-4">
                    {/* Existing Advantages */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 px-3 font-medium text-gray-700">Feature</th>
                                    <th className="text-left py-2 px-3 font-medium text-gray-700">Why Competitors Can't Match</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueAdvantages.map((advantage) => (
                                    <tr key={advantage.id} className="border-b border-gray-100 group">
                                        <td className="py-2 px-3">
                                            {editingId === advantage.id ? (
                                                <Input
                                                    value={advantage.feature}
                                                    onChange={(e) => handleEditAdvantage(advantage.id, 'feature', e.target.value)}
                                                    className="h-8"
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-pointer hover:text-blue-600"
                                                    onClick={() => setEditingId(advantage.id)}
                                                >
                                                    {advantage.feature}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-3">
                                            {editingId === advantage.id ? (
                                                <Input
                                                    value={advantage.description}
                                                    onChange={(e) => handleEditAdvantage(advantage.id, 'description', e.target.value)}
                                                    className="h-8"
                                                    onBlur={() => setEditingId(null)}
                                                />
                                            ) : (
                                                <span className="text-gray-600">{advantage.description}</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-3">
                                            <button
                                                onClick={() => handleDeleteAdvantage(advantage.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add New Advantage */}
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Feature</label>
                            <Input
                                placeholder="e.g., AI-powered insights"
                                value={newAdvantage.feature}
                                onChange={(e) => setNewAdvantage(prev => ({ ...prev, feature: e.target.value }))}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 mb-1 block">Description</label>
                            <Input
                                placeholder="Why competitors can't match this"
                                value={newAdvantage.description}
                                onChange={(e) => setNewAdvantage(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <Button
                            variant="secondary"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={handleAddAdvantage}
                            disabled={!newAdvantage.feature.trim()}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </Card>

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
