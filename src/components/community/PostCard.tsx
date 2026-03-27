import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Trash2, Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { type CommunityPost, useReactToPost, useDeletePost } from '@/hooks/useCommunity';
import { CommentSection } from './CommentSection';
import { ShareModal } from './ShareModal';

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

  const reactMutation = useReactToPost();
  const deleteMutation = useDeletePost();

  const isOwner = currentUserId === post.userId;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'white',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-soft)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
        e.currentTarget.style.borderColor = 'rgba(79, 125, 243, 0.2)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-soft)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 pb-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              background: post.userAvatar
                ? `url(${post.userAvatar}) center/cover`
                : 'var(--color-gradient)',
            }}
          >
            {!post.userAvatar && (post.userName?.[0]?.toUpperCase() || 'U')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
              >
                {post.userName || 'Anonymous'}
              </span>
              {post.aiGenerated && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: 'var(--color-bg-accent)',
                    color: 'var(--color-primary-violet)',
                  }}
                >
                  <Bot className="w-2.5 h-2.5" /> AI
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {post.ideaTitle && (
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: 'var(--color-primary-blue)' }}
                >
                  {post.ideaTitle}
                </span>
              )}
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => deleteMutation.mutate(post.id)}
            className="p-1.5 rounded-lg transition-all hover:bg-red-50"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
        >
          {post.content}
        </p>
        {post.industry && (
          <span
            className="inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-semibold"
            style={{
              background: 'var(--color-bg-accent)',
              color: 'var(--color-primary-blue)',
              border: '1px solid rgba(79, 125, 243, 0.12)',
            }}
          >
            {post.industry}
          </span>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-1 px-5 py-3"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <button
          onClick={() => currentUserId && reactMutation.mutate({ postId: post.id, isLike: true })}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-blue-50"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          {post.likeCount > 0 && <span style={{ color: 'var(--color-primary-blue)' }}>{post.likeCount}</span>}
        </button>

        <button
          onClick={() => currentUserId && reactMutation.mutate({ postId: post.id, isLike: false })}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-red-50"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
          {post.dislikeCount > 0 && post.dislikeCount}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-blue-50"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          {post.commentCount > 0 && post.commentCount}
          {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <button
          onClick={() => setShowShare(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-blue-50 ml-auto"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
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
