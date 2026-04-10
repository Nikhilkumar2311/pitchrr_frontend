import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { useCreatePost } from '@/hooks/useCommunity';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface PostComposerProps {
  onOpenAutoPost: () => void;
}

export function PostComposer({ onOpenAutoPost }: PostComposerProps) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const createPost = useCreatePost();

  if (!user) return null;

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
      setExpanded(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create post');
    }
  };

  if (!expanded) {
    return (
      <div
        className="post-composer-collapsed"
        onClick={() => setExpanded(true)}
      >
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.firstName || 'User'}
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'var(--color-gradient)' }}
          >
            {user.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <span
          className="text-sm flex-1"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          Share your startup journey...
        </span>
        <Sparkles className="w-4 h-4" style={{ color: 'var(--color-primary-violet)' }} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="post-composer-expanded"
    >
      <div className="p-5 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening with your startup? Share an update, insight, or question..."
          maxLength={500}
          rows={4}
          autoFocus
          className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all focus:ring-2"
          style={{
            background: 'var(--color-bg-light)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
          }}
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
            {content.length}/500
          </span>
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

      <div
        className="flex items-center justify-between px-5 pb-4"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAutoPost}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:bg-blue-50"
            style={{ color: 'var(--color-primary-blue)', fontFamily: 'var(--font-body)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate with AI
          </button>
          <button
            onClick={() => { setExpanded(false); setContent(''); }}
            className="text-[11px] font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Cancel
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={createPost.isPending || content.trim().length < 10}
          className="btn-gradient flex items-center gap-2 px-5 py-2 rounded-xl text-xs disabled:opacity-50"
        >
          {createPost.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              Post
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
