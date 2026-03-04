/**
 * Dashboard Skeleton
 * Matches the redesigned dashboard layout.
 */

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Welcome Section Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="h-7 w-56 bg-gray-200/60 rounded-lg mb-2" />
                    <div className="h-4 w-40 bg-gray-200/40 rounded" />
                </div>
                <div className="flex gap-2.5">
                    <div className="h-9 w-28 bg-blue-100/40 rounded-[8px]" />
                    <div className="h-9 w-24 bg-gray-200/40 rounded-[8px]" />
                    <div className="h-9 w-24 bg-blue-200/40 rounded-[8px]" />
                </div>
            </div>

            {/* Progress Card Skeleton */}
            <div
                className="rounded-[12px] p-5"
                style={{
                    background: 'white',
                    border: '1px solid var(--dash-border-solid, #E8ECF4)',
                    boxShadow: 'var(--dash-shadow-card, 0 2px 8px rgba(0,0,0,0.04))',
                }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="h-4 w-52 bg-gray-200/40 rounded" />
                    <div className="h-4 w-20 bg-gray-200/40 rounded" />
                </div>
                <div className="h-2.5 w-full bg-gray-100 rounded-full" />
                <div className="mt-4 flex gap-2">
                    <div className="h-5 w-20 bg-gray-100 rounded-full" />
                    <div className="h-5 w-20 bg-amber-100/40 rounded-full" />
                    <div className="h-5 w-20 bg-emerald-100/40 rounded-full" />
                </div>
            </div>

            {/* Modules Section Skeleton */}
            <div>
                <div className="h-5 w-28 bg-gray-200/50 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-[12px] p-5 relative overflow-hidden"
                            style={{
                                background: 'white',
                                border: '1px solid var(--dash-border-solid, #E8ECF4)',
                                boxShadow: 'var(--dash-shadow-card)',
                            }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gray-100" />
                            <div className="flex items-start justify-between mb-3 pt-1">
                                <div className="w-10 h-10 bg-gray-100 rounded-[10px]" />
                                <div className="h-5 w-16 bg-gray-100 rounded-full" />
                            </div>
                            <div className="h-4 w-28 bg-gray-200/50 rounded mb-1.5" />
                            <div className="h-3.5 w-full bg-gray-100/60 rounded mb-1" />
                            <div className="h-3.5 w-2/3 bg-gray-100/60 rounded mb-4" />
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="h-3 w-12 bg-gray-100/60 rounded" />
                                <div className="h-3 w-6 bg-gray-100/60 rounded" />
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                            <div className="flex justify-end mt-3.5">
                                <div className="h-3.5 w-14 bg-blue-100/40 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips Card Skeleton */}
            <div
                className="rounded-[12px] p-5"
                style={{
                    background: 'rgba(79,125,243,0.02)',
                    border: '1px solid rgba(79,125,243,0.08)',
                }}
            >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1">
                        <div className="h-4 w-32 bg-blue-100/40 rounded mb-2" />
                        <div className="h-3.5 w-full bg-blue-100/30 rounded" />
                    </div>
                    <div className="h-9 w-36 bg-blue-100/40 rounded-[8px]" />
                </div>
            </div>
        </div>
    );
}
