import { hermiteGauss } from "special-functions";

const D_SCALE = 1.0;

export function irf(theta: number, a: number, b: number, c: number): number {
  return c + (1 - c) / (1 + Math.exp(-D_SCALE * a * (theta - b)));
}

export function pontosQuadratura(n: number = 40): [number[], number[]] {
  const [x, w] = hermiteGauss(n);

  const sqrt2 = Math.sqrt(2);
  const sqrtPi = Math.sqrt(Math.PI);

  const thetas = x.map((v: number) => sqrt2 * v);
  const pesos = w.map((v: number) => v / sqrtPi);

  return [thetas, pesos];
}

export function estimarTheta(
  acertos: number[],
  params: [number, number, number][],
  n_quadratura: number = 40,
): number {
  const [thetas_q, pesos_q] = pontosQuadratura(n_quadratura);

  const log_L = new Array(n_quadratura).fill(0);

  for (let i = 0; i < acertos.length; i++) {
    const u = acertos[i];
    const [a, b, c] = params[i];

    for (let j = 0; j < n_quadratura; j++) {
      let p = irf(thetas_q[j], a, b, c);

      if (p < 1e-10) p = 1e-10;
      if (p > 1 - 1e-10) p = 1 - 1e-10;

      log_L[j] += u * Math.log(p) + (1 - u) * Math.log(1 - p);
    }
  }

  const maxLog = Math.max(...log_L);

  let numerador = 0;
  let denominador = 0;

  for (let j = 0; j < n_quadratura; j++) {
    const L = Math.exp(log_L[j] - maxLog);
    const peso = L * pesos_q[j];

    numerador += thetas_q[j] * peso;
    denominador += peso;
  }

  return numerador / denominador;
}
