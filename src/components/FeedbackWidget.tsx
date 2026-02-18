
import { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { createFeedback } from '../services/api';

export default function FeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
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
            setIsOpen(false);
        } catch (error) {
            toast.error('Failed to send feedback.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="w-80 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Send Feedback</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500">Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['FEATURE', 'BUG', 'OTHER'].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setType(t)}
                                            className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${type === t
                                                    ? 'bg-indigo-600 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
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
                                    className="h-24 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-colors ${isOpen ? 'bg-white text-gray-900 border border-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
            >
                {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            </motion.button>
        </div>
    );
}
