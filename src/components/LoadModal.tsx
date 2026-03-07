import { useEffect, useRef, useState } from 'react'
import type { GabaritoSalvo } from '../types'
import { apagarGabarito } from '../lib/armazenamento'

interface LoadModalProps {
  open: boolean
  gabaritos: GabaritoSalvo[]
  onCarregar: (gabarito: GabaritoSalvo) => void
  onClose: () => void
  onListaChange: () => void
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function LoadModal({ open, gabaritos, onCarregar, onClose, onListaChange }: LoadModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) { el.showModal(); setSelected(null) }
    else el.close()
  }, [open])

  function handleMouseDown(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose()
  }

  function handleApagar(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Tem certeza que deseja apagar este gabarito?')) return
    apagarGabarito(id)
    onListaChange()
    if (selected === id) setSelected(null)
  }

  const gabSelecionado = gabaritos.find((g) => g.id === selected)

  return (
    <dialog
      ref={dialogRef}
      onMouseDown={handleMouseDown}
      onCancel={onClose}
      className="bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-sm m-auto p-0 max-w-lg w-full rounded-2xl shadow-2xl"
    >
      <div className="bg-surface-800 border border-surface-600 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700 shrink-0">
          <h2 className="font-display font-700 text-base text-slate-100">Carregar Gabarito</h2>
          <button className="btn-ghost" onClick={onClose} aria-label="Fechar">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {gabaritos.length === 0 ? (
            <div className="text-center py-10">
              <svg className="w-10 h-10 mx-auto mb-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm text-slate-500">Nenhum gabarito salvo ainda.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {gabaritos.map((g) => (
                <li key={g.id}>
                  <button
                    className={`w-full text-left rounded-xl border p-3 transition-all duration-100 group relative
                      ${selected === g.id
                        ? 'border-brand-600 bg-brand-900/30'
                        : 'border-surface-600 bg-surface-700/40 hover:border-surface-500 hover:bg-surface-700/70'
                      }`}
                    onClick={() => setSelected(g.id === selected ? null : g.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-600 text-sm text-slate-200">ENEM {g.edicaoProva}</span>
                          <span className="text-xs text-slate-500 bg-surface-600 px-1.5 py-0.5 rounded">{g.corProvaDia1} / {g.corProvaDia2}</span>
                          <span className="text-xs text-slate-500">{g.linguaEstrangeira}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{formatDate(g.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {selected === g.id && (
                          <svg className="w-4 h-4 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <button
                          onClick={(e) => handleApagar(g.id, e)}
                          className="btn-danger opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Apagar gabarito"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-surface-700 flex justify-end gap-2 shrink-0">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button
            className="btn-primary"
            disabled={!gabSelecionado}
            onClick={() => { if (gabSelecionado) { onCarregar(gabSelecionado); onClose() } }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Carregar
          </button>
        </div>
      </div>
    </dialog>
  )
}
