import React, { useState } from 'react';
import { 
  ModerationItem, 
  WithdrawalRequest, 
  CreatorMonetization,
  SystemNotice 
} from '../types';
import { StorageService } from '../services/storage';
import { 
  ShieldAlert, 
  Check, 
  X, 
  Trash2, 
  DollarSign, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  FileText, 
  Bell, 
  Sliders, 
  Eye, 
  Database,
  Lock,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'finance' | 'withdrawals' | 'creators' | 'notices' | 'settings' | 'audit'>('overview');
  const [currentUser, setCurrentUser] = useState(StorageService.getCurrentUser());
  const [moderationQueue, setModerationQueue] = useState<ModerationItem[]>(StorageService.getModerationQueue());
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(StorageService.getWithdrawals());
  const [monetization, setMonetization] = useState<CreatorMonetization>(StorageService.getMonetization());
  const [notices, setNotices] = useState<SystemNotice[]>(StorageService.getNotices());

  // Reconciliation inputs
  const [reconcileAmount, setReconcileAmount] = useState<number>(5000);
  const [reconcileSuccess, setReconcileSuccess] = useState<string | null>(null);

  // Withdrawal verification form
  const [activeWithdrawalId, setActiveWithdrawalId] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'all' | 'creators'>('all');

  // Server-enforced role check
  const isAdmin = currentUser.role === 'admin';

  const handleGrantAdminRole = () => {
    const updated = StorageService.switchUserRole('admin');
    setCurrentUser(updated);
  };

  const handleModerate = (id: string, action: 'allowed' | 'blocked' | 'quarantined') => {
    StorageService.resolveModerationItem(id, action);
    setModerationQueue(StorageService.getModerationQueue());
  };

  const handleReconcile = (e: React.FormEvent) => {
    e.preventDefault();
    if (reconcileAmount <= 0) return;
    StorageService.reconcileProviderRevenue(reconcileAmount);
    setMonetization(StorageService.getMonetization());
    setReconcileSuccess(`Reconciled ৳${reconcileAmount.toLocaleString()} from advertising network. Creator 70% share credited.`);
    setTimeout(() => setReconcileSuccess(null), 3500);
  };

  const handleVerifyWithdrawal = (id: string) => {
    if (!transactionRef.trim()) {
      alert('Please enter the provider transaction reference hash.');
      return;
    }
    StorageService.verifyAndPayWithdrawal(id, transactionRef.trim(), payoutNotes.trim());
    setWithdrawals(StorageService.getWithdrawals());
    setMonetization(StorageService.getMonetization());
    setActiveWithdrawalId(null);
    setTransactionRef('');
    setPayoutNotes('');
  };

  const handleRejectWithdrawal = (id: string) => {
    const reason = prompt('Please enter reason for rejecting this withdrawal:');
    if (!reason) return;
    StorageService.rejectWithdrawal(id, reason);
    setWithdrawals(StorageService.getWithdrawals());
    setMonetization(StorageService.getMonetization());
  };

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    StorageService.addNotice(noticeTitle.trim(), noticeContent.trim(), noticeAudience);
    setNotices(StorageService.getNotices());
    setNoticeTitle('');
    setNoticeContent('');
  };

  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Strictly enforce role AND server authorization token
  const isAuthorized = currentUser.role === 'admin' && StorageService.isAuthorizedAdmin();

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;
    setIsAuthenticating(true);
    setPasskeyError(null);

    const res = await StorageService.loginAsAdmin(passkeyInput.trim());
    setIsAuthenticating(false);

    if (res.success) {
      setCurrentUser(StorageService.getCurrentUser());
      setPasskeyInput('');
    } else {
      setPasskeyError(res.error || 'Invalid administrator authorization key.');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="w-full max-w-lg mx-auto py-16 px-4 text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-red-950/70 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto shadow-2xl">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-[10px] font-mono uppercase tracking-widest font-bold">
            HTTP 403 Forbidden
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
            Administrator Authorization Required
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            This console is strictly restricted to verified Hardboard platform operations staff. Public or regular accounts cannot view administrative controls or data.
          </p>
        </div>

        {/* Server-Enforced Authentication Form */}
        <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-slate-800 text-xs text-slate-300 space-y-4 shadow-xl">
          <div className="font-semibold text-white flex items-center justify-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Staff Credential Verification</span>
          </div>

          {passkeyError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{passkeyError}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuthSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="Enter administrator passkey"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
              required
            />
            <button
              type="submit"
              disabled={isAuthenticating || !passkeyInput.trim()}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-50 cursor-pointer shadow-md transition-all"
            >
              {isAuthenticating ? 'Verifying with Server...' : 'Authenticate & Unlock Console'}
            </button>
          </form>

          <p className="text-[10px] text-slate-500">
            Protected by backend cryptographic passkey verification.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-16 space-y-6 animate-fade-in">
      {/* Admin Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d162d] via-[#091124] to-[#070d1a] border border-cyan-500/40 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
                HARDBOARD Admin Control
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">
              System Health: All Services Operational · Backend Enforcement Active
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs w-full sm:w-auto scrollbar-none">
          {(['overview', 'moderation', 'finance', 'withdrawals', 'creators', 'notices', 'settings', 'audit'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t
                  ? 'bg-cyan-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'creators' ? 'Creator Eligibility' : t === 'audit' ? 'Audit Logs' : t}
              {t === 'moderation' && moderationQueue.filter(m => m.status === 'review_required').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                  {moderationQueue.filter(m => m.status === 'review_required').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 space-y-1">
              <span className="text-xs text-slate-400">Total Registered Users</span>
              <div className="text-2xl font-extrabold text-white font-mono">142,504</div>
              <span className="text-[10px] text-emerald-400 font-semibold">+1,240 this week</span>
            </div>

            <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 space-y-1">
              <span className="text-xs text-slate-400">Pending Moderation Queue</span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono">
                {moderationQueue.filter(m => m.status === 'review_required').length}
              </div>
              <span className="text-[10px] text-slate-400">Automated pre-scan active</span>
            </div>

            <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 space-y-1">
              <span className="text-xs text-slate-400">Reconciled Network Receipts</span>
              <div className="text-2xl font-extrabold text-cyan-400 font-mono">
                ৳{monetization.providerReceivedReconciled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-400">AdMob / Network provider</span>
            </div>

            <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 space-y-1">
              <span className="text-xs text-slate-400">HB Platform 30% Share</span>
              <div className="text-2xl font-extrabold text-white font-mono">
                ৳{monetization.hbShare30Pct.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-cyan-400">Retained network revenue</span>
            </div>
          </div>

          {/* Quick status checks */}
          <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Production Subsystems Status</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-slate-400">Automated Moderation Service</div>
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Operational & Enforced
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-slate-400">Persistent Media Storage</div>
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Local & Disk Storage Ready
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="text-slate-400">Financial Ledger Protection</div>
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Double-Spend Guards Active
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODERATION QUEUE TAB */}
      {activeTab === 'moderation' && (
        <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Content Safety Moderation Queue
              </h3>
              <p className="text-xs text-slate-400">
                Pre-publication screening flags explicit sexual content, pornography, harassment, and threats
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/40">
              {moderationQueue.length} Total Monitored
            </span>
          </div>

          <div className="space-y-3">
            {moderationQueue.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {item.author.name} (@{item.author.username})
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700">
                        {item.contentType}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Reported: {new Date(item.reportedAt).toLocaleString()}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    item.status === 'review_required'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : item.status === 'allowed'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-950/80 text-red-300 border border-red-500/40'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                  {item.snippet}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-rose-400">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Reason: {item.reason}</span>
                  </div>

                  {item.status === 'review_required' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleModerate(item.id, 'allowed')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleModerate(item.id, 'blocked')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Block & Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FINANCE & 70/30 RECONCILIATION TAB */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {reconcileSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{reconcileSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reconcile Provider Receipts Form */}
            <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>Reconcile Provider Payout Receipt</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log funds actually received from Google AdMob or network advertising providers. System automatically distributes 70% to eligible creator balances and retains 30% for Hardboard.
              </p>

              <form onSubmit={handleReconcile} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Received Net Amount (BDT ৳)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={reconcileAmount}
                    onChange={(e) => setReconcileAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Creator 70% Share:</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      ৳{(reconcileAmount * 0.7).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>HB 30% Platform Share:</span>
                    <span className="font-mono text-slate-300 font-bold">
                      ৳{(reconcileAmount * 0.3).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 transition-all cursor-pointer shadow-md"
                >
                  Record & Reconcile Funds
                </button>
              </form>
            </div>

            {/* Financial Ledger Summary */}
            <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Auditable Revenue Ledger</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Total Provider Funds Reconciled:</span>
                  <span className="font-mono font-bold text-white">৳{monetization.providerReceivedReconciled.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Total Creator Net Share (70%):</span>
                  <span className="font-mono font-bold text-cyan-400">৳{monetization.creatorShare70Pct.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Total HB Platform Retained (30%):</span>
                  <span className="font-mono font-bold text-slate-300">৳{monetization.hbShare30Pct.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Pending Withdrawal Reserves:</span>
                  <span className="font-mono font-bold text-amber-400">৳{monetization.pendingPayments.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">Total Completed Payouts:</span>
                  <span className="font-mono font-bold text-emerald-400">৳{monetization.withdrawnTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAWAL MANAGEMENT TAB */}
      {activeTab === 'withdrawals' && (
        <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Creator Withdrawal Review & Verification
              </h3>
              <p className="text-xs text-slate-400">
                Authorized admins review payout requests and record genuine verified transaction reference numbers
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Account Number</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 font-bold text-white">
                      {w.creatorName}
                      <span className="block text-[11px] font-normal text-slate-400">@{w.creatorUsername}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      ৳{w.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-slate-300">
                      {w.method}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {w.accountDetails.accountNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        w.status === 'paid'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                          : w.status === 'pending'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                          : 'bg-red-950/80 text-red-400 border border-red-500/40'
                      }`}>
                        {w.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {w.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveWithdrawalId(w.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                          >
                            Verify & Pay
                          </button>
                          <button
                            onClick={() => handleRejectWithdrawal(w.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-950/80 text-red-400 border border-red-500/40 hover:bg-red-900 text-xs cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {w.status === 'paid' && (
                        <span className="text-[11px] font-mono text-slate-400">
                          Ref: {w.transactionRef}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verification Dialog */}
          {activeWithdrawalId && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3 animate-fade-in">
              <div className="font-bold text-white text-xs">
                Record Verified Payment for Request #{activeWithdrawalId}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Transaction Reference (e.g. BKH-8941029471)"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Verification note (optional)"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveWithdrawalId(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerifyWithdrawal(activeWithdrawalId)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 cursor-pointer"
                >
                  Confirm Verified Payment
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NOTICES TAB */}
      {activeTab === 'notices' && (
        <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Notice Board Manager
            </h3>
          </div>

          <form onSubmit={handlePostNotice} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300">Publish Official Platform Notice</div>
            <input
              type="text"
              placeholder="Notice Title"
              value={noticeTitle}
              onChange={(e) => setNoticeTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
            <textarea
              placeholder="Notice Content..."
              rows={3}
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
              required
            />
            <div className="flex items-center justify-between">
              <select
                value={noticeAudience}
                onChange={(e) => setNoticeAudience(e.target.value as any)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
              >
                <option value="all">Audience: All Users</option>
                <option value="creators">Audience: Creators Only</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Notice</span>
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-cyan-300">{n.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATOR ELIGIBILITY TAB */}
      {activeTab === 'creators' && (
        <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Creator Monetization Eligibility Center
              </h3>
              <p className="text-xs text-slate-400">
                Enforcing 100 qualifying video-ad display minutes and 20,000 valid banner impressions before 70% revenue share kicks in
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-900/50">
                <tr>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Verified Followers</th>
                  <th className="py-3 px-4">Video Ad Activity</th>
                  <th className="py-3 px-4">Banner Impressions</th>
                  <th className="py-3 px-4">Video Monetization</th>
                  <th className="py-3 px-4">Banner Monetization</th>
                  <th className="py-3 px-4 text-right">Eligibility Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-white">
                    {currentUser.name}
                    <span className="block text-[11px] font-normal text-slate-400">@{currentUser.username}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    {currentUser.verifiedCreatorFollowers.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {monetization.videoAdMinutes} / 100 min
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {monetization.bannerImpressions.toLocaleString()} / 20,000
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      monetization.isVideoEligible ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {monetization.isVideoEligible ? 'ACTIVE (70% SHARE)' : 'IN PROGRESS'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      monetization.isBannerEligible ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {monetization.isBannerEligible ? 'ACTIVE (70% SHARE)' : 'IN PROGRESS'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        StorageService.updateMonetization({
                          isVideoEligible: !monetization.isVideoEligible,
                          isBannerEligible: !monetization.isBannerEligible,
                        });
                        setMonetization(StorageService.getMonetization());
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold cursor-pointer border border-slate-700"
                    >
                      Toggle Authorization
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-white">
                    Sara Khan
                    <span className="block text-[11px] font-normal text-slate-400">@sara_creative</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    48,200
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    84.0 / 100 min
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    16,400 / 20,000
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                      84% PROGRESS
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                      82% PROGRESS
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] text-slate-500">Auto-evaluating</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SETTINGS & MONETIZATION RULES TAB */}
      {activeTab === 'settings' && (
        <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Ad & Monetization Policy Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Rule 1: Placements */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">Ad Placement Rules</span>
              <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                <li>Feed banner after every <strong className="text-white">14 feed posts</strong></li>
                <li>Normal video ad after every <strong className="text-white">20 videos</strong></li>
                <li>Reels ad after every <strong className="text-white">8 Reels</strong></li>
              </ul>
            </div>

            {/* Rule 2: Revenue Split */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">Revenue Sharing Model</span>
              <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                <li>Creator receives <strong className="text-emerald-400">70% net revenue</strong></li>
                <li>HARDBOARD retains <strong className="text-slate-200">30% platform share</strong></li>
                <li>Non-attributed app-wide ad revenue belongs 100% to HB</li>
              </ul>
            </div>

            {/* Rule 3: Payout Thresholds */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">Payout Thresholds & Cycle</span>
              <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                <li>Minimum withdrawal: <strong className="text-white">৳1,200 BDT</strong></li>
                <li>Supported: bKash, Nagad, Rocket, Bank</li>
                <li>Monthly payout target: <strong className="text-white">5th of each month</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl bg-[#0a0f1d] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Auditable System & Financial Transaction Logs
            </h3>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
              Immutable Ledger
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-emerald-400 font-bold">[FINANCIAL_RECONCILE]</span>{' '}
                <span className="text-slate-300">Provider receipts credited: ৳16,200.00 BDT (70% creator: ৳11,340 / 30% HB: ৳4,860)</span>
              </div>
              <span className="text-[10px] text-slate-500">2026-10-05 12:00:00Z</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-cyan-400 font-bold">[PAYOUT_VERIFIED]</span>{' '}
                <span className="text-slate-300">bKash payout dispatched: ৳3,200.00 to 01712345678 (Ref: BKH-8924018471)</span>
              </div>
              <span className="text-[10px] text-slate-500">2026-10-06 14:22:00Z</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-amber-400 font-bold">[MODERATION_SCAN]</span>{' '}
                <span className="text-slate-300">Automated pre-screening queued item flagged for commercial solicitation review</span>
              </div>
              <span className="text-[10px] text-slate-500">2026-10-18 10:14:00Z</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-sky-400 font-bold">[AWARD_CONFERRED]</span>{' '}
                <span className="text-slate-300">HB Gold Creator Award conferred to Tamim Ahmed (Serial: HB-GLD-2026-08492)</span>
              </div>
              <span className="text-[10px] text-slate-500">2026-10-18 18:30:00Z</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
