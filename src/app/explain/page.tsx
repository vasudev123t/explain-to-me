'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimationSection } from '@/components/AnimationSection';
import { ApiKeyModal, SettingsButton } from '@/components/ApiKeyModal';
import { callClaude, hasApiKey } from '@/lib/claude-client';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts';
import type { ExplanationResponse, DepthLevel, ExplanationLength } from '@/types';
import { DEPTH_LEVELS } from '@/types';

export default function ExplainPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ExplainPageContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <h2 className="text-2xl font-bold mb-2">Loading...</h2>
      </div>
    </div>
  );
}

function ExplainPageContent() {
  const searchParams = useSearchParams();

  const topic = searchParams.get('topic') || '';
  const depth = (parseInt(searchParams.get('depth') || '3') as DepthLevel) || 3;
  const length = (searchParams.get('length') as ExplanationLength) || 'medium';

  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const fetchExplanation = async () => {
    if (!topic) {
      setError('No topic specified');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!hasApiKey()) {
      setError('API key not configured. Please add your Anthropic API key.');
      setIsLoading(false);
      setShowSettings(true);
      return;
    }

    try {
      const systemPrompt = buildSystemPrompt(depth, length);
      const userPrompt = buildUserPrompt(topic);

      const responseText = await callClaude(systemPrompt, userPrompt);

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      const data = JSON.parse(jsonMatch[0]) as ExplanationResponse;
      data.topic = topic;
      setExplanation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, depth, length]);

  if (isLoading) {
    return <LoadingState topic={topic} depth={depth} />;
  }

  if (error) {
    return (
      <>
        <SettingsButton onClick={() => setShowSettings(true)} />
        <ErrorState error={error} onRetry={fetchExplanation} />
        <ApiKeyModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={fetchExplanation}
        />
      </>
    );
  }

  if (!explanation) {
    return <ErrorState error="No explanation data received" onRetry={fetchExplanation} />;
  }

  return (
    <div className="min-h-screen">
      <SettingsButton onClick={() => setShowSettings(true)} />

      <header className="sticky top-0 z-40 bg-[var(--background)]/80 backdrop-blur border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-xs px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)]">
              {DEPTH_LEVELS[depth].label}
            </span>
            <span className="text-xs px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] capitalize">
              {length}
            </span>
          </div>
        </div>
      </header>

      <section className="py-16 px-4 text-center border-b border-[var(--border)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {explanation.title}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            {explanation.summary}
          </p>
        </motion.div>
      </section>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-8 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto">
          <div className="max-w-xl mx-auto space-y-8">
            {explanation.sections.map((section, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {section.animationStage !== undefined && (
                  <div className="absolute -left-8 top-0 w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center">
                    {section.animationStage + 1}
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  {section.content}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 min-h-screen">
          <AnimationSection config={explanation.animation} />
        </div>
      </div>

      <footer className="border-t border-[var(--border)] py-8 px-4 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">
          Generated with AI - Content is for educational purposes
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-colors"
          >
            Search for another topic
          </Link>
        </div>
      </footer>

      <ApiKeyModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={() => {}}
      />
    </div>
  );
}

function LoadingState({ topic, depth }: { topic: string; depth: DepthLevel }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-6 border-4 border-[var(--primary)] border-t-transparent rounded-full"
        />
        <h2 className="text-2xl font-bold mb-2">Generating explanation...</h2>
        <p className="text-[var(--muted-foreground)] mb-4">
          Creating a {DEPTH_LEVELS[depth].label.toLowerCase()}-level explanation of &quot;{topic}&quot;
        </p>
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-[var(--primary)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-[var(--muted-foreground)] mb-6">{error}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
