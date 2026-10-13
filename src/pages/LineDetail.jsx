import { Link, useParams } from 'react-router-dom'
import { getLine } from '../data/lines.js'
import LineBadge from '../components/LineBadge.jsx'
import { useVehicles } from '../services/useVehicles.js'

export default function LineDetail() {
  const { id } = useParams()
  const line = getLine(id)
  const buses = useVehicles().filter((v) => v.lineId === id)

  if (!line) {
    return (
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <p>No existe la línea «{id}».</p>
        <Link to="/lineas" className="text-brand underline">Volver a las líneas</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8">
      <Link to="/lineas" className="text-sm text-white/60 hover:text-brand">← Todas las líneas</Link>
      <div className="mt-6 flex items-center gap-5">
        <LineBadge line={line} size="lg" />
        <div>
          <h1 className="text-2xl font-light sm:text-3xl">{line.name}</h1>
          <p className="text-sm text-white/60">Operador: {line.operator}</p>
        </div>
      </div>

      {line.provisional && (
        <p className="mt-6 max-w-xl border-l-2 border-brand pl-4 text-sm text-white/70">
          Los datos de esta línea están por confirmar.
        </p>
      )}

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-4 text-lg font-light">Recorrido</h2>
          {line.route.length ? (
            <ol className="relative ml-2 border-l-4 pl-6" style={{ borderColor: line.mapColor || line.color }}>
              {line.route.map((s) => (
                <li key={s.n} className="relative pb-6 last:pb-0">
                  <span className="absolute -left-[35px] top-1 h-3.5 w-3.5 border-2 border-white bg-black" />
                  {s.n}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-white/60">Esta línea no tiene recorrido publicado todavía.</p>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-light">Ahora en la línea</h2>
          {buses.length ? (
            <ul className="space-y-3">
              {buses.map((b) => (
                <li key={b.id} className="border border-white/20 p-3 text-sm">
                  <p>Hacia {b.destino}</p>
                  <p className="text-white/60">Próxima parada: {b.proxima} · {b.velocidad} km/h</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60">No hay autobuses en esta línea ahora mismo.</p>
          )}
          {line.route.length > 0 && (
            <Link to={`/mapa?linea=${line.id}`} className="mt-6 inline-block bg-brand font-mono px-5 py-3 text-sm font-medium text-black hover:bg-white">
              Ver en el mapa
            </Link>
          )}
        </section>
      </div>

      {line.schedule && (
        <section className="mt-14 mb-10 border-t border-white/10 pt-10">
          <h2 className="mb-6 text-xl font-light">Horarios y frecuencias orientativas</h2>
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Se han eliminado las clases rounded-lg */}
            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="mb-5 font-mono text-brand">Invierno (Septiembre - Junio)</h3>
              <dl className="space-y-4">
                {line.schedule.invierno.map((s, i) => (
                  <div key={i} className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <dt className="text-sm text-white/70">{s.days}</dt>
                    <dd className="text-right">
                      <span className="block text-sm font-medium text-white">{s.hours}</span>
                      <span className="block text-xs text-white/50 mt-0.5">{s.freq}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Se han eliminado las clases rounded-lg */}
            <div className="border border-white/10 bg-white/5 p-6">
              <h3 className="mb-5 font-mono text-brand">Verano (Julio - Agosto)</h3>
              <dl className="space-y-4">
                {line.schedule.verano.map((s, i) => (
                  <div key={i} className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <dt className="text-sm text-white/70">{s.days}</dt>
                    <dd className="text-right">
                      <span className="block text-sm font-medium text-white">{s.hours}</span>
                      <span className="block text-xs text-white/50 mt-0.5">{s.freq}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            
          </div>
        </section>
      )}
    </div>
  )
}