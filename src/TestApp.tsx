import { useResources, useClickPower, useGameActions } from './app/store/hooks'
import './App.css'

function TestApp() {
  const resources = useResources()
  const clickPower = useClickPower()
  const { clickDna } = useGameActions()

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quantum Fossils - Teste</h1>
        <p>Tier 0 — Laboratório do Cientista Maluco</p>
        
        <div className="resources">
          <div className="resource">
            <span>🧬 DNA: {Math.floor(resources.dna)}</span>
          </div>
          <div className="resource">
            <span>🔋 Energia: {Math.floor(resources.energy)}</span>
          </div>
        </div>

        <div className="card">
          <button onClick={clickDna}>
            Coletar DNA (+{clickPower.dnaPerClick})
          </button>
        </div>
        
        <p>
          Clique na Máquina do Tempo para coletar DNA!
        </p>
      </header>
    </div>
  )
}

export default TestApp
