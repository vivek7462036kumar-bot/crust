'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Calendar,
  Clock,
  Users,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function ReservationPage() {
  const [partySize, setPartySize] = useState<number>(2);
  const [date, setDate] = useState<string>('Tonight');
  const [timeSlot, setTimeSlot] = useState<string>('7:30 PM');
  const [seatingArea, setSeatingArea] = useState<'HEARTH_SIDE' | 'PATIO' | 'MAIN_DINING'>('HEARTH_SIDE');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<any>(null);
  const [error, setError] = useState('');

  const timeSlots = [
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
  ];

  const seatingOptions = [
    {
      id: 'HEARTH_SIDE',
      title: 'Hearth-Side Front Row',
      desc: 'Direct view of the 900° wood brick oven & pizzaiolos tossing dough.',
      icon: Flame,
      tag: 'Most Popular',
    },
    {
      id: 'PATIO',
      title: 'White Oak Heated Patio',
      desc: 'Al fresco dining under ambient string lights and roaring fire pits.',
      icon: Sparkles,
      tag: 'Outdoor Vibe',
    },
    {
      id: 'MAIN_DINING',
      title: 'Intimate Dining Room',
      desc: 'Candlelit tables crafted from 100-year-old reclaimed oak timber.',
      icon: Users,
      tag: 'Cozy & Romantic',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your name, email, and contact phone number.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          date,
          timeSlot,
          partySize,
          seatingArea,
          notes,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedReservation(data.reservation);
      } else {
        setError(data.error || 'Failed to complete reservation.');
      }
    } catch (err: any) {
      setError('An error occurred while confirming your reservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-600/20 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 fill-ember-400" />
          <span>Dine At The Pizzeria</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-cream-100">
          Reserve Your Hearth Table
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Immerse yourself in the aroma of burning white oak and blistered Caputo sourdough. We hold tables for 15 minutes past reservation time.
        </p>
      </div>

      {confirmedReservation ? (
        /* Confirmed Reservation Pass Card */
        <div className="max-w-xl mx-auto rounded-3xl bg-charcoal-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="font-mono text-xs px-3 py-1 rounded bg-zinc-800 text-amber-300 font-bold border border-zinc-700">
              {confirmedReservation.id}
            </span>
            <h2 className="font-serif text-2xl font-bold text-cream-100 mt-2">
              Table Reserved, {confirmedReservation.customerName}!
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Confirmation sent to <span className="text-cream-100">{confirmedReservation.customerEmail}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-2 text-left">
            <div className="flex justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-500">Party Size:</span>
              <span className="font-bold text-cream-100">{confirmedReservation.partySize} Guests</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-500">Date & Time:</span>
              <span className="font-bold text-ember-400 font-mono">{confirmedReservation.date} at {confirmedReservation.timeSlot}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-500">Seating Area:</span>
              <span className="font-bold text-cream-100">{confirmedReservation.seatingArea.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-zinc-500">Location:</span>
              <span className="text-zinc-300 font-medium">42 Hearthstone Way, Artisan District</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-ember-600 hover:bg-ember-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Explore Menu Ahead of Time
            </Link>
            <button
              onClick={() => setConfirmedReservation(null)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        /* Reservation Booking Form */
        <div className="max-w-3xl mx-auto rounded-3xl bg-charcoal-900 border border-zinc-800 p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Party Size & Date */}
            <div>
              <h3 className="font-serif text-base font-bold text-cream-100 border-b border-zinc-800 pb-2 mb-3">
                1. Party Size & Desired Date
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Number of Guests
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6, '7+'].map((sz) => {
                      const num = typeof sz === 'number' ? sz : 8;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setPartySize(num)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                            partySize === num
                              ? 'bg-ember-600 border-ember-500 text-white shadow'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Reservation Date
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  >
                    <option value="Tonight">Tonight</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="Friday Night">This Friday Night</option>
                    <option value="Saturday Night">This Saturday Night</option>
                    <option value="Sunday Lunch">Sunday Hearth Lunch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Time Slot */}
            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                2. Select Arrival Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((ts) => (
                  <button
                    key={ts}
                    type="button"
                    onClick={() => setTimeSlot(ts)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold font-mono transition-all ${
                      timeSlot === ts
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300 ring-1 ring-amber-500/30'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {ts}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Seating Preference */}
            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-400 mb-2">
                3. Choose Atmosphere & Seating Area
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {seatingOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = seatingArea === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSeatingArea(opt.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-ember-950/40 border-ember-500 text-cream-100 ring-1 ring-ember-500/30'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-ember-400' : 'text-zinc-500'}`} />
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                          {opt.tag}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-cream-100">{opt.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-snug">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Contact Details */}
            <div className="pt-2 border-t border-zinc-800">
              <h3 className="font-serif text-base font-bold text-cream-100 border-b border-zinc-800 pb-2 mb-3">
                4. Primary Guest Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sofia Bellini"
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
                    placeholder="sofia@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Celebration / Dietary Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Birthday dinner, high chair needed, anniversary..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-ember-600 via-ember-500 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-ember-900/40 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              <span>{loading ? 'Confirming Table...' : 'Confirm Table Reservation'}</span>
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

