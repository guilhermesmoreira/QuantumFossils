// Modal para Save/Load de jogos
// Interface para exportar e importar saves

import React, { useState } from 'react'
import { saveManager } from '../../app/persistence/saveManager'
import type { GameState } from '../../domain/types'
import styles from './SaveLoadModal.module.css'

interface SaveLoadModalProps {
  isOpen: boolean
  onClose: () => void
  gameState: GameState
  onLoad: (gameState: GameState) => void
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onLoad
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save')
  const [importString, setImportString] = useState('')
  const [exportString, setExportString] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleExport = () => {
    try {
      const exported = saveManager.exportSave(gameState)
      setExportString(exported)
      setMessage('Save exported successfully!')
    } catch (error) {
      setMessage('Failed to export save')
    }
  }

  const handleImport = () => {
    if (!importString.trim()) {
      setMessage('Please paste a save string')
      return
    }

    setIsLoading(true)
    try {
      const importedState = saveManager.importSave(importString)
      if (importedState) {
        onLoad(importedState)
        setMessage('Save imported successfully!')
        setImportString('')
      }
    } catch (error) {
      setMessage('Invalid save string')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyExport = () => {
    navigator.clipboard.writeText(exportString)
    setMessage('Save string copied to clipboard!')
  }

  const handleDownloadExport = () => {
    const blob = new Blob([exportString], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `quantum-fossils-save-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setMessage('Save file downloaded!')
  }

  const handleClearSave = () => {
    if (confirm('Are you sure you want to clear your save? This cannot be undone!')) {
      saveManager.clearSave()
      setMessage('Save cleared! Reloading page...')
      
      // Recarregar a página após 1 segundo
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Save & Load Game</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'save' ? styles.active : ''}`}
            onClick={() => setActiveTab('save')}
          >
            💾 Save
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'load' ? styles.active : ''}`}
            onClick={() => setActiveTab('load')}
          >
            📥 Load
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'save' && (
            <div className={styles.saveSection}>
              <h3>Export Save</h3>
              <p className={styles.description}>
                Export your current progress as a string that you can save or share.
              </p>
              
              <div className={styles.actions}>
                <button className={styles.exportButton} onClick={handleExport}>
                  Generate Export String
                </button>
              </div>

              {exportString && (
                <div className={styles.exportArea}>
                  <label className={styles.label}>Save String:</label>
                  <textarea
                    className={styles.textarea}
                    value={exportString}
                    readOnly
                    rows={4}
                  />
                  <div className={styles.exportActions}>
                    <button className={styles.copyButton} onClick={handleCopyExport}>
                      📋 Copy
                    </button>
                    <button className={styles.downloadButton} onClick={handleDownloadExport}>
                      💾 Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'load' && (
            <div className={styles.loadSection}>
              <h3>Import Save</h3>
              <p className={styles.description}>
                Paste a save string to load a previous game state.
              </p>
              
              <div className={styles.importArea}>
                <label className={styles.label}>Save String:</label>
                <textarea
                  className={styles.textarea}
                  value={importString}
                  onChange={(e) => setImportString(e.target.value)}
                  placeholder="Paste your save string here..."
                  rows={4}
                />
                <div className={styles.importActions}>
                  <button 
                    className={styles.importButton} 
                    onClick={handleImport}
                    disabled={isLoading || !importString.trim()}
                  >
                    {isLoading ? 'Loading...' : '📥 Load Save'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={styles.dangerZone}>
            <h4>⚠️ Danger Zone</h4>
            <button className={styles.clearButton} onClick={handleClearSave}>
              🗑️ Clear Local Save
            </button>
          </div>

          {message && (
            <div className={styles.message}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
