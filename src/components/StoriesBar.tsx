import React, { useRef, useState } from 'react';
import { Story } from '../types';
import { StorageService } from '../services/storage';
import { Plus, X, ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface StoriesBarProps {
  stories: Story[];
  onStoriesUpdated: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({ stories, onStoriesUpdated }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = StorageService.getCurrentUser();

  const handleStoryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await StorageService.uploadImage(file, 'story');
      if (res.success && res.url) {
        StorageService.addStory(res.url, 'New story from gallery');
        onStoriesUpdated();
      }
    } catch (err) {
      console.error('Story upload failed:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="w-full flex items-center gap-3 overflow-x-auto py-2 px-1 scrollbar-none select-none">
        {/* Hidden Native File Input for Story Upload */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleStoryFile}
          className="hidden"
        />

        {/* Add Story Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-cyan-500/60 group-hover:border-cyan-400 flex items-center justify-center transition-all bg-slate-900">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4 font-bold" />
                </div>
              )}
            </div>
          </div>
          <span className="text-[11px] text-slate-300 font-medium tracking-tight">
            Add Story
          </span>
        </div>

        {/* Stories List */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryIndex(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 group-hover:scale-105 transition-all shadow-md">
              <div className="w-full h-full rounded-full p-0.5 bg-[#0a0f1d]">
                <img
                  src={story.author.avatarUrl}
                  alt={story.author.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-300 font-medium truncate max-w-[68px]">
              {story.author.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && stories[activeStoryIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg animate-fade-in">
          <div className="relative w-full max-w-sm h-[85vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-4 shadow-2xl">
            {/* Top Timer Bar */}
            <div className="w-full flex items-center gap-1.5 z-20">
              {stories.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-cyan-400 ${
                      i === activeStoryIndex ? 'w-full animate-[progress_5s_linear]' : i < activeStoryIndex ? 'w-full' : 'w-0'
                    }`} 
                  />
                </div>
              ))}
            </div>

            {/* Top Author Info & Close */}
            <div className="flex items-center justify-between z-20 mt-3">
              <div className="flex items-center gap-2">
                <img
                  src={stories[activeStoryIndex].author.avatarUrl}
                  alt={stories[activeStoryIndex].author.name}
                  className="w-8 h-8 rounded-full object-cover border border-cyan-400/50"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    {stories[activeStoryIndex].author.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(stories[activeStoryIndex].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveStoryIndex(null)}
                className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={stories[activeStoryIndex].mediaUrl}
                alt="Story content"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            {/* Navigation Buttons */}
            {activeStoryIndex > 0 && (
              <button
                onClick={() => setActiveStoryIndex(activeStoryIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {activeStoryIndex < stories.length - 1 && (
              <button
                onClick={() => setActiveStoryIndex(activeStoryIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/70"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Caption & Reply Footer */}
            <div className="z-20 space-y-3">
              {stories[activeStoryIndex].caption && (
                <p className="text-xs text-white bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                  {stories[activeStoryIndex].caption}
                </p>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${stories[activeStoryIndex].author.name.split(' ')[0]}...`}
                  className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => {
                    setReplyText('');
                    setActiveStoryIndex(null);
                  }}
                  className="p-2 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
