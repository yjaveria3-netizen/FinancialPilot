import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function HeroBanner() {
  const { t } = useLanguage();

  return (
    <section className="section-ph relative overflow-hidden pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-light border border-secondary/40 text-xs text-secondary-light mb-6 font-semibold tracking-wide">
            <span className="size-2 rounded-full bg-secondary-light animate-pulse"></span>
            {t('hero_badge', 'Financial Pilot • Autonomous Financial Intelligence')}
          </div>

          {/* Heading with exact styling */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-secondary text-white leading-tight mb-6">
            {t('hero_banner_title_1', 'The AI Financial Co-Pilot for')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4EE2C9] via-[#3FBFA8] to-[#80F4E0] font-extrabold drop-shadow-[0_0_20px_rgba(63,191,168,0.35)]">
              {t('hero_banner_title_2', 'Growing Businesses')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-text-dark max-w-2xl mx-auto mb-10 leading-relaxed">
            {t(
              'hero_subtitle',
              'Stop flying blind on your financial runway. Financial Pilot gives you real-time cash flow forecasting, business credit readiness scoring, and Gemini-powered executive explanations.'
            )}
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/cash-flow" className="btn btn-primary">
              {t('btn_view_cash_forecast', 'View Cash Forecast')}
            </Link>
            <Link to="/credit-score" className="btn btn-outline">
              {t('btn_calc_credit_score', 'Calculate Credit Score')}
            </Link>
          </div>
        </div>
      </div>

      {/* Background Radial Glow Blob (exact template styling) */}
      <div
        className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 size-96 sm:size-160 lg:size-240 -z-20 blur-3xl pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, var(--color-primary, #DA7B93) 0%, color-mix(in srgb, var(--color-primary, #DA7B93) 78%, transparent) 25%, transparent 70%)',
        }}
      />
    </section>
  );
}
