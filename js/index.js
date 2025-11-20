import {
  carregarCoresCadernos,
  carregarFormulario,
  carregarTextoQuestoesRespostas,
  carregarQuestoesRespostasEmTexto,
  abrirModal,
  obterDadosSalvarGabarito,
  definirDadosModalSalvarGabarito,
  carregarListaGabaritosSalvos,
} from "./ui.js";

import {
  adicionarGabarito,
  apagarGabarito,
  listarGabaritosSalvos,
} from "./armazenamento.js";

import {
  pegarGabarito,
  gerarGabaritoCompleto,
  obterRespostas,
} from "./montagem-gabarito.js";

import { corrigir, mostrarResultados } from "./correcao.js";

import { gabaritos } from "./dados/gabaritos.js";

function execucaoInicialIndex() {
  carregarCoresCadernos();
  carregarFormulario();

  const selectEdicao = document.querySelector("#select-edicao-prova");
  const textarea = document.querySelector("#textarea-questoes-respostas");
  const form = document.querySelector("#form-questoes-respostas");
  const btnTexto = document.querySelector(
    "#button-carregar-texto-questoes-respostas"
  );
  const btnsCorrigir = document.querySelectorAll(
    ".button-corrigir-questoes-respostas"
  );
  const btnsFecharModal = document.querySelectorAll(".button-modal-close");
  const btnSalvarGabarito = document.querySelector(
    "#button-modal-salvar-gabarito"
  );
  const btnCarregarGabarito = document.querySelector(
    "#button-modal-carregar-gabarito"
  );
  const btnModalSalvar = document.querySelector("#button-modal-salvar");
  const btnModalCarregar = document.querySelector("#button-modal-carregar");

  const questoes = new Set(
    Array.from(
      form.querySelectorAll('input[type="radio"][name]:nth-of-type(1)')
    ).map((x) => x.name)
  );

  selectEdicao.addEventListener("change", carregarCoresCadernos);

  textarea.addEventListener("change", () => carregarTextoQuestoesRespostas());
  form.addEventListener("change", () =>
    carregarQuestoesRespostasEmTexto(questoes)
  );
  btnTexto.addEventListener("click", (e) => {
    e.preventDefault();
    carregarTextoQuestoesRespostas();
  });

  for (const btn of btnsCorrigir) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const edicao = selectEdicao.value;
      const cor1 = document.querySelector("#select-cor-prova-dia-1").value;
      const cor2 = document.querySelector("#select-cor-prova-dia-2").value;
      const lingua = document.querySelector("#select-lingua-estrangeira").value;

      const sufixo = lingua === "Inglês" ? "I" : "E";

      const gDia1 = pegarGabarito(gabaritos[edicao].dia_1, cor1);
      const gDia2 = pegarGabarito(gabaritos[edicao].dia_2, cor2);

      const gabaritoCompleto = gerarGabaritoCompleto(gDia1, gDia2, sufixo);
      const resp = obterRespostas();

      const divsErros = {
        linguagens: "#div-erros-linguagens > div",
        humanas: "#div-erros-humanas > div",
        natureza: "#div-erros-natureza > div",
        matematica: "#div-erros-matematica > div",
      };

      Object.values(divsErros).forEach((sel) =>
        document.querySelector(sel).replaceChildren()
      );

      const dados = corrigir(gabaritoCompleto, resp, divsErros);

      mostrarResultados(dados);
    });
  }

  btnSalvarGabarito.addEventListener("click", () => {
    const dados = obterDadosSalvarGabarito();
    definirDadosModalSalvarGabarito(dados);
    abrirModal("#dialog-salvar-gabarito");
  });

  btnCarregarGabarito.addEventListener("click", () => {
    carregarListaGabaritosSalvos();
    abrirModal("#dialog-carregar-gabarito");
  });

  btnModalSalvar.addEventListener("click", () => {
    const dados = obterDadosSalvarGabarito();
    adicionarGabarito(dados);
  });

  btnModalCarregar.addEventListener("click", () => {});

  for (const btn of btnsFecharModal) {
    btn.addEventListener("click", function () {
      let element = this;
      // Vai pegando o pai do elemento até que ele seja um <dialog>
      while (element.parentNode.tagName.toLowerCase() != "dialog") {
        element = element.parentNode;
      }
      element = element.parentNode.close();
    });
  }
}

execucaoInicialIndex();
