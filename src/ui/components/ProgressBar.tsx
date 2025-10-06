// Componente ProgressBar para mostrar capacidades
// Barra de progresso com animações e feedback visual

import React from 'react'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  current: number
  max: number
  label: string
  icon: string
  productionRate?: number
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  showPercentage?: boolean
  isFull?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  icon,
  productionRate = 0,
  color = 'primary',
  showPercentage = true,
  isFull = false
}) => {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0
  const isNearFull = percentage >= 90
  const isAtCapacity = percentage >= 100


  const getContainerClass = () => {
    if (isAtCapacity) return `${styles.container} ${styles.containerFull}`
    if (isNearFull) return `${styles.container} ${styles.containerNearFull}`
    return styles.container
  }

  return (
    <div className={getContainerClass()}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
        {showPercentage && (
          <span className={styles.percentage}>{Math.round(percentage)}%</span>
        )}
      </div>
      
      <div className={styles.values}>
        <span className={styles.currentValue}>{Math.round(current * 10) / 10}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.maxValue}>{max}</span>
        {isAtCapacity && (
          <span className={styles.fullText}>FULL!</span>
        )}
      </div>
      
      <div className={styles.productionRate}>
        <span className={styles.productionLabel}>Production:</span>
        <span className={styles.productionValue}>+{Math.round(productionRate * 10) / 10}/s</span>
      </div>
    </div>
  )
}
