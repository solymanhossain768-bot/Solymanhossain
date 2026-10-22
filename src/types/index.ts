export type UserRole = 'user' | 'creator' | 'admin';

export type ReactionType = 'like' | 'love' | 'care' | 'haha' | 'wow' | 'sad' | 'angry';

export interface LocationInfo {
  city: string;
  country: string;
  visibility: 'public' | 'followers' | 'private';
}

export interface EducationInfo {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear?: string;
}

export interface WorkInfo {
  company: string;
  role: string;
  current: boolean;
}

export interface SocialLinks {
  website?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  phone?: string;
  avatarUrl: string;
  coverUrl: string;
  role: UserRole;
  isVerified: boolean;
  bio: string;
  about: string;
  location: LocationInfo;
  education: EducationInfo;
  work: WorkInfo;
  interests: string[];
  skills: string[];
  socialLinks: SocialLinks;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  verifiedCreatorFollowers: number;
  stats: {
    postsCount: number;
    photosCount: number;
    videosCount: number;
    reelsCount: number;
    notesCount: number;
  };
}

export type PostType = 'text' | 'photo' | 'video' | 'reel' | 'note';
export type AudienceType = 'public' | 'followers' | 'private';
export type SafetyStatus = 'allowed' | 'review_required' | 'blocked';

export interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    isVerified: boolean;
    role: UserRole;
  };
  type: PostType;
  content: string;
  backgroundGradient?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  thumbnailUrl?: string;
  createdAt: string;
  audience: AudienceType;
  likesCount: number;
  reactions: Record<ReactionType, number>;
  userReaction?: ReactionType;
  commentsCount: number;
  sharesCount: number;
  notesCount: number;
  isEdited?: boolean;
  safetyStatus: SafetyStatus;
  safetyReason?: string;
  // Note specific fields
  originalPostId?: string;
  originalPost?: {
    id: string;
    authorName: string;
    authorUsername: string;
    authorAvatar: string;
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    createdAt: string;
  };
  noteThoughts?: string;
  tags?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  userLiked?: boolean;
  replies?: Comment[];
}

export interface Story {
  id: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    username: string;
  };
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  expiresAt: string;
  isViewed?: boolean;
}

export interface ReelItem {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  videoUrl: string;
  caption: string;
  audioTrack: string;
  likesCount: number;
  userLiked?: boolean;
  commentsCount: number;
  sharesCount: number;
  isFollowing?: boolean;
  createdAt: string;
}

export type AwardFamily = 'crystal_minimal' | 'sculpted_3d' | 'fluid_signature';
export type AwardTierId = 'gold_100k' | 'diamond_1m' | 'special_10m';

export interface AwardMilestone {
  id: AwardTierId;
  name: string;
  tierName: string;
  requiredFollowers: number;
  description: string;
  status: 'locked' | 'eligible' | 'claimed';
  claimedAt?: string;
  serialNumber?: string;
  selectedFamily: AwardFamily;
}

export interface CreatorMonetization {
  // Video monetization requirement: 100 minutes of qualifying video-ad display activity
  videoAdMinutes: number;
  videoAdMinutesTarget: number; // 100
  isVideoEligible: boolean;

  // Banner monetization requirement: 20,000 valid banner ad impressions attributed to eligible creator content
  bannerImpressions: number;
  bannerImpressionsTarget: number; // 20000
  isBannerEligible: boolean;

  // Revenue tracking in BDT (৳)
  estimatedRevenue: number;
  finalizedRevenue: number;
  providerReceivedReconciled: number;
  
  // 70% share of eligible creator-content finalized net ad revenue
  creatorShare70Pct: number;
  // HB 30% share
  hbShare30Pct: number;

  pendingPayments: number;
  availableBalance: number;
  withdrawnTotal: number;

  lastReconciliationDate?: string;
}

export type PayoutMethod = 'bkash' | 'nagad' | 'rocket' | 'bank';

export interface WithdrawalRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  amount: number; // Minimum ৳1,200
  method: PayoutMethod;
  accountDetails: {
    accountNumber: string;
    accountName: string;
    bankName?: string;
    branchName?: string;
    routingNumber?: string;
  };
  status: 'pending' | 'in_review' | 'paid' | 'rejected';
  transactionRef?: string;
  createdAt: string;
  processedAt?: string;
  adminNotes?: string;
}

export interface FinancialLedgerEntry {
  id: string;
  type: 'ad_earning' | 'revenue_reconciliation' | 'withdrawal_reserve' | 'withdrawal_paid' | 'withdrawal_rejected';
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  timestamp: string;
}

export interface ModerationItem {
  id: string;
  contentId: string;
  contentType: 'text' | 'post' | 'photo' | 'video' | 'reel' | 'comment' | 'note';
  author: {
    id: string;
    name: string;
    username: string;
  };
  snippet: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  reason: string;
  severity: 'low' | 'medium' | 'high';
  safetyScore: number; // 0 to 1 (1 = dangerous)
  status: 'review_required' | 'allowed' | 'blocked' | 'quarantined';
  reportedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  actionTaken?: string;
}

export interface SystemNotice {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'creators' | 'admins';
  createdAt: string;
  isUrgent?: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'followers' | 'private';
  locationVisibility: 'public' | 'followers' | 'hidden';
  messagePermissions: 'everyone' | 'followers_only' | 'nobody';
  personalizedAdsConsent: boolean;
  aiSafetyScanningConsent: boolean;
}
