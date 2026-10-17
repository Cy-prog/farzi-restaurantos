import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageTransition } from '../components/motion/PageTransition';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 4000);
  };

  return (
    <PageTransition className="pt-28 pb-24 bg-charcoal-950 text-ivory-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Concierge & Location</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-ivory-50 tracking-tight mb-4">
            Connect With Farzi
          </h1>
          <p className="text-sm sm:text-base text-ivory-300 font-light leading-relaxed">
            For private culinary bookings, corporate receptions, or feedback, our hospitality team is at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info & Hours */}
          <div className="space-y-8">
            <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-8 space-y-6">
              <h3 className="font-serif font-bold text-xl text-ivory-100">
                The Address & Concierge
              </h3>

              <div className="space-y-5 text-sm text-ivory-300 font-light">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-charcoal-850 text-gold-400 border border-charcoal-700 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory-100 mb-0.5">Location</h4>
                    <p className="leading-relaxed">Level 2, High Street Galleria, Connaught Place, New Delhi 110001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-charcoal-850 text-gold-400 border border-charcoal-700 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory-100 mb-0.5">Direct Telephones</h4>
                    <p>+91 11 4352 8888 • +91 98100 12345 (Concierge WhatsApp)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-charcoal-850 text-gold-400 border border-charcoal-700 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory-100 mb-0.5">Electronic Inquiries</h4>
                    <p>concierge@farzi.demo • events@farzirestaurant.demo</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-4 border-t border-charcoal-800">
                  <div className="p-2.5 rounded-xl bg-charcoal-850 text-gold-400 border border-charcoal-700 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ivory-100 mb-0.5">Service Hours</h4>
                    <p className="text-xs text-charcoal-400">Mon – Thu: 12:00 PM – 3:30 PM & 7:00 PM – 11:30 PM</p>
                    <p className="text-xs text-charcoal-400">Fri – Sun: 12:00 PM – 4:00 PM & 7:00 PM – 12:30 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Responsive Map */}
            <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl overflow-hidden h-72 shadow-lg">
              <iframe
                title="Farzi Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9961294657155!2d77.2177215!3d28.6322303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd37b1234567%3A0x123456789abcdef!2sConnaught%20Place!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(85%)' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Message Inquiry Form */}
          <div className="bg-charcoal-900 border border-charcoal-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h3 className="font-serif font-bold text-2xl text-ivory-100 mb-2">
              Send an Inquiry
            </h3>
            <p className="text-xs text-ivory-400 mb-6 font-light">
              Our hospitality team responds within 2 business hours.
            </p>

            {isSent ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-ivory-100">Inquiry Transmitted!</h4>
                <p className="text-xs text-ivory-300 max-w-xs mx-auto">
                  Thank you, {name}. Our guest relations manager will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gold-400 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohini Roy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gold-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rohini@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gold-400 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Private Event / Tasting Inquiry / Feedback"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gold-400 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How may our culinary team assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-sm text-ivory-100 focus:outline-none focus:border-gold-500/50"
                  />
                </div>

                <Button type="submit" variant="gold" size="md" className="w-full" icon={<Send className="w-4 h-4" />}>
                  Dispatch Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
