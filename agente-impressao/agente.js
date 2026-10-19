// Agente de impressão do Sistema Elite.
// Fica rodando no computador do caixa: pega os cupons da fila e manda direto
// para cada impressora térmica (rede, compartilhada no Windows ou USB), sem janela.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, connectAuthEmulator } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot, doc, runTransaction, updateDoc, connectFirestoreEmulator } from "firebase/firestore";
import { imprimir } from "./impressora.js";

const pasta = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(pasta, "config.json"), "utf8"));
const log = (...a) => console.log(new Date().toLocaleTimeString("pt-BR"), ...a);

// ------------------------------------------------------------------ fila
const app = initializeApp(cfg.firebase);
const db = getFirestore(app);
const auth = getAuth(app);
if (cfg.emulador) { // só para testes do desenvolvedor
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
await signInWithEmailAndPassword(auth, cfg.email, cfg.senha);
log("Conectado como", cfg.email, "· impressoras:", Object.keys(cfg.impressoras).join(", "));

const minhas = Object.keys(cfg.impressoras);
const ocupado = new Set();
const fila = new Map();

async function processar(id, job) {
  if (ocupado.has(id)) return;
  ocupado.add(id);
  const ref = doc(db, "impressoes", id);
  try {
    const pegou = await runTransaction(db, async (t) => {
      const s = await t.get(ref);
      if (!s.exists() || !["pendente", "erro"].includes(s.data().status)) return false;
      t.update(ref, { status: "imprimindo", por: "agente" });
      return true;
    });
    if (!pegou) return;
    await imprimir(job, cfg.impressoras[job.impressora], cfg.acentos);
    await updateDoc(ref, { status: "impresso", impressoEm: Date.now(), erro: null });
    log("Impresso:", job.titulo, "→", job.impressora);
  } catch (e) {
    const tentativas = (job.tentativas || 0) + 1;
    log("ERRO", job.titulo, "→", job.impressora, ":", e.message, `(tentativa ${tentativas})`);
    await updateDoc(ref, { status: "erro", erro: e.message, tentativas }).catch(() => {});
  } finally {
    ocupado.delete(id);
  }
}

onSnapshot(query(collection(db, "impressoes"), where("status", "in", ["pendente", "erro"])), (snap) => {
  fila.clear();
  for (const d of snap.docs) {
    const j = d.data();
    if (!minhas.includes(j.impressora)) continue;
    fila.set(d.id, j);
    if (j.status === "pendente") processar(d.id, j);
  }
}, (e) => log("Erro ao ouvir a fila:", e.message));

// Tenta de novo os que deram erro (impressora sem papel, desligada…), até 20 vezes.
setInterval(() => {
  for (const [id, j] of fila) if (j.status === "erro" && (j.tentativas || 0) < 20) processar(id, j);
}, 15000);

process.on("SIGINT", () => { log("Encerrando."); process.exit(0); });
