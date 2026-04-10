import {
  Clock, TrendingUp, Bookmark, FileText,
  Users, Trophy
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'latest', label: 'Latest', icon: Clock },
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'saved', label: 'Saved', icon: Bookmark },
  { key: 'drafts', label: 'My Posts', icon: FileText },
  { key: 'following', label: 'Following', icon: Users },
];

interface LeftSidebarProps {
  activeNav: string;
  onNavChange: (key: string) => void;
}

export function LeftSidebar({ activeNav, onNavChange }: LeftSidebarProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      {/* Quick Profile Card */}
      {user && (
        <div className="sidebar-card sidebar-profile-card">
          <Link to={`/profile/${user.id}`} className="block p-4">
            <div className="flex items-center gap-3">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'var(--color-gradient)' }}
                >
                  {user.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <div className="min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-body)' }}
                >
                  {user.fullName || user.username || 'User'}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'var(--color-primary-blue)' }}>
                  View Profile →
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <div className="sidebar-card">
        <div className="p-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavChange(item.key)}
              className={`sidebar-nav-item ${activeNav === item.key ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboards */}
      <div className="sidebar-card sidebar-leaderboard">
        <div className="sidebar-card-header">
          <span className="flex items-center gap-2">
            <Trophy className="w-4 h-4" style={{ color: '#f59e0b' }} />
            Leaderboards
          </span>
          <span
            className="text-[9px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'var(--color-bg-accent)', color: 'var(--color-primary-blue)' }}
          >
            Soon
          </span>
        </div>
        <div className="sidebar-card-body">
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}>
            Top builders, most followed founders, and trending startups — coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
