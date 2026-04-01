import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useFollowUser } from '@/hooks/useCommunity';
import { Link } from 'react-router-dom';
import type { CommunityPost } from '@/hooks/useCommunity';

const COLORS = ['#4F7DF3', '#8B5CF6', '#059669', '#D97706', '#EC4899'];

interface SuggestedFoundersProps {
  posts?: CommunityPost[];
  currentUserId?: string;
}

export function SuggestedFounders({ posts = [], currentUserId }: SuggestedFoundersProps) {
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const followMutation = useFollowUser();

  // Extract unique founders from posts, excluding current user
  const founders = posts.reduce<{ id: string; name: string; avatar: string | null; startup: string | null; industry: string | null }[]>((acc, post) => {
    if (post.userId === currentUserId) return acc;
    if (acc.find((f) => f.id === post.userId)) return acc;
    if (acc.length >= 4) return acc;
    acc.push({
      id: post.userId,
      name: post.userName || 'Anonymous',
      avatar: post.userAvatar,
      startup: post.ideaTitle,
      industry: post.industry,
    });
    return acc;
  }, []);

  if (founders.length === 0) return null;

  const handleFollow = (userId: string) => {
    setFollowed(prev => ({ ...prev, [userId]: !prev[userId] }));
    followMutation.mutate(userId);
  };

  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" style={{ color: 'var(--color-primary-blue)' }} />
          Suggested Founders
        </span>
      </div>
      <div className="sidebar-card-body space-y-3">
        {founders.map((founder, i) => (
          <div key={founder.id} className="flex items-center gap-3">
            <Link to={`/profile/${founder.id}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all"
                style={{
                  background: founder.avatar
                    ? `url(${founder.avatar}) center/cover`
                    : COLORS[i % COLORS.length],
                }}
              >
                {!founder.avatar && founder.name[0]?.toUpperCase()}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={`/profile/${founder.id}`}
                className="text-xs font-semibold truncate block hover:underline"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
              >
                {founder.name}
              </Link>
              <p className="text-[10px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                {[founder.startup, founder.industry].filter(Boolean).join(' · ') || 'Founder'}
              </p>
            </div>
            <button
              onClick={() => handleFollow(founder.id)}
              className={`follow-btn ${followed[founder.id] ? 'following' : ''}`}
            >
              {followed[founder.id] ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
