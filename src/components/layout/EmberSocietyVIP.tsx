'use client';

import React, { useState } from 'react';
import { Flame, Sparkles, CheckCircle2, Copy, ArrowRight, Gift } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

export default function EmberSocietyVIP() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const { applyPromo, openCart } = useCartStore();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoCode(data.promoCode || 'EMBERSOCIETY15');
        setMessage(data.message);
        // Automatically apply promo to cart
        applyPromo({
          code: 'EMBERSOCIETY15',
          discountPercent: 15,
          discountAmount: 0,
          description: 'VIP Ember Society 15% Off',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (!promoCode) return;
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-ember-950/70 via-charcoal-900 to-amber-950/60 border border-ember-600/30 p-8 sm:p-12 shadow-2xl">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-ember-600/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>The Ember Society VIP Club</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-cream-100">
            Join Our Wood-Fired Inner Circle
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Subscribe to receive secret off-menu pie alerts, invitations to seasonal pizza tastings, and an instant <strong className="text-amber-400">15% discount</strong> on your next artisan order.
          </p>

          {promoCode ? (
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/40 text-xs space-y-2 animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{message}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="font-mono text-base font-extrabold px-3 py-1.5 rounded-lg bg-zinc-900 text-amber-300 border border-amber-500/40 tracking-wider">
                  {promoCode}
                </span>
                <button
                  onClick={copyCode}
                  className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={openCart}
                  className="px-3 py-2 rounded-lg bg-ember-600 hover:bg-ember-500 text-white font-bold transition-colors ml-auto"
                >
                  View in Cart ➔
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email for 15% off..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-ember-900/40 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>{loading ? 'Joining...' : 'Unlock 15% Discount'}</span>
              </button>
            </form>
          )}

          <p className="text-[11px] text-zinc-500">
            No spam, ever. Only hot sourdough news and seasonal menu launches.
          </p>
        </div>

      </div>
    </section>
  );
}

