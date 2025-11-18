import { coresCadernos } from "../dados/cores-cadernos.js";
import { gabaritos } from "../dados/gabaritos.js";

function carregarCoresCadernos() {
  const selectEdicaoProva = document.querySelector("#select-edicao-prova");
  const selectCorProvaDia1 = document.querySelector("#select-cor-prova-dia-1");
  const selectCorProvaDia2 = document.querySelector("#select-cor-prova-dia-2");

  const coresCadernosDaEdicao = coresCadernos[selectEdicaoProva.value];

  selectCorProvaDia1.replaceChildren();
  selectCorProvaDia2.replaceChildren();

  for (const corCaderno of coresCadernosDaEdicao["dia_1"]) {
    const option = document.createElement("option");
    option.textContent = corCaderno;
    option.value = corCaderno;
    selectCorProvaDia1.appendChild(option);
  }
  for (const corCaderno of coresCadernosDaEdicao["dia_2"]) {
    const option = document.createElement("option");
    option.textContent = corCaderno;
    option.value = corCaderno;
    selectCorProvaDia2.appendChild(option);
  }
}

function carregarTextoQuestoesRespostas() {
  const textareaQuestoesRespostas = document.querySelector(
    "#textarea-questoes-respostas"
  );
  const texto = textareaQuestoesRespostas.value;
  const linhasTexto = texto.split("\n");
  let gabaritoUsuario = {};

  // Percorre as linhas do texto
  for (let i = 0; i < linhasTexto.length; i += 2) {
    // Pega o número da pergunta e a alteranativa da resposta
    const pergunta = linhasTexto[i];
    const resposta = linhasTexto[i + 1].toUpperCase();
    // Atualiza o gabarito do usuário
    Object.assign(gabaritoUsuario, { [pergunta]: resposta });
    // Marca o gabarito
    const radio = document.querySelector(
      `input[type="radio"][name="${pergunta}"][value="${resposta}"]`
    );
    radio.checked = true;
  }
}

// Carrega o Formulário das Questões/Respostas
function carregarFormulario() {
  // Relações dos índices começando do 0 com as letras das alternativas
  const relacaoIndiceLetra = {
    0: "A",
    1: "B",
    2: "C",
    3: "D",
    4: "E",
  };

  // Formulário das Questões/Respostas
  const formQuestoesRespostas = document.querySelector(
    "#form-questoes-respostas"
  );
  // Div das Questões/Respostas
  let divQuestoesRespostas;
  // Fieldsets das Áreas do Conhecimento
  const fieldsetLinguagens = formQuestoesRespostas.querySelector(
    "#fieldset-questoes-respostas-linguagens"
  );
  const fieldsetHumanas = formQuestoesRespostas.querySelector(
    "#fieldset-questoes-respostas-humanas"
  );
  const fieldsetNatureza = formQuestoesRespostas.querySelector(
    "#fieldset-questoes-respostas-natureza"
  );
  const fieldsetMatematica = formQuestoesRespostas.querySelector(
    "#fieldset-questoes-respostas-matematica"
  );

  // Loop de 1 a 180
  for (let i = 1; i < 181; i++) {
    if (i > 0 && i < 46) {
      // Linguagens, Códigos e suas Tecnologias
      divQuestoesRespostas = fieldsetLinguagens.querySelector(
        ".div-questoes-respostas"
      );
    } else if (i > 45 && i < 91) {
      // Ciências Humanas e suas Tecnologias
      divQuestoesRespostas = fieldsetHumanas.querySelector(
        ".div-questoes-respostas"
      );
    } else if (i > 90 && i < 136) {
      // Ciências da Natureza e suas Tecnologias
      divQuestoesRespostas = fieldsetNatureza.querySelector(
        ".div-questoes-respostas"
      );
    } else {
      // Matemática e suas Tecnologias
      divQuestoesRespostas = fieldsetMatematica.querySelector(
        ".div-questoes-respostas"
      );
    }

    // Cria uma <div> para ser a linha da questão e um <p> para indicar seu número
    const divLinha = document.createElement("div");
    const p = document.createElement("p");
    // Define o número da questão e coloca na linha
    p.textContent = i;
    divLinha.appendChild(p);
    // Coloca as alternativas na linha
    for (let j = 0; j < 5; j++) {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `${i}`;
      input.value = relacaoIndiceLetra[j];
      divLinha.appendChild(input);
    }

    // Adiciona a classe à divLinha e a coloca nas Questões Resposta
    divLinha.classList.add("div-linha");
    divQuestoesRespostas.appendChild(divLinha);
  }
}

function definirPorcentagemAcertos(seletor, valor, conteudoTexto) {
  // Arredonda o valor
  document
    .querySelector(seletor)
    .style.setProperty("--progress-value", Math.round(valor));
  document.querySelector(seletor).textContent = conteudoTexto;
}

function obterRespostas() {
  const selectLinguaEstrangeira = document.querySelector(
    "#select-lingua-estrangeira"
  );
  const formQuestoesRespostas = document.querySelector(
    "#form-questoes-respostas"
  );

  const dadosForm = new FormData(formQuestoesRespostas);
  let respostas = Object.fromEntries(dadosForm);
  // Inglês -> "I"; Caso contrário -> "E"
  let sufixoIdioma = selectLinguaEstrangeira.value == "Inglês" ? "I" : "E";

  for (let i = 1; i < 6; i++) {
    // Se não tiver a chave com uma das questões de lingua estrangeira, pula a iteração
    if (!respostas.hasOwnProperty(i)) continue;
    respostas[`${i}${sufixoIdioma}`] = respostas[i];
    delete respostas[i];
  }

  return respostas;
}

function pegarGabarito(provas, corDesejada) {
  const prova = provas.find(
    (p) => p.cor_da_prova.toLowerCase() === corDesejada.toLowerCase()
  );

  return prova ? prova.gabarito : null;
}

function definirDadosDivDadosAnalise(seletor, total, acertos, erros) {
  // Pega a <div> dos dados da análise através do seletor
  const divDadosAnalise = document.querySelector(seletor);
  // Pega os <p> para colocar as informações
  const pQuantidadeDeQuestoes = divDadosAnalise.querySelector(
    ".p-quantidade-de-questoes"
  );
  const pQuantidadeDeAcertos = divDadosAnalise.querySelector(
    ".p-quantidade-de-acertos"
  );
  const pQuantidadeDeErros = divDadosAnalise.querySelector(
    ".p-quantidade-de-erros"
  );
  // Define a porcentagem de acertos
  definirPorcentagemAcertos(
    `${seletor} .div-porcentagem-acertos`,
    (100 * acertos) / total,
    `${((100 * acertos) / total).toLocaleString("de-DE")}%`
  );
  // Define o total de questões, acertos e erros
  pQuantidadeDeQuestoes.querySelector("span").textContent = total;
  pQuantidadeDeAcertos.querySelector("span").textContent = acertos;
  pQuantidadeDeErros.querySelector("span").textContent = erros;
}

function corrigirEMostrarRespostas() {
  document.querySelector("#div-erros-linguagens > div").replaceChildren();
  document.querySelector("#div-erros-humanas > div").replaceChildren();
  document.querySelector("#div-erros-natureza > div").replaceChildren();
  document.querySelector("#div-erros-matematica > div").replaceChildren();
  // Pega os Formulários
  const selectEdicaoProva = document.querySelector("#select-edicao-prova");
  const selectCorProvaDia1 = document.querySelector("#select-cor-prova-dia-1");
  const selectCorProvaDia2 = document.querySelector("#select-cor-prova-dia-2");
  const selectLinguaEstrangeira = document.querySelector(
    "#select-lingua-estrangeira"
  );
  // Pega o ano de edição e as cores das provas dos dia 1 e 2
  const edicaoProva = selectEdicaoProva.value;
  const corProvaDia1 = selectCorProvaDia1.value;
  const corProvaDia2 = selectCorProvaDia2.value;
  // Pegas os gabaritos da edição, do dia 1, do dia 2 e o gabarito completo
  const gabaritoEdicao = gabaritos[edicaoProva];
  const gabaritoDia1 = pegarGabarito(gabaritoEdicao["dia_1"], corProvaDia1);
  const gabaritoDia2 = pegarGabarito(gabaritoEdicao["dia_2"], corProvaDia2);
  const gabaritoCompleto = { ...gabaritoDia1, ...gabaritoDia2 };
  // Pega as respostas do usuário
  const respostasUsuario = obterRespostas();
  // Inglês -> "I"; Caso contrário -> "E"
  let sufixoIdioma = selectLinguaEstrangeira.value == "Inglês" ? "I" : "E";
  // Dados de análise
  const geralTotalQuestoes = 180;
  let geralAcertosQuestoes = 0;
  let geralErrosQuestoes = 0;
  const areaTotalQuestoes = 45;
  let areaAcertosQuestoes = 0;
  let areaErrosQuestoes = 0;
  let divErrosArea;

  // Percorre as questões e respostas do gabarito completo
  for (let i = 1; i < 181; i++) {
    let questao = i;
    if (i < 6) {
      questao = `${i}${sufixoIdioma}`;
    }
    const resposta = gabaritoCompleto[questao];

    if (respostasUsuario[questao] && i > 0 && i < 46) {
      divErrosArea = document.querySelector("#div-erros-linguagens > div");
    } else if (respostasUsuario[questao] && i > 45 && i < 91) {
      divErrosArea = document.querySelector("#div-erros-humanas > div");
    } else if (respostasUsuario[questao] && i > 90 && i < 136) {
      divErrosArea = document.querySelector("#div-erros-natureza > div");
    } else if (respostasUsuario[questao] && i > 135 && i < 181) {
      divErrosArea = document.querySelector("#div-erros-matematica > div");
    }

    // Verifica se o usuário respondeu e se a resposta do usuário está correta
    if (respostasUsuario[questao] && respostasUsuario[questao] == resposta) {
      // Se sim, ele ganha um acerto no geral e na área específica
      geralAcertosQuestoes += 1;
      areaAcertosQuestoes += 1;
    } else if (
      respostasUsuario[questao] &&
      respostasUsuario[questao] != resposta
    ) {
      const p = document.createElement("p");
      p.innerHTML = `<b>${questao}</b>: certo = <b>${resposta}</b>, seu = ${respostasUsuario[questao]}`;
      divErrosArea.appendChild(p);
    }
    // Define os dados da análise para cada área do conhecimento ao chegar na última questão dela
    if (questao == 45) {
      // Linguagens
      definirDadosDivDadosAnalise(
        "#div-analise-linguagens",
        areaTotalQuestoes,
        areaAcertosQuestoes,
        areaTotalQuestoes - areaAcertosQuestoes
      );
    } else if (questao == 90) {
      // Humanas
      definirDadosDivDadosAnalise(
        "#div-analise-humanas",
        areaTotalQuestoes,
        areaAcertosQuestoes,
        areaTotalQuestoes - areaAcertosQuestoes
      );
    } else if (questao == 135) {
      // Natureza
      definirDadosDivDadosAnalise(
        "#div-analise-natureza",
        areaTotalQuestoes,
        areaAcertosQuestoes,
        areaTotalQuestoes - areaAcertosQuestoes
      );
    } else if (questao == 180) {
      // Matemática
      definirDadosDivDadosAnalise(
        "#div-analise-matematica",
        areaTotalQuestoes,
        areaAcertosQuestoes,
        areaTotalQuestoes - areaAcertosQuestoes
      );
    }
    // Zera os erros e acertos das questões da área para que não haja interferência na próxima
    if (questao == 45 || questao == 90 || questao == 135 || questao == 180) {
      areaAcertosQuestoes = 0;
      areaErrosQuestoes = 0;
    }
  }

  geralErrosQuestoes = geralTotalQuestoes - geralAcertosQuestoes;

  // Dados Gerais
  definirDadosDivDadosAnalise(
    "#div-analise-geral",
    geralTotalQuestoes,
    geralAcertosQuestoes,
    geralErrosQuestoes
  );
}

async function execucaoInicialIndex() {
  carregarCoresCadernos();
  carregarFormulario();

  const selectEdicaoProva = document.querySelector("#select-edicao-prova");
  const buttonCarregarTextoQuestoesRespostas = document.querySelector(
    "#button-carregar-texto-questoes-respostas"
  );
  const buttonCorrigirQuestoesRespostas = document.querySelector(
    "#button-corrigir-questoes-respostas"
  );

  selectEdicaoProva.addEventListener("change", () => {
    carregarCoresCadernos();
  });
  buttonCarregarTextoQuestoesRespostas.addEventListener("click", (event) => {
    event.preventDefault();
    carregarTextoQuestoesRespostas();
  });
  buttonCorrigirQuestoesRespostas.addEventListener("click", (event) => {
    event.preventDefault();
    corrigirEMostrarRespostas();
  });
}

execucaoInicialIndex();
