import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { PrivacySettings } from '../types';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Users, 
  Database,
  Building2,
  Mail
} from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const [privacy, setPrivacy] = useState<PrivacySettings>(StorageService.getPrivacySettings());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleUpdate = (updates: Partial<PrivacySettings>) => {
    const updated = StorageService.updatePrivacySettings(updates);
    setPrivacy(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleDeleteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText.toUpperCase() !== 'DELETE') return;
    setDeleteSuccess(true);
    setTimeout(() => {
      setShowDeleteModal(false);
      setDeleteConfirmText('');
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-16 space-y-8 animate-fade-in text-slate-200">
      {/* Policy Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d162d] via-[#091124] to-[#070d1a] border border-cyan-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            HARDBOARD Privacy Policy & Data Controls
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Last revised: October 2026. This policy governs how HARDBOARD (HB Apps) handles account details, uploaded media, AI safety screening, advertising measurement, and financial ledger data.
        </p>
      </div>

      {/* Interactive Privacy Settings & Visibility Controls */}
      <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Your Personal Privacy Settings</span>
            </h2>
            <p className="text-xs text-slate-400">Configure visibility and automated feature consent</p>
          </div>
          {settingsSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Profile Visibility */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <label className="font-bold text-white block">Profile Discoverability</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handleUpdate({ profileVisibility: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
            >
              <option value="public">Public (All platform members)</option>
              <option value="followers">Followers Only</option>
              <option value="private">Private (Restricted)</option>
            </select>
          </div>

          {/* Location Visibility */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <label className="font-bold text-white block">Location Sharing (City/Country)</label>
            <select
              value={privacy.locationVisibility}
              onChange={(e) => handleUpdate({ locationVisibility: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
            >
              <option value="public">Public on Profile</option>
              <option value="followers">Followers Only</option>
              <option value="hidden">Hidden from Profile</option>
            </select>
          </div>

          {/* Message permissions */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <label className="font-bold text-white block">Direct Message Permissions</label>
            <select
              value={privacy.messagePermissions}
              onChange={(e) => handleUpdate({ messagePermissions: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
            >
              <option value="followers_only">Followers Only</option>
              <option value="everyone">Everyone</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {/* AI Safety Screening Consent */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="font-bold text-white block">Automated Safety Screening</span>
              <p className="text-[11px] text-slate-400">Pre-publication checks for prohibited explicit content</p>
            </div>
            <input
              type="checkbox"
              checked={privacy.aiSafetyScanningConsent}
              onChange={(e) => handleUpdate({ aiSafetyScanningConsent: e.target.checked })}
              className="w-4 h-4 text-cyan-400 rounded accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Disclosures Sections */}
      <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 sm:p-8 space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            1. Information Collected and How It Is Used
          </h2>
          <p className="text-slate-400">
            We collect information you choose to provide upon account creation and interaction: your display name, username, bio, educational background, professional occupation, skills, interests, and profile pictures. We do not automatically query or track precise device GPS coordinates without affirmative permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            2. Posts, Uploaded Media, and Notes
          </h2>
          <p className="text-slate-400">
            Content you publish—including text posts, photos from your device gallery, short videos, Stories, Reels, and shared Notes—is stored on our secured persistent servers. When you utilize "Share as Note", a reference to the original post is recorded alongside your thoughts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            3. Automated Safety Moderation & Screening
          </h2>
          <p className="text-slate-400">
            To ensure a safe environment, HARDBOARD runs backend-enforced content moderation before publications or direct deliveries become publicly available. Images and text are evaluated for prohibited explicit sexual content, pornography, commercial exploitation, violence, and threats. We disclose that messages and uploads pass through server-side safety checks and are not end-to-end encrypted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            4. Advertising Providers and Measurement
          </h2>
          <p className="text-slate-400">
            We partner with third-party advertising networks (such as Google AdMob) to serve sponsored banners (after every 14 feed posts) and video ads. These partners may collect anonymized device identifiers and aggregated impression metrics for billing and invalid-traffic prevention.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            5. Monetization and Payout Processing
          </h2>
          <p className="text-slate-400">
            Creators qualifying for monetization (100 qualifying video-ad display minutes and 20,000 valid banner impressions) receive a 70% share of finalized net ad revenue, with HARDBOARD retaining 30%. Withdrawal requests (minimum ৳1,200 via bKash, Nagad, Rocket, or Bank Transfer) are audited and preserved in immutable financial ledgers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            6. Children's Privacy (13+ Age Policy)
          </h2>
          <p className="text-slate-400">
            HARDBOARD is not directed to children under 13 years of age. We do not knowingly collect personal data from minors below the age of 13. Accounts found to be held by individuals under 13 will be promptly terminated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            7. Verified Contact & Organization Information
          </h2>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Platform Operator: [Configurable Operator Entity · HARDBOARD Project]</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Privacy Inquiries: privacy@hardboard.example.com [Configurable Placeholder]</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Note: As per engineering standards, verifiable business registrations, physical addresses, and compliance certifications will be updated upon production domain provisioning.
            </p>
          </div>
        </section>
      </div>

      {/* Account Deletion Workflow */}
      <div className="rounded-3xl bg-red-950/20 border border-red-500/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-red-400" />
          <h2 className="text-base font-bold text-white font-['Space_Grotesk']">
            Account Deletion & Data Purge
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          You may request permanent deletion of your HARDBOARD account, personal profile data, posts, and media attachments. Legally required financial payout audit records will be retained in accordance with financial regulations.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-red-300 bg-red-950/80 border border-red-500/50 hover:bg-red-900 transition-colors cursor-pointer"
        >
          Request Account Deletion
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0a0f1d] border border-red-500/40 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Permanent Account Deletion</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently erase your posts, stories, photos, and followers from the live feed. Type <strong className="text-white">DELETE</strong> to confirm your request.
            </p>

            <form onSubmit={handleDeleteRequest} className="space-y-3">
              <input
                type="text"
                placeholder="Type DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
              />

              {deleteSuccess && (
                <div className="text-xs text-emerald-400 font-bold">
                  Deletion request submitted to data compliance team.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteConfirmText.toUpperCase() !== 'DELETE'}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-40 cursor-pointer"
                >
                  Confirm Deletion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
