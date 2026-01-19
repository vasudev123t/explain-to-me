'use client';

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import type { AnimationStage } from '@/types';

interface LottiePlayerProps {
  animationData?: object;
  animationPath?: string;
  stages: AnimationStage[];
  currentStage: number;
  scrollProgress: number;
}

export function LottiePlayer({
  animationData,
  animationPath,
  stages,
  currentStage,
  scrollProgress,
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load the animation
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: animationData,
      path: animationPath,
    });

    animationRef.current = anim;

    return () => {
      anim.destroy();
    };
  }, [animationData, animationPath]);

  // Update animation frame based on scroll progress
  useEffect(() => {
    if (!animationRef.current) return;

    const totalFrames = animationRef.current.totalFrames;
    const currentFrame = Math.floor(scrollProgress * totalFrames);
    animationRef.current.goToAndStop(currentFrame, true);
  }, [scrollProgress]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl bg-gradient-to-br from-[var(--muted)] to-[var(--background)] border border-[var(--border)]"
    />
  );
}

// Placeholder component when no Lottie data is available
export function LottiePlaceholder({
  templateId,
  currentStage,
}: {
  templateId: string;
  currentStage: number;
}) {
  return (
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[var(--muted)] to-[var(--background)] border border-[var(--border)] flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[var(--primary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Animation: {templateId}
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Stage {currentStage + 1}
        </p>
      </div>
    </div>
  );
}
