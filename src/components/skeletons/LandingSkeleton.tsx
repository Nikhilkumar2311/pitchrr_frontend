/**
 * Landing Page Skeleton
 * Matches the redesigned landing page layout:
 * Floating pill header, centered hero, 3x2 module grid, 3-step how it works, product preview
 */

export function LandingSkeleton() {
    return (
        <div className="min-h-screen animate-pulse" style={{ background: "#F8FAFF" }}>
            {/* Header Skeleton - Floating pill */}
            <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
                <div
                    className="max-w-[900px] mx-auto rounded-2xl h-14 flex items-center justify-between px-5"
                    style={{
                        background: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(0,0,0,0.04)",
                    }}
                >
                    <div className="h-7 w-24 bg-gray-200/60 rounded" />
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="h-3.5 w-16 bg-gray-200/50 rounded" />
                        <div className="h-3.5 w-14 bg-gray-200/50 rounded" />
                        <div className="h-3.5 w-12 bg-gray-200/50 rounded" />
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-7 w-16 bg-gray-200/50 rounded-lg" />
                        <div className="h-7 w-14 bg-blue-200/40 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Hero Section Skeleton - Split layout */}
            <div
                className="min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-10"
                style={{
                    background: "linear-gradient(135deg, #EEF2FF 0%, #F0F4FF 25%, #F8FAFF 50%, #F3EEFF 75%, #EEF2FF 100%)",
                }}
            >
                <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                        {/* Left Column: Text & CTA */}
                        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left w-full space-y-8">
                            {/* Headline */}
                            <div className="space-y-4">
                                <div className="h-12 lg:h-16 w-[90%] bg-gray-200/50 rounded-xl mx-auto lg:mx-0" />
                                <div className="h-12 lg:h-16 w-[70%] bg-gray-200/50 rounded-xl mx-auto lg:mx-0" />
                            </div>

                            {/* Subheading */}
                            <div className="space-y-3">
                                <div className="h-4 w-[85%] bg-gray-200/40 rounded mx-auto lg:mx-0" />
                                <div className="h-4 w-[75%] bg-gray-200/40 rounded mx-auto lg:mx-0" />
                                <div className="h-4 w-[60%] bg-gray-200/40 rounded mx-auto lg:mx-0" />
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                                <div className="h-12 w-full sm:w-40 bg-blue-200/40 rounded-xl" />
                                <div className="h-12 w-full sm:w-44 bg-gray-200/40 rounded-xl" />
                            </div>
                        </div>

                        {/* Right Column: Workflow Scene Mock */}
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto hidden md:block">
                            {/* Central Hub */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 bg-blue-100/30 rounded-xl border border-blue-200/40 backdrop-blur-sm" />
                            {/* Top Node */}
                            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-32 h-12 bg-white/40 rounded-xl border border-gray-200/30 backdrop-blur-sm" />
                            {/* Bottom Nodes (Fanned out) */}
                            <div className="absolute bottom-[20%] left-[10%] w-36 h-12 bg-white/40 rounded-xl border border-gray-200/30 backdrop-blur-sm" />
                            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-36 h-12 bg-white/40 rounded-xl border border-gray-200/30 backdrop-blur-sm" />
                            <div className="absolute bottom-[20%] right-[10%] w-36 h-12 bg-white/40 rounded-xl border border-gray-200/30 backdrop-blur-sm" />
                        </div>

                    </div>
                </div>

                {/* Marquee strip placeholder */}
                <div className="w-full mt-24 space-y-3">
                    <div className="h-12 w-full bg-gray-200/20 rounded" />
                    <div className="h-12 w-full bg-gray-200/20 rounded" />
                </div>
            </div>

            {/* Modules Section Skeleton */}
            <div className="py-24 lg:py-32">
                <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="h-4 w-28 bg-blue-200/30 rounded mx-auto mb-4" />
                        <div className="h-10 w-80 bg-gray-200/40 rounded-lg mx-auto mb-4" />
                        <div className="h-4 w-64 bg-gray-200/30 rounded mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white/60 rounded-xl py-5 px-6"
                                style={{ border: "1px solid rgba(0,0,0,0.04)" }}
                            >
                                <div className="h-[3px] w-0 bg-gray-200/40 rounded-full mb-3" />
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200/30 rounded-[10px]" />
                                    <div className="h-4 w-28 bg-gray-200/40 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works Skeleton */}
            <div className="py-24 lg:py-32">
                <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="h-4 w-24 bg-violet-200/30 rounded mx-auto mb-4" />
                        <div className="h-10 w-72 bg-gray-200/40 rounded-lg mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {["01", "02", "03"].map((num) => (
                            <div key={num} className="text-center">
                                <div className="h-14 w-14 bg-blue-200/20 rounded-lg mx-auto mb-6" />
                                <div className="h-5 w-36 bg-gray-200/40 rounded mx-auto mb-3" />
                                <div className="space-y-2 max-w-[280px] mx-auto">
                                    <div className="h-3.5 w-full bg-gray-200/30 rounded" />
                                    <div className="h-3.5 w-4/5 bg-gray-200/30 rounded mx-auto" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Preview Skeleton */}
            <div className="py-24 lg:py-32">
                <div className="max-w-[1100px] mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="h-4 w-28 bg-blue-200/30 rounded mx-auto mb-4" />
                        <div className="h-10 w-64 bg-gray-200/40 rounded-lg mx-auto" />
                    </div>
                    <div
                        className="rounded-2xl overflow-hidden"
                        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                    >
                        <div className="h-10 bg-gray-100/60 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-200/50" />
                            <div className="w-3 h-3 rounded-full bg-gray-200/50" />
                            <div className="w-3 h-3 rounded-full bg-gray-200/50" />
                        </div>
                        <div className="h-72 bg-white/50" />
                    </div>
                </div>
            </div>
        </div>
    );
}
