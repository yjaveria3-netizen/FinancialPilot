import { useState, useEffect, useCallback } from 'react';
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
import { getCashForecast } from '../api/client';
import { IconAiSparkle } from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

const CustomTooltip = ({ active, payload, label, t }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-light border border-border rounded-2xl p-4 text-xs shadow-2xl backdrop-blur-md">
      <div className="text-white font-semibold mb-2">{label}</div>
      <div className="flex flex-col gap-1.5 text-text">
        <div>
          <span className="text-text-dark">{t('projected_end_bal', 'Projected Balance')}: </span>
          <strong className="text-secondary-light font-mono">Rs. {d?.projected_balance?.toLocaleString()}</strong>
        </div>
        <div>
          <span className="text-text-dark">{t('daily_avg_inflow', 'Income')}: </span>
          <span className="text-secondary-light font-mono">+Rs. {d?.income?.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-text-dark">{t('expense_control', 'Expenses')}: </span>
          <span className="text-secondary-light font-mono">-Rs. {d?.expenses?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default function CashFlowPage() {
  const { t, translateGeminiContent } = useLanguage();
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-secondary/40 text-xs text-secondary-light mb-3 font-semibold">
            {t('cf_badge', 'Predictive Liquidity Engine')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
            {t('cf_title_1', 'Cash Flow')}{' '}
            <span className="text-secondary-light font-bold">{t('cf_title_2', 'Forecaster')}</span>
          </h1>
          <p className="text-sm text-text-dark mt-1">
            {t(
              'cf_subtitle',
              'Algorithmic cash runway projection powered by Pandas & Gemini AI'
            )}
          </p>
        </div>

        {/* Days selector */}
        <div className="flex gap-2 bg-light border border-border rounded-2xl p-1.5 self-start">
          {[7, 14, 30, 60, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-mono ${
                days === d ? 'btn-primary text-white' : 'text-text-dark hover:text-white'
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
            <h4 className="text-white font-bold text-base mb-1">
              {t('cf_alert_title', 'Cash Reserve Alert')}
            </h4>
            <p className="text-sm text-text-dark">
              {t('low_cash_desc_prefix', 'Projected cash dips below $5,000 threshold on')}{' '}
              <strong className="text-secondary font-mono">{data.low_cash_day}</strong>.
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
        <div className="rounded-3xl card-electric p-6">
          <div className="text-xs text-text-dark uppercase font-semibold mb-2">
            {t('starting_cash', 'Starting Cash')}
          </div>
          <div className="text-2xl font-bold font-secondary text-white font-mono">
            Rs. {summary.starting_cash?.toLocaleString() ?? '—'}
          </div>
          <div className="text-xs text-text-dark mt-2">
            {t('cf_baseline_balance', 'Historical baseline balance')}
          </div>
        </div>

        <div className="rounded-3xl card-electric p-6">
          <div className="text-xs text-text-dark uppercase font-semibold mb-2">
            {t('projected', 'Projected Ending')}
          </div>
          <div
            className={`text-2xl font-bold font-secondary font-mono ${
              (summary.ending_balance || 0) >= (summary.starting_cash || 0)
                ? 'text-secondary-light'
                : 'text-amber-400'
            }`}
          >
            Rs. {summary.ending_balance?.toLocaleString() ?? '—'}
          </div>
          <div className="text-xs text-text-dark mt-2">
            {t('cf_after_forecast', 'After forecast period')} ({days}d)
          </div>
        </div>

        <div className="rounded-3xl card-electric p-6">
          <div className="text-xs text-text-dark uppercase font-semibold mb-2">
            {t('daily_avg_inflow', 'Avg Daily Inflow')}
          </div>
          <div className="text-2xl font-bold font-secondary text-secondary-light font-mono">
            +Rs. {summary.avg_daily_income?.toLocaleString() ?? '—'}
          </div>
          <div className="text-xs text-text-dark mt-2">
            {t('cf_daily_rate', 'Last 90-day daily rate')}
          </div>
        </div>

        <div className="rounded-3xl card-electric p-6">
          <div className="text-xs text-text-dark uppercase font-semibold mb-2">
            {t('pending_invoices', 'Pending Invoices')}
          </div>
          <div className="text-2xl font-bold font-secondary text-secondary-light font-mono">
            Rs. {summary.pending_invoices?.toLocaleString() ?? '—'}
          </div>
          <div className="text-xs text-text-dark mt-2">
            {t('cf_receivables', 'Accounts receivable')}
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="rounded-4xl card-electric p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold font-secondary text-white">
              {t('cf_curve_title', 'Cash Projection Curve')} ({days} {t('days', 'Days')})
            </h3>
            <p className="text-xs text-text-dark mt-1">
              {t('cf_curve_subtitle', 'Simulated with standard volatility modeling')}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="size-8 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DA7B93" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#DA7B93" stopOpacity={0.0} />
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
                <Tooltip content={<CustomTooltip t={t} />} />
                <ReferenceLine y={5000} stroke="#DA7B93" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="projected_balance"
                  stroke="#DA7B93"
                  strokeWidth={2.5}
                  fill="url(#cfGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Gemini AI Executive Analysis */}
      <div className="rounded-4xl card-electric p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-8 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-light font-bold text-sm">
            <IconAiSparkle className="size-4 text-secondary-light" />
          </div>
          <div>
            <h4 className="text-base font-bold font-secondary text-white">
              {t('cf_exec_title', 'Executive Cash Flow Analysis')}
            </h4>
            <p className="text-xs text-text-dark">
              {t('cf_gemini_by', 'Synthesized by Google Gemini AI')}
            </p>
          </div>
        </div>
        <div className="bg-dark/40 rounded-2xl p-6 border border-border/40 text-sm text-text-dark leading-relaxed">
          {translateGeminiContent(data?.ai_explanation) || t('ai_connecting', 'AI analysis connecting...')}
        </div>
      </div>
    </div>
  );
}
