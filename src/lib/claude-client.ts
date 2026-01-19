// Client-side Claude API handler
// API key is stored in localStorage and calls are made directly from the browser

const STORAGE_KEY = 'anthropic_api_key';

export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, key);
}

export function removeApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: string; text?: string }>;
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('API key not configured. Please add your Anthropic API key in Settings.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ] as ClaudeMessage[],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your Anthropic API key in Settings.');
    }
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data: ClaudeResponse = await response.json();
  const textContent = data.content.find((block) => block.type === 'text');

  if (!textContent || !textContent.text) {
    throw new Error('No text content in response');
  }

  return textContent.text;
}
