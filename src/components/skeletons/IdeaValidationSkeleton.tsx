import { Card } from '@/components/ui';

export const IdeaValidationSkeleton = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                {/* Input Card */}
                <Card className="h-[400px] p-6 space-y-4">
                    <div className="h-6 w-1/3 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="flex-1 bg-gray-100 rounded mt-4" />
                    <div className="h-10 w-32 bg-gray-200 rounded" />
                </Card>

                {/* Results/Placeholder Card */}
                <Card className="h-[400px] p-6 flex flex-col items-center justify-center space-y-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full" />
                    <div className="h-6 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                </Card>
            </div>
        </div>
    );
};
