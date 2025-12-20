/**
 * Textarea Component
 * 
 * Multi-line text input with standard Tailwind classes.
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

        const textareaClasses = `
      w-full px-4 py-3
      text-gray-900
      placeholder:text-gray-400
      bg-white
      border rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-0
      resize-y min-h-[100px]
      disabled:bg-gray-100 disabled:cursor-not-allowed
      ${hasError
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
    `.trim().replace(/\s+/g, ' ');

        return (
            <div className={wrapperClasses}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    className={textareaClasses}
                    aria-invalid={hasError}
                    {...props}
                />

                {error && (
                    <p className="mt-2 text-sm text-red-500" role="alert">
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="mt-2 text-sm text-gray-500">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
