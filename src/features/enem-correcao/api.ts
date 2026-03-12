// Public API for the enem-correcao feature
export { EnemCorrecaoFeature } from './index'
export type * from './types'
export { gabaritos } from './data/gabaritos'
export { coresCadernos } from './data/coresCadernos'
export { pegarGabarito, gerarGabaritoCompleto, textoParaRespostas, respostasParaTexto } from './utils/gabarito'
export { listarGabaritosSalvos, adicionarGabarito, apagarGabarito } from './utils/storage'
