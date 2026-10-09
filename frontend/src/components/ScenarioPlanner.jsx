import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { simulateScenario } from '../api/client';
import { IconScenarioPlanner, IconAiSparkle } from './Icons';

// Inline markdown parser helper
const renderFormattedText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      const isNumber = /^[+-]?\$?[0-9,.]+%?$/.test(boldText);
      return (
        <strong
          key={index}
          className={`font-semibold ${isNumber ? 'text-white font-mono' : 'text-white'}`}
        >
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

// Fan Chart Custom Tooltip
const FanChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="bg-light border border-border rounded-2xl p-4 text-xs shadow-2xl backdrop-blur-md space-y-2 min-w-[220px]">
      <div className="text-white font-semibold border-b border-border pb-1 flex justify-between items-center">
        <span>Date: {label}</span>
        <span className="text-[10px] text-text-dark font-mono">500 Iterations</span>
      </div>

      <div className="space-y-1 text-text">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">90th Pct (Bullish):</span>
          <span className="text-emerald-400 font-mono font-semibold">${d.p90?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">75th Pct:</span>
          <span className="text-indigo-300 font-mono">${d.p75?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-0.5 border-y border-white/5 font-bold">
          <span className="text-primary">Median (P50 Expected):</span>
          <span className="text-primary font-mono text-sm">${d.p50?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">25th Pct:</span>
          <span className="text-amber-300 font-mono">${d.p25?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">10th Pct (Stress):</span>
          <span className="text-rose-400 font-mono font-semibold">${d.p10?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-white/5 text-[11px]">
          <span className="text-text-dark">Baseline (No Shocks):</span>
          <span className="text-zinc-300 font-mono">${d.baseline?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default function ScenarioPlanner() {
  // Scenario simulation parameters
  const [salesChange, setSalesChange] = useState(0);
  const [hiringCount, setHiringCount] = useState(0);
  const [procurementCost, setProcurementCost] = useState(0);
  const [receivablesDelay, setReceivablesDelay] = useState(0);
  const [horizonDays, setHorizonDays] = useState(30);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const initialLoadRef = useRef(false);

  const runSimulation = useCallback(
    async (overrideParams = null) => {
      setLoading(true);
      setError(null);
      try {
        const payload = overrideParams || {
          sales_change_pct: salesChange,
          hiring_count: hiringCount,
          procurement_cost_pct: procurementCost,
          receivables_delay_days: receivablesDelay,
          days: horizonDays,
          simulations: 500,
        };
        const result = await simulateScenario(payload);
        setData(result);
      } catch (err) {
        setError(err.message || 'Simulation execution failed.');
      } finally {
        setLoading(false);
      }
    },
    [salesChange, hiringCount, procurementCost, receivablesDelay, horizonDays]
  );

  // Live auto-run on slider movement with fast debounce
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      runSimulation();
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSimulation();
    }, 130);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [salesChange, hiringCount, procurementCost, receivablesDelay, horizonDays, runSimulation]);

  // Global sync listener
  useEffect(() => {
    const handleRefresh = () => {
      runSimulation();
    };
    window.addEventListener('finpilot:refresh', handleRefresh);
    return () => window.removeEventListener('finpilot:refresh', handleRefresh);
  }, [runSimulation]);

  const handleReset = () => {
    setSalesChange(0);
    setHiringCount(0);
    setProcurementCost(0);
    setReceivablesDelay(0);
    setHorizonDays(30);
    runSimulation({
      sales_change_pct: 0,
      hiring_count: 0,
      procurement_cost_pct: 0,
      receivables_delay_days: 0,
      days: 30,
      simulations: 500,
    });
  };

  const impact = data?.impact_summary || {};
  const projections = data?.projections || [];

  // Parse sections of AI analysis if present
  const parsedAnalysis = useMemo(() => {
    if (!data?.ai_analysis) return null;
    const raw = data.ai_analysis;
    const s1 = raw.match(/####\s*1\.\s*Runway[^\n]*\n([\s\S]*?)(?=####\s*2\.|$)/i);
    const s2 = raw.match(/####\s*2\.\s*Sensitivity[^\n]*\n([\s\S]*?)(?=####\s*3\.|$)/i);
    const s3 = raw.match(/####\s*3\.\s*Strategic[^\n]*\n([\s\S]*?)(?=$)/i);

    return {
      s1: s1 ? s1[1].trim() : null,
      s2: s2 ? s2[1].trim() : null,
      s3: s3 ? s3[1].trim() : null,
      raw,
    };
  }, [data?.ai_analysis]);

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-border text-xs text-primary mb-3 font-semibold">
            <IconScenarioPlanner className="size-4" />
            Monte Carlo Predictive Engine • 500 Stochastic Paths
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
            Scenario <span className="text-primary font-normal">Planner</span>
          </h1>
          <p className="text-sm text-text-dark mt-1">
            Simulate revenue shifts, headcount expansion, and material cost volatility across confidence percentiles
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline px-4 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all"
          >
            Reset Baseline
          </button>

          <button
            type="button"
            onClick={() => runSimulation()}
            disabled={loading}
            className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all"
          >
            <svg
              className={`size-4 ${loading ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 text-secondary text-sm">
          Simulation Error: {error}
        </div>
      )}

      {/* Interactive Simulation Controls Bar */}
      <div className="rounded-4xl bg-light border border-border p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold font-secondary text-white">Dynamic Stress Levers</h3>
            <p className="text-xs text-text-dark">Adjust variables to test balance resilience against downside risks</p>
          </div>

          {/* Horizon Pills & Live Status */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {loading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-[11px] text-primary font-semibold animate-pulse">
                <span className="size-1.5 rounded-full bg-primary animate-ping" />
                Live Recalculating 500 Paths...
              </span>
            )}
            <div className="flex gap-2">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setHorizonDays(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    horizonDays === d
                      ? 'btn-primary text-white'
                      : 'bg-white/5 border border-border text-text-dark hover:text-white'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Interactive Live-Linked Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Sales Change Slider */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-border space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Sales Revenue Shift</span>
              <span
                className={`font-mono font-bold text-sm ${
                  salesChange > 0 ? 'text-emerald-400' : salesChange < 0 ? 'text-rose-400' : 'text-zinc-300'
                }`}
              >
                {salesChange > 0 ? `+${salesChange}%` : `${salesChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={salesChange}
              onChange={(e) => setSalesChange(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-dark">
              <span>-50% Recession</span>
              <span>0% Baseline</span>
              <span>+50% Surge</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[-20, 0, 15, 30].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSalesChange(val)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer ${
                    salesChange === val ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {val > 0 ? `+${val}%` : `${val}%`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Headcount Expansion Slider */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-border space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Headcount / Hiring</span>
              <span className="font-mono font-bold text-sm text-indigo-300">
                +{hiringCount} staff
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={hiringCount}
              onChange={(e) => setHiringCount(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-dark">
              <span>0 Hires</span>
              <span>+7 Staff</span>
              <span>+15 Staff</span>
            </div>
            <div className="text-[11px] text-text-dark pt-1">
              Est. Payroll: <strong className="text-zinc-300 font-mono">+${(hiringCount * 4500).toLocaleString()}/mo</strong>
            </div>
          </div>

          {/* 3. Procurement Cost Slider */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-border space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Procurement Costs</span>
              <span
                className={`font-mono font-bold text-sm ${
                  procurementCost > 0 ? 'text-rose-400' : procurementCost < 0 ? 'text-emerald-400' : 'text-zinc-300'
                }`}
              >
                {procurementCost > 0 ? `+${procurementCost}%` : `${procurementCost}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="40"
              step="5"
              value={procurementCost}
              onChange={(e) => setProcurementCost(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-dark">
              <span>-30% Discount</span>
              <span>0% Flat</span>
              <span>+40% Inflation</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[-10, 0, 10, 25].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setProcurementCost(val)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer ${
                    procurementCost === val ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {val > 0 ? `+${val}%` : `${val}%`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Receivables Collection Shift Slider */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-border space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">Collections Shift</span>
              <span
                className={`font-mono font-bold text-sm ${
                  receivablesDelay > 0
                    ? 'text-rose-400'
                    : receivablesDelay < 0
                    ? 'text-emerald-400'
                    : 'text-zinc-300'
                }`}
              >
                {receivablesDelay > 0
                  ? `+${receivablesDelay}d Delay`
                  : receivablesDelay < 0
                  ? `${receivablesDelay}d Fast`
                  : '0d Normal'}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="30"
              step="5"
              value={receivablesDelay}
              onChange={(e) => setReceivablesDelay(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-dark">
              <span>-15d Fast</span>
              <span>0d Baseline</span>
              <span>+30d Delinquent</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[-10, 0, 15, 30].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setReceivablesDelay(val)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer ${
                    receivablesDelay === val
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {val > 0 ? `+${val}d` : `${val}d`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">Expected Ending Cash (P50)</div>
          <div className="text-3xl font-bold font-secondary text-primary font-mono">
            ${impact.ending_cash_p50?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-text-dark mt-2 flex items-center gap-1.5">
            <span
              className={`font-mono font-semibold ${
                impact.net_cash_impact >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {impact.net_cash_impact >= 0 ? `+$${impact.net_cash_impact?.toLocaleString()}` : `-$${Math.abs(impact.net_cash_impact || 0)?.toLocaleString()}`}
            </span>
            <span>vs Baseline</span>
          </div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">Worst-Case Stress (P10)</div>
          <div className="text-3xl font-bold font-secondary text-rose-400 font-mono">
            ${impact.ending_cash_p10?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-rose-400/80 mt-2 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            10th Percentile Bearish Floor
          </div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">Buffer Breach Risk</div>
          <div
            className={`text-3xl font-bold font-secondary font-mono ${
              (impact.shortfall_probability || 0) > 20
                ? 'text-rose-400'
                : (impact.shortfall_probability || 0) > 5
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {impact.shortfall_probability || 0}%
          </div>
          <div className="text-xs text-text-dark mt-2">
            Probability of dipping &lt; $5,000 threshold
          </div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">Procurement Spend Shift</div>
          <div className="text-2xl font-bold font-secondary text-white font-mono mt-1">
            {impact.procurement_cost_delta >= 0
              ? `+$${impact.procurement_cost_delta?.toLocaleString()}`
              : `-$${Math.abs(impact.procurement_cost_delta || 0)?.toLocaleString()}`}
          </div>
          <div className="text-xs text-text-dark mt-2 truncate">
            {impact.credit_risk_impact}
          </div>
        </div>
      </div>

      {/* Confidence Fan Chart Card */}
      <div className="rounded-4xl bg-light border border-border p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold font-secondary text-white">
              Monte Carlo Cash Runway Fan Chart
            </h3>
            <p className="text-xs text-text-dark mt-0.5">
              Percentile dispersion showing median path (P50), 50% confidence band (P25–P75), and 80% confidence band (P10–P90)
            </p>
          </div>

          {/* Chart Legend Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-primary"></span>
              <span className="text-text-dark">P50 (Median)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-indigo-500/40"></span>
              <span className="text-text-dark">P25–P75 Band</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-500/40"></span>
              <span className="text-text-dark">P10 Stress Floor</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t border-dashed border-zinc-400"></span>
              <span className="text-text-dark">Baseline</span>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[380px] w-full pt-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <p className="text-xs text-text-dark">Simulating 500 stochastic paths...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {/* P90 Outer Fan Gradient */}
                  <linearGradient id="fanBandOuter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#937AFF" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#937AFF" stopOpacity={0.03} />
                  </linearGradient>
                  {/* P75 Inner Fan Gradient */}
                  <linearGradient id="fanBandInner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4D36D0" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#4D36D0" stopOpacity={0.08} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#202128" />
                <XAxis
                  dataKey="date"
                  stroke="#817E84"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(d) => (d ? d.slice(5) : '')}
                />
                <YAxis
                  stroke="#817E84"
                  fontSize={11}
                  tickLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<FanChartTooltip />} />

                {/* Statutory Minimum Safety Buffer */}
                <ReferenceLine y={5000} stroke="#FF5353" strokeDasharray="3 3" label={{ value: 'Min Reserve $5k', fill: '#FF5353', fontSize: 10, position: 'insideBottomRight' }} />

                {/* Outer Fan: P90 */}
                <Area type="monotone" dataKey="p90" stroke="none" fill="url(#fanBandOuter)" />
                {/* Inner Fan: P75 */}
                <Area type="monotone" dataKey="p75" stroke="none" fill="url(#fanBandInner)" />

                {/* P10 Floor Area */}
                <Line type="monotone" dataKey="p10" stroke="#FF5353" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />

                {/* Baseline Reference Trajectory */}
                <Line type="monotone" dataKey="baseline" stroke="#817E84" strokeWidth={2} strokeDasharray="5 5" dot={false} />

                {/* Expected P50 Median Line */}
                <Line type="monotone" dataKey="p50" stroke="#937AFF" strokeWidth={3} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gemini AI Scenario Analysis Panel */}
      <div className="rounded-4xl bg-light border border-border overflow-hidden shadow-2xl">
        <div className="p-6 lg:p-8 border-b border-border bg-gradient-to-r from-primary/10 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <IconAiSparkle className="size-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[11px] font-semibold mb-1">
                Gemini AI Predictive Advisory
              </div>
              <h3 className="text-xl font-bold font-secondary text-white">
                Executive Scenario &amp; Stress Analysis
              </h3>
            </div>
          </div>
        </div>

        {/* Formatted Insights Grid */}
        <div className="p-6 lg:p-8 space-y-6">
          {parsedAnalysis?.s1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Runway & Liquidity */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                  <span className="size-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">1</span>
                  <h4 className="text-sm font-bold font-secondary text-white">Runway &amp; Liquidity Trajectory</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {renderFormattedText(parsedAnalysis.s1)}
                </p>
              </div>

              {/* Card 2: Sensitivity & Cost Drivers */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                  <span className="size-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">2</span>
                  <h4 className="text-sm font-bold font-secondary text-white">Sensitivity &amp; Cost Drivers</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {renderFormattedText(parsedAnalysis.s2)}
                </p>
              </div>

              {/* Card 3: Strategic Recommendations */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                  <span className="size-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">3</span>
                  <h4 className="text-sm font-bold font-secondary text-white">Strategic Recommendations</h4>
                </div>
                <div className="text-xs text-zinc-300 leading-relaxed space-y-2">
                  {renderFormattedText(parsedAnalysis.s3)}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-border">
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {renderFormattedText(data?.ai_analysis || 'Scenario analysis generated.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
