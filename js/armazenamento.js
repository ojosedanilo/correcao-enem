export function adicionarGabarito(dados) {
  const gabaritosSalvos =
    JSON.parse(localStorage.getItem("gabaritosSalvos")) || [];
  // Coloca os dados no início da lista
  const novosGabaritosSalvos = [dados, ...gabaritosSalvos];

  console.log(dados);
  console.log(novosGabaritosSalvos);

  localStorage.setItem("gabaritosSalvos", JSON.stringify(novosGabaritosSalvos));
}

export function apagarGabarito(index) {}

export function listarGabaritosSalvos() {}
