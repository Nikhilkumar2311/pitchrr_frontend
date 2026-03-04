/**
 * Footer Component - Updated for redesigned landing page
 */

import { Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
    product: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "Roadmap", href: "#" },
    ],
    company: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "/contact" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Refund Policy", href: "/refund" },
    ],
};

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
    return (
        <footer
            className="relative border-t"
            style={{
                borderColor: "var(--color-border)",
                background: "var(--color-bg-light)",
            }}
        >
            {/* Gradient top line */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "var(--color-gradient)" }}
            />

            <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
                {/* Main footer content */}
                <div className="py-14 lg:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
                        {/* Brand column */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="/logo.svg" alt="Pitchrr" className="h-9" />
                            </div>
                            <p
                                className="mb-6 max-w-sm"
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.9rem",
                                    lineHeight: 1.7,
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                Turn your startup idea into reality with AI-powered tools.
                                From validation to pitch deck, we've got you covered.
                            </p>

                            {/* Social links */}
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <Link
                                            key={social.label}
                                            to={social.href}
                                            aria-label={social.label}
                                            className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 hover:scale-110"
                                            style={{
                                                borderColor: "var(--color-border)",
                                                color: "var(--color-text-muted)",
                                                background: "white",
                                            }}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Product links */}
                        <div>
                            <h3
                                className="mb-4"
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                Product
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.product.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="transition-colors duration-200 hover:text-[var(--color-primary-blue)]"
                                            style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: "0.85rem",
                                                color: "var(--color-text-muted)",
                                            }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company links */}
                        <div>
                            <h3
                                className="mb-4"
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                Company
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="transition-colors duration-200 hover:text-[var(--color-primary-blue)]"
                                            style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: "0.85rem",
                                                color: "var(--color-text-muted)",
                                            }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal links */}
                        <div>
                            <h3
                                className="mb-4"
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    fontSize: "0.85rem",
                                    fontWeight: 600,
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                Legal
                            </h3>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="transition-colors duration-200 hover:text-[var(--color-primary-blue)]"
                                            style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: "0.85rem",
                                                color: "var(--color-text-muted)",
                                            }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="border-t py-6"
                    style={{ borderColor: "var(--color-border)" }}
                >
                    <p
                        className="text-center"
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8rem",
                            color: "var(--color-text-muted)",
                        }}
                    >
                        © {new Date().getFullYear()} Pitchrr. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}