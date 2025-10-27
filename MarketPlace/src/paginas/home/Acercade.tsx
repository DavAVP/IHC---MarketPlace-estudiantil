// src/pages/acercaDe/AcercaDe.tsx
import React, { useState } from 'react'
import Sidebar from '../../componentes/SideBar'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import { useUsuario } from '../../context/UsuarioContext'
import '../../assets/estilosHome/acercaDe.css' // importar estilos

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
        <Navbar onSearch={() => {}} />

        <div className="home-content px-8 py-4">
          {/* Banner principal */}
          <div className="home-banner mb-6">
            <div>
              <h2>¡Bienvenido a StudentsPlace, {usuario?.nombre || 'Invitado'}!</h2>
              <p>
                StudentsPlace es la plataforma donde estudiantes pueden descubrir, compartir y comprar productos dentro de su comunidad universitaria.
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
          <div className="card-section">
            <h3>Desarrolladores</h3>
            <ul className="list-disc list-inside">
              <li>Taylor Steven Alava Gresely</li>
              <li>David Alejandro Vilañez Palma</li>
            </ul>
          </div>

          {/* Sección de ubicación */}
          <div className="card-section">
            <h3>Ubicación</h3>
            <p>Universidad Laica Eloy Alfaro de Manabí (ULEAM)</p>
          </div>

          {/* Sección de contacto */}
          <div className="card-section">
            <h3>Contacto</h3>
            <p>Puedes contactarnos vía correo electrónico o dejándonos un mensaje aquí:</p>
            <form onSubmit={handleComentarioSubmit}>
              <textarea
                value={comentario}
                onChange={handleComentarioChange}
                rows={4}
                className="input-field"
                placeholder="Escribe tu comentario..."
              />
              <button type="submit" className="btn-primary mt-2">
                Enviar Comentario
              </button>
            </form>
          </div>

          {/* Sección de Política y Términos de Uso */}
          <div className="card-section">
            <h3>Política y Términos de Uso</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>Solo usuarios mayores de 18 años pueden registrarse y publicar productos.</li>
              <li>No se permite publicar contenido extraño, ofensivo o inapropiado.</li>
              <li>Todos los productos deben ser válidos y cumplir con las normas de la plataforma.</li>
              <li>Los vendedores deben asegurarse de que los productos ofrecidos sean apropiados para estudiantes y usuarios del sistema.</li>
              <li>StudentsPlace se reserva el derecho de eliminar publicaciones que infrinjan estas políticas.</li>
              <li>Al usar la plataforma, aceptas seguir todas las políticas y normas profesionales establecidas para garantizar un entorno seguro y confiable.</li>
            </ul>
            <p className="mt-2 text-gray-600">
              Estas políticas buscan proteger a nuestra comunidad y asegurar que StudentsPlace se mantenga como un espacio profesional y confiable para todos los estudiantes.
            </p>
          </div>

        </div>

        <Footer />
      </div>
    </div>
  )
}

export default AcercaDe
