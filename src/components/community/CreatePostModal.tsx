import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';
import { useCreatePost } from '@/hooks/useCommunity';
import toast from 'react-hot-toast';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const createPost = useCreatePost();

  const handleSubmit = async () => {
    if (content.trim().length < 10) {
      toast.error('Post must be at least 10 characters');
      return;
    }

    try {
      await createPost.mutateAsync({
        content: content.trim(),
        ideaTitle: ideaTitle.trim() || undefined,
        industry: industry.trim() || undefined,
      });
      toast.success('Post submitted for review!');
      setContent('');
      setIdeaTitle('');
      setIndustry('');
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl overflow-hidden"
            style={{
              background: 'white',
              border: '1px solid var(--color-border)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <h3
                className="text-base font-semibold"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                Share with the Community
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening with your startup? Share an update, insight, or question..."
                maxLength={500}
                rows={5}
                className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: 'var(--color-bg-light)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-body)',
                  '--tw-ring-color': 'var(--color-primary-blue)',
                } as any}
              />
              <div
                className="text-right text-[10px] font-medium"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {content.length}/500
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  placeholder="Startup name (optional)"
                  className="rounded-xl px-3 py-2.5 text-xs outline-none transition-all focus:ring-2"
                  style={{
                    background: 'var(--color-bg-light)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Industry (optional)"
                  className="rounded-xl px-3 py-2.5 text-xs outline-none transition-all focus:ring-2"
                  style={{
                    background: 'var(--color-bg-light)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5">
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={createPost.isPending || content.trim().length < 10}
                className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm disabled:opacity-50"
              >
                {createPost.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Post to Community
                  </>
                )}
              </motion.button>
              <p
                className="text-[11px] text-center mt-3"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              >
                Your post will be reviewed by AI before publishing
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
