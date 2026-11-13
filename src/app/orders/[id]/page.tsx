'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  Pizza,
  Store,
  ChevronRight,
  RefreshCw,
  FastForward,
  MapPin,
  Phone,
  FileText,
} from 'lucide-react';
import { OrderRecord, OrderStatus } from '@/lib/types';

interface OrderPageProps {
  params: { id: string };
}

const STAGES: {
  key: OrderStatus;
  title: string;
  subtitle: string;
  icon: any;
  temp?: string;
}[] = [
  {
    key: 'RECEIVED',
    title: 'Order Confirmed',
    subtitle: 'Kitchen ticket printed & ingredients prepped',
    icon: FileText,
  },
  {
    key: 'PREPARING',
    title: 'Stretching Sourdough',
    subtitle: '72-hr fermented dough hand-stretched & sauced',
    icon: Sparkles,
  },
  {
    key: 'BAKING',
    title: 'Wood-Fired Oven Hearth',
    subtitle: 'Blistering over white oak hardwood at 900°F',
    icon: Flame,
    temp: '900°F',
  },
  {
    key: 'OUT_FOR_DELIVERY',
    title: 'Out for Delivery / Pickup',
    subtitle: 'Placed in thermal heat-trap pizza carrier',
    icon: Truck,
  },
  {
    key: 'DELIVERED',
    title: 'Delivered & Enjoyed',
    subtitle: 'Buon Appetito! Feast fresh while hot',
    icon: Pizza,
  },
];

export default function OrderTrackerPage({ params }: OrderPageProps) {
  const { id } = params;
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) {
        throw new Error('Order not found');
      }
      const data = await res.json();
      setOrder(data.order);
      setLastRefreshed(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();

    // Auto-poll every 5 seconds so admin updates reflect automatically
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [fetchOrder]);

  const handleSimulateNextStage = async () => {
    setSimulating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advanceNext: true }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      }
    } catch (e) {
      console.error('Failed to simulate next stage:', e);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-ember-600/20 border border-ember-500/40 flex items-center justify-center animate-spin">
          <Flame className="w-6 h-6 text-ember-500" />
        </div>
        <p className="text-sm text-zinc-400 font-serif">Checking Wood-Fired Hearth Status...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center p-6">
        <h2 className="font-serif text-2xl font-bold text-cream-100">Order Not Found</h2>
        <p className="text-sm text-zinc-400">
          We couldn't find an order with identifier <span className="font-mono text-ember-400">{id}</span>.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-ember-600 text-white font-bold text-sm hover:bg-ember-500 transition-colors"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex((s) => s.key === order.status);
  const activeIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Dev Simulation Bar (Core Requirement for instant testing) */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-amber-950/20">
        <div className="flex items-center gap-2.5 text-xs">
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold uppercase tracking-wider border border-amber-500/40">
            Dev Mode
          </span>
          <span className="text-zinc-300">
            Interactive Test Switch: Advance wood-fired progress stage
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSimulateNextStage}
            disabled={simulating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-ember-600 hover:from-amber-500 hover:to-ember-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>{simulating ? 'Advancing...' : 'Simulate Next Stage'}</span>
          </button>

          <button
            onClick={fetchOrder}
            title="Refresh now"
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-ember-400 font-bold border border-zinc-700">
                {order.id}
              </span>
              <span className="text-xs text-zinc-400">
                • Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-cream-100 mt-2">
              {STAGES[activeIndex]?.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              {STAGES[activeIndex]?.subtitle}
            </p>
          </div>

          {/* Live Status Pill */}
          <div className="flex flex-col sm:items-end">
            <span className="text-xs text-zinc-400">Estimated Wood-Fired Arrival</span>
            <span className="text-xl sm:text-2xl font-black font-sans text-ember-400 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-5 h-5 text-ember-500" />
              {order.status === 'DELIVERED' ? 'Arrived!' : '18 - 25 mins'}
            </span>
          </div>
        </div>

        {/* 5-Stage Visual Stepper */}
        <div className="py-4">
          <div className="grid grid-cols-5 gap-2 relative">
            
            {/* Background connecting track */}
            <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-zinc-800 -z-0" />
            <div
              className="absolute top-5 left-[10%] h-1 bg-gradient-to-r from-ember-600 via-ember-500 to-amber-500 -z-0 transition-all duration-700"
              style={{
                width: `${(activeIndex / (STAGES.length - 1)) * 80}%`,
              }}
            />

            {STAGES.map((stg, idx) => {
              const Icon = stg.icon;
              const isPast = idx < activeIndex;
              const isCurrent = idx === activeIndex;

              return (
                <div key={stg.key} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isPast
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                        : isCurrent
                        ? 'bg-gradient-to-br from-ember-500 to-amber-600 text-white ring-4 ring-ember-500/20 shadow-xl shadow-ember-900 scale-110'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-700/60'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <div className="mt-3">
                    <p
                      className={`text-[11px] sm:text-xs font-bold leading-tight ${
                        isCurrent
                          ? 'text-amber-400'
                          : isPast
                          ? 'text-cream-100'
                          : 'text-zinc-500'
                      }`}
                    >
                      {stg.title.split(' ')[0]} {stg.title.split(' ')[1] || ''}
                    </p>
                    {isCurrent && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-ember-600/30 text-ember-300 border border-ember-500/30 animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Stage Highlight Box */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-ember-600/20 text-ember-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-ember-500" />
            </div>
            <div>
              <p className="font-bold text-cream-100">
                {order.orderType === 'DELIVERY' ? 'Hot Delivery to Address' : 'Express Store Pickup'}
              </p>
              <p className="text-zinc-400 text-[11px]">
                {order.orderType === 'DELIVERY'
                  ? order.deliveryAddress
                  : `Pickup Counter: 42 Hearthstone Way (${order.pickupTime})`}
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-zinc-500 hidden sm:block">
            Auto-refreshing every 5s • Last update {lastRefreshed.toLocaleTimeString()}
          </div>
        </div>

      </div>

      {/* Order Itemized Summary Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Items details */}
        <div className="md:col-span-8 bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-cream-100 border-b border-zinc-800 pb-3">
            Pizzas & Hearth Items Ordered
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => {
              let parsedToppings: string[] = [];
              if (item.toppings) {
                try {
                  parsedToppings = JSON.parse(item.toppings);
                } catch (e) {
                  parsedToppings = [item.toppings];
                }
              }

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-cream-100">
                        {item.quantity}x {item.name}
                      </span>
                      {item.isCustom && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase border border-amber-500/30">
                          Custom Pie
                        </span>
                      )}
                    </div>

                    {item.isCustom && (
                      <div className="text-xs text-zinc-400 space-y-0.5 pt-1">
                        <p><span className="text-zinc-500">Specs:</span> {item.size} • {item.crust}</p>
                        <p><span className="text-zinc-500">Bases:</span> {item.sauce} • {item.cheese}</p>
                        {parsedToppings.length > 0 && (
                          <p className="text-amber-400/90">
                            <span className="text-zinc-500">Toppings:</span> {parsedToppings.join(', ')}
                          </p>
                        )}
                      </div>
                    )}

                    {item.itemNotes && (
                      <p className="text-[11px] text-zinc-500 italic">
                        Note: "{item.itemNotes}"
                      </p>
                    )}
                  </div>

                  <span className="text-sm font-bold text-ember-400 font-mono">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bill Breakdown & Customer Details */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-cream-100 border-b border-zinc-800 pb-2">
              Receipt & Totals
            </h3>

            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-200 font-mono">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount ({order.promoCode})</span>
                  <span className="font-mono">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                {order.deliveryFee === 0 ? (
                  <span className="text-emerald-400 font-semibold">FREE</span>
                ) : (
                  <span className="text-zinc-200 font-mono">${order.deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="text-zinc-200 font-mono">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-serif font-extrabold text-cream-100 pt-3 border-t border-zinc-800">
                <span>Total Paid</span>
                <span className="text-lg font-sans font-black text-ember-400">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
              <p><span className="text-zinc-500">Customer:</span> {order.customerName}</p>
              <p><span className="text-zinc-500">Contact:</span> {order.customerPhone}</p>
              <p><span className="text-zinc-500">Payment:</span> {order.paymentMethod} (Simulated {order.paymentStatus})</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-ember-400 transition-colors"
            >
              <span>Back to Storefront</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

