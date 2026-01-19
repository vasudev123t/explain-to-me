import type { AnimationConfig, AnimationStage } from '@/types';

// Atom structure stages
export const atomStructureStages: AnimationStage[] = [
  {
    id: 0,
    description: 'The nucleus: protons and neutrons',
    scrollProgress: [0, 0.25],
  },
  {
    id: 1,
    description: 'First electron shell (s orbital)',
    scrollProgress: [0.25, 0.5],
  },
  {
    id: 2,
    description: 'Second electron shell (p orbitals)',
    scrollProgress: [0.5, 0.75],
  },
  {
    id: 3,
    description: 'Complete atom with electron cloud probability',
    scrollProgress: [0.75, 1],
  },
];

// Wave propagation stages
export const wavePropagationStages: AnimationStage[] = [
  {
    id: 0,
    description: 'A disturbance creates the initial wave',
    scrollProgress: [0, 0.25],
  },
  {
    id: 1,
    description: 'The wave travels through the medium',
    scrollProgress: [0.25, 0.5],
  },
  {
    id: 2,
    description: 'Wave properties: amplitude and wavelength',
    scrollProgress: [0.5, 0.75],
  },
  {
    id: 3,
    description: 'Wave interference and superposition',
    scrollProgress: [0.75, 1],
  },
];

// Force vectors stages
export const forceVectorsStages: AnimationStage[] = [
  {
    id: 0,
    description: 'An object at rest with no net force',
    scrollProgress: [0, 0.25],
  },
  {
    id: 1,
    description: 'Applied force creates acceleration',
    scrollProgress: [0.25, 0.5],
  },
  {
    id: 2,
    description: 'Multiple forces acting on the object',
    scrollProgress: [0.5, 0.75],
  },
  {
    id: 3,
    description: 'Net force as the vector sum',
    scrollProgress: [0.75, 1],
  },
];

// Electromagnetic spectrum stages
export const electromagneticSpectrumStages: AnimationStage[] = [
  {
    id: 0,
    description: 'Radio waves: longest wavelength, lowest energy',
    scrollProgress: [0, 0.17],
  },
  {
    id: 1,
    description: 'Microwaves and infrared radiation',
    scrollProgress: [0.17, 0.34],
  },
  {
    id: 2,
    description: 'Visible light: the colors we can see',
    scrollProgress: [0.34, 0.51],
  },
  {
    id: 3,
    description: 'Ultraviolet radiation',
    scrollProgress: [0.51, 0.68],
  },
  {
    id: 4,
    description: 'X-rays: high energy, short wavelength',
    scrollProgress: [0.68, 0.85],
  },
  {
    id: 5,
    description: 'Gamma rays: highest energy radiation',
    scrollProgress: [0.85, 1],
  },
];

// Quantum mechanics stages
export const quantumMechanicsStages: AnimationStage[] = [
  {
    id: 0,
    description: 'Wave-particle duality: light as both wave and particle',
    scrollProgress: [0, 0.25],
  },
  {
    id: 1,
    description: 'Quantum superposition: multiple states at once',
    scrollProgress: [0.25, 0.5],
  },
  {
    id: 2,
    description: 'Measurement causes wave function collapse',
    scrollProgress: [0.5, 0.75],
  },
  {
    id: 3,
    description: 'Quantum entanglement: connected particles',
    scrollProgress: [0.75, 1],
  },
];

// Template configurations
export const physicsTemplates: Record<string, AnimationConfig> = {
  'atom-structure': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'physics/atom-structure',
    stages: atomStructureStages,
  },
  'wave-propagation': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'physics/wave-propagation',
    stages: wavePropagationStages,
  },
  'force-vectors': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'physics/force-vectors',
    stages: forceVectorsStages,
  },
  'electromagnetic-spectrum': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'physics/electromagnetic-spectrum',
    stages: electromagneticSpectrumStages,
  },
  'quantum-mechanics': {
    type: 'template',
    renderingMode: 'canvas',
    templateId: 'physics/quantum-mechanics',
    canvasConfig: {
      particles: true,
      physics: true,
      backgroundColor: '#0a0a0a',
      elements: [],
    },
    stages: quantumMechanicsStages,
  },
};

export function getPhysicsTemplate(name: string): AnimationConfig | null {
  return physicsTemplates[name] || null;
}
