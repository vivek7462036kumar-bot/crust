'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, Tag, ShoppingBag, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    appliedPromo,
    applyPromo,
    removePromo,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTax,
    getTotal,
    clearCart,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee('DELIVERY');
  const tax = getTax();
  const total = getTotal('DELIVERY');
  const freeDeliveryThreshold = 25.0;
  const awayFromFree = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleApplyPromo = async (codeToApply?: string) => {
    const code = (codeToApply || promoInput).trim().toUpperCase();
    if (!code) return;

    setPromoLoading(true);
    setPromoMessage(null);

    try {
      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        applyPromo({
          code: data.code,
          discountPercent: data.discountPercent,
          discountAmount: data.discountAmount,
          description: data.description,
        });
        setPromoMessage({ type: 'success', text: data.message });
        setPromoInput('');
      } else {
        setPromoMessage({ type: 'error', text: data.message });
      }
    } catch (e) {
      setPromoMessage({ type: 'error', text: 'Error applying promo code' });
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-charcoal-900 border-l border-zinc-800 text-cream-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-charcoal-950/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-ember-500" />
              <h2 className="font-serif text-xl font-bold tracking-wide">
                Your Order
              </h2>
              {items.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-ember-600/20 text-ember-400 font-semibold border border-ember-500/30">
                  {items.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              )}
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery progress bar */}
          {items.length > 0 && (
            <div className="px-5 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80 text-xs">
              {awayFromFree > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-zinc-300">
                    Add <span className="text-ember-400 font-bold">${awayFromFree.toFixed(2)}</span> more for <span className="text-emerald-400 font-bold">FREE Delivery</span>!
                  </p>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-ember-500 to-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> You unlocked FREE wood-fired delivery!
                </p>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center text-zinc-500">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-zinc-200">
                    Your hearth feast is empty
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">
                    Explore our wood-fired signature pizzas or craft your custom artisan pie.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-xl bg-ember-600 hover:bg-ember-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-ember-600/30"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm text-cream-100">
                          {item.name}
                        </h4>
                        {item.isCustom && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Custom Pizza Ingredients breakdown */}
                      {item.isCustom && item.customDetails && (
                        <div className="mt-1.5 text-xs text-zinc-400 space-y-0.5 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/50">
                          <p><span className="text-zinc-500">Size:</span> {item.customDetails.size}</p>
                          <p><span className="text-zinc-500">Crust:</span> {item.customDetails.crust}</p>
                          <p><span className="text-zinc-500">Sauce & Cheese:</span> {item.customDetails.sauce} • {item.customDetails.cheese}</p>
                          {item.customDetails.toppings && item.customDetails.toppings.length > 0 && (
                            <p className="text-amber-400/90">
                              <span className="text-zinc-500">Toppings:</span> {item.customDetails.toppings.join(', ')}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="text-sm font-bold text-ember-400 mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                        {item.quantity > 1 && (
                          <span className="text-xs text-zinc-400 font-normal ml-1">
                            (${item.price.toFixed(2)} each)
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-400 hover:text-red-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-800/50 text-xs">
                    <span className="text-zinc-400">Quantity</span>
                    <div className="flex items-center gap-2 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-ember-400 text-zinc-300 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-cream-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-ember-400 text-zinc-300 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary / Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-charcoal-950/90 space-y-4">
              
              {/* Promo code input */}
              <div className="space-y-2">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <div>
                        <span className="font-bold">{appliedPromo.code}</span> applied: {appliedPromo.description}
                      </div>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-zinc-400 hover:text-red-400 text-xs underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Promo code (e.g. EMBER20)"
                          className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-cream-100 placeholder:text-zinc-400 focus:outline-none focus:border-ember-500"
                        />
                      </div>
                      <button
                        onClick={() => handleApplyPromo()}
                        disabled={promoLoading || !promoInput.trim()}
                        className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-semibold text-zinc-200 transition-colors"
                      >
                        {promoLoading ? 'Checking...' : 'Apply'}
                      </button>
                    </div>

                    {/* Quick demo promo pills */}
                    <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                      <span>Try demo:</span>
                      <button
                        onClick={() => handleApplyPromo('EMBER20')}
                        className="px-1.5 py-0.5 rounded bg-ember-900/30 text-ember-400 border border-ember-800 hover:bg-ember-900/60 font-mono"
                      >
                        EMBER20 (20% off)
                      </button>
                      <button
                        onClick={() => handleApplyPromo('FREEDRINK')}
                        className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 font-mono"
                      >
                        FREEDRINK
                      </button>
                    </div>
                  </div>
                )}

                {promoMessage && (
                  <div
                    className={`text-xs flex items-center gap-1.5 ${
                      promoMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {promoMessage.type === 'success' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{promoMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-200 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-400 font-medium">FREE</span>
                  ) : (
                    <span className="text-zinc-200 font-medium">${deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-zinc-200 font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-cream-100 pt-2 border-t border-zinc-800">
                  <span>Grand Total</span>
                  <span className="text-ember-400 font-sans font-extrabold text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-ember-600 via-ember-500 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-ember-700/30 active:scale-[0.98] transition-all"
              >
                <span>Proceed to Wood-Fired Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                Clear Entire Order
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

