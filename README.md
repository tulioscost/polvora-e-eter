**Correção 0.2.1:** consulte [DIAGNOSTICO_FICHA.md](DIAGNOSTICO_FICHA.md).

# PÓLVORA & ÉTER — Sistema para Foundry VTT v0.2.0

**Livro-base:** Pólvora & Éter Alfa 0.4. **Foundry:** versão 14, alvo 14.369. **Estado:** atualização alfa com validação estática e testes de contrato, ainda não testada em um Foundry aberto.

## Instalação

### GitHub Releases

Após publicar a Release `v0.2.0` no repositório `tulioscost/polvora-e-eter`, informe no Foundry → Instalar Sistema → URL de manifesto:

`https://github.com/tulioscost/polvora-e-eter/releases/latest/download/system.json`

O `system.json` publicado deve vir do **mesmo build** que o arquivo `polvora-e-eter.zip`. O manifesto da versão 0.2.0 referencia esse arquivo de Release.

### Instalação manual

Extraia o **conteúdo** de `polvora-e-eter.zip` na pasta `Data/systems/polvora-e-eter/`. `system.json` deve ficar na raiz dessa pasta. Reinicie o Foundry e selecione o sistema no mundo.

**Dependências obrigatórias, declaradas no manifesto:**

- [Dice Tray / Dice Calculator](https://foundryvtt.com/packages/dice-calculator)
- [Dice So Nice!](https://foundryvtt.com/packages/dice-so-nice/)

Ative os dois módulos no mundo. Para visualizar as seis faces originais, selecione o conjunto **Pólvora & Éter** na configuração de Dados do Dice So Nice. Sem o módulo, a instalação não satisfaz os requisitos da versão.

## Atualização de v0.1.0 para v0.2.0

A atualização mantém o identificador `polvora-e-eter` e preserva os documentos existentes do mundo. No primeiro acesso de um **GM**, cria os novos compêndios, adiciona registros ausentes e organiza registros ainda sem pasta. **Não sobrescreve registros já existentes ou sua categorização manual.** As versões do livro-base continuam indicadas pela edição Alfa 0.4.

Se necessário, execute em macro Script como GM:

```js
await game.system.pe.seedWorld();
await game.system.pe.seedIntroScene();
```

## Funcionalidades v0.2.0

- **Ficha militar personalizada** para Personagem, Ameaça e Esquadrão, com cabeçalho classificado, fotografia substituível (clique no retrato ou em **ALTERAR FOTO**), abas operacionais e inventário por tipo.
- **13 compêndios de mundo**, catalogados em **pastas e subpastas** de categoria e subtipo: 42 armas, 51 equipamentos, 32 consumíveis, 32 armaduras, 28 munições, 26 magias, 27 rituais, 72 talentos, 16 Trilhas, 12 ameaças, 4 personagens prontos, 8 ativos e 6 Doutrinas.
- **Magias/rituais** com dificuldade, custo de Éter e execução da reserva em dados; os 12 rituais originais permanecem no catálogo expandido.
- **Cena automática** `PÓLVORA & ÉTER — VOCÊ FOI CONVOCADO!`, usando a ilustração original. É ativada automaticamente **somente quando o mundo ainda não tem cena ativa**; uma cena já em uso não é substituída.
- **Journal de personagem** chamado `<nome> - DIÁRIO`, criado automaticamente ao registrar personagem (ou ao conectar o GM depois da atualização). Registra rolagens e mensagens públicas com associação à ficha. **Não copia whispers ou mensagens cegas** para diários compartilhados.
- **Chat de rádio militar** para rolagens do sistema, informando dados, D, sucessos, Ímpetos, dano potencial e observações táticas.
- **Seis faces de d6**: o 1 é um tiro na fuselagem; 2–5 são faces militares; 6 contém seis cristais de Éter. O conjunto só é registrado através da API do módulo **Dice So Nice**.
- **Som ao aparecer o resultado 1 em qualquer d6 da rolagem pública**: `assets/audio/tiro-falha.mp3`, adaptado do arquivo fornecido, executado uma vez por mensagem de rolagem.

## Regras preservadas

Reserva de até 10d6; valores 5–6 são sucessos, resultados 6 geram Ímpetos em testes bem-sucedidos; PV = ROB × 5; RD não cumulativa; BPM, PF, munição, suprimentos e progressão estratégica derivam do livro-base Alfa 0.4. Lançamento de ataques, supressão, reagrupar e gasto de Éter permanecem na ficha.

### Transparência editorial

Magias, rituais, munições, armaduras e consumíveis que não constavam do catálogo original estão **marcados como expansão experimental**. Não introduzem bônus automáticos que alterem as probabilidades da versão Alfa 0.4. Dano no alvo, cenas condicionais, rituais complexos e efeitos particulares de talentos ainda requerem decisões do mestre.

## Notas de segurança e privacidade

- O diário copia somente mensagens públicas associadas ao personagem. O GM precisa estar conectado para o arquivamento automático; mensagens enviadas enquanto o GM está offline não são reprocessadas automaticamente.
- A cópia do diário herda a visibilidade da ficha na criação. Se conceder permissão de leitura a um novo usuário após a criação, confira manualmente as permissões do diário.
- O som de tiro será audível para quem puder visualizar a mensagem de rolagem, conforme configurações locais do navegador.

## Verificações do pacote

```bash
python3 tools/verify.py
node tests/rules.test.mjs
node tests/api-contract.test.mjs
node tests/content.test.mjs
node tests/diary-audio.test.mjs
```

Os testes checam dados, sintaxe, cálculos e simulações de API. **Não substituem testes com uma instância efetiva do Foundry VTT 14.369**.

## Publicação

Use `.github/workflows/release.yml` para criar a Release `v0.2.0`. Ele empacota ZIP instalável, manifesto e checksums. O repositório remoto pode ter sido criado, mas o pacote aqui fornecido **não está publicado automaticamente**.


## v0.2.4 — Economia, peso e munição

A ficha agora usa **Créditos de Campanha (CR)**. O Mestre credita ou debita valores pelo cabeçalho, e as requisições são compradas na aba **Requisições**. A venda de uma unidade restitui metade do preço-base.

**Limite de carga:** FOR × 2 + 3. Todos os itens físicos possuem peso e preço. Itens depositados são excluídos da carga. Excesso de até 3 unidades penaliza testes físicos em −1d6; excesso maior em −2d6.

**Recarga:** use apenas munição compatível no inventário ou um carregador próprio de reserva; munição incompatível não abastece armas. O estoque estratégico do esquadrão não fornece cartuchos automaticamente.

**Farmácia de Éter:** o novo catálogo `data/field-pharmacy.json` inclui 30 tratamentos e compostos inteiramente ficcionais com efeitos sobre PV, BPM, Éter, Ressonância e bônus temporários. Consulte `ADENDO_ECONOMIA_E_LOGISTICA_024.md`.

**Publicação:** o workflow `.github/workflows/release.yml` produz `system.json`, `polvora-e-eter.zip` e checksums para a Release. É necessário ter permissão de escrita no repositório GitHub.

## Espécies e Soldo — v0.2.5

A ficha do personagem tem campo **Espécie** (Humano, Sanguessuga, Licano) e aba de características. Os traços serão gerados no inventário, sem excluir itens manuais. Licanos se transformam por ação na aba Espécie. Na ficha Esquadrão, um GM marca quem participou, registra a saída e encerra a missão no quadro de tesouraria. O programa credita o CR devido uma única vez por missão/participante. Consulte `SUPLEMENTO_ESPECIES_E_SOLDOS_025.md`.
