import { Card } from '@/components/ui';

export const CompetitorAnalysisSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="space-y-2">
                    <div className="h-8 w-56 bg-gray-200 rounded" />
                    <div className="h-4 w-72 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-gray-200 rounded" />
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Competitor List - Left Column */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="h-10 w-full bg-gray-200 rounded mb-4" />
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-lg p-4">
                            <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-48 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>

                {/* Analysis Detail - Right Column */}
                <Card className="lg:col-span-2 p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="h-8 w-48 bg-gray-200 rounded" />
                        <div className="h-8 w-20 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="space-y-3">
                            <div className="h-6 w-24 bg-gray-200 rounded" />
                            <div className="h-20 bg-gray-100 rounded" />
                            <div className="h-20 bg-gray-100 rounded" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-6 w-24 bg-gray-200 rounded" />
                            <div className="h-20 bg-gray-100 rounded" />
                            <div className="h-20 bg-gray-100 rounded" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
