import { motion } from 'framer-motion';
import {
  BarChart3, ThumbsUp, MessageCircle, Share2, Loader2,
  TrendingUp, PenLine, Trash2, Bot, ExternalLink, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useMyPostsDashboard, useDeletePost, usePostComments } from '@/hooks/useCommunity';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import '@/styles/community.css';

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

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PUBLISHED: { bg: '#ECFDF5', text: '#059669', label: 'Published' },
  PENDING_REVIEW: { bg: '#FFF7ED', text: '#D97706', label: 'Under Review' },
  REJECTED: { bg: '#FEF2F2', text: '#DC2626', label: 'Rejected' },
  ARCHIVED: { bg: '#F3F4F6', text: '#6B7280', label: 'Archived' },
};

// Post list item with expandable comments
function ExpandablePost({ post, navigate, deleteMutation }: any) {
  const [expanded, setExpanded] = useState(false);
  const status = statusColors[post.status] || statusColors['PUBLISHED'];

  // Only fetch comments when expanded
  const { data: commentsData, isLoading: loadingComments } = usePostComments(post.id, expanded);

  return (
    <div className="border-b last:border-0" style={{ borderColor: 'var(--color-border)' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setExpanded(!expanded)}
        className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 hover:bg-gray-50/50 transition-colors cursor-pointer"
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold"
              style={{ background: status.bg, color: status.text }}
            >
              {status.label}
            </span>
            {post.aiGenerated && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                style={{ background: '#F3EEFF', color: '#8B5CF6' }}
              >
                <Bot className="w-2.5 h-2.5" /> AI
              </span>
            )}
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              {timeAgo(post.createdAt)}
            </span>
          </div>

          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            {post.content}
          </p>

          {post.ideaTitle && (
            <span
              className="inline-block mt-1.5 text-[10px] font-semibold"
              style={{ color: 'var(--color-primary-blue)' }}
            >
              {post.ideaTitle}
            </span>
          )}
        </div>

        {/* Stats + Actions row */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            <ThumbsUp className="w-3 h-3" style={{ color: '#4F7DF3' }} />
            <span className="font-semibold">{post.likeCount}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            <MessageCircle className="w-3 h-3" style={{ color: '#D97706' }} />
            <span className="font-semibold">{post.commentCount}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            <Share2 className="w-3 h-3" style={{ color: '#8B5CF6' }} />
            <span className="font-semibold">{post.shareCount}</span>
          </div>

          <div className="w-px h-4 bg-gray-200 mx-0.5" />

          <button
            onClick={() => navigate(`/explore/post/${post.id}`)}
            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            title="View post"
          >
            <ExternalLink className="w-3.5 h-3.5" style={{ color: 'var(--color-primary-blue)' }} />
          </button>
          <button
            onClick={() => deleteMutation.mutate(post.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete post"
          >
            <Trash2 className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
          </button>

          <div className="w-px h-4 bg-gray-200 mx-0.5" />

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title={expanded ? 'Collapse' : 'Expand comments'}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>
        </div>
      </motion.div>

      {/* Expanded Comments Section */}
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-gray-50/50 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="px-12 py-4">
            <h4 className="text-[11px] font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
              <MessageCircle className="w-3.5 h-3.5" style={{ color: '#D97706' }} />
              Comments on this post
            </h4>

            {loadingComments ? (
              <div className="py-4 flex justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            ) : !commentsData?.pages?.[0]?.comments?.length ? (
              <p className="text-[11px] py-2" style={{ color: 'var(--color-text-muted)' }}>No comments yet.</p>
            ) : (
              <div className="space-y-4">
                {commentsData.pages[0].comments.slice(0, 5).map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    {comment.userAvatar ? (
                      <img src={comment.userAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--color-primary-blue)' }}>
                        {comment.userName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                          {comment.userName || 'Anonymous'}
                        </span>
                        <span className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
                {post.commentCount > 5 && (
                  <button
                    onClick={() => navigate(`/explore/post/${post.id}`)}
                    className="text-[10px] font-medium hover:underline ml-9"
                    style={{ color: 'var(--color-primary-blue)' }}
                  >
                    View all {post.commentCount} comments...
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function MyPosts() {
  const { data, isLoading } = useMyPostsDashboard();
  const deleteMutation = useDeletePost();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<30 | 14 | 7>(30);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center py-24">
        <div
          className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
          style={{ background: 'var(--color-bg-accent)' }}
        >
          <BarChart3 className="w-7 h-7" style={{ color: 'var(--color-primary-blue)' }} />
        </div>
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
        >
          No posts yet
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Share your startup journey and track engagement here.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/explore')}
          className="btn-gradient inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm text-white font-semibold"
        >
          <PenLine className="w-4 h-4" />
          Write Your First Post
        </motion.button>
      </div>
    );
  }

  const { posts, totals, dailyAnalytics } = data;

  // Format chart dates and filter by selected time range
  const chartData = dailyAnalytics
    .slice(-timeRange)
    .map(d => ({
      ...d,
      label: new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    }));

  const statCards = [
    { label: 'Total Posts', value: totals.totalPosts, icon: PenLine, color: '#4F7DF3', bg: '#EDF1FE' },
    { label: 'Total Likes', value: totals.totalLikes, icon: ThumbsUp, color: '#059669', bg: '#ECFDF5' },
    { label: 'Total Comments', value: totals.totalComments, icon: MessageCircle, color: '#D97706', bg: '#FFF7ED' },
    { label: 'Total Shares', value: totals.totalShares, icon: Share2, color: '#8B5CF6', bg: '#F3EEFF' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 sm:space-y-6" style={{ paddingBottom: '80px' }}>
      {/* Page Header */}
      <div className="my-posts-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            My Posts
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Track your community engagement and post performance.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'var(--color-primary-blue)',
            color: 'white',
          }}
        >
          <PenLine className="w-3.5 h-3.5" />
          New Post
        </motion.button>
      </div>

      {/* Stat Cards */}
      <div className="my-posts-stats grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-2xl p-4 transition-all hover:shadow-md"
            style={{
              background: 'white',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <TrendingUp className="w-3.5 h-3.5" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {stat.value}
            </p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-2xl p-5"
        style={{
          background: 'white',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div className="flex flex-col gap-3 mb-5">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Engagement Analytics
            </h3>
            <div className="relative group">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value) as 30 | 14 | 7)}
                className="appearance-none text-[10px] font-semibold cursor-pointer pl-2 pr-6 py-1 rounded-md transition-colors"
                style={{
                  background: 'rgba(79, 125, 243, 0.1)',
                  color: '#4F7DF3',
                  border: '1px solid rgba(79, 125, 243, 0.2)',
                }}
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#4F7DF3' }} />
            </div>
          </div>

          {/* Legend row */}
          <div className="flex items-center gap-4">
            {[
              { label: 'Likes', color: '#4F7DF3' },
              { label: 'Comments', color: '#D97706' },
              { label: 'Shares', color: '#8B5CF6' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradLikes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F7DF3" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4F7DF3" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradComments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97706" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradShares" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '11px',
                padding: '10px 14px',
              }}
            />
            <Area
              type="monotone"
              dataKey="likes"
              stroke="#4F7DF3"
              strokeWidth={2}
              fill="url(#gradLikes)"
              dot={false}
              activeDot={{ r: 4, fill: '#4F7DF3' }}
            />
            <Area
              type="monotone"
              dataKey="comments"
              stroke="#D97706"
              strokeWidth={2}
              fill="url(#gradComments)"
              dot={false}
              activeDot={{ r: 4, fill: '#D97706' }}
            />
            <Area
              type="monotone"
              dataKey="shares"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#gradShares)"
              dot={false}
              activeDot={{ r: 4, fill: '#8B5CF6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Posts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'white',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div className="p-4 sm:p-5 pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3
              className="text-sm font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              All Posts ({posts.length})
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: 'ALL', label: 'All' },
                { key: 'PUBLISHED', label: 'Published', color: '#059669' },
                { key: 'PENDING_REVIEW', label: 'Under Review', color: '#D97706' },
                { key: 'REJECTED', label: 'Rejected', color: '#DC2626' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all"
                  style={{
                    background: statusFilter === f.key ? (f.color ? `${f.color}15` : 'rgba(79,125,243,0.1)') : 'transparent',
                    color: statusFilter === f.key ? (f.color || 'var(--color-primary-blue)') : 'var(--color-text-muted)',
                    border: `1px solid ${statusFilter === f.key ? (f.color ? `${f.color}30` : 'rgba(79,125,243,0.2)') : 'var(--color-border)'}`,
                  }}
                >
                  {f.label}
                  {f.key !== 'ALL' && (
                    <span className="ml-1 opacity-60">
                      {posts.filter((p: any) => p.status === f.key).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {posts
            .filter((post: any) => statusFilter === 'ALL' || post.status === statusFilter)
            .map((post: any) => (
              <ExpandablePost key={post.id} post={post} navigate={navigate} deleteMutation={deleteMutation} />
            ))}
          {posts.filter((post: any) => statusFilter === 'ALL' || post.status === statusFilter).length === 0 && (
            <div className="p-8 text-center">
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                No {statusFilter === 'ALL' ? '' : statusFilter.toLowerCase().replace('_', ' ')} posts.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
