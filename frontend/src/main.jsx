import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Configure Axios globally
axios.defaults.baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5005');
axios.defaults.headers.common['Bypass-Tunnel-Reminder'] = 'true';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
