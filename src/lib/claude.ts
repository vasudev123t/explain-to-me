import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
// The SDK automatically reads ANTHROPIC_API_KEY from environment
export const anthropic = new Anthropic();

export async function generateExplanation(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract text content from the response
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content in response');
  }

  return textContent.text;
}

export async function generateStreamingExplanation(
  prompt: string,
  systemPrompt: string
): AsyncGenerator<string, void, unknown> {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  async function* generator() {
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text;
      }
    }
  }

  return generator();
}
