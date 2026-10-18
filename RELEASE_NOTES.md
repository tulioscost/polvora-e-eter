# PÓLVORA & ÉTER — FOUNDY VTT v0.2.0 (ALFA)

**Sistema:** `polvora-e-eter`  ·  **Alvo:** Foundry VTT 14.369  ·  **Base normativa:** livro Alfa 0.4.

## Alterações visuais

- Ficha totalmente reestilizada como **dossiê militar classificado**: cabeçalho, identificação, informações vitais, papel envelhecido, abas de trabalho, quadros de suprimentos.
- Botão **ALTERAR FOTO** e clique no retrato para abrir seletor de imagem do Foundry (também para ícones de itens).
- Localizações `TYPES.Actor.*` / `TYPES.Item.*` adicionadas para evitar títulos de tipo não traduzidos.
- Chat de rolagens e gastos operacionais estilizado como **transmissão de rádio militar**.

## Conteúdo

**13 compêndios de mundo**, com organização em pastas e subpastas:

| Categoria | Registros |
| --- | ---: |
| Armas | 42 |
| Equipamentos | 51 |
| Consumíveis | 32 |
| Armaduras | 32 |
| Munições | 28 |
| Magias de Éter | 26 |
| Rituais | 27 |
| Talentos | 72 |
| Trilhas | 16 |
| Ameaças | 12 |
| Personagens prontos | 4 |
| Ativos | 8 |
| Doutrinas | 6 |

**Nota:** as novas magias, rituais e itens que extrapolam o livro-base são propostas experimentais e não alteram automaticamente o equilíbrio do sistema.

## Automações

- Cena de abertura **VOCÊ FOI CONVOCADO!** gerada uma única vez ao entrar como GM; preserva cenas já ativas.
- Diario `[PERSONAGEM] - DIÁRIO` criado automaticamente, com arquivamento de rolagens e chat público vinculado à ficha.
- Sons de shotgun ao surgir um `1` em rolagem de d6 visível ao usuário, uma reprodução por mensagem.
- Preset completo de 6 faces com texturas próprias para **Dice So Nice**.
- Manifesto declara os módulos **dice-calculator** e **dice-so-nice** como **dependências obrigatórias**.

## Migração

- Atualização **incremental e idempotente**; preserva itens, nomes, pastas já atribuídas e documentos do mundo criados no v0.1.0.
- GM pode executar `await game.system.pe.seedWorld()` para reaplicar catálogos sem duplicação.

## Limitações

Validação local apenas (testes de regras, contratos da API, carga de catálogos e áudio/diário com mocks). Ainda falta teste humano em **Foundry VTT 14.369** instalado. Não automatiza efeitos narrativos não definidos pelo manual; mensagens privadas e rolagens cegas não são copiadas para diários visíveis a jogadores. O GM deve estar conectado para manter o registro contínuo.

## Instalação via manifesto (após publicar a Release)

`https://github.com/tulioscost/polvora-e-eter/releases/latest/download/system.json`

Anexar obrigatoriamente **`system.json`** e **`polvora-e-eter.zip`** à mesma Release, junto de `SHA256SUMS.txt` e das notas.
