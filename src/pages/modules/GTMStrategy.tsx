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
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Textarea,
    Badge,
} from '@/components/ui';
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
import { downloadFile } from '@/utils';

export default function GTMStrategy() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    const [productDescription, setProductDescription] = useState('');

    // Get current idea from store for backward compatibility
    const { currentIdea, activeIdeaId: storedActiveIdeaId, setIdea } = useIdeaStore();
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
    } = useModuleData(activeIdeaId, 'gtm_strategy');

    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

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

    // Populate product description from idea (only when idea data actually changes)
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

    const handleGenerate = () => {
        if (!activeIdeaId) {
            toast.error('Please create an idea first');
            return;
        }
        generateModule('gtm_strategy');
    };

    // Export hooks
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
        if (!hasGenerated) {
            toast.error('Please generate strategy first');
            return;
        }
        exportModule({}, {
            onSuccess: (data) => setExportJobId(data.jobId),
        });
    };

    const handleSave = () => {
        toast.success('GTM strategy saved!');
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <GTMStrategySkeleton />;
    }

    return (
        <div className="space-y-6">
            <SEO
                title="Go-To-Market Strategy"
                description="Create a comprehensive launch strategy with AI. Get target user segments, pricing strategies, launch timelines, and growth tactics."
                canonical="/dashboard/gtm"
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Rocket className="w-7 h-7 text-[#EF4444]" />
                        GTM Strategy
                    </h1>
                    <p className="mt-1 text-gray-600">
                        How will this product launch and grow?
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
                        disabled={!hasGenerated || isExporting || !!exportJobId}
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

            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Describe Your Product</CardTitle>
                    <CardDescription>
                        Tell us about your product to generate a tailored GTM strategy
                    </CardDescription>
                </CardHeader>
                <Textarea
                    placeholder="Example: An AI-powered platform that helps first-time founders validate their startup ideas..."
                    rows={3}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="mt-4"
                />
                <Button
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    className="mt-4"
                    disabled={!activeIdeaId}
                >
                    <span className="flex items-center gap-2">
                        Generate GTM Strategy
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
            {isGenerating && (
                <Card className="bg-red-50 border-red-200">
                    <div className="flex items-center gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                        <div>
                            <h3 className="font-medium text-red-900">
                                Generating GTM Strategy...
                            </h3>
                            <p className="text-sm text-red-700">
                                This usually takes 30-60 seconds
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Results Grid - Always show with conditional content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Target Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#EF4444]" />
                            Target Users
                        </CardTitle>
                    </CardHeader>
                    <div className="mt-4 space-y-4">
                        {hasGenerated && strategy?.target_segments ? (
                            strategy.target_segments.map((segment: { name: string; description: string; priority: string }, i: number) => (
                                <div key={i} className="p-4 rounded-lg bg-gray-50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900">{segment.name}</span>
                                        <Badge variant={segment.priority === 'high' ? 'success' : 'default'}>
                                            {segment.priority}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">{segment.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Generate to see target users</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Pricing Strategy */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#EF4444]" />
                            Pricing Strategy
                        </CardTitle>
                    </CardHeader>
                    <div className="mt-4 p-4 rounded-lg bg-linear-to-r from-green-50 to-blue-50 border border-green-200">
                        {hasGenerated && strategy?.pricing_strategy ? (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Pricing Model</span>
                                    <Badge variant="success" size="md">
                                        {strategy.pricing_strategy.model?.toUpperCase() || 'FREEMIUM'}
                                    </Badge>
                                </div>
                                <p className="text-gray-700">{strategy.pricing_strategy.description}</p>
                                {strategy.pricing_strategy.tiers && (
                                    <div className="mt-3 space-y-2">
                                        {strategy.pricing_strategy.tiers.map((tier: { name: string; price: string }, i: number) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-gray-600">{tier.name}</span>
                                                <span className="font-medium">{tier.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-4 text-gray-400">
                                <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Generate to see pricing strategy</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Launch Plan */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#EF4444]" />
                            Launch Plan Timeline
                        </CardTitle>
                    </CardHeader>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {hasGenerated && strategy?.launch_plan ? (
                            strategy.launch_plan.map((phase: { phase: string; timeline: string; activities: string[] }, i: number) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-lg bg-gray-50 border-l-4"
                                    style={{ borderLeftColor: '#EF4444' }}
                                >
                                    <div className="font-medium text-gray-900">{phase.phase}</div>
                                    <div className="text-sm text-gray-500 mb-2">{phase.timeline}</div>
                                    <ul className="space-y-1">
                                        {phase.activities?.map((task: string, j: number) => (
                                            <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                                                {task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-400">
                                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Generate to see launch timeline</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Growth Strategies */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#EF4444]" />
                            Growth Strategies
                        </CardTitle>
                    </CardHeader>
                    <div className="mt-4 space-y-2">
                        {hasGenerated && strategy?.growth_strategies ? (
                            strategy.growth_strategies.map((item: { strategy: string; description: string }, i: number) => (
                                <div key={i} className="p-3 rounded-lg bg-gray-50">
                                    <div className="font-medium text-gray-900">{item.strategy}</div>
                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Generate to see growth strategies</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Key Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#EF4444]" />
                            Key Metrics (KPIs)
                        </CardTitle>
                    </CardHeader>
                    <div className="mt-4 space-y-3">
                        {hasGenerated && strategy?.kpis ? (
                            <>
                                {strategy.kpis.map((kpi: { metric: string; target: string; timeframe: string }, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                                        <span className="text-gray-700">{kpi.metric}</span>
                                        <Badge variant="default">{kpi.target}</Badge>
                                    </div>
                                ))}
                                <p className="mt-4 text-sm text-gray-500">
                                    Track these metrics from day one to measure growth and make data-driven decisions.
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Generate to see key metrics</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
