/**
 * ModuleSkeleton - Loading placeholder for module pages
 */
export function ModuleSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
            {/* Content cards */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="h-32 bg-gray-100 rounded-lg" />
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-4" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-gray-100 rounded-lg" />
                    <div className="h-24 bg-gray-100 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
