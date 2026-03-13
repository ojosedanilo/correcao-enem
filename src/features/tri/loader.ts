import type { Calibration, AnoExams, AnoParams } from './types';

// Cache em memória — evita refetch durante a sessão
const cache = new Map<string, unknown>();

async function loadJSON<T>(path: string): Promise<T> {
  if (cache.has(path)) return cache.get(path) as T;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Falha ao carregar ${path}: ${res.status}`);
  const data = await res.json();
  cache.set(path, data);
  return data as T;
}

// Calibração θ → nota para uma área específica
export const loadCalib = (ano: number, area: string): Promise<Calibration> =>
  loadJSON<Calibration>(`/data/calibrations/${ano}/${ano}_${area.toUpperCase()}.json`);

// Gabaritos e metadados de provas (exams/{ano}.json)
export const loadExams = (ano: number): Promise<AnoExams> =>
  loadJSON<AnoExams>(`/data/exams/${ano}.json`);

// Parâmetros TRI de todos os itens do ano (parameters/params_{ano}.json)
export const loadParams = (ano: number): Promise<AnoParams> =>
  loadJSON<AnoParams>(`/data/parameters/params_${ano}.json`);

// Pré-carrega calibrações das 4 áreas em paralelo
export async function loadAllCalibs(ano: number): Promise<Record<string, Calibration>> {
  const areas = ['LC', 'CH', 'CN', 'MT'];
  const results = await Promise.all(areas.map(a => loadCalib(ano, a)));
  return Object.fromEntries(areas.map((a, i) => [a, results[i]]));
}
