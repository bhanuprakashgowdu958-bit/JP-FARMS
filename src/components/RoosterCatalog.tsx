'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, Feather, RotateCcw, Award } from 'lucide-react';
import { Rooster, RoosterCategory, RoosterBadge } from '@/types/rooster';
import { RoosterCard } from './RoosterCard';

interface RoosterCatalogProps {
  roosters: Rooster[];
  onSelectRooster: (rooster: Rooster) => void;
  onOpenVideo?: (rooster: Rooster) => void;
  onInquire?: (rooster: Rooster) => void;
  onBuyNow?: (rooster: Rooster) => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Breeds', value: 'all' },
  { label: 'Pure Aseel (Peela)', value: 'aseel-peela' },
  { label: 'Aseel (Kagar)', value: 'aseel-kagar' },
  { label: 'Sindhi Heavy Aseel', value: 'aseel-sindhi' },
  { label: 'Pure Kadaknath', value: 'kadaknath' },
  { label: 'Country Desi (Natu Kodi)', value: 'country-desi' },
  { label: 'Breeding Units', value: 'breeding-pairs' },
];

const BADGES: { label: string; value: 'all' | RoosterBadge }[] = [
  { label: 'All Strains', value: 'all' },
  { label: '👑 Champion Line', value: 'Champion Line' },
  { label: '⭐ Farm Stud', value: 'Farm Stud' },
  { label: '🌿 Heritage Pure', value: 'Heritage Pure' },
  { label: '🌾 Breeding Flock', value: 'Breeding Flock' },
  { label: '✨ Young Star', value: 'Young Star' },
];

export const RoosterCatalog: React.FC<RoosterCatalogProps> = ({
  roosters,
  onSelectRooster,
  onOpenVideo,
  onInquire,
  onBuyNow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<'all' | RoosterBadge>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'weight' | 'height' | 'newest'>('featured');

  const filteredRoosters = useMemo(() => {
    return roosters
      .filter((r) => {
        // Category filter
        if (selectedCategory !== 'all' && r.category !== selectedCategory) {
          return false;
        }

        // Badge filter
        if (selectedBadge !== 'all' && r.badge !== selectedBadge) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTag = r.tagId.toLowerCase().includes(q);
          const matchName = r.name.toLowerCase().includes(q);
          const matchBreed = r.breed.toLowerCase().includes(q);
          const matchLineage = r.lineage.toLowerCase().includes(q);
          if (!matchTag && !matchName && !matchBreed && !matchLineage) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === 'price-high') {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'weight') {
          const wA = parseFloat(a.weight) || 0;
          const wB = parseFloat(b.weight) || 0;
          return wB - wA;
        }
        if (sortBy === 'height') {
          const hA = parseFloat(a.height) || 0;
          const hB = parseFloat(b.height) || 0;
          return hB - hA;
        }
        // Default: featured first, then champion line
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.badge === 'Champion Line' && b.badge !== 'Champion Line') return -1;
        if (a.badge !== 'Champion Line' && b.badge === 'Champion Line') return 1;
        return 0;
      });
  }, [roosters, selectedCategory, selectedBadge, searchQuery, sortBy]);

  return (
    <section id="showcase" className="py-16 sm:py-20 bg-gradient-to-b from-white via-sky-50/30 to-white border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100/80 px-3 py-1 rounded-full mb-2">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span>Living Farm Heritage Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Farm Studs & Purebred Rooster Showcase
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              Explore pure indigenous bloodlines maintained at JP Farms. Each rooster is tagged with verifiable biological traits, comb anatomy, weight, and HD video documentation.
            </p>
          </div>

          {/* Quick Stats Badge */}
          <div className="flex items-center space-x-2 text-xs font-semibold bg-white border border-sky-200 px-4 py-2.5 rounded-2xl shadow-sm self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-800">
              <strong className="text-sky-700">{roosters.length} Registered Birds</strong> on Exhibition
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-100 shadow-sm space-y-4 mb-8">
          
          {/* Top Row: Search & Badges Filters */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Tag (e.g. JP-AS-101), Breed, or Lineage..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sky-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Badge Filter Pills */}
            <div className="flex items-center space-x-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
                Status:
              </span>
              {BADGES.map((badgeItem) => (
                <button
                  key={badgeItem.value}
                  onClick={() => setSelectedBadge(badgeItem.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    selectedBadge === badgeItem.value
                      ? 'bg-sky-700 text-white shadow-sm'
                      : 'bg-sky-50/60 text-slate-600 hover:bg-sky-100'
                  }`}
                >
                  {badgeItem.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-sky-50 border-none rounded-xl text-xs font-semibold px-3 py-2 text-slate-800 focus:ring-2 focus:ring-sky-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="weight">Heaviest Weight First</option>
                <option value="height">Tallest Height First</option>
                <option value="newest">Newly Documented</option>
              </select>
            </div>

          </div>

          {/* Bottom Row: Category Tabs */}
          <div className="pt-3 border-t border-sky-50 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-sm'
                    : 'bg-sky-50/60 text-slate-600 hover:bg-sky-100/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter & Active Filters Reset */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
          <p>
            Showing <strong className="text-stone-900">{filteredRoosters.length}</strong> birds
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            {selectedBadge !== 'all' && ` • ${selectedBadge}`}
          </p>
          {(selectedCategory !== 'all' || selectedBadge !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBadge('all');
                setSearchQuery('');
              }}
              className="flex items-center space-x-1 text-amber-700 hover:text-amber-900 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Rooster Grid */}
        {filteredRoosters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredRoosters.map((rooster) => (
              <RoosterCard
                key={rooster.id}
                rooster={rooster}
                onSelect={onSelectRooster}
                onOpenVideo={onOpenVideo}
                onInquire={onInquire}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Feather className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">No Roosters Match Your Filter</h3>
              <p className="text-xs text-stone-500 mt-1">
                We maintain ongoing breeding batches for this category. Contact us to learn more.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBadge('all');
                setSearchQuery('');
              }}
              className="bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-stone-800 transition"
            >
              View All Registered Birds
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
