import { Users, PenLine, ThumbsUp } from 'lucide-react';

const STATS = [
  { label: 'Active Founders', value: '2.4K', icon: Users, color: '#4F7DF3' },
  { label: 'Posts This Week', value: '312', icon: PenLine, color: '#8B5CF6' },
  { label: 'Total Upvotes', value: '18.9K', icon: ThumbsUp, color: '#059669' },
];

export function CommunityStats() {
  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        Community Pulse
      </div>
      <div className="sidebar-card-body">
        <div className="grid grid-cols-3 gap-2">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center py-3 px-2 rounded-xl"
              style={{ background: 'var(--color-bg-light)' }}
            >
              <stat.icon className="w-4 h-4 mb-1.5" style={{ color: stat.color }} />
              <p
                className="text-base font-bold"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                {stat.value}
              </p>
              <p className="text-[8px] font-medium text-center mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
