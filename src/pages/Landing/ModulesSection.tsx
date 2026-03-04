/**
 * Modules Section Component - Redesigned
 * Interactive hover-expand panels for 6 core product modules.
 */

import { forwardRef } from "react";
import {
    Lightbulb,
    Megaphone,
    Palette,
    Presentation,
    Rocket,
    Users,
} from "lucide-react";

const modules = [
    {
        icon: Lightbulb,
        title: "Idea Validation",
        description:
            "Get an AI-powered viability score, SWOT analysis, and risk heat map for your startup idea.",
        accent: "#4F7DF3",
        accentBg: "rgba(79,125,243,0.08)",
    },
    {
        icon: Megaphone,
        title: "Marketing Strategy",
        description:
            "30-day marketing plan, funnel strategy, and customer personas tailored to your startup.",
        accent: "#10B981",
        accentBg: "rgba(16,185,129,0.08)",
    },
    {
        icon: Palette,
        title: "Branding",
        description:
            "AI-generated logos, taglines, brand colors, and a complete brand kit for your startup.",
        accent: "#7A5CFF",
        accentBg: "rgba(122,92,255,0.08)",
    },
    {
        icon: Presentation,
        title: "Pitch Deck",
        description:
            "Professional pitch deck templates with AI-generated slides and easy editing tools.",
        accent: "#F59E0B",
        accentBg: "rgba(245,158,11,0.08)",
    },
    {
        icon: Rocket,
        title: "GTM Strategy",
        description:
            "Go-to-market plan with target users, pricing strategy, and launch timeline.",
        accent: "#EF4444",
        accentBg: "rgba(239,68,68,0.08)",
    },
    {
        icon: Users,
        title: "Competitor Analysis",
        description:
            "Compare your startup with competitors, analyze features, and find your competitive edge.",
        accent: "#06B6D4",
        accentBg: "rgba(6,182,212,0.08)",
    },
];

export const ModulesSection = forwardRef<HTMLElement>((_, ref) => {
    return (
        <section
            id="features"
            ref={ref}
            className="relative py-24 lg:py-32"
            style={{ background: "var(--color-bg-light)" }}
        >
            <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-12">
                    <p
                        className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-4"
                        style={{ color: "var(--color-primary-blue)", fontFamily: "var(--font-body)" }}
                    >
                        Core Modules
                    </p>
                    <h2
                        className="gsap-reveal"
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "clamp(2rem, 4vw, 3rem)",
                            fontWeight: 700,
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                            color: "var(--color-text-primary)",
                        }}
                    >
                        Everything you need to{" "}
                        <span className="gradient-text">launch</span>
                    </h2>
                    <p
                        className="gsap-reveal mt-4 mx-auto max-w-[500px]"
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "1.05rem",
                            lineHeight: 1.7,
                            color: "var(--color-text-muted)",
                        }}
                    >
                        Six integrated modules that take you from raw idea to
                        investor-ready startup.
                    </p>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {modules.map((mod) => {
                        const Icon = mod.icon;
                        return (
                            <div
                                key={mod.title}
                                className="module-card feature-card py-5 px-6"
                            >
                                {/* Accent line */}
                                <div
                                    className="module-accent h-[3px] rounded-full mb-3 mx-auto"
                                    style={{ background: mod.accent }}
                                />

                                {/* Icon + Title */}
                                <div className="flex items-center justify-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                                        style={{ background: mod.accentBg }}
                                    >
                                        <Icon
                                            className="w-5 h-5"
                                            style={{ color: mod.accent }}
                                        />
                                    </div>
                                    <h3
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontSize: "0.95rem",
                                            fontWeight: 600,
                                            color: "var(--color-text-primary)",
                                        }}
                                    >
                                        {mod.title}
                                    </h3>
                                </div>

                                {/* Expandable description */}
                                <p
                                    className="module-description"
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.85rem",
                                        lineHeight: 1.6,
                                        color: "var(--color-text-muted)",
                                        textAlign: "center",
                                    }}
                                >
                                    {mod.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
});

ModulesSection.displayName = "ModulesSection";
