'use client';

import React from 'react';

interface RoosterCatalogSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export const RoosterCatalogSkeleton: React.FC<RoosterCatalogSkeletonProps> = ({
  viewMode = 'grid',
  count = 8,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 animate-pulse">
        {items.map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-2xs"
          >
            {/* Image Placeholder */}
            <div className="relative aspect-square sm:aspect-[4/5] w-full bg-slate-200">
              <div className="absolute top-2 left-2 w-14 h-4 bg-slate-300 rounded" />
              <div className="absolute top-2 right-2 w-16 h-4 bg-slate-300 rounded" />
              <div className="absolute bottom-2 left-2 w-10 h-4 bg-slate-300 rounded" />
            </div>

            {/* Info Placeholder */}
            <div className="p-3 space-y-2.5">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-5 bg-slate-200 rounded w-16" />
                <div className="h-3 bg-slate-100 rounded w-10" />
              </div>
              <div className="h-8 bg-slate-200 rounded-xl w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
      {items.map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-xs"
        >
          {/* Image Placeholder */}
          <div className="relative aspect-[4/3] w-full bg-slate-200">
            <div className="absolute top-3 left-3 w-16 h-5 bg-slate-300 rounded" />
            <div className="absolute top-3 right-3 w-20 h-5 bg-slate-300 rounded" />
          </div>

          {/* Body Placeholder */}
          <div className="p-5 space-y-3">
            <div className="h-5 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-100 rounded w-1/3" />
            <div className="grid grid-cols-3 gap-2 py-3">
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
              <div className="h-10 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-4/5" />
            <div className="h-10 bg-slate-200 rounded-xl w-full mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
};
