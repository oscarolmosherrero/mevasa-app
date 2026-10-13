import { Link } from 'react-router-dom'
import { LINES, MUNICIPIOS, OPERATORS } from '../data/lines.js'
import LineBadge from '../components/LineBadge.jsx'
import NetworkMap from '../components/NetworkMap.jsx'
import { useVehicles } from '../services/useVehicles.js'
import { IS_SIMULATED } from '../services/vehicles.js'

const windows = Array.from({ length: 11 }, (_, i) => [4 + i * 5, 23])

const FACADE = [
  { 
    color: 'rgb(18, 229, 255)',
    pts: [[0,40],[0,11],[1,10],[2,10],[2,7],[4,7],[4,10],[12,10],[12,7],[14,7],[14,10],[15,10],[16,11],[16,15],[19,12],[26,12],[26,0],[28,0],[28,2],[30,2],[30,0],[32,0],[32,12],[39,12],[42,15],[42,11],[43,10],[44,10],[44,7],[46,7],[46,10],[54,10],[54,7],[56,7],[56,10],[57,10],[58,11],[58,40]],
    stops: [[0,40,6],[3,7],[13,7],[27,0],[31,0],[45,7],[55,7],[58,40,6]],
  },
  { 
    color: '#FF3399', 
    pts: [[0,40],[20,40],[20,34],[21,33],[23,33],[24,34],[24,40],[27,40],[27,34],[28,33],[30,33],[31,34],[31,40],[34,40],[34,34],[35,33],[37,33],[38,34],[38,40],[58,40]],
    stops: [[22,33],[36,33]],
  },
  { 
    color: '#C77DFF', 
    pts: [[2,28],[56,28]],
    stops: [[2,28,6],[29,28,5],[56,28,6]],
  },
  { 
    color: '#00FFAA', 
    pts: [[2,23],[56,23]],
    stops: [[2,23,6], ...windows, [56,23,6]],
  },
  { 
    color: '#EFFF1A', 
    pts: [[16,15],[16,18],[24,18],[29,13],[34,18],[42,18],[42,15]],
    stops: [[16,15,5],[29,13],[42,15,5]],
  },
  { 
    color: '#FF4757', 
    pts: [[29,2],[29,33]],
    stops: [[29,2,6],[29,6.5,13],[29,33,5]],
  },
]

const VB_W = 1000
const VB_H = 600
const U = 12 
const OX = 266 
const OY = 60

const CYCLE_S = 44 
const STAGGER_S = 1.5 
const DRAW_S = CYCLE_S * 0.22 

const px = ([x, y]) => [OX + x * U, OY + y * U]
const toPath = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${px(p).join(' ')}`).join(' ')

function fracAt(pts, [x, y]) {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  const total = lens.reduce((a, b) => a + b, 0)
  let acc = 0
  for (let i = 0; i < lens.length; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[i + 1]
    const cross = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)
    const inside = x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && y >= Math.min(y1, y2) && y <= Math.max(y1, y2)
    if (Math.abs(cross) < 1e-6 && inside) return (acc + Math.hypot(x - x1, y - y1)) / total
    acc += lens[i]
  }
  return 1
}

const CSS = `
@keyframes net-cycle { 0% { stroke-dashoffset: 1 } 22% { stroke-dashoffset: 0 } 72% { stroke-dashoffset: 0 } 94% { stroke-dashoffset: -1 } 100% { stroke-dashoffset: -1 } }
@keyframes net-stop  { 0% { opacity: 0; transform: scale(.2) } 2% { opacity: 1; transform: scale(1) } 72% { opacity: 1; transform: scale(1) } 75% { opacity: 0; transform: scale(.2) } 100% { opacity: 0; transform: scale(.2) } }
@keyframes net-dot   { 0%, 24% { opacity: 0 } 30% { opacity: 1 } 66% { opacity: 1 } 72% { opacity: 0 } 100% { opacity: 0 } }
.net-line { stroke-dasharray: 1 1; animation: net-cycle ${CYCLE_S}s linear infinite both; }
.net-stop { transform-box: fill-box; transform-origin: center; animation: net-stop ${CYCLE_S}s ease-out infinite both; }
.net-dot  { animation: net-dot ${CYCLE_S}s linear infinite both; }

.hero-mask {
  -webkit-mask-image: linear-gradient(to bottom, #000 40%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 40%, transparent 100%);
}
@media (min-width: 1024px) {
  .hero-mask {
    -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 12%);
    mask-image: linear-gradient(to right, transparent 0%, #000 12%);
  }
}
`

function Network() {
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYTop slice" className="h-full w-full lg:h-auto" aria-hidden="true" focusable="false">
      <style>{CSS}</style>

      {FACADE.map((l, i) => (
        <path
          key={`l${i}`}
          d={toPath(l.pts)}
          pathLength="1"
          className="net-line"
          style={{ animationDelay: `${i * STAGGER_S}s` }}
          fill="none"
          stroke={l.color}
          strokeWidth="5"
          strokeLinejoin="round"
        />
      ))}

      {FACADE.map((l, i) =>
        l.stops.map((s, j) => {
          const [cx, cy] = px(s)
          const r = s[2] || 3.6
          const delay = i * STAGGER_S + DRAW_S * fracAt(l.pts, s)
          const clock = r === 13
          return (
            <g key={`s${i}-${j}`} className="net-stop" style={{ animationDelay: `${delay}s` }}>
              <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#000" strokeWidth={r > 5 ? 2.6 : 1.8} />
              {clock && (
                <g transform={`translate(${cx} ${cy})`} stroke="#000" strokeWidth="2" strokeLinecap="round">
                  <line x1="0" y1="0" x2="0" y2="-9">
                    {!still && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />}
                  </line>
                  <line x1="0" y1="0" x2="5" y2="0">
                    {!still && <animateTransform attributeName="transform" type="rotate" from="90" to="450" dur="720s" repeatCount="indefinite" />}
                  </line>
                </g>
              )}
            </g>
          )
        }),
      )}

      {!still &&
        FACADE.map((l, i) => (
          <circle key={`d${i}`} r="3" fill="#000" stroke="#fff" strokeWidth="1" className="net-dot" style={{ animationDelay: `${i * STAGGER_S}s` }}>
            <animateMotion
              path={toPath(l.pts)}
              dur={`${34 + (i % 3) * 10}s`}
              repeatCount="indefinite"
              calcMode="linear"
              keyPoints="0;1;0"
              keyTimes="0;0.5;1"
            />
          </circle>
        ))}
    </svg>
  )
}

export default function Home() {
  const vehicles = useVehicles()
  return (
    <>
      <section className="relative flex flex-col overflow-hidden bg-white text-black lg:block">
        
        <div className="pointer-events-none relative h-[280px] w-full hero-mask lg:absolute lg:inset-y-0 lg:right-0 lg:flex lg:h-full lg:w-[68%] lg:items-center">
          <Network />
        </div>

        <div className="relative z-10 mx-auto -mt-6 w-full max-w-6xl px-5 pb-10 pt-4 lg:mt-0 lg:flex lg:min-h-[600px] lg:items-center lg:pt-10">
          <div className="max-w-md">
            <h1 className="text-4xl font-light leading-tight tracking-tight sm:text-6xl text-black">
              Transporte
              <br />
              Metropolitano
              <br />
              de Valladolid
            </h1>
            <p className="mt-6 text-black/70">
              Consulta las líneas, sigue tu autobús en el mapa y encuentra tarifas y puntos de recarga en los 15 municipios del área.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
              <Link to="/mapa" className="bg-brand px-5 py-3 font-medium text-black hover:bg-black hover:text-white transition-colors">Autobuses en tiempo real</Link>
              <Link to="/lineas" className="border border-black/30 px-5 py-3 text-black hover:border-brand hover:text-brand transition-colors">Ver las líneas</Link>
            </div>
            <p className="mt-6 text-sm text-black/60">
              <span className="font-mono text-brand font-bold">{vehicles.length}</span> autobuses en circulación ahora
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-5">
        <h2 className="text-2xl font-light">Mapa de la red</h2>
        <p className="mt-2 max-w-xl text-sm text-white/70">
          Pulsa una línea o su cuadrado para ver el detalle de su recorrido.
        </p>
        <div className="mt-6">
          <NetworkMap />
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5">
        <h2 className="mb-5 text-xl font-light">Líneas</h2>
        <ul className="flex flex-wrap gap-3">
          {LINES.map((l) => (
            <li key={l.id}>
              <Link to={`/lineas/${l.id}`} title={l.name}><LineBadge line={l} /></Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-20 mb-10 max-w-6xl px-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {/* Se han eliminado las clases rounded-xl */}
          <div className="flex flex-col justify-center border border-white/10 bg-white/5 p-6 text-center shadow-lg transition-transform hover:scale-105">
            <span className="font-mono text-4xl text-brand mb-2">15</span>
            <span className="text-sm font-medium text-white">Municipios</span>
            <span className="mt-1 text-xs text-white/50">{MUNICIPIOS.slice(0, 5).join(', ')} y 10 más</span>
          </div>

          <div className="flex flex-col justify-center border border-white/10 bg-white/5 p-6 text-center shadow-lg transition-transform hover:scale-105">
            <span className="font-mono text-4xl text-brand mb-2">41</span>
            <span className="text-sm font-medium text-white">Rutas de transporte</span>
          </div>

          <div className="flex flex-col justify-center border border-white/10 bg-white/5 p-6 text-center shadow-lg transition-transform hover:scale-105">
            <span className="font-mono text-4xl text-brand mb-2">{OPERATORS.length}</span>
            <span className="text-sm font-medium text-white">Operadores</span>
          </div>

          <div className="flex flex-col justify-center border border-white/10 bg-white/5 p-6 text-center shadow-lg transition-transform hover:scale-105">
            <span className="font-mono text-4xl text-brand mb-2">≈200K</span>
            <span className="text-sm font-medium text-white">Expediciones al año</span>
          </div>

          <div className="flex flex-col justify-center border border-white/10 bg-white/5 p-6 text-center shadow-lg transition-transform hover:scale-105">
            <span className="font-mono text-4xl text-brand mb-2">403K</span>
            <span className="text-sm font-medium text-white">Habitantes (INE 2024)</span>
            <span className="mt-1 text-xs text-white/50">Beneficiarios de la red</span>
          </div>

        </div>
      </section>
    </>
  )
}