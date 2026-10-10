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
import { useLanguage } from '../context/LanguageContext';

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
          <span className="text-secondary-light font-mono font-semibold">${d.p90?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">75th Pct:</span>
          <span className="text-secondary-light font-mono">${d.p75?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-0.5 border-y border-white/5 font-bold">
          <span className="text-secondary-light">Median (P50 Expected):</span>
          <span className="text-secondary-light font-mono text-sm">${d.p50?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">25th Pct:</span>
          <span className="text-secondary font-mono">${d.p25?.toLocaleString()}</span>
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
  const { t, translateGeminiContent } = useLanguage();
  // Scenario simulation parameters
  const [salesChange, setSalesChange] = useState(0);
  const [hiringCount, setHiringCount] = useState(0);
  const [procurementCost, setProcurementCost] = useState(0);
  const [receivablesDelay, setReceivablesDelay] = useState(0);
  const [horizonDays, setHorizonDays] = useState(30);

  // Live Demo Custom Projections (Cash-In & Cash-Out) State
  const DEFAULT_CUSTOM_ITEMS = useMemo(
    () => [
      { id: 'grant-1', name: 'Federal Innovation Grant', type: 'inflow', amount: 15000, active: true },
      { id: 'capex-1', name: 'High-Speed Looms Capex', type: 'outflow', amount: 7500, active: true },
    ],
    []
  );

  const [customItems, setCustomItems] = useState(() => {
    const cached = sessionStorage.getItem('finpilot:custom_scenario_lines');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn('Failed parsing cached scenario lines:', e);
      }
    }
    return [
      { id: 'grant-1', name: 'Federal Innovation Grant', type: 'inflow', amount: 15000, active: true },
      { id: 'capex-1', name: 'High-Speed Looms Capex', type: 'outflow', amount: 7500, active: true },
    ];
  });

  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('inflow');
  const [newItemAmount, setNewItemAmount] = useState('');

  const customInflow = useMemo(() => {
    return customItems
      .filter((item) => item.active && item.type === 'inflow')
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [customItems]);

  const customOutflow = useMemo(() => {
    return customItems
      .filter((item) => item.active && item.type === 'outflow')
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [customItems]);

  const handleAddCustomItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemAmount) return;
    const item = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      type: newItemType,
      amount: parseFloat(newItemAmount) || 0,
      active: true,
    };
    const updated = [item, ...customItems];
    setCustomItems(updated);
    sessionStorage.setItem('finpilot:custom_scenario_lines', JSON.stringify(updated));
    setNewItemName('');
    setNewItemAmount('');
  };

  const handleToggleCustomItem = (id) => {
    const updated = customItems.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    setCustomItems(updated);
    sessionStorage.setItem('finpilot:custom_scenario_lines', JSON.stringify(updated));
  };

  const handleDeleteCustomItem = (id) => {
    const updated = customItems.filter((item) => item.id !== id);
    setCustomItems(updated);
    sessionStorage.setItem('finpilot:custom_scenario_lines', JSON.stringify(updated));
  };

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
          custom_inflow: customInflow,
          custom_outflow: customOutflow,
        };
        const result = await simulateScenario(payload);
        setData(result);
      } catch (err) {
        setError(err.message || 'Simulation execution failed.');
      } finally {
        setLoading(false);
      }
    },
    [salesChange, hiringCount, procurementCost, receivablesDelay, horizonDays, customInflow, customOutflow]
  );

  // Live auto-run on slider movement or custom line item shift with fast debounce
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
  }, [salesChange, hiringCount, procurementCost, receivablesDelay, horizonDays, customInflow, customOutflow, runSimulation]);

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
    setCustomItems(DEFAULT_CUSTOM_ITEMS);
    sessionStorage.setItem('finpilot:custom_scenario_lines', JSON.stringify(DEFAULT_CUSTOM_ITEMS));
    runSimulation({
      sales_change_pct: 0,
      hiring_count: 0,
      procurement_cost_pct: 0,
      receivables_delay_days: 0,
      days: 30,
      simulations: 500,
      custom_inflow: 15000,
      custom_outflow: 7500,
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-secondary/30 text-xs text-secondary-light mb-3 font-semibold">
            <IconScenarioPlanner className="size-4" />
            {t('sp_badge', 'Monte Carlo Predictive Engine • 500 Stochastic Paths')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
            {t('sp_title_1', 'Scenario')}{' '}
            <span className="text-secondary-light font-normal">{t('sp_title_2', 'Planner')}</span>
          </h1>
          <p className="text-sm text-text-dark mt-1">
            {t(
              'sp_subtitle',
              'Simulate revenue shifts, headcount expansion, and material cost volatility across confidence percentiles'
            )}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="btn-outline px-4 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all hover:border-[#DA7B93]/60 hover:shadow-[0_0_25px_rgba(218,123,147,0.35)]"
          >
            {t('sp_reset_params', 'Reset Baseline')}
          </button>

          <button
            type="button"
            onClick={() => runSimulation()}
            disabled={loading}
            className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:border-[#DA7B93]/60 hover:shadow-[0_0_25px_rgba(218,123,147,0.35)]"
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
            {loading ? t('sp_simulating', 'Simulating...') : t('sp_run_simulation', 'Run Simulation')}
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
      <div className="rounded-4xl card-electric p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold font-secondary text-white">{t('sp_dynamic_levers', 'Dynamic Stress Levers')}</h3>
            <p className="text-xs text-text-dark">{t('sp_dynamic_levers_sub', 'Adjust variables to test balance resilience against downside risks')}</p>
          </div>

          {/* Horizon Pills & Live Status */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            {loading && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/35 text-[11px] text-secondary-light font-semibold animate-pulse">
                <span className="size-1.5 rounded-full bg-secondary-light animate-ping" />
                {t('sp_recalculating', 'Live Recalculating 500 Paths...')}
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
                      ? 'btn-primary text-white shadow-md shadow-secondary/20'
                      : 'bg-white/5 border border-border text-text-dark hover:text-white'
                  }`}
                >
                  {d} {t('sp_days', 'Days')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Interactive Live-Linked Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Sales Change Slider */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-border space-y-3 hover:border-secondary/40 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">{t('sp_sales_revenue_shift', 'Sales Revenue Shift')}</span>
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
              className="w-full accent-secondary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-dark">
              <span>-50% {t('sp_recession', 'Recession')}</span>
              <span>0% {t('sp_baseline', 'Baseline')}</span>
              <span>+50% {t('sp_surge', 'Surge')}</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[-20, 0, 15, 30].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSalesChange(val)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer ${
                    salesChange === val ? 'bg-secondary/25 text-secondary-light border border-secondary/40' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {val > 0 ? `+${val}%` : `${val}%`}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Headcount Expansion Slider */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-border space-y-3 hover:border-secondary/40 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">{t('sp_headcount', 'Headcount / Hiring')}</span>
              <span className="font-mono font-bold text-sm text-indigo-300">
                +{hiringCount} {t('sp_staff', 'staff')}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={hiringCount}
              onChange={(e) => setHiringCount(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-dark">
              <span>0 {t('sp_hires', 'Hires')}</span>
              <span>+7 {t('sp_staff', 'Staff')}</span>
              <span>+15 {t('sp_staff', 'Staff')}</span>
            </div>
            <div className="text-[11px] text-text-dark pt-1">
              {t('sp_est_payroll', 'Est. Payroll:')} <strong className="text-zinc-300 font-mono">+${(hiringCount * 4500).toLocaleString()}/mo</strong>
            </div>
          </div>

          {/* 3. Procurement Cost Slider */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-border space-y-3 hover:border-secondary/40 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">{t('sp_procurement_costs', 'Procurement Costs')}</span>
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
              className="w-full accent-secondary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-dark">
              <span>-30% {t('sp_discount', 'Discount')}</span>
              <span>0% {t('sp_flat', 'Flat')}</span>
              <span>+40% {t('sp_inflation', 'Inflation')}</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[-10, 0, 10, 25].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setProcurementCost(val)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer ${
                    procurementCost === val ? 'bg-secondary/25 text-secondary-light border border-secondary/40' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {val > 0 ? `+${val}%` : `${val}%`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Receivables Collection Shift Slider */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-border space-y-3 hover:border-secondary/40 transition-colors">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">{t('sp_collections_shift', 'Collections Shift')}</span>
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
                  ? `+${receivablesDelay}d ${t('sp_delay', 'Delay')}`
                  : receivablesDelay < 0
                  ? `${receivablesDelay}d ${t('sp_fast', 'Fast')}`
                  : `0d ${t('sp_normal', 'Normal')}`}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="30"
              step="5"
              value={receivablesDelay}
              onChange={(e) => setReceivablesDelay(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-dark">
              <span>-15d {t('sp_fast', 'Fast')}</span>
              <span>0d {t('sp_baseline', 'Baseline')}</span>
              <span>+30d {t('sp_delinquent', 'Delinquent')}</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[-10, 0, 15, 30].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setReceivablesDelay(val)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold cursor-pointer ${
                    receivablesDelay === val
                      ? 'bg-secondary/25 text-secondary-light border border-secondary/40'
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

      {/* Live Demo Custom Projections (Cash-In & Cash-Out) */}
      <div className="rounded-4xl card-electric p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-secondary-light animate-pulse" />
              <h3 className="text-lg font-bold font-secondary text-white">
                {t('custom_projections_title', 'Live Demo Custom Projections (Cash-In & Cash-Out)')}
              </h3>
            </div>
            <p className="text-xs text-text-dark mt-0.5">
              {t(
                'custom_projections_desc',
                'Add one-off grants, equity, capex, or supplier bulk purchases to immediately recalculate 500 Monte Carlo paths'
              )}
            </p>
          </div>

          {/* Net Summary Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-secondary/15 border border-secondary/30 text-xs font-mono">
              <span className="text-text-dark mr-1.5">{t('total_custom_inflows', 'Inflow:')}</span>
              <span className="text-secondary-light font-bold">
                +${customInflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono">
              <span className="text-text-dark mr-1.5">{t('total_custom_outflows', 'Outflow:')}</span>
              <span className="text-rose-400 font-bold">
                -${customOutflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-border text-xs font-mono">
              <span className="text-text-dark mr-1.5">{t('net_custom_impact', 'Net Impact:')}</span>
              <span className={`font-bold ${customInflow - customOutflow >= 0 ? 'text-secondary-light' : 'text-rose-400'}`}>
                {customInflow - customOutflow >= 0 ? '+' : '-'}$
                {Math.abs(customInflow - customOutflow).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Add Custom Projection Item Form */}
        <form
          onSubmit={handleAddCustomItem}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-border/80"
        >
          <div className="sm:col-span-5">
            <input
              type="text"
              required
              placeholder={t('item_name_placeholder', 'e.g. Government Grant / Machinery Capex')}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full bg-dark/80 border border-border rounded-xl px-3.5 py-2 text-xs text-white placeholder-text-dark focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
              className="w-full bg-dark/80 border border-border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-secondary transition-colors"
            >
              <option value="inflow">{t('inflow', 'Cash-In (+)')}</option>
              <option value="outflow">{t('outflow', 'Cash-Out (-)')}</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <input
              type="number"
              required
              step="100"
              min="1"
              placeholder={t('item_amount', 'Amount ($)')}
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              className="w-full bg-dark/80 border border-border rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-text-dark focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-full min-h-[36px] px-3 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary-light text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
            >
              <span>+ {t('add_line_item', 'Add Item')}</span>
            </button>
          </div>
        </form>

        {/* Active Items Table / List */}
        {customItems.length > 0 && (
          <div className="space-y-2">
            {customItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  item.active
                    ? 'bg-white/[0.02] border-border hover:border-secondary/40'
                    : 'bg-white/[0.01] border-border/40 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleCustomItem(item.id)}
                    className={`size-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                      item.active
                        ? 'bg-secondary/30 border-secondary text-secondary-light'
                        : 'bg-dark border-border text-transparent'
                    }`}
                    title={
                      item.active
                        ? 'Active in simulation (click to disable)'
                        : 'Inactive (click to enable)'
                    }
                  >
                    ✓
                  </button>

                  <div>
                    <div className="font-semibold text-xs text-white flex items-center gap-2">
                      <span>{item.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                          item.type === 'inflow'
                            ? 'bg-secondary/20 text-secondary-light border border-secondary/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.type === 'inflow' ? t('inflow', 'Cash-In (+)') : t('outflow', 'Cash-Out (-)')}
                      </span>
                    </div>
                    <div className="text-[10px] text-text-dark mt-0.5">
                      {item.active
                        ? t('active', 'Simulated in active 500 paths')
                        : t('inactive', 'Excluded from paths')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`font-mono font-bold text-sm ${
                      item.type === 'inflow' ? 'text-secondary-light' : 'text-rose-400'
                    }`}
                  >
                    {item.type === 'inflow' ? '+' : '-'}$
                    {Number(item.amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCustomItem(item.id)}
                    className="size-7 rounded-lg bg-white/5 border border-border text-text-dark hover:text-rose-400 hover:border-rose-500/40 transition-all flex items-center justify-center cursor-pointer text-xs"
                    title="Delete custom projection item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl card-electric p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium mb-2">{t('sp_kpi_ending_cash', 'Expected Ending Cash (P50)')}</div>
          <div className="text-3xl font-bold font-secondary text-secondary-light font-mono">
            ${impact.ending_cash_p50?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-text-dark mt-2 flex items-center gap-1.5">
            <span
              className={`font-mono font-semibold ${
                impact.net_cash_impact >= 0 ? 'text-secondary-light' : 'text-rose-400'
              }`}
            >
              {impact.net_cash_impact >= 0 ? `+$${impact.net_cash_impact?.toLocaleString()}` : `-$${Math.abs(impact.net_cash_impact || 0)?.toLocaleString()}`}
            </span>
            <span>{t('sp_kpi_vs_baseline', 'vs Baseline')}</span>
          </div>
        </div>

        <div className="rounded-3xl card-electric p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium mb-2">{t('sp_kpi_worst_case', 'Worst-Case Stress (P10)')}</div>
          <div className="text-3xl font-bold font-secondary text-secondary-light font-mono">
            ${impact.ending_cash_p10?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-text-dark mt-2 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-secondary-light animate-pulse"></span>
            {t('sp_kpi_bearish_floor', '10th Percentile Bearish Floor')}
          </div>
        </div>

        <div className="rounded-3xl card-electric p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium mb-2">{t('sp_kpi_buffer_risk', 'Buffer Breach Risk')}</div>
          <div
            className={`text-3xl font-bold font-secondary font-mono ${
              (impact.shortfall_probability || 0) > 20
                ? 'text-rose-400'
                : (impact.shortfall_probability || 0) > 5
                ? 'text-amber-400'
                : 'text-secondary-light'
            }`}
          >
            {impact.shortfall_probability || 0}%
          </div>
          <div className="text-xs text-text-dark mt-2">
            {t('sp_kpi_buffer_desc', 'Probability of dipping < $5,000 threshold')}
          </div>
        </div>

        <div className="rounded-3xl card-electric p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium mb-2">{t('sp_kpi_spend_shift', 'Procurement Spend Shift')}</div>
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
      <div className="rounded-4xl card-electric p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <h3 className="text-xl font-bold font-secondary text-white">
              {t('sp_fan_chart_title', 'Monte Carlo Cash Runway Fan Chart')}
            </h3>
            <p className="text-xs text-text-dark mt-0.5">
              {t('sp_fan_chart_sub', 'Percentile dispersion showing median path (P50), 50% confidence band (P25–P75), and 80% confidence band (P10–P90)')}
            </p>
          </div>

          {/* Chart Legend Tags */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-secondary-light"></span>
              <span className="text-text-dark">{t('sp_legend_median', 'P50 (Median)')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-secondary/40"></span>
              <span className="text-text-dark">{t('sp_legend_band', 'P25–P75 Band')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-500/40"></span>
              <span className="text-text-dark">{t('sp_legend_stress', 'P10 Stress Floor')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t border-dashed border-zinc-400"></span>
              <span className="text-text-dark">{t('sp_legend_baseline', 'Baseline')}</span>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-[380px] w-full pt-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <div className="size-10 rounded-full border-2 border-secondary border-t-transparent animate-spin"></div>
              <p className="text-xs text-text-dark">{t('sp_sim_paths_label', 'Simulating 500 stochastic paths...')}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {/* P90 Outer Fan Gradient */}
                  <linearGradient id="fanBandOuter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3FBFA8" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3FBFA8" stopOpacity={0.03} />
                  </linearGradient>
                  {/* P75 Inner Fan Gradient */}
                  <linearGradient id="fanBandInner" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4EE2C9" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#4EE2C9" stopOpacity={0.08} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#4D2330" />
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
                <ReferenceLine y={5000} stroke="#EF4444" strokeDasharray="3 3" label={{ value: t('sp_min_reserve', 'Min Reserve $5k'), fill: '#EF4444', fontSize: 10, position: 'insideBottomRight' }} />

                {/* Outer Fan: P90 */}
                <Area type="monotone" dataKey="p90" stroke="none" fill="url(#fanBandOuter)" />
                {/* Inner Fan: P75 */}
                <Area type="monotone" dataKey="p75" stroke="none" fill="url(#fanBandInner)" />

                {/* P10 Floor Area */}
                <Line type="monotone" dataKey="p10" stroke="#F43F5E" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />

                {/* Baseline Reference Trajectory */}
                <Line type="monotone" dataKey="baseline" stroke="#817E84" strokeWidth={2} strokeDasharray="5 5" dot={false} />

                {/* Expected P50 Median Line */}
                <Line type="monotone" dataKey="p50" stroke="#3FBFA8" strokeWidth={3} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Gemini AI Scenario Analysis Panel */}
      <div className="rounded-4xl card-electric overflow-hidden shadow-2xl">
        <div className="p-6 lg:p-8 border-b border-border bg-gradient-to-r from-secondary/10 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="size-11 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary-light">
              <IconAiSparkle className="size-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary-light text-[11px] font-semibold mb-1">
                {t('sp_gemini_advisory', 'Gemini AI Predictive Advisory')}
              </div>
              <h3 className="text-xl font-bold font-secondary text-white">
                {t('sp_gemini_executive', 'Executive Scenario & Stress Analysis')}
              </h3>
            </div>
          </div>
        </div>

        {/* Formatted Insights Grid */}
        <div className="p-6 lg:p-8 space-y-6">
          {parsedAnalysis?.s1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Runway & Liquidity */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-3 hover:border-secondary/40 transition-colors">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                  <span className="size-7 rounded-lg bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-xs">1</span>
                  <h4 className="text-sm font-bold font-secondary text-white">{t('sp_insight_runway', 'Runway & Liquidity Trajectory')}</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {renderFormattedText(translateGeminiContent(parsedAnalysis.s1))}
                </p>
              </div>

              {/* Card 2: Sensitivity & Cost Drivers */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-3 hover:border-secondary/40 transition-colors">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                  <span className="size-7 rounded-lg bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-xs">2</span>
                  <h4 className="text-sm font-bold font-secondary text-white">{t('sp_insight_sensitivity', 'Sensitivity & Cost Drivers')}</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {renderFormattedText(translateGeminiContent(parsedAnalysis.s2))}
                </p>
              </div>

              {/* Card 3: Strategic Recommendations */}
              <div className="p-6 rounded-3xl bg-white/[0.02] border border-border space-y-3 hover:border-[#DA7B93]/40 transition-colors">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                  <span className="size-7 rounded-lg bg-secondary/20 text-secondary-light flex items-center justify-center font-bold text-xs">3</span>
                  <h4 className="text-sm font-bold font-secondary text-white">{t('sp_insight_recommendations', 'Strategic Recommendations')}</h4>
                </div>
                <div className="text-xs text-zinc-300 leading-relaxed space-y-2">
                  {renderFormattedText(translateGeminiContent(parsedAnalysis.s3))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-border">
              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                {renderFormattedText(translateGeminiContent(data?.ai_analysis || 'Scenario analysis generated.'))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
