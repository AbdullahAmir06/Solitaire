import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SolitaireBoard from './components/SolitaireBoard.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <>
    <SolitaireBoard />
    <App />
  </>,
  {/* </StrictMode>, */ }
)
