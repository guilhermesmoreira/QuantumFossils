// Store principal do Zustand
// Aqui ficará o estado global do jogo

import { create } from 'zustand'
import type { GameState, Resources } from '../../domain/types'

interface GameStore extends GameState {
  // Actions
  clickDna: () => void
  addDna: (amount: number) => void
  addEnergy: (amount: number) => void
  buyUpgrade: (upgradeId: string) => boolean
  updateProduction: () => void
  setResources: (resources: Partial<Resources>) => void
  resetGame: () => void
}

// Estado inicial do jogo
const initialState: GameState = {
  resources: {
    dna: 0,
    energy: 100 // Começa com energia inicial
  },
  capacities: {
    dna: 10, // 1 Tubo de Ensaio inicial
    energy: 100 // 1 Bateria inicial
  },
  productionRates: {
    dnaPerSecond: 0,
    energyPerSecond: 1 // Gerador inicial
  },
  clickPower: {
    dnaPerClick: 1
  },
  upgrades: {},
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
    
    if (!upgrade || !upgrade.unlocked) return false
    
    // TODO: Implementar lógica de custo e efeito
    return true
  },

  // Atualizar produção automática
  updateProduction: () => {
    const state = get()
    const { dnaPerSecond, energyPerSecond } = state.productionRates
    
    if (dnaPerSecond > 0) {
      const newDna = Math.min(state.resources.dna + dnaPerSecond / 60, state.capacities.dna)
      set({ resources: { ...state.resources, dna: newDna } })
    }
    
    if (energyPerSecond > 0) {
      const newEnergy = Math.min(state.resources.energy + energyPerSecond / 60, state.capacities.energy)
      set({ resources: { ...state.resources, energy: newEnergy } })
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
