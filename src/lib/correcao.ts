import type { ResultadoCorrecao, Respostas } from '../types'

const AREAS = [
  { nome: 'linguagens' as const, min: 1,   max: 45  },
  { nome: 'humanas'    as const, min: 46,  max: 90  },
  { nome: 'natureza'   as const, min: 91,  max: 135 },
  { nome: 'matematica' as const, min: 136, max: 180 },
]

function areaDaQuestao(n: number) {
  return AREAS.find((a) => n >= a.min && n <= a.max)
}

/**
 * Corrige as respostas do usuário comparando com o gabarito completo.
 * Retorna estatísticas gerais e por área, e lista de erros.
 */
export function corrigir(
  gabaritoCompleto: Record<string, string>,
  respostasUsuario: Respostas,
): ResultadoCorrecao {
  const dados: ResultadoCorrecao = {
    geral:      { total: 0, acertos: 0 },
    linguagens: { total: 0, acertos: 0 },
    humanas:    { total: 0, acertos: 0 },
    natureza:   { total: 0, acertos: 0 },
    matematica: { total: 0, acertos: 0 },
    erros: {
      linguagens: [],
      humanas:    [],
      natureza:   [],
      matematica: [],
    },
  }

  dados.geral.total = Object.keys(gabaritoCompleto).length

  for (const key of Object.keys(gabaritoCompleto)) {
    const numero = Number(key.replace('I', '').replace('E', ''))
    const area = areaDaQuestao(numero)
    if (!area) continue

    dados[area.nome].total++

    const certa   = gabaritoCompleto[key]
    const usuario = respostasUsuario[key]

    if (!usuario) continue

    if (usuario === certa) {
      dados.geral.acertos++
      dados[area.nome].acertos++
    } else {
      dados.erros[area.nome].push({ questao: key, certo: certa, usuario })
    }
  }

  return dados
}
