'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Flame, Clock, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function OrderLookupPage() {
  const router = useRouter();
  const [orderIdInput, setOrderIdInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanId = orderIdInput.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter a valid Order ID (e.g. ORD-7821).');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${cleanId}`);
      if (res.ok) {
        router.push(`/orders/${cleanId}`);
      } else {
        setError(`Order ${cleanId} not found in our hearth logs. Please check the code on your receipt.`);
      }
    } catch (e) {
      setError('Error connecting to order server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-ember-600/20 text-ember-400 border border-ember-500/30 flex items-center justify-center mx-auto">
          <Flame className="w-6 h-6 fill-ember-400" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-cream-100">
          Track Your Wood-Fired Feast
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Watch our pizzaiolos stretch, sauce, and bake your order live from dough prep to doorstep delivery.
        </p>
      </div>

      <div className="max-w-md mx-auto bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <form onSubmit={handleLookup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Order Identifier (On Receipt / SMS)
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="e.g. ORD-7821"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3 py-3 text-sm font-mono text-cream-100 placeholder:text-zinc-600 focus:outline-none focus:border-ember-500"
              />
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-ember-900/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Checking Hearth Logs...' : 'Locate My Order'}</span>
          </button>
        </form>

        {/* Demo order quick links */}
        <div className="pt-4 border-t border-zinc-800 text-center space-y-2">
          <span className="text-[11px] text-zinc-500 block">Or jump to sample active orders:</span>
          <div className="flex justify-center gap-2">
            <Link
              href="/orders/ORD-7821"
              className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono text-ember-400 hover:border-ember-500 transition-colors"
            >
              ORD-7821 (Active Baking)
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

