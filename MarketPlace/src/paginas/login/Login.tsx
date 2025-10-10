import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Usuario } from '../../data/MockUsuarios'

const Login: React.FC = () => {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const usuario = Usuario.find(
      u => u.correo === correo && u.password === password
    )
    if (usuario) {
      setError('')
      navigate('/home', { state: { usuario } })
    } else {
      setError('Correo o contraseña incorrectos')
    }
  }

  return (
    <div className="page-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}

export default Login
