import type { DepthLevel, ExplanationLength } from '@/types';

const DEPTH_INSTRUCTIONS: Record<DepthLevel, string> = {
  1: `Explain as if talking to a curious 5-year-old child. Use simple words, fun analogies, and relate concepts to everyday things they would know (toys, animals, food, family). Avoid any technical terms. Make it engaging and wonder-filled.`,

  2: `Explain for a high school student. Use basic scientific/technical terms but always define them. Include interesting facts and real-world applications. Structure the explanation clearly with simple cause-and-effect relationships.`,

  3: `Explain for a college undergraduate. Use proper technical terminology with brief explanations. Include mechanisms, processes, and how things work at a deeper level. Reference relevant theories and principles.`,

  4: `Explain for a graduate student or someone with domain knowledge. Use advanced terminology freely. Include nuances, edge cases, current research directions, and historical context. Reference key studies or discoveries.`,

  5: `Explain for a domain expert or professional. Use precise field-specific jargon. Include cutting-edge developments, ongoing debates, quantitative details, and connections to related advanced concepts. Be technically rigorous.`,
};

const LENGTH_INSTRUCTIONS: Record<ExplanationLength, string> = {
  brief: `Keep the explanation concise, around 100-200 words total. Focus only on the most essential core concept.`,
  medium: `Provide a moderate explanation, around 300-500 words total. Cover the main concept and a few key supporting details.`,
  comprehensive: `Provide a thorough explanation, around 800-1200 words total. Cover the concept in depth with multiple aspects, examples, and implications.`,
};

export function buildSystemPrompt(depth: DepthLevel, length: ExplanationLength): string {
  return `You are an expert educator and science communicator. Your task is to explain topics in an engaging, accurate, and appropriately leveled way.

${DEPTH_INSTRUCTIONS[depth]}

${LENGTH_INSTRUCTIONS[length]}

You must respond with a JSON object in exactly this format:
{
  "title": "An engaging title for the explanation",
  "summary": "A one-sentence summary of the topic",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Section content explaining this aspect",
      "animationStage": 0
    }
  ],
  "animation": {
    "type": "template",
    "renderingMode": "svg",
    "templateId": "category/template-name",
    "stages": [
      {
        "id": 0,
        "description": "What this animation stage shows",
        "scrollProgress": [0, 0.25]
      }
    ]
  }
}

IMPORTANT GUIDELINES FOR THE ANIMATION:
1. Choose an appropriate template from these categories:
   - celestial: star-formation, planet-formation, solar-system, galaxy, black-hole
   - biology: cell-division, dna-replication, evolution, photosynthesis, neuron
   - physics: atom-structure, wave-propagation, force-vectors, electromagnetic-spectrum
   - chemistry: molecule-formation, chemical-reaction, periodic-trends
   - history: timeline, civilizations, technology-evolution
   - general: process-flow, comparison, hierarchy, cycle

2. Create 3-6 animation stages that tell a visual story:
   - Each stage should correspond to a section of the explanation
   - scrollProgress should be sequential ranges: [0, 0.2], [0.2, 0.4], etc.
   - Description should be specific about what the viewer sees

3. For topics that don't fit templates, set type to "generated" and include:
   - renderingMode: "svg" or "canvas" depending on complexity
   - A detailed description in stages that can be used to generate visuals

4. Match the animation stages to the explanation sections using animationStage numbers.

Respond ONLY with the JSON object, no markdown code blocks or additional text.`;
}

export function buildUserPrompt(topic: string): string {
  return `Please explain: "${topic}"

Create an educational explanation with:
1. A clear, engaging explanation broken into logical sections
2. Animation stages that visually tell the story of this topic
3. Each section should connect to an animation stage where appropriate

Focus on accuracy while making the topic come alive visually.`;
}
