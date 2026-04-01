import { Flame, ArrowUp } from 'lucide-react';

const MOCK_STARTUPS = [
  { rank: 1, name: 'FinStack AI', industry: 'Fintech', upvotes: 285 },
  { rank: 2, name: 'EduNext', industry: 'EdTech', upvotes: 214 },
  { rank: 3, name: 'HealthPulse', industry: 'HealthTech', upvotes: 189 },
];

const INDUSTRY_COLORS: Record<string, string> = {
  Fintech: '#4F7DF3',
  EdTech: '#8B5CF6',
  HealthTech: '#059669',
  CleanTech: '#10B981',
  DevTools: '#D97706',
};

export function TrendingStartups() {
  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="flex items-center gap-2">
          <Flame className="w-4 h-4" style={{ color: '#EF4444' }} />
          Trending Startups
        </span>
      </div>
      <div className="sidebar-card-body space-y-2.5">
        {MOCK_STARTUPS.map((startup) => (
          <div key={startup.rank} className="flex items-center gap-3 py-1">
            <span
              className="text-xs font-bold w-5 text-center"
              style={{ color: startup.rank <= 3 ? '#f59e0b' : 'var(--color-text-muted)' }}
            >
              #{startup.rank}
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
