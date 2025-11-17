import { gabaritos } from "./gabaritos.js";

function carregarFormularios() {
  const sectionGabaritoLinguagens = document.querySelector(
    "#section-gabarito-linguagens"
  );
  const sectionGabaritoHumanas = document.querySelector(
    "#section-gabarito-humanas"
  );
  const sectionGabaritoNatureza = document.querySelector(
    "#section-gabarito-natureza"
  );
  const sectionGabaritoMatematica = document.querySelector(
    "#section-gabarito-matematica"
  );

  let formGabarito;

  const formGabaritoLinguagens =
    sectionGabaritoLinguagens.querySelector(".form-gabarito");
  const formGabaritoHumanas =
    sectionGabaritoHumanas.querySelector(".form-gabarito");
  const formGabaritoNatureza =
    sectionGabaritoNatureza.querySelector(".form-gabarito");
  const formGabaritoMatematica =
    sectionGabaritoMatematica.querySelector(".form-gabarito");

  for (let i = 1; i < 181; i++) {
    if (i > 0 && i < 46) {
      formGabarito = formGabaritoLinguagens;
    } else if (i > 45 && i < 91) {
      formGabarito = formGabaritoHumanas;
    } else if (i > 90 && i < 136) {
      formGabarito = formGabaritoNatureza;
    } else {
      formGabarito = formGabaritoMatematica;
    }

    // Linguagens, Códigos e suas Tecnologias
    const div = document.createElement("div");
    const p = document.createElement("div");

    p.textContent = i;

    div.appendChild(p);

    for (let j = 0; j < 5; j++) {
      const option = document.createElement("option");
      div.appendChild(option);
    }

    div.classList.add("div-linha");

    // !!!

    formGabarito.appendChild(div);
  }
}

carregarFormularios();

console.log(gabaritos);
