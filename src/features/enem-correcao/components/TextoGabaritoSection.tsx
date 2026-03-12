import { useCollapse } from '../hooks/useCollapse'
import { CollapsibleSection } from './ui/CollapsibleSection'
import { RefreshCw } from './ui/icons'
import type { ProvaInfo } from '../types'
import { textoParaRespostas } from '../utils/gabarito'

interface TextoGabaritoSectionProps {
  texto: string
  onTextoChange: (v: string) => void
  provaInfo: ProvaInfo
  onCarregar: (texto: string) => void
}

const PLACEHOLDER = `Cole ou digite as questões e respostas alternando linha a linha:

1
A
2
C
3
E
...`

export function TextoGabaritoSection({
  texto,
  onTextoChange,
  provaInfo,
  onCarregar,
}: TextoGabaritoSectionProps) {
  const { isOpen, toggle } = useCollapse(true)

  const count = texto
    ? Object.keys(textoParaRespostas(texto, provaInfo.linguaEstrangeira)).length
    : 0

  const badge = count > 0
    ? <span className="text-xs font-mono text-surface-400 bg-surface-700/60 px-2 py-0.5 rounded-full">{count} questões</span>
    : null

  return (
    <CollapsibleSection
      title="Gabarito via Texto"
      subtitle="Cole seu gabarito em texto, questão por linha"
      isOpen={isOpen}
      onToggle={toggle}
      badge={badge}
    >
      <div className="px-5 pb-5 pt-2 flex flex-col gap-3">
        <textarea
          className="input-base resize-none font-mono text-xs leading-relaxed min-h-[180px]"
          placeholder={PLACEHOLDER}
          value={texto}
          onChange={e => onTextoChange(e.target.value)}
          spellCheck={false}
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="btn-primary flex items-center gap-2"
            onClick={() => onCarregar(texto)}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Carregar Gabarito
          </button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
