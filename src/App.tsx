import React from 'react'
import { useResources, useClickPower, useGameActions, useCapacities, useProduction, useUpgrades, useAchievements } from './app/store/hooks'
import { UpgradeCard } from './ui/components/UpgradeCard'
import { ProgressBar } from './ui/components/ProgressBar'
import { SaveLoadModal } from './ui/components/SaveLoadModal'
import { UnlockNotification } from './ui/components/UnlockNotification'
import { Tier1Progress } from './ui/components/Tier1Progress'
import { getUpgradesByCategory, UPGRADES } from './domain/content'
import { isTier1Unlocked } from './domain/unlocks'
import styles from './App.module.css'
import './ui/theme.module.css'

function App() {
  const resources = useResources()
  const clickPower = useClickPower()
  const capacities = useCapacities()
  const production = useProduction()
  const upgrades = useUpgrades()
  const achievements = useAchievements()
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
  const [showTier1Notification, setShowTier1Notification] = React.useState(false)
  const [tier1Unlocked, setTier1Unlocked] = React.useState(false)
  

  const handleBuyUpgrade = (upgradeId: string) => {
    buyUpgrade(upgradeId)
  }

  const handleClickDna = () => {
    clickDna()
  }

  // Verificar desbloqueio do Tier 1 (sem notificação automática)
  React.useEffect(() => {
    const gameState = {
      resources,
      capacities,
      productionRates: production,
      clickPower,
      productionAccumulators: { dnaAccumulator: 0, energyAccumulator: 0 },
      upgrades,
      achievements,
      tier: 0,
      sessionStartTime: Date.now(),
      lastSaveTime: Date.now()
    }

    const isUnlocked = isTier1Unlocked(gameState)
    if (isUnlocked && !tier1Unlocked) {
      setTier1Unlocked(true)
    }
  }, [resources, capacities, production, clickPower, upgrades, tier1Unlocked])

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
          <div className={styles.titleContent}>
            <div className={styles.titleText}>
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
            
            <Tier1Progress
              totalDnaCollected={achievements.totalDnaCollected}
              totalEnergyCollected={achievements.totalEnergyCollected}
              onTier1Click={() => {
                if (tier1Unlocked) {
                  setShowTier1Notification(true)
                }
              }}
            />
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
                    gameState={{
                      resources,
                      capacities,
                      productionRates: production,
                      clickPower,
                      productionAccumulators: { dnaAccumulator: 0, energyAccumulator: 0 },
                      upgrades,
                      achievements,
                      tier: 0,
                      sessionStartTime: Date.now(),
                      lastSaveTime: Date.now()
                    }}
                  />
                )
              })}
            </div>
          </div>

          <div className={styles.centerContent}>
              <div className={styles.card}>
                <button className={styles.actionButton} onClick={handleClickDna}>
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
                    gameState={{
                      resources,
                      capacities,
                      productionRates: production,
                      clickPower,
                      productionAccumulators: { dnaAccumulator: 0, energyAccumulator: 0 },
                      upgrades,
                      achievements,
                      tier: 0,
                      sessionStartTime: Date.now(),
                      lastSaveTime: Date.now()
                    }}
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
            achievements,
            tier: 0,
            sessionStartTime: Date.now(),
            lastSaveTime: Date.now()
          }}
          onLoad={loadGame}
        />

        <UnlockNotification
          isVisible={showTier1Notification}
          title="🎉 Tier 1 Unlocked!"
          description="You've accumulated 1000+ DNA and 400+ Energy! The first dinosaurs are now available for creation."
          onClose={() => setShowTier1Notification(false)}
        />

      </div>
    )
  }

export default App
