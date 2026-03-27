import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useSharePost } from '@/hooks/useCommunity';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postContent: string;
}

const SHARE_PLATFORMS = [
  {
    name: 'Twitter / X',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    getUrl: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    color: '#000000',
    bg: '#f5f5f5',
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    color: '#0A66C2',
    bg: '#EDF3FE',
  },
  {
    name: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    getUrl: (url: string, text: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
    color: '#25D366',
    bg: '#E8F8ED',
  },
];

export function ShareModal({ isOpen, onClose, postId, postContent }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const sharePost = useSharePost();

  const postUrl = `${window.location.origin}/explore/post/${postId}`;
  const shareText = postContent.substring(0, 100) + (postContent.length > 100 ? '...' : '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(postUrl);
    setCopied(true);
    sharePost.mutate({ postId, platform: 'copy_link' });
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlatformShare = (platform: typeof SHARE_PLATFORMS[0]) => {
    sharePost.mutate({ postId, platform: platform.name.toLowerCase() });
    window.open(platform.getUrl(postUrl, shareText), '_blank', 'width=600,height=400');
  };

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
            className="w-full max-w-sm rounded-2xl p-6"
            style={{
              background: 'white',
              border: '1px solid var(--color-border)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3
                className="text-base font-bold"
                style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-heading)' }}
              >
                Share Post
              </h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              </button>
            </div>

            {/* Platform buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {SHARE_PLATFORMS.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handlePlatformShare(platform)}
                  className="flex flex-col items-center gap-2.5 py-4 rounded-xl transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: platform.bg,
                    color: platform.color,
                  }}
                >
                  {platform.icon}
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {platform.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Copy link */}
            <div
              className="flex items-center gap-2 p-3 rounded-xl"
              style={{
                background: 'var(--color-bg-light)',
                border: '1px solid var(--color-border)',
              }}
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
              <input
                readOnly
                value={postUrl}
                className="flex-1 bg-transparent text-[11px] outline-none truncate"
                style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
              />
              <button
                onClick={handleCopy}
                className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80"
                style={{
                  background: copied ? '#22c55e' : 'var(--color-primary-blue)',
                  color: 'white',
                }}
              >
                {copied ? (
                  <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Copied</span>
                ) : (
                  <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
