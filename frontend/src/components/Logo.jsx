export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* SVG Icon */}
      <svg 
        width="36" 
        height="36" 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Hexagon / Rounded Card */}
        <rect width="36" height="36" rx="8" fill="#0F172A" />
        
        {/* Upward Growth / Trajectory Line */}
        <path 
          d="M8 24L15 17L20 22L28 12" 
          stroke="#10B981" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Arrow Head */}
        <path 
          d="M22 12H28V18" 
          stroke="#10B981" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Accent Data Node */}
        <circle cx="20" cy="22" r="2.5" fill="#6366F1" />
      </svg>

      {/* Brand Text */}
      <span style={{ 
        fontFamily: 'sans-serif', 
        fontWeight: '700', 
        fontSize: '20px', 
        color: '#FFFFFF', 
        letterSpacing: '-0.5px' 
      }}>
        Financial <span style={{ color: '#10B981' }}>Pilot</span>
      </span>
    </div>
  );
}
