// Game loop principal com requestAnimationFrame
// Gerencia o tick do jogo e deltaTime

export class GameLoop {
  private lastTime = 0
  private isRunning = false
  private animationId: number | null = null
  private tickCallback: (deltaTime: number) => void

  constructor(tickCallback: (deltaTime: number) => void) {
    this.tickCallback = tickCallback
  }

  // Iniciar o game loop
  start(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    this.lastTime = performance.now()
    this.tick()
  }

  // Parar o game loop
  stop(): void {
    this.isRunning = false
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  // Tick principal do jogo
  private tick = (): void => {
    if (!this.isRunning) return

    const currentTime = performance.now()
    const deltaTime = (currentTime - this.lastTime) / 1000 // Converter para segundos
    this.lastTime = currentTime

    // Chamar callback com deltaTime
    this.tickCallback(deltaTime)

    // Agendar próximo frame
    this.animationId = requestAnimationFrame(this.tick)
  }

  // Verificar se está rodando
  isActive(): boolean {
    return this.isRunning
  }

  // Obter FPS atual (aproximado)
  getFPS(): number {
    if (!this.isRunning) return 0
    const currentTime = performance.now()
    const deltaTime = (currentTime - this.lastTime) / 1000
    return deltaTime > 0 ? Math.round(1 / deltaTime) : 0
  }
}