# Pólvora & Éter — Diagnóstico da ficha 0.2.1

## O sintoma
A janela com cabeçalho `TYPES.Actor.personagem` e nome isolado corresponde à ficha genérica do Foundry, não ao relatório militar do sistema. A tradução sem resolução pode indicar idioma diferente do português ou versão antiga instalada.

## Procedimento
1. Faça backup do mundo e encerre o Foundry.
2. Atualize o sistema pela Release v0.2.1; NÃO instale o ZIP de código-fonte como se fosse uma Release, e não extraia para `systems/polvora-e-eter/polvora-e-eter/`.
3. Verifique que `Data/systems/polvora-e-eter/system.json` contém `"version": "0.2.1"` e que ao lado existem as pastas `module`, `templates`, `styles`, `assets`, `data`.
4. Reinicie **o servidor** e depois o cliente com `Ctrl+Shift+R`. Abra o mundo e use `F12 → Console`.
5. Execute `game.system.pe.diagnose()` para verificar se a ficha `PEActorSheet` está disponível e atribuída; depois, sendo GM, execute `await game.system.pe.repair()` para migrar fichas antigas.
6. Feche e reabra a ficha. Pode-se também usar o menu da ficha **Configurar folha**, selecionando `Pólvora & Éter — Dossiê Militar`.

Se a função `game.system.pe.diagnose` não existir, a atualização **não foi carregada**. Se a função existir, mas o registro `oursAvailable` for falso, encaminhe o erro de F12 e o resultado do diagnóstico para correção.

O método `repair()` preserva a seleção de fichas de módulos externos; `repair({force:true})` pode sobrescrevê-las, por decisão expressa do Mestre.

Não é necessário apagar personagens, mundos, compêndios ou diários existentes.
