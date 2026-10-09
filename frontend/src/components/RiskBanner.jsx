import { useState, useEffect, useCallback } from 'react';
import { getRiskAlert } from '../api/client';
import { IconAiSparkle, IconClose } from './Icons';

export default function RiskBanner() {
  const [alertData, setAlertData] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Editable draft states
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [bodyText, setBodyText] = useState('');

  const fetchAlert = useCallback(async () => {
    try {
      const data = await getRiskAlert();
      setAlertData(data);
      if (data?.email_draft) {
        setToEmail(data.email_draft.to || 'billing@customer.com');
        setSubject(data.email_draft.subject || 'Expedited Settlement Notice');
        setBodyText(data.email_draft.body || '');
      }
      // If crisis occurs, un-dismiss immediately
      if (data?.severity === 'CRITICAL') {
        setDismissed(false);
      }
    } catch (err) {
      console.warn('Risk alert check non-blocking error:', err);
    }
  }, []);

  useEffect(() => {
    fetchAlert();
  }, [fetchAlert]);

  // Listen to both global refresh and crisis trigger
  useEffect(() => {
    const handleSync = () => {
      fetchAlert();
    };
    const handleCrisis = () => {
      setDismissed(false);
      fetchAlert();
    };

    window.addEventListener('finpilot:refresh', handleSync);
    window.addEventListener('finpilot:crisis', handleCrisis);
    return () => {
      window.removeEventListener('finpilot:refresh', handleSync);
      window.removeEventListener('finpilot:crisis', handleCrisis);
    };
  }, [fetchAlert]);

  if (!alertData?.has_alert || dismissed) {
    return null;
  }

  const isCritical = alertData.severity === 'CRITICAL';

  const handleSendEmail = () => {
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setModalOpen(false);
    }, 2200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${toEmail}\nSubject: ${subject}\n\n${bodyText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const content = `================================================================================
FINPILOT AUTONOMOUS MITIGATION NOTICE — TRANSMISSION DISPATCH
Generated: ${new Date().toLocaleString()}
Target Account: ${alertData.target_invoice?.entity || 'Client'}
Invoice ID: ${alertData.target_invoice?.invoice_id || 'N/A'}
Amount: $${alertData.target_invoice?.amount?.toLocaleString() || '0'}
================================================================================
TO: ${toEmail}
SUBJECT: ${subject}
--------------------------------------------------------------------------------
${bodyText}
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FinPilot_Action_Notice_${alertData.target_invoice?.invoice_id || 'Alert'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ── Striking Autonomous Proactive Risk Banner ── */}
      <div
        className={`mb-8 p-5 sm:p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
          isCritical
            ? 'bg-rose-950/20 border-rose-500/50 shadow-2xl shadow-rose-950/30'
            : 'bg-amber-950/20 border-amber-500/40 shadow-xl shadow-amber-950/20'
        } animate-fadeIn`}
      >
        {/* Ambient background pulsing glow */}
        <div
          className={`absolute -right-10 -bottom-10 size-48 rounded-full blur-3xl pointer-events-none ${
            isCritical ? 'bg-rose-500/10' : 'bg-amber-500/10'
          }`}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left Column: Icon & Alert Messaging */}
          <div className="flex items-start gap-4">
            <div
              className={`size-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                isCritical
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              }`}
            >
              <span className="text-xl animate-pulse">⚠️</span>
            </div>

            <div className="space-y-1.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                    isCritical
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isCritical ? '🚨 Autonomous Priority Alert' : '⚡ Actionable Risk Signal'}
                </span>

                {alertData.low_cash_day && (
                  <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Threshold breach on: {alertData.low_cash_day}
                  </span>
                )}

                {alertData.high_severity_count > 0 && (
                  <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    {alertData.high_severity_count} High-Severity Anomalies
                  </span>
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold font-secondary text-white leading-snug">
                {alertData.headline}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {alertData.message}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Action Button & Dismiss */}
          <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                isCritical
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 hover:scale-102'
                  : 'btn-primary text-white hover:scale-102'
              }`}
            >
              <IconAiSparkle className="size-4" />
              <span>{alertData.action_label}</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="size-9 rounded-2xl bg-white/5 hover:bg-white/10 text-text-dark hover:text-white border border-border flex items-center justify-center transition-colors cursor-pointer"
              title="Dismiss banner"
              aria-label="Dismiss banner"
            >
              <IconClose className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Automated Mitigation Email Draft Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-2xl bg-body/85 animate-fadeIn">
          {/* Backdrop click to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setModalOpen(false)} />

          <div className="relative w-full max-w-3xl bg-light/95 border border-border rounded-4xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-fadeIn space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                  <IconAiSparkle className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-secondary text-white">
                      Autonomous Agent Collection Draft
                    </h3>
                    <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full font-semibold">
                      Gemini Synthesized
                    </span>
                  </div>
                  <p className="text-xs text-text-dark">
                    Automated debt settlement notice with early-pay discount &amp; wire routing
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-text-dark hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <IconClose className="size-4" />
              </button>
            </div>

            {/* Success alert during transmission */}
            {sentSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-fadeIn">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Notice successfully queued and transmitted to target accounts payable server!</span>
              </div>
            )}

            {/* Email Form Fields */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-dark font-medium mb-1">Recipient (AP Contact):</label>
                  <input
                    type="email"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    className="w-full bg-white/5 border border-border rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-text-dark font-medium mb-1">Target Invoice &amp; Value:</label>
                  <div className="bg-white/5 border border-border rounded-xl px-3.5 py-2 text-white font-mono flex justify-between items-center">
                    <span>{alertData.target_invoice?.invoice_id || 'INV-0203'}</span>
                    <span className="text-primary font-bold">
                      ${alertData.target_invoice?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-text-dark font-medium mb-1">Subject Line:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-text-dark font-medium mb-1 flex items-center justify-between">
                  <span>Executive Email Body (Editable):</span>
                  <span className="text-[10px] text-text-dark">Includes 2% wire settlement incentive</span>
                </label>
                <textarea
                  rows={8}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full bg-white/5 border border-border rounded-xl p-3.5 text-xs text-zinc-200 leading-relaxed font-mono focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-xl text-xs bg-white/5 hover:bg-white/10 border border-border text-text-dark hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? '✓ Copied Draft' : 'Copy Text'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-2 rounded-xl text-xs bg-white/5 hover:bg-white/10 border border-border text-text-dark hover:text-white transition-colors cursor-pointer"
                >
                  Download .txt
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline btn-sm text-xs py-2 px-4 flex-1 sm:flex-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendEmail}
                  disabled={sentSuccess}
                  className="btn btn-primary btn-sm text-xs py-2 px-5 flex-1 sm:flex-none flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>⚡ Transmit Notice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
