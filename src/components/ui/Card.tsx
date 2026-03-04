/**
 * Card Component
 * 
 * A container component for grouping related content.
 * Uses design system tokens for premium SaaS styling.
 */

import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    noBorder?: boolean;
}

const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-7',
};

export function Card({
    children,
    hover = false,
    padding = 'md',
    noBorder = false,
    className = '',
    ...props
}: CardProps) {
    const cardClasses = `
    bg-white 
    rounded-[12px]
    ${noBorder ? '' : 'border border-[var(--dash-border-solid,#E8ECF4)]'}
    shadow-[var(--dash-shadow-card,0_2px_8px_rgba(0,0,0,0.04))]
    ${paddingStyles[padding]}
    ${hover ? 'hover:shadow-[var(--dash-shadow-hover)] hover:scale-[1.02] transition-all duration-200 cursor-pointer' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    return (
        <div className={cardClasses} {...props}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
    return (
        <h3 className={`text-lg font-semibold text-[var(--dash-text,#0F172A)] ${className}`}>
            {children}
        </h3>
    );
}

interface CardDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
    return (
        <p className={`text-sm text-[var(--dash-text-muted,#64748B)] mt-1 ${className}`}>
            {children}
        </p>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`mt-4 pt-4 border-t border-[var(--dash-border,rgba(0,0,0,0.06))] ${className}`}>
            {children}
        </div>
    );
}
