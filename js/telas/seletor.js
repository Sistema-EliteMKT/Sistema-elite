// Lista de produtos com busca e categorias (mesmo visual do cardápio), para o garçom e o caixa.
// onde: "mesa" esconde o que é só de delivery; "delivery" esconde o que é só de mesa.
import { $, $$, esc, brl } from "../ui.js";
import { D, vendeEm } from "../regras.js";
import { montarItem } from "./item.js";

const sem = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function seletorProdutos(el, aoAdicionar, { onde = "" } = {}) {
  let cat = null;
  let busca = "";
  const desenhar = () => {
    const prods = D.produtos.filter((p) => vendeEm(p, onde));
    const cats = D.categorias.filter((c) => prods.some((p) => p.cat === c.id));
    if (!cats.some((c) => c.id === cat)) cat = cats[0]?.id;
    const q = sem(busca);
    const lista = prods.filter((p) => (q ? sem(p.nome + " " + p.desc).includes(q) : p.cat === cat));
    el.innerHTML = `<div class="sel-topo"><input class="in busca" type="search" placeholder="Buscar item (ex.: calabresa)" value="${esc(busca)}" aria-label="Buscar item">
      <div class="chips" ${q ? "hidden" : ""}>${cats.map((c) => `<button class="chip" data-gc="${esc(c.id)}" aria-pressed="${c.id === cat}">${esc(c.nome)}</button>`).join("")}</div></div>
      <div class="sel-lista">${lista.map((p) => `<button class="it" data-gp="${esc(p.id)}"><span class="n"><b>${esc(p.nome)}</b>${q ? `<small>${esc(D.categorias.find((c) => c.id === p.cat)?.nome || "")}</small>` : p.desc ? `<small>${esc(p.desc)}</small>` : ""}</span>
        <span class="p">${brl(p.preco)}</span><span class="plus" aria-hidden="true">+</span></button>`).join("") || `<p class="vazio">Nada encontrado.</p>`}</div>`;
    const inp = $(".busca", el);
    inp.oninput = () => { busca = inp.value; const pos = inp.selectionStart; desenhar(); const n = $(".busca", el); n.focus(); n.setSelectionRange(pos, pos); };
    $$("[data-gc]", el).forEach((b) => (b.onclick = () => { cat = b.dataset.gc; desenhar(); }));
    $$("[data-gp]", el).forEach((b) => (b.onclick = () => {
      const p = D.produtos.find((x) => x.id === b.dataset.gp);
      montarItem(p, aoAdicionar, { onde, rapido: true });
    }));
  };
  desenhar();
  return desenhar;
}

// Linha de item (rascunho ou já lançado)
export const linhaItem = (i, { acoes = "" } = {}) =>
  `<div class="cl ${i.cancelado ? "cancelado" : ""}"><div class="n"><b>${i.qtd}x ${esc(i.nome)}</b>${(i.det || []).map((d) => `<small>${esc(d)}</small>`).join("")}${i.obs ? `<small class="obs">Obs: ${esc(i.obs)}</small>` : ""}${i.cancelado ? `<small>Cancelado${i.motivo ? ": " + esc(i.motivo) : ""}</small>` : ""}</div>
    <div class="v">${brl(i.unit * i.qtd)}${acoes}</div></div>`;
