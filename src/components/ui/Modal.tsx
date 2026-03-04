/**
 * Modal Component
 * 
 * Accessible modal with premium SaaS styling and Framer Motion animations.
 */

import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
}

const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    size = 'md',
    showCloseButton = true,
}: ModalProps) {
    // Handle Escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle backdrop click
    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50"
                        style={{
                            background: 'rgba(15, 23, 42, 0.4)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                        }}
                        onClick={handleBackdropClick}
                        aria-hidden="true"
                    />

                    {/* Main modal container */}
                    <div
                        className="fixed inset-0 z-50 grid place-items-center p-4 overflow-y-auto w-full h-full"
                        onClick={handleBackdropClick}
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 12 }}
                            transition={{
                                type: "spring",
                                damping: 28,
                                stiffness: 350,
                                duration: 0.3
                            }}
                            className={`relative w-full ${sizeStyles[size]} overflow-hidden z-10 my-auto`}
                            style={{
                                background: 'white',
                                borderRadius: 'var(--dash-radius, 12px)',
                                boxShadow: '0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
                            }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={title ? 'modal-title' : undefined}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            {(title || showCloseButton) && (
                                <div
                                    className="flex items-center justify-between px-6 py-4"
                                    style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.05)' }}
                                >
                                    {title && (
                                        <h2
                                            id="modal-title"
                                            className="text-[15px] font-semibold"
                                            style={{
                                                color: 'var(--dash-text, #0F172A)',
                                                fontFamily: 'var(--dash-font-heading, Sora, sans-serif)',
                                            }}
                                        >
                                            {title}
                                        </h2>
                                    )}
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="p-1.5 rounded-lg transition-colors"
                                            style={{ color: '#94A3B8' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = '#64748B';
                                                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#94A3B8';
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                            aria-label="Close modal"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Body */}
                            <div className="px-6 py-5 overflow-y-auto max-h-[85vh]">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
