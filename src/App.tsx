import { useState, useCallback } from 'react'
import Header from './components/Header'
import ProvaInfoSection from './components/ProvaInfoSection'
import TextoGabaritoSection from './components/TextoGabaritoSection'
import GabaritoFormSection from './components/GabaritoFormSection'
import AnalisesSection from './components/AnalisesSection'
import TRISection from './components/TRISection'
import SaveModal from './components/SaveModal'
import LoadModal from './components/LoadModal'
import { gabaritos } from './data/gabaritos'
import { coresCadernos } from './data/coresCadernos'
import { pegarGabarito, gerarGabaritoCompleto, aplicarSufixoIdioma } from './lib/montagemGabarito'
import { corrigir } from './lib/correcao'
import { adicionarGabarito, listarGabaritosSalvos } from './lib/armazenamento'
import type { Respostas, ResultadoCorrecao, GabaritoSalvo } from './types'

// ── Helpers ───────────────────────────────────────────────────
function textoParaRespostas(texto: string): Respostas {
  const linhas = texto.split('\n').map((l) => l.trim()).filter(Boolean)
  const respostas: Respostas = {}
  for (let i = 0; i < linhas.length - 1; i += 2) {
    const q = linhas[i]
    const alt = linhas[i + 1]?.toUpperCase()
    if (q && alt && ['A', 'B', 'C', 'D', 'E'].includes(alt)) {
      respostas[q] = alt
    }
  }
  return respostas
}

function respostasParaTexto(respostas: Respostas): string {
  return Object.entries(respostas)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}\n${v}`)
    .join('\n')
}

// ── Component ─────────────────────────────────────────────────
export default function App() {
  // Prova info
  const [edicao, setEdicao]       = useState('2025')
  const [corDia1, setCorDia1]     = useState(() => coresCadernos[2025].dia_1[0])
  const [corDia2, setCorDia2]     = useState(() => coresCadernos[2025].dia_2[0])
  const [lingua, setLingua]       = useState('Inglês')

  // Respostas
  const [respostas, setRespostas] = useState<Respostas>({})
  const [textoGab, setTextoGab]   = useState('')

  // Resultado
  const [resultado, setResultado] = useState<ResultadoCorrecao | null>(null)
  const [corrigido, setCorrigido] = useState(false)

  // Modals
  const [showSave, setShowSave] = useState(false)
  const [showLoad, setShowLoad] = useState(false)
  const [gabarsSalvos, setGabarsSalvos] = useState<GabaritoSalvo[]>([])

  // ── Handlers ──────────────────────────────────────────────
  const handleResposta = useCallback((questao: string, alternativa: string) => {
    setRespostas((prev) => {
      const next = { ...prev }
      if (alternativa) next[questao] = alternativa
      else delete next[questao]
      setTextoGab(respostasParaTexto(next))
      return next
    })
    setCorrigido(false)
    setResultado(null)
  }, [])

  function handleTextoChange(v: string) {
    setTextoGab(v)
  }

  function handleCarregarTexto() {
    const resp = textoParaRespostas(textoGab)
    setRespostas(resp)
    setCorrigido(false)
    setResultado(null)
  }

  function handleCorrigir() {
    const edNum = Number(edicao)
    const gabEdicao = gabaritos[edNum]

    if (!gabEdicao) {
      alert(`Gabarito de ${edicao} ainda não disponível nesta versão.`)
      return
    }

    const sufixo: 'I' | 'E' = lingua === 'Inglês' ? 'I' : 'E'
    const g1 = pegarGabarito(gabEdicao.dia_1, corDia1)
    const g2 = pegarGabarito(gabEdicao.dia_2, corDia2)
    const gabCompleto = gerarGabaritoCompleto(g1, g2, sufixo)
    const respAjustadas = aplicarSufixoIdioma(respostas, sufixo)

    const res = corrigir(gabCompleto, respAjustadas)
    setResultado(res)
    setCorrigido(true)

    // Scroll suave para análises
    setTimeout(() => {
      document.getElementById('section-analises')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // ── Save ──────────────────────────────────────────────────
  function handleOpenSave() {
    setShowSave(true)
  }

  function handleSalvar() {
    adicionarGabarito({
      edicaoProva:     edicao,
      corProvaDia1:    corDia1,
      corProvaDia2:    corDia2,
      linguaEstrangeira: lingua,
      gabaritoTexto:   textoGab,
    })
  }

  // ── Load ──────────────────────────────────────────────────
  function handleOpenLoad() {
    setGabarsSalvos(listarGabaritosSalvos())
    setShowLoad(true)
  }

  function handleCarregarGabarito(g: GabaritoSalvo) {
    setEdicao(g.edicaoProva)
    setCorDia1(g.corProvaDia1)
    setCorDia2(g.corProvaDia2)
    setLingua(g.linguaEstrangeira)
    setTextoGab(g.gabaritoTexto)
    const resp = textoParaRespostas(g.gabaritoTexto)
    setRespostas(resp)
    setResultado(null)
    setCorrigido(false)
  }

  function handleListaChange() {
    setGabarsSalvos(listarGabaritosSalvos())
  }

  const dadosModalSave = {
    edicaoProva:     edicao,
    corProvaDia1:    corDia1,
    corProvaDia2:    corDia2,
    linguaEstrangeira: lingua,
    gabaritoTexto:   textoGab,
  }

  const gabDisponivelParaEdicao = !!gabaritos[Number(edicao)]

  return (
    <div className="dark min-h-screen bg-surface-900">
      <Header onSave={handleOpenSave} onLoad={handleOpenLoad} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        {/* Badge de edição sem gabarito */}
        {!gabDisponivelParaEdicao && (
          <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl px-4 py-3 text-sm text-amber-300 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            O gabarito de <strong>{edicao}</strong> ainda não está disponível nesta versão. Você pode preencher suas respostas e comparar manualmente.
          </div>
        )}

        <ProvaInfoSection
          edicao={edicao}
          corDia1={corDia1}
          corDia2={corDia2}
          lingua={lingua}
          onEdicaoChange={setEdicao}
          onCorDia1Change={setCorDia1}
          onCorDia2Change={setCorDia2}
          onLinguaChange={setLingua}
        />

        <TextoGabaritoSection
          texto={textoGab}
          onTextoChange={handleTextoChange}
          onCarregar={handleCarregarTexto}
          respostas={respostas}
          onCorrigir={handleCorrigir}
        />

        <GabaritoFormSection
          respostas={respostas}
          onResposta={handleResposta}
          onCorrigir={handleCorrigir}
          erros={resultado?.erros}
          corrigido={corrigido}
        />

        <div id="section-analises" className="flex flex-col gap-4">
          <AnalisesSection resultado={resultado} />
          {resultado && (
            <TRISection resultado={resultado} edicao={edicao} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-700 mt-8 py-5 text-center text-xs text-slate-600">
        Correção ENEM — dados dos gabaritos oficiais do INEP
      </footer>

      {/* Modals */}
      <SaveModal
        open={showSave}
        dadosPrevia={dadosModalSave}
        onSalvar={handleSalvar}
        onClose={() => setShowSave(false)}
      />
      <LoadModal
        open={showLoad}
        gabaritos={gabarsSalvos}
        onCarregar={handleCarregarGabarito}
        onClose={() => setShowLoad(false)}
        onListaChange={handleListaChange}
      />
    </div>
  )
}
