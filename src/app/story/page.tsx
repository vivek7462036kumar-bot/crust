import React from 'react';
import Link from 'next/link';
import { Flame, Clock, Award, Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Narrative */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-600/20 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 fill-ember-400" />
          <span>The Woodsmoke Heritage</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold text-cream-100 leading-tight">
          Where Ancient Craft Meets 900° Fire
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
          Founded on the unyielding belief that extraordinary pizza cannot be hurried. Born in Naples, perfected over white oak embers.
        </p>
      </div>

      {/* 3 Pillars of Artisan Craft */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Pillar 1 */}
        <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-ember-900/30 border border-ember-600/30 flex items-center justify-center text-ember-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-cream-100">
            72-Hour Sourdough Ferment
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            We leaven Italian Caputo Tipo 00 flour with wild sourdough mother culture started in 2021. Cold-fermented for 72 full hours, complex sugars break down naturally, resulting in a cloud-like digestible crumb with deep nutty complexity.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-900/30 border border-amber-600/30 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-cream-100">
            Volcanic Terroir Tomatoes
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Our red sauce uses only authentic D.O.P. certified San Marzano plum tomatoes grown in the volcanic mineral ash plains below Mount Vesuvius. Hand-crushed with sea salt and fresh wild oregano, never pasteurized or sweetened.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-900/30 border border-emerald-600/30 flex items-center justify-center text-emerald-400">
            <Flame className="w-6 h-6 fill-emerald-500" />
          </div>
          <h3 className="font-serif text-xl font-bold text-cream-100">
            900° White Oak Embers
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Our custom dome oven is constructed from refractory volcanic clay bricks that trap radiant heat up to 900°F. Sourced from sustainably managed kiln-dried white oak cords, our oven bakes each pie to leopard-blistered perfection in 90 seconds.
          </p>
        </div>

      </div>

      {/* Meet the Oven CTA */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif text-2xl font-bold text-cream-100">
            Taste the 900° Difference Today
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Order a freshly boxed artisan pie delivered hot, or reserve a front-row seat by the oven.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#menu"
            className="px-6 py-3 rounded-xl bg-ember-600 hover:bg-ember-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Explore Menu
          </Link>
          <Link
            href="/reserve"
            className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-colors"
          >
            Reserve a Table
          </Link>
        </div>
      </div>

    </div>
  );
}

