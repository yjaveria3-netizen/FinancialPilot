export default function Logo() {
  return (
    <div
      dir="ltr"
      style={{ direction: 'ltr', unicodeBidi: 'isolate' }}
      className="flex flex-row items-center gap-2.5 group cursor-pointer select-none"
    >
      {/* Modern Financial Pilot Radar & Growth Emblem */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E151B" />
            <stop offset="100%" stopColor="#15070D" />
          </linearGradient>
          <linearGradient id="logoLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F2A3B5" />
            <stop offset="50%" stopColor="#DA7B93" />
            <stop offset="100%" stopColor="#376E6F" />
          </linearGradient>
        </defs>

        {/* Rounded Container with Border */}
        <rect width="36" height="36" rx="10" fill="url(#logoBgGrad)" />
        <rect width="36" height="36" rx="10" stroke="#DA7B93" strokeWidth="1" strokeOpacity="0.4" />

        {/* Subtle Pilot Radar Sweep Rings */}
        <circle cx="18" cy="18" r="12" stroke="#DA7B93" strokeWidth="0.75" strokeOpacity="0.25" strokeDasharray="2 2" />
        <circle cx="18" cy="18" r="7" stroke="#DA7B93" strokeWidth="0.75" strokeOpacity="0.3" />

        {/* Upward Growth / Trajectory Line */}
        <path
          d="M8 25L14 19L20 23L28 11"
          stroke="url(#logoLineGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Arrow Head */}
        <path
          d="M23 11H28V16"
          stroke="#376E6F"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Accent Data Nodes */}
        <circle cx="14" cy="19" r="1.5" fill="#DA7B93" />
        <circle cx="20" cy="23" r="1.5" fill="#F2A3B5" />
        <circle cx="28" cy="11" r="2" fill="#376E6F" />
      </svg>

      {/* Brand Text */}
      <span className="font-secondary font-bold text-lg tracking-tight text-white flex items-center gap-1">
        Financial <span className="text-secondary-light font-extrabold">Pilot</span>
      </span>
    </div>
  );
}
