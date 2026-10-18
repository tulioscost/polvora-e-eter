# PÓLVORA & ÉTER — Suplemento 0.2.5: Linhagens de Guerra e Soldo

## 1. A humanidade e suas linhagens

A classificação militar de Brumária registra **Humanos, Sanguessugas e Licanos** como três espécies de serviço. Em termos históricos e biológicos do cenário, **Sanguessugas e Licanos são linhagens derivadas dos humanos**, e não criaturas predestinadas ao mal. A mutação foi agravada por pactos ancestrais, linhagens ocultas e experiências de guerra. O Éter pode desencadear manifestações, mas não explica toda a origem de ambas as linhagens.

Os **humanos** compõem a maioria da população e das forças armadas. Organizam operações de grande escala, comunidades civis e infraestrutura industrial. Sua vantagem é a **Improvisação**: uma vez por cena, +1d6 antes de um teste não sobrenatural, inclusive ataques convencionais, respeitado o limite de 10d6. Dependem de preparação e equipamentos para sobreviver a ameaças anômalas.

Os **sanguessugas** são raros, ativos à noite e frequentemente recrutados para reconhecimento, infiltração e operações clandestinas. Estados e populações humanas os temem e discriminam, e algumas forças os tratam como armamentos orgânicos. **Patrulha noturna:** uma vez por cena, +1d6 antes de Furtividade ou Percepção sob pouca luz. **Sede:** aumenta 1 após cada missão cumprida ou não, máximo 3; a partir de 3, −1d6 em testes físicos. **Sol direto:** −1d6 em testes físicos; as duas penalidades podem se acumular, dentro da regra geral. A **Ração Hemática de Campanha** retira 1 Sede e, uma vez por cena, recupera até 2 PV. Não implica agressão a outros personagens.

Os **licanos** são raras linhagens metamórficas, treinadas como rastreadores e tropas de choque. Submetidos a protocolos discriminatórios de segregação e contenção, muitos renegam a função de arma. **Faro Ancestral:** uma vez por cena, +1d6 para rastreamento por cheiro. **Forma de Guerra:** ativável uma vez por cena, dura três rodadas e aumenta BPM em 10 no início. Enquanto transformado, +1d6 em testes FOR/ROB, +1 de dano corpo a corpo, −1d6 em Pontaria e impossibilidade de manejar armas de fogo. A transformação não aumenta PV, RD, número de ações nem capacidade de carga. Termina ao final da terceira rodada ou por reversão voluntária. Dano de armamento marcado **PRATA** recebe +1 antes da RD.

### Contrapesos e princípios narrativos

Nenhuma espécie recebe bônus permanentes de atributo. Os traços não ultrapassam o teto de 10d6. As restrições sociais refletem **discriminação estrutural dentro da ficção**; não são justificativa para retirar autonomia aos personagens nem para reduzir automaticamente seu soldo. As forças militares podem representar políticas divergentes, permitindo campanhas de resistência, emancipação e disputas por cidadania.

## 2. Moeda e soldo do Alto Comando

O **Crédito de Campanha (CR)** é uma unidade de crédito salarial militar, não um tesouro encontrado em cadáveres. **Após cada missão efetivamente executada**, independentemente de vitória, cada integrante registrado recebe **8 CR de soldo**. Somam-se **6 CR pelo objetivo principal**, **3 CR por objetivo secundário** (0–2) e **2 CR por patamar de risco** (0–3). Portanto, o soldo é de **8 a 26 CR por pessoa**. Missões canceladas antes da conclusão não geram o pagamento.

Antes da saída, o Mestre seleciona o **Efetivo participante** na ficha do esquadrão. Ao registrar a saída, a lista é congelada para a missão. No encerramento, o Mestre escolhe resultado, número de secundários e risco, confirma pagamento e a Tesouraria do Alto Comando credita cada personagem. O sistema conserva um **registro de IDs pagos** por personagem, impedindo pagamento duplicado, mesmo diante de uma segunda tentativa de liquidação. Operações diferentes de diferentes unidades recebem identificadores próprios.

Os valores de soldo não são descontados das reservas do esquadrão: representam transferência do erário estatal. Crédito e abastecimento são sistemas independentes. A autorização de bônus especiais fora da tabela é competência narrativa do Mestre.

## 3. Implementação em Foundry 14 (v0.2.5)

- **Espécie** no dropdown da aba Identificação; nova aba **Espécie** com vantagens, limitações e ações.
- **Compêndio PE — Características Raciais** com 10 traços em pastas das três linhagens e subpastas Vantagens/Limitações. Selecionar a espécie insere os traços automaticamente sem destruir traços colocados manualmente.
- **Licano:** botões Transformar, Reverter, Avançar rodada; usos por cena reiniciáveis pelo Mestre.
- **Sanguessuga:** Sede 0–3, consumo da Ração Hemática de Campanha e efeitos de baixa luminosidade e sol direto.
- **Esquadrão:** seleção de efetivo, registro de missão, cancelamento ou debriefing com pagamentos automáticos.
- **Migração aditiva:** a Parte XIII é acrescentada ao livro-base em mundos antigos sem substituir páginas já editadas. Personagens preexistentes permanecem humanos por padrão até nova seleção.

**Nota de projeto:** os testes automáticos validam cálculos e fluxos simulados; a compatibilidade comportamental integral com Foundry VTT 14.369 depende de verificação prática no aplicativo.
