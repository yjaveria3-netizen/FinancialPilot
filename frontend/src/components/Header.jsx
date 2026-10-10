import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import InvoiceScannerModal from './InvoiceScannerModal';
import { resetDemoData, triggerCrisisMode, getLenderDossier } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import {
  IconHome,
  IconCashFlow,
  IconCreditScore,
  IconScenarioPlanner,
  IconAnomalyGuard,
  IconTaxAssistant,
  IconAccountantPortal,
  IconProcureAi,
  IconInventory,
  IconPricingAdvisor,
  IconNegotiation,
  IconScanInvoice,
  IconWhatsApp,
  IconClose,
} from './Icons';

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  const [isTriggeringCrisis, setIsTriggeringCrisis] = useState(false);
  const [crisisToast, setCrisisToast] = useState(false);
  const [isExportingDossier, setIsExportingDossier] = useState(false);

  const handleResetData = async () => {
    setIsSyncing(true);
    try {
      await resetDemoData();
      window.dispatchEvent(
        new CustomEvent('finpilot:refresh', { detail: { timestamp: Date.now() } })
      );
      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 3500);
    } catch (err) {
      console.error('Failed to reset demo data:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSimulateCrisis = async () => {
    setIsTriggeringCrisis(true);
    try {
      const res = await triggerCrisisMode();
      // Notify all dashboard modules to re-fetch
      window.dispatchEvent(
        new CustomEvent('finpilot:refresh', { detail: { timestamp: Date.now(), crisis: true } })
      );
      // Dispatch crisis-specific event for CFO Chat Drawer and Risk Banner
      window.dispatchEvent(
        new CustomEvent('finpilot:crisis', {
          detail: {
            timestamp: Date.now(),
            advice: res.emergency_advice,
            message: res.message,
            injectedOutflow: res.injected_outflow,
          },
        })
      );
      setCrisisToast(true);
      setTimeout(() => setCrisisToast(false), 4500);
    } catch (err) {
      console.error('Failed to simulate cash crisis:', err);
    } finally {
      setIsTriggeringCrisis(false);
    }
  };

  const handleExportDossier = async () => {
    setIsExportingDossier(true);
    try {
      const dossier = await getLenderDossier();
      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dossier, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `FinPilot-Lender-Dossier-${new Date().toISOString().split('T')[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Failed to export lender dossier:', err);
    } finally {
      setIsExportingDossier(false);
    }
  };

  // Close popup menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setScannerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when popup or scanner modal is open
  useEffect(() => {
    if (menuOpen || scannerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen, scannerOpen]);

  // Clean, localized feature categories
  const featureCategories = [
    {
      group: t('group_cash', 'Cash & Financial Health'),
      badge: t('badge_core', 'Core Engine'),
      items: [
        {
          name: t('nav_dashboard', 'Morning Dashboard'),
          to: '/dashboard',
          Icon: IconHome,
          desc: t('desc_dashboard', '7/30/90-day cash summary cards & daily runway health'),
          live: true,
        },
        {
          name: t('nav_cash_flow', 'Cash Flow Forecaster'),
          to: '/cash-flow',
          Icon: IconCashFlow,
          desc: t('desc_cash_flow', '30/60/90-day cash trajectory projection with volatility modeling'),
          live: true,
        },
        {
          name: t('nav_credit_score', 'Credit Readiness Score'),
          to: '/credit-score',
          Icon: IconCreditScore,
          desc: t('desc_credit_score', '0–100 bankability score with 4 underwriting pillars & Gemini tips'),
          live: true,
        },
        {
          name: t('nav_scenario', 'Scenario Planner'),
          to: '/scenario-planner',
          Icon: IconScenarioPlanner,
          desc: t('desc_scenario', 'Monte Carlo what-if cash flow simulation models'),
          live: true,
        },
        {
          name: t('nav_whatsapp', 'WhatsApp Collection Agent'),
          to: '/whatsapp-collector',
          Icon: IconWhatsApp,
          desc: t('desc_whatsapp', 'AI-automated overdue follow-ups & 1-click cash reconciliation'),
          live: true,
        },
      ],
    },
    {
      group: t('group_compliance', 'Compliance & Governance'),
      badge: t('badge_security', 'Assurance'),
      items: [
        {
          name: t('nav_anomaly', 'Anomaly & Fraud Guard'),
          to: '/anomaly-guard',
          Icon: IconAnomalyGuard,
          desc: t('desc_anomaly', 'Detect suspicious transactions & duplicate invoices'),
          live: true,
        },
        {
          name: t('nav_tax', 'Tax & Compliance Assistant'),
          to: '/tax-assistant',
          Icon: IconTaxAssistant,
          desc: t('desc_tax', 'Real-time tax liability estimates & deduction strategies'),
          live: true,
        },
        {
          name: t('nav_accountant', 'Accountant & Lender Portal'),
          to: '/accountant-portal',
          Icon: IconAccountantPortal,
          desc: t('desc_accountant', 'Export standardized GAAP P&L and Balance Sheet files'),
          live: true,
        },
      ],
    },
    {
      group: t('group_supply', 'Supply Chain & Commerce'),
      badge: t('badge_growth', 'Intelligence'),
      items: [
        {
          name: 'ProcureAI',
          to: '/procure-ai',
          Icon: IconProcureAi,
          desc: t('desc_procure', 'Supplier spend intelligence & lead-time analytics'),
          live: false,
        },
        {
          name: t('nav_inventory', 'Inventory Alerts'),
          to: '/inventory',
          Icon: IconInventory,
          desc: t('desc_inventory', 'Low stock warnings & automated reorder thresholds'),
          live: false,
        },
        {
          name: t('nav_pricing', 'Pricing Advisor'),
          to: '/pricing-advisor',
          Icon: IconPricingAdvisor,
          desc: t('desc_pricing', 'Margin optimization & price elasticity analysis'),
          live: false,
        },
        {
          name: t('nav_negotiation', 'Negotiation Copilot'),
          to: '/negotiation-copilot',
          Icon: IconNegotiation,
          desc: t('desc_negotiation', 'AI-generated supplier negotiation briefs'),
          live: false,
        },
      ],
    },
  ];

  return (
    <>
      {/* ── Compact, Rectangular Floating Glassmorphic Navbar with Sleek Rounded Corners ── */}
      <header className="header z-40 w-full fixed top-0 left-0 right-0 py-2.5 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between bg-[#2E151B]/80 backdrop-blur-xl border border-[#4D2330]/80 rounded-xl px-5 py-2.5 shadow-xl transition-all hover:border-secondary/50">
            {/* Left: Financial Pilot Brand Logo (Strictly English preserved) */}
            <Link to="/" onClick={closeMenu} className="shrink-0 flex items-center">
              <Logo />
            </Link>

            {/* Right: Language Switcher, Crisis Mode, Scanner & Hub */}
            <div className="flex items-center gap-2">
              {/* Trilingual Language Switcher (EN / اردو / 中文) */}
              <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-border/80 text-xs shadow-inner">
                {[
                  { code: 'en', label: 'EN' },
                  { code: 'ur', label: 'اردو' },
                  { code: 'zh', label: '中文' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLang(item.code)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      lang === item.code
                        ? 'bg-secondary text-white shadow-sm shadow-secondary/40'
                        : 'text-text-dark hover:text-white'
                    }`}
                    title={`Switch language to ${item.label}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Zero-Friction "Simulate Cash Crunch Crisis" Demo Switch */}
              <button
                type="button"
                onClick={handleSimulateCrisis}
                disabled={isTriggeringCrisis || isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-400 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-sm shadow-rose-950/40"
                title="⚡ Inject sudden cash crunch & high-severity duplicate invoice anomalies"
              >
                <span className="text-rose-400 font-bold animate-pulse">⚡</span>
                <span className="hidden sm:inline">
                  {isTriggeringCrisis ? t('crisis_injecting', 'Injecting...') : t('crisis_mode', 'Crisis Mode')}
                </span>
              </button>

              {/* Reset Demo Data Trigger */}
              <button
                type="button"
                onClick={handleResetData}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-text hover:text-white border border-border/70 hover:border-secondary/50 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                title="Reset synthetic demo datasets & refresh active views"
              >
                <svg
                  className={`size-3.5 text-secondary-light ${isSyncing ? 'animate-spin' : ''}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                <span className="hidden sm:inline">{isSyncing ? t('syncing', 'Syncing...') : t('reset_data', 'Reset')}</span>
              </button>

              {/* Header Action: Invoice & Receipt Scanner Button */}
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-text hover:text-white border border-border/70 hover:border-secondary/50 text-xs font-medium transition-all cursor-pointer"
                title="Open Invoice & Receipt Scanner"
              >
                <IconScanInvoice className="size-4 text-secondary-light" />
                <span className="hidden sm:inline">{t('scan_invoice', 'Scan')}</span>
              </button>

              {/* Direct Hub Link */}
              <Link
                to="/dashboard"
                className="btn btn-primary btn-sm text-xs py-1.5 px-4 hidden xs:inline-flex rounded-xl"
              >
                {t('launch_hub', 'Launch Hub')}
              </Link>

              {/* Animated 3-Dot to Cross Button */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`group size-10 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                  menuOpen
                    ? 'bg-secondary/25 text-white border-secondary shadow-lg shadow-secondary/25 ring-2 ring-secondary/30'
                    : 'bg-light/80 border-border text-white hover:border-secondary/60 hover:bg-white/10 hover:shadow-md'
                }`}
                aria-label={menuOpen ? t('close_menu', 'Close feature menu') : t('open_menu', 'Open feature menu')}
                title={menuOpen ? 'Close feature menu' : 'Open feature suite (Three-dot Hub)'}
              >
                <div className="relative size-5 flex items-center justify-center pointer-events-none">
                  {/* Dot 1 (Top) -> Morphs to First Cross Arm */}
                  <span
                    className={`absolute rounded-full transition-all duration-300 ease-in-out ${
                      menuOpen
                        ? 'w-5 h-[2px] rotate-45 translate-y-0 bg-white'
                        : 'w-1.5 h-1.5 -translate-y-2 bg-white/90 group-hover:bg-secondary-light group-hover:scale-125'
                    }`}
                  />
                  {/* Dot 2 (Center) -> Fades/scales out */}
                  <span
                    className={`absolute rounded-full transition-all duration-300 ease-in-out ${
                      menuOpen
                        ? 'w-5 h-[2px] opacity-0 scale-0 translate-y-0 bg-white'
                        : 'w-1.5 h-1.5 opacity-100 scale-100 translate-y-0 bg-white/90 group-hover:bg-secondary-light group-hover:scale-125'
                    }`}
                  />
                  {/* Dot 3 (Bottom) -> Morphs to Second Cross Arm */}
                  <span
                    className={`absolute rounded-full transition-all duration-300 ease-in-out ${
                      menuOpen
                        ? 'w-5 h-[2px] -rotate-45 translate-y-0 bg-white'
                        : 'w-1.5 h-1.5 translate-y-2 bg-white/90 group-hover:bg-secondary-light group-hover:scale-125'
                    }`}
                  />
                </div>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ── Demo Data Reset Toast Notification ── */}
      {syncToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-dark/95 border border-emerald-500/40 text-emerald-300 text-xs font-medium shadow-2xl backdrop-blur-xl flex items-center gap-2.5 animate-fadeIn">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Demo datasets regenerated successfully. All active views synced!</span>
        </div>
      )}

      {/* ── Cash Crunch Crisis Toast Notification ── */}
      {crisisToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-dark/95 border border-rose-500/60 text-rose-300 text-xs font-medium shadow-2xl backdrop-blur-xl flex items-center gap-2.5 animate-fadeIn">
          <span className="size-2 rounded-full bg-rose-500 animate-ping" />
          <span>⚡ Cash Crunch Crisis Simulated! $59k outflow & anomalies injected. AI CFO alert active.</span>
        </div>
      )}

      {/* ── Invoice & Receipt Scanner Modal ── */}
      <InvoiceScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />

      {/* ── Pop-Up Features Modal Overlay (With Smooth Open & Close Transitions) ── */}
      <div
        className={`nav-popup-overlay ${menuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Features and Modules Suite"
      >
        {/* Backdrop click to close */}
        <div
          className="absolute inset-0 -z-10 cursor-pointer"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Modal Container with entrance and smooth exit scale animation and zero scrollbar */}
        <div className="nav-popup-panel bg-light/95 border border-border rounded-4xl p-5 sm:p-8 shadow-2xl overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Top Bar of Modal */}
          <div className="flex items-center justify-between pb-6 border-b border-border/80 mb-8">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary-light border border-secondary/30 font-semibold hidden sm:inline">
                {t('complete_financial_suite', 'Complete Financial Suite')}
              </span>
            </div>

            {/* Close Button (X) */}
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="size-10 rounded-xl bg-dark/70 border border-border text-text hover:text-white hover:border-secondary hover:bg-secondary/20 transition-all flex items-center justify-center cursor-pointer group shadow-sm hover:shadow-secondary/20"
              aria-label="Close feature menu"
            >
              <IconClose className="size-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Feature Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featureCategories.map((group) => (
              <div key={group.group} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <h4 className="text-xs uppercase font-bold tracking-wider text-secondary-light">
                    {group.group}
                  </h4>
                  <span className="text-[10px] text-text-dark bg-white/5 px-2 py-0.5 rounded font-mono">
                    {group.badge}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.items.map((item) => {
                    const { Icon } = item;
                    return (
                      <Link
                        key={item.name}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-border transition-all"
                      >
                        <div className="size-5 shrink-0 mt-0.5 text-secondary-light group-hover:scale-110 transition-transform">
                          <Icon className="size-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white group-hover:text-secondary-light transition-colors">
                              {item.name}
                            </span>
                            {item.live ? (
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded-full font-semibold">
                                {t('live', 'Live')}
                              </span>
                            ) : (
                              <span className="text-[10px] bg-white/5 text-text-dark px-1.5 py-0.2 rounded font-mono">
                                {t('active_state', 'Active')}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-dark mt-0.5 line-clamp-1">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Modal Navigation & Actions */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-text-dark flex-wrap">
              <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">
                {t('home_landing', 'Home Landing')}
              </Link>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setScannerOpen(true);
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {t('ocr_invoice_scanner', 'OCR Invoice Scanner')}
              </button>
              <span>•</span>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {t('api_docs', 'FastAPI Backend Docs')}
              </a>
              <span>•</span>
              <button
                type="button"
                onClick={handleExportDossier}
                disabled={isExportingDossier}
                className="hover:text-secondary-light text-secondary-light/90 transition-colors cursor-pointer flex items-center gap-1 font-medium disabled:opacity-50"
                title="Export Bank & Lender Compliance Dossier (.JSON)"
              >
                <span className="text-secondary-light font-bold">📜</span>
                <span>{isExportingDossier ? 'Compiling Dossier...' : t('lender_dossier', 'Lender Dossier')}</span>
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleResetData}
                disabled={isSyncing}
                className="hover:text-emerald-400 text-emerald-400/80 transition-colors cursor-pointer flex items-center gap-1 font-medium"
              >
                <span className={isSyncing ? 'animate-spin inline-block' : ''}>↻</span> {t('reset_demo_data', 'Reset Demo Data')}
              </button>
            </div>

            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary w-full sm:w-auto text-xs py-2 px-5 rounded-xl shrink-0"
            >
              {t('launch_hub_arrow', 'Launch Financial Pilot Hub →')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
