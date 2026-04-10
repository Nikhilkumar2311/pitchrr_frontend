import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createFeedback } from '@/services/api';
import { useFeedback } from '@/context/FeedbackContext';

export function FeedbackWidget() {
    const { isOpen, closeFeedback } = useFeedback();
    const [message, setMessage] = useState('');
    const [type, setType] = useState('FEATURE');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            await createFeedback({ message, type });
            toast.success('Feedback sent! Thank you.');
            setMessage('');
            closeFeedback();
        } catch (error) {
            toast.error('Failed to send feedback.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-sans relative z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeFeedback}
                            className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[90vw] rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl z-50"
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Send Feedback</h3>
                                <button
                                    onClick={closeFeedback}
                                    className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">Type</label>
                                    <div className="relative flex rounded-xl bg-gray-100 p-1">
                                        {/* Sliding indicator */}
                                        <motion.div
                                            className="absolute top-1 bottom-1 rounded-lg bg-white shadow-md"
                                            layout
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                            style={{
                                                width: `calc((100% - 8px) / 3)`,
                                                left: `calc(4px + ${['FEATURE', 'BUG', 'OTHER'].indexOf(type)} * (100% - 8px) / 3)`,
                                            }}
                                        />
                                        {['FEATURE', 'BUG', 'OTHER'].map((t, i) => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setType(t)}
                                                className="relative z-10 flex-1 py-2 text-xs font-semibold transition-colors duration-200"
                                                style={{
                                                    color: type === t ? '#4f46e5' : '#6b7280',
                                                    borderRight: i < 2 && type !== t && type !== ['FEATURE', 'BUG', 'OTHER'][i + 1]
                                                        ? '1px solid rgba(0,0,0,0.08)' : 'none',
                                                }}
                                            >
                                                {t.charAt(0) + t.slice(1).toLowerCase()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-gray-500">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us what you think..."
                                        className="h-36 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    Send Feedback
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
