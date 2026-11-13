'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, ShoppingBag, Clock, ShieldCheck, Sparkles, Calendar, Search } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

export default function Navbar() {
  const { openCart, getItemCount, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;
  const subtotal = mounted ? getSubtotal() : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-charcoal-950/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Artisanal Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ember-500 via-ember-600 to-amber-600 flex items-center justify-center shadow-lg shadow-ember-600/30 group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-7 h-7 text-white fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-wider font-extrabold text-2xl text-cream-100 group-hover:text-ember-400 transition-colors">
                  CRUST & EMBER
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-ember-600/20 text-ember-400 border border-ember-500/30 uppercase tracking-widest font-semibold hidden sm:inline-block">
                  Hearth 900°
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans tracking-wide">
                Artisanal Wood-Fired Pizzeria
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <Link
              href="/#menu"
              className="hover:text-ember-400 transition-colors py-1 hover:border-b-2 hover:border-ember-500"
            >
              Boxed Menu
            </Link>
            <Link
              href="/#custom-builder"
              className="flex items-center gap-1 text-ember-400 hover:text-ember-300 transition-colors py-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Build Your Own
            </Link>
            <Link
              href="/reserve"
              className="flex items-center gap-1 hover:text-amber-300 transition-colors py-1"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Book Table
            </Link>
            <Link
              href="/orders"
              className="flex items-center gap-1 hover:text-zinc-200 transition-colors py-1"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              Track Order
            </Link>
            <Link
              href="/story"
              className="hover:text-zinc-200 transition-colors py-1"
            >
              Our Story
            </Link>
            <Link
              href="/contact"
              className="hover:text-zinc-200 transition-colors py-1"
            >
              Catering
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors py-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin
            </Link>
          </nav>

          {/* Right Section: Live Status & Cart Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Live Oven Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-emerald-400">900° Oven Ready</span>
              <span className="text-zinc-600 hidden md:inline">•</span>
              <span className="text-zinc-400 hidden md:flex items-center gap-1">
                <Clock className="w-3 h-3" /> 20-25 min
              </span>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-3 bg-gradient-to-r from-ember-600 to-ember-700 hover:from-ember-500 hover:to-ember-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-ember-700/25 active:scale-95 transition-all"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-charcoal-950 text-ember-400 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-ember-500 animate-in zoom-in-50">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs text-ember-200 font-normal leading-tight">My Feast</div>
                <div className="text-sm font-bold leading-tight">
                  ${subtotal.toFixed(2)}
                </div>
              </div>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
