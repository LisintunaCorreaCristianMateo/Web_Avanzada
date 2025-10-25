import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import {App2} from './App2.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App2 />
   
  </StrictMode>,
)
