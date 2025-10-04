import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import TestApp from './TestApp.tsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
)
