import React from 'react';
import Link from 'next/link';
import { Flame, Clock, MapPin, Phone, ShieldCheck, Heart, Calendar, Search } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 border-t border-zinc-800 text-zinc-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-ember-600 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="font-serif font-extrabold text-2xl text-cream-100 tracking-wider">
                CRUST & EMBER
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Honoring the Neapolitan tradition. Fermented for 72 hours, hand-stretched with Caputo 00 flour, and kissed by seasoned oak embers at 900°F.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-500 font-semibold tracking-wide">
              <span>WOOD-FIRED AUTHENTICITY</span>
              <span>•</span>
              <span>EST. 2024</span>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-ember-500" /> Hearth Oven Hours
            </h4>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                <span className="text-zinc-300">Mon – Thu</span>
                <span className="text-zinc-400">11:30 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-zinc-800/60 pb-1.5">
                <span className="text-zinc-300">Fri – Sat</span>
                <span className="text-ember-400 font-medium">11:30 AM – 11:30 PM</span>
              </li>
              <li className="flex justify-between pb-1.5">
                <span className="text-zinc-300">Sunday</span>
                <span className="text-zinc-400">12:00 PM – 9:30 PM</span>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-cream-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-ember-500" /> The Pizzeria
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              42 Hearthstone Way, Artisan District<br />
              New York, NY 10012
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-300 pt-1">
              <Phone className="w-4 h-4 text-ember-500" />
              <span>(555) 789-WOOD (9663)</span>
            </div>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Takeout & Hot Delivery within 6 Miles
            </p>
          </div>

          {/* Quick Links & Services */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-bold text-cream-100">
              Services & Explore
            </h4>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/reserve" className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors">
                  <Calendar className="w-3.5 h-3.5" /> Book a Table Reservation
                </Link>
              </li>
              <li>
                <Link href="/orders" className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors">
                  <Search className="w-3.5 h-3.5" /> Track Active Order
                </Link>
              </li>
              <li>
                <Link href="/story" className="text-zinc-400 hover:text-ember-400 transition-colors">
                  72-Hr Sourdough Science
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-ember-400 transition-colors">
                  Mobile Wood-Fired Catering
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center gap-1.5 text-zinc-400 hover:text-ember-400 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                  Staff / Admin Suite (PIN: 1234)
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© {new Date().getFullYear()} Crust & Ember Pizzeria LLC. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with passion, woodsmoke, and high-heat love <Heart className="w-3.5 h-3.5 text-ember-500 fill-ember-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
