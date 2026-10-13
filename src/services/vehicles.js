import { LINES } from '../data/lines.js'

/**
 * Posición de los autobuses.
 *
 * AHORA: simulación determinista (cada autobús va y vuelve por su recorrido).
 * DESPUÉS: sustituye el cuerpo de `getVehicles` por una llamada a un feed real
 * (p. ej. GTFS-Realtime, convertido a JSON por un pequeño proxy: GitHub Pages es
 * estático y no puede leer protobuf con CORS cerrado). Mientras devuelva la misma
 * forma de objeto, el resto de la web no cambia.
 */
export const IS_SIMULATED = true

const BUSES_PER_LINE = 2
const TRIP_MS = 25 * 60 * 1000 // ida completa

const dist = (a, b) => Math.hypot(a[0] - b[0], (a[1] - b[1]) * 0.75)

function along(points, f) {
  const seg = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const d = dist(points[i - 1], points[i])
    seg.push(d)
    total += d
  }
  let t = f * total
  for (let i = 0; i < seg.length; i++) {
    if (t <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(t / seg[i], 1) : 0
      const a = points[i], b = points[i + 1]
      return { pos: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], seg: i }
    }
    t -= seg[i]
  }
}

export function getVehicles(now = Date.now()) {
  const out = []
  LINES.forEach((line, li) => {
    if (line.route.length < 2) return
    const pts = line.route.map((s) => s.p)
    for (let i = 0; i < BUSES_PER_LINE; i++) {
      const phase = (now / TRIP_MS + i / BUSES_PER_LINE + li * 0.37) % 2
      const outbound = phase < 1
      const { pos, seg } = along(pts, outbound ? phase : 2 - phase)
      const last = line.route.length - 1
      out.push({
        id: `${line.id}-${i + 1}`,
        lineId: line.id,
        lat: pos[0],
        lng: pos[1],
        destino: line.route[outbound ? last : 0].n,
        proxima: line.route[outbound ? seg + 1 : seg].n,
        velocidad: 32 + ((li * 7 + i * 13) % 31),
      })
    }
  })
  return out
}
