import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>QuantumFossils</h1>
        <p>Projeto React + TypeScript</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Contador: {count}
          </button>
        </div>
        <p>
          Edite <code>src/App.tsx</code> e salve para recarregar.
        </p>
      </header>
    </div>
  )
}

export default App
