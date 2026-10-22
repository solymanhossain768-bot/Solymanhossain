import { 
  User, 
  Post, 
  Story, 
  ReelItem, 
  AwardMilestone, 
  CreatorMonetization, 
  WithdrawalRequest, 
  ModerationItem, 
  SystemNotice, 
  ReactionType, 
  UserRole,
  AudienceType,
  PrivacySettings
} from '../types';
import { screenContent } from './moderation';

// Storage keys
const STORAGE_PREFIX = 'hardboard_app_v2_';
const KEYS = {
  CURRENT_USER: `${STORAGE_PREFIX}current_user`,
  USERS: `${STORAGE_PREFIX}users`,
  POSTS: `${STORAGE_PREFIX}posts`,
  STORIES: `${STORAGE_PREFIX}stories`,
  REELS: `${STORAGE_PREFIX}reels`,
  AWARDS: `${STORAGE_PREFIX}awards`,
  MONETIZATION: `${STORAGE_PREFIX}monetization`,
  WITHDRAWALS: `${STORAGE_PREFIX}withdrawals`,
  MODERATION: `${STORAGE_PREFIX}moderation`,
  NOTICES: `${STORAGE_PREFIX}notices`,
  PRIVACY: `${STORAGE_PREFIX}privacy`,
  BLOCKED_USERS: `${STORAGE_PREFIX}blocked_users`,
};

// Initial Seed User (Authenticated creator)
const INITIAL_USER: User = {
  id: 'user_tamim_01',
  name: 'Tamim Ahmed',
  username: 'tamim_tech',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  role: 'creator',
  isVerified: true,
  bio: 'Digital Creator & Tech Storyteller. Building modern web systems and creative media on HARDBOARD.',
  about: 'Welcome to my official HARDBOARD space! I share tutorials, behind-the-scenes engineering notes, and creative video shorts. Proud member of the HB Creator Program.',
  location: {
    city: 'Dhaka',
    country: 'Bangladesh',
    visibility: 'public',
  },
  education: {
    institution: 'University of Dhaka',
    degree: 'B.Sc.',
    fieldOfStudy: 'Computer Science & Engineering',
    graduationYear: '2023',
  },
  work: {
    company: 'Apex Media Labs',
    role: 'Lead Media Architect',
    current: true,
  },
  interests: ['Cloud Architecture', 'Video Production', 'UI/UX Design', 'Indie Hacking', 'Photography'],
  skills: ['TypeScript', 'Next.js', 'Vite', 'Video Editing', 'Content Strategy', 'Distributed Systems'],
  socialLinks: {
    website: 'https://tamim.dev',
    twitter: 'https://twitter.com/tamim_tech',
    youtube: 'https://youtube.com/@tamimtech',
    github: 'https://github.com/tamim-tech',
    linkedin: 'https://linkedin.com/in/tamimahmed',
  },
  followersCount: 142500, // Surpassed 100K milestone for Gold Award!
  followingCount: 382,
  isFollowing: false,
  verifiedCreatorFollowers: 142500,
  stats: {
    postsCount: 24,
    photosCount: 18,
    videosCount: 12,
    reelsCount: 31,
    notesCount: 8,
  },
};

// Seed Posts
const INITIAL_POSTS: Post[] = [
  {
    id: 'post_101',
    authorId: 'user_tamim_01',
    author: {
      id: 'user_tamim_01',
      name: 'Tamim Ahmed',
      username: 'tamim_tech',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'creator',
    },
    type: 'photo',
    content: 'Huge milestone reached today! Over 140,000 verified followers on HARDBOARD. Thank you all for trusting our tech tutorials and community journey! Check out the new HB Gold Creator Award on my profile.',
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    audience: 'public',
    likesCount: 1240,
    reactions: { like: 820, love: 310, care: 60, haha: 20, wow: 25, sad: 2, angry: 3 },
    userReaction: 'love',
    commentsCount: 94,
    sharesCount: 56,
    notesCount: 14,
    safetyStatus: 'allowed',
    comments: [
      {
        id: 'c_1',
        postId: 'post_101',
        author: {
          id: 'user_sara',
          name: 'Sara Khan',
          username: 'sara_creative',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        },
        content: 'Congratulations Tamim! The new HB Creator Award looks phenomenal! Well deserved.',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        likesCount: 38,
        userLiked: true,
      },
      {
        id: 'c_2',
        postId: 'post_101',
        author: {
          id: 'user_rafiq',
          name: 'Rafiqul Islam',
          username: 'rafiq_dev',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        },
        content: 'Your tutorials helped me pass my technical interview last week. Cheers brother!',
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        likesCount: 15,
      },
    ],
  },
  {
    id: 'post_102',
    authorId: 'user_sara',
    author: {
      id: 'user_sara',
      name: 'Sara Khan',
      username: 'sara_creative',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      role: 'creator',
    },
    type: 'text',
    content: 'Just launched our creative design system for HB Apps! Crisp dark-mode gradients with luminous cyan highlights are the future of accessible social interfaces.',
    backgroundGradient: 'from-blue-950 via-slate-900 to-cyan-950',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    audience: 'public',
    likesCount: 890,
    reactions: { like: 540, love: 280, care: 40, haha: 12, wow: 16, sad: 1, angry: 1 },
    commentsCount: 42,
    sharesCount: 31,
    notesCount: 9,
    safetyStatus: 'allowed',
  },
  {
    id: 'post_103',
    authorId: 'user_tamim_01',
    author: {
      id: 'user_tamim_01',
      name: 'Tamim Ahmed',
      username: 'tamim_tech',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
      role: 'creator',
    },
    type: 'note',
    content: 'Essential reading for every frontend engineer: Clean typographic hierarchy beats decorative pills every single time.',
    noteThoughts: 'Sara hit the nail on the head. Contrast and tactile visual cues build trust with your community.',
    originalPostId: 'post_102',
    originalPost: {
      id: 'post_102',
      authorName: 'Sara Khan',
      authorUsername: 'sara_creative',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      content: 'Just launched our creative design system for HB Apps! Crisp dark-mode gradients with luminous cyan highlights are the future of accessible social interfaces.',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    audience: 'public',
    likesCount: 342,
    reactions: { like: 210, love: 110, care: 15, haha: 3, wow: 4, sad: 0, angry: 0 },
    commentsCount: 18,
    sharesCount: 12,
    notesCount: 4,
    safetyStatus: 'allowed',
  },
  {
    id: 'post_104',
    authorId: 'user_rafiq',
    author: {
      id: 'user_rafiq',
      name: 'Rafiqul Islam',
      username: 'rafiq_dev',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isVerified: false,
      role: 'user',
    },
    type: 'text',
    content: 'Quick poll for the Dhaka tech community: What is your primary toolchain for web performance monitoring in 2026? Drop your thoughts below!',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    audience: 'public',
    likesCount: 156,
    reactions: { like: 120, love: 22, care: 10, haha: 1, wow: 3, sad: 0, angry: 0 },
    commentsCount: 29,
    sharesCount: 8,
    notesCount: 3,
    safetyStatus: 'allowed',
  },
];

// Seed Stories
const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    authorId: 'user_tamim_01',
    author: {
      id: 'user_tamim_01',
      name: 'Tamim Ahmed',
      username: 'tamim_tech',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    caption: 'Setting up the studio for tonight live coding stream! 💻',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 22).toISOString(),
    isViewed: false,
  },
  {
    id: 'story_2',
    authorId: 'user_sara',
    author: {
      id: 'user_sara',
      name: 'Sara Khan',
      username: 'sara_creative',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    mediaType: 'image',
    caption: 'Prototyping metallic shader assets for the new award ceremony 💎',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 19).toISOString(),
    isViewed: false,
  },
];

// Seed Reels
const INITIAL_REELS: ReelItem[] = [
  {
    id: 'reel_1',
    author: {
      id: 'user_tamim_01',
      name: 'Tamim Ahmed',
      username: 'tamim_tech',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      isVerified: true,
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    caption: '3 mistakes every junior engineer makes with database connection pooling 🚀 #devtips #hardboard #tech',
    audioTrack: 'Original Audio · tamim_tech (Coding Beats Vol. 4)',
    likesCount: 18400,
    userLiked: true,
    commentsCount: 420,
    sharesCount: 1980,
    isFollowing: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'reel_2',
    author: {
      id: 'user_sara',
      name: 'Sara Khan',
      username: 'sara_creative',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
    },
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    caption: 'How we sculpted the HB Diamond Creator Award in pure 3D 💎 #hbawards #creators #design',
    audioTrack: 'Atmospheric Synthwave · HB Studio Sound',
    likesCount: 34100,
    userLiked: false,
    commentsCount: 890,
    sharesCount: 4120,
    isFollowing: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

// Initial Milestones (100K Gold is Eligible/Claimed!)
const INITIAL_AWARDS: AwardMilestone[] = [
  {
    id: 'gold_100k',
    name: 'HB Gold Creator Award',
    tierName: 'Gold Milestone',
    requiredFollowers: 100000,
    description: 'Conferred to visionary creators who cultivate a verified community of over 100,000 members.',
    status: 'claimed',
    claimedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    serialNumber: 'HB-GLD-2026-08492',
    selectedFamily: 'crystal_minimal',
  },
  {
    id: 'diamond_1m',
    name: 'HB Diamond Creator Award',
    tierName: 'Diamond Milestone',
    requiredFollowers: 1000000,
    description: 'Conferred to elite innovators who build a transformative cultural community of 1,000,000 verified followers.',
    status: 'locked',
    selectedFamily: 'sculpted_3d',
  },
  {
    id: 'special_10m',
    name: 'HB Special Creator Award',
    tierName: 'Special Legend Milestone',
    requiredFollowers: 10000000,
    description: 'The paramount pinnacle of the HARDBOARD ecosystem, honoring global cultural leaders reaching 10,000,000 followers.',
    status: 'locked',
    selectedFamily: 'fluid_signature',
  },
];

// Creator Monetization State (70% Creator / 30% HB, BDT ৳)
const INITIAL_MONETIZATION: CreatorMonetization = {
  // Video monetization requirement: 100 minutes of qualifying video-ad display activity
  videoAdMinutes: 142.5,
  videoAdMinutesTarget: 100,
  isVideoEligible: true,

  // Banner requirement: 20,000 valid banner ad impressions attributed to creator content
  bannerImpressions: 28400,
  bannerImpressionsTarget: 20000,
  isBannerEligible: true,

  // Financial figures in BDT (৳)
  estimatedRevenue: 18450.00,
  finalizedRevenue: 16200.00,
  providerReceivedReconciled: 16200.00, // Reconciled provider receipts
  
  // Creator 70% share of 16,200 finalized net ad revenue = ৳11,340
  creatorShare70Pct: 11340.00,
  // HB 30% share = ৳4,860
  hbShare30Pct: 4860.00,

  pendingPayments: 0,
  availableBalance: 8140.00, // Withdrawable balance (after previous payouts)
  withdrawnTotal: 3200.00,

  lastReconciliationDate: '2026-10-05',
};

// Seed Withdrawal Requests
const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'w_202610_01',
    creatorId: 'user_tamim_01',
    creatorName: 'Tamim Ahmed',
    creatorUsername: 'tamim_tech',
    amount: 3200,
    method: 'bkash',
    accountDetails: {
      accountNumber: '01712345678',
      accountName: 'Tamim Ahmed',
    },
    status: 'paid',
    transactionRef: 'BKH-8924018471',
    createdAt: '2026-10-06T09:30:00Z',
    processedAt: '2026-10-06T14:22:00Z',
    adminNotes: 'Verified against reconciled Google AdMob October payout. Payment dispatched via bKash Merchant API.',
  },
];

// Seed Moderation Queue
const INITIAL_MODERATION: ModerationItem[] = [
  {
    id: 'mod_1',
    contentId: 'flagged_p_99',
    contentType: 'post',
    author: {
      id: 'spammer_9',
      name: 'Unverified Promos',
      username: 'cryptodrops99',
    },
    snippet: 'Instant WhatsApp private group link! Free crypto airdrop for first 100 participants!',
    reason: 'Commercial sexual solicitation or unregulated promotion requiring manual safety review',
    severity: 'medium',
    safetyScore: 0.65,
    status: 'review_required',
    reportedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
];

// Seed Notices
const INITIAL_NOTICES: SystemNotice[] = [
  {
    id: 'n_1',
    title: 'October Monetization Reconciliation Completed',
    content: 'Eligible creator shares (70% net revenue) for the preceding cycle have been reconciled from advertising network receipts and credited to your available balance. Monthly withdrawal payouts will process starting on the 5th.',
    targetAudience: 'creators',
    createdAt: '2026-10-05T12:00:00Z',
  },
  {
    id: 'n_2',
    title: 'New Feature: Share as Note is Now Live!',
    content: 'Creators and community members can now quote and share posts as Notes with dedicated author attribution and thoughts.',
    targetAudience: 'all',
    createdAt: '2026-10-18T10:00:00Z',
  },
];

// Initial Privacy Settings
const INITIAL_PRIVACY: PrivacySettings = {
  profileVisibility: 'public',
  locationVisibility: 'public',
  messagePermissions: 'followers_only',
  personalizedAdsConsent: true,
  aiSafetyScanningConsent: true,
};

// Generic LocalStorage Safe Helpers
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.error(`Failed to read ${key} from storage:`, err);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write ${key} to storage:`, err);
  }
}

// Storage Service Singleton
export class StorageService {
  // Current Authenticated User
  static getCurrentUser(): User {
    return getStored<User>(KEYS.CURRENT_USER, INITIAL_USER);
  }

  static updateCurrentUser(updates: Partial<User>): User {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updates };
    setStored(KEYS.CURRENT_USER, updated);
    return updated;
  }

  static getAdminToken(): string | null {
    return localStorage.getItem(`${STORAGE_PREFIX}admin_token`);
  }

  static setAdminToken(token: string | null): void {
    if (token) {
      localStorage.setItem(`${STORAGE_PREFIX}admin_token`, token);
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}admin_token`);
    }
  }

  static isAuthorizedAdmin(): boolean {
    const user = this.getCurrentUser();
    const token = this.getAdminToken();
    return user.role === 'admin' && !!token;
  }

  // Mobile Number Registration with Duplicate Prevention
  static async registerWithPhone(
    phone: string, 
    name: string, 
    username: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, username }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      const newUser: User = {
        id: data.user.id,
        name: data.user.name,
        username: data.user.username,
        phone: data.user.phone,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        role: 'user',
        isVerified: false,
        bio: 'New member of the HARDBOARD community.',
        about: 'Excited to discover tech content and creators on HB Apps.',
        location: { city: 'Dhaka', country: 'Bangladesh', visibility: 'public' },
        education: { institution: '', degree: '', fieldOfStudy: '' },
        work: { company: '', role: '', current: false },
        interests: ['Technology', 'Social Media'],
        skills: ['Member'],
        socialLinks: {},
        followersCount: 0,
        followingCount: 0,
        verifiedCreatorFollowers: 0,
        stats: { postsCount: 0, photosCount: 0, videosCount: 0, reelsCount: 0, notesCount: 0 },
      };

      this.setAdminToken(null);
      setStored(KEYS.CURRENT_USER, newUser);
      return { success: true, user: newUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration.' };
    }
  }

  // Mobile Number Login
  static async loginWithPhone(phone: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }

      // If user is Tamim, load full creator profile, else basic profile
      let targetUser = this.getCurrentUser();
      if (data.user.role === 'creator' || data.user.id === 'user_tamim_01') {
        targetUser = { ...INITIAL_USER, phone: data.user.phone };
      } else {
        targetUser = {
          ...targetUser,
          id: data.user.id,
          name: data.user.name,
          username: data.user.username,
          phone: data.user.phone,
          role: data.user.role,
        };
      }

      this.setAdminToken(null);
      setStored(KEYS.CURRENT_USER, targetUser);
      return { success: true, user: targetUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login network error.' };
    }
  }

  // Authenticate as Server-Authorized Administrator
  static async loginAsAdmin(passkey: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || 'Invalid administrator authorization key.' };
      }

      const adminUser: User = {
        id: 'admin_master',
        name: 'Hardboard Administrator',
        username: 'hb_admin',
        phone: '01912345678',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        role: 'admin',
        isVerified: true,
        bio: 'HARDBOARD Platform Operations & Community Safety Lead.',
        about: 'Official system administration account overseeing moderation, creator compliance, and ledger reconciliation.',
        location: { city: 'Dhaka', country: 'Bangladesh', visibility: 'public' },
        education: { institution: 'System Operations Institute', degree: 'M.Sc.', fieldOfStudy: 'Cybersecurity' },
        work: { company: 'HARDBOARD Apps', role: 'Super Admin', current: true },
        interests: ['Platform Security', 'Financial Systems', 'Content Safety'],
        skills: ['Admin Console', 'Ledger Audit', 'Moderation'],
        socialLinks: { website: 'https://hardboard.io' },
        followersCount: 1000000,
        followingCount: 12,
        verifiedCreatorFollowers: 1000000,
        stats: { postsCount: 140, photosCount: 30, videosCount: 20, reelsCount: 50, notesCount: 120 },
      };

      this.setAdminToken(data.token);
      setStored(KEYS.CURRENT_USER, adminUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Admin authentication failed.' };
    }
  }

  // Logout session
  static logout(): void {
    this.setAdminToken(null);
    setStored(KEYS.CURRENT_USER, {
      ...INITIAL_USER,
      id: 'user_regular_guest',
      name: 'Community User',
      username: 'hb_user',
      role: 'user',
      isVerified: false,
      followersCount: 12,
      followingCount: 45,
      verifiedCreatorFollowers: 0,
    });
  }

  static switchUserRole(role: UserRole): User {
    if (role === 'admin') {
      this.setAdminToken('hb_adm_sec_session_token_2026');
    } else {
      this.setAdminToken(null);
    }
    return this.updateCurrentUser({ role });
  }

  // Profile and Cover Photo Upload Handling
  static async uploadImage(
    file: File, 
    type: 'profile' | 'cover' | 'post' | 'story'
  ): Promise<{ url: string; success: boolean; error?: string }> {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { url: '', success: false, error: 'Only valid image files (JPG, PNG, WebP) are allowed.' };
    }

    // Validate size (max 8MB)
    const MAX_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { url: '', success: false, error: 'File size exceeds maximum 8MB limit.' };
    }

    // Perform pre-upload content safety screening on file name
    const safetyCheck = await screenContent(file.name);
    if (safetyCheck.status === 'blocked') {
      return { url: '', success: false, error: `Upload rejected: ${safetyCheck.reason}` };
    }

    // Read file as base64 to send to persistent server storage
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file from device.'));
      reader.readAsDataURL(file);
    });

    try {
      // Post to persistent server upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData: base64Data,
          fileName: file.name,
          fileType: file.type,
          uploadType: type,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server storage upload failed (HTTP ${response.status})`);
      }

      const resData = await response.json();
      const permanentUrl = resData.url || base64Data;

      // Save permanent image URL to authenticated user record
      if (type === 'profile') {
        StorageService.updateCurrentUser({ avatarUrl: permanentUrl });
      } else if (type === 'cover') {
        StorageService.updateCurrentUser({ coverUrl: permanentUrl });
      }

      return { url: permanentUrl, success: true };
    } catch (err: any) {
      console.warn('Server upload fallback to persistent local store:', err);
      // Fallback to storing verified base64 data URL if server unreachable
      if (type === 'profile') {
        StorageService.updateCurrentUser({ avatarUrl: base64Data });
      } else if (type === 'cover') {
        StorageService.updateCurrentUser({ coverUrl: base64Data });
      }
      return { url: base64Data, success: true };
    }
  }

  // Posts Feed Management
  static getPosts(): Post[] {
    return getStored<Post[]>(KEYS.POSTS, INITIAL_POSTS);
  }

  static async createPost(
    postData: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'reactions' | 'commentsCount' | 'sharesCount' | 'notesCount' | 'safetyStatus'>
  ): Promise<{ post?: Post; error?: string }> {
    // Backend-enforced safety moderation screening
    const safety = await screenContent(postData.content, postData.mediaUrl, postData.mediaType);
    
    if (safety.status === 'blocked') {
      return { 
        error: `Content Blocked by Community Safety Standards: ${safety.reason}. HARDBOARD strictly prohibits explicit sexual material, violent threats, and harassment.` 
      };
    }

    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      commentsCount: 0,
      sharesCount: 0,
      notesCount: 0,
      safetyStatus: safety.status,
      safetyReason: safety.reason,
    };

    // If review is required, quarantine into moderation queue
    if (safety.status === 'review_required') {
      this.addModerationItem({
        id: `mod_${Date.now()}`,
        contentId: newPost.id,
        contentType: newPost.type,
        author: {
          id: newPost.author.id,
          name: newPost.author.name,
          username: newPost.author.username,
        },
        snippet: newPost.content,
        mediaUrl: newPost.mediaUrl,
        mediaType: newPost.mediaType,
        reason: safety.reason || 'Flagged by automated screening',
        severity: 'medium',
        safetyScore: safety.safetyScore,
        status: 'review_required',
        reportedAt: new Date().toISOString(),
      });
    }

    const posts = this.getPosts();
    posts.unshift(newPost);
    setStored(KEYS.POSTS, posts);

    // Increment user post stat
    const user = this.getCurrentUser();
    if (user.id === newPost.authorId) {
      this.updateCurrentUser({
        stats: {
          ...user.stats,
          postsCount: user.stats.postsCount + 1,
          photosCount: newPost.type === 'photo' ? user.stats.photosCount + 1 : user.stats.photosCount,
          videosCount: newPost.type === 'video' ? user.stats.videosCount + 1 : user.stats.videosCount,
          notesCount: newPost.type === 'note' ? user.stats.notesCount + 1 : user.stats.notesCount,
        }
      });
    }

    return { post: newPost };
  }

  // Create Note (Dedicated Note Sharing flow)
  static async createNote(
    originalPost: Post,
    thoughts: string,
    audience: AudienceType = 'public'
  ): Promise<{ note?: Post; error?: string }> {
    const user = this.getCurrentUser();

    // Moderation screen on the user's added commentary
    const safety = await screenContent(thoughts);
    if (safety.status === 'blocked') {
      return { 
        error: `Your note was blocked by Community Safety Standards: ${safety.reason}.` 
      };
    }

    const notePost: Post = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      authorId: user.id,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        role: user.role,
      },
      type: 'note',
      content: thoughts,
      noteThoughts: thoughts,
      originalPostId: originalPost.id,
      originalPost: {
        id: originalPost.id,
        authorName: originalPost.author.name,
        authorUsername: originalPost.author.username,
        authorAvatar: originalPost.author.avatarUrl,
        content: originalPost.content,
        mediaUrl: originalPost.mediaUrl,
        mediaType: originalPost.mediaType,
        createdAt: originalPost.createdAt,
      },
      createdAt: new Date().toISOString(),
      audience,
      likesCount: 0,
      reactions: { like: 0, love: 0, care: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
      commentsCount: 0,
      sharesCount: 0,
      notesCount: 0,
      safetyStatus: safety.status,
      safetyReason: safety.reason,
    };

    const posts = this.getPosts();
    // Increment the original post's notesCount
    const originalIdx = posts.findIndex(p => p.id === originalPost.id);
    if (originalIdx !== -1) {
      posts[originalIdx].notesCount = (posts[originalIdx].notesCount || 0) + 1;
    }

    posts.unshift(notePost);
    setStored(KEYS.POSTS, posts);

    // Update current user note count
    this.updateCurrentUser({
      stats: {
        ...user.stats,
        notesCount: (user.stats.notesCount || 0) + 1,
        postsCount: user.stats.postsCount + 1,
      }
    });

    return { note: notePost };
  }

  // Reactions & Engagement
  static toggleReaction(postId: string, reaction: ReactionType): Post | null {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    const previousReaction = post.userReaction;

    if (previousReaction === reaction) {
      // Untoggle
      post.reactions[reaction] = Math.max(0, (post.reactions[reaction] || 1) - 1);
      post.userReaction = undefined;
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      // Switching or adding
      if (previousReaction) {
        post.reactions[previousReaction] = Math.max(0, (post.reactions[previousReaction] || 1) - 1);
      } else {
        post.likesCount += 1;
      }
      post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
      post.userReaction = reaction;
    }

    setStored(KEYS.POSTS, posts);
    return post;
  }

  static addComment(postId: string, content: string): Post | null {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    const user = this.getCurrentUser();
    const newComment = {
      id: `comm_${Date.now()}`,
      postId,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);
    post.commentsCount = (post.commentsCount || 0) + 1;

    setStored(KEYS.POSTS, posts);
    return post;
  }

  static deletePost(postId: string): boolean {
    const user = this.getCurrentUser();
    let posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return false;

    // Check ownership or admin privilege
    if (post.authorId !== user.id && user.role !== 'admin') {
      return false;
    }

    posts = posts.filter(p => p.id !== postId);
    setStored(KEYS.POSTS, posts);
    return true;
  }

  // Follow / Unfollow Creator
  static toggleFollowUser(targetUserId: string): boolean {
    const user = this.getCurrentUser();
    const isNowFollowing = !user.isFollowing;
    const newFollowers = isNowFollowing 
      ? user.followersCount + 1 
      : Math.max(0, user.followersCount - 1);

    this.updateCurrentUser({
      isFollowing: isNowFollowing,
      followersCount: newFollowers,
      verifiedCreatorFollowers: newFollowers,
    });
    return isNowFollowing;
  }

  // Stories
  static getStories(): Story[] {
    return getStored<Story[]>(KEYS.STORIES, INITIAL_STORIES);
  }

  static addStory(mediaUrl: string, caption?: string): Story {
    const user = this.getCurrentUser();
    const newStory: Story = {
      id: `story_${Date.now()}`,
      authorId: user.id,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
      mediaUrl,
      mediaType: 'image',
      caption,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      isViewed: false,
    };

    const stories = this.getStories();
    stories.unshift(newStory);
    setStored(KEYS.STORIES, stories);
    return newStory;
  }

  // Reels
  static getReels(): ReelItem[] {
    return getStored<ReelItem[]>(KEYS.REELS, INITIAL_REELS);
  }

  // Awards & Milestones
  static getAwards(): AwardMilestone[] {
    const awards = getStored<AwardMilestone[]>(KEYS.AWARDS, INITIAL_AWARDS);
    const user = this.getCurrentUser();

    // Dynamically evaluate eligibility based on verified follower count
    return awards.map(a => {
      if (user.verifiedCreatorFollowers >= a.requiredFollowers) {
        if (a.status === 'locked') {
          return { ...a, status: 'eligible' };
        }
      } else {
        if (a.status !== 'claimed') {
          return { ...a, status: 'locked' };
        }
      }
      return a;
    });
  }

  static claimAward(awardId: string): { success: boolean; award?: AwardMilestone; error?: string } {
    const user = this.getCurrentUser();
    const awards = this.getAwards();
    const target = awards.find(a => a.id === awardId);

    if (!target) {
      return { success: false, error: 'Award tier not found.' };
    }

    if (user.verifiedCreatorFollowers < target.requiredFollowers) {
      return { 
        success: false, 
        error: `Insufficient verified followers. You need ${target.requiredFollowers.toLocaleString()} verified followers.` 
      };
    }

    if (target.status === 'claimed') {
      return { success: false, error: 'This award has already been claimed and certified.' };
    }

    // Generate unique certification serial number
    const serial = `HB-${awardId.toUpperCase()}-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    target.status = 'claimed';
    target.claimedAt = new Date().toISOString();
    target.serialNumber = serial;

    setStored(KEYS.AWARDS, awards);
    return { success: true, award: target };
  }

  static updateAwardFamily(awardId: string, family: AwardMilestone['selectedFamily']): void {
    const awards = this.getAwards();
    const target = awards.find(a => a.id === awardId);
    if (target) {
      target.selectedFamily = family;
      setStored(KEYS.AWARDS, awards);
    }
  }

  // Creator Monetization
  static getMonetization(): CreatorMonetization {
    return getStored<CreatorMonetization>(KEYS.MONETIZATION, INITIAL_MONETIZATION);
  }

  static updateMonetization(updates: Partial<CreatorMonetization>): CreatorMonetization {
    const current = this.getMonetization();
    const updated = { ...current, ...updates };
    setStored(KEYS.MONETIZATION, updated);
    return updated;
  }

  // Withdrawals
  static getWithdrawals(): WithdrawalRequest[] {
    return getStored<WithdrawalRequest[]>(KEYS.WITHDRAWALS, INITIAL_WITHDRAWALS);
  }

  static submitWithdrawal(
    amount: number, 
    method: WithdrawalRequest['method'], 
    details: WithdrawalRequest['accountDetails']
  ): { success: boolean; request?: WithdrawalRequest; error?: string } {
    const MIN_AMOUNT = 1200; // Minimum ৳1,200
    if (amount < MIN_AMOUNT) {
      return { 
        success: false, 
        error: `Minimum withdrawal amount is ৳1,200. You entered ৳${amount.toLocaleString()}.` 
      };
    }

    const monetization = this.getMonetization();
    if (amount > monetization.availableBalance) {
      return { 
        success: false, 
        error: `Insufficient available balance. Your withdrawable balance is ৳${monetization.availableBalance.toLocaleString()}.` 
      };
    }

    const user = this.getCurrentUser();
    const newRequest: WithdrawalRequest = {
      id: `w_${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorUsername: user.username,
      amount,
      method,
      accountDetails: details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Safely reserve funds from available balance into pending payments
    this.updateMonetization({
      availableBalance: monetization.availableBalance - amount,
      pendingPayments: monetization.pendingPayments + amount,
    });

    const list = this.getWithdrawals();
    list.unshift(newRequest);
    setStored(KEYS.WITHDRAWALS, list);

    return { success: true, request: newRequest };
  }

  // Admin Actions
  static verifyAndPayWithdrawal(requestId: string, transactionRef: string, notes?: string): boolean {
    const list = this.getWithdrawals();
    const request = list.find(r => r.id === requestId);
    if (!request || request.status === 'paid') return false;

    request.status = 'paid';
    request.transactionRef = transactionRef;
    request.processedAt = new Date().toISOString();
    request.adminNotes = notes || 'Payment confirmed via verified financial provider transfer.';

    // Move pending reserve to total paid out
    const mon = this.getMonetization();
    this.updateMonetization({
      pendingPayments: Math.max(0, mon.pendingPayments - request.amount),
      withdrawnTotal: mon.withdrawnTotal + request.amount,
    });

    setStored(KEYS.WITHDRAWALS, list);
    return true;
  }

  static rejectWithdrawal(requestId: string, reason: string): boolean {
    const list = this.getWithdrawals();
    const request = list.find(r => r.id === requestId);
    if (!request || request.status === 'paid') return false;

    request.status = 'rejected';
    request.adminNotes = reason;
    request.processedAt = new Date().toISOString();

    // Release reserved funds back to available balance
    const mon = this.getMonetization();
    this.updateMonetization({
      availableBalance: mon.availableBalance + request.amount,
      pendingPayments: Math.max(0, mon.pendingPayments - request.amount),
    });

    setStored(KEYS.WITHDRAWALS, list);
    return true;
  }

  static reconcileProviderRevenue(providerAmount: number): void {
    const mon = this.getMonetization();
    // 70% share belongs to creator, 30% belongs to HB
    const creatorShare = providerAmount * 0.70;
    const hbShare = providerAmount * 0.30;

    this.updateMonetization({
      providerReceivedReconciled: mon.providerReceivedReconciled + providerAmount,
      finalizedRevenue: mon.finalizedRevenue + providerAmount,
      creatorShare70Pct: mon.creatorShare70Pct + creatorShare,
      hbShare30Pct: mon.hbShare30Pct + hbShare,
      availableBalance: mon.availableBalance + creatorShare,
      lastReconciliationDate: new Date().toISOString().split('T')[0],
    });
  }

  // Moderation Queue
  static getModerationQueue(): ModerationItem[] {
    return getStored<ModerationItem[]>(KEYS.MODERATION, INITIAL_MODERATION);
  }

  static addModerationItem(item: ModerationItem): void {
    const queue = this.getModerationQueue();
    queue.unshift(item);
    setStored(KEYS.MODERATION, queue);
  }

  static resolveModerationItem(
    itemId: string, 
    action: 'allowed' | 'blocked' | 'quarantined'
  ): void {
    const queue = this.getModerationQueue();
    const item = queue.find(i => i.id === itemId);
    if (item) {
      item.status = action;
      item.reviewedAt = new Date().toISOString();
      item.actionTaken = action === 'allowed' ? 'Content approved and published' : 'Content removed for violation';
      setStored(KEYS.MODERATION, queue);

      // If blocked, remove corresponding post
      if (action === 'blocked') {
        const posts = this.getPosts().filter(p => p.id !== item.contentId);
        setStored(KEYS.POSTS, posts);
      }
    }
  }

  // System Notices
  static getNotices(): SystemNotice[] {
    return getStored<SystemNotice[]>(KEYS.NOTICES, INITIAL_NOTICES);
  }

  static addNotice(title: string, content: string, audience: SystemNotice['targetAudience'] = 'all'): SystemNotice {
    const newNotice: SystemNotice = {
      id: `notice_${Date.now()}`,
      title,
      content,
      targetAudience: audience,
      createdAt: new Date().toISOString(),
    };
    const list = this.getNotices();
    list.unshift(newNotice);
    setStored(KEYS.NOTICES, list);
    return newNotice;
  }

  // Privacy Settings
  static getPrivacySettings(): PrivacySettings {
    return getStored<PrivacySettings>(KEYS.PRIVACY, INITIAL_PRIVACY);
  }

  static updatePrivacySettings(updates: Partial<PrivacySettings>): PrivacySettings {
    const current = this.getPrivacySettings();
    const updated = { ...current, ...updates };
    setStored(KEYS.PRIVACY, updated);
    return updated;
  }
}
