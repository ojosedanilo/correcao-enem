import type { AreaStats, ScoreRange } from '../../types'

interface AreaCardProps {
  label: string
  colorClass: string
  stats: AreaStats
  scoreRange?: ScoreRange
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

export function AreaCard({ label, colorClass, stats, scoreRange }: AreaCardProps) {
  const { total, acertos, erros } = stats
  const pct = total > 0 ? acertos / total : 0

  // Progress bar markers
  const minPct = scoreRange ? scoreRange.min / total : 0
  const maxPct = scoreRange ? scoreRange.max / total : 1
  const barLeft = `${(minPct * 100).toFixed(2)}%`
  const barWidth = `${((maxPct - minPct) * 100).toFixed(2)}%`

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
          {acertos} acertos de {total}
        </span>
      </div>

      {/* Score estimates */}
      {scoreRange ? (
        <>
          <div
            className="flex items-around border-t pt-3"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            {/* Min */}
            <div className="flex flex-col items-center gap-0.5 opacity-60 flex-1">
              <span className="text-xs text-surface-500 uppercase tracking-wider">Mín</span>
              <span className="text-base font-display font-700 text-surface-100 tabular-nums">
                {fmt(scoreRange.min)}
              </span>
            </div>

            {/* Avg — destaque */}
            <div className="flex flex-col items-center gap-0.5 flex-1">
              <span className="text-xs text-surface-500 uppercase tracking-wider">Média</span>
              <span
                className="text-2xl font-display font-800 tabular-nums"
                style={{ color: 'var(--area-color)' }}
              >
                {fmt(scoreRange.avg)}
              </span>
            </div>

            {/* Max */}
            <div className="flex flex-col items-center gap-0.5 opacity-60 flex-1">
              <span className="text-xs text-surface-500 uppercase tracking-wider">Máx</span>
              <span className="text-base font-display font-700 text-surface-100 tabular-nums">
                {fmt(scoreRange.max)}
              </span>
            </div>
          </div>

          {/* Range bar */}
          <div className="relative h-1.5 bg-surface-700/60 rounded-full overflow-hidden mt-0.5">
            {/* Current position */}
            <div
              className="absolute top-0 h-full rounded-full transition-all duration-500"
              style={{
                left: `${(pct * 100).toFixed(1)}%`,
                width: '3px',
                transform: 'translateX(-50%)',
                background: 'var(--area-color)',
                opacity: 0.9,
              }}
            />
            {/* Range band */}
            <div
              className="absolute top-0 h-full rounded-full transition-all duration-500"
              style={{
                left: barLeft,
                width: barWidth,
                background: 'var(--area-color)',
                opacity: 0.25,
              }}
            />
          </div>

          <p className="text-[11px] text-surface-600 text-center tabular-nums -mt-1">
            {fmt(scoreRange.min)} – {fmt(scoreRange.max)}
          </p>
        </>
      ) : (
        <>
          {/* No score data yet: show simple bar */}
          <div
            className="flex items-center gap-3 border-t pt-3"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
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

          <div className="flex justify-around text-xs text-surface-500">
            <span><span className="text-success-400 font-700">{acertos}</span> certos</span>
            <span><span className="text-danger-400 font-700">{erros}</span> erros</span>
          </div>
        </>
      )}
    </div>
  )
}
