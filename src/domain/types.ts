// Tipos TypeScript do domínio do jogo
// Resources, Upgrades, Buildings, etc.

export interface Resources {
  dna: number
  energy: number
}

export interface Capacities {
  dna: number
  energy: number
}

export interface ProductionRates {
  dnaPerSecond: number
  energyPerSecond: number
}

export interface ClickPower {
  dnaPerClick: number
}

export interface ProductionAccumulators {
  dnaAccumulator: number
  energyAccumulator: number
}

export interface Upgrade {
  id: string
  name: string
  description: string
  icon: string
  category: string
  baseCost: number
  baseEnergyCost: number
  costMultiplier: number
  energyCostMultiplier: number
  level: number
  maxLevel: number
  effect: number
  effectType: 'dnaPerClick' | 'dnaPerSecond' | 'energyPerSecond' | 'dnaCapacity' | 'energyCapacity'
  unlocked: boolean
  costType: 'dna' | 'energy' | 'both'
}

export interface GameState {
  resources: Resources
  capacities: Capacities
  productionRates: ProductionRates
  clickPower: ClickPower
  productionAccumulators: ProductionAccumulators
  upgrades: Record<string, Upgrade>
  tier: number
  sessionStartTime: number
  lastSaveTime: number
}
