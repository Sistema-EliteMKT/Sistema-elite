// Painel do caixa: pedidos (entrega/retirada/balcão), mesas, motoboys, impressão, relatório e ajustes.
import { $, $$, esc, brl, hora, minutos, toast, erro, bip, pedirTexto, abrirSheet, fecharSheet, cabecalhoSheet, rodapeMarca, numero } from "../ui.js";
import {
  D, loja, aoMudar, ETAPAS, situacaoMesa, comandasDaMesa, subtotal, totalPedido, itensValidos, tituloPedido,
  criarPedido, aceitarPedido, mudarEtapa, cancelarPedido, concluirPedido, cancelarItem, cancelarComanda, moverItem,
  abrirComanda, lancarItens, imprimirConta, imprimirVia, pedirConta,
} from "../regras.js";
import { store } from "../store.js";
import { seletorProdutos, linhaItem } from "./seletor.js";
import { receber } from "./pagamento.js";
import { servicoDe } from "./garcom.js";
import { abaMotoboys, abaImpressao, abaRelatorio, abaCardapio, abaAjustes } from "./gestao.js";

const ABAS = [
  ["pedidos", "Pedidos"], ["mesas", "Mesas"], ["motoboys", "Motoboys"],
  ["impressao", "Impressão"], ["relatorio", "Relatório"], ["cardapio", "Cardápio"], ["ajustes", "Ajustes"],
];

export function telaCaixa(raiz, usuario, { sair, modoGarcom }) {
  let aba = sessionStorage.getItem("se_aba") || "pedidos";
  const vistos = new Set();
  let primeira = true;
  const admin = usuario.papel === "admin";

  const desenhar = () => {
    // Aviso sonoro de pedido online novo
    const novos = D.abertos.filter((p) => p.status === "novo");
    const chegaram = novos.filter((p) => !vistos.has(p.id));
    chegaram.forEach((p) => vistos.add(p.id));
    if (chegaram.length && !primeira) { bip(3); toast(`Pedido novo pelo cardápio online!`, "bom"); }
    const contaMesas = new Set(D.abertos.filter((p) => p.tipo === "mesa" && p.status === "conta").map((p) => p.mesa)).size;
    const falhas = D.impressoes.filter((j) => j.status === "erro").length;
    primeira = false;
    if (raiz.dataset.pronto) { atualizarAbas(novos.length, contaMesas, falhas); atualizarAba(true); return; }
    raiz.dataset.pronto = "1";
    const lj = loja();
    raiz.innerHTML = `<div class="p-top"><div class="p-top-in">
        <div class="p-loja">${lj.logo ? `<img src="${esc(lj.logo)}" alt="">` : ""}<div><b>${esc(lj.nome)}</b><small>${new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</small></div></div>
        <div class="p-quem"><button class="btn sec sm" id="novo">+ Novo pedido</button><button class="btn ghost sm" id="garcom">Modo garçom</button><span class="muted">${esc(usuario.nome)}</span><button class="btn ghost sm" id="sair">Sair</button></div>
      </div></div>
      <nav class="p-tabs chips" id="abas"></nav>
      <div class="p-wrap" id="corpo"></div>
      <div class="p-wrap">${rodapeMarca()}</div>`;
    $("#sair", raiz).onclick = sair;
    $("#garcom", raiz).onclick = modoGarcom;
    $("#novo", raiz).onclick = () => novoPedido();
    atualizarAbas(novos.length, contaMesas, falhas);
    atualizarAba();
  };

  const atualizarAbas = (nNovos, nConta, nFalhas) => {
    const cont = { pedidos: nNovos, mesas: nConta, impressao: nFalhas };
    const vis = ABAS.filter(([k]) => admin || k !== "ajustes");
    $("#abas", raiz).innerHTML = vis.map(([k, l]) => `<button class="chip" data-aba="${k}" aria-pressed="${aba === k}">${l}${cont[k] ? `<span class="badge">${cont[k]}</span>` : ""}</button>`).join("");
    $$("[data-aba]", raiz).forEach((b) => (b.onclick = () => { aba = b.dataset.aba; sessionStorage.setItem("se_aba", aba); atualizarAbas(nNovos, nConta, nFalhas); atualizarAba(); }));
  };

  // porDados = redesenho porque algo mudou no banco (e não porque a pessoa trocou de aba).
  // Ajustes tem formulário aberto na tela: não redesenha por baixo de quem está digitando.
  const atualizarAba = (porDados = false) => {
    const el = $("#corpo", raiz);
    if (!el) return;
    if (porDados && aba === "ajustes") return;
    const ctx = { usuario, admin };
    if (aba === "pedidos") abaPedidos(el);
    else if (aba === "mesas") abaMesas(el);
    else if (aba === "motoboys") abaMotoboys(el, ctx);
    else if (aba === "impressao") abaImpressao(el, ctx);
    else if (aba === "relatorio") abaRelatorio(el, ctx);
    else if (aba === "cardapio") abaCardapio(el, ctx);
    else if (aba === "ajustes") abaAjustes(el, ctx);
  };

  // ------------------------------------------------------------------ Pedidos
  function abaPedidos(el) {
    const ps = D.abertos.filter((p) => p.tipo !== "mesa");
    const col = (titulo, lista, vazio) => `<div class="coluna"><h3>${titulo} <small>${lista.length}</small></h3>${lista.length ? lista.map(cartao).join("") : `<p class="vazio">${vazio}</p>`}</div>`;
    const por = (sts) => ps.filter((p) => sts.includes(p.status)).sort((a, b) => a.criadoEm - b.criadoEm);
    const concluidos = D.doDia.filter((p) => p.tipo !== "mesa" && !p.aberto).sort((a, b) => (b.concluidoEm || b.fechadoEm || 0) - (a.concluidoEm || a.fechadoEm || 0));
    el.innerHTML = `<div class="colunas">
      ${col("Novos (online)", por(["novo"]), "Nenhum pedido esperando.")}
      ${col("Em preparo", por(["preparo"]), "Nada em preparo.")}
      ${col("Prontos / em entrega", por(["pronto", "saiu"]), "Nada aguardando.")}
      </div>
      <details class="card"><summary>Concluídos e cancelados hoje (${concluidos.length})</summary>
        ${concluidos.map((p) => `<div class="cl"><div class="n"><b>${esc(tituloPedido(p))} · ${esc(p.cliente?.nome || "")}</b><small>${ETAPAS[p.status]} · ${hora(p.criadoEm)}${p.motoboy?.nome ? " · " + esc(p.motoboy.nome) : ""}${p.motivo ? " · " + esc(p.motivo) : ""}</small></div><div class="v">${brl(totalPedido(p))}</div></div>`).join("") || `<p class="vazio">Nenhum ainda.</p>`}
      </details>`;
    $$("[data-acao]", el).forEach((b) => (b.onclick = () => acaoPedido(b.dataset.acao, D.abertos.find((p) => p.id === b.dataset.id))));
  }

  const cartao = (p) => {
    const c = p.cliente || {};
    const tipo = { entrega: "Entrega", retirada: "Retirada", balcao: "Balcão" }[p.tipo];
    const acoes = {
      novo: `<button class="btn ok sm" data-acao="aceitar" data-id="${p.id}">Aceitar e imprimir</button><button class="btn ghost sm" data-acao="recusar" data-id="${p.id}">Recusar</button>`,
      preparo: `<button class="btn pri sm" data-acao="${p.tipo === "entrega" ? "despachar" : "pronto"}" data-id="${p.id}">${p.tipo === "entrega" ? "Despachar" : "Pronto"}</button>`,
      pronto: `<button class="btn ok sm" data-acao="concluir" data-id="${p.id}">Retirado</button>`,
      saiu: `<button class="btn ok sm" data-acao="concluir" data-id="${p.id}">Entregue</button>`,
    }[p.status] || "";
    return `<article class="pedido ${p.status === "novo" ? "alerta" : ""}">
      <div class="pe-h"><b>${p.numero ? "#" + p.numero : "Online"} · ${esc(c.nome || tipo)}</b><span class="pill ${p.tipo}">${tipo}</span></div>
      <small class="muted">${hora(p.criadoEm)} · há ${minutos(p.criadoEm)} min${p.origem === "online" ? " · cardápio online" : ""}${p.motoboy?.nome ? ` · 🛵 ${esc(p.motoboy.nome)}` : ""}</small>
      ${p.tipo === "entrega" ? `<small>${esc(c.endereco || "")}${c.bairro ? " · " + esc(c.bairro) : ""}</small>` : ""}
      ${c.telefone ? `<small><a href="https://wa.me/55${esc(c.telefone.replace(/\D/g, "").replace(/^55/, ""))}" target="_blank" rel="noopener">${esc(c.telefone)}</a></small>` : ""}
      <ul class="pe-itens">${itensValidos(p).map((i) => `<li>${i.qtd}x ${esc(i.nome)}${i.det?.length ? ` <small>(${esc(i.det.join(", "))})</small>` : ""}${i.obs ? ` <small class="obs">${esc(i.obs)}</small>` : ""}</li>`).join("")}</ul>
      ${p.obs ? `<small class="obs">Obs: ${esc(p.obs)}</small>` : ""}
      <div class="pe-t"><span>${esc(p.pagamento?.forma || "")}${p.pagamento?.trocoPara ? ` · troco p/ ${brl(p.pagamento.trocoPara)}` : ""}${p.pago ? ` · <b class="ok-txt">PAGO</b>` : ""}</span><b>${brl(totalPedido(p))}</b></div>
      <div class="pe-a">${acoes}${p.status !== "novo" ? `<button class="btn ghost sm" data-acao="via" data-id="${p.id}">Imprimir via</button>` : ""}<button class="btn ghost sm" data-acao="mais" data-id="${p.id}">⋯</button></div>
    </article>`;
  };

  async function acaoPedido(acao, p) {
    if (!p) return;
    try {
      if (acao === "aceitar") { await aceitarPedido(p, usuario); salvarCliente(p); toast("Aceito e enviado para impressão ✓", "bom"); }
      else if (acao === "recusar" || acao === "cancelar") {
        const motivo = await pedirTexto("Cancelar pedido", "Motivo (o cliente vê no acompanhamento)", { ok: "Cancelar pedido" });
        if (motivo == null) return;
        await cancelarPedido(p, motivo || "Pedido cancelado pela loja.", usuario);
      }
      else if (acao === "pronto") await mudarEtapa(p, "pronto");
      else if (acao === "despachar") despachar(p);
      else if (acao === "concluir") {
        if (!p.pago) {
          const pag = await receber([p], usuario, { forma: p.pagamento?.forma, recebido: p.pagamento?.trocoPara, titulo: `Receber ${tituloPedido(p)}` });
          if (!pag) return;
        }
        await concluirPedido(p);
      }
      else if (acao === "via") { await imprimirVia(p); toast("Via enviada para impressão"); }
      else if (acao === "mais") maisPedido(p);
    } catch (e) { erro(e); }
  }

  function despachar(p) {
    const ms = D.motoboys.filter((m) => m.ativo !== false);
    const s = abrirSheet(`${cabecalhoSheet(`Despachar ${tituloPedido(p)}`, p.cliente?.endereco || "")}<div class="sh-b">
      ${ms.length ? `<div class="opts">${ms.map((m) => {
        const naRua = D.abertos.filter((x) => x.status === "saiu" && x.motoboy?.id === m.id).length;
        return `<button class="opt" data-mb="${m.id}"><span>🛵 ${esc(m.nome)}</span><em>${naRua ? `${naRua} na rua` : "livre"}</em></button>`;
      }).join("")}</div>` : `<p class="vazio">Nenhum motoboy cadastrado. Cadastre na aba Motoboys.</p>`}
      <button class="btn ghost cheio" id="semMb">Despachar sem escolher motoboy</button></div>`);
    const ir = async (m) => { try { await mudarEtapa(p, "saiu", { motoboy: m ? { id: m.id, nome: m.nome } : null }); fecharSheet(); toast("Saiu para entrega"); } catch (e) { erro(e); } };
    $$("[data-mb]", s).forEach((b) => (b.onclick = () => ir(ms.find((m) => m.id === b.dataset.mb))));
    $("#semMb", s).onclick = () => ir(null);
  }

  function maisPedido(p) {
    const s = abrirSheet(`${cabecalhoSheet(tituloPedido(p), p.cliente?.nome || "")}<div class="sh-b">
      ${(p.itens || []).map((i) => linhaItem(i, { acoes: !i.cancelado && p.status !== "novo" ? `<button class="mini-x" data-ci="${i.key}" title="Cancelar item">×</button>` : "" })).join("")}
      <div class="linha-btn wrap">
        ${!p.pago && p.status !== "novo" ? `<button class="btn sec" id="pagar">Receber agora</button>` : ""}
        ${p.status === "saiu" || p.status === "pronto" ? `<button class="btn sec" id="voltarPreparo">Voltar para preparo</button>` : ""}
        <button class="btn perigo" id="cancelar">Cancelar pedido</button></div></div>`);
    $$("[data-ci]", s).forEach((b) => (b.onclick = async () => {
      const motivo = await pedirTexto("Cancelar item", "Motivo", { ok: "Cancelar item" });
      if (motivo == null) return;
      try { await cancelarItem(p.id, b.dataset.ci, motivo, usuario); toast("Item cancelado. Aviso enviado ao setor."); } catch (e) { erro(e); }
    }));
    $("#pagar", s) && ($("#pagar", s).onclick = () => receber([p], usuario, { forma: p.pagamento?.forma, recebido: p.pagamento?.trocoPara }));
    $("#voltarPreparo", s) && ($("#voltarPreparo", s).onclick = async () => { await mudarEtapa(p, "preparo"); fecharSheet(); });
    $("#cancelar", s).onclick = () => { fecharSheet(); acaoPedido("cancelar", p); };
  }

  const salvarCliente = (p) => {
    const tel = (p.cliente?.telefone || "").replace(/\D/g, "");
    if (tel.length >= 10) store.salvar("clientes", tel, { ...p.cliente, atualizadoEm: Date.now() }).catch(() => {});
  };

  // -------------------------------------------------------------- Novo pedido
  function novoPedido() {
    const lj = loja();
    const itens = [];
    let tipo = "entrega";
    const s = abrirSheet(`${cabecalhoSheet("Novo pedido", "Telefone, delivery, retirada ou balcão")}<div class="sh-b novo-ped">
      <div class="np-sel" id="sel"></div>
      <div class="np-form">
        <div class="seg" id="tipo"><button data-t="entrega">Entrega</button><button data-t="retirada">Retirada</button><button data-t="balcao">Balcão</button></div>
        <label class="f" for="tel">Telefone</label><input class="in" id="tel" type="tel" inputmode="tel" placeholder="Busca o cliente pelo telefone">
        <label class="f" for="nom">Nome</label><input class="in" id="nom">
        <div id="endBox"><label class="f" for="end">Endereço</label><input class="in" id="end">
          <label class="f" for="bai">Bairro / taxa</label><select class="in" id="bai">${(lj.taxasEntrega || []).map((t) => `<option value="${esc(t.nome)}">${esc(t.nome)} · ${brl(t.taxa)}</option>`).join("")}<option value="">Outra taxa…</option></select>
          <input class="in" id="taxaLivre" inputmode="decimal" placeholder="Taxa de entrega (R$)" hidden>
          <label class="f" for="ref">Referência</label><input class="in" id="ref"></div>
        <label class="f" for="pg">Pagamento</label><select class="in" id="pg">${(lj.formasPagamento || []).map((f) => `<option>${esc(f)}</option>`).join("")}</select>
        <input class="in" id="troco" inputmode="decimal" placeholder="Troco para (R$)" hidden>
        <label class="f" for="obs">Observação</label><input class="in" id="obs">
        <div class="grp">Itens</div><div id="itens"></div>
        <div class="sum" id="sum"></div><div class="err" id="err"></div>
        <button class="btn ok cheio" id="criar">Lançar e imprimir</button>
      </div></div>`, { largo: true });
    const taxa = () => {
      if (tipo !== "entrega") return 0;
      const b = $("#bai", s).value;
      return b ? (lj.taxasEntrega || []).find((t) => t.nome === b)?.taxa || 0 : numero($("#taxaLivre", s).value);
    };
    const atualizar = () => {
      $$("[data-t]", s).forEach((b) => b.setAttribute("aria-pressed", b.dataset.t === tipo));
      $("#endBox", s).hidden = tipo !== "entrega";
      $("#taxaLivre", s).hidden = $("#bai", s).value !== "";
      $("#troco", s).hidden = $("#pg", s).value !== "Dinheiro";
      $("#itens", s).innerHTML = itens.map((i, k) => linhaItem(i, { acoes: `<button class="mini-x" data-rm="${k}" aria-label="Tirar">×</button>` })).join("") || `<p class="vazio">Escolha os produtos na lista.</p>`;
      $$("[data-rm]", s).forEach((b) => (b.onclick = () => { itens.splice(+b.dataset.rm, 1); atualizar(); }));
      const sub = itens.reduce((x, i) => x + i.unit * i.qtd, 0);
      $("#sum", s).innerHTML = `<div><span>Itens</span><span>${brl(sub)}</span></div>${tipo === "entrega" ? `<div><span>Entrega</span><span>${brl(taxa())}</span></div>` : ""}<div class="t"><span>Total</span><span>${brl(sub + taxa())}</span></div>`;
    };
    seletorProdutos($("#sel", s), (item) => { itens.push(item); toast(`${item.qtd}x ${item.nome}`); atualizar(); }, { entrega: true });
    $$("[data-t]", s).forEach((b) => (b.onclick = () => { tipo = b.dataset.t; atualizar(); }));
    ["#bai", "#pg"].forEach((q) => ($(q, s).onchange = atualizar));
    $("#taxaLivre", s).oninput = atualizar;
    $("#tel", s).onchange = async () => {
      const tel = $("#tel", s).value.replace(/\D/g, "");
      if (tel.length < 10) return;
      try {
        const c = await store.obter("clientes", tel);
        if (!c) return;
        if (!$("#nom", s).value) $("#nom", s).value = c.nome || "";
        if (!$("#end", s).value) $("#end", s).value = c.endereco || "";
        if (!$("#ref", s).value) $("#ref", s).value = c.referencia || "";
        if (c.bairro && [...$("#bai", s).options].some((o) => o.value === c.bairro)) $("#bai", s).value = c.bairro;
        toast("Cliente encontrado ✓"); atualizar();
      } catch {}
    };
    $("#criar", s).onclick = async (ev) => {
      const e = $("#err", s);
      if (!itens.length) return (e.textContent = "Coloque pelo menos um item.");
      const cliente = { nome: $("#nom", s).value.trim(), telefone: $("#tel", s).value.trim() };
      if (tipo === "entrega") Object.assign(cliente, { endereco: $("#end", s).value.trim(), bairro: $("#bai", s).value, referencia: $("#ref", s).value.trim() });
      if (tipo === "entrega" && !cliente.endereco) return (e.textContent = "Coloque o endereço.");
      const forma = $("#pg", s).value;
      ev.currentTarget.disabled = true;
      try {
        const dados = { tipo, origem: "caixa", cliente, itens, taxaEntrega: taxa(), pagamento: { forma, trocoPara: forma === "Dinheiro" ? numero($("#troco", s).value) : 0 }, obs: $("#obs", s).value.trim(), criadoPor: usuario.nome };
        await criarPedido(dados, usuario);
        salvarCliente(dados);
        fecharSheet();
        toast("Pedido lançado e enviado para impressão ✓", "bom");
        aba = "pedidos"; desenharTudo();
      } catch (x) { erro(x); ev.currentTarget.disabled = false; }
    };
    atualizar();
  }

  // -------------------------------------------------------------------- Mesas
  function abaMesas(el) {
    const n = Number(loja().nMesas) || 0;
    const oc = Array.from({ length: n }, (_, i) => situacaoMesa(i + 1)).filter((s) => s.status !== "livre");
    el.innerHTML = `<div class="kpis"><div class="kpi"><b>${oc.length}/${n}</b><span>mesas ocupadas</span></div>
      <div class="kpi"><b>${brl(oc.reduce((s, m) => s + m.total, 0))}</b><span>em comandas abertas</span></div>
      <div class="kpi"><b>${oc.filter((m) => m.status === "conta").length}</b><span>pedindo a conta</span></div></div>
      <div class="mesas grande">${Array.from({ length: n }, (_, i) => {
        const m = i + 1, s = situacaoMesa(m);
        return `<button class="mesa m-${s.status}" data-m="${m}"><b>${m}</b>${s.status !== "livre" ? `<small>${brl(s.total)}</small><small>${minutos(s.desde)} min · ${s.comandas.length} com.</small>` : `<small>livre</small>`}</button>`;
      }).join("")}</div>`;
    $$("[data-m]", el).forEach((b) => (b.onclick = () => detalheMesa(+b.dataset.m)));
  }

  function detalheMesa(mesa) {
    const desenharMesa = () => {
      const cs = comandasDaMesa(mesa);
      const s = abrirSheet(`${cabecalhoSheet(`Mesa ${mesa}`, cs.length ? `${cs.length} comanda(s) · ${brl(cs.reduce((x, c) => x + subtotal(c), 0))}` : "Livre")}<div class="sh-b">
        ${cs.map((c) => `<div class="card comanda"><div class="card-h"><div><b>${esc(c.nome)}</b><small>Comanda ${c.numero || ""} · ${esc(c.garcom || "")} · ${hora(c.criadoEm)}${c.status === "conta" ? " · <span class='pill conta'>pediu a conta</span>" : ""}</small></div><b>${brl(subtotal(c))}</b></div>
          ${(c.itens || []).map((i) => linhaItem(i, { acoes: i.cancelado ? "" : `<button class="mini-x" data-ci="${c.id}|${i.key}" title="Cancelar item">×</button>${cs.length > 1 ? `<button class="mini-x" data-mv="${c.id}|${i.key}" title="Passar para outra comanda">⇄</button>` : ""}` })).join("") || `<p class="muted pq">Sem itens.</p>`}
          <div class="linha-btn wrap"><button class="btn sec sm" data-lc="${c.id}">+ Itens</button><button class="btn ghost sm" data-cc="${c.id}">Cancelar comanda</button></div></div>`).join("")}
        <div class="linha-btn wrap">
          <button class="btn sec" id="nova">+ Comanda</button>
          ${cs.length ? `<button class="btn sec" id="impConta">Imprimir conta</button><button class="btn ok" id="fechar">Fechar conta</button>` : ""}
        </div></div>`, { largo: true });
      $("#nova", s).onclick = async () => {
        const nome = await pedirTexto(`Nova comanda · mesa ${mesa}`, "Nome (deixe vazio para mesa inteira)", { ok: "Abrir" });
        if (nome == null) return desenharMesa();
        try { const id = await abrirComanda(mesa, nome || "Mesa inteira", usuario); lancarNaComanda(id, desenharMesa); } catch (e) { erro(e); }
      };
      $$("[data-lc]", s).forEach((b) => (b.onclick = () => lancarNaComanda(b.dataset.lc, desenharMesa)));
      $$("[data-ci]", s).forEach((b) => (b.onclick = async () => {
        const [cid, key] = b.dataset.ci.split("|");
        const motivo = await pedirTexto("Cancelar item", "Motivo", { ok: "Cancelar item" });
        if (motivo != null) { try { await cancelarItem(cid, key, motivo, usuario); toast("Item cancelado. Aviso enviado ao setor."); } catch (e) { erro(e); } }
        desenharMesa();
      }));
      $$("[data-mv]", s).forEach((b) => (b.onclick = () => {
        const [cid, key] = b.dataset.mv.split("|");
        const outras = cs.filter((c) => c.id !== cid);
        const s2 = abrirSheet(`${cabecalhoSheet("Passar item para…")}<div class="sh-b"><div class="opts">${outras.map((c) => `<button class="opt" data-dst="${c.id}"><span>${esc(c.nome)}</span></button>`).join("")}</div></div>`);
        $$("[data-dst]", s2).forEach((d) => (d.onclick = async () => { try { await moverItem(cid, key, d.dataset.dst); } catch (e) { erro(e); } desenharMesa(); }));
        $(".x", s2).onclick = desenharMesa;
      }));
      $$("[data-cc]", s).forEach((b) => (b.onclick = async () => {
        const motivo = await pedirTexto("Cancelar comanda inteira", "Motivo", { ok: "Cancelar comanda" });
        if (motivo != null) { try { await cancelarComanda(b.dataset.cc, motivo, usuario); toast("Comanda cancelada."); } catch (e) { erro(e); } }
        desenharMesa();
      }));
      $("#impConta", s) && ($("#impConta", s).onclick = () => escolher(cs, "Imprimir conta", async (sel) => {
        await pedirConta(sel.map((c) => c.id));
        await imprimirConta(sel, { servico: servicoDe(sel) });
        toast("Conta enviada para impressão");
        desenharMesa();
      }, desenharMesa));
      $("#fechar", s) && ($("#fechar", s).onclick = () => escolher(cs, "Fechar conta", async (sel) => {
        const pag = await receber(sel, usuario, { servico: servicoDe(sel), titulo: `Fechar mesa ${mesa}` });
        if (pag && comandasDaMesa(mesa).filter((c) => !sel.some((x) => x.id === c.id)).length) desenharMesa();
      }, desenharMesa));
    };
    desenharMesa();
  }

  // Escolhe quais comandas entram (juntas) na conta.
  function escolher(cs, titulo, fn, voltar) {
    if (cs.length === 1) return fn(cs).catch(erro);
    const s = abrirSheet(`${cabecalhoSheet(titulo, "Marque as comandas que entram juntas")}<div class="sh-b">
      <div class="opts">${cs.map((c) => `<label class="opt"><input type="checkbox" value="${c.id}" checked><span>${esc(c.nome)}</span><em>${brl(subtotal(c))}</em></label>`).join("")}</div>
      <button class="btn ok cheio" id="ok">Continuar</button></div>`);
    $(".x", s).onclick = voltar;
    $("#ok", s).onclick = () => {
      const ids = $$("input:checked", s).map((i) => i.value);
      if (!ids.length) return toast("Marque pelo menos uma.");
      fn(cs.filter((c) => ids.includes(c.id))).catch(erro);
    };
  }

  function lancarNaComanda(id, voltar) {
    const itens = [];
    const c = () => D.abertos.find((x) => x.id === id);
    const s = abrirSheet(`${cabecalhoSheet(`Lançar · Mesa ${c()?.mesa} · ${c()?.nome || ""}`)}<div class="sh-b novo-ped">
      <div class="np-sel" id="sel"></div>
      <div class="np-form"><div class="grp">Itens a enviar</div><div id="itens"></div><button class="btn ok cheio" id="env">Enviar para produção</button></div></div>`, { largo: true });
    const atualizar = () => {
      $("#itens", s).innerHTML = itens.map((i, k) => linhaItem(i, { acoes: `<button class="mini-x" data-rm="${k}">×</button>` })).join("") || `<p class="vazio">Escolha os produtos.</p>`;
      $$("[data-rm]", s).forEach((b) => (b.onclick = () => { itens.splice(+b.dataset.rm, 1); atualizar(); }));
    };
    seletorProdutos($("#sel", s), (i) => { itens.push(i); atualizar(); });
    $(".x", s).onclick = voltar;
    $("#env", s).onclick = async () => {
      if (!itens.length) return toast("Escolha os itens.");
      try { await lancarItens(id, itens, usuario); toast("Enviado para a produção ✓", "bom"); voltar(); } catch (e) { erro(e); }
    };
    atualizar();
  }

  const desenharTudo = () => { delete raiz.dataset.pronto; desenhar(); };
  const parar = aoMudar(desenhar);
  desenharTudo();
  return parar;
}
