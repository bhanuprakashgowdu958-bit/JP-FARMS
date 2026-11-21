'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FARM_INFO } from '@/lib/data';

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
}

const STATS: StatItem[] = [
  {
    value: FARM_INFO.totalBirdsDocumented,
    suffix: '+',
    label: 'Birds Documented',
    sublabel: 'Live on Estate',
  },
  {
    value: FARM_INFO.activeBreedingLines,
    suffix: '',
    label: 'Breeding Lines',
    sublabel: 'Pure Bloodlines',
  },
  {
    value: FARM_INFO.experienceYears,
    suffix: ' Yrs',
    label: 'of Heritage Breeding',
    sublabel: `Est. ${FARM_INFO.establishedYear}`,
  },
  {
    value: 20,
    suffix: ' KM',
    label: 'Live Delivery Radius',
    sublabel: 'AC Crate Transport',
  },
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ stat, animate }: { stat: StatItem; animate: boolean }) {
  const count = useCountUp(stat.value, 1600, animate);
  return (
    <div className="flex flex-col items-center text-center px-4 py-5 sm:py-6 group">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 font-playfair leading-none">
        {stat.prefix ?? ''}
        <span className="tabular-nums">{animate ? count.toLocaleString('en-IN') : 0}</span>
        <span className="text-amber-600">{stat.suffix}</span>
      </div>
      <p className="mt-1.5 text-sm sm:text-base font-bold text-slate-800">{stat.label}</p>
      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.sublabel}</p>
    </div>
  );
}

export const StatsCounter: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired) {
          setFired(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fired]);

  return (
    <div ref={ref} className="relative bg-white border-y border-amber-100 shadow-sm overflow-hidden">
      {/* Subtle warm gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50/60 via-white to-amber-50/40 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-amber-100">
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} animate={fired} />
          ))}
        </div>
      </div>

      {/* Thin amber accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
    </div>
  );
};
