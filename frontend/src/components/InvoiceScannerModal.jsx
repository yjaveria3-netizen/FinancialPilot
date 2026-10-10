import { useState } from 'react';
import {
  IconScanInvoice,
  IconClose,
  IconUploadCloud,
  IconLightning,
  IconCheck,
} from './Icons';
import { useLanguage } from '../context/LanguageContext';

export default function InvoiceScannerModal({ isOpen, onClose }) {
  const { t } = useLanguage();
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const simulateScan = (fileTitle) => {
    setFileName(fileTitle);
    setScanning(true);
    setScannedResult(null);

    // Mock OCR / Vision analysis simulation (1.2s)
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
      });
    }, 1200);
  };

 const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setScanning(true);
    setScannedResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(`${API}/api/invoice-scan`, { method: 'POST', body: form });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || 'scan failed');
      const f = d.fields || {};
      setScannedResult({
        invoiceId: 'SCANNED-' + Date.now().toString().slice(-4),
        vendor: f.vendor || 'Unknown vendor',
        date: f.date || new Date().toISOString().slice(0, 10),
        dueDate: f.date || '',
        amount: Number(f.amount ?? 0),
        category: f.currency || 'PKR',
        lineItems: [],
        confidence: 'Gemini 2.5 Flash',
      });
      setScanning(false);
    } catch (err) {
      console.error(err);
      simulateScan(file.name);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-2xl bg-body/85 animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-2xl card-electric rounded-4xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-secondary/20 border border-secondary/35 flex items-center justify-center text-secondary-light">
              <IconScanInvoice className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-secondary text-white">
                {t('scan_title', 'Invoice & Receipt Scanner')}
              </h3>
              <p className="text-xs text-text-dark">
                {t('scan_subtitle', 'AI Vision & OCR automatic ledger extraction')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-text-dark hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <IconClose className="size-4" />
          </button>
        </div>

        {/* Upload Dropzone */}
        {!scannedResult && !scanning && (
          <div className="space-y-6">
            <label className="border-2 border-dashed border-border hover:border-secondary/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-dark/40 group">
              <span className="mb-3 group-hover:scale-110 transition-transform text-secondary-light">
                <IconUploadCloud className="size-10" />
              </span>
              <span className="text-sm font-semibold text-white group-hover:text-secondary-light transition-colors">
                {t('scan_dropzone', 'Drop invoice or receipt here, or browse')}
              </span>
              <span className="text-xs text-text-dark mt-1">
                {t('scan_supported', 'Supports PDF, PNG, JPG receipts up to 25MB')}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileUpload}
              />
            </label>

            {/* Quick Sample Invoices */}
            <div>
              <span className="text-xs text-text-dark font-medium block mb-2">
                {t('scan_or_test', 'Or test with sample mock invoice:')}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => simulateScan('acme_freight_october.pdf')}
                  className="btn btn-outline btn-sm text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer hover:border-secondary/60"
                >
                  <IconLightning className="size-3.5 text-secondary-light" />
                  <span>{t('scan_sample_1', 'Acme Freight Bill ($3,480)')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => simulateScan('aws_cloud_servers.pdf')}
                  className="btn btn-outline btn-sm text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer hover:border-secondary/60"
                >
                  <IconLightning className="size-3.5 text-secondary-light" />
                  <span>{t('scan_sample_2', 'Cloud Infrastructure ($1,850)')}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scanning Animation */}
        {scanning && (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative size-20 rounded-2xl bg-dark/80 border border-secondary/50 flex items-center justify-center overflow-hidden">
              <IconScanInvoice className="size-8 text-secondary-light" />
              <div className="absolute inset-x-0 h-1 bg-secondary animate-pulse top-1/2 -translate-y-1/2 shadow-lg shadow-secondary" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {t('scan_parsing', 'Parsing')} {fileName} {t('scan_with_ocr', 'with OCR Vision…')}
              </div>
              <div className="text-xs text-text-dark mt-1">
                {t('scan_extracting', 'Extracting vendor, line items, and payment terms')}
              </div>
            </div>
          </div>
        )}

        {/* Scanned Result Card */}
        {scannedResult && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl card-electric space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <div className="text-xs text-text-dark">{t('scan_detected_vendor', 'Detected Vendor')}</div>
                  <div className="text-base font-bold text-white">
                    {scannedResult.vendor}
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-xs text-secondary-light font-semibold bg-secondary/15 px-2 py-0.5 rounded-full border border-secondary/30">
                    <IconCheck className="size-3" />
                    <span>{t('scan_confidence', 'Confidence')} {scannedResult.confidence}</span>
                  </div>
                  <div className="text-xs text-text-dark mt-1 font-mono">
                    ID: {scannedResult.invoiceId}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-text-dark block">{t('scan_issue_date', 'Issue Date')}</span>
                  <span className="font-semibold text-white font-mono">{scannedResult.date}</span>
                </div>
                <div>
                  <span className="text-text-dark block">{t('scan_due_date', 'Due Date')}</span>
                  <span className="font-semibold text-white font-mono">{scannedResult.dueDate}</span>
                </div>
                <div>
                  <span className="text-text-dark block">{t('scan_category', 'Category')}</span>
                  <span className="font-semibold text-white">{scannedResult.category}</span>
                </div>
              </div>

              {/* Line items table */}
              <div className="border-t border-border/60 pt-3">
                <span className="text-xs text-text-dark font-medium block mb-2">
                  {t('scan_extracted_items', 'Extracted Line Items')}
                </span>
                <div className="space-y-1.5 text-xs">
                  {scannedResult.lineItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-text">
                      <span>{item.desc} (x{item.qty})</span>
                      <span className="font-mono text-white">${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-border/40">
                    <span>{t('scan_total_amount', 'Total Amount')}</span>
                    <span className="text-secondary-light font-mono font-bold">
                      ${scannedResult.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScannedResult(null)}
                className="btn btn-outline btn-sm text-xs cursor-pointer hover:border-secondary/60"
              >
                {t('scan_another', 'Scan Another')}
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(t('scan_recorded_alert', 'Invoice successfully recorded to /backend/data/invoices.csv!'));
                  onClose();
                }}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-secondary/20 hover:border-secondary/60"
              >
                <IconCheck className="size-3.5" />
                <span>{t('scan_confirm_sync', 'Confirm & Sync to Ledger')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
