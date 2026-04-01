import { Flame, ArrowUp } from 'lucide-react';
import type { CommunityPost } from '@/hooks/useCommunity';

const INDUSTRY_COLORS: Record<string, string> = {
  Fintech: '#4F7DF3',
  EdTech: '#8B5CF6',
  HealthTech: '#059669',
  CleanTech: '#10B981',
  DevTools: '#D97706',
  SaaS: '#EC4899',
  'AI/ML': '#6366F1',
  Web3: '#F59E0B',
  Marketplace: '#14B8A6',
  Technology: '#3B82F6',
};

interface TrendingStartupsProps {
  posts?: CommunityPost[];
}

export function TrendingStartups({ posts = [] }: TrendingStartupsProps) {
  // Aggregate startups by ideaTitle from real posts data
  const startupMap = new Map<string, { name: string; industry: string; upvotes: number }>();

  posts.forEach((post) => {
    if (!post.ideaTitle) return;
    const existing = startupMap.get(post.ideaTitle);
    if (existing) {
      existing.upvotes += post.likeCount;
    } else {
      startupMap.set(post.ideaTitle, {
        name: post.ideaTitle,
        industry: post.industry || 'Startup',
        upvotes: post.likeCount,
      });
    }
  });

  // Sort by upvotes and take top 3
  const startups = Array.from(startupMap.values())
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  if (startups.length === 0) return null;

  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="flex items-center gap-2">
          <Flame className="w-4 h-4" style={{ color: '#EF4444' }} />
          Trending Startups
        </span>
      </div>
      <div className="sidebar-card-body space-y-2.5">
        {startups.map((startup, index) => (
          <div key={startup.name} className="flex items-center gap-3 py-1">
            <span
              className="text-xs font-bold w-5 text-center"
              style={{ color: index < 3 ? '#f59e0b' : 'var(--color-text-muted)' }}
            >
              #{index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
              >
                {startup.name}
              </p>
              <span
                className="inline-block mt-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                style={{
                  background: `${INDUSTRY_COLORS[startup.industry] || '#6B7280'}15`,
                  color: INDUSTRY_COLORS[startup.industry] || '#6B7280',
                }}
              >
                {startup.industry}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: '#059669' }}>
              <ArrowUp className="w-3 h-3" />
              {startup.upvotes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
