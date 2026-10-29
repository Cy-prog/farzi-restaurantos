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
    <PageTransition className="pt-28 pb-24 bg-[#FAF9F5] text-[#12141A] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-16">
          <div className="hidden lg:flex absolute -right-20 -top-4 w-24 h-24 rounded-full border border-black/15 items-center justify-center p-1.5 animate-spin-slow pointer-events-none opacity-80">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#D4AF37] font-mono text-[8px] uppercase tracking-[0.25em]">
              <path id="circlePathContact" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text>
                <textPath href="#circlePathContact" startOffset="0%">
                  FARZI CAFÉ · CONCIERGE LIAISON ·
                </textPath>
              </text>
            </svg>
            <span className="absolute text-[#D4AF37] text-xs">✦</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 bg-white text-[#D4AF37] text-[10px] font-mono uppercase tracking-[0.25em] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CONTACT & PRIVATE ENCLAVE RESERVATIONS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black text-black tracking-tight uppercase mb-4">
            CONNECT WITH <span className="text-stroke">FARZI</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
            For private culinary bookings, corporate receptions, or press inquiries, our hospitality brigade is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Contact Info & Hours */}
          <div className="space-y-8">
            <div className="bg-white border border-black/10 rounded-3xl p-8 space-y-6 shadow-xl">
              <h3 className="font-serif font-black text-xl text-black">
                The Address & Concierge
              </h3>

              <div className="space-y-5 text-xs text-neutral-700 font-light">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#FAF9F5] text-[#D4AF37] border border-black/10 flex-shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-0.5">Location</h4>
                    <p className="leading-relaxed">Level 2, High Street Galleria, Connaught Place, New Delhi 110001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#FAF9F5] text-[#D4AF37] border border-black/10 flex-shrink-0 shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-0.5">Direct Telephones</h4>
                    <p>+91 11 4352 8888 • +91 98100 12345 (Concierge WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#FAF9F5] text-[#D4AF37] border border-black/10 flex-shrink-0 shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-0.5">Electronic Inquiries</h4>
                    <p>concierge@farzi.demo • events@farzirestaurant.demo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-black/10">
                  <div className="p-2.5 rounded-xl bg-[#FAF9F5] text-[#D4AF37] border border-black/10 flex-shrink-0 shadow-sm">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-0.5">Service Hours</h4>
                    <p className="text-[11px] text-neutral-600">Mon – Thu: 12:00 PM – 3:30 PM & 7:00 PM – 11:30 PM</p>
                    <p className="text-[11px] text-neutral-600">Fri – Sun: 12:00 PM – 4:00 PM & 7:00 PM – 12:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Responsive Map */}
            <div className="bg-white border border-black/10 rounded-3xl overflow-hidden h-72 shadow-xl">
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

          {/* Right: Message Inquiry Form */}
          <div className="bg-white border border-black/10 rounded-3xl p-8 sm:p-10 shadow-xl">
            <h3 className="font-serif font-black text-2xl text-black mb-2">
              Send an Inquiry
            </h3>
            <p className="text-xs text-neutral-600 mb-6 font-light">
              Our hospitality team responds within 2 business hours.
            </p>

            {isSent ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-black">Inquiry Transmitted!</h4>
                <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                  Thank you. Our guest relations manager will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                    {errorMessage}
                  </p>
                )}

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zorawar Roy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="zorawar@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Private Tasting / Enclave Reservation"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1.5 font-semibold">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your requested date, guest count, or bespoke dining requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-black/15 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-black hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Transmitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </PageTransition>
  );
};

export default ContactPage;
