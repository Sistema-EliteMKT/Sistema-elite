# Sistema Elite: regras para o Claude Code

Sistema da Pizzaria Amarílis (F.R.A COMERCIAL LTDA), feito pela Elite MKT. Está **em produção**: o caixa, os garçons e os clientes usam este mesmo código todo dia. Responda sempre em português, em frases curtas.

## Como o projeto é organizado
- Site sem build: JavaScript puro (módulos) em `js/`, telas em `js/telas/`, estilos em `css/style.css`, entrada em `index.html`.
- `js/regras.js` tem as regras do negócio (pedidos, pagamentos, cupons, impressão). `js/store.js` fala com o banco (Firestore) ou, sem configuração, com o modo demonstração (localStorage).
- `agente-impressao/` roda no computador do caixa (imprime os papéis e emite a NFC-e pelo Focus NFe). Ele não faz parte do site.
- `firestore.rules` são as regras do banco. Quem publica é o dono, manualmente no console do Firebase.

## Regras de segurança (valem sempre)
1. **Nunca** coloque no repositório: `config.json` do agente, certificado (.pfx/.p12), senhas, tokens do Focus, chaves de API. O repositório é **público**.
2. **Nunca** teste com o banco de verdade. Para testar, faça uma cópia em outra pasta com `FIREBASE_CONFIG` vazio em `js/config.js` (modo demonstração) e abra no navegador.
3. **Cada `git push` publica na hora** no site da pizzaria (GitHub Pages, ~2 minutos). Só faça commit e push depois de testar e **depois de perguntar** ao Thiago. Mostre antes `git status` e `git diff`.
4. Antes de começar qualquer trabalho, rode `git pull` (outra sessão do Claude também envia alterações para este repositório).
5. Não crie nem emita nota fiscal de verdade para testar. Nota fiscal só vale se a SEFAZ autorizar pelo Focus NFe (agente). Um PDF desenhado pelo site **não é nota fiscal**.
6. Mudou `agente-impressao/`? Troque a `VERSAO` em `agente-impressao/agente.js` e a `VERSAO_AGENTE` em `js/telas/gestao.js` juntas.

## Como trabalhar
- Peça para o Claude **editar os arquivos do projeto**, e não para dizer o que colocar no navegador.
- Mudanças pequenas, uma por vez. Explique o que mudou em linguagem simples.
- Depois de mudar `js/` ou `css/`, para o aparelho pegar a versão nova: Ctrl + Shift + R.
- Pizzaria e Restobar são sistemas separados (o Restobar tem repositório próprio). Mudança pedida só para a pizzaria não vale para o Restobar.

## Atualização automática ASSINADA do agente (caixa)
- O agente do caixa se atualiza sozinho pelo GitHub, mas **só aceita versão assinada** com a chave secreta do Thiago (que fica só no computador dele, em `C:\Users\<ele>\.elite-chave\privada.pem`, **nunca** no repositório). A chave pública é `agente-impressao/chave-publica.pem`.
- **Nunca** crie, mude ou apague `chave-publica.pem`, `versao.json` ou `versao.json.sig` à mão. Quem gera os dois últimos é o Thiago, com `node assinatura/liberar.js`.
- Para **liberar** uma versão nova do agente para o caixa (só o Thiago): `git pull`, depois `node assinatura/liberar.js`, depois `git add agente-impressao/versao.json agente-impressao/versao.json.sig`, `git commit` e `git push`. O caixa pega em até 30 minutos.
- Antes de liberar: troque a `VERSAO` em `agente-impressao/agente.js` e em `js/telas/gestao.js` (juntas), faça commit e push das mudanças, e só então assine. `liberar.js` recusa se houver mudança do agente sem commit.
- O agente nunca atualiza `config.json`, `iniciar.bat` nem a chave pública. Mudou o `iniciar.bat`? É instalação manual no caixa.

