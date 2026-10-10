import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTaxSummary } from '../api/client';
import { IconTaxAssistant, IconAiSparkle } from './Icons';
import { useLanguage } from '../context/LanguageContext';

// Helper to parse inline markdown bold syntax **bold text** into styled React elements
const renderFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      // Check if it's currency or numbers
      const isNumber = /^\$?[0-9,.]+%?$/.test(boldText);
      return (
        <strong
          key={index}
          className={`font-semibold ${
            isNumber ? 'text-white font-mono' : 'text-white'
          }`}
        >
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

export default function TaxAssistant() {
  const { t, translateGeminiContent } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deadlineFilter, setDeadlineFilter] = useState('ALL');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTaxSummary();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load tax and compliance summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Global sync listener
  useEffect(() => {
    const handleRefresh = () => {
      fetchData();
    };
    window.addEventListener('finpilot:refresh', handleRefresh);
    return () => window.removeEventListener('finpilot:refresh', handleRefresh);
  }, [fetchData]);

  // Deadlines filtering
  const filteredDeadlines = useMemo(() => {
    if (!data?.filing_deadlines) return [];
    if (deadlineFilter === 'ALL') return data.filing_deadlines;
    if (deadlineFilter === 'FEDERAL') {
      return data.filing_deadlines.filter((d) => d.category?.toLowerCase().includes('federal'));
    }
    if (deadlineFilter === 'STATE_PAYROLL') {
      return data.filing_deadlines.filter(
        (d) =>
          d.category?.toLowerCase().includes('state') ||
          d.category?.toLowerCase().includes('payroll') ||
          d.category?.toLowerCase().includes('annual')
      );
    }
    return data.filing_deadlines;
  }, [data, deadlineFilter]);

  // Functional Download Summary Report Handler
  const handleDownloadReport = () => {
    if (!data) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `FinPilot_Tax_Compliance_Report_${timestamp.slice(0, 10)}.txt`;

    const reportContent = `================================================================================
FINPILOT — CORPORATE TAX & REGULATORY COMPLIANCE REPORT
Generated for: Accounting & CPA Advisory Team
Generated Date: ${data.generated_at || new Date().toLocaleString()}
Business Context: Garment Manufacturing & Apparel Operations
================================================================================

1. FINANCIAL & TAX LIABILITY METRICS
--------------------------------------------------------------------------------
Gross Revenue (YTD):              Rs. ${Number(data.revenue_ytd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Deductible Expenses:        Rs. ${Number(data.deductible_total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Net Taxable Operating Income:     Rs. ${Number(data.net_taxable_income || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
--------------------------------------------------------------------------------
Estimated Corporate Tax (26.0%):  Rs. ${Number(data.corporate_tax || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Estimated Sales & Use Tax (4.0%): Rs. ${Number(data.sales_tax || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Total Estimated Tax Liability:    Rs. ${Number(data.estimated_tax_due || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Prior Tax Remittances / Credits:  Rs. ${Number(data.prior_tax_paid || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Net Estimated Balance Due:        Rs. ${Number(data.net_balance_due || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Effective Tax Rate:               ${data.effective_tax_rate || 26.0}%


2. DEDUCTIBLE OPERATIONAL SCHEDULE (IRC SEC. 162 & COGS)
--------------------------------------------------------------------------------
${Object.entries(data.deductibles_breakdown || {})
  .map(([cat, amt]) => `* ${cat.padEnd(25)}: Rs. ${Number(amt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
  .join('\n')}


3. UPCOMING REGULATORY FILING DEADLINES
--------------------------------------------------------------------------------
${(data.filing_deadlines || [])
  .map(
    (dl, i) =>
      `[${i + 1}] ${dl.event} (${dl.form})
    Category:       Rs. {dl.category}
    Due Date:       Rs. {dl.due_date} (Rs. {dl.days_remaining} days remaining - Rs. {dl.urgency})
    Description:    ${dl.description}`
  )
  .join('\n\n')}


4. GEMINI AI EXECUTIVE TAX MEMORANDUM FOR ACCOUNTANTS
--------------------------------------------------------------------------------
${data.accountant_summary || 'Executive summary unavailable.'}

================================================================================
CONFIDENTIAL — PREPARED EXCLUSIVELY FOR FINANCIAL AUDIT & TAX FILING
================================================================================
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleCopySummary = () => {
    if (!data?.accountant_summary) return;
    navigator.clipboard.writeText(data.accountant_summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const deductibles = data?.deductibles_breakdown || {};
  const totalDeductibleVal = data?.deductible_total || 1;

  // Structured breakdown of accountant summary sections
  const parsedSummary = useMemo(() => {
    if (!data?.accountant_summary) return null;
    const raw = data.accountant_summary;

    // Check if it follows standard section format
    const sec1Match = raw.match(/####\s*1\.\s*Executive Summary[^\n]*\n([\s\S]*?)(?=####\s*2\.|$)/i);
    const sec2Match = raw.match(/####\s*2\.\s*Deductible Expense[^\n]*\n([\s\S]*?)(?=####\s*3\.|$)/i);
    const sec3Match = raw.match(/####\s*3\.\s*Regulatory Filing[^\n]*\n([\s\S]*?)(?=$)/i);

    return {
      sec1: sec1Match ? sec1Match[1].trim() : null,
      sec2: sec2Match ? sec2Match[1].trim() : null,
      sec3: sec3Match ? sec3Match[1].trim() : null,
      raw: raw,
    };
  }, [data?.accountant_summary]);

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-secondary/30 text-xs text-secondary-light mb-3 font-semibold">
            <IconTaxAssistant className="size-4" />
            {t('tax_badge', 'Compliance & Statutory Accounting Engine')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
            {t('tax_title_1', 'Tax & Compliance')}{' '}
            <span className="text-secondary-light font-normal">{t('tax_title_2', 'Assistant')}</span>
          </h1>
          <p className="text-sm text-text-dark mt-1">
            {t(
              'tax_subtitle',
              'Manufacturing tax liability computation, deductible expense aggregation, and regulatory countdown tracker'
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={!data || loading}
            className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            {t('tax_download_report', 'Download Summary Report')}
          </button>

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="btn-outline px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
            title="Refresh Tax Calculations"
          >
            <svg className={`size-4 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Download Alert Banner */}
      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary-light text-xs flex items-center gap-3 animate-fadeIn">
          <span className="text-base font-bold">✓</span>
          <span>{t('tax_download_success', 'Tax & Compliance Executive Summary Report downloaded successfully to your computer.')}</span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 flex items-start gap-4">
          <div className="size-10 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-bold text-lg">
            !
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">{t('tax_engine_error', 'Tax Engine Error')}</h4>
            <p className="text-xs text-text-dark">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-8 animate-pulse">
          {/* Top KPI Skeleton Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-3xl bg-light border border-border p-6 space-y-3">
                <div className="h-3 w-28 bg-white/10 rounded"></div>
                <div className="h-9 w-36 bg-white/20 rounded"></div>
                <div className="h-3 w-44 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>

          {/* Section 1 & 2 Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 rounded-4xl bg-light border border-border p-8 space-y-6">
              <div className="h-6 w-56 bg-white/15 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-white/5 rounded-2xl"></div>
                <div className="h-24 bg-white/5 rounded-2xl"></div>
              </div>
              <div className="space-y-3 pt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 bg-white/5 rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 rounded-4xl bg-light border border-border p-8 space-y-4">
              <div className="h-6 w-48 bg-white/15 rounded"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-white/5 rounded-2xl"></div>
              ))}
            </div>
          </div>

          {/* Section 3 Skeleton: AI Memo */}
          <div className="rounded-4xl bg-light border border-border p-8 space-y-4">
            <div className="h-6 w-64 bg-white/15 rounded"></div>
            <div className="h-20 bg-white/5 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-40 bg-white/5 rounded-2xl"></div>
              <div className="h-40 bg-white/5 rounded-2xl"></div>
              <div className="h-40 bg-white/5 rounded-2xl"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Top KPI Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-3xl card-electric p-6 relative overflow-hidden">
              <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">
                {t('tax_next_filing', 'Estimated Tax Due')}
              </div>
              <div className="text-3xl font-bold font-secondary text-secondary-light font-mono">
                Rs. {data?.estimated_tax_due?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-text-dark mt-2 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-secondary-light"></span>
                {t('tax_rate_breakdown', 'Federal 21% + State 5% + Sales Tax')}
              </div>
            </div>

            <div className="rounded-3xl card-electric p-6 relative overflow-hidden">
              <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">
                {t('tax_deductibles', 'Total Deductibles')}
              </div>
              <div className="text-3xl font-bold font-secondary text-secondary-light font-mono">
                Rs. {data?.deductible_total?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-secondary-light/80 mt-2 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-secondary-light"></span>
                {t('tax_irc_eligible', 'Eligible IRC Sec. 162 & COGS Write-offs')}
              </div>
            </div>

            <div className="rounded-3xl card-electric p-6 relative overflow-hidden">
              <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">
                {t('tax_taxable_inc', 'Net Taxable Profit')}
              </div>
              <div className="text-3xl font-bold font-secondary text-white font-mono">
                Rs. {data?.net_taxable_income?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-text-dark mt-2">
                {t('tax_rev_less_ded', 'Revenue')} (Rs. {(data?.revenue_ytd / 1000000).toFixed(2)}M) {t('tax_less_ded', 'less Deductions')}
              </div>
            </div>

            <div className="rounded-3xl card-electric p-6 relative overflow-hidden">
              <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">
                {t('tax_gross_rev', 'Effective Provision Rate')}
              </div>
              <div className="text-3xl font-bold font-secondary text-white font-mono">
                {data?.effective_tax_rate || 26.0}%
              </div>
              <div className="text-xs text-text-dark mt-2">
                {t('tax_net_due', 'Net Outstanding Due:')} <strong className="text-white font-mono">Rs. {data?.net_balance_due?.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Section 1 & 2: Tax Estimate Card & Deadline Calendar View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 1. Tax Estimate Card (7 cols) */}
            <div className="lg:col-span-7 rounded-4xl card-electric p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
                <div>
                  <h3 className="text-xl font-bold font-secondary text-white">
                    {t('tax_liability_breakdown', 'Tax Liability & Deductible Breakdown')}
                  </h3>
                  <p className="text-xs text-text-dark mt-0.5">
                    {t('tax_cost_accounting_guide', 'Garment manufacturing cost accounting according to statutory guidelines')}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/35 text-xs font-semibold text-secondary-light self-start">
                  {t('tax_combined_rate', 'Combined 26.0% Rate')}
                </div>
              </div>

              {/* High-level Tax Summary Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-border space-y-1.5">
                  <div className="text-xs text-text-dark font-medium">{t('tax_est_corp_tax', 'Estimated Corporate Income Tax')}</div>
                  <div className="text-2xl font-bold font-mono text-white">
                    Rs. {data?.corporate_tax?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-text-dark">{t('tax_fed_state', 'Federal (21%) + State Franchise (5%)')}</div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-border space-y-1.5">
                  <div className="text-xs text-text-dark font-medium">{t('tax_sales_provision', 'Sales & Use Tax Provision')}</div>
                  <div className="text-2xl font-bold font-mono text-white">
                    Rs. {data?.sales_tax?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-text-dark">{t('tax_sales_goods', '~4.0% provision on finished goods sales')}</div>
                </div>
              </div>

              {/* Deductible Breakdown Bars */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white uppercase tracking-wider">{t('tax_qualifying_deductibles', 'Qualifying Deductible Expenses')}</span>
                  <span className="text-secondary-light font-mono">Rs. {data?.deductible_total?.toLocaleString()} {t('tax_total', 'Total')}</span>
                </div>

                <div className="space-y-3.5">
                  {Object.entries(deductibles).map(([category, amount]) => {
                    const pct = totalDeductibleVal > 0 ? (amount / totalDeductibleVal) * 100 : 0;
                    let label = category;
                    let subtext = t('tax_std_ded', 'Standard Deduction');
                    if (category === 'Supplier Payment') {
                      label = t('tax_cogs_label', 'Raw Materials & Textiles (COGS)');
                      subtext = t('tax_cogs_sub', 'Direct fabric, trim & thread spend');
                    } else if (category === 'Salaries') {
                      label = t('tax_payroll_label', 'Manufacturing Payroll');
                      subtext = t('tax_payroll_sub', 'Sewing operators, cutters, patternmakers');
                    } else if (category === 'Rent') {
                      label = t('tax_lease_label', 'Plant Facility Lease');
                      subtext = t('tax_lease_sub', 'Factory floor and warehouse space');
                    } else if (category === 'Utilities') {
                      label = t('tax_power_label', 'Industrial Steam & Power');
                      subtext = t('tax_power_sub', 'High-voltage cutting & plant electricity');
                    } else if (category === 'Marketing') {
                      label = t('tax_marketing_label', 'Wholesale Promotion');
                      subtext = t('tax_marketing_sub', 'Trade shows & apparel showrooms');
                    }

                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-text-light">{label}</span>
                            <span className="text-text-dark ml-2 text-[11px] hidden sm:inline">• {subtext}</span>
                          </div>
                          <div className="font-mono text-white font-semibold">
                            Rs. {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className="text-text-dark font-normal text-[11px] ml-1.5">({pct.toFixed(1)}%)</span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Prior Taxes Remitted Callout */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-secondary-light font-bold">ℹ</span>
                  <span className="text-text-dark">{t('tax_prior_prepayments', 'Recorded Tax Prepayments / Withholdings:')}</span>
                </div>
                <span className="font-mono font-semibold text-white">
                  Rs. {data?.prior_tax_paid?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* 2. Deadline Calendar View (5 cols) */}
            <div className="lg:col-span-5 rounded-4xl card-electric p-8 space-y-6 flex flex-col">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <h3 className="text-xl font-bold font-secondary text-white">
                    {t('tax_all_deadlines', 'Compliance Deadlines')}
                  </h3>
                  <p className="text-xs text-text-dark mt-0.5">
                    Regulatory calendar with dynamic countdown
                  </p>
                </div>

                <div className="size-8 rounded-full bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-xs font-mono">
                  {filteredDeadlines.length}
                </div>
              </div>

              {/* Deadline Filter Tabs */}
              <div className="flex gap-2">
                {[
                  { key: 'ALL', label: t('tax_all_deadlines', 'All') },
                  { key: 'FEDERAL', label: t('tax_federal', 'Federal') },
                  { key: 'STATE_PAYROLL', label: t('tax_state_payroll', 'State & Payroll') },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDeadlineFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      deadlineFilter === tab.key
                        ? 'btn-primary text-white'
                        : 'bg-white/5 border border-border text-text-dark hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Interactive Timeline List */}
              <div className="space-y-4 overflow-y-auto max-h-[460px] pr-1">
                {filteredDeadlines.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="size-10 rounded-full bg-white/5 text-text-dark mx-auto flex items-center justify-center text-sm">
                      ✓
                    </div>
                    <div className="text-xs font-semibold text-white">No filing deadlines in this category</div>
                    <p className="text-[11px] text-text-dark max-w-xs mx-auto">
                      All statutory deadlines for this category are compliant or not scheduled.
                    </p>
                  </div>
                ) : (
                  filteredDeadlines.map((item, index) => {
                  const isUrgent = item.days_remaining <= 30;
                  const isApproaching = item.days_remaining <= 60 && !isUrgent;

                  return (
                    <div
                      key={item.id || index}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-border hover:border-primary/40 transition-colors space-y-2 relative"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-bold text-white leading-snug">
                            {item.event}
                          </div>
                          <div className="text-[11px] text-text-dark mt-0.5 flex items-center gap-1.5">
                            <span className="font-mono text-secondary-light font-semibold">{item.form}</span>
                            <span>•</span>
                            <span>{item.category}</span>
                          </div>
                        </div>

                        {/* Countdown Pill */}
                        <div
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold shrink-0 font-mono ${
                            isUrgent
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : isApproaching
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : 'bg-secondary/15 text-secondary-light border border-secondary/30'
                          }`}
                        >
                          {item.days_remaining}d left
                        </div>
                      </div>

                      <p className="text-[11px] text-text leading-relaxed">
                        {item.description}
                      </p>

                      <div className="text-[10px] text-text-dark pt-1 flex items-center justify-between border-t border-white/5">
                        <span>Statutory Due Date:</span>
                        <strong className="text-text-light font-mono">{item.due_date}</strong>
                      </div>
                    </div>
                  );
                })
              )}
              </div>
            </div>
          </div>

          {/* Section 3: Redesigned Executive Accountant Summary Section */}
          <div className="rounded-4xl card-electric overflow-hidden relative shadow-2xl">
            {/* Top Header & Action Bar */}
            <div className="p-6 lg:p-8 border-b border-border bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary-light shadow-lg shadow-secondary/20">
                  <IconAiSparkle className="size-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary-light text-[11px] font-semibold mb-1">
                    <span className="size-1.5 rounded-full bg-secondary-light animate-pulse"></span>
                    {t('tax_ai_memo_badge', 'Gemini AI Advisory • Audit-Ready CPA Workpaper')}
                  </div>
                  <h3 className="text-2xl font-bold font-secondary text-white tracking-tight">
                    {t('tax_ai_memo_title', 'Executive Tax Memorandum & Compliance Summary')}
                  </h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 self-start md:self-auto">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-border text-zinc-300 hover:text-white hover:border-primary/50 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <span className="text-secondary-light font-bold">✓</span>
                      <span className="text-secondary-light">{t('tax_copied', 'Copied')}</span>
                    </>
                  ) : (
                    <>
                      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      {t('tax_copy_memo', 'Copy Memo')}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadReport}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/20 transition-all"
                >
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  {t('tax_download_report_btn', 'Download Report')}
                </button>
              </div>
            </div>

            {/* Memorandum Metadata Header Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 lg:p-8 bg-white/[0.015] border-b border-border">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/80">
                <div className="text-[11px] uppercase tracking-wider text-text-dark font-medium mb-1">{t('tax_memo_to', 'To: Recipient')}</div>
                <div className="text-xs font-semibold text-white">{t('tax_cpa_team', 'Lead Corporate CPA')}</div>
                <div className="text-[11px] text-zinc-400">{t('tax_advisory_team', '& Financial Advisory Team')}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/80">
                <div className="text-[11px] uppercase tracking-wider text-text-dark font-medium mb-1">{t('tax_memo_entity', 'Entity / Organization')}</div>
                <div className="text-xs font-semibold text-white">FinPilot Garment Mfg.</div>
                <div className="text-[11px] text-zinc-400">{t('tax_apparel_ops', 'Apparel Operations')}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/80">
                <div className="text-[11px] uppercase tracking-wider text-text-dark font-medium mb-1">{t('tax_memo_period', 'Reporting Period')}</div>
                <div className="text-xs font-semibold text-white font-mono">Fiscal YTD 2024</div>
                <div className="text-[11px] text-secondary-light">{t('tax_books_verified', 'Books Closed & Verified')}</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-border/80">
                <div className="text-[11px] uppercase tracking-wider text-text-dark font-medium mb-1">{t('tax_memo_audit', 'Audit Authority')}</div>
                <div className="text-xs font-semibold text-secondary-light">IRC Sec. 162 &amp; COGS</div>
                <div className="text-[11px] text-zinc-400">{t('tax_safe_harbor', 'Safe-Harbor Compliant')}</div>
              </div>
            </div>

            {/* Content Sections Container */}
            <div className="p-6 lg:p-8 space-y-6">
              {parsedSummary?.sec1 ? (
                <>
                  {/* Section 1 Card */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4 hover:border-secondary/40 transition-colors">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-xs">
                          1
                        </div>
                        <h4 className="text-base font-bold font-secondary text-white">
                          {t('tax_sec1_title', 'Executive Summary & Tax Liability Posture')}
                        </h4>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary-light border border-secondary/30 font-semibold font-mono">
                        {t('tax_net_bal_label', 'Net Balance:')} Rs. {data?.net_balance_due?.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                      {renderFormattedText(translateGeminiContent(parsedSummary.sec1))}
                    </p>

                    {/* Tax Liability Quick Math Callout */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-border/60">
                        <div className="text-text-dark text-[11px]">{t('tax_gross_rev_col', 'Gross Revenue')}</div>
                        <div className="font-mono font-semibold text-white mt-0.5">Rs. {data?.revenue_ytd?.toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-border/60">
                        <div className="text-text-dark text-[11px]">{t('tax_net_tax_base', 'Net Taxable Base')}</div>
                        <div className="font-mono font-semibold text-white mt-0.5">Rs. {data?.net_taxable_income?.toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-border/60">
                        <div className="text-text-dark text-[11px]">{t('tax_est_tot_tax', 'Est. Total Tax')}</div>
                        <div className="font-mono font-semibold text-secondary-light mt-0.5">Rs. {data?.estimated_tax_due?.toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-border/60">
                        <div className="text-text-dark text-[11px]">{t('tax_prior_remit', 'Prior Remittances')}</div>
                        <div className="font-mono font-semibold text-secondary-light mt-0.5">-Rs. {data?.prior_tax_paid?.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 Card */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4 hover:border-secondary/40 transition-colors">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-xs">
                          2
                        </div>
                        <h4 className="text-base font-bold font-secondary text-white">
                          {t('tax_sec2_title', 'Deductible Expense Classification & Audit Readiness')}
                        </h4>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary-light border border-secondary/30 font-semibold font-mono">
                        Rs. {data?.deductible_total?.toLocaleString()} {t('tax_qualified', 'Qualified')}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                      {t('tax_sec2_desc', 'Operational deductions reflect audited garment manufacturing cost allocations across statutory categories:')}
                    </p>

                    {/* Categorized Visual Deduction Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      <div className="p-4 rounded-2xl bg-white/[0.015] border border-border/60 flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-secondary/15 text-secondary-light flex items-center justify-center shrink-0 text-sm font-bold">
                          🧵
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{t('tax_cogs_title', 'Raw Materials & Supplies (COGS)')}</div>
                          <div className="font-mono text-sm font-bold text-secondary-light mt-0.5">
                            Rs. {deductibles['Supplier Payment']?.toLocaleString()}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                            {t('tax_cogs_memo_sub', 'Direct textile, trim, and fabric procurement. Under IRC Sec. 471, maintain closing inventory reconciliations.')}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.015] border border-border/60 flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-secondary/15 text-secondary-light flex items-center justify-center shrink-0 text-sm font-bold">
                          👥
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{t('tax_direct_payroll', 'Direct & Operational Payroll')}</div>
                          <div className="font-mono text-sm font-bold text-secondary-light mt-0.5">
                            Rs. {deductibles['Salaries']?.toLocaleString()}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                            {t('tax_payroll_memo_sub', 'Plant floor sewing operators, machine mechanics, and supervisors. Reconciled with quarterly Form 941 filings.')}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.015] border border-border/60 flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-secondary/15 text-secondary-light flex items-center justify-center shrink-0 text-sm font-bold">
                          🏭
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{t('tax_facility_overhead', 'Facility & Production Overhead')}</div>
                          <div className="font-mono text-sm font-bold text-secondary-light mt-0.5">
                            Rs. {((deductibles['Rent'] || 0) + (deductibles['Utilities'] || 0)).toLocaleString()}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                            {t('tax_lease_memo_sub', 'Factory warehouse lease and high-voltage cutting power.')}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/[0.015] border border-border/60 flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-secondary/15 text-secondary-light flex items-center justify-center shrink-0 text-sm font-bold">
                          📢
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{t('tax_wholesale_dist', 'Wholesale Distribution & SG&A')}</div>
                          <div className="font-mono text-sm font-bold text-secondary-light mt-0.5">
                            Rs. {deductibles['Marketing']?.toLocaleString()}
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-normal">
                            {t('tax_wholesale_sub', 'Apparel trade show exhibits, showroom space, and B2B catalog marketing campaigns.')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 Card */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4 hover:border-secondary/40 transition-colors">
                    <div className="flex items-center justify-between pb-3 border-b border-border/60">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-xs">
                          3
                        </div>
                        <h4 className="text-base font-bold font-secondary text-white">
                          {t('tax_sec3_title', 'Regulatory Filing Calendar & Safe-Harbor Action Plan')}
                        </h4>
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary-light border border-secondary/30 font-semibold font-mono">
                        {data?.filing_deadlines?.[0]?.days_remaining} {t('tax_days_next', 'Days to Next Filing')}
                      </span>
                    </div>

                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                      {renderFormattedText(translateGeminiContent(parsedSummary.sec3))}
                    </p>

                    {/* Action Plan Step Items */}
                    <div className="space-y-2.5 pt-1">
                      <div className="p-3.5 rounded-xl bg-white/[0.015] border border-border/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="size-5 rounded-full bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-[10px]">✓</span>
                          <span className="text-zinc-200">{t('tax_plan_1', 'Prepayment Safe-Harbor: Remit quarterly installment to satisfy 100% prior-year safe harbor')}</span>
                        </div>
                        <span className="text-[11px] text-text-dark font-mono">{t('tax_required', 'Required')}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.015] border border-border/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="size-5 rounded-full bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-[10px]">✓</span>
                          <span className="text-zinc-200">{t('tax_plan_2', 'COGS Documentation: Preserve itemized supplier invoices for all fabric disbursements > $2,500')}</span>
                        </div>
                        <span className="text-[11px] text-text-dark font-mono">{t('tax_audit_record', 'Audit Record')}</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.015] border border-border/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="size-5 rounded-full bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-[10px]">✓</span>
                          <span className="text-zinc-200">{t('tax_plan_3', 'Form 941 Reconciliation: Tie payroll clearing entries to State Unemployment insurance filings')}</span>
                        </div>
                        <span className="text-[11px] text-text-dark font-mono">{t('tax_scheduled', 'Scheduled')}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Fallback for Dynamic Custom Summary */
                <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4">
                  {data?.accountant_summary ? (
                    data.accountant_summary
                      .split('\n\n')
                      .filter((p) => !p.startsWith('### ') && !p.startsWith('**To:') && !p.startsWith('---'))
                      .map((paragraph, idx) => (
                        <p key={idx} className="text-zinc-300 text-sm leading-relaxed">
                          {renderFormattedText(translateGeminiContent(paragraph))}
                        </p>
                      ))
                  ) : (
                    <p className="text-text-dark italic">{t('tax_generating', 'Generating tax summary...')}</p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom CPA Compliance Footer */}
            <div className="p-6 border-t border-border bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between text-xs text-text-dark gap-3">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-secondary-light"></span>
                <span className="text-zinc-300 font-medium">{t('tax_irc_verified', 'Calculations verified against IRC Sec. 162 & Manufacturing COGS provisions')}</span>
              </div>
              <div className="font-mono text-[11px] text-zinc-400">
                Workpaper ID: FIN-TAX-{data?.generated_at?.slice(0, 10) || '2024'} • GAAP Manufacturing Ledger
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
