// Constantes de balanceamento do Tier 0
// Custos, caps, multiplicadores

export const TIER_0_BALANCE = {
  // DNA Upgrades (Category 1) - Balanceamento melhorado
  MICROSCOPE: {
    baseCost: 3, // Reduzido de 5 para 3
    baseEnergyCost: 0,
    costMultiplier: 1.25, // Aumentado de 1.15 para 1.25
    energyCostMultiplier: 1.1,
    maxLevel: 8, // Aumentado de 5 para 8
    effect: 1, // +1 DNA/click
    effectType: 'dnaPerClick' as const,
    unlocked: true
  },
  
  TEST_TUBE: {
    baseCost: 5, // Reduzido de 8 para 5
    baseEnergyCost: 1, // Reduzido de 2 para 1
    costMultiplier: 1.25, // Aumentado de 1.15 para 1.25
    energyCostMultiplier: 1.15, // Aumentado de 1.1 para 1.15
    maxLevel: 12, // Aumentado de 10 para 12
    effect: 15, // Aumentado de 10 para 15
    effectType: 'dnaCapacity' as const,
    unlocked: true
  },
  
  DNA_STORAGE: {
    baseCost: 20, // Reduzido de 25 para 20
    baseEnergyCost: 5, // Reduzido de 8 para 5
    costMultiplier: 1.3, // Aumentado de 1.15 para 1.3
    energyCostMultiplier: 1.2, // Aumentado de 1.1 para 1.2
    maxLevel: 6, // Aumentado de 5 para 6
    effect: 75, // Aumentado de 50 para 75
    effectType: 'dnaCapacity' as const,
    unlocked: true
  },
  
  INTERN_SCIENTIST: {
    baseCost: 8, // Reduzido de 15 para 8
    baseEnergyCost: 3, // Reduzido de 5 para 3
    costMultiplier: 1.3, // Aumentado de 1.15 para 1.3
    energyCostMultiplier: 1.2, // Aumentado de 1.1 para 1.2
    maxLevel: 8, // Aumentado de 5 para 8
    effect: 0.5, // Aumentado de 0.2 para 0.5
    effectType: 'dnaPerSecond' as const,
    unlocked: true
  },
  
  PORTABLE_LAB: {
    baseCost: 30, // Reduzido de 50 para 30
    baseEnergyCost: 10, // Reduzido de 15 para 10
    costMultiplier: 1.35, // Aumentado de 1.15 para 1.35
    energyCostMultiplier: 1.25, // Aumentado de 1.1 para 1.25
    maxLevel: 5, // Aumentado de 3 para 5
    effect: 2, // Aumentado de 1 para 2
    effectType: 'dnaPerSecond' as const,
    unlocked: true
  },
  
  // Energy Upgrades (Category 2) - Balanceamento melhorado
  IMPROVISED_GENERATOR: {
    baseCost: 4, // Reduzido de 8 para 4
    baseEnergyCost: 0,
    costMultiplier: 1.25, // Aumentado de 1.15 para 1.25
    energyCostMultiplier: 1.1,
    maxLevel: 15, // Aumentado de 10 para 15
    effect: 0.3, // Aumentado de 0.1 para 0.3
    effectType: 'energyPerSecond' as const,
    unlocked: true
  },
  
  IMPROVISED_BATTERY: {
    baseCost: 6, // Reduzido de 12 para 6
    baseEnergyCost: 2, // Reduzido de 3 para 2
    costMultiplier: 1.25, // Aumentado de 1.15 para 1.25
    energyCostMultiplier: 1.15, // Aumentado de 1.1 para 1.15
    maxLevel: 15, // Aumentado de 10 para 15
    effect: 20, // Aumentado de 10 para 20
    effectType: 'energyCapacity' as const,
    unlocked: true
  },
  
  MICRO_PLASMA_REACTOR: {
    baseCost: 60, // Reduzido de 100 para 60
    baseEnergyCost: 15, // Reduzido de 25 para 15
    costMultiplier: 1.4, // Aumentado de 1.15 para 1.4
    energyCostMultiplier: 1.3, // Aumentado de 1.1 para 1.3
    maxLevel: 4, // Aumentado de 2 para 4
    effect: 3, // Aumentado de 2 para 3
    effectType: 'energyPerSecond' as const,
    unlocked: true
  }
} as const

// Function to calculate progressive cost for DNA
export const calculateUpgradeCost = (baseCost: number, level: number, multiplier: number): number => {
  return Math.floor(baseCost * Math.pow(multiplier, level))
}

// Function to calculate progressive cost for Energy
export const calculateEnergyCost = (baseEnergyCost: number, level: number, multiplier: number): number => {
  return Math.floor(baseEnergyCost * Math.pow(multiplier, level))
}

// Função para verificar se upgrade pode ser desbloqueado
export const canUnlockUpgrade = (): boolean => {
  // All upgrades are unlocked by default in the new balance
  return true
}