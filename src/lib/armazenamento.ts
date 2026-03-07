import type { GabaritoSalvo } from '../types'

const STORAGE_KEY = 'gabaritosSalvos'

/** Lista todos os gabaritos salvos (mais recente primeiro). */
export function listarGabaritosSalvos(): GabaritoSalvo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as GabaritoSalvo[]
  } catch {
    return []
  }
}

/** Adiciona um novo gabarito ao início da lista. */
export function adicionarGabarito(dados: Omit<GabaritoSalvo, 'id' | 'createdAt'>): GabaritoSalvo {
  const novo: GabaritoSalvo = {
    ...dados,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  const lista = listarGabaritosSalvos()
  lista.unshift(novo)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
  return novo
}

/** Remove um gabarito pelo id. */
export function apagarGabarito(id: string): void {
  const lista = listarGabaritosSalvos().filter((g) => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
}

/** Recupera um gabarito pelo id. */
export function buscarGabarito(id: string): GabaritoSalvo | null {
  return listarGabaritosSalvos().find((g) => g.id === id) ?? null
}
