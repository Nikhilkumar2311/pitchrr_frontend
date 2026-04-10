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
// AI Content Generation
// ============================================================================

export function useGenerateAIContent() {
  return useMutation({
    mutationFn: async (data: {
      ideaTitle: string;
      industry?: string;
      description?: string;
      targetAudience?: string;
      problemSolved?: string;
    }) => {
      const res = await api.post('/community/settings/auto-post/generate-content', data);
      return res.data as { content: string };
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

export interface MyPostsDashboardData {
  posts: CommunityPost[];
  totals: {
    totalPosts: number;
    totalLikes: number;
    totalDislikes: number;
    totalComments: number;
    totalShares: number;
  };
  dailyAnalytics: {
    date: string;
    likes: number;
    comments: number;
    shares: number;
    posts: number;
  }[];
}

export function useMyPostsDashboard() {
  return useQuery<MyPostsDashboardData>({
    queryKey: ['my-posts-dashboard'],
    queryFn: async () => {
      const res = await api.get('/community/my-posts');
      return res.data;
    },
  });
}

// ============================================================================
// Follow Hooks
// ============================================================================

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await api.post(`/community/user/${userId}/follow`);
      return res.data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['follow-stats', userId] });
      queryClient.invalidateQueries({ queryKey: ['is-following', userId] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
    },
  });
}

export function useFollowStats(userId?: string) {
  return useQuery<{ followerCount: number; followingCount: number }>({
    queryKey: ['follow-stats', userId],
    queryFn: async () => {
      const res = await api.get(`/community/user/${userId}/follow-stats`);
      return res.data;
    },
    enabled: !!userId,
  });
}

export function useIsFollowing(userId?: string) {
  return useQuery<{ isFollowing: boolean }>({
    queryKey: ['is-following', userId],
    queryFn: async () => {
      const res = await api.get(`/community/user/${userId}/is-following`);
      return res.data;
    },
    enabled: !!userId,
  });
}

export function useMyFollowing(userId?: string) {
  return useQuery<{ following: string[] }>({
    queryKey: ['my-following', userId],
    queryFn: async () => {
      const res = await api.get(`/community/user/${userId}/following`);
      return res.data;
    },
    enabled: !!userId,
  });
}

// ============================================================================
// Bookmark Hooks
// ============================================================================

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await api.post(`/community/post/${postId}/bookmark`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookmarks'] });
    },
  });
}

export function useMyBookmarks() {
  return useInfiniteQuery<{ posts: CommunityPost[]; nextCursor: string | null; hasMore: boolean }>({
    queryKey: ['my-bookmarks'],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = { limit: '20' };
      if (pageParam) params.cursor = pageParam as string;
      const res = await api.get('/community/bookmarks', { params });
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });
}

// ============================================================================
// Profile Hooks
// ============================================================================

export interface UserPublicProfile {
  userId: string;
  userName: string;
  userAvatar: string | null;
  startupName: string | null;
  industry: string | null;
  bio: string | null;
  headline: string | null;
  website: string | null;
  twitter: string | null;
  linkedin: string | null;
  stats: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    followerCount: number;
    followingCount: number;
  };
}

export function useUserProfile(userId?: string) {
  return useQuery<UserPublicProfile>({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const res = await api.get(`/community/profile/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { bio?: string; headline?: string; website?: string; twitter?: string; linkedin?: string }) => {
      const res = await api.put('/community/profile/me', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

export function useUpdateCoreProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name?: string; avatarUrl?: string }) => {
      const res = await api.post('/users/me', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

export function useUserPosts(userId?: string) {
  return useInfiniteQuery<{ posts: CommunityPost[]; nextCursor: string | null; hasMore: boolean }>({
    queryKey: ['user-posts', userId],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string> = { limit: '20' };
      if (pageParam) params.cursor = pageParam as string;
      const res = await api.get(`/community/profile/${userId}/posts`, { params });
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!userId,
  });
}
