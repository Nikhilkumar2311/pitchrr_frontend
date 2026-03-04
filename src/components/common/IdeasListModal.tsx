/**
 * Ideas List Modal
 * Shows all user ideas with ability to switch between them.
 * Redesigned to match dashboard's clean row-based aesthetic.
 */

import { motion } from 'framer-motion';
import { Lightbulb, Plus, Check, Loader2, ArrowRight } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
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
            <div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#4F7DF3' }} />
                    </div>
                ) : ideas && ideas.length > 0 ? (
                    <div className="space-y-1">
                        {ideas.map((idea, index) => {
                            const isActive = activeIdeaId === idea.id;
                            return (
                                <motion.button
                                    key={idea.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => handleSelect(idea)}
                                    className="group w-full text-left rounded-[10px] transition-all duration-200 cursor-pointer"
                                    style={{
                                        padding: '12px 14px',
                                        background: isActive ? 'rgba(79,125,243,0.04)' : 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {/* Icon */}
                                        <div
                                            className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                                            style={{
                                                background: isActive
                                                    ? 'linear-gradient(135deg, #4F7DF3, #7A5CFF)'
                                                    : 'rgba(0,0,0,0.03)',
                                            }}
                                        >
                                            {isActive ? (
                                                <Check className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                                            ) : (
                                                <Lightbulb className="w-4.5 h-4.5" style={{ color: '#94A3B8', width: 18, height: 18 }} />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
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
                                                    <span
                                                        className="shrink-0"
                                                        style={{
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            color: '#4F7DF3',
                                                            background: 'rgba(79,125,243,0.08)',
                                                            borderRadius: 5,
                                                            padding: '2px 7px',
                                                            letterSpacing: '0.02em',
                                                        }}
                                                    >
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p
                                                className="text-[12px] line-clamp-1 mt-0.5"
                                                style={{ color: 'var(--dash-text-muted, #64748B)' }}
                                            >
                                                {idea.description}
                                            </p>
                                            {/* Meta row */}
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span
                                                    className="text-[11px]"
                                                    style={{ color: '#94A3B8' }}
                                                >
                                                    {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                                                </span>
                                                {idea.industry && (
                                                    <span
                                                        style={{
                                                            fontSize: 10,
                                                            fontWeight: 600,
                                                            color: '#64748B',
                                                            background: 'rgba(0,0,0,0.04)',
                                                            borderRadius: 5,
                                                            padding: '1px 6px',
                                                        }}
                                                    >
                                                        {idea.industry}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ArrowRight
                                            className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                            style={{ color: isActive ? '#4F7DF3' : '#94A3B8' }}
                                        />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div
                            className="w-12 h-12 rounded-[10px] flex items-center justify-center mx-auto mb-3"
                            style={{ background: 'rgba(0,0,0,0.03)' }}
                        >
                            <Lightbulb className="w-5 h-5" style={{ color: '#94A3B8' }} />
                        </div>
                        <p
                            className="text-[14px] font-medium"
                            style={{ color: 'var(--dash-text-muted)', fontFamily: 'var(--dash-font-body)' }}
                        >
                            No ideas yet. Create your first one!
                        </p>
                    </div>
                )}

                {/* Create New Button */}
                {onCreateNew && (
                    <div
                        className="mt-3 pt-3"
                        style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
                    >
                        <Button
                            variant="secondary"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={() => {
                                onClose();
                                onCreateNew();
                            }}
                            style={{ width: '100%' }}
                        >
                            Create New Idea
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
