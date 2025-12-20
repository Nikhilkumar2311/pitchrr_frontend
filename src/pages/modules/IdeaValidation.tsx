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
 * - User enters idea → stored in local state
 * - Auto-saves to localStorage (mock backend)
 * - Can generate PDF export
 */

import { useState, useEffect } from 'react';
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
    // LOCAL STORAGE KEY for auto-save
    const STORAGE_KEY = 'pitchrr_idea_validation';

    // Form state
    const [ideaSummary, setIdeaSummary] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    // Analysis results (mock data - would come from AI API)
    const [analysis, setAnalysis] = useState({
        score: 0,
        risks: {
            market: 'medium' as RiskLevel,
            execution: 'medium' as RiskLevel,
            competition: 'medium' as RiskLevel,
            tech: 'low' as RiskLevel,
        },
        feasibility: 'medium' as RiskLevel,
        swot: {
            strengths: [] as string[],
            weaknesses: [] as string[],
        },
        marketDemand: {
            level: 'medium' as RiskLevel,
            trend: 'stable' as 'growing' | 'stable' | 'declining',
        },
    });

    /**
     * Load saved data from localStorage on mount
     */
    const { currentIdea, updateIdea } = useIdeaStore();

    /**
     * Load saved data from localStorage on mount OR autofill from store
     */
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);

                // Prioritize global store if available
                if (currentIdea?.description) {
                    setIdeaSummary(currentIdea.description);
                } else {
                    setIdeaSummary(data.ideaSummary || '');
                }

                if (data.analysis) {
                    setAnalysis(data.analysis);
                    setHasAnalyzed(true);
                }
                if (data.lastSaved) {
                    setLastSaved(new Date(data.lastSaved));
                }
            } catch (e) {
                console.error('Failed to load saved data:', e);
            }
        } else if (currentIdea?.description) {
            // No saved data, but we have a global idea -> auto-fill it!
            setIdeaSummary(currentIdea.description);
        }
    }, [currentIdea]);

    /**
     * AUTO-SAVE: Save to localStorage when ideaSummary changes
     * Uses debounce effect (2 second delay)
     */
    useEffect(() => {
        if (!ideaSummary) return;

        const timeoutId = setTimeout(() => {
            saveToLocalStorage();
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [ideaSummary]);

    /**
     * Save current state to localStorage AND update global store
     */
    const saveToLocalStorage = () => {
        setIsSaving(true);

        const data = {
            ideaSummary,
            analysis: hasAnalyzed ? analysis : null,
            lastSaved: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setLastSaved(new Date());
        setIsSaving(false);

        // Also update the global store so other modules get the latest description
        updateIdea({ description: ideaSummary });

        toast.success('Saved!', { duration: 1500 });
    };

    /**
     * Analyze idea with AI (mock implementation)
     * 
     * In a real app, this would call an AI API.
     * For now, it generates random but realistic-looking results.
     */
    const analyzeIdea = async () => {
        if (!ideaSummary.trim()) {
            toast.error('Please describe your idea first');
            return;
        }

        setIsAnalyzing(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate mock analysis results
        const mockScore = Math.floor(Math.random() * 40) + 50; // 50-90
        const levels: RiskLevel[] = ['low', 'medium', 'high'];

        const mockAnalysis = {
            score: mockScore,
            risks: {
                market: levels[Math.floor(Math.random() * 3)] as RiskLevel,
                execution: levels[Math.floor(Math.random() * 3)] as RiskLevel,
                competition: levels[Math.floor(Math.random() * 2) + 1] as RiskLevel, // medium or high
                tech: levels[Math.floor(Math.random() * 2)] as RiskLevel, // low or medium
            },
            feasibility: mockScore > 70 ? 'high' : mockScore > 50 ? 'medium' : 'low' as RiskLevel,
            swot: {
                strengths: [
                    'Addresses a clear market need',
                    'Technology is readily available',
                    'Low initial investment required',
                ],
                weaknesses: [
                    'Competitive market space',
                    'Needs strong marketing strategy',
                    'Customer acquisition may be challenging',
                ],
            },
            marketDemand: {
                level: mockScore > 65 ? 'high' : 'medium' as RiskLevel,
                trend: mockScore > 60 ? 'growing' : 'stable' as 'growing' | 'stable' | 'declining',
            },
        };

        setAnalysis(mockAnalysis);
        setHasAnalyzed(true);
        setIsAnalyzing(false);

        // Save after analysis
        saveToLocalStorage();

        toast.success('Analysis complete!');
    };

    /**
     * Export to PDF (mock implementation)
     */
    const exportToPDF = () => {
        toast.success('PDF export will be available soon!');
    };

    return (
        <div className="space-y-6">
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
                    {/* Last saved indicator */}
                    {lastSaved && (
                        <span className="text-sm text-gray-500">
                            {isSaving ? 'Saving...' : `Saved ${lastSaved.toLocaleTimeString()}`}
                        </span>
                    )}
                    <Button
                        variant="secondary"
                        leftIcon={<Save className="w-4 h-4" />}
                        onClick={saveToLocalStorage}
                        disabled={isSaving}
                    >
                        Save
                    </Button>
                    <Button
                        variant="secondary"
                        leftIcon={<Download className="w-4 h-4" />}
                        onClick={exportToPDF}
                        disabled={!hasAnalyzed}
                    >
                        Export PDF
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
                        <Textarea
                            placeholder="Example: An AI-powered tool that helps first-time founders validate their startup ideas and create investor-ready pitch decks in days instead of months..."
                            rows={6}
                            value={ideaSummary}
                            onChange={(e) => setIdeaSummary(e.target.value)}
                            className="mt-4"
                        />
                        <div className="mt-4">
                            <Button
                                onClick={analyzeIdea}
                                isLoading={isAnalyzing}
                                leftIcon={<Sparkles className="w-4 h-4" />}
                                className="w-full sm:w-auto"
                            >
                                {hasAnalyzed ? 'Re-Analyze with AI' : 'Analyze with AI'}
                            </Button>
                        </div>
                    </Card>

                    {/* Idea Score Card */}
                    {hasAnalyzed && (
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
                                                strokeDasharray={`${(analysis.score / 100) * 251} 251`}
                                                className={
                                                    analysis.score >= 70
                                                        ? 'text-green-500'
                                                        : analysis.score >= 50
                                                            ? 'text-yellow-500'
                                                            : 'text-red-500'
                                                }
                                            />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                                            {analysis.score}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900)]">
                                            {analysis.score >= 70 ? 'Strong Potential' :
                                                analysis.score >= 50 ? 'Promising' : 'Needs Work'}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {analysis.score >= 70
                                                ? 'Your idea shows strong market potential'
                                                : analysis.score >= 50
                                                    ? 'Good foundation, but needs refinement'
                                                    : 'Consider pivoting or refining your approach'}
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
                    {hasAnalyzed && (
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
                                    {Object.entries(analysis.risks).map(([key, level]) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                                        >
                                            <span className="text-sm font-medium text-gray-700 capitalize">
                                                {key} Risk
                                            </span>
                                            <Badge variant={getRiskBadge(level)}>
                                                {level}
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
                                            {analysis.feasibility.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* SWOT Analysis */}
                    {hasAnalyzed && (
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
                                            {analysis.swot.strengths.map((item, i) => (
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
                                            {analysis.swot.weaknesses.map((item, i) => (
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
                    {hasAnalyzed && (
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
                                <div className="mt-4 flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                    <div>
                                        <div className="text-sm text-gray-600">Demand Level</div>
                                        <div className="text-lg font-semibold text-gray-900 capitalize">
                                            {analysis.marketDemand.level}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {analysis.marketDemand.trend === 'growing' && (
                                            <TrendingUp className="w-5 h-5 text-green-500" />
                                        )}
                                        {analysis.marketDemand.trend === 'stable' && (
                                            <Minus className="w-5 h-5 text-yellow-500" />
                                        )}
                                        {analysis.marketDemand.trend === 'declining' && (
                                            <TrendingDown className="w-5 h-5 text-red-500" />
                                        )}
                                        <span className="text-sm font-medium capitalize text-gray-700">
                                            {analysis.marketDemand.trend}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Placeholder when not analyzed */}
                    {!hasAnalyzed && (
                        <Card className="flex flex-col items-center justify-center py-12 text-center">
                            <Sparkles className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">
                                Results will appear here
                            </h3>
                            <p className="text-sm text-[var(--color-gray-500)] mt-1 max-w-xs">
                                Describe your idea and click "Analyze with AI" to get started
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
