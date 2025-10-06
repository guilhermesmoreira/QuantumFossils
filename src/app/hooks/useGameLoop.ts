import { useEffect, useRef } from 'react'

interface GameLoopOptions {
  onUpdate: (deltaTime: number) => void
  targetFPS?: number
  enabled?: boolean
}

export const useGameLoop = ({ 
  onUpdate, 
  targetFPS = 60, 
  enabled = true 
}: GameLoopOptions) => {
  const frameRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const targetFrameTime = 1000 / targetFPS

  useEffect(() => {
    if (!enabled) return

    const gameLoop = (currentTime: number) => {
      // Calcular deltaTime em segundos
      const deltaTime = (currentTime - lastTimeRef.current) / 1000
      lastTimeRef.current = currentTime

      // Só atualizar se passou tempo suficiente (para respeitar targetFPS)
      if (deltaTime >= targetFrameTime / 1000) {
        onUpdate(deltaTime)
      }

      // Continuar o loop
      frameRef.current = requestAnimationFrame(gameLoop)
    }

    // Iniciar o loop
    frameRef.current = requestAnimationFrame(gameLoop)

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [onUpdate, targetFPS, enabled])
}
