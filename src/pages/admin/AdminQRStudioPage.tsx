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
  Globe,
  Smartphone
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { RestaurantTable } from '../../types';

export const AdminQRStudioPage: React.FC = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('T04');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [baseUrl, setBaseUrl] = useState<string>(window.location.origin);
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

  // Compute final destination URL
  const destinationUrl = customUrl.trim()
    ? customUrl.trim()
    : `${baseUrl}/menu?table=${selectedTable}`;

  const isLocalhost = destinationUrl.includes('localhost') || destinationUrl.includes('127.0.0.1');

  // Generate QR Code data URL whenever destinationUrl changes
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(destinationUrl, {
          width: 600,
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
    link.download = `Farzi-QR-Table-${selectedTable}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrintTentCard = () => {
    window.print();
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
            Digital Table Signage Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-0.5">
            QR Code Generator & Signage Studio
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleDownloadPNG} variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Download PNG
          </Button>
          <Button onClick={handlePrintTentCard} variant="gold" size="sm" icon={<Printer className="w-4 h-4" />}>
            Print Table Tent Card
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration Controls */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="font-serif font-bold text-lg text-ivory-100 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-gold-400" />
            <span>Table Assignment & Routing</span>
          </h3>

          {/* Table Selector Grid */}
          <div>
            <label className="block text-xs font-mono uppercase text-ivory-400 mb-2">
              Select Dining Station Table
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'].map((tbl) => (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => {
                    setSelectedTable(tbl);
                    setCustomUrl('');
                  }}
                  className={`p-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                    selectedTable === tbl && !customUrl
                      ? 'bg-gold-500 text-charcoal-950 border-gold-400 shadow-lg shadow-gold-500/20'
                      : 'bg-charcoal-850 text-ivory-300 border-charcoal-700 hover:border-gold-500/40 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-4 h-4 mb-1" />
                  <span>{tbl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Domain Host Presets & Target Config */}
          <div className="space-y-4 pt-2 border-t border-charcoal-800">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase text-ivory-400">
                  Target Domain Host
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBaseUrl(window.location.origin)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-charcoal-800 hover:bg-charcoal-700 text-ivory-300"
                  >
                    Current Origin
                  </button>
                  <button
                    type="button"
                    onClick={() => setBaseUrl('https://farzi-restaurantos.vercel.app')}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 hover:bg-gold-500/30"
                  >
                    Vercel Demo
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://farzi-restaurantos.vercel.app"
                className="w-full px-3.5 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-xs font-mono text-ivory-200 focus:outline-none focus:border-gold-500/50"
              />
              <p className="text-[11px] text-charcoal-500 mt-1">
                For physical table tent printing or mobile camera scanning, use your public deployment domain.
              </p>
            </div>

            {/* Localhost Warning Notice */}
            {isLocalhost && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="leading-tight">
                  <strong className="font-semibold block text-amber-200 mb-0.5">Localhost QR Code Active</strong>
                  External mobile phones cannot reach <code className="bg-charcoal-950 px-1 py-0.5 rounded text-[11px]">localhost</code>. For a live demo on a separate smartphone, enter your local Wi-Fi IP (e.g. <code className="bg-charcoal-950 px-1 py-0.5 rounded text-[11px]">http://192.168.1.5:5173</code>) or public URL.
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
                placeholder="e.g. https://farzi.com/vip-menu"
                className="w-full px-3.5 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-xs font-mono text-ivory-200 focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          {/* Live URL Preview & Test Trigger */}
          <div className="p-4 rounded-xl bg-charcoal-950 border border-charcoal-800 space-y-2">
            <span className="text-[10px] font-mono uppercase text-charcoal-500 block">
              Active Encoded Destination URL
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-gold-300 truncate">
                {destinationUrl}
              </span>
              <a
                href={destinationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-charcoal-800 text-gold-300 hover:text-white hover:bg-charcoal-700 text-xs font-mono transition-colors flex-shrink-0"
                title="Open and test destination"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Test View</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Printable Table Tent Card Preview */}
        <div>
          <div className="text-xs font-mono uppercase text-gold-400 tracking-wider mb-2 flex items-center justify-between">
            <span>Printable Branded Signage Preview</span>
            <span className="text-charcoal-400 text-[11px]">A6 / A5 Acrylic Table Stands</span>
          </div>

          <div
            ref={printRef}
            className="printable-area bg-[#FAF8F5] text-charcoal-950 rounded-3xl p-8 border-2 border-gold-500/30 shadow-2xl flex flex-col items-center text-center max-w-sm mx-auto"
          >
            {/* Header Brand */}
            <div className="mb-4">
              <div className="w-10 h-10 rounded-full bg-charcoal-950 text-gold-400 flex items-center justify-center font-serif font-black text-xl mx-auto mb-2 shadow-md">
                ✦
              </div>
              <h2 className="font-display font-black tracking-[0.25em] text-2xl text-charcoal-950">
                FARZI
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-widest text-charcoal-600">
                Progressive Modern Indian
              </p>
            </div>

            {/* Table Badge */}
            <div className="my-2 px-4 py-1.5 rounded-full bg-charcoal-950 text-[#FAF8F5] font-mono font-bold text-sm tracking-wider inline-flex items-center gap-1.5 shadow-md">
              <TableIcon className="w-4 h-4 text-gold-400" />
              <span>TABLE {selectedTable}</span>
            </div>

            {/* High-Resolution QR Canvas Render */}
            <div className="my-5 p-4 bg-white rounded-2xl shadow-md border border-neutral-200">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code Table ${selectedTable}`}
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                  Generating...
                </div>
              )}
            </div>

            {/* Call to action & instructions */}
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-charcoal-900">
                Scan to Browse & Order
              </h3>
              <p className="text-xs text-neutral-600 max-w-[240px] leading-relaxed">
                Aim your smartphone camera at this code to explore our molecular gastronomy creations and dispatch orders directly to the kitchen.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-300 w-full text-[9px] font-mono text-neutral-500">
              Farzi Digital Dining Experience • High Street Galleria, CP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
