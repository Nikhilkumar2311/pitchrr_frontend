import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Loader2, CalendarClock, ChevronDown } from 'lucide-react';
import { useAutoPostSettings, useUpdateAutoPostSettings } from '@/hooks/useCommunity';
import { useIdeas } from '@/hooks/useIdeas';
import toast from 'react-hot-toast';

interface AutoPostPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: 'DAILY', label: 'Daily', desc: 'Post every day at 10:00 AM' },
  { value: 'TWICE_A_WEEK', label: 'Twice a week', desc: 'Post 2× per week' },
  { value: 'WEEKLY', label: 'Weekly', desc: 'Post once a week' },
  { value: 'BIWEEKLY', label: 'Biweekly', desc: 'Post every 2 weeks' },
  { value: 'MONTHLY', label: 'Monthly', desc: 'Post once a month' },
] as const;

export function AutoPostPanel({ isOpen, onClose }: AutoPostPanelProps) {
  const { data: settings, isLoading } = useAutoPostSettings();
  const updateSettings = useUpdateAutoPostSettings();
  const { data: ideas, isLoading: ideasLoading } = useIdeas();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggle = async () => {
    if (!settings) return;

    if (!settings.enabled && !settings.ideaId) {
      toast.error('Please select a startup idea first');
      return;
    }

    try {
      await updateSettings.mutateAsync({
        enabled: !settings.enabled,
      });
      toast.success(settings.enabled ? 'Auto-posting paused' : 'Auto-posting enabled!');
    } catch {
      toast.error('Failed to update settings');
    }
  };

  const handleIdeaSelect = async (ideaId: string, ideaTitle: string) => {
    try {
      await updateSettings.mutateAsync({ ideaId, ideaTitle });
      setShowDropdown(false);
      toast.success(`Selected "${ideaTitle}"`);
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleFrequencyChange = async (frequency: string) => {
    try {
      await updateSettings.mutateAsync({ frequency: frequency as any });
      toast.success('Frequency updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const activeIdeas = ideas?.filter((idea) => !idea.isArchived) ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
            style={{
              background: 'white',
              border: '1px solid var(--color-border)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5 sticky top-0 bg-white z-10"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--color-bg-accent)' }}
                >
                  <Zap className="w-4 h-4" style={{ color: 'var(--color-primary-blue)' }} />
                </div>
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
                  >
                    Auto-Post Settings
                  </h3>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                    AI generates community posts for you
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
              </div>
            ) : (
              <div className="p-5 space-y-5">
                {/* Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      Enable Auto-Posting
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      AI will write and post on your behalf
                    </p>
                  </div>
                  <button
                    onClick={handleToggle}
                    disabled={updateSettings.isPending}
                    className="relative w-11 h-6 rounded-full transition-colors"
                    style={{
                      background: settings?.enabled
                        ? 'var(--color-primary-blue)'
                        : 'var(--color-border)',
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                      style={{
                        transform: settings?.enabled ? 'translateX(22px)' : 'translateX(2px)',
                      }}
                    />
                  </button>
                </div>

                {/* Startup Idea Dropdown */}
                <div>
                  <label
                    className="text-xs font-semibold block mb-1.5"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Startup Idea
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs outline-none transition-all"
                      style={{
                        background: 'var(--color-bg-light)',
                        border: '1px solid var(--color-border)',
                        color: settings?.ideaTitle ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      <span className="truncate">
                        {settings?.ideaTitle || 'Select a startup idea...'}
                      </span>
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
                          className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20"
                          style={{
                            background: 'white',
                            border: '1px solid var(--color-border)',
                            boxShadow: 'var(--shadow-card)',
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}
                        >
                          {ideasLoading ? (
                            <div className="flex justify-center py-4">
                              <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--color-primary-blue)' }} />
                            </div>
                          ) : activeIdeas.length === 0 ? (
                            <div className="py-4 px-3 text-center">
                              <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                                No startup ideas found. Create one first in your Dashboard.
                              </p>
                            </div>
                          ) : (
                            activeIdeas.map((idea) => (
                              <button
                                key={idea.id}
                                onClick={() => handleIdeaSelect(idea.id, idea.title)}
                                className="w-full text-left px-3.5 py-2.5 text-xs transition-colors hover:bg-blue-50 flex items-center justify-between"
                                style={{
                                  borderBottom: '1px solid var(--color-border)',
                                  color: settings?.ideaId === idea.id
                                    ? 'var(--color-primary-blue)'
                                    : 'var(--color-text-primary)',
                                  fontWeight: settings?.ideaId === idea.id ? 600 : 400,
                                  fontFamily: 'var(--font-body)',
                                }}
                              >
                                <div className="truncate flex-1">
                                  <span className="block font-medium">{idea.title}</span>
                                  {idea.industry && (
                                    <span className="text-[10px] block mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                                      {idea.industry}
                                    </span>
                                  )}
                                </div>
                                {settings?.ideaId === idea.id && (
                                  <div
                                    className="w-2 h-2 rounded-full shrink-0 ml-2"
                                    style={{ background: 'var(--color-primary-blue)' }}
                                  />
                                )}
                              </button>
                            ))
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    AI will generate posts about this startup idea
                  </p>
                </div>

                {/* Frequency */}
                <div>
                  <label
                    className="text-xs font-semibold block mb-2"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Posting Frequency
                  </label>
                  <div className="space-y-1.5">
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleFrequencyChange(opt.value)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all"
                        style={{
                          background:
                            settings?.frequency === opt.value ? 'var(--color-bg-accent)' : 'transparent',
                          border: `1px solid ${
                            settings?.frequency === opt.value
                              ? 'rgba(79, 125, 243, 0.2)'
                              : 'var(--color-border)'
                          }`,
                        }}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0"
                          style={{
                            borderColor:
                              settings?.frequency === opt.value
                                ? 'var(--color-primary-blue)'
                                : 'var(--color-border)',
                          }}
                        >
                          {settings?.frequency === opt.value && (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ background: 'var(--color-primary-blue)' }}
                            />
                          )}
                        </div>
                        <div>
                          <span
                            className="text-xs font-semibold block"
                            style={{ color: 'var(--color-text-primary)' }}
                          >
                            {opt.label}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                            {opt.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Schedule Info */}
                <div
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl"
                  style={{
                    background: 'var(--color-bg-accent)',
                    border: '1px solid rgba(79, 125, 243, 0.12)',
                  }}
                >
                  <CalendarClock className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary-blue)' }} />
                  <div>
                    <span className="text-[11px] font-medium block" style={{ color: 'var(--color-text-secondary)' }}>
                      {settings?.enabled && settings?.nextRunAt
                        ? `Next post: ${new Date(settings.nextRunAt).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })} at 10:00 AM IST`
                        : 'Posts are scheduled at 10:00 AM IST'}
                    </span>
                    <span className="text-[10px] block mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      AI generates startup-relevant content automatically
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
