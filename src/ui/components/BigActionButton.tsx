import React, { useState } from 'react'
import styles from './BigActionButton.module.css'

interface BigActionButtonProps {
  onClick: () => void
  dnaPerClick: number
  isEnabled: boolean
  className?: string
}

export const BigActionButton: React.FC<BigActionButtonProps> = ({
  onClick,
  dnaPerClick,
  isEnabled,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (!isEnabled) return
    
    setIsAnimating(true)
    onClick()
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        className={`${styles.actionButton} ${isAnimating ? styles.animating : ''} ${!isEnabled ? styles.disabled : ''}`}
        onClick={handleClick}
        disabled={!isEnabled}
      >
        <div className={styles.buttonContent}>
          <div className={styles.buttonIcon}>🧬 +{dnaPerClick}</div>
          <div className={styles.buttonText}>EXTRACT DNA</div>
        </div>
        
        <div className={styles.buttonGlow}></div>
      </button>
    </div>
  )
}
