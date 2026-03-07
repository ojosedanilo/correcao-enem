import type { ProvaInfo, Respostas } from '../types'

/**
 * Localiza uma prova pela cor (case-insensitive) e retorna seu gabarito.
 */
export function pegarGabarito(
  provas: ProvaInfo[],
  corDesejada: string,
): Record<string | number, string> | null {
  const prova = provas.find(
    (p) => p.corDaProva.toLowerCase() === corDesejada.toLowerCase(),
  )
  return prova ? prova.gabarito : null
}

/**
 * Gera o gabarito final combinando Dia 1 e Dia 2.
 * Remove questões anuladas, redação e língua estrangeira não selecionada.
 */
export function gerarGabaritoCompleto(
  gabaritoDia1: Record<string | number, string> | null,
  gabaritoDia2: Record<string | number, string> | null,
  sufixoIdioma: 'I' | 'E',
): Record<string, string> {
  const merged = { ...(gabaritoDia1 ?? {}), ...(gabaritoDia2 ?? {}) }

  return Object.fromEntries(
    Object.entries(merged).filter(([key, value]) => {
      if (value === 'Anulado' || key === 'Red') return false
      if (key.endsWith('I') && sufixoIdioma !== 'I') return false
      if (key.endsWith('E') && sufixoIdioma !== 'E') return false
      return true
    }),
  )
}

/**
 * Aplica o sufixo de idioma (I/E) para as questões 1–5 das respostas.
 */
export function aplicarSufixoIdioma(
  respostas: Respostas,
  sufixo: 'I' | 'E',
): Respostas {
  const resultado: Respostas = { ...respostas }
  for (let i = 1; i <= 5; i++) {
    const key = String(i)
    if (!Object.prototype.hasOwnProperty.call(resultado, key)) continue
    resultado[`${i}${sufixo}`] = resultado[key]
    delete resultado[key]
  }
  return resultado
}
