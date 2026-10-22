import React, { useRef, useState } from 'react';
import { Post, PostType, AudienceType } from '../types';
import { StorageService } from '../services/storage';
import { 
  X, 
  Image, 
  Video, 
  Sparkles, 
  Palette, 
  Globe, 
  Users, 
  Lock, 
  AlertCircle, 
  Send,
  CheckCircle2,
  Quote
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  initialType?: PostType;
}

const GRADIENT_PRESETS = [
  { label: 'Midnight Blue', value: 'from-blue-950 via-slate-900 to-cyan-950' },
  { label: 'Cyan Electric', value: 'from-cyan-950 via-sky-900 to-indigo-950' },
  { label: 'Royal Violet', value: 'from-indigo-950 via-purple-950 to-slate-900' },
  { label: 'Emerald Glow', value: 'from-teal-950 via-emerald-950 to-slate-900' },
  { label: 'Crimson Ember', value: 'from-rose-950 via-red-950 to-slate-950' },
  { label: 'Solar Amber', value: 'from-amber-950 via-yellow-950 to-stone-900' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  initialType = 'text',
}) => {
  const [postType, setPostType] = useState<PostType>(initialType);
  const [content, setContent] = useState('');
  const [backgroundGradient, setBackgroundGradient] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [audience, setAudience] = useState<AudienceType>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = StorageService.getCurrentUser();

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit.');
      return;
    }

    setMediaFile(file);
    const objectUrl = URL.createObjectURL(file);
    setMediaPreviewUrl(objectUrl);
    setPostType(file.type.startsWith('video/') ? 'video' : 'photo');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) {
      setErrorMessage('Please add some text or an image/video to your post.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setUploadProgress(20);

    try {
      let finalMediaUrl: string | undefined = undefined;
      let finalMediaType: 'image' | 'video' | undefined = undefined;

      if (mediaFile) {
        setUploadProgress(50);
        const uploadRes = await StorageService.uploadImage(
          mediaFile, 
          postType === 'video' ? 'post' : 'post'
        );

        if (!uploadRes.success || !uploadRes.url) {
          throw new Error(uploadRes.error || 'Failed to process media attachment.');
        }

        finalMediaUrl = uploadRes.url;
        finalMediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
        setUploadProgress(80);
      }

      const res = await StorageService.createPost({
        authorId: currentUser.id,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatarUrl: currentUser.avatarUrl,
          isVerified: currentUser.isVerified,
          role: currentUser.role,
        },
        type: postType,
        content: content.trim(),
        backgroundGradient: backgroundGradient || undefined,
        mediaUrl: finalMediaUrl,
        mediaType: finalMediaType,
        audience,
      });

      if (res.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        setUploadProgress(0);
        return;
      }

      setUploadProgress(100);
      setTimeout(() => {
        onPostCreated();
        onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit post.');
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-[#0a0f1d] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
              Create Post
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Progress Bar if active */}
        {isSubmitting && (
          <div className="w-full h-1 bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
          {/* Hidden native gallery file input */}
          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="p-6 space-y-4 flex-1">
            {/* Author info & audience */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
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

              {/* Audience selector */}
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

            {/* Content Input (or Gradient Banner Area) */}
            <div className="relative">
              {backgroundGradient ? (
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${backgroundGradient} min-h-[160px] flex items-center justify-center transition-all`}>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your bold announcement..."
                    rows={4}
                    className="w-full bg-transparent text-white placeholder-white/60 font-semibold text-base text-center resize-none focus:outline-none"
                  />
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What is happening in your community today? Share tech, thoughts, or media..."
                  rows={4}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 resize-none"
                />
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Media Attachment Preview */}
            {mediaPreviewUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 max-h-56">
                {mediaFile?.type.startsWith('video/') ? (
                  <video src={mediaPreviewUrl} controls className="w-full h-48 object-cover" />
                ) : (
                  <img src={mediaPreviewUrl} alt="Preview" className="w-full h-48 object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMediaFile(null);
                    setMediaPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Color Gradient Picker bar */}
            {showColorPicker && (
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300">
                  Select Background Gradient
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setBackgroundGradient(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      backgroundGradient === null
                        ? 'border-cyan-400 text-cyan-300 bg-cyan-950/60'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    None
                  </button>
                  {GRADIENT_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setBackgroundGradient(p.value)}
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${p.value} shrink-0 border-2 transition-transform ${
                        backgroundGradient === p.value
                          ? 'border-cyan-400 scale-110 shadow-lg'
                          : 'border-transparent'
                      }`}
                      title={p.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Media & Tool Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Image className="w-4 h-4 text-emerald-400" />
                <span>Gallery Photo / Video</span>
              </button>

              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>Background</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Automated Safety Screening Active
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (!content.trim() && !mediaFile)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
