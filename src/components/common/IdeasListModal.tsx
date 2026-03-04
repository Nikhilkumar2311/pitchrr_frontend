/**
 * Ideas List Modal
 * Shows all user ideas with ability to switch between them
 */

import { motion } from 'framer-motion';
import { Lightbulb, Plus, Check, Loader2 } from 'lucide-react';
import { Modal, Button, Badge } from '@/components/ui';
import { useIdeas, type Idea } from '@/hooks/useIdeas';
import { useIdeaStore } from '@/store';
import { formatDistanceToNow } from 'date-fns';

interface IdeasListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectIdea: (idea: Idea) => void;
    onCreateNew?: () => void;
}

export function IdeasListModal({
    isOpen,
    onClose,
    onSelectIdea,
    onCreateNew,
}: IdeasListModalProps) {
    const { data: ideas, isLoading } = useIdeas();
    const { activeIdeaId } = useIdeaStore();

    const handleSelect = (idea: Idea) => {
        onSelectIdea(idea);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Your Ideas" size="lg">
            <div className="space-y-2">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#4F7DF3' }} />
                    </div>
                ) : ideas && ideas.length > 0 ? (
                    ideas.map((idea, index) => {
                        const isActive = activeIdeaId === idea.id;
                        return (
                            <motion.button
                                key={idea.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                onClick={() => handleSelect(idea)}
                                className="w-full text-left p-4 rounded-[10px] transition-all duration-200"
                                style={{
                                    background: isActive ? 'rgba(79,125,243,0.05)' : 'transparent',
                                    border: isActive
                                        ? '1.5px solid rgba(79,125,243,0.25)'
                                        : '1.5px solid var(--dash-border-solid, #E8ECF4)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                                        e.currentTarget.style.borderColor = 'rgba(79,125,243,0.15)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'var(--dash-border-solid, #E8ECF4)';
                                    }
                                }}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
                                        style={{
                                            background: isActive
                                                ? 'linear-gradient(135deg, #4F7DF3, #7A5CFF)'
                                                : 'rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        {isActive ? (
                                            <Check className="w-4 h-4 text-white" />
                                        ) : (
                                            <Lightbulb className="w-4 h-4" style={{ color: '#94A3B8' }} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h3
                                                className="font-semibold text-[14px] truncate"
                                                style={{
                                                    color: 'var(--dash-text, #0F172A)',
                                                    fontFamily: 'var(--dash-font-heading, Sora, sans-serif)',
                                                }}
                                            >
                                                {idea.title}
                                            </h3>
                                            {isActive && (
                                                <Badge variant="primary" className="shrink-0">
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                        <p
                                            className="text-[13px] line-clamp-2 mb-2"
                                            style={{ color: 'var(--dash-text-muted, #64748B)' }}
                                        >
                                            {idea.description}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="text-[11px]"
                                                style={{ color: '#94A3B8' }}
                                            >
                                                {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                                            </span>
                                            {idea.industry && (
                                                <Badge variant="default">{idea.industry}</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })
                ) : (
                    <div className="text-center py-10">
                        <div
                            className="w-12 h-12 rounded-[10px] flex items-center justify-center mx-auto mb-3"
                            style={{ background: 'rgba(0,0,0,0.04)' }}
                        >
                            <Lightbulb className="w-5 h-5" style={{ color: '#94A3B8' }} />
                        </div>
                        <p className="text-[14px] font-medium" style={{ color: 'var(--dash-text-muted)' }}>
                            No ideas yet. Create your first one!
                        </p>
                    </div>
                )}

                {/* Create New Button */}
                {onCreateNew && (
                    <div className="pt-3" style={{ boxShadow: '0 -1px 0 rgba(0,0,0,0.04)' }}>
                        <Button
                            variant="secondary"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={() => {
                                onClose();
                                onCreateNew();
                            }}
                            className="w-full !rounded-[8px] !text-[13px]"
                        >
                            Create New Idea
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
