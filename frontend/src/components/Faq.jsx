import { useState } from 'react';

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does the Cash Flow Forecaster project my balance?',
      a: 'Financial Pilot analyzes your historical ledger transactions stored in local CSV files, calculates 90-day moving averages of income and operational expenses, and applies statistical volatility modeling to generate 7 to 90-day projections with automatic early warning flags.',
    },
    {
      q: 'What is the Credit Readiness Score based on?',
      a: 'The 0–100 score benchmarks four core lending criteria: monthly revenue consistency (coefficient of variation), net profit margin, accounts receivable collection speed, and cost discipline ratios. Gemini AI then generates custom 90-day improvement action steps.',
    },
    {
      q: 'Where is my financial data stored?',
      a: 'During our Phase 1 MVP, all data resides locally on your machine in the /backend/data/ directory using standard Pandas CSV contracts. No proprietary banking credentials or sensitive ledger details leave your server.',
    },
    {
      q: 'How does Financial Pilot decouple its data architecture and modules?',
      a: 'Financial Pilot enforces a strict Function Contract: all analytical modules expose pure Python functions returning pure JSON-serializable dictionaries or DataFrames. UI pages only call those pure functions via FastAPI endpoints.',
    },
  ];

  return (
    <section className="section py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="section-intro text-center mb-12">
          <h2 className="text-h3 lg:text-h2 font-secondary font-bold text-white mb-4">
            Frequently Asked <strong className="text-primary font-normal">Questions</strong>
          </h2>
          <p className="text-slate-300 text-base">
            Everything you need to know about Financial Pilot’s architecture and financial co-pilot engine.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="rounded-3xl bg-light border border-border overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full p-6 text-left flex items-center justify-between text-white font-semibold font-secondary text-base cursor-pointer"
              >
                <span>{f.q}</span>
                <span className="text-primary text-xl font-mono">{openIdx === i ? '−' : '+'}</span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-border/40 pt-4">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
