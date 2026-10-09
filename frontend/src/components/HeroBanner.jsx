import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section className="section-ph relative overflow-hidden pt-32 pb-20">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-light border border-border text-xs text-primary mb-6 font-semibold tracking-wide">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            Financial Pilot • Autonomous Financial Intelligence
          </div>

          {/* Heading with exact styling */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-secondary text-white leading-tight mb-6">
            The AI Financial Co-Pilot for{' '}
            <span className="text-primary italic">Growing Businesses</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-text-dark max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop flying blind on your financial runway. Financial Pilot gives you real-time cash flow forecasting, business credit readiness scoring, and Gemini-powered executive explanations.
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/cash-flow" className="btn btn-primary">
              View Cash Forecast
            </Link>
            <Link to="/credit-score" className="btn btn-outline">
              Calculate Credit Score
            </Link>
          </div>
        </div>
      </div>

      {/* Background Radial Glow Blob (exact template styling) */}
      <div
        className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2 size-96 sm:size-160 lg:size-240 -z-20 blur-3xl pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, var(--color-primary, #937AFF) 0%, color-mix(in srgb, var(--color-primary, #937AFF) 78%, transparent) 25%, transparent 70%)',
        }}
      />
    </section>
  );
}
