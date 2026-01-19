import type { AnimationConfig, AnimationStage } from '@/types';

// Cell division (mitosis) stages
export const cellDivisionStages: AnimationStage[] = [
  {
    id: 0,
    description: 'Interphase: The cell grows and DNA replicates',
    scrollProgress: [0, 0.2],
  },
  {
    id: 1,
    description: 'Prophase: Chromosomes condense and become visible',
    scrollProgress: [0.2, 0.4],
  },
  {
    id: 2,
    description: 'Metaphase: Chromosomes align at the cell center',
    scrollProgress: [0.4, 0.6],
  },
  {
    id: 3,
    description: 'Anaphase: Sister chromatids separate',
    scrollProgress: [0.6, 0.8],
  },
  {
    id: 4,
    description: 'Telophase & Cytokinesis: Two daughter cells form',
    scrollProgress: [0.8, 1],
  },
];

// DNA replication stages
export const dnaReplicationStages: AnimationStage[] = [
  {
    id: 0,
    description: 'The DNA double helix in its original state',
    scrollProgress: [0, 0.25],
  },
  {
    id: 1,
    description: 'Helicase unwinds the DNA strands',
    scrollProgress: [0.25, 0.5],
  },
  {
    id: 2,
    description: 'DNA polymerase adds complementary nucleotides',
    scrollProgress: [0.5, 0.75],
  },
  {
    id: 3,
    description: 'Two identical DNA molecules are formed',
    scrollProgress: [0.75, 1],
  },
];

// Evolution stages
export const evolutionStages: AnimationStage[] = [
  {
    id: 0,
    description: 'Early single-celled organisms in the primordial ocean',
    scrollProgress: [0, 0.2],
  },
  {
    id: 1,
    description: 'Multi-cellular life emerges',
    scrollProgress: [0.2, 0.4],
  },
  {
    id: 2,
    description: 'Life moves onto land',
    scrollProgress: [0.4, 0.6],
  },
  {
    id: 3,
    description: 'Diversification of species through natural selection',
    scrollProgress: [0.6, 0.8],
  },
  {
    id: 4,
    description: 'Complex ecosystems and modern biodiversity',
    scrollProgress: [0.8, 1],
  },
];

// Photosynthesis stages
export const photosynthesisStages: AnimationStage[] = [
  {
    id: 0,
    description: 'Sunlight reaches the leaf surface',
    scrollProgress: [0, 0.2],
  },
  {
    id: 1,
    description: 'Light is absorbed by chlorophyll in chloroplasts',
    scrollProgress: [0.2, 0.4],
  },
  {
    id: 2,
    description: 'Water molecules are split, releasing oxygen',
    scrollProgress: [0.4, 0.6],
  },
  {
    id: 3,
    description: 'Carbon dioxide is captured from the air',
    scrollProgress: [0.6, 0.8],
  },
  {
    id: 4,
    description: 'Glucose is synthesized to store energy',
    scrollProgress: [0.8, 1],
  },
];

// Neuron stages
export const neuronStages: AnimationStage[] = [
  {
    id: 0,
    description: 'A neuron at rest with polarized membrane',
    scrollProgress: [0, 0.25],
  },
  {
    id: 1,
    description: 'Stimulus triggers action potential',
    scrollProgress: [0.25, 0.5],
  },
  {
    id: 2,
    description: 'Signal travels down the axon',
    scrollProgress: [0.5, 0.75],
  },
  {
    id: 3,
    description: 'Neurotransmitters release at the synapse',
    scrollProgress: [0.75, 1],
  },
];

// Template configurations
export const biologyTemplates: Record<string, AnimationConfig> = {
  'cell-division': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'biology/cell-division',
    stages: cellDivisionStages,
  },
  'dna-replication': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'biology/dna-replication',
    stages: dnaReplicationStages,
  },
  'evolution': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'biology/evolution',
    stages: evolutionStages,
  },
  'photosynthesis': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'biology/photosynthesis',
    stages: photosynthesisStages,
  },
  'neuron': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'biology/neuron',
    stages: neuronStages,
  },
};

export function getBiologyTemplate(name: string): AnimationConfig | null {
  return biologyTemplates[name] || null;
}
