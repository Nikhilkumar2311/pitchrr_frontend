import { Home, TrendingUp, Plus, User, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface MobileBottomNavProps {
  onCreatePost: () => void;
}

export function MobileBottomNav({ onCreatePost }: MobileBottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isExplore = location.pathname === '/explore' && !location.search.includes('tab=trending');
  const isTrending = location.search.includes('tab=trending');
  const isMyPosts = location.pathname === '/dashboard/my-posts';
  const isProfile = location.pathname.startsWith('/profile');

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-item ${isExplore ? 'active' : ''}`}
        onClick={() => navigate('/explore')}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${isTrending ? 'active' : ''}`}
        onClick={() => navigate('/explore?tab=trending')}
      >
        <TrendingUp className="w-5 h-5" />
        <span>Trending</span>
      </button>

      <button className="mobile-nav-create" onClick={onCreatePost}>
        <Plus className="w-6 h-6" />
      </button>

      <button
        className={`mobile-nav-item ${isMyPosts ? 'active' : ''}`}
        onClick={() => navigate('/dashboard/my-posts')}
      >
        <FileText className="w-5 h-5" />
        <span>My Posts</span>
      </button>

      <button
        className={`mobile-nav-item ${isProfile ? 'active' : ''}`}
        onClick={() => navigate(user ? `/profile/${user.id}` : '/explore')}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
}
