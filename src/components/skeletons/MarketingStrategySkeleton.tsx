/**
 * Marketing Strategy Skeleton
 * Matches single-column progressive layout.
 */

export const MarketingStrategySkeleton = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-emerald-100/40 rounded-[10px]" />
                        <div className="h-7 w-48 bg-gray-200/60 rounded-lg" />
                    </div>
                    <div className="h-4 w-64 bg-gray-200/40 rounded mt-2" />
                </div>
                <div className="h-9 w-28 bg-gray-200/40 rounded-[8px]" />
            </div>

            {/* Input Card */}
            <div
                className="rounded-[12px] p-5 space-y-3"
                style={{
                    background: 'white',
                    border: '1px solid var(--dash-border-solid, #E8ECF4)',
                    boxShadow: 'var(--dash-shadow-card)',
                }}
            >
                <div className="h-5 w-44 bg-gray-200/50 rounded" />
                <div className="h-3.5 w-80 bg-gray-200/30 rounded" />
                <div className="h-20 w-full bg-gray-100/50 rounded-[10px] mt-2" />
                <div className="h-10 w-52 bg-emerald-100/40 rounded-[10px]" />
            </div>

            {/* Placeholder Card */}
            <div
                className="rounded-[12px] p-5 flex flex-col items-center justify-center py-16"
                style={{
                    background: 'white',
                    border: '1px solid var(--dash-border-solid, #E8ECF4)',
                    boxShadow: 'var(--dash-shadow-card)',
                }}
            >
                <div className="w-14 h-14 bg-gray-100 rounded-[12px] mb-4" />
                <div className="h-5 w-44 bg-gray-200/50 rounded" />
                <div className="h-3.5 w-64 bg-gray-200/30 rounded mt-2" />
            </div>
        </div>
    );
};
