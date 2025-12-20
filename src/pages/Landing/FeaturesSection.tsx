/**
 * Features Section Component
 * Shows the 7 modules available in Pitchrr with professional styling
 */

import { forwardRef } from 'react';
import {
    Lightbulb,
    Megaphone,
    Palette,
    Presentation,
    Rocket,
    Users,
    MessageSquare,
    ArrowRight,
} from 'lucide-react';

/**
 * The 7 modules shown in the features section
 */
const modules = [
    {
        icon: Lightbulb,
        title: 'Idea Validation',
        description: 'Get an AI-powered viability score, SWOT analysis, and risk heat map for your startup idea.',
        color: '#376EF9',
        linear: 'from-blue-500 to-blue-600',
    },
    {
        icon: Megaphone,
        title: 'Marketing Strategy',
        description: '30-day marketing plan, funnel strategy, and customer personas tailored to your startup.',
        color: '#10B981',
        linear: 'from-green-500 to-emerald-600',
    },
    {
        icon: Palette,
        title: 'Branding',
        description: 'AI-generated logos, taglines, brand colors, and a complete brand kit for your startup.',
        color: '#8B5CF6',
        linear: 'from-purple-500 to-violet-600',
    },
    {
        icon: Presentation,
        title: 'Pitch Deck',
        description: 'Professional pitch deck templates with AI-generated slides and easy editing.',
        color: '#F59E0B',
        linear: 'from-amber-500 to-orange-600',
    },
    {
        icon: Rocket,
        title: 'GTM Strategy',
        description: 'Go-to-market plan with target users, pricing strategy, and launch timeline.',
        color: '#EF4444',
        linear: 'from-red-500 to-rose-600',
    },
    {
        icon: Users,
        title: 'Competitor Analysis',
        description: 'Compare your startup with competitors, analyze features, and find your edge.',
        color: '#06B6D4',
        linear: 'from-cyan-500 to-blue-600',
    },
    {
        icon: MessageSquare,
        title: 'AI Mentor',
        description: 'Context-aware AI chatbot that knows your startup and provides personalized guidance.',
        color: '#EC4899',
        linear: 'from-pink-500 to-rose-600',
    },
];

export const FeaturesSection = forwardRef<HTMLElement>((_, ref) => {
    return (
        <section
            id="features"
            ref={ref}
            className="relative py-20 lg:py-32 bg-linear-to-b from-gray-50 to-white overflow-hidden"
        >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 lg:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
                        <Rocket className="w-4 h-4" />
                        <span>Powerful Features</span>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        Everything You Need{' '}
                        <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            to Launch
                        </span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Seven powerful modules that guide you from raw idea to investor-ready startup.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {modules.map((module, index) => {
                        const Icon = module.icon;
                        return (
                            <div
                                key={module.title}
                                className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                }}
                            >
                                
                                {/* Icon Container */}
                                <div className="relative mb-6">
                                    <div
                                        className={`w-14 h-14 rounded-xl bg-linear-to-br ${module.linear} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}
                                    >
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    
                                    {/* Floating dots decoration */}
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75" />
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text transition-all duration-300">
                                        {module.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed">
                                        {module.description}
                                    </p>

                                    {/* Learn more link - appears on hover */}
                                    <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="inline-flex items-center gap-1 text-sm font-semibold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
                                            Learn more
                                            <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16 lg:mt-20">
                    <p className="text-lg text-gray-600 mb-6">
                        Ready to transform your startup idea?
                    </p>
                    <button className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
});

FeaturesSection.displayName = 'FeaturesSection';