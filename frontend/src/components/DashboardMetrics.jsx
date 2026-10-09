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
  IconCreditScore,
} from './Icons';
import RiskBanner from './RiskBanner';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-light border border-border rounded-2xl p-4 text-xs shadow-2xl backdrop-blur-md">
      <div className="text-white font-semibold mb-2">{label}</div>
      <div className="flex flex-col gap-1.5 text-text">
        <div>
          <span className="text-text-dark">Projected Balance: </span>
          <strong className="text-primary font-mono">${d?.projected_balance?.toLocaleString()}</strong>
        </div>
        <div>
          <span className="text-text-dark">Income: </span>
          <span className="text-emerald-400 font-mono">+${d?.income?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-text-dark">Expenses: </span>
          <span className="text-rose-400 font-mono">-${d?.expenses?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default function DashboardMetrics() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-light border border-border text-xs text-primary mb-4 font-semibold tracking-wide uppercase">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            Live Data Engine • Python Backend Connected
          </div>
          <h2 className="text-h3 lg:text-h2 font-secondary font-bold text-white mb-4">
            Real-Time Financial <strong className="text-primary font-normal">Intelligence Hub</strong>
          </h2>
          <p className="text-text-dark max-w-2xl mx-auto text-base">
            Live metrics calculated directly by Pandas from your local CSV data contracts, paired with instant Gemini AI executive analysis.
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
                  <h4 className="text-white font-bold text-base mb-1">Low Cash Reserve Warning</h4>
                  <span className="text-[10px] bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full font-semibold">
                    Action Required
                  </span>
                </div>
                <p className="text-sm text-text-dark leading-relaxed">
                  Projected cash dips below $5,000 threshold on{' '}
                  <strong className="text-secondary">{cashData.low_cash_day}</strong>. Click here to open the Cash Flow Forecaster and view runway trajectory.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-secondary group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 pt-2">
              <span>Inspect Runway</span>
              <span>→</span>
            </div>
          </Link>
        )}

        {/* Controls: Horizon Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-light/70 border border-border rounded-3xl p-4 backdrop-blur-md">
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <span>Forecast Horizon:</span>
            <span className="text-primary">{days} Days Ahead</span>
          </div>
          <div className="flex gap-2">
            {[7, 14, 30, 60, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                <span>Anomaly Guard</span>
                <span className="text-[10px] text-rose-400 font-mono">
                  {overview.anomaliesCount !== null ? `${overview.anomaliesCount} Flags` : 'Active'}
                </span>
              </div>
              <div className="text-[11px] text-text-dark truncate">Duplicate &amp; outlier audit</div>
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
                <span>Tax Assistant</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {overview.nextTax?.days_remaining !== undefined
                    ? `${overview.nextTax.days_remaining}d Due`
                    : 'IRS 2024'}
                </span>
              </div>
              <div className="text-[11px] text-text-dark truncate">Deductions &amp; CPA memo</div>
            </div>
          </Link>

          <Link
            to="/scenario-planner"
            className="p-4 rounded-2xl bg-light/80 border border-border hover:border-primary/50 transition-all flex items-center gap-3.5 group cursor-pointer"
            title="Run Monte Carlo simulations for sales & cost shocks"
          >
            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <IconScenarioPlanner className="size-5" />
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-semibold text-white group-hover:text-primary transition-colors flex items-center justify-between">
                <span>Scenario Planner</span>
                <span className="text-[10px] text-primary font-mono">Monte Carlo</span>
              </div>
              <div className="text-[11px] text-text-dark truncate">Sales, hiring &amp; price shocks</div>
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
                <span>Accountant Portal</span>
                <span className="text-[10px] text-secondary font-mono">GAAP Certified</span>
              </div>
              <div className="text-[11px] text-text-dark truncate">Auditor &amp; Lender exports</div>
            </div>
          </Link>
        </div>

        {/* Top 4 Metric Cards — Clickable with Skeleton Loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Starting Cash */}
          <Link
            to="/cash-flow"
            className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer block"
            title="Open Cash Flow Forecaster"
          >
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
              <span>Starting Cash</span>
              <IconCashFlow className="size-3.5 text-text-dark group-hover:text-primary transition-colors" />
            </div>
            {loadingCash ? (
              <div className="h-9 w-28 bg-white/10 rounded-lg animate-pulse my-1" />
            ) : (
              <div className="text-2xl lg:text-3xl font-bold font-secondary text-white">
                ${summary.starting_cash?.toLocaleString() || '0'}
              </div>
            )}
            <div className="text-xs text-text-dark mt-2 group-hover:text-primary transition-colors flex items-center gap-1">
              <span>Current liquid position</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
          </Link>

          {/* Card 2: Projected Ending */}
          <Link
            to="/scenario-planner"
            className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden group hover:border-primary/50 transition-all cursor-pointer block"
            title="Simulate scenarios with Monte Carlo"
          >
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
              <span>Projected ({days}d)</span>
              <IconScenarioPlanner className="size-3.5 text-text-dark group-hover:text-primary transition-colors" />
            </div>
            {loadingCash ? (
              <div className="h-9 w-32 bg-white/10 rounded-lg animate-pulse my-1" />
            ) : (
              <div
                className={`text-2xl lg:text-3xl font-bold font-secondary ${
                  (summary.ending_balance || 0) >= (summary.starting_cash || 0)
                    ? 'text-primary'
                    : 'text-secondary'
                }`}
              >
                ${summary.ending_balance?.toLocaleString() || '0'}
              </div>
            )}
            <div className="text-xs text-text-dark mt-2 group-hover:text-primary transition-colors flex items-center gap-1">
              <span>Projected end balance</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
          </Link>

          {/* Card 3: Avg Daily Income */}
          <Link
            to="/cash-flow"
            className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden group hover:border-emerald-500/50 transition-all cursor-pointer block"
            title="View Daily Cash Inflow Dynamics"
          >
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
              <span>Daily Avg Inflow</span>
              <span className="text-[10px] text-emerald-400 font-mono">+Baseline</span>
            </div>
            {loadingCash ? (
              <div className="h-9 w-28 bg-white/10 rounded-lg animate-pulse my-1" />
            ) : (
              <div className="text-2xl lg:text-3xl font-bold font-secondary text-emerald-400">
                +${summary.avg_daily_income?.toLocaleString() || '0'}
              </div>
            )}
            <div className="text-xs text-text-dark mt-2 group-hover:text-emerald-300 transition-colors flex items-center gap-1">
              <span>Historical 90d baseline</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          </Link>

          {/* Card 4: Pending Invoices */}
          <Link
            to="/anomaly-guard"
            className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden group hover:border-amber-500/50 transition-all cursor-pointer block"
            title="Inspect pending invoices & fraud risk"
          >
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2 flex items-center justify-between">
              <span>Pending Invoices</span>
              <IconAnomalyGuard className="size-3.5 text-text-dark group-hover:text-amber-400 transition-colors" />
            </div>
            {loadingCash ? (
              <div className="h-9 w-32 bg-white/10 rounded-lg animate-pulse my-1" />
            ) : (
              <div className="text-2xl lg:text-3xl font-bold font-secondary text-amber-400">
                ${summary.pending_invoices?.toLocaleString() || '0'}
              </div>
            )}
            <div className="text-xs text-text-dark mt-2 group-hover:text-amber-300 transition-colors flex items-center gap-1">
              <span>Unpaid &amp; overdue bills</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div className="absolute top-0 right-0 size-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
          </Link>
        </div>

        {/* Main Chart + Credit Score Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Section (2 cols) */}
          <div className="lg:col-span-2 rounded-4xl bg-light border border-border p-8 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-secondary">
                    Projected Cash Trajectory
                  </h3>
                  <p className="text-xs text-text-dark mt-1">
                    Daily net income vs expense flow projection
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    {days} Day Window
                  </span>
                  <Link
                    to="/cash-flow"
                    className="text-xs text-text-dark hover:text-primary transition-colors hidden sm:inline"
                  >
                    Forecaster ↗
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
                          <stop offset="5%" stopColor="var(--color-primary, #937AFF)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="var(--color-primary, #937AFF)" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#202128" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#817E84', fontSize: 10 }}
                        tickFormatter={(val) => val?.slice(5)}
                        stroke="#202128"
                      />
                      <YAxis
                        tick={{ fill: '#817E84', fontSize: 10 }}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                        stroke="#202128"
                        width={50}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={5000} stroke="#FF5353" strokeDasharray="3 3" />
                      <Area
                        type="monotone"
                        dataKey="projected_balance"
                        stroke="#937AFF"
                        strokeWidth={2.5}
                        fill="url(#finpilotGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs text-text-dark">
              <span>Red dashed indicator = $5,000 liquidity buffer threshold</span>
              <Link to="/cash-flow" className="text-primary hover:underline font-medium">
                Detailed 90-Day Simulation →
              </Link>
            </div>
          </div>

          {/* Credit Score Gauge & Breakdown (1 col) */}
          <div className="rounded-4xl bg-light border border-border p-8 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white font-secondary">
                  Credit Readiness
                </h3>
                <Link
                  to="/credit-score"
                  className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  Score Engine ↗
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
                  {/* Gauge Display */}
                  <div className="flex flex-col items-center my-4">
                    <div className="relative size-36 flex items-center justify-center">
                      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#202128"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#937AFF"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * (creditData?.score || 0)) / 100}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <div className="text-3xl font-bold font-secondary text-white">
                          {creditData?.score}
                        </div>
                        <div className="text-xs text-primary font-semibold">
                          Grade {creditData?.grade}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Factor Breakdown Bars */}
                  <div className="space-y-3 mt-6">
                    {Object.entries(creditData?.factors || {}).map(([key, val]) => {
                      const maxScore =
                        key === 'revenue_consistency' ? 30 : key === 'expense_control' ? 20 : 25;
                      const label = key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-xs text-text-dark mb-1">
                            <span>{label}</span>
                            <span className="text-white font-mono">
                              {val}/{maxScore}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(val / maxScore) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 text-center">
              <Link
                to="/credit-score"
                className="text-xs text-primary hover:text-white font-semibold transition-colors inline-flex items-center gap-1 group"
              >
                <span>View 4 Underwriting Pillars &amp; Tips</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Gemini Executive Summary & Advice */}
        <div className="rounded-4xl bg-light border border-border p-8 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              <IconAiSparkle className="size-4 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-secondary">
                Gemini AI Financial Co-Pilot Insights
              </h4>
              <p className="text-xs text-text-dark">
                Live contextual explanation synthesized from your numbers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-text-dark leading-relaxed">
            <div className="bg-dark/40 rounded-2xl p-5 border border-border/40">
              <strong className="text-white block mb-2 font-semibold flex items-center justify-between">
                <span>Cash Flow Executive Summary:</span>
                <Link to="/cash-flow" className="text-xs text-primary font-normal hover:underline">
                  Forecaster →
                </Link>
              </strong>
              <p>{cashData?.ai_explanation || 'AI analysis connecting...'}</p>
            </div>
            <div className="bg-dark/40 rounded-2xl p-5 border border-border/40">
              <strong className="text-white block mb-2 font-semibold flex items-center justify-between">
                <span>Credit Score Optimization Tips:</span>
                <Link to="/credit-score" className="text-xs text-primary font-normal hover:underline">
                  Scorecard →
                </Link>
              </strong>
              <p>{creditData?.ai_advice || 'AI recommendations connecting...'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
