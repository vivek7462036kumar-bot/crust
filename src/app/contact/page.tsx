'use client';

import React, { useState } from 'react';
import { Flame, Mail, Phone, MapPin, Send, CheckCircle2, Clock, Truck } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('CATERING');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Please provide your name, email, and inquiry details.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          inquiryType,
          subject: `${inquiryType} Request from ${name}`,
          message,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit inquiry.');
      }
    } catch (e) {
      setError('Error connecting to contact service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-600/20 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5" />
          <span>Mobile Oven Catering & Inquiries</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-cream-100">
          Get in Touch with Our Hearth Team
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Have a question about our sourdough, private events, or mobile wood-fired oven trailer catering? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-cream-100">
              The Pizzeria Hearth
            </h3>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-ember-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-cream-100 text-sm">Location</p>
                  <p className="text-zinc-400 mt-0.5">42 Hearthstone Way, Artisan District<br />New York, NY 10012</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-ember-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-cream-100 text-sm">Phone Orders & Takeout</p>
                  <p className="text-zinc-400 mt-0.5">(555) 789-WOOD (9663)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-ember-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-cream-100 text-sm">Email</p>
                  <p className="text-zinc-400 mt-0.5">ciao@crustandember.com</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs">
              <p className="font-bold text-cream-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-ember-400" /> Oven Operating Hours
              </p>
              <div className="text-zinc-400 space-y-1">
                <p>Mon - Thu: 11:30 AM - 10:00 PM</p>
                <p className="text-amber-400 font-semibold">Fri - Sat: 11:30 AM - 11:30 PM</p>
                <p>Sunday: 12:00 PM - 9:30 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Catering / Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {success ? (
              <div className="py-12 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-cream-100">
                  Message Dispatched to the Hearth!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                  Thank you, {name}. Our event coordinator will review your request and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Send a Catering or Event Inquiry
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  >
                    <option value="CATERING">Mobile Wood-Fired Pizza Trailer Catering</option>
                    <option value="PRIVATE_EVENT">Private Dining Room Buyout</option>
                    <option value="FEEDBACK">Customer Feedback & Chef Compliments</option>
                    <option value="GENERAL">General Inquiries</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Leonardo Bianchi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. leonardo@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-3388"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Event Details & Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your event date, approximate guest count, or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-ember-900/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Transmitting Request...' : 'Send Inquiry to Hearth Team'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

