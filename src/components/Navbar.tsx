import React, { useState } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { HBLogo } from './HBBrand';
import { AdminLoginModal, MobileAuthModal } from './AuthModals';
import { 
  Home, 
  Film, 
  Trophy, 
  LayoutDashboard, 
  ShieldAlert, 
  Plus, 
  User as UserIcon, 
  FileText, 
  Quote, 
  LogOut, 
  LogIn, 
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreatePost: (initialType?: any) => void;
  onOpenCreateNote?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreatePost,
}) => {
  const [currentUser, setCurrentUser] = useState<User>(StorageService.getCurrentUser());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showMobileAuthModal, setShowMobileAuthModal] = useState(false);

  const isAuthorizedAdmin = currentUser.role === 'admin' && StorageService.isAuthorizedAdmin();

  // Navigation items: Admin is strictly flagged as adminOnly
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'awards', label: 'Play Button', icon: Trophy, badge: 'Awards' },
    { id: 'creator_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin_dashboard', label: 'Admin', icon: ShieldAlert, adminOnly: true },
    { id: 'privacy', label: 'Privacy', icon: FileText },
  ];

  // Strictly filter out admin navigation from non-admin accounts
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAuthorizedAdmin);

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(StorageService.getCurrentUser());
    setShowProfileMenu(false);
    onSelectTab('feed');
  };

  const handleAuthSuccess = () => {
    setCurrentUser(StorageService.getCurrentUser());
  };

  return (
    <>
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#080d1a]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectTab('feed')}
            className="cursor-pointer shrink-0"
          >
            <HBLogo size="md" showTagline={false} />
          </div>

          {/* Desktop Navigation Links (Admin shown ONLY to authenticated admin) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)] font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                  {item.adminOnly && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-500/80 text-white">
                      Staff
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Create Button and Profile Menu */}
          <div className="flex items-center gap-2.5">
            {/* Quick Action: Create Post or Note */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onOpenCreatePost('text')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Post</span>
              </button>

              <button
                onClick={() => onOpenCreatePost('note')}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/60 transition-all cursor-pointer"
                title="Write a Note"
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Note</span>
              </button>
            </div>

            {/* Profile Avatar & Account Menu (No public admin buttons) */}
            <div className="relative">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative cursor-pointer group"
                title="Account Menu"
              >
                <div className={`w-9 h-9 rounded-full p-0.5 ${
                  isAuthorizedAdmin 
                    ? 'bg-gradient-to-tr from-amber-400 to-rose-500 ring-2 ring-rose-500/40' 
                    : 'bg-gradient-to-tr from-cyan-400 to-blue-500'
                }`}>
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-[#0c1222] border border-cyan-500/30 shadow-2xl p-2 space-y-1 text-xs animate-fade-in">
                  {/* User summary */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate">{currentUser.name}</span>
                      <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded ${
                        isAuthorizedAdmin 
                          ? 'bg-rose-950/90 text-rose-300 border border-rose-500/40' 
                          : currentUser.role === 'creator'
                          ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isAuthorizedAdmin ? 'Verified Admin' : currentUser.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">@{currentUser.username}</div>
                  </div>

                  {/* Links */}
                  <button
                    onClick={() => { onSelectTab('profile'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-cyan-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => { onSelectTab('creator_dashboard'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-sky-400" />
                    <span>Creator Dashboard</span>
                  </button>

                  <button
                    onClick={() => { onSelectTab('awards'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Play Button Awards</span>
                  </button>

                  <button
                    onClick={() => { onSelectTab('privacy'); setShowProfileMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>Privacy Policy & Settings</span>
                  </button>

                  {/* Show Admin Dashboard access ONLY to authenticated admin */}
                  {isAuthorizedAdmin && (
                    <button
                      onClick={() => { onSelectTab('admin_dashboard'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-rose-300 bg-rose-950/40 border border-rose-500/30 hover:bg-rose-950/70 transition-colors cursor-pointer font-bold"
                    >
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Admin Control Console</span>
                    </button>
                  )}

                  <div className="pt-1 border-t border-slate-800/80 space-y-1">
                    {/* Separate Staff Login Modal Trigger for Admins (hidden from normal view) */}
                    {!isAuthorizedAdmin && (
                      <button
                        onClick={() => { setShowAdminLoginModal(true); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left text-slate-400 hover:text-cyan-300 hover:bg-slate-850 transition-colors cursor-pointer text-[11px]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>Staff Administrator Portal</span>
                      </button>
                    )}

                    <button
                      onClick={() => { setShowMobileAuthModal(true); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer text-[11px]"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Switch Account / Phone Login</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-left text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer text-[11px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Admin tab strictly excluded for non-admins) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080d1a]/95 backdrop-blur-md border-t border-slate-800 py-2 px-3 flex items-center justify-around shadow-2xl">
        {visibleNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
            currentTab === 'profile' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* Admin Authorization Passkey Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={() => {
          handleAuthSuccess();
          onSelectTab('admin_dashboard');
        }}
      />

      {/* Mobile Number Auth & Duplicate Prevention Modal */}
      <MobileAuthModal
        isOpen={showMobileAuthModal}
        onClose={() => setShowMobileAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};
