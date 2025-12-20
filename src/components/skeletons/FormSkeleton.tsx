/**
 * FormSkeleton - Loading placeholder for forms
 */
export function FormSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Input fields */}
            {[1, 2, 3].map((i) => (
                <div key={i}>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-12 bg-gray-100 rounded-lg w-full" />
                </div>
            ))}
            {/* Button */}
            <div className="h-10 bg-gray-200 rounded-lg w-1/3 mt-8" />
        </div>
    );
}
