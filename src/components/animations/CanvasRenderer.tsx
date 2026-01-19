'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { AnimationStage, CanvasAnimationConfig } from '@/types';

interface CanvasRendererProps {
  config?: CanvasAnimationConfig;
  stages: AnimationStage[];
  currentStage: number;
  scrollProgress: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export function CanvasRenderer({
  config,
  stages,
  currentStage,
  scrollProgress,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize particles
  const initParticles = useCallback((count: number, width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }
    particlesRef.current = particles;
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = config?.backgroundColor || '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Update and draw particles based on stage
    if (config?.particles) {
      const gravityStrength = 0.1 + scrollProgress * 0.5;
      const centerX = width / 2;
      const centerY = height / 2;

      particlesRef.current.forEach((particle) => {
        // Apply gravity toward center based on scroll progress
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (currentStage >= 1 && dist > 50) {
          particle.vx += (dx / dist) * gravityStrength;
          particle.vy += (dy / dist) * gravityStrength;
        }

        // Apply velocity
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Bounce off edges (early stages) or wrap (later stages)
        if (currentStage < 2) {
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        } else {
          if (particle.x < 0) particle.x = width;
          if (particle.x > width) particle.x = 0;
          if (particle.y < 0) particle.y = height;
          if (particle.y > height) particle.y = 0;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
      });

      // Draw central glow when particles converge (stage 2+)
      if (currentStage >= 2) {
        const glowSize = 30 + scrollProgress * 50;
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          glowSize
        );
        gradient.addColorStop(0, `rgba(253, 184, 19, ${scrollProgress})`);
        gradient.addColorStop(0.5, `rgba(247, 147, 30, ${scrollProgress * 0.5})`);
        gradient.addColorStop(1, 'rgba(241, 90, 36, 0)');

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Draw stage indicator
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'var(--muted-foreground)';
    ctx.font = '12px system-ui';
    ctx.fillText(`Stage ${currentStage + 1} | Progress: ${(scrollProgress * 100).toFixed(0)}%`, 10, 20);

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [config, currentStage, scrollProgress]);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    // Initialize particles
    if (config?.particles) {
      initParticles(100, rect.width, rect.height);
    }

    // Start animation
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config, initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{ backgroundColor: config?.backgroundColor || '#0a0a0a' }}
    />
  );
}

// Specialized canvas renderers for specific effects
export function ParticleFieldCanvas({
  currentStage,
  scrollProgress,
}: {
  currentStage: number;
  scrollProgress: number;
}) {
  return (
    <CanvasRenderer
      config={{
        particles: true,
        backgroundColor: '#0a0a0a',
        elements: [],
      }}
      stages={[]}
      currentStage={currentStage}
      scrollProgress={scrollProgress}
    />
  );
}
