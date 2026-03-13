import type { AreaStats } from '../../types'

interface AreaCardProps {
  label: string
  colorClass: string
  stats: AreaStats
  /** Nota TRI calculada. undefined = ainda carregando; null = indisponível. */
  notaTRI?: number | null
  triCarregando?: boolean
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function AreaCard({ label, colorClass, stats, notaTRI, triCarregando }: AreaCardProps) {
  const { total, acertos, erros } = stats
  const pct = total > 0 ? acertos / total : 0

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 ${colorClass} transition-all duration-200`}
      style={{
        borderColor: 'color-mix(in srgb, var(--area-border) 50%, transparent)',
        background: 'color-mix(in srgb, var(--area-bg) 20%, transparent)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-display font-700"
          style={{ color: 'var(--area-color)' }}
        >
          {label}
        </span>
        <span className="text-xs text-surface-500 tabular-nums">
          {acertos}/{total}
        </span>
      </div>

      {/* Nota TRI — destaque principal */}
      <div
        className="flex items-center justify-between border-t pt-3"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-surface-500 uppercase tracking-wider">Nota TRI</span>
          {triCarregando ? (
            <span className="text-xl font-display font-700 text-surface-500 tabular-nums animate-pulse">
              —
            </span>
          ) : notaTRI != null ? (
            <span
              className="text-2xl font-display font-800 tabular-nums"
              style={{ color: 'var(--area-color)' }}
            >
              {fmt(notaTRI)}
            </span>
          ) : (
            <span className="text-sm text-surface-600 tabular-nums">
              —
            </span>
          )}
        </div>

        {/* Acertos / erros resumo */}
        <div className="flex flex-col items-end gap-1 text-xs text-surface-500">
          <span><span className="text-success-400 font-700">{acertos}</span> certos</span>
          <span><span className="text-danger-400 font-700">{erros}</span> erros</span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-surface-700/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${(pct * 100).toFixed(1)}%`, background: 'var(--area-color)' }}
          />
        </div>
        <span className="text-xs font-mono tabular-nums" style={{ color: 'var(--area-color)' }}>
          {(pct * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}
