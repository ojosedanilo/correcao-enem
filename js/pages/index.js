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

function carregarQuestoesRespostasEmTexto(questoes) {
  // Pega a caixa de texto e pega os dados do formulário
  const textareaQuestoesRespostas = document.querySelector(
    "#textarea-questoes-respostas"
  );
  const formQuestoesRespostas = document.querySelector(
    "#form-questoes-respostas"
  );
  const dadosForm = new FormData(formQuestoesRespostas);
  // Pega a última questão e seu texto
  const ultimaQuestao = questoes[questoes.length - 1];
  let texto = "";
  // Percorre cada questão das questões
  for (const questao of questoes) {
    const respostaUsuario = Object.fromEntries(dadosForm)[questao] || "";
    // Coloca no texto a questão, pula uma linha e coloca a alternativa
    texto += `${questao}\n${respostaUsuario.toUpperCase()}`;
    if (questao != ultimaQuestao) {
      // Pula uma linha se não for a última questão
      texto += `\n`;
    }
  }
  // Define o conteúdo da caixa de texto
  textareaQuestoesRespostas.value = texto;
}

function carregarTextoQuestoesRespostas(texto = "") {
  // Se o texto estiver vazio, pega ele do textarea
  if (texto == "") {
    const textareaQuestoesRespostas = document.querySelector(
      "#textarea-questoes-respostas"
    );
    texto = textareaQuestoesRespostas.value;
  }
  const linhasTexto = texto.split("\n");
  let gabaritoUsuario = {};

  // Percorre as linhas do texto de dois em dois
  for (let i = 0; i < linhasTexto.length; i += 2) {
    // Pega o número da pergunta e a alteranativa da resposta
    const pergunta = linhasTexto[i];
    // Se não tiver a linha de índice i + 1, pula a iteração
    if (!linhasTexto[i + 1]) {
      continue;
    }
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
  // Limpa as DIVs de erros
  const divsErros = {
    linguagens: "#div-erros-linguagens > div",
    humanas: "#div-erros-humanas > div",
    natureza: "#div-erros-natureza > div",
    matematica: "#div-erros-matematica > div",
  };
  Object.values(divsErros).forEach((sel) =>
    document.querySelector(sel).replaceChildren()
  );

  // Pega os Formulários
  const selectEdicaoProva = document.querySelector("#select-edicao-prova");
  const selectCorProvaDia1 = document.querySelector("#select-cor-prova-dia-1");
  const selectCorProvaDia2 = document.querySelector("#select-cor-prova-dia-2");
  const selectLinguaEstrangeira = document.querySelector(
    "#select-lingua-estrangeira"
  );

  // Pega os Formulários
  const edicaoProva = document.querySelector("#select-edicao-prova").value;
  const corProvaDia1 = document.querySelector("#select-cor-prova-dia-1").value;
  const corProvaDia2 = document.querySelector("#select-cor-prova-dia-2").value;
  // Inglês -> "I"; Caso contrário -> "E"
  const sufixoIdioma =
    document.querySelector("#select-lingua-estrangeira").value === "Inglês"
      ? "I"
      : "E";

  // Pegas os gabaritos da edição, do dia 1 e do dia 2
  const gabaritoEdicao = gabaritos[edicaoProva];
  const gabaritoDia1 = pegarGabarito(gabaritoEdicao["dia_1"], corProvaDia1);
  const gabaritoDia2 = pegarGabarito(gabaritoEdicao["dia_2"], corProvaDia2);

  // Cria gabarito completo e remove questões anuladas, Redação e da língua estrangeira que não foi escolhida
  const gabaritoCompleto = Object.fromEntries(
    Object.entries({ ...gabaritoDia1, ...gabaritoDia2 }).filter(
      ([key, value]) => {
        // Remove as questões anuladas ou de Redação
        if (value === "Anulado" || key === "Red") return false;

        // Mantém apenas a língua correta (Inglês -> "I"; Espanhol -> "E")
        if (key.endsWith("I") && sufixoIdioma !== "I") return false;
        if (key.endsWith("E") && sufixoIdioma !== "E") return false;

        return true;
      }
    )
  );

  // Pega as respostas do usuário
  const respostasUsuario = obterRespostas();

  // Dados gerais
  const geralTotalQuestoes = Object.keys(gabaritoCompleto).length;
  let geralAcertosQuestoes = 0;

  // Áreas: Linguagens, Humanas, Natureza, Matemática
  const AREAS = [
    { nome: "linguagens", min: 1, max: 45 },
    { nome: "humanas", min: 46, max: 90 },
    { nome: "natureza", min: 91, max: 135 },
    { nome: "matematica", min: 136, max: 180 },
  ];

  const dadosAreas = {
    linguagens: { total: 0, acertos: 0 },
    humanas: { total: 0, acertos: 0 },
    natureza: { total: 0, acertos: 0 },
    matematica: { total: 0, acertos: 0 },
  };

  // Função para descobrir a área da questão
  function descobrirArea(numero) {
    return AREAS.find((a) => numero >= a.min && numero <= a.max);
  }

  // Percorre o gabarito completo
  for (let questaoKey of Object.keys(gabaritoCompleto)) {
    // Remove "I" ou "E" para obter o número real da questão
    const numeroQuestao = Number(questaoKey.replace("I", "").replace("E", ""));

    // Descobre a área
    const area = descobrirArea(numeroQuestao);
    if (!area) continue;

    // Aumenta o total de questões da área
    dadosAreas[area.nome].total++;

    const respostaCerta = gabaritoCompleto[questaoKey];
    const respostaUsuario = respostasUsuario[questaoKey];

    // Usuário não respondeu → ignora
    if (!respostaUsuario) continue;

    // Verifica se o usuário acertou
    if (respostaUsuario === respostaCerta) {
      geralAcertosQuestoes++;
      dadosAreas[area.nome].acertos++;
    } else {
      // Mostra o erro na área correspondente
      const divErro = document.querySelector(divsErros[area.nome]);
      const p = document.createElement("p");
      p.innerHTML = `<b>${questaoKey}</b>: certo = <b>${respostaCerta}</b>, seu = ${respostaUsuario}`;
      divErro.appendChild(p);
    }
  }

  // Calcula os erros gerais
  const geralErrosQuestoes = geralTotalQuestoes - geralAcertosQuestoes;

  // --- Dados da Análise Geral ---
  definirDadosDivDadosAnalise(
    "#div-analise-geral",
    geralTotalQuestoes,
    geralAcertosQuestoes,
    geralErrosQuestoes
  );

  // --- Dados por Área ---
  AREAS.forEach((area) => {
    const dados = dadosAreas[area.nome];
    definirDadosDivDadosAnalise(
      `#div-analise-${area.nome}`,
      dados.total,
      dados.acertos,
      dados.total - dados.acertos
    );
  });
}

function abrirModal(seletor) {
  if (seletor != "") {
    const modal = document.querySelector(seletor);
    modal.showModal();
  }
}

function fecharModal(seletor) {
  if (seletor != "") {
    const modal = document.querySelector(seletor);
    modal.close();
  }
}

function execucaoInicialIndex() {
  carregarCoresCadernos();
  carregarFormulario();

  const selectEdicaoProva = document.querySelector("#select-edicao-prova");
  const textareaQuestoesRespostas = document.querySelector(
    "#textarea-questoes-respostas"
  );
  const buttonCarregarTextoQuestoesRespostas = document.querySelector(
    "#button-carregar-texto-questoes-respostas"
  );
  const formQuestoesRespostas = document.querySelector(
    "#form-questoes-respostas"
  );
  const buttonsCorrigirQuestoesRespostas = document.querySelectorAll(
    ".button-corrigir-questoes-respostas"
  );
  const buttonModalSalvarGabarito = document.querySelector(
    "#button-modal-salvar-gabarito"
  );
  const buttonModalCarregarGabarito = document.querySelector(
    "#button-modal-carregar-gabarito"
  );

  // Pega os atributos `name` dos inputs[type="radio"] do gabarito
  const questoes = new Set(
    Array.from(
      formQuestoesRespostas.querySelectorAll(
        'input[type="radio"][name]:nth-of-type(1)'
      )
    ).map((x) => x.name)
  );

  selectEdicaoProva.addEventListener("change", () => {
    carregarCoresCadernos();
  });

  textareaQuestoesRespostas.addEventListener("change", () => {
    carregarTextoQuestoesRespostas();
  });

  formQuestoesRespostas.addEventListener("change", () => {
    carregarQuestoesRespostasEmTexto(questoes);
  });

  buttonCarregarTextoQuestoesRespostas.addEventListener("click", (event) => {
    event.preventDefault();
    carregarTextoQuestoesRespostas();
  });

  for (const buttonCorrigirQuestoesRespostas of buttonsCorrigirQuestoesRespostas) {
    buttonCorrigirQuestoesRespostas.addEventListener("click", (event) => {
      event.preventDefault();
      corrigirEMostrarRespostas();
    });
  }

  buttonModalSalvarGabarito.addEventListener("click", () => {
    abrirModal("#dialog-salvar-gabarito");
  });
  buttonModalCarregarGabarito.addEventListener("click", () => {
    abrirModal("#dialog-carregar-gabarito");
  });

  // !!!
  // Pegar todos os botões .button-modal-close e criar os EventListener para fechar os modais
}

execucaoInicialIndex();
