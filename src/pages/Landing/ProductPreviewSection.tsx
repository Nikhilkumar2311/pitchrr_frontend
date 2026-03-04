/**
 * Product Preview Section
 * CSS-rendered realistic dashboard mockup — no images needed.
 */

import { forwardRef } from "react";

const sidebarItems = [
    { label: "Idea Validation", active: true },
    { label: "Marketing", active: false },
    { label: "Branding", active: false },
    { label: "Pitch Deck", active: false },
    { label: "GTM Strategy", active: false },
    { label: "Competitors", active: false },
];

export const ProductPreviewSection = forwardRef<HTMLElement>((_, ref) => {
    return (
        <section
            ref={ref}
            className="relative py-24 lg:py-32"
            style={{ background: "var(--color-bg-light)" }}
        >
            <div className="max-w-275 mx-auto px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p
                        className="text-[13px] font-semibold uppercase tracking-[0.15em] mb-4"
                        style={{ color: "var(--color-primary-blue)", fontFamily: "var(--font-body)" }}
                    >
                        Product Preview
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
                        Your startup{" "}
                        <span className="gradient-text">workspace</span>
                    </h2>
                    <p
                        className="gsap-reveal mt-4 mx-auto max-w-120"
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "1.05rem",
                            lineHeight: 1.7,
                            color: "var(--color-text-muted)",
                        }}
                    >
                        A clean, guided dashboard where every module is just a click away.
                    </p>
                </div>

                {/* Mock Browser */}
                <div className="product-preview gsap-reveal mock-browser max-w-240 mx-auto">
                    {/* Browser bar */}
                    <div className="mock-browser-bar">
                        <div className="mock-browser-dot" style={{ background: "#FF5F57" }} />
                        <div className="mock-browser-dot" style={{ background: "#FEBC2E" }} />
                        <div className="mock-browser-dot" style={{ background: "#28C840" }} />
                        <div className="mock-browser-url">
                            pitchrr.in/dashboard
                        </div>
                    </div>

                    {/* Dashboard content */}
                    <div className="flex min-h-105">
                        {/* Sidebar */}
                        <div
                            className="hidden md:flex flex-col w-50 shrink-0 py-5 px-4 border-r"
                            style={{ borderColor: "var(--color-border)", background: "var(--color-bg-light)" }}
                        >
                            {/* Logo placeholder */}
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <div
                                    className="w-7 h-7 rounded-lg"
                                    style={{ background: "var(--color-gradient)" }}
                                />
                                <span
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        color: "var(--color-text-primary)",
                                    }}
                                >
                                    Pitchrr
                                </span>
                            </div>

                            {/* Nav items */}
                            <div className="space-y-1">
                                {sidebarItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            background: item.active ? "white" : "transparent",
                                            color: item.active ? "var(--color-primary-blue)" : "var(--color-text-muted)",
                                            boxShadow: item.active ? "var(--shadow-soft)" : "none",
                                        }}
                                    >
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main content area */}
                        <div className="flex-1 p-6 lg:p-8 space-y-6">
                            {/* Header bar */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div
                                        className="h-5 w-40 rounded"
                                        style={{ background: "var(--color-bg-accent)" }}
                                    />
                                    <div
                                        className="h-3 w-28 rounded mt-2"
                                        style={{ background: "var(--color-bg-accent)", opacity: 0.6 }}
                                    />
                                </div>
                                <div
                                    className="h-9 w-24 rounded-lg"
                                    style={{ background: "var(--color-gradient)", opacity: 0.8 }}
                                />
                            </div>

                            {/* Content cards row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Score card */}
                                <div
                                    className="rounded-xl p-5 border"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    <div
                                        className="h-3 w-16 rounded mb-3"
                                        style={{ background: "var(--color-bg-accent)" }}
                                    />
                                    <div
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontSize: "2rem",
                                            fontWeight: 700,
                                            color: "var(--color-primary-blue)",
                                        }}
                                    >
                                        84
                                    </div>
                                    <div
                                        className="h-2 w-24 rounded mt-2"
                                        style={{ background: "var(--color-bg-accent)", opacity: 0.5 }}
                                    />
                                </div>

                                {/* Chart placeholder */}
                                <div
                                    className="sm:col-span-2 rounded-xl p-5 border"
                                    style={{ borderColor: "var(--color-border)" }}
                                >
                                    <div
                                        className="h-3 w-24 rounded mb-4"
                                        style={{ background: "var(--color-bg-accent)" }}
                                    />
                                    {/* Fake chart bars */}
                                    <div className="flex items-end gap-3 h-25">
                                        {[65, 80, 45, 90, 70, 55, 85].map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 rounded-t-md transition-all"
                                                style={{
                                                    height: `${h}%`,
                                                    background: i % 2 === 0
                                                        ? "var(--color-primary-blue)"
                                                        : "var(--color-primary-violet)",
                                                    opacity: 0.2 + (h / 100) * 0.6,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Text skeleton lines */}
                            <div className="space-y-3">
                                <div className="h-3 w-full rounded" style={{ background: "var(--color-bg-accent)" }} />
                                <div className="h-3 w-4/5 rounded" style={{ background: "var(--color-bg-accent)", opacity: 0.7 }} />
                                <div className="h-3 w-3/5 rounded" style={{ background: "var(--color-bg-accent)", opacity: 0.5 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

ProductPreviewSection.displayName = "ProductPreviewSection";
