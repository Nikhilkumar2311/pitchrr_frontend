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

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Megaphone,
    Save,
    Download,
    Sparkles,
    Calendar,
    Users,
    Target,
    Zap,
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
import { useIdeaStore } from '@/store';
import { MarketingStrategySkeleton } from '@/components/skeletons/MarketingStrategySkeleton';
import {
    useIdea,
    useIdeas,
    useModuleData,
    useGenerateModule,
} from '@/hooks';

export default function MarketingStrategy() {
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // Form state
    const [targetAudience, setTargetAudience] = useState('');

    // Get current idea from store for backward compatibility
    const { currentIdea } = useIdeaStore();

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();
    const activeIdeaId = urlIdeaId || ideas?.[0]?.id;

    const { data: idea, isLoading: isLoadingIdea } = useIdea(activeIdeaId);

    const {
        data: moduleData,
        isFetching: isPolling,
    } = useModuleData(activeIdeaId, 'marketing_strategy');

    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasGenerated = moduleData?.exists && moduleData.data;
    const strategy = moduleData?.data || null;
    const isLoading = isLoadingIdeas || isLoadingIdea;
    const isGenerating = isTriggering || (isPolling && !hasGenerated);

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    // Populate target audience from idea
    useEffect(() => {
        if (idea?.targetAudience) {
            setTargetAudience(idea.targetAudience);
        } else if (currentIdea?.targetMarket) {
            setTargetAudience(currentIdea.targetMarket);
        }
    }, [idea, currentIdea]);

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

    const handleSave = () => {
        toast.success('Marketing strategy saved!');
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (isLoading) {
        return <MarketingStrategySkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Megaphone className="w-7 h-7 text-[#10B981]" />
                        Marketing Strategy
                    </h1>
                    <p className="mt-1 text-gray-600">
                        How will users find and adopt this product?
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
                        disabled={!hasGenerated}
                    >
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Input Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Who is your target audience?</CardTitle>
                    <CardDescription>
                        Describe your ideal customer to generate a personalized marketing strategy
                    </CardDescription>
                </CardHeader>
                <Textarea
                    placeholder="Example: First-time founders aged 25-40 who have a startup idea but don't know how to validate it or create a pitch deck..."
                    rows={3}
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="mt-4"
                />
                <div className="mt-4">
                    <Button
                        onClick={handleGenerate}
                        isLoading={isGenerating}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                        disabled={!activeIdeaId}
                    >
                        Generate Marketing Strategy
                    </Button>
                    {!activeIdeaId && (
                        <p className="text-sm text-gray-500 mt-2">
                            Please create an idea in Idea Validation first
                        </p>
                    )}
                </div>
            </Card>

            {/* Generating State */}
            {isGenerating && (
                <Card className="bg-green-50 border-green-200">
                    <div className="flex items-center gap-4">
                        <Loader2 className="w-6 h-6 animate-spin text-green-500" />
                        <div>
                            <h3 className="font-medium text-green-900">
                                Generating Marketing Strategy...
                            </h3>
                            <p className="text-sm text-green-700">
                                This usually takes 30-60 seconds
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            {hasGenerated && strategy && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 30-Day Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#10B981]" />
                                    30-Day Marketing Plan
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 space-y-4">
                                {strategy.timeline?.map((phase: { phase: string; activities: string[] }, i: number) => (
                                    <div key={i} className="p-4 rounded-lg bg-gray-50">
                                        <div className="font-medium text-gray-900 mb-2">
                                            {phase.phase}
                                        </div>
                                        <ul className="space-y-1.5">
                                            {phase.activities?.map((task: string, j: number) => (
                                                <li key={j} className="text-sm text-gray-600 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Target Segments */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#10B981]" />
                                    Target Segments
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 space-y-4">
                                {strategy.target_segments?.map((segment: { name: string; description: string; size: string }, i: number) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-lg bg-gray-50"
                                    >
                                        <div className="font-medium text-gray-900">{segment.name}</div>
                                        <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
                                        {segment.size && (
                                            <Badge variant="primary" className="mt-2">{segment.size}</Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Channels */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-[#10B981]" />
                                    Marketing Channels
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 space-y-3">
                                {strategy.channels?.map((channel: { name: string; priority: string; tactics: string[] }, i: number) => (
                                    <div key={i} className="p-4 rounded-lg bg-gray-50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900">{channel.name}</span>
                                            <Badge variant={channel.priority === 'high' ? 'success' : 'default'}>
                                                {channel.priority}
                                            </Badge>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {channel.tactics?.map((tactic: string, j: number) => (
                                                <Badge key={j} variant="default">{tactic}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Messaging Framework */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[#10B981]" />
                                    Messaging Framework
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 space-y-4">
                                {strategy.messaging_framework && (
                                    <>
                                        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                            <div className="text-sm font-medium text-green-800 mb-1">Value Proposition</div>
                                            <p className="text-green-700">{strategy.messaging_framework.value_proposition}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                            <div className="text-sm font-medium text-blue-800 mb-1">Key Messages</div>
                                            <ul className="space-y-1">
                                                {strategy.messaging_framework.key_messages?.map((msg: string, i: number) => (
                                                    <li key={i} className="text-sm text-blue-700">• {msg}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* KPIs */}
                    {strategy.kpis && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-2"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Performance Indicators</CardTitle>
                                </CardHeader>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {strategy.kpis.map((kpi: string, i: number) => (
                                        <Badge key={i} variant="default" size="md">{kpi}</Badge>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
