import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ElectricCreditGauge({
  score = 0,
  grade = 'N/A',
  size = 'size-36',
  idPrefix = 'gauge'
}) {
  const { t } = useLanguage();
  const safeScore = Math.min(100, Math.max(0, Number(score) || 0));
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.327
  const strokeDashoffset = circumference - (circumference * safeScore) / 100;

  // In the rotated coordinate system, angle theta = (score / 100) * 2 * PI
  const angleRad = (safeScore / 100) * 2 * Math.PI;
  const sparkX = Number((50 + radius * Math.cos(angleRad)).toFixed(2));
  const sparkY = Number((50 + radius * Math.sin(angleRad)).toFixed(2));

  const gradId = `${idPrefix}-score-grad`;
  const trackId = `${idPrefix}-track-grad`;
  const beamId = `${idPrefix}-beam-grad`;
  const filterId = `${idPrefix}-glow-filter`;

  return (
    <div className={`relative ${size} flex items-center justify-center select-none`}>
      {/* Ambient Breathing Energy Aura behind the gauge blending emerald green & pinkish theme */}
      <div
        className="absolute inset-0 m-auto size-28 rounded-full bg-gradient-to-tr from-[#3FBFA8]/20 via-[#376E6F]/25 to-[#DA7B93]/20 blur-xl pointer-events-none animate-electric-breath"
      />

      <svg className="size-full -rotate-90 relative z-10" viewBox="0 0 100 100">
        <defs>
          {/* Dual Theme Gradient: #3FBFA8 emerald green into #376E6F teal and #DA7B93 accent */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4EE2C9" />
            <stop offset="35%" stopColor="#376E6F" />
            <stop offset="70%" stopColor="#DA7B93" />
            <stop offset="100%" stopColor="#822B4A" />
          </linearGradient>

          {/* Recessed Track Gradient matching #2E151B theme */}
          <linearGradient id={trackId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1D0B12" />
            <stop offset="100%" stopColor="#2E151B" />
          </linearGradient>

          {/* Electric Beam Gradient with emerald/pink flash */}
          <linearGradient id={beamId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3FBFA8" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#3FBFA8" stopOpacity="0" />
          </linearGradient>

          {/* Glow filter with #3FBFA8 and #DA7B93 shadow */}
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#3FBFA8" floodOpacity="0.75" />
            <feDropShadow dx="0" dy="0" stdDeviation="5.5" floodColor="#DA7B93" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Dark Recessed Track Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={`url(#${trackId})`}
          strokeWidth="8"
          fill="none"
          strokeOpacity="0.95"
        />

        {/* Ambient Glow Underlay Arc */}
        {safeScore > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={`url(#${gradId})`}
            strokeWidth="11"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 opacity-40 blur-[2.5px]"
          />
        )}

        {/* Main Gradient Progress Arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          className="transition-all duration-1000 ease-out"
        />

        {/* Active Plasma Current Stream Beam */}
        {safeScore > 5 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={`url(#${beamId})`}
            strokeWidth="4"
            fill="none"
            strokeDasharray="18 45"
            strokeLinecap="round"
            className="animate-electric-stream opacity-90 mix-blend-screen pointer-events-none"
          />
        )}

        {/* Secondary Micro-Current Stream Beam */}
        {safeScore > 10 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#FFFFFF"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="6 75"
            strokeLinecap="round"
            className="animate-electric-fast opacity-95 mix-blend-screen pointer-events-none"
          />
        )}

        {/* Animated Electrode Spark at the Arc Leading Tip */}
        {safeScore > 2 && safeScore < 100 && (
          <g>
            {/* Outer expanding energy pulse */}
            <circle
              cx={sparkX}
              cy={sparkY}
              r="6.5"
              fill="none"
              stroke="#DA7B93"
              strokeWidth="1"
              opacity="0.8"
              className="animate-ping"
            />
            {/* Electric spark core */}
            <circle
              cx={sparkX}
              cy={sparkY}
              r="3.2"
              fill="#FFFFFF"
              style={{
                filter:
                  'drop-shadow(0 0 3px #FFFFFF) drop-shadow(0 0 7px #DA7B93) drop-shadow(0 0 12px #822B4A)',
                animation: 'electricSparkFlicker 1.6s ease-in-out infinite'
              }}
            />
          </g>
        )}
      </svg>

      {/* Center Score & Glowing Grade */}
      <div className="absolute text-center z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-3xl sm:text-4xl font-extrabold font-secondary text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-[#3FBFA8] drop-shadow-[0_0_14px_rgba(63,191,168,0.55)] tracking-tight font-mono">
          {score}
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full bg-gradient-to-r from-[#376E6F]/30 via-[#2E151B]/90 to-[#3FBFA8]/25 border border-[#3FBFA8]/40 shadow-[0_0_12px_rgba(63,191,168,0.35)]">
          <span className="size-1.5 rounded-full bg-[#3FBFA8] shadow-[0_0_8px_#3FBFA8] animate-pulse" />
          <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-[#80E5D3] to-[#3FBFA8]">
            {t('grade', 'Grade')} {grade}
          </span>
        </div>
      </div>
    </div>
  );
}
