import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Download,
  Printer,
  Table as TableIcon,
  Sparkles,
  ExternalLink,
  Layers,
  AlertTriangle,
  Smartphone,
  Copy,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { RestaurantTable } from '../../types';

export const AdminQRStudioPage: React.FC = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('T04');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>(import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await api.getTables();
        setTables(data);
      } catch (err) {
        console.error('Failed to load tables:', err);
      }
    };
    loadTables();
  }, []);

  // Compute final destination URL safely
  const sanitizedCustom = customUrl.trim().replace(/^javascript:/i, '');
  const destinationUrl = sanitizedCustom
    ? sanitizedCustom
    : `${baseUrl.replace(/\/+$/, '')}/menu?table=${selectedTable}`;

  const isLocalhost = destinationUrl.includes('localhost') || destinationUrl.includes('127.0.0.1');

  // Generate QR Code data URL whenever destinationUrl changes
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(destinationUrl, {
          width: 800,
          margin: 2,
          color: {
            dark: '#0A0B0E',
            light: '#FAF8F5'
          }
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    };
    generateQR();
  }, [destinationUrl]);

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `Farzi-Bistro-QR-Table-${selectedTable}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrintTentCard = () => {
    window.print();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(destinationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const tableList = tables.length > 0
    ? tables.map(t => t.tableNumber)
    : ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'];

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
            Digital Table Signage & QR Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-0.5">
            QR Studio & Table Tent Creator
          </h1>
          <p className="text-xs text-charcoal-400 mt-1">
            Generate high-resolution printable table cards and customer ordering QR codes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleDownloadPNG} variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Download PNG (800px)
          </Button>
          <Button onClick={handlePrintTentCard} variant="gold" size="sm" icon={<Printer className="w-4 h-4" />}>
            Print Table Tent Stand
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration Controls (7 cols) */}
        <div className="lg:col-span-7 bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
            <h3 className="font-serif font-bold text-lg text-ivory-100 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-gold-400" />
              <span>Table Station Configuration</span>
            </h3>
            <span className="text-xs font-mono text-gold-400 bg-charcoal-950 px-2.5 py-1 rounded-full border border-gold-500/30">
              Active: Table {selectedTable}
            </span>
          </div>

          {/* Table Selector Grid */}
          <div>
            <label className="block text-xs font-mono uppercase text-ivory-400 mb-2.5">
              Select Dining Station Table
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
              {tableList.map((tbl) => {
                const isCurrent = selectedTable === tbl && !customUrl;
                return (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => {
                      setSelectedTable(tbl);
                      setCustomUrl('');
                    }}
                    className={`p-3 rounded-2xl border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-br from-gold-500 to-copper-600 text-charcoal-950 border-gold-400 shadow-lg shadow-gold-500/25 scale-102'
                        : 'bg-charcoal-850 text-ivory-300 border-charcoal-700 hover:border-gold-500/40 hover:text-white'
                    }`}
                  >
                    <TableIcon className={`w-4 h-4 mb-1 ${isCurrent ? 'text-charcoal-950' : 'text-gold-400'}`} />
                    <span>{tbl}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Host Configuration */}
          <div className="space-y-4 pt-4 border-t border-charcoal-800">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase text-ivory-400">
                  Target Domain Host
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBaseUrl(window.location.origin)}
                    className="text-[10px] font-mono px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-ivory-300 transition-colors"
                  >
                    Current Origin
                  </button>
                  <button
                    type="button"
                    onClick={() => setBaseUrl('https://farzi-restaurantos.vercel.app')}
                    className="text-[10px] font-mono px-2.5 py-1 rounded bg-gold-500/20 text-gold-300 hover:bg-gold-500/30 transition-colors"
                  >
                    Production Demo
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://farzi-restaurantos.vercel.app"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-xs font-mono text-ivory-200 focus:outline-none focus:border-gold-500/50"
              />
              <p className="text-[11px] text-charcoal-500 mt-1">
                For physical table tent printing or external phone scanning, use your public deployment domain.
              </p>
            </div>

            {/* Localhost Warning Notice */}
            {isLocalhost && (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-semibold block text-amber-200 mb-0.5">Localhost QR Active</strong>
                  External smartphones cannot resolve <code className="bg-charcoal-950 px-1 py-0.5 rounded text-[11px]">localhost</code>. For a live test on a mobile device, use your Wi-Fi LAN IP or the Production Demo domain above.
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                Custom Target URL Override (Optional)
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="e.g. https://farzi-restaurantos.vercel.app/menu?table=T04"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-xs font-mono text-ivory-200 focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          {/* Live URL Preview & Test Trigger */}
          <div className="p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500 block">
              Live Encoded Destination URL
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-gold-300 truncate">
                {destinationUrl}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-charcoal-850 text-ivory-300 hover:text-white text-xs font-mono transition-colors"
                  title="Copy URL to clipboard"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={destinationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-500/20 text-gold-300 hover:bg-gold-500 hover:text-charcoal-950 text-xs font-mono transition-colors"
                  title="Open in new tab to test customer experience"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Test View</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Printable Table Tent Card Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="text-xs font-mono uppercase text-gold-400 tracking-wider mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Printable Table Tent Signage</span>
            </span>
            <span className="text-charcoal-400 text-[11px]">Standard A6 / A5 Acrylic Stands</span>
          </div>

          <div
            ref={printRef}
            className="printable-area bg-[#FAF8F5] text-charcoal-950 rounded-3xl p-8 border-2 border-gold-500/40 shadow-2xl flex flex-col items-center text-center max-w-sm mx-auto relative overflow-hidden"
          >
            {/* Top decorative double gold hairline */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-500 via-copper-500 to-gold-500" />

            {/* Header Brand */}
            <div className="mb-4 pt-2">
              <div className="w-11 h-11 rounded-full bg-charcoal-950 text-gold-400 flex items-center justify-center font-serif font-black text-xl mx-auto mb-2.5 shadow-md">
                ✦
              </div>
              <h2 className="font-display font-black tracking-[0.25em] text-2xl text-charcoal-950">
                FARZI
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-widest text-charcoal-600 mt-0.5">
                Progressive Modern Indian
              </p>
            </div>

            {/* Table Badge */}
            <div className="my-2 px-5 py-2 rounded-full bg-charcoal-950 text-[#FAF8F5] font-mono font-bold text-sm tracking-widest inline-flex items-center gap-2 shadow-lg">
              <TableIcon className="w-4 h-4 text-gold-400" />
              <span>TABLE {selectedTable}</span>
            </div>

            {/* High-Resolution QR Canvas Render with Corner Motifs */}
            <div className="my-5 p-4 bg-white rounded-2xl shadow-md border border-neutral-200 relative">
              {/* Corner decorative marks */}
              <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-gold-500" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-gold-500" />
              <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-gold-500" />
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-gold-500" />

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code Table ${selectedTable}`}
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                  Generating High-DPI QR...
                </div>
              )}
            </div>

            {/* Call to action & instructions */}
            <div className="space-y-1.5">
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                Scan to Browse & Order
              </h3>
              <p className="text-xs text-neutral-600 max-w-[240px] leading-relaxed">
                Aim your smartphone camera at this code to explore our molecular gastronomy creations and dispatch orders directly to the kitchen.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-300 w-full text-[9px] font-mono text-neutral-500 flex items-center justify-between">
              <span>Farzi RestaurantOS</span>
              <span>Cyber Hub & Connaught Place</span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[11px] text-charcoal-500">
              Tip: Click "Print Table Tent Stand" to produce high-contrast, perfectly sized cards for physical table displays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
