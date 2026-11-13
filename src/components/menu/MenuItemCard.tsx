'use client';

import React, { useState } from 'react';
import { Plus, Check, Flame, Leaf, Sparkles, AlertCircle, Sliders } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { useCartStore } from '@/lib/store/cartStore';
import CustomizePizzaModal from '@/components/menu/CustomizePizzaModal';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);

  const badges = item.badges ? item.badges.split(',').map((b) => b.trim()).filter(Boolean) : [];
  const isPizza = item.category === 'PIZZA';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.inStock) return;

    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      isCustom: false,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <>
      <div
        onClick={() => item.inStock && isPizza && setShowCustomizer(true)}
        className={`group relative rounded-3xl bg-charcoal-900 border transition-all duration-300 flex flex-col overflow-hidden cursor-pointer ${
          item.inStock
            ? 'border-zinc-800 hover:border-ember-600/40 hover:shadow-2xl hover:shadow-ember-950/40'
            : 'border-zinc-800/50 opacity-80 cursor-not-allowed'
        }`}
      >
        {/* ============================================================ */}
        {/* 1. ARTISANAL WOOD-FIRED PIZZA BOX CONTAINER (TOP SECTION)   */}
        {/* ============================================================ */}
        <div className="relative p-3.5 bg-gradient-to-b from-[#2a1b14] via-[#1f130d] to-[#140b07] border-b border-[#3d271c] overflow-hidden">
          
          {/* Kraft Cardboard Box Shadow & Texture */}
          <div className="relative rounded-2xl bg-[#23160f] border-2 border-[#42291b] p-2.5 shadow-inner overflow-hidden">
            
            {/* Cardboard Box Top Stamped Flap / Brand Stamp */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-[#3b2316] text-[10px] tracking-widest text-[#a88267] font-mono uppercase">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
                <span>CRUST & EMBER BOX</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Cardboard Steam Vents */}
                <div className="flex gap-1" title="Steam Vents">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#120a06] border border-[#3b2316]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#120a06] border border-[#3b2316]" />
                </div>
                <span className="text-[#87654d] font-semibold">900° HEARTH</span>
              </div>
            </div>

            {/* Greaseproof Parchment Paper Liner (Inside Box) */}
            <div className="relative mt-2 rounded-xl bg-gradient-to-br from-[#faf4e6]/10 via-[#f4eee1]/5 to-transparent p-1.5 border border-[#4a2e1e]/60 shadow-lg">
              
              {/* Pizza Image Inside Box */}
              <div className="relative h-48 sm:h-52 w-full rounded-lg overflow-hidden bg-black/80 flex items-center justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                    item.inStock
                      ? 'group-hover:scale-110 group-hover:rotate-1'
                      : 'grayscale'
                  }`}
                  loading="lazy"
                />

                {/* Subtle inner box shadow for depth */}
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] pointer-events-none" />

                {/* Authentic Pizza Box Label Stamp (Diagonal corner tag) */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md border border-[#5c3a26] text-[10px] font-mono text-amber-200/90 shadow-md">
                  {item.baseSize || (isPizza ? '12" Hand-Tossed' : 'Artisan Order')}
                </div>

                {/* Sold Out Stamp Effect */}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="rotate-[-12deg] px-4 py-1.5 rounded-lg border-2 border-red-500/80 bg-red-950/90 text-red-300 text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> SOLD OUT TODAY
                    </div>
                  </div>
                )}
              </div>

              {/* Parchment Paper Pinking / Zig-Zag Bottom Trim Indicator */}
              <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-[#8a6a52] px-1">
                <span>★ White Oak Fired</span>
                <span>72-Hr Sourdough ★</span>
              </div>

            </div>

            {/* Cardboard Box Corner Notch Indicators */}
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-charcoal-900 border-t border-r border-[#42291b] rounded-tr" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-charcoal-900 border-t border-l border-[#42291b] rounded-tl" />
          </div>

        </div>

        {/* ============================================================ */}
        {/* 2. PIZZA DETAILS BELOW BOX (NAME, DESCRIPTION, BADGES, PRICE)*/}
        {/* ============================================================ */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-charcoal-900">
          
          <div className="space-y-2">
            
            {/* Dietary & Chef Badges */}
            <div className="flex flex-wrap gap-1.5">
              {badges.map((badge) => {
                if (badge === 'VEGETARIAN') {
                  return (
                    <span
                      key={badge}
                      className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-800/50 flex items-center gap-1"
                    >
                      <Leaf className="w-2.5 h-2.5" /> Vegetarian
                    </span>
                  );
                }
                if (badge === 'VEGAN') {
                  return (
                    <span
                      key={badge}
                      className="px-2 py-0.5 rounded-md bg-green-950/80 text-green-400 text-[10px] font-bold border border-green-800/50 flex items-center gap-1"
                    >
                      <Leaf className="w-2.5 h-2.5" /> 100% Plant-Based
                    </span>
                  );
                }
                if (badge === 'SPICY') {
                  return (
                    <span
                      key={badge}
                      className="px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-400 text-[10px] font-bold border border-rose-800/50 flex items-center gap-1"
                    >
                      <Flame className="w-2.5 h-2.5" /> Wood-Fired Spicy
                    </span>
                  );
                }
                if (badge === 'CHEF_SPECIAL') {
                  return (
                    <span
                      key={badge}
                      className="px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-800/50 flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5" /> Pizzaiolo Masterpiece
                    </span>
                  );
                }
                return null;
              })}
            </div>

            {/* Pizza Title */}
            <h3 className="font-serif text-xl font-bold text-cream-100 group-hover:text-ember-400 transition-colors leading-snug">
              {item.name}
            </h3>

            {/* Detailed Recipe Description */}
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
              {item.description}
            </p>

          </div>

          {/* Pricing & Add to Cart Controls */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-bold">
                Box Price
              </span>
              <span className="text-2xl font-black font-sans text-ember-400">
                ${item.price.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {item.inStock ? (
                <>
                  {isPizza && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCustomizer(true);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/80 transition-all flex items-center gap-1"
                      title="Customize crust, size & extra toppings"
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Customize</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                      added
                        ? 'bg-emerald-600 text-white shadow-emerald-950/50'
                        : 'bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white shadow-ember-900/40 hover:shadow-lg'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Boxed!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Box</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-zinc-800"
                >
                  Sold Out
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Signature Pizza Customizer Modal */}
      {isPizza && (
        <CustomizePizzaModal
          item={item}
          isOpen={showCustomizer}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </>
  );
}
