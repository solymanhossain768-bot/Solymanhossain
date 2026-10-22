import React, { useState } from 'react';
import { 
  CreatorMonetization, 
  WithdrawalRequest, 
  PayoutMethod 
} from '../types';
import { StorageService } from '../services/storage';
import { AwardArtwork } from './AwardsArtwork';
import { 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  Clock, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  History, 
  FileText, 
  Trophy, 
  X,
  CreditCard,
  Building,
  Smartphone,
  Calendar,
  RefreshCw
} from 'lucide-react';

export const CreatorDashboard: React.FC = () => {
  const [monetization, setMonetization] = useState<CreatorMonetization>(StorageService.getMonetization());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(StorageService.getWithdrawals());
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1200);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  const currentUser = StorageService.getCurrentUser();
  const awards = StorageService.getAwards();
  const notices = StorageService.getNotices().filter(n => n.targetAudience === 'all' || n.targetAudience === 'creators');

  // Video progress: 100 min
  const videoPercent = Math.min(100, Math.round((monetization.videoAdMinutes / monetization.videoAdMinutesTarget) * 100));
  // Banner progress: 20k impressions
  const bannerPercent = Math.min(100, Math.round((monetization.bannerImpressions / monetization.bannerImpressionsTarget) * 100));

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount < 1200) {
      setModalFeedback('Minimum withdrawal amount is ৳1,200.');
      return;
    }

    if (withdrawAmount > monetization.availableBalance) {
      setModalFeedback(`Cannot withdraw more than available balance (৳${monetization.availableBalance.toLocaleString()}).`);
      return;
    }

    if (!accountNumber.trim()) {
      setModalFeedback('Please enter your payment account or phone number.');
      return;
    }

    const res = StorageService.submitWithdrawal(withdrawAmount, payoutMethod, {
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim() || currentUser.name,
      bankName: payoutMethod === 'bank' ? bankName : undefined,
      branchName: payoutMethod === 'bank' ? branchName : undefined,
    });

    if (!res.success) {
      setModalFeedback(res.error || 'Failed to submit withdrawal request.');
      return;
    }

    setMonetization(StorageService.getMonetization());
    setWithdrawals(StorageService.getWithdrawals());
    setShowWithdrawModal(false);
    setModalFeedback(null);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleSyncData = async () => {
    setIsLoading(true);
    setSyncError(null);
    try {
      // Simulate backend financial reconciliation fetch
      await new Promise(r => setTimeout(r, 600));
      setMonetization(StorageService.getMonetization());
      setWithdrawals(StorageService.getWithdrawals());
    } catch (err: any) {
      setSyncError('Failed to synchronize authenticated financial balances. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-16 space-y-6 animate-fade-in">
      {/* Dashboard Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d162d] via-[#091124] to-[#070d1a] border border-cyan-500/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded">
                  HB Partner Creator
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Channel Handle: @{currentUser.username} · Program Status: Active & In Good Standing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncData}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Synchronize live balances with authenticated financial ledger"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Syncing...' : 'Sync Balances'}</span>
            </button>

            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Monthly Payout Target</span>
              <span className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1 justify-end">
                <Calendar className="w-3.5 h-3.5" />
                5th of each month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Error State with Retry Button */}
      {syncError && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{syncError}</span>
          </div>
          <button
            onClick={handleSyncData}
            className="px-3 py-1 rounded-lg bg-red-900 hover:bg-red-800 text-white font-bold cursor-pointer transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Monetization Eligibility Requirements Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Monetization Requirement (100 qualifying video-ad display minutes) */}
        <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Video Ad Monetization</h3>
                <p className="text-[11px] text-slate-400">100 min qualifying video-ad display activity</p>
              </div>
            </div>
            {monetization.isVideoEligible ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full">
                In Progress
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>{monetization.videoAdMinutes} / {monetization.videoAdMinutesTarget} Minutes</span>
              <span className="text-cyan-400 font-bold">{videoPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full" style={{ width: `${videoPercent}%` }} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Measures actual video-ad display duration across uploaded videos and Reels, excluding unmonetized normal watch time.
          </p>
        </div>

        {/* Banner Impressions Requirement (20,000 valid banner ad impressions) */}
        <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Banner Ad Monetization</h3>
                <p className="text-[11px] text-slate-400">20,000 valid creator banner ad impressions</p>
              </div>
            </div>
            {monetization.isBannerEligible ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Eligible
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full">
                In Progress
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300 font-mono">
              <span>{monetization.bannerImpressions.toLocaleString()} / {monetization.bannerImpressionsTarget.toLocaleString()} Impressions</span>
              <span className="text-sky-400 font-bold">{bannerPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full" style={{ width: `${bannerPercent}%` }} />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Attributed from sponsored feed banners appearing after every 14 feed posts on creator articles, notes, and photos.
          </p>
        </div>
      </div>

      {/* Revenue & Ledger Cards (Enforcing 70% Creator / 30% HB Split) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estimated Gross Revenue */}
        <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 space-y-2">
          <span className="text-[11px] text-slate-400 font-medium">Estimated Ad Revenue</span>
          <div className="text-2xl font-extrabold text-white font-mono">
            ৳{monetization.estimatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Pre-reconciliation estimates</span>
        </div>

        {/* Finalized Net Revenue */}
        <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 space-y-2">
          <span className="text-[11px] text-slate-400 font-medium">Finalized Net Ad Revenue</span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">
            ৳{monetization.finalizedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-400">Provider receipts reconciled</span>
        </div>

        {/* Creator 70% Share */}
        <div className="rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/40 p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-cyan-300 font-bold">Creator 70% Share</span>
            <span className="text-[10px] font-bold text-slate-950 bg-cyan-400 px-1.5 py-0.2 rounded font-mono">
              70% NET
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ৳{monetization.creatorShare70Pct.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">HB holds 30% platform share</span>
        </div>

        {/* Available Withdrawable Balance */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0b1730] to-[#081022] border border-cyan-400/60 p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-cyan-300 font-bold">Withdrawable Balance</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            ৳{monetization.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={monetization.availableBalance < 1200}
            className="w-full mt-2 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Request Withdrawal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Play Button Awards Widget & Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Play Button Milestones Widget */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                HB Play Button Award Status
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {currentUser.verifiedCreatorFollowers.toLocaleString()} Verified Followers
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {awards.map((award) => (
              <div key={award.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center text-center space-y-3">
                <div className="h-32 flex items-center justify-center">
                  <AwardArtwork tier={award.id} family={award.selectedFamily} size="sm" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{award.name}</h4>
                  <p className="text-[10px] text-slate-400">{award.requiredFollowers.toLocaleString()} Followers</p>
                </div>
                {award.status === 'claimed' ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    Claimed & Certified
                  </span>
                ) : currentUser.verifiedCreatorFollowers >= award.requiredFollowers ? (
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                    Eligible
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">
                    Locked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notices & Policy updates */}
        <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Creator Notices & Policy</span>
          </div>

          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-300">{n.title}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{n.content}</p>
                <div className="text-[9px] text-slate-500 pt-1 font-mono">{new Date(n.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
              Withdrawal & Payout History
            </h3>
          </div>
          <span className="text-xs text-slate-400">Minimum withdrawal threshold: ৳1,200</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-900/50">
              <tr>
                <th className="py-3 px-4">Request Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Account Number</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Transaction Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No withdrawal requests submitted yet. Minimum withdrawal threshold is ৳1,200.
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-slate-300">
                      {new Date(w.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white uppercase">
                      {w.method}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {w.accountDetails.accountNumber}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      ৳{w.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {w.status === 'paid' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Paid & Verified
                        </span>
                      )}
                      {w.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Pending Reserve
                        </span>
                      )}
                      {w.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {w.transactionRef || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Submission Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#0a0f1d] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  Submit Withdrawal Request
                </h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
              {modalFeedback && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalFeedback}</span>
                </div>
              )}

              {/* Withdrawable balance indicator */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Available to Withdraw:</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">
                  ৳{monetization.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Amount in BDT (Min. ৳1,200)
                </label>
                <input
                  type="number"
                  min={1200}
                  max={monetization.availableBalance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['bkash', 'nagad', 'rocket', 'bank'] as PayoutMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayoutMethod(m)}
                      className={`p-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                        payoutMethod === m
                          ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Details */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {payoutMethod === 'bank' ? 'Bank Account Number' : `${payoutMethod.toUpperCase()} Mobile Number`}
                </label>
                <input
                  type="text"
                  placeholder={payoutMethod === 'bank' ? '1234567890' : '01XXXXXXXXX'}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {payoutMethod === 'bank' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dutch-Bangla Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Branch</label>
                    <input
                      type="text"
                      placeholder="e.g. Dhanmondi"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 cursor-pointer shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
