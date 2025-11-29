import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QuarantineProvider } from './context/QuarantineContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuarantineProvider>
      <App />
    </QuarantineProvider>
  </StrictMode>,
)
