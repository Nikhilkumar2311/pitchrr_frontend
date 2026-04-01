import { Home, TrendingUp, Plus, Bookmark, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileBottomNavProps {
  onCreatePost: () => void;
}

export function MobileBottomNav({ onCreatePost }: MobileBottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-item ${isActive('/explore') ? 'active' : ''}`}
        onClick={() => navigate('/explore')}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${location.search.includes('tab=trending') ? 'active' : ''}`}
        onClick={() => navigate('/explore?tab=trending')}
      >
        <TrendingUp className="w-5 h-5" />
        <span>Trending</span>
      </button>

      <button className="mobile-nav-create" onClick={onCreatePost}>
        <Plus className="w-6 h-6" />
      </button>

      <button
        className={`mobile-nav-item ${isActive('/dashboard/my-posts') ? 'active' : ''}`}
        onClick={() => navigate('/dashboard/my-posts')}
      >
        <Bookmark className="w-5 h-5" />
        <span>Saved</span>
      </button>

      <button
        className={`mobile-nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
        onClick={() => navigate('/dashboard/my-posts')}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
}
