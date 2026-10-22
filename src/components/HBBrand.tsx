import React from 'react';

interface HBIconProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export const HBIcon: React.FC<HBIconProps> = ({ size = 'md', className = '', glow = false }) => {
  const pixelSize = typeof size === 'number' 
    ? size 
    : size === 'sm' ? 28 
    : size === 'md' ? 40 
    : size === 'lg' ? 56 
    : 80;

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {glow && (
        <div 
          className="absolute inset-0 rounded-2xl bg-cyan-400/25 blur-xl -z-10 animate-pulse pointer-events-none"
        />
      )}
      <svg 
        viewBox="0 0 100 100" 
        width={pixelSize} 
        height={pixelSize} 
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(6,182,212,0.3)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base plate gradient */}
          <linearGradient id="hbBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#0b1120" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Border rim gradient */}
          <linearGradient id="hbRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
          </linearGradient>

          {/* Metallic letter surface */}
          <linearGradient id="hbSilverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e0f2fe" />
            <stop offset="70%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>

          {/* Cyan electric play gradient */}
          <linearGradient id="hbPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <filter id="hbGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer app icon shell with metallic chamfer */}
        <rect 
          x="4" 
          y="4" 
          width="92" 
          height="92" 
          rx="22" 
          fill="url(#hbBaseGrad)" 
          stroke="url(#hbRimGrad)" 
          strokeWidth="2.5" 
        />

        {/* Inner subtle glow line */}
        <rect 
          x="7" 
          y="7" 
          width="86" 
          height="86" 
          rx="19" 
          stroke="#38bdf8" 
          strokeWidth="0.75" 
          strokeOpacity="0.3" 
        />

        {/* Geometric Monogram: 'H' & 'B' fused with Integrated Central Play Triangle */}
        {/* Left vertical pillar of 'H' */}
        <path 
          d="M22 26C22 24.8954 22.8954 24 24 24H32C33.1046 24 34 24.8954 34 26V74C34 75.1046 33.1046 76 32 76H24C22.8954 76 22 75.1046 22 74V26Z" 
          fill="url(#hbSilverGrad)" 
        />

        {/* Horizontal bridge connecting H and B */}
        <path 
          d="M34 45H44V55H34V45Z" 
          fill="url(#hbSilverGrad)" 
        />

        {/* Central stem shared by H and B */}
        <path 
          d="M44 26C44 24.8954 44.8954 24 46 24H52C53.1046 24 54 24.8954 54 26V74C54 75.1046 53.1046 76 52 76H46C44.8954 76 44 75.1046 44 74V26Z" 
          fill="url(#hbSilverGrad)" 
        />

        {/* B upper loop with metallic bevel */}
        <path 
          d="M54 24H67C73.0751 24 78 28.9249 78 35C78 40.5228 73.5228 45 68 45H54V24ZM62 38H66.5C68.433 38 70 36.433 70 34.5C70 32.567 68.433 31 66.5 31H62V38Z" 
          fill="url(#hbSilverGrad)" 
        />

        {/* B lower loop */}
        <path 
          d="M54 45H69C75.6274 45 81 50.3726 81 57C81 63.6274 75.6274 69 69 69H54V45ZM62 62H68C69.6569 62 71 60.6569 71 59C71 57.3431 69.6569 56 68 56H62V62Z" 
          fill="url(#hbSilverGrad)" 
        />

        {/* Integrated luminous Play Triangle inside the geometric bridge */}
        <polygon 
          points="36,36 50,49 36,62" 
          fill="url(#hbPlayGrad)" 
          filter="url(#hbGlowEffect)"
        />

        {/* Highlight glint top-right */}
        <circle cx="78" cy="22" r="2.5" fill="#ffffff" opacity="0.9" />
        <path d="M78 17V27M73 22H83" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      </svg>
    </div>
  );
};

interface HBLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const HBLogo: React.FC<HBLogoProps> = ({ 
  size = 'md', 
  showTagline = true, 
  className = '' 
}) => {
  const iconSize = size === 'sm' ? 32 : size === 'md' ? 42 : 54;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <HBIcon size={iconSize} glow={true} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200 font-['Space_Grotesk'] text-lg md:text-xl">
            HARDBOARD
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/40 bg-cyan-950/60 px-1.5 py-0.5 rounded">
            HB Apps
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-cyan-200/70 font-medium tracking-tight">
            Your Community. Your Voice.
          </span>
        )}
      </div>
    </div>
  );
};

export const HBSplash: React.FC<{ onDismiss?: () => void }> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b14] text-white overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-blue-700/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10 p-6 text-center animate-fade-in max-w-sm">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-cyan-500/20 blur-2xl animate-pulse" />
          <HBIcon size={96} glow={true} />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Space_Grotesk'] mb-1">
          HARDBOARD
        </h1>
        <div className="text-sm font-semibold tracking-widest uppercase text-cyan-400 mb-2">
          HB APPS
        </div>
        <p className="text-sm text-slate-400 mb-8 font-medium">
          Your Community. Your Voice.
        </p>

        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mb-6">
          <div className="w-full h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 rounded-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors py-2 px-4 rounded-lg bg-slate-900/60 border border-slate-800"
          >
            Enter Platform
          </button>
        )}
      </div>
    </div>
  );
};
