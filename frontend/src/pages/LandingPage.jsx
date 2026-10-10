import VideoShowcase from '../components/VideoShowcase';
import BrandsCarousel from '../components/BrandsCarousel';
import ValueProps from '../components/ValueProps';
import BusinessNeeds from '../components/BusinessNeeds';
import Faq from '../components/Faq';
import CallToAction from '../components/CallToAction';
import ParticleCanvas from '../components/ParticleCanvas';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* ── Hero Banner Section ── */}
      <section className="relative overflow-hidden pt-24 sm:pt-28 pb-12 lg:pb-16">
        {/* Very small, slow, sparse celestial spore dots ONLY in hero section */}
        <ParticleCanvas />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-6 sm:mb-8">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-light border border-border text-xs text-primary mb-4 font-semibold tracking-wide">
              <span className="size-2 rounded-full bg-primary animate-pulse"></span>
              The AI Financial Co-Pilot for Growing Businesses
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-secondary text-white leading-tight mb-4">
              Stop Flying Blind on Your <br className="hidden sm:inline" />
              <span className="text-primary">Financial Runway</span>
            </h1>

            {/* Subtitle - High contrast, clearly readable text */}
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto mb-6 leading-relaxed font-normal">
              Financial Pilot gives you real-time cash flow forecasting, business credit readiness scoring, anomaly detection, and Gemini-powered executive explanations — all in one unified platform.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/dashboard" className="btn btn-primary">
                Launch Live Dashboard
              </Link>
              <Link to="/cash-flow" className="btn btn-outline">
                Explore Forecast Engine
              </Link>
            </div>
          </div>

          {/* ── 3D Perspective Hero Video Showcase ── */}
          <div
            className="w-full flex justify-center -mt-2 sm:-mt-4 lg:-mt-6"
            style={{ perspective: '1000px', perspectiveOrigin: '50% 18%' }}
          >
            <VideoShowcase />
          </div>
        </div>
      </section>

      {/* ── Brands Carousel ── */}
      <BrandsCarousel />

      {/* ── Value Proposition ── */}
      <ValueProps />

      {/* ── 5 Business Growth Pillars (Funnel Cards) ── */}
      <BusinessNeeds />

      {/* ── FAQ ── */}
      <Faq />

      {/* ── Call To Action ── */}
      <CallToAction />
    </div>
  );
}
