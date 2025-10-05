// Catálogo de upgrades e edifícios
// Dados dos itens disponíveis no jogo

import { TIER_0_BALANCE } from './balance'

export const UPGRADES = {
  // DNA Upgrades
  MICROSCOPE: {
    id: 'MICROSCOPE',
    name: 'Microscope',
    description: 'Increases DNA per click by +1',
    icon: '🔬',
    category: 'dna',
    costType: 'dna' as const,
    ...TIER_0_BALANCE.MICROSCOPE
  },
  
  TEST_TUBE: {
    id: 'TEST_TUBE',
    name: 'Test Tube',
    description: 'Increases DNA capacity by +10',
    icon: '🧪',
    category: 'dna',
    costType: 'dna' as const,
    ...TIER_0_BALANCE.TEST_TUBE
  },
  
  INTERN_SCIENTIST: {
    id: 'INTERN_SCIENTIST',
    name: 'Intern Scientist',
    description: 'Produces +0.2 DNA/s automatically',
    icon: '👨‍🔬',
    category: 'dna',
    costType: 'dna' as const,
    ...TIER_0_BALANCE.INTERN_SCIENTIST
  },
  
  PORTABLE_LAB: {
    id: 'PORTABLE_LAB',
    name: 'Portable Laboratory',
    description: 'Produces +1 DNA/s automatically',
    icon: '🏗️',
    category: 'dna',
    costType: 'dna' as const,
    ...TIER_0_BALANCE.PORTABLE_LAB
  },
  
  DNA_STORAGE: {
    id: 'DNA_STORAGE',
    name: 'DNA Storage',
    description: 'Increases DNA capacity by +20',
    icon: '📦',
    category: 'dna',
    costType: 'dna' as const,
    ...TIER_0_BALANCE.DNA_STORAGE
  },
  
  // Energy Upgrades
  IMPROVISED_GENERATOR: {
    id: 'IMPROVISED_GENERATOR',
    name: 'Improvised Generator',
    description: 'Produces +0.1 Energy/s automatically',
    icon: '⚡',
    category: 'energy',
    costType: 'dna' as const,
    ...TIER_0_BALANCE.IMPROVISED_GENERATOR
  },
  
  IMPROVISED_BATTERY: {
    id: 'IMPROVISED_BATTERY',
    name: 'Improvised Battery',
    description: 'Increases Energy capacity by +10',
    icon: '🔋',
    category: 'energy',
    costType: 'dna' as const,
    ...TIER_0_BALANCE.IMPROVISED_BATTERY
  },
  
  MICRO_PLASMA_REACTOR: {
    id: 'MICRO_PLASMA_REACTOR',
    name: 'Micro Plasma Reactor',
    description: 'Produces +2 Energy/s automatically',
    icon: '🔥',
    category: 'energy',
    costType: 'both' as const,
    ...TIER_0_BALANCE.MICRO_PLASMA_REACTOR
  }
} as const

// Upgrade categories
export const UPGRADE_CATEGORIES = {
  dna: {
    name: 'DNA',
    icon: '🧬',
    color: '#6EE7F8'
  },
  energy: {
    name: 'Energy',
    icon: '🔋',
    color: '#8B5CF6'
  }
} as const

// Função para obter upgrades por categoria
export const getUpgradesByCategory = (category: string) => {
  return Object.values(UPGRADES).filter(upgrade => upgrade.category === category)
}

// Função para obter upgrade por ID
export const getUpgradeById = (id: string) => {
  return UPGRADES[id as keyof typeof UPGRADES]
}