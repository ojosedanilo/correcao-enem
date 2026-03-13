import { useState } from 'react'
import { useTheme } from './hooks/useTheme'
import { useEnemState, EDICOES_SEM_TRI } from './hooks/useEnemState'
import { ProvaInfoSection } from './components/ProvaInfoSection'
import { TextoGabaritoSection } from './components/TextoGabaritoSection'
import { GabaritoAlunoSection } from './components/GabaritoAlunoSection'
import { AnalysesSection } from './components/AnalysesSection'
import { SaveModal, LoadModal } from './components/SaveLoadModals'
import { Sun, Moon, Save, Upload } from './components/ui/icons'
import { gabaritos } from './data/gabaritos'
import { pegarGabarito, gerarGabaritoCompleto, textoParaRespostas } from './utils/gabarito'
import { calcularTodasNotasTRI } from '../tri/scorer'
import type { ResultadoDetalhado, AreaKey, GabaritoSalvo, NotasTRI } from './types'

// ── Correção simples (acertos/erros por área) ────────────────────────────────

function corrigirGabarito(
  gabaritoCompleto: Record<string, string>,
  respostasUsuario: Record<string, string>
): ResultadoDetalhado {
  const areaRanges: Record<AreaKey, { min: number; max: number }> = {
    linguagens: { min: 1,   max: 45  },
    humanas:    { min: 46,  max: 90  },
    natureza:   { min: 91,  max: 135 },
    matematica: { min: 136, max: 180 },
  }

  const resultado: ResultadoDetalhado = {
    geral:      { total: 0, acertos: 0, erros: 0 },
    linguagens: { total: 0, acertos: 0, erros: 0 },
    humanas:    { total: 0, acertos: 0, erros: 0 },
    natureza:   { total: 0, acertos: 0, erros: 0 },
    matematica: { total: 0, acertos: 0, erros: 0 },
    errosPorArea: { linguagens: [], humanas: [], natureza: [], matematica: [] },
  }

  resultado.geral.total = Object.keys(gabaritoCompleto).length

  for (const [key, certa] of Object.entries(gabaritoCompleto)) {
    const num = Number(key.replace(/[IE]$/, ''))
    const areaKey = (Object.entries(areaRanges).find(
      ([, r]) => num >= r.min && num <= r.max
    )?.[0] ?? 'linguagens') as AreaKey

    resultado[areaKey].total++

    const usuario = respostasUsuario[key]
    if (!usuario) continue

    if (usuario === certa) {
      resultado.geral.acertos++
      resultado[areaKey].acertos++
    } else {
      resultado.geral.erros++
      resultado[areaKey].erros++
      resultado.errosPorArea[areaKey].push({
        questao: key,
        respostaCorreta: certa,
        respostaAluno: usuario,
      })
    }
  }

  return resultado
}

// ── Componente principal ─────────────────────────────────────────────────────

export function EnemCorrecaoFeature() {
  const { theme, toggle: toggleTheme } = useTheme()
  const {
    provaInfo,
    updateProvaInfo,
    respostasAluno,
    setRespostasAluno,
    setResposta,
    textoGabarito,
    setTextoGabarito,
    resultado,
    setResultado,
    notasTRI,
    setNotasTRI,
    triCarregando,
    setTriCarregando,
    EDICOES,
  } = useEnemState()

  const [showSave, setShowSave] = useState(false)
  const [showLoad, setShowLoad] = useState(false)

  const linguaSufixo = provaInfo.linguaEstrangeira === 'Inglês' ? 'I' : 'E'

  function handleCarregarTexto(texto: string) {
    const respostas = textoParaRespostas(texto, provaInfo.linguaEstrangeira)
    setRespostasAluno(respostas)
  }

  async function handleCorrigir() {
    const edicaoGabaritos = gabaritos[provaInfo.edicao]
    if (!edicaoGabaritos) {
      alert(`Gabarito para ${provaInfo.edicao} não encontrado.`)
      return
    }

    const gDia1 = pegarGabarito(edicaoGabaritos.dia_1, provaInfo.corDia1)
    const gDia2 = pegarGabarito(edicaoGabaritos.dia_2, provaInfo.corDia2)

    if (!gDia1 || !gDia2) {
      alert('Cor de prova não encontrada para a edição selecionada.')
      return
    }

    const gabaritoCompleto = gerarGabaritoCompleto(gDia1, gDia2, linguaSufixo)

    // 1. Correção simples — síncrona e imediata
    const res = corrigirGabarito(gabaritoCompleto, respostasAluno)
    setResultado(res)
    setNotasTRI(null)

    document.getElementById('section-analises')?.scrollIntoView({ behavior: 'smooth' })

    // 2. TRI — assíncrono; só tenta se o ano tiver dados disponíveis
    if (EDICOES_SEM_TRI.has(provaInfo.edicao)) return

    setTriCarregando(true)
    try {
      const triResultados = await calcularTodasNotasTRI(
        respostasAluno,
        gabaritoCompleto,
        provaInfo.corDia1,
        provaInfo.corDia2,
        provaInfo.edicao,
      )

      // Monta NotasTRI: null para áreas sem dados, número para as que calcularam
      const notas: NotasTRI = {
        linguagens: triResultados.linguagens?.nota ?? null,
        humanas:    triResultados.humanas?.nota    ?? null,
        natureza:   triResultados.natureza?.nota   ?? null,
        matematica: triResultados.matematica?.nota ?? null,
      }
      setNotasTRI(notas)
    } catch {
      // Falha silenciosa — mantém a correção simples visível
      setNotasTRI(null)
    } finally {
      setTriCarregando(false)
    }
  }

  function handleLoad(g: GabaritoSalvo) {
    updateProvaInfo('edicao', g.provaInfo.edicao)
    updateProvaInfo('corDia1', g.provaInfo.corDia1)
    updateProvaInfo('corDia2', g.provaInfo.corDia2)
    updateProvaInfo('linguaEstrangeira', g.provaInfo.linguaEstrangeira)
    setRespostasAluno(g.gabarito)
  }

  return (
    <div className={`min-h-dvh ${theme === 'light' ? 'light' : ''}`}>
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-surface-700/50 bg-surface-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-display font-800 text-xs">E</span>
            </div>
            <h1 className="font-display font-700 text-surface-100 text-sm tracking-tight">
              Correção <span className="text-brand-400">ENEM</span>
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="btn-ghost p-2"
              onClick={() => setShowLoad(true)}
              title="Carregar gabarito salvo"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="btn-ghost p-2"
              onClick={() => setShowSave(true)}
              title="Salvar gabarito"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="btn-ghost p-2"
              onClick={toggleTheme}
              title="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-4">
        <ProvaInfoSection
          provaInfo={provaInfo}
          onChange={updateProvaInfo}
          edicoes={EDICOES}
        />

        <TextoGabaritoSection
          texto={textoGabarito}
          onTextoChange={setTextoGabarito}
          provaInfo={provaInfo}
          onCarregar={handleCarregarTexto}
        />

        <GabaritoAlunoSection
          respostas={respostasAluno}
          onSetResposta={setResposta}
          linguaSufixo={linguaSufixo}
        />

        {/* Corrigir button */}
        <div className="flex justify-center">
          <button
            type="button"
            className="btn-primary px-8 py-3 text-base"
            onClick={handleCorrigir}
          >
            Corrigir Gabarito
          </button>
        </div>

        <div id="section-analises">
          <AnalysesSection
            resultado={resultado}
            notasTRI={notasTRI}
            triCarregando={triCarregando}
            edicaoTemTRI={!EDICOES_SEM_TRI.has(provaInfo.edicao)}
          />
        </div>
      </main>

      {/* ── Modals ── */}
      {showSave && (
        <SaveModal
          provaInfo={provaInfo}
          respostas={respostasAluno}
          onClose={() => setShowSave(false)}
        />
      )}
      {showLoad && (
        <LoadModal
          onLoad={handleLoad}
          onClose={() => setShowLoad(false)}
        />
      )}
    </div>
  )
}
