// Constantes de balanceamento do Tier 0
// Custos, caps, multiplicadores

export const TIER_0_BALANCE = {
  // Upgrades de DNA
  MICROSCOPE: {
    baseCost: 10,
    costMultiplier: 1.15, // Progressive cost
    maxLevel: 5,
    effect: 1, // +1 DNA/click
    effectType: 'dnaPerClick' as const,
    unlocked: true
  },
  
  TEST_TUBE: {
    baseCost: 10,
    costMultiplier: 1.12, // Progressive cost
    maxLevel: 10, // +100 capacidade total
    effect: 10, // +10 capacidade DNA
    effectType: 'dnaCapacity' as const,
    unlocked: true
  },
  
  INTERN_SCIENTIST: {
    baseCost: 25,
    costMultiplier: 1.15,
    maxLevel: 5,
    effect: 0.2, // +0.2 DNA/s
    effectType: 'dnaPerSecond' as const,
    unlocked: true
  },
  
  PORTABLE_LAB: {
    baseCost: 150,
    costMultiplier: 1.2,
    maxLevel: 3,
    effect: 1, // +1 DNA/s
    effectType: 'dnaPerSecond' as const,
    unlocked: false // Desbloqueado após ter 1 Estagiário
  },
  
  DNA_STORAGE: {
    baseCost: 100,
    costMultiplier: 1.15,
    maxLevel: 10,
    effect: 20, // +20 capacidade DNA
    effectType: 'dnaCapacity' as const,
    unlocked: true
  },
  
  // Upgrades de Energia
  IMPROVISED_GENERATOR: {
    baseCost: 50,
    costMultiplier: 1.12,
    maxLevel: 10,
    effect: 0.1, // +0.1 Energia/s
    effectType: 'energyPerSecond' as const,
    unlocked: true
  },
  
  IMPROVISED_BATTERY: {
    baseCost: 100,
    costMultiplier: 1.0, // Custo fixo
    maxLevel: 10, // +100 capacidade total
    effect: 10, // +10 capacidade Energia
    effectType: 'energyCapacity' as const,
    unlocked: true
  },
  
  MICRO_PLASMA_REACTOR: {
    baseCost: 250,
    costMultiplier: 1.3,
    maxLevel: 2,
    effect: 2, // +2 Energia/s
    effectType: 'energyPerSecond' as const,
    energyCost: 25, // Custo adicional em energia
    unlocked: false // Desbloqueado após ter 25+ energia
  }
} as const

// Function to calculate progressive cost
export const calculateUpgradeCost = (baseCost: number, level: number, multiplier: number): number => {
  return Math.floor(baseCost * Math.pow(multiplier, level))
}

// Função para verificar se upgrade pode ser desbloqueado
export const canUnlockUpgrade = (upgradeId: string, gameState: any): boolean => {
  switch (upgradeId) {
    case 'PORTABLE_LAB':
      return gameState.upgrades.INTERN_SCIENTIST?.level > 0
    
    case 'MICRO_PLASMA_REACTOR':
      return gameState.resources.energy >= 25
    
    default:
      return true
  }
}