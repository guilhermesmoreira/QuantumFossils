import { useResources, useClickPower, useGameActions } from './app/store/hooks'
import styles from './App.module.css'
import './ui/theme.module.css'

function App() {
  const resources = useResources()
  const clickPower = useClickPower()
  const { clickDna } = useGameActions()
  const resources = useResources()
  const clickPower = useClickPower()
  const { clickDna } = useGameActions()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Quantum Fossils</h1>
        <p className={styles.subtitle}>Tier 0 — Laboratório do Cientista Maluco</p>
        
        <div className={styles.resources}>
          <div className={styles.resource}>
            <span className={styles.resourceIcon}>🧬</span>
            <div className={styles.resourceValue}>{Math.floor(resources.dna)}</div>
            <div className={styles.resourceLabel}>DNA</div>
          </div>
          <div className={styles.resource}>
            <span className={styles.resourceIcon}>🔋</span>
            <div className={styles.resourceValue}>{Math.floor(resources.energy)}</div>
            <div className={styles.resourceLabel}>Energia</div>
          </div>
        </div>

        <div className={styles.card}>
          <button className={styles.actionButton} onClick={clickDna}>
            Coletar DNA (+{clickPower.dnaPerClick})
          </button>
        </div>
        
        <p className={styles.description}>
          Clique na Máquina do Tempo para coletar DNA e iniciar sua jornada científica!
        </p>
      </header>
    </div>
  )
}

export default App
