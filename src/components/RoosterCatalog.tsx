'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  Feather, 
  RotateCcw, 
  Award, 
  LayoutGrid, 
  List,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Video
} from 'lucide-react';
import { Rooster, RoosterCategory, RoosterBadge } from '@/types/rooster';
import { RoosterCard } from './RoosterCard';
import { ROOSTER_CATEGORIES_META, BreedCategoryMeta } from '@/lib/data';

interface RoosterCatalogProps {
  roosters: Rooster[];
  onSelectRooster: (rooster: Rooster) => void;
  onOpenVideo?: (rooster: Rooster) => void;
  onInquire?: (rooster: Rooster) => void;
  onBuyNow?: (rooster: Rooster) => void;
}

const CATEGORY_ITEMS: { label: string; value: RoosterCategory; icon: string }[] = [
  { label: 'All Breeds', value: 'all', icon: '✨' },
  { label: 'Pure Aseel (Peela)', value: 'aseel-peela', icon: '🐓' },
  { label: 'Aseel Kagar', value: 'aseel-kagar', icon: '🦅' },
  { label: 'Sindhi Heavy', value: 'aseel-sindhi', icon: '🦃' },
  { label: 'Kadaknath', value: 'kadaknath', icon: '🖤' },
  { label: 'Natu Kodi', value: 'country-desi', icon: '🌾' },
  { label: 'Breeding Units', value: 'breeding-pairs', icon: '👑' },
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: roosters.length };
    roosters.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [roosters]);

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

  // Group filtered roosters into category shelves when "All Breeds" is viewed
  const groupedByShelf = useMemo(() => {
    const groups: {
      catKey: Exclude<RoosterCategory, 'all'>;
      meta: BreedCategoryMeta;
      items: Rooster[];
    }[] = [];

    (Object.entries(ROOSTER_CATEGORIES_META) as [Exclude<RoosterCategory, 'all'>, BreedCategoryMeta][]).forEach(([catKey, meta]) => {
      const items = filteredRoosters.filter(r => r.category === catKey);
      if (items.length > 0) {
        groups.push({ catKey, meta, items });
      }
    });

    const categorizedIds = new Set(groups.flatMap(g => g.items.map(b => b.id)));
    const uncategorized = filteredRoosters.filter(b => !categorizedIds.has(b.id));

    return { groups, uncategorized };
  }, [filteredRoosters]);

  const activeCategoryMeta = selectedCategory !== 'all' 
    ? ROOSTER_CATEGORIES_META[selectedCategory as Exclude<RoosterCategory, 'all'>] 
    : null;

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
              Explore pure indigenous bloodlines maintained at JP Farms. Browse category-wise heritage lineages, biological traits, comb anatomy, weight, and HD video documentation.
            </p>
          </div>

          {/* Quick Stats Badge */}
          <div className="flex items-center space-x-2 text-xs font-semibold bg-white border border-sky-200 px-4 py-2.5 rounded-2xl shadow-xs self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-800">
              <strong className="text-sky-700">{roosters.length} Registered Birds</strong> in {Object.keys(ROOSTER_CATEGORIES_META).length} Breeds
            </span>
          </div>
        </div>

        {/* ===============================================================
            FLIPKART-STYLE VISUAL CATEGORIES RAIL
            =============================================================== */}
        <div className="mb-5">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Explore Breed Showrooms</span>
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                {roosters.length} Registered Birds
              </span>
            </div>

            {/* Horizontal Story Avatar Row (Flipkart Category Rail) */}
            <div className="flex items-center space-x-3 sm:space-x-5 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth">
              {CATEGORY_ITEMS.map((cat) => {
                const count = categoryCounts[cat.value] || 0;
                const isSelected = selectedCategory === cat.value;
                const meta = cat.value !== 'all' ? ROOSTER_CATEGORIES_META[cat.value as Exclude<RoosterCategory, 'all'>] : null;

                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setSelectedCategory(cat.value)}
                    className="flex flex-col items-center group shrink-0 focus:outline-hidden cursor-pointer"
                  >
                    {/* Circle Avatar */}
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? 'ring-3 ring-amber-500 ring-offset-2 bg-gradient-to-br from-amber-500 to-amber-600 shadow-md scale-105'
                        : 'bg-slate-100 group-hover:bg-slate-200/80 border border-slate-200 group-hover:scale-105'
                    }`}>
                      <span className={`text-2xl sm:text-3xl transition ${isSelected ? 'scale-110' : ''}`}>
                        {cat.icon}
                      </span>

                      {/* Live Count Pill */}
                      <span className={`absolute -top-1 -right-1 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                        isSelected
                          ? 'bg-stone-950 text-amber-300 border-amber-400'
                          : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                      }`}>
                        {count}
                      </span>
                    </div>

                    {/* Category Label */}
                    <span className={`text-[11px] sm:text-xs font-bold mt-2 text-center max-w-[76px] sm:max-w-[88px] leading-tight line-clamp-2 transition ${
                      isSelected ? 'text-amber-600 font-black' : 'text-slate-600 group-hover:text-slate-900'
                    }`}>
                      {meta?.shortName || cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===============================================================
            CLEAN FLIPKART-STYLE SEARCH & SORT BAR
            =============================================================== */}
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Tag ID (e.g. JP-AS-101), breed name, comb type..."
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:bg-white focus:border-amber-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">Sort:</span>
            <div className="relative flex items-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-8 pr-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500 cursor-pointer transition"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="weight">Heaviest Weight</option>
                <option value="height">Tallest Height</option>
                <option value="newest">Newly Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selected Breed Showroom Banner (when viewing a specific breed) */}
        {activeCategoryMeta && (
          <div className="mb-8 bg-gradient-to-r from-stone-950 via-slate-900 to-stone-900 text-white rounded-3xl p-6 sm:p-7 border border-amber-500/20 shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="flex items-center space-x-1 text-xs font-bold text-amber-300 hover:text-amber-200 bg-white/10 hover:bg-white/15 px-3 py-1 rounded-xl transition cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Heritage Breeds</span>
                  </button>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    Series: {activeCategoryMeta.tagPrefix}###
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Pure Bloodline Guaranteed</span>
                  </span>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="text-4xl sm:text-5xl">{activeCategoryMeta.icon}</span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {activeCategoryMeta.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-300 font-semibold">
                      {activeCategoryMeta.tagline}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed pt-1">
                  {activeCategoryMeta.description}
                </p>
              </div>

              <div className="bg-stone-900/90 border border-white/10 rounded-2xl p-4 shrink-0 flex items-center space-x-4 self-start md:self-auto">
                <div className="text-center px-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Living Specimens</p>
                  <p className="text-2xl font-black text-amber-400">{filteredRoosters.length}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="text-center px-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Breeding Unit</p>
                  <p className="text-xs font-bold text-emerald-400">Vaccinated & Certified</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Counter & Active Filters Reset */}
        <div className="flex items-center justify-between mb-6 text-xs text-stone-500">
          <p>
            Showing <strong className="text-stone-900">{filteredRoosters.length}</strong> {filteredRoosters.length === 1 ? 'bird' : 'birds'}
            {selectedCategory !== 'all' && ` in ${activeCategoryMeta?.name || selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="flex items-center space-x-1 text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Rooster Grid / Category Shelves View */}
        {filteredRoosters.length > 0 ? (
          selectedCategory === 'all' && !searchQuery.trim() ? (
            /* ===============================================================
               CATEGORY-WISE HERITAGE SHELVES (When browsing All Breeds)
               =============================================================== */
            <div className="space-y-12">
              {groupedByShelf.groups.map(({ catKey, meta, items }) => (
                <div key={catKey} className="space-y-4 pt-4 first:pt-0">
                  {/* Category Shelf Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-slate-100">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-200">
                        {meta.icon}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                            {meta.name}
                          </h3>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            {meta.tagPrefix}###
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {meta.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-start sm:self-auto">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {items.length} {items.length === 1 ? 'Specimen' : 'Specimens'} Available
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(catKey)}
                        className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1 hover:underline cursor-pointer"
                      >
                        <span>View {meta.shortName} Lineage</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Shelf Roosters Cards */}
                  <div 
                    className={
                      viewMode === 'grid'
                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    }
                  >
                    {items.map((rooster) => (
                      <RoosterCard
                        key={rooster.id}
                        rooster={rooster}
                        onSelect={onSelectRooster}
                        onOpenVideo={onOpenVideo}
                        onInquire={onInquire}
                        onBuyNow={onBuyNow}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Uncategorized birds if any */}
              {groupedByShelf.uncategorized.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-lg font-black text-slate-900">Additional Heritage Specimens</h3>
                  <div 
                    className={
                      viewMode === 'grid'
                        ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
                        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                    }
                  >
                    {groupedByShelf.uncategorized.map((rooster) => (
                      <RoosterCard
                        key={rooster.id}
                        rooster={rooster}
                        onSelect={onSelectRooster}
                        onOpenVideo={onOpenVideo}
                        onInquire={onInquire}
                        onBuyNow={onBuyNow}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Standard Grid for Single Category or Search Query */
            <div 
              className={
                viewMode === 'grid'
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              }
            >
              {filteredRoosters.map((rooster) => (
                <RoosterCard
                  key={rooster.id}
                  rooster={rooster}
                  onSelect={onSelectRooster}
                  onOpenVideo={onOpenVideo}
                  onInquire={onInquire}
                  onBuyNow={onBuyNow}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )
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
              className="bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-stone-800 transition cursor-pointer"
            >
              View All Registered Birds
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
