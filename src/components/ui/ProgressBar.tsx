/**
 * ProgressBar Component
 * 
 * Progress indicator with standard Tailwind classes.
 */

interface ProgressBarProps {
    value: number; // 0-100
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};

export function ProgressBar({
    value,
    showLabel = false,
    size = 'md',
    className = '',
}: ProgressBarProps) {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className={className}>
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
                <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
            {showLabel && (
                <div className="mt-1 text-sm text-gray-600">
                    {clampedValue}%
                </div>
            )}
        </div>
    );
}
