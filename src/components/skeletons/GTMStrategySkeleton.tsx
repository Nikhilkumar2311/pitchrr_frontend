import { Card } from '@/components/ui';

export const GTMStrategySkeleton = () => {
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

            {/* Launch Phases Line/Grid */}
            <div className="space-y-6">
                {[1, 2, 3].map((phase) => (
                    <Card key={phase} className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                                <div className="h-6 w-48 bg-gray-200 rounded" />
                            </div>
                            <div className="h-6 w-24 bg-gray-200 rounded-full" />
                        </div>
                        <div className="space-y-3 pl-0 sm:pl-11">
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div className="h-24 bg-gray-100 rounded" />
                                <div className="h-24 bg-gray-100 rounded" />
                                <div className="h-24 bg-gray-100 rounded" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
