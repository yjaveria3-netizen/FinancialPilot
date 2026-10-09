import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAnomalies } from '../api/client';
import { IconAnomalyGuard, IconAiSparkle } from './Icons';

export default function AnomalyGuard() {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [reviewedIds, setReviewedIds] = useState(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnomalies();
      setAnomalies(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch anomaly records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Quick filter buttons matching template design
  const filterOptions = [
    { key: 'ALL', label: 'All Anomalies' },
    { key: 'HIGH_ONLY', label: 'High Severity Only' },
    { key: 'DUPLICATE', label: 'Duplicate Invoices' },
    { key: 'PAYMENT', label: 'Unusual Payments' },
    { key: 'PRICE_SPIKE', label: 'Price Spikes' },
  ];

  // Filtered and searched records
  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((item) => {
      // Filter logic
      if (activeFilter === 'HIGH_ONLY' && item.severity !== 'High') return false;
      if (activeFilter === 'DUPLICATE' && item.category !== 'Duplicate') return false;
      if (activeFilter === 'PAYMENT' && item.category !== 'Unusual Payment') return false;
      if (activeFilter === 'PRICE_SPIKE' && item.category !== 'Price Spike') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = item.id?.toLowerCase().includes(q);
        const matchRef = item.item_reference?.toLowerCase().includes(q);
        const matchEntity = item.entity?.toLowerCase().includes(q);
        const matchReason = item.reason?.toLowerCase().includes(q);
        const matchCategory = item.category?.toLowerCase().includes(q);
        return matchId || matchRef || matchEntity || matchReason || matchCategory;
      }

      return true;
    });
  }, [anomalies, activeFilter, searchQuery]);

  // Summary Metrics
  const stats = useMemo(() => {
    const totalCount = anomalies.length;
    const highCount = anomalies.filter((a) => a.severity === 'High').length;
    const mediumCount = anomalies.filter((a) => a.severity === 'Medium').length;
    const totalExposure = anomalies.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
    return { totalCount, highCount, mediumCount, totalExposure };
  }, [anomalies]);

  const toggleReview = (id, e) => {
    e.stopPropagation();
    setReviewedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleExpand = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  // Severity Badge Styling
  const renderSeverityBadge = (severity) => {
    switch (severity) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="size-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            High Severity
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="size-1.5 rounded-full bg-amber-400"></span>
            Medium Severity
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <span className="size-1.5 rounded-full bg-sky-400"></span>
            Low Severity
          </span>
        );
    }
  };

  // Category Badge Styling
  const renderCategoryBadge = (category) => {
    let colorClasses = 'text-primary bg-primary/10 border-primary/20';
    if (category === 'Duplicate') colorClasses = 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20';
    if (category === 'Unusual Payment') colorClasses = 'text-secondary bg-secondary/10 border-secondary/20';
    if (category === 'Price Spike') colorClasses = 'text-purple-300 bg-purple-500/10 border-purple-500/20';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${colorClasses}`}>
        {category}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-light border border-border text-xs text-primary mb-3 font-semibold">
            <IconAnomalyGuard className="size-4" />
            Audit & Forensic Risk Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-secondary text-white">
            Anomaly & Fraud <span className="text-primary font-normal">Guard</span>
          </h1>
          <p className="text-sm text-text-dark mt-1">
            Real-time ledger audit detecting duplicate invoices, statistical payment outliers (z &gt; 2.5), and supplier price spikes
          </p>
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="btn-outline px-5 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all self-start md:self-auto"
        >
          <svg className={`size-4 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          Re-scan Ledger
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-6 rounded-3xl bg-secondary/10 border border-secondary/30 flex items-start gap-4">
          <div className="size-10 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 text-secondary font-bold text-lg">
            !
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Ledger Ingestion Error</h4>
            <p className="text-xs text-text-dark">{error}</p>
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">Total Flagged</div>
          <div className="text-3xl font-bold font-secondary text-white">
            {stats.totalCount}
          </div>
          <div className="text-xs text-text-dark mt-2 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary"></span>
            Across 3 audit algorithms
          </div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">High Severity Risks</div>
          <div className="text-3xl font-bold font-secondary text-rose-400 font-mono">
            {stats.highCount}
          </div>
          <div className="text-xs text-rose-400/80 mt-2 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            Requires immediate CPA review
          </div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">Potential Exposure</div>
          <div className="text-3xl font-bold font-secondary text-white font-mono">
            ${stats.totalExposure.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-text-dark mt-2">
            Cumulative value under review
          </div>
        </div>

        <div className="rounded-3xl bg-light border border-border p-6 relative overflow-hidden">
          <div className="text-xs text-text-dark font-medium uppercase tracking-wider mb-2">Detection Engine</div>
          <div className="text-xl font-bold font-secondary text-primary mt-1">
            Active • 100%
          </div>
          <div className="text-xs text-text-dark mt-2 flex items-center gap-1">
            <IconAiSparkle className="size-3.5 text-primary shrink-0" />
            Statistical Z-Score &amp; Median Variance
          </div>
        </div>
      </div>

      {/* Control Bar: Quick Filter Buttons & Search */}
      <div className="rounded-3xl bg-light border border-border p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === f.key
                  ? 'btn-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white/5 border border-border text-text-dark hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
              {f.key === 'HIGH_ONLY' && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/30 text-rose-300">
                  {stats.highCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reference, vendor, reason..."
            className="w-full bg-white/5 border border-border rounded-xl px-4 py-2 pl-9 text-xs text-white placeholder-text-dark focus:outline-none focus:border-primary transition-colors"
          />
          <svg className="size-4 text-text-dark absolute left-3 top-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-xs text-text-dark hover:text-white"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Anomaly Data Table */}
      <div className="rounded-4xl bg-light border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-secondary text-white">Flagged Ledger Anomalies</h3>
            <p className="text-xs text-text-dark mt-0.5">
              Showing {filteredAnomalies.length} of {anomalies.length} identified risk signals
            </p>
          </div>
          <div className="text-xs text-text-dark">
            Click any row to view full forensic breakdown
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="size-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            <p className="text-xs text-text-dark">Analyzing invoices, cash transactions, and supply catalog...</p>
          </div>
        ) : filteredAnomalies.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="size-12 rounded-full bg-white/5 text-text-dark mx-auto flex items-center justify-center text-xl">
              ✓
            </div>
            <div className="text-base font-semibold text-white">No anomalies matching current filters</div>
            <p className="text-xs text-text-dark max-w-sm mx-auto">
              No transactions or invoices match the selected criteria. Try switching back to &quot;All Anomalies&quot;.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-text-dark uppercase tracking-wider text-[11px] bg-white/[0.02]">
                  <th className="py-4 px-6 font-semibold">Anomaly ID</th>
                  <th className="py-4 px-6 font-semibold">Category</th>
                  <th className="py-4 px-6 font-semibold">Severity</th>
                  <th className="py-4 px-6 font-semibold">Item Reference</th>
                  <th className="py-4 px-6 font-semibold">Flagged Amount</th>
                  <th className="py-4 px-6 font-semibold min-w-[280px]">Why Flagged (Reason)</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAnomalies.map((item) => {
                  const isExpanded = expandedRowId === item.id;
                  const isReviewed = reviewedIds.has(item.id);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => toggleExpand(item.id)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? 'bg-primary/5' : 'hover:bg-white/[0.03]'
                      } ${isReviewed ? 'opacity-60' : ''}`}
                    >
                      {/* ID & Date */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-mono font-medium text-white">{item.id}</div>
                        <div className="text-[11px] text-text-dark mt-0.5">{item.date || 'N/A'}</div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 align-top">
                        {renderCategoryBadge(item.category)}
                      </td>

                      {/* Severity Badge */}
                      <td className="py-4 px-6 align-top">
                        {renderSeverityBadge(item.severity)}
                      </td>

                      {/* Item Reference */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-medium text-text-light">{item.item_reference}</div>
                        <div className="text-[11px] text-text-dark mt-0.5">{item.entity}</div>
                      </td>

                      {/* Flagged Amount */}
                      <td className="py-4 px-6 align-top">
                        <div className="font-mono font-semibold text-white">
                          ${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-text-dark mt-0.5">
                          {item.category === 'Price Spike' ? 'Total batch value' : 'Face value'}
                        </div>
                      </td>

                      {/* Dedicated Why Flagged Column */}
                      <td className="py-4 px-6 align-top">
                        <p className="text-zinc-300 leading-relaxed line-clamp-2" title={item.reason}>
                          {item.reason}
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(item.id);
                          }}
                          className="text-[11px] text-primary hover:underline mt-1 font-medium inline-flex items-center gap-1"
                        >
                          {isExpanded ? 'Hide forensic breakdown ▲' : 'View full breakdown ▼'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 align-top text-right">
                        <button
                          type="button"
                          onClick={(e) => toggleReview(item.id, e)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                            isReviewed
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/5 text-text-dark border border-border hover:text-white hover:border-primary'
                          }`}
                        >
                          {isReviewed ? '✓ Verified' : 'Mark Reviewed'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Expandable Forensic Detail Panel (if row clicked) */}
        {expandedRowId && (
          <div className="border-t border-border bg-white/[0.02] p-6 lg:p-8">
            {(() => {
              const activeItem = anomalies.find((a) => a.id === expandedRowId);
              if (!activeItem) return null;

              return (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                        !
                      </div>
                      <div>
                        <div className="text-sm font-bold font-secondary text-white">
                          Forensic Inspection: {activeItem.id} — {activeItem.item_reference}
                        </div>
                        <div className="text-xs text-text-dark mt-0.5">
                          Target Entity: <strong className="text-white">{activeItem.entity}</strong> • Recorded Date: {activeItem.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {renderSeverityBadge(activeItem.severity)}
                      {renderCategoryBadge(activeItem.category)}
                    </div>
                  </div>

                  {/* Deep Reason Container */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-2xl bg-light border border-border p-5 space-y-3">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <IconAiSparkle className="size-3.5" />
                        Detailed Algorithmic Audit Reason
                      </div>
                      <p className="text-sm text-zinc-200 leading-relaxed">
                        {activeItem.reason}
                      </p>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-border text-xs text-text-dark leading-relaxed">
                        <strong className="text-white">Audit Rule Trigger: </strong>
                        {activeItem.category === 'Duplicate' && 'Identical dollar amounts and entity name matching within rolling 14-day chronological window.'}
                        {activeItem.category === 'Unusual Payment' && 'Statistical outlier exceeding 2.50 standard deviations above historical rolling average.'}
                        {activeItem.category === 'Price Spike' && 'Unit cost elevation exceeds baseline catalog median by greater than 35%.'}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-light border border-border p-5 space-y-4">
                      <div className="text-xs font-semibold text-text-dark uppercase tracking-wider">
                        Recommended Remediation
                      </div>
                      <ul className="text-xs text-text space-y-2.5">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Contact <strong>{activeItem.entity}</strong> accounts receivable to verify billing schedule.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Cross-reference bank ledger remittance slip with approved purchase orders.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Require dual-signature sign-off before releasing pending disbursements.</span>
                        </li>
                      </ul>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={(e) => toggleReview(activeItem.id, e)}
                          className="w-full py-2 rounded-xl text-xs font-semibold btn-primary text-white cursor-pointer"
                        >
                          {reviewedIds.has(activeItem.id) ? 'Re-open Investigation' : 'Verify & Clear Exception'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
