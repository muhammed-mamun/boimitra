import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <div className='min-h-screen min-w-full mx-auto bg-[#1a1a1a]'>
     <App/>
   </div>
  </StrictMode>,
)
