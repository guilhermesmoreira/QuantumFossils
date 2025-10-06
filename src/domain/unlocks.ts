// Sistema de desbloqueios condicionais
// Define condições para desbloquear upgrades e features

import type { GameState } from './types'

export interface UnlockCondition {
  id: string
  type: 'resource' | 'upgrade' | 'combination'
  requirements: {
    dna?: number
    energy?: number
    upgradeLevel?: { [upgradeId: string]: number }
  }
  description: string
}

export const UNLOCK_CONDITIONS: Record<string, UnlockCondition> = {
  // Micro Reator de Plasma - desbloqueado quando Energy ≥ 25
  MICRO_PLASMA_REACTOR: {
    id: 'MICRO_PLASMA_REACTOR',
    type: 'resource',
    requirements: {
      energy: 25
    },
    description: 'Requires 25+ Energy to unlock'
  },

  // Laboratório Portátil - desbloqueado quando tem pelo menos 1 Estagiário
  PORTABLE_LAB: {
    id: 'PORTABLE_LAB',
    type: 'upgrade',
    requirements: {
      upgradeLevel: {
        INTERN_SCIENTIST: 1
      }
    },
    description: 'Requires at least 1 Intern Scientist'
  },

  // Tier 1 - desbloqueado quando DNA ≥ 100 E Energy ≥ 100
  TIER_1: {
    id: 'TIER_1',
    type: 'combination',
    requirements: {
      dna: 100,
      energy: 100
    },
    description: 'Requires 100+ DNA and 100+ Energy to unlock'
  }
}

// Verificar se uma condição de desbloqueio foi atendida
export const checkUnlockCondition = (conditionId: string, gameState: GameState): boolean => {
  const condition = UNLOCK_CONDITIONS[conditionId]
  if (!condition) return false

  const { requirements } = condition

  // Verificar requisitos de recursos
  if (requirements.dna !== undefined && gameState.resources.dna < requirements.dna) {
    return false
  }

  if (requirements.energy !== undefined && gameState.resources.energy < requirements.energy) {
    return false
  }

  // Verificar requisitos de upgrades
  if (requirements.upgradeLevel) {
    for (const [upgradeId, requiredLevel] of Object.entries(requirements.upgradeLevel)) {
      const upgrade = gameState.upgrades[upgradeId]
      if (!upgrade || upgrade.level < requiredLevel) {
        return false
      }
    }
  }

  return true
}

// Verificar se um upgrade específico está desbloqueado
export const isUpgradeUnlocked = (upgradeId: string, gameState: GameState): boolean => {
  // Upgrades básicos sempre desbloqueados
  const basicUpgrades = ['MICROSCOPE', 'TEST_TUBE', 'DNA_STORAGE', 'INTERN_SCIENTIST', 'IMPROVISED_GENERATOR', 'IMPROVISED_BATTERY']
  if (basicUpgrades.includes(upgradeId)) {
    return true
  }

  // Se o upgrade já foi comprado (level > 0), está desbloqueado
  const upgrade = gameState.upgrades[upgradeId]
  if (upgrade && upgrade.level > 0) {
    return true
  }

  // Verificar condições específicas para desbloqueio inicial
  switch (upgradeId) {
    case 'PORTABLE_LAB':
      return checkUnlockCondition('PORTABLE_LAB', gameState)
    case 'MICRO_PLASMA_REACTOR':
      // Desbloqueado se já alcançou 25+ Energy alguma vez
      return gameState.achievements?.hasReached25Energy || false
    default:
      return true
  }
}

// Verificar se Tier 1 está desbloqueado
export const isTier1Unlocked = (gameState: GameState): boolean => {
  return gameState.achievements?.hasReached1000Dna && gameState.achievements?.hasReached400Energy
}

// Obter progresso para desbloqueio de um upgrade
export const getUnlockProgress = (upgradeId: string, gameState: GameState): { unlocked: boolean; progress: number; description: string } => {
  const unlocked = isUpgradeUnlocked(upgradeId, gameState)
  
  if (unlocked) {
    return { unlocked: true, progress: 100, description: 'Unlocked' }
  }

  // Se o upgrade já foi comprado, não mostrar barra de progresso
  const upgrade = gameState.upgrades[upgradeId]
  if (upgrade && upgrade.level > 0) {
    return { unlocked: true, progress: 100, description: 'Unlocked' }
  }

  switch (upgradeId) {
    case 'PORTABLE_LAB': {
      const internLevel = gameState.upgrades.INTERN_SCIENTIST?.level || 0
      const progress = Math.min((internLevel / 1) * 100, 100)
      return {
        unlocked: false,
        progress,
        description: `Requires 1 Intern Scientist (${internLevel}/1)`
      }
    }
    
    case 'MICRO_PLASMA_REACTOR': {
      // Se já alcançou 25+ Energy alguma vez, está desbloqueado
      if (gameState.achievements?.hasReached25Energy) {
        return { unlocked: true, progress: 100, description: 'Unlocked' }
      }
      
      const energy = gameState.resources.energy
      const progress = Math.min((energy / 25) * 100, 100)
      return {
        unlocked: false,
        progress,
        description: `Requires 25+ Energy (${Math.round(energy)}/25)`
      }
    }
    
    default:
      return { unlocked: true, progress: 100, description: 'Unlocked' }
  }
}

// Obter progresso para desbloqueio do Tier 1
export const getTier1Progress = (gameState: GameState): { unlocked: boolean; progress: number; description: string } => {
  const unlocked = isTier1Unlocked(gameState)
  
  if (unlocked) {
    return { unlocked: true, progress: 100, description: 'Tier 1 Unlocked!' }
  }

  const dna = gameState.resources.dna
  const energy = gameState.resources.energy
  const dnaProgress = Math.min((dna / 100) * 100, 100)
  const energyProgress = Math.min((energy / 100) * 100, 100)
  const overallProgress = Math.min(dnaProgress, energyProgress)

  return {
    unlocked: false,
    progress: overallProgress,
    description: `Requires 100+ DNA and 100+ Energy (DNA: ${Math.round(dna)}/100, Energy: ${Math.round(energy)}/100)`
  }
}
