import type { GabaritosData, Gabarito, RespostasAluno, ProvaInfo } from '../types'

/**
 * Localiza a prova pela cor e retorna seu gabarito.
 */
export function pegarGabarito(
  provas: GabaritosData[number]['dia_1'],
  corDesejada: string
): Gabarito | null {
  const prova = provas.find(
    p => p.cor_da_prova.toLowerCase() === corDesejada.toLowerCase()
  )
  return prova?.gabarito ?? null
}

/**
 * Gera o gabarito final combinando Dia 1 e Dia 2.
 * Remove questões anuladas, redação e o idioma não selecionado.
 */
export function gerarGabaritoCompleto(
  gabaritoDia1: Gabarito,
  gabaritoDia2: Gabarito,
  sufixoIdioma: 'I' | 'E'
): Gabarito {
  return Object.fromEntries(
    Object.entries({ ...gabaritoDia1, ...gabaritoDia2 }).filter(([key, value]) => {
      if (value === 'Anulado' || key === 'Red') return false
      if (key.endsWith('I') && sufixoIdioma !== 'I') return false
      if (key.endsWith('E') && sufixoIdioma !== 'E') return false
      return true
    })
  )
}

/**
 * Converte o texto do textarea em um dicionário de respostas do aluno.
 * Formato: questao\nresposta\nquestao\nresposta\n...
 * Questões 1–5 recebem sufixo I/E conforme a língua selecionada.
 */
export function textoParaRespostas(
  texto: string,
  lingua: ProvaInfo['linguaEstrangeira']
): RespostasAluno {
  const sufixo = lingua === 'Inglês' ? 'I' : 'E'
  const linhas = texto.trim().split('\n')
  const dict: RespostasAluno = {}

  for (let i = 0; i < linhas.length - 1; i += 2) {
    const q = linhas[i].trim()
    const r = linhas[i + 1]?.trim().toUpperCase() ?? ''
    if (!q || !r) continue

    const n = Number(q)
    if (!isNaN(n) && n >= 1 && n <= 5) {
      dict[`${n}${sufixo}`] = r
    } else {
      dict[q] = r
    }
  }

  return dict
}

/**
 * Converte o dicionário de respostas para texto do textarea.
 */
export function respostasParaTexto(respostas: RespostasAluno): string {
  return Object.entries(respostas)
    .map(([q, r]) => `${q}\n${r}`)
    .join('\n')
}
