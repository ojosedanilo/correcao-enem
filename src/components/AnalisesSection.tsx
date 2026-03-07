import { useEffect, useRef } from 'react'
import SectionCard from './SectionCard'
import type { ResultadoCorrecao } from '../types'

interface AnalisesProps {
  resultado: ResultadoCorrecao | null
}

const AREAS = [
  { key: 'linguagens' as const, label: 'Linguagens', color: 'bg-violet-500' },
  { key: 'humanas'    as const, label: 'Humanas',    color: 'bg-amber-500'  },
  { key: 'natureza'   as const, label: 'Natureza',   color: 'bg-sky-500'    },
  { key: 'matematica' as const, label: 'Matemática', color: 'bg-rose-500'   },
]

function ProgressBar({ percent, color }: { percent: number; color: string }) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!barRef.current) return
    // Trigger animation
    barRef.current.style.width = '0%'
    const raf = requestAnimationFrame(() => {
      if (barRef.current) barRef.current.style.width = `${percent}%`
    })
    return () => cancelAnimationFrame(raf)
  }, [percent])

  return (
    <div className="progress-track">
      <div
        ref={barRef}
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: '0%' }}
      />
    </div>
  )
}

function AnaliseCard({
  label, total, acertos, color,
}: { label: string; total: number; acertos: number; color: string }) {
  const erros = total - acertos
  const percent = total > 0 ? (acertos / total) * 100 : 0
  const percentFormatted = percent.toLocaleString('pt-BR', { maximumFractionDigits: 1 })

  return (
    <div className="bg-surface-700/50 rounded-xl p-4 border border-surface-600 flex flex-col gap-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-600 text-sm text-slate-200">{label}</h3>
        <span className="text-lg font-display font-700 text-slate-100 tabular-nums">{percentFormatted}%</span>
      </div>

      <ProgressBar percent={percent} color={color} />

      <div className="flex gap-4 text-xs">
        <span className="text-slate-400">Total: <span className="text-slate-200 font-medium tabular-nums">{total}</span></span>
        <span className="text-brand-400">Acertos: <span className="font-medium tabular-nums">{acertos}</span></span>
        <span className="text-red-400">Erros: <span className="font-medium tabular-nums">{erros}</span></span>
      </div>
    </div>
  )
}

export default function AnalisesSection({ resultado }: AnalisesProps) {
  if (!resultado) {
    return (
      <SectionCard title="Análises">
        <div className="pt-6 pb-2 text-center text-slate-500 text-sm">
          <svg className="w-10 h-10 mx-auto mb-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Corrija seu gabarito para ver as análises.
        </div>
      </SectionCard>
    )
  }

  const geralPercent = resultado.geral.total > 0
    ? (resultado.geral.acertos / resultado.geral.total) * 100
    : 0

  return (
    <SectionCard title="Análises">
      <div className="pt-4 flex flex-col gap-5">
        {/* Geral destacado */}
        <div className="bg-surface-700/50 border border-surface-600 rounded-xl p-5">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Resultado Geral</p>
              <p className="text-3xl font-display font-800 text-slate-100 tabular-nums">
                {geralPercent.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-700 text-brand-400 tabular-nums">{resultado.geral.acertos}</p>
              <p className="text-xs text-slate-500">de {resultado.geral.total} questões</p>
            </div>
          </div>
          <ProgressBar percent={geralPercent} color="bg-brand-500" />
          <div className="flex gap-4 mt-3 text-xs">
            <span className="text-brand-400">✓ Acertos: <b>{resultado.geral.acertos}</b></span>
            <span className="text-red-400">✗ Erros: <b>{resultado.geral.total - resultado.geral.acertos}</b></span>
          </div>
        </div>

        {/* Por área */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AREAS.map(({ key, label, color }) => (
            <AnaliseCard
              key={key}
              label={label}
              total={resultado[key].total}
              acertos={resultado[key].acertos}
              color={color}
            />
          ))}
        </div>

        {/* Erros por área */}
        {AREAS.map(({ key, label }) => {
          const erros = resultado.erros[key]
          if (erros.length === 0) return null
          return (
            <div key={key} className="bg-surface-700/30 border border-surface-600/50 rounded-xl p-4">
              <h4 className="font-display font-600 text-sm text-slate-300 mb-3">
                Erros em {label} ({erros.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {erros.map((e) => (
                  <div key={e.questao} className="bg-red-950/50 border border-red-900/40 rounded-lg px-2.5 py-1 text-xs">
                    <span className="text-slate-300 font-mono">Q{e.questao}</span>
                    <span className="text-slate-500 mx-1">→</span>
                    <span className="text-red-400 line-through">{e.usuario}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-brand-400 font-semibold">{e.certo}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
