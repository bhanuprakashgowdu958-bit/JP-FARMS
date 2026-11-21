'use client';

import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — attaches an IntersectionObserver to a container ref.
 * Any child with class "reveal", "reveal-left", or "reveal-scale" inside
 * that container gets the "visible" class added when it enters the viewport.
 */
export function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = container.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-scale'
    );

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
