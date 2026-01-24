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
            <div className="space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                ) : ideas && ideas.length > 0 ? (
                    ideas.map((idea, index) => {
                        const isActive = activeIdeaId === idea.id;
                        return (
                            <motion.button
                                key={idea.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleSelect(idea)}
                                className={`
                                    w-full text-left p-4 rounded-xl border-2 transition-all
                                    ${isActive
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`
                                        w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                        ${isActive ? 'bg-blue-500' : 'bg-gray-200'}
                                    `}>
                                        {isActive ? (
                                            <Check className="w-5 h-5 text-white" />
                                        ) : (
                                            <Lightbulb className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {idea.title}
                                            </h3>
                                            {isActive && (
                                                <Badge variant="success" className="shrink-0">
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                            {idea.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>
                                                Created {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
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
                    <div className="text-center py-8 text-gray-500">
                        <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No ideas yet. Create your first one!</p>
                    </div>
                )}

                {/* Create New Button */}
                {onCreateNew && (
                    <div className="pt-3 border-t border-gray-200">
                        <Button
                            variant="secondary"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={() => {
                                onClose();
                                onCreateNew();
                            }}
                            className="w-full"
                        >
                            Create New Idea
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
}
