import SectionCard from './SectionCard'
import { consultarTRI, TRI_ANOS_DISPONIVEIS, type TRIArea } from '../data/tri'
import type { ResultadoCorrecao } from '../types'

interface TRISectionProps {
  resultado: ResultadoCorrecao
  edicao: string
}

const AREAS: { key: TRIArea; label: string; color: string; accent: string }[] = [
  { key: 'linguagens', label: 'Linguagens', color: 'border-violet-700/50 bg-violet-950/20', accent: 'text-violet-400' },
  { key: 'humanas',    label: 'Humanas',    color: 'border-amber-700/50  bg-amber-950/20',  accent: 'text-amber-400'  },
  { key: 'natureza',   label: 'Natureza',   color: 'border-sky-700/50    bg-sky-950/20',    accent: 'text-sky-400'    },
  { key: 'matematica', label: 'Matemática', color: 'border-rose-700/50   bg-rose-950/20',   accent: 'text-rose-400'   },
]

function ScoreBadge({ value, label, dim }: { value: number; label: string; dim?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 ${dim ? 'opacity-60' : ''}`}>
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-base font-display font-700 text-slate-100 tabular-nums">
        {value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </span>
    </div>
  )
}

function NoteMinMax({ min, max }: { min: number; max: number }) {
  // Bar showing where the range sits on ~260–1000 scale
  const SCALE_MIN = 260
  const SCALE_MAX = 1000
  const range     = SCALE_MAX - SCALE_MIN
  const leftPct   = ((min - SCALE_MIN) / range) * 100
  const widthPct  = ((max - min) / range) * 100

  return (
    <div className="relative h-2 bg-surface-600 rounded-full overflow-hidden mt-1">
      <div
        className="absolute top-0 h-full rounded-full bg-brand-500/60"
        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
      />
    </div>
  )
}

export default function TRISection({ resultado, edicao }: TRISectionProps) {
  // Só exibe se a edição tiver dados TRI disponíveis
  if (!TRI_ANOS_DISPONIVEIS.includes(edicao)) {
    return null
  }

  return (
    <SectionCard
      title="Estimativa de Nota TRI"
      badge={`ENEM ${edicao}`}
    >
      <div className="pt-4 flex flex-col gap-4">
        {/* Aviso metodológico */}
        <p className="text-xs text-slate-500 bg-surface-700/40 border border-surface-600/50 rounded-xl px-3 py-2.5 leading-relaxed">
          Faixa de notas TRI correspondente ao número de acertos de cada candidato no ENEM {edicao}.
          A <strong className="text-slate-300">média</strong> é calculada como (mín + máx) / 2.
          Valores com <span className="text-slate-400">— </span>
          indicam que não há dados oficiais para essa quantidade de acertos.
        </p>

        {/* Cards por área */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AREAS.map(({ key, label, color, accent }) => {
            const acertos = resultado[key].acertos
            const tri     = consultarTRI(edicao, key, acertos)

            return (
              <div
                key={key}
                className={`rounded-xl border p-4 flex flex-col gap-3 ${color}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-display font-600 ${accent}`}>{label}</span>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {acertos} acerto{acertos !== 1 ? 's' : ''} de 45
                  </span>
                </div>

                {/* Scores */}
                {tri ? (
                  <>
                    <div className="flex items-center justify-around border-t border-white/5 pt-3">
                      <ScoreBadge value={tri.min}   label="Mín" dim />
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Média</span>
                        <span className={`text-xl font-display font-800 tabular-nums ${accent}`}>
                          {tri.media.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </span>
                      </div>
                      <ScoreBadge value={tri.max}   label="Máx" dim />
                    </div>
                    <NoteMinMax min={tri.min} max={tri.max} />
                    <p className="text-[11px] text-slate-600 text-center tabular-nums">
                      {tri.min.toFixed(1)} – {tri.max.toFixed(1)}
                    </p>
                  </>
                ) : (
                  <div className="text-center py-3 text-slate-600 text-sm border-t border-white/5 pt-3">
                    — sem dados para {acertos} acerto{acertos !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Tabela detalhada (collapsible hint) */}
        <details className="group">
          <summary className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer select-none transition-colors list-none flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Ver tabela completa por acertos
          </summary>

          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-700/60">
                  <th className="px-3 py-2 text-slate-400 font-medium w-14">Acertos</th>
                  {AREAS.map(({ key, label, accent }) => (
                    <th key={key} className={`px-3 py-2 font-medium ${accent}`} colSpan={3}>
                      {label}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-surface-600 bg-surface-700/40">
                  <th className="px-3 py-1.5" />
                  {AREAS.map(({ key }) => (
                    <th key={key + '-sub'} className="px-3 py-1.5 text-slate-500 font-normal" colSpan={3}>
                      <span className="flex gap-2">
                        <span className="w-14 text-center">Mín</span>
                        <span className="w-16 text-center">Média</span>
                        <span className="w-14 text-center">Máx</span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 46 }, (_, i) => i).map((acertos) => {
                  const isUserRow = AREAS.some((a) => resultado[a.key].acertos === acertos)
                  return (
                    <tr
                      key={acertos}
                      className={`border-b border-surface-700/50 transition-colors
                        ${isUserRow
                          ? 'bg-brand-900/30 border-brand-800/40'
                          : 'hover:bg-surface-700/30'
                        }`}
                    >
                      <td className={`px-3 py-1.5 tabular-nums font-mono ${isUserRow ? 'text-brand-400 font-bold' : 'text-slate-500'}`}>
                        {acertos}
                        {isUserRow && <span className="ml-1 text-brand-600">◀</span>}
                      </td>
                      {AREAS.map(({ key }) => {
                        const t = consultarTRI(edicao, key, acertos)
                        const isThis = resultado[key].acertos === acertos
                        return (
                          <td key={key} className="px-3 py-1.5" colSpan={3}>
                            {t ? (
                              <span className={`flex gap-2 tabular-nums ${isThis ? 'font-semibold' : ''}`}>
                                <span className="w-14 text-center text-slate-500">{t.min.toFixed(1)}</span>
                                <span className={`w-16 text-center ${isThis ? 'text-brand-400' : 'text-slate-300'}`}>{t.media.toFixed(1)}</span>
                                <span className="w-14 text-center text-slate-500">{t.max.toFixed(1)}</span>
                              </span>
                            ) : (
                              <span className="flex gap-2 text-slate-700">
                                <span className="w-14 text-center">—</span>
                                <span className="w-16 text-center">—</span>
                                <span className="w-14 text-center">—</span>
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </SectionCard>
  )
}
