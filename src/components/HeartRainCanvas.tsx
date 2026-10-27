import React, { useEffect, useRef, useState, useCallback } from 'react';

interface HeartRainProps {
  /** If true, runs globally across viewport with fixed positioning; if false, fits parent */
  global?: boolean;
  /** Whether the effect is actively enabled */
  enabled?: boolean;
  className?: string;
  intensityMultiplier?: number;
}

interface RainParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  opacity: number;
  maxOpacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  hasGlow: boolean;
  isSparkle: boolean;
  life: number;
  maxLife: number;
  interactiveSpawn?: boolean;
}

const ROMANTIC_PALETTE = [
  '#f43f5e', // Rose 500
  '#fb7185', // Rose 400
  '#ec4899', // Pink 500
  '#f472b6', // Pink 400
  '#e11d48', // Rose 600 (deep ruby)
  '#fda4af', // Rose 300 (soft blush)
  '#d946ef', // Fuchsia 500
  '#fbbf24', // Amber / Gold sparkle
  '#fef08a', // Pale gold
];

export const HeartRainCanvas: React.FC<HeartRainProps> = ({
  global = true,
  enabled = true,
  className = '',
  intensityMultiplier = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef<boolean>(false);
  const hoverTimeoutRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [isShowerActive, setIsShowerActive] = useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateDimensions = () => {
      if (global) {
        width = window.innerWidth;
        height = window.innerHeight;
      } else {
        const parent = canvas.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Particles pool
    const particles: RainParticle[] = [];
    const baseTargetCount = prefersReducedMotion
      ? 12
      : Math.floor((width > 768 ? 42 : 24) * intensityMultiplier);
    const maxParticles = baseTargetCount * 3.2;

    const createParticle = (
      fromTop = true,
      customX?: number,
      customY?: number,
      interactive = false
    ): RainParticle => {
      const isSparkle = Math.random() < 0.22;
      const size = isSparkle
        ? Math.random() * 3.5 + 2
        : interactive
        ? Math.random() * 15 + 9
        : Math.random() * 16 + 7;

      const x =
        customX !== undefined
          ? customX + (Math.random() - 0.5) * (interactive ? 50 : 15)
          : Math.random() * width;

      const y =
        customY !== undefined
          ? customY + (Math.random() - 0.5) * (interactive ? 40 : 15)
          : fromTop
          ? -25 - Math.random() * 60
          : Math.random() * height;

      const speedY = isSparkle
        ? Math.random() * 1.2 + 0.6
        : interactive
        ? Math.random() * 2.6 + 1.4
        : Math.random() * 1.6 + 0.8;

      const speedX = (Math.random() - 0.5) * (interactive ? 1.8 : 0.7);
      const swayFreq = Math.random() * 0.025 + 0.01;
      const swayAmp = Math.random() * 2.0 + 0.8;
      const swayPhase = Math.random() * Math.PI * 2;
      const maxOpacity = isSparkle
        ? Math.random() * 0.85 + 0.25
        : Math.random() * 0.6 + 0.25;

      const color = isSparkle
        ? Math.random() > 0.4
          ? '#fde047'
          : '#fbbf24'
        : ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)];

      const hasGlow = Math.random() < 0.3;
      const maxLife = interactive ? Math.random() * 140 + 70 : 999999;

      return {
        x,
        y,
        size,
        speedY,
        speedX,
        swayFreq,
        swayAmp,
        swayPhase,
        opacity: fromTop ? 0 : maxOpacity,
        maxOpacity,
        rotation: (Math.random() - 0.5) * 0.8,
        rotationSpeed: (Math.random() - 0.5) * 0.035,
        color,
        hasGlow,
        isSparkle,
        life: 0,
        maxLife,
        interactiveSpawn: interactive,
      };
    };

    // Prepopulate gentle falling heart rain
    for (let i = 0; i < baseTargetCount; i++) {
      particles.push(createParticle(false));
    }

    // Precise Bézier Heart Geometry
    const drawHeart = (
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number,
      rotation: number,
      glow: boolean
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.35;
      ctx.moveTo(0, topCurveHeight * 0.5);
      // Top left arch
      ctx.bezierCurveTo(
        -size * 0.1,
        -topCurveHeight * 0.75,
        -size * 0.65,
        -topCurveHeight * 0.6,
        -size * 0.65,
        topCurveHeight * 0.3
      );
      // Bottom left point
      ctx.bezierCurveTo(
        -size * 0.65,
        topCurveHeight * 1.15,
        -size * 0.25,
        size * 0.85,
        0,
        size * 1.15
      );
      // Bottom right point
      ctx.bezierCurveTo(
        size * 0.25,
        size * 0.85,
        size * 0.65,
        topCurveHeight * 1.15,
        size * 0.65,
        topCurveHeight * 0.3
      );
      // Top right arch
      ctx.bezierCurveTo(
        size * 0.65,
        -topCurveHeight * 0.6,
        size * 0.1,
        -topCurveHeight * 0.75,
        0,
        topCurveHeight * 0.5
      );
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Starlight Sparkle Geometry
    const drawSparkle = (
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(0, -size * 1.8);
      ctx.quadraticCurveTo(0, 0, size * 1.8, 0);
      ctx.quadraticCurveTo(0, 0, 0, size * 1.8);
      ctx.quadraticCurveTo(0, 0, -size * 1.8, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size * 1.8);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    let tick = 0;
    let lastInteractiveSpawnTick = 0;

    // Listen for custom trigger bursts
    const handleCustomTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ x?: number; y?: number; count?: number }>;
      const targetX = customEvent.detail?.x ?? width / 2;
      const targetY = customEvent.detail?.y ?? height / 3;
      const count = customEvent.detail?.count ?? 15;

      isHoveredRef.current = true;
      setIsShowerActive(true);

      for (let k = 0; k < count; k++) {
        if (particles.length < maxParticles) {
          particles.push(createParticle(false, targetX, targetY, true));
        }
      }
    };
    window.addEventListener('trigger-heart-rain', handleCustomTrigger);

    // Global cursor hover tracker across the page
    const handleGlobalMouseMove = (e: MouseEvent) => {
      isHoveredRef.current = true;
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };

      if (!isHoveredRef.current) {
        setIsShowerActive(true);
      }

      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = window.setTimeout(() => {
        isHoveredRef.current = false;
        mousePosRef.current.active = false;
        setIsShowerActive(false);
      }, 1500);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isHoveredRef.current = true;
        mousePosRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          active: true,
        };
        setIsShowerActive(true);

        if (hoverTimeoutRef.current) {
          window.clearTimeout(hoverTimeoutRef.current);
        }
        hoverTimeoutRef.current = window.setTimeout(() => {
          isHoveredRef.current = false;
          mousePosRef.current.active = false;
          setIsShowerActive(false);
        }, 1500);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const isHovered = isHoveredRef.current;
      const mouse = mousePosRef.current;

      // Density expands dynamically on hover
      const targetCount = isHovered ? Math.floor(baseTargetCount * 2.3) : baseTargetCount;

      // Spawn heart rain cascades around cursor
      if (isHovered && mouse.active && tick - lastInteractiveSpawnTick > 2) {
        lastInteractiveSpawnTick = tick;
        if (particles.length < maxParticles) {
          // Spawn at cursor
          particles.push(
            createParticle(
              false,
              mouse.x + (Math.random() - 0.5) * 60,
              mouse.y + (Math.random() - 0.5) * 30,
              true
            )
          );
          // And spawn a shower stream directly above cursor
          if (Math.random() < 0.65) {
            particles.push(
              createParticle(
                true,
                mouse.x + (Math.random() - 0.5) * 140,
                -10,
                true
              )
            );
          }
        }
      }

      // Keep base ambient heart rain flowing
      if (particles.length < targetCount && Math.random() < 0.45) {
        particles.push(createParticle(true));
      }

      // Update & render
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Sway motion
        p.y += p.speedY;
        p.x += Math.sin(tick * p.swayFreq + p.swayPhase) * p.swayAmp + p.speedX;
        p.rotation += p.rotationSpeed;

        // Opacity envelope
        if (p.interactiveSpawn) {
          if (p.life > p.maxLife * 0.7) {
            p.opacity -= 0.02;
          } else if (p.opacity < p.maxOpacity) {
            p.opacity += 0.05;
          }
        } else {
          if (p.y < 50) {
            p.opacity = Math.min(p.maxOpacity, p.opacity + 0.03);
          } else if (p.y > height - 60) {
            p.opacity = Math.max(0, p.opacity - 0.025);
          }
        }

        // Draw shape
        if (p.isSparkle) {
          drawSparkle(p.x, p.y, p.size, p.color, p.opacity);
        } else {
          drawHeart(p.x, p.y, p.size, p.color, p.opacity, p.rotation, p.hasGlow);
        }

        // Cleanup
        const isDead =
          p.y > height + 40 ||
          p.x < -60 ||
          p.x > width + 60 ||
          (p.interactiveSpawn && (p.opacity <= 0 || p.life >= p.maxLife));

        if (isDead) {
          particles.splice(i, 1);
          if (particles.length < targetCount && !p.interactiveSpawn) {
            particles.push(createParticle(true));
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('trigger-heart-rain', handleCustomTrigger);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [global, enabled, intensityMultiplier, prefersReducedMotion]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      className={`${
        global ? 'fixed inset-0 z-20 pointer-events-none' : 'absolute inset-0 z-10 pointer-events-none'
      } overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />

      {/* Floating subtle romantic indicator when user triggers heart rain shower */}
      {isShowerActive && (
        <div className="fixed bottom-4 right-4 pointer-events-none transition-all duration-300 opacity-90 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/75 border border-rose-500/40 text-xs text-rose-200 backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.35)] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span>Heart Rain Shower ✨</span>
        </div>
      )}
    </div>
  );
};
