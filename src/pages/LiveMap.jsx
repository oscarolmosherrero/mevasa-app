import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { LINES, getLine } from '../data/lines.js'
import LineBadge from '../components/LineBadge.jsx'
import { useVehicles } from '../services/useVehicles.js'

const col = (l) => l.mapColor || l.color

// Componente para animar el punto a lo largo de las calles reales (rutas de OSRM)
function MovingDot({ vehicle, map, line, routeCoords, busMarkers }) {
  const markerRef = useRef(null)
  const indexRef = useRef(0)
  const dirRef = useRef(1) // 1 hacia adelante, -1 hacia atrás

  useEffect(() => {
    // Si la ruta aún no se ha descargado de la API, esperamos.
    if (!map || !routeCoords || routeCoords.length === 0) return

    // Icono: Punto de color puro y estricto
    const icon = L.divIcon({
      className: 'moving-dot bg-transparent border-0',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      html: `
        <div style="
          width: 14px; 
          height: 14px; 
          border-radius: 50%; 
          background-color: ${col(line)}; 
          border: 2px solid #fff;
          box-shadow: 0 0 6px rgba(0,0,0,0.8);
        "></div>
      `,
    })

    // 1. Inicializamos el marcador en una coordenada aleatoria de la ruta calculada
    if (!markerRef.current) {
      indexRef.current = Math.floor(Math.random() * routeCoords.length)
      markerRef.current = L.marker(routeCoords[indexRef.current], { icon, zIndexOffset: 1000 })
        .bindTooltip(`Línea ${line.id} → ${vehicle.destino}`)
        .addTo(map)
      
      // Guardamos la referencia para que el menú lateral pueda hacer flyTo a su posición real
      busMarkers.current[vehicle.id] = markerRef.current
    }

    // 2. Animación: Avanzamos el punto por los vértices de las calles cada segundo
    const interval = setInterval(() => {
      if (!markerRef.current) return
      
      // Avanzamos solo 1 vértice por "tick" para que la velocidad sea mucho más lenta y realista
      let nextIdx = indexRef.current + dirRef.current * 1 
      
      if (nextIdx >= routeCoords.length) {
        nextIdx = routeCoords.length - 1
        dirRef.current = -1 // Rebote
      } else if (nextIdx <= 0) {
        nextIdx = 0
        dirRef.current = 1 // Rebote
      }
      
      indexRef.current = nextIdx
      
      // Actualizamos la posición; Leaflet + CSS Transition se encargan de deslizarlo suavemente
      markerRef.current.setLatLng(routeCoords[nextIdx])
      markerRef.current.getTooltip().setContent(`Línea ${line.id} → ${vehicle.destino}`)
      
    }, 1000)

    return () => clearInterval(interval)
  }, [map, routeCoords, vehicle.destino, line, busMarkers])

  // Limpieza del marcador cuando se oculta la línea
  useEffect(() => {
    return () => {
      if (markerRef.current && map) {
        map.removeLayer(markerRef.current)
        delete busMarkers.current[vehicle.id]
        markerRef.current = null
      }
    }
  }, [map, vehicle.id, busMarkers])

  return null
}

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
  
  // Caché y estado para almacenar las rutas trazadas sobre las calles reales
  const routeCache = useRef({})
  const [routesData, setRoutesData] = useState({})
  
  // Referencia global para encontrar los marcadores al hacer clic en el menú lateral
  const busMarkers = useRef({})

  useEffect(() => {
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
    
    return () => map.current.remove()
  }, [])

  useEffect(() => {
    const drawRoutesAndStops = async () => {
      routeLayer.current.clearLayers()
      const activeLines = LINES.filter((l) => active.has(l.id) && l.route.length)

      let hasNewRoutes = false

      // 1. Obtenemos las rutas de OSRM (o de la caché) para que sigan el asfalto
      await Promise.all(
        activeLines.map(async (l) => {
          if (routeCache.current[l.id]) {
            L.polyline(routeCache.current[l.id], { color: col(l), weight: 5, opacity: 0.85 }).addTo(routeLayer.current)
          } else {
            try {
              const coordsString = l.route.map(s => `${s.p[1]},${s.p[0]}`).join(';')
              const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`)
              const data = await res.json()
              
              if (data.routes && data.routes.length > 0) {
                const latLngs = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]])
                routeCache.current[l.id] = latLngs
                hasNewRoutes = true
                L.polyline(latLngs, { color: col(l), weight: 5, opacity: 0.85 }).addTo(routeLayer.current)
              } else {
                const fallback = l.route.map(s => s.p)
                routeCache.current[l.id] = fallback
                hasNewRoutes = true
                L.polyline(fallback, { color: col(l), weight: 5, opacity: 0.5, dashArray: '10, 10' }).addTo(routeLayer.current)
              }
            } catch (err) {
              const fallback = l.route.map(s => s.p)
              routeCache.current[l.id] = fallback
              hasNewRoutes = true
              L.polyline(fallback, { color: col(l), weight: 5, opacity: 0.5, dashArray: '10, 10' }).addTo(routeLayer.current)
            }
          }
        })
      )

      // Guardamos en estado para que los MovingDots puedan leer las rutas y empezar a moverse
      if (hasNewRoutes) {
        setRoutesData({ ...routeCache.current })
      }

      // 2. Dibujamos las paradas asegurándonos de que quedan por encima de la línea
      activeLines.forEach((l) => {
        l.route.forEach((s) => {
          L.circleMarker(s.p, { radius: 5, color: '#fff', weight: 2, fillColor: '#000', fillOpacity: 1 })
            .bindTooltip(s.n)
            .addTo(routeLayer.current)
        })
      })
    }

    drawRoutesAndStops()
  }, [active])

  const toggle = (id) =>
    setActive((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 mb-12">
      <h1 className="text-3xl font-light">Mapa en directo</h1>

      {/* Regla CSS clave para que el movimiento entre coordenadas parezca fluido y natural */}
      <style>{`
        .moving-dot {
          transition: transform 1s linear !important;
        }
      `}</style>

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
        <div ref={el} className="h-[65vh] min-h-[380px] w-full border border-white/20 bg-black relative">
          {/* Montamos los puntos dinámicos, pasándoles la ruta exacta para que la recorran */}
          {map.current && visible.map((v) => {
            const lineObj = getLine(v.lineId)
            const routeCoords = routesData[v.lineId] || routeCache.current[v.lineId]
            if (!lineObj) return null
            return <MovingDot key={v.id} vehicle={v} map={map.current} line={lineObj} routeCoords={routeCoords} busMarkers={busMarkers} />
          })}
        </div>
        
        <ul className="max-h-[65vh] space-y-2 overflow-auto text-sm">
          {visible.length === 0 && <li className="text-white/60 p-2">Elige una o más líneas para ver sus autobuses.</li>}
          {visible.map((v) => {
            const lineObj = getLine(v.lineId)
            return (
              <li key={v.id}>
                <button
                  className="flex w-full items-start gap-3 border border-white/15 p-2 text-left hover:border-brand bg-black"
                  onClick={() => {
                    // Viajamos a la coordenada actual del punto en movimiento
                    const marker = busMarkers.current[v.id]
                    if (marker) {
                      map.current.flyTo(marker.getLatLng(), 14)
                    } else {
                      map.current.flyTo([v.lat, v.lng], 14)
                    }
                  }}
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