/*
Corretor TRI — orquestrador principal.

Recebe as respostas do aluno (no mesmo formato usado pela correção simples:
chaves = número global da questão, possivelmente com sufixo "I" ou "E" para
as 5 questões de língua estrangeira de LC) e devolve a nota TRI por área.

Fluxo por área:
  1. Carrega params_{ano}.json e exams/{ano}.json em paralelo
  2. Encontra o CO_PROVA correto para (area, cor) comparando o gabarito de
     exams.json contra o gabarito já resolvido pela correção simples
     — o único CO_PROVA com 45/45 correspondências é o da aplicação correta
  3. Para cada item válido do CO_PROVA, decide acerto/erro comparando a
     resposta do aluno com o gabarito (itens anulados = acerto garantido,
     itens abandonados = ignorados)
  4. Estima θ via EAP com quadratura de Gauss-Hermite (n=40)
  5. Converte θ → nota usando a curva binada de calibrations/{ano}/

Fallback: se qualquer etapa falhar (dados ausentes, fetch com erro, etc.)
a função retorna null para aquela área — o chamador usa a correção simples.
*/

import { estimarTheta } from './irt';
import { thetaParaNota } from './calibration';
import { loadExams, loadParams, loadCalib } from './loader';

// Mapeamento área TRI → AreaKey da feature (para sincronizar com o estado)
export const AREA_TRI_MAP: Record<string, string> = {
  LC: 'linguagens',
  CH: 'humanas',
  CN: 'natureza',
  MT: 'matematica',
};

// Dias da prova por área TRI
export const AREA_DIA: Record<string, 1 | 2> = {
  LC: 1,
  CH: 1,
  CN: 2,
  MT: 2,
};

// Cor do caderno em uppercase (formato dos params) a partir da cor exibida na UI
function normalizarCor(cor: string): string {
  return cor.toUpperCase();
}

/*
Encontra o CO_PROVA correto para (area, cor) dentro de um ano.

Há múltiplas aplicações por ano — cada uma com um CO_PROVA distinto,
porém o mesmo par (área, cor). Identificamos a aplicação correta comparando
o gabarito de cada CO_PROVA candidato (em exams.json) com o gabarito
que o aluno usou (repassado pela correção simples). O candidato com maior
número de correspondências é a aplicação correta (normalmente 45/45).
*/
function encontrarCoProva(
  provas: Record<string, { cor: string; gabarito: Record<string, string> }>,
  corAlvo: string,
  gabaritoAluno: Record<string, string>, // gabarito correto já resolvido (global_num → letra)
): string | null {
  const corNorm = normalizarCor(corAlvo);
  let melhorCo: string | null = null;
  let melhorScore = -1;

  for (const [co, prova] of Object.entries(provas)) {
    if (normalizarCor(prova.cor) !== corNorm) continue;

    // Conta quantas questões do gabarito desta prova batem com o gabarito alvo
    let matches = 0;
    for (const [pos, gab] of Object.entries(prova.gabarito)) {
      if (gabaritoAluno[pos] === gab) matches++;
    }

    if (matches > melhorScore) {
      melhorScore = matches;
      melhorCo = co;
    }
  }

  return melhorCo;
}

/*
Resultado TRI de uma área.
*/
export interface ResultadoTRI {
  area: string;        // "LC" | "CH" | "CN" | "MT"
  co_prova: string;
  theta: number;
  nota: number;
  n_acertos: number;   // acertos em itens válidos + anulados
  n_anulados: number;
  n_validos: number;
}

/*
Calcula a nota TRI de uma única área.

respostasAluno : { "1I": "B", "6": "C", "91": "A", ... } — formato da feature
gabaritoArea   : gabarito correto para a área (já filtrado pelo idioma)
                 Ex. para MT: { "136": "A", "137": "C", ... }
area           : "LC" | "CH" | "CN" | "MT"
cor            : cor do caderno conforme selecionado na UI
ano            : edição do ENEM
*/
export async function calcularNotaTRI(
  respostasAluno: Record<string, string>,
  gabaritoArea: Record<string, string>, // gabarito correto desta área (global_num → letra)
  area: string,
  cor: string,
  ano: number,
): Promise<ResultadoTRI | null> {
  try {
    // Carrega exams, params e calibração em paralelo
    const [exams, params, calib] = await Promise.all([
      loadExams(ano),
      loadParams(ano),
      loadCalib(ano, area),
    ]);

    const areaExams = exams.areas[area as keyof typeof exams.areas];
    if (!areaExams) return null;

    // Encontra o CO_PROVA cujo gabarito bate com o gabarito da aplicação correta
    const coProva = encontrarCoProva(areaExams.provas, cor, gabaritoArea);
    if (!coProva) return null;

    const provaParams = params.provas[coProva];
    if (!provaParams) return null;

    // Monta os vetores de acertos e parâmetros — apenas itens não-abandonados
    const acertos: number[] = [];
    const triParams: [number, number, number][] = [];
    let nAnulados = 0;
    let nValidos = 0;

    // Para LC, infere o idioma escolhido pelo aluno pelas chaves de respostasAluno.
    // Questões 1–5 têm dois itens no params (tp_lingua=0 inglês, tp_lingua=1 espanhol);
    // apenas o idioma escolhido é processado — o outro é ignorado para evitar duplicação.
    const linguaEscolhida: number | null =
      area === 'LC'
        ? Object.keys(respostasAluno).some(k => /^[1-5]I$/.test(k)) ? 0 : 1
        : null;

    for (const item of provaParams.itens) {
      if (item.status === 'abandonado') continue;

      // LC: pula o item do idioma não escolhido pelo aluno
      if (area === 'LC' && item.tp_lingua !== null && item.tp_lingua !== linguaEscolhida) {
        continue;
      }

      const posStr = String(item.co_posicao);

      if (item.status === 'anulado') {
        // Anulado: acerto garantido, não entra no EAP
        nAnulados++;
        continue;
      }

      // Item válido
      nValidos++;
      const respostaAluno = resolverChaveResposta(posStr, respostasAluno, area, areaExams.tem_lingua);
      const gabarito = item.tx_gabarito;
      const acertou = respostaAluno !== '' && respostaAluno === gabarito ? 1 : 0;

      acertos.push(acertou);
      triParams.push([item.a!, item.b!, item.c!]);
    }

    if (triParams.length === 0) return null;

    // EAP: estima θ
    const theta = estimarTheta(acertos, triParams);

    // Converte θ → nota
    const nota = thetaParaNota(theta, calib);

    return {
      area,
      co_prova: coProva,
      theta,
      nota,
      n_acertos: acertos.filter(a => a === 1).length + nAnulados,
      n_anulados: nAnulados,
      n_validos: nValidos,
    };
  } catch {
    // Dados ausentes ou erro de rede → fallback para correção simples
    return null;
  }
}

/*
Resolve a chave de resposta do aluno para um co_posicao.

Para LC (tem_lingua=true), as questões 1–5 têm chaves "1I"/"1E" no dict do aluno.
Para as demais áreas, a chave é simplesmente o número da questão como string.
*/
function resolverChaveResposta(
  pos: string,
  respostasAluno: Record<string, string>,
  area: string,
  temLingua: boolean,
): string {
  if (area === 'LC' && temLingua) {
    const n = Number(pos);
    if (n >= 1 && n <= 5) {
      // Tenta "I" e "E" — a chave com resposta é o idioma escolhido pelo aluno
      return respostasAluno[`${n}I`] ?? respostasAluno[`${n}E`] ?? '';
    }
  }
  return respostasAluno[pos] ?? '';
}

/*
Calcula notas TRI para todas as áreas em paralelo.

Retorna um mapa AreaKey → ResultadoTRI | null.
null significa que os dados desta área não estavam disponíveis.
*/
export async function calcularTodasNotasTRI(
  respostasAluno: Record<string, string>,
  gabaritoCompleto: Record<string, string>, // gabarito correto completo (global_num → letra)
  corDia1: string,
  corDia2: string,
  ano: number,
): Promise<Record<string, ResultadoTRI | null>> {
  const areas = ['LC', 'CH', 'CN', 'MT'];

  // Extrai o gabarito correto por área a partir do gabarito completo
  const gabaritoArea = (area: string): Record<string, string> => {
    const ranges: Record<string, { min: number; max: number }> = {
      LC: { min: 1,   max: 45  },
      CH: { min: 46,  max: 90  },
      CN: { min: 91,  max: 135 },
      MT: { min: 136, max: 180 },
    };
    const { min, max } = ranges[area];
    const result: Record<string, string> = {};
    for (const [key, val] of Object.entries(gabaritoCompleto)) {
      // Remove sufixo I/E para obter o número base
      const n = Number(key.replace(/[IE]$/, ''));
      if (!isNaN(n) && n >= min && n <= max) {
        result[key] = val;
      }
    }
    return result;
  };

  const resultados = await Promise.all(
    areas.map(area => {
      const cor = AREA_DIA[area] === 1 ? corDia1 : corDia2;
      return calcularNotaTRI(respostasAluno, gabaritoArea(area), area, cor, ano);
    })
  );

  return Object.fromEntries(
    areas.map((area, i) => [AREA_TRI_MAP[area], resultados[i]])
  );
}
