// Componente para mostrar progresso do Tier 1
// Barras de progresso para DNA e Energy acumulados

import React from 'react'
import styles from './Tier1Progress.module.css'

interface Tier1ProgressProps {
  totalDnaCollected: number
  totalEnergyCollected: number
  onTier1Click: () => void
}

export const Tier1Progress: React.FC<Tier1ProgressProps> = ({
  totalDnaCollected,
  totalEnergyCollected,
  onTier1Click
}) => {
  const maxDnaProgress = 1000
  const maxEnergyProgress = 400
  const dnaProgress = Math.min((totalDnaCollected / maxDnaProgress) * 100, 100)
  const energyProgress = Math.min((totalEnergyCollected / maxEnergyProgress) * 100, 100)
  
  const isTier1Ready = totalDnaCollected >= maxDnaProgress && totalEnergyCollected >= maxEnergyProgress

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Tier 1 Progress</h3>
        <p className={styles.subtitle}>Accumulate 1000 DNA & 400 Energy</p>
      </div>
      
      <div className={styles.progressBars}>
        <div className={styles.progressBar}>
          <div className={styles.progressLabel}>
            <span className={styles.icon}>🧬</span>
            <span className={styles.label}>DNA Collected</span>
            <span className={styles.value}>{Math.round(totalDnaCollected)}/1000</span>
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ width: `${dnaProgress}%` }}
            />
          </div>
        </div>
        
        <div className={styles.progressBar}>
          <div className={styles.progressLabel}>
            <span className={styles.icon}>🔋</span>
            <span className={styles.label}>Energy Collected</span>
            <span className={styles.value}>{Math.round(totalEnergyCollected)}/400</span>
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ width: `${energyProgress}%` }}
            />
          </div>
        </div>
      </div>
      
      <button 
        className={`${styles.tier1Button} ${isTier1Ready ? styles.tier1ButtonReady : styles.tier1ButtonDisabled}`}
        onClick={onTier1Click}
        disabled={!isTier1Ready}
      >
        Tier 1
      </button>
    </div>
  )
}
