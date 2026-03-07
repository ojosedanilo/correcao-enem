import { useEffect, useRef } from 'react'
import type { GabaritoSalvo } from '../types'

interface SaveModalProps {
  open: boolean
  dadosPrevia: Omit<GabaritoSalvo, 'id' | 'createdAt'>
  onSalvar: () => void
  onClose: () => void
}

export default function SaveModal({ open, dadosPrevia, onSalvar, onClose }: SaveModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) el.showModal()
    else el.close()
  }, [open])

  // Close on backdrop click
  function handleMouseDown(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onMouseDown={handleMouseDown}
      onCancel={onClose}
      className="bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-sm m-auto p-0 max-w-md w-full rounded-2xl shadow-2xl"
    >
      <div className="bg-surface-800 border border-surface-600 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700">
          <h2 className="font-display font-700 text-base text-slate-100">Salvar Gabarito</h2>
          <button className="btn-ghost" onClick={onClose} aria-label="Fechar">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-surface-700/40 rounded-xl p-3 border border-surface-600/50">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Edição</p>
              <p className="text-slate-200 font-medium">{dadosPrevia.edicaoProva}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Língua Estrangeira</p>
              <p className="text-slate-200 font-medium">{dadosPrevia.linguaEstrangeira}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Cor 1º Dia</p>
              <p className="text-slate-200 font-medium">{dadosPrevia.corProvaDia1}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Cor 2º Dia</p>
              <p className="text-slate-200 font-medium">{dadosPrevia.corProvaDia2}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-500 mb-1.5">Gabarito (prévia)</p>
            <textarea
              readOnly
              className="w-full bg-surface-700 border border-surface-500 rounded-xl px-3 py-2
                         text-xs font-mono text-slate-400 resize-none h-28
                         focus:outline-none cursor-default"
              value={dadosPrevia.gabaritoTexto}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-surface-700 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={() => { onSalvar(); onClose() }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Salvar
          </button>
        </div>
      </div>
    </dialog>
  )
}
