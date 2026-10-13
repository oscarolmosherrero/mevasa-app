import { Link } from 'react-router-dom'
import { LINES } from '../data/lines.js'
import LineBadge from '../components/LineBadge.jsx'

export default function Lines() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 mb-12">
      <h1 className="text-3xl font-light">Líneas</h1>
      
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LINES.map((l) => (
          <li key={l.id} className="border border-white/15 bg-black">
            <Link 
              to={`/lineas/${l.id}`} 
              className="flex h-full items-center gap-4 p-4 transition-colors hover:bg-white/5"
            >
              <div className="shrink-0">
                <LineBadge line={l} />
              </div>
              
              <span>
                <span className="block font-medium">{l.name}</span>
                <span className="mt-0.5 block text-xs text-white/60">{l.operator}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}