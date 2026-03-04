/**
 * Idea Validation Skeleton
 * Matches single-column progressive layout.
 */

export const IdeaValidationSkeleton = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-blue-100/40 rounded-[10px]" />
                        <div className="h-7 w-40 bg-gray-200/60 rounded-lg" />
                    </div>
                    <div className="h-4 w-56 bg-gray-200/40 rounded mt-2" />
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
                <div className="h-5 w-32 bg-gray-200/50 rounded" />
                <div className="h-3.5 w-72 bg-gray-200/30 rounded" />
                <div className="h-10 w-full bg-gray-100/50 rounded-[10px] mt-2" />
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-gray-100/50 rounded-[10px]" />
                    <div className="h-10 bg-gray-100/50 rounded-[10px]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-gray-100/50 rounded-[10px]" />
                    <div className="h-10 bg-gray-100/50 rounded-[10px]" />
                </div>
                <div className="h-32 bg-gray-100/40 rounded-[10px]" />
                <div className="h-10 w-36 bg-blue-100/40 rounded-[10px]" />
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
                <div className="h-3.5 w-52 bg-gray-200/30 rounded mt-2" />
            </div>
        </div>
    );
};
