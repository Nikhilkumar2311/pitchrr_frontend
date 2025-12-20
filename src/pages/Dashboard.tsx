/**
 * Dashboard Home Page
 * Main dashboard with module overview, progress tracking,
 * Generate Idea feature, and skeleton loading
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Lightbulb,
    Megaphone,
    Palette,
    Presentation,
    Rocket,
    Users,
    MessageSquare,
    ArrowRight,
    Download,
    Play,
    Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, Button, ProgressBar, Badge } from '@/components/ui';
import { useAuthStore, useIdeaStore } from '@/store';
import { GenerateIdeaModal } from '@/components/common/GenerateIdeaModal';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

type ModuleStatus = 'not-started' | 'in-progress' | 'completed';

const modules: {
    id: string;
    icon: typeof Lightbulb;
    title: string;
    description: string;
    path: string;
    color: string;
    progress: number;
    status: ModuleStatus;
}[] = [
        { id: 'idea', icon: Lightbulb, title: 'Idea Validation', description: 'Validate your startup idea with AI-powered analysis', path: '/dashboard/idea', color: '#3B82F6', progress: 0, status: 'not-started' },
        { id: 'marketing', icon: Megaphone, title: 'Marketing Strategy', description: '30-day marketing plan and customer personas', path: '/dashboard/marketing', color: '#10B981', progress: 0, status: 'not-started' },
        { id: 'branding', icon: Palette, title: 'Branding', description: 'Logo, colors, fonts, and brand identity', path: '/dashboard/branding', color: '#8B5CF6', progress: 0, status: 'not-started' },
        { id: 'pitch', icon: Presentation, title: 'Pitch Deck', description: 'Professional pitch deck with AI assistance', path: '/dashboard/pitch', color: '#F59E0B', progress: 0, status: 'not-started' },
        { id: 'gtm', icon: Rocket, title: 'GTM Strategy', description: 'Go-to-market plan with launch timeline', path: '/dashboard/gtm', color: '#EF4444', progress: 0, status: 'not-started' },
        { id: 'competitors', icon: Users, title: 'Competitor Analysis', description: 'Compare features and find your edge', path: '/dashboard/competitors', color: '#06B6D4', progress: 0, status: 'not-started' },
        { id: 'chat', icon: MessageSquare, title: 'AI Chatbot', description: 'Get personalized guidance from your AI mentor', path: '/dashboard/chat', color: '#EC4899', progress: 0, status: 'not-started' },
    ];

const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
        case 'not-started': return { variant: 'default' as const, label: 'Not Started' };
        case 'in-progress': return { variant: 'warning' as const, label: 'In Progress' };
        case 'completed': return { variant: 'success' as const, label: 'Completed' };
    }
};

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { setIdea, currentIdea } = useIdeaStore();
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    const overallProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);

    // Simulate initial data loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    // Handle generated idea - save to store and navigate to Idea Validation
    const handleIdeaGenerated = (idea: { title: string; description: string; problem?: string; solution?: string; targetMarket?: string }) => {
        // Save idea to global store - this will auto-fill across all modules
        setIdea({
            title: idea.title,
            description: idea.description,
            problem: idea.problem,
            solution: idea.solution,
            targetMarket: idea.targetMarket,
        });

        // Navigate to Idea Validation to start validating
        navigate('/dashboard/idea');
    };

    // Show skeleton while loading
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Welcome back, {user?.name?.split(' ')[0] || 'Founder'}! 👋
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Continue building your startup with Pitchrr
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {/* Generate Idea Button - Primary Blue */}
                        <Button
                            variant="secondary"
                            leftIcon={<Sparkles className="w-4 h-4" />}
                            onClick={() => setIsGenerateModalOpen(true)}
                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                            Generate Idea
                        </Button>
                        <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                            Export All
                        </Button>
                        <Link to="/dashboard/idea">
                            <Button rightIcon={<Play className="w-4 h-4" />}>
                                Continue
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Current Idea Card - Show if idea exists */}
                {currentIdea && (
                    <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shrink-0">
                                <Lightbulb className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900">Your Current Idea</h3>
                                <p className="text-lg font-bold text-gray-900">{currentIdea.title}</p>
                                <p className="text-sm text-blue-700 mt-1 line-clamp-2">{currentIdea.description}</p>
                            </div>
                            <Link to="/dashboard/idea">
                                <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                                    Continue Validation
                                </Button>
                            </Link>
                        </div>
                    </Card>
                )}

                {/* Overall Progress */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                        <CardDescription>Complete all 7 modules to be investor-ready</CardDescription>
                    </CardHeader>
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                            <span className="text-sm font-bold text-blue-600">{overallProgress}%</span>
                        </div>
                        <ProgressBar value={overallProgress} size="lg" />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="default">
                            {modules.filter(m => m.status === 'not-started').length} Not Started
                        </Badge>
                        <Badge variant="warning">
                            {modules.filter(m => m.status === 'in-progress').length} In Progress
                        </Badge>
                        <Badge variant="success">
                            {modules.filter(m => m.status === 'completed').length} Completed
                        </Badge>
                    </div>
                </Card>

                {/* Module Cards Grid */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Modules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {modules.map((module, index) => {
                            const Icon = module.icon;
                            const statusBadge = getStatusBadge(module.status);
                            return (
                                <motion.div
                                    key={module.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link to={module.path}>
                                        <Card hover className="h-full">
                                            <div className="flex items-start justify-between mb-4">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: `${module.color}15` }}
                                                >
                                                    <Icon className="w-6 h-6" style={{ color: module.color }} />
                                                </div>
                                                <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-1">{module.title}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-1 text-xs">
                                                    <span className="text-gray-500">Progress</span>
                                                    <span className="font-medium text-gray-700">{module.progress}%</span>
                                                </div>
                                                <ProgressBar value={module.progress} size="sm" />
                                            </div>
                                            <div className="flex items-center justify-end mt-4 text-blue-600">
                                                <span className="text-sm font-medium mr-1">
                                                    {module.status === 'not-started' ? 'Start' : 'Continue'}
                                                </span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Don't have an idea card - Primary Blue */}
                {!currentIdea && (
                    <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900">Don't have an idea yet?</h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Let our AI help you discover startup ideas based on your interests, skills, and market trends.
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsGenerateModalOpen(true)}
                                rightIcon={<Sparkles className="w-4 h-4" />}
                            >
                                Generate Idea
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Getting Started Tip */}
                <Card className="bg-linear-to-r from-blue-50 to-blue-100 border-blue-200">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-800">💡 Getting Started Tip</h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Start with <strong>Idea Validation</strong> to get an AI-powered assessment
                                of your startup idea. This will guide the rest of your planning.
                            </p>
                        </div>
                        <Link to="/dashboard/idea">
                            <Button>Start Idea Validation</Button>
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Generate Idea Modal */}
            <GenerateIdeaModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onIdeaGenerated={handleIdeaGenerated}
            />
        </>
    );
}
