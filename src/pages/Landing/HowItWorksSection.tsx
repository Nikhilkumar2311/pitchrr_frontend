/**
 * How It Works Section Component
 * Visual step-by-step guide with professional styling
 */

import { ArrowRight, Sparkles, Zap, Download } from 'lucide-react';
import { useUIStore } from '@/store';

const steps = [
    {
        step: '01',
        title: 'Describe Your Idea',
        description: 'Tell us about your startup idea in plain English. Our AI understands the context and industry.',
        icon: Sparkles,
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50',
    },
    {
        step: '02',
        title: 'Build with AI Guidance',
        description: 'Work through each module with AI-powered suggestions, templates, and real-time feedback.',
        icon: Zap,
        color: 'from-purple-500 to-pink-600',
        bgColor: 'bg-purple-50',
    },
    {
        step: '03',
        title: 'Download & Launch',
        description: 'Export your pitch deck, brand kit, strategy docs, and launch with confidence',
        icon: Download,
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50',
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative py-20 lg:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16 lg:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-6">
                        <Zap className="w-4 h-4" />
                        <span>Simple Process</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        How{' '}
                        <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Pitchrr
                        </span>
                        {' '}Works
                    </h2>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Three simple steps to go from idea to investor-ready
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection line - desktop only */}
                    <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-linear-to-r from-blue-200 via-purple-200 to-green-200"
                        style={{ width: 'calc(100% - 200px)', left: '100px' }} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
                        {steps.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.step} className="relative">
                                    {/* Step Card */}
                                    <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 group">
                                        {/* Step Number Badge */}
                                        <div className="absolute -top-6 left-8">
                                            <div className={`relative w-12 h-12 rounded-full bg-linear-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                                                <span className="text-white font-bold text-lg">{item.step}</span>
                                                {/* Pulse ring */}
                                                <div className={`absolute inset-0 rounded-full bg-linear-to-br ${item.color} animate-ping opacity-20`} />
                                            </div>
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-16 h-16 rounded-xl ${item.bgColor} flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className={`w-8 h-8 bg-linear-to-br ${item.color} bg-clip-text text-transparent`}
                                                style={{
                                                    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text transition-all duration-300">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-600 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {/* Decorative corner */}
                                        <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                                            <div className={`absolute inset-0 bg-linear-to-br ${item.color} rounded-bl-full`} />
                                        </div>
                                    </div>

                                    {/* Arrow - desktop only */}
                                    {index < 2 && (
                                        <div className="hidden lg:flex absolute -right-4 top-32 z-10 items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-gray-200 shadow-sm">
                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    )}

                                    {/* Mobile connector */}
                                    {index < 2 && (
                                        <div className="lg:hidden flex justify-center my-6">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                <div className="w-2 h-2 rounded-full bg-gray-300" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16 lg:mt-24">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                        <div className="flex-1 text-left">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Ready to get started?
                            </h3>
                            <p className="text-gray-600">
                                Join 1,247+ founders building with Pitchrr
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                useUIStore.getState().setAuthModalView('signup');
                                useUIStore.getState().setAuthModalOpen(true);
                            }}
                            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}