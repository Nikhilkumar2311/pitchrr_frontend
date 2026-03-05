/**
 * Textarea Component
 * 
 * Premium styled textarea with design system tokens.
 * Features subtle depth with inner shadow and smooth focus transitions.
 */

import { forwardRef, useState, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            helperText,
            fullWidth = true,
            className = '',
            id,
            style,
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = Boolean(error);
        const [isFocused, setIsFocused] = useState(false);

        const wrapperClasses = `${fullWidth ? 'w-full' : ''} ${className}`.trim();

        return (
            <div className={wrapperClasses}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-[12px] font-semibold mb-1.5 uppercase tracking-wider"
                        style={{
                            color: 'var(--dash-text-muted, #64748B)',
                            fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                            letterSpacing: '0.04em',
                        }}
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    className="w-full outline-none resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                        color: 'var(--dash-text, #0F172A)',
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: 1.6,
                        padding: '12px 14px',
                        minHeight: 100,
                        background: isFocused ? '#fff' : 'rgba(0,0,0,0.015)',
                        border: '1.5px solid',
                        borderColor: isFocused
                            ? (hasError ? '#EF4444' : '#4F7DF3')
                            : (hasError ? '#F87171' : 'var(--dash-border-solid, #E8ECF4)'),
                        borderRadius: 10,
                        boxShadow: isFocused
                            ? (hasError
                                ? '0 0 0 3px rgba(239,68,68,0.06), inset 0 1px 2px rgba(0,0,0,0.03)'
                                : '0 0 0 3px rgba(79,125,243,0.06), inset 0 1px 2px rgba(0,0,0,0.03)')
                            : 'inset 0 1px 2px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s ease',
                        ...style,
                    }}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    aria-invalid={hasError}
                    {...props}
                />

                {error && (
                    <p className="mt-1.5 text-[12px]" style={{ color: '#EF4444' }} role="alert">
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-1.5 text-[12px]" style={{ color: 'var(--dash-text-muted, #64748B)' }}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
