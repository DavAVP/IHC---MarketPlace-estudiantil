// src/pages/acercaDe/AcercaDe.tsx
import React, { useState } from 'react'
import Sidebar from '../../componentes/SideBar'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import { useUsuario } from '../../context/UsuarioContext'

const AcercaDe: React.FC = () => {
  const { usuario } = useUsuario()
  const [comentario, setComentario] = useState('')

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value)
  }

  const handleComentarioSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comentario) return
    alert(`Gracias por tu comentario: "${comentario}"`)
    setComentario('')
  }

  return (
    <div className="home-page flex">
      <Sidebar />
      <div className="home-main flex-1">
        <Navbar />

        <div className="home-content px-8 py-4">
          <div className="home-banner bg-green-100 rounded-xl p-6 flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-green-800">
                ¡Bienvenido a StudentsPlace, {usuario?.nombre || 'Invitado'}!
              </h2>
              <p className="text-gray-700 mt-2">
                StudentsPlace es una plataforma para que los estudiantes puedan descubrir, compartir y comprar productos dentro de su comunidad universitaria.
              </p>
            </div>
            {usuario?.fotoPerfil && (
              <img
                src={usuario.fotoPerfil}
                alt="Avatar"
                className="user-avatar w-16 h-16 rounded-full shadow-md object-cover"
              />
            )}
          </div>

          {/* Sección de desarrolladores */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Desarrolladores</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Taylor Steven Alava Gresely</li>
              <li>David Alejandro Vilañez Palma</li>
            </ul>
          </div>

          {/* Sección de ubicación */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
            <p className="text-gray-700">
              Universidad Laica Eloy Alfaro de Manabí (ULEAM)
            </p>
          </div>

          {/* Sección de contacto */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">Contacto</h3>
            <p className="text-gray-700 mb-4">
              Puedes contactarnos vía correo electrónico o dejándonos un mensaje aquí:
            </p>
            <form onSubmit={handleComentarioSubmit}>
              <textarea
                value={comentario}
                onChange={handleComentarioChange}
                rows={4}
                className="input-field w-full mb-4"
                placeholder="Escribe tu comentario..."
              />
              <button
                type="submit"
                className="btn-primary px-6 py-2 rounded-md shadow-sm hover:shadow-md"
              >
                Enviar Comentario
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default AcercaDe
