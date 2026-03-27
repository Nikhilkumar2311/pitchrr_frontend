import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// ============================================================================
// Types
// ============================================================================

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
  ideaId: string | null;
  ideaTitle: string | null;
  industry: string | null;
  content: string;
  status: string;
  isAutoPost: boolean;
  aiGenerated: boolean;
  rejectReason: string | null;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
  postId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  replies?: PostComment[];
}

interface FeedResponse {
  posts: CommunityPost[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface CommentsResponse {
  comments: PostComment[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ============================================================================
// Feed Hooks
// ============================================================================

export function useFeed(tab: 'latest' | 'trending' = 'latest') {
  const endpoint = tab === 'trending' ? '/community/feed/trending' : '/community/feed';

  return useInfiniteQuery<FeedResponse>({
    queryKey: ['community-feed', tab],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = { limit: '20' };
      if (pageParam) params.cursor = pageParam as string;
      const res = await api.get(endpoint, { params });
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });
}

// ============================================================================
// Post Mutations
// ============================================================================

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; ideaId?: string; ideaTitle?: string; industry?: string }) => {
      const res = await api.post('/community/post', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.delete(`/community/post/${postId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}

// ============================================================================
// Reaction Mutations
// ============================================================================

export function useReactToPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, isLike }: { postId: string; isLike: boolean }) => {
      const res = await api.post(`/community/post/${postId}/react`, { isLike });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}

// ============================================================================
// Comment Hooks
// ============================================================================

export function usePostComments(postId: string, enabled: boolean = true) {
  return useInfiniteQuery<CommentsResponse>({
    queryKey: ['community-comments', postId],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = { limit: '10' };
      if (pageParam) params.cursor = pageParam as string;
      const res = await api.get(`/community/post/${postId}/comments`, { params });
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) => {
      const res = await api.post(`/community/post/${postId}/comment`, { content, parentId });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId }: { commentId: string }) => {
      const res = await api.delete(`/community/comment/${commentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-comments'] });
      queryClient.invalidateQueries({ queryKey: ['community-feed'] });
    },
  });
}

// ============================================================================
// Share
// ============================================================================

export function useSharePost() {
  return useMutation({
    mutationFn: async ({ postId, platform }: { postId: string; platform?: string }) => {
      const res = await api.post(`/community/post/${postId}/share`, { platform });
      return res.data;
    },
  });
}

// ============================================================================
// Auto-Post Settings
// ============================================================================

export interface AutoPostSettings {
  id: string;
  userId: string;
  ideaId: string | null;
  ideaTitle: string | null;
  enabled: boolean;
  frequency: 'DAILY' | 'TWICE_A_WEEK' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  nextRunAt: string | null;
  lastRunAt: string | null;
}

export function useAutoPostSettings() {
  return useQuery<AutoPostSettings>({
    queryKey: ['auto-post-settings'],
    queryFn: async () => {
      const res = await api.get('/community/settings/auto-post');
      return res.data;
    },
  });
}

export function useUpdateAutoPostSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<AutoPostSettings>) => {
      const res = await api.put('/community/settings/auto-post', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-post-settings'] });
    },
  });
}

// ============================================================================
// Achievements
// ============================================================================

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  earnedAt: string;
  metadata: any;
  description: string;
  credits: number;
}

export function useMyAchievements() {
  return useQuery<Achievement[]>({
    queryKey: ['my-achievements'],
    queryFn: async () => {
      const res = await api.get('/community/achievements');
      return res.data;
    },
  });
}

