/**
 * Refund Policy Page
 * Required for Razorpay activation
 */

import { Header } from '@/layout/Header';
import { Footer } from '../Landing/Footer';
import { SEO } from '@/components/common';
import { AlertCircle, XCircle, HelpCircle } from 'lucide-react';

export default function RefundPolicy() {
    return (
        <>
            <SEO
                title="Refund Policy"
                description="Understand Pitchrr's refund policy for credit purchases. Learn about eligible refunds, the refund process, and our commitment to customer satisfaction."
                canonical="/refund"
            />
            <Header />
            <main className="min-h-screen bg-white max-w-360 mx-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
                        <p className="text-gray-600">Last updated: January 2026</p>
                    </div>

                    {/* Important Notice - No Refunds */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-10">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900 mb-2">No Refund Policy</h3>
                                <p className="text-red-800">
                                    Pitchrr provides digital services through a credit-based system. Since AI-generated content is delivered immediately upon use, <strong>all sales are final and non-refundable</strong>. Please review our services carefully before making a purchase.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">General Policy</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Due to the nature of our digital services, we maintain a strict no-refund policy. When you purchase credits on Pitchrr:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>All purchases are <strong>final and non-refundable</strong></li>
                                <li>Credits are available for immediate use upon purchase</li>
                                <li>AI-generated content is delivered instantly when you use credits</li>
                                <li>We cannot reverse or undo AI-generated content</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Non-Refundable Situations</h2>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <XCircle className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-semibold text-gray-900 m-0">We Do Not Provide Refunds For:</h3>
                                </div>
                                <ul className="list-disc pl-6 text-gray-700 space-y-2 m-0">
                                    <li>Credits that have been used (fully or partially)</li>
                                    <li>Unused credits in your account</li>
                                    <li>Dissatisfaction with AI-generated content quality</li>
                                    <li>Change of mind after purchase</li>
                                    <li>Not using the platform after purchase</li>
                                    <li>Failure to understand the credit system before purchase</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Critical Exceptions</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                In rare and exceptional circumstances, we may consider taking action on a <strong>case-by-case basis</strong>. These critical situations include:
                            </p>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-semibold text-amber-900 m-0">May Be Considered (Not Guaranteed)</h3>
                                </div>
                                <ul className="list-disc pl-6 text-amber-800 space-y-2 m-0">
                                    <li>Payment was charged but credits were never added to your account (technical failure)</li>
                                    <li>Duplicate charges for the same transaction</li>
                                    <li>Major platform outage that completely prevented service usage during the entire validity period</li>
                                </ul>
                                <p className="text-amber-700 mt-4 text-sm">
                                    <strong>Note:</strong> Even in these cases, refunds are not guaranteed. We may offer account credits or other resolutions at our discretion.
                                </p>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Before You Purchase</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We encourage you to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Explore the platform and understand our features</li>
                                <li>Review the credit costs for each module</li>
                                <li>Start with a smaller credit pack if you're new</li>
                                <li>Contact us with any questions before purchasing</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-start gap-3">
                                    <HelpCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                                    <div>
                                        <p className="text-gray-700 mb-2">
                                            For critical technical issues only, you may reach out to:
                                        </p>
                                        <p className="text-gray-900 font-medium">pitchrr4@gmail.com</p>
                                        <p className="text-gray-600 text-sm mt-2">
                                            Please include your account email, transaction ID, and detailed description of the technical issue with screenshots if possible.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
