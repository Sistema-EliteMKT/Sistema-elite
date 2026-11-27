// Relatório em PDF para a contabilidade: tudo o que foi vendido e os cupons fiscais (NFC-e) de um período.
// Abre uma página de impressão; em "Imprimir" escolha "Salvar como PDF". Não é nota fiscal: é um relatório.
import { $, esc, brl, toast, erro } from "../ui.js";
import { D, loja, diaOperacional } from "../regras.js";
import { store } from "../store.js";

const dm = (d) => String(d || "").split("-").reverse().join("/");
const hhmm = (t) => (t ? new Date(t).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "");
const r2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const so = (v) => String(v || "").replace(/\D/g, "");
const cnpjTxt = (v) => so(v).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
const docTxt = (v) => { const d = so(v); return d.length === 14 ? cnpjTxt(d) : d.length === 11 ? d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4") : ""; };

// Monta os números do período a partir dos recebimentos (pagamentos) do banco.
export function resumirPeriodo(pags) {
  const porForma = {}, produtos = {};
  let vendas = 0, fiado = 0, desconto = 0, servico = 0;
  for (const p of pags) {
    let troco = r2(p.troco);
    for (const x of p.pagamentos || []) {
      let v = r2(x.valor);
      if (x.forma === "Dinheiro" && troco > 0) { const t = Math.min(troco, v); v = r2(v - t); troco = r2(troco - t); }
      if (x.forma === "Convênio") fiado += v; // fiado de funcionário: não é dinheiro que entrou
      else porForma[x.forma] = r2((porForma[x.forma] || 0) + v);
    }
    vendas += r2(p.total); desconto += r2(p.desconto); servico += r2(p.servico);
    for (const i of p.itensFiscais || []) {
      const k = String(i.desc || "").trim();
      const a = (produtos[k] ||= { qtd: 0, valor: 0 });
      a.qtd += Number(i.qtd) || 0; a.valor = r2(a.valor + (Number(i.vTotal) || 0));
    }
  }
  const nfs = pags.filter((p) => p.nfce?.numero && ["autorizado", "cancelado"].includes(p.nfce.status));
  const validas = nfs.filter((p) => p.nfce.status === "autorizado" && p.nfce.ambiente === "producao");
  const canceladas = nfs.filter((p) => p.nfce.status === "cancelado" && p.nfce.ambiente === "producao");
  const teste = nfs.filter((p) => p.nfce.ambiente !== "producao");
  const semNota = pags.filter((p) => !p.nfce || ["nenhuma", "pendente", "erro", "enviando"].includes(p.nfce.status));
  return {
    vendas: r2(vendas), fiado: r2(fiado), desconto: r2(desconto), servico: r2(servico), porForma, produtos,
    validas, canceladas, teste, semNota, contas: pags.length,
    valorNotas: r2(validas.reduce((t, p) => t + r2(p.total), 0)), valorSemNota: r2(semNota.reduce((t, p) => t + r2(p.total), 0)),
  };
}

function paginaHtml(de, ate, pags) {
  const f = D.fiscal || {}, lj = loja(), s = resumirPeriodo(pags);
  const linhasForma = Object.entries(s.porForma).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<tr><td>${esc(k)}</td><td class="d">${brl(v)}</td></tr>`).join("");
  const linhasProd = Object.entries(s.produtos).sort((a, b) => b[1].valor - a[1].valor).map(([k, v]) => `<tr><td>${esc(k)}</td><td class="d">${v.qtd}</td><td class="d">${brl(v.valor)}</td></tr>`).join("");
  const ordenadas = [...s.validas, ...s.canceladas].sort((a, b) => (a.nfce.numero || 0) - (b.nfce.numero || 0) || a.criadoEm - b.criadoEm);
  const linhasNotas = ordenadas.map((p) => `<tr><td>${esc(p.nfce.numero)}</td><td>${esc(hhmm(p.criadoEm))}</td><td>${esc(p.nfce.status === "cancelado" ? "cancelada" : "autorizada")}</td><td>${esc([...new Set((p.pagamentos || []).map((x) => x.forma))].join(" + "))}</td><td>${esc(docTxt(p.cpf))}</td><td class="d">${brl(p.total)}</td></tr>`).join("");
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Relatório ${esc(dm(de))} a ${esc(dm(ate))}</title>
<style>
  body{font:13px/1.45 Arial,Helvetica,sans-serif;color:#000;margin:24px}
  h1{font-size:19px;margin:0 0 2px} h2{font-size:14px;margin:18px 0 6px;border-bottom:1.5px solid #000;padding-bottom:3px}
  .sub{color:#333;margin:0 0 4px} table{border-collapse:collapse;width:100%} th,td{padding:4px 6px;border-bottom:1px solid #bbb;text-align:left;vertical-align:top}
  th{background:#eee;font-size:12px} .d{text-align:right;white-space:nowrap} .tot td{font-weight:700;border-top:2px solid #000}
  .kpi{display:flex;gap:10px;flex-wrap:wrap;margin:8px 0} .kpi div{border:1px solid #888;padding:8px 12px;min-width:150px} .kpi b{display:block;font-size:17px}
  .aviso{margin-top:18px;font-size:11.5px;color:#333} .nao{page-break-inside:avoid}
  @media print{body{margin:10mm} button{display:none}}
</style></head><body>
<button onclick="window.print()" style="padding:8px 14px;font-size:14px;margin-bottom:12px">Imprimir / Salvar como PDF</button>
<h1>Relatório de vendas e cupons fiscais</h1>
<p class="sub"><b>${esc(f.razaoSocial || lj.nome)}</b>${f.fantasia ? ` · ${esc(f.fantasia)}` : ""}</p>
<p class="sub">${esc([f.cnpj ? `CNPJ ${cnpjTxt(f.cnpj)}` : "", f.ie ? `IE ${f.ie}` : "", [f.logradouro, f.numero, f.bairro, f.cidade && f.uf ? `${f.cidade}-${f.uf}` : ""].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}</p>
<p class="sub"><b>Período: ${esc(dm(de))} a ${esc(dm(ate))}</b> · gerado em ${esc(new Date().toLocaleString("pt-BR"))}</p>
<div class="kpi nao"><div>Vendas (${s.contas} contas)<b>${brl(s.vendas)}</b></div><div>Cupons fiscais emitidos<b>${s.validas.length} · ${brl(s.valorNotas)}</b></div><div>Vendas sem cupom fiscal<b>${s.semNota.length} · ${brl(s.valorSemNota)}</b></div></div>
<h2>Recebido por forma de pagamento</h2>
<table class="nao"><tr><th>Forma</th><th class="d">Valor</th></tr>${linhasForma || `<tr><td colspan="2">Sem vendas no período.</td></tr>`}
${s.fiado ? `<tr><td>Fiado de funcionários (Convênio, ainda não recebido)</td><td class="d">${brl(s.fiado)}</td></tr>` : ""}</table>
${s.desconto || s.servico ? `<p class="sub">Descontos dados: ${brl(s.desconto)} · Taxa de serviço cobrada: ${brl(s.servico)}</p>` : ""}
<h2>Cupons fiscais eletrônicos (NFC-e)</h2>
<p class="sub">Autorizadas: ${s.validas.length} (${brl(s.valorNotas)}) · Canceladas: ${s.canceladas.length}${s.teste.length ? ` · Notas de teste (sem valor fiscal, fora da soma): ${s.teste.length}` : ""}</p>
<table><tr><th>Nº</th><th>Data/hora</th><th>Situação</th><th>Pagamento</th><th>CPF/CNPJ na nota</th><th class="d">Valor</th></tr>${linhasNotas || `<tr><td colspan="6">Nenhum cupom fiscal no período.</td></tr>`}</table>
<h2>Produtos vendidos</h2>
<table><tr><th>Produto</th><th class="d">Qtde</th><th class="d">Valor</th></tr>${linhasProd || `<tr><td colspan="3">Sem vendas no período.</td></tr>`}
<tr class="tot"><td>Total dos itens</td><td class="d">${Object.values(s.produtos).reduce((t, v) => t + v.qtd, 0)}</td><td class="d">${brl(Object.values(s.produtos).reduce((t, v) => t + v.valor, 0))}</td></tr></table>
<p class="aviso">Este documento é um relatório gerencial para prestação de contas. Não é nota fiscal. Os cupons fiscais (NFC-e) válidos são os autorizados pela SEFAZ, que podem ser consultados pela chave de acesso.</p>
</body></html>`;
}

export function cardRelatorioContabil(el) {
  const fim = diaOperacional();
  const primeiro = fim.slice(0, 8) + "01";
  el.innerHTML = `<div class="grp">Relatório em PDF para a contabilidade</div>
    <p class="muted pq">Escolha as datas. Sai um relatório com as vendas, os cupons fiscais e os produtos do período. Na janela que abrir, clique em <b>Imprimir / Salvar como PDF</b>.</p>
    <div class="opts dois"><div><label class="f" for="rcDe">De</label><input class="in" id="rcDe" type="date" value="${esc(primeiro)}"></div>
      <div><label class="f" for="rcAte">Até</label><input class="in" id="rcAte" type="date" value="${esc(fim)}"></div></div>
    <div class="err" id="rcErr"></div>
    <button class="btn pri" id="rcGerar">Gerar relatório (PDF)</button>`;
  $("#rcGerar", el).onclick = async (ev) => {
    const de = $("#rcDe", el).value, ate = $("#rcAte", el).value, e = $("#rcErr", el);
    e.textContent = "";
    if (!de || !ate) return (e.textContent = "Escolha as duas datas.");
    if (ate < de) return (e.textContent = "A data final é antes da inicial.");
    if ((new Date(ate) - new Date(de)) / 86400000 > 92) return (e.textContent = "Escolha no máximo 3 meses por vez.");
    const w = window.open("", "_blank"); // abre já, no clique, para o navegador não bloquear
    if (!w) return (e.textContent = "O navegador bloqueou a janela. Permita pop-ups para este site e tente de novo.");
    w.document.write("<p style='font:16px Arial;margin:30px'>Buscando as vendas do período…</p>");
    const btn = ev.currentTarget; btn.disabled = true;
    try {
      const pags = await store.consultar("pagamentos", [["dia", ">=", de], ["dia", "<=", ate]]);
      pags.sort((a, b) => (a.criadoEm || 0) - (b.criadoEm || 0));
      w.document.open(); w.document.write(paginaHtml(de, ate, pags)); w.document.close();
      toast(`Relatório pronto: ${pags.length} contas.`, "bom");
    } catch (x) { try { w.close(); } catch {} erro(x); }
    btn.disabled = false;
  };
}
