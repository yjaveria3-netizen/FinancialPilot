import { NavLink, Link } from 'react-router-dom';
import Logo from './Logo';
import {
  IconHome,
  IconCashFlow,
  IconCreditScore,
  IconAnomalyGuard,
  IconTaxAssistant,
  IconScenarioPlanner,
  IconProcureAi,
  IconPricingAdvisor,
  IconAccountantPortal,
} from './Icons';

export default function Sidebar({ collapsed, setCollapsed }) {
  const navItems = [
    {
      to: '/dashboard',
      label: 'Morning Dashboard',
      subtitle: '7/30/90-Day Cash Summaries',
      Icon: IconHome,
    },
    {
      to: '/cash-flow',
      label: 'Cash Flow Forecaster',
      subtitle: 'Predictive Cash Runway',
      Icon: IconCashFlow,
    },
    {
      to: '/credit-score',
      label: 'Credit Readiness Score',
      subtitle: 'Bankability & Underwriting',
      Icon: IconCreditScore,
    },
    {
      to: '/anomaly-guard',
      label: 'Anomaly & Fraud Guard',
      subtitle: 'Suspicious Ledger Flags',
      Icon: IconAnomalyGuard,
    },
    {
      to: '/tax-assistant',
      label: 'Tax & Compliance',
      subtitle: 'Liability & Deductions',
      Icon: IconTaxAssistant,
    },
    {
      to: '/scenario-planner',
      label: 'Scenario Planner',
      subtitle: 'Monte Carlo Simulations',
      Icon: IconScenarioPlanner,
    },
    {
      to: '/procure-ai',
      label: 'ProcureAI & Inventory',
      subtitle: 'Reorder Points & Spend',
      Icon: IconProcureAi,
    },
    {
      to: '/pricing-advisor',
      label: 'Pricing & Negotiation',
      subtitle: 'Margins & Vendor Scripts',
      Icon: IconPricingAdvisor,
    },
    {
      to: '/accountant-portal',
      label: 'Accountant & Lender Portal',
      subtitle: 'GAAP P&L & Balance Sheet',
      Icon: IconAccountantPortal,
    },
  ];

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group relative ${
      isActive
        ? 'bg-primary/20 text-white border border-primary/40 shadow-lg shadow-primary/10'
        : 'text-text-dark hover:text-white hover:bg-white/5'
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 bg-dark/85 backdrop-blur-2xl border-r border-border transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Sidebar Header with Brand & Collapse Toggle */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-border/80 shrink-0">
        {!collapsed ? (
          <Link to="/" className="overflow-hidden">
            <Logo />
          </Link>
        ) : (
          <Link to="/" className="mx-auto text-xl font-bold text-primary">
            FP
          </Link>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="size-8 rounded-xl bg-white/5 hover:bg-white/10 text-text-dark hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-auto"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
        <div
          className={`text-[10px] font-bold text-text-dark/60 uppercase tracking-wider px-3 mb-2 ${
            collapsed ? 'text-center' : ''
          }`}
        >
          {collapsed ? '•••' : 'Financial Modules'}
        </div>

        {navItems.map((item) => {
          const { Icon } = item;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={navClass}
              title={collapsed ? item.label : undefined}
            >
              <div className="size-5 shrink-0 text-primary group-hover:scale-110 transition-transform">
                <Icon className="size-5" />
              </div>

              {!collapsed && (
                <div className="overflow-hidden">
                  <div className="truncate font-semibold text-white">{item.label}</div>
                  <div className="truncate text-[10px] text-text-dark">{item.subtitle}</div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border/80 shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] text-text-dark">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FastAPI Port 8000</span>
            </div>
            <Link to="/" className="hover:text-primary transition-colors">
              Landing ↗
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <span
              className="size-2 rounded-full bg-emerald-400 animate-pulse"
              title="Backend Connected"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
