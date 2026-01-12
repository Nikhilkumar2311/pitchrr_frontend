/**
 * Footer Component for Landing Page
 * Professional footer with social links and proper structure
 */

import { Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
    product: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Roadmap', href: '#' },
    ],
    company: [
        { label: 'About Us', href: '/about', isRoute: true },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '/contact', isRoute: true },
    ],
    legal: [
        { label: 'Privacy Policy', href: '/privacy', isRoute: true },
        { label: 'Terms of Service', href: '/terms', isRoute: true },
        { label: 'Refund Policy', href: '/refund', isRoute: true },
    ],
};

const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
];

export function Footer() {
    return (
        <footer className="relative bg-gray-50 border-t border-gray-200 p-2">
            {/* Main Footer Content */}
            <div className="py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/logo.svg" alt="Pitchrr" className="h-8" />
                        </div>
                        <p className="text-gray-600 mb-6 max-w-sm leading-relaxed">
                            Turn your startup idea into reality with AI-powered tools.
                            From validation to pitch deck, we've got you covered.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <Link
                                        key={social.label}
                                        to={social.href}
                                        aria-label={social.label}
                                        className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-110"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-200 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        © {new Date().getFullYear()} Pitchrr. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Decorative linear line at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
        </footer>
    );
}