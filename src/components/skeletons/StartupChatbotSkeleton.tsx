import { Card } from '@/components/ui';

export const StartupChatbotSkeleton = () => {
    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-200 rounded" />
                    <div className="h-4 w-64 bg-gray-200 rounded" />
                </div>
                <div className="h-9 w-24 bg-gray-200 rounded" />
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 p-4 space-y-6">
                    {/* Assistant Message */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="w-2/3 h-24 bg-gray-100 rounded-2xl" />
                    </div>

                    {/* User Message */}
                    <div className="flex gap-3 justify-end">
                        <div className="w-1/2 h-16 bg-blue-50 rounded-2xl" />
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                    </div>

                    {/* Assistant Message */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="w-3/4 h-32 bg-gray-100 rounded-2xl" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-3">
                        <div className="flex-1 h-10 bg-gray-100 rounded-lg" />
                        <div className="w-20 h-10 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            </Card>
        </div>
    );
};
