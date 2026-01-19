'use client';

import { motion } from 'framer-motion';
import type { ExplanationLength } from '@/types';
import { LENGTH_OPTIONS } from '@/types';

interface LengthSliderProps {
  value: ExplanationLength;
  onChange: (length: ExplanationLength) => void;
}

export function LengthSlider({ value, onChange }: LengthSliderProps) {
  const options = Object.entries(LENGTH_OPTIONS) as [ExplanationLength, typeof LENGTH_OPTIONS[ExplanationLength]][];

  return (
    <div className="space-y-3">
      {/* Toggle buttons */}
      <div className="flex rounded-lg bg-[var(--background)] border border-[var(--border)] p-1">
        {options.map(([key, info]) => {
          const isSelected = value === key;

          return (
            <motion.button
              key={key}
              onClick={() => onChange(key)}
              whileTap={{ scale: 0.98 }}
              className={`
                flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all relative
                ${isSelected ? 'text-white' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId="length-indicator"
                  className="absolute inset-0 bg-[var(--primary)] rounded-md"
                  transition={{ type: 'spring', duration: 0.3 }}
                />
              )}
              <span className="relative z-10">{info.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Word count indicator */}
      <motion.div
        key={value}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-[var(--muted-foreground)] px-1"
      >
        Approximately {LENGTH_OPTIONS[value].wordRange}
      </motion.div>
    </div>
  );
}
