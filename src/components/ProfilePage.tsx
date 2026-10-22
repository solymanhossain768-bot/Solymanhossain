import React, { useRef, useState } from 'react';
import { User, Post } from '../types';
import { StorageService } from '../services/storage';
import { PostCard } from './PostCard';
import { 
  Camera, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Twitter, 
  Youtube, 
  Github, 
  Linkedin, 
  CheckCircle2, 
  Edit3, 
  X, 
  Check, 
  AlertCircle, 
  Quote, 
  Grid, 
  Film, 
  FileText,
  UserPlus,
  UserCheck,
  Share2
} from 'lucide-react';

interface ProfilePageProps {
  onNavigateTab?: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateTab }) => {
  const [user, setUser] = useState<User>(StorageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'posts' | 'notes' | 'photos' | 'videos' | 'about'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  
  // Gallery upload states
  const [uploadType, setUploadType] = useState<'profile' | 'cover' | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Edit form states
  const [editForm, setEditForm] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    about: user.about,
    city: user.location.city,
    country: user.location.country,
    institution: user.education.institution,
    degree: user.education.degree,
    fieldOfStudy: user.education.fieldOfStudy,
    company: user.work.company,
    role: user.work.role,
    website: user.socialLinks.website || '',
    twitter: user.socialLinks.twitter || '',
    youtube: user.socialLinks.youtube || '',
    github: user.socialLinks.github || '',
    linkedin: user.socialLinks.linkedin || '',
    interests: user.interests.join(', '),
    skills: user.skills.join(', '),
  });

  const posts = StorageService.getPosts().filter(p => p.authorId === user.id);
  const notes = posts.filter(p => p.type === 'note');
  const photos = posts.filter(p => p.mediaUrl && p.mediaType === 'image');
  const videos = posts.filter(p => p.mediaUrl && p.mediaType === 'video');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadType(type);
    setUploadProgress(25);
    setUploadMessage(null);

    try {
      setUploadProgress(60);
      const res = await StorageService.uploadImage(file, type);
      
      if (!res.success || !res.url) {
        setUploadMessage({ 
          type: 'error', 
          text: res.error || 'Failed to upload image. Please try again with a valid JPG/PNG file.' 
        });
        setUploadProgress(0);
        return;
      }

      setUploadProgress(100);
      const updated = StorageService.getCurrentUser();
      setUser(updated);
      setUploadMessage({ 
        type: 'success', 
        text: `${type === 'profile' ? 'Profile photo' : 'Cover photo'} updated and saved permanently!` 
      });

      setTimeout(() => {
        setUploadProgress(0);
        setUploadType(null);
      }, 2000);
    } catch (err: any) {
      setUploadMessage({ type: 'error', text: err.message || 'Gallery upload failed.' });
      setUploadProgress(0);
      setUploadType(null);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = StorageService.updateCurrentUser({
      name: editForm.name.trim(),
      username: editForm.username.trim(),
      bio: editForm.bio.trim(),
      about: editForm.about.trim(),
      location: {
        city: editForm.city.trim(),
        country: editForm.country.trim(),
        visibility: user.location.visibility,
      },
      education: {
        institution: editForm.institution.trim(),
        degree: editForm.degree.trim(),
        fieldOfStudy: editForm.fieldOfStudy.trim(),
      },
      work: {
        company: editForm.company.trim(),
        role: editForm.role.trim(),
        current: true,
      },
      socialLinks: {
        website: editForm.website.trim(),
        twitter: editForm.twitter.trim(),
        youtube: editForm.youtube.trim(),
        github: editForm.github.trim(),
        linkedin: editForm.linkedin.trim(),
      },
      interests: editForm.interests.split(',').map(s => s.trim()).filter(Boolean),
      skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
    });

    setUser(updated);
    setIsEditing(false);
  };

  const handleFollowToggle = () => {
    StorageService.toggleFollowUser(user.id);
    setUser(StorageService.getCurrentUser());
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-12 animate-fade-in space-y-6">
      {/* Hidden Native File Inputs for Gallery */}
      <input
        type="file"
        accept="image/*"
        ref={profileInputRef}
        onChange={(e) => handleFileChange(e, 'profile')}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={coverInputRef}
        onChange={(e) => handleFileChange(e, 'cover')}
        className="hidden"
      />

      {/* Upload Feedback Toast */}
      {uploadMessage && (
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
          uploadMessage.type === 'success'
            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/70 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center gap-2">
            {uploadMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{uploadMessage.text}</span>
          </div>
          <button onClick={() => setUploadMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cover and Profile Header Card */}
      <div className="relative rounded-3xl bg-[#0a0f1e] border border-slate-800/80 overflow-hidden shadow-xl">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden group">
          <img
            src={user.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-black/30" />

          {/* Change Cover Button (Native Gallery Input Trigger) */}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/85 backdrop-blur-md text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer shadow-lg"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Change Cover Photo</span>
          </button>

          {/* Cover Progress Bar */}
          {uploadType === 'cover' && uploadProgress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
              <div 
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar and Top Actions row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with Native Change Profile Photo trigger */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 shadow-2xl">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover bg-slate-950"
                />
              </div>

              {/* Change Profile Photo Button */}
              <button
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg border-2 border-[#0a0f1e] transition-transform hover:scale-110 cursor-pointer"
                title="Change Profile Photo"
              >
                <Camera className="w-4 h-4 font-bold" />
              </button>

              {/* Profile Progress Ring */}
              {uploadType === 'profile' && uploadProgress > 0 && (
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
              )}
            </div>

            {/* Actions: Edit Profile, Follow, Share */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Edit Profile</span>
              </button>

              <button
                onClick={handleFollowToggle}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  user.isFollowing
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                }`}
              >
                {user.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Name & Handle */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
                {user.name}
              </h1>
              {user.isVerified && (
                <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-950" />
              )}
              {user.role === 'creator' && (
                <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded">
                  Verified Creator
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm text-cyan-400 font-mono">
              @{user.username}
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-slate-300 leading-relaxed mb-4 max-w-2xl">
            {user.bio}
          </p>

          {/* Fast Metadata details */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400 mb-5">
            {user.location.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user.location.city}, {user.location.country}</span>
              </div>
            )}
            {user.work.role && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                <span>{user.work.role} at {user.work.company}</span>
              </div>
            )}
            {user.education.institution && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user.education.fieldOfStudy} ({user.education.institution})</span>
              </div>
            )}
          </div>

          {/* Follower Stats */}
          <div className="flex items-center gap-6 py-3 border-t border-slate-800/80 text-sm">
            <div>
              <span className="font-extrabold text-white text-base">
                {user.followersCount.toLocaleString()}
              </span>{' '}
              <span className="text-slate-400 text-xs">Followers</span>
            </div>
            <div>
              <span className="font-extrabold text-white text-base">
                {user.followingCount.toLocaleString()}
              </span>{' '}
              <span className="text-slate-400 text-xs">Following</span>
            </div>
            <div>
              <span className="font-extrabold text-cyan-400 text-base">
                {user.verifiedCreatorFollowers.toLocaleString()}
              </span>{' '}
              <span className="text-slate-400 text-xs">Verified Fans</span>
            </div>
          </div>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex items-center gap-1 px-6 border-t border-slate-800 bg-slate-900/40 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'posts'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Quote className="w-4 h-4" />
            <span>Notes ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'photos'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photos ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'videos'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Videos & Reels ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>About & Skills</span>
          </button>
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="space-y-4">
        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onPostUpdated={() => setUser(StorageService.getCurrentUser())}
                />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                No posts published yet. Share your first post!
              </div>
            )}
          </div>
        )}

        {/* Notes Tab (Dedicated Note section) */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <PostCard
                  key={note.id}
                  post={note}
                  onPostUpdated={() => setUser(StorageService.getCurrentUser())}
                />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <Quote className="w-8 h-8 text-cyan-400/40 mx-auto" />
                <p>No Notes shared yet.</p>
                <p className="text-[11px] text-slate-400">
                  Tap "Share as Note" on any post to publish with your thoughts!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((p) => (
              <div key={p.id} className="relative rounded-2xl overflow-hidden aspect-square border border-slate-800 bg-slate-900 group">
                <img src={p.mediaUrl} alt="Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold p-2 text-center">
                  {p.content.slice(0, 40)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((v) => (
              <div key={v.id} className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-3 space-y-2">
                <video src={v.mediaUrl} controls className="w-full h-44 object-cover rounded-xl" />
                <p className="text-xs text-slate-300 font-medium line-clamp-2">{v.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* About & Skills Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* About card */}
            <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                About Me
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {user.about}
              </p>
            </div>

            {/* Skills & Interests */}
            <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white mb-2">Professional Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.skills.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-2">Interests & Hobbies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map(i => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl p-5 space-y-3 md:col-span-2">
              <h3 className="text-sm font-bold text-white">Verified Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {user.socialLinks.website && (
                  <a href={user.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-cyan-300 hover:border-cyan-500/50">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="truncate">{user.socialLinks.website}</span>
                  </a>
                )}
                {user.socialLinks.twitter && (
                  <a href={user.socialLinks.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sky-300 hover:border-sky-500/50">
                    <Twitter className="w-4 h-4 text-sky-400" />
                    <span className="truncate">{user.socialLinks.twitter}</span>
                  </a>
                )}
                {user.socialLinks.youtube && (
                  <a href={user.socialLinks.youtube} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-rose-300 hover:border-rose-500/50">
                    <Youtube className="w-4 h-4 text-rose-400" />
                    <span className="truncate">{user.socialLinks.youtube}</span>
                  </a>
                )}
                {user.socialLinks.github && (
                  <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200 hover:border-slate-600">
                    <Github className="w-4 h-4 text-slate-300" />
                    <span className="truncate">{user.socialLinks.github}</span>
                  </a>
                )}
                {user.socialLinks.linkedin && (
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-blue-300 hover:border-blue-500/50">
                    <Linkedin className="w-4 h-4 text-blue-400" />
                    <span className="truncate">{user.socialLinks.linkedin}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0c1222] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
              <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
                Edit Profile Information
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Username (@)</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Bio</label>
                <input
                  type="text"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">About Me</label>
                <textarea
                  value={editForm.about}
                  onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Country</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Institution</label>
                  <input
                    type="text"
                    value={editForm.institution}
                    onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Degree / Level</label>
                  <input
                    type="text"
                    value={editForm.degree}
                    onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={editForm.fieldOfStudy}
                    onChange={(e) => setEditForm({ ...editForm, fieldOfStudy: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Occupation / Role</label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={editForm.skills}
                    onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Interests (comma separated)</label>
                  <input
                    type="text"
                    value={editForm.interests}
                    onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 cursor-pointer shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
