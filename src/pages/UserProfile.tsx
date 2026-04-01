import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, ExternalLink, Globe, ArrowLeft, Pencil, X, Save, Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  useUserProfile, useUserPosts, useFollowUser, useIsFollowing, useUpdateProfile,
} from '@/hooks/useCommunity';
import { PostCard } from '@/components/community/PostCard';
import { Header } from '@/layout/Header';
import { AutoPostPanel } from '@/components/community/AutoPostPanel';
import toast from 'react-hot-toast';
import '@/styles/landing.css';
import '@/styles/community.css';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showAutoPost, setShowAutoPost] = useState(false);

  const { data: profile, isLoading } = useUserProfile(userId);
  const { data: postsData, isLoading: postsLoading } = useUserPosts(userId);
  const { data: followStatus } = useIsFollowing(userId);
  const followMutation = useFollowUser();
  const updateProfile = useUpdateProfile();

  const isOwnProfile = user?.id === userId;
  const allPosts = postsData?.pages?.flatMap((p) => p.posts) ?? [];

  // Edit form state
  const [editForm, setEditForm] = useState({
    bio: '',
    headline: '',
    website: '',
    twitter: '',
    linkedin: '',
  });

  const startEditing = () => {
    setEditForm({
      bio: profile?.bio || '',
      headline: profile?.headline || '',
      website: profile?.website || '',
      twitter: profile?.twitter || '',
      linkedin: profile?.linkedin || '',
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        bio: editForm.bio.trim() || undefined,
        headline: editForm.headline.trim() || undefined,
        website: editForm.website.trim() || undefined,
        twitter: editForm.twitter.trim() || undefined,
        linkedin: editForm.linkedin.trim() || undefined,
      });
      toast.success('Profile updated!');
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="landing-page" style={{ background: 'var(--color-bg-light)' }}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="landing-page" style={{ background: 'var(--color-bg-light)' }}>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] pt-24">
          <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Profile not found
          </p>
          <Link to="/explore" className="text-sm mt-3" style={{ color: 'var(--color-primary-blue)' }}>
            ← Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page w-full mx-auto" style={{ background: 'var(--color-bg-light)' }}>
      <Header />

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        {/* Back Link */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-medium mb-6 hover:underline"
          style={{ color: 'var(--color-primary-blue)' }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Community
        </Link>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: 'white',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          {/* Banner Gradient */}
          <div
            className="h-28"
            style={{
              background: 'var(--color-gradient)',
            }}
          />

          <div className="px-6 pb-6 -mt-10">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white ring-4 ring-white"
              style={{
                background: profile.userAvatar
                  ? `url(${profile.userAvatar}) center/cover`
                  : 'var(--color-gradient)',
              }}
            >
              {!profile.userAvatar && (profile.userName?.[0]?.toUpperCase() || 'U')}
            </div>

            <div className="flex items-start justify-between mt-3">
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
                >
                  {profile.userName}
                </h1>
                {profile.headline && !isEditing && (
                  <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {profile.headline}
                  </p>
                )}
                {profile.startupName && (
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-[11px] font-semibold"
                    style={{
                      background: 'rgba(79, 125, 243, 0.08)',
                      color: 'var(--color-primary-blue)',
                    }}
                  >
                    {profile.startupName}
                    {profile.industry && ` · ${profile.industry}`}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isOwnProfile && !isEditing && (
                  <button
                    onClick={startEditing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:bg-blue-50"
                    style={{
                      color: 'var(--color-primary-blue)',
                      border: '1px solid rgba(79, 125, 243, 0.2)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <Pencil className="w-3 h-3" />
                    Edit Profile
                  </button>
                )}
                {!isOwnProfile && user && (
                  <button
                    onClick={() => userId && followMutation.mutate(userId)}
                    className={`follow-btn ${followStatus?.isFollowing ? 'following' : ''}`}
                    style={{ marginTop: '4px' }}
                  >
                    {followStatus?.isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            </div>

            {/* Edit Form */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3 overflow-hidden"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-semibold mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
                        Headline
                      </label>
                      <input
                        value={editForm.headline}
                        onChange={(e) => setEditForm(prev => ({ ...prev, headline: e.target.value }))}
                        placeholder="e.g. Founder & CEO at StartupX"
                        className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all focus:ring-2"
                        style={{
                          background: 'var(--color-bg-light)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-body)',
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
                        Bio
                      </label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself and your startup journey..."
                        rows={3}
                        maxLength={500}
                        className="w-full resize-none rounded-xl px-3 py-2.5 text-xs outline-none transition-all focus:ring-2"
                        style={{
                          background: 'var(--color-bg-light)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          fontFamily: 'var(--font-body)',
                        }}
                      />
                      <span className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>
                        {editForm.bio.length}/500
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
                          Website
                        </label>
                        <input
                          value={editForm.website}
                          onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://..."
                          className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all focus:ring-2"
                          style={{
                            background: 'var(--color-bg-light)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
                          Twitter / X
                        </label>
                        <input
                          value={editForm.twitter}
                          onChange={(e) => setEditForm(prev => ({ ...prev, twitter: e.target.value }))}
                          placeholder="@handle"
                          className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all focus:ring-2"
                          style={{
                            background: 'var(--color-bg-light)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold mb-1 block" style={{ color: 'var(--color-text-muted)' }}>
                          LinkedIn
                        </label>
                        <input
                          value={editForm.linkedin}
                          onChange={(e) => setEditForm(prev => ({ ...prev, linkedin: e.target.value }))}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full rounded-xl px-3 py-2.5 text-xs outline-none transition-all focus:ring-2"
                          style={{
                            background: 'var(--color-bg-light)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSaveProfile}
                      disabled={updateProfile.isPending}
                      className="btn-gradient flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs disabled:opacity-50"
                    >
                      {updateProfile.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                      Save Changes
                    </motion.button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium hover:bg-gray-100 transition-colors"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bio (show only when not editing) */}
            {profile.bio && !isEditing && (
              <p
                className="text-sm leading-relaxed mt-3"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
              >
                {profile.bio}
              </p>
            )}

            {/* Social Links (show only when not editing) */}
            {!isEditing && (profile.website || profile.twitter || profile.linkedin) && (
              <div className="flex items-center gap-3 mt-3">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-medium hover:underline"
                    style={{ color: 'var(--color-primary-blue)' }}
                  >
                    <Globe className="w-3 h-3" />
                    Website
                  </a>
                )}
                {profile.twitter && (
                  <a
                    href={`https://x.com/${profile.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-medium hover:underline"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    @{profile.twitter}
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-medium hover:underline"
                    style={{ color: '#0A66C2' }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    LinkedIn
                  </a>
                )}
              </div>
            )}

            {/* Stats Row */}
            <div className="flex items-center gap-6 mt-5 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              {[
                { label: 'Posts', value: profile.stats.totalPosts },
                { label: 'Followers', value: profile.stats.followerCount },
                { label: 'Following', value: profile.stats.followingCount },
                { label: 'Likes', value: profile.stats.totalLikes },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="text-base font-bold"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Bar (own profile only) */}
        {isOwnProfile && (
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setShowAutoPost(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-semibold transition-all hover:bg-violet-50"
              style={{
                color: 'var(--color-primary-violet)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                background: 'rgba(139, 92, 246, 0.04)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Zap className="w-3.5 h-3.5" />
              Auto-Post Settings
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5">
          <button
            onClick={() => setActiveTab('posts')}
            className={`feed-tab-pill ${activeTab === 'posts' ? 'active' : 'inactive'}`}
          >
            Posts
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`feed-tab-pill ${activeTab === 'saved' ? 'active' : 'inactive'}`}
            >
              Saved
            </button>
          )}
        </div>

        {/* Posts List */}
        {postsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
          </div>
        ) : allPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {allPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.4 }}
                >
                  <PostCard post={post} currentUserId={user?.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Auto-Post Panel */}
      <AutoPostPanel
        isOpen={showAutoPost}
        onClose={() => setShowAutoPost(false)}
      />
    </div>
  );
}
