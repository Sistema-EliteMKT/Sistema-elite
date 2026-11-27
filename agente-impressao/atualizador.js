// Atualização automática e ASSINADA do agente de impressão.
// De tempos em tempos olha no GitHub se há versão nova. Só aceita se o manifesto estiver ASSINADO com a chave
// secreta do dono (que fica só no computador dele) e se cada arquivo tiver exatamente o hash assinado.
// Sem a assinatura, o agente ignora: quem invadir o GitHub não consegue fazer o caixa rodar código novo.
// Nunca mexe no config.json, no iniciar.bat nem na chave pública. Se algo falhar, continua na versão que funciona.
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, dirname, normalize, isAbsolute } from "node:path";
import { createHash, createPublicKey, verify } from "node:crypto";
import { execFile } from "node:child_process";

export const URL_PADRAO = "https://raw.githubusercontent.com/Sistema-EliteMKT/Sistema-elite/main/agente-impressao";
const PERMITIDO = /^[A-Za-z0-9_\-./]+\.(js|json|txt|md|ttf)$/;           // só código e dados, nunca .bat/.exe
const NUNCA = new Set(["config.json", "chave-publica.pem", "versao.json", "versao.json.sig"]); // nem assinado atualiza isso
const partes = (v) => String(v).match(/\d+/g)?.map(Number) || [0];
export function versaoMaior(a, b) { // a > b ?  ("2026.11.27-3" > "2026.11.27-2")
  const x = partes(a), y = partes(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
}
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

export function caminhoSeguro(c) {
  if (typeof c !== "string" || !PERMITIDO.test(c) || isAbsolute(c) || c.includes("..") || c.includes("\\")) return false;
  const n = normalize(c).replace(/\\/g, "/");
  return n === c && !c.startsWith("node_modules/") && !c.startsWith("anterior/") && !c.startsWith(".atualizacao/") && !NUNCA.has(c) && !c.split("/").some((p) => p.startsWith("."));
}

async function baixar(fetchFn, url) {
  const r = await fetchFn(url, { signal: AbortSignal.timeout(30000), headers: { "Cache-Control": "no-cache" } });
  if (!r.ok) throw new Error(`${r.status} em ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

function listar(pasta, base = "") {
  const out = [];
  for (const n of readdirSync(join(pasta, base))) {
    const rel = base ? `${base}/${n}` : n;
    if (statSync(join(pasta, rel)).isDirectory()) out.push(...listar(pasta, rel)); else out.push(rel);
  }
  return out;
}

// Faz uma rodada. Devolve { status: "sem-novidade" | "atualizado" | "recusado" | "erro", ... }. Não encerra o programa.
export async function rodada({ pasta, versaoAtual, chavePem, url = URL_PADRAO, fetchFn = fetch, log = () => {}, npm = true }) {
  try {
    const mBytes = await baixar(fetchFn, `${url}/versao.json`);
    const assinatura = Buffer.from((await baixar(fetchFn, `${url}/versao.json.sig`)).toString("utf8").trim(), "base64");
    if (!verify(null, mBytes, createPublicKey(chavePem), assinatura)) return { status: "recusado", motivo: "assinatura inválida" };
    const m = JSON.parse(mBytes.toString("utf8"));
    if (!versaoMaior(m.versao, versaoAtual)) return { status: "sem-novidade", versao: m.versao };
    const ruim = existsSync(join(pasta, ".atualizacao", "ruim.json")) ? JSON.parse(readFileSync(join(pasta, ".atualizacao", "ruim.json"), "utf8")).versao : null;
    if (ruim === m.versao) return { status: "sem-novidade", versao: m.versao, motivo: "versão marcada como ruim" };
    if (!Array.isArray(m.arquivos) || !m.arquivos.length) return { status: "recusado", motivo: "manifesto sem arquivos" };
    for (const a of m.arquivos) if (!caminhoSeguro(a.caminho) || !/^[0-9a-f]{64}$/.test(a.sha256 || "")) return { status: "recusado", motivo: `caminho não permitido: ${a.caminho}` };
    // baixa e confere TUDO antes de trocar qualquer coisa
    const novos = [];
    for (const a of m.arquivos) {
      const atual = existsSync(join(pasta, a.caminho)) ? sha(readFileSync(join(pasta, a.caminho))) : "";
      if (atual === a.sha256) continue; // já está igual
      const buf = await baixar(fetchFn, `${url}/${a.caminho}`);
      if (sha(buf) !== a.sha256) return { status: "recusado", motivo: `arquivo adulterado: ${a.caminho}` };
      novos.push({ caminho: a.caminho, buf });
    }
    // guarda a versão que funciona e troca
    const ant = join(pasta, "anterior");
    rmSync(ant, { recursive: true, force: true });
    mkdirSync(ant, { recursive: true });
    writeFileSync(join(ant, "VERSAO.txt"), String(versaoAtual));
    const trocados = [];
    try {
      for (const n of novos) {
        const destino = join(pasta, n.caminho);
        if (existsSync(destino)) { mkdirSync(dirname(join(ant, n.caminho)), { recursive: true }); copyFileSync(destino, join(ant, n.caminho)); }
        mkdirSync(dirname(destino), { recursive: true });
        writeFileSync(destino, n.buf);
        trocados.push(n.caminho);
      }
      if (npm && novos.some((n) => n.caminho === "package.json" || n.caminho === "package-lock.json")) {
        await new Promise((ok, falha) => execFile(process.platform === "win32" ? "npm.cmd" : "npm", ["install", "--omit=dev", "--no-audit", "--no-fund"], { cwd: pasta, timeout: 240000, shell: process.platform === "win32" }, (e) => (e ? falha(e) : ok())));
      }
    } catch (e) { restaurar(pasta); return { status: "erro", motivo: `falhou ao trocar: ${e.message}` }; }
    mkdirSync(join(pasta, ".atualizacao"), { recursive: true });
    writeFileSync(join(pasta, ".atualizacao", "tentando.json"), JSON.stringify({ versao: m.versao, tentativas: 0 }));
    log(`Atualizado para ${m.versao} (${trocados.length} arquivo(s))`);
    return { status: "atualizado", versao: m.versao, arquivos: trocados };
  } catch (e) { return { status: "erro", motivo: e.message }; }
}

// Volta para os arquivos guardados em "anterior".
export function restaurar(pasta) {
  const ant = join(pasta, "anterior");
  if (!existsSync(ant)) return false;
  for (const rel of listar(ant)) {
    if (rel === "VERSAO.txt") continue;
    mkdirSync(dirname(join(pasta, rel)), { recursive: true });
    copyFileSync(join(ant, rel), join(pasta, rel));
  }
  return true;
}

// Chamado ao abrir o agente. Se a versão recém-instalada não consegue ligar 3 vezes seguidas, volta para a anterior.
export function conferirInicio({ pasta, log = () => {} }) {
  const marca = join(pasta, ".atualizacao", "tentando.json");
  if (!existsSync(marca)) return "normal";
  const t = JSON.parse(readFileSync(marca, "utf8"));
  if ((t.tentativas || 0) >= 3) {
    log(`A versão ${t.versao} não conseguiu iniciar 3 vezes. Voltando para a versão anterior.`);
    restaurar(pasta);
    mkdirSync(join(pasta, ".atualizacao"), { recursive: true });
    writeFileSync(join(pasta, ".atualizacao", "ruim.json"), JSON.stringify({ versao: t.versao }));
    rmSync(marca, { force: true });
    return "voltou";
  }
  writeFileSync(marca, JSON.stringify({ ...t, tentativas: (t.tentativas || 0) + 1 }));
  return "testando";
}

// Liga a verificação periódica. Se atualizar, encerra o agente: o iniciar.bat abre de novo em 5 segundos já na versão nova.
export function iniciarAtualizador({ pasta, versaoAtual, log, cfg = {} }) {
  const ligada = cfg.atualizacao?.ligado !== false;
  const arqChave = join(pasta, "chave-publica.pem");
  if (!ligada) return { confirmar() {} };
  if (!existsSync(arqChave)) { log("Atualização automática desligada: falta o arquivo chave-publica.pem."); return { confirmar() {} }; }
  const chavePem = readFileSync(arqChave, "utf8");
  const url = process.env.AGENTE_ATUALIZACAO_URL || cfg.atualizacao?.url || URL_PADRAO;
  const marca = join(pasta, ".atualizacao", "tentando.json");
  const verificar = async () => {
    const r = await rodada({ pasta, versaoAtual, chavePem, url, log });
    if (r.status === "atualizado") { log("Reiniciando para usar a versão nova…"); setTimeout(() => process.exit(0), 1500); }
    else if (r.status === "recusado") log(`Atualização recusada (${r.motivo}). Continuo na versão ${versaoAtual}.`);
    else if (r.status === "erro") log(`Não consegui conferir atualização (${r.motivo}).`);
  };
  setTimeout(verificar, 30000);
  setInterval(verificar, 30 * 60 * 1000);
  return { confirmar() { rmSync(marca, { force: true }); } }; // a versão nova ligou direito
}
