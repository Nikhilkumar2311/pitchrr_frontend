/**
 * AI Floating Button Component
 * Premium design with gradient and glow effect.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export function AIFloatingButton() {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {/* Tooltip */}
            <AnimatePresence>
                {isTooltipVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full right-0 mb-3 whitespace-nowrap"
                    >
                        <div
                            className="px-3 py-2 text-[12px] font-medium rounded-[8px]"
                            style={{
                                background: 'var(--dash-text, #0F172A)',
                                color: 'white',
                                fontFamily: 'var(--dash-font-body, Inter, sans-serif)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}
                        >
                            Ask AI for help
                            <div
                                className="absolute -bottom-1 right-5 w-2 h-2 rotate-45"
                                style={{ background: 'var(--dash-text, #0F172A)' }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ambient glow */}
            <div
                className="absolute inset-0 rounded-full blur-lg opacity-40"
                style={{
                    background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                    transform: 'scale(1.1)',
                }}
            />

            {/* Button */}
            <Link to="/dashboard/chat">
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-12 h-12 rounded-full text-white flex items-center justify-center cursor-pointer"
                    style={{
                        background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                        boxShadow: '0 4px 16px rgba(79,125,243,0.35), 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={() => setIsTooltipVisible(true)}
                    onMouseLeave={() => setIsTooltipVisible(false)}
                    aria-label="Ask AI"
                >
                    <MessageSquare className="w-5 h-5" />
                </motion.button>
            </Link>
        </div>
    );
}
