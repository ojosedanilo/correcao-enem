// ── Prova info ────────────────────────────────────────────────────────────────

export type Edicao = number
export type CorProva = string
export type LinguaEstrangeira = 'Inglês' | 'Espanhol'

export interface ProvaInfo {
  edicao: Edicao
  corDia1: CorProva
  corDia2: CorProva
  linguaEstrangeira: LinguaEstrangeira
}

// ── Gabarito ──────────────────────────────────────────────────────────────────

/** Questão → Alternativa (A–E | "Anulado" | "R" para redação) */
export type Gabarito = Record<string, string>

export interface ProvaEntry {
  cor_da_prova: string
  gabarito: Gabarito
}

export interface GabaritosDia {
  dia_1: ProvaEntry[]
  dia_2: ProvaEntry[]
}

export type GabaritosData = Record<number, GabaritosDia>

// ── Respostas do aluno ────────────────────────────────────────────────────────

/**
 * Dicionário das respostas do aluno.
 * Chave: número da questão (string), com sufixo "I" ou "E" para língua estrangeira (q.1–5).
 * Valor: alternativa marcada (A–E) ou string vazia se não respondida.
 *
 * Exemplos:
 *   { "1I": "B", "2I": "C", "6": "A", ..., "180": "D" }
 */
export type RespostasAluno = Record<string, string>

// ── Análise / Resultados ──────────────────────────────────────────────────────

export type AreaKey = 'linguagens' | 'humanas' | 'natureza' | 'matematica'

export interface AreaStats {
  total: number
  acertos: number
  erros: number
}

export interface ResultadoAnalise {
  geral: AreaStats
  linguagens: AreaStats
  humanas: AreaStats
  natureza: AreaStats
  matematica: AreaStats
}

export interface ErrosArea {
  questao: string
  respostaCorreta: string
  respostaAluno: string
}

export interface ResultadoDetalhado extends ResultadoAnalise {
  errosPorArea: Record<AreaKey, ErrosArea[]>
}

// ── TIR (score estimation) ────────────────────────────────────────────────────

export interface ScoreRange {
  min: number
  avg: number
  max: number
  /** 0–1 fraction of total questions */
  fraction: number
}

// ── Gabarito salvo ────────────────────────────────────────────────────────────

export interface GabaritoSalvo {
  id: string
  nome: string
  criadoEm: string
  provaInfo: ProvaInfo
  gabarito: RespostasAluno
}

// ── Area metadata ─────────────────────────────────────────────────────────────

export interface AreaMeta {
  key: AreaKey
  label: string
  labelCurto: string
  totalQuestoes: number
  min: number
  max: number
  colorClass: string
}

export const AREAS_META: AreaMeta[] = [
  {
    key: 'linguagens',
    label: 'Linguagens, Códigos e suas Tecnologias',
    labelCurto: 'Linguagens',
    totalQuestoes: 45,
    min: 1,
    max: 45,
    colorClass: 'area-card-linguagens',
  },
  {
    key: 'humanas',
    label: 'Ciências Humanas e suas Tecnologias',
    labelCurto: 'Ciências Humanas',
    totalQuestoes: 45,
    min: 46,
    max: 90,
    colorClass: 'area-card-humanas',
  },
  {
    key: 'natureza',
    label: 'Ciências da Natureza e suas Tecnologias',
    labelCurto: 'Ciências da Natureza',
    totalQuestoes: 45,
    min: 91,
    max: 135,
    colorClass: 'area-card-natureza',
  },
  {
    key: 'matematica',
    label: 'Matemática e suas Tecnologias',
    labelCurto: 'Matemática',
    totalQuestoes: 45,
    min: 136,
    max: 180,
    colorClass: 'area-card-matematica',
  },
]
