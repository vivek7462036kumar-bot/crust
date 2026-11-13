'use client';

import React from 'react';
import { Pizza, Sparkles, UtensilsCrossed, Wine, Cookie } from 'lucide-react';

interface MenuCategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenCustomizer: () => void;
}

export default function MenuCategoryTabs({
  activeCategory,
  onSelectCategory,
  onOpenCustomizer,
}: MenuCategoryTabsProps) {
  const tabs = [
    { id: 'ALL', label: 'Full Menu', icon: Pizza },
    { id: 'PIZZA', label: 'Signature Pizzas', icon: Pizza },
    { id: 'CUSTOM', label: 'Build Your Own', icon: Sparkles, isAction: true },
    { id: 'SIDE', label: 'Sides & Garlic Breads', icon: UtensilsCrossed },
    { id: 'DRINK', label: 'Artisan Drinks', icon: Wine },
    { id: 'DESSERT', label: 'Wood-Fired Sweets', icon: Cookie },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCategory === tab.id;

        if (tab.isAction) {
          return (
            <button
              key={tab.id}
              onClick={onOpenCustomizer}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white shadow-md shadow-ember-900/30 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
              <span>{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onSelectCategory(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
              isActive
                ? 'bg-zinc-800 text-cream-100 border border-zinc-700 shadow-sm'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800/60'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-ember-400' : 'text-zinc-500'}`} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

