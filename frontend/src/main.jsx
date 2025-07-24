import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MyStyledCalendar from '../src/assets/Calendar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyStyledCalendar />
  </StrictMode>,
)
