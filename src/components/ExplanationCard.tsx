'use client';

import { motion } from 'framer-motion';
import type { ExplanationSection } from '@/types';

interface ExplanationCardProps {
  section: ExplanationSection;
  index: number;
  isActive?: boolean;
}

export function ExplanationCard({ section, index, isActive = false }: ExplanationCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`
        relative p-6 rounded-xl border transition-all duration-300
        ${isActive
          ? 'bg-[var(--primary)]/5 border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10'
          : 'bg-[var(--muted)]/50 border-[var(--border)] hover:border-[var(--primary)]/50'
        }
      `}
    >
      {/* Stage indicator */}
      {section.animationStage !== undefined && (
        <div
          className={`
            absolute -left-3 top-6 w-6 h-6 rounded-full text-xs font-bold
            flex items-center justify-center transition-colors
            ${isActive
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]'
            }
          `}
        >
          {section.animationStage + 1}
        </div>
      )}

      {/* Content */}
      <h3 className="text-lg font-semibold mb-2 pr-8">{section.heading}</h3>
      <p className="text-[var(--muted-foreground)] leading-relaxed text-sm">
        {section.content}
      </p>

      {/* Active indicator line */}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--primary)] rounded-l-xl"
        />
      )}
    </motion.article>
  );
}

// Skeleton loader for explanation cards
export function ExplanationCardSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] animate-pulse">
      <div className="h-5 w-1/3 bg-[var(--muted)] rounded mb-3" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-[var(--muted)] rounded" />
        <div className="h-4 w-5/6 bg-[var(--muted)] rounded" />
        <div className="h-4 w-4/6 bg-[var(--muted)] rounded" />
      </div>
    </div>
  );
}
