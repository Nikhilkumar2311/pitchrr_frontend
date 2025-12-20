/**
 * Card Component
 * 
 * A container component for grouping related content.
 * Uses standard Tailwind classes for styling.
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
    md: 'p-6',
    lg: 'p-8',
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
    rounded-xl 
    ${noBorder ? '' : 'border border-gray-200'}
    shadow-sm
    ${paddingStyles[padding]}
    ${hover ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
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
        <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
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
        <p className={`text-sm text-gray-500 mt-1 ${className}`}>
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
        <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
            {children}
        </div>
    );
}
