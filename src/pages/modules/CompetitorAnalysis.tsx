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
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Save,
    Download,
    Sparkles,
    Plus,
    Trash2,
    Check,
    X,
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    Button,
    Input,
    Badge,
} from '@/components/ui';
import toast from 'react-hot-toast';
import { CompetitorAnalysisSkeleton } from '@/components/skeletons/CompetitorAnalysisSkeleton';

interface Competitor {
    name: string;
    website: string;
    pricing: string;
    strengths: string[];
    weaknesses: string[];
}

export default function CompetitorAnalysis() {
    const STORAGE_KEY = 'pitchrr_competitor_analysis';

    const [newCompetitor, setNewCompetitor] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Competitors data
    const [competitors, setCompetitors] = useState<Competitor[]>([
        {
            name: 'Notion',
            website: 'notion.so',
            pricing: 'Freemium, $8/user/mo',
            strengths: ['Strong brand', 'Flexible', 'Large community'],
            weaknesses: ['Not focused on startups', 'Complex for beginners'],
        },
        {
            name: 'Slidebean',
            website: 'slidebean.com',
            pricing: '$29/mo',
            strengths: ['Pitch deck focused', 'AI features'],
            weaknesses: ['Limited to decks', 'Expensive'],
        },
        {
            name: 'Canva',
            website: 'canva.com',
            pricing: 'Freemium, $13/mo',
            strengths: ['Easy to use', 'Many templates'],
            weaknesses: ['Generic, not startup-specific'],
        },
    ]);

    // Feature comparison data
    const features = [
        { name: 'Idea Validation', yourStartup: true, competitors: { 'Notion': false, 'Slidebean': false, 'Canva': false } },
        { name: 'Marketing Strategy', yourStartup: true, competitors: { 'Notion': false, 'Slidebean': false, 'Canva': false } },
        { name: 'AI Branding', yourStartup: true, competitors: { 'Notion': false, 'Slidebean': false, 'Canva': true } },
        { name: 'Pitch Deck Generator', yourStartup: true, competitors: { 'Notion': false, 'Slidebean': true, 'Canva': true } },
        { name: 'GTM Planning', yourStartup: true, competitors: { 'Notion': true, 'Slidebean': false, 'Canva': false } },
        { name: 'AI Mentor', yourStartup: true, competitors: { 'Notion': false, 'Slidebean': false, 'Canva': false } },
    ];

    /**
     * Load saved data from localStorage
     */
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.competitors) {
                    setCompetitors(data.competitors);
                    setHasAnalyzed(true);
                }
            } catch (e) {
                console.error('Failed to load saved data:', e);
            }
        }

        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <CompetitorAnalysisSkeleton />;
    }

    /**
     * Save to localStorage
     */
    const saveToLocalStorage = () => {
        const data = {
            competitors,
            lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        toast.success('Saved!', { duration: 1500 });
    };

    /**
     * Add a competitor (mock - would use AI in real app)
     */
    const addCompetitor = () => {
        if (!newCompetitor.trim()) {
            toast.error('Please enter a competitor name');
            return;
        }

        const competitor: Competitor = {
            name: newCompetitor,
            website: `${newCompetitor.toLowerCase().replace(/\s/g, '')}.com`,
            pricing: 'TBD',
            strengths: ['To be analyzed'],
            weaknesses: ['To be analyzed'],
        };

        setCompetitors([...competitors, competitor]);
        setNewCompetitor('');
        setHasAnalyzed(true);
        toast.success(`Added ${newCompetitor}`);
    };

    /**
     * Remove a competitor
     */
    const removeCompetitor = (index: number) => {
        const newCompetitors = competitors.filter((_, i) => i !== index);
        setCompetitors(newCompetitors);
    };

    /**
     * Analyze competitors with AI (mock)
     */
    const analyzeWithAI = async () => {
        setIsAnalyzing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHasAnalyzed(true);
        setIsAnalyzing(false);
        saveToLocalStorage();
        toast.success('Competitor analysis complete!');
    };

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
                        onClick={saveToLocalStorage}
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

            {/* Add Competitor */}
            <Card>
                <CardHeader>
                    <CardTitle>Add Competitors</CardTitle>
                    <CardDescription>
                        Enter competitors to analyze them against your startup
                    </CardDescription>
                </CardHeader>
                <div className="mt-4 flex gap-3">
                    <Input
                        placeholder="Company name (e.g., Notion, Slidebean)"
                        value={newCompetitor}
                        onChange={(e) => setNewCompetitor(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCompetitor()}
                        className="flex-1"
                    />
                    <Button onClick={addCompetitor} leftIcon={<Plus className="w-4 h-4" />}>
                        Add
                    </Button>
                </div>
                {competitors.length > 0 && (
                    <Button
                        onClick={analyzeWithAI}
                        isLoading={isAnalyzing}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                        className="mt-4"
                    >
                        Analyze with AI
                    </Button>
                )}
            </Card>

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
                            <Card className="relative">
                                {/* Remove button */}
                                <button
                                    onClick={() => removeCompetitor(index)}
                                    className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <CardHeader>
                                    <CardTitle>{competitor.name}</CardTitle>
                                    <CardDescription>{competitor.website}</CardDescription>
                                </CardHeader>

                                <div className="mt-4 space-y-3">
                                    <div className="text-sm">
                                        <span className="text-gray-500">Pricing: </span>
                                        <span className="font-medium">{competitor.pricing}</span>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-green-700 mb-1">Strengths</div>
                                        <div className="flex flex-wrap gap-1">
                                            {competitor.strengths.map((s, i) => (
                                                <Badge key={i} variant="success" size="sm">{s}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-red-700 mb-1">Weaknesses</div>
                                        <div className="flex flex-wrap gap-1">
                                            {competitor.weaknesses.map((w, i) => (
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

            {/* Feature Comparison Table */}
            {hasAnalyzed && (
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
                                        <th className="text-center py-3 px-4 font-medium text-[var(--color-primary-600)]">
                                            Your Startup
                                        </th>
                                        {competitors.slice(0, 3).map((c) => (
                                            <th key={c.name} className="text-center py-3 px-4 font-medium text-gray-700)]">
                                                {c.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map((feature, i) => (
                                        <tr
                                            key={feature.name}
                                            className={i % 2 === 0 ? 'bg-gray-50' : ''}
                                        >
                                            <td className="py-3 px-4 text-gray-900">
                                                {feature.name}
                                            </td>
                                            <td className="text-center py-3 px-4">
                                                {feature.yourStartup ? (
                                                    <Check className="w-5 h-5 text-green-500 mx-auto" />
                                                ) : (
                                                    <X className="w-5 h-5 text-red-400 mx-auto" />
                                                )}
                                            </td>
                                            {competitors.slice(0, 3).map((c) => (
                                                <td key={c.name} className="text-center py-3 px-4">
                                                    {feature.competitors[c.name as keyof typeof feature.competitors] ? (
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
        </div>
    );
}
