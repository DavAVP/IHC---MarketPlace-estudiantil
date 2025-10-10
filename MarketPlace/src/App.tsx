import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './paginas/login/Login'
import Home from './paginas/home/Home'
import './assets/estilos.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App
