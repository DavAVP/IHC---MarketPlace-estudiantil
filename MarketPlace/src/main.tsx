import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './assets/estilos.css'
import { IdiomaProvider } from './context/IdiomasContext' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <IdiomaProvider> 
        <App />
      </IdiomaProvider>
    </BrowserRouter>
  </StrictMode>
)
