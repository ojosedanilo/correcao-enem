import { useState, useCallback } from 'react'
import type { ProvaInfo, RespostasAluno, ResultadoDetalhado } from '../types'

const EDICOES = [2025,2024,2023,2022,2021,2020,2019,2018,2017,2016,2015,2014,2013,2012,2011,2010,2009]

function defaultProvaInfo(): ProvaInfo {
  return {
    edicao: EDICOES[1], // 2024
    corDia1: 'Azul',
    corDia2: 'Azul',
    linguaEstrangeira: 'Inglês',
  }
}

export function useEnemState() {
  const [provaInfo, setProvaInfo] = useState<ProvaInfo>(defaultProvaInfo)

  /**
   * respostasAluno: dicionário pronto para sua lógica de cálculo.
   * Estrutura:
   *   {
   *     "1I": "B",   // questão de língua estrangeira (inglês)
   *     "6": "C",
   *     ...
   *     "180": "A"
   *   }
   * As chaves 1–5 recebem sufixo "I" ou "E" conforme a língua estrangeira selecionada.
   */
  const [respostasAluno, setRespostasAluno] = useState<RespostasAluno>({})

  /** Texto bruto do textarea (questao\nresposta\n...) */
  const [textoGabarito, setTextoGabarito] = useState('')

  /** Resultado gerado pela correção */
  const [resultado, setResultado] = useState<ResultadoDetalhado | null>(null)

  const updateProvaInfo = useCallback(<K extends keyof ProvaInfo>(key: K, value: ProvaInfo[K]) => {
    setProvaInfo(prev => ({ ...prev, [key]: value }))
  }, [])

  /**
   * Converte o texto do textarea em respostasAluno (dicionário).
   * Formato esperado:
   *   1
   *   A
   *   2
   *   B
   * Questões 1–5 recebem sufixo I/E conforme a língua selecionada.
   */
  const carregarTextoemRespostas = useCallback((texto: string, lingua: ProvaInfo['linguaEstrangeira']) => {
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

    setRespostasAluno(dict)
    return dict
  }, [])

  /**
   * Atualiza uma única resposta no dicionário.
   * Útil para inputs do gabarito manual.
   */
  const setResposta = useCallback((questao: string, valor: string) => {
    setRespostasAluno(prev => ({ ...prev, [questao]: valor }))
  }, [])

  const limparRespostas = useCallback(() => {
    setRespostasAluno({})
    setTextoGabarito('')
    setResultado(null)
  }, [])

  return {
    provaInfo,
    updateProvaInfo,
    respostasAluno,
    setRespostasAluno,
    setResposta,
    textoGabarito,
    setTextoGabarito,
    carregarTextoemRespostas,
    resultado,
    setResultado,
    limparRespostas,
    EDICOES,
  }
}
