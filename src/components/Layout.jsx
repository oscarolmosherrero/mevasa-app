import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL
const nav = [
  ['/lineas', 'Líneas'],
  ['/mapa', 'Mapa en directo'],
  ['/informacion', 'Tarifas e información'],
]

export default function Layout() {
  const { pathname } = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-5">
        <Link to="/" aria-label="MEVASA, inicio" className="outline-none border-none">
          <img src={`${BASE}img/logo.png`} alt="MEVASA" className="h-8 w-auto outline-none border-none" />
        </Link>
        
        <button
          className="block md:hidden p-2 text-white outline-none focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Alternar menú"
        >
          {isMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} w-full flex-col md:flex md:w-auto md:flex-row flex-wrap gap-x-6 gap-y-4 font-mono text-sm mt-2 md:mt-0`}>
          {nav.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `border-b-2 pb-1 w-max ${isActive ? 'border-brand text-brand' : 'border-transparent hover:text-brand'} outline-none`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      
      <main className="flex-1"><Outlet /></main>
      
      <footer className="mt-20 border-t border-black/10 bg-white pt-8 pb-10 text-black">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-8 px-5 text-center md:flex-row md:text-left text-xs leading-relaxed text-black/70">
          
          <div className="max-w-lg">
            <p className="font-medium text-black">Transporte Metropolitano de Valladolid. Proyecto independiente, no oficial.</p>
            <p className="mt-1">
              Datos de servicios, tarifas y operadores:{' '}
              <a className="font-semibold text-black underline hover:text-brand transition-colors" href="https://carreterasytransportes.jcyl.es/web/es/viajeros/transporte-metropolitano-valladolid.html">
                Junta de Castilla y León
              </a>
              . Mapa © OpenStreetMap, © CARTO.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <a 
              href="https://oscarolmos.es" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mb-3 block outline-none hover:opacity-75 transition-opacity"
              aria-label="Portfolio de Óscar Olmos"
            >
              <img src={`${BASE}img/logo-oh.png`} alt="Óscar Olmos OH" className="h-9 w-auto" />
            </a>
            <p className="md:text-right">
              Diseño UI/UX y desarrollo web.<br />
              Proyecto ficticio creado por <a href="https://oscarolmos.es" target="_blank" rel="noopener noreferrer" className="font-semibold text-black underline hover:text-brand transition-colors">Óscar Olmos</a>.
            </p>
          </div>

        </div>
      </footer>
    </div>
  )
}