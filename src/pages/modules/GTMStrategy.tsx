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
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

export default function GTMStrategy() {
    const STORAGE_KEY = 'pitchrr_gtm_strategy';

    const [productDescription, setProductDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    // GTM Strategy data
    const [strategy, setStrategy] = useState({
        targetUsers: {
            primary: 'First-time founders aged 25-40',
            earlyAdopters: ['Tech-savvy entrepreneurs', 'Startup accelerator participants', 'Solo founders'],
        },
        pricing: {
            model: 'freemium' as 'free' | 'paid' | 'freemium' | 'subscription',
            details: 'Free tier with limited features, Pro at $29/month',
        },
        launchPlan: [
            { phase: 'Pre-Launch', timeline: 'Week 1-2', tasks: ['Build waitlist', 'Create content', 'Set up analytics'] },
            { phase: 'Soft Launch', timeline: 'Week 3-4', tasks: ['Invite beta users', 'Collect feedback', 'Fix bugs'] },
            { phase: 'Public Launch', timeline: 'Week 5-6', tasks: ['Launch on Product Hunt', 'PR outreach', 'Social campaign'] },
            { phase: 'Growth', timeline: 'Week 7+', tasks: ['Scale what works', 'Add paid acquisition', 'Partnerships'] },
        ],
        growthLoops: ['Referral program', 'Content marketing', 'Community building', 'Strategic partnerships'],
        keyMetrics: ['DAU/MAU ratio', 'Conversion rate', 'NPS score', 'Customer acquisition cost', 'Lifetime value'],
    });

    /**
     * Load saved data from localStorage
     */
    const { currentIdea } = useIdeaStore();

    /**
     * Load saved data from localStorage OR autofill from store
     */
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);

                // Prioritize saved description, otherwise use global idea
                if (data.productDescription) {
                    setProductDescription(data.productDescription);
                } else if (currentIdea?.description) {
                    setProductDescription(currentIdea.description);
                }

                if (data.strategy) {
                    setStrategy(data.strategy);
                    setHasGenerated(true);
                }
            } catch (e) {
                console.error('Failed to load saved data:', e);
            }
        } else if (currentIdea?.description) {
            // No local save, autofill from global idea
            setProductDescription(currentIdea.description);
        }
    }, [currentIdea]);

    /**
     * Save to localStorage
     */
    const saveToLocalStorage = () => {
        const data = {
            productDescription,
            strategy: hasGenerated ? strategy : null,
            lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        toast.success('Saved!', { duration: 1500 });
    };

    /**
     * Generate GTM strategy with AI (mock)
     */
    const generateStrategy = async () => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHasGenerated(true);
        setIsGenerating(false);
        saveToLocalStorage();
        toast.success('GTM strategy generated!');
    };

    return (
        <div className="space-y-6">
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
                        onClick={saveToLocalStorage}
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
                    onClick={generateStrategy}
                    isLoading={isGenerating}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    className="mt-4"
                >
                    Generate GTM Strategy
                </Button>
            </Card>

            {hasGenerated && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Target Users */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#EF4444]" />
                                    Target Users
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 space-y-4">
                                <div className="p-4 rounded-lg bg-gray-50">
                                    <div className="text-sm text-gray-600)] mb-1">Primary Audience</div>
                                    <div className="font-medium text-gray-900">
                                        {strategy.targetUsers.primary}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-700 mb-2">
                                        Early Adopters
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {strategy.targetUsers.earlyAdopters.map((adopter, i) => (
                                            <Badge key={i} variant="primary">{adopter}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Pricing Strategy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-[#EF4444]" />
                                    Pricing Strategy
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600">Pricing Model</span>
                                    <Badge variant="success" size="md">{strategy.pricing.model.toUpperCase()}</Badge>
                                </div>
                                <p className="text-[var(--color-gray-700)]">
                                    {strategy.pricing.details}
                                </p>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Launch Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#EF4444]" />
                                    Launch Plan Timeline
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {strategy.launchPlan.map((phase, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-lg bg-gray-50 border-l-4"
                                        style={{ borderLeftColor: '#EF4444' }}
                                    >
                                        <div className="font-medium text-[var(--color-gray-900)]">{phase.phase}</div>
                                        <div className="text-sm text-gray-500 mb-2">{phase.timeline}</div>
                                        <ul className="space-y-1">
                                            {phase.tasks.map((task, j) => (
                                                <li key={j} className="text-sm text-[var(--color-gray-600)] flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                                                    {task}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Growth Loops */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-[#EF4444]" />
                                    Growth Loops
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 space-y-2">
                                {strategy.growthLoops.map((loop, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-gray-50)]"
                                    >
                                        <span className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center text-sm font-medium">
                                            {i + 1}
                                        </span>
                                        <span className="text-[var(--color-gray-700)]">{loop}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Key Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-[#EF4444]" />
                                    Key Metrics (KPIs)
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {strategy.keyMetrics.map((metric, i) => (
                                    <Badge key={i} variant="default" size="md">{metric}</Badge>
                                ))}
                            </div>
                            <p className="mt-4 text-sm text-[var(--color-gray-500)]">
                                Track these metrics from day one to measure growth and make data-driven decisions.
                            </p>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
