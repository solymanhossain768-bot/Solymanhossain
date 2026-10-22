import React from 'react';
import { AwardFamily, AwardTierId } from '../types';

interface AwardArtworkProps {
  tier: AwardTierId;
  family: AwardFamily;
  size?: number | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  creatorName?: string;
}

export const AwardArtwork: React.FC<AwardArtworkProps> = ({
  tier,
  family,
  size = 'md',
  className = '',
  creatorName = 'VERIFIED CREATOR',
}) => {
  const pixelWidth = typeof size === 'number'
    ? size
    : size === 'sm' ? 140
    : size === 'md' ? 220
    : size === 'lg' ? 320
    : 420;

  const height = pixelWidth * 1.25;

  // Tier color settings
  const isGold = tier === 'gold_100k';
  const isDiamond = tier === 'diamond_1m';
  const isSpecial = tier === 'special_10m';

  const tierTitle = isGold 
    ? 'HB GOLD CREATOR AWARD' 
    : isDiamond 
    ? 'HB DIAMOND CREATOR AWARD' 
    : 'HB SPECIAL CREATOR AWARD';

  const tierSub = isGold 
    ? 'FOR SURPASSING 100,000 VERIFIED FOLLOWERS' 
    : isDiamond 
    ? 'FOR SURPASSING 1,000,000 VERIFIED FOLLOWERS' 
    : 'FOR SURPASSING 10,000,000 VERIFIED FOLLOWERS';

  // 1. CRYSTAL MINIMAL: Crystalline faceted prism obelisk
  if (family === 'crystal_minimal') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center select-none ${className}`}
        style={{ width: pixelWidth, height }}
      >
        <svg 
          viewBox="0 0 300 375" 
          width={pixelWidth} 
          height={height} 
          className="w-full h-full drop-shadow-[0_12px_32px_rgba(6,182,212,0.35)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`cmBase_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id={`cmCrystal_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isGold ? '#fffbeb' : isDiamond ? '#ffffff' : '#f0fdfa'} stopOpacity="0.95" />
              <stop offset="35%" stopColor={isGold ? '#fef08a' : isDiamond ? '#e0f2fe' : '#99f6e4'} stopOpacity="0.85" />
              <stop offset="70%" stopColor={isGold ? '#eab308' : isDiamond ? '#38bdf8' : '#0d9488'} stopOpacity="0.75" />
              <stop offset="100%" stopColor={isGold ? '#78350f' : isDiamond ? '#0369a1' : '#042f2e'} stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id={`cmFacetA_${tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor={isGold ? '#fef08a' : isDiamond ? '#bae6fd' : '#5eead4'} stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id={`cmFacetB_${tier}`} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isGold ? '#ca8a04' : isDiamond ? '#0284c7' : '#0f766e'} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0b1120" stopOpacity="0.9" />
            </linearGradient>

            <filter id={`cmGlow_${tier}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Pedestal Shadow */}
          <ellipse cx="150" cy="350" rx="120" ry="16" fill="#000000" fillOpacity="0.6" />

          {/* Heavy Crystal Plinth Base */}
          <polygon points="50,335 250,335 235,355 65,355" fill="url(#cmBase_${tier})" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.4" />
          <polygon points="50,335 65,355 65,362 45,342" fill="#0a0f1d" />
          <rect x="65" y="352" width="170" height="12" rx="2" fill="#0b1329" stroke="#0ea5e9" strokeWidth="0.8" strokeOpacity="0.5" />

          {/* Inscription on Base */}
          <text x="150" y="360" textAnchor="middle" fill={isGold ? '#fef08a' : isDiamond ? '#e0f2fe' : '#5eead4'} fontSize="6" fontFamily="Space Grotesk, sans-serif" fontWeight="700" letterSpacing="0.8">
            HARDBOARD CREATOR MILESTONE
          </text>

          {/* Prismatic Crystal Body: Faceted Hexagonal Obelisk */}
          {/* Back refraction pane */}
          <polygon points="150,30 220,105 205,325 95,325 80,105" fill={`url(#cmFacetB_${tier})`} />

          {/* Left crystal facet */}
          <polygon points="150,30 80,105 95,325 150,315" fill={`url(#cmFacetA_${tier})`} stroke="#ffffff" strokeWidth="0.7" strokeOpacity="0.5" />

          {/* Right crystal facet */}
          <polygon points="150,30 220,105 205,325 150,315" fill={`url(#cmCrystal_${tier})`} stroke="#ffffff" strokeWidth="0.7" strokeOpacity="0.7" />

          {/* Center sharp crest line */}
          <line x1="150" y1="30" x2="150" y2="315" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />

          {/* Top diamond facet cap */}
          <polygon points="150,30 190,65 150,75 110,65" fill="#ffffff" fillOpacity="0.85" />

          {/* Suspended Core Chamber: Prismatic HB Monogram + Play Button */}
          <circle cx="150" cy="180" r="46" fill="#070d1d" fillOpacity="0.75" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.7" filter={`url(#cmGlow_${tier})`} />
          <circle cx="150" cy="180" r="42" fill="none" stroke={isGold ? '#facc15' : isDiamond ? '#67e8f9' : '#2dd4bf'} strokeWidth="0.8" strokeDasharray="3 3" />

          {/* HB Monogram */}
          <g transform="translate(118, 148) scale(0.65)">
            {/* H Left stem */}
            <rect x="10" y="10" width="14" height="78" rx="3" fill="#ffffff" />
            {/* Bridge */}
            <rect x="24" y="42" width="22" height="14" fill="#ffffff" />
            {/* Center stem */}
            <rect x="44" y="10" width="14" height="78" rx="3" fill="#ffffff" />
            {/* B loops */}
            <path d="M58 10H78C88 10 96 18 96 28C96 38 88 46 78 46H58V10ZM72 32H78C82 32 84 30 84 28C84 26 82 24 78 24H72V32Z" fill="#ffffff" />
            <path d="M58 44H80C91 44 99 53 99 64C99 75 91 84 80 84H58V44ZM72 70H80C85 70 87 67 87 64C87 61 85 58 80 58H72V70Z" fill="#ffffff" />
            {/* Glowing play triangle */}
            <polygon points="28,26 48,49 28,72" fill={isGold ? '#eab308' : isDiamond ? '#06b6d4' : '#14b8a6'} />
          </g>

          {/* Laser-engraved plaque details */}
          <text x="150" y="246" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="Space Grotesk, sans-serif" fontWeight="800" letterSpacing="1">
            {tierTitle}
          </text>
          <text x="150" y="258" textAnchor="middle" fill={isGold ? '#fef08a' : isDiamond ? '#7dd3fc' : '#5eead4'} fontSize="6" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
            PRESENTED TO
          </text>
          <text x="150" y="270" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800">
            {creatorName}
          </text>
          <text x="150" y="280" textAnchor="middle" fill="#94a3b8" fontSize="5" fontFamily="Plus Jakarta Sans, sans-serif">
            {tierSub}
          </text>

          {/* Prismatic glints */}
          <polygon points="150,22 153,30 161,30 154,35 157,43 150,38 143,43 146,35 139,30 147,30" fill="#ffffff" />
          <polygon points="80,105 82,109 87,109 83,112 85,117 80,114 75,117 77,112 73,109 78,109" fill="#ffffff" opacity="0.8" />
        </svg>
      </div>
    );
  }

  // 2. PREMIUM SCULPTED 3D: Sculpted metallic monument with beveled chamfers
  if (family === 'sculpted_3d') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center select-none ${className}`}
        style={{ width: pixelWidth, height }}
      >
        <svg 
          viewBox="0 0 300 375" 
          width={pixelWidth} 
          height={height} 
          className="w-full h-full drop-shadow-[0_16px_36px_rgba(30,58,138,0.5)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`scBase_${tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id={`scMetalRim_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor={isGold ? '#fef08a' : isDiamond ? '#e0f2fe' : '#ccfbf1'} />
              <stop offset="50%" stopColor={isGold ? '#d97706' : isDiamond ? '#38bdf8' : '#0d9488'} />
              <stop offset="75%" stopColor={isGold ? '#fef9c3' : isDiamond ? '#f8fafc' : '#f0fdfa'} />
              <stop offset="100%" stopColor={isGold ? '#78350f' : isDiamond ? '#0369a1' : '#134e4a'} />
            </linearGradient>

            <linearGradient id={`scPlateInner_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#070d1d" />
              <stop offset="100%" stopColor="#0f1b33" />
            </linearGradient>

            <filter id={`sc3dShadow_${tier}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* Heavy Plinth Drop Shadow */}
          <ellipse cx="150" cy="352" rx="125" ry="15" fill="#000000" fillOpacity="0.7" />

          {/* Stepped Brushed Metal Plinth Base */}
          <rect x="40" y="340" width="220" height="16" rx="4" fill="url(#scMetalRim_${tier})" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" />
          <rect x="55" y="328" width="190" height="14" rx="3" fill={`url(#scBase_${tier})`} stroke="url(#scMetalRim_${tier})" strokeWidth="1" />
          
          {/* Base Metal Badge */}
          <rect x="80" y="333" width="140" height="6" rx="1.5" fill="url(#scMetalRim_${tier})" />

          {/* Sculpted Monument Tablet (Arching 3D Beveled Casing) */}
          <g filter={`url(#sc3dShadow_${tier})`}>
            {/* Outer Thick Beveled Frame */}
            <path 
              d="M60 48C60 36.9543 68.9543 28 80 28H220C231.046 28 240 36.9543 240 48V324C240 326.209 238.209 328 236 328H64C61.7909 328 60 326.209 60 324V48Z" 
              fill={`url(#scMetalRim_${tier})`} 
            />

            {/* Recessed Midnight Navy Velvet Chamber */}
            <path 
              d="M74 44C74 37.3726 79.3726 32 86 32H214C220.627 32 226 37.3726 226 44V314C226 316.209 224.209 318 222 318H78C75.7909 318 74 316.209 74 314V44Z" 
              fill={`url(#scPlateInner_${tier})`} 
              stroke="#38bdf8" 
              strokeWidth="0.8" 
              strokeOpacity="0.4"
            />
          </g>

          {/* Stepped Inset Plate */}
          <rect x="84" y="42" width="132" height="150" rx="8" fill="#0b1328" stroke="url(#scMetalRim_${tier})" strokeWidth="1" />

          {/* 3D Raised Sculpted HB Monogram in Center Plaque */}
          <g transform="translate(100, 60)">
            {/* Cast Shadow */}
            <rect x="14" y="14" width="20" height="74" rx="4" fill="#000000" fillOpacity="0.6" />
            <rect x="44" y="14" width="20" height="74" rx="4" fill="#000000" fillOpacity="0.6" />

            {/* H Left Column */}
            <rect x="10" y="10" width="20" height="74" rx="4" fill="url(#scMetalRim_${tier})" stroke="#ffffff" strokeWidth="0.8" />
            {/* Bridge */}
            <rect x="30" y="38" width="16" height="18" fill="url(#scMetalRim_${tier})" stroke="#ffffff" strokeWidth="0.6" />
            {/* Center Pillar */}
            <rect x="44" y="10" width="20" height="74" rx="4" fill="url(#scMetalRim_${tier})" stroke="#ffffff" strokeWidth="0.8" />
            {/* B Upper Arch */}
            <path d="M64 10H82C92 10 99 17 99 26C99 35 92 42 82 42H64V10ZM78 30H81C84 30 87 28 87 26C87 24 84 22 81 22H78V30Z" fill="url(#scMetalRim_${tier})" stroke="#ffffff" strokeWidth="0.8" />
            {/* B Lower Arch */}
            <path d="M64 40H84C94 40 102 48 102 59C102 70 94 78 84 78H64V40ZM78 66H83C86 66 89 63 89 59C89 55 86 52 83 52H78V66Z" fill="url(#scMetalRim_${tier})" stroke="#ffffff" strokeWidth="0.8" />

            {/* Glowing Cyan/Gold Play Triangle Emblem Embedded */}
            <polygon points="26,24 50,47 26,70" fill={isGold ? '#f59e0b' : isDiamond ? '#06b6d4' : '#14b8a6'} filter="drop-shadow(0 0 6px rgba(6,182,212,0.9))" />
          </g>

          {/* Sculpted Plate Inscription Details */}
          <rect x="84" y="204" width="132" height="102" rx="6" fill="#060c18" stroke="#1e293b" strokeWidth="1" />

          <text x="150" y="224" textAnchor="middle" fill="url(#scMetalRim_${tier})" fontSize="9" fontFamily="Space Grotesk, sans-serif" fontWeight="800" letterSpacing="1">
            {tierTitle}
          </text>
          
          <line x1="100" y1="232" x2="200" y2="232" stroke="url(#scMetalRim_${tier})" strokeWidth="0.75" />

          <text x="150" y="246" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" letterSpacing="0.8">
            OFFICIALLY CONFERRED TO
          </text>

          <text x="150" y="262" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontFamily="Space Grotesk, sans-serif" fontWeight="800">
            {creatorName}
          </text>

          <text x="150" y="278" textAnchor="middle" fill={isGold ? '#fef08a' : isDiamond ? '#38bdf8' : '#2dd4bf'} fontSize="6" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
            {tierSub}
          </text>

          <text x="150" y="294" textAnchor="middle" fill="#64748b" fontSize="5.5" fontFamily="Plus Jakarta Sans, sans-serif">
            HB APPS · AUTHENTICATED CREATOR RECOGNITION
          </text>

          {/* Corner Chrome Rivets */}
          <circle cx="89" cy="209" r="2" fill="url(#scMetalRim_${tier})" />
          <circle cx="211" cy="209" r="2" fill="url(#scMetalRim_${tier})" />
          <circle cx="89" cy="301" r="2" fill="url(#scMetalRim_${tier})" />
          <circle cx="211" cy="301" r="2" fill="url(#scMetalRim_${tier})" />
        </svg>
      </div>
    );
  }

  // 3. FLUID SIGNATURE: Flowing aerodynamic silhouette with layered wave-glass contours
  return (
    <div 
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: pixelWidth, height }}
    >
      <svg 
        viewBox="0 0 300 375" 
        width={pixelWidth} 
        height={height} 
        className="w-full h-full drop-shadow-[0_16px_40px_rgba(6,182,212,0.4)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`fsFluidGrad_${tier}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isGold ? '#fef08a' : isDiamond ? '#ffffff' : '#ccfbf1'} />
            <stop offset="30%" stopColor={isGold ? '#eab308' : isDiamond ? '#7dd3fc' : '#2dd4bf'} />
            <stop offset="70%" stopColor={isGold ? '#ca8a04' : isDiamond ? '#0284c7' : '#0f766e'} />
            <stop offset="100%" stopColor={isGold ? '#78350f' : isDiamond ? '#082f49' : '#042f2e'} />
          </linearGradient>

          <linearGradient id={`fsAuraGrad_${tier}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9" />
          </linearGradient>

          <filter id={`fsGlow_${tier}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Ellipse Glow & Shadow */}
        <ellipse cx="150" cy="354" rx="110" ry="14" fill="#000000" fillOpacity="0.65" />
        <ellipse cx="150" cy="350" rx="90" ry="8" fill={isGold ? '#facc15' : isDiamond ? '#38bdf8' : '#2dd4bf'} fillOpacity="0.2" filter="blur(6px)" />

        {/* Sculpted Cylindrical Acrylic Plinth */}
        <path d="M70,344 C70,336 105,330 150,330 C195,330 230,336 230,344 L230,358 C230,366 195,372 150,372 C105,372 70,366 70,358 Z" fill="#0b1328" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
        <ellipse cx="150" cy="344" rx="80" ry="12" fill="#0f1b36" stroke={`url(#fsFluidGrad_${tier})`} strokeWidth="1" />

        {/* Flowing Fluid Outer Wings: Sweeping Double-Helix Ribbon Contour */}
        {/* Left Wing Ribbon */}
        <path 
          d="M150 20C120 20 60 70 54 160C48 240 90 310 130 334C110 290 85 220 95 160C105 100 135 45 150 20Z" 
          fill={`url(#fsFluidGrad_${tier})`} 
          fillOpacity="0.85" 
          filter={`url(#fsGlow_${tier})`}
        />

        {/* Right Wing Ribbon */}
        <path 
          d="M150 20C180 20 240 70 246 160C252 240 210 310 170 334C190 290 215 220 205 160C195 100 165 45 150 20Z" 
          fill={`url(#fsFluidGrad_${tier})`} 
          fillOpacity="0.85" 
        />

        {/* Inner Curved Contour Ribbons */}
        <path 
          d="M150 45C130 65 95 120 100 180C105 240 135 290 145 320C130 270 115 210 120 170C125 130 140 80 150 45Z" 
          fill="#ffffff" 
          fillOpacity="0.4" 
        />
        <path 
          d="M150 45C170 65 205 120 200 180C195 240 165 290 155 320C170 270 185 210 180 170C175 130 160 80 150 45Z" 
          fill="#ffffff" 
          fillOpacity="0.5" 
        />

        {/* Central Suspended Floating Orb / Portal */}
        <circle cx="150" cy="155" r="48" fill="#070c18" stroke={`url(#fsFluidGrad_${tier})`} strokeWidth="2" />
        <circle cx="150" cy="155" r="44" fill="#0c152a" fillOpacity="0.8" />

        {/* Concentric Neon Rings */}
        <circle cx="150" cy="155" r="38" stroke="#38bdf8" strokeWidth="0.75" strokeDasharray="4 2" strokeOpacity="0.8" />

        {/* Integrated Floating HB Monogram & Play Triangle */}
        <g transform="translate(122, 126) scale(0.6)">
          <rect x="10" y="10" width="14" height="78" rx="3" fill="#ffffff" />
          <rect x="24" y="42" width="22" height="14" fill="#ffffff" />
          <rect x="44" y="10" width="14" height="78" rx="3" fill="#ffffff" />
          <path d="M58 10H78C88 10 96 18 96 28C96 38 88 46 78 46H58V10ZM72 32H78C82 32 84 30 84 28C84 26 82 24 78 24H72V32Z" fill="#ffffff" />
          <path d="M58 44H80C91 44 99 53 99 64C99 75 91 84 80 84H58V44ZM72 70H80C85 70 87 67 87 64C87 61 85 58 80 58H72V70Z" fill="#ffffff" />
          <polygon points="28,26 48,49 28,72" fill={isGold ? '#eab308' : isDiamond ? '#06b6d4' : '#14b8a6'} />
        </g>

        {/* Floating Typography Plate */}
        <g transform="translate(70, 225)">
          <rect x="0" y="0" width="160" height="72" rx="8" fill="#091024" fillOpacity="0.9" stroke="url(#fsFluidGrad_${tier})" strokeWidth="1" />
          <text x="80" y="20" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="Space Grotesk, sans-serif" fontWeight="800" letterSpacing="0.8">
            {tierTitle}
          </text>
          <text x="80" y="32" textAnchor="middle" fill={isGold ? '#fef08a' : isDiamond ? '#7dd3fc' : '#5eead4'} fontSize="6" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700">
            PROUDLY AWARDED TO
          </text>
          <text x="80" y="46" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800">
            {creatorName}
          </text>
          <text x="80" y="58" textAnchor="middle" fill="#94a3b8" fontSize="5.5" fontFamily="Plus Jakarta Sans, sans-serif">
            {tierSub}
          </text>
        </g>

        {/* Luminous Apex Star */}
        <polygon points="150,15 152,22 159,22 153,26 156,33 150,29 144,33 147,26 141,22 148,22" fill="#ffffff" />
      </svg>
    </div>
  );
};
