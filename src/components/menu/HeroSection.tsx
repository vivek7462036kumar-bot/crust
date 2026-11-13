'use client';

import React, { useState } from 'react';
import { Flame, Sparkles, Clock, ChevronRight, Video, Camera, Play } from 'lucide-react';

interface HeroSectionProps {
  onOpenCustomizer: () => void;
}

export default function HeroSection({ onOpenCustomizer }: HeroSectionProps) {
  const [viewMode, setViewMode] = useState<'VIDEO' | 'PHOTO'>('VIDEO');

  return (
    <section className="relative overflow-hidden bg-charcoal-950 pt-10 pb-16 sm:pb-20 border-b border-zinc-800/80">
      
      {/* Background glow & subtle ambient hearth lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-ember-600/20 via-amber-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 right-10 w-72 h-72 bg-ember-700/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Live Hearth Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-ember-600/30 text-xs font-semibold text-ember-400 shadow-lg shadow-ember-950">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ember-500"></span>
              </span>
              <span>LIVE HEARTH TEMPERATURE: 900°F</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">Taking Orders</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-cream-100 tracking-tight leading-[1.1]">
              Charred by Fire.{' '}
              <span className="text-gradient-ember block sm:inline">
                Perfected by Time.
              </span>
            </h1>

            {/* Artisanal Description */}
            <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Every pie is hand-stretched from our 72-hour cold-fermented sourdough, topped with volcanic San Marzano D.O.P. tomatoes and creamy buffalo mozzarella, then blistered with white oak embers in 90 seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenCustomizer}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-ember-600 via-ember-500 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-bold text-base shadow-xl shadow-ember-700/30 flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all group"
              >
                <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>Build Your Own Artisan Pie</span>
                <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#menu"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-cream-100 font-semibold text-base border border-zinc-700/80 transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Boxed Pies</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-ember-900/30 border border-ember-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Flame className="w-4 h-4 text-ember-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cream-100">72-Hr Dough</h4>
                  <p className="text-[11px] text-zinc-400">Naturally Leavened</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-900/30 border border-amber-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cream-100">D.O.P. Certified</h4>
                  <p className="text-[11px] text-zinc-400">San Marzano & Fior</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-900/30 border border-emerald-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cream-100">Fast Delivery</h4>
                  <p className="text-[11px] text-zinc-400">Hot Insulated Box</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Embedded Pizza Video & Showcase Player */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl p-1 bg-gradient-to-b from-ember-500/40 via-zinc-800/50 to-zinc-900/80 shadow-2xl">
              <div className="rounded-[22px] overflow-hidden bg-charcoal-900 border border-zinc-800/80 relative">
                
                {/* View Mode Toggle Header */}
                <div className="p-3 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono font-bold text-cream-100">OVEN IN ACTION</span>
                  </div>

                  <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                    <button
                      onClick={() => setViewMode('VIDEO')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                        viewMode === 'VIDEO'
                          ? 'bg-ember-600 text-white shadow'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Video className="w-3 h-3" />
                      <span>Live Video</span>
                    </button>
                    <button
                      onClick={() => setViewMode('PHOTO')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                        viewMode === 'PHOTO'
                          ? 'bg-ember-600 text-white shadow'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      <span>Photo</span>
                    </button>
                  </div>
                </div>

                {/* Display Area: Video or Photo */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-black">
                  {viewMode === 'VIDEO' ? (
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/1-SJGQ2HLp8?autoplay=1&mute=1&loop=1&playlist=1-SJGQ2HLp8&controls=0&modestbranding=1&playsinline=1&rel=0"
                      title="Wood-fired pizza baking in 900 degree oven"
                      className="w-full h-full border-0 absolute inset-0 pointer-events-auto"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80"
                      alt="The Ember Margherita"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  )}

                  {/* Gradient Overlay for bottom text */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-transparent pointer-events-none" />

                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between pointer-events-none z-10">
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-100 leading-tight">
                        The Ember Margherita
                      </h3>
                      <p className="text-[11px] text-zinc-300">
                        San Marzano D.O.P. • Buffalo Mozzarella • Wild Basil
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-400 block font-normal">Box Price</span>
                      <span className="text-xl font-black text-ember-400 font-sans">$16.00</span>
                    </div>
                  </div>
                </div>

                {/* Quick Info bar */}
                <div className="p-3 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
                    <Flame className="w-3.5 h-3.5 text-ember-500 fill-ember-500" />
                    White Oak 900°F
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[11px]">90-Sec Leopard Blister</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-emerald-400 font-semibold text-[11px]">Vegetarian</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
