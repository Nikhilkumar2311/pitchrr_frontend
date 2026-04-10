import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Trash2, Reply, ChevronDown } from 'lucide-react';
import { type PostComment, usePostComments, useAddComment, useDeleteComment } from '@/hooks/useCommunity';

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
}

/** Shared input style helper */
const inputStyles = {
  background: 'var(--color-bg-light)',
  border: '1.5px solid var(--color-border)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-body)',
};

const inputFocusClass =
  'outline-none transition-all focus:border-[var(--color-primary-blue)] focus:shadow-[0_0_0_3px_rgba(79,125,243,0.12)]';

/**
 * Scrolls to and flashes a comment/reply element by its data-comment-user.
 * Uses CSS class-based animation to avoid direct DOM style manipulation.
 */
function scrollToComment(userName: string) {
  const allEls = document.querySelectorAll<HTMLElement>('[data-comment-user]');
  let target: HTMLElement | null = null;
  for (const el of allEls) {
    if (el.getAttribute('data-comment-user') === userName) {
      target = el;
      break;
    }
  }
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // CSS class-based flash — safe with React (no direct style mutation)
  target.classList.add('comment-highlight-flash');
  setTimeout(() => {
    target?.classList.remove('comment-highlight-flash');
  }, 1500);
}

/**
 * Renders comment text with highlighted, clickable @mentions.
 */
function CommentContent({ content }: { content: string }) {
  const parts: { text: string; isMention: boolean }[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Match @mentions — captures @word or @word word (multi-word names)
  const simpleRegex = /@([^\s@][^@]*?)(?=\s|$)/g;

  while ((match = simpleRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: content.slice(lastIndex, match.index), isMention: false });
    }
    parts.push({ text: match[0], isMention: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ text: content.slice(lastIndex), isMention: false });
  }

  if (parts.length === 0) {
    return <>{content}</>;
  }

  return (
    <>
      {parts.map((part, i) =>
        part.isMention ? (
          <span
            key={i}
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              const mentionedName = part.text.slice(1).trim();
              scrollToComment(mentionedName);
            }}
            className="font-semibold cursor-pointer hover:underline"
            style={{ color: 'var(--color-primary-blue)' }}
          >
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </>
  );
}

/**
 * Inline reply input — appears directly under the reply/comment being responded to.
 */
function InlineReplyInput({
  replyText,
  setReplyText,
  onSubmit,
  onCancel,
  isPending,
  placeholder,
}: {
  replyText: string;
  setReplyText: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
  placeholder: string;
}) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="mt-1 mb-2 overflow-hidden"
    >
      <div className="flex gap-2 items-center">
        <input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
            if (e.key === 'Escape') onCancel();
          }}
          placeholder={placeholder}
          maxLength={280}
          autoFocus
          className={`flex-1 rounded-xl px-3 py-2 text-[11px] ${inputFocusClass}`}
          style={inputStyles}
        />
        <button
          onClick={onSubmit}
          disabled={isPending || !replyText.trim()}
          className="p-1.5 rounded-lg transition-all disabled:opacity-30 hover:bg-blue-50"
          style={{ color: 'var(--color-primary-blue)' }}
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onCancel}
          className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Single reply row — flat, with optional @mention prefix.
 */
function ReplyRow({
  reply,
  currentUserId,
  isReplyingToThis,
  replyText,
  setReplyText,
  onReplyTo,
  onSubmitReply,
  onCancelReply,
  isSubmitting,
}: {
  reply: PostComment;
  currentUserId?: string;
  isReplyingToThis: boolean;
  replyText: string;
  setReplyText: (v: string) => void;
  onReplyTo: () => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  isSubmitting: boolean;
}) {
  const deleteComment = useDeleteComment();

  return (
    <>
      <div
        className="flex items-start gap-2.5 py-2 px-3 rounded-lg hover:bg-blue-50/40 transition-colors"
        data-comment-user={reply.userName || 'User'}
        data-comment-id={reply.id}
      >
        {/* Avatar */}
        {reply.userAvatar ? (
          <img
            src={reply.userAvatar}
            alt={reply.userName || 'User'}
            className="w-6 h-6 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            style={{ background: 'var(--color-primary-blue)' }}
          >
            {reply.userName?.[0]?.toUpperCase() || 'U'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {reply.userName || 'User'}
            </span>
            <span className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p
            className="text-[11px] mt-0.5 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            <CommentContent content={reply.content} />
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            {currentUserId && (
              <button
                onClick={onReplyTo}
                className="flex items-center gap-1 text-[9px] font-medium transition-colors hover:text-blue-600"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Reply className="w-2.5 h-2.5" />
                Reply
              </button>
            )}
            {currentUserId === reply.userId && (
              <button
                onClick={() => deleteComment.mutate({ commentId: reply.id })}
                className="text-[9px] transition-colors hover:text-red-500"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply input appears directly under this reply */}
      <AnimatePresence>
        {isReplyingToThis && (
          <div className="pl-8">
            <InlineReplyInput
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
              isPending={isSubmitting}
              placeholder={`Reply to ${reply.userName || 'User'}...`}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Top-level comment with collapsible reply thread (YouTube-style flat replies).
 */
function CommentThread({
  comment,
  postId,
  currentUserId,
}: {
  comment: PostComment;
  postId: string;
  currentUserId?: string;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();

  const replyCount = comment.replies?.length ?? 0;

  const openReplyTo = (targetId: string, targetName?: string) => {
    setReplyingToId(targetId);
    setShowReplies(true);
    setReplyText(targetId !== comment.id && targetName ? `@${targetName} ` : '');
  };

  const handleReply = async () => {
    if (!replyText.trim() || !currentUserId) return;
    await addComment.mutateAsync({ postId, content: replyText.trim(), parentId: comment.id });
    setReplyText('');
    setReplyingToId(null);
    setShowReplies(true);
  };

  const cancelReply = () => {
    setReplyingToId(null);
    setReplyText('');
  };

  return (
    <div>
      {/* Top-level comment */}
      <div
        className="flex items-start gap-2.5 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors"
        data-comment-user={comment.userName || 'User'}
        data-comment-id={comment.id}
      >
        {comment.userAvatar ? (
          <img
            src={comment.userAvatar}
            alt={comment.userName || 'User'}
            className="w-7 h-7 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{ background: 'var(--color-gradient)' }}
          >
            {comment.userName?.[0]?.toUpperCase() || 'U'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {comment.userName || 'User'}
            </span>
            <span className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p
            className="text-[11px] mt-0.5 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            <CommentContent content={comment.content} />
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1">
            {currentUserId && (
              <button
                onClick={() => openReplyTo(comment.id)}
                className="flex items-center gap-1 text-[10px] font-medium transition-colors hover:text-blue-600"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}
            {currentUserId === comment.userId && (
              <button
                onClick={() => deleteComment.mutate({ commentId: comment.id })}
                className="text-[10px] transition-colors hover:text-red-500"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply input for the parent comment */}
      <AnimatePresence>
        {replyingToId === comment.id && (
          <div className="ml-10">
            <InlineReplyInput
              replyText={replyText}
              setReplyText={setReplyText}
              onSubmit={handleReply}
              onCancel={cancelReply}
              isPending={addComment.isPending}
              placeholder={`Reply to ${comment.userName || 'User'}...`}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Reply thread (indented, flat) */}
      {replyCount > 0 && (
        <div className="ml-10">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 text-[10px] font-semibold py-1 transition-colors hover:text-blue-700"
            style={{ color: 'var(--color-primary-blue)' }}
          >
            <ChevronDown
              className="w-3 h-3 transition-transform"
              style={{ transform: showReplies ? 'rotate(180deg)' : 'rotate(0)' }}
            />
            {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
          </button>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
                style={{ borderLeft: '2px solid var(--color-border)' }}
              >
                {comment.replies?.map((reply) => (
                  <ReplyRow
                    key={reply.id}
                    reply={reply}
                    currentUserId={currentUserId}
                    isReplyingToThis={replyingToId === reply.id}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    onReplyTo={() => openReplyTo(reply.id, reply.userName || 'User')}
                    onSubmitReply={handleReply}
                    onCancelReply={cancelReply}
                    isSubmitting={addComment.isPending}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = usePostComments(postId);
  const addComment = useAddComment();

  const allComments = data?.pages.flatMap((page) => page.comments) ?? [];

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUserId) return;
    await addComment.mutateAsync({ postId, content: newComment.trim() });
    setNewComment('');
  };

  return (
    <div className="px-5 pb-4" style={{ borderTop: '1px solid var(--color-border)' }}>
      {/* New Comment Input */}
      {currentUserId && (
        <div className="flex gap-2 py-3 items-center">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Add a comment..."
            maxLength={280}
            className={`flex-1 rounded-xl px-3 py-2 text-xs ${inputFocusClass}`}
            style={inputStyles}
          />
          <button
            onClick={handleSubmit}
            disabled={addComment.isPending || !newComment.trim()}
            className="p-2 rounded-lg transition-all disabled:opacity-30 hover:bg-blue-50"
            style={{ color: 'var(--color-primary-blue)' }}
          >
            {addComment.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
        </div>
      ) : allComments.length === 0 ? (
        <p
          className="text-[11px] py-3 text-center"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          No comments yet — be the first!
        </p>
      ) : (
        <div className="space-y-1 pt-1">
          {allComments.map((comment) => (
            <CommentThread
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
            />
          ))}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full text-[10px] font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors"
              style={{ color: 'var(--color-primary-blue)', fontFamily: 'var(--font-body)' }}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more comments'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
