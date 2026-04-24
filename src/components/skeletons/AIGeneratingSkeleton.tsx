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
