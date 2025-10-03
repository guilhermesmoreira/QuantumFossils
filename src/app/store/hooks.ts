// Hooks personalizados para facilitar o uso do store
// Separação de responsabilidades e melhor performance

import { useGameStore } from './index'

// Hook para recursos
export const useResources = () => {
  return useGameStore(state => state.resources)
}

// Hook para capacidades
export const useCapacities = () => {
  return useGameStore(state => state.capacities)
}

// Hook para produção
export const useProduction = () => {
  return useGameStore(state => state.productionRates)
}

// Hook para poder de clique
export const useClickPower = () => {
  return useGameStore(state => state.clickPower)
}

// Hook para upgrades
export const useUpgrades = () => {
  return useGameStore(state => state.upgrades)
}

// Hook para ações
export const useGameActions = () => {
  const clickDna = useGameStore(state => state.clickDna)
  const addDna = useGameStore(state => state.addDna)
  const addEnergy = useGameStore(state => state.addEnergy)
  const buyUpgrade = useGameStore(state => state.buyUpgrade)
  const updateProduction = useGameStore(state => state.updateProduction)
  const setResources = useGameStore(state => state.setResources)
  const resetGame = useGameStore(state => state.resetGame)

  return {
    clickDna,
    addDna,
    addEnergy,
    buyUpgrade,
    updateProduction,
    setResources,
    resetGame
  }
}

// Hook para estado completo (use com cuidado - pode causar re-renders desnecessários)
export const useGameState = () => {
  return useGameStore()
}
