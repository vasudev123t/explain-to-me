'use client';

import { motion } from 'framer-motion';
import type { DepthLevel } from '@/types';
import { DEPTH_LEVELS } from '@/types';

interface DepthSelectorProps {
  value: DepthLevel;
  onChange: (depth: DepthLevel) => void;
}

export function DepthSelector({ value, onChange }: DepthSelectorProps) {
  const levels = Object.entries(DEPTH_LEVELS) as [string, typeof DEPTH_LEVELS[DepthLevel]][];

  return (
    <div className="space-y-3">
      {/* Level buttons */}
      <div className="flex gap-2">
        {levels.map(([level, info]) => {
          const levelNum = parseInt(level) as DepthLevel;
          const isSelected = value === levelNum;

          return (
            <motion.button
              key={level}
              onClick={() => onChange(levelNum)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
                ${isSelected
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)]'
                }
              `}
            >
              {info.label}
            </motion.button>
          );
        })}
      </div>

      {/* Description */}
      <motion.div
        key={value}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-[var(--muted-foreground)] px-1"
      >
        <span className="font-medium text-[var(--foreground)]">
          {DEPTH_LEVELS[value].audience}:
        </span>{' '}
        {DEPTH_LEVELS[value].description}
      </motion.div>
    </div>
  );
}
