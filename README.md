# Correção ENEM

Feature modular React para correção do ENEM, construída com Vite + React + TypeScript + TailwindCSS.

## Stack
- **Vite** — bundler e dev server
- **React 18** + **TypeScript**
- **TailwindCSS** — utilitários + CSS variables para temas
- **pnpm** — gerenciador de pacotes

## Estrutura

```
src/
└── features/
    └── enem-correcao/         # Feature auto-contida
        ├── api.ts              # Barrel de exportações públicas
        ├── index.tsx           # Componente raiz da feature
        ├── types/              # Tipos TypeScript
        ├── data/               # Gabaritos e cores dos cadernos
        ├── hooks/              # useEnemState, useTheme, useCollapse
        ├── utils/              # gabarito.ts, storage.ts
        └── components/         # Componentes UI
            └── ui/             # Componentes base reutilizáveis
```

## Como usar

```bash
pnpm install
pnpm dev
```

## Integrar em outro projeto

A feature é auto-contida. Copie a pasta `src/features/enem-correcao/` e importe:

```tsx
import { EnemCorrecaoFeature } from '@/features/enem-correcao/api'

function App() {
  return <EnemCorrecaoFeature />
}
```

## Dicionário de respostas do aluno

O hook `useEnemState` expõe `respostasAluno`:

```ts
// Record<string, string>
// Questões 1–5 de língua estrangeira recebem sufixo "I" (inglês) ou "E" (espanhol)
{
  "1I": "B", "2I": "C", "6": "A", ..., "180": "D"
}
```

Para implementar o cálculo de notas TRI, passe `scoreRange` para o componente `AreaCard`:

```tsx
<AreaCard
  scoreRange={{ min: 571.6, avg: 612.3, max: 652.9, fraction: 34/45 }}
  ...
/>
```
