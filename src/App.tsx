import React from 'react'
import { useResources, useClickPower, useGameActions, useCapacities, useProduction, useUpgrades } from './app/store/hooks'
import { UpgradeCard } from './ui/components/UpgradeCard'
import { ProgressBar } from './ui/components/ProgressBar'
import { SaveLoadModal } from './ui/components/SaveLoadModal'
import { getUpgradesByCategory, UPGRADES } from './domain/content'
import styles from './App.module.css'
import './ui/theme.module.css'

function App() {
  const resources = useResources()
  const clickPower = useClickPower()
  const capacities = useCapacities()
  const production = useProduction()
  const upgrades = useUpgrades()
  const { clickDna, updateProduction, buyUpgrade, loadGame, saveGame } = useGameActions()

  // Game loop para produção automática
  React.useEffect(() => {
    const interval = setInterval(() => {
      updateProduction(1/60) // 60 FPS
    }, 1000/60)
    
    return () => clearInterval(interval)
  }, [updateProduction])

  // Auto-save a cada 60 segundos
  React.useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveGame()
    }, 60000) // 60 segundos
    
    return () => clearInterval(autoSaveInterval)
  }, [saveGame])

  const [showMaxUpgrades, setShowMaxUpgrades] = React.useState(false)
  const [showSaveLoadModal, setShowSaveLoadModal] = React.useState(false)

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
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Quantum Fossils</h1>
          <p className={styles.subtitle}>Tier 0 — Mad Scientist Laboratory</p>
          
          <div className={styles.saveLoadButtons}>
            <button 
              className={styles.saveButton}
              onClick={() => setShowSaveLoadModal(true)}
            >
              💾 Save/Load
            </button>
          </div>
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
            
            <div className={styles.resources}>
              <ProgressBar
                current={resources.dna}
                max={capacities.dna}
                label="DNA"
                icon="🧬"
                productionRate={production.dnaPerSecond}
                color="primary"
                isFull={resources.dna >= capacities.dna}
              />
              <ProgressBar
                current={resources.energy}
                max={capacities.energy}
                label="Energy"
                icon="🔋"
                productionRate={production.energyPerSecond}
                color="secondary"
                isFull={resources.energy >= capacities.energy}
              />
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
                  />
                )
              })}
            </div>
          </div>
        </div>
      </header>

      <SaveLoadModal
        isOpen={showSaveLoadModal}
        onClose={() => setShowSaveLoadModal(false)}
        gameState={{
          resources,
          capacities,
          productionRates: production,
          clickPower,
          productionAccumulators: { dnaAccumulator: 0, energyAccumulator: 0 },
          upgrades,
          tier: 0,
          sessionStartTime: Date.now(),
          lastSaveTime: Date.now()
        }}
        onLoad={loadGame}
      />
    </div>
  )
}

export default App
