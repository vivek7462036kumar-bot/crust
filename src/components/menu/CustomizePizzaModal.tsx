'use client';

import React, { useState, useMemo } from 'react';
import { X, Sparkles, Flame, Plus, Check, ShoppingBag, Box } from 'lucide-react';
import { MenuItem } from '@/lib/types';
import { useCartStore } from '@/lib/store/cartStore';

interface CustomizePizzaModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomizePizzaModal({
  item,
  isOpen,
  onClose,
}: CustomizePizzaModalProps) {
  const { addItem } = useCartStore();

  const [size, setSize] = useState<'10" Personal' | '12" Medium' | '14" Large' | '16" Party'>('12" Medium');
  const [crust, setCrust] = useState<string>('Classic Wood-Fired Hand-Tossed');
  const [extraToppings, setExtraToppings] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const sizePricing: Record<string, number> = {
    '10" Personal': -3.0,
    '12" Medium': 0.0,
    '14" Large': 4.0,
    '16" Party': 8.0,
  };

  const crustOptions = [
    { name: 'Classic Wood-Fired Hand-Tossed', price: 0.0, desc: '72-hr fermented bubbly leopard rim' },
    { name: 'Thin & Crispy Roman Style', price: 0.0, desc: 'Extra light cracker-style crisp' },
    { name: 'Fontina & Herb Stuffed Crust', price: 3.5, desc: 'Stuffed with molten aged fontina' },
    { name: 'Gluten-Free Cauliflower Crust', price: 4.0, desc: 'Certified gluten-free blend' },
  ];

  const popularAddOns = [
    { name: 'Extra Buffalo Mozzarella', price: 2.0 },
    { name: 'Hot Wildflower Honey Drizzle', price: 1.5 },
    { name: 'White Truffle Infused EVOO', price: 1.75 },
    { name: 'Whole Creamy Burrata (Torn)', price: 3.5 },
    { name: 'Prosciutto di Parma (Post-Bake)', price: 3.5 },
    { name: 'Roasted Wild Garlic Cloves', price: 1.25 },
    { name: 'Pickled Fiery Jalapeños', price: 1.0 },
    { name: 'Aged Parmigiano Shavings', price: 1.5 },
  ];

  const toggleAddOn = (name: string) => {
    setExtraToppings((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    const base = item.price;
    const sizeDelta = sizePricing[size] || 0;
    const crustObj = crustOptions.find((c) => c.name === crust);
    const crustDelta = crustObj ? crustObj.price : 0;
    let addOnsDelta = 0;
    extraToppings.forEach((name) => {
      const match = popularAddOns.find((a) => a.name === name);
      if (match) addOnsDelta += match.price;
    });
    return Math.max(0, Math.round((base + sizeDelta + crustDelta + addOnsDelta) * 100) / 100);
  }, [item, size, crust, extraToppings]);

  if (!isOpen || !item) return null;

  const handleAddCustomized = () => {
    addItem({
      menuItemId: item.id,
      name: `${item.name} (${size.split(' ')[0]})`,
      price: totalPrice,
      quantity: 1,
      imageUrl: item.imageUrl,
      isCustom: true,
      customDetails: {
        size,
        crust,
        sauce: 'Chef Signature Recipe',
        cheese: 'Fior di Latte / Buffalo Mozzarella',
        toppings: extraToppings,
      },
      itemNotes: specialInstructions.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 relative z-10">
        <div className="w-full max-w-2xl bg-charcoal-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 bg-charcoal-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-amber-600 flex items-center justify-center shadow-lg shadow-ember-900/30">
                <Box className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Customize Your Pizza Box
                </h3>
                <p className="text-xs text-zinc-400">
                  {item.name} • Baked in 900° wood hearth
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* 1. Size Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                1. Select Box Size
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: '10" Personal', diff: '-$3.00', desc: '6 Slices' },
                  { name: '12" Medium', diff: 'Base', desc: '8 Slices' },
                  { name: '14" Large', diff: '+$4.00', desc: '10 Slices' },
                  { name: '16" Party', diff: '+$8.00', desc: '12 Slices' },
                ].map((sz) => (
                  <button
                    key={sz.name}
                    onClick={() => setSize(sz.name as any)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      size === sz.name
                        ? 'bg-ember-950/50 border-ember-500 ring-2 ring-ember-500/30 text-cream-100'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{sz.name}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">{sz.desc}</span>
                    <span className="text-[10px] font-mono text-amber-400 block mt-1 font-semibold">{sz.diff}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Crust Style */}
            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                2. Sourdough Crust Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {crustOptions.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setCrust(c.name)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      crust === c.name
                        ? 'bg-ember-950/50 border-ember-500 ring-2 ring-ember-500/30'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cream-100">{c.name}</span>
                      <span className="font-mono text-[10px] font-semibold text-zinc-400">
                        {c.price === 0 ? 'Included' : `+$${c.price.toFixed(2)}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Extra Artisanal Finishes & Add-Ons */}
            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                3. Add Extra Wood-Fired Toppings & Finishes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {popularAddOns.map((ao) => {
                  const isChecked = extraToppings.includes(ao.name);
                  return (
                    <button
                      key={ao.name}
                      onClick={() => toggleAddOn(ao.name)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-amber-950/40 border-amber-500 text-cream-100'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                          isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-zinc-700'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{ao.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">+${ao.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Chef Special Instructions */}
            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Baking Notes for Pizzaiolo (Optional)
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Extra well-done char, light sauce, cut into squares..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-zinc-800 bg-charcoal-950 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase font-bold">Customized Box Total</span>
              <span className="text-2xl font-black font-sans text-ember-400">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleAddCustomized}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-ember-900/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Custom Box to Feast (${totalPrice.toFixed(2)})</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

