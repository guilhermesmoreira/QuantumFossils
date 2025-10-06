// Store principal do Zustand
// Aqui ficará o estado global do jogo

import { create } from 'zustand'
import type { GameState, Resources } from '../../domain/types'
import { UPGRADES } from '../../domain/content'
import { calculateUpgradeCost, calculateEnergyCost, canUnlockUpgrade } from '../../domain/balance'

interface GameStore extends GameState {
  // Actions
  clickDna: () => void
  addDna: (amount: number) => void
  addEnergy: (amount: number) => void
  buyUpgrade: (upgradeId: string) => boolean
  updateProduction: (deltaTime: number) => void
  setResources: (resources: Partial<Resources>) => void
  resetGame: () => void
}

// Estado inicial do jogo
const initialState: GameState = {
  resources: {
    dna: 0,
    energy: 0 // Começa com 0 energia
  },
  capacities: {
    dna: 10, // 1 Tubo de Ensaio inicial
    energy: 100 // 1 Bateria inicial
  },
  productionRates: {
    dnaPerSecond: 0,
    energyPerSecond: 0 // Começa com 0 produção
  },
  clickPower: {
    dnaPerClick: 1
  },
  productionAccumulators: {
    dnaAccumulator: 0,
    energyAccumulator: 0
  },
  upgrades: {
    // Inicializar upgrades com nível 0
    MICROSCOPE: { ...UPGRADES.MICROSCOPE, level: 0 },
    TEST_TUBE: { ...UPGRADES.TEST_TUBE, level: 0 },
    INTERN_SCIENTIST: { ...UPGRADES.INTERN_SCIENTIST, level: 0 },
    PORTABLE_LAB: { ...UPGRADES.PORTABLE_LAB, level: 0 },
    DNA_STORAGE: { ...UPGRADES.DNA_STORAGE, level: 0 },
    IMPROVISED_GENERATOR: { ...UPGRADES.IMPROVISED_GENERATOR, level: 0 },
    IMPROVISED_BATTERY: { ...UPGRADES.IMPROVISED_BATTERY, level: 0 },
    MICRO_PLASMA_REACTOR: { ...UPGRADES.MICRO_PLASMA_REACTOR, level: 0 }
  },
  tier: 0,
  sessionStartTime: Date.now(),
  lastSaveTime: Date.now()
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  // Clique para gerar DNA
  clickDna: () => {
    const state = get()
    const { dna } = state.resources
    const { dnaPerClick } = state.clickPower
    const { dna: dnaCapacity } = state.capacities

    // Só gera DNA se não estiver na capacidade máxima
    if (dna < dnaCapacity) {
      const newDna = Math.min(dna + dnaPerClick, dnaCapacity)
      set({
        resources: { ...state.resources, dna: newDna }
      })
    } else {
      // TODO: Adicionar feedback visual de capacidade cheia
      console.log('DNA capacity is full!')
    }
  },

  // Adicionar DNA (para produção automática)
  addDna: (amount: number) => {
    const state = get()
    const { dna } = state.resources
    const { dna: dnaCapacity } = state.capacities
    
    const newDna = Math.min(dna + amount, dnaCapacity)
    set({
      resources: { ...state.resources, dna: newDna }
    })
  },

  // Adicionar Energia (para produção automática)
  addEnergy: (amount: number) => {
    const state = get()
    const { energy } = state.resources
    const { energy: energyCapacity } = state.capacities
    
    const newEnergy = Math.min(energy + amount, energyCapacity)
    set({
      resources: { ...state.resources, energy: newEnergy }
    })
  },

  // Comprar upgrade
  buyUpgrade: (upgradeId: string) => {
    const state = get()
    const upgrade = state.upgrades[upgradeId]
    
    if (!upgrade) return false
    
    // Verificar se está desbloqueado
    if (!canUnlockUpgrade()) return false
    
    // Verificar se não atingiu o nível máximo
    if (upgrade.level >= upgrade.maxLevel) return false
    
    // Calcular custos
    const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.level, upgrade.costMultiplier)
    const energyCost = calculateEnergyCost(upgrade.baseEnergyCost || 0, upgrade.level, upgrade.energyCostMultiplier || 1.1)
    
    // Verificar se tem recursos suficientes
    if (state.resources.dna < cost) return false
    if (state.resources.energy < energyCost) return false
    
    // Comprar upgrade
    const newLevel = upgrade.level + 1
    const newUpgrades = { ...state.upgrades }
    newUpgrades[upgradeId] = { ...upgrade, level: newLevel }
    
    // Aplicar efeitos
    let newResources = { ...state.resources }
    let newCapacities = { ...state.capacities }
    let newProductionRates = { ...state.productionRates }
    let newClickPower = { ...state.clickPower }
    
    // Subtrair custos
    newResources.dna -= cost
    newResources.energy -= energyCost
    
    // Aplicar efeitos baseados no tipo
    switch (upgrade.effectType) {
      case 'dnaPerClick':
        newClickPower.dnaPerClick += upgrade.effect
        break
      case 'dnaPerSecond':
        newProductionRates.dnaPerSecond += upgrade.effect
        break
      case 'energyPerSecond':
        newProductionRates.energyPerSecond += upgrade.effect
        break
      case 'dnaCapacity':
        newCapacities.dna += upgrade.effect
        break
      case 'energyCapacity':
        newCapacities.energy += upgrade.effect
        break
    }
    
    // Atualizar estado
    set({
      resources: newResources,
      capacities: newCapacities,
      productionRates: newProductionRates,
      clickPower: newClickPower,
      upgrades: newUpgrades
    })
    
    return true
  },

  // Atualizar produção automática com deltaTime
  updateProduction: (deltaTime: number) => {
    const state = get()
    const { dnaPerSecond, energyPerSecond } = state.productionRates
    
    let newDna = state.resources.dna
    let newEnergy = state.resources.energy
    let newDnaAccumulator = state.productionAccumulators.dnaAccumulator
    let newEnergyAccumulator = state.productionAccumulators.energyAccumulator
    
    if (dnaPerSecond > 0) {
      // Acumular produção de DNA
      newDnaAccumulator += dnaPerSecond * deltaTime
      
      // Se acumulou pelo menos 0.1, aplicar ao DNA
      if (newDnaAccumulator >= 0.1) {
        const dnaToAdd = Math.floor(newDnaAccumulator * 10) / 10 // Arredondar para 0.1
        newDna = Math.min(state.resources.dna + dnaToAdd, state.capacities.dna)
        newDnaAccumulator -= dnaToAdd // Remover o que foi aplicado
      }
    }
    
    if (energyPerSecond > 0) {
      // Acumular produção de Energy
      newEnergyAccumulator += energyPerSecond * deltaTime
      
      // Se acumulou pelo menos 0.1, aplicar à Energy
      if (newEnergyAccumulator >= 0.1) {
        const energyToAdd = Math.floor(newEnergyAccumulator * 10) / 10 // Arredondar para 0.1
        newEnergy = Math.min(state.resources.energy + energyToAdd, state.capacities.energy)
        newEnergyAccumulator -= energyToAdd // Remover o que foi aplicado
      }
    }
    
    // Atualizar estado se houve mudanças
    if (newDna !== state.resources.dna || newEnergy !== state.resources.energy || 
        newDnaAccumulator !== state.productionAccumulators.dnaAccumulator || 
        newEnergyAccumulator !== state.productionAccumulators.energyAccumulator) {
      set({
        resources: { ...state.resources, dna: newDna, energy: newEnergy },
        productionAccumulators: { dnaAccumulator: newDnaAccumulator, energyAccumulator: newEnergyAccumulator }
      })
    }
  },

  // Definir recursos
  setResources: (resources: Partial<Resources>) => {
    set(state => ({
      resources: { ...state.resources, ...resources }
    }))
  },

  // Resetar jogo
  resetGame: () => {
    set(initialState)
  }
}))
