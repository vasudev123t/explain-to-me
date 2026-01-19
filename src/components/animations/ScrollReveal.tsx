'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { AnimationStage } from '@/types';

interface ScrollRevealProps {
  stages: AnimationStage[];
  currentStage: number;
  onStageChange: (stage: number) => void;
  children: React.ReactNode;
}

export function ScrollReveal({
  stages,
  currentStage,
  onStageChange,
  children,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Update current stage based on scroll progress
  useTransform(scrollYProgress, (progress) => {
    const newStage = stages.findIndex(
      (stage) =>
        progress >= stage.scrollProgress[0] && progress < stage.scrollProgress[1]
    );
    if (newStage !== -1 && newStage !== currentStage) {
      onStageChange(newStage);
    }
    return progress;
  });

  return (
    <div ref={containerRef} className="relative">
      {/* Sticky animation container */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <motion.div
          className="w-full max-w-2xl aspect-video"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>

      {/* Scroll sections for each stage */}
      <div className="relative">
        {stages.map((stage, index) => {
          const height = (stage.scrollProgress[1] - stage.scrollProgress[0]) * 100;
          return (
            <div
              key={stage.id}
              className="relative"
              style={{ height: `${height}vh` }}
            >
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-8 right-8 max-w-xs p-4 rounded-lg bg-[var(--muted)]/90 backdrop-blur border border-[var(--border)]"
              >
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  Stage {index + 1} of {stages.length}
                </div>
                <div className="text-sm font-medium">{stage.description}</div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Progress indicator component
export function ScrollProgressIndicator({
  stages,
  currentStage,
}: {
  stages: AnimationStage[];
  currentStage: number;
}) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === currentStage
              ? 'bg-[var(--primary)]'
              : index < currentStage
              ? 'bg-[var(--primary)]/50'
              : 'bg-[var(--muted)]'
          }`}
          animate={{
            scale: index === currentStage ? 1.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </div>
  );
}
