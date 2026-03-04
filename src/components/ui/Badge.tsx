/**
 * Badge Component
 * 
 * Status indicators with design system colors.
 */

import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md';
    className?: string;
}

const variantStyles = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-blue-50 text-[#4F7DF3]',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-600',
};

const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
};

export function Badge({
    children,
    variant = 'default',
    size = 'sm',
    className = '',
}: BadgeProps) {
    const badgeClasses = `
    inline-flex items-center
    font-semibold rounded-full tracking-wide
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return <span className={badgeClasses}>{children}</span>;
}
