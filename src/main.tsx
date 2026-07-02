import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { applyTheme, useUIStore } from './store/useUIStore'

// Apply persisted theme before first paint to avoid flash
applyTheme(useUIStore.getState().theme)

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
)