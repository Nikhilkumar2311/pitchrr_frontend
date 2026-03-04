/**
 * ProgressBar Component
 * 
 * Gradient progress indicator with smooth animation.
 */

interface ProgressBarProps {
    value: number; // 0-100
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
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
            <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizeStyles[size]}`}>
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                        width: `${clampedValue}%`,
                        background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                    }}
                />
            </div>
            {showLabel && (
                <div className="mt-1 text-sm text-[var(--dash-text-muted,#64748B)]">
                    {clampedValue}%
                </div>
            )}
        </div>
    );
}
