import { Clock, TrendingUp } from 'lucide-react';

interface FeedTabsProps {
  tab: 'latest' | 'trending';
  setTab: (tab: 'latest' | 'trending') => void;
}

export function FeedTabs({ tab, setTab }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setTab('latest')}
        className={`feed-tab-pill ${tab === 'latest' ? 'active' : 'inactive'}`}
      >
        <Clock className="w-3.5 h-3.5" />
        Latest
      </button>
      <button
        onClick={() => setTab('trending')}
        className={`feed-tab-pill ${tab === 'trending' ? 'active' : 'inactive'}`}
      >
        <TrendingUp className="w-3.5 h-3.5" />
        Trending
      </button>
    </div>
  );
}
