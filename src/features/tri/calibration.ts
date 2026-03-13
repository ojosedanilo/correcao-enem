/*
Calibração e conversão θ → nota ENEM.

A conversão usa interpolação linear local sobre uma curva empírica binada
(n_bins_pop bins), capturando a leve não-linearidade da equalização do INEP.
Fallback automático para a regressão linear A·θ + B quando θ cai fora do
intervalo coberto pelos bins.
*/

import type { Calibration } from './types';

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

/*
Converte θ para nota ENEM usando interpolação binada.
Fallback linear (A·θ + B) quando θ está fora do range dos bins.
*/
export function thetaParaNota(theta: number, calib: Calibration): number {
  const { t_bins, n_bins, A, B } = calib;

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
