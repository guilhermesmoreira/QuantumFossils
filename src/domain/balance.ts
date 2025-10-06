// Constantes de balanceamento do Tier 0
// Custos, caps, multiplicadores

export const TIER_0_BALANCE = {
  // DNA Upgrades (Category 1)
  MICROSCOPE: {
    baseCost: 5,
    baseEnergyCost: 0,
    costMultiplier: 1.15,
    energyCostMultiplier: 1.1,
    maxLevel: 5,
    effect: 1, // +1 DNA/click
    effectType: 'dnaPerClick' as const,
    unlocked: true
  },
  
  TEST_TUBE: {
    baseCost: 8,
    baseEnergyCost: 2,
    costMultiplier: 1.15,
    energyCostMultiplier: 1.1,
    maxLevel: 10,
    effect: 10, // +10 DNA capacity
    effectType: 'dnaCapacity' as const,
    unlocked: true
  },
  
  DNA_STORAGE: {
    baseCost: 25,
    baseEnergyCost: 8,
    costMultiplier: 1.15,
    energyCostMultiplier: 1.1,
    maxLevel: 5,
    effect: 50, // +50 DNA capacity
    effectType: 'dnaCapacity' as const,
    unlocked: true
  },
  
  INTERN_SCIENTIST: {
    baseCost: 15,
    baseEnergyCost: 5,
    costMultiplier: 1.15,
    energyCostMultiplier: 1.1,
    maxLevel: 5,
    effect: 0.2, // +0.2 DNA/s
    effectType: 'dnaPerSecond' as const,
    unlocked: true
  },
  
  PORTABLE_LAB: {
    baseCost: 50,
    baseEnergyCost: 15,
    costMultiplier: 1.15,
    energyCostMultiplier: 1.1,
    maxLevel: 3,
    effect: 1, // +1 DNA/s
    effectType: 'dnaPerSecond' as const,
    unlocked: true
  },
  
  // Energy Upgrades (Category 2)
  IMPROVISED_GENERATOR: {
    baseCost: 8,
    baseEnergyCost: 0,
    costMultiplier: 1.15,
    energyCostMultiplier: 1.1,
    maxLevel: 10,
    effect: 0.1, // +0.1 Energy/s
    effectType: 'energyPerSecond' as const,
    unlocked: true
  },
  
  IMPROVISED_BATTERY: {
    baseCost: 12,
    baseEnergyCost: 3,
    costMultiplier: 1.15,
    energyCostMultiplier: 1.1,
    maxLevel: 10,
    effect: 10, // +10 Energy capacity
    effectType: 'energyCapacity' as const,
    unlocked: true
  },
  
  MICRO_PLASMA_REACTOR: {
    baseCost: 100,
    baseEnergyCost: 25,
    costMultiplier: 1.15,
    energyCostMultiplier: 1.1,
    maxLevel: 2,
    effect: 2, // +2 Energy/s
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