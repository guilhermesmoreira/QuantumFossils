import React from 'react'
import { useResources, useClickPower, useGameActions, useCapacities, useProduction } from './app/store/hooks'
import { useGameLoop } from './app/loop/useGameLoop'
import { UpgradePanel } from './ui/components/UpgradePanel'
import styles from './App.module.css'
import './ui/theme.module.css'

function App() {
  const resources = useResources()
  const clickPower = useClickPower()
  const capacities = useCapacities()
  const production = useProduction()
  const { clickDna, updateProduction } = useGameActions()

  // Game loop para produção automática
  const gameLoopCallback = React.useCallback((deltaTime: number) => {
    updateProduction(deltaTime)
  }, [updateProduction])
  
  const { startLoop, stopLoop, isRunning, getFPS } = useGameLoop(gameLoopCallback)

  // Iniciar game loop quando o componente monta
  React.useEffect(() => {
    startLoop()
    return () => stopLoop()
  }, [startLoop, stopLoop])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Quantum Fossils</h1>
        <p className={styles.subtitle}>Tier 0 — Mad Scientist Laboratory</p>
        
        <div className={styles.resources}>
          <div className={styles.resource}>
            <span className={styles.resourceIcon}>🧬</span>
            <div className={styles.resourceValue}>{Math.round(resources.dna * 10) / 10}/{capacities.dna}</div>
            <div className={styles.resourceLabel}>DNA</div>
          </div>
          <div className={styles.resource}>
            <span className={styles.resourceIcon}>🔋</span>
            <div className={styles.resourceValue}>{Math.round(resources.energy * 10) / 10}/{capacities.energy}</div>
            <div className={styles.resourceLabel}>Energy</div>
          </div>
        </div>

        <div className={styles.card}>
          <button className={styles.actionButton} onClick={clickDna}>
            DNA (+{clickPower.dnaPerClick})
          </button>
        </div>
        
        <p className={styles.description}>
          Click to collect DNA! Energy is produced automatically.
        </p>
        
        <div className={styles.debug}>
          <p>Game Loop: {isRunning() ? 'Active' : 'Inactive'}</p>
          <p>FPS: {getFPS()}</p>
          <p>DNA/s: {Math.round(production.dnaPerSecond * 10) / 10}</p>
          <p>Energy/s: {Math.round(production.energyPerSecond * 10) / 10}</p>
          <p>DNA: {Math.round(resources.dna * 10) / 10}/{capacities.dna}</p>
          <p>Energy: {Math.round(resources.energy * 10) / 10}/{capacities.energy}</p>
        </div>
      </header>
      
      <UpgradePanel />
    </div>
  )
}

export default App
