// Componente UpgradePanel para exibir lista de upgrades
// Painel com upgrades organizados por categoria

import React from 'react'
import { UpgradeCard } from './UpgradeCard'
import { UPGRADE_CATEGORIES, getUpgradesByCategory } from '../../domain/content'
import { useResources, useUpgrades, useGameActions } from '../../app/store/hooks'
import styles from './UpgradePanel.module.css'

export const UpgradePanel: React.FC = () => {
  const resources = useResources()
  const upgrades = useUpgrades()
  const { buyUpgrade } = useGameActions()

  const handleBuyUpgrade = (upgradeId: string) => {
    buyUpgrade(upgradeId)
  }

  const renderUpgradeCategory = (category: string) => {
    const categoryUpgrades = getUpgradesByCategory(category)
    const categoryInfo = UPGRADE_CATEGORIES[category as keyof typeof UPGRADE_CATEGORIES]

    return (
      <div key={category} className={styles.category}>
        <div className={styles.categoryHeader}>
          <span className={styles.categoryIcon}>{categoryInfo.icon}</span>
          <h2 className={styles.categoryTitle}>{categoryInfo.name}</h2>
        </div>
        
        <div className={styles.upgradesGrid}>
          {categoryUpgrades.map(upgradeTemplate => {
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
    )
  }

  return (
    <div className={styles.upgradePanel}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upgrades</h1>
        <p className={styles.subtitle}>Improve your production and capacities</p>
      </div>
      
      <div className={styles.categories}>
        {Object.keys(UPGRADE_CATEGORIES).map(renderUpgradeCategory)}
      </div>
    </div>
  )
}
