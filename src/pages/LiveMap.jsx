import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LINES, getLine } from '../data/lines.js'
import LineBadge from '../components/LineBadge.jsx'
import { useVehicles } from '../services/useVehicles.js'

const col = (l) => l.mapColor || l.color

export default function LiveMap() {
  const [params] = useSearchParams()
  const initial = params.get('linea')
  const [active, setActive] = useState(() =>
    new Set(initial && getLine(initial) ? [initial] : LINES.filter((l) => l.route.length).map((l) => l.id)),
  )
  const vehicles = useVehicles(2000)
  const visible = useMemo(() => vehicles.filter((v) => active.has(v.lineId)), [vehicles, active])

  const el = useRef(null)
  const map = useRef(null)
  const routeLayer = useRef(null)
  const busLayer = useRef(null)

  useEffect(() => {
    // Zoom y coordenadas fijadas para que coincidan exactamente con la vista general de la captura
    map.current = L.map(el.current, { zoomControl: true }).setView([41.63, -4.70], 12)
    
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    })
    
    tileLayer.on('tileload', (e) => {
      e.tile.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3)'
    })
    
    tileLayer.addTo(map.current)

    routeLayer.current = L.layerGroup().addTo(map.current)
    busLayer.current = L.layerGroup().addTo(map.current)
    
    return () => map.current.remove()
  }, [])

  useEffect(() => {
    routeLayer.current.clearLayers()
    const activeLines = LINES.filter((l) => active.has(l.id) && l.route.length)

    activeLines.forEach((l) => {
      const coords = l.route.map((s) => s.p)
      
      L.polyline(coords, { color: col(l), weight: 5, opacity: 0.9 }).addTo(routeLayer.current)
      l.route.forEach((s) =>
        L.circleMarker(s.p, { radius: 5, color: '#fff', weight: 2, fillColor: '#000', fillOpacity: 1 })
          .bindTooltip(s.n)
          .addTo(routeLayer.current),
      )
    })
  }, [active])

  useEffect(() => {
    busLayer.current.clearLayers()
    visible.forEach((v) => {
      const l = getLine(v.lineId)
      if (!l) return
      const icon = L.divIcon({
        className: 'bus-icon',
        iconSize: [30, 30],
        html: `<div style="width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:${l.color};color:${l.ink};font:600 13px 'Geist Mono',monospace;border:2px solid #fff">${l.id}</div>`,
      })
      L.marker([v.lat, v.lng], { icon, zIndexOffset: 1000 })
        .bindTooltip(`Línea ${l.id} → ${v.destino}`)
        .addTo(busLayer.current)
    })
  }, [visible])

  const toggle = (id) =>
    setActive((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 mb-12">
      <h1 className="text-3xl font-light">Mapa en directo</h1>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar líneas">
        {LINES.filter((l) => l.route.length).map((l) => (
          <button
            key={l.id}
            onClick={() => toggle(l.id)}
            aria-pressed={active.has(l.id)}
            className={active.has(l.id) ? '' : 'opacity-30'}
          >
            <LineBadge line={l} size="sm" />
          </button>
        ))}
        <button className="ml-2 text-sm underline hover:text-brand" onClick={() => setActive(new Set(LINES.filter((l) => l.route.length).map((l) => l.id)))}>Todas</button>
        <button className="text-sm underline hover:text-brand" onClick={() => setActive(new Set())}>Ninguna</button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">
        <div ref={el} className="h-[65vh] min-h-[380px] w-full border border-white/20 bg-black" />
        
        <ul className="max-h-[65vh] space-y-2 overflow-auto text-sm">
          {visible.length === 0 && <li className="text-white/60 p-2">Elige una o más líneas para ver sus autobuses.</li>}
          {visible.map((v) => {
            const lineObj = getLine(v.lineId)
            return (
              <li key={v.id}>
                <button
                  className="flex w-full items-start gap-3 border border-white/15 p-2 text-left hover:border-brand bg-black"
                  onClick={() => map.current.flyTo([v.lat, v.lng], 14)}
                >
                  {lineObj && <LineBadge line={lineObj} size="sm" />}
                  <span>
                    Hacia {v.destino}
                    <span className="block text-xs text-white/60">Próx.: {v.proxima} · {v.velocidad} km/h</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
