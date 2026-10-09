import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { getCashForecast, getCreditScore } from '../api/client';
import { IconAiSparkle } from './Icons';

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
  const [loadingCash, setLoadingCash] = useState(true);
  const [loadingCredit, setLoadingCredit] = useState(true);
  const [errorCash, setErrorCash] = useState(null);
  const [errorCredit, setErrorCredit] = useState(null);

  const fetchCash = useCallback(async () => {
    setLoadingCash(true);
    setErrorCash(null);
    try {
      const data = await getCashForecast(days);
      setCashData(data);
    } catch (err) {
      setErrorCash(err.message);
    } finally {
      setLoadingCash(false);
    }
  }, [days]);

  useEffect(() => {
    fetchCash();
  }, [fetchCash]);

  useEffect(() => {
    setLoadingCredit(true);
    getCreditScore()
      .then(setCreditData)
      .catch((err) => setErrorCredit(err.message))
      .finally(() => setLoadingCredit(false));
  }, []);

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

        {/* Low Cash Warning Banner */}
        {cashData?.low_cash_alert && (
          <div className="mb-8 p-6 rounded-3xl bg-secondary/10 border border-secondary/30 flex items-start gap-4">
            <div className="size-10 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-bold text-lg">
              !
            </div>
            <div>
              <h4 className="text-white font-bold text-base mb-1">Low Cash Reserve Warning</h4>
              <p className="text-sm text-text-dark leading-relaxed">
                Projected cash dips below $5,000 threshold on <strong className="text-secondary">{cashData.low_cash_day}</strong>. Consider accelerating receivables collection or delaying non-essential supplier disbursements.
              </p>
            </div>
          </div>
        )}

        {/* Controls: Horizon Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-light/70 border border-border rounded-3xl p-4 backdrop-blur-md">
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

        {/* Top 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Starting Cash */}
          <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2">
              Starting Cash
            </div>
            <div className="text-2xl lg:text-3xl font-bold font-secondary text-white">
              {loadingCash ? '...' : `$${summary.starting_cash?.toLocaleString() || '0'}`}
            </div>
            <div className="text-xs text-text-dark mt-2">Current liquid position</div>
            <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
          </div>

          {/* Card 2: Projected Ending */}
          <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2">
              Projected ({days}d)
            </div>
            <div className={`text-2xl lg:text-3xl font-bold font-secondary ${
              (summary.ending_balance || 0) >= (summary.starting_cash || 0) ? 'text-primary' : 'text-secondary'
            }`}>
              {loadingCash ? '...' : `$${summary.ending_balance?.toLocaleString() || '0'}`}
            </div>
            <div className="text-xs text-text-dark mt-2">Projected end balance</div>
            <div className="absolute top-0 right-0 size-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
          </div>

          {/* Card 3: Avg Daily Income */}
          <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2">
              Daily Avg Inflow
            </div>
            <div className="text-2xl lg:text-3xl font-bold font-secondary text-emerald-400">
              {loadingCash ? '...' : `+$${summary.avg_daily_income?.toLocaleString() || '0'}`}
            </div>
            <div className="text-xs text-text-dark mt-2">Historical 90d baseline</div>
            <div className="absolute top-0 right-0 size-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          </div>

          {/* Card 4: Pending Invoices */}
          <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="text-xs text-text-dark uppercase font-semibold tracking-wider mb-2">
              Pending Invoices
            </div>
            <div className="text-2xl lg:text-3xl font-bold font-secondary text-amber-400">
              {loadingCash ? '...' : `$${summary.pending_invoices?.toLocaleString() || '0'}`}
            </div>
            <div className="text-xs text-text-dark mt-2">Unpaid & overdue bills</div>
            <div className="absolute top-0 right-0 size-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
          </div>
        </div>

        {/* Main Chart + Credit Score Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart Section (2 cols) */}
          <div className="lg:col-span-2 rounded-4xl bg-light border border-border p-8 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-secondary">
                  Projected Cash Trajectory
                </h3>
                <p className="text-xs text-text-dark mt-1">
                  Daily net income vs expense flow projection
                </p>
              </div>
              <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                {days} Day Window
              </span>
            </div>

            {loadingCash ? (
              <div className="h-72 flex items-center justify-center">
                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
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

          {/* Credit Score Gauge & Breakdown (1 col) */}
          <div className="rounded-4xl bg-light border border-border p-8 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white font-secondary">
                  Credit Readiness
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold">
                  Credit Engine
                </span>
              </div>

              {loadingCredit ? (
                <div className="py-12 flex items-center justify-center">
                  <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
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
                          cx="50" cy="50" r="40"
                          stroke="#202128" strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50" cy="50" r="40"
                          stroke="#937AFF" strokeWidth="8"
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
                      const maxScore = key === 'revenue_consistency' ? 30 : key === 'expense_control' ? 20 : 25;
                      const label = key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-xs text-text-dark mb-1">
                            <span>{label}</span>
                            <span className="text-white font-mono">{val}/{maxScore}</span>
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
              <span className="text-xs text-text-dark">Evaluated from transactions & invoice ledger</span>
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
              <strong className="text-white block mb-2 font-semibold">Cash Flow Executive Summary:</strong>
              <p>{cashData?.ai_explanation || 'AI analysis connecting...'}</p>
            </div>
            <div className="bg-dark/40 rounded-2xl p-5 border border-border/40">
              <strong className="text-white block mb-2 font-semibold">Credit Score Optimization Tips:</strong>
              <p>{creditData?.ai_advice || 'AI recommendations connecting...'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
