/**
 * Terms of Service Page
 * Required for Razorpay activation
 */

import { Header } from '@/layout/Header';
import { Footer } from '../Landing/Footer';
import { SEO } from '@/components/common';

export default function TermsOfService() {
    return (
        <>
            <SEO
                title="Terms of Service"
                description="Read the terms and conditions for using Pitchrr's AI-powered startup toolkit. Understand your rights and responsibilities as a user."
                canonical="/terms"
            />
            <Header />
            <main className="min-h-screen bg-white max-w-360 mx-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                        <p className="text-gray-600">Last updated: January 2026</p>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing or using Pitchrr ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service. These terms apply to all visitors, users, and others who access or use the Service.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Pitchrr is an AI-powered startup toolkit that helps founders validate ideas, create marketing strategies, design branding, generate pitch decks, and more. The Service operates on a credit-based system where users purchase credits to access various AI-powered features.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                To use certain features, you must create an account. You are responsible for:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Providing accurate and complete information</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Credits and Payments</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Credit System:</strong> Our Service uses a credit-based system. Credits are purchased in packs and used to access AI-powered features.
                            </p>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Payment Processing:</strong> All payments are processed securely through Razorpay. By making a purchase, you agree to Razorpay's terms of service.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Credit Validity:</strong> Purchased credits do not expire and remain in your account until used.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You agree not to use the Service to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Violate any applicable laws or regulations</li>
                                <li>Generate content that is illegal, harmful, or offensive</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt the Service</li>
                                <li>Use automated means to access the Service without permission</li>
                                <li>Infringe upon intellectual property rights of others</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>Our Content:</strong> The Service, including its design, features, and code, is owned by Pitchrr and protected by intellectual property laws.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>Your Content:</strong> You retain ownership of the startup ideas and content you input. By using our AI services, you grant us a license to process your content to provide the Service. AI-generated outputs based on your input are yours to use for your startup.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                The Service is provided "as is" without warranties of any kind. We do not guarantee that:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>AI-generated content will be accurate or suitable for your needs</li>
                                <li>The Service will be uninterrupted or error-free</li>
                                <li>Your startup will succeed based on our recommendations</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                In no event shall Pitchrr be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the Service will cease immediately.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new terms.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in India.
                            </p>
                        </section>

                        {/* <section className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have questions about these Terms, please contact us at:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-6 mt-4">
                                <p className="text-gray-700"><strong>Email:</strong> legal@pitchrr.com</p>
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
