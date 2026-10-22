import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { ExternalLink, Info, ShieldCheck, X } from 'lucide-react';

interface InFeedAdProps {
  index: number;
  attributedCreatorId?: string;
}

export const InFeedAd: React.FC<InFeedAdProps> = ({ index, attributedCreatorId }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (isDismissed) return null;

  // Track verified impression on creator's banner count
  const handleAdClick = () => {
    const mon = StorageService.getMonetization();
    StorageService.updateMonetization({
      bannerImpressions: mon.bannerImpressions + 1,
    });
  };

  return (
    <div className="w-full my-6 rounded-2xl bg-gradient-to-r from-[#0d162d] via-[#091124] to-[#0d162d] border border-cyan-500/25 p-4 md:p-5 shadow-lg relative overflow-hidden">
      {/* Glow decorative highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
            Sponsored
          </span>
          <span className="text-xs text-slate-400">
            HB Advertising Network · Placement #{index + 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            title="Ad Transparency & Monetization Policy"
            className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            title="Hide this ad"
            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Disclosure Popover */}
      {showInfo && (
        <div className="mb-4 p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 space-y-1.5 animate-fade-in">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            HB Creator Revenue Attribution Rule
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Banner ads appear after every 14 feed posts. 70% of finalized net ad revenue from eligible impressions is credited to the creator once 20,000 valid banner impressions are reached. HARDBOARD retains 30% for network delivery and infrastructure.
          </p>
        </div>
      )}

      {/* Ad Creative Body */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80"
          alt="Tech Cloud Solutions"
          className="w-full sm:w-36 h-24 object-cover rounded-xl border border-slate-700/60 shrink-0"
        />

        <div className="flex-1 space-y-1 text-center sm:text-left">
          <h4 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
            Next-Gen Cloud Workspaces for Distributed Engineers
          </h4>
          <p className="text-xs text-slate-400 line-clamp-2">
            Accelerate your full-stack deployment pipeline with automated preview environments and zero-latency database replication.
          </p>
          <div className="text-[11px] text-cyan-400 font-mono pt-1">
            cloud.hardboard.io/preview
          </div>
        </div>

        <button
          onClick={handleAdClick}
          className="w-full sm:w-auto shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>Learn More</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
