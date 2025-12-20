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
 */

import { useState, useEffect } from 'react';
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

export default function MarketingStrategy() {
    const STORAGE_KEY = 'pitchrr_marketing_strategy';

    // Form state
    const [targetAudience, setTargetAudience] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    // Generated strategy state
    const [strategy, setStrategy] = useState({
        thirtyDayPlan: [
            { week: 1, tasks: ['Market research', 'Competitor analysis', 'Define target audience'] },
            { week: 2, tasks: ['Create content calendar', 'Set up social accounts', 'Design branding'] },
            { week: 3, tasks: ['Launch social campaigns', 'Start content marketing', 'Outreach to influencers'] },
            { week: 4, tasks: ['Analyze results', 'A/B test messaging', 'Scale what works'] },
        ],
        funnel: {
            awareness: ['Social media content', 'SEO blog posts', 'Paid ads'],
            interest: ['Lead magnets', 'Email nurture sequence', 'Webinars'],
            conversion: ['Free trial', 'Product demos', 'Testimonials'],
        },
        channels: {
            online: ['LinkedIn', 'Twitter', 'Google Ads'],
            offline: ['Startup events', 'Speaking engagements', 'Partnerships'],
        },
        persona: {
            name: 'Alex',
            age: '28-35',
            occupation: 'First-time founder / Product Manager',
            painPoints: ['Uncertain if idea is viable', 'No investor connections', 'Limited time'],
            goals: ['Validate idea quickly', 'Create professional pitch deck', 'Get investor-ready'],
        },
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

                // If we have a saved audience, use it.
                // Otherwise if we have a global idea target market, use that.
                if (data.targetAudience) {
                    setTargetAudience(data.targetAudience);
                } else if (currentIdea?.targetMarket) {
                    setTargetAudience(currentIdea.targetMarket);
                }

                if (data.strategy) {
                    setStrategy(data.strategy);
                    setHasGenerated(true);
                }
            } catch (e) {
                console.error('Failed to load saved data:', e);
            }
        } else if (currentIdea?.targetMarket) {
            // No local save, autofill from global idea
            setTargetAudience(currentIdea.targetMarket);
        }
    }, [currentIdea]);

    /**
     * Save to localStorage
     */
    const saveToLocalStorage = () => {
        const data = {
            targetAudience,
            strategy: hasGenerated ? strategy : null,
            lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        toast.success('Saved!', { duration: 1500 });
    };

    /**
     * Generate strategy with AI (mock)
     */
    const generateStrategy = async () => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHasGenerated(true);
        setIsGenerating(false);
        saveToLocalStorage();
        toast.success('Marketing strategy generated!');
    };

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
                        onClick={generateStrategy}
                        isLoading={isGenerating}
                        leftIcon={<Sparkles className="w-4 h-4" />}
                    >
                        Generate Marketing Strategy
                    </Button>
                </div>
            </Card>

            {hasGenerated && (
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
                                {strategy.thirtyDayPlan.map((week) => (
                                    <div key={week.week} className="p-4 rounded-lg bg-gray-50">
                                        <div className="font-medium text-gray-900)] mb-2">
                                            Week {week.week}
                                        </div>
                                        <ul className="space-y-1.5">
                                            {week.tasks.map((task, i) => (
                                                <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
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

                    {/* Marketing Funnel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#10B981]" />
                                    Marketing Funnel
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 space-y-4">
                                {Object.entries(strategy.funnel).map(([stage, items], index) => (
                                    <div
                                        key={stage}
                                        className="p-4 rounded-lg"
                                        style={{
                                            backgroundColor: index === 0 ? '#dcfce7' : index === 1 ? '#fef9c3' : '#dbeafe',
                                        }}
                                    >
                                        <div className="font-medium capitalize mb-2">{stage}</div>
                                        <div className="flex flex-wrap gap-2">
                                            {items.map((item, i) => (
                                                <Badge key={i} variant="default">{item}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Customer Persona */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[#10B981]" />
                                    Customer Persona
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 p-4 rounded-lg bg-gray-50">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {strategy.persona.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">
                                            {strategy.persona.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {strategy.persona.age} · {strategy.persona.occupation}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm font-medium text-red-700 mb-1">Pain Points</div>
                                        <ul className="space-y-1">
                                            {strategy.persona.painPoints.map((point, i) => (
                                                <li key={i} className="text-sm text-gray-600">• {point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-green-700 mb-1">Goals</div>
                                        <ul className="space-y-1">
                                            {strategy.persona.goals.map((goal, i) => (
                                                <li key={i} className="text-sm text-gray-600">• {goal}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Channel Strategy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-[#10B981]" />
                                    Channel Strategy
                                </CardTitle>
                            </CardHeader>
                            <div className="mt-4 space-y-4">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                    <div className="font-medium text-blue-800 mb-2">Online Channels</div>
                                    <div className="flex flex-wrap gap-2">
                                        {strategy.channels.online.map((channel, i) => (
                                            <Badge key={i} variant="primary">{channel}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                                    <div className="font-medium text-purple-800 mb-2">Offline Channels</div>
                                    <div className="flex flex-wrap gap-2">
                                        {strategy.channels.offline.map((channel, i) => (
                                            <Badge key={i} variant="default">{channel}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
