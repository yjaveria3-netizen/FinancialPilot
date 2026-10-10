import { useLanguage } from '../context/LanguageContext';

export default function ValueProps() {
  const { t } = useLanguage();

  const items = [
    {
      logo: '/images/value-proposition/values-icon-1.svg',
      title: t('val_card1_title', 'Cash Flow Intelligence'),
      list: [
        t('val_card1_item1', '30/60/90-Day Cash Projections'),
        t('val_card1_item2', 'Early Warning for Low Liquidity'),
        t('val_card1_item3', 'Automatic Receivables Tracking'),
      ],
    },
    {
      logo: '/images/value-proposition/values-icon-2.svg',
      title: t('val_card2_title', 'Credit Readiness'),
      list: [
        t('val_card2_item1', 'Financial Pilot Credit Score (0–100)'),
        t('val_card2_item2', '4-Factor Financial Health Breakdown'),
        t('val_card2_item3', 'Gemini AI Improvement Roadmap'),
      ],
    },
    {
      logo: '/images/value-proposition/values-icon-3.svg',
      title: t('val_card3_title', 'Compliance & Guard'),
      list: [
        t('val_card3_item1', 'Anomaly & Irregularity Detector'),
        t('val_card3_item2', 'Live Tax Liability Estimates'),
        t('val_card3_item3', 'Export-Ready Accountant Portal'),
      ],
    },
    {
      logo: '/images/value-proposition/values-icon-4.svg',
      title: t('val_card4_title', 'Procurement AI'),
      list: [
        t('val_card4_item1', 'Vendor Reorder Alerts'),
        t('val_card4_item2', 'Group Buying Opportunities'),
        t('val_card4_item3', 'Supplier Negotiation Co-Pilot'),
      ],
    },
  ];

  return (
    <section className="section py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="section-intro text-center mb-12">
          <h2 className="text-h3 lg:text-h2 font-secondary font-bold text-white mb-4">
            {t('val_heading_1', 'Replace Complex Spreadsheets With a')}{' '}
            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[#4EE2C9] via-[#3FBFA8] to-[#80F4E0] font-semibold">
              {t('val_heading_2', 'Smart Financial Co-Pilot')}
            </strong>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            {t(
              'val_subheading',
              'Everything your growing business needs to monitor runway, qualify for financing, and optimize expenses — in one unified dashboard.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-3xl bg-white/5 border border-border hover:border-secondary/60 hover:shadow-[0_0_25px_rgba(63,191,168,0.35)] transition-all duration-300"
            >
              <img src={item.logo} alt={item.title} className="mb-6 size-12" />
              <h3 className="text-lg font-bold font-secondary text-white mb-4">{item.title}</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {item.list.map((li) => (
                  <li key={li} className="flex items-center gap-2">
                    <svg
                      className="size-4 text-secondary-light shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
