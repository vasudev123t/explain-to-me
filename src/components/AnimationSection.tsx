'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { SVGRenderer } from './animations/SVGRenderer';
import { LottiePlayer, LottiePlaceholder } from './animations/LottiePlayer';
import { CanvasRenderer } from './animations/CanvasRenderer';
import type { AnimationConfig, AnimationStage } from '@/types';

interface AnimationSectionProps {
  config: AnimationConfig;
  className?: string;
}

export function AnimationSection({ config, className = '' }: AnimationSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(latest);

    // Update current stage based on scroll progress
    const newStage = config.stages.findIndex(
      (stage) =>
        latest >= stage.scrollProgress[0] && latest < stage.scrollProgress[1]
    );
    if (newStage !== -1 && newStage !== currentStage) {
      setCurrentStage(newStage);
    }
  });

  // Calculate total scroll height based on stages
  const scrollHeight = config.stages.length * 100; // 100vh per stage

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${scrollHeight}vh` }}
    >
      {/* Sticky animation container */}
      <div className="sticky top-0 h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Animation display */}
          <div className="aspect-video relative">
            <AnimationRenderer
              config={config}
              currentStage={currentStage}
              scrollProgress={scrollProgress}
            />
          </div>

          {/* Current stage info */}
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--muted)] border border-[var(--border)]">
              <span className="text-xs text-[var(--muted-foreground)]">
                Stage {currentStage + 1} of {config.stages.length}
              </span>
              <span className="text-sm font-medium">
                {config.stages[currentStage]?.description || 'Loading...'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stage progress indicators */}
      <StageProgressIndicator
        stages={config.stages}
        currentStage={currentStage}
        scrollProgress={scrollProgress}
      />
    </div>
  );
}

// Render the appropriate animation type
function AnimationRenderer({
  config,
  currentStage,
  scrollProgress,
}: {
  config: AnimationConfig;
  currentStage: number;
  scrollProgress: number;
}) {
  switch (config.renderingMode) {
    case 'svg':
      return (
        <SVGRenderer
          svgCode={config.svgCode}
          templateId={config.templateId}
          templateParams={config.templateParams}
          stages={config.stages}
          currentStage={currentStage}
          scrollProgress={scrollProgress}
        />
      );

    case 'lottie':
      if (config.templateId) {
        return (
          <LottiePlaceholder
            templateId={config.templateId}
            currentStage={currentStage}
          />
        );
      }
      return (
        <LottiePlayer
          stages={config.stages}
          currentStage={currentStage}
          scrollProgress={scrollProgress}
        />
      );

    case 'canvas':
      return (
        <CanvasRenderer
          config={config.canvasConfig}
          stages={config.stages}
          currentStage={currentStage}
          scrollProgress={scrollProgress}
        />
      );

    default:
      return (
        <SVGRenderer
          templateId={config.templateId}
          stages={config.stages}
          currentStage={currentStage}
          scrollProgress={scrollProgress}
        />
      );
  }
}

// Progress indicator on the side
function StageProgressIndicator({
  stages,
  currentStage,
  scrollProgress,
}: {
  stages: AnimationStage[];
  currentStage: number;
  scrollProgress: number;
}) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-3">
      {/* Progress line */}
      <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-[var(--border)]">
        <motion.div
          className="w-full bg-[var(--primary)]"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Stage dots */}
      {stages.map((stage, index) => (
        <motion.button
          key={stage.id}
          className={`
            relative z-10 w-3 h-3 rounded-full transition-all
            ${index === currentStage
              ? 'bg-[var(--primary)] scale-150'
              : index < currentStage
              ? 'bg-[var(--primary)]'
              : 'bg-[var(--muted)] border border-[var(--border)]'
            }
          `}
          whileHover={{ scale: 1.5 }}
          title={stage.description}
        />
      ))}
    </div>
  );
}
