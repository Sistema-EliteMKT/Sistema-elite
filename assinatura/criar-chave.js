// Cria a CHAVE SECRETA (o "carimbo") e a CHAVE PÚBLICA (o "conferidor") para assinar as atualizações do agente.
// Rode UMA vez, no SEU computador:   node assinatura/criar-chave.js
// A chave secreta fica em  C:\Users\<você>\.elite-chave\privada.pem  e NUNCA vai para o GitHub nem para o caixa.
// A chave pública é segura: é ela que você manda para o Claude colocar dentro do agente.
import { generateKeyPairSync } from "node:crypto";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const pasta = join(homedir(), ".elite-chave");
const priv = join(pasta, "privada.pem");
if (existsSync(priv)) {
  console.log(`\nJá existe uma chave em ${priv}.\nNão vou apagar nem trocar (você perderia o carimbo). Se quiser mesmo trocar, mova esse arquivo para outro lugar e rode de novo.\n`);
  process.exit(1);
}
const { privateKey, publicKey } = generateKeyPairSync("ed25519");
mkdirSync(pasta, { recursive: true });
writeFileSync(priv, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 });
const pub = publicKey.export({ type: "spki", format: "pem" });
writeFileSync(join(pasta, "chave-publica.pem"), pub);
console.log(`\nPronto. A chave SECRETA ficou em:\n  ${priv}\nGuarde uma cópia em um lugar seguro (pendrive, Google Drive PESSOAL). Se perder, não dá para assinar mais.\nNUNCA mande esse arquivo para ninguém.\n`);
console.log("Agora copie TUDO abaixo (as 3 linhas) e cole na conversa com o Claude. Essa é a chave PÚBLICA, pode mostrar:\n");
console.log(pub);
