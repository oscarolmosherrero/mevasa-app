export default function LineBadge({ line, size = 'md' }) {
  const s = size === 'lg' ? 'h-16 w-16 text-3xl' : size === 'sm' ? 'h-7 min-w-7 px-1 text-sm' : 'h-12 w-12 text-xl'
  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-medium ${s}`}
      style={{ background: line.color, color: line.ink }}
      aria-label={`Línea ${line.id}`}
    >
      {line.id}
    </span>
  )
}
