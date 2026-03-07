import SectionCard from './SectionCard'
import type { Respostas } from '../types'

interface TextoGabaritoProps {
  texto: string
  onTextoChange: (v: string) => void
  onCarregar: () => void
  respostas: Respostas
  onCorrigir: () => void
}

const PLACEHOLDER = `Cole ou escreva seu gabarito aqui.
Formato: número da questão e alternativa em linhas alternadas.

Exemplo:
1
A
2
B
3
C`

export default function TextoGabaritoSection({
  texto, onTextoChange, onCarregar, respostas, onCorrigir,
}: TextoGabaritoProps) {
  const totalRespondidas = Object.keys(respostas).length

  return (
    <SectionCard title="Gabarito em Texto" badge={totalRespondidas > 0 ? `${totalRespondidas} questões` : undefined}>
      <div className="pt-4 flex flex-col gap-3">
        <textarea
          className="w-full bg-surface-700 border border-surface-500 rounded-xl
                     px-4 py-3 text-sm text-slate-200 placeholder-slate-600
                     font-mono leading-relaxed resize-y min-h-[120px] max-h-96
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
                     transition-colors"
          placeholder={PLACEHOLDER}
          value={texto}
          onChange={(e) => onTextoChange(e.target.value)}
          rows={8}
        />
        <div className="flex gap-2 flex-wrap">
          <button className="btn-secondary" onClick={onCarregar}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Carregar no formulário
          </button>
          <button className="btn-primary" onClick={onCorrigir}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Corrigir
          </button>
        </div>
      </div>
    </SectionCard>
  )
}
