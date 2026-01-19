// Depth levels from novice (1) to professional (5)
export type DepthLevel = 1 | 2 | 3 | 4 | 5;

// Explanation length options
export type ExplanationLength = 'brief' | 'medium' | 'comprehensive';

// Animation rendering mode
export type RenderingMode = 'svg' | 'lottie' | 'canvas';

// Animation stage for scroll-triggered reveal
export interface AnimationStage {
  id: number;
  description: string;
  scrollProgress: [number, number]; // Start and end scroll progress (0-1)
}

// Animation configuration
export interface AnimationConfig {
  type: 'template' | 'generated';
  renderingMode: RenderingMode;
  templateId?: string;
  templateParams?: Record<string, unknown>;
  svgCode?: string;
  canvasConfig?: CanvasAnimationConfig;
  stages: AnimationStage[];
}

// Canvas animation configuration for WebGL/Canvas rendering
export interface CanvasAnimationConfig {
  particles?: boolean;
  physics?: boolean;
  backgroundColor?: string;
  elements: CanvasElement[];
}

export interface CanvasElement {
  type: 'circle' | 'rect' | 'path' | 'particle-system';
  props: Record<string, unknown>;
  animation?: {
    property: string;
    from: number;
    to: number;
    stageId: number;
  }[];
}

// Explanation section
export interface ExplanationSection {
  heading: string;
  content: string;
  animationStage?: number; // Links to animation timeline
}

// Full explanation response
export interface ExplanationResponse {
  topic: string;
  title: string;
  summary: string;
  sections: ExplanationSection[];
  animation: AnimationConfig;
}

// API request
export interface ExplainRequest {
  topic: string;
  depth: DepthLevel;
  length: ExplanationLength;
}

// Depth level metadata
export const DEPTH_LEVELS: Record<DepthLevel, { label: string; audience: string; description: string }> = {
  1: { label: 'Novice', audience: '5-year-old', description: 'Simple analogies, core concept only' },
  2: { label: 'Beginner', audience: 'High schooler', description: 'Basic terminology, key facts' },
  3: { label: 'Intermediate', audience: 'College student', description: 'Technical terms, mechanisms explained' },
  4: { label: 'Advanced', audience: 'Graduate', description: 'Advanced concepts, research references' },
  5: { label: 'Professional', audience: 'Expert', description: 'Field-specific jargon, cutting-edge details' },
};

export const LENGTH_OPTIONS: Record<ExplanationLength, { label: string; wordRange: string }> = {
  brief: { label: 'Brief', wordRange: '100-200 words' },
  medium: { label: 'Medium', wordRange: '300-500 words' },
  comprehensive: { label: 'Comprehensive', wordRange: '800-1200 words' },
};
