import React, { useState, useEffect } from 'react';
import { Post, User } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { StoriesBar } from './components/StoriesBar';
import { PostCard } from './components/PostCard';
import { InFeedAd } from './components/InFeedAd';
import { ProfilePage } from './components/ProfilePage';
import { AwardsPage } from './components/AwardsPage';
import { CreatorDashboard } from './components/CreatorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { ReelsView } from './components/ReelsView';
import { CreatePostModal } from './components/CreatePostModal';
import { HBSplash, HBLogo, HBIcon } from './components/HBBrand';
import { AwardArtwork } from './components/AwardsArtwork';
import { 
  Sparkles, 
  Quote, 
  Image, 
  Video, 
  Trophy, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('feed');
  const [posts, setPosts] = useState<Post[]>(StorageService.getPosts());
  const [stories, setStories] = useState(StorageService.getStories());
  const [showSplash, setShowSplash] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [createPostInitialType, setCreatePostInitialType] = useState<'text' | 'photo' | 'video' | 'note'>('text');

  // Dismiss splash after brief delay or user click
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  const refreshPosts = () => {
    setPosts(StorageService.getPosts());
  };

  const handleOpenCreatePost = (type: 'text' | 'photo' | 'video' | 'note' = 'text') => {
    setCreatePostInitialType(type);
    setIsCreatePostOpen(true);
  };

  const currentUser = StorageService.getCurrentUser();
  const monetization = StorageService.getMonetization();
  const awards = StorageService.getAwards();

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Initial Branded Splash Screen */}
      {showSplash && <HBSplash onDismiss={() => setShowSplash(false)} />}

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreatePost={handleOpenCreatePost}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-20 md:pb-12">
        {/* 1. HOME FEED TAB */}
        {currentTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left & Center Feed Column */}
            <div className="lg:col-span-8 space-y-5">
              {/* Stories Bar */}
              <div className="bg-[#0a0f1e] border border-slate-800/80 rounded-3xl p-4 shadow-lg">
                <StoriesBar
                  stories={stories}
                  onStoriesUpdated={() => setStories(StorageService.getStories())}
                />
              </div>

              {/* Feed Post Composer Card */}
              <div className="bg-[#0a0f1e] border border-slate-800/80 rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
                  />
                  <button
                    onClick={() => handleOpenCreatePost('text')}
                    className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs text-left rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                  >
                    What's on your mind, {currentUser.name.split(' ')[0]}? Share thoughts or media...
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-xs">
                  <button
                    onClick={() => handleOpenCreatePost('photo')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-850 transition-colors cursor-pointer"
                  >
                    <Image className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold">Photo / Video</span>
                  </button>

                  <button
                    onClick={() => handleOpenCreatePost('note')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-cyan-300 hover:text-cyan-200 bg-cyan-950/50 border border-cyan-500/30 hover:bg-cyan-950 transition-all cursor-pointer"
                  >
                    <Quote className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold">Write Note</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('reels')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-300 hover:text-sky-400 hover:bg-slate-850 transition-colors cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-sky-400" />
                    <span className="font-semibold">Short Reel</span>
                  </button>
                </div>
              </div>

              {/* Feed Posts List with In-Feed Ads every 14 posts */}
              <div className="space-y-5">
                {posts.map((post, idx) => (
                  <React.Fragment key={post.id}>
                    <PostCard
                      post={post}
                      onPostUpdated={refreshPosts}
                    />

                    {/* Ad placement rule: Feed banner after every 14 feed posts */}
                    {(idx + 1) % 14 === 0 && (
                      <InFeedAd index={idx} attributedCreatorId={post.authorId} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Sticky Sidebar (Creator Highlights & Awards) */}
            <aside className="hidden lg:block lg:col-span-4 space-y-5">
              {/* Verified Creator Status Card */}
              <div className="rounded-3xl bg-gradient-to-br from-[#0c1429] to-[#080d1c] border border-cyan-500/30 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                    HB Creator Program
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ৳{monetization.availableBalance.toLocaleString()} Available
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentUser.verifiedCreatorFollowers.toLocaleString()} Verified Followers
                  </p>
                </div>

                {/* Progress bar to next milestone (Diamond 1M) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-300">
                    <span>Next Award: HB Diamond</span>
                    <span className="font-mono text-cyan-400 font-bold">14.2%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-sky-400 w-[14.2%]" />
                  </div>
                </div>

                <button
                  onClick={() => setCurrentTab('creator_dashboard')}
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>Open Creator Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Play Button Awards Teaser */}
              <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-cyan-400" />
                    <span>Play Button Awards</span>
                  </h4>
                  <button
                    onClick={() => setCurrentTab('awards')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <div className="w-14 h-16 shrink-0 flex items-center justify-center">
                    <AwardArtwork tier="gold_100k" family="crystal_minimal" size="sm" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">HB Gold Creator Award</span>
                    <span className="text-[10px] text-emerald-400 font-medium">Claimed & Certified (100K+)</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">HB-GLD-2026-08492</p>
                  </div>
                </div>
              </div>

              {/* Community Safety Standards Disclosure */}
              <div className="rounded-3xl bg-[#0a0f1e] border border-slate-800 p-5 space-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Community Safety & Trust</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  HARDBOARD enforces automated pre-publication screening. Prohibited explicit sexual content, pornography, and violent harassment are blocked before delivery.
                </p>
                <button
                  onClick={() => setCurrentTab('privacy')}
                  className="text-cyan-400 text-[11px] font-semibold hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Read Full Privacy & Safety Policy</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* 2. REELS TAB */}
        {currentTab === 'reels' && <ReelsView />}

        {/* 3. PLAY BUTTON AWARDS TAB */}
        {currentTab === 'awards' && <AwardsPage />}

        {/* 4. CREATOR DASHBOARD TAB */}
        {currentTab === 'creator_dashboard' && <CreatorDashboard />}

        {/* 5. ADMIN DASHBOARD TAB */}
        {currentTab === 'admin_dashboard' && <AdminDashboard />}

        {/* 6. EXPANDED PROFILE TAB */}
        {currentTab === 'profile' && <ProfilePage onNavigateTab={setCurrentTab} />}

        {/* 7. PRIVACY POLICY TAB */}
        {currentTab === 'privacy' && <PrivacyPolicyPage />}
      </main>

      {/* Create Post / Note Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={refreshPosts}
        initialType={createPostInitialType}
      />
    </div>
  );
}
