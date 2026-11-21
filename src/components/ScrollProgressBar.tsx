'use client';

import { useEffect } from 'react';

export function ScrollProgressBar() {
  useEffect(() => {
    // Create the bar
    const bar = document.createElement('div');
    bar.id = 'scroll-progress-bar';
    document.body.appendChild(bar);

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      bar.remove();
    };
  }, []);

  return null;
}
