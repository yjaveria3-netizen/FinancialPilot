import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  getCashForecast,
  getCreditScore,
  getAnomalies,
  getTaxSummary,
} from '../api/client';
import {
  IconAiSparkle,
  IconAnomalyGuard,
  IconTaxAssistant,
  IconScenarioPlanner,
  IconAccountantPortal,
  IconCashFlow,
  IconWhatsApp,
} from './Icons';
import RiskBanner from './RiskBanner';
import ElectricCreditGauge from './ElectricCreditGauge';
import ElectricProgressBar from './ElectricProgressBar';
import { useLanguage } from '../context/LanguageContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-light border border-border rounded-2xl p-4 text-xs shadow-2xl backdrop-blur-md">
      <div className="text-white font-semibold mb-2">{label}</div>
      <div className="flex flex-col gap-1.5 text-text">
        <div>
          <span className="text-text-dark">Projected Balance: </span>
          <strong className="text-secondary-light font-mono">Rs. {d?.projected_balance?.toLocaleString()}</strong>
        </div>
        <div>
          <span className="text-text-dark">Income: </span>
          <span className="text-secondary-light font-mono">+Rs. {d?.income?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-text-dark">Expenses: </span>
          <span className="text-rose-400 font-mono">-Rs. {d?.expenses?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default function DashboardMetrics() {
  const { t, translateGeminiContent } = useLanguage();
  const [days, setDays] = useState(30);
  const [cashData, setCashData] = useState(null);
  const [creditData, setCreditData] = useState(null);
  const [overview, setOverview] = useState({ anomaliesCount: null, nextTax: null });
  const [loadingCash, setLoadingCash] = useState(true);
  const [loadingCredit, setLoadingCredit] = useState(true);
  const [errorCash, setErrorCash] = useState(null);
  const [errorCredit, setErrorCredit] = useState(null);

  const fetchCash = useCallback(async (hDays = days) => {
    setLoadingCash(true);
    setErrorCash(null);
    try {
      const data = await getCashForecast(hDays);
      setCashData(data);
    } catch (err) {
      setErrorCash(err.message);
    } finally {
      setLoadingCash(false);
    }
  }, [days]);

  const fetchCredit = useCallback(async () => {
    setLoadingCredit(true);
    setErrorCredit(null);
    try {
      const data = await getCreditScore();
      setCreditData(data);
    } catch (err) {
      setErrorCredit(err.message);
    } finally {
      setLoadingCredit(false);
    }
  }, []);

  const fetchOverview = useCallback(async () => {
    try {
      const [anomaliesRes, taxRes] = await Promise.allSettled([
        getAnomalies(),
        getTaxSummary(),
      ]);

      const anomaliesCount =
        anomaliesRes.status === 'fulfilled' && Array.isArray(anomaliesRes.value)
          ? anomaliesRes.value.length
          : null;

      const nextTax =
        taxRes.status === 'fulfilled' && taxRes.value?.filing_deadlines?.[0]
          ? taxRes.value.filing_deadlines[0]
          : null;

      setOverview({ anomaliesCount, nextTax });
    } catch {
      // Non-blocking background sync
    }
  }, []);

  useEffect(() => {
    fetchCash(days);
  }, [days, fetchCash]);

  useEffect(() => {
    fetchCredit();
    fetchOverview();
  }, [fetchCredit, fetchOverview]);

  // Listen to global reset demo data / sync trigger
  useEffect(() => {
    const handleGlobalRefresh = () => {
      fetchCash(days);
      fetchCredit();
      fetchOverview();
    };
    window.addEventListener('finpilot:refresh', handleGlobalRefresh);
    return () => window.removeEventListener('finpilot:refresh', handleGlobalRefresh);
  }, [days, fetchCash, fetchCredit, fetchOverview]);

  const summary = cashData?.summary || {};
  const forecast = cashData?.forecast || [];
  const chartData = forecast.filter((_, i) => days <= 30 || i % (days > 60 ? 3 : 2) === 0);

  return (
    <section className="section py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="section-intro text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-light border border-secondary/40 text-xs text-secondary-light mb-4 font-semibold tracking-wide uppercase">
            <span className="size-2 rounded-full bg-secondary-light animate-pulse"></span>
            {t('live_engine_status', 'Live Data Engine • Python Backend Connected')}
          </div>
          <h2 className="text-h3 lg:text-h2 font-secondary font-bold text-white mb-4">
            {t('real_time_financial', 'Real-Time Financial')}{' '}
            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[#4EE2C9] via-[#3FBFA8] to-[#80F4E0] font-normal">{t('intelligence_hub', 'Intelligence Hub')}</strong>
          </h2>
          <p className="text-text-dark max-w-2xl mx-auto text-base">
            {t(
              'live_metrics_calc',
              'Live metrics calculated directly by Pandas from your local CSV data contracts, paired with instant Gemini AI executive analysis.'
            )}
          </p>
        </div>

        {/* Autonomous Proactive Risk Banner (Agentic Action Hub) */}
        <RiskBanner />

        {/* Low Cash Warning Banner — Clickable inter-module jump to /cash-flow */}
        {cashData?.low_cash_alert && (
          <Link
            to="/cash-flow"
            className="mb-8 p-6 rounded-3xl bg-secondary/10 border border-secondary/30 flex items-start justify-between gap-4 group hover:border-secondary transition-all cursor-pointer block"
            title="Click to inspect 90-day cash runway in Forecaster"
          >
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-bold text-lg group-hover:scale-110 transition-transform">
                !
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-bold text-base mb-1">
                    {t('low_cash_title', 'Low Cash Reserve Warning')}
                  </h4>
                  <span className="text-[10px] bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full font-semibold">
                    {t('action_required', 'Action Required')}
                  </span>
                </div>
                <p className="text-sm text-text-dark leading-relaxed">
                  {t('low_cash_desc_prefix', 'Projected cash dips below Rs. 5,000 threshold on')}{' '}
                  <strong className="text-secondary font-mono">{cashData.low_cash_day}</strong>
                  {t(
                    'low_cash_desc_suffix',
                    '. Click here to open the Cash Flow Forecaster and view runway trajectory.'
                  )}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-secondary group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 pt-2">
              <span>{t('inspect_runway', 'Inspect Runway')}</span>
              <span>→</span>
            </div>
          </Link>
        )}

        {/* Controls: Horizon Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-light/70 border border-border rounded-3xl p-4 backdrop-blur-md">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <span>{t('forecast_horizon', 'Forecast Horizon:')}</span>
            <span className="text-secondary-light font-mono">
              {days} {t('days_ahead', 'Days Ahead')}
            </span>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30, 60, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
                  days === d
                    ? 'btn-primary text-white shadow-lg'
                    : 'bg-dark/60 text-text-dark hover:text-white border border-border/50'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>

        {/* Cross-Module Quick Jump Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Link
            to="/anomaly-guard"
            className="p-4 rounded-2xl bg-light/80 border border-border hover:border-rose-500/50 transition-all flex items-center gap-3.5 group cursor-pointer"
            title="Inspect detected duplicate invoices and expense outliers"
          >
            <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <IconAnomalyGuard className="size-5" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between">
                <span>{t('module_anomaly', 'Anomaly Guard')}</span>
                <span className="text-[10px] text-rose-400 font-mono">
                  {overview.anomaliesCount !== null
                    ? `${overview.anomaliesCount} ${t('badge_flags', 'Flags')}`
                    : t('badge_active', 'Active')}
                </span>
              </div>
              <div className="text-[11px] text-text-dark truncate">
                {t('module_anomaly_sub', 'Duplicate & outlier audit')}
              </div>
            </div>
          </Link>

          <Link
            to="/tax-assistant"
            className="p-4 rounded-2xl bg-light/80 border border-border hover:border-emerald-500/50 transition-all flex items-center gap-3.5 group cursor-pointer"
            title="View tax liability estimate & upcoming regulatory deadlines"
          >
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <IconTaxAssistant className="size-5" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                <span>{t('module_tax', 'Tax Assistant')}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {overview.nextTax?.days_remaining !== undefined
                    ? `${overview.nextTax.days_remaining}d ${t('badge_due', 'Due')}`
                    : 'IRS 2024'}
                </span>
              </div>
              <div className="text-[11px] text-text-dark truncate">
                {t('module_tax_sub', 'Deductions & CPA memo')}
              </div>
            </div>
          </Link>

          <Link
            to="/scenario-planner"
            className="p-4 rounded-2xl bg-light/80 border border-border hover:border-secondary/50 transition-all flex items-center gap-3.5 group cursor-pointer"
            title="Run Monte Carlo simulations for sales & cost shocks"
          >
            <div className="size-10 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary-light flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <IconScenarioPlanner className="size-5" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-white group-hover:text-secondary-light transition-colors flex items-center justify-between">
                <span>{t('module_scenario', 'Scenario Planner')}</span>
                <span className="text-[10px] text-secondary-light font-mono">
                  {t('badge_monte_carlo', 'Monte Carlo')}
                </span>
              </div>
              <div className="text-[11px] text-text-dark truncate">
                {t('module_scenario_sub', 'Sales, hiring & price shocks')}
              </div>
            </div>
          </Link>

          <Link
            to="/accountant-portal"
            className="p-4 rounded-2xl bg-light/80 border border-border hover:border-secondary/50 transition-all flex items-center gap-3.5 group cursor-pointer"
            title="Access external auditor & lender verified portal"
          >
            <div className="size-10 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <IconAccountantPortal className="size-5" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-white group-hover:text-secondary transition-colors flex items-center justify-between">
                <span>{t('module_accountant', 'Accountant Portal')}</span>
                <span className="text-[10px] text-secondary font-mono">
                  {t('badge_gaap', 'GAAP Certified')}
                </span>
              </div>
              <div className="text-[11px] text-text-dark truncate">
                {t('module_accountant_sub', 'Auditor & Lender exports')}
              </div>
            </div>
          </Link>

          <Link
            to="/whatsapp-collector"
            className="p-4 rounded-2xl bg-light/80 border border-border hover:border-emerald-500/50 transition-all flex items-center gap-3.5 group cursor-pointer"
            title="Automated WhatsApp payment reminders & one-click reconciliation"
          >
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <IconWhatsApp className="size-5" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>{t('module_whatsapp', 'WhatsApp Agent')}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {t('badge_ai_collections', 'AI Collections')}
                </span>
              </div>
              <div className="text-[11px] text-text-dark truncate">
                {t('module_whatsapp_sub', 'Overdue reminders & cash')}
              </div>
            </div>
          </Link>
        </div>

        {/* Top 4 Metric Cards — Clickable with Skeleton Loading & Electric Current Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Starting Cash */}
          <Link
            to="/cash-flow"
            className="rounded-3xl card-electric p-6 relative overflow-hidden group cursor-pointer block"
            title="Open Cash Flow Forecaster"
          >
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
              <span>{t('starting_cash', 'Starting Cash')}</span>
              <IconCashFlow className="size-3.5 text-text-dark group-hover:text-secondary-light transition-colors" />
            </div>
            {loadingCash ? (
              <div className="h-9 w-28 bg-white/10 rounded-lg animate-pulse my-1" />
            ) : (
              <div className="text-2xl lg:text-3xl font-bold font-secondary text-white font-mono">
                Rs. {summary.starting_cash?.toLocaleString() || '0'}
              </div>
            )}
            <div className="text-xs text-text-dark mt-2 group-hover:text-secondary-light transition-colors flex items-center gap-1">
              <span>{t('current_liquid_pos', 'Current liquid position')}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-secondary/5 rounded-full blur-xl pointer-events-none"></div>
          </Link>

          {/* Card 2: Projected Ending */}
          <Link
            to="/scenario-planner"
            className="rounded-3xl card-electric p-6 relative overflow-hidden group cursor-pointer block"
            title="Simulate scenarios with Monte Carlo"
          >
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
              <span>
                {t('projected', 'Projected')} ({days}d)
              </span>
              <IconScenarioPlanner className="size-3.5 text-text-dark group-hover:text-secondary-light transition-colors" />
            </div>
            {loadingCash ? (
              <div className="h-9 w-32 bg-white/10 rounded-lg animate-pulse my-1" />
            ) : (
              <div className="text-2xl lg:text-3xl font-bold font-secondary font-mono text-secondary-light">
                Rs. {summary.ending_balance?.toLocaleString() || '0'}
              </div>
            )}
            <div className="text-xs text-text-dark mt-2 group-hover:text-secondary-light transition-colors flex items-center gap-1">
              <span>{t('projected_end_bal', 'Projected end balance')}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-secondary/5 rounded-full blur-xl pointer-events-none"></div>
          </Link>

          {/* Card 3: Avg Daily Income */}
          <Link
            to="/cash-flow"
            className="rounded-3xl card-electric p-6 relative overflow-hidden group cursor-pointer block"
            title="View Daily Cash Inflow Dynamics"
          >
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
              <span>{t('daily_avg_inflow', 'Daily Avg Inflow')}</span>
              <span className="text-[10px] text-secondary-light font-mono">+Baseline</span>
            </div>
            {loadingCash ? (
              <div className="h-9 w-28 bg-white/10 rounded-lg animate-pulse my-1" />
            ) : (
              <div className="text-2xl lg:text-3xl font-bold font-secondary text-secondary-light font-mono">
                +Rs. {summary.avg_daily_income?.toLocaleString() || '0'}
              </div>
            )}
            <div className="text-xs text-text-dark mt-2 group-hover:text-secondary-light transition-colors flex items-center gap-1">
              <span>{t('historical_90d', 'Historical 90d baseline')}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-secondary/10 rounded-full blur-xl pointer-events-none"></div>
          </Link>

          {/* Card 4: Pending Invoices */}
          <Link
            to="/anomaly-guard"
            className="rounded-3xl card-electric p-6 relative overflow-hidden group cursor-pointer block"
            title="Inspect pending invoices & fraud risk"
          >
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
              <span>{t('pending_invoices', 'Pending Invoices')}</span>
              <IconAnomalyGuard className="size-3.5 text-text-dark group-hover:text-secondary-light transition-colors" />
            </div>
            {loadingCash ? (
              <div className="h-9 w-32 bg-white/10 rounded-lg animate-pulse my-1" />
            ) : (
              <div className="text-2xl lg:text-3xl font-bold font-secondary text-secondary-light font-mono">
                Rs. {summary.pending_invoices?.toLocaleString() || '0'}
              </div>
            )}
            <div className="text-xs text-text-dark mt-2 group-hover:text-secondary-light transition-colors flex items-center gap-1">
              <span>{t('unpaid_bills', 'Unpaid & overdue bills')}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-secondary/5 rounded-full blur-xl pointer-events-none"></div>
          </Link>
        </div>

        {/* Main Chart + Credit Score Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Section (2 cols) */}
          <div className="lg:col-span-2 rounded-4xl card-electric p-8 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-secondary">
                    {t('cash_trajectory', 'Projected Cash Trajectory')}
                  </h3>
                  <p className="text-xs text-text-dark mt-1">
                    {t('cash_trajectory_desc', 'Daily net income vs expense flow projection')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-secondary-light bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full">
                    {days} {t('day_window', 'Day Window')}
                  </span>
                  <Link
                    to="/cash-flow"
                    className="text-xs text-text-dark hover:text-secondary-light transition-colors hidden sm:inline"
                  >
                    {t('forecaster_tool', 'Forecaster')} ↗
                  </Link>
                </div>
              </div>

              {loadingCash ? (
                <div className="h-72 flex flex-col justify-between py-4 animate-pulse">
                  <div className="flex items-end justify-between gap-3 h-52 px-2">
                    {[30, 45, 60, 50, 72, 65, 80, 75, 88, 92, 85, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-white/5 rounded-t-lg transition-all"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full mx-2" />
                </div>
              ) : errorCash ? (
                <div className="h-72 flex items-center justify-center text-secondary text-sm">
                  Error loading forecast: {errorCash}
                </div>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="finpilotGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3FBFA8" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3FBFA8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4D2330" opacity={0.6} />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#A48993', fontSize: 10 }}
                        tickFormatter={(val) => val?.slice(5)}
                        stroke="#4D2330"
                      />
                      <YAxis
                        tick={{ fill: '#A48993', fontSize: 10 }}
                        tickFormatter={(val) => `Rs. ${(val / 1000).toFixed(0)}k`}
                        stroke="#4D2330"
                        width={50}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={5000} stroke="#EF4444" strokeDasharray="3 3" />
                      <Area
                        type="monotone"
                        dataKey="projected_balance"
                        stroke="#3FBFA8"
                        strokeWidth={2.5}
                        fill="url(#finpilotGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-text-dark">
              <span>{t('buffer_threshold', 'Red dashed indicator = Rs. 5,000 liquidity buffer threshold')}</span>
              <Link to="/cash-flow" className="text-secondary-light hover:underline font-medium">
                {t('detailed_simulation', 'Detailed 90-Day Simulation')} →
              </Link>
            </div>
          </div>

          {/* Credit Score Gauge & Breakdown (1 col) — Organic Floating Card with Electric Current */}
          <div className="rounded-4xl card-electric p-8 flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Corner Plasma Glows */}
            <div className="absolute -top-24 -right-24 size-48 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 size-48 bg-secondary-light/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-secondary-light shadow-[0_0_8px_#3FBFA8] animate-pulse" />
                  <h3 className="text-lg font-bold text-white font-secondary">
                    {t('credit_readiness', 'Credit Readiness')}
                  </h3>
                </div>
                <Link
                  to="/credit-score"
                  className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-secondary/20 to-secondary-light/20 text-white/90 border border-secondary/30 font-semibold hover:border-secondary/60 hover:shadow-[0_0_12px_rgba(63,191,168,0.35)] transition-all cursor-pointer inline-flex items-center gap-1 group/btn"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-secondary-light to-secondary">
                    {t('score_engine', 'Score Engine')}
                  </span>
                  <span className="text-secondary-light group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform">↗</span>
                </Link>
              </div>

              {loadingCredit ? (
                <div className="py-8 flex flex-col items-center justify-center animate-pulse space-y-4">
                  <div className="size-36 rounded-full border-8 border-white/10" />
                  <div className="h-4 w-32 bg-white/10 rounded-lg" />
                  <div className="space-y-3 w-full pt-4">
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                    <div className="h-2 w-full bg-white/10 rounded-full" />
                  </div>
                </div>
              ) : errorCredit ? (
                <div className="py-12 text-center text-sm text-secondary">
                  Error: {errorCredit}
                </div>
              ) : (
                <>
                  {/* Gauge Display with Gradient & Flowing Current */}
                  <div className="flex flex-col items-center my-4">
                    <ElectricCreditGauge
                      score={creditData?.score}
                      grade={creditData?.grade}
                      size="size-36"
                      idPrefix="dashboard-credit"
                    />
                  </div>

                  {/* Factor Breakdown Bars with Flowing Current Streams */}
                  <div className="space-y-3.5 mt-6">
                    {Object.entries(creditData?.factors || {}).map(([key, val], idx) => {
                      const maxScore =
                        key === 'revenue_consistency' ? 30 : key === 'expense_control' ? 20 : 25;
                      return (
                        <ElectricProgressBar
                          key={key}
                          factorKey={key}
                          score={val}
                          maxScore={maxScore}
                          delayIndex={idx}
                          compact={true}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 text-center relative z-10">
              <Link
                to="/credit-score"
                className="text-xs font-semibold text-secondary-light hover:text-white transition-all inline-flex items-center gap-1.5 group/link py-1.5 px-4 rounded-full hover:bg-secondary/10 border border-transparent hover:border-secondary/25"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-secondary-light to-secondary">
                  {t('view_pillars_tips', 'View 4 Underwriting Pillars & Tips')}
                </span>
                <span className="text-secondary-light group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Gemini Executive Summary & Advice */}
        <div className="rounded-4xl card-electric p-8 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-light font-bold text-sm">
              <IconAiSparkle className="size-4 text-secondary-light" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-secondary">
                {t('gemini_insights_title', 'Gemini AI Financial Co-Pilot Insights')}
              </h4>
              <p className="text-xs text-text-dark">
                {t('gemini_insights_desc', 'Live contextual explanation synthesized from your numbers')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-text-dark leading-relaxed">
            <div className="bg-dark/40 rounded-2xl p-5 border border-border/40">
              <strong className="text-white block mb-2 font-semibold flex items-center justify-between">
                <span>{t('cash_exec_summary', 'Cash Flow Executive Summary:')}</span>
                <Link to="/cash-flow" className="text-xs text-secondary-light font-normal hover:underline">
                  {t('forecaster_tool', 'Forecaster')} →
                </Link>
              </strong>
              <p>{translateGeminiContent(cashData?.ai_explanation) || t('ai_connecting', 'AI analysis connecting...')}</p>
            </div>
            <div className="bg-dark/40 rounded-2xl p-5 border border-border/40">
              <strong className="text-white block mb-2 font-semibold flex items-center justify-between">
                <span>{t('credit_opt_tips', 'Credit Score Optimization Tips:')}</span>
                <Link to="/credit-score" className="text-xs text-secondary-light font-normal hover:underline">
                  {t('score_engine', 'Scorecard')} →
                </Link>
              </strong>
              <p>{translateGeminiContent(creditData?.ai_advice) || t('ai_connecting', 'AI recommendations connecting...')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
