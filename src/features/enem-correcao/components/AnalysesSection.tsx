import { useCollapse } from '../hooks/useCollapse'
import { CollapsibleSection } from './ui/CollapsibleSection'
import { AreaCard } from './ui/AreaCard'
import type { ResultadoDetalhado, AreaKey } from '../types'
import { AREAS_META } from '../types'

interface AnalysesSectionProps {
  resultado: ResultadoDetalhado | null
}

const AREA_LABELS: Record<AreaKey, string> = {
  linguagens: 'Linguagens',
  humanas: 'Ciências Humanas',
  natureza: 'Ciências da Natureza',
  matematica: 'Matemática',
}

const EMPTY_STATS = { total: 45, acertos: 0, erros: 0 }
const EMPTY_GERAL = { total: 180, acertos: 0, erros: 0 }

function ErrosAreaBlock({ area, erros }: { area: string; erros: ResultadoDetalhado['errosPorArea'][AreaKey] }) {
  if (!erros || erros.length === 0) return null

  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="text-xs font-display font-700 text-surface-400 uppercase tracking-wider pt-2">{area}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
        {erros.map(e => (
          <div
            key={e.questao}
            className="flex items-center gap-2 rounded-lg bg-surface-700/30 px-2.5 py-1.5 text-xs font-mono"
          >
            <span className="text-surface-400">{e.questao}</span>
            <span className="text-success-400 font-700">{e.respostaCorreta}</span>
            <span className="text-danger-400">{e.respostaAluno}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnalysesSection({ resultado }: AnalysesSectionProps) {
  const { isOpen, toggle } = useCollapse(true)
  const { isOpen: errosOpen, toggle: errosToggle } = useCollapse(false)

  const hasResultado = resultado !== null

  const totalAcertos = resultado?.geral.acertos ?? 0
  const badge = hasResultado
    ? <span className="text-xs font-mono text-surface-400 bg-surface-700/60 px-2 py-0.5 rounded-full">{totalAcertos}/180</span>
    : null

  return (
    <CollapsibleSection
      title="Análises"
      subtitle={hasResultado ? 'Resultados por área de conhecimento' : 'Corrija para ver os resultados'}
      isOpen={isOpen}
      onToggle={toggle}
      badge={badge}
    >
      <div className="px-5 pb-5 pt-2 flex flex-col gap-4">
        {/* Geral card */}
        <div className="rounded-xl border border-surface-700/50 bg-surface-700/20 p-4 flex flex-col gap-3 area-card-geral">
          <div className="flex items-center justify-between">
            <span className="text-sm font-display font-700 text-surface-300">Geral</span>
            <span className="text-xs text-surface-500 tabular-nums">
              {resultado?.geral.acertos ?? 0} acertos de {resultado?.geral.total ?? 180}
            </span>
          </div>
          <div className="flex items-center gap-3 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="flex-1 h-1.5 bg-surface-700/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-surface-300 transition-all duration-700"
                style={{ width: `${resultado ? (resultado.geral.acertos / resultado.geral.total * 100).toFixed(1) : 0}%` }}
              />
            </div>
            <span className="text-xs font-mono tabular-nums text-surface-300">
              {resultado ? (resultado.geral.acertos / resultado.geral.total * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
          <div className="flex justify-around text-xs text-surface-500">
            <span><span className="text-success-400 font-700">{resultado?.geral.acertos ?? 0}</span> certos</span>
            <span><span className="text-danger-400 font-700">{resultado?.geral.erros ?? 0}</span> erros</span>
            <span><span className="text-surface-400 font-700">{resultado ? resultado.geral.total - resultado.geral.acertos - resultado.geral.erros : 180}</span> em branco</span>
          </div>
        </div>

        {/* Area cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AREAS_META.map(area => (
            <AreaCard
              key={area.key}
              label={area.labelCurto}
              colorClass={area.colorClass}
              stats={resultado?.[area.key] ?? EMPTY_STATS}
              scoreRange={undefined /* você pode injetar aqui quando implementar o cálculo */}
            />
          ))}
        </div>

        {/* Erros detail */}
        {hasResultado && resultado.errosPorArea && (
          <div className="section-card overflow-hidden">
            <button
              type="button"
              className="section-header w-full text-left"
              onClick={errosToggle}
            >
              <span className="text-sm font-display font-600 text-surface-300">Questões Erradas</span>
              <span className="text-xs text-surface-500">
                {errosOpen ? 'Ocultar' : 'Mostrar'}
              </span>
            </button>
            {errosOpen && (
              <div className="px-5 pb-5 flex flex-col gap-3 animate-slide-down">
                <p className="text-xs text-surface-500 mb-1">
                  Questão · <span className="text-success-400">Correta</span> · <span className="text-danger-400">Sua</span>
                </p>
                {AREAS_META.map(area => (
                  <ErrosAreaBlock
                    key={area.key}
                    area={AREA_LABELS[area.key]}
                    erros={resultado.errosPorArea[area.key]}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!hasResultado && (
          <p className="text-center text-sm text-surface-600 py-6">
            Preencha o gabarito e clique em <strong className="text-surface-400">Corrigir</strong> para ver as análises.
          </p>
        )}
      </div>
    </CollapsibleSection>
  )
}
