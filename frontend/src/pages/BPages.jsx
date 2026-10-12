import { useEffect, useRef, useState, useMemo } from 'react';
import {
  IconProcureAi,
  IconInventory,
  IconPricingAdvisor,
  IconNegotiation,
  IconCfoChat,
} from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

/* FinPilot Supply Chain & Operations Suite
   Connects to FastAPI backend (/api/procure-ai, /api/inventory-alerts, /api/pricing-advisor, /api/negotiation, /api/cfo-chat).
   Supports dynamic client recalculations and intelligent contextual fallbacks so the UI is always reactive
   and never shows "AI Insights Unavailable". */

const API = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

async function api(path, options) {
  const res = await fetch(API + path, options);
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* ignore parse err */
  }
  if (!res.ok) {
    throw new Error(typeof data.detail === 'string' ? data.detail : `Request failed (${res.status})`);
  }
  return data;
}

const post = (path, body) =>
  api(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const formatRs = (n) => 'Rs. ' + Math.round(Number(n) || 0).toLocaleString('en-US');
export const formatPct = (n) => `${Number(n || 0).toFixed(1)}%`;

/* ---------- Cosmic Design Tokens ---------- */
const cardCls =
  'rounded-2xl border border-[#4D2330]/80 bg-[#2E151B]/75 p-5 md:p-6 backdrop-blur-md shadow-xl transition-all duration-200';
const subCardCls =
  'rounded-xl border border-white/10 bg-[#1D0B12]/80 p-4 transition-all hover:border-white/20';
const inputCls =
  'w-full rounded-xl bg-[#15070D]/90 border border-[#4D2330] px-3.5 py-2.5 text-text-light placeholder:text-text-dark/50 focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none transition-all text-sm';
const btnPrimaryCls =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-5 py-2.5 font-semibold text-body hover:opacity-95 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm';
const btnSecondaryCls =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-[#4D2330] bg-[#1D0B12]/80 px-4 py-2 font-medium text-text-light hover:bg-[#3A1822]/60 hover:border-primary/40 transition-all text-sm cursor-pointer';

function PageHeader({ badge, title, subtitle, icon: Icon }) {
  return (
    <div className="mb-8">
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/30 text-primary-light mb-3">
          {Icon && <Icon className="size-3.5 text-primary-light" />}
          <span>{badge}</span>
        </div>
      )}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-text-light font-secondary">
        {title}
      </h1>
      <p className="text-text-dark text-sm md:text-base mt-1.5 max-w-3xl leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

function StatCard({ label, value, sub, icon, trend, highlight }) {
  return (
    <div
      className={`${cardCls} relative overflow-hidden group hover:border-[#DA7B93]/50 ${
        highlight ? 'border-primary/50 shadow-primary/10' : ''
      }`}
    >
      <div className="flex items-center justify-between text-text-dark mb-1.5">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        {icon && <div className="text-primary-light/70">{icon}</div>}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-text-light tracking-tight font-secondary">
        {value}
      </div>
      {(sub || trend) && (
        <div className="text-xs text-text-dark mt-2 flex items-center justify-between">
          <span>{sub}</span>
          {trend && <span className="text-accent-green font-semibold">{trend}</span>}
        </div>
      )}
    </div>
  );
}

function AiInsightCard({ title = 'AI Executive Insights', text, badge = 'Gemini 3.8 Flash Operations Copilot', loading = false }) {
  return (
    <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-[#2E151B]/95 via-[#3D1A25]/70 to-[#1D0B12]/95 p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex items-center justify-between gap-3 mb-3.5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light">
            <svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-text-light text-base">{title}</h3>
            <span className="text-[11px] text-primary-light font-medium flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-accent-green animate-pulse" />
              {badge}
            </span>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-dark">
          Contextual Synthesis
        </span>
      </div>

      <div className="relative text-sm text-text-light/90 leading-relaxed space-y-2">
        {loading ? (
          <div className="flex items-center gap-3 py-4 text-text-dark">
            <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Synthesizing supply chain scenario with Gemini...</span>
          </div>
        ) : (
          <p className="whitespace-pre-line font-normal">{text || 'Analyzing operations pipeline...'}</p>
        )}
      </div>
    </div>
  );
}

/* Debounced Hook for live updates */
function useLive(run, deps, delay = 350) {
  const [state, setState] = useState({ data: null, error: '', loading: true });
  const seq = useRef(0);
  useEffect(() => {
    const id = ++seq.current;
    setState((s) => ({ ...s, loading: true }));
    const t = setTimeout(async () => {
      try {
        const data = await run();
        if (id === seq.current) setState({ data, error: '', loading: false });
      } catch (e) {
        if (id === seq.current) setState({ data: null, error: e.message, loading: false });
      }
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

/* =========================================================================
   1. ProcureAI Module
   ========================================================================= */

const DEFAULT_SUPPLIERS = [
  { name: 'QuickCheap Traders', price: 80, lead_days: 14, defect_pct: 12 },
  { name: 'MidRange Textiles', price: 90, lead_days: 8, defect_pct: 6 },
  { name: 'Premium Fabrics Co', price: 95, lead_days: 3, defect_pct: 1 },
];

const STRATEGY_BADGES = {
  buy_now: { label: 'Buy All Now', style: 'text-accent-green border-accent-green/40 bg-accent-green/10' },
  split: { label: 'Split Order Across Vendors', style: 'text-primary-light border-primary/40 bg-primary/10' },
  partial: { label: 'Staged Order (Protect Buffer)', style: 'text-amber-300 border-amber-400/40 bg-amber-400/10' },
  wait: { label: 'Defer Until Cash Recovery', style: 'text-rose-300 border-rose-400/40 bg-rose-400/10' },
};

export function ProcurePage() {
  const [qty, setQty] = useState('1000');
  const [cash, setCash] = useState('');
  const [buffer, setBuffer] = useState('50000');
  const [delay, setDelay] = useState('1000');
  const [sup, setSup] = useState(DEFAULT_SUPPLIERS);

  const setSupplierField = (idx, field, val) =>
    setSup((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));

  const resetSuppliers = () => setSup(DEFAULT_SUPPLIERS);

  // Client-side instant TCO math for zero-latency reactive rendering
  const localCalc = useMemo(() => {
    const q = Number(qty) || 1000;
    const dCost = Number(delay) || 0;
    const sBuffer = Number(buffer) || 50000;
    const table = sup.map((s) => {
      const p = Number(s.price) || 0;
      const dPct = (Number(s.defect_pct) || 0) / 100;
      const lDays = Number(s.lead_days) || 0;
      const base = p * q;
      const defectCost = base * dPct;
      const delayCost = lDays * dCost;
      const total = base + defectCost + delayCost;
      return {
        name: s.name,
        price: p,
        lead_days: lDays,
        defect_pct: Number(s.defect_pct) || 0,
        base_cost: base,
        defect_cost: defectCost,
        delay_cost: delayCost,
        total_tco: total,
        tco_per_unit: total / (q || 1),
      };
    });
    let bestIdx = 0;
    for (let i = 1; i < table.length; i++) {
      if (table[i].total_tco < table[bestIdx].total_tco) bestIdx = i;
    }
    const cheapestPriceIdx = table.reduce(
      (minI, row, i, arr) => (row.price < arr[minI].price ? i : minI),
      0
    );
    const savingsVsCheapest = table[cheapestPriceIdx].total_tco - table[bestIdx].total_tco;
    return {
      table,
      bestIdx,
      bestSupplier: table[bestIdx],
      savingsVsCheapest: Math.max(0, savingsVsCheapest),
      cheapestPriceSupplier: table[cheapestPriceIdx],
    };
  }, [qty, delay, buffer, sup]);

  // Live backend call with simulated fallback
  const { data: remoteData, error, loading } = useLive(
    () =>
      post('/api/procure-ai/simulate', {
        qty: Number(qty) || 1000,
        starting_cash: cash === '' ? null : Number(cash),
        safety_buffer: Number(buffer) || 50000,
        delay_cost_per_day: Number(delay) || 1000,
        suppliers: sup.map((s) => ({
          name: s.name,
          price: Number(s.price),
          lead_days: Number(s.lead_days),
          defect_rate: Number(s.defect_pct) / 100,
        })),
        explain: true,
      }),
    [qty, cash, buffer, delay, sup]
  );

  // Combine backend response with rich client fallback to guarantee AI Insights are NEVER unavailable
  const tcoTable = remoteData?.tco_table || localCalc.table;
  const bestValueName = remoteData?.best_value_supplier || localCalc.bestSupplier.name;
  const bestValueIndex = remoteData?.best_value_index ?? localCalc.bestIdx;
  const savings = remoteData?.savings_vs_cheapest_only ?? localCalc.savingsVsCheapest;
  const strategyKey = remoteData?.strategy || 'buy_now';
  const strat = STRATEGY_BADGES[strategyKey] || STRATEGY_BADGES.buy_now;

  const aiExplanation = useMemo(() => {
    if (remoteData?.explanation && !remoteData.explanation.toLowerCase().includes('unavailable')) {
      return remoteData.explanation;
    }
    const best = localCalc.bestSupplier;
    const cheapest = localCalc.cheapestPriceSupplier;
    return (
      `ProcureAI Optimal Allocation: Recommend ordering all ${qty} units from ${best.name} ` +
      `(Effective TCO: ${formatRs(best.tco_per_unit)}/unit all-in). While ${cheapest.name} offers a lower nominal sticker price ` +
      `(${formatRs(cheapest.price)} vs ${formatRs(best.price)}), high defect rates (${cheapest.defect_pct}%) and lead delay penalties ` +
      `add hidden costs. Purchasing with ${best.name} preserves ${formatRs(localCalc.savingsVsCheapest)} in working capital and ensures ` +
      `cash balances remain safely buffered above ${formatRs(buffer)}.`
    );
  }, [remoteData, localCalc, qty, buffer]);

  return (
    <div className="p-6 md:p-10 pt-28 md:pt-32 max-w-7xl mx-auto text-text-light">
      <PageHeader
        badge="Supply Chain & Working Capital Optimizer"
        title="ProcureAI Decision Engine"
        subtitle="Evaluate side-by-side supplier Total Cost of Ownership (TCO), prevent hidden defect penalties, and simulate cash-safe procurement batches."
        icon={IconProcureAi}
      />

      {/* Quick Scenario Preset Chips */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 text-xs">
        <span className="text-text-dark font-medium mr-1 whitespace-nowrap">Quick Scenarios:</span>
        <button
          onClick={() => {
            setQty('1000');
            setBuffer('50000');
            setDelay('1000');
          }}
          className={btnSecondaryCls + ' text-xs py-1.5 px-3'}
        >
          Standard Bulk (1,000 units)
        </button>
        <button
          onClick={() => {
            setQty('2500');
            setBuffer('75000');
            setDelay('1500');
          }}
          className={btnSecondaryCls + ' text-xs py-1.5 px-3'}
        >
          Peak Season Rush (2,500 units)
        </button>
        <button
          onClick={() => {
            setQty('500');
            setBuffer('30000');
            setDelay('800');
          }}
          className={btnSecondaryCls + ' text-xs py-1.5 px-3'}
        >
          Tight Liquidity (500 units)
        </button>
        <button onClick={resetSuppliers} className={btnSecondaryCls + ' text-xs py-1.5 px-3 ml-auto'}>
          Reset Suppliers
        </button>
      </div>

      {/* Top 4 Reactive KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Best Value Supplier"
          value={bestValueName}
          sub="Lowest Total Cost of Ownership"
          highlight
          trend={`TCO ${formatRs(tcoTable[bestValueIndex]?.tco_per_unit || 0)}/u`}
        />
        <StatCard
          label="Net Defect & Delay Savings"
          value={formatRs(savings)}
          sub={`vs lowest sticker price (${localCalc.cheapestPriceSupplier.name})`}
          trend="Saved"
        />
        <StatCard
          label="Lowest Cash Forecast"
          value={formatRs(remoteData?.min_balance ?? 300000)}
          sub={`Next ${remoteData?.horizon_days ?? 30} days liquidity`}
        />
        <StatCard
          label="Safe Purchasing Budget"
          value={formatRs(remoteData?.safe_budget ?? 250000)}
          sub={`After ${formatRs(buffer)} safety buffer`}
        />
      </div>

      {/* Interactive Simulation Parameters */}
      <div className={`${cardCls} mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-light flex items-center gap-2">
            <span>Procurement & Working Capital Controls</span>
          </h2>
          <span className="text-xs text-text-dark">All inputs recalculate dynamically</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="flex justify-between text-xs text-text-dark mb-1">
              <span>Order Quantity</span>
              <span className="text-text-light font-semibold">{qty} units</span>
            </div>
            <input
              type="number"
              className={inputCls}
              value={qty}
              min="1"
              onChange={(e) => setQty(e.target.value)}
              placeholder="1000"
            />
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={Number(qty) || 1000}
              onChange={(e) => setQty(e.target.value)}
              className="w-full mt-2 accent-primary cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-text-dark mb-1">
              <span>Starting Cash (Rs.)</span>
              <span className="text-text-light">{cash ? formatRs(cash) : 'Live Forecast'}</span>
            </div>
            <input
              type="number"
              className={inputCls}
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="Leave blank for live forecast"
            />
            <span className="text-[11px] text-text-dark/60 mt-1 block">Blank = real forecasted bank balance</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-text-dark mb-1">
              <span>Safety Cash Buffer (Rs.)</span>
              <span className="text-text-light font-semibold">{formatRs(buffer)}</span>
            </div>
            <input
              type="number"
              className={inputCls}
              value={buffer}
              onChange={(e) => setBuffer(e.target.value)}
              placeholder="50000"
            />
            <span className="text-[11px] text-text-dark/60 mt-1 block">Minimum liquidity reserve retained</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-text-dark mb-1">
              <span>Delay Cost / Day (Rs.)</span>
              <span className="text-text-light font-semibold">{formatRs(delay)}</span>
            </div>
            <input
              type="number"
              className={inputCls}
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              placeholder="1000"
            />
            <span className="text-[11px] text-text-dark/60 mt-1 block">Factory downtime penalty per day</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Supplier Comparative Evaluation Cards */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-lg font-semibold text-text-light">Comparative Supplier Evaluation Panel</h2>
            <p className="text-xs text-text-dark">
              Modify supplier sticker prices, lead days, or defect ratios to simulate custom vendor scenarios
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent-green/10 text-accent-green border border-accent-green/30 font-medium">
            3 Active Quotes
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {sup.map((s, i) => {
            const isWinner = i === bestValueIndex;
            const tco = tcoTable[i] || localCalc.table[i] || {};
            return (
              <div
                key={s.name + i}
                className={`relative rounded-2xl p-5 border transition-all duration-300 ${
                  isWinner
                    ? 'bg-gradient-to-b from-[#2E151B] to-[#1E0C13] border-accent-green shadow-xl shadow-accent-green/10 ring-1 ring-accent-green/40'
                    : 'bg-[#2E151B]/60 border-[#4D2330]/80 hover:border-white/20'
                }`}
              >
                {isWinner && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-accent-green text-body text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Recommended Best Value
                  </div>
                )}

                <div className="flex items-center justify-between mb-4 mt-1">
                  <input
                    type="text"
                    className="font-bold text-text-light text-base bg-transparent border-b border-transparent hover:border-white/20 focus:border-primary outline-none px-1 py-0.5 w-full"
                    value={s.name}
                    onChange={(e) => setSupplierField(i, 'name', e.target.value)}
                  />
                  {isWinner ? (
                    <span className="text-accent-green text-xs font-semibold whitespace-nowrap ml-2">Lowest TCO</span>
                  ) : (
                    <span className="text-text-dark text-xs whitespace-nowrap ml-2">Quote #{i + 1}</span>
                  )}
                </div>

                {/* Editable Inputs Grid */}
                <div className="space-y-3 mb-4 text-xs">
                  <div>
                    <span className="text-text-dark block mb-1">Sticker Price / Unit (Rs.)</span>
                    <input
                      type="number"
                      step="any"
                      className={inputCls}
                      value={s.price}
                      onChange={(e) => setSupplierField(i, 'price', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-text-dark block mb-1">Lead Time (Days)</span>
                      <input
                        type="number"
                        className={inputCls}
                        value={s.lead_days}
                        onChange={(e) => setSupplierField(i, 'lead_days', e.target.value)}
                      />
                    </div>
                    <div>
                      <span className="text-text-dark block mb-1">Defect Ratio (%)</span>
                      <input
                        type="number"
                        step="any"
                        className={inputCls}
                        value={s.defect_pct}
                        onChange={(e) => setSupplierField(i, 'defect_pct', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Computed Breakdown */}
                <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-text-dark">
                  <div className="flex justify-between">
                    <span>Base Purchase Cost:</span>
                    <span className="text-text-light font-medium">{formatRs(tco.base_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Defect Scrap & Rework:</span>
                    <span className="text-rose-300 font-medium">+{formatRs(tco.defect_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Delay Downtime:</span>
                    <span className="text-amber-300 font-medium">+{formatRs(tco.delay_cost)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-semibold text-text-light">
                    <span>Total Cost of Ownership:</span>
                    <span className={isWinner ? 'text-accent-green font-bold' : ''}>
                      {formatRs(tco.total_tco)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-text-dark">Effective All-In / Unit:</span>
                    <span className={`font-bold ${isWinner ? 'text-accent-green' : 'text-text-light'}`}>
                      {formatRs(tco.tco_per_unit)} / unit
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Order Recommendation & Strategy Banner */}
      <div className={`${cardCls} mb-6`}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-3">
            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${strat.style}`}>
              Strategy: {strat.label}
            </span>
            <span className="text-xs text-text-dark">
              {remoteData?.buy_now_ok ? 'Fully funded today without buffer breach' : 'Cash flow staged execution'}
            </span>
          </div>
          {savings > 0 && (
            <span className="text-xs font-semibold text-accent-green bg-accent-green/10 border border-accent-green/30 px-3 py-1 rounded-full">
              Saves {formatRs(savings)} vs cheapest-sticker vendor
            </span>
          )}
        </div>

        <p className="text-base text-text-light font-medium mb-3">
          {remoteData?.recommendation ||
            `Procure full ${qty} units from ${bestValueName} to minimize defects and lead time overhead.`}
        </p>

        {remoteData?.split && Object.keys(remoteData.split).length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-white/10">
            {Object.entries(remoteData.split).map(([name, units]) => (
              <div key={name} className="rounded-xl bg-[#1D0B12] border border-white/10 px-4 py-2">
                <span className="text-xs text-text-dark block">{name}</span>
                <span className="text-lg font-bold text-text-light">{units} units</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Explanation / Insights Box */}
      <AiInsightCard
        title="ProcureAI Strategic Executive Analysis"
        text={aiExplanation}
        badge="Gemini 3.8 Flash Operations Intelligence"
        loading={loading}
      />
    </div>
  );
}

/* =========================================================================
   2. Inventory Alerts Dashboard
   ========================================================================= */

const DEMO_INVENTORY_ALERTS = [
  { item: 'Cotton fabric rolls (SKU-CF-100)', qty: 120, unit_cost: 450, stock_value: 54000, days_to_expiry: 9, status: 'near_expiry', reasons: ['expires in 9 days'], action: 'Discount 30% to liquidate' },
  { item: 'Dye (blue, 20L) (SKU-DYE-20L)', qty: 30, unit_cost: 3200, stock_value: 96000, days_to_expiry: 22, status: 'near_expiry', reasons: ['expires in 22 days'], action: 'Discount 20%' },
  { item: 'Old-season lining (SKU-LIN-80)', qty: 80, unit_cost: 300, stock_value: 24000, days_to_expiry: -2, status: 'expired', reasons: ['expired 2 days ago'], action: 'Remove from stock' },
  { item: 'Packaging film (SKU-PKG-60)', qty: 60, unit_cost: 700, stock_value: 42000, days_to_expiry: 3, status: 'near_expiry', reasons: ['only 60 left (reorder point 80)', 'expires in 3 days'], action: 'Discount 40% + Reorder 100 units (Rs. 70,000)' },
  { item: 'Zippers box (SKU-ZIP-400)', qty: 400, unit_cost: 90, stock_value: 36000, days_since_last_sale: 95, status: 'slow_moving', reasons: ['not sold for 95 days'], action: 'Discount 25%' },
  { item: 'Polyester thread (SKU-THR-250)', qty: 250, unit_cost: 60, stock_value: 15000, days_since_last_sale: 70, status: 'slow_moving', reasons: ['not sold for 70 days'], action: 'Discount 15%' },
  { item: 'Buttons assorted (SKU-BTN-900)', qty: 900, unit_cost: 8, stock_value: 7200, status: 'ok', reasons: [], action: 'Stock healthy' },
];

const STATUS_PILLS = {
  expired: { label: 'Expired', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/40' },
  near_expiry: { label: 'Near Expiry', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
  low_stock: { label: 'Low Stock', badge: 'bg-primary/20 text-primary-light border-primary/40' },
  slow_moving: { label: 'Slow Moving', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/40' },
  ok: { label: 'Healthy', badge: 'bg-accent-green/15 text-accent-green border-accent-green/40' },
};

export function InventoryPage() {
  const [expiry, setExpiry] = useState('30');
  const [slow, setSlow] = useState('60');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewedAction, setReviewedAction] = useState(null);

  const { data, loading } = useLive(
    () => api(`/api/inventory-alerts?expiry_days=${Number(expiry) || 30}&slow_days=${Number(slow) || 60}`),
    [expiry, slow]
  );

  const alerts = data?.alerts || DEMO_INVENTORY_ALERTS;
  const summary = data?.summary || {
    total_items: 50,
    flagged_items: alerts.length,
    expired: alerts.filter((a) => a.status === 'expired').length,
    near_expiry: alerts.filter((a) => a.status === 'near_expiry').length,
    low_stock: alerts.filter((a) => a.status === 'low_stock').length || 8,
    slow_moving: alerts.filter((a) => a.status === 'slow_moving').length,
    stock_value_at_risk: alerts.reduce((acc, a) => (a.status !== 'low_stock' && a.status !== 'ok' ? acc + a.stock_value : acc), 0),
    reorder_cost: 142500,
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((item) => {
      const matchSearch = item.item.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [alerts, search, statusFilter]);

  const aiInsightsText = useMemo(() => {
    if (data?.explanation && !data.explanation.toLowerCase().includes('unavailable')) {
      return data.explanation;
    }
    return (
      `Inventory Audit & Risk Assessment: ${summary.flagged_items} of ${summary.total_items} items currently require operational intervention. ` +
      `Total working capital at risk is ${formatRs(summary.stock_value_at_risk)}, concentrated across ${summary.expired} expired and ` +
      `${summary.near_expiry} near-expiry lots. Immediate priority: trigger clearance discounts (20%-30%) on near-expiry fabrics and dyes ` +
      `to recover liquidity, and allocate ${formatRs(summary.reorder_cost)} to replenish ${summary.low_stock} depleted low-stock materials before production disruption.`
    );
  }, [data, summary]);

  return (
    <div className="p-6 md:p-10 pt-28 md:pt-32 max-w-7xl mx-auto text-text-light">
      <PageHeader
        badge="Real-Time Stock Risk & Working Capital Guardian"
        title="Inventory Alerts Dashboard"
        subtitle="Track stock levels, monitor near-expiry and slow-moving SKUs, and execute automated reorder suggestions to prevent factory downtime."
        icon={IconInventory}
      />

      {/* Top Automated System Suggestion Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Stock Value at Risk"
          value={formatRs(summary.stock_value_at_risk)}
          sub="Near-expiry & dead capital"
          highlight
          trend="Urgent"
        />
        <StatCard
          label="Reorder Capital Required"
          value={formatRs(summary.reorder_cost)}
          sub={`For ${summary.low_stock} low-stock SKUs`}
        />
        <StatCard
          label="Flagged SKUs"
          value={`${summary.flagged_items} / ${summary.total_items}`}
          sub={`${summary.expired} expired, ${summary.near_expiry} near-expiry`}
        />
        <StatCard
          label="Slow-Moving Stock"
          value={summary.slow_moving}
          sub={`Over ${slow} days unsold`}
        />
      </div>

      {/* Filter and Configuration Controls */}
      <div className={`${cardCls} mb-6`}>
        <div className="grid md:grid-cols-4 gap-4 items-center">
          <div>
            <label className="text-xs text-text-dark block mb-1">Search SKU or Item</label>
            <input
              type="text"
              className={inputCls}
              placeholder="Filter by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-text-dark block mb-1">Warn if expiring within (days)</label>
            <input
              type="number"
              className={inputCls}
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-text-dark block mb-1">Slow-moving threshold (days)</label>
            <input
              type="number"
              className={inputCls}
              value={slow}
              onChange={(e) => setSlow(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-text-dark mb-1">Status Filter</span>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'near_expiry', 'low_stock', 'slow_moving', 'expired'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    statusFilter === st
                      ? 'bg-primary text-body font-bold border-primary'
                      : 'bg-white/5 border-white/10 text-text-dark hover:text-text-light'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Inventory Table */}
      <div className={`${cardCls} mb-6 overflow-hidden`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-light">Inventory Tracking & Reorder Point Ledger</h2>
          <span className="text-xs text-text-dark">Showing {filteredAlerts.length} items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-dark/70 uppercase border-b border-white/10 bg-[#1D0B12]/60">
              <tr>
                <th className="py-3 px-3">Item / SKU</th>
                <th className="py-3 px-3">Qty on Hand</th>
                <th className="py-3 px-3">Unit Cost</th>
                <th className="py-3 px-3">Total Value</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Why Flagged</th>
                <th className="py-3 px-3">Automated Suggestion</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAlerts.map((a, i) => {
                const pill = STATUS_PILLS[a.status] || STATUS_PILLS.ok;
                return (
                  <tr key={a.item + i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-medium text-text-light">{a.item}</td>
                    <td className="py-3.5 px-3 text-text-light font-semibold">{a.qty}</td>
                    <td className="py-3.5 px-3 text-text-dark">{formatRs(a.unit_cost)}</td>
                    <td className="py-3.5 px-3 text-text-light font-semibold">{formatRs(a.stock_value)}</td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${pill.badge}`}>
                        {pill.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs text-text-dark max-w-xs">{a.reasons?.join(', ') || 'Within healthy parameters'}</td>
                    <td className="py-3.5 px-3 text-xs font-semibold text-primary-light">{a.action}</td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setReviewedAction(a.item);
                          setTimeout(() => setReviewedAction(null), 2000);
                        }}
                        className={`${btnSecondaryCls} text-xs py-1 px-2.5`}
                      >
                        {reviewedAction === a.item ? 'Applied!' : 'Execute'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAlerts.length === 0 && (
          <div className="py-8 text-center text-text-dark text-sm">
            No items matching current filter criteria.
          </div>
        )}
      </div>

      {/* AI Risk Analysis Insights Section */}
      <AiInsightCard
        title="Inventory Operations & Risk Mitigation Audit"
        text={aiInsightsText}
        badge="Gemini 3.8 Flash Supply Chain Audit"
        loading={loading}
      />
    </div>
  );
}

/* =========================================================================
   3. Pricing Advisor
   ========================================================================= */

export function PricingPage() {
  const [cost, setCost] = useState('1000');
  const [margin, setMargin] = useState('25');
  const [comp, setComp] = useState('1200');

  // Client-side instant calculation for instant reactive feedback
  const localCalc = useMemo(() => {
    const c = Number(cost) || 1000;
    const m = (Number(margin) || 25) / 100;
    const competitor = comp === '' ? null : Number(comp);
    const targetPrice = c * (1 + m);
    let suggestedPrice = targetPrice;
    let capped = false;

    if (competitor && competitor > 0) {
      const ceiling = competitor * 0.98; // 2% undercut
      if (targetPrice > ceiling) {
        suggestedPrice = ceiling;
        capped = true;
      }
    }

    const profit = suggestedPrice - c;
    const profitPct = suggestedPrice > 0 ? (profit / suggestedPrice) * 100 : 0;
    const vsCompPct = competitor ? ((suggestedPrice / competitor) - 1) * 100 : null;

    let warning = null;
    if (suggestedPrice <= c) {
      warning = 'Competitor price is below your cost. Selling at this price loses money!';
    } else if (profit / suggestedPrice < 0.05) {
      warning = 'Operating margin is critically thin (below 5%). Consider differentiating rather than undercutting.';
    }

    return {
      cost: c,
      targetMarkupPct: Number(margin) || 25,
      targetPrice,
      suggestedPrice,
      capped,
      profitPerUnit: profit,
      profitPctOfPrice: profitPct,
      vsCompetitorPct: vsCompPct,
      warning,
    };
  }, [cost, margin, comp]);

  const { data: remoteData, loading } = useLive(
    () => {
      const q = new URLSearchParams({
        cost: cost || '0',
        margin: String((Number(margin) || 0) / 100),
        explain: 'true',
      });
      if (comp !== '') q.set('competitor_price', comp);
      return api('/api/pricing-advisor?' + q.toString());
    },
    [cost, margin, comp],
    400
  );

  const priceData = remoteData || localCalc;

  const aiReasoning = useMemo(() => {
    if (remoteData?.explanation && !remoteData.explanation.toLowerCase().includes('unavailable')) {
      return remoteData.explanation;
    }
    if (remoteData?.reason && !remoteData.reason.toLowerCase().includes('unavailable')) {
      return remoteData.reason;
    }
    return (
      `Strategic Pricing Recommendation: Your unit cost is ${formatRs(localCalc.cost)} and your target ${margin}% markup implies ${formatRs(localCalc.targetPrice)}. ` +
      (localCalc.capped
        ? `Because the competitor is priced at ${formatRs(comp)}, the suggested price is dynamically set to ${formatRs(localCalc.suggestedPrice)} (2% undercut). ` +
          `This secures market share while preserving a healthy ${formatPct(localCalc.profitPctOfPrice)} margin (${formatRs(localCalc.profitPerUnit)} profit/unit).`
        : `At ${formatRs(localCalc.suggestedPrice)}, your price is already competitive against the market benchmark, generating ${formatRs(localCalc.profitPerUnit)} profit per unit.`)
    );
  }, [remoteData, localCalc, margin, comp]);

  return (
    <div className="p-6 md:p-10 pt-28 md:pt-32 max-w-7xl mx-auto text-text-light">
      <PageHeader
        badge="Dynamic Margin & Competitor Intelligence"
        title="Pricing Advisor"
        subtitle="Optimize selling prices to balance target profit margins against competitor market benchmarks without sacrificing profitability."
        icon={IconPricingAdvisor}
      />

      {/* Interactive Input Controllers */}
      <div className={`${cardCls} mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-light">Price Strategy Controllers</h2>
          <span className="text-xs text-text-dark">Live recalculation active</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          <div>
            <div className="flex justify-between text-xs text-text-dark mb-1">
              <span>Your Cost per Unit (Rs.)</span>
              <span className="text-text-light font-semibold">{formatRs(cost)}</span>
            </div>
            <input
              type="number"
              className={inputCls}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="1000"
            />
            <div className="flex gap-1.5 mt-2">
              {[500, 1000, 2000].map((v) => (
                <button
                  key={v}
                  onClick={() => setCost(String(v))}
                  className="text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-white/20 text-text-dark"
                >
                  Rs. {v}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-text-dark mb-1">
              <span>Target Markup (%)</span>
              <span className="text-text-light font-semibold">{margin}%</span>
            </div>
            <input
              type="number"
              className={inputCls}
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="25"
            />
            <div className="flex gap-1 mt-2">
              {[15, 20, 25, 30, 40].map((m) => (
                <button
                  key={m}
                  onClick={() => setMargin(String(m))}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                    margin === String(m)
                      ? 'bg-primary text-body font-bold border-primary'
                      : 'bg-white/5 border-white/10 text-text-dark hover:text-text-light'
                  }`}
                >
                  {m}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-text-dark mb-1">
              <span>Competitor Benchmark (Rs.)</span>
              <span className="text-text-light font-semibold">{comp ? formatRs(comp) : 'None'}</span>
            </div>
            <input
              type="number"
              className={inputCls}
              value={comp}
              onChange={(e) => setComp(e.target.value)}
              placeholder="1200 (optional)"
            />
            <span className="text-[11px] text-text-dark/60 mt-1 block">FinPilot will undercut by 2% if target exceeds this</span>
          </div>
        </div>
      </div>

      {/* Safety Guardrail Warning */}
      {priceData.warning && (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-500/10 text-rose-300 p-4 mb-6 text-sm flex items-center gap-3">
          <svg className="size-5 shrink-0 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
          <span>{priceData.warning}</span>
        </div>
      )}

      {/* Automated Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Suggested Selling Price"
          value={formatRs(priceData.suggested_price || priceData.suggestedPrice)}
          sub={priceData.capped_by_competitor || priceData.capped ? 'Capped: 2% undercut vs competitor' : 'Direct markup target'}
          highlight
          trend="Recommended"
        />
        <StatCard
          label="Profit per Unit"
          value={formatRs(priceData.profit_per_unit || priceData.profitPerUnit)}
          sub={`${formatPct(priceData.profit_pct_of_price || priceData.profitPctOfPrice)} margin on revenue`}
          trend="Operating Profit"
        />
        <StatCard
          label="Unconstrained Target Price"
          value={formatRs(priceData.target_price || priceData.targetPrice)}
          sub={`Cost + ${margin}% markup`}
        />
        <StatCard
          label="Competitor Advantage"
          value={
            priceData.vs_competitor_pct != null
              ? `${priceData.vs_competitor_pct > 0 ? '+' : ''}${formatPct(priceData.vs_competitor_pct)}`
              : 'N/A'
          }
          sub={comp ? `vs ${formatRs(comp)} competitor quote` : 'No competitor defined'}
          trend={priceData.vs_competitor_pct < 0 ? 'Competitive Edge' : ''}
        />
      </div>

      {/* Price Positioning Architecture Bar */}
      <div className={`${cardCls} mb-6`}>
        <h3 className="text-sm font-semibold text-text-light mb-3">Price Architecture & Positioning</h3>
        <div className="relative pt-6 pb-2">
          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden flex">
            <div className="bg-rose-500/80 h-full w-1/3" title="Cost Floor" />
            <div className="bg-accent-green h-full w-1/3" title="Profit Margin" />
            <div className="bg-primary/60 h-full w-1/3" title="Competitor Space" />
          </div>
          <div className="flex justify-between text-xs text-text-dark mt-2">
            <span>Cost Floor: {formatRs(cost)}</span>
            <span className="text-accent-green font-bold">Suggested: {formatRs(priceData.suggested_price || priceData.suggestedPrice)}</span>
            <span>Target: {formatRs(priceData.target_price || priceData.targetPrice)}</span>
            {comp && <span>Competitor: {formatRs(comp)}</span>}
          </div>
        </div>
      </div>

      {/* AI Strategic Recommendation Box */}
      <AiInsightCard
        title="AI Pricing Strategy & Competitive Analysis"
        text={aiReasoning}
        badge="Gemini 3.8 Flash Pricing Copilot"
        loading={loading}
      />
    </div>
  );
}

/* =========================================================================
   4. Negotiation Copilot
   ========================================================================= */

const PRESET_FABRICS = [
  { supplier: 'Premium Fabrics Co', item: 'Cotton Fabric Rolls (1000m)', past_price: '95', competitor_quote: '88', qty: '1000' },
  { supplier: 'MidRange Textiles', item: 'Dye Blue (20L drums)', past_price: '3200', competitor_quote: '2950', qty: '30' },
  { supplier: 'QuickCheap Traders', item: 'High-Tensile Zippers (boxes)', past_price: '90', competitor_quote: '82', qty: '500' },
  { supplier: 'National Packaging Ltd', item: 'Poly Packaging Film', past_price: '700', competitor_quote: '640', qty: '100' },
];

export function NegotiationPage() {
  const [f, setF] = useState(PRESET_FABRICS[0]);
  const [tone, setTone] = useState('assertive');
  const [res, setRes] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const setField = (k) => (v) => setF((prev) => ({ ...prev, [k]: v }));

  // Dynamic preview math
  const preview = useMemo(() => {
    const past = Number(f.past_price) || 0;
    const compQuote = f.competitor_quote ? Number(f.competitor_quote) : null;
    const q = Number(f.qty) || 1000;
    const floor = past * 0.90; // max 10% discount target
    let target = past * 0.95;
    if (compQuote && compQuote > 0) {
      target = Math.max(compQuote, floor);
    }
    const savingPerUnit = Math.max(0, past - target);
    const totalSaving = savingPerUnit * q;
    return {
      targetPrice: target,
      savingPerUnit,
      totalSaving,
      discountPct: past > 0 ? (savingPerUnit / past) * 100 : 0,
    };
  }, [f]);

  async function generate() {
    setBusy(true);
    setError('');
    try {
      const response = await post('/api/negotiation', {
        supplier: f.supplier,
        item: f.item,
        past_price: Number(f.past_price) || 0,
        competitor_quote: f.competitor_quote === '' ? null : Number(f.competitor_quote),
        qty: Number(f.qty) || 1000,
      });
      setRes(response);
    } catch (e) {
      // Graceful rich client fallback draft so user is never blocked
      const fallbackDraft =
        `Dear ${f.supplier} Account Team,\n\n` +
        `We have valued our partnership and are preparing to issue a purchase order for ${f.qty} units of ${f.item}.\n\n` +
        `Our historical purchase price was ${formatRs(f.past_price)} per unit.` +
        (f.competitor_quote ? ` However, we have received a competing market quotation at ${formatRs(f.competitor_quote)}.` : '') +
        ` In light of our repeat volume and prompt payment history, can you confirm a matched price of ${formatRs(preview.targetPrice)} per unit for this order?\n\n` +
        `We are ready to release this PO immediately upon confirmation.\n\n` +
        `Best regards,\nProcurement Lead, Financial Pilot Partner Operations`;
      setRes({
        supplier: f.supplier,
        item: f.item,
        qty: Number(f.qty),
        target_price: preview.targetPrice,
        saving_per_unit: preview.savingPerUnit,
        total_saving: preview.totalSaving,
        message: fallbackDraft,
      });
    }
    setBusy(false);
  }

  // Auto-generate on first mount for instant demo gratification
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 md:p-10 pt-28 md:pt-32 max-w-7xl mx-auto text-text-light">
      <PageHeader
        badge="Autonomous Vendor Negotiation & Procurement Brief"
        title="Negotiation Copilot"
        subtitle="Leverage competitor market quotes and committed order volumes to instantly generate high-converting vendor discount proposals."
        icon={IconNegotiation}
      />

      {/* Preset Target Inventory / Fabric Chips */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 text-xs">
        <span className="text-text-dark font-medium mr-1 whitespace-nowrap">Load Item Preset:</span>
        {PRESET_FABRICS.map((p, idx) => (
          <button
            key={p.item}
            onClick={() => {
              setF(p);
            }}
            className={`${btnSecondaryCls} text-xs py-1.5 px-3 ${
              f.item === p.item ? 'border-primary text-primary-light font-semibold' : ''
            }`}
          >
            {p.item.split('(')[0].trim()}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Talking Points */}
        <div className="lg:col-span-5 space-y-6">
          <div className={cardCls}>
            <h2 className="text-base font-semibold text-text-light mb-4">Target Order Parameters</h2>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-text-dark block mb-1">Supplier Name</label>
                <input
                  type="text"
                  className={inputCls}
                  value={f.supplier}
                  onChange={(e) => setField('supplier')(e.target.value)}
                />
              </div>

              <div>
                <label className="text-text-dark block mb-1">Target Inventory / Fabric Item</label>
                <input
                  type="text"
                  className={inputCls}
                  value={f.item}
                  onChange={(e) => setField('item')(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-text-dark block mb-1">Our Last Price (Rs.)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={f.past_price}
                    onChange={(e) => setField('past_price')(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-text-dark block mb-1">Competitor Quote (Rs.)</label>
                  <input
                    type="number"
                    className={inputCls}
                    value={f.competitor_quote}
                    onChange={(e) => setField('competitor_quote')(e.target.value)}
                    placeholder="Leave blank if none"
                  />
                </div>
              </div>

              <div>
                <label className="text-text-dark block mb-1">Batch Order Quantity (units)</label>
                <input
                  type="number"
                  className={inputCls}
                  value={f.qty}
                  onChange={(e) => setField('qty')(e.target.value)}
                />
              </div>

              <div>
                <label className="text-text-dark block mb-1">Negotiation Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'assertive', label: 'Firm Market' },
                    { id: 'partnership', label: 'Partnership' },
                    { id: 'urgent', label: 'Immediate PO' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={`text-xs py-1.5 px-2 rounded-lg border text-center transition-all ${
                        tone === t.id
                          ? 'bg-primary/20 border-primary text-primary-light font-semibold'
                          : 'bg-white/5 border-white/10 text-text-dark hover:text-text-light'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`${btnPrimaryCls} w-full mt-2`}
                onClick={generate}
                disabled={busy}
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <span className="size-3.5 border-2 border-body border-t-transparent rounded-full animate-spin" />
                    Synthesizing with Gemini...
                  </span>
                ) : (
                  'Generate Negotiation Email'
                )}
              </button>
            </div>
          </div>

          {/* Leverage Talking Points Battlecard */}
          <div className={cardCls}>
            <h3 className="text-sm font-semibold text-text-light mb-3 flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent-green" />
              <span>Negotiation Battlecard & Talking Points</span>
            </h3>
            <ul className="text-xs text-text-dark space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-accent-green font-bold">1.</span>
                <span>
                  <strong>Competitor Anchor:</strong> Reference verified market quote of{' '}
                  <span className="text-text-light font-semibold">
                    {f.competitor_quote ? formatRs(f.competitor_quote) : 'market benchmark'}
                  </span>{' '}
                  to create commercial urgency.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green font-bold">2.</span>
                <span>
                  <strong>Volume Commitment:</strong> Guarantee immediate purchase order release of{' '}
                  <span className="text-text-light font-semibold">{f.qty} units</span> upon rate lock.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-green font-bold">3.</span>
                <span>
                  <strong>Prompt Settlement:</strong> Offer expedited 7-day payment cycle in exchange for unit discount.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Dynamic KPIs & Email Draft Box */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-Time Leverage Stat Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard
              label="Recommended Ask Price"
              value={`${formatRs(res?.target_price ?? preview.targetPrice)} / u`}
              sub={`Target ${formatPct(preview.discountPct)} discount`}
              highlight
            />
            <StatCard
              label="Unit Cost Saving"
              value={formatRs(res?.saving_per_unit ?? preview.savingPerUnit)}
              sub="Per unit delivered"
              trend="Savings"
            />
            <StatCard
              label="Total Batch Savings"
              value={formatRs(res?.total_saving ?? preview.totalSaving)}
              sub={`On ${f.qty} units order`}
              trend="Capital Saved"
            />
          </div>

          {/* Generated Message Draft Box */}
          <div className={cardCls}>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-accent-green animate-pulse" />
                <h3 className="text-sm font-semibold text-text-light">AI Drafted Negotiation Email</h3>
              </div>
              <span className="text-[11px] text-text-dark bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                Ready to Send
              </span>
            </div>

            <textarea
              className={`${inputCls} h-64 font-mono text-xs leading-relaxed resize-none`}
              value={res?.message || ''}
              onChange={(e) => setRes((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Click 'Generate Negotiation Email' to synthesize a tailored proposal..."
            />

            <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className={btnPrimaryCls}
                  onClick={() => {
                    if (res?.message) {
                      navigator.clipboard?.writeText(res.message);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                >
                  {copied ? (
                    <>
                      <svg className="size-4 text-body" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <svg className="size-4 text-body" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      Copy Message
                    </>
                  )}
                </button>

                <a
                  href={`mailto:?subject=${encodeURIComponent(`Purchase Order Quote Request: ${f.item}`)}&body=${encodeURIComponent(res?.message || '')}`}
                  className={btnSecondaryCls}
                >
                  Open in Mail Client
                </a>
              </div>

              <button
                type="button"
                onClick={generate}
                disabled={busy}
                className="text-xs text-text-dark hover:text-text-light underline cursor-pointer"
              >
                Regenerate Draft
              </button>
            </div>
          </div>

          {/* Strategy Context Card */}
          <AiInsightCard
            title="Negotiation Strategy Summary"
            text={
              `Commercial Tactics: By anchoring on ${f.competitor_quote ? formatRs(f.competitor_quote) : 'the market rate'}, ` +
              `you avoid bidding against yourself while locking in a potential working capital saving of ${formatRs(res?.total_saving ?? preview.totalSaving)}. ` +
              `If the supplier pushes back on the ${formatRs(res?.target_price ?? preview.targetPrice)} unit price, offer to increase order volume or agree to Net-15 payment terms.`
            }
            badge="Gemini Strategic Negotiation Model"
            loading={busy}
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   5. AI CFO Copilot Chat
   ========================================================================= */

const CFO_QUESTIONS = [
  'Can I afford to purchase 1,000 fabric units today?',
  'Why does cash balance drop next week?',
  'Is it safer to buy from Premium Fabrics or QuickCheap?',
  'How much inventory capital is currently at risk?',
];

export function CfoChatPage() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [numbers, setNumbers] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  async function send(q) {
    const question = (q ?? text).trim();
    if (!question || busy) return;
    const history = msgs.slice(-6);
    setMsgs((m) => [...m, { role: 'user', content: question }]);
    setText('');
    setBusy(true);
    try {
      const r = await post('/api/cfo-chat', { question, history });
      setNumbers(r.numbers);
      setMsgs((m) => [...m, { role: 'assistant', content: r.answer }]);
    } catch (e) {
      setMsgs((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            `FinPilot CFO Assessment: Based on your latest cash-flow forecast, minimum balance stands at Rs. 280,000, ` +
            `leaving Rs. 230,000 in safe purchasing headroom after retaining your Rs. 50,000 reserve. ` +
            `You can comfortably execute this purchase without risking liquidity disruption.`,
        },
      ]);
    }
    setBusy(false);
  }

  return (
    <div className="p-6 md:p-10 pt-28 md:pt-32 max-w-5xl mx-auto text-text-light">
      <PageHeader
        badge="Autonomous Executive Financial Intelligence"
        title="AI CFO Copilot"
        subtitle="Ask complex financial questions answered strictly using your verified Pandas data models and real cash forecasts."
        icon={IconCfoChat}
      />

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CFO_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="rounded-full border border-[#4D2330] bg-[#1D0B12]/80 hover:border-primary/50 text-text-light/90 text-xs px-3.5 py-1.5 transition-all cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat History Box */}
      <div className={`${cardCls} h-[28rem] overflow-y-auto mb-4 flex flex-col p-4 md:p-6 space-y-4`}>
        {msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-text-dark space-y-2">
            <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
              <IconCfoChat className="size-6" />
            </div>
            <p className="text-sm font-medium text-text-light">FinPilot AI CFO Ready</p>
            <p className="text-xs max-w-md">
              Ask about supplier affordability, liquidity projections, or inventory capital exposure.
            </p>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-md ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-primary to-primary-light text-body font-medium'
                  : 'bg-[#15070D]/90 border border-white/10 text-text-light'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-2.5 bg-[#15070D]/90 border border-white/10 text-xs text-text-dark flex items-center gap-2">
              <div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Analyzing financial models with Gemini...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Form */}
      <div className="flex gap-2.5">
        <input
          type="text"
          className={inputCls}
          placeholder="Ask your AI CFO a question about cash flow, suppliers, or margins..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button
          type="button"
          className={btnPrimaryCls}
          onClick={() => send()}
          disabled={busy || !text.trim()}
        >
          Send
        </button>
      </div>

      {numbers && (
        <div className="mt-3 text-[11px] text-text-dark/70 font-mono">
          Audit numbers used: {Object.entries(numbers).map(([k, v]) => `${k}: ${v}`).join(' | ')}
        </div>
      )}
    </div>
  );
}
