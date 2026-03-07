import { useMemo } from 'react'
import SectionCard from './SectionCard'
import type { Respostas, ErroQuestao } from '../types'

interface GabaritoFormProps {
  respostas: Respostas
  onResposta: (questao: string, alternativa: string) => void
  onCorrigir: () => void
  erros?: Record<string, ErroQuestao[]>
  corrigido: boolean
}

const ALTERNATIVAS = ['A', 'B', 'C', 'D', 'E']

const AREAS = [
  { id: 'linguagens', label: 'Linguagens, Códigos e suas Tecnologias', sub: 'Português · Literatura · L. Estrangeira · Artes · Ed. Física', min: 1,   max: 45  },
  { id: 'humanas',    label: 'Ciências Humanas e suas Tecnologias',     sub: 'História · Geografia · Filosofia · Sociologia',             min: 46,  max: 90  },
  { id: 'natureza',   label: 'Ciências da Natureza e suas Tecnologias', sub: 'Física · Química · Biologia',                               min: 91,  max: 135 },
  { id: 'matematica', label: 'Matemática e suas Tecnologias',           sub: 'Matemática',                                               min: 136, max: 180 },
]

function QuestionRow({
  num, respostas, erros, onResposta,
}: {
  num: number
  respostas: Respostas
  erros: ErroQuestao[]
  onResposta: (questao: string, alt: string) => void
}) {
  const key = String(num)
  const selected = respostas[key]
  const erro = erros.find((e) => e.questao === key || e.questao === `${num}I` || e.questao === `${num}E`)

  return (
    <div className="flex items-center gap-2 py-1 justify-center">
      <span className={`text-xs w-6 text-right shrink-0 font-mono ${erro ? 'text-red-400 font-semibold' : 'text-slate-500'}`}>
        {num}
      </span>
      <div className="flex gap-1">
        {ALTERNATIVAS.map((alt) => {
          const isSelected = selected === alt
          const isWrong = erro && isSelected
          return (
            <button
              key={alt}
              onClick={() => onResposta(key, isSelected ? '' : alt)}
              className={`radio-option ${isSelected ? (isWrong ? 'wrong' : 'selected') : ''}`}
              aria-pressed={isSelected}
              aria-label={`Questão ${num}, alternativa ${alt}`}
            >
              {alt}
            </button>
          )
        })}
      </div>
      {erro && (
        <span className="text-xs text-brand-400 font-medium shrink-0">
          ✓ {erro.certo}
        </span>
      )}
    </div>
  )
}

export default function GabaritoFormSection({ respostas, onResposta, onCorrigir, erros = {}, corrigido }: GabaritoFormProps) {
  const totalRespondidas = useMemo(() => Object.values(respostas).filter(Boolean).length, [respostas])

  return (
    <SectionCard title="Seu Gabarito" badge={`${totalRespondidas}/180`}>
      <div className="pt-4 flex flex-col gap-6">
        {AREAS.map((area) => {
          const areaErros = erros[area.id] ?? []
          const respondidas = Array.from({ length: area.max - area.min + 1 }, (_, i) => area.min + i)
            .filter((n) => respostas[String(n)]).length

          return (
            <div key={area.id}>
              <div className="flex items-baseline justify-between mb-2 flex-wrap gap-1">
                <div>
                  <h3 className="font-display font-600 text-sm text-slate-200">{area.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{area.sub}</p>
                </div>
                <span className="text-xs text-slate-500 tabular-nums">
                  {respondidas}/{area.max - area.min + 1}
                  {corrigido && areaErros.length > 0 && (
                    <span className="ml-1.5 text-red-400">{areaErros.length} erro{areaErros.length > 1 ? 's' : ''}</span>
                  )}
                </span>
              </div>

              {/* Question grid — responsive 2-col on small, 3-col on medium+ */}
              <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-0 bg-surface-700/30 rounded-xl px-3 py-2">
                {Array.from({ length: area.max - area.min + 1 }, (_, i) => area.min + i).map((num) => (
                  <QuestionRow
                    key={num}
                    num={num}
                    respostas={respostas}
                    erros={areaErros}
                    onResposta={onResposta}
                  />
                ))}
              </div>
            </div>
          )
        })}

        <button className="btn-primary self-start" onClick={onCorrigir}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Corrigir gabarito
        </button>
      </div>
    </SectionCard>
  )
}
