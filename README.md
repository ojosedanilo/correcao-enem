# Correção ENEM

Aplicação web para corrigir respostas do ENEM e visualizar análises detalhadas por área de conhecimento.

## Stack

- **Vite** + **React** + **TypeScript**
- **TailwindCSS** (dark mode first)
- **pnpm**
- Deploy via **GitHub Actions → GitHub Pages**

## Funcionalidades

- Seleção de edição (2009–2025), cor do caderno e língua estrangeira
- Preenchimento do gabarito via formulário de radio buttons (180 questões)
- Carregamento por texto no formato questão/alternativa alternados
- Correção com análise por área: Linguagens, Humanas, Natureza, Matemática
- Barra de progresso animada por área
- Destaque visual dos erros diretamente no formulário
- **Salvar gabarito** no localStorage com modal de prévia
- **Carregar gabarito** com lista de gabaritos salvos e botão de exclusão
- Sincronização bidirecional: formulário ↔ texto

## Como rodar

```bash
# Instalar dependências
pnpm install

# Servidor de desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Prévia do build
pnpm preview
```

## Deploy (GitHub Pages)

1. Vá em **Settings → Pages** no seu repositório
2. Em _Source_, selecione **GitHub Actions**
3. Faça um push para a branch `main`

O workflow `.github/workflows/deploy.yml` faz o build e publica automaticamente.

> Se o repositório não estiver na raiz do domínio (ex: `usuario.github.io/ENEM-Correcao`), o `base: './'` no `vite.config.ts` já garante os assets relativos funcionarem corretamente.

## Estrutura

```
src/
├── components/
│   ├── Header.tsx             # Cabeçalho com ações de salvar/carregar
│   ├── SectionCard.tsx        # Card colapsável reutilizável
│   ├── ProvaInfoSection.tsx   # Selects de edição, cor, língua
│   ├── TextoGabaritoSection.tsx  # Textarea de entrada em texto
│   ├── GabaritoFormSection.tsx   # Formulário com 180 questões
│   ├── AnalisesSection.tsx    # Resultados e análises por área
│   ├── SaveModal.tsx          # Modal de salvar gabarito
│   └── LoadModal.tsx          # Modal de carregar gabarito salvo
├── data/
│   ├── gabaritos.ts           # Gabaritos oficiais (2024–2025)
│   └── coresCadernos.ts       # Cores disponíveis por edição
├── lib/
│   ├── correcao.ts            # Lógica de correção e estatísticas
│   ├── montagemGabarito.ts    # Montagem e filtragem do gabarito
│   └── armazenamento.ts       # localStorage (salvar/listar/apagar)
├── types/
│   └── index.ts               # Tipos TypeScript compartilhados
├── App.tsx                    # Raiz: estado e orquestração
├── main.tsx
└── index.css                  # TailwindCSS + classes utilitárias
```
