'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/menu/HeroSection';
import MenuCategoryTabs from '@/components/menu/MenuCategoryTabs';
import MenuFilterBar from '@/components/menu/MenuFilterBar';
import MenuItemCard from '@/components/menu/MenuItemCard';
import CustomPizzaBuilderModal from '@/components/customizer/CustomPizzaBuilderModal';
import HearthVideoShowcase from '@/components/media/HearthVideoShowcase';
import EmberSocietyVIP from '@/components/layout/EmberSocietyVIP';
import { MenuItem, CustomIngredient } from '@/lib/types';
import { Sparkles, Flame, Clock, Award, PackageCheck, Box } from 'lucide-react';

export default function HomePage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<CustomIngredient[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Customizer
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customizerOpen, setCustomizerOpen] = useState(false);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (data.items) {
          setItems(data.items);
        }
        if (data.ingredients) {
          setIngredients(data.ingredients);
        }
      } catch (e) {
        console.error('Failed to load menu', e);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  // Filter items logic
  const filteredItems = items.filter((item) => {
    // 1. Category
    if (activeCategory !== 'ALL' && item.category !== activeCategory) {
      return false;
    }
    // 2. Dietary Tag
    if (selectedTag) {
      const badges = item.badges ? item.badges.split(',').map((b) => b.trim()) : [];
      if (!badges.includes(selectedTag)) {
        return false;
      }
    }
    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-12">
      
      {/* 1. Hero Banner with Embedded Live Wood-Fired Video */}
      <HeroSection onOpenCustomizer={() => setCustomizerOpen(true)} />

      {/* 2. Embedded Video Showcase: The Hearth In Motion */}
      <HearthVideoShowcase />

      {/* 3. Custom Pizza Configurator Banner Callout */}
      <section id="custom-builder" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-r from-ember-950/80 via-charcoal-900 to-amber-950/70 border border-amber-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Dough Lab
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-cream-100">
              Build Your Own Wood-Fired Masterpiece
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Step into the pizzaiolo's shoes. Pick your size, hand-crafted crust, base sauces, artisan cheeses, and fire-roasted charcuterie with live dynamic pricing.
            </p>
          </div>

          <button
            onClick={() => setCustomizerOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-ember-900/40 transition-all flex items-center gap-2 active:scale-95 flex-shrink-0"
          >
            <Flame className="w-4 h-4 fill-white" />
            <span>Launch Pizza Configurator</span>
          </button>
        </div>
      </section>

      {/* 4. Main Menu Explorer with Pizzas In Kraft Boxes */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-4">
        
        {/* Category Heading & Box Notice */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-ember-500 uppercase mb-1">
              <Box className="w-4 h-4 text-amber-400" />
              <span>Oven-Fresh Kraft Box Selections</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-cream-100 tracking-tight">
              Our Artisanal Wood-Fired Menu
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Every pie is served piping hot in an authentic ventilated kraft pizza box lined with greaseproof parchment. Click any box to customize crust, size, or toppings!
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span>Showing {filteredItems.length} boxed delicacies</span>
          </div>
        </div>

        {/* Category Tabs */}
        <MenuCategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onOpenCustomizer={() => setCustomizerOpen(true)}
        />

        {/* Search & Dietary Filters */}
        <MenuFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        {/* Items Grid — Each Pizza in an authentic Kraft Pizza Box with details below */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-ember-600/20 text-ember-500 border border-ember-500/30 flex items-center justify-center mx-auto animate-spin">
              <Flame className="w-5 h-5" />
            </div>
            <p className="font-serif text-sm text-zinc-400">Firing up the brick oven menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-charcoal-900/50 rounded-3xl border border-zinc-800 p-8">
            <Flame className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-cream-100">No matching creations found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your dietary filter or search query to find your ideal wood-fired dish.
            </p>
            <button
              onClick={() => {
                setActiveCategory('ALL');
                setSelectedTag(null);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </section>

      {/* 5. VIP Newsletter Club (The Ember Society) */}
      <EmberSocietyVIP />

      {/* 6. Artisanal Heritage & Oven Story Featurettes */}
      <section className="bg-charcoal-950 border-t border-zinc-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold tracking-widest text-amber-500 uppercase">
              The Woodsmoke Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-cream-100">
              Why 900° Makes All The Difference
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Standard commercial ovens bake for 12 minutes at 500°, drying out the crust. Our hand-built refractory brick hearth cooks in 90 seconds, flash-steaming the dough so the inside stays pillowy while the rim blisters crisp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-charcoal-900 border border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-ember-900/30 border border-ember-600/30 flex items-center justify-center text-ember-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-100">
                72-Hour Cold Ferment
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We naturally leaven Italian Caputo 00 flour with wild sourdough culture, breaking down starches for effortless digestion and complex nutty flavors.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-charcoal-900 border border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-900/30 border border-amber-600/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-100">
                Volcanic San Marzano
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Grown strictly in the rich volcanic ash plains around Mount Vesuvius. Naturally sweet, low acidity, pure sun-drenched Italian terroir in every spoon.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-charcoal-900 border border-zinc-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/30 border border-emerald-600/30 flex items-center justify-center text-emerald-400">
                <Flame className="w-6 h-6 fill-emerald-500" />
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-100">
                Seasoned White Oak Hardwood
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We burn only sustainable kiln-dried white oak cords that burn hot and clean, imparting a subtle sweet woodsmoke aroma unique to authentic hearth craft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customizer Modal */}
      <CustomPizzaBuilderModal
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
        availableIngredients={ingredients}
      />

    </div>
  );
}
