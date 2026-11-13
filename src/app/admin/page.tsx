'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Flame,
  Lock,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Plus,
  RefreshCw,
  Edit2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ChefHat,
  Search,
  X,
  Calendar,
  Printer,
  FileText,
  Users,
} from 'lucide-react';
import { MenuItem, OrderRecord, OrderStatus } from '@/lib/types';

const STATUS_CYCLE: OrderStatus[] = [
  'RECEIVED',
  'PREPARING',
  'BAKING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

const STATUS_LABELS: Record<OrderStatus, { label: string; color: string }> = {
  RECEIVED: { label: 'Order Received', color: 'bg-blue-950 text-blue-400 border-blue-800' },
  PREPARING: { label: 'Stretching Dough', color: 'bg-amber-950 text-amber-400 border-amber-800' },
  BAKING: { label: 'Wood Oven 900°', color: 'bg-ember-950 text-ember-400 border-ember-800' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-purple-950 text-purple-400 border-purple-800' },
  DELIVERED: { label: 'Delivered', color: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-950 text-red-400 border-red-800' },
};

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('1234');
  const [pinError, setPinError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'MENU' | 'RESERVATIONS'>('ORDERS');

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('ALL');
  const [orderSearch, setOrderSearch] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Menu State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');

  // Reservations State
  const [reservations, setReservations] = useState<any[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);

  // Add Item Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('PIZZA');
  const [newItemPrice, setNewItemPrice] = useState('18.50');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemImageUrl, setNewItemImageUrl] = useState('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80');
  const [newItemBadges, setNewItemBadges] = useState<string[]>(['CHEF_SPECIAL']);
  const [addLoading, setAddLoading] = useState(false);

  // Print Kitchen Ticket Modal
  const [printableOrder, setPrintableOrder] = useState<OrderRecord | null>(null);

  // Edit price inline state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  // 1. PIN Authentication Handler
  const handlePinLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPinError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setPinError(data.message || 'Invalid PIN');
      }
    } catch (err: any) {
      setPinError('Error connecting to auth server');
    } finally {
      setAuthLoading(false);
    }
  };

  // 2. Fetch Orders
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (res.ok && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // 3. Fetch Menu
  const fetchMenu = useCallback(async () => {
    setMenuLoading(true);
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (res.ok && data.items) {
        setMenuItems(data.items);
      }
    } catch (e) {
      console.error('Failed to load menu items', e);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  // 4. Fetch Reservations
  const fetchReservations = useCallback(async () => {
    setReservationsLoading(true);
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      if (res.ok && data.reservations) {
        setReservations(data.reservations);
      }
    } catch (e) {
      console.error('Failed to load reservations', e);
    } finally {
      setReservationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchMenu();
      fetchReservations();
    }
  }, [isAuthenticated, fetchOrders, fetchMenu, fetchReservations]);

  // Advance Order Stage Handler
  const handleAdvanceOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advanceNext: true }),
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? data.order : o))
        );
      }
    } catch (e) {
      console.error('Error advancing order', e);
    }
  };

  // Toggle In Stock / Sold Out Handler
  const handleToggleStock = async (itemId: string, currentStock: boolean) => {
    try {
      const res = await fetch(`/api/menu/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !currentStock }),
      });
      const data = await res.json();
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, inStock: !currentStock } : item))
        );
      }
    } catch (e) {
      console.error('Error toggling stock', e);
    }
  };

  // Update Price Handler
  const handleSavePrice = async (itemId: string) => {
    const parsed = parseFloat(tempPrice);
    if (isNaN(parsed) || parsed <= 0) return;

    try {
      const res = await fetch(`/api/menu/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parsed }),
      });
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, price: parsed } : item))
        );
        setEditingPriceId(null);
      }
    } catch (e) {
      console.error('Error updating price', e);
    }
  };

  // Add New Item Handler
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    setAddLoading(true);
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName,
          category: newItemCategory,
          price: newItemPrice,
          description: newItemDescription,
          imageUrl: newItemImageUrl,
          badges: newItemBadges,
        }),
      });

      const created = await res.json();
      if (res.ok) {
        setMenuItems((prev) => [created, ...prev]);
        setShowAddModal(false);
        setNewItemName('');
        setNewItemDescription('');
      }
    } catch (e) {
      console.error('Error creating menu item', e);
    } finally {
      setAddLoading(false);
    }
  };

  // Update Reservation Status Handler
  const handleUpdateReservation = async (resId: string, status: string) => {
    try {
      const res = await fetch(`/api/reservations/${resId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReservations((prev) =>
          prev.map((r) => (r.id === resId ? { ...r, status } : r))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-charcoal-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ember-500 to-amber-600 flex items-center justify-center mx-auto shadow-xl shadow-ember-900/40">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-cream-100">
              Hearth Staff Admin
            </h1>
            <p className="text-xs text-zinc-400">
              Enter the 4-digit security PIN to access live order management & menu controls.
            </p>
          </div>

          <form onSubmit={handlePinLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 text-center">
                Manager Access PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="1234"
                className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-zinc-950 border border-zinc-800 rounded-2xl py-3 text-cream-100 focus:outline-none focus:border-ember-500"
                autoFocus
              />
            </div>

            {/* Test Helper Display */}
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center space-y-1">
              <span className="text-[11px] text-amber-300 font-semibold block">
                🔑 Testing Credentials Pre-Configured:
              </span>
              <p className="text-xs text-zinc-300">
                Default PIN: <span className="font-mono font-bold text-amber-400">1234</span>
              </p>
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 text-center font-medium">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-ember-900/30 transition-all"
            >
              {authLoading ? 'Verifying PIN...' : 'Authorize Manager Access'}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300">
              ← Return to Customer Storefront
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'ALL') {
      if (orderFilter === 'ACTIVE') {
        if (o.status === 'DELIVERED' || o.status === 'CANCELLED') return false;
      } else if (o.status !== orderFilter) {
        return false;
      }
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // Filtered Menu Items
  const filteredMenu = menuItems.filter((i) => {
    if (!menuSearch) return true;
    return (
      i.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      i.category.toLowerCase().includes(menuSearch.toLowerCase())
    );
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Bar / Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              PIN Verified
            </span>
            <span className="text-xs text-zinc-400">• Store Admin Console</span>
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-cream-100 mt-1 flex items-center gap-2.5">
            <ChefHat className="w-7 h-7 text-ember-500" />
            <span>Crust & Ember Manager Suite</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Customer View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              fetchOrders();
              fetchMenu();
              fetchReservations();
            }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
            title="Refresh All"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-charcoal-900 border border-zinc-800">
          <span className="text-xs text-zinc-400 block">Total Orders</span>
          <span className="text-2xl font-black font-sans text-cream-100 mt-1 block">
            {orders.length}
          </span>
          <span className="text-[11px] text-zinc-500">From local SQLite</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-900 border border-zinc-800">
          <span className="text-xs text-zinc-400 block">Active In Kitchen</span>
          <span className="text-2xl font-black font-sans text-ember-400 mt-1 block">
            {activeOrdersCount}
          </span>
          <span className="text-[11px] text-ember-500/80">Pending completion</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-900 border border-zinc-800">
          <span className="text-xs text-zinc-400 block">Table Reservations</span>
          <span className="text-2xl font-black font-sans text-amber-400 mt-1 block">
            {reservations.length}
          </span>
          <span className="text-[11px] text-zinc-500">Booked guests</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-900 border border-zinc-800">
          <span className="text-xs text-zinc-400 block">Total Revenue</span>
          <span className="text-2xl font-black font-sans text-emerald-400 mt-1 block">
            ${totalRevenue.toFixed(2)}
          </span>
          <span className="text-[11px] text-emerald-500/80">Processed sales</span>
        </div>
      </div>

      {/* Navigation Tabs: Orders vs Menu Manager vs Reservations */}
      <div className="flex border-b border-zinc-800 gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'ORDERS'
              ? 'border-ember-500 text-ember-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Live Order Board ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MENU')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'MENU'
              ? 'border-ember-500 text-ember-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Menu Inventory ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RESERVATIONS')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'RESERVATIONS'
              ? 'border-ember-500 text-ember-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Table Bookings ({reservations.length})</span>
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS BOARD */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6">
          
          {/* Order Search & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by customer name, phone, or ORD-XXXX..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'ACTIVE', label: 'Active Kitchen' },
                { id: 'RECEIVED', label: 'Received' },
                { id: 'PREPARING', label: 'Dough Prep' },
                { id: 'BAKING', label: 'In 900° Oven' },
                { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
                { id: 'DELIVERED', label: 'Delivered' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                    orderFilter === f.id
                      ? 'bg-zinc-800 text-cream-100 border-zinc-700'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-charcoal-900 border border-zinc-800 space-y-2">
              <Package className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="font-serif text-lg text-cream-100 font-bold">No matching orders found</p>
              <p className="text-xs text-zinc-400">Try adjusting your search query or status filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrders.map((ord) => {
                const statusInfo = STATUS_LABELS[ord.status] || {
                  label: ord.status,
                  color: 'bg-zinc-800 text-zinc-400 border-zinc-700',
                };
                const currentIndex = STATUS_CYCLE.indexOf(ord.status);
                const nextStatus = currentIndex < STATUS_CYCLE.length - 1 ? STATUS_CYCLE[currentIndex + 1] : null;

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-3xl bg-charcoal-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-3">
                      
                      {/* Order top bar */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-ember-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                            {ord.id}
                          </span>
                          <span className="text-[11px] text-zinc-500 ml-2">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setPrintableOrder(ord)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                            title="Print Kitchen Ticket"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div>
                        <h3 className="font-serif text-base font-bold text-cream-100">
                          {ord.customerName}
                        </h3>
                        <p className="text-xs text-zinc-400">{ord.customerPhone} • {ord.customerEmail}</p>
                        <p className="text-xs text-zinc-300 font-medium mt-1">
                          {ord.orderType === 'DELIVERY' ? `🛵 Delivery: ${ord.deliveryAddress}` : `🏬 Store Pickup: ${ord.pickupTime}`}
                        </p>
                      </div>

                      {/* Item list */}
                      <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-2">
                        {ord.items.map((item) => {
                          let parsedToppings: string[] = [];
                          if (item.toppings) {
                            try {
                              parsedToppings = JSON.parse(item.toppings);
                            } catch (e) {
                              parsedToppings = [item.toppings];
                            }
                          }

                          return (
                            <div key={item.id} className="border-b border-zinc-900 pb-1.5 last:border-0 last:pb-0">
                              <div className="flex justify-between font-bold text-cream-100">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="text-zinc-400 font-mono">${item.totalPrice.toFixed(2)}</span>
                              </div>
                              {item.isCustom && (
                                <div className="text-[10px] text-amber-400/90 pl-2">
                                  {item.size} • {item.crust} {parsedToppings.length > 0 && `• ${parsedToppings.join(', ')}`}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Order Total & Promo */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-zinc-400">Total Charged</span>
                        <div className="text-right">
                          <span className="font-extrabold font-sans text-base text-cream-100">
                            ${ord.total.toFixed(2)}
                          </span>
                          {ord.promoCode && (
                            <span className="text-[10px] text-emerald-400 block">
                              Promo: {ord.promoCode} (-${ord.discount.toFixed(2)})
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Action Buttons: Advance Stage + View Customer Tracker */}
                    <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                      {nextStatus ? (
                        <button
                          onClick={() => handleAdvanceOrder(ord.id)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Flame className="w-3.5 h-3.5 fill-white" />
                          <span>Advance: {STATUS_LABELS[nextStatus].label}</span>
                        </button>
                      ) : (
                        <div className="text-center py-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-900">
                          ✓ Order Completed & Delivered
                        </div>
                      )}

                      <Link
                        href={`/orders/${ord.id}`}
                        target="_blank"
                        className="w-full py-1 text-center text-[11px] text-zinc-400 hover:text-zinc-200 block transition-colors"
                      >
                        Open Live Customer Tracker ↗
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 2: MENU & INVENTORY MANAGER */}
      {activeTab === 'MENU' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Filter menu items..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500"
              />
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-ember-600 hover:bg-ember-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-ember-900/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Menu Item</span>
            </button>
          </div>

          <div className="bg-charcoal-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-zinc-800">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-950/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-cream-100">
                          {item.name}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 max-w-md mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      {editingPriceId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="w-16 bg-zinc-950 border border-amber-500 rounded px-2 py-1 text-xs text-amber-300 font-mono"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(item.id)}
                            className="px-2 py-1 bg-amber-600 text-white rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPriceId(null)}
                            className="p-1 text-zinc-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPriceId(item.id);
                            setTempPrice(item.price.toString());
                          }}
                          className="flex items-center gap-1.5 group p-1 rounded hover:bg-zinc-800 text-right"
                          title="Click to edit price"
                        >
                          <span className="text-sm font-black font-sans text-ember-400">
                            ${item.price.toFixed(2)}
                          </span>
                          <Edit2 className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleStock(item.id, item.inStock)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        item.inStock
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60'
                          : 'bg-red-950/60 border-red-500/40 text-red-400 hover:bg-red-900/60'
                      }`}
                    >
                      {item.inStock ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-400" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-red-400" />
                          <span>Sold Out</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TABLE RESERVATIONS */}
      {activeTab === 'RESERVATIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-cream-100">
              Confirmed Table Bookings ({reservations.length})
            </h3>
            <button
              onClick={fetchReservations}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-3xl bg-charcoal-900 border border-zinc-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-950 text-amber-300 border border-zinc-800">
                    {res.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    res.status === 'CONFIRMED'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : res.status === 'SEATED'
                      ? 'bg-blue-950 text-blue-400 border-blue-800'
                      : 'bg-red-950 text-red-400 border-red-800'
                  }`}>
                    {res.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-cream-100">{res.customerName}</h4>
                  <p className="text-xs text-zinc-400">{res.customerPhone} • {res.customerEmail}</p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-1">
                  <p className="text-zinc-300">
                    <span className="text-zinc-500">Party Size:</span> {res.partySize} Guests
                  </p>
                  <p className="text-zinc-300">
                    <span className="text-zinc-500">Slot:</span> {res.date} at {res.timeSlot}
                  </p>
                  <p className="text-zinc-300">
                    <span className="text-zinc-500">Area:</span> {res.seatingArea.replace('_', ' ')}
                  </p>
                  {res.notes && (
                    <p className="text-amber-400 text-[11px] pt-1">
                      Note: "{res.notes}"
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-1 border-t border-zinc-800/60">
                  {res.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateReservation(res.id, 'SEATED')}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Seat Table
                    </button>
                  )}
                  {res.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleUpdateReservation(res.id, 'CANCELLED')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-red-900/60 text-zinc-400 hover:text-red-300 text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: PRINT KITCHEN TICKET DOCKET */}
      {printableOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setPrintableOrder(null)} />
          <div className="flex min-h-full items-center justify-center p-4 relative z-10">
            <div className="w-full max-w-sm bg-white text-black font-mono p-6 rounded-2xl shadow-2xl space-y-4">
              <div className="text-center border-b-2 border-dashed border-black pb-3">
                <h3 className="font-extrabold text-lg">CRUST & EMBER PIZZERIA</h3>
                <p className="text-xs">WOOD-FIRED HEARTH KITCHEN DOCKET</p>
                <div className="text-2xl font-black mt-2 bg-black text-white py-1">
                  {printableOrder.id}
                </div>
                <p className="text-xs mt-1">
                  Type: <strong>{printableOrder.orderType}</strong> • {new Date(printableOrder.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="text-xs space-y-2 border-b-2 border-dashed border-black pb-3">
                <p><strong>Customer:</strong> {printableOrder.customerName}</p>
                <p><strong>Phone:</strong> {printableOrder.customerPhone}</p>
                {printableOrder.orderType === 'DELIVERY' ? (
                  <p><strong>Address:</strong> {printableOrder.deliveryAddress}</p>
                ) : (
                  <p><strong>Pickup Slot:</strong> {printableOrder.pickupTime}</p>
                )}
                {printableOrder.notes && (
                  <p className="bg-yellow-200 p-1 font-bold">KITCHEN NOTE: {printableOrder.notes}</p>
                )}
              </div>

              <div className="space-y-3 border-b-2 border-dashed border-black pb-3 text-xs">
                {printableOrder.items.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-sm">
                      <span>[{item.quantity}x] {item.name}</span>
                    </div>
                    {item.size && <p className="text-[11px] pl-2">• Size: {item.size}</p>}
                    {item.crust && <p className="text-[11px] pl-2">• Crust: {item.crust}</p>}
                    {item.toppings && <p className="text-[11px] pl-2 font-bold">• Toppings: {item.toppings}</p>}
                    {item.itemNotes && <p className="text-[11px] pl-2 italic">Note: {item.itemNotes}</p>}
                  </div>
                ))}
              </div>

              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${printableOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>TOTAL:</span>
                  <span>${printableOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-black text-white font-bold text-xs rounded"
                >
                  Print Ticket
                </button>
                <button
                  onClick={() => setPrintableOrder(null)}
                  className="px-3 py-2 bg-zinc-200 text-black font-bold text-xs rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW ITEM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4 relative z-10">
            <div className="w-full max-w-lg bg-charcoal-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-serif text-xl font-bold text-cream-100">
                  Add New Wood-Fired Item
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateMenuItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gorgonzola & Fig Bianca"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                    >
                      <option value="PIZZA">PIZZA</option>
                      <option value="SIDE">SIDE</option>
                      <option value="DRINK">DRINK</option>
                      <option value="DESSERT">DESSERT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Description & Ingredients
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe flavor notes, cheeses, and hearth finish..."
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Image URL (Unsplash)
                  </label>
                  <input
                    type="url"
                    value={newItemImageUrl}
                    onChange={(e) => setNewItemImageUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-cream-100 focus:outline-none focus:border-ember-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="px-5 py-2 rounded-xl bg-ember-600 hover:bg-ember-500 text-white font-bold text-xs"
                  >
                    {addLoading ? 'Saving...' : 'Add Item to Menu'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
