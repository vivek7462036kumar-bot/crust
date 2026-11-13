'use client';

import React, { useState, useMemo } from 'react';
import { X, Sparkles, Check, Flame, Plus, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import { CustomIngredient } from '@/lib/types';
import { useCartStore } from '@/lib/store/cartStore';

interface CustomPizzaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: CustomIngredient[];
}

export default function CustomPizzaBuilderModal({
  isOpen,
  onClose,
  availableIngredients,
}: CustomPizzaBuilderModalProps) {
  const { addItem } = useCartStore();

  // Fallback defaults if API hasn't loaded ingredients yet
  const sizes = useMemo(
    () => availableIngredients.filter((i) => i.category === 'SIZE'),
    [availableIngredients]
  );
  const crusts = useMemo(
    () => availableIngredients.filter((i) => i.category === 'CRUST'),
    [availableIngredients]
  );
  const sauces = useMemo(
    () => availableIngredients.filter((i) => i.category === 'SAUCE'),
    [availableIngredients]
  );
  const cheeses = useMemo(
    () => availableIngredients.filter((i) => i.category === 'CHEESE'),
    [availableIngredients]
  );
  const meats = useMemo(
    () => availableIngredients.filter((i) => i.category === 'TOPPING_MEAT'),
    [availableIngredients]
  );
  const veggies = useMemo(
    () => availableIngredients.filter((i) => i.category === 'TOPPING_VEG'),
    [availableIngredients]
  );
  const finishes = useMemo(
    () => availableIngredients.filter((i) => i.category === 'TOPPING_FINISH'),
    [availableIngredients]
  );

  // Configuration State
  const [selectedSize, setSelectedSize] = useState<string>('12" Medium');
  const [selectedCrust, setSelectedCrust] = useState<string>('Classic Wood-Fired Hand-Tossed');
  const [selectedSauce, setSelectedSauce] = useState<string>('San Marzano D.O.P. Tomato');
  const [selectedCheese, setSelectedCheese] = useState<string>('Fior di Latte Mozzarella');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([
    'Artisan Pepperoni',
    'Wood-Roasted Forest Mushrooms',
  ]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Fallback price maps if ingredients array is still initializing
  const sizeMap: Record<string, { price: number; multiplier: number; desc: string }> = {
    '10" Personal': { price: 11.0, multiplier: 0.8, desc: '6 Slices • Serves 1' },
    '12" Medium': { price: 14.0, multiplier: 1.0, desc: '8 Slices • Serves 2-3' },
    '14" Large': { price: 18.0, multiplier: 1.3, desc: '10 Slices • Serves 3-4' },
    '16" Party / Family': { price: 22.0, multiplier: 1.6, desc: '12 Slices • Serves 4-6' },
  };

  // Dynamic Price Calculation
  const calculatedPrice = useMemo(() => {
    // 1. Base price from Size
    const sizeObj = sizes.find((s) => s.name === selectedSize);
    const basePrice = sizeObj ? sizeObj.price : (sizeMap[selectedSize]?.price || 14.0);

    // 2. Crust premium
    const crustObj = crusts.find((c) => c.name === selectedCrust);
    const crustPrice = crustObj ? crustObj.price : 0;

    // 3. Sauce premium
    const sauceObj = sauces.find((s) => s.name === selectedSauce);
    const saucePrice = sauceObj ? sauceObj.price : 0;

    // 4. Cheese premium
    const cheeseObj = cheeses.find((c) => c.name === selectedCheese);
    const cheesePrice = cheeseObj ? cheeseObj.price : 0;

    // 5. Toppings sum
    let toppingsPrice = 0;
    const allToppings = [...meats, ...veggies, ...finishes];
    selectedToppings.forEach((tName) => {
      const found = allToppings.find((t) => t.name === tName);
      if (found) {
        toppingsPrice += found.price;
      } else {
        // Fallback default topping price
        toppingsPrice += 1.5;
      }
    });

    const total = basePrice + crustPrice + saucePrice + cheesePrice + toppingsPrice;
    return Math.round(total * 100) / 100;
  }, [selectedSize, selectedCrust, selectedSauce, selectedCheese, selectedToppings, sizes, crusts, sauces, cheeses, meats, veggies, finishes]);

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleAddToCart = () => {
    addItem({
      name: `Custom Wood-Fired Pie (${selectedSize.split(' ')[0]})`,
      price: calculatedPrice,
      quantity: 1,
      isCustom: true,
      customDetails: {
        size: selectedSize,
        crust: selectedCrust,
        sauce: selectedSauce,
        cheese: selectedCheese,
        toppings: selectedToppings,
      },
      itemNotes: specialInstructions.trim() || undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6 relative z-10">
        <div className="w-full max-w-4xl bg-charcoal-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-zinc-800 bg-charcoal-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ember-500 to-amber-600 flex items-center justify-center shadow-lg shadow-ember-600/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 flex items-center gap-2">
                  Artisan Pizza Configurator
                </h2>
                <p className="text-xs text-zinc-400">
                  Craft your custom wood-fired masterwork from our 72-hour dough & curated toppings
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close customizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="flex items-center border-b border-zinc-800 bg-zinc-950/70 overflow-x-auto px-4 sm:px-6">
            <button
              onClick={() => setStep(1)}
              className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                step === 1 ? 'border-ember-500 text-ember-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">1</span>
              Size & Crust
            </button>
            <button
              onClick={() => setStep(2)}
              className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                step === 2 ? 'border-ember-500 text-ember-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">2</span>
              Sauce & Cheese
            </button>
            <button
              onClick={() => setStep(3)}
              className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                step === 3 ? 'border-ember-500 text-ember-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">3</span>
              Toppings ({selectedToppings.length})
            </button>
            <button
              onClick={() => setStep(4)}
              className={`py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
                step === 4 ? 'border-ember-500 text-ember-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">4</span>
              Review & Bake
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* STEP 1: SIZE & CRUST */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in-50">
                {/* Size Selection */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2 mb-3">
                    <span className="text-ember-500">1.</span> Choose Hearth Size
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { name: '10" Personal', price: '$11.00', slices: '6 Slices', serves: 'Individual', inches: '10"' },
                      { name: '12" Medium', price: '$14.00', slices: '8 Slices', serves: '2-3 People', inches: '12"', popular: true },
                      { name: '14" Large', price: '$18.00', slices: '10 Slices', serves: '3-4 People', inches: '14"' },
                      { name: '16" Party / Family', price: '$22.00', slices: '12 Slices', serves: '4-6 People', inches: '16"' },
                    ].map((sz) => (
                      <button
                        key={sz.name}
                        onClick={() => setSelectedSize(sz.name)}
                        className={`p-4 rounded-2xl border text-left transition-all relative ${
                          selectedSize === sz.name
                            ? 'bg-ember-950/40 border-ember-500 ring-2 ring-ember-500/30'
                            : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                        }`}
                      >
                        {sz.popular && (
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-ember-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                            Most Popular
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-serif font-black text-amber-500/80">
                            {sz.inches}
                          </span>
                          <span className="text-sm font-bold text-ember-400">
                            {sz.price}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-cream-100 mt-2">{sz.name}</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">{sz.slices} • {sz.serves}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crust Selection */}
                <div className="pt-4 border-t border-zinc-800">
                  <h3 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2 mb-3">
                    <span className="text-ember-500">2.</span> Select Wood-Fired Crust
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'Classic Wood-Fired Hand-Tossed',
                        desc: 'Fermented 72 hrs. Airy, bubbly rim with signature leopard spotting.',
                        extra: '+$0.00',
                      },
                      {
                        name: 'Thin & Crispy Roman Style',
                        desc: 'Ultra-thin, light cracker-like crisp with rich olive oil finish.',
                        extra: '+$0.00',
                      },
                      {
                        name: 'Fontina & Herb Stuffed Crust',
                        desc: 'Crust folded over creamy aged fontina and garlic rosemary butter.',
                        extra: '+$3.50',
                      },
                      {
                        name: 'Gluten-Free Artisan Cauliflower Crust',
                        desc: 'Certified gluten-free dough made from cauliflower and almond flour.',
                        extra: '+$4.00',
                      },
                    ].map((cr) => (
                      <button
                        key={cr.name}
                        onClick={() => setSelectedCrust(cr.name)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          selectedCrust === cr.name
                            ? 'bg-ember-950/40 border-ember-500 ring-2 ring-ember-500/30'
                            : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-cream-100">{cr.name}</h4>
                          <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                            cr.extra === '+$0.00' ? 'bg-zinc-800 text-zinc-400' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {cr.extra}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{cr.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SAUCE & CHEESE */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in-50">
                {/* Sauce Selection */}
                <div>
                  <h3 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2 mb-3">
                    <span className="text-ember-500">3.</span> Choose Your Base Sauce
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'San Marzano D.O.P. Tomato',
                        desc: 'Crushed sweet Campania tomatoes, Sicilian sea salt, fresh oregano.',
                        price: 'Included',
                      },
                      {
                        name: 'Creamy Black Truffle Alfredo',
                        desc: 'Rich mascarpone, roasted garlic, cracked black pepper, shaved black truffle essence.',
                        price: '+$2.00',
                      },
                      {
                        name: 'Smoky Bourbon BBQ',
                        desc: 'Slow-simmered molasses, apple cider vinegar, charred woodsmoke hint.',
                        price: '+$1.00',
                      },
                      {
                        name: 'Fresh Basil & Pine Nut Pesto',
                        desc: 'Genovese basil, toasted pine nuts, extra virgin olive oil, Parmigiano.',
                        price: '+$1.50',
                      },
                    ].map((s) => (
                      <button
                        key={s.name}
                        onClick={() => setSelectedSauce(s.name)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          selectedSauce === s.name
                            ? 'bg-ember-950/40 border-ember-500 ring-2 ring-ember-500/30'
                            : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-cream-100">{s.name}</h4>
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {s.price}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cheese Selection */}
                <div className="pt-4 border-t border-zinc-800">
                  <h3 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2 mb-3">
                    <span className="text-ember-500">4.</span> Melted Hearth Cheese
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'Fior di Latte Mozzarella',
                        desc: 'Fresh whole milk mozzarella pulled daily, melts into golden pools.',
                        price: 'Included',
                      },
                      {
                        name: 'Double Layer Mozzarella',
                        desc: 'Extra 50% generous coverage for extra cheese pulls.',
                        price: '+$2.00',
                      },
                      {
                        name: 'Smoked Provolone & Fontina Blend',
                        desc: 'Aged alpine cheeses with a deep woodsmoke aroma.',
                        price: '+$2.50',
                      },
                      {
                        name: 'Artisan Cashew Vegan Mozzarella',
                        desc: 'Cultured cashew milk curd that stretches and browns naturally.',
                        price: '+$2.50',
                      },
                    ].map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedCheese(c.name)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          selectedCheese === c.name
                            ? 'bg-ember-950/40 border-ember-500 ring-2 ring-ember-500/30'
                            : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-cream-100">{c.name}</h4>
                          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {c.price}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{c.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: TOPPINGS */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in-50">
                {/* Meats */}
                <div>
                  <h3 className="font-serif text-base font-bold text-cream-100 flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-ember-500" /> Artisanal Meats & Charcuterie
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {[
                      { name: 'Artisan Pepperoni', price: '+$2.00' },
                      { name: 'Spicy Calabrian Soppressata', price: '+$2.50' },
                      { name: 'Sweet Italian Fennel Sausage', price: '+$2.00' },
                      { name: 'Wood-Roasted Chicken Breast', price: '+$2.50' },
                      { name: 'Smoked Crispy Bacon Lardons', price: '+$2.50' },
                      { name: 'Prosciutto di Parma (Post-Bake)', price: '+$3.50' },
                    ].map((m) => {
                      const isSelected = selectedToppings.includes(m.name);
                      return (
                        <button
                          key={m.name}
                          onClick={() => toggleTopping(m.name)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-ember-950/40 border-ember-500 text-cream-100'
                              : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-ember-600 border-ember-500 text-white' : 'border-zinc-600'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold">{m.name}</span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">{m.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Veggies */}
                <div className="pt-4 border-t border-zinc-800">
                  <h3 className="font-serif text-base font-bold text-cream-100 flex items-center gap-2 mb-3">
                    <span className="text-emerald-400">🌱</span> Fire-Roasted Vegetables & Herbs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {[
                      { name: 'Wood-Roasted Forest Mushrooms', price: '+$1.50' },
                      { name: 'Caramelized Sweet Vidalia Onions', price: '+$1.25' },
                      { name: 'Fire-Roasted Sweet Bell Peppers', price: '+$1.25' },
                      { name: 'Kalamata Black Olives', price: '+$1.25' },
                      { name: 'Pickled Fiery Jalapeños', price: '+$1.00' },
                      { name: 'Marinated Artichoke Hearts', price: '+$1.75' },
                      { name: 'Roasted Garlic Cloves', price: '+$1.25' },
                    ].map((v) => {
                      const isSelected = selectedToppings.includes(v.name);
                      return (
                        <button
                          key={v.name}
                          onClick={() => toggleTopping(v.name)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-ember-950/40 border-ember-500 text-cream-100'
                              : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-ember-600 border-ember-500 text-white' : 'border-zinc-600'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold">{v.name}</span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">{v.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Finishes */}
                <div className="pt-4 border-t border-zinc-800">
                  <h3 className="font-serif text-base font-bold text-cream-100 flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Post-Oven Artisan Finishes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {[
                      { name: 'Hot Wildflower Honey Drizzle', price: '+$1.50' },
                      { name: 'White Truffle Infused EVOO', price: '+$1.75' },
                      { name: 'Fresh Arugula & Lemon Zest', price: '+$1.25' },
                      { name: 'Aged Parmigiano Reggiano Shavings', price: '+$1.50' },
                      { name: 'Fresh Garden Sweet Basil', price: '+$0.75' },
                    ].map((f) => {
                      const isSelected = selectedToppings.includes(f.name);
                      return (
                        <button
                          key={f.name}
                          onClick={() => toggleTopping(f.name)}
                          className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-ember-950/40 border-ember-500 text-cream-100'
                              : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-ember-600 border-ember-500 text-white' : 'border-zinc-600'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold">{f.name}</span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">{f.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & INSTRUCTIONS */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in-50">
                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-cream-100 border-b border-zinc-800 pb-3 flex items-center justify-between">
                    <span>Recipe Breakdown</span>
                    <span className="text-ember-400 font-sans font-black text-xl">
                      ${calculatedPrice.toFixed(2)}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
                    <div>
                      <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">Size & Hearth</span>
                      <p className="font-bold text-sm text-cream-100 mt-0.5">{selectedSize}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">Dough Crust</span>
                      <p className="font-bold text-sm text-cream-100 mt-0.5">{selectedCrust}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">Sauce</span>
                      <p className="font-bold text-sm text-cream-100 mt-0.5">{selectedSauce}</p>
                    </div>
                    <div>
                      <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">Cheese Base</span>
                      <p className="font-bold text-sm text-cream-100 mt-0.5">{selectedCheese}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80">
                    <span className="text-zinc-500 block uppercase tracking-wider text-[10px] font-bold">
                      Selected Toppings & Finishes ({selectedToppings.length})
                    </span>
                    {selectedToppings.length === 0 ? (
                      <p className="text-xs text-zinc-500 italic mt-1">No additional toppings (Classic Margherita Style)</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {selectedToppings.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-lg bg-ember-900/30 text-ember-300 border border-ember-800/50 text-xs font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Chef Notes / Baking Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Well-done char, light sauce, cut into 8 square slices..."
                    rows={3}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar with Dynamic Live Pricing & Step Controls */}
          <div className="p-4 sm:p-6 border-t border-zinc-800 bg-charcoal-950 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Live Pricing Ticker */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[11px] text-zinc-400 block leading-none">Custom Total</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-ember-400 font-sans tracking-tight">
                    ${calculatedPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-zinc-500 font-normal">
                    ({selectedSize.split(' ')[0]})
                  </span>
                </div>
              </div>

              {/* Mini summary pill */}
              <div className="hidden md:block text-xs text-zinc-400 border-l border-zinc-800 pl-3">
                <span>{selectedToppings.length} topping{selectedToppings.length === 1 ? '' : 's'}</span>
                <span className="text-zinc-600 mx-1.5">•</span>
                <span className="text-zinc-300">{selectedCrust.split(' ')[0]}</span>
              </div>
            </div>

            {/* Stepper Navigation buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep((s) => (s + 1) as any)}
                  className="px-5 py-2.5 rounded-xl bg-ember-600 hover:bg-ember-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-ember-700/30 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Continue ({step}/4)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-ember-600 via-ember-500 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-ember-700/40 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Custom Pie to Feast (${calculatedPrice.toFixed(2)})</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

