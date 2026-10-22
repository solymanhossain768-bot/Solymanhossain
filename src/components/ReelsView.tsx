import React, { useState } from 'react';
import { ReelItem } from '../types';
import { StorageService } from '../services/storage';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Music2, 
  UserPlus, 
  UserCheck 
} from 'lucide-react';

export const ReelsView: React.FC = () => {
  const [reels, setReels] = useState<ReelItem[]>(StorageService.getReels());
  const [muted, setMuted] = useState(true);

  const handleLike = (id: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === id) {
        const nextLiked = !r.userLiked;
        return {
          ...r,
          userLiked: nextLiked,
          likesCount: nextLiked ? r.likesCount + 1 : r.likesCount - 1,
        };
      }
      return r;
    }));
  };

  const handleFollow = (id: string) => {
    setReels(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, isFollowing: !r.isFollowing };
      }
      return r;
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-16 animate-fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
          HARDBOARD Reels
        </h2>
        <p className="text-xs text-slate-400">
          Vertical tech shorts and creator media
        </p>
      </div>

      <div className="space-y-6">
        {reels.map((reel) => (
          <div
            key={reel.id}
            className="relative w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between"
          >
            {/* Background Video */}
            <video
              src={reel.videoUrl}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

            {/* Top Bar: Sound toggle */}
            <div className="relative z-10 flex justify-end p-4">
              <button
                onClick={() => setMuted(!muted)}
                className="p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md transition-colors"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Right Action Bar (Vertical) */}
            <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-4">
              {/* Like */}
              <button
                onClick={() => handleLike(reel.id)}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-transform group-hover:scale-110 ${
                  reel.userLiked
                    ? 'bg-rose-500/80 border-rose-400 text-white'
                    : 'bg-black/50 border-white/20 text-white'
                }`}>
                  <Heart className={`w-5 h-5 ${reel.userLiked ? 'fill-white' : ''}`} />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {reel.likesCount.toLocaleString()}
                </span>
              </button>

              {/* Comments */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {reel.commentsCount.toLocaleString()}
                </span>
              </div>

              {/* Share */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-white drop-shadow">
                  {reel.sharesCount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bottom Caption & Author Details */}
            <div className="relative z-10 p-5 space-y-2.5 pr-16">
              <div className="flex items-center gap-2.5">
                <img
                  src={reel.author.avatarUrl}
                  alt={reel.author.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">
                      {reel.author.name}
                    </span>
                    {reel.author.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 fill-cyan-950" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-300">
                    @{reel.author.username}
                  </span>
                </div>

                <button
                  onClick={() => handleFollow(reel.id)}
                  className={`ml-2 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    reel.isFollowing
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                  }`}
                >
                  {reel.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              <p className="text-xs text-white leading-relaxed line-clamp-2">
                {reel.caption}
              </p>

              <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-medium">
                <Music2 className="w-3.5 h-3.5 animate-spin" />
                <span className="truncate">{reel.audioTrack}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
