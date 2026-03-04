/**
 * Textarea Component
 * 
 * Premium styled textarea with design system tokens.
 */

import { forwardRef, type TextareaHTMLAttributes } from 'react';

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
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = Boolean(error);

        const wrapperClasses = `${fullWidth ? 'w-full' : ''} ${className}`.trim();

        return (
            <div className={wrapperClasses}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-[13px] font-medium mb-1.5"
                        style={{
                            color: 'var(--dash-text, #0F172A)',
                            fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                        }}
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`
                        w-full px-4 py-3 text-[13px]
                        bg-white rounded-[10px]
                        transition-all duration-200
                        outline-none
                        resize-y min-h-[100px]
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `.trim().replace(/\s+/g, ' ')}
                    style={{
                        fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                        color: 'var(--dash-text, #0F172A)',
                        border: '1.5px solid',
                        borderColor: hasError ? '#F87171' : 'var(--dash-border-solid, #E8ECF4)',
                    }}
                    onFocus={(e) => {
                        e.currentTarget.style.borderColor = hasError ? '#EF4444' : '#4F7DF3';
                        e.currentTarget.style.boxShadow = hasError
                            ? '0 0 0 3px rgba(239,68,68,0.08)'
                            : '0 0 0 3px rgba(79,125,243,0.08)';
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        e.currentTarget.style.borderColor = hasError ? '#F87171' : 'var(--dash-border-solid, #E8ECF4)';
                        e.currentTarget.style.boxShadow = 'none';
                        props.onBlur?.(e);
                    }}
                    aria-invalid={hasError}
                    {...props}
                />

                {error && (
                    <p className="mt-1.5 text-[12px] text-red-500" role="alert">
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
