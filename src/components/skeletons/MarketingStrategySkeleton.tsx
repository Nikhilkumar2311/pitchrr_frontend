import { Card } from '@/components/ui';

export const MarketingStrategySkeleton = () => {
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

            {/* Strategy Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Target Audience */}
                <Card className="h-[300px] p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                        <div className="h-6 w-40 bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    </div>
                </Card>

                {/* Marketing Channels */}
                <Card className="h-[300px] p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                        <div className="h-6 w-48 bg-gray-200 rounded" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-20 bg-gray-100 rounded-lg" />
                        ))}
                    </div>
                </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-[250px] p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gray-200 rounded" />
                            <div className="h-5 w-32 bg-gray-200 rounded" />
                        </div>
                        <div className="h-32 bg-gray-100 rounded w-full" />
                    </Card>
                ))}
            </div>
        </div>
    );
};
