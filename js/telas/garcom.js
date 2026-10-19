// App do garçom: mesas, comandas (mesa inteira ou por pessoa) e lançamento de itens.
import { $, $$, esc, brl, minutos, toast, erro, pedirTexto, confirmar, abrirSheet, fecharSheet, cabecalhoSheet, rodapeMarca } from "../ui.js";
import { D, loja, aoMudar, situacaoMesa, comandasDaMesa, abrirComanda, lancarItens, pedirConta, imprimirConta, subtotal, trocarMesa } from "../regras.js";
import { seletorProdutos, linhaItem } from "./seletor.js";

export function telaGarcom(raiz, usuario, sair) {
  const V = { mesa: null, comanda: null, lancando: false, rascunho: [] };

  const desenhar = () => {
    if (V.lancando) return desenharLancar();
    if (V.mesa != null) return desenharMesa();
    desenharMesas();
  };

  const topo = (titulo, voltar = false) => `<div class="g-top">
    ${voltar ? `<button class="btn ghost sm" id="voltar">‹ Voltar</button>` : `<div class="who"><small>Garçom</small><b>${esc(usuario.nome)}</b></div>`}
    <b class="g-tit">${esc(titulo)}</b>
    ${voltar ? "<span></span>" : `<button class="btn ghost sm" id="sair">Sair</button>`}</div>`;

  const ligarTopo = (voltar) => {
    $("#sair", raiz) && ($("#sair", raiz).onclick = sair);
    $("#voltar", raiz) && ($("#voltar", raiz).onclick = voltar);
  };

  function desenharMesas() {
    const n = Number(loja().nMesas) || 0;
    const mesas = Array.from({ length: n }, (_, i) => i + 1);
    raiz.innerHTML = `${topo("Mesas")}<div class="g-wrap">
      <div class="legenda"><span class="m-livre">Livre</span><span class="m-ocupada">Ocupada</span><span class="m-conta">Pediu a conta</span></div>
      <div class="mesas">${mesas.map((m) => {
        const s = situacaoMesa(m);
        return `<button class="mesa m-${s.status}" data-m="${m}"><b>${m}</b>${s.status !== "livre" ? `<small>${brl(s.total)}</small><small>${minutos(s.desde)} min${s.comandas.length > 1 ? ` · ${s.comandas.length} com.` : ""}</small>` : `<small>livre</small>`}</button>`;
      }).join("")}</div>${rodapeMarca()}</div>`;
    ligarTopo();
    $$("[data-m]", raiz).forEach((b) => (b.onclick = () => { V.mesa = +b.dataset.m; desenhar(); }));
  }

  function desenharMesa() {
    const cs = comandasDaMesa(V.mesa);
    const s = situacaoMesa(V.mesa);
    raiz.innerHTML = `${topo(`Mesa ${V.mesa}`, true)}<div class="g-wrap">
      ${!cs.length ? `<div class="abrir-mesa"><p>Mesa livre. Como vai ser a comanda?</p>
          <button class="btn pri cheio" id="inteira">Uma comanda para a mesa inteira</button>
          <button class="btn sec cheio" id="pessoa">Comanda por pessoa</button></div>`
        : `${cs.map((c) => `<div class="card comanda"><div class="card-h"><div><b>${esc(c.nome)}</b><small>Comanda ${c.numero || ""} · ${brl(subtotal(c))}${c.status === "conta" ? " · <span class='pill conta'>pediu a conta</span>" : ""}</small></div>
            <button class="btn pri sm" data-lancar="${c.id}">+ Itens</button></div>
            ${(c.itens || []).length ? c.itens.map((i) => linhaItem(i)).join("") : `<p class="muted pq">Nenhum item ainda.</p>`}</div>`).join("")}
          <div class="g-acoes">
            <button class="btn sec" id="pessoa">+ Comanda por pessoa</button>
            <button class="btn sec" id="trocar">Trocar de mesa</button>
            <button class="btn or" id="conta">${s.status === "conta" ? "Reimprimir conta" : "Pedir a conta"}</button>
          </div>
          <div class="total-mesa"><span>Total da mesa</span><b>${brl(s.total)}</b></div>`}
      ${rodapeMarca()}</div>`;
    ligarTopo(() => { V.mesa = null; desenhar(); });
    const abrir = async (nome) => {
      try {
        const id = await abrirComanda(V.mesa, nome, usuario);
        V.comanda = id; V.lancando = true; V.rascunho = []; desenhar();
      } catch (e) { erro(e); }
    };
    $("#inteira", raiz) && ($("#inteira", raiz).onclick = () => abrir("Mesa inteira"));
    $("#pessoa", raiz).onclick = async () => {
      const nome = await pedirTexto("Comanda por pessoa", "Nome ou identificação (ex.: João, camisa azul)", { ok: "Abrir comanda" });
      if (nome) abrir(nome);
    };
    $$("[data-lancar]", raiz).forEach((b) => (b.onclick = () => { V.comanda = b.dataset.lancar; V.lancando = true; V.rascunho = []; desenhar(); }));
    $("#trocar", raiz) && ($("#trocar", raiz).onclick = async () => {
      const n = Number(await pedirTexto(`Trocar a mesa ${V.mesa}`, "Para qual mesa?", { tipo: "number", ok: "Trocar" }));
      if (!n) return;
      if (n < 1 || n > Number(loja().nMesas)) return toast("Mesa não existe.");
      if (comandasDaMesa(n).length && !(await confirmar("Juntar mesas", `A mesa ${n} já está ocupada. Juntar as comandas da mesa ${V.mesa} com a mesa ${n}?`, { ok: "Juntar" }))) return;
      try { await trocarMesa(cs.map((c) => c.id), n); V.mesa = n; toast(`Agora é a mesa ${n}.`); desenhar(); } catch (e) { erro(e); }
    });
    $("#conta", raiz) && ($("#conta", raiz).onclick = () => escolherConta(cs));
  }

  async function escolherConta(cs) {
    const enviar = async (sel) => {
      try {
        await pedirConta(sel.map((c) => c.id));
        await imprimirConta(sel, { servico: servicoDe(sel) });
        toast("Conta enviada para impressão. O caixa já está vendo.");
        fecharSheet();
      } catch (e) { erro(e); }
    };
    if (cs.length === 1) return enviar(cs);
    const s = abrirSheet(`${cabecalhoSheet(`Conta da mesa ${V.mesa}`, "Marque as comandas que vão pagar agora")}<div class="sh-b">
      <div class="opts">${cs.map((c) => `<label class="opt"><input type="checkbox" value="${c.id}" checked><span>${esc(c.nome)}</span><em>${brl(subtotal(c))}</em></label>`).join("")}</div>
      <button class="btn or cheio" id="ok">Imprimir conta</button></div>`);
    $("#ok", s).onclick = () => {
      const ids = $$("input:checked", s).map((i) => i.value);
      if (!ids.length) return toast("Marque pelo menos uma comanda.");
      enviar(cs.filter((c) => ids.includes(c.id)));
    };
  }

  function desenharLancar() {
    const c = D.abertos.find((x) => x.id === V.comanda);
    if (!c) { V.lancando = false; return desenhar(); }
    const total = V.rascunho.reduce((s, i) => s + i.unit * i.qtd, 0);
    raiz.innerHTML = `${topo(`Mesa ${c.mesa} · ${c.nome}`, true)}<div class="g-wrap lancar">
      <div id="sel"></div>
      </div>
      <div class="gbar" ${V.rascunho.length ? "" : "hidden"}><div class="gbar-in">
        <div class="rasc">${V.rascunho.map((i, k) => `<div class="r-it"><span>${i.qtd}x ${esc(i.nome)}${i.det.length ? ` <small>(${esc(i.det.join(", "))})</small>` : ""}${i.obs ? ` <small>· ${esc(i.obs)}</small>` : ""}</span><button class="mini-x" data-rm="${k}" aria-label="Tirar">×</button></div>`).join("")}</div>
        <button class="btn ok cheio" id="enviar"><span>Enviar para produção</span><span>${brl(total)}</span></button></div></div>`;
    ligarTopo(async () => {
      if (V.rascunho.length && !(await confirmar("Sair sem enviar?", "Os itens escolhidos ainda não foram para a cozinha/bar.", { ok: "Sair sem enviar", perigo: true }))) return;
      V.lancando = false; V.rascunho = []; desenhar();
    });
    seletorProdutos($("#sel", raiz), (item) => {
      const igual = V.rascunho.find((r) => r.produtoId === item.produtoId && r.nome === item.nome && !r.obs && !item.obs && !r.det.length && !item.det.length);
      if (igual) igual.qtd += item.qtd; else V.rascunho.push(item);
      toast(`${item.qtd}x ${item.nome}`);
      desenharLancar();
    });
    $$("[data-rm]", raiz).forEach((b) => (b.onclick = () => { V.rascunho.splice(+b.dataset.rm, 1); desenharLancar(); }));
    $("#enviar", raiz) && ($("#enviar", raiz).onclick = async (ev) => {
      ev.currentTarget.disabled = true;
      try {
        await lancarItens(c.id, V.rascunho, usuario);
        toast("Enviado para a produção ✓", "bom");
        V.rascunho = []; V.lancando = false; desenhar();
      } catch (e) { erro(e); ev.currentTarget.disabled = false; }
    });
  }

  // Na tela de lançar, só redesenha se a comanda sumir (evita perder a busca enquanto digita).
  const parar = aoMudar(() => {
    if (V.lancando) { if (!D.abertos.some((x) => x.id === V.comanda)) desenhar(); return; }
    desenhar();
  });
  desenhar();
  return parar;
}

export const servicoDe = (cs) => {
  const pct = Number(loja().taxaServico) || 0;
  return Math.round(cs.reduce((s, c) => s + subtotal(c), 0) * pct) / 100;
};
