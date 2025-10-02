# Arquitetura do Protótipo (Tier 0)

## Stack e decisões
- **Build**: Vite + React + TypeScript.
- **Estado**: Zustand (leve, direto, ideal para idle); alternativa nativa: useReducer.
- **Persistência**: localStorage (auto-save periódico e onUnload).
- **Formatação numérica**: utilitário próprio (k, M, B, T) sem perder precisão no estado.
- **Loop de jogo**: requestAnimationFrame com deltaTime (em segundos).

## Estrutura de pastas (sugerida)
```
src/
  app/
    store/            # estado global (Zustand) e slices
    loop/             # game loop (tick) e timers
    persistence/      # save/load, migrações
  domain/
    balance.ts        # constantes de Tier 0 (custos, caps)
    types.ts          # tipos (Resources, Rates, Upgrades, Buildings)
    calc.ts           # fórmulas de custo/produção/capacidade
    content.ts        # catálogo de upgrades/edifícios
  ui/
    theme.css         # tokens de design (CSS vars)
    components/       # UI atômica (Button, Card, Gauge, Modal, Tooltip)
  features/
    resources/        # ResourceBar, gauges e tooltips
    dna/              # painel DNA (clique + upgrades)
    energy/           # painel Energia (geração + capacidade)
    lab/              # dashboard Laboratório (overview + metas)
    attack/           # (placeholder bloqueado no Tier 0)
  pages/
    Game.tsx
  main.tsx
```

---

# Domínio do Jogo (Tier 0)

## Recursos e limites
### DNA
- **Base**: 1/click.
- **Capacidade inicial**: 10 (1 Tubo de Ensaio).
- **Hardcap Tier 0**: 110 (até +100 via Tubos).

### Energia
- **Produção inicial**: 1/s (1 gerador inicial).
- **Capacidade inicial**: 100 (1 Bateria).
- **Hardcap Tier 0**: 200 (até +100 via Baterias).

### Prestígio
- Apenas apresentado em UI (bloqueado até Tier 2).

## Produção automática (Tier 0)
### DNA/s
- **Fórmula**: 0.2 * (# Estagiários) + 1 * (# Lab Portátil)
- **Máximos**: Estagiários 5 (→ +1/s), Labs Portáteis 3 (→ +3/s).

### Energia/s
- **Base**: 1/s (gerador inicial fixo).
- **+0.1/s** por Gerador Improvisado (máx 10 → +1/s).
- **+2/s** por Micro Reator de Plasma (máx 2 → +4/s).
- **Total máximo Tier 0** (excluindo buffs futuros): 6/s.

## Upgrades e edifícios (Tier 0)

### DNA
- **Microscópio** — custo: 10 DNA — +1 DNA/click — máx 5/click.
- **Tubo de Ensaio** — custo: 10 DNA — +10 capacidade DNA — máx +100.
- **Cientista Estagiário** — custo: 25 DNA — +0.2 DNA/s — máx 5.
- **Laboratório Portátil** — custo: 150 DNA — +1 DNA/s — máx 3.

### Energia
- **Gerador Improvisado** — custo: 50 DNA — +0.1 Energia/s — máx 10.
- **Bateria Improvisada** — custo: 100 DNA — +10 cap Energia — máx +100.
- **Micro Reator de Plasma** — custo: 250 DNA + 25 Energia — +2 Energia/s — máx 2.

### Custo progressivo
Aplicável a itens empilháveis:
```
cost(n) = floor(baseCost * costMult^n)
```
**Sugestão de costMult**: 1.12–1.17 (definir por item no balance.ts).

Itens com custo fixo podem manter custo plano no Tier 0 (ex.: Microscopio, Tubo), se você quiser um onboarding mais generoso.

---

# UI/UX — Visual Futurista (flat, clean)

## Layout macro (desktop-first, responsivo)
- **Topbar**: logo do jogo (Quantum Fossils), meta do Tier 0, botão "Ajuda".
- **Painel esquerdo**: Máquina do Tempo (botão grande de clique) + métricas de DNA (DPC, DPS, capacidade, barra de armazenamento).
- **Painel direito**: Energia (gauge de energia atual/capacidade, EPS, lista de geradores/baterias/reatores).
- **Bottom bar**: Upgrades (cards horizontais) com bloqueios visuais e tooltips de custo/efeito.
- **Footer**: aviso de Prestígio "Disponível no Tier 2" (desabilitado), save status ("Autosave: ON"), versão.

## Componentes-chave
- **ResourceBar**: chips para DNA e Energia (ícone, valor atual, taxa/seg, capacidade).
- **BigActionButton** ("Coletar DNA"): feedback tátil (escala/flash), número flutuante +1.
- **Gauge/CapacityBar**: barras horizontais com marcações (por ex. 0/110 DNA).
- **CardUpgrade**: título, ícone, descrição breve, custo (com ícones), botão "Comprar", estado (ativo/bloqueado/limite).
- **ModalInfo**: tutorial e tooltips maiores (ex.: explicação da Máquina do Tempo).
- **Toast**: feedback curto (compra, limite atingido, capacidade cheia).

## Interações/feedback
- **Clique no fóssil**: animação curta (escala 1.0→1.05→1.0), número flutuante "+1 DNA" (ou "+N").
- **Capacidade cheia**: barra fica com borda pulsante + tooltip "Armaz. máximo atingido. Compre Tubos."
- **Upgrade indisponível**: botão com label "DNA insuficiente".
- **Compra no limite**: botão muda para "Máximo atingido".

## Acessibilidade
- **aria-label** em botões principais, foco visível, contraste AAA nos textos críticos.
- **Navegação por teclado** (Enter ativa BigActionButton).

---

# Design System (tokens de tema)

## Paleta (futurista, fria)
- **Primário**: #6EE7F8 (ciano claro) / hover #4ECDE4
- **Secundário**: #8B5CF6 (violeta) / hover #7C3AED
- **Fundo 1 (base)**: #0B1020 (azul-anil profundo)
- **Fundo 2 (cards)**: #131A2E
- **Bordas/Divisores**: #2A3357
- **Texto primário**: #E6F0FF
- **Texto secundário**: #9BB0D3
- **Sucesso**: #22C55E
- **Alerta**: #F59E0B
- **Erro**: #EF4444

## Tipografia
- **Display/Headers**: "Orbitron" ou "Rajdhani" (vibe sci-fi)
- **Texto/UI**: "Inter" (legibilidade)
- **Headings** com tracking levemente ampliado; numerais tabulares (font-variant-numeric: tabular-nums).

## Estilo
- **Cards** com bordas finas + glow sutil no hover (shadow desaturada).
- **Glassmorphism** leve opcional nos gauges (transparência 6–8%).

---

# Regras de Progressão (Tier 0)

## Desbloqueios internos
- **Gerador Improvisado** visível desde o início.
- **Micro Reator de Plasma** aparece após o jogador ver/produzir Energia ≥ 25 (para ensinar custo combinado).
- **Laboratório Portátil** aparece após ter pelo menos 1 Estagiário (introduz escala de DNA passivo).
- **Prestígio (Tier 2)**: marcador UI informando "Desbloqueia no Tier 2".

## Condição para abrir o Tier 1
- **Armazenar ao mesmo tempo**:
  - ≥ 100 DNA e ≥ 100 Energia
- **Ao cumprir**, surge CTA: "Desbloquear Criação de Dinossauros" (abre Tier 1).

---

# Mecânica do Loop

## Tick (delta time em segundos)
1. **DNA**: dna += dps * dt (limitado à capacidade de DNA).
2. **Energia**: energy += eps * dt (limitado à capacidade de energia).
3. **Auto-save**: a cada 15–30s, salvar snapshot. Em beforeunload, salvar.

## Clique
- **Se capacidade de DNA não estiver cheia**: dna += dpc (máximo 5/click no Tier 0).
- **Caso cheio**: exibir feedback de capacidade (sem ganho).

---

# Balanceamento inicial (Tier 0)

| Item | Custo | Efeito | Máximo |
|------|-------|--------|--------|
| Microscópio | 10 DNA | +1 DNA/click (até 5/click) | – |
| Tubo de Ensaio | 10 DNA | +10 cap DNA (até +100) | – |
| Cientista Estagiário | 25 DNA | +0.2 DNA/s | 5 |
| Laboratório Portátil | 150 DNA | +1 DNA/s | 3 |
| Gerador Improvisado | 50 DNA | +0.1 Energia/s | 10 |
| Bateria Improvisada | 100 DNA | +10 cap Energia (até +100) | – |
| Micro Reator de Plasma | 250 DNA + 25 Energia | +2 Energia/s | 2 |

**Ajuste fino**: se o early game ficar lento, reduza custos de Estagiário (20) ou aumente base de DPC mais cedo.

---

# Telemetria mínima útil (debug overlay)
- **Mostrar**: DPC, DPS, capDNA, EPS, capEnergia, tempo de sessão, última gravação.
- **Útil** para validar balanceamento e loops.

---

# Critérios de Aceite (Tier 0)
1. **Clicker funcional**: clicar gera DNA (respeitando capacidade).
2. **Auto-produção**: DNA/s e Energia/s atualizam com o tempo.
3. **Capacidades**: barras e hardcaps respeitados.
4. **Custo combinado**: Micro Reator exige DNA e Energia.
5. **Desbloqueio Tier 1**: acionado ao atingir 100/100 simultâneos.
6. **Persistência**: recarregar a página mantém estado.
7. **UI futurista**: layout e tokens aplicados; feedbacks visuais básicos.
