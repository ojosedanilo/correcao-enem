/**
 * @file ui.js
 * @description
 * Funções responsáveis por manipular diretamente a interface do usuário:
 * - carregar selects (edição/cor);
 * - montar formulário de questões;
 * - converter formulário ↔ textarea;
 * - exibir valores de análise (acertos/erros);
 * - abrir e fechar modais.
 *
 * O foco é manter o DOM simples e previsível.
 */

import { coresCadernos } from "./dados/cores-cadernos.js";

/**
 * Carrega as cores disponíveis da edição selecionada nos selects de Dia 1 e Dia 2.
 * Sempre limpa as opções anteriores antes de recriar.
 *
 * @function carregarCoresCadernos
 * @returns {void}
 */
export function carregarCoresCadernos() {
  const selectEdicaoProva = document.querySelector("#select-edicao-prova");
  const selectCorProvaDia1 = document.querySelector("#select-cor-prova-dia-1");
  const selectCorProvaDia2 = document.querySelector("#select-cor-prova-dia-2");

  const coresCadernosDaEdicao = coresCadernos[selectEdicaoProva.value];

  // Reset dos selects
  selectCorProvaDia1.replaceChildren();
  selectCorProvaDia2.replaceChildren();

  // Preenche os selects dinamicamente
  for (const cor of coresCadernosDaEdicao.dia_1) {
    const opt = document.createElement("option");
    opt.value = opt.textContent = cor;
    selectCorProvaDia1.appendChild(opt);
  }
  for (const cor of coresCadernosDaEdicao.dia_2) {
    const opt = document.createElement("option");
    opt.value = opt.textContent = cor;
    selectCorProvaDia2.appendChild(opt);
  }
}

/**
 * Monta o formulário completo das 180 questões,
 * divididas automaticamente por área (45 por área).
 *
 * Cada linha contém:
 * - número da questão;
 * - 5 inputs radio (A–E).
 *
 * @function carregarFormulario
 * @returns {void}
 */
export function carregarFormulario() {
  const form = document.querySelector("#form-questoes-respostas");

  const fieldsets = {
    linguagens: form.querySelector("#fieldset-questoes-respostas-linguagens"),
    humanas: form.querySelector("#fieldset-questoes-respostas-humanas"),
    natureza: form.querySelector("#fieldset-questoes-respostas-natureza"),
    matematica: form.querySelector("#fieldset-questoes-respostas-matematica"),
  };

  const alternativas = ["A", "B", "C", "D", "E"];

  for (let num = 1; num <= 180; num++) {
    // Seleciona automaticamente o fieldset correto
    let fieldset;
    if (num <= 45) fieldset = fieldsets.linguagens;
    else if (num <= 90) fieldset = fieldsets.humanas;
    else if (num <= 135) fieldset = fieldsets.natureza;
    else fieldset = fieldsets.matematica;

    const divLinha = document.createElement("div");
    divLinha.classList.add("div-linha");

    // Número da questão
    const p = document.createElement("p");
    p.textContent = num;
    divLinha.appendChild(p);

    // Inputs A–E
    for (const alt of alternativas) {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `${num}`;
      input.value = alt;
      divLinha.appendChild(input);
    }

    fieldset.querySelector(".div-questoes-respostas").appendChild(divLinha);
  }
}

/**
 * Converte as respostas marcadas no formulário para texto formatado no textarea.
 *
 * Formato gerado:
 * 1
 * B
 * 2
 * D
 * ...
 *
 * @function carregarQuestoesRespostasEmTexto
 * @param {string[]} questoes - Lista das questões em ordem sequencial.
 * @returns {void}
 */
export function carregarQuestoesRespostasEmTexto(questoes) {
  const textarea = document.querySelector("#textarea-questoes-respostas");

  // Converte o formulário inteiro para um objeto simples
  const dadosForm = Object.fromEntries(
    new FormData(document.querySelector("#form-questoes-respostas"))
  );

  let texto = "";

  for (const q of questoes) {
    const resp = dadosForm[q] || "";
    texto += `${q}\n${resp}\n`;
  }

  textarea.value = texto.trim();
}

/**
 * Preenche o formulário a partir do texto do textarea.
 * Espera pares linha a linha: número → resposta.
 *
 * Formato esperado:
 * 1
 * A
 * 2
 * B
 *
 * @function carregarTextoQuestoesRespostas
 * @param {string} [texto=""] - Texto contendo questões e respostas alternadas.
 * @returns {void}
 */
export function carregarTextoQuestoesRespostas(texto = "") {
  if (!texto) {
    texto = document.querySelector("#textarea-questoes-respostas").value;
  }

  const linhas = texto.split("\n");
  const form = document.querySelector("#form-questoes-respostas");

  // Percorre de 2 em 2 (questão + resposta)
  for (let i = 0; i < linhas.length; i += 2) {
    const q = linhas[i];
    const resp = linhas[i + 1]?.toUpperCase();
    if (!resp) continue;

    // Seleciona exatamente o input correspondente
    const radio = form.querySelector(
      `input[type="radio"][name="${q}"][value="${resp}"]`
    );
    if (radio) radio.checked = true;
  }
}

/**
 * Atualiza o componente visual de porcentagem (círculo/linha animada).
 *
 * @function definirPorcentagemAcertos
 * @param {string} seletor - Seletor do componente que exibe a porcentagem.
 * @param {number} valor - Valor numérico da porcentagem (0–100).
 * @param {string} texto - Texto formatado exibido (ex: "82,5%").
 * @returns {void}
 */
export function definirPorcentagemAcertos(seletor, valor, texto) {
  const el = document.querySelector(seletor);
  el.style.setProperty("--progress-value", Math.round(valor));
  el.textContent = texto;
}

/**
 * Exibe total, acertos e erros em uma div da análise.
 * Também atualiza o componente visual de porcentagem.
 *
 * @function definirDadosDivDadosAnalise
 * @param {string} seletor - Seletor da seção de análise.
 * @param {number} total - Total de questões.
 * @param {number} acertos - Quantidade de acertos.
 * @param {number} erros - Quantidade de erros.
 * @returns {void}
 */
export function definirDadosDivDadosAnalise(seletor, total, acertos, erros) {
  const div = document.querySelector(seletor);

  definirPorcentagemAcertos(
    `${seletor} .div-porcentagem-acertos`,
    (100 * acertos) / total,
    `${((100 * acertos) / total).toLocaleString("de-DE")}%`
  );

  div.querySelector(".p-quantidade-de-questoes span").textContent = total;
  div.querySelector(".p-quantidade-de-acertos span").textContent = acertos;
  div.querySelector(".p-quantidade-de-erros span").textContent = erros;
}

/**
 * Abre um modal (<dialog>) pelo seletor informado.
 *
 * @function abrirModal
 * @param {string} sel - Seletor do <dialog>.
 * @returns {void}
 */
export function abrirModal(sel) {
  document.querySelector(sel)?.showModal();
}

/**
 * Fecha um modal (<dialog>) pelo seletor informado.
 *
 * @function fecharModal
 * @param {string} sel - Seletor do <dialog>.
 * @returns {void}
 */
export function fecharModal(sel) {
  document.querySelector(sel)?.close();
}

// !!!
export function obterDadosSalvarGabarito() {
  return {
    edicao_prova: document.querySelector("#select-edicao-prova").value,
    cor_prova_dia_1: document.querySelector("#select-cor-prova-dia-1").value,
    cor_prova_dia_2: document.querySelector("#select-cor-prova-dia-2").value,
    lingua_estrangeira: document.querySelector("#select-lingua-estrangeira")
      .value,
    gabarito_texto: document.querySelector("#textarea-questoes-respostas")
      .value,
  };
}

export function definirDadosModalSalvarGabarito(dados) {
  const dialogSalvarGabarito = document.querySelector(
    "#dialog-salvar-gabarito"
  );
  const pEdicaoProva = dialogSalvarGabarito.querySelector(
    ".p-modal-edicao-prova span"
  );
  const pCorProvaDia1 = dialogSalvarGabarito.querySelector(
    ".p-modal-cor-prova-dia-1 span"
  );
  const pCorProvaDia2 = dialogSalvarGabarito.querySelector(
    ".p-modal-cor-prova-dia-2 span"
  );
  const pLinguaEstrangeira = dialogSalvarGabarito.querySelector(
    ".p-modal-lingua-estrangeira span"
  );
  const pGabarito = dialogSalvarGabarito.querySelector(
    ".textarea-modal-gabarito"
  );

  pEdicaoProva.textContent = dados["edicao_prova"];
  pCorProvaDia1.textContent = dados["cor_prova_dia_1"];
  pCorProvaDia2.textContent = dados["cor_prova_dia_2"];
  pLinguaEstrangeira.textContent = dados["lingua_estrangeira"];
  pGabarito.value = dados["gabarito_texto"];
}

export function carregarListaGabaritosSalvos() {
  const ulGabaritosSalvos = document.querySelector("#ul-gabaritos-salvos");

  ulGabaritosSalvos.replaceChildren();
}
