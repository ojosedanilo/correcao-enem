import { useState, useEffect } from 'react'
import { X, Trash } from './ui/icons'
import type { GabaritoSalvo, ProvaInfo, RespostasAluno } from '../types'
import { listarGabaritosSalvos, adicionarGabarito, apagarGabarito } from '../utils/storage'

interface SaveModalProps {
  provaInfo: ProvaInfo
  respostas: RespostasAluno
  onClose: () => void
}

export function SaveModal({ provaInfo, respostas, onClose }: SaveModalProps) {
  const [nome, setNome] = useState(`ENEM ${provaInfo.edicao} — ${provaInfo.corDia1}/${provaInfo.corDia2}`)

  function handleSave() {
    adicionarGabarito({ nome, provaInfo, gabarito: respostas })
    onClose()
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-700 text-lg text-surface-100">Salvar Gabarito</h2>
        <div className="text-xs text-surface-500 space-y-1">
          <p>Edição: <span className="text-surface-300">{provaInfo.edicao}</span></p>
          <p>Cor 1º Dia: <span className="text-surface-300">{provaInfo.corDia1}</span></p>
          <p>Cor 2º Dia: <span className="text-surface-300">{provaInfo.corDia2}</span></p>
          <p>Língua: <span className="text-surface-300">{provaInfo.linguaEstrangeira}</span></p>
          <p>Respostas: <span className="text-surface-300">{Object.keys(respostas).length} questões</span></p>
        </div>
        <input
          className="input-base"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome para este gabarito"
        />
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-primary" onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </ModalOverlay>
  )
}

interface LoadModalProps {
  onLoad: (g: GabaritoSalvo) => void
  onClose: () => void
}

export function LoadModal({ onLoad, onClose }: LoadModalProps) {
  const [lista, setLista] = useState<GabaritoSalvo[]>([])

  useEffect(() => {
    setLista(listarGabaritosSalvos())
  }, [])

  function handleDelete(id: string) {
    apagarGabarito(id)
    setLista(listarGabaritosSalvos())
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="flex flex-col gap-4 min-w-[300px]">
        <h2 className="font-display font-700 text-lg text-surface-100">Carregar Gabarito</h2>
        {lista.length === 0
          ? <p className="text-sm text-surface-500">Nenhum gabarito salvo.</p>
          : (
            <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {lista.map(g => (
                <li key={g.id} className="flex items-center gap-2 rounded-xl bg-surface-700/40 px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-surface-200 font-display font-600 truncate">{g.nome}</p>
                    <p className="text-xs text-surface-500">
                      {new Date(g.criadoEm).toLocaleDateString('pt-BR')} · {Object.keys(g.gabarito).length} questões
                    </p>
                  </div>
                  <button type="button" className="btn-ghost p-1.5" onClick={() => { onLoad(g); onClose() }}>
                    Carregar
                  </button>
                  <button type="button" className="btn-ghost p-1.5 text-danger-400 hover:text-danger-400" onClick={() => handleDelete(g.id)}>
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )
        }
        <div className="flex justify-end">
          <button type="button" className="btn-ghost" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </ModalOverlay>
  )
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 animate-slide-down">
        <button
          type="button"
          className="absolute top-3 right-3 btn-ghost p-1.5"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  )
}
