// Janela de montar item (tamanho, sabores, borda, opção, observação, quantidade).
// Usada pelo cardápio do cliente, pelo garçom e pelo caixa.
import { $, $$, esc, brl, abrirSheet, fecharSheet, cabecalhoSheet } from "../ui.js";
import { D, loja, categoria, setorDe, produto } from "../regras.js";

const grupo = (p) => categoria(p.cat)?.grupoPizza || "";
const saboresPossiveis = (p, entrega) =>
  D.produtos.filter((x) => x.tipo === "pizza" && x.ativo !== false && grupo(x) === grupo(p) && !(entrega && x.semEntrega));

export function montarItem(p, aoAdicionar, { entrega = false, rapido = false } = {}) {
  // Item simples sem opções: no garçom/caixa entra direto com 1 toque.
  if (rapido && p.tipo !== "pizza" && !(p.opcoes || []).length) {
    aoAdicionar(criar(p, { qtd: 1 }));
    return;
  }
  const pizza = p.tipo === "pizza";
  const broto = pizza && p.precoBroto;
  const bordas = grupo(p) === "salgada" ? loja().bordas || [] : [];
  const outros = pizza ? saboresPossiveis(p, entrega).filter((x) => x.id !== p.id) : [];
  const cat = categoria(p.cat);
  let qtd = 1;

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
    <label class="f" for="obs">Observação</label>
    <input class="in" id="obs" placeholder="Ex.: sem cebola, bem passada" maxlength="120">
    <div class="addrow"><div class="qtd"><button id="qm" aria-label="Diminuir">−</button><span id="qv">1</span><button id="qp" aria-label="Aumentar">+</button></div>
      <button class="btn pri" id="add"><span>Adicionar</span><span id="ap"></span></button></div></div>`, { nivel: 2 });

  const val = (n) => $(`input[name="${n}"]:checked`, s)?.value;
  const ler = () => {
    const tam = broto ? val("tam") : "G";
    const dois = val("ns") === "2";
    const segundo = dois ? produto($("#s2sel", s)?.value) : null;
    const bi = val("bor");
    return { tam, segundo, borda: bi === "" || bi == null ? null : bordas[+bi], opcao: val("op"), obs: $("#obs", s).value.trim(), qtd };
  };
  const atualizar = () => {
    const o = ler();
    $("#qv", s).textContent = qtd;
    $("#ap", s).textContent = brl(criar(p, o).unit * qtd);
    const s2 = $("#s2", s);
    if (s2) s2.hidden = val("ns") !== "2";
  };
  $$("input,select", s).forEach((i) => i.addEventListener("change", atualizar));
  $("#qm", s).onclick = () => { if (qtd > 1) { qtd--; atualizar(); } };
  $("#qp", s).onclick = () => { qtd++; atualizar(); };
  $("#add", s).onclick = () => { aoAdicionar(criar(p, ler())); fecharSheet(); };
  atualizar();
}

// Monta a linha do pedido a partir do produto e das escolhas.
export function criar(p, { tam = "G", segundo = null, borda = null, opcao = "", obs = "", qtd = 1 } = {}) {
  const cat = categoria(p.cat);
  const base = { produtoId: p.id, setor: setorDe(p), qtd, obs: obs || "", det: [] };
  if (p.tipo !== "pizza") {
    return { ...base, nome: (cat?.prefixo || "") + p.nome + (opcao ? ` (${opcao})` : ""), unit: Number(p.preco) || 0 };
  }
  const preco = (x) => (tam === "B" && x.precoBroto ? x.precoBroto : x.preco);
  const sabores = segundo ? [p, segundo] : [p];
  let unit = Math.max(...sabores.map((x) => Number(preco(x)) || 0));
  const det = segundo ? sabores.map((x) => `1/2 ${x.nome}`) : [];
  if (borda) { unit += Number(borda.preco) || 0; det.push(`Borda ${borda.nome}`); }
  const tamanho = p.precoBroto ? (tam === "B" ? " brotinho" : " grande") : "";
  return { ...base, nome: `Pizza${tamanho}${segundo ? " meio a meio" : " " + p.nome}`, det, unit };
}
