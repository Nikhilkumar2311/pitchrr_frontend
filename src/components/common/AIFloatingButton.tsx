/**
 * AI Floating Button Component
 * Uses standard Tailwind classes.
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
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap"
                    >
                        Ask AI for help
                        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Button */}
            <Link to="/dashboard/chat">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
                    onMouseEnter={() => setIsTooltipVisible(true)}
                    onMouseLeave={() => setIsTooltipVisible(false)}
                    aria-label="Ask AI"
                >
                    <MessageSquare className="w-6 h-6" />
                </motion.button>
            </Link>
        </div>
    );
}
