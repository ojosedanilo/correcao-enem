import type { GabaritoSalvo } from '../types'

const STORAGE_KEY = 'enem-gabaritos-salvos'

export function listarGabaritosSalvos(): GabaritoSalvo[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as GabaritoSalvo[]
  } catch {
    return []
  }
}

export function adicionarGabarito(dados: Omit<GabaritoSalvo, 'id' | 'criadoEm'>): GabaritoSalvo {
  const novo: GabaritoSalvo = {
    ...dados,
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
  }
  const lista = listarGabaritosSalvos()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([novo, ...lista]))
  return novo
}

export function apagarGabarito(id: string): void {
  const lista = listarGabaritosSalvos().filter(g => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
}
