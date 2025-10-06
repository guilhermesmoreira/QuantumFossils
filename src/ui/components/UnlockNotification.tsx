// Componente de notificação de desbloqueio
// Mostra quando um upgrade ou feature é desbloqueado

import React, { useEffect, useState } from 'react'
import styles from './UnlockNotification.module.css'

interface UnlockNotificationProps {
  isVisible: boolean
  title: string
  description: string
  onClose: () => void
}

export const UnlockNotification: React.FC<UnlockNotificationProps> = ({
  isVisible,
  title,
  description,
  onClose
}) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 2000) // Auto-close after 2 seconds
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className={`${styles.overlay} ${isAnimating ? styles.visible : ''}`}>
      <div className={styles.notification}>
        <div className={styles.icon}>🎉</div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  )
}
