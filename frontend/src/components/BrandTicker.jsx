import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Regional retail & textile partner brand specifications
 * Hover glows strictly match client-provided signature colors:
 * - Khaadi: Warm Terracotta / Sand Glow (#E0D9CF)
 * - Nishat Linen: Luxury Gold Glow (#CCAE5D)
 * - Al-Fatah: Retail Crimson Red Glow (#E63946)
 * - Chenab: Royal Textile Blue Glow (#1D3557 / #3B82F6)
 * - Outfitters: Urban Neon/White Accent Glow (#F8F9FA)
 */
const BRANDS = [
  {
    name: 'KHAADI',
    tagline: 'Apparel & Lifestyle',
    signatureColor: '#E0D9CF',
    glowBoxShadow: '0 0 25px rgba(224, 217, 207, 0.45)',
    accentBg: 'rgba(224, 217, 207, 0.1)',
    renderIcon: () => (
      <svg className="size-6 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V12" strokeLinecap="round" />
        <path d="M12 12L4 7" strokeLinecap="round" />
        <path d="M12 12l8-5" strokeLinecap="round" />
        <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      </svg>
    )
  },
  {
    name: 'NISHAT LINEN',
    tagline: 'Luxury Textiles',
    signatureColor: '#CCAE5D',
    glowBoxShadow: '0 0 25px rgba(204, 174, 93, 0.45)',
    accentBg: 'rgba(204, 174, 93, 0.1)',
    renderIcon: () => (
      <svg className="size-6 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M5 19h14M6 15l2-8 4 4 4-4 2 8H6z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="12" cy="10" r="1" fill="currentColor" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
      </svg>
    )
  },
  {
    name: 'AL-FATAH',
    tagline: 'Department Stores',
    signatureColor: '#E63946',
    glowBoxShadow: '0 0 25px rgba(230, 57, 70, 0.45)',
    accentBg: 'rgba(230, 57, 70, 0.1)',
    renderIcon: () => (
      <svg className="size-6 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M3 3h2l2.5 13h11.5l2-9H6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="19" r="2" fill="currentColor" />
        <circle cx="17" cy="19" r="2" fill="currentColor" />
      </svg>
    )
  },
  {
    name: 'CHENAB',
    tagline: 'Global Textile Group',
    signatureColor: '#1D3557',
    glowBoxShadow: '0 0 25px rgba(29, 53, 87, 0.8), 0 0 15px rgba(59, 130, 246, 0.4)',
    accentBg: 'rgba(29, 53, 87, 0.2)',
    renderIcon: () => (
      <svg className="size-6 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M3 12c3-4 6-4 9 0s6 4 9 0M3 7c3-4 6-4 9 0s6 4 9 0M3 17c3-4 6-4 9 0s6 4 9 0" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'OUTFITTERS',
    tagline: 'Urban Fast-Fashion',
    signatureColor: '#F8F9FA',
    glowBoxShadow: '0 0 25px rgba(248, 249, 250, 0.45)',
    accentBg: 'rgba(248, 249, 250, 0.1)',
    renderIcon: () => (
      <svg className="size-6 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5 12 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

export default function BrandTicker({ className = '' }) {
  const { t } = useLanguage();
  return (
    <section className={`section-sm py-12 xl:py-16 ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-text-dark text-xs uppercase tracking-widest font-semibold mb-8">
          {t('trusted_brands', "Trusted by Pakistan's leading textile & retail enterprises")}
        </p>

        {/* Brands Row */}
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center items-center">
          {BRANDS.map((b) => (
            <div
              key={b.name}
              className="group relative px-6 py-4 rounded-2xl bg-light/60 border border-border/80 transition-all duration-300 flex items-center gap-3.5 cursor-pointer select-none"
              style={{
                // default state: low-opacity muted gray/white
                opacity: 0.75
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.borderColor = b.signatureColor;
                e.currentTarget.style.boxShadow = b.glowBoxShadow;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.75';
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.transform = '';
              }}
            >
              {/* Brand Icon */}
              <div
                className="size-9 rounded-xl flex items-center justify-center transition-colors text-text-dark group-hover:text-white"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                {b.renderIcon()}
              </div>

              {/* Wordmark and Tagline */}
              <div className="text-left">
                <div
                  className="text-sm font-extrabold tracking-wider font-secondary text-white/70 group-hover:text-white transition-colors"
                >
                  {b.name}
                </div>
                <div className="text-[10px] text-text-dark font-medium group-hover:text-text-light transition-colors">
                  {b.tagline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
