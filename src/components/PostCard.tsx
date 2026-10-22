import React, { useState } from 'react';
import { Post, ReactionType } from '../types';
import { StorageService } from '../services/storage';
import { ShareModal } from './ShareModal';
import { CreateNoteModal } from './CreateNoteModal';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Quote, 
  CheckCircle2, 
  Trash2, 
  Globe, 
  Users, 
  Lock, 
  Sparkles,
  Smile,
  Send,
  Flag,
  AlertTriangle
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onPostUpdated: () => void;
  onSelectPost?: (postId: string) => void;
}

const REACTION_EMOJIS: Record<ReactionType, { emoji: string; label: string; color: string }> = {
  like: { emoji: '👍', label: 'Like', color: 'text-sky-400' },
  love: { emoji: '❤️', label: 'Love', color: 'text-rose-500' },
  care: { emoji: '🥰', label: 'Care', color: 'text-amber-400' },
  haha: { emoji: '😆', label: 'Haha', color: 'text-yellow-400' },
  wow: { emoji: '😮', label: 'Wow', color: 'text-cyan-400' },
  sad: { emoji: '😢', label: 'Sad', color: 'text-blue-400' },
  angry: { emoji: '😡', label: 'Angry', color: 'text-red-500' },
};

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated, onSelectPost }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showReactionsPicker, setShowReactionsPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const currentUser = StorageService.getCurrentUser();
  const isOwner = currentUser.id === post.authorId || currentUser.role === 'admin';

  const handleReact = (reaction: ReactionType) => {
    StorageService.toggleReaction(post.id, reaction);
    setShowReactionsPicker(false);
    onPostUpdated();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    StorageService.addComment(post.id, commentText.trim());
    setCommentText('');
    onPostUpdated();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      StorageService.deletePost(post.id);
      onPostUpdated();
    }
  };

  const handleReport = () => {
    StorageService.addModerationItem({
      id: `mod_${Date.now()}`,
      contentId: post.id,
      contentType: post.type,
      author: {
        id: post.author.id,
        name: post.author.name,
        username: post.author.username,
      },
      snippet: post.content,
      mediaUrl: post.mediaUrl,
      reason: 'Reported by user for community safety review',
      severity: 'low',
      safetyScore: 0.45,
      status: 'review_required',
      reportedAt: new Date().toISOString(),
    });
    setReportSuccess(true);
    setShowMenu(false);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  return (
    <>
      <article className="w-full bg-[#0a0f1e] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md relative">
        {/* Report Banner Confirmation */}
        {reportSuccess && (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Thank you. Post has been queued for moderation review.</span>
          </div>
        )}

        {/* Note indicator banner if this post is a Note */}
        {post.type === 'note' && (
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-800/60 text-xs text-cyan-300 font-medium">
            <Quote className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {post.author.name} published a Note
              {post.originalPost ? ` on ${post.originalPost.authorName}'s post` : ''}
            </span>
          </div>
        )}

        {/* Author Header */}
        <div className="flex items-start justify-between mb-3.5">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border border-cyan-500/20 ring-1 ring-cyan-500/30"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer">
                  {post.author.name}
                </span>
                {post.author.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-950" />
                )}
                {post.author.role === 'creator' && (
                  <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                    Creator
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>@{post.author.username}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <span>·</span>
                {post.audience === 'public' && <Globe className="w-3 h-3 text-slate-400" />}
                {post.audience === 'followers' && <Users className="w-3 h-3 text-sky-400" />}
                {post.audience === 'private' && <Lock className="w-3 h-3 text-amber-400" />}
              </div>
            </div>
          </div>

          {/* Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 z-20 w-44 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 text-xs text-slate-200">
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-800 text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Post</span>
                  </button>
                )}
                <button
                  onClick={handleReport}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-left"
                >
                  <Flag className="w-4 h-4 text-amber-400" />
                  <span>Report Post</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Content */}
        {post.backgroundGradient ? (
          <div className={`p-6 rounded-2xl bg-gradient-to-br ${post.backgroundGradient} text-white font-medium text-base mb-3 leading-relaxed flex items-center justify-center text-center min-h-[140px] shadow-inner`}>
            {post.content}
          </div>
        ) : (
          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed mb-3">
            {post.content}
          </p>
        )}

        {/* Media Attachment if present */}
        {post.mediaUrl && (
          <div className="rounded-xl overflow-hidden mb-3 border border-slate-800/80 bg-black/40">
            {post.mediaType === 'video' ? (
              <video
                src={post.mediaUrl}
                controls
                className="w-full max-h-96 object-cover"
              />
            ) : (
              <img
                src={post.mediaUrl}
                alt="Post attachment"
                className="w-full max-h-96 object-cover hover:scale-[1.01] transition-transform"
              />
            )}
          </div>
        )}

        {/* Embedded Original Post if this is a Note */}
        {post.type === 'note' && post.originalPost && (
          <div 
            onClick={() => onSelectPost && onSelectPost(post.originalPostId || '')}
            className="mb-4 rounded-xl border border-cyan-500/30 bg-slate-950/70 p-3.5 hover:border-cyan-400/60 transition-all cursor-pointer space-y-2 group"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <img
                  src={post.originalPost.authorAvatar}
                  alt={post.originalPost.authorName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {post.originalPost.authorName}
                </span>
                <span className="text-[11px] text-slate-400">
                  @{post.originalPost.authorUsername}
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/20">
                Original Post
              </span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
              {post.originalPost.content}
            </p>

            {post.originalPost.mediaUrl && (
              <div className="rounded-lg overflow-hidden h-24 bg-slate-900 border border-slate-800">
                <img
                  src={post.originalPost.mediaUrl}
                  alt="Attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Engagement Stats Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-t border-slate-800/60 mb-2">
          <div className="flex items-center gap-1.5">
            {post.userReaction ? (
              <span className="text-sm">
                {REACTION_EMOJIS[post.userReaction]?.emoji}
              </span>
            ) : (
              <Heart className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className="font-semibold text-slate-300">
              {post.likesCount.toLocaleString()} reactions
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>{post.commentsCount || 0} comments</span>
            <span>·</span>
            <span>{post.notesCount || 0} notes</span>
            <span>·</span>
            <span>{post.sharesCount || 0} shares</span>
          </div>
        </div>

        {/* Action Buttons: React, Comment, Share */}
        <div className="relative flex items-center justify-between pt-1 border-t border-slate-800/60">
          {/* Reaction Button with Popover Hover */}
          <div className="relative">
            <button
              onClick={() => handleReact(post.userReaction || 'like')}
              onMouseEnter={() => setShowReactionsPicker(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-slate-800/80 transition-colors ${
                post.userReaction
                  ? REACTION_EMOJIS[post.userReaction]?.color
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {post.userReaction ? (
                <>
                  <span className="text-sm">{REACTION_EMOJIS[post.userReaction]?.emoji}</span>
                  <span>{REACTION_EMOJIS[post.userReaction]?.label}</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                  <span>Like</span>
                </>
              )}
            </button>

            {/* Reactions Picker Tooltip */}
            {showReactionsPicker && (
              <div 
                onMouseLeave={() => setShowReactionsPicker(false)}
                className="absolute bottom-8 left-0 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-2xl animate-fade-in"
              >
                {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleReact(r)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:scale-125 transition-transform"
                    title={REACTION_EMOJIS[r].label}
                  >
                    {REACTION_EMOJIS[r].emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comment Toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </button>

          {/* Direct Note Button */}
          <button
            onClick={() => setShowCreateNoteModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/60 border border-cyan-500/20 hover:border-cyan-500/50 transition-colors cursor-pointer"
            title="Share as Note with your thoughts"
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Note</span>
          </button>

          {/* Share Button (Opens HB Share Menu) */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        {/* Comments Section Drawer */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-3 animate-fade-in">
            {/* Input bar */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment or reply (@mention)..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Existing Comments List */}
            {post.comments && post.comments.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {post.comments.map((comm) => (
                  <div key={comm.id} className="flex items-start gap-2.5 bg-slate-900/50 rounded-xl p-2.5 border border-slate-800/60 text-xs">
                    <img
                      src={comm.author.avatarUrl}
                      alt={comm.author.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          {comm.author.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-300 mt-0.5">
                        {comm.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 text-center py-2">
                No comments yet. Start the conversation!
              </p>
            )}
          </div>
        )}
      </article>

      {/* Official HB Share Menu Modal */}
      <ShareModal
        post={post}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onSelectShareAsNote={() => {
          setShowShareModal(false);
          setShowCreateNoteModal(true);
        }}
        onDirectShare={() => {
          StorageService.createPost({
            authorId: currentUser.id,
            author: {
              id: currentUser.id,
              name: currentUser.name,
              username: currentUser.username,
              avatarUrl: currentUser.avatarUrl,
              isVerified: currentUser.isVerified,
              role: currentUser.role,
            },
            type: post.type,
            content: `Shared from @${post.author.username}: ${post.content}`,
            mediaUrl: post.mediaUrl,
            mediaType: post.mediaType,
            audience: 'public',
          });
          onPostUpdated();
        }}
      />

      {/* Dedicated Create Note Modal */}
      <CreateNoteModal
        originalPost={post}
        isOpen={showCreateNoteModal}
        onClose={() => setShowCreateNoteModal(false)}
        onNoteCreated={() => {
          onPostUpdated();
        }}
      />
    </>
  );
};
