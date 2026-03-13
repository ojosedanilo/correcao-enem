/*
Núcleo psicométrico: modelo 3PL + EAP

Os parâmetros do INEP já absorvem o fator de escala 1.702 (D=1),
portanto D_SCALE = 1.0.

Os pontos de quadratura de Gauss-Hermite (n=40) são pré-calculados
via numpy.polynomial.hermite.hermgauss(40) e embutidos como constante,
eliminando a dependência do pacote "special-functions".
Verificação: Σ pesos = 1, E[θ] ≈ 0, Var[θ] ≈ 1.
*/

const D_SCALE = 1.0;

// Nós de quadratura transformados para N(0,1): θ = √2 · x
const GH_THETAS: number[] = [
  -1.14533778415487326e+01, -1.04815605346742675e+01, -9.67355636693403120e+00,
  -8.94950454385555361e+00, -8.27894062365947647e+00, -7.64616376454146174e+00,
  -7.04173840645382931e+00, -6.45942337758376794e+00, -5.89480567537201861e+00,
  -5.34460544572008711e+00, -4.80628719209387345e+00, -4.27782615636274954e+00,
  -3.75755977616898607e+00, -3.24408873299987066e+00, -2.73620834046543138e+00,
  -2.23285921863487191e+00, -1.73309059063172155e+00, -1.23603200479915820e+00,
  -7.40870725285930565e-01, -2.46832896022724346e-01,  2.46832896022724346e-01,
   7.40870725285930565e-01,  1.23603200479915820e+00,  1.73309059063172155e+00,
   2.23285921863487191e+00,  2.73620834046543138e+00,  3.24408873299987066e+00,
   3.75755977616898607e+00,  4.27782615636274954e+00,  4.80628719209387345e+00,
   5.34460544572008711e+00,  5.89480567537201861e+00,  6.45942337758376794e+00,
   7.04173840645382931e+00,  7.64616376454146174e+00,  8.27894062365947647e+00,
   8.94950454385555361e+00,  9.67355636693403120e+00,  1.04815605346742675e+01,
   1.14533778415487326e+01,
];

// Pesos normalizados: w / √π  (soma = 1)
const GH_WEIGHTS: number[] = [
  1.46183987386939008e-29, 4.82046794020076781e-25, 1.44860943155158003e-21,
  1.12227520682711285e-18, 3.38985344324832551e-16, 4.96808852919776990e-14,
  4.03763858169521052e-12, 1.98911852602776850e-10, 6.32589718854887905e-09,
  1.36034242157487979e-07, 2.04889743608146805e-06, 2.22117714324758227e-05,
  1.77072928799240279e-04, 1.05587901690181417e-03, 4.77354488182336108e-03,
  1.65378441425694210e-02, 4.42745552022768274e-02, 9.21765791700608211e-02,
  1.49921111763570786e-01, 1.91059009661990353e-01, 1.91059009661990353e-01,
  1.49921111763570786e-01, 9.21765791700608211e-02, 4.42745552022768274e-02,
  1.65378441425694210e-02, 4.77354488182336108e-03, 1.05587901690181417e-03,
  1.77072928799240279e-04, 2.22117714324758227e-05, 2.04889743608146805e-06,
  1.36034242157487979e-07, 6.32589718854887905e-09, 1.98911852602776850e-10,
  4.03763858169521052e-12, 4.96808852919776990e-14, 3.38985344324832551e-16,
  1.12227520682711285e-18, 1.44860943155158003e-21, 4.82046794020076781e-25,
  1.46183987386939008e-29,
];

const NQ = GH_THETAS.length; // 40

/*
Função de resposta ao item — modelo 3PL.
P(acerto | θ) = c + (1 − c) / (1 + exp(−a·(θ − b)))
*/
function irf(theta: number, a: number, b: number, c: number): number {
  return c + (1 - c) / (1 + Math.exp(-D_SCALE * a * (theta - b)));
}

/*
Estimativa EAP (Expected A Posteriori) do traço latente θ.

acertos : vetor binário (1=acerto, 0=erro) — inclui acertos em anuladas
params  : lista de [a, b, c] para cada item (apenas itens válidos, mesma ordem)
*/
export function estimarTheta(
  acertos: number[],
  params: [number, number, number][],
): number {
  let numerador = 0;
  let denominador = 0;

  for (let q = 0; q < NQ; q++) {
    const theta = GH_THETAS[q];
    let logL = 0;

    for (let i = 0; i < acertos.length; i++) {
      const u = acertos[i];
      const [a, b, c] = params[i];

      let p = irf(theta, a, b, c);

      // Clamp numérico para evitar log(0)
      if (p < 1e-10) p = 1e-10;
      if (p > 1 - 1e-10) p = 1 - 1e-10;

      logL += u * Math.log(p) + (1 - u) * Math.log(1 - p);
    }

    const L = Math.exp(logL);
    const peso = L * GH_WEIGHTS[q];

    numerador += theta * peso;
    denominador += peso;
  }

  if (denominador === 0) return 0;
  return numerador / denominador;
}
