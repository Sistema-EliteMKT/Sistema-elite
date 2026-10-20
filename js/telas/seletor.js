// Lista de produtos com busca e categorias (mesmo visual do cardápio), para o garçom e o caixa.
// onde: "mesa" esconde o que é só de delivery; "delivery" esconde o que é só de mesa.
import { $, $$, esc, brl } from "../ui.js";
import { D, vendeEm } from "../regras.js";
import { montarItem } from "./item.js";

const sem = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// Abas: as categorias de pizza (salgadas, especiais e doces) ficam numa aba só, "Pizzas",
// uma embaixo da outra; as outras categorias têm aba própria.
function abasDe(cats) {
  const abas = [];
  for (const c of cats) {
    if (c.grupoPizza) {
      let aba = abas.find((a) => a.id === "pizzas-todas");
      if (!aba) abas.push((aba = { id: "pizzas-todas", nome: "Pizzas", cats: [] }));
      aba.cats.push(c);
    } else abas.push({ id: c.id, nome: c.nome, cats: [c] });
  }
  return abas;
}

export function seletorProdutos(el, aoAdicionar, { onde = "" } = {}) {
  let aba = null;
  let busca = "";
  let geral = false; // true: a busca olha todas as abas (botão "Buscar em todas")
  const item = (p, sub = "") => `<button class="it" data-gp="${esc(p.id)}"><span class="n"><b>${esc(p.nome)}</b>${sub ? `<small>${esc(sub)}</small>` : p.desc ? `<small>${esc(p.desc)}</small>` : ""}</span>
        <span class="p">${brl(p.preco)}</span><span class="plus" aria-hidden="true">+</span></button>`;
  const desenhar = () => {
    const prods = D.produtos.filter((p) => vendeEm(p, onde));
    const abas = abasDe(D.categorias.filter((c) => prods.some((p) => p.cat === c.id)));
    if (!abas.some((a) => a.id === aba)) aba = abas[0]?.id;
    const atual = abas.find((x) => x.id === aba);
    const q = sem(busca);
    let lista;
    if (q) {
      // Por padrão procura só dentro da aba aberta (ex.: "catupiry" em Esfihas não traz pizza).
      const escopo = geral ? prods : prods.filter((p) => atual?.cats.some((c) => c.id === p.cat));
      const achados = escopo.filter((p) => sem(p.nome + " " + p.desc).includes(q));
      lista = achados.map((p) => item(p, geral ? D.categorias.find((c) => c.id === p.cat)?.nome || "" : "")).join("");
      if (!achados.length) lista = `<p class="vazio">Nada encontrado ${geral ? "no cardápio" : `em ${esc(atual?.nome || "esta aba")}`}.</p>`;
      if (!geral) lista += `<button class="btn ghost cheio" id="geral">Buscar em todas as abas</button>`;
    } else {
      lista = (atual?.cats || []).map((c) => {
        const its = prods.filter((p) => p.cat === c.id).map((p) => item(p)).join("");
        return atual.cats.length > 1 ? `<h4 class="sel-sec">${esc(c.nome)}</h4>${its}` : its;
      }).join("");
    }
    el.innerHTML = `<div class="sel-topo"><input class="in busca" type="search" placeholder="${geral && q ? "Buscar em todas as abas" : `Buscar em ${esc(atual?.nome || "")}`}" value="${esc(busca)}" aria-label="Buscar item">
      <div class="chips">${abas.map((a) => `<button class="chip" data-gc="${esc(a.id)}" aria-pressed="${a.id === aba && !(geral && q)}">${esc(a.nome)}</button>`).join("")}</div></div>
      <div class="sel-lista">${lista || `<p class="vazio">Nada aqui.</p>`}</div>`;
    const inp = $(".busca", el);
    inp.oninput = () => { busca = inp.value; if (!busca.trim()) geral = false; const pos = inp.selectionStart; desenhar(); const n = $(".busca", el); n.focus(); n.setSelectionRange(pos, pos); };
    $("#geral", el) && ($("#geral", el).onclick = () => { geral = true; desenhar(); });
    // Trocar de aba com algo digitado: a busca continua, agora na aba nova.
    $$("[data-gc]", el).forEach((b) => (b.onclick = () => { aba = b.dataset.gc; geral = false; desenhar(); el.querySelector(".sel-lista")?.scrollTo?.(0, 0); }));
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
