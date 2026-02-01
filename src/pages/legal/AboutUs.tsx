/**
 * About Us Page
 * Required for Razorpay activation
 */

import { Header } from '@/layout/Header';
import { Footer } from '../../layout/Footer';
import { SEO } from '@/components/common';
import { Lightbulb, Target, Zap, Shield, Sparkles, Users } from 'lucide-react';

export default function AboutUs() {
    return (
        <>
            <SEO
                title="About Us"
                description="Learn about Pitchrr, the AI-powered startup toolkit helping founders validate ideas, create pitch decks, and launch successfully."
                canonical="/about"
            />
            <Header />
            <main className="min-h-screen bg-white max-w-360 mx-auto">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 lg:py-30">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Empowering Founders to
                            <span className="text-blue-600"> Build Their Dreams</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Pitchrr is an AI-powered startup toolkit designed to help first-time founders transform their ideas into investor-ready businesses—in days, not months.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 lg:py-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                    We believe every great company starts with a simple idea. But turning that idea into reality shouldn't require expensive consultants, months of research, or an MBA.
                                </p>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Pitchrr democratizes startup knowledge by combining the power of AI with proven frameworks used by successful founders. We're here to be the mentor every founder deserves.
                                </p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">7</div>
                                        <div className="text-gray-600">AI Modules</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                                        <div className="text-gray-600">Founders Helped</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                                        <div className="text-gray-600">Countries</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                                        <div className="text-gray-600">AI Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="py-16 lg:py-20 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                A complete AI-powered toolkit to take your startup from idea to investor-ready
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Lightbulb, title: 'Idea Validation', desc: 'Get AI-powered analysis of your startup idea with viability scores and risk assessment', color: 'blue' },
                                { icon: Target, title: 'Marketing Strategy', desc: 'Generate 30-day marketing plans with channel strategies and audience targeting', color: 'green' },
                                { icon: Sparkles, title: 'Branding', desc: 'Create your brand identity with AI-generated logos, taglines, and color palettes', color: 'purple' },
                                { icon: Zap, title: 'Pitch Deck', desc: 'Build investor-ready 12-slide pitch decks with customizable themes', color: 'orange' },
                                { icon: Shield, title: 'GTM Strategy', desc: 'Plan your market launch with pricing, timelines, and growth strategies', color: 'red' },
                                { icon: Users, title: 'Competitor Analysis', desc: 'Understand your competitive landscape with AI-powered research', color: 'cyan' },
                            ].map((item, i) => {
                                const Icon = item.icon;
                                const colorClass = {
                                    blue: 'bg-blue-100 text-blue-600',
                                    green: 'bg-green-100 text-green-600',
                                    purple: 'bg-purple-100 text-purple-600',
                                    orange: 'bg-orange-100 text-orange-600',
                                    red: 'bg-red-100 text-red-600',
                                    cyan: 'bg-cyan-100 text-cyan-600',
                                }[item.color];

                                return (
                                    <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                                        <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center mb-4`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 lg:py-20">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Speed Matters</h3>
                                <p className="text-gray-600">
                                    In the startup world, speed is everything. We help you move fast without cutting corners.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Founder-First</h3>
                                <p className="text-gray-600">
                                    Every feature we build is designed with first-time founders in mind. Simple, effective, powerful.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Privacy</h3>
                                <p className="text-gray-600">
                                    Your startup ideas are yours. We protect your data and never share your confidential information.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
