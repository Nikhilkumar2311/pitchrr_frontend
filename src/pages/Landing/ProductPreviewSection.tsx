/**
 * Product Preview Section
 * Auto-sliding carousel showing each module's unique skeleton dashboard.
 * No real content — all placeholders matching the actual module UI structure.
 */

import { forwardRef, useState, useEffect, useCallback } from "react";
import {
    Lightbulb,
    Megaphone,
    Palette,
    Presentation,
    Rocket,
    Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Module definitions ─── */
interface ModuleDef {
    key: string;
    label: string;
    icon: LucideIcon;
    accent: string;
}

const modules: ModuleDef[] = [
    { key: "validation", label: "Idea Validation", icon: Lightbulb, accent: "#4F7DF3" },
    { key: "marketing", label: "Marketing", icon: Megaphone, accent: "#10B981" },
    { key: "branding", label: "Branding", icon: Palette, accent: "#7A5CFF" },
    { key: "pitchdeck", label: "Pitch Deck", icon: Presentation, accent: "#F59E0B" },
    { key: "gtm", label: "GTM Strategy", icon: Rocket, accent: "#EF4444" },
    { key: "competitors", label: "Competitors", icon: Users, accent: "#06B6D4" },
];

const INTERVAL_MS = 4000;

/* ─── Skeleton helpers ─── */
const Skel = ({ w, h = 12, r = 4, bg }: { w: string | number; h?: number; r?: number; bg?: string }) => (
    <div
        className="rounded"
        style={{
            width: typeof w === "number" ? w : w,
            height: h,
            borderRadius: r,
            background: bg || "var(--color-bg-accent)",
        }}
    />
);

const SkelCircle = ({ size = 40, bg }: { size?: number; bg?: string }) => (
    <div
        className="rounded-full shrink-0"
        style={{
            width: size, height: size,
            background: bg || "var(--color-bg-accent)",
        }}
    />
);

/* ─── Unique skeleton content per module ─── */

/** Idea Validation: Score card + Risk heat map (4 bars) + SWOT skeleton */
function ValidationSkeleton({ accent }: { accent: string }) {
    return (
        <div className="space-y-5">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div><Skel w={160} h={18} /><Skel w={100} h={10} bg="var(--color-bg-accent)" /></div>
                <div className="h-9 w-24 rounded-lg" style={{ background: accent, opacity: 0.2 }} />
            </div>
            {/* Score + Heat Map */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl p-5 border" style={{ borderColor: "var(--color-border)" }}>
                    <Skel w={60} h={10} />
                    <div className="mt-3" style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", fontWeight: 700, color: accent }}>84</div>
                    <div className="mt-2 h-1.5 w-full rounded-full" style={{ background: "var(--color-bg-accent)" }}>
                        <div className="h-full rounded-full" style={{ width: "84%", background: accent, opacity: 0.4 }} />
                    </div>
                </div>
                <div className="sm:col-span-2 rounded-xl p-5 border" style={{ borderColor: "var(--color-border)" }}>
                    <Skel w={100} h={10} />
                    <div className="flex items-end gap-3 h-24 mt-3">
                        {[65, 80, 45, 90].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: accent, opacity: 0.15 + (h / 100) * 0.45 }} />
                        ))}
                    </div>
                </div>
            </div>
            {/* SWOT skeleton */}
            <div className="grid grid-cols-2 gap-3">
                {[0.9, 0.7, 0.5, 0.6].map((i) => (
                    <div key={i} className="rounded-lg p-3 border" style={{ borderColor: "var(--color-border)" }}>
                        <Skel w={50} h={8} />
                        <div className="mt-2 space-y-1.5">
                            <Skel w="90%" h={6} bg={`${accent}18`} /><Skel w="70%" h={6} bg={`${accent}12`} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Marketing: Funnel bars + Channel chips + Timeline skeleton */
function MarketingSkeleton({ accent }: { accent: string }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div><Skel w={140} h={18} /><Skel w={90} h={10} /></div>
                <div className="h-9 w-24 rounded-lg" style={{ background: accent, opacity: 0.2 }} />
            </div>
            {/* Funnel */}
            <div className="rounded-xl p-5 border" style={{ borderColor: "var(--color-border)" }}>
                <Skel w={80} h={10} />
                <div className="mt-4 space-y-2">
                    {[100, 78, 54, 32].map((w, i) => (
                        <div key={i} className="mx-auto rounded" style={{ width: `${w}%`, height: 18, background: accent, opacity: 0.1 + i * 0.08 }} />
                    ))}
                </div>
            </div>
            {/* Channel chips */}
            <div className="flex flex-wrap gap-2">
                {[70, 90, 55, 80, 65].map((w, i) => (
                    <div key={i} className="rounded-full" style={{ width: w, height: 28, background: `${accent}12`, border: `1px solid ${accent}20` }} />
                ))}
            </div>
            {/* Timeline skeleton */}
            <div className="space-y-2">
                <Skel w="100%" h={8} /><Skel w="80%" h={8} bg={`${accent}10`} /><Skel w="60%" h={8} />
            </div>
        </div>
    );
}

/** Branding: Color palette circles + Logo placeholder + Tagline skeleton */
function BrandingSkeleton({ accent }: { accent: string }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div><Skel w={120} h={18} /><Skel w={80} h={10} /></div>
                <div className="h-9 w-24 rounded-lg" style={{ background: accent, opacity: 0.2 }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Logo area */}
                <div className="rounded-xl p-5 border flex items-center justify-center" style={{ borderColor: "var(--color-border)", minHeight: 140 }}>
                    <div className="w-20 h-20 rounded-2xl" style={{ background: `${accent}15` }} />
                </div>
                {/* Color palette + font */}
                <div className="rounded-xl p-5 border space-y-4" style={{ borderColor: "var(--color-border)" }}>
                    <Skel w={80} h={10} />
                    <div className="flex gap-3">
                        {["#376EF9", "#06B6D4", "#10B981", "#1F2937", "#9CA3AF"].map((c) => (
                            <SkelCircle key={c} size={28} bg={c} />
                        ))}
                    </div>
                    <div className="space-y-2 mt-2">
                        <Skel w={60} h={8} /><Skel w="100%" h={14} bg={`${accent}10`} />
                    </div>
                </div>
            </div>
            {/* Tagline skeleton */}
            <div className="rounded-xl p-4 border space-y-2" style={{ borderColor: "var(--color-border)" }}>
                <Skel w={70} h={8} />
                <Skel w="85%" h={10} bg={`${accent}10`} />
                <Skel w="65%" h={10} bg={`${accent}08`} />
            </div>
        </div>
    );
}

/** Pitch Deck: Slide preview cards + slide counter */
function PitchDeckSkeleton({ accent }: { accent: string }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div><Skel w={130} h={18} /><Skel w={80} h={10} /></div>
                <div className="flex gap-2">
                    <div className="h-9 w-20 rounded-lg" style={{ background: accent, opacity: 0.2 }} />
                    <div className="h-9 w-20 rounded-lg border" style={{ borderColor: "var(--color-border)" }} />
                </div>
            </div>
            {/* Slide previews */}
            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="rounded-xl border p-3 space-y-2" style={{ borderColor: n === 1 ? accent : "var(--color-border)", borderWidth: n === 1 ? 2 : 1, aspectRatio: "16/10" }}>
                        <Skel w="70%" h={8} bg={n === 1 ? `${accent}25` : undefined} />
                        <Skel w="100%" h={6} /><Skel w="85%" h={6} /><Skel w="60%" h={6} />
                    </div>
                ))}
            </div>
            {/* Bottom: slide counter + nav */}
            <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="rounded" style={{ width: n === 1 ? 20 : 8, height: 8, background: n === 1 ? accent : "var(--color-border)", opacity: n === 1 ? 0.7 : 0.3 }} />
                    ))}
                </div>
                <Skel w={60} h={10} />
            </div>
        </div>
    );
}

/** GTM Strategy: Timeline steps + KPI cards + Pricing skeleton */
function GTMSkeleton({ accent }: { accent: string }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div><Skel w={150} h={18} /><Skel w={90} h={10} /></div>
                <div className="h-9 w-24 rounded-lg" style={{ background: accent, opacity: 0.2 }} />
            </div>
            {/* Timeline */}
            <div className="rounded-xl p-5 border" style={{ borderColor: "var(--color-border)" }}>
                <Skel w={80} h={10} />
                <div className="mt-4 flex items-center gap-0">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="flex-1 flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full" style={{ background: accent, opacity: 0.2 + n * 0.15 }} />
                            <div className="w-full h-0.5 mt-2" style={{ background: n < 4 ? `${accent}20` : "transparent" }} />
                            <Skel w={40} h={6} />
                        </div>
                    ))}
                </div>
            </div>
            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-3">
                {[0.7, 0.85, 0.6].map((i) => (
                    <div key={i} className="rounded-xl p-4 border" style={{ borderColor: "var(--color-border)" }}>
                        <Skel w={50} h={8} />
                        <div className="mt-2" style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 700, color: accent, opacity: 0.35 }}>—</div>
                    </div>
                ))}
            </div>
            <div className="space-y-2"><Skel w="100%" h={8} /><Skel w="75%" h={8} /></div>
        </div>
    );
}

/** Competitor Analysis: Comparison table skeleton + SWOT chips */
function CompetitorSkeleton({ accent }: { accent: string }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div><Skel w={160} h={18} /><Skel w={100} h={10} /></div>
                <div className="h-9 w-24 rounded-lg" style={{ background: accent, opacity: 0.2 }} />
            </div>
            {/* Comparison table */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                {/* Header row */}
                <div className="grid grid-cols-4 gap-0 px-4 py-3" style={{ background: `${accent}08` }}>
                    {[60, 70, 70, 70].map((w, i) => <Skel key={i} w={w} h={8} bg={`${accent}18`} />)}
                </div>
                {/* Data rows */}
                {[0, 1, 2].map((r) => (
                    <div key={r} className="grid grid-cols-4 gap-0 px-4 py-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                        <Skel w={50} h={8} /><Skel w={45} h={8} /><Skel w={45} h={8} /><Skel w={45} h={8} />
                    </div>
                ))}
            </div>
            {/* SWOT chips */}
            <div className="flex flex-wrap gap-2">
                {[80, 65, 90, 55, 75].map((w, i) => (
                    <div key={i} className="rounded-full" style={{ width: w, height: 26, background: `${accent}10`, border: `1px solid ${accent}18` }} />
                ))}
            </div>
        </div>
    );
}

/* ─── Skeleton renderer ─── */
const skeletonMap: Record<string, React.FC<{ accent: string }>> = {
    validation: ValidationSkeleton,
    marketing: MarketingSkeleton,
    branding: BrandingSkeleton,
    pitchdeck: PitchDeckSkeleton,
    gtm: GTMSkeleton,
    competitors: CompetitorSkeleton,
};

/* ═══════════════════════════════════════ */

export const ProductPreviewSection = forwardRef<HTMLElement>((_, ref) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % modules.length);
    }, []);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(nextSlide, INTERVAL_MS);
        return () => clearInterval(timer);
    }, [isHovered, nextSlide]);

    const active = modules[activeIndex];
    const SkeletonComponent = skeletonMap[active.key];

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
                <div
                    className="product-preview gsap-reveal mock-browser max-w-240 mx-auto"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
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
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <div className="w-7 h-7 rounded-lg" style={{ background: "var(--color-gradient)" }} />
                                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "14px", color: "var(--color-text-primary)" }}>
                                    Pitchrr
                                </span>
                            </div>

                            <div className="space-y-1">
                                {modules.map((mod, i) => (
                                    <button
                                        key={mod.key}
                                        onClick={() => setActiveIndex(i)}
                                        className="w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300"
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            background: i === activeIndex ? "white" : "transparent",
                                            color: i === activeIndex ? active.accent : "var(--color-text-muted)",
                                            boxShadow: i === activeIndex ? "var(--shadow-soft)" : "none",
                                            borderLeft: i === activeIndex ? `3px solid ${active.accent}` : "3px solid transparent",
                                        }}
                                    >
                                        {mod.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main content — cross-fading skeleton */}
                        <div className="flex-1 p-6 lg:p-8 relative overflow-hidden">
                            <div key={active.key} className="preview-slide">
                                {SkeletonComponent && <SkeletonComponent accent={active.accent} />}
                            </div>
                        </div>
                    </div>

                    {/* Progress dots */}
                    <div
                        className="flex items-center justify-center gap-2 py-4 border-t"
                        style={{ borderColor: "var(--color-border)" }}
                    >
                        {modules.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className="transition-all duration-300"
                                style={{
                                    width: i === activeIndex ? 24 : 8,
                                    height: 8,
                                    borderRadius: 4,
                                    background: i === activeIndex ? active.accent : "var(--color-border)",
                                    opacity: i === activeIndex ? 1 : 0.5,
                                }}
                                aria-label={`Go to ${modules[i].label}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
});

ProductPreviewSection.displayName = "ProductPreviewSection";
