/**
 * AI Generating Skeleton
 * 
 * Content-aware skeleton loader displayed while AI modules are generating.
 * Replaces the simple spinner strip with a skeleton that mimics the shape
 * of the actual result sections, giving users visual feedback about what's
 * coming.
 * 
 * Uses pure CSS shimmer animation — no external dependencies.
 */

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

// ── Reusable shimmer bar ────────────────────────────────────────────────
const Shimmer = ({
    w = '100%',
    h = '12px',
    radius = '6px',
    className = '',
}: {
    w?: string;
    h?: string;
    radius?: string;
    className?: string;
}) => (
    <div
        className={`ai-shimmer ${className}`}
        style={{
            width: w,
            height: h,
            borderRadius: radius,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(79,125,243,0.06) 50%, rgba(0,0,0,0.04) 75%)',
            backgroundSize: '200% 100%',
            animation: 'ai-shimmer-move 1.5s ease-in-out infinite',
        }}
    />
);

// ── Module-specific skeleton shapes ─────────────────────────────────────

const IdeaValidationSkeleton = () => (
    <div className="space-y-6">
        {/* Idea Score */}
        <div>
            <Shimmer w="80px" h="8px" />
            <div className="flex items-center gap-3 mt-3">
                <Shimmer w="80px" h="48px" radius="10px" />
                <Shimmer w="60px" h="24px" radius="8px" />
            </div>
            <Shimmer w="100%" h="8px" radius="4px" className="mt-3" />
            <Shimmer w="90%" h="14px" className="mt-3" />
            <Shimmer w="70%" h="14px" className="mt-1" />
        </div>

        {/* Risk Assessment */}
        <div>
            <Shimmer w="140px" h="18px" className="mb-3" />
            <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <Shimmer w="120px" h="14px" />
                        <Shimmer w="60px" h="22px" radius="6px" />
                    </div>
                ))}
            </div>
        </div>

        {/* SWOT */}
        <div>
            <Shimmer w="120px" h="18px" className="mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2].map(i => (
                    <div key={i} className="p-4 rounded-[12px]" style={{ background: i === 1 ? 'rgba(34,197,94,0.03)' : 'rgba(239,68,68,0.03)' }}>
                        <Shimmer w="90px" h="14px" className="mb-3" />
                        <div className="space-y-2">
                            {[1, 2, 3].map(j => (
                                <Shimmer key={j} w={`${85 - j * 10}%`} h="13px" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Market Demand */}
        <div>
            <Shimmer w="180px" h="18px" className="mb-3" />
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3.5 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <div>
                            <Shimmer w="80px" h="10px" className="mb-1" />
                            <Shimmer w="140px" h="14px" />
                        </div>
                        <Shimmer w="100px" h="14px" />
                    </div>
                ))}
            </div>
        </div>

        {/* Recommendations */}
        <div>
            <Shimmer w="160px" h="18px" className="mb-3" />
            <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <Shimmer w="24px" h="24px" radius="6px" />
                        <div className="flex-1 space-y-1">
                            <Shimmer w={`${90 - i * 5}%`} h="13px" />
                            <Shimmer w={`${70 - i * 5}%`} h="13px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ── Marketing Strategy skeleton ─────────────────────────────────────────
const MarketingStrategySkeleton = () => (
    <div className="space-y-6">
        {/* 30-Day Plan */}
        <div>
            <Shimmer w="180px" h="18px" className="mb-3" />
            <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <Shimmer w="120px" h="14px" className="mb-2" />
                        <div className="space-y-1.5">
                            {[1, 2, 3].map(j => (
                                <div key={j} className="flex items-start gap-2">
                                    <Shimmer w="6px" h="6px" radius="50%" className="mt-1" />
                                    <Shimmer w={`${90 - j * 12}%`} h="13px" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Target Segments */}
        <div>
            <Shimmer w="140px" h="18px" className="mb-3" />
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <div className="flex items-center justify-between mb-1">
                            <Shimmer w="110px" h="14px" />
                            <Shimmer w="60px" h="22px" radius="6px" />
                        </div>
                        <Shimmer w="85%" h="13px" className="mt-1" />
                    </div>
                ))}
            </div>
        </div>

        {/* Channels */}
        <div>
            <Shimmer w="160px" h="18px" className="mb-3" />
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <div className="flex items-center justify-between mb-2.5">
                            <Shimmer w="100px" h="14px" />
                            <Shimmer w="50px" h="22px" radius="6px" />
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {[1, 2, 3].map(j => (
                                <Shimmer key={j} w={`${60 + j * 10}px`} h="24px" radius="12px" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* KPIs */}
        <div>
            <Shimmer w="200px" h="18px" className="mb-3" />
            <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                    <Shimmer key={i} w={`${80 + i * 10}px`} h="36px" radius="8px" />
                ))}
            </div>
        </div>
    </div>
);

// ── Branding skeleton ───────────────────────────────────────────────────
const BrandingSkeleton = () => (
    <div className="space-y-6">
        {/* Logo Editor area */}
        <div>
            <Shimmer w="100px" h="18px" className="mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="rounded-[12px] aspect-square" style={{ background: 'rgba(0,0,0,0.02)' }}>
                        <Shimmer w="100%" h="100%" radius="12px" />
                    </div>
                ))}
            </div>
        </div>

        {/* Brand Name */}
        <div className="text-center py-6 rounded-[12px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
            <Shimmer w="180px" h="32px" className="mx-auto" />
            <Shimmer w="220px" h="14px" className="mx-auto mt-2" />
        </div>

        {/* Taglines */}
        <div>
            <Shimmer w="160px" h="18px" className="mb-3" />
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-3.5 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <Shimmer w={`${85 - i * 10}%`} h="13px" />
                    </div>
                ))}
            </div>
        </div>

        {/* Brand Voice */}
        <div>
            <Shimmer w="110px" h="18px" className="mb-3" />
            <Shimmer w="80px" h="13px" className="mb-2" />
            <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <Shimmer key={i} w={`${50 + i * 8}px`} h="28px" radius="6px" />
                ))}
            </div>
            <Shimmer w="90%" h="13px" className="mt-3" />
            <Shimmer w="70%" h="13px" className="mt-1" />
        </div>

        {/* Color Palette */}
        <div>
            <Shimmer w="200px" h="18px" className="mb-3" />
            <div className="flex flex-wrap gap-3">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <Shimmer w="56px" h="56px" radius="8px" />
                        <Shimmer w="50px" h="12px" />
                        <Shimmer w="60px" h="11px" radius="4px" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ── Competitor Analysis skeleton ────────────────────────────────────────
const CompetitorAnalysisSkeleton = () => (
    <div className="space-y-6">
        {/* Competitor Cards */}
        <div>
            <Shimmer w="140px" h="18px" className="mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 rounded-[12px]" style={{ background: 'rgba(0,0,0,0.018)' }}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0">
                                <Shimmer w="120px" h="14px" />
                                <Shimmer w="160px" h="12px" className="mt-1" />
                            </div>
                            <Shimmer w="60px" h="24px" radius="6px" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 mt-3">
                            <div className="flex-1">
                                <Shimmer w="70px" h="11px" className="mb-1.5" />
                                <div className="flex flex-wrap gap-1">
                                    {[1, 2].map(j => (
                                        <Shimmer key={j} w={`${50 + j * 15}px`} h="22px" radius="11px" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1">
                                <Shimmer w="80px" h="11px" className="mb-1.5" />
                                <div className="flex flex-wrap gap-1">
                                    {[1, 2].map(j => (
                                        <Shimmer key={j} w={`${45 + j * 12}px`} h="22px" radius="11px" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Market Overview */}
        <div>
            <Shimmer w="150px" h="18px" className="mb-3" />
            <div className="p-4 rounded-[12px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                <Shimmer w="100%" h="13px" />
                <Shimmer w="95%" h="13px" className="mt-1.5" />
                <Shimmer w="80%" h="13px" className="mt-1.5" />
            </div>
        </div>

        {/* Competitive Positioning */}
        <div>
            <Shimmer w="180px" h="18px" className="mb-4" />
            <div className="space-y-1.5">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-[8px]" style={{ background: 'rgba(52,211,153,0.05)' }}>
                        <Shimmer w="6px" h="6px" radius="50%" className="mt-1" />
                        <Shimmer w={`${90 - i * 8}%`} h="13px" />
                    </div>
                ))}
            </div>
        </div>

        {/* Recommendations */}
        <div>
            <Shimmer w="200px" h="18px" className="mb-4" />
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.018)' }}>
                        <Shimmer w="20px" h="20px" radius="10px" />
                        <Shimmer w={`${88 - i * 6}%`} h="13px" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ── GTM Strategy skeleton ───────────────────────────────────────────────
const GTMStrategySkeleton = () => (
    <div className="space-y-6">
        {/* Target Users */}
        <div>
            <Shimmer w="120px" h="18px" className="mb-4" />
            <div className="space-y-2.5">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-3.5 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.018)' }}>
                        <div className="flex items-center justify-between mb-1">
                            <Shimmer w="110px" h="14px" />
                            <Shimmer w="45px" h="18px" radius="10px" />
                        </div>
                        <Shimmer w="85%" h="13px" className="mt-1" />
                    </div>
                ))}
            </div>
        </div>

        {/* Pricing Strategy */}
        <div>
            <Shimmer w="150px" h="18px" className="mb-4" />
            <div className="p-4 rounded-[12px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                <div className="flex items-center justify-between mb-2">
                    <Shimmer w="90px" h="12px" />
                    <Shimmer w="70px" h="20px" radius="10px" />
                </div>
                <Shimmer w="95%" h="13px" />
                <Shimmer w="80%" h="13px" className="mt-1" />
                <div className="space-y-2.5 pt-3 mt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center">
                            <Shimmer w="80px" h="13px" />
                            <Shimmer w="60px" h="13px" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Launch Plan Timeline */}
        <div>
            <Shimmer w="180px" h="18px" className="mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 rounded-[12px]" style={{ background: 'rgba(0,0,0,0.015)', borderLeft: '3px solid rgba(0,0,0,0.06)' }}>
                        <Shimmer w="80px" h="14px" className="mb-0.5" />
                        <Shimmer w="60px" h="11px" className="mb-2.5" />
                        <div className="space-y-1.5">
                            {[1, 2].map(j => (
                                <div key={j} className="flex items-start gap-2">
                                    <Shimmer w="6px" h="6px" radius="50%" className="mt-1" />
                                    <Shimmer w={`${85 - j * 15}%`} h="12px" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Growth + KPIs */}
        <div>
            <Shimmer w="150px" h="18px" className="mb-4" />
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.018)' }}>
                        <Shimmer w={`${120 + i * 10}px`} h="13px" />
                        <Shimmer w="60px" h="22px" radius="10px" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ── Pitch Deck skeleton ─────────────────────────────────────────────────
const PitchDeckSkeleton = () => (
    <div className="space-y-6">
        {/* Slide Thumbnails Grid */}
        <div>
            <Shimmer w="100px" h="18px" className="mb-3" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="rounded-[10px] overflow-hidden" style={{ background: 'rgba(0,0,0,0.02)' }}>
                        <div style={{ aspectRatio: '16/9', background: 'rgba(0,0,0,0.03)' }} className="p-3">
                            <Shimmer w="60%" h="10px" className="mb-1.5" />
                            <Shimmer w="80%" h="6px" className="mt-1" />
                            <Shimmer w="50%" h="6px" className="mt-0.5" />
                        </div>
                        <div className="px-2 py-1.5">
                            <Shimmer w="80%" h="10px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Slide preview area */}
        <div className="rounded-[12px] overflow-hidden" style={{ background: 'rgba(0,0,0,0.02)', aspectRatio: '16/9' }}>
            <div className="p-8 h-full flex flex-col">
                <Shimmer w="50%" h="24px" className="mb-4" />
                <Shimmer w="40%" h="4px" radius="2px" className="mb-4" />
                <Shimmer w="80%" h="14px" className="mb-2" />
                <Shimmer w="70%" h="14px" className="mb-2" />
                <Shimmer w="60%" h="14px" />
                <div className="mt-auto flex justify-between">
                    <Shimmer w="60px" h="10px" />
                    <Shimmer w="30px" h="10px" />
                </div>
            </div>
        </div>
    </div>
);

// ── Grants skeleton ─────────────────────────────────────────────────────
const GrantsSkeleton = () => (
    <div className="space-y-6">
        {/* Recommended Grants */}
        <div>
            <Shimmer w="220px" h="18px" className="mb-1" />
            <Shimmer w="300px" h="13px" className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div
                        key={i}
                        className="p-4 rounded-[12px]"
                        style={{ background: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)' }}
                    >
                        <Shimmer w={`${80 - i * 5}%`} h="14px" className="mb-2" />
                        <Shimmer w="60px" h="20px" radius="10px" className="mb-2" />
                        <Shimmer w="90%" h="13px" className="mt-1" />
                        <Shimmer w="75%" h="13px" className="mt-1" />
                        <Shimmer w="80px" h="12px" className="mt-2" />
                    </div>
                ))}
            </div>
        </div>

        {/* Roadmap */}
        <div>
            <Shimmer w="240px" h="18px" className="mb-1" />
            <Shimmer w="320px" h="13px" className="mb-5" />
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center shrink-0">
                            <Shimmer w="48px" h="48px" radius="50%" />
                            {i < 3 && <div className="w-0.5 flex-1 mt-2" style={{ background: 'rgba(0,0,0,0.06)', minHeight: 40 }} />}
                        </div>
                        <div className="flex-1 pb-2">
                            <Shimmer w="100px" h="15px" className="mb-1" />
                            <Shimmer w="90%" h="13px" className="mb-3" />
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {[1, 2, 3].map(j => (
                                    <Shimmer key={j} w={`${70 + j * 10}px`} h="24px" radius="12px" />
                                ))}
                            </div>
                            <div className="rounded-[10px] p-3" style={{ background: 'rgba(0,0,0,0.015)' }}>
                                <Shimmer w="60px" h="11px" className="mb-2" />
                                {[1, 2].map(j => (
                                    <div key={j} className="flex items-start gap-2 py-0.5">
                                        <Shimmer w="16px" h="16px" radius="50%" className="mt-0.5" />
                                        <Shimmer w={`${80 - j * 10}%`} h="13px" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const GenericModuleSkeleton = () => (
    <div className="space-y-5">
        {/* Section 1 */}
        <div>
            <Shimmer w="160px" h="18px" className="mb-3" />
            <div className="space-y-2">
                {[1, 2, 3].map(i => (
                    <div key={i} className="p-3.5 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <Shimmer w={`${90 - i * 10}%`} h="14px" className="mb-1" />
                        <Shimmer w={`${70 - i * 5}%`} h="12px" />
                    </div>
                ))}
            </div>
        </div>

        {/* Section 2 */}
        <div>
            <Shimmer w="140px" h="18px" className="mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-4 rounded-[12px]" style={{ background: 'rgba(0,0,0,0.02)' }}>
                        <Shimmer w="100px" h="14px" className="mb-2" />
                        <Shimmer w="80%" h="12px" />
                        <Shimmer w="60%" h="12px" className="mt-1" />
                    </div>
                ))}
            </div>
        </div>

        {/* Section 3 */}
        <div>
            <Shimmer w="120px" h="18px" className="mb-3" />
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-[10px]" style={{ background: 'rgba(0,0,0,0.015)' }}>
                        <Shimmer w="24px" h="24px" radius="6px" />
                        <Shimmer w={`${85 - i * 5}%`} h="13px" />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ── Module type → skeleton mapping ──────────────────────────────────────
const skeletonMap: Record<string, React.FC> = {
    idea_validation: IdeaValidationSkeleton,
    marketing_strategy: MarketingStrategySkeleton,
    branding: BrandingSkeleton,
    competitor_analysis: CompetitorAnalysisSkeleton,
    gtm_strategy: GTMStrategySkeleton,
    pitch_deck: PitchDeckSkeleton,
    grants: GrantsSkeleton,
};

interface AIGeneratingSkeletonProps {
    moduleType?: string;
    moduleName?: string;
}

/**
 * AI Generating Skeleton
 * 
 * Drop-in replacement for the spinner strip shown during AI generation.
 * Renders a module-specific skeleton that mimics the layout of real results.
 * 
 * @param moduleType - e.g. "idea_validation", "branding"
 * @param moduleName - Human-readable name for the header
 */
export const AIGeneratingSkeleton = ({
    moduleType = 'generic',
    moduleName = 'Analysis',
}: AIGeneratingSkeletonProps) => {
    const SkeletonContent = skeletonMap[moduleType] || GenericModuleSkeleton;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Generating header */}
            <div
                className="flex items-center gap-4 p-4 rounded-[12px] mb-5"
                style={{
                    background: 'linear-gradient(135deg, rgba(79,125,243,0.04), rgba(122,92,255,0.04))',
                    border: '1px solid rgba(79,125,243,0.1)',
                }}
            >
                <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{
                        background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                    }}
                >
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                    <h3
                        className="font-semibold text-[14px]"
                        style={{ color: 'var(--dash-text)', fontFamily: 'var(--dash-font-heading)' }}
                    >
                        Generating {moduleName}...
                    </h3>
                    <p className="text-[13px]" style={{ color: 'var(--dash-text-muted)' }}>
                        This usually takes 30-60 seconds
                    </p>
                </div>
            </div>

            {/* Section divider */}
            <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
                <span
                    className="text-[11px] font-bold uppercase tracking-widest animate-pulse"
                    style={{ color: '#94A3B8', letterSpacing: '0.08em' }}
                >
                    Generating...
                </span>
                <div className="h-px flex-1" style={{ background: 'var(--dash-border-solid, #E8ECF4)' }} />
            </div>

            {/* Module-specific skeleton */}
            <SkeletonContent />

            {/* CSS keyframes for shimmer animation */}
            <style>{`
                @keyframes ai-shimmer-move {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </motion.div>
    );
};
