import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { PageTransition } from '../components/motion/PageTransition';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await api.submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setIsSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => {
        setIsSent(false);
      }, 5000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="pt-28 pb-24 bg-[#090A0E] text-[#F4F0E8] min-h-screen selection:bg-[#D4AF37]/30 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-16">
          <div className="hidden lg:flex absolute -right-20 -top-4 w-24 h-24 rounded-full border border-[#D4AF37]/30 bg-[#12141C] items-center justify-center p-1.5 animate-spin-slow pointer-events-none shadow-xl">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#E5B869] font-mono text-[8px] uppercase tracking-[0.25em]">
              <path id="circlePathContact" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathContact" startOffset="0%">
                  FARZI CAFÉ · CONCIERGE LIAISON ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#E5B869] text-xs font-bold">✦</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#12141C] text-[#E5B869] text-[10px] font-mono uppercase tracking-[0.25em] mb-4 shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONTACT & PRIVATE ENCLAVE RESERVATIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-[#F4F0E8] tracking-tight uppercase mb-4">
            CONNECT WITH <span className="gold-text-gradient">FARZI</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            For private culinary bookings, corporate receptions, or press inquiries, our hospitality brigade is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Contact Info & Hours */}
          <div className="space-y-8">
            <div className="bg-[#12141C] border border-[#D4AF37]/25 rounded-3xl p-8 space-y-6 shadow-2xl">
              <h3 className="font-serif font-black text-xl text-[#F4F0E8]">
                The Address & Concierge
              </h3>

              <div className="space-y-5 text-xs text-neutral-300 font-light">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#181B26] text-[#E5B869] border border-white/10 flex-shrink-0 shadow-md">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-0.5">Location</h4>
                    <p className="leading-relaxed text-neutral-400">Level 2, High Street Galleria, Connaught Place, New Delhi 110001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#181B26] text-[#E5B869] border border-white/10 flex-shrink-0 shadow-md">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-0.5">Direct Telephones</h4>
                    <p className="text-neutral-400">+91 11 4352 8888 • +91 98100 12345 (Concierge WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#181B26] text-[#E5B869] border border-white/10 flex-shrink-0 shadow-md">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-0.5">Electronic Inquiries</h4>
                    <p className="text-neutral-400">concierge@farzi.demo • events@farzirestaurant.demo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-white/10">
                  <div className="p-2.5 rounded-xl bg-[#181B26] text-[#E5B869] border border-white/10 flex-shrink-0 shadow-md">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-0.5">Service Hours</h4>
                    <p className="text-[11px] text-neutral-400">Mon – Thu: 12:00 PM – 3:30 PM & 7:00 PM – 11:30 PM</p>
                    <p className="text-[11px] text-neutral-400">Fri – Sun: 12:00 PM – 4:00 PM & 7:00 PM – 12:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Responsive Map */}
            <div className="bg-[#12141C] border border-white/10 rounded-3xl overflow-hidden h-72 shadow-2xl">
              <iframe
                title="Farzi Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9961294657155!2d77.2177215!3d28.6322303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b1234567%3A0x123456789abcdef!2sConnaught%20Place!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Electronic Form */}
          <div className="bg-[#12141C] border border-[#D4AF37]/25 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h3 className="font-serif font-black text-xl text-[#F4F0E8] mb-2">
              Send a Dispatch
            </h3>
            <p className="text-xs text-neutral-400 font-light mb-6">
              Our guest relations director will acknowledge your query within two hours.
            </p>

            {isSent && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Your message has been received by the Farzi Concierge desk.</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1.5 font-semibold">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Zorawar Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1.5 font-semibold">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="zorawar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1.5 font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Private Tasting / Chef's Table"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block mb-1.5 font-semibold">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Kindly specify your requirements, dietary preferences, or party details..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E5B869] hover:to-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer shadow-[#D4AF37]/20"
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Concierge</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

      </div>
    </PageTransition>
  );
};

export default ContactPage;
