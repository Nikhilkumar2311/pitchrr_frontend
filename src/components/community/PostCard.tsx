import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowBigUp, MessageCircle, Share2, Bot,
  ChevronDown, ChevronUp, Bookmark
} from 'lucide-react';
import { type CommunityPost, useReactToPost, useToggleBookmark, useFollowUser, useIsFollowing } from '@/hooks/useCommunity';
import { CommentSection } from './CommentSection';
import { ShareModal } from './ShareModal';
import { Link } from 'react-router-dom';

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

interface PostCardProps {
  post: CommunityPost;
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [localFollowed, setLocalFollowed] = useState<boolean | null>(null);

  const reactMutation = useReactToPost();
  const bookmarkMutation = useToggleBookmark();
  const followMutation = useFollowUser();

  const isOwner = currentUserId === post.userId;

  // Fetch follow status from backend
  const { data: followStatus } = useIsFollowing(!isOwner && currentUserId ? post.userId : undefined);

  // Sync local state with backend
  useEffect(() => {
    if (followStatus?.isFollowing !== undefined && localFollowed === null) {
      setLocalFollowed(followStatus.isFollowing);
    }
  }, [followStatus, localFollowed]);

  const isFollowed = localFollowed ?? followStatus?.isFollowing ?? false;

  const handleFollow = () => {
    setLocalFollowed(!isFollowed);
    followMutation.mutate(post.userId);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (currentUserId) {
      bookmarkMutation.mutate(post.id);
    }
  };

  return (
    <div className="post-card-premium">
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}>
            {post.userAvatar ? (
              <img
                src={post.userAvatar}
                alt={post.userName || 'User'}
                className="w-11 h-11 rounded-full object-cover shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all"
                style={{ background: 'var(--color-gradient)' }}
              >
                {post.userName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/profile/${post.userId}`}
                className="text-sm font-semibold hover:underline"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
              >
                {post.userName || 'Anonymous'}
              </Link>
              {post.ideaTitle && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: 'rgba(79, 125, 243, 0.08)',
                    color: 'var(--color-primary-blue)',
                  }}
                >
                  {post.ideaTitle}
                </span>
              )}
              {post.aiGenerated && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: '#F3EEFF', color: '#8B5CF6' }}
                >
                  <Bot className="w-2.5 h-2.5" /> AI
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                {timeAgo(post.createdAt)}
              </span>
              {post.industry && (
                <>
                  <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>·</span>
                  <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    {post.industry}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Follow button (hidden for own posts) */}
          {!isOwner && currentUserId && (
            <button
              onClick={handleFollow}
              className={`follow-btn ${isFollowed ? 'following' : ''}`}
            >
              {isFollowed ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <p
          className="text-[14px] leading-7 whitespace-pre-wrap"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {post.content}
        </p>
      </div>

      {/* Actions Bar */}
      <div
        className="flex items-center gap-1 px-4 py-2.5"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        {/* Upvote */}
        <button
          onClick={() => currentUserId && reactMutation.mutate({ postId: post.id, isLike: true })}
          className="post-action-btn"
        >
          <ArrowBigUp className="w-4 h-4" />
          {post.likeCount > 0 && <span className="font-semibold">{post.likeCount}</span>}
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="post-action-btn"
        >
          <MessageCircle className="w-4 h-4" />
          {post.commentCount > 0 && <span>{post.commentCount}</span>}
          {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Share */}
        <button
          onClick={() => setShowShare(true)}
          className="post-action-btn"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          className={`post-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CommentSection postId={post.id} currentUserId={currentUserId} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        postId={post.id}
        postContent={post.content}
      />
    </div>
  );
}
