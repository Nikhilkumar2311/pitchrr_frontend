import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, TrendingUp, Clock, Loader2, Sparkles, Zap, PenLine } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'react-router-dom';
import { useFeed } from '@/hooks/useCommunity';
import { PostCard } from '@/components/community/PostCard';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { AutoPostPanel } from '@/components/community/AutoPostPanel';
import { Header } from '@/layout/Header';
import { Footer } from '@/layout/Footer';
import '@/styles/landing.css';

export default function ExplorePage() {
  const { user } = useAuth();
  const { postId: sharedPostId } = useParams<{ postId?: string }>();
  const [tab, setTab] = useState<'latest' | 'trending'>('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAutoPost, setShowAutoPost] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFeed(tab);

  // Infinite scroll observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  // Auto-scroll to shared post when loaded
  useEffect(() => {
    if (!sharedPostId || isLoading || hasScrolled || allPosts.length === 0) return;
    const el = document.querySelector(`[data-post-id="${sharedPostId}"]`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('comment-highlight-flash');
        setTimeout(() => el.classList.remove('comment-highlight-flash'), 2000);
        setHasScrolled(true);
      }, 600); // Wait for entrance animation
    }
  }, [sharedPostId, isLoading, allPosts.length, hasScrolled]);

  return (
    <div className="landing-page w-full mx-auto overflow-x-hidden" style={{ background: 'var(--color-bg-light)' }}>
      <Header />

      {/* Hero */}
      <section
        className="pt-32 pb-10 px-4 relative overflow-hidden"
        style={{ background: 'var(--color-bg-light)' }}
      >
        {/* Ambient gradient blobs */}
        <div
          className="absolute top-20 -left-32 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'var(--color-primary-blue)' }}
        />
        <div
          className="absolute top-40 -right-32 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'var(--color-primary-violet)' }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{
                background: 'var(--color-bg-accent)',
                color: 'var(--color-primary-blue)',
                border: '1px solid rgba(79, 125, 243, 0.15)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Compass className="w-3.5 h-3.5" />
              Community
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                letterSpacing: '-0.02em',
                color: 'var(--color-text-primary)',
              }}
            >
              Explore{' '}
              <span className="gradient-text">Community</span>
            </h1>

            <p
              className="text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-muted)',
              }}
            >
              See what founders are building, share your journey, and connect with the startup ecosystem.
            </p>

            {/* Action buttons — centered below heading */}
            {user && (
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowCreateModal(true)}
                  className="btn-gradient flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm"
                >
                  <PenLine className="w-4 h-4" />
                  Write a Post
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAutoPost(true)}
                  className="btn-outline flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm"
                >
                  <Zap className="w-4 h-4" />
                  Auto-Post
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Sticky Feed Bar */}
      <div
        className="sticky top-[72px] z-30 py-3 px-4"
        style={{
          background: 'rgba(248, 250, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2">
          {[
            { key: 'latest' as const, label: 'Latest', icon: Clock },
            { key: 'trending' as const, label: 'Trending', icon: TrendingUp },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: tab === t.key ? 'white' : 'transparent',
                color: tab === t.key ? 'var(--color-primary-blue)' : 'var(--color-text-muted)',
                boxShadow: tab === t.key ? 'var(--shadow-soft)' : 'none',
                border: tab === t.key ? '1px solid var(--color-border)' : '1px solid transparent',
                fontFamily: 'var(--font-body)',
              }}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <section className="max-w-2xl mx-auto px-4 py-8" style={{ minHeight: '50vh' }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
          </div>
        ) : allPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--color-bg-accent)' }}
            >
              <Sparkles className="w-7 h-7" style={{ color: 'var(--color-primary-blue)' }} />
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              No posts yet
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              Be the first to share your startup journey!
            </p>
            {user && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="btn-gradient inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm"
              >
                <PenLine className="w-4 h-4" />
                Write the First Post
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {allPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  data-post-id={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: 'easeOut' }}
                >
                  <PostCard post={post} currentUserId={user?.id} />
                </motion.div>
              ))}
            </AnimatePresence>

            <div ref={sentinelRef} className="py-6 flex justify-center">
              {isFetchingNextPage && (
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
              )}
            </div>
          </div>
        )}
      </section>

      {/* Modals */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <AutoPostPanel
        isOpen={showAutoPost}
        onClose={() => setShowAutoPost(false)}
      />

      <Footer />
    </div>
  );
}
