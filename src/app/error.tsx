'use client';

import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-charcoal-900 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-950/50 border border-red-800/40 flex items-center justify-center text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-cream-100">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-400">
            {error?.message || 'An unexpected error occurred while preparing your hearth experience.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ember-600 hover:bg-ember-500 text-white font-medium text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-charcoal-800 hover:bg-zinc-800 border border-zinc-700 text-cream-100 font-medium text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
