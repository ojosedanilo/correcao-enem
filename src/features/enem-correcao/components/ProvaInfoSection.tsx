import { useCollapse } from '../hooks/useCollapse'
import { CollapsibleSection } from './ui/CollapsibleSection'
import { coresCadernos } from '../data/coresCadernos'
import type { ProvaInfo } from '../types'

interface ProvaInfoSectionProps {
  provaInfo: ProvaInfo
  onChange: <K extends keyof ProvaInfo>(key: K, value: ProvaInfo[K]) => void
  edicoes: number[]
}

export function ProvaInfoSection({ provaInfo, onChange, edicoes }: ProvaInfoSectionProps) {
  const { isOpen, toggle } = useCollapse(true)
  const cores = coresCadernos[provaInfo.edicao] ?? { dia_1: [], dia_2: [] }

  return (
    <CollapsibleSection
      title="Informações da Prova"
      subtitle="Edição, cor do caderno e língua estrangeira"
      isOpen={isOpen}
      onToggle={toggle}
    >
      <div className="px-5 pb-5 pt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Edição */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-display font-600 text-surface-400 uppercase tracking-wider">
            Edição
          </label>
          <select
            className="input-base"
            value={provaInfo.edicao}
            onChange={e => onChange('edicao', Number(e.target.value))}
          >
            {edicoes.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Cor Dia 1 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-display font-600 text-surface-400 uppercase tracking-wider">
            Cor — 1º Dia
          </label>
          <select
            className="input-base"
            value={provaInfo.corDia1}
            onChange={e => onChange('corDia1', e.target.value)}
          >
            {cores.dia_1.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Cor Dia 2 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-display font-600 text-surface-400 uppercase tracking-wider">
            Cor — 2º Dia
          </label>
          <select
            className="input-base"
            value={provaInfo.corDia2}
            onChange={e => onChange('corDia2', e.target.value)}
          >
            {cores.dia_2.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Língua */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-display font-600 text-surface-400 uppercase tracking-wider">
            Língua Estrang.
          </label>
          <select
            className="input-base"
            value={provaInfo.linguaEstrangeira}
            onChange={e => onChange('linguaEstrangeira', e.target.value as ProvaInfo['linguaEstrangeira'])}
          >
            <option value="Inglês">Inglês</option>
            <option value="Espanhol">Espanhol</option>
          </select>
        </div>
      </div>
    </CollapsibleSection>
  )
}
