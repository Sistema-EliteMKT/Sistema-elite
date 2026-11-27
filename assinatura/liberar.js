// "Libera" uma versão do agente para o caixa: calcula o hash de cada arquivo e ASSINA com a sua chave secreta.
// Rode no SEU computador, na pasta do projeto, depois do git pull:   node assinatura/liberar.js
// Depois faça commit e push de  agente-impressao/versao.json  e  agente-impressao/versao.json.sig.
// O caixa pega a versão nova em até 30 minutos (ou quando reabrir o agente).
import { createHash, createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { caminhoSeguro } from "../agente-impressao/atualizador.js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const agente = join(raiz, "agente-impressao");
const arqPriv = process.env.ELITE_CHAVE_PRIVADA || join(homedir(), ".elite-chave", "privada.pem");
const falha = (t) => { console.error(`\n${t}\n`); process.exit(1); };

if (!existsSync(arqPriv)) falha(`Não achei a sua chave secreta em ${arqPriv}.\nRode antes:  node assinatura/criar-chave.js`);
if (!existsSync(join(agente, "chave-publica.pem"))) falha("Falta agente-impressao/chave-publica.pem (a chave pública dentro do agente). Peça ao Claude para colocar.");
try {
  const sujo = execSync("git status --porcelain agente-impressao", { cwd: raiz, encoding: "utf8" }).trim();
  if (sujo) falha(`Há mudanças no agente que ainda não foram commitadas:\n${sujo}\nFaça o commit (ou descarte) antes de liberar, para o que você assina ser igual ao que está no GitHub.`);
} catch { /* sem git: segue */ }

const lista = (base = "") => readdirSync(join(agente, base)).flatMap((n) => {
  const rel = base ? `${base}/${n}` : n;
  return statSync(join(agente, rel)).isDirectory() ? (n === "node_modules" || n === "anterior" || n.startsWith(".") ? [] : lista(rel)) : [rel];
});
const arquivos = lista().filter(caminhoSeguro).sort().map((caminho) => ({ caminho, sha256: createHash("sha256").update(readFileSync(join(agente, caminho))).digest("hex") }));
const versao = readFileSync(join(agente, "agente.js"), "utf8").match(/VERSAO = "([^"]+)"/)?.[1];
if (!versao) falha("Não achei a VERSAO em agente-impressao/agente.js.");

const manifesto = Buffer.from(JSON.stringify({ versao, criadoEm: new Date().toISOString(), arquivos }, null, 2) + "\n");
const chave = createPrivateKey(readFileSync(arqPriv));
const assinatura = sign(null, manifesto, chave);
if (!verify(null, manifesto, createPublicKey(readFileSync(join(agente, "chave-publica.pem"))), assinatura))
  falha("A assinatura não bate com a chave pública que está no agente. Esta não é a chave certa.");
writeFileSync(join(agente, "versao.json"), manifesto);
writeFileSync(join(agente, "versao.json.sig"), assinatura.toString("base64") + "\n");
console.log(`\nVersão ${versao} assinada (${arquivos.length} arquivos).\nAgora envie ao GitHub:\n  git add agente-impressao/versao.json agente-impressao/versao.json.sig\n  git commit -m "Libera agente ${versao}"\n  git push\n`);
