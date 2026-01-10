/**
 * CreditCost Chip Component
 * 
 * A professional badge/chip that displays credit cost with a coin icon.
 * Used on buttons and cards to show how many credits an action costs.
 */

import { Coins } from 'lucide-react';

interface CreditCostProps {
    cost: number;
    size?: 'sm' | 'md';
    className?: string;
}

export function CreditCost({ cost, size = 'sm', className = '' }: CreditCostProps) {
    const sizeClasses = size === 'sm'
        ? 'text-xs px-2 py-0.5 gap-1'
        : 'text-sm px-2.5 py-1 gap-1.5';

    const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

    return (
        <span
            className={`inline-flex items-center font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full whitespace-nowrap ${sizeClasses} ${className}`}
            title={`This action costs ${cost} credit${cost !== 1 ? 's' : ''}`}
        >
            <Coins className={iconSize} />
            <span>{cost}</span>
        </span>
    );
}
