import { useCollapse } from '../hooks/useCollapse'
import { CollapsibleSection } from './ui/CollapsibleSection'
import type { RespostasAluno } from '../types'
import { AREAS_META } from '../types'

const ALTERNATIVAS = ['A', 'B', 'C', 'D', 'E']

interface GabaritoAlunoSectionProps {
  respostas: RespostasAluno
  onSetResposta: (questao: string, valor: string) => void
  linguaSufixo: 'I' | 'E'
}

function QuestionRow({
  num,
  questaoKey,
  resposta,
  onSelect,
}: {
  num: number
  questaoKey: string
  resposta: string
  onSelect: (alt: string) => void
}) {
  return (
    <div className="flex items-center gap-2 py-0.5">
      <span className="w-7 text-right text-xs font-mono text-surface-500 tabular-nums shrink-0">{num}</span>
      <div className="flex gap-0.5">
        {ALTERNATIVAS.map(alt => {
          const selected = resposta === alt
          return (
            <button
              key={alt}
              type="button"
              onClick={() => onSelect(selected ? '' : alt)}
              className={`w-7 h-7 rounded-lg text-xs font-display font-700 transition-all duration-100 active:scale-90
                ${selected
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-700/30'
                  : 'bg-surface-700/50 text-surface-400 hover:bg-surface-600/60 hover:text-surface-200'
                }`}
            >
              {alt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function GabaritoAlunoSection({
  respostas,
  onSetResposta,
  linguaSufixo,
}: GabaritoAlunoSectionProps) {
  // Collapsed by default (conforme o pedido)
  const { isOpen, toggle } = useCollapse(false)

  const totalRespondidas = Object.values(respostas).filter(Boolean).length

  const badge = totalRespondidas > 0
    ? <span className="text-xs font-mono text-surface-400 bg-surface-700/60 px-2 py-0.5 rounded-full">{totalRespondidas}/180</span>
    : null

  return (
    <CollapsibleSection
      title="Seu Gabarito"
      subtitle="Marque suas respostas diretamente nos inputs"
      isOpen={isOpen}
      onToggle={toggle}
      badge={badge}
    >
      <div className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {AREAS_META.map(area => (
          <div key={area.key} className="flex flex-col gap-1">
            <div
              className={`text-xs font-display font-700 mb-2 pb-2 border-b border-surface-700/50 ${area.colorClass}`}
              style={{ color: 'var(--area-color)' }}
            >
              {area.labelCurto}
            </div>
            <div className="flex flex-col gap-0.5">
              {Array.from({ length: area.totalQuestoes }, (_, i) => {
                const num = area.min + i
                const questaoKey = (num <= 5) ? `${num}${linguaSufixo}` : `${num}`
                const resposta = respostas[questaoKey] ?? ''
                return (
                  <QuestionRow
                    key={questaoKey}
                    num={num}
                    questaoKey={questaoKey}
                    resposta={resposta}
                    onSelect={alt => onSetResposta(questaoKey, alt)}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
