import { Card } from '@/components/ui';

export const PitchDeckSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="space-y-2">
                    <div className="h-8 w-40 bg-gray-200 rounded" />
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-gray-200 rounded" />
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
                {/* Sidebar Thumbnails */}
                <div className="w-full lg:w-64 flex-shrink-0 space-y-3 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-lg border-2 border-transparent" />
                    ))}
                </div>

                {/* Main Slide Editor */}
                <Card className="flex-1 flex flex-col p-8 space-y-6">
                    <div className="h-8 w-3/4 bg-gray-200 rounded" />
                    <div className="space-y-4 flex-1">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded" />
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="h-40 bg-gray-100 rounded" />
                            <div className="h-40 bg-gray-100 rounded" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
