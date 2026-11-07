'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  PlayCircle, 
  Award, 
  Sparkles, 
  Calendar, 
  Flame,
  Sun,
  ShieldCheck, 
  ArrowRight,
  Pause,
  Play,
  Zap,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  Feather,
  Video
} from 'lucide-react';
import { FARM_INFO } from '@/lib/data';

export interface BannerSlide {
  id: number;
  tagline: string;
  badge: string;
  badgeGradient: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  heroImage: string;
  videoUrl: string;
  bgGradient: string;
  glowColor: string;
  glowClass: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryAction: 'reels' | 'visit';
  pillBadges: { icon: any; text: string; bg: string }[];
  specs: { label: string; value: string }[];
  dietHighlight: string;
  roosterType: 'aseel' | 'kadaknath' | 'kagar' | 'stud' | 'sanctuary';
}

const BANNERS_3D: BannerSlide[] = [
  {
    id: 1,
    tagline: 'ROYAL INDIAN GAMEFOWL • 100% PURE BLOODLINE',
    badge: '👑 Champion Sire Bloodline',
    badgeGradient: 'from-amber-400 via-orange-500 to-rose-500',
    titlePrefix: 'The Undisputed King of India:',
    titleHighlight: 'Pure Royal Aseel',
    description: 'Bred for majesty, bone density, and ancient fighting spirit. Standing proud at 26 inches with golden fire plumage, compact pea combs, and unbreakable natural stamina.',
    heroImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rooster-crowing-in-the-morning-42544-large.mp4',
    bgGradient: 'from-amber-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    glowClass: 'from-amber-500/30 to-orange-500/10',
    primaryButtonText: 'Explore Aseel Gallery',
    primaryButtonLink: '#showcase',
    secondaryButtonText: 'Watch Stance Reels',
    secondaryAction: 'reels',
    pillBadges: [
      { icon: Flame, text: 'Alpha Upright Stance', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { icon: Award, text: '2026 Champion Pedigree', bg: 'bg-orange-500/20 text-orange-300 border-orange-500/40' },
      { icon: Zap, text: 'Dense Bone Anatomy', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    ],
    specs: [
      { label: 'Height', value: '26 Inches' },
      { label: 'Weight', value: '3.85 Kg' },
      { label: 'Comb', value: 'Compact Pea' },
    ],
    dietHighlight: 'Traditional Sprouted Pearl Millet (Bajra) & Almond Mash',
    roosterType: 'aseel',
  },
  {
    id: 2,
    tagline: 'SACRED TRIBAL HERITAGE • 100% NATURAL MELANIN',
    badge: '🌿 Pure Jhabua Kadaknath',
    badgeGradient: 'from-purple-500 via-indigo-500 to-cyan-500',
    titlePrefix: 'The Black Diamond of Nature:',
    titleHighlight: 'Original Kadaknath',
    description: 'The ancient Kali Masi bloodline with 100% pure black skin, tongue, and bones. Iridescent emerald-purple luster, legendary medicinal vigor, and uncompromised genetic purity.',
    heroImage: 'https://images.unsplash.com/photo-1589332278453-611a91e5e04d?auto=format&fit=crop&w=1200&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chicken-walking-freely-in-a-farm-42545-large.mp4',
    bgGradient: 'from-purple-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    glowClass: 'from-purple-500/30 to-cyan-500/10',
    primaryButtonText: 'View Kadaknath Strains',
    primaryButtonLink: '#showcase',
    secondaryButtonText: 'Schedule Farm Visit',
    secondaryAction: 'visit',
    pillBadges: [
      { icon: Sparkles, text: '100% Melanin Pure', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
      { icon: ShieldCheck, text: 'Zero Antibiotic Raised', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
      { icon: Sun, text: 'High Immunity Line', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    ],
    specs: [
      { label: 'Height', value: '21 Inches' },
      { label: 'Weight', value: '2.35 Kg' },
      { label: 'Comb', value: 'Jet Black Pea' },
    ],
    dietHighlight: 'Organic Neem Greens, Sprouted Ragi & Pearl Millet',
    roosterType: 'kadaknath',
  },
  {
    id: 3,
    tagline: 'HEAVYWEIGHT TITAN • MASSIVE BONE STRUCTURE',
    badge: '⚡ Aseel Kagar Stud Champion',
    badgeGradient: 'from-emerald-400 via-teal-500 to-amber-500',
    titlePrefix: 'Towering Heavyweight Power:',
    titleHighlight: 'Aseel Kagar Titan',
    description: 'Imposing coal-black plumage with shimmering emerald metallic sheen. Exceptional bone spread, razor-sharp alertness, and fearless commanding presence in the paddock.',
    heroImage: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=1200&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rooster-crowing-in-the-morning-42544-large.mp4',
    bgGradient: 'from-emerald-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    glowClass: 'from-emerald-500/30 to-amber-500/10',
    primaryButtonText: 'Inspect Heavyweight Bloodlines',
    primaryButtonLink: '#showcase',
    secondaryButtonText: 'Watch Stance Reels',
    secondaryAction: 'reels',
    pillBadges: [
      { icon: Zap, text: '4.10 Kg Heavyweight', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
      { icon: Award, text: '27.5" Standing Height', bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
      { icon: Flame, text: 'Emerald Metallic Sheen', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    ],
    specs: [
      { label: 'Height', value: '27.5 Inches' },
      { label: 'Weight', value: '4.10 Kg' },
      { label: 'Comb', value: 'Tight Walnut' },
    ],
    dietHighlight: 'Soaked Whole Wheat, Crushed Almonds, Garlic Greens',
    roosterType: 'kagar',
  },
  {
    id: 4,
    tagline: 'UNFILTERED 4K BROADCAST • DIRECT FROM THE PADDOCK',
    badge: '📹 JP Rooster TV Broadcast',
    badgeGradient: 'from-rose-500 via-pink-500 to-amber-500',
    titlePrefix: 'Real Posture in Motion:',
    titleHighlight: 'HD Video Cinema Reels',
    description: 'Inspect gait, crowing resonance, alertness, and aggressive balance in full motion. Every registered rooster is documented in authentic, unedited high definition.',
    heroImage: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=1200&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chicken-walking-freely-in-a-farm-42545-large.mp4',
    bgGradient: 'from-rose-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    glowClass: 'from-rose-500/30 to-amber-500/10',
    primaryButtonText: 'Watch Rooster TV Now',
    primaryButtonLink: '#showcase',
    secondaryButtonText: 'Open Full Reels Player',
    secondaryAction: 'reels',
    pillBadges: [
      { icon: PlayCircle, text: '1080p HD Stance Reels', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
      { icon: Zap, text: 'Authentic Crowing Audio', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
      { icon: Award, text: 'Verified Leg Tag IDs', bg: 'bg-pink-500/20 text-pink-300 border-pink-500/40' },
    ],
    specs: [
      { label: 'Documented', value: '350+ Birds' },
      { label: 'Video Proof', value: '100% Unedited' },
      { label: 'Audio', value: 'Live Crowing' },
    ],
    dietHighlight: '100% Natural Sprouted Grain Organic Diet',
    roosterType: 'stud',
  },
  {
    id: 5,
    tagline: 'PREMIER CONSERVATION ESTATE • OPEN 7 DAYS A WEEK',
    badge: '📍 Highway 65 Living Estate',
    badgeGradient: 'from-cyan-400 via-blue-500 to-purple-600',
    titlePrefix: 'Experience Heritage in Person:',
    titleHighlight: 'Visitors Welcome Daily',
    description: 'Visit our open-air breeding paddocks daily from 7:00 AM to 7:00 PM. Observe majestic champion studs up close, discuss bloodline genetics with our master breeder, and enjoy scenic rural hospitality.',
    heroImage: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=85',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rooster-crowing-in-the-morning-42544-large.mp4',
    bgGradient: 'from-blue-950/80 via-stone-950 to-stone-950',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    glowClass: 'from-blue-500/30 to-purple-500/10',
    primaryButtonText: 'Plan Your Farm Visit',
    primaryButtonLink: '#visit-guide',
    secondaryButtonText: 'Schedule Appointment',
    secondaryAction: 'visit',
    pillBadges: [
      { icon: Sun, text: 'NH 65 Valley Corridor', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
      { icon: Calendar, text: '7:00 AM – 7:00 PM Daily', bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
      { icon: Award, text: 'Master Breeder Guided Tour', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    ],
    specs: [
      { label: 'Legacy', value: '9+ Years' },
      { label: 'Breeding Lines', value: '12 Programs' },
      { label: 'Pasture Area', value: 'Natural Sun' },
    ],
    dietHighlight: 'Traditional Sprouted Pearl Millet, Boiled Eggs & Herbal Vitality Tonics',
    roosterType: 'sanctuary',
  },
];

interface Grain3D {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
  bounces: number;
  settled: boolean;
  eaten: boolean;
}

interface Banner3DShowcaseProps {
  onOpenReels?: () => void;
  onScheduleVisit?: () => void;
}

export const Banner3DShowcase: React.FC<Banner3DShowcaseProps> = ({
  onOpenReels,
  onScheduleVisit,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [grainsEaten, setGrainsEaten] = useState(8);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPecking, setIsPecking] = useState(false);
  const [roosterX, setRoosterX] = useState(40); // 0-100% position on pasture
  const [facing, setFacing] = useState<1 | -1>(1); // 1 = right, -1 = left
  const [eatenEffect, setEatenEffect] = useState<{ id: number; x: number; y: number } | null>(null);

  // 3D Parallax Tilt state
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  // Grains on the 3D pasture
  const [grains, setGrains] = useState<Grain3D[]>([
    { id: 1, x: 28, y: 76, vx: 0, vy: 0, rotation: 15, scale: 1, bounces: 3, settled: true, eaten: false },
    { id: 2, x: 38, y: 78, vx: 0, vy: 0, rotation: 42, scale: 0.9, bounces: 3, settled: true, eaten: false },
    { id: 3, x: 50, y: 75, vx: 0, vy: 0, rotation: 80, scale: 1.1, bounces: 3, settled: true, eaten: false },
    { id: 4, x: 62, y: 79, vx: 0, vy: 0, rotation: -25, scale: 1, bounces: 3, settled: true, eaten: false },
    { id: 5, x: 74, y: 77, vx: 0, vy: 0, rotation: 65, scale: 0.95, bounces: 3, settled: true, eaten: false },
  ]);

  const current = BANNERS_3D[currentSlide];

  // Web Audio Synthesizer for organic wooden peck tap sound
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
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Handle Mouse Tilt across 3D Stage
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  // Toss fresh 3D sprouted grains on click
  const handlePaddockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const newGrains: Grain3D[] = [];
    const count = 4;
    for (let i = 0; i < count; i++) {
      newGrains.push({
        id: Date.now() + i,
        x: Math.max(15, Math.min(85, clickX + (Math.random() - 0.5) * 12)),
        y: Math.max(72, Math.min(82, clickY + (Math.random() - 0.5) * 8)),
        vx: (Math.random() - 0.5) * 2,
        vy: -2,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.35,
        bounces: 0,
        settled: true,
        eaten: false,
      });
    }

    setGrains((prev) => [...prev.slice(-12), ...newGrains]);
  };

  // Artificial Rooster Life Cycle Loop: "The Rooster come and eat the grains"
  useEffect(() => {
    const interval = setInterval(() => {
      // Find nearest uneaten grain
      const uneaten = grains.filter((g) => !g.eaten);
      if (uneaten.length === 0) {
        // Automatically scatter 3 fresh grains so the 3D scene stays dynamic
        setGrains([
          { id: Date.now() + 1, x: 32 + Math.random() * 8, y: 77, vx: 0, vy: 0, rotation: 15, scale: 1, bounces: 3, settled: true, eaten: false },
          { id: Date.now() + 2, x: 52 + Math.random() * 8, y: 76, vx: 0, vy: 0, rotation: 45, scale: 1, bounces: 3, settled: true, eaten: false },
          { id: Date.now() + 3, x: 68 + Math.random() * 8, y: 78, vx: 0, vy: 0, rotation: 75, scale: 1, bounces: 3, settled: true, eaten: false },
        ]);
        return;
      }

      // Pick target grain
      const target = uneaten[0];
      const targetX = target.x;

      // 1. Move Rooster towards grain ("Rooster comes")
      setRoosterX((currentX) => {
        const dx = targetX - currentX;
        if (Math.abs(dx) > 6) {
          setFacing(dx >= 0 ? 1 : -1);
          return currentX + Math.sign(dx) * 4;
        } else {
          // 2. Close enough: Peck and Eat the grain!
          setIsPecking(true);
          setTimeout(() => {
            playPeckAudio();
            setGrains((prev) =>
              prev.map((g) => (g.id === target.id ? { ...g, eaten: true } : g))
            );
            setGrainsEaten((cnt) => cnt + 1);
            setEatenEffect({ id: target.id, x: target.x, y: target.y });
            setTimeout(() => setEatenEffect(null), 800);
            setIsPecking(false);
          }, 450);
          return currentX;
        }
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [grains, playPeckAudio]);

  // Auto-Slide Cycle (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS_3D.length);
    }, 12000); // 12 seconds per slide
    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsVideoMode(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS_3D.length);
    setIsVideoMode(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS_3D.length) % BANNERS_3D.length);
    setIsVideoMode(false);
  };

  return (
    <section 
      className="relative w-full bg-stone-950 text-white overflow-hidden border-b border-stone-800 select-none min-h-[620px] lg:min-h-[700px] flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* 3D Atmospheric Background Mesh & Radial Jewel Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Dynamic Glowing Sphere matching current 3D slide */}
        <div 
          className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full blur-[140px] transition-all duration-1000 ease-in-out opacity-65"
          style={{ backgroundColor: current.glowColor }}
        ></div>
        <div 
          className="absolute -bottom-32 -right-32 w-[40rem] h-[40rem] rounded-full blur-[150px] transition-all duration-1000 ease-in-out opacity-55"
          style={{ backgroundColor: current.glowColor }}
        ></div>
        {/* Subtle 3D Radial Grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]"></div>
      </div>

      {/* Main 3D Interactive Stage Container */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 flex-1 flex flex-col justify-between">
        
        {/* Top Header: Heritage Strain Tagline & Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          
          {/* Glass Pill with Live Indicator */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-stone-900/80 border border-white/15 backdrop-blur-xl shadow-2xl">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
              {current.tagline}
            </span>
          </div>

          {/* Slide Indicator & Live Pause/Play */}
          <div className="flex items-center space-x-3 bg-stone-900/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 shadow-xl text-xs font-mono">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <span>0{currentSlide + 1}</span>
              <span className="text-stone-600">/</span>
              <span className="text-stone-400">0{BANNERS_3D.length}</span>
            </div>

            <div className="h-3 w-px bg-stone-700"></div>

            <button 
              type="button"
              onClick={() => setIsPaused(!isPaused)} 
              className="text-stone-400 hover:text-white transition p-0.5 rounded flex items-center space-x-1"
              title={isPaused ? "Resume 3D Slide Carousel" : "Pause 3D Slide Carousel"}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-stone-300">Paused</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] text-stone-300">Auto</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* 3D Showcase Grid: Left Column Headline & Right Column 3D Diorama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-6">
          
          {/* Left Column: Bold Headline, Verified Badges & Action Buttons */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Luminous Breed Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-stone-900 to-stone-950 border border-white/20 backdrop-blur-md shadow-2xl">
              <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${current.badgeGradient}`}></span>
              <span className="text-xs font-black tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300">
                {current.badge}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
              <span className="text-stone-300 font-extrabold text-2xl sm:text-4xl block mb-2">
                {current.titlePrefix}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 drop-shadow-[0_10px_25px_rgba(245,158,11,0.3)]">
                {current.titleHighlight}
              </span>
            </h1>

            {/* Cinematic Subtitle */}
            <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed font-normal">
              {current.description}
            </p>

            {/* Breed Trust Checkmarks */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {current.pillBadges.map((pill, pIdx) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={pIdx}
                    className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold backdrop-blur-md shadow-lg ${pill.bg}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pill.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Specifications Cards Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-md pt-2">
              {current.specs.map((spec, sIdx) => (
                <div key={sIdx} className="p-2.5 rounded-xl bg-stone-900/80 border border-white/10 text-center backdrop-blur-md">
                  <p className="text-[10px] text-stone-400 uppercase font-semibold">{spec.label}</p>
                  <p className="text-sm font-bold text-white mt-0.5">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <a
                href={current.primaryButtonLink}
                className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-7 py-4 rounded-2xl text-sm transition-all duration-200 shadow-2xl shadow-amber-950/80 hover:scale-105 active:scale-95"
              >
                <span>{current.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              {current.secondaryAction === 'reels' && onOpenReels && (
                <button
                  type="button"
                  onClick={onOpenReels}
                  className="inline-flex items-center space-x-2 bg-stone-900/80 hover:bg-stone-800 text-white font-bold px-6 py-4 rounded-2xl text-sm border border-white/20 hover:border-amber-400/60 backdrop-blur-xl transition-all duration-200 shadow-xl"
                >
                  <PlayCircle className="w-5 h-5 text-amber-400" />
                  <span>{current.secondaryButtonText}</span>
                </button>
              )}

              {current.secondaryAction === 'visit' && onScheduleVisit && (
                <button
                  type="button"
                  onClick={onScheduleVisit}
                  className="inline-flex items-center space-x-2 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold px-6 py-4 rounded-2xl text-sm border border-emerald-400/40 backdrop-blur-xl transition-all duration-200 shadow-xl shadow-emerald-950/60"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{current.secondaryButtonText}</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: HYPER-REALISTIC 3D LIVING STAGE (ACCORDING TO WEBSITE) */}
          <div className="lg:col-span-6 flex items-center justify-center">
            
            {/* 3D Perspective Box with Interactive Parallax Tilt */}
            <div 
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-lg aspect-[4/3] sm:aspect-[16/11] [perspective:1200px] cursor-pointer group"
              style={{
                filter: 'drop-shadow(0 25px 45px rgba(0, 0, 0, 0.8))',
              }}
            >
              
              {/* Dynamic Aura Glow in background */}
              <div 
                className="absolute -inset-4 rounded-3xl blur-3xl opacity-50 transition-all duration-1000 group-hover:opacity-75 pointer-events-none"
                style={{ backgroundColor: current.glowColor }}
              ></div>

              {/* Main 3D Preserved Layer Card with Physical Tilt */}
              <div 
                className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl transition-transform duration-200 ease-out [transform-style:preserve-3d]"
                style={{
                  transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
                  background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 100%)',
                }}
              >
                
                {/* 3D Specular Light Reflection Glare */}
                <div 
                  className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-300 opacity-60 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`,
                  }}
                ></div>

                {/* LAYER 1: Deep Paddock Environment & Sky (translateZ(-20px)) */}
                <div 
                  className="absolute inset-0 [transform:translateZ(-20px)_scale(1.08)] overflow-hidden"
                >
                  <img
                    src={current.heroImage}
                    alt={current.titleHighlight}
                    className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.15] transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Paddock Ground Texture Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${current.bgGradient} opacity-70`}></div>
                </div>

                {/* LAYER 2: 3D Paddock Grass & Soil Plane with Depth */}
                <div 
                  onClick={handlePaddockClick}
                  className="absolute inset-x-0 bottom-0 h-40 [transform:translateZ(10px)] overflow-hidden cursor-crosshair"
                  title="Click anywhere to scatter sprouted bajra grains for the rooster!"
                >
                  {/* Pasture Soil & Green Blade Highlights */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2812]/95 via-[#16381b]/70 to-transparent"></div>
                  
                  {/* Subtle Wooden Fence in background */}
                  <div className="absolute top-2 inset-x-0 h-1 bg-amber-900/40"></div>
                  <div className="absolute top-8 inset-x-0 h-1 bg-amber-900/40"></div>
                  
                  {/* 3D Scattered Grains (Pearl Millet / Bajra) */}
                  {grains.map((grain) => (
                    <div
                      key={grain.id}
                      className={`absolute transition-all duration-300 pointer-events-none ${
                        grain.eaten ? 'opacity-0 scale-0 -translate-y-4' : 'opacity-100'
                      }`}
                      style={{
                        left: `${grain.x}%`,
                        top: `${grain.y}%`,
                        transform: `rotate(${grain.rotation}deg) scale(${grain.scale})`,
                      }}
                    >
                      {/* 3D Grain Shadow */}
                      <div className="w-3 h-1.5 bg-black/60 rounded-full blur-[0.5px] translate-y-1"></div>
                      {/* Golden Sprouted Bajra Kernel */}
                      <div className="w-2.5 h-3.5 -translate-y-2 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.8)] border border-amber-300/60 flex items-center justify-center">
                        <div className="w-0.5 h-2 bg-amber-700/60 rounded-full"></div>
                      </div>
                    </div>
                  ))}

                  {/* Eaten Grain Particle Burst Pop */}
                  {eatenEffect && (
                    <div
                      className="absolute pointer-events-none z-30 animate-ping"
                      style={{
                        left: `${eatenEffect.x}%`,
                        top: `${eatenEffect.y}%`,
                      }}
                    >
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] shadow-2xl whitespace-nowrap">
                        +1 Sprouted Bajra 🌾
                      </span>
                    </div>
                  )}

                  {/* Tap-to-Feed Helper Pill */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/20 text-[11px] font-medium text-amber-300 flex items-center space-x-1.5 shadow-xl">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Click pasture to toss sprouted bajra grains 🌾</span>
                  </div>

                </div>

                {/* LAYER 3: THE MAJESTIC ROOSTER (High-Resolution Animated 3D Kinematics) */}
                <div 
                  className="absolute inset-0 pointer-events-none [transform:translateZ(45px)] flex items-end justify-center pb-6"
                >
                  <div 
                    className="relative transition-all duration-700 ease-out"
                    style={{
                      left: `${roosterX - 50}%`,
                      transform: `scaleX(${facing}) ${isPecking ? 'rotate(18deg) translateY(16px)' : 'rotate(0deg)'}`,
                    }}
                  >
                    {/* Realistic Ground Contact Shadow */}
                    <div 
                      className={`w-36 h-8 bg-black/75 rounded-full blur-md mx-auto transition-transform duration-300 ${
                        isPecking ? 'scale-110 translate-y-3' : 'scale-100'
                      }`}
                    ></div>

                    {/* High-Resolution Majestic Rooster Render */}
                    <div className="relative -mt-44 w-52 h-52 flex items-center justify-center">
                      <img
                        src={current.heroImage}
                        alt="Pure Bloodline Heritage Rooster"
                        className={`w-full h-full object-cover rounded-2xl filter contrast-[1.2] brightness-[1.05] drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] border border-amber-400/30 transition-transform duration-300 ${
                          isPecking ? 'scale-105 origin-bottom' : 'animate-float-slow'
                        }`}
                        style={{
                          clipPath: 'polygon(15% 0%, 85% 0%, 100% 85%, 85% 100%, 15% 100%, 0% 85%)',
                        }}
                      />

                      {/* Animated Beak & Pecking Indicator */}
                      {isPecking && (
                        <div className="absolute bottom-2 right-4 w-4 h-4 rounded-full bg-amber-400 animate-ping"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* LAYER 4: FLOATING 3D GLASS BADGES & LINEAGE TAGS (translateZ(80px)) */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between [transform:translateZ(80px)] z-30 pointer-events-auto">
                  
                  {/* Strain Lineage Seal */}
                  <div className="px-3.5 py-1.5 rounded-xl bg-stone-950/90 backdrop-blur-xl border border-amber-400/40 text-xs font-mono font-bold text-amber-300 shadow-2xl flex items-center space-x-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>TAG: JP-{current.id === 1 ? 'AS-101' : current.id === 2 ? 'KN-204' : current.id === 3 ? 'KG-305' : 'EST-01'}</span>
                  </div>

                  {/* Mode Controls: Video Mode Toggle & Sound Toggle */}
                  <div className="flex items-center space-x-2">
                    
                    {/* Live Grains Eaten Counter */}
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-xl">
                      <span>🌾</span>
                      <span>{grainsEaten} Grains Eaten</span>
                    </div>

                    {/* Audio Toggle */}
                    <button
                      type="button"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-2 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/20 transition shadow-xl"
                      title={soundEnabled ? 'Mute Pecking Sound' : 'Enable Organic Pecking Sound'}
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                  </div>

                </div>

                {/* LAYER 5: BOTTOM 3D METRICS TRAY & DIET PROOF (translateZ(95px)) */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-stone-950/90 backdrop-blur-xl border border-white/15 shadow-2xl [transform:translateZ(95px)] z-30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Diet: 100% Traditional Pasture
                    </p>
                    <p className="text-xs font-semibold text-stone-200 truncate max-w-[260px] sm:max-w-xs">
                      {current.dietHighlight}
                    </p>
                  </div>

                  {/* Toss Grains Quick Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePaddockClick(e as any);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black shadow-lg transition active:scale-95"
                  >
                    <span>🌾</span>
                    <span>Toss Grains</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* 3D Banner Navigation Tray: 5 Bespoke Breed Selector Cards */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* 5 Slide Tabs with Real Breed Names & Glowing Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full md:w-auto">
            {BANNERS_3D.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`px-3 py-2 rounded-xl text-left transition-all duration-300 border text-xs font-bold flex items-center space-x-2 ${
                  idx === currentSlide
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/60 text-amber-300 shadow-lg shadow-amber-950/50'
                    : 'bg-stone-900/60 hover:bg-stone-800 border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                <span className="font-mono text-[10px] text-amber-400/80">0{idx + 1}</span>
                <span className="truncate">{slide.titleHighlight}</span>
              </button>
            ))}
          </div>

          {/* Previous / Next 3D Slide Arrow Controls */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              type="button"
              onClick={prevSlide}
              className="p-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/15 backdrop-blur-xl transition active:scale-90 shadow-lg"
              aria-label="Previous 3D Slide"
              title="Previous 3D Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="p-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/15 backdrop-blur-xl transition active:scale-90 shadow-lg"
              aria-label="Next 3D Slide"
              title="Next 3D Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
