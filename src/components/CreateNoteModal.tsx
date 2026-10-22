import React, { useState } from 'react';
import { Post, AudienceType } from '../types';
import { StorageService } from '../services/storage';
import { X, Globe, Users, Lock, Send, Sparkles, AlertCircle, Quote } from 'lucide-react';

interface CreateNoteModalProps {
  originalPost: Post;
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: (note: Post) => void;
}

export const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  originalPost,
  isOpen,
  onClose,
  onNoteCreated,
}) => {
  const [thoughts, setThoughts] = useState('');
  const [audience, setAudience] = useState<AudienceType>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUser = StorageService.getCurrentUser();

  const handlePostNote = async () => {
    if (!thoughts.trim()) {
      setErrorMessage('Please write your note thoughts before publishing.');
      return;
    }

    if (isSubmitting) return; // Prevent duplicate publication

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await StorageService.createNote(originalPost, thoughts.trim(), audience);
      if (res.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      if (res.note) {
        onNoteCreated(res.note);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while posting note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#0c1222] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Create Note
              </h2>
              <p className="text-xs text-slate-400">
                Share your perspective on this post
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Author bar & audience selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-cyan-500/30 ring-2 ring-cyan-500/20"
              />
              <div>
                <div className="text-sm font-semibold text-white">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-400">
                  @{currentUser.username}
                </div>
              </div>
            </div>

            {/* Audience Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs text-slate-300">
              {audience === 'public' && <Globe className="w-3.5 h-3.5 text-cyan-400" />}
              {audience === 'followers' && <Users className="w-3.5 h-3.5 text-sky-400" />}
              {audience === 'private' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as AudienceType)}
                className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value="public" className="bg-slate-900 text-white">Public</option>
                <option value="followers" className="bg-slate-900 text-white">Followers Only</option>
                <option value="private" className="bg-slate-900 text-white">Only Me</option>
              </select>
            </div>
          </div>

          {/* Thoughts Textarea */}
          <div className="relative">
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="What are your thoughts on this? Add context, analysis, or your perspective..."
              rows={4}
              maxLength={1000}
              className="w-full bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 resize-none transition-all"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-500 px-1 pt-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Protected by HB Automated Safety Screening
              </span>
              <span>{thoughts.length} / 1000</span>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Embedded Original Post Preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2.5 select-none">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/80">
              <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                <Quote className="w-3 h-3" />
                Original Post Reference
              </span>
              <span>{new Date(originalPost.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <img
                src={originalPost.author.avatarUrl}
                alt={originalPost.author.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-700"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">
                  {originalPost.author.name}
                </span>
                <span className="text-[11px] text-slate-400">
                  @{originalPost.author.username}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
              {originalPost.content}
            </p>

            {originalPost.mediaUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-slate-800 max-h-36">
                {originalPost.mediaType === 'video' ? (
                  <div className="h-28 bg-slate-900 flex items-center justify-center text-xs text-cyan-300">
                    🎬 Video Attached
                  </div>
                ) : (
                  <img
                    src={originalPost.mediaUrl}
                    alt="Original attachment"
                    className="w-full h-28 object-cover"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePostNote}
            disabled={isSubmitting || !thoughts.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Publishing Note...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Post Note
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
