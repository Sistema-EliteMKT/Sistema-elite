# Sistema Elite

Sistema de pedidos para restaurante e pizzaria, desenvolvido pela **Elite MKT**.
Primeira loja: **Pizzaria Amarílis** (período de teste).

| Tela | Quem usa | Endereço |
|---|---|---|
| **Cardápio online** | Cliente, no celular | `.../#/cardapio` |
| **App do garçom** | Garçom, no celular ou tablet | `.../` (entra com PIN de garçom) |
| **Painel do caixa** | Caixa, no computador | `.../` (entra com PIN de caixa ou administrador) |
| **Agente de impressão** | Fica rodando no computador do caixa | pasta `agente-impressao/` |

## O que o sistema faz

- **Mesas e comandas.** O garçom cria a comanda como no app antigo: **identificação (número do cartão), atendente, cliente, nº de pessoas e mesa**. Pode ser uma comanda para a mesa inteira, ou uma para cada pessoa (com nome, se quiser). **Uma comanda aberta não abre de novo em outra mesa**: se a 120 já está na mesa 10 e alguém tenta lançar 120 na mesa 11, o sistema avisa e leva para a mesa 10. Funciona mesmo com dois garçons ao mesmo tempo. Dá para juntar comandas na hora de pagar, passar item de uma comanda para outra, trocar ou juntar mesas, e achar a comanda pelo número.
- **Impressão por setor (5 setores, 2 impressoras).** Cada pedido sai num papel só, dividido pelos 5 setores: **Pizzas · Esfihas · Cozinha (porções, pastéis, pratos executivos) · Refrigerantes e cervejas (pegar e levar) · Sucos e drinks (preparar)**.

  | Impressora | Onde fica | O que imprime |
  |---|---|---|
  | **Control iD Print iD** (cabo de rede) | Bar | **Tudo do salão** (mesas e comandas) |
  | **Bematech MP-4200 TH** (USB) | Caixa | **Delivery e retirada**, via do motoboy, conta da mesa e fechamento |

  Item cancelado imprime um aviso **CANCELADO**. Em Ajustes cada setor escolhe a impressora do salão e a do delivery.
- **Adicionais só na mesa.** Cada tipo de produto tem a sua lista (Pizza, Esfiha, Pastel, Beirute, Batata frita, Panqueca), já com os preços passados pela Jennifer. Na pizza tem "pizza inteira" e "meia pizza". Em **"Outros adicionais"** o garçom escreve qual é (ex.: bacon) e sai no cupom. Nada disso aparece no delivery/retirada. Editar em Caixa > Cardápio > Adicionais.
- **Onde cada produto é vendido.** Cada produto pode ser **Mesa e delivery**, **Só mesa** (não aparece no cardápio online nem no pedido de entrega/retirada) ou **Só delivery/retirada** (não aparece para o garçom). Muda direto na lista do Cardápio.
- **Caixa.** Pedidos de telefone, balcão e delivery; pedidos do cardápio online chegam com **aviso sonoro**; conta da mesa com **taxa de serviço** (10%, pode tirar); desconto; pagamento dividido em várias formas; troco; relatório do dia e **fechamento impresso**.
- **Motoboys.** Cadastro, despacho do pedido para o motoboy, entregas do dia, taxas e dinheiro a acertar com cada um.
- **Cardápio editável.** Produtos, preços, brotinho, meio a meio, bordas, opções (ex.: sabor do refrigerante), **esgotado** com um toque, taxas de entrega por bairro. Tudo pelo painel, sem mexer em código.
- **Equipe com PIN.** Garçom só vê as mesas; caixa vê o painel; administrador vê também os Ajustes.
- **Marca Elite.** "Sistema Elite · desenvolvido por Elite MKT" aparece em todas as telas e no fim de cada cupom. A logo da loja aparece em destaque.

> **Nota fiscal (NFC-e): ainda não ligada.** No teste, a loja continua emitindo nota como faz hoje. Veja o fim deste manual.

---

## 1. Testar agora (modo demonstração)

Com `js/config.js` sem as chaves do Firebase, o sistema roda em **modo demonstração**: tudo fica salvo só no navegador. Abas do mesmo computador se falam (garçom numa aba e caixa em outra), mas outro aparelho não vê os pedidos.

PINs iniciais: **Administrador 1234 · Caixa 1111 · Garçom 2222** (troque em Ajustes > Equipe).

## 2. Ligar o banco de dados (Firebase, grátis, cerca de 15 minutos)

É isso que faz celular do garçom, computador do caixa e cardápio do cliente verem os mesmos pedidos.

1. Entre em <https://console.firebase.google.com> com a conta Google da Elite e clique em **Criar projeto** (ex.: `sistema-elite-amarilis`). Pode desativar o Google Analytics.
2. **Authentication** → *Começar* → *Método de login* → ative **E-mail/senha**.
3. Ainda em **Authentication** → aba *Usuários* → **Adicionar usuário**: crie a **conta da loja** (ex.: `amarilis@elitemkt.com.br` + uma senha forte). Ela é usada uma vez em cada aparelho.
4. **Authentication** → *Configurações* → *Ações do usuário* → **desmarque "Ativar criação (inscrição)"**. Assim ninguém cria conta sozinho.
5. **Firestore Database** → *Criar banco de dados* → modo **produção** → região `southamerica-east1 (São Paulo)`.
6. Na aba **Regras** do Firestore, apague tudo, cole o conteúdo de [`firestore.rules`](firestore.rules) e clique em **Publicar**.
7. ⚙️ **Configurações do projeto** → *Seus apps* → ícone **Web `</>`** → registre o app. Copie `apiKey`, `authDomain`, `projectId` e `appId` para `FIREBASE_CONFIG` em [`js/config.js`](js/config.js).

> Essas chaves podem ficar no código: elas não são senha. Quem protege os dados são as regras do passo 6 e a conta da loja.

No **primeiro acesso** com a conta da loja, o sistema grava sozinho o cardápio inicial (139 produtos da Amarílis), os 5 setores, as impressoras e a equipe.

## 3. Colocar no ar (grátis)

**Firebase Hosting** (recomendado: funciona com o repositório privado e sem GitHub pago):

```bash
npm install -g firebase-tools
firebase login
firebase use --add            # escolha o projeto criado no passo 2
firebase deploy               # publica o site e as regras
```

O endereço fica parecido com `https://sistema-elite-amarilis.web.app`.

- Cardápio do cliente: `https://sistema-elite-amarilis.web.app/#/cardapio` (link e QR Code em Caixa > Ajustes).
- **Domínio próprio depois do teste:** Firebase → Hosting → *Adicionar domínio personalizado* e siga as instruções de DNS. O sistema continua o mesmo.

## 4. Instalar nos aparelhos

- **Garçom (celular/tablet):** abra o endereço → entre com a conta da loja → PIN. No Android, menu ⋮ → **Instalar app**. No iPhone, Compartilhar → **Adicionar à Tela de Início**.
- **Caixa (computador):** abra no Chrome → conta da loja → PIN de caixa. Deixe o som do computador ligado (aviso de pedido online).

## 5. Impressoras

Antes de tudo, descubra como cada impressora térmica está ligada:

- **Na rede (cabo ou Wi-Fi):** imprima a página de configuração da impressora (normalmente segure o botão de avanço ao ligar) e anote o **IP** (ex.: `192.168.0.51`).
- **No USB do computador (Windows):** instale o driver do fabricante (Elgin, Epson, Bematech…). Depois, em *Configurações → Impressoras → [impressora] → Propriedades da impressora → Compartilhamento*, marque **Compartilhar** e dê um nome curto, sem espaço (ex.: `COZINHA`, `BAR`).

### Impressoras da Amarílis

As duas são térmicas de 80 mm (**48 colunas**). O agente roda no computador do caixa e fala com as duas:

- **`imp1` = Bematech MP-4200 TH, no USB do caixa.**
  1. Instale o driver da MP-4200 TH (site da Bematech/Elgin) e confira se aparece em *Configurações → Impressoras*.
  2. *Propriedades da impressora → Compartilhamento*: marque **Compartilhar** com o nome **`CAIXA`**.
- **`imp2` = Control iD Print iD, no cabo de rede do bar.**
  1. Desligue, segure o botão de avançar papel e ligue: sai a página de configuração com o **IP** (ex.: `192.168.0.100`).
  2. O ideal é fixar esse IP no roteador (reserva de DHCP) para ele não mudar.

No `config.json` do agente (copie de `config.exemplo.json`, que já vem com as duas), troque o IP da Print iD e deixe `"comandos": "escpos"` nas duas.
4. Imprima o **teste** de cada uma em Caixa > Impressão.
   - **Saiu certo:** pronto.
   - **Bematech imprimiu símbolos estranhos ou não cortou:** ela está no modo próprio da marca. Troque só na Bematech para `"comandos": "escbema"` e reinicie o agente. Se mesmo assim não sair, use o utilitário de configuração da Bematech para colocar a impressora no modo **ESC/POS** e volte para `"escpos"`.
   - **Não saiu nada:** confira o nome do compartilhamento. Se o driver do fabricante não deixar passar os comandos, troque o driver dessa impressora para **"Generic / Text Only"** (Windows → Propriedades da impressora → Avançado → Driver) e teste de novo.

Se alguma delas for a versão com **cabo de rede**, use `{ "tipo": "rede", "ip": "...", "porta": 9100 }` no lugar do compartilhamento. É até mais simples.

### Opção A: Agente de impressão (recomendado; sai sozinho e em cada impressora)

1. Instale o **Node.js LTS** no computador do caixa (<https://nodejs.org>).
2. Copie a pasta `agente-impressao` para o computador (ex.: `C:\SistemaElite\agente-impressao`).
3. Copie `config.exemplo.json` para **`config.json`** e preencha:
   - `firebase`: as mesmas 4 chaves do `js/config.js`;
   - `email` / `senha`: a conta da loja;
   - `impressoras`: uma entrada para cada impressora do sistema (`imp1`, `imp2`… iguais às de Caixa > Ajustes):
     - rede: `{ "tipo": "rede", "ip": "192.168.0.51", "porta": 9100 }`
     - USB compartilhada no Windows: `{ "tipo": "windows", "compartilhamento": "COZINHA" }`
     - `"colunas": 48` para bobina 80 mm, ou `32` para 58 mm.
     - `"comandos": "escpos"` (padrão) ou `"escbema"` para Bematech no modo da marca.
   - `acentos`: `"sem-acentos"` (funciona em qualquer impressora). Se quiser acento, teste `"cp860"` ou `"cp850"`.
   - `tamanho` (opcional): letra dos itens e títulos. `"grande"` (dupla), `"medio"` (só mais alta) ou `"pequeno"` (normal, em negrito).
   - `fonte` (opcional): `"A"` (normal) ou `"B"` (compacta, ainda menor).
4. Dê dois cliques em **`iniciar.bat`**. Na primeira vez ele instala o que precisa. A janela mostra cada cupom impresso.
5. Para abrir sozinho quando o computador ligar: aperte `Win + R`, digite `shell:startup` e coloque ali um **atalho** para o `iniciar.bat`.
6. No painel: **Caixa > Impressão > Imprimir teste** em cada impressora.

Se uma impressora estiver sem papel ou desligada, o cupom fica marcado com **Erro** e o agente tenta de novo a cada 15 segundos. Também dá para **Reimprimir** qualquer cupom do dia na aba Impressão.

### Opção B: Imprimir pelo navegador (mais simples, uma impressora)

Em **Caixa > Impressão**, marque *"Este computador imprime os cupons"* e as impressoras. Para não abrir janela de confirmação a cada cupom, crie um atalho do Chrome com:

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk-printing https://SEU-ENDERECO.web.app
```

Nesse modo os cupons saem na **impressora padrão** do Windows, por isso serve para uma impressora só. Para as duas impressoras separadas por setor, use o agente.

## 6. Ajustes que a loja faz sozinha (Caixa > Ajustes, com PIN de administrador)

- Nome, telefone, endereço, número de mesas, taxa de serviço, formas de pagamento, cardápio online ligado/desligado.
- **Impressoras e setores:** qual setor sai em qual impressora, onde sai a conta, largura da bobina, papel separado por setor.
- **Equipe:** criar garçom, caixa e administrador com PIN; desativar quem saiu.
- Na aba **Cardápio**: produtos, preços, esgotado, categorias (e para qual setor imprimem), bordas, taxas de entrega.

## Trocar a marca/logo

- Logo da **Elite MKT**: `assets/elite-logo.png` (original, fundo transparente) e `assets/elite-logo-128.png` (rodapé, login e ícone da aba). Ícones do app: `assets/icon-*.png`.
- Logo da loja: `assets/logo-cliente.png` (fundo claro) e `assets/logo-cliente-claro.png` (para o fundo vermelho do cardápio).

## Nota fiscal (NFC-e): próximo passo

Para emitir NFC-e pelo sistema, a loja precisa de:

1. **Certificado digital A1** (arquivo .pfx) do CNPJ.
2. **Inscrição estadual** com NFC-e habilitada na SEFAZ-SP e o **CSC** (código de segurança do contribuinte) com o ID.
3. Do contador, para cada produto: **NCM, CFOP, CST/CSOSN** e o **regime tributário** (Simples Nacional, etc.).
4. Contratar um **emissor por API** (ex.: Focus NFe, PlugNotas, Nuvem Fiscal). O sistema manda a venda para ele e ele fala com a SEFAZ.

O CPF na nota já é guardado no recebimento. A emissão entra no fechamento da conta quando esses itens estiverem prontos.

## Estrutura

```
index.html, css/, assets/      telas e marca
js/config.js                   Firebase, marca e valores iniciais da loja
js/cardapio-inicial.js         cardápio importado da Amarílis
js/store.js                    banco (Firebase ou demonstração)
js/regras.js                   comandas, pedidos, pagamentos, cupons, fila de impressão
js/telas/                      cardápio, garçom, caixa, gestão, pagamento
agente-impressao/              programa que imprime nas térmicas (ESC/POS)
firestore.rules                regras de segurança do banco
```

---
**Sistema Elite** · desenvolvido por Elite MKT
