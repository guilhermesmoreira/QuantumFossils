// Componente UpgradeCard para exibir upgrades
// Card com informações do upgrade e botão de compra

import React from 'react'
import type { Upgrade } from '../../domain/types'
import { calculateUpgradeCost, canUnlockUpgrade } from '../../domain/balance'
import styles from './UpgradeCard.module.css'

interface UpgradeCardProps {
  upgrade: Upgrade
  currentDna: number
  currentEnergy: number
  onBuy: (upgradeId: string) => void
  gameState: any
}

export const UpgradeCard: React.FC<UpgradeCardProps> = ({
  upgrade,
  currentDna,
  currentEnergy,
  onBuy,
  gameState
}) => {
  const cost = calculateUpgradeCost(upgrade.baseCost, upgrade.level, upgrade.costMultiplier)
  const isUnlocked = canUnlockUpgrade(upgrade.id, gameState)
  const canAfford = currentDna >= cost && (!upgrade.energyCost || currentEnergy >= upgrade.energyCost)
  const isMaxLevel = upgrade.level >= upgrade.maxLevel
  const canBuy = isUnlocked && canAfford && !isMaxLevel

  const handleBuy = () => {
    if (canBuy) {
      onBuy(upgrade.id)
    }
  }

  const getButtonText = () => {
    if (!isUnlocked) return 'Locked'
    if (isMaxLevel) return 'Max Level'
    if (!canAfford) return 'Insufficient Resources'
    return `Buy (${cost} DNA${upgrade.energyCost ? ` + ${upgrade.energyCost} Energy` : ''})`
  }

  const getButtonClass = () => {
    if (!isUnlocked) return styles.buttonBlocked
    if (isMaxLevel) return styles.buttonMaxLevel
    if (!canAfford) return styles.buttonInsufficient
    return styles.buttonBuy
  }

  return (
    <div className={`${styles.upgradeCard} ${!isUnlocked ? styles.blocked : ''}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{upgrade.icon}</span>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{upgrade.name}</h3>
          <p className={styles.level}>Level {upgrade.level}/{upgrade.maxLevel}</p>
        </div>
      </div>
      
      <p className={styles.description}>{upgrade.description}</p>
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Cost:</span>
          <span className={styles.statValue}>
            {cost} DNA
            {upgrade.energyCost && ` + ${upgrade.energyCost} Energy`}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Effect:</span>
          <span className={styles.statValue}>+{upgrade.effect}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Acquired:</span>
          <span className={styles.statValue}>+{Math.round(upgrade.effect * upgrade.level * 10) / 10}</span>
        </div>
      </div>
      
      <button 
        className={getButtonClass()}
        onClick={handleBuy}
        disabled={!canBuy}
      >
        {getButtonText()}
      </button>
    </div>
  )
}
