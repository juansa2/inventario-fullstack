import React from 'react' // A React 17+ y Vite les gusta que esté explícito
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <-- 1. LA NUEVA IMPORTACIÓN

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. ENVOLVEMOS LA APP AQUÍ */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)