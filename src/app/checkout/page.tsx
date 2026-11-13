'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Flame,
  Truck,
  Store,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    appliedPromo,
    getSubtotal,
    getDiscount,
    getDeliveryFee,
    getTax,
    getTotal,
    clearCart,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');

  // Customer form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [pickupSlot, setPickupSlot] = useState('ASAP (20-25 mins)');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'COD' | 'UPI'>('CARD');

  // Simulated card fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryFee = getDeliveryFee(orderType);
  const tax = getTax();
  const total = getTotal(orderType);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-cream-100">
          Your order is empty
        </h2>
        <p className="text-sm text-zinc-400 max-w-sm">
          Please select some wood-fired pizzas or sides before checking out.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-ember-600 hover:bg-ember-500 text-white font-bold text-sm transition-colors shadow-lg shadow-ember-600/30"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address for order tracking.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (orderType === 'DELIVERY' && !address.trim()) {
      setErrorMessage('Please enter your complete delivery street address.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        orderType,
        deliveryAddress: orderType === 'DELIVERY' ? address : null,
        deliveryInstructions: instructions || null,
        pickupTime: orderType === 'PICKUP' ? pickupSlot : null,
        paymentMethod,
        items,
        promoCode: appliedPromo?.code || null,
        notes: instructions || null,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        router.push(`/orders/${data.orderId}`);
      } else {
        setErrorMessage(data.error || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-ember-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hearth Menu</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Delivery/Pickup + Customer Details + Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-cream-100 flex items-center gap-2.5">
                <Flame className="w-6 h-6 text-ember-500 fill-ember-500" />
                <span>Wood-Fired Checkout</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Your order is prepared fresh in our 900°F brick oven upon confirmation.
              </p>
            </div>

            {/* Delivery vs Pickup Selector */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-950 rounded-2xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setOrderType('DELIVERY')}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  orderType === 'DELIVERY'
                    ? 'bg-gradient-to-r from-ember-600 to-ember-700 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Wood-Fired Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('PICKUP')}
                className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  orderType === 'PICKUP'
                    ? 'bg-gradient-to-r from-ember-600 to-ember-700 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Store Pickup</span>
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-cream-100 border-b border-zinc-800/80 pb-2">
                  1. Contact Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marco Rossi"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 234-8901"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Email Address (for live updates & receipt) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. marco.rossi@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery / Pickup Details */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-cream-100 border-b border-zinc-800/80 pb-2">
                  2. {orderType === 'DELIVERY' ? 'Delivery Address' : 'Pickup Slot'}
                </h3>

                {orderType === 'DELIVERY' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Street Address & Apt/Suite *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Delivery Instructions (Gate code, buzzer, drop notes)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ring buzzer #4, leave by front doorstep"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Select Desired Pickup Time
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        'ASAP (20-25 mins)',
                        'In 35 mins',
                        'In 50 mins',
                        'In 65 mins',
                      ].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPickupSlot(slot)}
                          className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                            pickupSlot === slot
                              ? 'bg-ember-950/50 border-ember-500 text-amber-300'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-ember-400" />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-zinc-400 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80">
                      📍 Pickup Counter: 42 Hearthstone Way, Artisan District (Head directly to the Oven counter)
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-serif text-base font-bold text-cream-100 border-b border-zinc-800/80 pb-2">
                  3. Simulated Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'CARD'
                        ? 'bg-ember-950/50 border-ember-500 text-cream-100 ring-1 ring-ember-500/30'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-ember-400 mb-1" />
                    <h4 className="font-bold text-xs text-cream-100">Credit / Debit Card</h4>
                    <span className="text-[10px] text-zinc-500">Instant test card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'COD'
                        ? 'bg-ember-950/50 border-ember-500 text-cream-100 ring-1 ring-ember-500/30'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-400 mb-1" />
                    <h4 className="font-bold text-xs text-cream-100">
                      {orderType === 'DELIVERY' ? 'Cash on Delivery' : 'Pay at Counter'}
                    </h4>
                    <span className="text-[10px] text-zinc-500">Pay when received</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-ember-950/50 border-ember-500 text-cream-100 ring-1 ring-ember-500/30'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-amber-400 mb-1" />
                    <h4 className="font-bold text-xs text-cream-100">UPI / QR Pay</h4>
                    <span className="text-[10px] text-zinc-500">Scan & Pay simulated</span>
                  </button>
                </div>

                {/* Simulated payment detail view */}
                {paymentMethod === 'CARD' && (
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Simulated Secure Card Gateway</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL
                      </span>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 font-mono focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 font-mono focus:outline-none"
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                      <QrCode className="w-10 h-10 text-black" />
                    </div>
                    <div>
                      <p className="font-bold text-cream-100">crustandember@upi</p>
                      <p className="text-zinc-500 text-[11px]">Instant UPI auto-approval enabled for testing.</p>
                    </div>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-ember-600 via-ember-500 to-amber-600 hover:from-ember-500 hover:to-amber-500 disabled:opacity-50 text-white font-extrabold text-base shadow-xl shadow-ember-700/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {submitting ? (
                  <span>Transmitting to 900° Oven...</span>
                ) : (
                  <>
                    <Flame className="w-5 h-5 fill-white" />
                    <span>Place Wood-Fired Order (${total.toFixed(2)})</span>
                  </>
                )}
              </button>

            </form>

          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5 sticky top-28">
            
            <h3 className="font-serif text-lg font-bold text-cream-100 border-b border-zinc-800 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-sans font-normal text-zinc-400">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="text-xs space-y-1 pb-3 border-b border-zinc-800/60 last:border-0">
                  <div className="flex justify-between font-bold text-cream-100">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-ember-400 font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {item.isCustom && item.customDetails && (
                    <div className="text-[11px] text-zinc-400 pl-2 border-l border-zinc-700 space-y-0.5">
                      <p>{item.customDetails.size} • {item.customDetails.crust}</p>
                      <p>{item.customDetails.sauce} • {item.customDetails.cheese}</p>
                      {item.customDetails.toppings.length > 0 && (
                        <p className="text-amber-400/80">Toppings: {item.customDetails.toppings.join(', ')}</p>
                      )}
                    </div>
                  )}

                  {item.itemNotes && (
                    <p className="text-[10px] text-zinc-500 italic pl-2">
                      Note: "{item.itemNotes}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Promo banner if applied */}
            {appliedPromo && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-400">
                <span className="font-bold">{appliedPromo.code} Applied</span>
                <span>-{appliedPromo.discountPercent ? `${appliedPromo.discountPercent}%` : `$${appliedPromo.discountAmount}`}</span>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200 font-mono">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-400 font-semibold">FREE</span>
                ) : (
                  <span className="text-zinc-200 font-mono">${deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-zinc-200 font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-extrabold text-cream-100 pt-3 border-t border-zinc-800">
                <span>Grand Total</span>
                <span className="text-xl font-sans font-black text-ember-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Satisfaction guarantee */}
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ember-400 flex-shrink-0" />
              <span>Served at piping hot oven temperature with our thermal delivery seal.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

