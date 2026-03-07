import SectionCard from './SectionCard'
import { coresCadernos } from '../data/coresCadernos'

interface ProvaInfoProps {
  edicao: string
  corDia1: string
  corDia2: string
  lingua: string
  onEdicaoChange: (v: string) => void
  onCorDia1Change: (v: string) => void
  onCorDia2Change: (v: string) => void
  onLinguaChange: (v: string) => void
}

// Anos do mais recente ao mais antigo
const ANOS = Array.from({ length: 2025 - 2009 + 1 }, (_, i) => 2025 - i)

export default function ProvaInfoSection({
  edicao, corDia1, corDia2, lingua,
  onEdicaoChange, onCorDia1Change, onCorDia2Change, onLinguaChange,
}: ProvaInfoProps) {
  const coresEdicao = coresCadernos[Number(edicao)]

  function handleEdicaoChange(v: string) {
    onEdicaoChange(v)
    // Reset cores ao trocar edição
    const cores = coresCadernos[Number(v)]
    if (cores) {
      onCorDia1Change(cores.dia_1[0])
      onCorDia2Change(cores.dia_2[0])
    }
  }

  return (
    <SectionCard title="Informações da Prova">
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Edição */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Edição
          </label>
          <select className="field-select" value={edicao} onChange={(e) => handleEdicaoChange(e.target.value)}>
            {ANOS.map((ano) => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>
        </div>

        {/* Cor Dia 1 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Cor — 1º Dia
          </label>
          <select className="field-select" value={corDia1} onChange={(e) => onCorDia1Change(e.target.value)}>
            {(coresEdicao?.dia_1 ?? []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Cor Dia 2 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Cor — 2º Dia
          </label>
          <select className="field-select" value={corDia2} onChange={(e) => onCorDia2Change(e.target.value)}>
            {(coresEdicao?.dia_2 ?? []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Língua */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Língua Estrangeira
          </label>
          <select className="field-select" value={lingua} onChange={(e) => onLinguaChange(e.target.value)}>
            <option value="Inglês">Inglês</option>
            <option value="Espanhol">Espanhol</option>
          </select>
        </div>
      </div>
    </SectionCard>
  )
}
