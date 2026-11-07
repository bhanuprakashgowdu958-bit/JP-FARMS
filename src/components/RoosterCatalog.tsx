'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles, Feather, RotateCcw } from 'lucide-react';
import { Rooster, RoosterCategory } from '@/types/rooster';
import { RoosterCard } from './RoosterCard';

interface RoosterCatalogProps {
  roosters: Rooster[];
  onSelectRooster: (rooster: Rooster) => void;
  onOpenVideo?: (rooster: Rooster) => void;
  onBookNow?: (rooster: Rooster) => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Birds', value: 'all' },
  { label: 'Pure Aseel (Peela)', value: 'aseel-peela' },
  { label: 'Aseel (Kagar)', value: 'aseel-kagar' },
  { label: 'Sindhi Heavy Aseel', value: 'aseel-sindhi' },
  { label: 'Pure Kadaknath', value: 'kadaknath' },
  { label: 'Country Desi (Natu Kodi)', value: 'country-desi' },
  { label: 'Breeding Units', value: 'breeding-pairs' },
];

export const RoosterCatalog: React.FC<RoosterCatalogProps> = ({
  roosters,
  onSelectRooster,
  onOpenVideo,
  onBookNow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('available');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'weight' | 'newest'>('featured');

  const filteredRoosters = useMemo(() => {
    return roosters
      .filter((r) => {
        // Category filter
        if (selectedCategory !== 'all' && r.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all' && r.status !== statusFilter) {
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
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'weight') {
          const wA = parseFloat(a.weight) || 0;
          const wB = parseFloat(b.weight) || 0;
          return wB - wA;
        }
        // Default: featured first, then available first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.status === 'available' && b.status !== 'available') return -1;
        if (a.status !== 'available' && b.status === 'available') return 1;
        return 0;
      });
  }, [roosters, selectedCategory, statusFilter, searchQuery, sortBy]);

  const availableCount = roosters.filter(r => r.status === 'available').length;

  return (
    <section id="catalog" className="py-16 sm:py-20 bg-stone-50/70 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full mb-2">
              <Feather className="w-3.5 h-3.5" />
              <span>Current Farm Inventory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Verified Roosters for Sale
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-xl">
              Each rooster has a unique leg tag ID, verified weight, age, and HD stance video. Ready for direct farm pickup or safe crate delivery.
            </p>
          </div>

          {/* Quick Availability Badge */}
          <div className="flex items-center space-x-2 text-xs font-semibold bg-white border border-stone-200 px-4 py-2.5 rounded-2xl shadow-sm self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-stone-800">
              <strong className="text-emerald-700">{availableCount} Birds</strong> Available Today
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4 mb-8">
          
          {/* Top Row: Search & Status Filters */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Tag (e.g. JP-AS-101), Breed, or Name..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div className="flex items-center space-x-1 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2 hidden sm:inline">
                Status:
              </span>
              {(['available', 'all', 'reserved', 'sold'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap ${
                    statusFilter === status
                      ? status === 'available'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {status === 'available' ? '🟢 Available' : status === 'all' ? 'All Birds' : status}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full lg:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-100 border-none rounded-xl text-xs font-semibold px-3 py-2 text-stone-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="weight">Heaviest Weight First</option>
                <option value="newest">Newly Listed</option>
              </select>
            </div>

          </div>

          {/* Bottom Row: Category Tabs */}
          <div className="pt-3 border-t border-stone-100 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.value
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-200/80'
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
            Showing <strong className="text-stone-900">{filteredRoosters.length}</strong> roosters
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
          {(selectedCategory !== 'all' || statusFilter !== 'available' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setStatusFilter('available');
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
                onBookNow={onBookNow}
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
                We might have this breed growing in our upcoming batch or in quarantine before listing.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setStatusFilter('all');
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

