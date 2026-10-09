export default function ValueProps() {
  const items = [
    {
      logo: '/images/value-proposition/values-icon-1.svg',
      title: 'Cash Flow Intelligence',
      list: [
        '30/60/90-Day Cash Projections',
        'Early Warning for Low Liquidity',
        'Automatic Receivables Tracking',
      ],
    },
    {
      logo: '/images/value-proposition/values-icon-2.svg',
      title: 'Credit Readiness',
      list: [
        'Financial Pilot Credit Score (0–100)',
        '4-Factor Financial Health Breakdown',
        'Gemini AI Improvement Roadmap',
      ],
    },
    {
      logo: '/images/value-proposition/values-icon-3.svg',
      title: 'Compliance & Guard',
      list: [
        'Anomaly & Irregularity Detector',
        'Live Tax Liability Estimates',
        'Export-Ready Accountant Portal',
      ],
    },
    {
      logo: '/images/value-proposition/values-icon-4.svg',
      title: 'Procurement AI',
      list: [
        'Vendor Reorder Alerts',
        'Group Buying Opportunities',
        'Supplier Negotiation Co-Pilot',
      ],
    },
  ];

  return (
    <section className="section py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="section-intro text-center mb-12">
          <h2 className="text-h3 lg:text-h2 font-secondary font-bold text-white mb-4">
            Replace Complex Spreadsheets With a <strong className="text-primary font-normal">Smart Financial Co-Pilot</strong>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Everything your growing business needs to monitor runway, qualify for financing, and optimize expenses — in one unified dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.title} className="p-8 rounded-3xl bg-white/5 border border-border hover:border-primary/40 transition-colors">
              <img src={item.logo} alt={item.title} className="mb-6 size-12" />
              <h3 className="text-lg font-bold font-secondary text-white mb-4">{item.title}</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                {item.list.map((li) => (
                  <li key={li} className="flex items-center gap-2">
                    <svg className="size-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
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
