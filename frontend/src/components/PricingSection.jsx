import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      title: 'Essentials',
      priceMonthly: 49,
      priceYearly: 39,
      description: 'Essential financial runway visibility for solo founders & micro-businesses.',
      featured: false,
      features: [
        '30-Day Cash Flow Forecaster',
        'Composite Credit Readiness Score',
        'Basic Anomaly Thresholds',
        'CSV Data Contract Import',
        'Standard Email Support',
      ],
    },
    {
      title: 'Growth',
      priceMonthly: 149,
      priceYearly: 119,
      description: 'Full financial intelligence for scaling businesses ready to qualify for credit.',
      featured: true,
      badge: 'Most Popular',
      features: [
        '90-Day Cash Flow Projections',
        'Full Credit Score + Gemini Advice',
        'Real-Time Anomaly Guard',
        'Quarterly Tax Liability Estimator',
        'AI CFO Chat Assistant',
        'Priority Slack & Email Support',
      ],
    },
    {
      title: 'Scale',
      priceMonthly: 349,
      priceYearly: 279,
      description: 'Enterprise-grade financial analytics and multi-ledger intelligence.',
      featured: false,
      features: [
        'Everything in Growth',
        'Scenario Modeling Engine',
        'Accountant Export Portal (PDF/Excel)',
        'Procurement & Inventory Alerts',
        'Custom Data Contract Validation',
        'Dedicated Financial Success Manager',
      ],
    },
  ];

  return (
    <section id="pricing" className="section py-20 relative overflow-hidden bg-body">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="section-intro text-center mb-12">
          <h2 className="text-h3 lg:text-h2 font-secondary font-bold text-white mb-4">
            Pricing Built For <strong className="text-primary font-normal">Business Growth</strong>
          </h2>
          <p className="text-text-dark max-w-xl mx-auto text-base">
            Start your free 14-day trial, scale as you grow. No credit card required. Cancel anytime.
          </p>

          {/* Toggle pill matching user screenshot */}
          <div className="inline-flex items-center gap-1 bg-light border border-border p-1.5 rounded-full mt-8 shadow-inner">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !isYearly ? 'bg-primary text-white shadow-lg' : 'text-text hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isYearly ? 'bg-primary text-white shadow-lg' : 'text-text hover:text-white'
              }`}
            >
              Yearly <span className="text-[10px] text-emerald-400 font-normal ml-1">Save 20%</span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((p) => {
            const price = isYearly ? p.priceYearly : p.priceMonthly;
            return (
              <div
                key={p.title}
                className={`rounded-4xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative ${
                  p.featured
                    ? 'bg-light border-2 border-primary shadow-2xl shadow-primary/10 lg:-translate-y-2'
                    : 'bg-light/60 border border-border hover:border-primary/40'
                }`}
              >
                {p.badge && (
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-semibold">
                    {p.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold font-secondary text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-text-dark leading-relaxed mb-6 min-h-[36px]">{p.description}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl sm:text-5xl font-bold font-secondary text-white">${price}</span>
                    <span className="text-xs text-text-dark">/ Per Month</span>
                  </div>

                  <div className="border-t border-border/60 pt-6 mb-8">
                    <div className="text-xs uppercase font-semibold text-text-dark tracking-wider mb-4">Included Features:</div>
                    <ul className="space-y-3 text-sm text-text">
                      {p.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3">
                          <svg className="size-4 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className={`btn w-full text-center ${p.featured ? 'btn-primary' : 'btn-outline'}`}
                >
                  Start 14-Day Free Trial
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
