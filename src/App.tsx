import React from 'react'
import { useResources, useClickPower, useGameActions, useCapacities, useProduction, useUpgrades } from './app/store/hooks'
import { useGameLoop } from './app/loop/useGameLoop'
import { UpgradeCard } from './ui/components/UpgradeCard'
import { getUpgradesByCategory, UPGRADES } from './domain/content'
import styles from './App.module.css'
import './ui/theme.module.css'

function App() {
  const resources = useResources()
  const clickPower = useClickPower()
  const capacities = useCapacities()
  const production = useProduction()
  const upgrades = useUpgrades()
  const { clickDna, updateProduction, buyUpgrade } = useGameActions()

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

  const [showMaxUpgrades, setShowMaxUpgrades] = React.useState(false)

  const handleBuyUpgrade = (upgradeId: string) => {
    buyUpgrade(upgradeId)
  }

  const isUpgradeMaxed = (upgradeId: string) => {
    const upgrade = upgrades[upgradeId]
    const upgradeTemplate = UPGRADES[upgradeId as keyof typeof UPGRADES]
    if (!upgrade || !upgradeTemplate) return false
    return upgrade.level >= upgradeTemplate.maxLevel
  }

  const filterUpgrades = (upgradeTemplates: any[]) => {
    return upgradeTemplates.filter(upgradeTemplate => {
      const upgrade = upgrades[upgradeTemplate.id]
      if (!upgrade) return true
      
      const isMaxed = isUpgradeMaxed(upgradeTemplate.id)
      return showMaxUpgrades || !isMaxed
    })
  }

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

        <div className={styles.upgradeFilter}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showMaxUpgrades}
              onChange={(e) => setShowMaxUpgrades(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Show max upgrades</span>
          </label>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            <div className={styles.columnHeader}>
              <span className={styles.columnIcon}>🧬</span>
              <h2 className={styles.columnTitle}>DNA Upgrades</h2>
            </div>
            <div className={styles.upgradesList}>
              {filterUpgrades(getUpgradesByCategory('dna')).map(upgradeTemplate => {
                const upgrade = upgrades[upgradeTemplate.id]
                if (!upgrade) return null

                return (
                  <UpgradeCard
                    key={upgrade.id}
                    upgrade={upgrade}
                    currentDna={resources.dna}
                    currentEnergy={resources.energy}
                    onBuy={handleBuyUpgrade}
                    gameState={{ resources, upgrades }}
                  />
                )
              })}
            </div>
          </div>

          <div className={styles.centerContent}>
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
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.columnHeader}>
              <span className={styles.columnIcon}>🔋</span>
              <h2 className={styles.columnTitle}>Energy Upgrades</h2>
            </div>
            <div className={styles.upgradesList}>
              {filterUpgrades(getUpgradesByCategory('energy')).map(upgradeTemplate => {
                const upgrade = upgrades[upgradeTemplate.id]
                if (!upgrade) return null

                return (
                  <UpgradeCard
                    key={upgrade.id}
                    upgrade={upgrade}
                    currentDna={resources.dna}
                    currentEnergy={resources.energy}
                    onBuy={handleBuyUpgrade}
                    gameState={{ resources, upgrades }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
