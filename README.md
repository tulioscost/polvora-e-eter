# Pólvora & Éter — Foundry VTT v14

Sistema jogável de **Warfantasy / Militarpunk** para **Foundry VTT 14.369**, derivado do livro-base **Pólvora & Éter — Alfa 0.4**. Código versão `0.1.0`.

## Publicação via GitHub — tulioscost

**Repositório pretendido**: `https://github.com/tulioscost/polvora-e-eter`

1. Crie no GitHub um repositório **público** chamado `polvora-e-eter` em `tulioscost` (a publicação não ocorreu automaticamente).
2. Envie **todos os arquivos desta pasta para a raiz do repositório** (incluindo `.github/workflows/release.yml`). Pode usar GitHub Desktop ou fazer upload dos arquivos descompactados.
3. Em **Actions**, autorize o workflow `Publicar sistema Foundry` se necessário e execute `Run workflow` na branch `main`. Certifique-se de que **Settings → Actions → General → Workflow permissions** esteja em **Read and write permissions**.
4. Aguarde a criação do Release `v0.1.0`, com dois anexos: `system.json` e `polvora-e-eter.zip`.
5. **Foundry → Instalar sistema → URL de manifesto:**

   `https://github.com/tulioscost/polvora-e-eter/releases/latest/download/system.json`

   Este URL só funcionará **após** criar repositório e concluir o workflow; não é um link publicado no momento da geração local.

## Instalação manual imediata (sem GitHub)

Extraia o ZIP nesta pasta do servidor:

`{Diretório de dados do Foundry}/Data/systems/polvora-e-eter/`

O arquivo `system.json` deve ficar **diretamente** em `.../polvora-e-eter/system.json`. Reinicie o Foundry; crie um mundo e selecione o sistema **Pólvora & Éter**.

## Funcionalidades

- Fichas **Personagem**, **Ameaça** e **Esquadrão** — DocumentSheetV2 + Handlebars com visual de papel militar.
- 9 atributos, 45 perícias, reserva 0–10d6; 5–6 = sucesso; cada 6 gera Ímpeto se houver êxito; D1–D5.
- PV derivados de ROB × 5, redução efetiva de RD por durabilidade, BPM, trauma e PF 0–2.
- Ataques com dano fixo, tiro limitado por carregador **opcional de interface**, supressão com custo obrigatório de 1 Munição (PF2 sem dano), reagrupar, rituais com Éter.
- Unidade persistente: estoques, Estados, Prestígio, frentes, reparos e operações.
- Conteúdo **automático no primeiro acesso do GM**: nove compêndios de **mundo** (42 armas, 25 equipamentos, 72 talentos, 16 especializações, 12 rituais, 12 ameaças, 4 personagens prontos, 8 ativos, 6 doutrinas) e 1 livro-base em Journal com 12 capítulos.
- Conjunto Dice So Nice com seis imagens originais. **Dice So Nice é opcional**: o motor continua funcionando com as rolagens nativas do Foundry.

## Iniciar jogo

1. Entre no mundo como GM e aguarde a mensagem de criação dos compêndios.
2. Na pasta de Compêndios, encontre os nove pacotes `PE — ...`.
3. Importe os itens desejados para o mundo e arraste-os à ficha de personagem. Para usar uma arma, ela precisa pertencer ao personagem como item incorporado.
4. Crie um Actor `personagem`, escolha Caminho e Trilha, distribua 6 pontos adicionais de atributo (os 9 começam em 1) e 8 pontos de perícias, conforme o livro. **O sistema não aplica automaticamente os pontos de criação**; acompanhe a distribuição em mesa.
5. Crie Actor `esquadrao` para administrar a companhia e os recursos. A separação entre munição do carregador e **Munição de manobra coletiva** é intencional e descrita abaixo.
6. O GM pode reexecutar `await game.system.pe.seedWorld()` pelo console ou por uma Macro Script, sem apagar personalizações de compêndios que já contenham registros.

## Limitações e decisões explícitas

- **Não foi executado em uma instância real do Foundry VTT 14.369.** Arquivos e testes estáticos foram verificados. Possíveis diferenças de API requerem teste de integração no Foundry.
- O campo carregador/reserva serve à **conveniência visual do VTT** e não substitui o custo abstrato de Munição definido pelo manual. O tiro comum não debita a reserva coletiva; fogo de fixação debita 1 Munição do ator. O GM distribui as cargas a partir do esquadrão, com escrituração 1:1, no briefing.
- Talentos e rituais respeitam a descrição de frequência, acesso e consequência; o sistema oferece ativação/consumo e execução de teste, mas **não automatiza integralmente cada efeito narrativo** dos 72 talentos, nem relógios ficcionais complexos.
- Não há execução automática de dano ao alvo sem confirmação do GM; resultado de ataque e dano potencial vão ao chat, permitindo aplicar manualmente conforme RD e Ímpetos escolhidos.
- Compêndios são criados no **mundo**, não em packs LevelDB distribuídos previamente. A geração usa os dados JSON distribuídos com o sistema e preserva itens preexistentes.
- O livro-base do Diário é texto HTML, não a edição PDF ilustrada. As páginas de regras originais estão incluídas integralmente na pasta `data/book.json`.
- A unidade estratégica não avança todas as frentes por simples passagem de tempo. O avanço permanece decisão causal do Narrador.

## Testes locais

`node tests/rules.test.mjs`

## Fontes técnicas

- [Foundry — System Development](https://foundryvtt.com/article/system-development/)
- [Foundry v14 — Document Sheets](https://foundryvtt.com/api/v14/modules/foundry.applications.sheets.html)
- [Dice So Nice — Dice Systems](https://riccisi.gitlab.io/foundryvtt-dice-so-nice/api/dice-systems/)

Arte e cosmologia próprias do projeto. O sistema de resolução é adaptado do documento particular **CLANDESTINO 5.2.2** fornecido no desenvolvimento; não inclui texto integral dessa obra, apenas a adaptação já autorizada pelo material do projeto.
