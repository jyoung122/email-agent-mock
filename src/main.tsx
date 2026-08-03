import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

const app = import.meta.env.BASE_URL === '/'
  ? <BrowserRouter><App /></BrowserRouter>
  : <HashRouter><App /></HashRouter>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {app}
  </StrictMode>,
)
