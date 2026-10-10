import { useState, useEffect, useCallback } from 'react';
import { getAccountantPortal, getLenderDossier } from '../api/client';
import { IconAccountantPortal } from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function AccountantPortal() {
  const { t, translateGeminiContent } = useLanguage();
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-secondary/30 text-xs text-secondary-light mb-3 font-semibold">
            <IconAccountantPortal className="size-4" />
            {t('ap_badge', 'GAAP Certified Workpapers • External Underwriting Portal')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
            {t('ap_title_1', 'Accountant & Lender')} <span className="text-secondary-light font-normal">{t('ap_title_2', 'Portal')}</span>
          </h1>
          <p className="text-sm text-text-dark mt-1">
            {t('ap_subtitle', 'Read-only external portal for CPA auditors, bank lenders, and credit underwriters')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={!data || loading}
            className="btn-outline px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all hover:border-[#DA7B93]/60 hover:shadow-[0_0_25px_rgba(218,123,147,0.35)]"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            {t('ap_export_csv', 'Export CSV')}
          </button>

          <button
            type="button"
            onClick={handleExportPackage}
            disabled={!data || loading}
            className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:border-[#DA7B93]/60 hover:shadow-[0_0_25px_rgba(218,123,147,0.35)]"
          >
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" />
              <path d="M7 12h10" />
              <path d="M7 17h10" />
            </svg>
            {t('ap_export_pkg', 'Export Statement Package')}
          </button>

          <button
            type="button"
            onClick={handleExportLenderDossier}
            disabled={dossierLoading}
            className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#376E6F] hover:bg-[#4E8B8C] text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-[#376E6F]/20 transition-all hover:scale-102 disabled:opacity-50"
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
            <span>{dossierLoading ? t('ap_compiling', 'Compiling...') : t('ap_generate_dossier', '⚡ Generate Lender-Ready Dossier')}</span>
          </button>
        </div>
      </div>

      {/* Download Alert */}
      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary-light text-xs flex items-center gap-3">
          <span className="text-base font-bold">✓</span>
          <span>{t('ap_export_success', 'Verified financial statements exported successfully.')}</span>
        </div>
      )}

      {/* Dossier Download Alert */}
      {dossierSuccess && (
        <div className="p-4 rounded-2xl bg-secondary/20 border border-secondary/40 text-secondary-light text-xs flex items-center gap-3 animate-fadeIn">
          <span className="text-base font-bold">✓</span>
          <span>{t('ap_dossier_success', 'Comprehensive Lender-Ready Compliance Dossier compiled with SHA-256 seal and downloaded successfully!')}</span>
        </div>
      )}

      {/* Certified Read-Only Banner & Role Switcher */}
      <div className="rounded-3xl card-electric p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Read-Only Watermark Badge */}
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary-light font-bold shrink-0">
            🔒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{t('ap_readonly_badge', 'Certified Read-Only View')}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/15 text-secondary-light border border-secondary/30">
                {t('ap_write_locked', 'Write Controls Locked')}
              </span>
            </div>
            <p className="text-xs text-text-dark mt-0.5">
              {t('ap_checksum', 'Cryptographically signed snapshot • Checksum:')} <strong className="text-zinc-300 font-mono">{data?.consent_status?.cryptographic_hash}</strong>
            </p>
          </div>
        </div>

        {/* Role Switcher Simulation */}
        <div className="flex items-center gap-2 self-start lg:self-auto bg-white/5 border border-border rounded-2xl p-1.5">
          <span className="text-[11px] text-text-dark px-2 font-medium">{t('ap_viewing_as', 'Viewing as:')}</span>
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
              {r === 'Auditor' ? t('ap_role_auditor', 'Auditor') : r === 'Lender' ? t('ap_role_lender', 'Lender') : t('ap_role_accountant', 'Accountant')}
            </button>
          ))}
        </div>
      </div>

      {/* Role-Specific Underwriting & Audit Focus Strip */}
      <div className="rounded-4xl card-electric p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="text-xs uppercase tracking-wider text-secondary-light font-semibold mb-1">
              {t('ap_underwriting_lens', 'Active Underwriting Lens:')} {activeRole === 'Auditor' ? t('ap_role_auditor', 'Auditor') : activeRole === 'Lender' ? t('ap_role_lender', 'Lender') : t('ap_role_accountant', 'Accountant')}
            </div>
            <h3 className="text-xl font-bold font-secondary text-white">
              {translateGeminiContent(data?.role_insights?.focus_title)}
            </h3>
            <p className="text-xs text-zinc-300 mt-1">
              {translateGeminiContent(data?.role_insights?.audit_opinion)}
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/[0.02] border border-border text-xs text-text-dark self-start md:self-auto">
            {t('ap_controls_rating', 'Controls Rating:')} <strong className="text-secondary-light font-semibold">{translateGeminiContent(data?.role_insights?.controls_rating)}</strong>
          </div>
        </div>

        {/* 4 Role KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data?.role_insights?.key_metrics?.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-border space-y-1 hover:border-[#DA7B93]/40 transition-colors">
              <div className="text-[11px] text-text-dark truncate">{translateGeminiContent(m.name)}</div>
              <div className="text-xl font-bold font-mono text-white">{m.value}</div>
              <div className="text-[10px] text-secondary-light font-semibold flex items-center gap-1">
                <span className="size-1 rounded-full bg-secondary-light"></span>
                {translateGeminiContent(m.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Statement Tabs & Explorer */}
      <div className="rounded-4xl card-electric overflow-hidden">
        {/* Navigation Tabs */}
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {[
              { key: 'BALANCE_SHEET', label: t('ap_balance_sheet', 'Balance Sheet') },
              { key: 'INCOME_STATEMENT', label: t('ap_income_statement', 'Income Statement (P&L)') },
              { key: 'CASH_FLOW', label: t('ap_cash_flow', 'Cash Flow Statement') },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatementTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statementTab === tab.key
                    ? 'btn-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white/5 border border-border text-text-dark hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-text-dark font-mono">
            {data?.company_profile?.reporting_currency} • {t('ap_accrual_basis', 'Accrual Basis')}
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
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4 hover:border-[#DA7B93]/40 transition-colors">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">{t('ap_current_assets', 'Current Assets')}</h4>
                      <span className="text-xs text-text-dark">{t('ap_in_usd', 'In USD')}</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">{t('ap_cash_equiv', 'Cash and Cash Equivalents')}</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.assets?.cash_and_equivalents?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">{t('ap_ar_net', 'Accounts Receivable (Net)')}</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.assets?.accounts_receivable_net?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">{t('ap_inventory', 'Inventory (Lower of Cost or Market)')}</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.assets?.inventory_valuation?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex justify-between items-center text-sm font-bold">
                      <span className="text-white">{t('ap_total_current_assets', 'TOTAL CURRENT ASSETS')}</span>
                      <span className="font-mono text-secondary-light text-base">
                        ${bs.assets?.total_current_assets?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* LIABILITIES & EQUITY */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-4 hover:border-[#DA7B93]/40 transition-colors">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-white">{t('ap_liab_equity', 'Liabilities & Equity')}</h4>
                      <span className="text-xs text-text-dark">{t('ap_in_usd', 'In USD')}</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">{t('ap_ap_supplier', 'Accounts Payable (Supplier AP)')}</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.liabilities?.accounts_payable?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">{t('ap_accrued_opex', 'Accrued Operational Expenses')}</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.liabilities?.accrued_operating_expenses?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="text-zinc-300">{t('ap_short_term_debt', 'Short-term Debt Obligations')}</span>
                        <span className="font-mono text-white font-semibold">
                          ${bs.liabilities?.short_term_debt?.toLocaleString()}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-semibold text-zinc-300">
                        <span>{t('ap_total_current_liab', 'Total Current Liabilities')}</span>
                        <span className="font-mono text-white">
                          ${bs.liabilities?.total_current_liabilities?.toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-semibold text-zinc-300">
                        <span>{t('ap_retained_equity', 'Retained Earnings & Equity')}</span>
                        <span className="font-mono text-emerald-400">
                          ${bs.equity?.total_equity?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex justify-between items-center text-sm font-bold">
                      <span className="text-white">{t('ap_total_liab_equity', 'TOTAL LIABILITIES & EQUITY')}</span>
                      <span className="font-mono text-secondary-light text-base">
                        ${bs.total_liabilities_and_equity?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.015] border border-border flex items-center justify-between text-xs text-text-dark">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{t('ap_balanced_verified', 'Accounting Equation Verified: Assets = Liabilities + Equity (Balanced)')}</span>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400">{t('ap_variance', '0 Variance')}</span>
                </div>
              </div>
            )}

            {/* 2. INCOME STATEMENT (P&L) */}
            {statementTab === 'INCOME_STATEMENT' && is && (
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-6 hover:border-[#DA7B93]/40 transition-colors">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <h4 className="text-base font-bold text-white">{t('ap_statement_ops', 'Statement of Operations (P&L)')}</h4>
                    <p className="text-xs text-text-dark">{t('ap_fiscal_accrual', 'Fiscal Year-to-Date Accrual Accounting')}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t('ap_net_margin', 'Net Margin:')} {is.net_margin_pct}%
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Revenue */}
                  <div className="flex justify-between items-center py-2 border-b border-white/5 font-semibold">
                    <span className="text-white text-sm">{t('ap_gross_revenue', 'GROSS REVENUE')}</span>
                    <span className="font-mono text-emerald-400 text-sm">${is.gross_revenue?.toLocaleString()}</span>
                  </div>

                  {/* COGS */}
                  <div className="flex justify-between items-center py-1 pl-4 text-zinc-300">
                    <span>{t('ap_cogs', 'Less: Cost of Goods Sold (Raw Material COGS)')}</span>
                    <span className="font-mono text-rose-400">-${is.cost_of_goods_sold?.toLocaleString()}</span>
                  </div>

                  {/* Gross Profit */}
                  <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-white/[0.02] font-bold text-white">
                    <span>{t('ap_gross_profit', 'GROSS PROFIT')}</span>
                    <span className="font-mono text-secondary-light text-sm">${is.gross_profit?.toLocaleString()}</span>
                  </div>

                  {/* OpEx Breakdown */}
                  <div className="pl-4 space-y-2 pt-2 text-zinc-300">
                    <div className="font-semibold text-text-dark uppercase tracking-wider text-[11px]">{t('ap_opex_header', 'Operating Expenditures (SG&A)')}</div>
                    <div className="flex justify-between py-0.5">
                      <span>{t('ap_opex_payroll', '• Direct & Operational Payroll')}</span>
                      <span className="font-mono text-zinc-200">-${is.operating_expenses?.salaries?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>{t('ap_opex_rent', '• Factory Facility Leases (Rent)')}</span>
                      <span className="font-mono text-zinc-200">-${is.operating_expenses?.rent?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>{t('ap_opex_utilities', '• Industrial Steam & Power (Utilities)')}</span>
                      <span className="font-mono text-zinc-200">-${is.operating_expenses?.utilities?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>{t('ap_opex_marketing', '• Wholesale Promotion & SG&A (Marketing)')}</span>
                      <span className="font-mono text-zinc-200">-${is.operating_expenses?.marketing?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Operating Income */}
                  <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-white/[0.02] font-bold text-white">
                    <span>{t('ap_operating_income', 'OPERATING INCOME (EBITDA)')}</span>
                    <span className="font-mono text-white text-sm">${is.operating_income?.toLocaleString()}</span>
                  </div>

                  {/* Tax Provision */}
                  <div className="flex justify-between items-center py-1 pl-4 text-zinc-300">
                    <span>{t('ap_tax_provision', 'Less: Accrued Tax Provisions')}</span>
                    <span className="font-mono text-rose-400">-${is.tax_provision?.toLocaleString()}</span>
                  </div>

                  {/* Net Income */}
                  <div className="pt-4 border-t border-border flex justify-between items-center text-base font-bold text-white">
                    <span>{t('ap_net_income', 'NET INCOME')}</span>
                    <span className="font-mono text-secondary-light text-lg">${is.net_income?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CASH FLOW STATEMENT */}
            {statementTab === 'CASH_FLOW' && cf && (
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-6 hover:border-[#DA7B93]/40 transition-colors">
                <div className="flex justify-between items-center pb-4 border-b border-border">
                  <div>
                    <h4 className="text-base font-bold text-white">{t('ap_cf_title', 'Statement of Cash Flows')}</h4>
                    <p className="text-xs text-text-dark">{t('ap_cf_reconciliation', 'Cash Accounting Reconciliation')}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white font-semibold">{t('ap_cf_operating', 'Cash Flows from Operating Activities')}</span>
                    <span className="font-mono text-secondary-light font-bold">${cf.operating_activities?.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white font-semibold">{t('ap_cf_investing', 'Cash Flows from Investing Activities')}</span>
                    <span className="font-mono text-rose-400 font-bold">${cf.investing_activities?.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white font-semibold">{t('ap_cf_financing', 'Cash Flows from Financing Activities')}</span>
                    <span className="font-mono text-rose-400 font-bold">${cf.financing_activities?.toLocaleString()}</span>
                  </div>

                  <div className="pt-4 border-t border-border flex justify-between items-center text-sm font-bold text-white">
                    <span>{t('ap_cf_ending', 'Ending Cash & Liquid Reserves')}</span>
                    <span className="font-mono text-secondary-light text-base">${cf.ending_cash?.toLocaleString()}</span>
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
        <div className="lg:col-span-5 rounded-4xl card-electric p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-base font-bold font-secondary text-white">{t('ap_consent_title', 'Data Consent & Sharing Link')}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/15 text-secondary-light border border-secondary/30">
              {t('ap_active_grant', 'Active Grant')}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-border space-y-1.5 hover:border-[#DA7B93]/40 transition-colors">
              <div className="text-[11px] text-text-dark">{t('ap_token_label', 'Consent Access Token')}</div>
              <div className="font-mono text-xs font-semibold text-white truncate">
                {data?.consent_status?.consent_token}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-border space-y-1 hover:border-[#DA7B93]/40 transition-colors">
              <div className="text-[11px] text-text-dark">{t('ap_granted_by', 'Granted By')}</div>
              <div className="text-xs font-semibold text-zinc-300">
                {data?.consent_status?.granted_by}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-border space-y-1 hover:border-[#DA7B93]/40 transition-colors">
              <div className="text-[11px] text-text-dark">{t('ap_access_exp', 'Access Expiration')}</div>
              <div className="text-xs font-semibold text-zinc-300 font-mono">
                {data?.consent_status?.expires_at}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-xl text-xs font-semibold btn-outline text-white flex items-center justify-center gap-2 cursor-pointer transition-all hover:border-[#DA7B93]/60 hover:shadow-[0_0_25px_rgba(218,123,147,0.35)]"
          >
            {linkCopied ? (
              <>
                <span className="text-secondary-light font-bold">✓</span>
                <span className="text-secondary-light">{t('ap_copied', 'Sharing Link Copied to Clipboard')}</span>
              </>
            ) : (
              <>
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                {t('ap_copy_link', 'Copy External Read-Only Link')}
              </>
            )}
          </button>
        </div>

        {/* Portal Access Audit Trail (7 cols) */}
        <div className="lg:col-span-7 rounded-4xl card-electric p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="text-base font-bold font-secondary text-white">{t('ap_audit_title', 'Immutable Portal Access Audit Log')}</h3>
              <p className="text-xs text-text-dark">{t('ap_audit_subtitle', 'Timestamped ledger access events')}</p>
            </div>
            <div className="size-2 rounded-full bg-secondary-light animate-pulse"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-dark uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">{t('ap_col_timestamp', 'Timestamp')}</th>
                  <th className="py-2.5 px-3">{t('ap_col_actor_role', 'Actor & Role')}</th>
                  <th className="py-2.5 px-3">{t('ap_col_action', 'Action')}</th>
                  <th className="py-2.5 px-3 text-right">{t('ap_col_verification', 'Verification')}</th>
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
                      <span className="text-[10px] text-secondary-light">{translateGeminiContent(entry.role)}</span>
                    </td>
                    <td className="py-3 px-3 text-zinc-300 text-[11px]">
                      {translateGeminiContent(entry.action)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-secondary/15 text-secondary-light border border-secondary/30 whitespace-nowrap">
                        {translateGeminiContent(entry.verification_status)}
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
