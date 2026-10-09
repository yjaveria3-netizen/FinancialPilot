export default function CosmicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* ── 1. Top Luminous Purple Halo ── */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] xl:w-[75rem] xl:h-[75rem] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, var(--color-primary, #937AFF) 0%, color-mix(in srgb, var(--color-primary, #937AFF) 78%, transparent) 22%, transparent 70%)',
          opacity: 0.8,
        }}
      />

      {/* ── 2. Middle Softened Purple Shadow Blob (Subtle, non-overpowering ambient glow) ── */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] sm:w-[65rem] lg:w-[80rem] h-[28rem] lg:h-[36rem] rounded-full blur-[130px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(147, 122, 255, 0.11) 0%, rgba(77, 54, 208, 0.05) 40%, transparent 72%)',
          opacity: 0.65,
        }}
      />

      {/* ── 3. Bottom Ambient Purple Glow ── */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[60rem] lg:w-[75rem] h-[50rem] rounded-full blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--color-primary, #937AFF) 40%, transparent) 0%, rgba(77, 54, 208, 0.22) 35%, transparent 75%)',
          opacity: 0.65,
        }}
      />

      {/* ── 4. Ethereal Top Beams SVG Mesh (From Automark template) ── */}
      <svg
        className="absolute top-0 left-0 w-full max-w-[567px] h-auto pointer-events-none opacity-45 -z-10"
        viewBox="0 0 567 558"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.55">
          <g filter="url(#bg_a-mesh)" style={{ mixBlendMode: 'plus-lighter' }}>
            <path
              fill="url(#bg_b-mesh)"
              d="M-20.527-7.51 10.182-43l259.774 233.148-13.283 15.352-277.2-213.01Z"
            />
          </g>
          <g filter="url(#bg_c-mesh)" style={{ mixBlendMode: 'plus-lighter' }}>
            <path
              fill="url(#bg_d-mesh)"
              d="M-52 13.659-20.788-25l267.328 224.459-13.502 16.722-285.04-202.522Z"
            />
          </g>
          <g filter="url(#bg_e-mesh)" style={{ mixBlendMode: 'plus-lighter' }}>
            <path
              fill="url(#bg_f-mesh)"
              d="M-108.079-4.9-66.125-46l290.011 307.352-18.147 17.779-313.818-284.03Z"
            />
          </g>
          <g filter="url(#bg_g-mesh)">
            <ellipse
              cx="143"
              cy="252.378"
              fill="var(--color-primary-light, #4D36D0)"
              fillOpacity="0.5"
              rx="143"
              ry="252.378"
              transform="scale(-1 1) rotate(46.133 191.203 -117.756)"
            />
          </g>
        </g>
        <defs>
          <filter
            id="bg_a-mesh"
            width="338.484"
            height="296.5"
            x="-44.527"
            y="-67"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1" stdDeviation="12" />
          </filter>
          <filter
            id="bg_c-mesh"
            width="346.541"
            height="289.181"
            x="-76.001"
            y="-49"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1" stdDeviation="12" />
          </filter>
          <filter
            id="bg_e-mesh"
            width="379.965"
            height="373.131"
            x="-132.079"
            y="-70"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1" stdDeviation="12" />
          </filter>
          <filter
            id="bg_g-mesh"
            width="914.454"
            height="906.103"
            x="-348.178"
            y="-349.061"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1" stdDeviation="125" />
          </filter>
          <linearGradient
            id="bg_b-mesh"
            x1="-5.173"
            x2="258.744"
            y1="-25.255"
            y2="203.106"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--color-primary, #937AFF)" />
            <stop offset="1" stopColor="var(--color-primary, #937AFF)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="bg_d-mesh"
            x1="-36.394"
            x2="235.144"
            y1="-5.671"
            y2="213.574"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--color-primary, #937AFF)" />
            <stop offset="1" stopColor="var(--color-primary, #937AFF)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="bg_f-mesh"
            x1="-87.102"
            x2="208.568"
            y1="-25.45"
            y2="276.359"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--color-primary, #937AFF)" />
            <stop offset="1" stopColor="var(--color-primary, #937AFF)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
