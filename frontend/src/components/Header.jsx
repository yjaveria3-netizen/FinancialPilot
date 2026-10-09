import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import InvoiceScannerModal from './InvoiceScannerModal';
import { resetDemoData, triggerCrisisMode, getLenderDossier } from '../api/client';
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
  IconClose,
} from './Icons';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Lock body scroll when popup is open
  useEffect(() => {
    if (menuOpen || scannerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [menuOpen, scannerOpen]);

  // Clean, professional feature categories (No emojis, no Member A/B)
  const featureCategories = [
    {
      group: 'Cash & Financial Health',
      badge: 'Core Engine',
      items: [
        {
          name: 'Morning Dashboard',
          to: '/dashboard',
          Icon: IconHome,
          desc: '7/30/90-day cash summary cards & daily runway health',
          live: true,
        },
        {
          name: 'Cash Flow Forecaster',
          to: '/cash-flow',
          Icon: IconCashFlow,
          desc: '30/60/90-day cash trajectory projection with volatility modeling',
          live: true,
        },
        {
          name: 'Credit Readiness Score',
          to: '/credit-score',
          Icon: IconCreditScore,
          desc: '0–100 bankability score with 4 underwriting pillars & Gemini tips',
          live: true,
        },
        {
          name: 'Scenario Planner',
          to: '/scenario-planner',
          Icon: IconScenarioPlanner,
          desc: 'Monte Carlo what-if cash flow simulation models',
          live: true,
        },
      ],
    },
    {
      group: 'Compliance & Governance',
      badge: 'Assurance',
      items: [
        {
          name: 'Anomaly & Fraud Guard',
          to: '/anomaly-guard',
          Icon: IconAnomalyGuard,
          desc: 'Detect suspicious transactions & duplicate invoices',
          live: true,
        },
        {
          name: 'Tax & Compliance Assistant',
          to: '/tax-assistant',
          Icon: IconTaxAssistant,
          desc: 'Real-time tax liability estimates & deduction strategies',
          live: true,
        },
        {
          name: 'Accountant & Lender Portal',
          to: '/accountant-portal',
          Icon: IconAccountantPortal,
          desc: 'Export standardized GAAP P&L and Balance Sheet files',
          live: true,
        },
      ],
    },
    {
      group: 'Operations & Procurement AI',
      badge: 'Intelligence',
      items: [
        {
          name: 'ProcureAI',
          to: '/procure-ai',
          Icon: IconProcureAi,
          desc: 'Supplier spend intelligence & lead-time analytics',
          live: false,
        },
        {
          name: 'Inventory Alerts',
          to: '/inventory',
          Icon: IconInventory,
          desc: 'Low stock warnings & automated reorder thresholds',
          live: false,
        },
        {
          name: 'Pricing Advisor',
          to: '/pricing-advisor',
          Icon: IconPricingAdvisor,
          desc: 'Margin optimization & price elasticity analysis',
          live: false,
        },
        {
          name: 'Negotiation Copilot',
          to: '/negotiation-copilot',
          Icon: IconNegotiation,
          desc: 'AI-generated supplier negotiation briefs',
          live: false,
        },
      ],
    },
  ];

  return (
    <>
      {/* ── Compact, Non-Overwidth Floating Pill Navbar ── */}
      <header className="header z-40 w-full fixed top-0 left-0 right-0 py-4 transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4">
          <nav className="flex items-center justify-between bg-dark/80 backdrop-blur-xl border border-border/80 rounded-full px-5 py-2.5 shadow-2xl transition-all hover:border-primary/40">
            {/* Left: Financial Pilot Brand Logo */}
            <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0 flex items-center">
              <Logo />
            </Link>

            {/* Right: Invoice Scanner, Launch Hub & Animated 3-Line Menu Button */}
            <div className="flex items-center gap-2">
              {/* Zero-Friction "Simulate Cash Crunch Crisis" Demo Switch */}
              <button
                type="button"
                onClick={handleSimulateCrisis}
                disabled={isTriggeringCrisis || isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-400 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-sm shadow-rose-950/40"
                title="⚡ Inject sudden cash crunch & high-severity duplicate invoice anomalies"
              >
                <span className="text-rose-400 font-bold animate-pulse">⚡</span>
                <span className="hidden sm:inline">
                  {isTriggeringCrisis ? 'Injecting...' : 'Crisis Mode'}
                </span>
              </button>

              {/* Reset Demo Data Trigger */}
              <button
                type="button"
                onClick={handleResetData}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text hover:text-white border border-border/70 hover:border-emerald-500/50 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
                title="Reset synthetic demo datasets & refresh active views"
              >
                <svg
                  className={`size-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`}
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
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Reset'}</span>
              </button>

              {/* Header Action: Invoice & Receipt Scanner Button */}
              <button
                type="button"
                onClick={() => setScannerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-text hover:text-white border border-border/70 hover:border-primary/50 text-xs font-medium transition-all cursor-pointer"
                title="Open Invoice & Receipt Scanner"
              >
                <IconScanInvoice className="size-4 text-primary" />
                <span className="hidden sm:inline">Scan</span>
              </button>

              {/* Direct Hub Link */}
              <Link
                to="/dashboard"
                className="btn btn-primary btn-sm text-xs py-1.5 px-4 hidden xs:inline-flex"
              >
                Launch Hub
              </Link>

              {/* Animated 3-Line Hamburger to Cross Button */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`size-10 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                  menuOpen
                    ? 'bg-secondary/25 text-white border-secondary shadow-lg shadow-secondary/25'
                    : 'bg-light/80 border-border text-white hover:border-primary/60 hover:bg-white/10'
                }`}
                aria-label={menuOpen ? 'Close feature menu' : 'Open feature menu'}
                title={menuOpen ? 'Close feature menu' : 'Open feature menu'}
              >
                <div className="relative w-5 h-4 flex items-center justify-center pointer-events-none">
                  {/* Line 1 (Top) */}
                  <span
                    className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-300 ease-in-out ${
                      menuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                    }`}
                  />
                  {/* Line 2 (Middle) */}
                  <span
                    className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-300 ease-in-out ${
                      menuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                    }`}
                  />
                  {/* Line 3 (Bottom) */}
                  <span
                    className={`absolute h-[2px] w-5 bg-white rounded-full transition-all duration-300 ease-in-out ${
                      menuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
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

      {/* ── Pop-Up Features Modal Overlay (With Animated Cross to Close) ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-2xl bg-body/90 animate-fadeIn">
          {/* Backdrop click to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setMenuOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-light/95 border border-border rounded-4xl p-6 sm:p-10 shadow-2xl overflow-y-auto">
            {/* Top Bar of Modal */}
            <div className="flex items-center justify-between pb-6 border-b border-border/80 mb-8">
              <div className="flex items-center gap-3">
                <Logo />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-semibold hidden sm:inline">
                  Complete Financial Suite
                </span>
              </div>

              {/* Close Button (X) */}
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="size-10 rounded-full bg-dark/70 border border-border text-text hover:text-white hover:border-secondary hover:bg-secondary/20 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Close feature menu"
              >
                <IconClose className="size-4" />
              </button>
            </div>

            {/* Feature Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featureCategories.map((group) => (
                <div key={group.group} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-primary">
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
                          <div className="size-5 shrink-0 mt-0.5 text-primary group-hover:scale-110 transition-transform">
                            <Icon className="size-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">
                                {item.name}
                              </span>
                              {item.live ? (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded-full font-semibold">
                                  Live
                                </span>
                              ) : (
                                <span className="text-[10px] bg-white/5 text-text-dark px-1.5 py-0.2 rounded font-mono">
                                  Active
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
              <div className="flex items-center gap-4 text-xs text-text-dark">
                <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-white transition-colors">
                  Home Landing
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
                  OCR Invoice Scanner
                </button>
                <span>•</span>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  FastAPI Backend Docs
                </a>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleExportDossier}
                  disabled={isExportingDossier}
                  className="hover:text-primary text-primary/90 transition-colors cursor-pointer flex items-center gap-1 font-medium disabled:opacity-50"
                  title="Export Bank & Lender Compliance Dossier (.JSON)"
                >
                  <span className="text-primary font-bold">📜</span>
                  <span>{isExportingDossier ? 'Compiling Dossier...' : 'Lender Dossier'}</span>
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleResetData}
                  disabled={isSyncing}
                  className="hover:text-emerald-400 text-emerald-400/80 transition-colors cursor-pointer flex items-center gap-1 font-medium"
                >
                  <span className={isSyncing ? 'animate-spin inline-block' : ''}>↻</span> Reset Demo Data
                </button>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary w-full sm:w-auto text-xs py-2 px-5"
              >
                Launch Financial Pilot Hub →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
