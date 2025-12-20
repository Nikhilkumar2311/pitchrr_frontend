/**
 * Benefits Section Component
 * Why founders choose Pitchrr + Testimonial
 */

import { forwardRef } from 'react';
import { Zap, Star, Shield, CheckCircle2 } from 'lucide-react';

const benefits = [
    {
        icon: Zap,
        title: 'Launch Faster',
        description: 'Go from idea to investor-ready in days, not months.',
        linear: 'from-yellow-500 to-orange-500',
    },
    {
        icon: Star,
        title: 'AI-Powered Insights',
        description: 'Get smart recommendations based on successful startups.',
        linear: 'from-blue-500 to-indigo-500',
    },
    {
        icon: Shield,
        title: 'Build Confidence',
        description: 'Validate your idea before investing time and money.',
        linear: 'from-green-500 to-emerald-500',
    },
];

export const BenefitsSection = forwardRef<HTMLElement>((_, ref) => {
    return (
        <section ref={ref} className="relative py-20 lg:py-32 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-linear(to_right,#ffffff05_1px,transparent_1px),linear-linear(to_bottom,#ffffff05_1px,transparent_1px)]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Why Choose Us</span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Why Founders Choose{' '}
                            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Pitchrr
                            </span>
                        </h2>
                        
                        <p className="text-xl text-gray-400 mb-10">
                            Join thousands of founders who are building faster and smarter with AI-powered tools.
                        </p>

                        <div className="space-y-6">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <div 
                                        key={benefit.title} 
                                        className="group flex gap-4 p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:translate-x-2"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                        }}
                                    >
                                        <div className={`shrink-0 w-14 h-14 rounded-xl bg-linear-to-br ${benefit.linear} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                                                {benefit.title}
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Testimonial */}
                    <div className="relative">
                        {/* Glow effect behind card */}
                        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                        
                        <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 lg:p-10 border border-white/20 shadow-2xl">

                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star 
                                        key={i} 
                                        className="w-6 h-6 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                                    />
                                ))}
                            </div>

                            {/* Testimonial text */}
                            <p className="text-xl text-white/95 leading-relaxed mb-8">
                                "Pitchrr helped me validate my idea and create a professional pitch deck in just 2 days.
                                I went from 'maybe I should build this' to pitching investors with confidence."
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-xl">AP</span>
                                    </div>
                                    {/* Verified badge */}
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold text-white text-lg">Ajit</div>
                                    <div className="text-gray-400">Founder, Aarthik</div>
                                </div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-linear-to-tl from-blue-500/10 to-transparent rounded-tl-full" />
                        </div>

                        {/* Additional testimonial metrics */}
                        <div className="mt-6 grid grid-cols-3 gap-4">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                                <div className="text-2xl font-bold text-white mb-1">2 Days</div>
                                <div className="text-sm text-gray-400">Time Saved</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                                <div className="text-2xl font-bold text-white mb-1">$50K</div>
                                <div className="text-sm text-gray-400">Raised</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                                <div className="text-2xl font-bold text-white mb-1">5/5</div>
                                <div className="text-sm text-gray-400">Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

BenefitsSection.displayName = 'BenefitsSection';