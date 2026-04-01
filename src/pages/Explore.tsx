import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, PenLine, Bookmark, Users, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useFeed, useMyBookmarks } from '@/hooks/useCommunity';
import { PostCard } from '@/components/community/PostCard';
import { CreatePostModal } from '@/components/community/CreatePostModal';
import { AutoPostPanel } from '@/components/community/AutoPostPanel';
import { CommunityLayout } from '@/components/community/CommunityLayout';
import { LeftSidebar } from '@/components/community/LeftSidebar';
import { PostComposer } from '@/components/community/PostComposer';
import { SuggestedFounders } from '@/components/community/SuggestedFounders';
import { TrendingStartups } from '@/components/community/TrendingStartups';
import { AIPromptIdeas } from '@/components/community/AIPromptIdeas';
import { MobileBottomNav } from '@/components/community/MobileBottomNav';
import { Header } from '@/layout/Header';
import '@/styles/landing.css';
import '@/styles/community.css';

type ViewMode = 'feed' | 'saved' | 'following';

export default function ExplorePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { postId: sharedPostId } = useParams<{ postId?: string }>();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<'latest' | 'trending'>(
    (searchParams.get('tab') as 'latest' | 'trending') || 'latest'
  );
  const [activeNav, setActiveNav] = useState('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAutoPost, setShowAutoPost] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('feed');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useFeed(tab);
  const { data: savedData, isLoading: savedLoading } = useMyBookmarks();

  // Sync nav with tab
  const handleNavChange = (key: string) => {
    setActiveNav(key);

    if (key === 'drafts') {
      navigate('/dashboard/my-posts');
      return;
    }

    if (key === 'saved') {
      setViewMode('saved');
      setActiveTopic(null);
      return;
    }

    if (key === 'following') {
      setViewMode('following');
      setActiveTopic(null);
      return;
    }

    setViewMode('feed');
    if (key === 'latest') setTab('latest');
    if (key === 'trending') setTab('trending');
  };

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
  const savedPosts = savedData?.pages?.flatMap((page) => page.posts) ?? [];

  // Apply topic filter
  const filteredPosts = activeTopic
    ? allPosts.filter((p) => p.industry?.toLowerCase() === activeTopic.toLowerCase())
    : allPosts;

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
      }, 600);
    }
  }, [sharedPostId, isLoading, allPosts.length, hasScrolled]);

  // AI prompt click handler
  const handlePromptSelect = (prompt: string) => {
    setShowCreateModal(true);
    setTimeout(() => {
      const textarea = document.querySelector<HTMLTextAreaElement>('.create-post-textarea');
      if (textarea) {
        textarea.value = prompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 300);
  };

  // Determine which posts to show based on viewMode
  const displayPosts = viewMode === 'saved' ? savedPosts : filteredPosts;
  const displayLoading = viewMode === 'saved' ? savedLoading : isLoading;
  const isFeedView = viewMode === 'feed';

  // Empty state config per view
  const emptyConfig: Record<ViewMode, { icon: React.ReactNode; title: string; subtitle: string }> = {
    feed: {
      icon: <Sparkles className="w-7 h-7" style={{ color: 'var(--color-primary-blue)' }} />,
      title: activeTopic ? `No posts in ${activeTopic}` : 'No posts yet',
      subtitle: activeTopic ? 'Try a different topic or clear the filter.' : 'Be the first to share your startup journey!',
    },
    saved: {
      icon: <Bookmark className="w-7 h-7" style={{ color: 'var(--color-primary-blue)' }} />,
      title: 'No saved posts',
      subtitle: 'Bookmark posts using the bookmark icon and they\'ll appear here.',
    },
    following: {
      icon: <Users className="w-7 h-7" style={{ color: 'var(--color-primary-blue)' }} />,
      title: 'No posts from followed founders',
      subtitle: 'Follow founders to see their posts in this feed.',
    },
  };

  return (
    <div className="landing-page w-full mx-auto" style={{ background: 'var(--color-bg-light)', overflow: 'hidden' }}>
      <Header />

      <CommunityLayout
        leftSidebar={
          <LeftSidebar
            activeNav={activeNav}
            onNavChange={handleNavChange}
          />
        }
        rightSidebar={
          <div className="space-y-4">
            <AIPromptIdeas onSelectPrompt={handlePromptSelect} />
            <SuggestedFounders />
            <TrendingStartups />
          </div>
        }
      >
        {/* Inline Post Composer (only on feed view) */}
        {isFeedView && (
          <div className="mb-5">
            <PostComposer onOpenAutoPost={() => setShowAutoPost(true)} />
          </div>
        )}

        {/* Active Topic Filter Indicator */}
        {activeTopic && isFeedView && (
          <div
            className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl"
            style={{
              background: 'rgba(79, 125, 243, 0.06)',
              border: '1px solid rgba(79, 125, 243, 0.15)',
            }}
          >
            <span className="text-xs font-semibold" style={{ color: 'var(--color-primary-blue)' }}>
              Filtering by: {activeTopic}
            </span>
            <button
              onClick={() => setActiveTopic(null)}
              className="ml-auto p-1 rounded-lg hover:bg-white/60 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Feed */}
        {displayLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
          </div>
        ) : displayPosts.length === 0 ? (
          <motion.div
            key={viewMode + '-empty-' + (activeTopic || '')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--color-bg-accent)' }}
            >
              {emptyConfig[viewMode].icon}
            </div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              {emptyConfig[viewMode].title}
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
              {emptyConfig[viewMode].subtitle}
            </p>
            {isFeedView && !activeTopic && user && (
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
              {displayPosts.map((post, index) => (
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

            {isFeedView && (
              <div ref={sentinelRef} className="py-6 flex justify-center">
                {isFetchingNextPage && (
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
                )}
              </div>
            )}
          </div>
        )}
      </CommunityLayout>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav onCreatePost={() => setShowCreateModal(true)} />

      {/* Modals */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <AutoPostPanel
        isOpen={showAutoPost}
        onClose={() => setShowAutoPost(false)}
      />
    </div>
  );
}
