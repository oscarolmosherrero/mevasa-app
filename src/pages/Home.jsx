import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LINES } from '../data/lines.js'
import LineBadge from '../components/LineBadge.jsx'
import NetworkMap from '../components/NetworkMap.jsx'
import MobileThermometers from '../components/MobileThermometers.jsx'
import { useVehicles } from '../services/useVehicles.js'
import { IS_SIMULATED } from '../services/vehicles.js'

// Foto de fondo del hero (en public/img)
const HERO_IMAGE = `${import.meta.env.BASE_URL}img/hero-ayuntamiento.jpg`

export default function Home() {
  const vehicles = useVehicles()
  
  // Estado global para la home que permite sincronizar la lista lateral con el mapa
  const [hoveredLine, setHoveredLine] = useState(null)
  
  return (
    <>
      <section className="relative flex flex-col bg-black text-white lg:block">
        <div className="relative h-[260px] w-full overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-1/2">
          <img src={HERO_IMAGE} alt="" aria-hidden="true" className="h-full w-full object-cover object-top" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-10 lg:flex lg:min-h-[600px] lg:items-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-light leading-tight tracking-tight text-white sm:text-6xl">
              Transporte
              <br />
              Metropolitano
              <br />
              de Valladolid
            </h1>
            <p className="mt-6 text-white/70">
              Consulta las líneas, sigue tu autobús en el mapa y encuentra tarifas y puntos de recarga en los 15 municipios del área.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
              <Link to="/mapa" className="bg-brand px-5 py-3 font-medium text-black transition-colors hover:bg-white">Autobuses en tiempo real</Link>
              <Link to="/lineas" className="border border-white/30 px-5 py-3 text-white transition-colors hover:border-brand hover:text-brand">Ver las líneas</Link>
            </div>
            <p className="mt-6 text-sm text-white/60">
              <span className="font-mono font-bold text-brand">{vehicles.length}</span> autobuses en circulación ahora
              {IS_SIMULATED && ' (datos simulados mientras se conecta el sistema real)'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white text-black">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 className="text-2xl font-light text-black">Líneas</h2>
          <p className="mt-2 max-w-xl text-sm text-black/70">
            Pulsa una línea o su cuadrado para ver el detalle de su recorrido.
          </p>
          
          <div className="mt-8 lg:flex lg:items-center lg:gap-10">
            
            <div className="hidden lg:block lg:grow">
              <NetworkMap hover={hoveredLine} setHover={setHoveredLine} />
            </div>

            <div className="hidden lg:flex lg:shrink-0 lg:flex-col lg:gap-1.5">
              {LINES.map((l) => {
                const isDimmed = hoveredLine && hoveredLine !== l.id
                return (
                  <Link 
                    key={l.id} 
                    to={`/lineas/${l.id}`} 
                    title={l.name} 
                    className={`transition-all hover:scale-105 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setHoveredLine(l.id)}
                    onMouseLeave={() => setHoveredLine(null)}
                  >
                    <LineBadge line={l} size="sm" />
                  </Link>
                )
              })}
            </div>

            <div className="block w-full lg:hidden">
              <MobileThermometers />
            </div>
            
          </div>
        </div>
      </section>

      {/* Faldón de Información de Interés */}
      <section className="bg-[#0a0a0a] text-white border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mb-12">
            <h2 className="text-3xl font-light">Información al viajero</h2>
            <p className="mt-3 text-white/60 text-sm max-w-2xl">
              Todo lo que necesitas saber para moverte por el área metropolitana de Valladolid de forma rápida, accesible y sin complicaciones.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Tarjeta 1: Tarifas */}
            <Link to="/informacion" className="block border border-white/10 bg-black p-8 transition-colors hover:border-brand">
              <svg className="w-10 h-10 mb-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="2" y="5" width="20" height="14" strokeLinejoin="miter" />
                <line x1="2" y1="10" x2="22" y2="10" />
                <rect x="6" y="14" width="4" height="2" fill="currentColor" stroke="none" />
              </svg>
              <h3 className="mb-3 text-xl font-light">Tarifas y Abonos</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Descubre los diferentes títulos de transporte: billete sencillo, bono multiviaje y abono mensual combinado. Consulta la red de kioscos y puntos de recarga habilitados en tu municipio.
              </p>
            </Link>

            {/* Tarjeta 2: Accesibilidad */}
            <Link to="/informacion" className="block border border-white/10 bg-black p-8 transition-colors hover:border-brand">
              <svg className="w-10 h-10 mb-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="5" y="11" width="8" height="8" strokeLinejoin="miter" />
                <path d="M13 11V5h4" strokeLinejoin="miter" />
                <rect x="15" y="2" width="4" height="4" fill="currentColor" stroke="none" />
                <path d="M9 15h8v4" strokeLinejoin="miter" />
              </svg>
              <h3 className="mb-3 text-xl font-light">Flota 100% Accesible</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Todos nuestros vehículos están equipados con piso bajo continuo, rampas de acceso motorizadas, inclinación lateral y espacios reservados garantizados para sillas de ruedas y carritos.
              </p>
            </Link>

            {/* Tarjeta 3: Atención al cliente */}
            <Link to="/informacion" className="block border border-white/10 bg-black p-8 transition-colors hover:border-brand">
              <svg className="w-10 h-10 mb-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M2 3h20v14H8l-6 5V3z" strokeLinejoin="miter" />
                <path d="M7 9h10M7 13h6" strokeLinejoin="miter" />
              </svg>
              <h3 className="mb-3 text-xl font-light">Atención al Usuario</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                ¿Has perdido algún objeto en el autobús o necesitas comunicar una queja o incidencia? Nuestro servicio de atención telefónica está disponible de lunes a viernes en horario ininterrumpido.
              </p>
            </Link>

          </div>
        </div>
      </section>
    </>
  )
}