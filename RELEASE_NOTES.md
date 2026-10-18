# Pólvora & Éter — v0.2.9 (Hotfix de rolagens)

## Correções
- Rolagens do sistema desativam explicitamente a modalidade interativa do Dice So Nice (`dice-so-nice.interactive = false`).
- Chat gerado através de `ChatMessage.create({rolls:[roll], content, flags})`, com resultado próprio em transmissão militar.
- Nova configuração por jogador **Modo seguro das rolagens**, que desliga apenas a animação 3D quando necessário, sem interromper o chat.
- Novo diagnóstico acessível em `game.system.pe.diagnoseDice()` e teste em `await game.system.pe.testDice({safe:true})`.
- Texturas e 381 ícones da versão anterior mantidos.

## Atenção
O modo seguro vem desativado: o jogo tenta a animação 3D automática, sem exigir arremesso manual. Caso a animação continue travando, ative o modo seguro em Configurações do Sistema, ou execute o teste seguro no console.

Faça backup do mundo antes de atualizar. Os arquivos não foram testados em uma instância gráfica real do Foundry VTT 14.369.
