# Pólvora & Éter — v0.2.1 | Correção de ficha militar

- Diagnóstico `game.system.pe.diagnose()` para identificar ficha instalada, selecionada e renderizada.
- Migração `await game.system.pe.repair()` para personagens que permaneçam com a folha genérica/legada; não altera fichas explicitamente escolhidas de outros módulos.
- Registro mais explícito da `PEActorSheet` e `PEItemSheet` para Foundry VTT 14.
- Modelos de dados `TypeDataModel` substituindo `template.json` legado; preserva todos os atributos e perícias existentes.
- Localização de tipos de Actor/Item também quando o Foundry estiver em inglês.
- CSS da janela reforçado. Os demais catálogos, diário, rádio, cena e dados seguem preservados.

**Instalação:** atualizar para a Release 0.2.1, reiniciar o servidor e executar Ctrl+Shift+R no navegador. Ver `DIAGNOSTICO_FICHA.md`.

**Status:** verificações estáticas e mock de inicialização, sem instalação gráfica real no Foundry 14.369. Backup recomendado antes de atualizar.
