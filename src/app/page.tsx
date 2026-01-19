'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/SearchBar';
import { DepthSelector } from '@/components/DepthSelector';
import { LengthSlider } from '@/components/LengthSlider';
import { ApiKeyModal, SettingsButton } from '@/components/ApiKeyModal';
import { hasApiKey } from '@/lib/claude-client';
import type { DepthLevel, ExplanationLength } from '@/types';

export default function Home() {
  const router = useRouter();
  const [depth, setDepth] = useState<DepthLevel>(3);
  const [length, setLength] = useState<ExplanationLength>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    setHasKey(hasApiKey());
  }, []);

  const handleSearch = async (topic: string) => {
    if (!topic.trim()) return;

    if (!hasApiKey()) {
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    const params = new URLSearchParams({
      depth: depth.toString(),
      length: length,
    });
    router.push(`/explain/${encodeURIComponent(topic)}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <SettingsButton onClick={() => setShowSettings(true)} />

      {!hasKey && (
        <div className="fixed top-4 left-4 right-16 z-30">
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-sm">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 w-full text-left"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>API key required. Tap to configure.</span>
            </button>
          </div>
        </div>
      )}

      <div className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)] bg-clip-text text-transparent">
          Explain to Me
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Search any topic and watch it come to life with AI-powered explanations
          and animated visualizations
        </p>
      </div>

      <div className="w-full max-w-xl space-y-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        <div className="space-y-6 p-6 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <div>
            <label className="block text-sm font-medium mb-3">
              Explanation Depth
            </label>
            <DepthSelector value={depth} onChange={setDepth} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Explanation Length
            </label>
            <LengthSlider value={length} onChange={setLength} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)] mb-3">
            Try searching for:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['The Sun', 'DNA', 'Black Holes', 'Photosynthesis', 'Quantum Computing'].map((topic) => (
              <button
                key={topic}
                onClick={() => handleSearch(topic)}
                className="px-3 py-1.5 text-sm rounded-full bg-[var(--background)] border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ApiKeyModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={() => setHasKey(true)}
      />
    </div>
  );
}
