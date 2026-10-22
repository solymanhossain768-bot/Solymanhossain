import React, { useState } from 'react';
import { Post } from '../types';
import { 
  X, 
  Repeat, 
  Send, 
  Link2, 
  Quote, 
  PlusCircle, 
  Users2, 
  Share2, 
  Check, 
  Sparkles 
} from 'lucide-react';

interface ShareModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSelectShareAsNote: () => void;
  onDirectShare: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  post,
  isOpen,
  onClose,
  onSelectShareAsNote,
  onDirectShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const postUrl = `${window.location.origin}/#post-${post.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setActionNotice('Post link copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setActionNotice(null);
    }, 2500);
  };

  const handleSendMessenger = () => {
    setActionNotice('Post sent via HARDBOARD Direct Messenger!');
    setTimeout(() => {
      setActionNotice(null);
      onClose();
    }, 1500);
  };

  const handleShareToStory = () => {
    setActionNotice('Added preview to your 24h HARDBOARD Story!');
    setTimeout(() => {
      setActionNotice(null);
      onClose();
    }, 1500);
  };

  const handleShareToGroup = () => {
    setActionNotice('Shared to Community Tech Hub group!');
    setTimeout(() => {
      setActionNotice(null);
      onClose();
    }, 1500);
  };

  const handleMoreOptions = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HARDBOARD Post by ${post.author.name}`,
          text: post.content.slice(0, 100),
          url: postUrl,
        });
        onClose();
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md bg-[#0a0f1d] border border-cyan-500/20 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Share Menu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Notice feedback */}
        {actionNotice && (
          <div className="mx-6 mt-4 p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 7 Menu Options */}
        <div className="p-4 space-y-1">
          {/* 1. Share Post (Direct Repost) */}
          <button
            onClick={() => {
              onDirectShare();
              setActionNotice('Reposted to your feed!');
              setTimeout(onClose, 1200);
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/70 text-left transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-200">
                Share Post
              </div>
              <div className="text-xs text-slate-400">
                Instantly share to your public community feed
              </div>
            </div>
          </button>

          {/* 2. Send in Messenger */}
          <button
            onClick={handleSendMessenger}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/70 text-left transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-200">
                Send in Messenger
              </div>
              <div className="text-xs text-slate-400">
                Direct message to friends or collaborators
              </div>
            </div>
          </button>

          {/* 3. Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/70 text-left transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Link2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-200">
                {copied ? 'Link Copied!' : 'Copy Link'}
              </div>
              <div className="text-xs text-slate-400">
                Copy permanent post link to clipboard
              </div>
            </div>
          </button>

          {/* 4. Share as Note (Highlighted Feature) */}
          <button
            onClick={() => {
              onClose();
              onSelectShareAsNote();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-950/40 via-sky-950/20 to-transparent border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-950/60 text-left transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-900/60 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Quote className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-cyan-300 group-hover:text-cyan-200">
                  Share as Note
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-950 bg-cyan-400 px-1.5 py-0.2 rounded font-sans">
                  New
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Attach your commentary and publish as an authenticated Note
              </div>
            </div>
          </button>

          {/* 5. Share to Story */}
          <button
            onClick={handleShareToStory}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/70 text-left transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-200">
                Share to Story
              </div>
              <div className="text-xs text-slate-400">
                Broadcast snippet to your 24-hour Story
              </div>
            </div>
          </button>

          {/* 6. Share to Group */}
          <button
            onClick={handleShareToGroup}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/70 text-left transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-200">
                Share to Group
              </div>
              <div className="text-xs text-slate-400">
                Post to tech or creative community spaces
              </div>
            </div>
          </button>

          {/* 7. More Options */}
          <button
            onClick={handleMoreOptions}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl hover:bg-slate-800/70 text-left transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white group-hover:text-cyan-200">
                More Options
              </div>
              <div className="text-xs text-slate-400">
                Open Android native share sheet or third-party apps
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
