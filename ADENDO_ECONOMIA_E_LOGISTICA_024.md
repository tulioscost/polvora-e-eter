# PÓLVORA & ÉTER — ADENDO 0.2.4
## Economia de guerra, munição, carga e farmácia de campanha

**Estado editorial:** módulo de regras experimentais do sistema Foundry. Amplia o livro-base Alfa 0.4, não substitui suas regras de combate e horror.

### 1. Créditos de Campanha (CR)

A moeda contábil da guerra é o **Crédito de Campanha (CR)**. Um CR equivale a um direito de requisição padronizado no mercado de postos, caravanas e arsenais; não é necessariamente uma moeda física. Pode assumir cédulas militares, notas de intendência ou saldo codificado no registro do esquadrão. Os preços em CR são valores de playtest, não tabelas históricas.

- **Saldo inicial do personagem:** 40 CR. O esquadrão possui 100 CR próprios, separados dos estoques estratégicos.
- **Requisição:** escolher um item no catálogo da aba *Requisições*. O preço é debitado imediatamente e o item é adicionado ao inventário.
- **Venda:** 1 unidade é removida do estoque, recuperando 50% do preço-base arredondado para baixo. A venda não financia uma compra cujo saldo seja insuficiente.
- **Distribuição ou confisco:** apenas o Mestre altera diretamente o saldo na ficha por meio de um valor informado e dos controles + / −.
- **Sem saldo negativo:** compras e débitos acima do saldo disponível são bloqueados.
- **Itens recebidos como saque ou doação:** podem ser inseridos diretamente pelo Mestre e não precisam consumir Créditos.
- **Escassez e reputação:** o Narrador ainda pode restringir itens C2 e C3 por acesso, missão ou prestígio; a existência de CR não equivale à disponibilidade física.

### 2. Carga e peso

`Carga máxima = FOR × 2 + 3` unidades.

O peso do objeto é expresso em **unidades de carga**. O inventário somará a quantidade multiplicada pelo peso individual de cada item. Itens marcados como armazenados no depósito não compõem a carga pessoal nem ficam disponíveis para recarregar.

| Excesso | Consequência experimental |
|---|---|
| Dentro do limite | Nenhuma penalidade |
| Mais de 0 até 3 unidades acima | −1d6 em testes físicos |
| Acima de 3 unidades | −2d6 em testes físicos |

**Exemplo:** FOR 3 permite 9 unidades. Um personagem carregando 10 unidades sofre −1d6 nos testes físicos; com 13, sofre −2d6. A carga é recalculada após alterar atributos, quantidades, equipar/guardar ou comprar itens.

### 3. Tipos de munição e recarga

As armas dispõem de uma família de munição (`ammoType`) definida no catálogo: cartuchos de pistola, revólver, fuzil, carabina, escopeta, submetralhadora, metralhadoras, Éter contido, cargas de morteiro, artilharia e cargas especiais.

Ao pressionar **Recarregar**, o sistema:

1. Confere se a arma usa munição e se o carregador não está cheio.
2. Procura no inventário **somente munição da mesma família**, com quantidade positiva e fora do depósito.
3. Consome a quantidade disponível até completar o carregador. A recarga pode ser **parcial**.
4. Na ausência de munição avulsa, aceita **um carregador de reserva próprio da arma**, quando houver. Esse valor de reserva foi preservado de versões anteriores.
5. Se ambas as fontes estiverem vazias, **não altera o carregador** e exibe aviso.

Armas corpo a corpo ou sem munição não têm ação de recarga. A arma descarregada não pode atacar até que haja munição.

**Importante:** os estoques estratégicos do esquadrão não são automaticamente convertidos em cartuchos individuais. Esse transporte requer autorização e distribuição pelo Narrador.

### 4. Farmácia de campanha e produtos de Éter

O compêndio **PE — Farmácia de Guerra e Éter** possui 30 consumíveis novos: 15 de Éter e 15 de medicina e farmacologia militar ficcionais. São itens de uso único que afetam PV, BPM, Éter, Ressonância, Traumas e, ocasionalmente, os próximos testes.

- Soro de Recuperação do Front: recupera 2 PV.
- Tônico de Marcha: +1d6 no próximo teste; +10 BPM.
- Calmante de Abrigo: −15 BPM; −1d6 no próximo teste.
- Ampola de Éter estabilizado: +2 Éter, +5 BPM e +1 Ressonância.
- Soro de Memória Condensada: +1d6 nos dois próximos testes e +1 Ressonância.
- Néctar de Linhas Mortas: +4 Éter, +15 BPM e +2 Ressonância.

Essas substâncias são **inteiramente inventadas** e representadas por efeitos abstratos de RPG. Não estabelecem fórmulas farmacológicas, doses reais nem práticas de tratamento aplicáveis fora da ficção.

### 5. Migração de mundo

Ao entrar como Mestre depois da atualização, o sistema complementa os compêndios existentes com preços, pesos e tipos de munição. Também revisa os itens embarcados em personagens, **sem sobrescrever valores positivos de preço e peso** já alterados. Não repõe munição, não restaura PV e não apaga inventários.

**Limite de validação:** os testes são estáticos e automatizados, não foram executados em um Foundry VTT 14.369 real. Recomenda-se backup do mundo e teste em cópia antes da campanha.
