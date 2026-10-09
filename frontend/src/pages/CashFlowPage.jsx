import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { getCashForecast } from '../api/client';
import { IconAiSparkle } from '../components/Icons';

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
          <span className="text-secondary font-mono">-${d?.expenses?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default function CashFlowPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCashForecast(days);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const chartData = data?.forecast?.filter((_, i) => days <= 30 || i % (days > 60 ? 3 : 2) === 0) ?? [];
  const summary = data?.summary ?? {};

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-border text-xs text-primary mb-3 font-semibold">
            Predictive Liquidity Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
            Cash Flow <span className="text-primary font-normal">Forecaster</span>
          </h1>
          <p className="text-sm text-text-dark mt-1">
            Algorithmic cash runway projection powered by Pandas & Gemini AI
          </p>
        </div>

        {/* Days selector */}
        <div className="flex gap-2 bg-light border border-border rounded-2xl p-1.5 self-start">
          {[7, 14, 30, 60, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                days === d
                  ? 'btn-primary text-white'
                  : 'text-text-dark hover:text-white'
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {/* Low Cash Alert */}
      {data?.low_cash_alert && (
        <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 flex items-start gap-4">
          <div className="size-10 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-bold text-lg">
            !
          </div>
          <div>
            <h4 className="text-white font-bold text-base mb-1">Cash Reserve Alert</h4>
            <p className="text-sm text-text-dark">
              Projected cash dips below $5,000 threshold on <strong className="text-secondary">{data.low_cash_day}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 text-secondary text-sm">
          Error loading forecast: {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-light border border-border p-6">
          <div className="text-xs text-text-dark uppercase font-semibold mb-2">Starting Cash</div>
          <div className="text-2xl font-bold font-secondary text-white">
            ${summary.starting_cash?.toLocaleString() ?? '—'}
          </div>
          <div className="text-xs text-text-dark mt-2">Historical baseline balance</div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6">
          <div className="text-xs text-text-dark uppercase font-semibold mb-2">Projected Ending</div>
          <div className={`text-2xl font-bold font-secondary ${
            (summary.ending_balance || 0) >= (summary.starting_cash || 0) ? 'text-primary' : 'text-secondary'
          }`}>
            ${summary.ending_balance?.toLocaleString() ?? '—'}
          </div>
          <div className="text-xs text-text-dark mt-2">After {days} days forecast</div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6">
          <div className="text-xs text-text-dark uppercase font-semibold mb-2">Avg Daily Inflow</div>
          <div className="text-2xl font-bold font-secondary text-emerald-400">
            +${summary.avg_daily_income?.toLocaleString() ?? '—'}
          </div>
          <div className="text-xs text-text-dark mt-2">Last 90-day daily rate</div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6">
          <div className="text-xs text-text-dark uppercase font-semibold mb-2">Pending Invoices</div>
          <div className="text-2xl font-bold font-secondary text-amber-400">
            ${summary.pending_invoices?.toLocaleString() ?? '—'}
          </div>
          <div className="text-xs text-text-dark mt-2">Accounts receivable</div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="rounded-4xl bg-light border border-border p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold font-secondary text-white">
              Cash Projection Curve ({days} Days)
            </h3>
            <p className="text-xs text-text-dark mt-1">
              Simulated with standard volatility modeling
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#937AFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#937AFF" stopOpacity={0.0} />
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
                  fill="url(#cfGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Gemini AI Executive Analysis */}
      <div className="rounded-4xl bg-light border border-border p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            <IconAiSparkle className="size-4 text-primary" />
          </div>
          <div>
            <h4 className="text-base font-bold font-secondary text-white">
              Executive Cash Flow Analysis
            </h4>
            <p className="text-xs text-text-dark">Synthesized by Google Gemini AI</p>
          </div>
        </div>
        <div className="bg-dark/40 rounded-2xl p-6 border border-border/40 text-sm text-text-dark leading-relaxed">
          {data?.ai_explanation || 'AI analysis connecting...'}
        </div>
      </div>
    </div>
  );
}
