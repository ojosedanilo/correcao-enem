/*
Tipos do módulo TRI.

Os campos de JSON mantêm os nomes originais em português/snake_case
(co_posicao, tx_gabarito, etc.) para corresponder exatamente às chaves
dos arquivos gerados pelo projeto Python (enem_tri).
*/

// ── Calibração ────────────────────────────────────────────────────────────────

export interface Calibration {
  t_bins: number[];
  n_bins: number[];
  A: number;
  B: number;
  r2: number;
  n: number;
  n_bins_pop: number;
  erro_lin: number;
  erro_interp: number;
}

// ── Provas (exams/{ano}.json) ─────────────────────────────────────────────────

export interface ProvaExams {
  cor: string;
  gabarito: Record<string, string>; // co_posicao (string) → letra
}

export interface AreaExams {
  pos_min: number;
  n_raw: number;
  tem_lingua: boolean;
  provas: Record<string, ProvaExams>; // co_prova (string) → ProvaExams
}

export interface AnoExams {
  ano: number;
  areas: {
    CN: AreaExams;
    CH: AreaExams;
    LC: AreaExams;
    MT: AreaExams;
  };
}

// ── Parâmetros (parameters/params_{ano}.json) ─────────────────────────────────

export type ItemStatus = 'valido' | 'anulado' | 'abandonado';

export interface ItemParam {
  co_posicao: number;   // número global da questão (ex: 136–180 para MT)
  tx_gabarito: string;  // gabarito correto ("*" se anulado)
  status: ItemStatus;
  tp_lingua: number | null; // 0=inglês, 1=espanhol — só LC; null caso contrário
  a: number | null;
  b: number | null;
  c: number | null;
}

export interface ProvaParams {
  sg_area: string;
  tx_cor: string;
  pos_min: number;
  n_itens: number;
  n_validos: number;
  n_anulados: number;
  n_abandonados: number;
  itens: ItemParam[];
}

export interface AnoParams {
  ano: number;
  provas: Record<string, ProvaParams>; // co_prova (string) → ProvaParams
}
