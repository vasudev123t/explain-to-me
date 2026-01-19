import type { AnimationConfig, AnimationStage } from '@/types';

// Star formation animation stages
export const starFormationStages: AnimationStage[] = [
  {
    id: 0,
    description: 'The Big Bang creates primordial matter',
    scrollProgress: [0, 0.2],
  },
  {
    id: 1,
    description: 'Gas and dust clouds begin to form',
    scrollProgress: [0.2, 0.4],
  },
  {
    id: 2,
    description: 'Gravitational collapse ignites a protostar',
    scrollProgress: [0.4, 0.6],
  },
  {
    id: 3,
    description: 'Nuclear fusion begins - a main sequence star is born',
    scrollProgress: [0.6, 0.8],
  },
  {
    id: 4,
    description: 'The star expands into a red giant',
    scrollProgress: [0.8, 1],
  },
];

// Planet formation stages
export const planetFormationStages: AnimationStage[] = [
  {
    id: 0,
    description: 'A young star surrounded by a protoplanetary disk',
    scrollProgress: [0, 0.25],
  },
  {
    id: 1,
    description: 'Dust particles collide and stick together',
    scrollProgress: [0.25, 0.5],
  },
  {
    id: 2,
    description: 'Planetesimals form through accretion',
    scrollProgress: [0.5, 0.75],
  },
  {
    id: 3,
    description: 'A fully formed planet orbits the star',
    scrollProgress: [0.75, 1],
  },
];

// Solar system stages
export const solarSystemStages: AnimationStage[] = [
  {
    id: 0,
    description: 'The Sun at the center of our solar system',
    scrollProgress: [0, 0.2],
  },
  {
    id: 1,
    description: 'Inner rocky planets: Mercury, Venus, Earth, Mars',
    scrollProgress: [0.2, 0.4],
  },
  {
    id: 2,
    description: 'The asteroid belt between Mars and Jupiter',
    scrollProgress: [0.4, 0.6],
  },
  {
    id: 3,
    description: 'Gas giants: Jupiter and Saturn',
    scrollProgress: [0.6, 0.8],
  },
  {
    id: 4,
    description: 'Ice giants: Uranus and Neptune, and the Kuiper Belt',
    scrollProgress: [0.8, 1],
  },
];

// Black hole stages
export const blackHoleStages: AnimationStage[] = [
  {
    id: 0,
    description: 'A massive star reaches the end of its life',
    scrollProgress: [0, 0.25],
  },
  {
    id: 1,
    description: 'The core collapses in a supernova explosion',
    scrollProgress: [0.25, 0.5],
  },
  {
    id: 2,
    description: 'Gravity crushes matter into a singularity',
    scrollProgress: [0.5, 0.75],
  },
  {
    id: 3,
    description: 'The event horizon forms - nothing escapes',
    scrollProgress: [0.75, 1],
  },
];

// Galaxy formation stages
export const galaxyStages: AnimationStage[] = [
  {
    id: 0,
    description: 'Dark matter halos form in the early universe',
    scrollProgress: [0, 0.2],
  },
  {
    id: 1,
    description: 'Gas accumulates and first stars ignite',
    scrollProgress: [0.2, 0.4],
  },
  {
    id: 2,
    description: 'Smaller galaxies merge together',
    scrollProgress: [0.4, 0.6],
  },
  {
    id: 3,
    description: 'Spiral arms develop from rotation',
    scrollProgress: [0.6, 0.8],
  },
  {
    id: 4,
    description: 'A mature spiral galaxy with billions of stars',
    scrollProgress: [0.8, 1],
  },
];

// Template configurations
export const celestialTemplates: Record<string, AnimationConfig> = {
  'star-formation': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'celestial/star-formation',
    stages: starFormationStages,
  },
  'planet-formation': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'celestial/planet-formation',
    stages: planetFormationStages,
  },
  'solar-system': {
    type: 'template',
    renderingMode: 'svg',
    templateId: 'celestial/solar-system',
    stages: solarSystemStages,
  },
  'black-hole': {
    type: 'template',
    renderingMode: 'canvas',
    templateId: 'celestial/black-hole',
    canvasConfig: {
      particles: true,
      physics: true,
      backgroundColor: '#000000',
      elements: [],
    },
    stages: blackHoleStages,
  },
  'galaxy': {
    type: 'template',
    renderingMode: 'canvas',
    templateId: 'celestial/galaxy',
    canvasConfig: {
      particles: true,
      backgroundColor: '#0a0a0a',
      elements: [],
    },
    stages: galaxyStages,
  },
};

export function getCelestialTemplate(name: string): AnimationConfig | null {
  return celestialTemplates[name] || null;
}
