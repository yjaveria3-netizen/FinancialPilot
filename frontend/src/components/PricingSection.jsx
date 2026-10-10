import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function PricingSection() {
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      title: t('pricing_plan_essentials', 'Essentials'),
      priceMonthly: 49,
      priceYearly: 39,
      description: t(
        'pricing_desc_essentials',
        'Essential financial runway visibility for solo founders & micro-businesses.'
      ),
      featured: false,
      features: [
        t('val_card1_item1', '30-Day Cash Flow Forecaster'),
        t('val_card2_item1', 'Composite Credit Readiness Score'),
        t('val_card3_item1', 'Basic Anomaly Thresholds'),
        t('footer_local_csv', 'CSV Data Contract Import'),
        t('cfo_title', 'Standard Email Support'),
      ],
    },
    {
      title: t('pricing_plan_growth', 'Growth'),
      priceMonthly: 149,
      priceYearly: 119,
      description: t(
        'pricing_desc_growth',
        'Full financial intelligence for scaling businesses ready to qualify for credit.'
      ),
      featured: true,
      badge: t('pricing_popular', 'Most Popular'),
      features: [
        t('val_card1_item1', '90-Day Cash Flow Projections'),
        t('val_card2_item3', 'Full Credit Score + Gemini Advice'),
        t('ag_title_1', 'Real-Time Anomaly Guard'),
        t('tax_title_1', 'Quarterly Tax Liability Estimator'),
        t('cfo_title', 'AI CFO Chat Assistant'),
        t('badge_growth', 'Priority Slack & Email Support'),
      ],
    },
    {
      title: t('pricing_plan_scale', 'Scale'),
      priceMonthly: 349,
      priceYearly: 279,
      description: t(
        'pricing_desc_scale',
        'Enterprise-grade financial analytics and multi-ledger intelligence.'
      ),
      featured: false,
      features: [
        t('badge_core', 'Everything in Growth'),
        t('sp_title_1', 'Scenario Modeling Engine'),
        t('ap_title_1', 'Accountant Export Portal (PDF/Excel)'),
        t('val_card4_item1', 'Procurement & Inventory Alerts'),
        t('ap_badge', 'Custom Data Contract Validation'),
        t('badge_growth', 'Dedicated Financial Success Manager'),
      ],
    },
  ];

  return (
    <section id="pricing" className="section py-20 relative overflow-hidden bg-body">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="section-intro text-center mb-12">
          <h2 className="text-h3 lg:text-h2 font-secondary font-bold text-white mb-4">
            {t('pricing_heading_1', 'Pricing Built For')}{' '}
            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[#4EE2C9] via-[#3FBFA8] to-[#80F4E0] font-semibold">
              {t('pricing_heading_2', 'Business Growth')}
            </strong>
          </h2>
          <p className="text-text-dark max-w-xl mx-auto text-base">
            {t(
              'pricing_subheading',
              'Start your free 14-day trial, scale as you grow. No credit card required. Cancel anytime.'
            )}
          </p>

          {/* Toggle pill */}
          <div className="inline-flex items-center gap-1 bg-light border border-border p-1.5 rounded-full mt-8 shadow-inner">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`px-6 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !isYearly ? 'bg-secondary text-white shadow-lg shadow-secondary/25' : 'text-text hover:text-white'
              }`}
            >
              {t('pricing_monthly', 'Monthly')}
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`px-6 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isYearly ? 'bg-secondary text-white shadow-lg shadow-secondary/25' : 'text-text hover:text-white'
              }`}
            >
              {t('pricing_yearly', 'Yearly')}{' '}
              <span className="text-[10px] text-emerald-400 font-normal ml-1 font-mono">
                {t('pricing_save', 'Save 20%')}
              </span>
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
                className={`rounded-4xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 relative hover:border-secondary/60 hover:shadow-[0_0_25px_rgba(63,191,168,0.35)] ${
                  p.featured
                    ? 'bg-light border-2 border-secondary shadow-2xl shadow-secondary/15 lg:-translate-y-2'
                    : 'bg-light/60 border border-border'
                }`}
              >
                {p.badge && (
                  <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-secondary/20 text-secondary-light border border-secondary/30 text-xs font-semibold">
                    {p.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold font-secondary text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-text-dark leading-relaxed mb-6 min-h-[36px]">
                    {p.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl sm:text-5xl font-bold font-secondary text-white font-mono">
                      ${price}
                    </span>
                    <span className="text-xs text-text-dark font-mono">
                      {t('pricing_per_month', '/month')}
                    </span>
                  </div>

                  <div className="border-t border-border/60 pt-6 mb-8">
                    <div className="text-xs uppercase font-semibold text-text-dark tracking-wider mb-4">
                      {t('badge_core', 'Included Features:')}
                    </div>
                    <ul className="space-y-3 text-sm text-text">
                      {p.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-3">
                          <svg
                            className="size-4 text-secondary-light shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
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
                  {t('pricing_start_trial', 'Start 14-Day Free Trial')}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
