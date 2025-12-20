/**
 * Landing Page Skeleton
 * Skeleton loading state for the Landing page
 */

export function LandingSkeleton() {
    return (
        <div className="bg-white min-h-screen animate-pulse">
            {/* Header Skeleton */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-sm">
                <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <div className="h-8 w-24 bg-gray-200 rounded" />
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="h-4 w-16 bg-gray-100 rounded" />
                            <div className="h-4 w-20 bg-gray-100 rounded" />
                            <div className="h-4 w-14 bg-gray-100 rounded" />
                        </div>
                        <div className="h-10 w-28 bg-blue-200 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Hero Section Skeleton */}
            <div className="pt-32 pb-20 lg:pt-40 lg:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Text */}
                        <div className="text-center lg:text-left">
                            <div className="h-8 w-48 bg-blue-100 rounded-full mx-auto lg:mx-0 mb-6" />
                            <div className="space-y-4 mb-6">
                                <div className="h-12 w-full bg-gray-200 rounded-lg" />
                                <div className="h-12 w-3/4 bg-gray-200 rounded-lg mx-auto lg:mx-0" />
                            </div>
                            <div className="space-y-2 mb-8">
                                <div className="h-5 w-full bg-gray-100 rounded" />
                                <div className="h-5 w-4/5 bg-gray-100 rounded mx-auto lg:mx-0" />
                            </div>
                            <div className="flex gap-4 justify-center lg:justify-start">
                                <div className="h-12 w-36 bg-blue-200 rounded-lg" />
                                <div className="h-12 w-32 bg-gray-200 rounded-lg" />
                            </div>
                        </div>
                        {/* Right: Image */}
                        <div className="h-80 lg:h-96 bg-gray-100 rounded-2xl" />
                    </div>
                </div>
            </div>

            {/* Features Section Skeleton */}
            <div className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="h-8 w-40 bg-blue-100 rounded-full mx-auto mb-6" />
                        <div className="h-10 w-96 bg-gray-200 rounded-lg mx-auto mb-4" />
                        <div className="h-5 w-80 bg-gray-100 rounded mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8">
                                <div className="w-14 h-14 bg-gray-100 rounded-xl mb-6" />
                                <div className="h-6 w-32 bg-gray-200 rounded mb-3" />
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-100 rounded" />
                                    <div className="h-4 w-4/5 bg-gray-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works Section Skeleton */}
            <div className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="h-8 w-36 bg-blue-100 rounded-full mx-auto mb-6" />
                        <div className="h-10 w-80 bg-gray-200 rounded-lg mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6" />
                                <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-3" />
                                <div className="h-4 w-48 bg-gray-100 rounded mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section Skeleton */}
            <div className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gray-800 rounded-3xl p-12 lg:p-16 text-center">
                        <div className="h-10 w-96 bg-gray-700 rounded-lg mx-auto mb-6" />
                        <div className="h-5 w-80 bg-gray-600 rounded mx-auto mb-10" />
                        <div className="h-14 w-48 bg-white/20 rounded-lg mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}
