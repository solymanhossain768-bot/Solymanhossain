import { SafetyStatus } from '../types';

export interface ModerationResult {
  status: SafetyStatus;
  reason?: string;
  details?: string;
  safetyScore: number; // 0 (completely safe) to 1 (prohibited)
  quarantined?: boolean;
}

// Prohibited content categories under HARDBOARD Community Safety Standards
const PROHIBITED_PATTERNS = [
  {
    regex: /\b(porn|pornography|xxx|nsfw|nude|nudity|sex\s*video|hardcore|erotic|escort\s*service|sex\s*chat)\b/i,
    reason: 'Prohibited explicit sexual content or pornography',
    score: 0.98,
    action: 'blocked' as const,
  },
  {
    regex: /\b(kill\s*yourself|kys|die\s*in\s*a\s*fire|i\s*will\s*kill\s*you|slit\s*your|behead)\b/i,
    reason: 'Prohibited violent threats, harassment, or self-harm incitement',
    score: 0.99,
    action: 'blocked' as const,
  },
  {
    regex: /\b(credit\s*card\s*cvv|ssn\s*number|passwords\s*dump|phishing\s*link|stolen\s*account)\b/i,
    reason: 'Prohibited credential harvesting or financial fraud solicitation',
    score: 0.95,
    action: 'blocked' as const,
  },
];

const SUSPICIOUS_PATTERNS = [
  {
    regex: /\b(onlyfans|sugar\s*daddy|meet\s*tonight\s*cash|whatsapp\s*call\s*private\s*show|free\s*crypto\s*airdrop)\b/i,
    reason: 'Commercial sexual solicitation or unregulated promotion requiring manual safety review',
    score: 0.65,
    action: 'review_required' as const,
  },
  {
    regex: /\b(hate|slur|scam|report\s*this|fake\s*account|impersonation)\b/i,
    reason: 'Content flagged for potential harassment or deceptive representation',
    score: 0.55,
    action: 'review_required' as const,
  },
];

/**
 * Screen text and media content against safety standards before publication
 */
export async function screenContent(
  text: string, 
  mediaUrl?: string, 
  mediaType?: 'image' | 'video'
): Promise<ModerationResult> {
  const normalized = (text || '').toLowerCase().trim();

  // 1. Prohibited Immediate Block Check
  for (const item of PROHIBITED_PATTERNS) {
    if (item.regex.test(normalized)) {
      return {
        status: 'blocked',
        reason: item.reason,
        details: 'Violates HARDBOARD Community Safety Policy regarding prohibited material. Content cannot be published.',
        safetyScore: item.score,
        quarantined: false,
      };
    }
  }

  // 2. Suspicious Content Requiring Moderator Review
  for (const item of SUSPICIOUS_PATTERNS) {
    if (item.regex.test(normalized)) {
      return {
        status: 'review_required',
        reason: item.reason,
        details: 'This submission requires review by HARDBOARD safety moderators before becoming publicly visible in community feeds.',
        safetyScore: item.score,
        quarantined: true,
      };
    }
  }

  // 3. Media file name/url checks
  if (mediaUrl) {
    const urlLower = mediaUrl.toLowerCase();
    for (const item of PROHIBITED_PATTERNS) {
      if (item.regex.test(urlLower)) {
        return {
          status: 'blocked',
          reason: item.reason + ' in uploaded media payload',
          details: 'Uploaded media asset contains prohibited labels or signatures.',
          safetyScore: 0.96,
          quarantined: true,
        };
      }
    }
  }

  // Content passes screening
  return {
    status: 'allowed',
    safetyScore: 0.05,
    quarantined: false,
  };
}
