// Converte o cupom em comandos ESC/POS e envia para a impressora.
import { writeFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { connect } from "node:net";
import { execFile } from "node:child_process";

// ------------------------------------------------------------------ ESC/POS
const ESC = 0x1b, GS = 0x1d;
const CP860 = { á: 0xa0, à: 0x85, â: 0x83, ã: 0x84, é: 0x82, ê: 0x88, í: 0xa1, ó: 0xa2, ô: 0x93, õ: 0x94, ú: 0xa3, ü: 0x81, ç: 0x87,
  Á: 0x86, À: 0x91, Â: 0x8f, Ã: 0x8e, É: 0x90, Ê: 0x89, Í: 0x8b, Ó: 0x9f, Ô: 0x8c, Õ: 0x99, Ú: 0x96, Ü: 0x9a, Ç: 0x80, º: 0xa7, ª: 0xa6 };
const CP850 = { á: 0xa0, à: 0x85, â: 0x83, ã: 0xc6, é: 0x82, ê: 0x88, í: 0xa1, ó: 0xa2, ô: 0x93, õ: 0xe4, ú: 0xa3, ü: 0x81, ç: 0x87,
  Á: 0xb5, À: 0xb7, Â: 0xb6, Ã: 0xc7, É: 0x90, Ê: 0xd2, Í: 0xd6, Ó: 0xe0, Ô: 0xe2, Õ: 0xe5, Ú: 0xe9, Ü: 0x9a, Ç: 0x80, º: 0xa7, ª: 0xa6 };
const PAGINAS = { cp860: { tabela: CP860, n: 3 }, cp850: { tabela: CP850, n: 2 } };

function texto(s, pagina) {
  const out = [];
  const tab = PAGINAS[pagina]?.tabela;
  for (const ch of String(s).replace(/[·•]/g, "-").replace(/[–—]/g, "-").replace(/[✓]/g, "OK")) {
    const c = ch.charCodeAt(0);
    if (c < 128) out.push(c);
    else if (tab && tab[ch] != null) out.push(tab[ch]);
    else {
      const simples = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
      out.push(...[...simples].map((x) => (x.charCodeAt(0) < 128 ? x.charCodeAt(0) : 0x3f)));
    }
  }
  return out;
}

// imp.comandos: "escpos" (padrão: Control iD Print iD, Epson, Elgin e Bematech no modo ESC/POS)
//               "escbema" (Bematech configurada no modo próprio da marca, ESC/Bema)
// imp.tamanho:  tamanho das linhas em destaque (itens e títulos)
//               "grande"  = letra dupla (larga e alta) · "medio" = só mais alta · "pequeno" = normal, em negrito
// imp.fonte:    "A" (normal, padrão) ou "B" (compacta, menor ainda) · só ESC/POS
export function escpos(linhas, imp, acentosPadrao = "sem-acentos") {
  const pagina = imp.acentos || acentosPadrao;
  const largura = imp.colunas || 48;
  const bema = imp.comandos === "escbema";
  const negrito = (on) => (bema ? [ESC, on ? 0x45 : 0x46] : [ESC, 0x45, on ? 1 : 0]);
  const tam = imp.tamanho || "grande";
  const grande = (on) => {
    const larga = on && tam === "grande", alta = on && tam !== "pequeno";
    return bema ? [ESC, 0x57, larga ? 1 : 0, ESC, 0x64, alta ? 1 : 0] : [GS, 0x21, (larga ? 0x10 : 0) | (alta ? 0x01 : 0)];
  };
  const b = [ESC, 0x40]; // inicia
  if (!bema && imp.fonte === "B") b.push(ESC, 0x4d, 1); // fonte compacta
  if (PAGINAS[pagina] && !bema) b.push(ESC, 0x74, PAGINAS[pagina].n);
  for (const l of linhas) {
    if (l.sep) { b.push(...texto("-".repeat(largura), pagina), 0x0a); continue; }
    b.push(ESC, 0x61, l.c ? 1 : 0); // alinhamento
    b.push(...negrito(l.b), ...grande(l.g));
    b.push(...texto(l.t, pagina), 0x0a);
  }
  b.push(ESC, 0x61, 0, ...negrito(false), ...grande(false));
  b.push(...Array(imp.avanco ?? 4).fill(0x0a));
  if (imp.corte !== false) b.push(...(bema ? [ESC, 0x6d] : [GS, 0x56, 0x42, 0x00])); // corte parcial
  if (imp.bip && !bema) b.push(ESC, 0x42, 2, 2);
  return Buffer.from(b);
}

// ------------------------------------------------------------------ envio
function enviarRede(imp, dados) {
  return new Promise((ok, falha) => {
    const s = connect({ host: imp.ip, port: imp.porta || 9100 }, () => s.end(dados));
    s.setTimeout(8000, () => { s.destroy(); falha(new Error(`sem resposta de ${imp.ip}`)); });
    s.on("close", (erro) => !erro && ok());
    s.on("error", falha);
  });
}

function enviarWindows(imp, dados) {
  // Impressora compartilhada no Windows (ex.: nome de compartilhamento "COZINHA").
  const arq = join(tmpdir(), `cupom-${Date.now()}-${Math.random().toString(36).slice(2)}.bin`);
  writeFileSync(arq, dados);
  const destino = imp.compartilhamento.startsWith("\\\\") ? imp.compartilhamento : `\\\\localhost\\${imp.compartilhamento}`;
  return new Promise((ok, falha) => {
    execFile("cmd", ["/c", "copy", "/b", arq, destino], { windowsHide: true }, (erro, saida, err) => {
      try { unlinkSync(arq); } catch {}
      erro ? falha(new Error((err || saida || erro.message).trim())) : ok();
    });
  });
}

function enviarArquivo(imp, dados) {
  writeFileSync(imp.caminho, dados); // ex.: /dev/usb/lp0 no Linux
}

export async function imprimir(job, imp, acentosPadrao) {
  if (!imp) throw new Error(`impressora "${job.impressora}" não está no config.json`);
  const dados = escpos(job.linhas, imp, acentosPadrao);
  if (imp.tipo === "rede") return enviarRede(imp, dados);
  if (imp.tipo === "windows") return enviarWindows(imp, dados);
  if (imp.tipo === "arquivo") return enviarArquivo(imp, dados);
  if (imp.tipo === "teste") {
    console.log("\n" + job.linhas.map((l) => (l.sep ? "-".repeat(imp.colunas || 48) : l.t)).join("\n") + "\n");
    return;
  }
  throw new Error(`tipo "${imp.tipo}" desconhecido (use rede, windows, arquivo ou teste)`);
}
