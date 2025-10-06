import React from 'react'
import styles from './DebugOverlay.module.css'

interface DebugOverlayProps {
  isVisible: boolean
  onClose: () => void
  gameStats: {
    fps: number
    deltaTime: number
    resources: {
      dna: number
      energy: number
    }
    capacities: {
      dna: number
      energy: number
    }
    production: {
      dnaPerSecond: number
      energyPerSecond: number
    }
    clickPower: {
      dnaPerClick: number
    }
    upgrades: Record<string, any>
    achievements: {
      totalDnaCollected: number
      totalEnergyCollected: number
    }
    sessionStartTime: number
  }
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  isVisible,
  onClose,
  gameStats
}) => {
  if (!isVisible) return null

  const sessionTime = Math.floor((Date.now() - gameStats.sessionStartTime) / 1000)
  const sessionMinutes = Math.floor(sessionTime / 60)
  const sessionSeconds = sessionTime % 60

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>🔧 Debug Overlay</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.sections}>
          {/* Performance */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Performance</h4>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>FPS:</span>
                <span className={styles.statValue}>{gameStats.fps}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>DeltaTime:</span>
                <span className={styles.statValue}>{gameStats.deltaTime}s</span>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Resources</h4>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>DNA:</span>
                <span className={styles.statValue}>
                  {gameStats.resources.dna}/{gameStats.capacities.dna} 
                  <span className={styles.production}>(+{gameStats.production.dnaPerSecond.toFixed(1)}/s)</span>
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Energy:</span>
                <span className={styles.statValue}>
                  {gameStats.resources.energy}/{gameStats.capacities.energy}
                  <span className={styles.production}>(+{gameStats.production.energyPerSecond.toFixed(1)}/s)</span>
                </span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Click Power:</span>
                <span className={styles.statValue}>+{gameStats.clickPower.dnaPerClick} DNA</span>
              </div>
            </div>
          </div>

          {/* Upgrades */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Upgrades</h4>
            <div className={styles.upgradesList}>
              {Object.entries(gameStats.upgrades).map(([id, upgrade]) => (
                <div key={id} className={styles.upgradeItem}>
                  <span className={styles.upgradeName}>{upgrade.name}:</span>
                  <span className={styles.upgradeLevel}>Lv.{upgrade.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Statistics</h4>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Total DNA:</span>
                <span className={styles.statValue}>{gameStats.achievements.totalDnaCollected.toLocaleString()}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Total Energy:</span>
                <span className={styles.statValue}>{gameStats.achievements.totalEnergyCollected.toLocaleString()}</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Session Time:</span>
                <span className={styles.statValue}>{formatTime(sessionTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
