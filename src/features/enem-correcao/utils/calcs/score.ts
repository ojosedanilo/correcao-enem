/*
Calibração e conversão θ → nota ENEM.

A conversão usa interpolação linear local sobre uma curva empírica binada
(N_BINS bins), capturando a leve não-linearidade da equalização do INEP.
Fallback automático para a regressão linear A·θ + B quando a calibração
binada não estiver disponível.
*/

export const N_BINS = 500;

type ConstantesLineares = [number, number];

type ConstantesBinadas = {
  t_bins: number[];
  n_bins: number[];
  A: number;
  B: number;
};

type Constantes = Record<string, ConstantesLineares | ConstantesBinadas>;

function searchSorted(arr: number[], x: number): number {
  let lo = 0;
  let hi = arr.length;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid;
  }

  return lo;
}

/**
 * Converte θ para nota ENEM usando interpolação binada ou regressão linear.
 */
export function thetaParaNota(
  theta: number,
  area: string,
  constantes: Constantes,
): number {
  const val = constantes[area.toUpperCase()];

  // fallback linear
  if (!("t_bins" in val)) {
    const [A, B] = val;
    return A * theta + B;
  }

  const { t_bins, n_bins, A, B } = val;

  if (theta <= t_bins[0] || theta >= t_bins[t_bins.length - 1]) {
    return A * theta + B;
  }

  let i = searchSorted(t_bins, theta);

  i = Math.max(1, Math.min(i, t_bins.length - 1));

  const t0 = t_bins[i - 1];
  const t1 = t_bins[i];

  const n0 = n_bins[i - 1];
  const n1 = n_bins[i];

  const frac = t1 !== t0 ? (theta - t0) / (t1 - t0) : 0.5;

  return n0 + frac * (n1 - n0);
}
