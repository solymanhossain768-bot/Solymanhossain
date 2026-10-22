import React, { useState } from 'react';
import { AwardMilestone, AwardFamily } from '../types';
import { StorageService } from '../services/storage';
import { AwardArtwork } from './AwardsArtwork';
import { 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Users, 
  ArrowRight, 
  Download, 
  SlidersHorizontal,
  Check,
  AlertCircle
} from 'lucide-react';

export const AwardsPage: React.FC = () => {
  const [awards, setAwards] = useState<AwardMilestone[]>(StorageService.getAwards());
  const [selectedFamily, setSelectedFamily] = useState<AwardFamily>('crystal_minimal');
  const [claimFeedback, setClaimFeedback] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  const currentUser = StorageService.getCurrentUser();
  const verifiedFollowers = currentUser.verifiedCreatorFollowers;

  const handleClaim = (awardId: string) => {
    const res = StorageService.claimAward(awardId);
    if (res.success && res.award) {
      setAwards(StorageService.getAwards());
      setClaimFeedback({
        id: awardId,
        success: true,
        msg: `Congratulations! ${res.award.name} officially claimed. Certified Serial: ${res.award.serialNumber}`,
      });
    } else {
      setClaimFeedback({
        id: awardId,
        success: false,
        msg: res.error || 'Failed to claim award.',
      });
    }
  };

  const handleFamilyChange = (tierId: string, family: AwardFamily) => {
    StorageService.updateAwardFamily(tierId, family);
    setAwards(StorageService.getAwards());
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-16 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0b1329] via-[#091024] to-[#070c1a] border border-cyan-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                Official Recognition Program
              </span>
              <span className="text-xs text-slate-400">HB Apps Creator Milestones</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              HARDBOARD Play Button Awards
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Honoring cultural impact, community dedication, and digital excellence. Conferred exclusively to verified HARDBOARD creators reaching certified milestone audiences.
            </p>

            {/* Current Creator Status Pill */}
            <div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Your Verified Follower Count</div>
                <div className="text-base font-extrabold text-white font-mono flex items-center gap-1.5">
                  <span>{verifiedFollowers.toLocaleString()}</span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Global Design Family Switcher */}
          <div className="w-full md:w-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Award Design Family</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'crystal_minimal' as const, label: 'Crystal Minimal', desc: 'Faceted icy diamond & translucent prism' },
                { id: 'sculpted_3d' as const, label: 'Premium Sculpted 3D', desc: 'Metallic monument & brushed titanium' },
                { id: 'fluid_signature' as const, label: 'Fluid Signature', desc: 'Flowing glass wave contours & neon glyph' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFamily(f.id)}
                  className={`text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                    selectedFamily === f.id
                      ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/60 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="font-bold">{f.label}</div>
                  <div className="text-[10px] text-slate-400">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Claim Feedback Banner */}
      {claimFeedback && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between animate-fade-in ${
          claimFeedback.success
            ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
            : 'bg-red-950/80 border-red-500/50 text-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {claimFeedback.success ? (
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="font-medium">{claimFeedback.msg}</span>
          </div>
          <button onClick={() => setClaimFeedback(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* The 3 Primary Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {awards.map((award) => {
          const isEligible = verifiedFollowers >= award.requiredFollowers;
          const isClaimed = award.status === 'claimed';
          const progressPercent = Math.min(100, Math.round((verifiedFollowers / award.requiredFollowers) * 100));

          return (
            <div
              key={award.id}
              className={`rounded-3xl border flex flex-col justify-between overflow-hidden transition-all shadow-xl ${
                isClaimed
                  ? 'bg-gradient-to-b from-[#0b162c] to-[#070d1a] border-cyan-500/50 ring-1 ring-cyan-500/30'
                  : isEligible
                  ? 'bg-gradient-to-b from-[#0e1b36] to-[#080f21] border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                  : 'bg-[#090e1c] border-slate-800/80 opacity-90'
              }`}
            >
              {/* Card Top Header */}
              <div className="p-5 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {award.tierName}
                  </span>

                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Claimed & Certified
                    </span>
                  ) : isEligible ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/60 px-2 py-0.5 rounded-full animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      Eligible to Claim
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      Locked
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  {award.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {award.description}
                </p>
              </div>

              {/* Award Visual Artwork Component (Real SVG Artwork) */}
              <div className="relative py-4 px-6 flex items-center justify-center bg-black/20 my-2 min-h-[300px]">
                <AwardArtwork
                  tier={award.id}
                  family={selectedFamily}
                  size="md"
                  creatorName={currentUser.name.toUpperCase()}
                />
              </div>

              {/* Card Bottom Progress & Claim CTA */}
              <div className="p-5 pt-2 space-y-4 bg-slate-950/40 border-t border-slate-800/60">
                {/* Milestone Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Milestone Target</span>
                    <span className="font-mono font-bold text-white">
                      {award.requiredFollowers.toLocaleString()} Followers
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isEligible
                          ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400'
                          : 'bg-gradient-to-r from-slate-700 to-cyan-800'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{progressPercent}% Complete</span>
                    {!isEligible && (
                      <span>{(award.requiredFollowers - verifiedFollowers).toLocaleString()} needed</span>
                    )}
                  </div>
                </div>

                {/* Claim CTA or Serial Badge */}
                {isClaimed ? (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1 text-center">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      Certificate Serial Number
                    </div>
                    <div className="text-xs font-mono font-bold text-white tracking-widest">
                      {award.serialNumber || 'HB-GLD-2026-08492'}
                    </div>
                  </div>
                ) : isEligible ? (
                  <button
                    onClick={() => handleClaim(award.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Claim Official {award.name}</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-500 bg-slate-900 border border-slate-800 cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked at {award.requiredFollowers.toLocaleString()} Followers</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
