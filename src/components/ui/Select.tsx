/**
 * Select Component
 * 
 * Custom dropdown select with premium SaaS styling.
 * Replaces the native <select> with a custom dropdown for consistent cross-browser appearance.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export function Select({
    value,
    onChange,
    options,
    placeholder = 'Select...',
    label,
    error,
    required,
    disabled,
    className = '',
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const hasError = Boolean(error);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label
                    className="block text-[13px] font-medium mb-1.5"
                    style={{
                        color: 'var(--dash-text, #0F172A)',
                        fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                    }}
                >
                    {label}
                    {required && <span className="text-amber-500 ml-0.5">*</span>}
                </label>
            )}

            {/* Trigger */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between
                    px-4 py-2.5 text-[13px]
                    bg-white rounded-[10px]
                    transition-all duration-200
                    outline-none cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
                style={{
                    fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                    color: selectedOption ? 'var(--dash-text, #0F172A)' : '#94A3B8',
                    border: '1.5px solid',
                    borderColor: isOpen
                        ? '#4F7DF3'
                        : hasError
                            ? '#F87171'
                            : (!value && required)
                                ? '#FBBF24'
                                : 'var(--dash-border-solid, #E8ECF4)',
                    boxShadow: isOpen ? '0 0 0 3px rgba(79,125,243,0.08)' : 'none',
                }}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate">
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-200"
                    style={{
                        color: '#94A3B8',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 w-full mt-1.5 py-1 overflow-auto"
                        style={{
                            background: 'white',
                            borderRadius: '10px',
                            border: '1.5px solid var(--dash-border-solid, #E8ECF4)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                            maxHeight: '220px',
                        }}
                        role="listbox"
                    >
                        {options.map((option) => {
                            const isSelected = option.value === value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center justify-between px-3.5 py-2 text-[13px] transition-colors duration-100 cursor-pointer"
                                    style={{
                                        fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                                        color: isSelected ? '#4F7DF3' : 'var(--dash-text, #0F172A)',
                                        background: isSelected ? 'rgba(79,125,243,0.04)' : 'transparent',
                                        fontWeight: isSelected ? 600 : 400,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSelected) {
                                            e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = isSelected ? 'rgba(79,125,243,0.04)' : 'transparent';
                                    }}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {isSelected && (
                                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: '#4F7DF3' }} />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="mt-1.5 text-[12px] text-red-500" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
