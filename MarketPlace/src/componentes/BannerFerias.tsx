import React from 'react'
import type { IFeria } from '../entidades/Feria'

interface BannerFeriasProps {
  ferias: IFeria[]
}

const BannerFerias: React.FC<BannerFeriasProps> = ({ ferias }) => {
  if (ferias.length === 0) {
    return (
      <div className="banner-ferias bg-gray-100 py-10 text-center text-gray-600">
        <h2 className="text-xl font-semibold">🎪 No hay ferias disponibles por el momento</h2>
        <p>Vuelve pronto para descubrir nuevos eventos estudiantiles.</p>
      </div>
    )
  }

  return (
    <div className="banner-ferias w-full bg-gradient-to-r from-blue-700 to-indigo-600 py-12 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">🎉 Ferias Estudiantiles Activas</h2>

      <div className="flex flex-wrap justify-center gap-6 px-6">
        {ferias.map((feria) => (
          <div
            key={feria.id_feria}
            className="bg-white text-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all w-72 p-5"
          >
            <h3 className="text-lg font-bold text-blue-700 mb-2">{feria.nombre_feria}</h3>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Tipo:</strong> {feria.tipo}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              📅 {feria.fechaInicio} → {feria.fechaFin}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Reglas:</strong> {feria.reglas}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BannerFerias