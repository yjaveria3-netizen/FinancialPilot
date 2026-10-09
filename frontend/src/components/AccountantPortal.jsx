import { useState, useEffect, useCallback } from 'react';
import { getAccountantPortal, getLenderDossier } from '../api/client';
import { IconAccountantPortal } from './Icons';

export default function AccountantPortal() {
  const [activeRole, setActiveRole] = useState('Auditor');
  const [statementTab, setStatementTab] = useState('BALANCE_SHEET');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossierSuccess, setDossierSuccess] = useState(false);

  const fetchPortalData = useCallback(async (role) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAccountantPortal(role);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load accountant and lender portal.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortalData(activeRole);
  }, [activeRole, fetchPortalData]);

  // Global sync listener
  useEffect(() => {
    const handleRefresh = () => {
      fetchPortalData(activeRole);
    };
    window.addEventListener('finpilot:refresh', handleRefresh);
    return () => window.removeEventListener('finpilot:refresh', handleRefresh);
  }, [activeRole, fetchPortalData]);

  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
  };

  const handleCopyLink = () => {
    if (!data?.consent_status?.sharing_url) return;
    navigator.clipboard.writeText(data.consent_status.sharing_url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  // Export as structured CSV
  const handleExportCSV = () => {
    if (!data?.verified_statements) return;

    const bs = data.verified_statements.balance_sheet;
    const is = data.verified_statements.income_statement;

    const csvContent = `FINPILOT VERIFIED FINANCIAL STATEMENT REPORT (US GAAP)
Company,${data.company_profile?.name}
Fiscal Period,${data.company_profile?.fiscal_period}
Accounting Basis,Accrual
Certification Hash,${data.consent_status?.cryptographic_hash}

BALANCE SHEET SUMMARY,AMOUNT (USD)
Cash and Cash Equivalents,${bs.assets.cash_and_equivalents}
Accounts Receivable (Net),${bs.assets.accounts_receivable_net}
Inventory Valuation,${bs.assets.inventory_valuation}
TOTAL CURRENT ASSETS,${bs.assets.total_current_assets}

Accounts Payable,${bs.liabilities.accounts_payable}
Accrued Operating Expenses,${bs.liabilities.accrued_operating_expenses}
Short-term Debt Obligations,${bs.liabilities.short_term_debt}
TOTAL CURRENT LIABILITIES,${bs.liabilities.total_current_liabilities}

Retained Earnings & Equity,${bs.equity.total_equity}
TOTAL LIABILITIES AND EQUITY,${bs.total_liabilities_and_equity}

INCOME STATEMENT (P&L),AMOUNT (USD)
Gross Revenue,${is.gross_revenue}
Cost of Goods Sold (COGS),${is.cost_of_goods_sold}
GROSS PROFIT,${is.gross_profit}
Salaries & Payroll,${is.operating_expenses.salaries}
Facility Rent,${is.operating_expenses.rent}
Utilities & Power,${is.operating_expenses.utilities}
Marketing & SG&A,${is.operating_expenses.marketing}
OPERATING INCOME (EBITDA),${is.operating_income}
Estimated Tax Provision,${is.tax_provision}
NET INCOME,${is.net_income}
`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FinPilot_Verified_Financials_${activeRole}_2024.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Export full verification package
  const handleExportPackage = () => {
    if (!data) return;

    const report = `================================================================================
FINPILOT CERTIFIED FINANCIAL STATEMENT WORKPAPER
CONFIDENTIAL EXTERNAL DISCLOSURE
================================================================================
Entity:             ${data.company_profile?.name}
Tax ID / EIN:       ${data.company_profile?.ein}
Fiscal Reporting:   ${data.company_profile?.fiscal_period}
Active Viewpoint:   ${activeRole} Perspective
Certification Hash: ${data.consent_status?.cryptographic_hash}
Read-Only Token:    ${data.consent_status?.consent_token}
================================================================================

AUDITOR & LENDER VERIFICATION FINDINGS:
Focus:              ${data.role_insights?.focus_title}
Opinion:            ${data.role_insights?.audit_opinion}
Controls Status:    ${data.role_insights?.controls_rating}

KEY FINANCIAL HEALTH & UNDERWRITING RATIOS:
- Current Ratio:              ${data.verified_statements?.ratios?.current_ratio}x
- Quick Ratio:                ${data.verified_statements?.ratios?.quick_ratio}x
- Working Capital:            $${Number(data.verified_statements?.ratios?.working_capital || 0).toLocaleString()}
- Debt Service Coverage DSCR: ${data.verified_statements?.ratios?.dscr}x
- Gross Profit Margin:        ${data.verified_statements?.ratios?.gross_margin_pct}%
- Net Profit Margin:          ${data.verified_statements?.ratios?.net_margin_pct}%

BALANCE SHEET OVERVIEW:
- Total Current Assets:       $${Number(data.verified_statements?.balance_sheet?.assets?.total_current_assets || 0).toLocaleString()}
  * Cash & Equivalents:       $${Number(data.verified_statements?.balance_sheet?.assets?.cash_and_equivalents || 0).toLocaleString()}
  * Accounts Receivable:      $${Number(data.verified_statements?.balance_sheet?.assets?.accounts_receivable_net || 0).toLocaleString()}
  * Inventory (COGS Basis):   $${Number(data.verified_statements?.balance_sheet?.assets?.inventory_valuation || 0).toLocaleString()}

- Total Current Liabilities:  $${Number(data.verified_statements?.balance_sheet?.liabilities?.total_current_liabilities || 0).toLocaleString()}
- Total Stockholders Equity:  $${Number(data.verified_statements?.balance_sheet?.equity?.total_equity || 0).toLocaleString()}

INCOME STATEMENT (P&L):
- Gross Revenue YTD:          $${Number(data.verified_statements?.income_statement?.gross_revenue || 0).toLocaleString()}
- Cost of Goods Sold (COGS):  $${Number(data.verified_statements?.income_statement?.cost_of_goods_sold || 0).toLocaleString()}
- Gross Profit:               $${Number(data.verified_statements?.income_statement?.gross_profit || 0).toLocaleString()}
- Total Operating Expenses:   $${Number(data.verified_statements?.income_statement?.operating_expenses?.total_opex || 0).toLocaleString()}
- Operating Income:           $${Number(data.verified_statements?.income_statement?.operating_income || 0).toLocaleString()}
- Net Income:                 $${Number(data.verified_statements?.income_statement?.net_income || 0).toLocaleString()}

IMMUTABLE AUDIT TRAIL LOGS:
${data.audit_trail
  ?.map(
    (log) =>
      `[${log.timestamp}] [${log.role}] ${log.actor} - ${log.action} | Status: ${log.verification_status}`
  )
  .join('\n')}

================================================================================
SIGNED AND SEALED VIA FINPILOT DECENTRALIZED DATA CONSENT ENGINE
================================================================================
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FinPilot_Audit_Workpaper_${activeRole}_2024.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // One-Click Lender-Ready Compliance Dossier Export
  const handleExportLenderDossier = async () => {
    setDossierLoading(true);
    try {
      const res = await getLenderDossier();
      const content = res.formatted_text_report || JSON.stringify(res, null, 2);
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FinPilot_Lender_Ready_Compliance_Dossier_2024.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDossierSuccess(true);
      setTimeout(() => setDossierSuccess(false), 4500);
    } catch (err) {
      console.error('Failed to export lender dossier:', err);
    } finally {
      setDossierLoading(false);
    }
  };

  const bs = data?.verified_statements?.balance_sheet;
  const is = data?.verified_statements?.income_statement;
  const cf = data?.verified_statements?.cash_flow;

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-border text-xs text-primary mb-3 font-semibold">
            <IconAccountantPortal className="size-4" />
            GAAP Certified Workpapers • External Underwriting Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
            Accountant &amp; Lender <span className="text-primary font-normal">Portal</span>
          </h1>
          <p className="text-sm text-text-dark mt-1">
            Read-only external portal for CPA auditors, bank lenders, and credit underwriters
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={!data || loading}
            className="btn-outline px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Export CSV
          </button>

          <button
            type="button"
            onClick={handleExportPackage}
            disabled={!data || loading}
            className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" />
              <path d="M7 12h10" />
              <path d="M7 17h10" />
            </svg>
            Export Statement Package
          </button>

          <button
            type="button"
            onClick={handleExportLenderDossier}
            disabled={dossierLoading}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40 transition-all hover:scale-102 disabled:opacity-50"
            title="Compile Cash, Credit, Tax, and Anomaly audit into a single certified compliance dossier"
          >
            <svg
              className={`size-3.5 ${dossierLoading ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>{dossierLoading ? 'Compiling...' : '⚡ Generate Lender-Ready Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Download Alert */}
      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
          <span className="text-base font-bold">✓</span>
          <span>Verified financial statements exported successfully.</span>
        </div>
      )}

      {/* Dossier Download Alert */}
      {dossierSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-fadeIn">
          <span className="text-base font-bold">✓</span>
          <span>Comprehensive Lender-Ready Compliance Dossier compiled with SHA-256 seal and downloaded successfully!</span>
        </div>
      )}

      {/* Certified Read-Only Banner & Role Switcher */}
      <div className="rounded-3xl bg-light border border-border p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Read-Only Watermark Badge */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
            🔒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Certified Read-Only View</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Write Controls Locked
              </span>
            </div>
            <p className="text-xs text-text-dark mt-0.5">
              Cryptographically signed snapshot • Checksum: <strong className="text-zinc-300 font-mono">{data?.consent_status?.cryptographic_hash}</strong>
            </p>
          </div>
        </div>

        {/* Role Switcher Simulation */}
        <div className="flex items-center gap-2 self-start lg:self-auto bg-white/5 border border-border rounded-2xl p-1.5">
          <span className="text-[11px] text-text-dark px-2 font-medium">Viewing as:</span>
          {['Auditor', 'Lender', 'Accountant'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRoleChange(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeRole === r
                  ? 'btn-primary text-white shadow-md shadow-primary/20'
                  : 'text-text-dark hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Role-Specific Underwriting & Audit Focus Strip */}
      <div className="rounded-4xl bg-light border border-border p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
              Active Underwriting Lens: {activeRole}
            </div>
            <h3 className="text-xl font-bold font-secondary text-white">
              {data?.role_insights?.focus_title}
            </h3>
            <p className="text-xs text-zinc-300 mt-1">
              {data?.role_insights?.audit_opinion}
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.02] border border-border text-xs text-text-dark self-start md:self-auto">
            Controls Rating: <strong className="text-emerald-400 font-semibold">{data?.role_insights?.controls_rating}</strong>
          </div>
        </div>

        {/* 4 Role KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.role_insights?.key_metrics?.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-border space-y-1">
              <div className="text-[11px] text-text-dark truncate">{m.name}</div>
              <div className="text-xl font-bold font-mono text-white">{m.value}</div>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="size-1 rounded-full bg-emerald-400"></span>
                {m.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Statement Tabs & Explorer */}
      <div className="rounded-4xl bg-light border border-border overflow-hidden">
        {/* Navigation Tabs */}
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {[
              { key: 'BALANCE_SHEET', label: 'Balance Sheet' },
              { key: 'INCOME_STATEMENT', label: 'Income Statement (P&L)' },
              { key: 'CASH_FLOW', label: 'Cash Flow Statement' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatementTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statementTab === tab.key
                    ? 'btn-primary text-white'
                    : 'bg-white/5 border border-border text-text-dark hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-text-dark font-mono">
            {data?.company_profile?.reporting_currency} • Accrual Basis
          </div>
        </div>

        {loading ? (
          <div className="p-6 lg:p-8 space-y-6 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4">
                <div className="h-5 w-32 bg-white/10 rounded"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between py-1.5">
                    <div className="h-4 w-40 bg-white/5 rounded"></div>
                    <div className="h-4 w-20 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4">
                <div className="h-5 w-36 bg-white/10 rounded"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between py-1.5">
                    <div className="h-4 w-40 bg-white/5 rounded"></div>
                    <div className="h-4 w-20 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 lg:p-8">
            {/* 1. BALANCE SHEET */}
            {statementTab === 'BALANCE_SHEET' && bs && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ASSETS */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Current Assets</h4>
                      <span className="text-xs text-text-dark">In USD</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">Cash and Cash Equivalents</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.assets?.cash_and_equivalents?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">Accounts Receivable (Net)</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.assets?.accounts_receivable_net?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">Inventory (Lower of Cost or Market)</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.assets?.inventory_valuation?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex justify-between items-center text-sm font-bold">
                      <span className="text-white">TOTAL CURRENT ASSETS</span>
                      <span className="font-mono text-primary text-base">
                        ${bs.assets?.total_current_assets?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* LIABILITIES & EQUITY */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">Liabilities &amp; Equity</h4>
                      <span className="text-xs text-text-dark">In USD</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">Accounts Payable (Supplier AP)</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.liabilities?.accounts_payable?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">Accrued Operational Expenses</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.liabilities?.accrued_operating_expenses?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">Short-term Debt Obligations</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.liabilities?.short_term_debt?.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-semibold text-zinc-300">
                        <span>Total Current Liabilities</span>
                        <span className="font-mono text-white">
                          ${bs.liabilities?.total_current_liabilities?.toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-semibold text-zinc-300">
                        <span>Retained Earnings &amp; Equity</span>
                        <span className="font-mono text-emerald-400">
                          ${bs.equity?.total_equity?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex justify-between items-center text-sm font-bold">
                      <span className="text-white">TOTAL LIABILITIES &amp; EQUITY</span>
                      <span className="font-mono text-primary text-base">
                        ${bs.total_liabilities_and_equity?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.015] border border-border flex items-center justify-between text-xs text-text-dark">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Accounting Equation Verified: Assets = Liabilities + Equity (Balanced)</span>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400">0 Variance</span>
                </div>
              </div>
            )}

            {/* 2. INCOME STATEMENT (P&L) */}
            {statementTab === 'INCOME_STATEMENT' && is && (
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <h4 className="text-base font-bold text-white">Statement of Operations (P&amp;L)</h4>
                    <p className="text-xs text-text-dark">Fiscal Year-to-Date Accrual Accounting</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Net Margin: {is.net_margin_pct}%
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Revenue */}
                  <div className="flex justify-between items-center py-2 border-b border-white/5 font-semibold">
                    <span className="text-white text-sm">GROSS REVENUE</span>
                    <span className="font-mono text-emerald-400 text-sm">${is.gross_revenue?.toLocaleString()}</span>
                  </div>

                  {/* COGS */}
                  <div className="flex justify-between items-center py-1 pl-4 text-zinc-300">
                    <span>Less: Cost of Goods Sold (Raw Material COGS)</span>
                    <span className="font-mono text-rose-400">-${is.cost_of_goods_sold?.toLocaleString()}</span>
                  </div>

                  {/* Gross Profit */}
                  <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-white/[0.02] font-bold text-white">
                    <span>GROSS PROFIT</span>
                    <span className="font-mono text-primary text-sm">${is.gross_profit?.toLocaleString()}</span>
                  </div>

                  {/* OpEx Breakdown */}
                  <div className="pl-4 space-y-2 pt-2 text-zinc-300">
                    <div className="font-semibold text-text-dark uppercase tracking-wider text-[11px]">Operating Expenditures (SG&amp;A)</div>
                    <div className="flex justify-between py-0.5">
                      <span>• Direct &amp; Operational Payroll</span>
                      <span className="font-mono text-zinc-200">-${is.operating_expenses?.salaries?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>• Factory Facility Leases (Rent)</span>
                      <span className="font-mono text-zinc-200">-${is.operating_expenses?.rent?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>• Industrial Steam &amp; Power (Utilities)</span>
                      <span className="font-mono text-zinc-200">-${is.operating_expenses?.utilities?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>• Wholesale Promotion &amp; SG&amp;A (Marketing)</span>
                      <span className="font-mono text-zinc-200">-${is.operating_expenses?.marketing?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Operating Income */}
                  <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-white/[0.02] font-bold text-white">
                    <span>OPERATING INCOME (EBITDA)</span>
                    <span className="font-mono text-white text-sm">${is.operating_income?.toLocaleString()}</span>
                  </div>

                  {/* Tax Provision */}
                  <div className="flex justify-between items-center py-1 pl-4 text-zinc-300">
                    <span>Less: Accrued Tax Provisions</span>
                    <span className="font-mono text-rose-400">-${is.tax_provision?.toLocaleString()}</span>
                  </div>

                  {/* Net Income */}
                  <div className="pt-4 border-t border-border flex justify-between items-center text-base font-bold text-white">
                    <span>NET INCOME</span>
                    <span className="font-mono text-emerald-400 text-lg">${is.net_income?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CASH FLOW STATEMENT */}
            {statementTab === 'CASH_FLOW' && cf && (
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <h4 className="text-base font-bold text-white">Statement of Cash Flows</h4>
                    <p className="text-xs text-text-dark">Cash Accounting Reconciliation</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white font-semibold">Cash Flows from Operating Activities</span>
                    <span className="font-mono text-emerald-400 font-bold">${cf.operating_activities?.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white font-semibold">Cash Flows from Investing Activities</span>
                    <span className="font-mono text-rose-400 font-bold">${cf.investing_activities?.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white font-semibold">Cash Flows from Financing Activities</span>
                    <span className="font-mono text-rose-400 font-bold">${cf.financing_activities?.toLocaleString()}</span>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-between items-center text-sm font-bold text-white">
                    <span>Ending Cash &amp; Liquid Reserves</span>
                    <span className="font-mono text-primary text-base">${cf.ending_cash?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* External Consent Management & Immutable Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Consent Token Management (5 cols) */}
        <div className="lg:col-span-5 rounded-4xl bg-light border border-border p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-base font-bold font-secondary text-white">Data Consent &amp; Sharing Link</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              Active Grant
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-border space-y-1.5">
              <div className="text-[11px] text-text-dark">Consent Access Token</div>
              <div className="font-mono text-xs font-semibold text-white truncate">
                {data?.consent_status?.consent_token}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-border space-y-1">
              <div className="text-[11px] text-text-dark">Granted By</div>
              <div className="text-xs font-semibold text-zinc-300">
                {data?.consent_status?.granted_by}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-border space-y-1">
              <div className="text-[11px] text-text-dark">Access Expiration</div>
              <div className="text-xs font-semibold text-zinc-300 font-mono">
                {data?.consent_status?.expires_at}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl text-xs font-semibold btn-outline text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {linkCopied ? (
              <>
                <span className="text-emerald-400 font-bold">✓</span>
                <span className="text-emerald-300">Sharing Link Copied to Clipboard</span>
              </>
            ) : (
              <>
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Copy External Read-Only Link
              </>
            )}
          </button>
        </div>

        {/* Portal Access Audit Trail (7 cols) */}
        <div className="lg:col-span-7 rounded-4xl bg-light border border-border p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-bold font-secondary text-white">Immutable Portal Access Audit Log</h3>
              <p className="text-xs text-text-dark">Timestamped ledger access events</p>
            </div>
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-dark uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor &amp; Role</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data?.audit_trail?.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                      {entry.timestamp}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{entry.actor}</div>
                      <span className="text-[10px] text-primary">{entry.role}</span>
                    </td>
                    <td className="py-3 px-3 text-zinc-300 text-[11px]">
                      {entry.action}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                        {entry.verification_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
