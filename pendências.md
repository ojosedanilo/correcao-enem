# Pendências — ENEM Correção (feature React)

## ✅ Concluídas nesta migração
- [x] Estrutura modular em `src/features/enem-correcao/`
- [x] Vite + React + TypeScript + TailwindCSS + pnpm
- [x] Temas dark/light com CSS variables
- [x] Seção de informações da prova (colapsável)
- [x] Seção de texto do gabarito (colapsável)
- [x] Seção de inputs do gabarito do aluno (colapsável, começa fechado)
- [x] Seção de análises com cards de área (colapsável)
- [x] Cards de área estilizados (Mín / Média / Máx + barra)
- [x] Botão salvar / carregar gabarito (modais)
- [x] Dicionário `respostasAluno` tipado e pronto para lógica de cálculo
- [x] `corrigirGabarito()` funcional no `index.tsx`

## 🔧 A fazer (lógica de cálculo)
- [ ] Implementar `scoreRange` nos cards de área (estimativa TRI/nota por faixa de acertos)
- [ ] Conectar as tabelas de notas históricas por acertos
- [ ] Lógica de pontuação TRI (pode receber `ScoreRange` via prop `scoreRange` em `AreaCard`)
- [ ] Testes unitários para `corrigirGabarito()` e `gerarGabaritoCompleto()`

## 📋 Como usar `respostasAluno`
```ts
// Tipo: Record<string, string>
// Exemplo real depois de carregar o texto:
{
  "1I": "B",   // questão 1 de inglês
  "2I": "C",
  "3I": "A",
  "4I": "D",
  "5I": "E",
  "6":  "A",
  // ...
  "180": "D"
}
```

Para injetar o score range em um card de área:
```tsx
<AreaCard
  label="Linguagens"
  colorClass="area-card-linguagens"
  stats={resultado.linguagens}
  scoreRange={{ min: 571.6, avg: 612.3, max: 652.9, fraction: 34/45 }}
/>
```
