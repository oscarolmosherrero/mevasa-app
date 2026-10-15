import { Link } from 'react-router-dom'
import { LINES } from '../data/lines.js'
import LineBadge from './LineBadge.jsx'

export default function MobileThermometers() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {LINES.map((l) => {
        // Extraemos la primera y la última parada para el termómetro
        const start = l.route?.length > 0 ? l.route[0].n : 'Valladolid'
        const end = l.route?.length > 0 ? l.route[l.route.length - 1].n : l.name
        const stopsCount = l.route?.length || 0

        return (
          <Link 
            key={l.id} 
            to={`/lineas/${l.id}`}
            // Estilos adaptados al modo claro de la sección: fondo gris muy claro y textos negros
            className="flex items-stretch gap-4 border border-black/10 bg-gray-50 p-4 transition-colors hover:border-brand"
          >
            <div className="shrink-0 pt-0.5">
              <LineBadge line={l} />
            </div>
            
            {/* Termómetro visual estricto (esquinas a 90º) */}
            <div className="flex flex-col items-center shrink-0 w-3 py-1.5">
              <div className="h-3 w-3 border-[3px] bg-white" style={{ borderColor: l.color || l.mapColor }}></div>
              <div className="w-[3px] grow" style={{ backgroundColor: l.color || l.mapColor }}></div>
              <div className="h-3 w-3 border-[3px] bg-white" style={{ borderColor: l.color || l.mapColor }}></div>
            </div>

            {/* Textos de origen, destino y paradas intermedias */}
            <div className="flex flex-col justify-between py-0.5 text-sm leading-tight">
              <span className="font-medium text-black">{start}</span>
              <span className="text-xs font-mono text-black/50 py-3">{stopsCount} paradas</span>
              <span className="font-medium text-black/80">{end}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}