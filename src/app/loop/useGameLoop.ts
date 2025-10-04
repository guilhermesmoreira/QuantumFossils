// Hook React para gerenciar o game loop
// Integra o GameLoop com React lifecycle

import { useEffect, useRef, useCallback } from 'react'
import { GameLoop } from './gameLoop'

export const useGameLoop = (tickCallback: (deltaTime: number) => void) => {
  const gameLoopRef = useRef<GameLoop | null>(null)
  const callbackRef = useRef(tickCallback)

  // Atualizar callback ref
  useEffect(() => {
    callbackRef.current = tickCallback
  }, [tickCallback])

  // Inicializar game loop apenas uma vez
  useEffect(() => {
    gameLoopRef.current = new GameLoop((deltaTime: number) => {
      callbackRef.current(deltaTime)
    })
    
    return () => {
      if (gameLoopRef.current) {
        gameLoopRef.current.stop()
      }
    }
  }, [])

  // Iniciar/parar game loop
  const startLoop = useCallback(() => {
    if (gameLoopRef.current) {
      gameLoopRef.current.start()
    }
  }, [])

  const stopLoop = useCallback(() => {
    if (gameLoopRef.current) {
      gameLoopRef.current.stop()
    }
  }, [])

  // Verificar status
  const isRunning = useCallback(() => {
    return gameLoopRef.current?.isActive() ?? false
  }, [])

  const getFPS = useCallback(() => {
    return gameLoopRef.current?.getFPS() ?? 0
  }, [])

  return {
    startLoop,
    stopLoop,
    isRunning,
    getFPS
  }
}
