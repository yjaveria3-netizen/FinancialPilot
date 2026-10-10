import { useEffect, useRef, useState } from 'react';

/* Member B pages. Every number box is editable and recalculates live.
   Backend address: set VITE_API_URL in production, otherwise localhost. */
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function api(path, options) {
  const res = await fetch(API + path, options);
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    throw new Error(typeof data.detail === 'string' ? data.detail : `Request failed (${res.status})`);
  }
  return data;
}
const post = (path, body) =>
  api(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const rs = (n) => 'Rs. ' + Math.round(Number(n) || 0).toLocaleString('en-US');

/* ---------- small UI pieces ---------- */
const card = 'rounded-2xl border border-white/10 bg-white/5 p-5';
const inputCls =
  'w-full rounded-lg bg-black/30 border border-white/15 px-3 py-2 text-white outline-none focus:border-violet-400';
const btnCls =
  'rounded-lg bg-violet-500 hover:bg-violet-400 px-4 py-2 font-semibold text-white disabled:opacity-50';

function Page({ title, subtitle, children }) {
  return (
    <div className="p-6 md:p-10 pt-28 md:pt-32 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-white/60 mt-1 mb-6">{subtitle}</p>
      {children}
    </div>
  );
}

function Num({ label, value, onChange, hint, placeholder, step = 'any' }) {
  return (
    <label className="block">
      <span className="text-sm text-white/70">{label}</span>
      <input
        type="number"
        step={step}
        className={inputCls + ' mt-1'}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <span className="text-xs text-white/40">{hint}</span>}
    </label>
  );
}

function ErrorBox({ msg }) {
  if (!msg) return null;
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 p-4 mb-4 text-sm">{msg}</div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className={card}>
      <div className="text-xs uppercase tracking-wide text-white/50">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {sub && <div className="text-xs text-white/50 mt-1">{sub}</div>}
    </div>
  );
}

/* Runs `run` shortly after any input changes; ignores out-of-date answers. */
function useLive(run, deps, delay = 400) {
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

/* ---------- ProcureAI ---------- */
const STRATEGY = {
  buy_now: ['Buy now', 'text-emerald-300 border-emerald-400/40 bg-emerald-400/10'],
  split: ['Split order', 'text-violet-300 border-violet-400/40 bg-violet-400/10'],
  partial: ['Order part now', 'text-amber-300 border-amber-400/40 bg-amber-400/10'],
  wait: ['Wait', 'text-red-300 border-red-400/40 bg-red-400/10'],
};

const DEFAULT_SUPPLIERS = [
  { name: 'QuickCheap Traders', price: 80, lead_days: 14, defect_pct: 12 },
  { name: 'MidRange Textiles', price: 90, lead_days: 8, defect_pct: 6 },
  { name: 'Premium Fabrics Co', price: 95, lead_days: 3, defect_pct: 1 },
];

export function ProcurePage() {
  const [qty, setQty] = useState('1000');
  const [cash, setCash] = useState('');
  const [buffer, setBuffer] = useState('50000');
  const [delay, setDelay] = useState('1000');
  const [sup, setSup] = useState(DEFAULT_SUPPLIERS);
  const setS = (i, k, v) => setSup((s) => s.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const { data, error, loading } = useLive(
    () =>
      post('/api/procure-ai/simulate', {
        qty: Number(qty) || 1000,
        starting_cash: cash === '' ? null : Number(cash),
        safety_buffer: Number(buffer) || 0,
        delay_cost_per_day: Number(delay) || 0,
        suppliers: sup.map((s) => ({
          name: s.name,
          price: Number(s.price),
          lead_days: Number(s.lead_days),
          defect_rate: Number(s.defect_pct) / 100,
        })),
      }),
    [qty, cash, buffer, delay, sup],
  );

  const label = data ? STRATEGY[data.strategy] || [data.strategy, ''] : null;

  return (
    <Page title="ProcureAI" subtitle="Change any number and the recommendation updates live.">
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <Num label="Units to buy" value={qty} onChange={setQty} />
        <Num label="Starting cash (Rs.)" value={cash} onChange={setCash} placeholder="use live forecast" hint="Blank = real forecast" />
        <Num label="Safety buffer (Rs.)" value={buffer} onChange={setBuffer} />
        <Num label="Cost of delay per day (Rs.)" value={delay} onChange={setDelay} />
      </div>

      <div className={card + ' mb-4 overflow-x-auto'}>
        <div className="font-semibold mb-3">Suppliers (editable)</div>
        <table className="w-full text-sm">
          <thead className="text-white/50 text-left">
            <tr>
              <th className="pb-2">Name</th>
              <th>Price / unit</th>
              <th>Lead days</th>
              <th>Defect %</th>
            </tr>
          </thead>
          <tbody>
            {sup.map((s, i) => (
              <tr key={i}>
                <td className="pr-2 py-1">
                  <input className={inputCls} value={s.name} onChange={(e) => setS(i, 'name', e.target.value)} />
                </td>
                {['price', 'lead_days', 'defect_pct'].map((k) => (
                  <td key={k} className="pr-2 py-1">
                    <input type="number" step="any" className={inputCls} value={s[k]} onChange={(e) => setS(i, k, e.target.value)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ErrorBox msg={error} />
      {loading && !data && <div className="text-white/50">Calculating...</div>}

      {data && (
        <div className={loading ? 'opacity-60 transition' : 'transition'}>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <Stat label="Lowest cash ahead" value={rs(data.min_balance)} sub={`next ${data.horizon_days} days`} />
            <Stat label="Safe budget today" value={rs(data.safe_budget)} sub={`after ${rs(data.safety_buffer)} buffer`} />
            <Stat label="Best value supplier" value={data.best_value_supplier} sub="lowest total cost per unit" />
            <Stat label="Can afford it all now?" value={data.buy_now_ok ? 'Yes' : 'No'} sub={data.wait_until_day != null ? `Full order safe from day ${data.wait_until_day}` : 'Not within forecast'} />
          </div>

          <div className={card + ' mb-4'}>
            <span className={'inline-block rounded-full border px-3 py-1 text-sm font-semibold ' + label[1]}>{label[0]}</span>
            <p className="mt-3 text-lg">{data.recommendation}</p>
            {Object.keys(data.split).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {Object.entries(data.split).map(([name, units]) => (
                  <div key={name} className="rounded-lg bg-black/30 border border-white/10 px-4 py-2">
                    <div className="text-white/60 text-xs">{name}</div>
                    <div className="text-xl font-bold">{units} units</div>
                  </div>
                ))}
              </div>
            )}
            {data.savings_vs_cheapest_only != null && (
              <p className="text-emerald-300 text-sm mt-3">
                Saves {rs(data.savings_vs_cheapest_only)} in total cost versus buying only from the cheapest-price supplier.
              </p>
            )}
          </div>

          <div className={card + ' mb-4 overflow-x-auto'}>
            <div className="font-semibold mb-3">Total cost of ownership</div>
            <table className="w-full text-sm">
              <thead className="text-white/50 text-left">
                <tr>
                  <th className="pb-2">Supplier</th><th>Base</th><th>Defects</th><th>Delay</th><th>Total</th><th>Per unit</th>
                </tr>
              </thead>
              <tbody>
                {data.tco_table.map((t, i) => (
                  <tr key={t.name} className={i === data.best_value_index ? 'text-emerald-300 font-semibold' : ''}>
                    <td className="py-1">{t.name}</td>
                    <td>{rs(t.base_cost)}</td>
                    <td>{rs(t.defect_cost)}</td>
                    <td>{rs(t.delay_cost)}</td>
                    <td>{rs(t.total_tco)}</td>
                    <td>{rs(t.tco_per_unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={card}>
            <div className="font-semibold mb-2">AI explanation</div>
            <p className="text-white/80 whitespace-pre-line">{data.explanation}</p>
          </div>
        </div>
      )}
    </Page>
  );
}

/* ---------- Inventory ---------- */
export function InventoryPage() {
  const [expiry, setExpiry] = useState('30');
  const [slow, setSlow] = useState('60');
  const { data, error, loading } = useLive(
    () => api(`/api/inventory-alerts?expiry_days=${Number(expiry) || 30}&slow_days=${Number(slow) || 60}`),
    [expiry, slow],
  );
  return (
    <Page title="Inventory Alerts" subtitle="Low stock, near-expiry and slow-moving items, with suggested actions.">
      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <Num label="Warn if expiring within (days)" value={expiry} onChange={setExpiry} />
        <Num label="Slow-moving after (days unsold)" value={slow} onChange={setSlow} />
      </div>
      <ErrorBox msg={error} />
      {loading && !data && <div className="text-white/50">Loading...</div>}
      {data && (
        <div className={loading ? 'opacity-60' : ''}>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <Stat label="Items flagged" value={`${data.summary.flagged_items} / ${data.summary.total_items}`} sub={data.source} />
            <Stat label="Low stock" value={data.summary.low_stock ?? 0} sub={`Reorder cost ${rs(data.summary.reorder_cost ?? 0)}`} />
            <Stat label="Near expiry / expired" value={(data.summary.near_expiry || 0) + (data.summary.expired || 0)} />
            <Stat label="Stock value at risk" value={rs(data.summary.stock_value_at_risk)} />
          </div>
          <div className={card + ' overflow-x-auto'}>
            <table className="w-full text-sm">
              <thead className="text-white/50 text-left">
                <tr><th className="pb-2">Item</th><th>Qty</th><th>Status</th><th>Why</th><th>Suggested action</th></tr>
              </thead>
              <tbody>
                {data.alerts.map((a, i) => (
                  <tr key={a.item + i} className="border-t border-white/5">
                    <td className="py-2">{a.item}</td>
                    <td>{a.qty}</td>
                    <td>{String(a.status).replace('_', ' ')}</td>
                    <td className="text-white/70">{a.reasons.join(', ')}</td>
                    <td className="font-semibold">{a.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.alerts.length === 0 && <div className="text-white/60 py-4">Nothing needs attention.</div>}
          </div>
        </div>
      )}
    </Page>
  );
}

/* ---------- Pricing ---------- */
export function PricingPage() {
  const [cost, setCost] = useState('1000');
  const [margin, setMargin] = useState('25');
  const [comp, setComp] = useState('1200');
  const { data, error, loading } = useLive(
    () => {
      const q = new URLSearchParams({ cost: cost || '0', margin: String((Number(margin) || 0) / 100) });
      if (comp !== '') q.set('competitor_price', comp);
      return api('/api/pricing-advisor?' + q.toString());
    },
    [cost, margin, comp],
    800,
  );
  return (
    <Page title="Pricing Advisor" subtitle="Set your cost, target margin and the competitor's price.">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Num label="Your cost per unit (Rs.)" value={cost} onChange={setCost} />
        <Num label="Target markup (%)" value={margin} onChange={setMargin} />
        <Num label="Competitor price (Rs.)" value={comp} onChange={setComp} hint="Leave blank if unknown" />
      </div>
      <ErrorBox msg={error} />
      {data && (
        <div className={loading ? 'opacity-60' : ''}>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <Stat label="Suggested price" value={rs(data.suggested_price)} sub={data.capped_by_competitor ? 'Lowered to stay under competitor' : 'Your target price'} />
            <Stat label="Profit per unit" value={rs(data.profit_per_unit)} sub={`${data.profit_pct_of_price}% of price`} />
            <Stat label="Target price" value={rs(data.target_price)} />
            <Stat label="Vs competitor" value={data.vs_competitor_pct == null ? 'n/a' : `${data.vs_competitor_pct}%`} />
          </div>
          {data.warning && <ErrorBox msg={data.warning} />}
          <div className={card}>
            <div className="font-semibold mb-2">Why this price</div>
            <p className="text-white/80">{data.reason}</p>
          </div>
        </div>
      )}
    </Page>
  );
}

/* ---------- Negotiation ---------- */
export function NegotiationPage() {
  const [f, setF] = useState({ supplier: 'Premium Fabrics Co', item: 'cotton fabric', past_price: '95', competitor_quote: '88', qty: '1000' });
  const [res, setRes] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));

  async function generate() {
    setBusy(true);
    setError('');
    try {
      setRes(
        await post('/api/negotiation', {
          supplier: f.supplier,
          item: f.item,
          past_price: Number(f.past_price),
          competitor_quote: f.competitor_quote === '' ? null : Number(f.competitor_quote),
          qty: Number(f.qty) || 1000,
        }),
      );
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  return (
    <Page title="Negotiation Copilot" subtitle="Python picks the target price, AI writes the message.">
      <div className="grid md:grid-cols-5 gap-4 mb-4">
        <label className="block">
          <span className="text-sm text-white/70">Supplier</span>
          <input className={inputCls + ' mt-1'} value={f.supplier} onChange={(e) => set('supplier')(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm text-white/70">Item</span>
          <input className={inputCls + ' mt-1'} value={f.item} onChange={(e) => set('item')(e.target.value)} />
        </label>
        <Num label="Our last price" value={f.past_price} onChange={set('past_price')} />
        <Num label="Competitor quote" value={f.competitor_quote} onChange={set('competitor_quote')} />
        <Num label="Units" value={f.qty} onChange={set('qty')} />
      </div>
      <button className={btnCls + ' mb-4'} onClick={generate} disabled={busy}>
        {busy ? 'Writing...' : 'Generate message'}
      </button>
      <ErrorBox msg={error} />
      {res && (
        <div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <Stat label="Ask for" value={rs(res.target_price) + ' / unit'} />
            <Stat label="Saving per unit" value={rs(res.saving_per_unit)} />
            <Stat label="Total saving" value={rs(res.total_saving)} />
          </div>
          <div className={card}>
            <textarea
              className={inputCls + ' h-56'}
              value={res.message}
              onChange={(e) => setRes({ ...res, message: e.target.value })}
            />
            <button
              className={btnCls + ' mt-3'}
              onClick={() => {
                navigator.clipboard?.writeText(res.message);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? 'Copied' : 'Copy message'}
            </button>
          </div>
        </div>
      )}
    </Page>
  );
}

/* ---------- CFO Chat ---------- */
const FALLBACK_QUESTIONS = [
  'Can I afford to hire someone?',
  'Why is my cash low next month?',
  'Can I afford the premium supplier?',
];

export function CfoChatPage() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [numbers, setNumbers] = useState(null);
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [msgs, busy]);

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
      setMsgs((m) => [...m, { role: 'assistant', content: 'Sorry, something went wrong: ' + e.message }]);
    }
    setBusy(false);
  }

  return (
    <Page title="AI CFO Chat" subtitle="Answers use your real computed numbers only.">
      <div className="flex flex-wrap gap-2 mb-4">
        {FALLBACK_QUESTIONS.map((q) => (
          <button key={q} className="rounded-full border border-white/20 px-3 py-1 text-sm hover:bg-white/10" onClick={() => send(q)}>
            {q}
          </button>
        ))}
      </div>
      <div className={card + ' h-[26rem] overflow-y-auto mb-3'}>
        {msgs.length === 0 && <div className="text-white/40">Ask a question or tap one above.</div>}
        {msgs.map((m, i) => (
          <div key={i} className={'mb-3 flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={'max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-line ' + (m.role === 'user' ? 'bg-violet-500' : 'bg-white/10')}>
              {m.content}
            </div>
          </div>
        ))}
        {busy && <div className="text-white/50">Thinking...</div>}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <input
          className={inputCls}
          value={text}
          placeholder="Ask your CFO..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className={btnCls} onClick={() => send()} disabled={busy}>Send</button>
      </div>
      {numbers && (
        <div className="text-xs text-white/40 mt-3">
          Numbers used: {Object.entries(numbers).map(([k, v]) => `${k}=${v}`).join(' | ')}
        </div>
      )}
    </Page>
  );
}
