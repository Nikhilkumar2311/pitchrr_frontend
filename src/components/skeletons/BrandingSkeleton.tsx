import { Card } from '@/components/ui';

export const BrandingSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-3">
                    <div className="h-10 w-24 bg-gray-200 rounded" />
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Brand Identity / Personality */}
                <Card className="h-[300px] p-6 space-y-4">
                    <div className="h-6 w-40 bg-gray-200 rounded" />
                    <div className="space-y-3 mt-4">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    </div>
                    <div className="flex gap-2 mt-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />)}
                    </div>
                </Card>

                {/* Color Palette */}
                <Card className="h-[300px] p-6 space-y-4">
                    <div className="h-6 w-32 bg-gray-200 rounded" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-xl" />
                        ))}
                    </div>
                </Card>
            </div>

            {/* Typography Section */}
            <Card className="p-6">
                <div className="h-6 w-36 bg-gray-200 rounded mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <div className="h-12 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                    </div>
                    <div className="space-y-2">
                        <div className="h-12 w-32 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                    </div>
                </div>
            </Card>
        </div>
    );
};
