// src/pages/acercaDe/AcercaDe.tsx
import React, { useState } from 'react'
import Sidebar from '../../componentes/SideBar'
import Navbar from '../../componentes/NavBar'
import Footer from '../../componentes/footer'
import { useUsuario } from '../../context/UsuarioContext'
import { useIdioma } from '../../context/IdiomasContext'
import '../../assets/estilosHome/acercaDe.css'

const AcercaDe: React.FC = () => {
  const { usuario } = useUsuario()
  const { translate, t } = useIdioma()
  const [comentario, setComentario] = useState('')

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value)
  }

  const handleComentarioSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comentario) return
    alert(`${translate('messages.commentThanks')} "${comentario}"`)
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
              <h2>{translate('about.welcome').replace('{name}', usuario?.nombre || translate('common.guest'))}</h2>
              <p>
                {translate('about.description')}
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
            <h3>{translate('about.developers')}</h3>
            <ul className="list-disc list-inside">
              <li>Taylor Steven Alava Gresely</li>
              <li>David Alejandro Vilañez Palma</li>
            </ul>
          </div>

          {/* Sección de ubicación */}
          <div className="card-section">
            <h3>{translate('about.location')}</h3>
            <p>Universidad Laica Eloy Alfaro de Manabí (ULEAM)</p>
          </div>

          {/* Sección de contacto */}
          <div className="card-section">
            <h3>{translate('about.contact')}</h3>
            <p>{translate('about.contactText')}</p>
            <form onSubmit={handleComentarioSubmit}>
              <textarea
                value={comentario}
                onChange={handleComentarioChange}
                rows={4}
                className="input-field"
                placeholder={translate('about.commentPlaceholder')}
              />
              <button type="submit" className="btn-primary mt-2">
                {translate('about.sendComment')}
              </button>
            </form>
          </div>

          {/* Sección de Política y Términos de Uso */}
          <div className="card-section">
            <h3>{translate('about.policiesTitle')}</h3>
            <ul className="list-disc list-inside text-gray-700">
              {(t.about?.policies ?? []).map((policy: string, index: number) => (
                <li key={index}>{policy}</li>
              ))}
            </ul>
            <p className="mt-2 text-gray-600">
              {translate('about.policiesNote')}
            </p>
          </div>

        </div>

        <Footer />
      </div>
    </div>
  )
}

export default AcercaDe
