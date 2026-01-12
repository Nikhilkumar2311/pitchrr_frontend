/**
 * Module 1: Idea Validation Page
 * 
 * This module helps founders validate their startup idea.
 * 
 * FEATURES:
 * - Idea summary input
 * - AI-generated viability score (0-100)
 * - Risk heat map (market, execution, competition, tech)
 * - SWOT analysis (Strengths & Weaknesses only for Phase 1)
 * - Market demand snapshot
 * 
 * DATA FLOW:
 * - User enters idea → saved to Core Service
 * - User triggers AI analysis → Core queues job → AI generates
 * - React Query polls for results → displays when ready
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Lightbulb,
    Save,
    Download,
    Sparkles,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    TrendingDown,
    Minus,
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
import { IdeaValidationSkeleton } from '@/components/skeletons/IdeaValidationSkeleton';
import { CreditCost, SEO } from '@/components/common';
import {
    useIdea,
    useIdeas,
    useCreateIdea,
    useUpdateIdea,
    useModuleData,
    useGenerateModule,
    useExportModule,
    useExportStatus,
} from '@/hooks';
import { downloadFile } from '@/utils';
import api from '@/services/api';

/**
 * Risk level type
 */
type RiskLevel = 'low' | 'medium' | 'high';

/**
 * Get badge variant for risk level
 */
const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
        case 'low': return 'success' as const;
        case 'medium': return 'warning' as const;
        case 'high': return 'danger' as const;
    }
};

export default function IdeaValidation() {
    const navigate = useNavigate();

    // Get ideaId from URL if present (e.g., /dashboard/idea/:ideaId)
    // If no ideaId, we'll use the first idea from the list or create a new one
    const { ideaId: urlIdeaId } = useParams<{ ideaId?: string }>();

    // Form state
    const [ideaSummary, setIdeaSummary] = useState('');
    const [ideaTitle, setIdeaTitle] = useState('');

    // Get global idea from store (for backward compatibility with Generate Idea flow)
    const { currentIdea, setIdea, updateIdea: updateStoreIdea } = useIdeaStore();

    // ==========================================================================
    // API HOOKS
    // ==========================================================================

    // Fetch all ideas to get the current one if no URL param
    const { data: ideas, isLoading: isLoadingIdeas } = useIdeas();

    // Determine which idea to use
    const activeIdeaId = urlIdeaId || ideas?.[0]?.id;

    // Fetch the active idea
    const { data: idea, isLoading: isLoadingIdea } = useIdea(activeIdeaId);

    // Create new idea
    const { mutate: createIdea, isPending: isCreating } = useCreateIdea();

    // Update existing idea
    const { mutate: updateIdea, isPending: isUpdating } = useUpdateIdea(activeIdeaId || '');

    // Fetch module data (with automatic polling while generating)
    const {
        data: moduleData,
    } = useModuleData(activeIdeaId, 'idea_validation');

    // Generate module (trigger AI analysis)
    const { mutate: generateModule, isPending: isTriggering } = useGenerateModule(activeIdeaId || '');

    // ==========================================================================
    // DERIVED STATE
    // ==========================================================================

    const hasAnalysis = moduleData?.exists && moduleData.data;
    const analysis = moduleData?.data || null;
    const isSaving = isCreating || isUpdating;
    const isLoading = isLoadingIdeas || isLoadingIdea;
    // Use status from backend to detect pending state (survives page refresh)
    const isAnalyzing = isTriggering || moduleData?.status === 'IN_PROGRESS';

    // ==========================================================================
    // EFFECTS
    // ==========================================================================

    // Track the last known idea data to detect when NEW data arrives
    const [lastIdeaKey, setLastIdeaKey] = useState<string | null>(null);

    // Populate form when idea is loaded from API (only when idea data actually changes)
    useEffect(() => {
        // Create a unique key from the idea data
        const currentIdeaKey = idea ? `${idea.id}-${idea.title}-${idea.description}` : null;

        // Only update form if this is a NEW idea or the idea data actually changed
        if (idea && currentIdeaKey !== lastIdeaKey) {
            setIdeaTitle(idea.title);
            setIdeaSummary(idea.description);
            setLastIdeaKey(currentIdeaKey);
            // Also update the store for cross-module compatibility
            setIdea({
                title: idea.title,
                description: idea.description,
                problem: idea.problemSolved || undefined,
                targetMarket: idea.targetAudience || undefined,
                industry: idea.industry || undefined,
            });
        }
    }, [idea, lastIdeaKey, setIdea]);

    // Populate from store if no idea in DB (new user flow) - only once
    useEffect(() => {
        if (!idea && currentIdea && !lastIdeaKey) {
            setIdeaTitle(currentIdea.title || '');
            setIdeaSummary(currentIdea.description || '');
            setLastIdeaKey('store-initialized');
        }
    }, [idea, currentIdea, lastIdeaKey]);

    // ==========================================================================
    // HANDLERS
    // ==========================================================================

    /**
     * Save idea to Core Service
     */
    const handleSave = () => {
        if (!ideaSummary.trim()) {
            toast.error('Please describe your idea first');
            return;
        }

        if (activeIdeaId) {
            // Update existing idea
            updateIdea({
                title: ideaTitle || 'Untitled Idea',
                description: ideaSummary,
            });
        } else {
            // Create new idea
            createIdea({
                title: ideaTitle || 'Untitled Idea',
                description: ideaSummary,
            }, {
                onSuccess: (newIdea) => {
                    // Navigate to the new idea URL
                    navigate(`/dashboard/idea/${newIdea.id}`, { replace: true });
                }
            });
        }

        // Also update local store for cross-module compatibility
        updateStoreIdea({
            title: ideaTitle || 'Untitled Idea',
            description: ideaSummary
        });
    };

    /**
     * Trigger AI analysis
     */
    const handleAnalyze = async () => {
        if (!ideaSummary.trim()) {
            toast.error('Please describe your idea first');
            return;
        }

        // If no idea exists yet, create one first and then trigger generation
        if (!activeIdeaId) {
            createIdea({
                title: ideaTitle || 'Untitled Idea',
                description: ideaSummary,
            }, {
                onSuccess: async (newIdea) => {
                    // Navigate to the new idea
                    navigate(`/dashboard/idea/${newIdea.id}`, { replace: true });

                    // Immediately trigger AI generation
                    try {
                        toast.success('Idea saved! Starting AI analysis...');
                        await api.post(`/ideas/${newIdea.id}/modules/idea_validation/generate`);
                    } catch (err: any) {
                        if (err?.response?.status === 402) {
                            toast.error('Insufficient credits. Please add more credits to continue.');
                        } else {
                            toast.error('Failed to start generation');
                        }
                    }
                }
            });
            return;
        }

        // Ensure idea is up-to-date before generating
        if (idea && idea.description !== ideaSummary) {
            updateIdea({
                title: ideaTitle || idea.title,
                description: ideaSummary,
            }, {
                onSuccess: () => {
                    // Trigger AI generation after update
                    generateModule('idea_validation');
                }
            });
        } else {
            // Idea is up-to-date, trigger generation
            generateModule('idea_validation');
        }
    };

    /**
     * Export to PDF
     */
    const { mutate: exportModule, isPending: isExporting } = useExportModule('idea-validation', activeIdeaId);
    const [exportJobId, setExportJobId] = useState<string | null>(null);

    const { data: exportStatus } = useExportStatus(exportJobId);

    // Handle export completion
    useEffect(() => {
        if (exportStatus?.state === 'completed' && exportStatus.downloadUrl) {
            // Use downloadFile utility for proper cross-origin download
            const filename = `${idea?.title || 'idea'}_validation.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
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
        if (!hasAnalysis) {
            toast.error('Please generate analysis first');
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
        return <IdeaValidationSkeleton />;
    }

    return (
        <div className="space-y-6">
            <SEO
                title="Idea Validation"
                description="Validate your startup idea with AI-powered analysis. Get viability scores, risk assessments, SWOT analysis, and market demand insights."
                canonical="/dashboard/idea"
            />

            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Lightbulb className="w-7 h-7 text-[#376EF9]" />
                        Idea Validation
                    </h1>
                    <p className="mt-1 text-gray-600">
                        Answer one question: "Is this idea worth pursuing?"
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={handleSave}
                        isLoading={isSaving}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={exportToPDF}
                        disabled={!hasAnalysis || isExporting || !!exportJobId}
                        isLoading={isExporting || !!exportJobId}
                    >
                        <span className="flex items-center gap-2">
                            {exportJobId ? 'Exporting...' : 'Export PDF'}
                            {!exportJobId && <CreditCost cost={2} />}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Idea Input */}
                <div className="space-y-6">
                    {/* Idea Summary Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Describe Your Idea</CardTitle>
                            <CardDescription>
                                Explain your startup idea in a few sentences. What problem does it solve?
                                Who is it for?
                            </CardDescription>
                        </CardHeader>
                        <input
                            type="text"
                            placeholder="Idea Title (optional)"
                            value={ideaTitle}
                            onChange={(e) => setIdeaTitle(e.target.value)}
                            className="w-full px-4 py-2 mt-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Textarea
                            placeholder="Example: An AI-powered tool that helps first-time founders validate their startup ideas and create investor-ready pitch decks in days instead of months..."
                            rows={6}
                            value={ideaSummary}
                            onChange={(e) => setIdeaSummary(e.target.value)}
                            className="mt-4"
                        />
                        <div className="mt-4 flex items-center gap-3">
                            <Button
                                onClick={handleAnalyze}
                                isLoading={isAnalyzing}
                                leftIcon={<Sparkles className="w-4 h-4" />}
                                className="w-full sm:w-auto"
                            >
                                <span className="flex items-center gap-2">
                                    {hasAnalysis ? 'Re-Analyze' : 'Analyze with AI'}
                                    <CreditCost cost={10} />
                                </span>
                            </Button>
                        </div>
                    </Card>

                    {/* Generating State */}
                    {isAnalyzing && (
                        <Card className="bg-blue-50 border-blue-200">
                            <div className="flex items-center gap-4">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                <div>
                                    <h3 className="font-medium text-blue-900">
                                        Generating Analysis...
                                    </h3>
                                    <p className="text-sm text-blue-700">
                                        This usually takes 30-60 seconds
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Idea Score Card */}
                    {hasAnalysis && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Idea Score</CardTitle>
                                    <CardDescription>
                                        AI-generated viability score based on your description
                                    </CardDescription>
                                </CardHeader>
                                <div className="mt-4 flex items-center gap-6">
                                    {/* Score circle */}
                                    <div className="relative w-24 h-24">
                                        <svg className="w-24 h-24 transform -rotate-90">
                                            <circle
                                                cx="48"
                                                cy="48"
                                                r="40"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                className="text-gray-200"
                                            />
                                            <circle
                                                cx="48"
                                                cy="48"
                                                r="40"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeDasharray={`${(analysis.idea_score / 100) * 251} 251`}
                                                className={
                                                    analysis.idea_score >= 70
                                                        ? 'text-green-500'
                                                        : analysis.idea_score >= 50
                                                            ? 'text-yellow-500'
                                                            : 'text-red-500'
                                                }
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                                            {analysis.idea_score}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {analysis.idea_score >= 70 ? 'Strong Potential' :
                                                analysis.idea_score >= 50 ? 'Promising' : 'Needs Work'}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {analysis.summary || (analysis.idea_score >= 70
                                                ? 'Your idea shows strong market potential'
                                                : analysis.idea_score >= 50
                                                    ? 'Good foundation, but needs refinement'
                                                    : 'Consider pivoting or refining your approach')}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* Right Column: Analysis Results */}
                <div className="space-y-6">
                    {/* Risk Heat Map */}
                    {hasAnalysis && analysis.risk_heat_map && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Risk Heat Map</CardTitle>
                                    <CardDescription>
                                        Visual assessment of key risk areas
                                    </CardDescription>
                                </CardHeader>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    {analysis.risk_heat_map.map((risk: { category: string; level: RiskLevel; description: string }) => (
                                        <div
                                            key={risk.category}
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                                        >
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {risk.category} Risk
                                            </span>
                                            <Badge variant={getRiskBadge(risk.level)}>
                                                {risk.level}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                                {/* Feasibility */}
                                <div className="mt-4 p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">
                                            Overall Feasibility
                                        </span>
                                        <Badge variant={getRiskBadge(analysis.feasibility)} size="md">
                                            {analysis.feasibility?.toUpperCase() || 'MEDIUM'}
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* SWOT Analysis */}
                    {hasAnalysis && analysis.swot && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>SWOT Analysis</CardTitle>
                                    <CardDescription>
                                        Key strengths and weaknesses identified
                                    </CardDescription>
                                </CardHeader>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Strengths */}
                                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                        <h4 className="font-medium text-green-800 flex items-center gap-2 mb-3">
                                            <CheckCircle className="w-4 h-4" />
                                            Strengths
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.swot.strengths?.map((item: string, i: number) => (
                                                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Weaknesses */}
                                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                                        <h4 className="font-medium text-red-800 flex items-center gap-2 mb-3">
                                            <AlertTriangle className="w-4 h-4" />
                                            Weaknesses
                                        </h4>
                                        <ul className="space-y-2">
                                            {analysis.swot.weaknesses?.map((item: string, i: number) => (
                                                <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Market Demand */}
                    {hasAnalysis && analysis.market_demand_snapshot && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Market Demand Snapshot</CardTitle>
                                    <CardDescription>
                                        Current market demand and trend analysis
                                    </CardDescription>
                                </CardHeader>
                                <div className="mt-4 space-y-3">
                                    {analysis.market_demand_snapshot.map((signal: { source: string; signal_type: string; interpretation: string; trend?: string }, i: number) => {
                                        const interpretation = signal.interpretation?.toLowerCase() || '';
                                        const isPositive = signal.trend === 'up' ||
                                            interpretation.includes('growing') ||
                                            interpretation.includes('high') ||
                                            interpretation.includes('strong') ||
                                            interpretation.includes('increasing');
                                        const isNegative = signal.trend === 'down' ||
                                            interpretation.includes('declining') ||
                                            interpretation.includes('low') ||
                                            interpretation.includes('weak') ||
                                            interpretation.includes('decreasing') ||
                                            interpretation.includes('saturated');

                                        return (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                                <div>
                                                    <div className="text-sm text-gray-600">{signal.source}</div>
                                                    <div className="font-medium text-gray-900">{signal.signal_type}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {isPositive ? (
                                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                                    ) : isNegative ? (
                                                        <TrendingDown className="w-5 h-5 text-red-500" />
                                                    ) : (
                                                        <Minus className="w-5 h-5 text-yellow-500" />
                                                    )}
                                                    <span className={`text-sm font-medium ${isPositive ? 'text-green-700' :
                                                        isNegative ? 'text-red-700' :
                                                            'text-yellow-700'
                                                        }`}>
                                                        {signal.interpretation}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Recommendations */}
                    {hasAnalysis && analysis.recommendations && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recommendations</CardTitle>
                                </CardHeader>
                                <ul className="mt-4 space-y-2">
                                    {analysis.recommendations.map((rec: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {i + 1}
                                            </span>
                                            <p className="text-sm text-blue-800">{rec}</p>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </motion.div>
                    )}

                    {/* Placeholder when not analyzed */}
                    {!hasAnalysis && !isAnalyzing && (
                        <Card className="flex flex-col items-center justify-center py-12 text-center">
                            <Sparkles className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">
                                Results will appear here
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                Describe your idea and click "Analyze with AI" to get started
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
