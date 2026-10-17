import React, { useState, useEffect } from 'react';
import { Sliders, Save, CheckCircle2, Phone, Mail, MapPin, DollarSign, Clock } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      alert('Failed to update settings');
      console.error(err);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="p-8 text-center text-charcoal-400 font-mono text-xs">
        Loading restaurant settings...
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-semibold">
            System & Operations Config
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ivory-50 mt-0.5">
            Restaurant Settings & Content
          </h1>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Updated</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Info */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif font-bold text-base text-ivory-100 pb-2 border-b border-charcoal-800">
            Brand Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                Restaurant Brand Name
              </label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                Official Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>
        </div>

        {/* Contact & Physical Location */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif font-bold text-base text-ivory-100 pb-2 border-b border-charcoal-800">
            Concierge Contact & Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                Landline Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
              Physical Street Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
            />
          </div>
        </div>

        {/* Financial & Tax Policies */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif font-bold text-base text-ivory-100 pb-2 border-b border-charcoal-800">
            Billing & Taxes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-ivory-400 mb-1">
                GST / Applicable Service Tax (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.taxPercentage}
                onChange={(e) => setSettings({ ...settings, taxPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="gold" size="lg" icon={<Save className="w-4 h-4" />}>
            Save All Restaurant Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
