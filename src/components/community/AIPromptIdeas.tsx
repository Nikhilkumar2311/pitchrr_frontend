import { Sparkles, RefreshCw } from 'lucide-react';
import { useState, useCallback } from 'react';

const ALL_PROMPTS = [
  "Share your biggest lesson this week",
  "What's your current MRR?",
  "How did you find your first 10 customers?",
  "What's one mistake you wouldn't repeat?",
  "Share a tool that changed your workflow",
  "What metrics do you track daily?",
  "Describe your startup in one sentence",
  "What's your unfair advantage?",
  "Share a win from this month",
  "What problem are you solving right now?",
];

interface AIPromptIdeasProps {
  onSelectPrompt: (prompt: string) => void;
}

export function AIPromptIdeas({ onSelectPrompt }: AIPromptIdeasProps) {
  const [indices, setIndices] = useState([0, 1, 2, 3]);

  const shuffle = useCallback(() => {
    const shuffled = [...Array(ALL_PROMPTS.length).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    setIndices(shuffled);
  }, []);

  return (
    <div className="sidebar-card">
      <div className="sidebar-card-header">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: '#8B5CF6' }} />
          Post Ideas
        </span>
        <button
          onClick={shuffle}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title="Shuffle ideas"
        >
          <RefreshCw className="w-3 h-3" style={{ color: 'var(--color-text-muted)' }} />
        </button>
      </div>
      <div className="sidebar-card-body space-y-2">
        {indices.map((idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(ALL_PROMPTS[idx])}
            className="w-full text-left text-[11px] leading-relaxed px-3 py-2.5 rounded-xl transition-all hover:bg-blue-50 hover:border-blue-200"
            style={{
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-light)',
            }}
          >
            💡 {ALL_PROMPTS[idx]}
          </button>
        ))}
      </div>
    </div>
  );
}
