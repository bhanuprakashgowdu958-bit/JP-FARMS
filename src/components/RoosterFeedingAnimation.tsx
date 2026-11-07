'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, Volume2, VolumeX, RefreshCw, Award, Heart } from 'lucide-react';

export type RoosterBreed = 'aseel' | 'kadaknath';

interface Grain {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  radius: number;
  bounces: number;
  settled: boolean;
  eaten: boolean;
  scale: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  alpha: number;
  life: number;
}

interface RoosterFeedingAnimationProps {
  initialBreed?: RoosterBreed;
  onBreedChange?: (breed: RoosterBreed) => void;
  className?: string;
}

export const RoosterFeedingAnimation: React.FC<RoosterFeedingAnimationProps> = ({
  initialBreed = 'aseel',
  onBreedChange,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [breed, setBreed] = useState<RoosterBreed>(initialBreed);
  const [grainsEaten, setGrainsEaten] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Rooster foraging in pasture...');

  // Sync with prop when slide changes
  useEffect(() => {
    if (initialBreed && initialBreed !== breed) {
      setBreed(initialBreed);
    }
  }, [initialBreed]);

  // Audio Context for synthetic, zero-asset pecking audio
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playPeckSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Realistic sharp wooden peck click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // AudioContext not supported or restricted
    }
  }, [soundEnabled]);

  const playCrowSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Soft rooster morning vocalization
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(420, now);
      osc.frequency.linearRampToValueAtTime(540, now + 0.2);
      osc.frequency.linearRampToValueAtTime(620, now + 0.4);
      osc.frequency.linearRampToValueAtTime(480, now + 0.8);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.85);
    } catch {
      // Ignore
    }
  }, [soundEnabled]);

  // Main animation state stored in ref for 60fps loop
  const simState = useRef<{
    rooster: {
      x: number;
      y: number;
      targetX: number;
      facing: number; // 1 = right, -1 = left
      state: 'entering' | 'walking' | 'inspecting' | 'pecking' | 'swallowing' | 'scratching' | 'proud' | 'idle';
      stateTimer: number;
      walkPhase: number;
      peckPhase: number;
      scratchCount: number;
      wingFlap: number;
      chestPuff: number;
      tailSway: number;
      speed: number;
      targetGrainId: number | null;
    };
    grains: Grain[];
    particles: Particle[];
    floatingTexts: FloatingText[];
    nextGrainId: number;
    groundY: number;
    width: number;
    height: number;
  }>({
    rooster: {
      x: 40,
      y: 310,
      targetX: 200,
      facing: 1,
      state: 'entering',
      stateTimer: 0,
      walkPhase: 0,
      peckPhase: 0,
      scratchCount: 0,
      wingFlap: 0,
      chestPuff: 0,
      tailSway: 0,
      speed: 1.8,
      targetGrainId: null,
    },
    grains: [],
    particles: [],
    floatingTexts: [],
    nextGrainId: 1,
    groundY: 320,
    width: 540,
    height: 380,
  });

  // Scatter grains function
  const scatterGrains = useCallback((originX?: number, originY?: number, count = 5) => {
    const sim = simState.current;
    const startX = originX ?? Math.random() * (sim.width * 0.6) + sim.width * 0.2;
    const startY = originY ?? sim.groundY - 120;

    for (let i = 0; i < count; i++) {
      const spreadX = (Math.random() - 0.5) * 60;
      const spreadY = (Math.random() - 0.5) * 20;
      const grain: Grain = {
        id: sim.nextGrainId++,
        x: Math.max(40, Math.min(sim.width - 40, startX + spreadX)),
        y: Math.min(sim.groundY - 10, startY + spreadY),
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 3.5 - 1.5,
        rotation: Math.random() * Math.PI * 2,
        radius: 3.5 + Math.random() * 1.5,
        bounces: 0,
        settled: false,
        eaten: false,
        scale: 1,
      };
      sim.grains.push(grain);
    }

    // Add toss particles
    for (let p = 0; p < 8; p++) {
      sim.particles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        size: Math.random() * 2 + 1,
        color: '#f59e0b',
        alpha: 1,
        life: 0,
        maxLife: 30,
      });
    }

    // Wake up rooster if proud or idle
    if (sim.rooster.state === 'proud' || sim.rooster.state === 'idle') {
      sim.rooster.state = 'walking';
      sim.rooster.stateTimer = 0;
    }

    setStatusMessage('Fresh bajra grains tossed! Rooster is coming...');
  }, []);

  // Initialize pasture with initial scattered grains
  useEffect(() => {
    const sim = simState.current;
    if (sim.grains.length === 0) {
      // Scatter initial 7 grains along pasture ground
      const samplePositions = [140, 180, 220, 290, 340, 390, 440];
      samplePositions.forEach((posX, idx) => {
        sim.grains.push({
          id: sim.nextGrainId++,
          x: posX + (Math.random() - 0.5) * 25,
          y: sim.groundY + Math.random() * 6 - 3,
          vx: 0,
          vy: 0,
          rotation: Math.random() * Math.PI,
          radius: 3.5 + (idx % 3) * 0.5,
          bounces: 2,
          settled: true,
          eaten: false,
          scale: 1,
        });
      });
    }
  }, []);

  // Main Canvas Render & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height || 420);

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      simState.current.width = w;
      simState.current.height = h;
      simState.current.groundY = h * 0.76;
      simState.current.rooster.y = simState.current.groundY;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // ==========================================
    // DRAWING HELPER FUNCTIONS
    // ==========================================

    const drawEnvironment = (sim: typeof simState.current) => {
      const { width, height, groundY } = sim;

      // 1. Pastoral Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      if (breed === 'kadaknath') {
        skyGrad.addColorStop(0, '#0f172a');
        skyGrad.addColorStop(0.6, '#1e1b4b');
        skyGrad.addColorStop(1, '#2e1065');
      } else {
        skyGrad.addColorStop(0, '#1c1917');
        skyGrad.addColorStop(0.5, '#292524');
        skyGrad.addColorStop(1, '#451a03');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, groundY);

      // 2. Ambient Morning Sunlight Glow
      const sunGrad = ctx.createRadialGradient(width * 0.8, 60, 10, width * 0.8, 60, width * 0.7);
      sunGrad.addColorStop(0, breed === 'kadaknath' ? 'rgba(168, 85, 247, 0.35)' : 'rgba(245, 158, 11, 0.45)');
      sunGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.15)');
      sunGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, groundY);

      // 3. Wooden Paddock Fence in Background
      ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)';
      ctx.lineWidth = 4;
      // Horizontal rails
      ctx.beginPath();
      ctx.moveTo(0, groundY - 50);
      ctx.lineTo(width, groundY - 50);
      ctx.moveTo(0, groundY - 26);
      ctx.lineTo(width, groundY - 26);
      ctx.stroke();

      // Vertical fence posts
      const postSpacing = 90;
      for (let px = 30; px < width; px += postSpacing) {
        ctx.fillStyle = 'rgba(120, 53, 15, 0.5)';
        ctx.fillRect(px, groundY - 65, 8, 65);
        // Post cap
        ctx.beginPath();
        ctx.moveTo(px - 1, groundY - 65);
        ctx.lineTo(px + 4, groundY - 72);
        ctx.lineTo(px + 9, groundY - 65);
        ctx.fillStyle = 'rgba(180, 83, 9, 0.6)';
        ctx.fill();
      }

      // 4. Ground: Rich Pasture Grass & Soil
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
      if (breed === 'kadaknath') {
        groundGrad.addColorStop(0, '#14532d');
        groundGrad.addColorStop(0.2, '#0f391e');
        groundGrad.addColorStop(1, '#052010');
      } else {
        groundGrad.addColorStop(0, '#15803d');
        groundGrad.addColorStop(0.25, '#166534');
        groundGrad.addColorStop(0.7, '#1e3a1e');
        groundGrad.addColorStop(1, '#142315');
      }
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, width, height - groundY);

      // 5. Grass Tufts along Horizon Line
      ctx.fillStyle = breed === 'kadaknath' ? '#22c55e' : '#4ade80';
      for (let gx = 10; gx < width; gx += 18) {
        const gh = 6 + ((gx * 7) % 7);
        ctx.beginPath();
        ctx.moveTo(gx, groundY);
        ctx.quadraticCurveTo(gx + 3, groundY - gh, gx + 6, groundY);
        ctx.fill();
      }
    };

    const drawGrains = (sim: typeof simState.current) => {
      sim.grains.forEach((grain) => {
        if (grain.eaten) return;

        ctx.save();
        ctx.translate(grain.x, grain.y);
        ctx.rotate(grain.rotation);

        // Ground Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(1, 2, grain.radius * 1.1, grain.radius * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Authentic Pearl Millet / Bajra Grain (Golden Oval Seed)
        const grainGrad = ctx.createRadialGradient(-1, -1, 0.5, 0, 0, grain.radius);
        grainGrad.addColorStop(0, '#fef08a'); // golden bright center
        grainGrad.addColorStop(0.4, '#f59e0b'); // amber bajra tone
        grainGrad.addColorStop(0.85, '#d97706'); // toasted husk
        grainGrad.addColorStop(1, '#92400e'); // seed edge

        ctx.fillStyle = grainGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, grain.radius, grain.radius * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();

        // Seed center cleft line
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-grain.radius * 0.6, 0);
        ctx.lineTo(grain.radius * 0.6, 0);
        ctx.stroke();

        ctx.restore();
      });
    };

    // Draw the Indian Heritage Rooster with authentic anatomy
    const drawRooster = (sim: typeof simState.current) => {
      const r = sim.rooster;
      ctx.save();
      ctx.translate(r.x, r.y);
      ctx.scale(r.facing, 1);

      // Color scheme based on strain
      const isKadak = breed === 'kadaknath';

      // Colors
      const combColor = isKadak ? '#1f1a24' : '#dc2626';
      const combHighlight = isKadak ? '#3b2d4a' : '#ef4444';
      const wattleColor = isKadak ? '#17131b' : '#b91c1c';
      const beakColor = isKadak ? '#1c1917' : '#f59e0b';
      const eyeIris = isKadak ? '#2e1065' : '#f97316';
      const legColor = isKadak ? '#27272a' : '#d97706';
      const legHighlight = isKadak ? '#3f3f46' : '#fbbf24';

      // Plumage colors
      const bodyBase = isKadak ? '#09090b' : '#142218';
      const hackleTop = isKadak ? '#1e1b4b' : '#f59e0b';
      const hackleMid = isKadak ? '#2e1065' : '#ea580c';
      const hackleBottom = isKadak ? '#09090b' : '#991b1b';
      const wingCovert = isKadak ? '#18181b' : '#7f1d1d';
      const tailColor1 = isKadak ? '#030712' : '#064e3b';
      const tailColor2 = isKadak ? '#1e1b4b' : '#022c22';
      const tailHighlight = isKadak ? '#3b0764' : '#10b981';

      // Dynamic kinematics variables
      const isWalking = r.state === 'walking' || r.state === 'entering';
      const isPecking = r.state === 'pecking';
      const isSwallowing = r.state === 'swallowing';
      const isScratching = r.state === 'scratching';
      const isProud = r.state === 'proud';

      // Head / Neck offsets based on states
      let headX = 35;
      let headY = -85;
      let bodyRot = 0;
      let beakOpen = 0;

      if (isWalking) {
        // Avian Head-Bob: head reaches forward, body catches up
        headX += Math.sin(r.walkPhase * 2) * 5;
        headY += Math.cos(r.walkPhase * 2) * 3;
        bodyRot = Math.sin(r.walkPhase) * 0.04;
      } else if (isPecking) {
        // Downward peck plunge!
        const progress = Math.sin(r.peckPhase * Math.PI); // 0 -> 1 -> 0
        headX = 25 + progress * 20;
        headY = -85 + progress * 72; // head goes all the way down to ground!
        bodyRot = progress * 0.38; // body dips forward
        beakOpen = progress > 0.4 && progress < 0.85 ? 12 : 0;
      } else if (isSwallowing) {
        // Nibble and swallow ripple
        headX = 30;
        headY = -82 + Math.sin(r.stateTimer * 0.4) * 4;
        beakOpen = Math.sin(r.stateTimer * 0.5) > 0 ? 5 : 0;
      } else if (isScratching) {
        headX = 30;
        headY = -70;
        bodyRot = 0.15;
      } else if (isProud) {
        // High majestic standing stance
        headX = 32;
        headY = -95;
        bodyRot = -0.1;
      }

      // ----------------------------------------
      // 1. LEGS & CLAWS (Behind & Front)
      // ----------------------------------------
      const drawLeg = (isFront: boolean) => {
        const phaseOffset = isFront ? 0 : Math.PI;
        let hipX = isFront ? 4 : -10;
        let hipY = -35 + Math.sin(r.walkPhase) * 2;

        let kneeX = hipX + (isFront ? 6 : -4);
        let kneeY = -20;
        let ankleX = hipX + (isFront ? 4 : -2);
        let ankleY = -2;
        let footX = ankleX + 6;
        let footY = 0;

        if (isWalking) {
          const legPhase = r.walkPhase + phaseOffset;
          const swing = Math.sin(legPhase);
          const lift = Math.max(0, -Math.cos(legPhase));

          ankleX += swing * 16;
          ankleY -= lift * 18;
          footX = ankleX + 8;
          footY = ankleY + 2;
        } else if (isScratching && isFront) {
          // Scratch back motion
          const scratch = Math.sin(r.stateTimer * 0.8);
          ankleX -= scratch * 15;
          footX -= scratch * 18;
        }

        ctx.save();
        ctx.strokeStyle = isFront ? legHighlight : legColor;
        ctx.lineWidth = isFront ? 4.5 : 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Upper thigh
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(ankleX, ankleY);
        ctx.stroke();

        // Authentic Gamefowl Spur (Pointing backward on shank)
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ankleX, ankleY - 4);
        ctx.lineTo(ankleX - 7, ankleY - 8);
        ctx.stroke();

        // 3 Front Claws & 1 Back Claw
        ctx.strokeStyle = isFront ? legHighlight : legColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        // Middle toe
        ctx.moveTo(ankleX, ankleY);
        ctx.lineTo(footX + 7, footY);
        // Outer toe
        ctx.moveTo(ankleX, ankleY);
        ctx.lineTo(footX + 5, footY + 2);
        // Inner toe
        ctx.moveTo(ankleX, ankleY);
        ctx.lineTo(footX + 5, footY - 2);
        // Hind toe
        ctx.moveTo(ankleX, ankleY);
        ctx.lineTo(ankleX - 6, footY);
        ctx.stroke();

        ctx.restore();
      };

      // Draw Back Leg
      drawLeg(false);

      // ----------------------------------------
      // 2. TAIL: MAGNIFICENT SICKLE FEATHERS
      // ----------------------------------------
      ctx.save();
      const tailRootX = -32;
      const tailRootY = -48 + bodyRot * 20;
      const sway = Math.sin(r.walkPhase) * 6 + (isPecking ? -14 : 0);

      const sickleFeathers = [
        { length: 85, curveY: -80, angle: -0.9, width: 9, color: tailColor1 },
        { length: 78, curveY: -72, angle: -0.75, width: 8, color: tailColor2 },
        { length: 70, curveY: -60, angle: -0.6, width: 7.5, color: tailColor1 },
        { length: 60, curveY: -48, angle: -0.45, width: 6.5, color: tailHighlight },
        { length: 48, curveY: -35, angle: -0.3, width: 5.5, color: tailColor2 },
      ];

      sickleFeathers.forEach((f) => {
        ctx.beginPath();
        ctx.moveTo(tailRootX, tailRootY);
        const cp1x = tailRootX - f.length * 0.5;
        const cp1y = tailRootY + f.curveY + sway;
        const endX = tailRootX - f.length * 0.95;
        const endY = tailRootY - 10 + sway * 0.7;

        ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
        ctx.strokeStyle = f.color;
        ctx.lineWidth = f.width;
        ctx.lineCap = 'round';
        ctx.stroke();
      });
      ctx.restore();

      // ----------------------------------------
      // 3. ROBUST BODY & CHEST
      // ----------------------------------------
      ctx.save();
      ctx.rotate(bodyRot);

      // Body Egg-Shape
      ctx.fillStyle = bodyBase;
      ctx.beginPath();
      ctx.ellipse(0, -45, 34, 25, 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Layered Wing Coverts
      ctx.fillStyle = wingCovert;
      ctx.beginPath();
      ctx.ellipse(-4, -44, 24, 16, 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Wing flight feather ribs
      ctx.strokeStyle = isKadak ? '#3f3f46' : '#b45309';
      ctx.lineWidth = 1.8;
      for (let w = 0; w < 4; w++) {
        ctx.beginPath();
        ctx.moveTo(-16 + w * 6, -48);
        ctx.lineTo(-6 + w * 7, -32);
        ctx.stroke();
      }

      // Proud Muscular Breast / Chest Contour
      ctx.fillStyle = isKadak ? '#18181b' : '#1e3a1e';
      ctx.beginPath();
      ctx.arc(16, -42, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw Front Leg
      drawLeg(true);

      // ----------------------------------------
      // 4. ARCHED NECK & SHIMMERING HACKLE CAPE
      // ----------------------------------------
      ctx.save();
      // Arched Neck Path
      const neckBaseX = 14;
      const neckBaseY = -52;

      const hackleGrad = ctx.createLinearGradient(neckBaseX, neckBaseY, headX, headY);
      hackleGrad.addColorStop(0, hackleBottom);
      hackleGrad.addColorStop(0.5, hackleMid);
      hackleGrad.addColorStop(1, hackleTop);

      ctx.fillStyle = hackleGrad;
      ctx.beginPath();
      ctx.moveTo(neckBaseX - 8, neckBaseY);
      ctx.quadraticCurveTo(headX - 18, (neckBaseY + headY) / 2, headX - 6, headY + 12);
      ctx.lineTo(headX + 8, headY + 12);
      ctx.quadraticCurveTo(neckBaseX + 16, (neckBaseY + headY) / 2, neckBaseX + 14, neckBaseY);
      ctx.closePath();
      ctx.fill();

      // Hackle feather serration tips hanging over shoulders
      ctx.fillStyle = hackleTop;
      for (let h = 0; h < 5; h++) {
        const tx = neckBaseX - 10 + h * 6;
        const ty = neckBaseY + 4;
        ctx.beginPath();
        ctx.moveTo(tx, ty - 8);
        ctx.lineTo(tx + 3, ty + 4);
        ctx.lineTo(tx + 6, ty - 8);
        ctx.fill();
      }
      ctx.restore();

      // ----------------------------------------
      // 5. HEAD, COMB, BEAK, WATTLES & EYE
      // ----------------------------------------
      ctx.save();
      ctx.translate(headX, headY);

      // Head Base Oval
      ctx.fillStyle = isKadak ? '#09090b' : '#b45309';
      ctx.beginPath();
      ctx.ellipse(0, 0, 13, 10, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Aseel / Kadaknath Comb (Prominent Crown)
      ctx.fillStyle = combColor;
      ctx.beginPath();
      // Multi-lobed crest
      ctx.moveTo(-8, -8);
      ctx.quadraticCurveTo(-6, -22, -1, -21);
      ctx.quadraticCurveTo(3, -24, 7, -18);
      ctx.quadraticCurveTo(11, -21, 14, -14);
      ctx.lineTo(9, -6);
      ctx.closePath();
      ctx.fill();

      // Comb highlight edge
      ctx.strokeStyle = combHighlight;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pendulous Wattle beneath chin
      ctx.fillStyle = wattleColor;
      ctx.beginPath();
      ctx.ellipse(3, 11, 5, 8, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Ear-Lobe
      ctx.fillStyle = isKadak ? '#2e1065' : '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(-3, 3, 3, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Alert Eye
      ctx.fillStyle = eyeIris;
      ctx.beginPath();
      ctx.arc(1, -2, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(1.5, -2, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Specular Eye Highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0.8, -2.8, 0.8, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Gamefowl Beak (Upper and Lower Mandibles)
      const beakAngle = (beakOpen * Math.PI) / 180;

      // Upper Mandible
      ctx.fillStyle = beakColor;
      ctx.beginPath();
      ctx.moveTo(8, -4);
      ctx.lineTo(24, 1 - beakAngle * 6);
      ctx.lineTo(10, 2);
      ctx.closePath();
      ctx.fill();

      // Lower Mandible (opens downward during peck)
      ctx.beginPath();
      ctx.moveTo(9, 2);
      ctx.lineTo(22, 2 + beakAngle * 8);
      ctx.lineTo(9, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      ctx.restore();
    };

    const drawParticles = (sim: typeof simState.current) => {
      sim.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Floating text alerts (e.g. "+1 Sprouted Bajra")
      sim.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });
    };

    // ==========================================
    // PHYSICS & SIMULATION UPDATE LOOP
    // ==========================================
    let lastTime = performance.now();

    const updateSimulation = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const sim = simState.current;
      const r = sim.rooster;

      // 1. Update Grains Physics
      sim.grains.forEach((grain) => {
        if (!grain.settled && !grain.eaten) {
          grain.vy += 9.8 * 0.08; // gravity
          grain.x += grain.vx;
          grain.y += grain.vy;

          // Bounce on pasture ground
          if (grain.y >= sim.groundY) {
            grain.y = sim.groundY;
            grain.vy = -grain.vy * 0.4;
            grain.vx *= 0.6;
            grain.bounces++;
            if (grain.bounces >= 3 || Math.abs(grain.vy) < 0.3) {
              grain.settled = true;
              grain.vy = 0;
              grain.vx = 0;
            }
          }
        }
      });

      // 2. Update Particles
      for (let i = sim.particles.length - 1; i >= 0; i--) {
        const p = sim.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = 1 - p.life / p.maxLife;
        if (p.life >= p.maxLife) {
          sim.particles.splice(i, 1);
        }
      }

      // 3. Update Floating Texts
      for (let i = sim.floatingTexts.length - 1; i >= 0; i--) {
        const ft = sim.floatingTexts[i];
        ft.y -= 0.6;
        ft.life++;
        ft.alpha = 1 - ft.life / 40;
        if (ft.life >= 40) {
          sim.floatingTexts.splice(i, 1);
        }
      }

      // 4. Rooster AI Behavior State Machine
      const uneatenGrains = sim.grains.filter((g) => !g.eaten);

      // Find nearest grain
      let nearestGrain: Grain | null = null;
      let minDistance = Infinity;

      uneatenGrains.forEach((g) => {
        const dist = Math.abs(g.x - r.x);
        if (dist < minDistance) {
          minDistance = dist;
          nearestGrain = g;
        }
      });

      r.stateTimer++;

      switch (r.state) {
        case 'entering':
        case 'walking': {
          // If there's a grain, walk towards it!
          if (nearestGrain) {
            const targetX = (nearestGrain as Grain).x - r.facing * 28;
            const dx = targetX - r.x;
            r.facing = dx >= 0 ? 1 : -1;

            if (Math.abs(dx) > 8) {
              r.x += Math.sign(dx) * r.speed;
              r.walkPhase += 0.16;
              setStatusMessage('Rooster approaches golden grains...');
            } else {
              // Reached grain! Inspect & Peck
              r.state = 'pecking';
              r.peckPhase = 0;
              r.stateTimer = 0;
              r.targetGrainId = (nearestGrain as Grain).id;
              setStatusMessage('Pecking & eating sprouted bajra!');
            }
          } else {
            // No grains left! Wander or do proud crow stance
            if (r.stateTimer > 120) {
              r.state = 'proud';
              r.stateTimer = 0;
              playCrowSound();
              setStatusMessage('Proud rooster stance • All grains eaten!');
            } else {
              // Gentle pasture walk
              r.x += r.facing * (r.speed * 0.5);
              r.walkPhase += 0.08;
              if (r.x > sim.width - 60) r.facing = -1;
              if (r.x < 60) r.facing = 1;
            }
          }
          break;
        }

        case 'pecking': {
          // Peck animation curve
          r.peckPhase += 0.09;

          // Moment of strike!
          if (r.peckPhase >= 0.5 && r.targetGrainId !== null) {
            const target = sim.grains.find((g) => g.id === r.targetGrainId);
            if (target && !target.eaten) {
              target.eaten = true;
              playPeckSound();
              setGrainsEaten((prev) => prev + 1);

              // Crunch dust particles
              for (let cp = 0; cp < 6; cp++) {
                sim.particles.push({
                  x: target.x,
                  y: target.y,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -Math.random() * 2 - 1,
                  size: Math.random() * 2 + 1,
                  color: '#fbbf24',
                  alpha: 1,
                  life: 0,
                  maxLife: 20,
                });
              }

              // Floating indicator
              sim.floatingTexts.push({
                id: Math.random(),
                x: target.x - 10,
                y: target.y - 15,
                text: '+1 Bajra',
                alpha: 1,
                life: 0,
              });
            }
            r.targetGrainId = null;
          }

          if (r.peckPhase >= 1.0) {
            // Finished peck, now swallow
            r.state = 'swallowing';
            r.stateTimer = 0;
          }
          break;
        }

        case 'swallowing': {
          if (r.stateTimer > 24) {
            // 25% chance of doing authentic ground scratch before next grain
            if (Math.random() < 0.3 && uneatenGrains.length > 0) {
              r.state = 'scratching';
              r.stateTimer = 0;
              setStatusMessage('Scratching soil for hidden grains...');
            } else {
              r.state = 'walking';
              r.stateTimer = 0;
            }
          }
          break;
        }

        case 'scratching': {
          // Ground scratch dust puffs
          if (r.stateTimer === 10 || r.stateTimer === 20) {
            sim.particles.push({
              x: r.x - r.facing * 10,
              y: sim.groundY,
              vx: -r.facing * 2,
              vy: -1,
              size: 2.5,
              color: '#a16207',
              alpha: 0.8,
              life: 0,
              maxLife: 15,
            });
          }

          if (r.stateTimer > 35) {
            r.state = 'walking';
            r.stateTimer = 0;
          }
          break;
        }

        case 'proud': {
          if (r.stateTimer > 80) {
            r.state = 'walking';
            r.stateTimer = 0;
            // Auto toss 3 grains if empty so rooster keeps lively
            if (sim.grains.filter((g) => !g.eaten).length === 0) {
              scatterGrains();
            }
          }
          break;
        }

        default:
          r.state = 'walking';
      }
    };

    // Main 60 FPS Render Tick
    const render = (time: number) => {
      const sim = simState.current;
      updateSimulation(time);

      ctx.clearRect(0, 0, sim.width, sim.height);
      drawEnvironment(sim);
      drawGrains(sim);
      drawRooster(sim);
      drawParticles(sim);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [breed, playPeckSound, playCrowSound, scatterGrains]);

  // Click on field to drop grains at pointer
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    scatterGrains(clickX, clickY, 4);
  };

  const handleBreedToggle = (newBreed: RoosterBreed) => {
    setBreed(newBreed);
    onBreedChange?.(newBreed);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden border border-amber-500/30 bg-stone-950 shadow-2xl flex flex-col ${className}`}
      style={{
        boxShadow: breed === 'kadaknath' 
          ? '0 20px 50px -10px rgba(168, 85, 247, 0.25), 0 0 30px rgba(168, 85, 247, 0.15)' 
          : '0 20px 50px -10px rgba(245, 158, 11, 0.25), 0 0 30px rgba(245, 158, 11, 0.15)',
      }}
    >
      {/* Top Pasture Navigation & Grain Counter */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Living Farm Pasture Badge */}
        <div className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-white/15 text-xs shadow-lg">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-stone-200">
            {breed === 'kadaknath' ? 'Pure Kadaknath Paddock' : 'Royal Aseel Pasture'}
          </span>
        </div>

        {/* Live Grains Eaten Counter & Audio Toggle */}
        <div className="pointer-events-auto flex items-center space-x-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-lg">
            <span>🌾</span>
            <span>{grainsEaten} Grains Eaten</span>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/15 transition shadow-lg"
            title={soundEnabled ? 'Mute Pecking Sound' : 'Enable Pecking Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Interactive 60fps HTML5 Paddock Canvas */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block"
          title="Click anywhere to drop sprouted bajra grains for the rooster!"
        />

        {/* Floating Tap-to-Feed Tooltip */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 pointer-events-none px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-white/15 text-[11px] font-medium text-stone-300 shadow-xl opacity-90 flex items-center space-x-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Click field to scatter sprouted grains 🌾</span>
        </div>
      </div>

      {/* Bottom Control & Farm Grain Feeding Bar */}
      <div className="p-3.5 bg-stone-900/90 border-t border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-2.5 z-20">
        
        {/* Status Line */}
        <div className="flex items-center space-x-2 text-xs text-stone-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="font-medium truncate max-w-[210px] sm:max-w-none">{statusMessage}</span>
        </div>

        {/* Action Controls: Toss Grains & Strain Selector */}
        <div className="flex items-center space-x-2">
          
          {/* Breed Switch: Aseel vs Kadaknath */}
          <div className="inline-flex rounded-xl p-0.5 bg-stone-950 border border-white/15 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleBreedToggle('aseel')}
              className={`px-2.5 py-1 rounded-lg transition ${
                breed === 'aseel'
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              👑 Aseel
            </button>
            <button
              type="button"
              onClick={() => handleBreedToggle('kadaknath')}
              className={`px-2.5 py-1 rounded-lg transition ${
                breed === 'kadaknath'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              🌿 Kadaknath
            </button>
          </div>

          {/* Toss Grains Button */}
          <button
            type="button"
            onClick={() => scatterGrains()}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-lg transition active:scale-95"
            title="Scatter more organic sprouted pearl millet grains"
          >
            <span>🌾</span>
            <span>Toss Grains</span>
          </button>

        </div>

      </div>

    </div>
  );
};