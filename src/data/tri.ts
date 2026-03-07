import triRaw from './tri.json'

export interface TRIEntrada {
  acertos: number
  min: number | '-'
  max: number | '-'
}

export type TRIArea = 'linguagens' | 'humanas' | 'natureza' | 'matematica'

export interface TRIAno {
  linguagens: TRIEntrada[]
  humanas:    TRIEntrada[]
  natureza:   TRIEntrada[]
  matematica: TRIEntrada[]
}

export type TRIData = Record<string, TRIAno>

export const tri: TRIData = triRaw as TRIData

export const TRI_ANOS_DISPONIVEIS = Object.keys(tri).sort().reverse() // ['2024','2023','2022']

/**
 * Retorna a faixa de notas TRI para um número de acertos em uma área e ano.
 * Retorna null se os dados não existirem ou forem "-".
 */
export function consultarTRI(
  ano: string,
  area: TRIArea,
  acertos: number,
): { min: number; max: number; media: number } | null {
  const dadosAno = tri[ano]
  if (!dadosAno) return null

  const entrada = dadosAno[area].find((e) => e.acertos === acertos)
  if (!entrada || entrada.min === '-' || entrada.max === '-') return null

  const min   = entrada.min as number
  const max   = entrada.max as number
  const media = Math.round(((min + max) / 2) * 10) / 10

  return { min, max, media }
}
