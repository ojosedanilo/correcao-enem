export type Alternativa = 'A' | 'B' | 'C' | 'D' | 'E'

export interface ProvaInfo {
  corDaProva: string
  gabarito: Record<string | number, string>
}

export interface GabaritoEdicao {
  dia_1: ProvaInfo[]
  dia_2: ProvaInfo[]
}

export type GabaritosData = Record<number, GabaritoEdicao>

export interface CoresCadernosEdicao {
  dia_1: string[]
  dia_2: string[]
}

export type CoresCadernosData = Record<number, CoresCadernosEdicao>

export interface DadosAnalise {
  total: number
  acertos: number
}

export interface ResultadoCorrecao {
  geral: DadosAnalise
  linguagens: DadosAnalise
  humanas: DadosAnalise
  natureza: DadosAnalise
  matematica: DadosAnalise
  erros: {
    linguagens: ErroQuestao[]
    humanas: ErroQuestao[]
    natureza: ErroQuestao[]
    matematica: ErroQuestao[]
  }
}

export interface ErroQuestao {
  questao: string
  certo: string
  usuario: string
}

/** Gabarito salvo no localStorage */
export interface GabaritoSalvo {
  id: string
  createdAt: string
  edicaoProva: string
  corProvaDia1: string
  corProvaDia2: string
  linguaEstrangeira: string
  gabaritoTexto: string
}

/** Estado das respostas: questão → alternativa */
export type Respostas = Record<string, string>
