/**
 * Input Component
 * 
 * Premium styled text input with label, error handling, and design system tokens.
 * Features subtle depth with inner shadow and smooth focus transitions.
 */

import { forwardRef, useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = true,
            className = '',
            id,
            style,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = Boolean(error);
        const [isFocused, setIsFocused] = useState(false);

        const wrapperClasses = `${fullWidth ? 'w-full' : ''} ${className}`.trim();

        return (
            <div className={wrapperClasses}>
                {label && (
                    <label
                        htmlFor={inputId}
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

                <div className="relative flex items-center">
                    {leftIcon && (
                        <div
                            className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"
                            style={{ color: isFocused ? '#4F7DF3' : '#94A3B8', transition: 'color 0.2s ease' }}
                        >
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className="w-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                            color: 'var(--dash-text, #0F172A)',
                            fontSize: 13,
                            fontWeight: 500,
                            padding: leftIcon ? '11px 14px 11px 40px' : rightIcon ? '11px 40px 11px 14px' : '11px 14px',
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
                        aria-describedby={hasError ? `${inputId}-error` : undefined}
                        {...props}
                    />

                    {rightIcon && (
                        <div
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                            style={{ color: isFocused ? '#4F7DF3' : '#94A3B8', transition: 'color 0.2s ease' }}
                        >
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1.5 text-[12px]"
                        style={{ color: '#EF4444' }}
                        role="alert"
                    >
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

Input.displayName = 'Input';
