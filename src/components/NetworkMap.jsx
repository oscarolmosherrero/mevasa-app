import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getLine } from '../data/lines.js'

const VIEWBOX = '50 50 1350 1300'

const PATHS = [
  { id: '11', kind: 'branch', r: 0,  pts: [[500,544], [250,294]] },
  { id: '10', kind: 'branch', r: 0,  pts: [[520,564], [350,564]] },
  { id: '8',  kind: 'branch', r: 16, pts: [[540,584], [540,150], [780,150]] },
  { id: '14', kind: 'branch', r: 16, pts: [[660,704], [660,1198], [580,1198]] },
  { id: '15', kind: 'branch', r: 16, pts: [[680,724], [680,1280], [850,1280]] },
  { id: '5',  kind: 'branch', r: 16, pts: [[700,744], [700,1160], [880,1160]] },
  { id: '2',  kind: 'branch', r: 16, pts: [[720,764], [720,940], [800,940]] },
  
  { id: '13', kind: 'branch', r: 16, pts: [[740,784], [740,250], [980,250]] },
  { id: '12', kind: 'branch', r: 16, pts: [[760,804], [940,624], [1180,624]] },
  { id: '7',  kind: 'branch', r: 16, pts: [[780,824], [900,704], [1050,704]] },
  { id: '6',  kind: 'branch', r: 16, pts: [[800,844], [920,964], [1130,964]] },
  
  { id: 'A1', kind: 'stripe', r: 0, pts: [[560,604], [344,820]] },
  { id: 'A2', kind: 'stripe', r: 0, pts: [[580,624], [364,840]] },
  { id: 'A3', kind: 'stripe', r: 0, pts: [[600,644], [384,860]] },
  { id: 'A4', kind: 'stripe', r: 0, pts: [[620,664], [404,880]] },
  { id: 'AU', kind: 'stripe', r: 0, pts: [[640,684], [424,900]] },
]

const BLOBS = [
  { shape: 'poly', keep: true, lines: ['11','10','8','14','15','5','2','13','12','7','6','A1','A2','A3','A4','AU'], pts: [[480, 500], [840, 500], [900, 560], [900, 880], [590, 880], [480, 770]] },
  { shape: 'poly', lines: ['A1','A2','A3','A4','AU'], pts: [[300, 780], [390, 780], [440, 830], [440, 930], [350, 930], [300, 880]] },
  
  { shape: 'rect', lines: ['11'], x: 180,  y: 264,  w: 100, h: 60, r: 0 },
  { shape: 'rect', lines: ['10'], x: 280,  y: 534,  w: 100, h: 60, r: 0 },
  { shape: 'rect', lines: ['8'],  x: 750,  y: 120,  w: 60,  h: 60, r: 0 },
  { shape: 'rect', lines: ['13'], x: 950,  y: 220,  w: 60,  h: 60, r: 0 },
  { shape: 'rect', lines: ['12'], x: 1150, y: 594,  w: 60,  h: 60, r: 0 },
  { shape: 'rect', lines: ['7'],  x: 1020, y: 674,  w: 60,  h: 60, r: 0 },
  { shape: 'rect', lines: ['6'],  x: 1100, y: 934,  w: 60,  h: 60, r: 0 },
  { shape: 'rect', lines: ['2'],  x: 770,  y: 910,  w: 60,  h: 60, r: 0 },
  { shape: 'rect', lines: ['5'],  x: 850,  y: 1130, w: 60,  h: 60, r: 0 },
  { shape: 'rect', lines: ['15'], x: 820,  y: 1250, w: 60,  h: 60, r: 0 },
  { shape: 'rect', lines: ['14'], x: 550,  y: 1168, w: 60,  h: 60, r: 0 },
]

const LABELS = [
  { x: 150,  y: 254,  lines: ['11'], name: 'Aeropuerto', sub: 'y Villanubla', align: 'end', icon: 'plane' },
  { x: 250,  y: 524,  lines: ['10'], name: 'Zaratán', align: 'end' },
  { x: 830,  y: 120,  lines: ['8'],  name: 'Cigales' },
  { x: 1040, y: 210,  lines: ['13'], name: 'Cabezón', sub: 'de Pisuerga' },
  { x: 1160, y: 480,  lines: ['12'], name: 'Castronuevo', sub: 'de Esgueva' },
  { x: 1110, y: 664,  lines: ['7'],  name: 'Renedo', sub: 'de Esgueva' },
  { x: 1190, y: 924,  lines: ['6'],  name: 'Tudela', sub: 'de Duero' },
  { x: 740,  y: 990,  lines: ['2'],  name: 'Laguna', sub: 'de Duero' },
  { x: 930,  y: 1120, lines: ['5'],  name: 'Boecillo' },
  { x: 900,  y: 1240, lines: ['15'], name: 'Parque Tecnológico', sub: 'de Boecillo' },
  { x: 510,  y: 1158, lines: ['14'], name: 'Viana', sub: 'de Cega', align: 'end' },
  { x: 270,  y: 860,  lines: ['A1','A2','A3','A4','AU'], name: 'Arroyo', sub: 'de la Encomienda', align: 'end' },
  // Valladolid situado exactamente en la posición marcada en la flecha de la captura
  { x: 730,  y: 260,  lines: ['11','10','8','14','15','5','2','13','12','7','6','A1','A2','A3','A4','AU'], name: 'Valladolid', keep: true, align: 'start' }
]

const CAPSULES = [
  { x: 650, y: 694, len: 440 }, 
]

const SQ = 40 
const GAP = 6
const SANS = "Geist, ui-sans-serif, system-ui, sans-serif"
const MONO = "'Geist Mono', ui-monospace, Menlo, Consolas, monospace"

const strokeOf = (id) => {
  const l = getLine(id)
  return l?.mapColor || l?.color || '#cccccc'
}

function toPath(pts, r) {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1]
    const [x, y] = pts[i]
    const [nx, ny] = pts[i + 1]
    const l1 = Math.hypot(x - px, y - py)
    const l2 = Math.hypot(nx - x, ny - y)
    const k = Math.min(r, l1 / 2, l2 / 2)
    if (!k) {
      d += ` L${x} ${y}`
      continue
    }
    const ax = x + ((px - x) / l1) * k
    const ay = y + ((py - y) / l1) * k
    const bx = x + ((nx - x) / l2) * k
    const by = y + ((ny - y) / l2) * k
    d += ` L${ax.toFixed(1)} ${ay.toFixed(1)} Q${x} ${y} ${bx.toFixed(1)} ${by.toFixed(1)}`
  }
  const last = pts[pts.length - 1]
  return d + ` L${last[0]} ${last[1]}`
}

const PATH_D = PATHS.map((p) => ({ ...p, d: toPath(p.pts, p.r) }))

function Square({ id, x, y, hover, setHover }) {
  const line = getLine(id) || { name: id, color: '#ccc', ink: '#000' }
  const active = hover === id
  return (
    <Link
      to={`/lineas/${id}`}
      aria-label={`Línea ${id}: ${line.name}`}
      onMouseEnter={() => setHover(id)}
      onMouseLeave={() => setHover(null)}
      onFocus={() => setHover(id)}
      onBlur={() => setHover(null)}
      style={{ cursor: 'pointer' }}
    >
      <rect x={x} y={y} width={SQ} height={SQ} fill={line.color} stroke="#fff" strokeWidth={active ? 4 : 0} />
      <text
        x={x + SQ / 2}
        y={y + SQ / 2}
        dy=".35em"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="21"
        fontWeight="600"
        fill={line.ink}
      >
        {id}
      </text>
    </Link>
  )
}

function Label({ b, hover, setHover }) {
  const n = b.lines.length
  const end = b.align === 'end'
  const total = n * SQ + Math.max(n - 1, 0) * GAP
  const startX = end ? b.x - total : b.x
  const nameY = b.y + (n ? 70 : 22)
  
  const isHighlighted = hover && b.lines.includes(hover)
  const dimmed = hover && !b.keep && !isHighlighted

  const handleMouseEnter = () => {
    if (b.lines.length > 0 && !b.keep) setHover(b.lines[0])
  }

  return (
    <g 
      style={{ opacity: dimmed ? 0.25 : 1, transition: 'opacity .2s', cursor: b.lines.length && !b.keep ? 'pointer' : 'default' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHover(null)}
    >
      {!b.keep && b.lines.map((id, i) => (
        <Square key={id} id={id} x={startX + i * (SQ + GAP)} y={b.y} hover={hover} setHover={setHover} />
      ))}
      
      {b.icon === 'plane' && (
        <path
          transform={`translate(${startX - 44} ${b.y + 3}) scale(1.4)`}
          fill="#fff"
          d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
        />
      )}

      <g fill={b.fill || "#fff"} fontFamily={SANS} textAnchor={end ? 'end' : 'start'} pointerEvents="auto">
        <text x={b.x} y={nameY} fontSize="28">{b.name}</text>
        {b.sub && <text x={b.x} y={nameY + 20} fontSize="14" fillOpacity="0.65">{b.sub}</text>}
      </g>
    </g>
  )
}

function Blob({ b, hover }) {
  const lines = b.lines || []
  const isHighlighted = hover && lines.includes(hover)
  const dimmed = hover && !b.keep && !isHighlighted
  const opacity = hover ? (b.keep ? (isHighlighted ? 0.9 : 0.4) : (dimmed ? 0.15 : 1)) : 1
  const style = { opacity, transition: 'opacity .2s' }

  return b.shape === 'poly' ? (
    <polygon points={b.pts.map((p) => p.join(',')).join(' ')} fill="#fff" stroke="#fff" strokeWidth="26" strokeLinejoin="miter" style={style} />
  ) : (
    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} fill="#fff" stroke="#fff" strokeWidth="20" strokeLinejoin="miter" style={style} />
  )
}

export default function NetworkMap() {
  const [hover, setHover] = useState(null)
  const navigate = useNavigate()
  const go = (id) => navigate(`/lineas/${id}`)

  const layer = (kind) => {
    const items = PATH_D.filter((p) => p.kind === kind)
    const opacity = (id) => (hover && hover !== id ? 0.12 : 1)
    return (
      <g fill="none" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
        {items.map((p, i) => <path key={i} d={p.d} stroke={strokeOf(p.id)} style={{ opacity: opacity(p.id), transition: 'opacity .2s' }} />)}
      </g>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-2">
      <svg viewBox={VIEWBOX} className="mx-auto w-full max-h-[85vh] object-contain" role="group" aria-label="Mapa esquemático de la red metropolitana">
        {BLOBS.map((b, i) => <Blob key={i} b={b} hover={hover} />)}

        {layer('branch')}
        {layer('stripe')}

        {CAPSULES.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) rotate(45)`} pointerEvents="none">
            <rect x={-c.len / 2} y="-15" width={c.len} height="30" rx="0" fill="none" stroke="#000" strokeWidth="10" strokeLinejoin="miter" />
          </g>
        ))}

        <g fill="none" stroke="transparent" strokeLinecap="round" strokeLinejoin="round" pointerEvents="stroke" style={{ cursor: 'pointer' }}>
          {PATH_D.map((p, i) => (
            <path
              key={i}
              d={p.d}
              strokeWidth={p.kind === 'stripe' ? 12 : 26}
              onClick={() => go(p.id)}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
            >
              <title>{`Línea ${p.id}`}</title>
            </path>
          ))}
        </g>

        {LABELS.map((b, i) => <Label key={i} b={b} hover={hover} setHover={setHover} />)}
      </svg>
    </div>
  )
}