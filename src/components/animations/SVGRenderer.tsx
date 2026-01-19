'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { AnimationStage } from '@/types';

interface SVGRendererProps {
  svgCode?: string;
  templateId?: string;
  templateParams?: Record<string, unknown>;
  stages: AnimationStage[];
  currentStage: number;
  scrollProgress: number;
}

export function SVGRenderer({
  svgCode,
  templateId,
  templateParams,
  stages,
  currentStage,
  scrollProgress,
}: SVGRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // If we have custom SVG code, inject it
    if (svgCode) {
      containerRef.current.innerHTML = svgCode;
    }

    // Set up GSAP timeline for animations
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    // Create a timeline that we can scrub based on scroll
    const tl = gsap.timeline({ paused: true });

    // Add animations for each stage
    stages.forEach((stage, index) => {
      const stageElements = svg.querySelectorAll(`[data-stage="${index}"]`);
      const duration = stage.scrollProgress[1] - stage.scrollProgress[0];

      stageElements.forEach((el) => {
        tl.fromTo(
          el,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration },
          stage.scrollProgress[0]
        );
      });
    });

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [svgCode, stages]);

  // Update timeline progress based on scroll
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.progress(scrollProgress);
    }
  }, [scrollProgress]);

  // Render a placeholder or template-based SVG
  if (!svgCode && templateId) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--muted)] to-[var(--background)] border border-[var(--border)]"
      >
        <TemplateSVG
          templateId={templateId}
          params={templateParams}
          currentStage={currentStage}
          scrollProgress={scrollProgress}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--muted)] to-[var(--background)] border border-[var(--border)] [&>svg]:w-full [&>svg]:h-full [&>svg]:p-8"
    />
  );
}

// Template-based SVG renderer
function TemplateSVG({
  templateId,
  params,
  currentStage,
  scrollProgress,
}: {
  templateId: string;
  params?: Record<string, unknown>;
  currentStage: number;
  scrollProgress: number;
}) {
  const [category, template] = templateId.split('/');

  // Render based on template category
  switch (category) {
    case 'celestial':
      return (
        <CelestialSVG
          template={template}
          params={params}
          stage={currentStage}
          progress={scrollProgress}
        />
      );
    case 'biology':
      return (
        <BiologySVG
          template={template}
          params={params}
          stage={currentStage}
          progress={scrollProgress}
        />
      );
    case 'physics':
      return (
        <PhysicsSVG
          template={template}
          params={params}
          stage={currentStage}
          progress={scrollProgress}
        />
      );
    default:
      return (
        <GenericSVG
          template={template}
          params={params}
          stage={currentStage}
          progress={scrollProgress}
        />
      );
  }
}

// Celestial template SVGs
function CelestialSVG({
  template,
  stage,
  progress,
}: {
  template: string;
  params?: Record<string, unknown>;
  stage: number;
  progress: number;
}) {
  // Star formation animation
  if (template === 'star-formation') {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDB813" stopOpacity={progress} />
            <stop offset="50%" stopColor="#F7931E" stopOpacity={progress * 0.7} />
            <stop offset="100%" stopColor="#F15A24" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stage 0: Big Bang / Initial state */}
        <g style={{ opacity: stage >= 0 ? 1 : 0, transition: 'opacity 0.5s' }}>
          <circle cx="200" cy="150" r={5 + progress * 20} fill="url(#starGlow)" filter="url(#glow)" />
        </g>

        {/* Stage 1: Gas cloud */}
        <g style={{ opacity: stage >= 1 ? progress : 0, transition: 'opacity 0.5s' }}>
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={200 + Math.cos(i * 0.5) * (30 + progress * 50)}
              cy={150 + Math.sin(i * 0.5) * (30 + progress * 50)}
              r={3 + Math.random() * 5}
              fill="#4A90D9"
              opacity={0.3 + Math.random() * 0.3}
            />
          ))}
        </g>

        {/* Stage 2: Protostar */}
        <g style={{ opacity: stage >= 2 ? 1 : 0, transition: 'opacity 0.5s' }}>
          <circle
            cx="200"
            cy="150"
            r={20 + progress * 30}
            fill="url(#starGlow)"
            filter="url(#glow)"
          />
        </g>

        {/* Stage 3: Main sequence star */}
        <g style={{ opacity: stage >= 3 ? 1 : 0, transition: 'opacity 0.5s' }}>
          <circle
            cx="200"
            cy="150"
            r={50 + progress * 10}
            fill="#FDB813"
            filter="url(#glow)"
          />
          {/* Corona */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1={200 + Math.cos(i * 0.52) * 60}
              y1={150 + Math.sin(i * 0.52) * 60}
              x2={200 + Math.cos(i * 0.52) * (80 + Math.sin(progress * 10) * 10)}
              y2={150 + Math.sin(i * 0.52) * (80 + Math.sin(progress * 10) * 10)}
              stroke="#FDB813"
              strokeWidth="2"
              opacity={0.6}
            />
          ))}
        </g>

        {/* Stage 4: Red giant */}
        <g style={{ opacity: stage >= 4 ? 1 : 0, transition: 'opacity 0.5s' }}>
          <circle
            cx="200"
            cy="150"
            r={80 + progress * 40}
            fill="#E74C3C"
            opacity={0.8}
            filter="url(#glow)"
          />
        </g>
      </svg>
    );
  }

  // Default celestial visualization
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <circle
        cx="200"
        cy="150"
        r={30 + progress * 40}
        fill="#FDB813"
        opacity={0.5 + progress * 0.5}
      />
    </svg>
  );
}

// Biology template SVGs
function BiologySVG({
  template,
  stage,
  progress,
}: {
  template: string;
  params?: Record<string, unknown>;
  stage: number;
  progress: number;
}) {
  if (template === 'cell-division') {
    const divisionProgress = Math.min(progress * 2, 1);
    const separation = stage >= 2 ? (progress - 0.5) * 100 : 0;

    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
          <radialGradient id="cellGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E8F5E9" />
            <stop offset="100%" stopColor="#81C784" />
          </radialGradient>
        </defs>

        {/* Original cell */}
        <g style={{ transform: `translateX(${-separation}px)` }}>
          <ellipse
            cx="200"
            cy="150"
            rx={60 + (stage >= 1 ? divisionProgress * 20 : 0)}
            ry={60 - (stage >= 1 ? divisionProgress * 10 : 0)}
            fill="url(#cellGradient)"
            stroke="#4CAF50"
            strokeWidth="2"
          />
          {/* Nucleus */}
          <circle
            cx={200 - (stage >= 1 ? divisionProgress * 20 : 0)}
            cy="150"
            r="15"
            fill="#7B1FA2"
            opacity={stage >= 2 ? 0 : 1}
          />
        </g>

        {/* Dividing cell */}
        {stage >= 2 && (
          <g style={{ transform: `translateX(${separation}px)` }}>
            <ellipse
              cx="200"
              cy="150"
              rx={60}
              ry={60}
              fill="url(#cellGradient)"
              stroke="#4CAF50"
              strokeWidth="2"
              opacity={progress}
            />
            <circle cx="200" cy="150" r="15" fill="#7B1FA2" opacity={progress} />
          </g>
        )}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <circle cx="200" cy="150" r="60" fill="#81C784" opacity={0.5 + progress * 0.5} />
    </svg>
  );
}

// Physics template SVGs
function PhysicsSVG({
  template,
  stage,
  progress,
}: {
  template: string;
  params?: Record<string, unknown>;
  stage: number;
  progress: number;
}) {
  if (template === 'atom-structure') {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Nucleus */}
        <circle cx="200" cy="150" r={10 + stage * 2} fill="#E53935" />

        {/* Electron orbits */}
        {[...Array(Math.min(stage + 1, 3))].map((_, i) => (
          <g key={i}>
            <ellipse
              cx="200"
              cy="150"
              rx={40 + i * 30}
              ry={20 + i * 15}
              fill="none"
              stroke="#2196F3"
              strokeWidth="1"
              opacity={0.5}
              transform={`rotate(${i * 60} 200 150)`}
            />
            {/* Electron */}
            <circle
              cx={200 + Math.cos(progress * 10 + i * 2) * (40 + i * 30)}
              cy={150 + Math.sin(progress * 10 + i * 2) * (20 + i * 15)}
              r="5"
              fill="#2196F3"
              transform={`rotate(${i * 60} 200 150)`}
            />
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <circle cx="200" cy="150" r="20" fill="#2196F3" opacity={0.5 + progress * 0.5} />
    </svg>
  );
}

// Generic template SVG
function GenericSVG({
  template,
  stage,
  progress,
}: {
  template: string;
  params?: Record<string, unknown>;
  stage: number;
  progress: number;
}) {
  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      <defs>
        <linearGradient id="genericGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>

      {/* Progress indicator */}
      <rect
        x="50"
        y="130"
        width={300 * progress}
        height="40"
        rx="20"
        fill="url(#genericGradient)"
        opacity={0.8}
      />

      {/* Stage markers */}
      {[...Array(5)].map((_, i) => (
        <circle
          key={i}
          cx={50 + i * 75}
          cy="150"
          r={i <= stage ? 10 : 6}
          fill={i <= stage ? 'var(--primary)' : 'var(--muted)'}
          stroke={i === stage ? 'var(--primary)' : 'none'}
          strokeWidth="2"
        />
      ))}

      {/* Template name */}
      <text x="200" y="220" textAnchor="middle" fill="var(--muted-foreground)" fontSize="14">
        {template || 'Loading...'}
      </text>
    </svg>
  );
}
