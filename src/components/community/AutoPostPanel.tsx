import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, ChevronDown, Wand2, CheckCircle2, Edit3, Send } from 'lucide-react';
import { useGenerateAIContent, useCreatePost } from '@/hooks/useCommunity';
import { useIdeas } from '@/hooks/useIdeas';
import type { Idea } from '@/hooks/useIdeas';
import toast from 'react-hot-toast';

interface AIGeneratePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AutoPostPanel({ isOpen, onClose }: AIGeneratePanelProps) {
  const generateAI = useGenerateAIContent();
  const createPost = useCreatePost();
  const { data: ideas, isLoading: ideasLoading } = useIdeas();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const activeIdeas = ideas?.filter((idea) => !idea.isArchived) ?? [];

  const handleIdeaSelect = (idea: Idea) => {
    setSelectedIdea(idea);
    setShowDropdown(false);
    setGeneratedContent('');
  };

  const handleGenerate = async () => {
    if (!selectedIdea) {
      toast.error('Please select a startup first');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const result = await generateAI.mutateAsync({
        ideaTitle: selectedIdea.title,
        industry: selectedIdea.industry ?? undefined,
        description: selectedIdea.description,
        targetAudience: selectedIdea.targetAudience ?? undefined,
        problemSolved: selectedIdea.problemSolved ?? undefined,
      });
      setGeneratedContent(result.content);
      toast.success('Content generated! Review and edit before posting.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to generate content. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    if (!generatedContent.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsPosting(true);

    try {
      await createPost.mutateAsync({
        content: generatedContent.trim(),
        ideaId: selectedIdea?.id,
        ideaTitle: selectedIdea?.title,
        industry: selectedIdea?.industry ?? undefined,
      });
      toast.success('Post published successfully!');
      handleClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to publish post. Try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    setGeneratedContent('');
    setSelectedIdea(null);
    setIsGenerating(false);
    setIsPosting(false);
    onClose();
  };

  const charCount = generatedContent.length;
  const maxChars = 500;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)' }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl overflow-visible"
            style={{
              background: 'white',
              border: '1px solid var(--color-border)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #4F7DF3 100%)' }}
                >
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    Generate AI Post
                  </h3>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    AI creates a post — you review & edit before publishing
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Info Banner */}
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06) 0%, rgba(79, 125, 243, 0.06) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.12)',
                }}
              >
                <Wand2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#8B5CF6' }} />
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  Select your startup and our AI will craft a relevant, engaging community post. 
                  You can review and edit the content before publishing.
                </p>
              </div>

              {/* Startup Idea Selector */}
              <div className="relative">
                <label
                  className="text-xs font-semibold block mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Select Startup
                </label>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs outline-none transition-all"
                  style={{
                    background: 'var(--color-bg-light)',
                    border: showDropdown ? '1.5px solid var(--color-primary-blue)' : '1.5px solid var(--color-border)',
                    color: selectedIdea ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                    boxShadow: showDropdown ? '0 0 0 3px rgba(79, 125, 243, 0.1)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-2 truncate">
                    {selectedIdea && (
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #4F7DF3 100%)' }}
                      >
                        <span className="text-[9px] font-bold text-white">
                          {selectedIdea.title[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="truncate font-medium">
                      {selectedIdea?.title || 'Choose a startup idea...'}
                    </span>
                  </div>
                  <ChevronDown
                    className="w-3.5 h-3.5 shrink-0 ml-2 transition-transform"
                    style={{
                      color: 'var(--color-text-muted)',
                      transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)',
                    }}
                  />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 right-0 mt-1.5 rounded-xl z-20"
                      style={{
                        background: 'white',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                      }}
                    >
                      {ideasLoading ? (
                        <div className="flex justify-center py-6">
                          <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
                        </div>
                      ) : activeIdeas.length === 0 ? (
                        <div className="py-5 px-4 text-center">
                          <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                            No startup ideas found. Create one first in your Dashboard.
                          </p>
                        </div>
                      ) : (
                        <div className="py-1">
                          {activeIdeas.map((idea, index) => {
                            const isSelected = selectedIdea?.id === idea.id;
                            const isLast = index === activeIdeas.length - 1;
                            return (
                              <button
                                key={idea.id}
                                onClick={() => handleIdeaSelect(idea)}
                                className="w-full text-left px-4 py-3 text-xs transition-colors flex items-center gap-3"
                                style={{
                                  background: isSelected ? 'rgba(79, 125, 243, 0.06)' : 'transparent',
                                  borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
                                  fontFamily: 'var(--font-body)',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) e.currentTarget.style.background = 'rgba(79, 125, 243, 0.04)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = isSelected ? 'rgba(79, 125, 243, 0.06)' : 'transparent';
                                }}
                              >
                                {/* Idea Avatar */}
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                  style={{
                                    background: isSelected
                                      ? 'linear-gradient(135deg, #8B5CF6 0%, #4F7DF3 100%)'
                                      : 'var(--color-bg-accent)',
                                  }}
                                >
                                  <span
                                    className="text-[10px] font-bold"
                                    style={{ color: isSelected ? 'white' : 'var(--color-primary-blue)' }}
                                  >
                                    {idea.title[0]?.toUpperCase()}
                                  </span>
                                </div>

                                {/* Idea Info */}
                                <div className="flex-1 min-w-0">
                                  <span
                                    className="block font-semibold text-[12px] truncate"
                                    style={{
                                      color: isSelected ? 'var(--color-primary-blue)' : 'var(--color-text-primary)',
                                    }}
                                  >
                                    {idea.title}
                                  </span>
                                  {idea.industry && (
                                    <span
                                      className="block text-[10px] mt-0.5 truncate"
                                      style={{ color: 'var(--color-text-muted)' }}
                                    >
                                      {idea.industry}
                                    </span>
                                  )}
                                </div>

                                {/* Checkmark */}
                                {isSelected && (
                                  <CheckCircle2
                                    className="w-4 h-4 shrink-0"
                                    style={{ color: 'var(--color-primary-blue)' }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Generated Content Preview & Edit */}
              <AnimatePresence>
                {generatedContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className="text-xs font-semibold flex items-center gap-1.5"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Review & Edit
                      </label>
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: charCount > maxChars ? '#DC2626' : 'var(--color-text-muted)' }}
                      >
                        {charCount}/{maxChars}
                      </span>
                    </div>
                    <textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value.slice(0, maxChars))}
                      rows={6}
                      className="w-full rounded-xl px-4 py-3 text-xs leading-relaxed resize-none outline-none transition-all"
                      style={{
                        background: 'var(--color-bg-light)',
                        border: '1.5px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'var(--font-body)',
                      }}
                      placeholder="AI-generated content will appear here..."
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {/* Generate / Regenerate Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedIdea}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    generatedContent ? 'text-purple-600' : 'text-white'
                  }`}
                  style={{
                    background: generatedContent
                      ? 'rgba(139, 92, 246, 0.08)'
                      : selectedIdea
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #4F7DF3 100%)'
                        : 'var(--color-border)',
                    border: generatedContent ? '1.5px solid rgba(139, 92, 246, 0.2)' : 'none',
                    boxShadow: !generatedContent && selectedIdea ? '0 4px 16px rgba(139, 92, 246, 0.3)' : 'none',
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {generatedContent ? 'Regenerate' : 'Generate with AI'}
                    </>
                  )}
                </motion.button>

                {/* Post Button — only visible after content is generated */}
                {generatedContent && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handlePost}
                    disabled={isPosting || !generatedContent.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                      boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
                    }}
                  >
                    {isPosting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Publish Post
                      </>
                    )}
                  </motion.button>
                )}
              </div>

              <p className="text-center text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                {generatedContent
                  ? 'Review the content above, make any edits, then publish.'
                  : 'AI will generate a post about your startup for you to review.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
