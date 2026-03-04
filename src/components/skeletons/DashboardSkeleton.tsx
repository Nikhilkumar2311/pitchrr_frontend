/**
 * Dashboard Skeleton
 * Matches the open-layout dashboard: hero strip, inline progress, compact module rows.
 */

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Hero Strip */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                    <div className="h-7 w-56 bg-gray-200/60 rounded-lg mb-2" />
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-7 h-7 bg-blue-100/50 rounded-[8px]" />
                        <div className="h-4 w-40 bg-gray-200/40 rounded" />
                    </div>
                </div>
                <div className="flex gap-2.5">
                    <div className="h-9 w-28 bg-blue-100/40 rounded-[8px]" />
                    <div className="h-9 w-24 bg-gray-200/40 rounded-[8px]" />
                    <div className="h-9 w-24 bg-blue-200/40 rounded-[8px]" />
                </div>
            </div>

            {/* Inline Progress Strip */}
            <div>
                <div className="flex items-center justify-between mb-2.5">
                    <div className="h-4 w-16 bg-gray-200/50 rounded" />
                    <div className="flex items-center gap-2">
                        <div className="h-3.5 w-20 bg-gray-200/40 rounded" />
                        <div className="h-4 w-8 bg-blue-100/50 rounded" />
                    </div>
                </div>
                <div className="h-1.5 w-full bg-gray-100/60 rounded-full" />
            </div>

            {/* Module Rows */}
            <div>
                <div className="h-4 w-16 bg-gray-200/50 rounded mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3.5 py-3.5 px-3"
                            style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}
                        >
                            <div className="w-9 h-9 bg-gray-100 rounded-[8px] shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="h-3.5 w-28 bg-gray-200/50 rounded mb-1.5" />
                                <div className="h-3 w-full bg-gray-100/40 rounded mb-2" />
                                <div className="h-[3px] w-full bg-gray-100/40 rounded-full" />
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="h-3 w-8 bg-gray-100/40 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tip Strip */}
            <div
                className="flex items-center gap-3 px-4 py-3 rounded-[10px]"
                style={{ background: 'rgba(79,125,243,0.03)' }}
            >
                <div className="h-4 w-4 bg-blue-100/30 rounded" />
                <div className="h-3.5 flex-1 bg-blue-100/20 rounded" />
                <div className="h-3.5 w-12 bg-blue-100/30 rounded" />
            </div>
        </div>
    );
}
