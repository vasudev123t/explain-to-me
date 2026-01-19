import { NextRequest, NextResponse } from 'next/server';
import { generateExplanation } from '@/lib/claude';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts';
import type { DepthLevel, ExplanationLength, ExplanationResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, depth, length } = body as {
      topic: string;
      depth: DepthLevel;
      length: ExplanationLength;
    };

    // Validate inputs
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!depth || depth < 1 || depth > 5) {
      return NextResponse.json(
        { error: 'Depth must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!['brief', 'medium', 'comprehensive'].includes(length)) {
      return NextResponse.json(
        { error: 'Length must be brief, medium, or comprehensive' },
        { status: 400 }
      );
    }

    // Build prompts
    const systemPrompt = buildSystemPrompt(depth, length);
    const userPrompt = buildUserPrompt(topic);

    // Generate explanation
    const responseText = await generateExplanation(userPrompt, systemPrompt);

    // Parse the JSON response
    let explanation: ExplanationResponse;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      explanation = JSON.parse(jsonMatch[0]);
      explanation.topic = topic;
    } catch (parseError) {
      console.error('Failed to parse response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse explanation response' },
        { status: 500 }
      );
    }

    return NextResponse.json(explanation);
  } catch (error) {
    console.error('Explain API error:', error);

    if (error instanceof Error) {
      // Check for specific API errors
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API key not configured. Please set ANTHROPIC_API_KEY in .env.local' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}
