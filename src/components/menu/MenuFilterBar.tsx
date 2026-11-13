'use client';

import React from 'react';
import { Search, X, Flame, Leaf, Sparkles } from 'lucide-react';

interface MenuFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function MenuFilterBar({
  searchQuery,
  onSearchChange,
  selectedTag,
  onSelectTag,
}: MenuFilterBarProps) {
  const filterTags = [
    { id: 'VEGETARIAN', label: 'Vegetarian', icon: Leaf, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' },
    { id: 'VEGAN', label: '100% Plant-Based', icon: Leaf, color: 'text-green-400 bg-green-950/40 border-green-800/40' },
    { id: 'SPICY', label: 'Wood-Fired Spicy', icon: Flame, color: 'text-rose-400 bg-rose-950/40 border-rose-800/40' },
    { id: 'CHEF_SPECIAL', label: "Chef's Special", icon: Sparkles, color: 'text-amber-400 bg-amber-950/40 border-amber-800/40' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
      
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search artisan pizzas, sides, ingredients..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-9 py-2.5 text-sm text-cream-100 placeholder:text-zinc-500 focus:outline-none focus:border-ember-500 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dietary Badges filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTags.map((tag) => {
          const Icon = tag.icon;
          const isSelected = selectedTag === tag.id;

          return (
            <button
              key={tag.id}
              onClick={() => onSelectTag(isSelected ? null : tag.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? `${tag.color} ring-1 ring-ember-500/50 shadow-sm`
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tag.label}</span>
              {isSelected && <X className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}

        {selectedTag && (
          <button
            onClick={() => onSelectTag(null)}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline whitespace-nowrap ml-1"
          >
            Reset filter
          </button>
        )}
      </div>

    </div>
  );
}

