import { useState } from 'react';
import {
  IconScanInvoice,
  IconUploadCloud,
  IconLightning,
  IconCheck,
  IconAiSparkle,
} from '../components/Icons';
import { useLanguage } from '../context/LanguageContext';

export default function InvoiceScannerPage() {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [fileName, setFileName] = useState('');
  const [synced, setSynced] = useState(false);

  const simulateScan = (fileTitle) => {
    setFileName(fileTitle);
    setScanning(true);
    setScannedResult(null);
    setSynced(false);

    setTimeout(() => {
      setScanning(false);
      setScannedResult({
        invoiceId: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        vendor: 'Acme Cloud & Logistics Corp',
        date: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
        amount: 3480.0,
        category: 'Supplier Payment / Infrastructure',
        lineItems: [
          { desc: 'Dedicated Server Cluster Host', qty: 2, unitPrice: 1200.0, total: 2400.0 },
          { desc: 'Express Freight Shipping & Handling', qty: 1, unitPrice: 1080.0, total: 1080.0 },
        ],
        confidence: '99.4%',
        taxDeductible: true,
        gstRate: '18%',
      });
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateScan(file.name);
    }
  };

  return (
    <div className="p-6 md:p-10 pt-28 md:pt-32 max-w-6xl mx-auto text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-secondary/20 border border-secondary/35 flex items-center justify-center text-secondary-light">
              <IconScanInvoice className="size-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-secondary">
                {t('scan_title', 'Invoice & Receipt Scanner')}
              </h1>
              <p className="text-white/60 text-sm mt-0.5">
                {t('scan_subtitle', 'AI Vision & OCR automatic ledger extraction for accounts payable')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            OCR Vision Active
          </span>
        </div>
      </div>

      {/* Main Scanner Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload & Samples */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <IconUploadCloud className="size-4 text-secondary-light" />
              <span>Upload Document</span>
            </h3>

            <label className="border-2 border-dashed border-border hover:border-secondary/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-dark/40 group">
              <span className="mb-2 group-hover:scale-110 transition-transform text-secondary-light">
                <IconUploadCloud className="size-8" />
              </span>
              <span className="text-xs font-semibold text-white group-hover:text-secondary-light transition-colors">
                Drop invoice or browse
              </span>
              <span className="text-[11px] text-white/40 mt-1">
                PDF, PNG, JPG (up to 25MB)
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
              />
            </label>

            <div className="mt-5 pt-4 border-t border-white/10">
              <span className="text-xs text-white/50 font-medium block mb-2.5">
                Quick Sample Invoices:
              </span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => simulateScan('acme_freight_bill.pdf')}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-secondary/15 border border-white/10 hover:border-secondary/40 text-xs transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <IconLightning className="size-3.5 text-secondary-light" />
                    <span>Acme Logistics Freight</span>
                  </span>
                  <span className="font-mono text-secondary-light font-bold">Rs. 3,480</span>
                </button>

                <button
                  type="button"
                  onClick={() => simulateScan('aws_cloud_servers.pdf')}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-secondary/15 border border-white/10 hover:border-secondary/40 text-xs transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="flex items-center gap-2">
                    <IconLightning className="size-3.5 text-secondary-light" />
                    <span>Cloud Hosting Cluster</span>
                  </span>
                  <span className="font-mono text-secondary-light font-bold">Rs. 1,850</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scan Result / Status */}
        <div className="lg:col-span-2">
          {scanning && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="relative size-16 rounded-2xl bg-dark/80 border border-secondary/50 flex items-center justify-center overflow-hidden mb-4 shadow-xl shadow-secondary/20">
                <IconScanInvoice className="size-8 text-secondary-light" />
                <div className="absolute inset-x-0 h-1 bg-secondary animate-pulse top-1/2 -translate-y-1/2 shadow-lg shadow-secondary" />
              </div>
              <div className="text-base font-bold text-white">
                Parsing {fileName} with OCR Vision...
              </div>
              <p className="text-xs text-white/50 mt-1">
                Extracting vendor name, line items, VAT/GST breakdown, and due date.
              </p>
            </div>
          )}

          {!scanning && !scannedResult && (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
              <IconScanInvoice className="size-12 text-white/20 mb-3" />
              <div className="text-base font-semibold text-white/60">
                No Document Selected
              </div>
              <p className="text-xs text-white/40 max-w-sm mt-1">
                Upload an invoice or click one of the quick samples on the left to trigger the AI OCR extraction engine.
              </p>
            </div>
          )}

          {!scanning && scannedResult && (
            <div className="rounded-3xl border border-secondary/40 bg-white/5 p-6 backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-white/50 uppercase tracking-wider block">Detected Vendor</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{scannedResult.vendor}</h2>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
                    <IconCheck className="size-3.5" />
                    <span>Confidence: {scannedResult.confidence}</span>
                  </div>
                  <div className="text-xs text-white/50 mt-1 font-mono">
                    Invoice #{scannedResult.invoiceId}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
                  <span className="text-[11px] text-white/50 block">Issue Date</span>
                  <span className="font-mono text-sm font-semibold">{scannedResult.date}</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
                  <span className="text-[11px] text-white/50 block">Due Date</span>
                  <span className="font-mono text-sm font-semibold">{scannedResult.dueDate}</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
                  <span className="text-[11px] text-white/50 block">Category</span>
                  <span className="text-xs font-semibold truncate block">{scannedResult.category}</span>
                </div>
                <div className="p-3 rounded-2xl bg-black/25 border border-white/5">
                  <span className="text-[11px] text-white/50 block">Tax Deductible</span>
                  <span className="text-xs font-semibold text-emerald-400">Section 179 Eligible</span>
                </div>
              </div>

              {/* Line items table */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                <div className="px-4 py-3 bg-white/5 border-b border-white/10 font-semibold text-xs flex justify-between">
                  <span>Line Item Description</span>
                  <span>Amount</span>
                </div>
                <div className="divide-y divide-white/5 text-xs">
                  {scannedResult.lineItems.map((item, idx) => (
                    <div key={idx} className="px-4 py-2.5 flex justify-between items-center text-white/80">
                      <span>{item.desc} (x{item.qty})</span>
                      <span className="font-mono font-semibold text-white">Rs. {item.total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-white/5 border-t border-white/10 flex justify-between items-center font-bold text-sm">
                  <span>Total Payable</span>
                  <span className="text-secondary-light font-mono text-lg">
                    Rs. {scannedResult.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => simulateScan(fileName || 're_scan.pdf')}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold hover:bg-white/10 transition-all cursor-pointer"
                >
                  ↻ Re-Analyze Document
                </button>

                <button
                  type="button"
                  disabled={synced}
                  onClick={() => setSynced(true)}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    synced
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-secondary to-secondary-light text-white border border-secondary/40 shadow-secondary/25 hover:brightness-110 active:scale-95'
                  }`}
                >
                  <IconCheck className="size-4" />
                  <span>{synced ? '✓ Synced to Invoices Ledger' : 'Confirm & Sync to Ledger'}</span>
                </button>
              </div>

              {synced && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>Successfully synchronized into active accounts payable ledger!</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
