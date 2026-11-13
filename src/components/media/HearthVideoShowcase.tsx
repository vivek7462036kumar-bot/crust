'use client';

import React, { useState } from 'react';
import { Flame, Play, Sparkles, Volume2, Maximize2, Clock, CheckCircle } from 'lucide-react';

interface VideoStory {
  id: string;
  youtubeId: string;
  title: string;
  badge: string;
  temp: string;
  description: string;
  duration: string;
}

const VIDEO_STORIES: VideoStory[] = [
  {
    id: 'oven-bake',
    youtubeId: '1-SJGQ2HLp8',
    title: 'The 900° Hearth Fire & Leopard Crust',
    badge: 'Live Oven Camera',
    temp: '900°F Hardwood Fire',
    description: 'Watch the raw 72-hour dough puff into pillowy air pockets within 30 seconds as intense white oak woodsmoke kisses the crust.',
    duration: '0:45 Reel',
  },
  {
    id: 'dough-stretch',
    youtubeId: 'sv3TXMSv6Lw',
    title: 'Hand-Stretching 72-Hr Sourdough',
    badge: 'Artisan Technique',
    temp: 'Wild Yeast Leavened',
    description: 'Master pizzaiolos pushing trapped air gently towards the rim to preserve the cornicione, never rolling with a pin.',
    duration: '1:10 Reel',
  },
  {
    id: 'cheese-pull',
    youtubeId: '8Q_9h6VKmEU',
    title: 'Molten Buffalo Mozzarella & Hot Honey',
    badge: 'Fresh From Hearth',
    temp: 'Piping Hot Pull',
    description: 'Slices lifted fresh from the refractory brick hearth, showing the golden cheese elasticity and charred leopard undercarriage.',
    duration: '0:50 Reel',
  },
];

export default function HearthVideoShowcase() {
  const [activeVideo, setActiveVideo] = useState<VideoStory>(VIDEO_STORIES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember-600/20 text-ember-400 border border-ember-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 fill-ember-400 animate-pulse" />
            <span>The Hearth In Motion</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-cream-100">
            Real Wood-Fired Craft in Action
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            See the raw ingredients transform under roaring white oak flames. Captured live inside our 900° refractory brick oven.
          </p>
        </div>

        {/* Video selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {VIDEO_STORIES.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVideo(v)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeVideo.id === v.id
                  ? 'bg-ember-600 text-white border-ember-500 shadow-lg shadow-ember-900/40'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800'
              }`}
            >
              <Play className={`w-3 h-3 ${activeVideo.id === v.id ? 'fill-white' : ''}`} />
              <span>{v.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Cinema Card */}
      <div className="relative rounded-3xl overflow-hidden bg-charcoal-900 border border-zinc-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Embedded 16:9 Responsive Video Player */}
          <div className="lg:col-span-8 relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            <iframe
              key={activeVideo.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${activeVideo.youtubeId}&controls=1&modestbranding=1&rel=0`}
              title={activeVideo.title}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Live Oven Overlay Tag */}
            <div className="absolute top-4 left-4 pointer-events-none z-10 flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-ember-400 border border-ember-500/40 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                LIVE OVEN CAM
              </span>
              <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-zinc-300 text-xs font-mono border border-zinc-800">
                {activeVideo.temp}
              </span>
            </div>
          </div>

          {/* Video Story Info Column */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-charcoal-900 to-charcoal-950 border-t lg:border-t-0 lg:border-l border-zinc-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-amber-300 font-mono font-bold">
                  {activeVideo.badge}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> {activeVideo.duration}
                </span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-cream-100 leading-snug">
                {activeVideo.title}
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {activeVideo.description}
              </p>

              <div className="pt-2 space-y-2 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Kiln-dried sustainable white oak hardwood cords</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Caputo 00 Italian flour fermented 72 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Blistered in 90 seconds under intense flame</span>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-4 border-t border-zinc-800/80">
              <a
                href="#menu"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-ember-600 to-amber-600 hover:from-ember-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-ember-900/30 transition-all active:scale-95"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Taste the Fire • Browse Menu Below</span>
              </a>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
}

