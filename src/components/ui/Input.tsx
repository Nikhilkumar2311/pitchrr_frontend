/**
 * Input Component
 * 
 * Premium styled text input with label, error handling, and design system tokens.
 */

import { forwardRef, type InputHTMLAttributes } from 'react';

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
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const hasError = Boolean(error);

        const wrapperClasses = `${fullWidth ? 'w-full' : ''} ${className}`.trim();

        const inputClasses = `
            w-full px-4 py-2.5 text-[13px]
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            bg-white rounded-[10px]
            transition-all duration-200
            outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                : 'border-[var(--dash-border-solid,#E8ECF4)] focus:border-[#4F7DF3] focus:ring-2 focus:ring-[rgba(79,125,243,0.12)]'
            }
        `.trim().replace(/\s+/g, ' ');

        return (
            <div className={wrapperClasses}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-[13px] font-medium mb-1.5"
                        style={{
                            color: 'var(--dash-text, #0F172A)',
                            fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                        }}
                    >
                        {label}
                    </label>
                )}

                <div className="relative flex items-center">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{ color: '#94A3B8' }}>
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={inputClasses}
                        style={{
                            fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                            color: 'var(--dash-text, #0F172A)',
                            border: '1.5px solid',
                            borderColor: hasError ? '#F87171' : 'var(--dash-border-solid, #E8ECF4)',
                        }}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${inputId}-error` : undefined}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center" style={{ color: '#94A3B8' }}>
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1.5 text-[12px] text-red-500"
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
