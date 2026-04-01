import { UserPlus } from 'lucide-react';
import { useState } from 'react';

const MOCK_FOUNDERS = [
  { id: 'f1', name: 'Arjun Mehta', startup: 'FinStack AI', avatar: null, industry: 'Fintech' },
  { id: 'f2', name: 'Priya Sharma', startup: 'EduNext', avatar: null, industry: 'EdTech' },
  { id: 'f3', name: 'Rohan Gupta', startup: 'HealthPulse', avatar: null, industry: 'HealthTech' },
  { id: 'f4', name: 'Ananya Desai', startup: 'GreenCharge', avatar: null, industry: 'CleanTech' },
];

const COLORS = ['#4F7DF3', '#8B5CF6', '#059669', '#D97706', '#EC4899'];

export function SuggestedFounders() {
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" style={{ color: 'var(--color-primary-blue)' }} />
          Suggested Founders
        </span>
      </div>
      <div className="sidebar-card-body space-y-3">
        {MOCK_FOUNDERS.map((founder, i) => (
          <div key={founder.id} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            >
              {founder.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-semibold truncate"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
              >
                {founder.name}
              </p>
              <p className="text-[10px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                {founder.startup} · {founder.industry}
              </p>
            </div>
            <button
              onClick={() => setFollowed(prev => ({ ...prev, [founder.id]: !prev[founder.id] }))}
              className={`follow-btn ${followed[founder.id] ? 'following' : ''}`}
            >
              {followed[founder.id] ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}

        <button
          className="text-[10px] font-semibold w-full text-center py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ color: 'var(--color-primary-blue)' }}
        >
          See all →
        </button>
      </div>
    </div>
  );
}
