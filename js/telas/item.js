// Janela de montar item (tamanho, sabores, borda, adicionais, opção, observação, quantidade).
// Usada pelo cardápio do cliente, pelo garçom e pelo caixa.
// onde: "mesa" (garçom/comanda) ou "delivery" (cardápio online, entrega, retirada, balcão).
import { $, $$, esc, brl, abrirSheet, fecharSheet, cabecalhoSheet } from "../ui.js";
import { D, loja, categoria, setorDe, produto, vendeEm } from "../regras.js";

const grupo = (p) => categoria(p.cat)?.grupoPizza || "";
const saboresPossiveis = (p, onde) =>
  D.produtos.filter((x) => x.tipo === "pizza" && grupo(x) === grupo(p) && vendeEm(x, onde));

// inicial: escolhas de um item já montado (botão Editar), para abrir a janela preenchida.
export function montarItem(p, aoAdicionar, { onde = "", rapido = false, inicial = null } = {}) {
  const cat = categoria(p.cat);
  // Adicionais só na mesa, da lista do grupo do produto (Pizza, Esfiha, Pastel…).
  const grupoAd = p.grupoAdicional ?? cat?.grupoAdicional ?? "";
  const adicionais = onde === "mesa" && grupoAd ? (loja().adicionais || []).filter((a) => a.grupo === grupoAd) : [];
  // Item simples sem opções: no garçom/caixa entra direto com 1 toque.
  if (rapido && !inicial && p.tipo !== "pizza" && !(p.opcoes || []).length && !adicionais.length) {
    aoAdicionar(criar(p, { qtd: 1 }));
    return;
  }
  const pizza = p.tipo === "pizza";
  const broto = pizza && p.precoBroto;
  const bordas = grupo(p) === "salgada" ? loja().bordas || [] : [];
  const outros = pizza ? saboresPossiveis(p, onde).filter((x) => x.id !== p.id) : [];
  let qtd = inicial?.qtd || 1;

  const s = abrirSheet(`${cabecalhoSheet(pizza ? `Pizza ${p.nome}` : (cat?.prefixo || "") + p.nome, p.desc)}<div class="sh-b">
    ${pizza ? `
      ${broto ? `<div class="grp">Tamanho</div><div class="opts dois">
        <label class="opt"><input type="radio" name="tam" value="G" checked><span>Grande<br><em>${brl(p.preco)}</em></span></label>
        <label class="opt"><input type="radio" name="tam" value="B"><span>Brotinho<br><em>${brl(p.precoBroto)}</em></span></label></div>` : ""}
      ${outros.length ? `<div class="grp">Sabores <small>vale o preço do mais caro</small></div>
      <div class="opts dois"><label class="opt"><input type="radio" name="ns" value="1" checked><span>1 sabor</span></label>
        <label class="opt"><input type="radio" name="ns" value="2"><span>Meio a meio</span></label></div>
      <div class="sabor" id="s2" hidden><span class="muted">2º sabor</span><select class="in" id="s2sel">
        ${outros.map((x) => `<option value="${esc(x.id)}">${esc(x.nome)} · ${brl(x.preco)}</option>`).join("")}</select></div>` : ""}
      ${bordas.length ? `<div class="grp">Borda</div><div class="opts">
        <label class="opt"><input type="radio" name="bor" value="" checked><span>Sem borda</span></label>
        ${bordas.map((b, i) => `<label class="opt"><input type="radio" name="bor" value="${i}"><span>${esc(b.nome)}</span><em>+ ${brl(b.preco)}</em></label>`).join("")}</div>` : ""}
    ` : ""}
    ${(p.opcoes || []).length ? `<div class="grp">Escolha</div><div class="opts dois">${p.opcoes.map((o, i) =>
      `<label class="opt"><input type="radio" name="op" value="${esc(o)}" ${i ? "" : "checked"}><span>${esc(o)}</span></label>`).join("")}</div>` : ""}
    ${adicionais.length ? `<div class="grp">Adicionais <small>só na mesa · pode marcar vários</small></div><div class="opts">${adicionais.map((a, i) =>
      `<label class="opt"><input type="checkbox" name="ad" value="${i}"><span>${esc(a.nome)}</span><em>+ ${brl(a.preco)}</em></label>
       ${a.livre ? `<input class="in livre" data-livre="${i}" placeholder="Qual adicional? (ex.: bacon)" hidden>` : ""}`).join("")}</div>` : ""}
    <label class="f" for="obs">Observação</label>
    <input class="in" id="obs" placeholder="Ex.: sem cebola, bem passada" maxlength="120">
    <div class="addrow"><div class="qtd"><button id="qm" aria-label="Diminuir">−</button><span id="qv">1</span><button id="qp" aria-label="Aumentar">+</button></div>
      <button class="btn pri" id="add"><span>Adicionar</span><span id="ap"></span></button></div></div>`, { nivel: 2 });

  const val = (n) => $(`input[name="${n}"]:checked`, s)?.value;
  const ler = () => {
    const tam = broto ? val("tam") : "G";
    const segundo = val("ns") === "2" ? produto($("#s2sel", s)?.value) : null;
    const bi = val("bor");
    return {
      tam, segundo, borda: bi === "" || bi == null ? null : bordas[+bi], opcao: val("op"),
      extras: $$('input[name="ad"]:checked', s).map((i) => {
        const a = adicionais[+i.value];
        const qual = a.livre ? $(`[data-livre="${i.value}"]`, s)?.value.trim() : "";
        return qual ? { ...a, base: a.nome, qual, nome: `${a.nome.replace(/^Outros adicionais/i, "Adicional")}: ${qual}` } : a;
      }),
      obs: $("#obs", s).value.trim(), qtd,
    };
  };
  const atualizar = () => {
    $("#qv", s).textContent = qtd;
    $("#ap", s).textContent = brl(criar(p, ler()).unit * qtd);
    const s2 = $("#s2", s);
    if (s2) s2.hidden = val("ns") !== "2";
    $$("[data-livre]", s).forEach((t) => (t.hidden = !$(`input[name="ad"][value="${t.dataset.livre}"]`, s).checked));
  };
  if (inicial) preencher(s, inicial, { bordas, adicionais });
  $$("input,select", s).forEach((i) => i.addEventListener("change", atualizar));
  $("#qm", s).onclick = () => { if (qtd > 1) { qtd--; atualizar(); } };
  $("#qp", s).onclick = () => { qtd++; atualizar(); };
  $("#add", s).onclick = () => {
    const semNome = $$("[data-livre]", s).find((t) => !t.hidden && !t.value.trim());
    if (semNome) { semNome.focus(); semNome.placeholder = "Escreva qual é o adicional"; semNome.classList.add("falta"); return; }
    aoAdicionar(criar(p, ler())); fecharSheet();
  };
  if (inicial) $("#add span", s).textContent = "Salvar alteração";
  atualizar();
}

// Botão "Editar": reabre a janela do item com as escolhas feitas; aoSalvar recebe o item novo.
export function editarItem(item, onde, aoSalvar) {
  const p = produto(item.produtoId);
  if (!p) return;
  montarItem(p, aoSalvar, { onde, inicial: { ...(item.escolhas || {}), obs: item.obs, qtd: item.qtd } });
}

// Marca na janela as escolhas guardadas no item (para editar).
function preencher(s, e, { bordas, adicionais }) {
  const marcar = (sel) => { const i = $(sel, s); if (i) i.checked = true; };
  if (e.tam) marcar(`input[name="tam"][value="${e.tam}"]`);
  if (e.segundo) { marcar('input[name="ns"][value="2"]'); const sel = $("#s2sel", s); if (sel) sel.value = e.segundo; }
  if (e.borda) { const i = bordas.findIndex((b) => b.nome === e.borda); if (i >= 0) marcar(`input[name="bor"][value="${i}"]`); }
  if (e.opcao) $$('input[name="op"]', s).forEach((i) => (i.checked = i.value === e.opcao));
  for (const x of e.extras || []) {
    const i = adicionais.findIndex((a) => a.nome === x.nome);
    if (i < 0) continue;
    marcar(`input[name="ad"][value="${i}"]`);
    const t = $(`[data-livre="${i}"]`, s);
    if (t && x.qual) t.value = x.qual;
  }
  if (e.obs) $("#obs", s).value = e.obs;
}

// Monta a linha do pedido a partir do produto e das escolhas.
export function criar(p, { tam = "G", segundo = null, borda = null, opcao = "", extras = [], obs = "", qtd = 1 } = {}) {
  const cat = categoria(p.cat);
  const escolhas = {
    tam, segundo: segundo?.id || null, borda: borda?.nome || null, opcao: opcao || "", obs: obs || "", qtd,
    extras: extras.map((a) => ({ nome: a.base || a.nome, qual: a.qual || "" })),
  };
  const base = { produtoId: p.id, setor: setorDe(p), qtd, obs: obs || "", det: [], escolhas };
  const somaExtras = extras.reduce((t, a) => t + (Number(a.preco) || 0), 0);
  const detExtras = extras.map((a) => `+ ${a.nome}`);
  if (p.tipo !== "pizza") {
    return { ...base, nome: (cat?.prefixo || "") + p.nome + (opcao ? ` (${opcao})` : ""), det: detExtras, unit: (Number(p.preco) || 0) + somaExtras };
  }
  const preco = (x) => (tam === "B" && x.precoBroto ? x.precoBroto : x.preco);
  const sabores = segundo ? [p, segundo] : [p];
  let unit = Math.max(...sabores.map((x) => Number(preco(x)) || 0)) + somaExtras;
  const det = segundo ? sabores.map((x) => `1/2 ${x.nome}`) : [];
  if (borda) { unit += Number(borda.preco) || 0; det.push(`Borda ${borda.nome}`); }
  det.push(...detExtras);
  const tamanho = p.precoBroto ? (tam === "B" ? " brotinho" : " grande") : "";
  return { ...base, nome: `Pizza${tamanho}${segundo ? " meio a meio" : " " + p.nome}`, det, unit };
}
