/**
 * Dashboard Skeleton
 * Skeleton loading state for the Dashboard page
 */

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Welcome Section Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="h-8 w-64 bg-gray-200 rounded-lg mb-2" />
                    <div className="h-5 w-48 bg-gray-100 rounded" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-28 bg-gray-200 rounded-lg" />
                    <div className="h-10 w-28 bg-gray-200 rounded-lg" />
                    <div className="h-10 w-32 bg-blue-200 rounded-lg" />
                </div>
            </div>

            {/* Progress Card Skeleton */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-64 bg-gray-100 rounded mb-4" />
                <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="h-4 w-10 bg-gray-100 rounded" />
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full" />
                <div className="mt-4 flex gap-2">
                    <div className="h-6 w-24 bg-gray-100 rounded-full" />
                    <div className="h-6 w-24 bg-yellow-100 rounded-full" />
                    <div className="h-6 w-24 bg-green-100 rounded-full" />
                </div>
            </div>

            {/* Modules Section Skeleton */}
            <div>
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                            </div>
                            <div className="h-5 w-36 bg-gray-200 rounded mb-2" />
                            <div className="h-4 w-full bg-gray-100 rounded mb-1" />
                            <div className="h-4 w-3/4 bg-gray-100 rounded mb-4" />
                            <div className="flex items-center justify-between mb-1">
                                <div className="h-3 w-16 bg-gray-100 rounded" />
                                <div className="h-3 w-8 bg-gray-100 rounded" />
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full" />
                            <div className="flex justify-end mt-4">
                                <div className="h-4 w-16 bg-blue-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips Card Skeleton */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1">
                        <div className="h-5 w-40 bg-blue-200 rounded mb-2" />
                        <div className="h-4 w-full bg-blue-100 rounded" />
                    </div>
                    <div className="h-10 w-40 bg-blue-300 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
