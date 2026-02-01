/**
 * Contact Us Page
 * Required for Razorpay activation
 */

import { Header } from '@/layout/Header';
import { Footer } from '../../layout/Footer';
import { SEO } from '@/components/common';
import { Mail, Clock } from 'lucide-react';

export default function ContactUs() {
    return (
        <>
            <SEO
                title="Contact Us"
                description="Get in touch with the Pitchrr team. We're here to help with questions about our AI startup toolkit, pricing, or technical support."
                canonical="/contact"
            />
            <Header />
            <main className="min-h-screen bg-white max-w-360 mx-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                        <p className="text-gray-600">Last updated: January 2026</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Have questions about Pitchrr? We'd love to hear from you. Whether you need help with our AI startup toolkit, have questions about pricing, or need technical support, feel free to reach out.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Email Us</h2>
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Email</p>
                                        <a
                                            href="mailto:pitchrr4@gmail.com"
                                            className="text-xl font-semibold text-blue-600 hover:underline"
                                        >
                                            pitchrr4@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-600 text-sm">Response Time</p>
                                        <p className="text-gray-900 font-medium">Usually within 24-48 hours</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What to Include</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                To help us assist you better, please include the following in your email:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Your registered email address</li>
                                <li>A clear description of your question or issue</li>
                                <li>Screenshots if applicable (for technical issues)</li>
                                <li>Transaction ID (for payment-related queries)</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Links</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Before reaching out, you may find answers in our policy pages:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li><a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> - How we handle your data</li>
                                <li><a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a> - Usage terms and conditions</li>
                                <li><a href="/refund" className="text-blue-600 hover:underline">Refund Policy</a> - Our refund and cancellation policy</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
