// Lista de produtos com busca e categorias, para o garçom e o caixa lançarem itens.
import { $, $$, esc, brl } from "../ui.js";
import { D } from "../regras.js";
import { montarItem } from "./item.js";

const sem = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function seletorProdutos(el, aoAdicionar, { entrega = false } = {}) {
  let cat = D.categorias[0]?.id;
  let busca = "";
  const desenhar = () => {
    const cats = D.categorias.filter((c) => D.produtos.some((p) => p.cat === c.id && p.ativo !== false));
    if (!cats.some((c) => c.id === cat)) cat = cats[0]?.id;
    const q = sem(busca);
    const lista = D.produtos.filter((p) => p.ativo !== false && (q ? sem(p.nome + " " + p.desc).includes(q) || sem(p.id) === q : p.cat === cat));
    el.innerHTML = `<input class="in busca" type="search" placeholder="Buscar produto…" value="${esc(busca)}" aria-label="Buscar produto">
      <div class="chips" ${q ? "hidden" : ""}>${cats.map((c) => `<button class="chip" data-gc="${esc(c.id)}" aria-pressed="${c.id === cat}">${esc(c.nome)}</button>`).join("")}</div>
      <div class="g-lista">${lista.map((p) => `<button class="g-it" data-gp="${esc(p.id)}"><span><b>${esc(p.nome)}</b>${q ? `<small>${esc(D.categorias.find((c) => c.id === p.cat)?.nome || "")}</small>` : ""}</span><span>${brl(p.preco)}</span></button>`).join("") || `<p class="vazio">Nada encontrado.</p>`}</div>`;
    const inp = $(".busca", el);
    inp.oninput = () => { busca = inp.value; const pos = inp.selectionStart; desenhar(); const n = $(".busca", el); n.focus(); n.setSelectionRange(pos, pos); };
    $$("[data-gc]", el).forEach((b) => (b.onclick = () => { cat = b.dataset.gc; desenhar(); }));
    $$("[data-gp]", el).forEach((b) => (b.onclick = () => {
      const p = D.produtos.find((x) => x.id === b.dataset.gp);
      montarItem(p, aoAdicionar, { entrega, rapido: true });
    }));
  };
  desenhar();
  return desenhar;
}

// Lista de itens (rascunho ou já lançados)
export const linhaItem = (i, { acoes = "" } = {}) =>
  `<div class="cl ${i.cancelado ? "cancelado" : ""}"><div class="n"><b>${i.qtd}x ${esc(i.nome)}</b>${(i.det || []).map((d) => `<small>${esc(d)}</small>`).join("")}${i.obs ? `<small class="obs">Obs: ${esc(i.obs)}</small>` : ""}${i.cancelado ? `<small>Cancelado${i.motivo ? ": " + esc(i.motivo) : ""}</small>` : ""}</div>
    <div class="v">${brl(i.unit * i.qtd)}${acoes}</div></div>`;
