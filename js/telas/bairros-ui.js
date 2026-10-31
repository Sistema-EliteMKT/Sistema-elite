// Entrega por bairro: cadastro dos bairros/condomínios com a taxa de cada um e a chave que liga isso no cardápio online.
// Enquanto a chave estiver desligada, o cardápio continua como está (taxa pelo mapa/CEP).
import { $, $$, esc, brl, numero, toast, erro, abrirSheet, fecharSheet, cabecalhoSheet, valorCampo } from "../ui.js";
import { loja } from "../regras.js";
import { store } from "../store.js";

const semAc = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function cardBairros(el) {
  const desenhar = () => {
    const lj = loja();
    const lista = lj.taxasEntrega || [];
    const ligado = lj.entregaModo === "bairro";
    el.innerHTML = `<b>📋 Entrega por bairro (cardápio online)</b>
      <p class="muted pq">Cadastre aqui cada bairro ou condomínio com a taxa. Quando você ligar a chave abaixo, o cliente do cardápio escolhe o bairro e a taxa já vem certa, sem depender do mapa. Enquanto estiver desligada, nada muda para o cliente.</p>
      <div class="sum"><div><span>Bairros cadastrados</span><span>${lista.length}</span></div>
        <div><span>No cardápio online agora</span><span>${ligado ? "✅ cliente escolhe o bairro" : "mapa / CEP (como estava)"}</span></div></div>
      ${lista.length ? `<details class="track-itens"><summary>Ver a lista</summary>${lista.map((b) => `<div class="cl"><span>${esc(b.nome)}</span><span>${brl(b.taxa)}</span></div>`).join("")}</details>` : ""}
      <div class="linha-btn wrap"><button class="btn pri" id="bcEd">${lista.length ? "Editar bairros" : "Cadastrar bairros"}</button></div>
      <label class="opt"><input type="checkbox" id="bcLiga" ${ligado ? "checked" : ""} ${lista.length || ligado ? "" : "disabled"}><span>Usar os bairros no cardápio online <small>${lista.length ? "(o cliente escolhe o bairro e vê a taxa)" : "(cadastre pelo menos um bairro para ligar)"}</small></span></label>`;
    $("#bcEd", el).onclick = editar;
    $("#bcLiga", el).onchange = (e) => {
      const ligar = e.target.checked;
      store.salvar("config", "loja", { entregaModo: ligar ? "bairro" : "mapa" })
        .then(() => toast(ligar ? "Pronto: o cliente agora escolhe o bairro no cardápio ✓" : "Voltou para mapa/CEP", "bom")).catch(erro);
      setTimeout(desenhar, 300);
    };
  };

  function editar() {
    const itens = (loja().taxasEntrega || []).map((b) => ({ nome: b.nome, taxa: b.taxa }));
    const s = abrirSheet(`${cabecalhoSheet("Bairros e taxas de entrega", "Nome do bairro/condomínio e a taxa de cada um")}<div class="sh-b">
      <div id="bcLinhas"></div>
      <button class="btn ghost sm" id="bcMais">+ Adicionar bairro</button>
      <details class="track-itens"><summary>Colar uma lista de uma vez</summary>
        <p class="muted pq">Um por linha, no formato <b>Nome ; valor</b>. Ex.: <code>Parque das Palmeiras ; 10</code></p>
        <textarea class="in" id="bcCola" rows="6" placeholder="Parque das Palmeiras ; 10&#10;Condomínio São Luiz ; 10&#10;Outros bairros ; 8"></textarea>
        <button class="btn sec sm" id="bcAplica">Adicionar da lista</button></details>
      <div class="err" id="err"></div>
      <button class="btn ok cheio" id="bcSalva">Salvar bairros</button></div>`, { largo: true });
    const linhas = () => {
      $("#bcLinhas", s).innerHTML = itens.map((b, i) => `<div class="forma"><input class="in" data-n="${i}" value="${esc(b.nome)}" placeholder="Bairro ou condomínio" aria-label="Bairro">
        <input class="in" data-t="${i}" inputmode="decimal" value="${valorCampo(b.taxa)}" placeholder="Taxa R$" aria-label="Taxa"><button class="mini-x" data-x="${i}" aria-label="Tirar">×</button></div>`).join("") || `<p class="vazio">Nenhum bairro ainda.</p>`;
      $$("[data-n]", s).forEach((e) => (e.oninput = () => { itens[e.dataset.n].nome = e.value; }));
      $$("[data-t]", s).forEach((e) => (e.oninput = () => { itens[e.dataset.t].taxa = numero(e.value); }));
      $$("[data-x]", s).forEach((e) => (e.onclick = () => { itens.splice(+e.dataset.x, 1); linhas(); }));
    };
    $("#bcMais", s).onclick = () => { itens.push({ nome: "", taxa: 0 }); linhas(); $$("[data-n]", s).at(-1)?.focus(); };
    $("#bcAplica", s).onclick = () => {
      let n = 0;
      for (const l of $("#bcCola", s).value.split("\n")) {
        const [nome, valor] = l.split(/[;\t]/); const nm = (nome || "").trim();
        if (!nm) continue;
        const t = numero(valor || "0");
        const ex = itens.find((b) => semAc(b.nome) === semAc(nm));
        if (ex) ex.taxa = t; else itens.push({ nome: nm, taxa: t });
        n++;
      }
      $("#bcCola", s).value = ""; linhas(); toast(`${n} bairro(s) na lista`);
    };
    $("#bcSalva", s).onclick = async (ev) => {
      const limpos = itens.map((b) => ({ nome: String(b.nome || "").trim(), taxa: Number(b.taxa) || 0 })).filter((b) => b.nome);
      const nomes = limpos.map((b) => semAc(b.nome));
      if (new Set(nomes).size !== nomes.length) return ($("#err", s).textContent = "Tem bairro repetido na lista.");
      ev.currentTarget.disabled = true;
      try {
        await store.salvar("config", "loja", { taxasEntrega: limpos.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")), ...(limpos.length ? {} : { entregaModo: "mapa" }) });
        fecharSheet(); toast("Bairros salvos ✓", "bom"); setTimeout(desenhar, 300);
      } catch (e) { $("#err", s).textContent = e.message; ev.currentTarget.disabled = false; }
    };
    linhas();
  }
  desenhar();
}
