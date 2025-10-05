// Componente UpgradePanel para exibir lista de upgrades
// Painel com upgrades organizados por categoria

import React from 'react'
import { UpgradeCard } from './UpgradeCard'
import { getUpgradesByCategory } from '../../domain/content'
import { useResources, useUpgrades, useGameActions } from '../../app/store/hooks'
import styles from './UpgradePanel.module.css'

export const UpgradePanel: React.FC = () => {
  const resources = useResources()
  const upgrades = useUpgrades()
  const { buyUpgrade } = useGameActions()

  const handleBuyUpgrade = (upgradeId: string) => {
    buyUpgrade(upgradeId)
  }


  return (
    <div className={styles.upgradePanel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upgrades</h1>
        <p className={styles.subtitle}>Improve your production and capacities</p>
      </div>
      
      <div className={styles.columnsContainer}>
        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <span className={styles.columnIcon}>🧬</span>
            <h2 className={styles.columnTitle}>DNA Upgrades</h2>
          </div>
          <div className={styles.upgradesList}>
            {getUpgradesByCategory('dna').map(upgradeTemplate => {
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

        <div className={styles.column}>
          <div className={styles.columnHeader}>
            <span className={styles.columnIcon}>🔋</span>
            <h2 className={styles.columnTitle}>Energy Upgrades</h2>
          </div>
          <div className={styles.upgradesList}>
            {getUpgradesByCategory('energy').map(upgradeTemplate => {
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
    </div>
  )
}
