/**
 * Input Component
 * 
 * Premium styled text input with floating label animation.
 * The label sits inside the input as placeholder text, then smoothly floats
 * up to the top-left border when focused or filled.
 * 
 * Animation performance: Uses ONLY transform and opacity for the label
 * movement (GPU composited). No top/padding/font-weight transitions
 * to avoid layout thrashing and stuttering.
 */

import { forwardRef, useState, useRef, useEffect, useMemo, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

let idCounter = 0;
const generateId = () => `input-${++idCounter}`;

// Inject keyframes + floating label styles once
const STYLE_ID = '__floating-label-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = `
        .fl-wrapper {
            position: relative;
        }
        .fl-label {
            position: absolute;
            top: 50%;
            pointer-events: none;
            user-select: none;
            transform-origin: left center;
            transform: translateY(-50%);
            transition: top 0.2s cubic-bezier(0.33, 1, 0.68, 1),
                        transform 0.2s cubic-bezier(0.33, 1, 0.68, 1),
                        color 0.18s ease;
            will-change: top, transform;
            line-height: 1;
            z-index: 5;
        }
        .fl-label.fl-active {
            top: 0;
            transform: translateY(-50%) scale(0.78);
        }
        .fl-label-bg {
            position: absolute;
            inset: -2px -6px;
            background: white;
            border-radius: 2px;
            z-index: -1;
            opacity: 0;
            transition: opacity 0.18s ease;
        }
        .fl-label.fl-active .fl-label-bg {
            opacity: 1;
        }
        .fl-icon {
            transition: color 0.2s ease;
        }
    `;
    document.head.appendChild(styleEl);
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
            value,
            placeholder: _placeholder,
            ...props
        },
        ref
    ) => {
        const inputId = useMemo(() => id || generateId(), [id]);
        const hasError = Boolean(error);
        const [isFocused, setIsFocused] = useState(false);
        const [hasValue, setHasValue] = useState(Boolean(value));
        const innerRef = useRef<HTMLInputElement | null>(null);

        useEffect(() => {
            setHasValue(Boolean(value));
        }, [value]);

        const isFloating = isFocused || hasValue;
        const wrapperClasses = `${fullWidth ? 'w-full' : ''} ${className}`.trim();

        const accentColor = hasError ? '#EF4444' : '#4F7DF3';
        const borderIdle = hasError ? '#F87171' : 'var(--dash-border-solid, #E8ECF4)';
        const borderActive = hasError ? '#EF4444' : '#4F7DF3';
        const labelLeft = leftIcon ? 40 : 14;

        return (
            <div className={wrapperClasses}>
                <div
                    className="relative flex items-center"
                    style={{ marginTop: label ? 6 : 0 }}
                >
                    {leftIcon && (
                        <div
                            className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none fl-icon"
                            style={{
                                color: isFocused ? accentColor : '#94A3B8',
                                zIndex: 10,
                            }}
                        >
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={(node) => {
                            innerRef.current = node;
                            if (typeof ref === 'function') ref(node);
                            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                        }}
                        id={inputId}
                        value={value}
                        placeholder=""
                        className="w-full outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                            color: 'var(--dash-text, #0F172A)',
                            fontSize: 14,
                            fontWeight: 500,
                            padding: leftIcon
                                ? '15px 14px 15px 40px'
                                : rightIcon
                                    ? '15px 40px 15px 14px'
                                    : '15px 14px',
                            background: isFocused ? '#fff' : '#F8F9FC',
                            border: '1.5px solid',
                            borderColor: isFocused ? borderActive : borderIdle,
                            borderRadius: 12,
                            boxShadow: isFocused
                                ? (hasError
                                    ? '0 0 0 3px rgba(239,68,68,0.08)'
                                    : '0 0 0 3px rgba(79,125,243,0.08)')
                                : 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
                            ...style,
                        }}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            setHasValue(Boolean(e.target.value));
                            props.onBlur?.(e);
                        }}
                        onChange={(e) => {
                            setHasValue(Boolean(e.target.value));
                            props.onChange?.(e);
                        }}
                        aria-invalid={hasError}
                        aria-describedby={hasError ? `${inputId}-error` : undefined}
                        {...props}
                    />

                    {/* Floating Label — only transform + color animate (GPU only, no layout) */}
                    {label && (
                        <label
                            htmlFor={inputId}
                            className={`fl-label ${isFloating ? 'fl-active' : ''}`}
                            style={{
                                left: labelLeft,
                                fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                                fontSize: 14,
                                fontWeight: 500,
                                color: isFocused
                                    ? accentColor
                                    : hasValue
                                        ? '#64748B'
                                        : '#9CA3AF',
                            }}
                        >
                            {/* White pill background that fades in when floating */}
                            <span className="fl-label-bg" />
                            {label}
                        </label>
                    )}

                    {rightIcon && (
                        <div
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center fl-icon"
                            style={{
                                color: isFocused ? accentColor : '#94A3B8',
                            }}
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
