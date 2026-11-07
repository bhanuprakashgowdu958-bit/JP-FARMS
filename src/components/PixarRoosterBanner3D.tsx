'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface PixarRoosterBanner3DProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
}

export const PixarRoosterBanner3D: React.FC<PixarRoosterBanner3DProps> = () => {
  const [grainsEaten, setGrainsEaten] = useState(16);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [droppedGrains, setDroppedGrains] = useState<{ id: number; x: number; y: number }[]>([]);
  const [feedAlert, setFeedAlert] = useState<string | null>(null);

  // Web Audio Synthesizer for gentle audio
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playPeckAudio = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Toss Grains on click
  const handleTossGrains = (e?: React.MouseEvent) => {
    playPeckAudio();
    setGrainsEaten((c) => c + 4);
    setFeedAlert('+4 Sprouted Bajra Grains 🌾');

    const clickX = e ? e.clientX : window.innerWidth * 0.65;
    const clickY = e ? e.clientY : 300;

    const newGrains = [
      { id: Date.now() + 1, x: clickX - 25, y: clickY },
      { id: Date.now() + 2, x: clickX, y: clickY - 15 },
      { id: Date.now() + 3, x: clickX + 25, y: clickY },
      { id: Date.now() + 4, x: clickX + 10, y: clickY + 20 },
    ];
    setDroppedGrains(newGrains);

    setTimeout(() => {
      setDroppedGrains([]);
      setFeedAlert(null);
    }, 1800);
  };

  return (
    <section 
      onClick={handleTossGrains}
      className="relative w-full aspect-[16/9] min-h-[480px] sm:min-h-[580px] lg:min-h-[720px] max-h-[88vh] overflow-hidden select-none border-b border-stone-800 bg-stone-950 cursor-pointer group"
      title="Click anywhere to scatter sprouted bajra grains for the rooster!"
    >
      {/* TOTAL SCREEN HERO BANNER IMAGE (PURE VISUAL - NO WORDS OVERLAY) */}
      <img
        src="/banners/main_hero_banner.jpg"
        alt="JP Farms Sunrise Morning Crow Rooster Banner"
        className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.04] transition-transform duration-700 group-hover:scale-[1.01]"
      />

      {/* Floating Grain Particles on User Click */}
      {droppedGrains.map((g) => (
        <div
          key={g.id}
          className="fixed pointer-events-none z-50 animate-bounce"
          style={{ left: `${g.x}px`, top: `${g.y}px` }}
        >
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_12px_#f59e0b] border border-amber-200"></div>
        </div>
      ))}

      {/* Non-intrusive Minimal Interactive Grain Pill in Corner */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 bg-stone-950/70 hover:bg-stone-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-amber-300 shadow-2xl transition">
        <span>🌾</span>
        <span className="font-mono font-bold">{grainsEaten} Grains Eaten</span>
        <div className="h-3 w-px bg-white/20"></div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className="text-stone-300 hover:text-white transition p-0.5"
          title={soundEnabled ? 'Mute Audio' : 'Enable Gentle Audio'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Grain Toss Floating Alert */}
      {feedAlert && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-amber-400 text-stone-950 font-black text-xs shadow-2xl z-30 animate-bounce">
          <span>{feedAlert}</span>
        </div>
      )}
    </section>
  );
};
