/**
 * Privacy Policy Page
 * Required for Razorpay activation
 */

import { Header } from '@/layout/Header';
import { Footer } from '../../layout/Footer';
import { SEO } from '@/components/common';

export default function PrivacyPolicy() {
    return (
        <>
            <SEO
                title="Privacy Policy"
                description="Learn how Pitchrr collects, uses, and protects your personal information. Read our privacy policy for details on data handling and your rights."
                canonical="/privacy"
            />
            <Header />
            <main className="min-h-screen bg-white max-w-360 mx-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                        <p className="text-gray-600">Last updated: January 2026</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Welcome to Pitchrr ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered startup toolkit platform.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                By using Pitchrr, you agree to the collection and use of information in accordance with this policy.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

                            <h3 className="text-xl font-medium text-gray-900 mb-3">Personal Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                When you register for an account, we may collect:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Name and email address</li>
                                <li>Phone number (for payment verification)</li>
                                <li>Payment information (processed securely via Razorpay)</li>
                                <li>Profile information you choose to provide</li>
                            </ul>

                            {/* <h3 className="text-xl font-medium text-gray-900 mb-3">Usage Information</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We automatically collect certain information when you use our platform:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Device information (browser type, operating system)</li>
                                <li>IP address and location data</li>
                                <li>Usage patterns and feature interactions</li>
                                <li>Startup ideas and content you create (to provide our services)</li>
                            </ul> */}
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Provide and maintain our AI-powered services</li>
                                <li>Process payments and manage your credits</li>
                                <li>Send you service-related communications</li>
                                <li>Improve our platform and develop new features</li>
                                <li>Respond to your inquiries and provide customer support</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We do not sell your personal information. We may share your information with:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li><strong>Service Providers:</strong> Razorpay (payments), Clerk (authentication), cloud hosting providers</li>
                                <li><strong>AI Services:</strong> To generate content for your startup (processed securely)</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We implement industry-standard security measures to protect your data, including encryption in transit and at rest, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure.
                            </p>
                        </section>

                        {/* <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You have the right to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Access and download your personal data</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of your account and data</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section> */}

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We use essential cookies to maintain your session and preferences. We also use analytics cookies to understand how you use our platform. You can control cookie preferences through your browser settings.
                            </p>
                        </section>

                        {/* <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have questions about this Privacy Policy, please contact us at:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-6 mt-4">
                                <p className="text-gray-700"><strong>Email:</strong> privacy@pitchrr.com</p>
                                <p className="text-gray-700"><strong>Address:</strong> Pitchrr Technologies, India</p>
                            </div>
                        </section> */}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
