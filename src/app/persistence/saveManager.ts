// Sistema de persistência híbrido
// localStorage + Export/Import de saves

import type { GameState } from '../../domain/types'

const SAVE_KEY = 'quantum-fossils-save'
const SAVE_VERSION = '1.0.0'

export interface SaveData {
  version: string
  timestamp: number
  gameState: GameState
}

export interface SaveManager {
  saveToLocalStorage: (gameState: GameState) => void
  loadFromLocalStorage: () => GameState | null
  exportSave: (gameState: GameState) => string
  importSave: (saveString: string) => GameState | null
  clearSave: () => void
  getLastSaveTime: () => number | null
}

// Salvar no localStorage
export const saveToLocalStorage = (gameState: GameState): void => {
  try {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      gameState: {
        ...gameState,
        lastSaveTime: Date.now()
      }
    }
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

// Carregar do localStorage
export const loadFromLocalStorage = (): GameState | null => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY)
    if (!savedData) return null
    
    const saveData: SaveData = JSON.parse(savedData)
    
    // Verificar versão do save
    if (saveData.version !== SAVE_VERSION) {
      console.warn('Save version mismatch, attempting migration...')
      return migrateSave(saveData)
    }
    
    return saveData.gameState
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

// Exportar save como string
export const exportSave = (gameState: GameState): string => {
  try {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      gameState: {
        ...gameState,
        lastSaveTime: Date.now()
      }
    }
    
    // Comprimir e codificar em base64
    const jsonString = JSON.stringify(saveData)
    const compressed = btoa(unescape(encodeURIComponent(jsonString)))
    
    return compressed
  } catch (error) {
    console.error('Failed to export save:', error)
    throw new Error('Failed to export save')
  }
}

// Importar save de string
export const importSave = (saveString: string): GameState | null => {
  try {
    // Decodificar e descomprimir
    const jsonString = decodeURIComponent(escape(atob(saveString)))
    const saveData: SaveData = JSON.parse(jsonString)
    
    // Verificar versão do save
    if (saveData.version !== SAVE_VERSION) {
      console.warn('Import save version mismatch, attempting migration...')
      return migrateSave(saveData)
    }
    
    return saveData.gameState
  } catch (error) {
    console.error('Failed to import save:', error)
    throw new Error('Invalid save string')
  }
}

// Limpar save
export const clearSave = (): void => {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch (error) {
    console.error('Failed to clear save:', error)
  }
}

// Obter timestamp do último save
export const getLastSaveTime = (): number | null => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY)
    if (!savedData) return null
    
    const saveData: SaveData = JSON.parse(savedData)
    return saveData.timestamp
  } catch (error) {
    console.error('Failed to get last save time:', error)
    return null
  }
}

// Migração de saves (para futuras versões)
const migrateSave = (saveData: SaveData): GameState | null => {
  // Por enquanto, apenas retorna o save como está
  // Futuramente, aqui seria implementada a lógica de migração
  console.log(`Migrating save from version ${saveData.version} to ${SAVE_VERSION}`)
  return saveData.gameState
}

// Manager principal
export const saveManager: SaveManager = {
  saveToLocalStorage,
  loadFromLocalStorage,
  exportSave,
  importSave,
  clearSave,
  getLastSaveTime
}
