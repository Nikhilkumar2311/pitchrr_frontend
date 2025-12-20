/**
 * Module Skeleton
 * Generic skeleton loading state for module pages
 */

export function ModuleSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
                    <div className="h-5 w-64 bg-gray-100 rounded" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-gray-200 rounded-lg" />
                    <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                </div>
            </div>

            {/* Main Content Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column (Input) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-full bg-gray-100 rounded mb-4" />
                        <div className="h-32 w-full bg-gray-100 rounded-lg mb-4" />
                        <div className="h-10 w-32 bg-blue-200 rounded-lg" />
                    </div>
                </div>

                {/* Right Column (Results/Preview) */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-24 h-24 rounded-full bg-gray-100" />
                            <div className="space-y-2 flex-1">
                                <div className="h-6 w-32 bg-gray-200 rounded" />
                                <div className="h-4 w-full bg-gray-100 rounded" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-20 bg-gray-100 rounded-lg" />
                            <div className="h-20 bg-gray-100 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
