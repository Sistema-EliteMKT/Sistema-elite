// Cardápio do cliente: escolhe, monta a sacola e faz o pedido (entrega ou retirada).
import { $, $$, esc, brl, hora, toast, erro, abrirSheet, fecharSheet, cabecalhoSheet, rodapeMarca, numero, setasRolagem } from "../ui.js";
import { D, loja, aoMudar, criarPedido, ETAPAS, totalPedido, vendeEm } from "../regras.js";
import { store } from "../store.js";
import { entregaPorRaio, taxaDoPonto, localizador, kmTxt } from "../entrega.js";
import { statusOnline } from "../horario.js";
import { montarItem, editarItem } from "./item.js";

const K = "se_cliente";
const lerLocal = () => { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch { return {}; } };
const gravarLocal = (v) => { try { localStorage.setItem(K, JSON.stringify({ ...lerLocal(), ...v })); } catch {} };

export function telaCardapio(raiz) {
  const sacola = [];
  let cat = null;
  let acompanhando = null;
  let timer;

  const desenhar = () => {
    const lj = loja();
    const cats = D.categorias.filter((c) => D.produtos.some((p) => p.cat === c.id && vendeEm(p, "delivery")));
    cat = cat && cats.some((c) => c.id === cat) ? cat : cats[0]?.id;
    const rolou = $(".c-cats .chips", raiz)?.scrollLeft || 0;
    raiz.innerHTML = `
      <header class="c-hero"><div class="pat" aria-hidden="true"></div><div class="c-hero-in">
        ${lj.logoClaro ? `<img src="${esc(lj.logoClaro)}" alt="${esc(lj.nome)}">` : `<h1>${esc(lj.nome)}</h1>`}
        ${lj.slogan ? `<p>${esc(lj.slogan)}</p>` : ""}
        <div class="facts"><span id="statusOnline" class="${statusOnline(lj).aberto ? "st-aberto" : "st-fechado"}">${statusOnline(lj).aberto ? "🟢" : "🔴"} ${esc(statusOnline(lj).texto)}</span>${lj.telefone ? `<span>${esc(lj.telefone)}</span>` : ""}</div>
      </div></header>
      <div class="c-wrap">
        <div id="acomp"></div>
        <div class="c-cats"><div class="chips">${cats.map((c) => `<button class="chip" data-c="${esc(c.id)}" aria-pressed="${c.id === cat}">${esc(c.nome)}</button>`).join("")}</div></div>
        <div id="menu">${cats.map((c) => secao(c)).join("") || `<p class="vazio">Cardápio ainda não cadastrado.</p>`}</div>
        ${rodapeMarca()}
      </div>
      <div class="cartbar" id="cartbar" ${sacola.length ? "" : "hidden"}><button id="verSacola"><span><span class="q">${sacola.reduce((s, l) => s + l.qtd, 0)}</span>Ver sacola</span><span>${brl(sacola.reduce((s, l) => s + l.unit * l.qtd, 0))}</span></button></div>`;
    const fila = $(".c-cats .chips", raiz);
    if (fila) { setasRolagem(fila); fila.scrollLeft = rolou; }
    $$("[data-c]", raiz).forEach((b) => (b.onclick = () => {
      cat = b.dataset.c;
      $$("[data-c]", raiz).forEach((x) => x.setAttribute("aria-pressed", x === b));
      document.getElementById("sec-" + cat)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    $$("[data-p]", raiz).forEach((b) => (b.onclick = () => {
      if (!statusOnline(loja()).aberto) return toast(`${statusOnline(loja()).texto}. Não estamos aceitando pedidos agora.`);
      const p = D.produtos.find((x) => x.id === b.dataset.p);
      montarItem(p, (item) => { sacola.push(item); toast("Adicionado à sacola"); desenhar(); }, { onde: "delivery" });
    }));
    $("#verSacola", raiz) && ($("#verSacola", raiz).onclick = abrirSacola);
    desenharAcomp();
  };

  const secao = (c) => {
    const itens = D.produtos.filter((p) => p.cat === c.id && vendeEm(p, "delivery"));
    return `<section class="c-sec" id="sec-${esc(c.id)}"><h2>${esc(c.nome)}</h2>${c.nota ? `<p class="nota">${esc(c.nota)}</p>` : ""}
      ${itens.map((p) => `<button class="it" data-p="${esc(p.id)}"><span class="n"><b>${esc(p.nome)}${p.veg ? `<span class="veg" title="Vegetariana">V</span>` : ""}</b>${p.desc ? `<small>${esc(p.desc)}</small>` : ""}</span>
        <span class="p">${brl(p.preco)}${p.precoBroto ? `<small>média ${brl(p.precoBroto)}</small>` : ""}</span><span class="plus" aria-hidden="true">+</span></button>`).join("")}</section>`;
  };

  const abrirSacola = () => {
    const lj = loja();
    const salvo = lerLocal();
    let modo = salvo.modo || "entrega";
    const taxas = lj.taxasEntrega || [];
    const porRaio = entregaPorRaio(lj);
    let loc = salvo.lat != null && porRaio ? { ponto: [salvo.lat, salvo.lng], ...taxaDoPonto(lj, [salvo.lat, salvo.lng]) } : null;
    let ctl = null, autoEnd = "";
    const formas = lj.formasPagamento || [];
    const s = abrirSheet(`${cabecalhoSheet("Sua sacola")}<div class="sh-b">
      <div id="linhas"></div>
      <div class="seg" id="modo"><button data-m="entrega">Entrega</button><button data-m="retirada">Retirar no balcão</button></div>
      <label class="f" for="cn">Seu nome</label><input class="in" id="cn" autocomplete="name" value="${esc(salvo.nome || "")}">
      <label class="f" for="ct">WhatsApp</label><input class="in" id="ct" type="tel" autocomplete="tel" inputmode="tel" value="${esc(salvo.telefone || "")}">
      <div id="end">
        ${porRaio ? `<div id="loc"></div>` : ""}
        <label class="f" for="ce">Endereço (rua, número, complemento)</label><input class="in" id="ce" autocomplete="street-address" value="${esc(salvo.endereco || "")}">
        ${porRaio ? "" : taxas.length ? `<label class="f" for="cb">Bairro / região</label><select class="in" id="cb">${taxas.map((t) => `<option ${t.nome === salvo.bairro ? "selected" : ""}>${esc(t.nome)}</option>`).join("")}</select>` : ""}
        <label class="f" for="cr">Ponto de referência</label><input class="in" id="cr" value="${esc(salvo.referencia || "")}">
      </div>
      <label class="f" for="cp">Pagamento (na entrega ou retirada)</label><select class="in" id="cp">${formas.map((f) => `<option>${esc(f)}</option>`).join("")}</select>
      <div id="trocoBox" hidden><label class="f" for="cx">Troco para quanto? (deixe vazio se não precisar)</label><input class="in" id="cx" inputmode="decimal"></div>
      <label class="f" for="co">Observação do pedido</label><input class="in" id="co" maxlength="160">
      <div class="sum" id="sum"></div>
      <div class="err" id="err"></div>
      <button class="btn pri cheio" id="enviar">Fazer pedido</button></div>`);
    const total = () => {
      const sub = sacola.reduce((x, l) => x + l.unit * l.qtd, 0);
      const t = modo !== "entrega" ? 0 : porRaio ? (loc && !loc.fora ? loc.taxa : 0) : taxas.find((t) => t.nome === $("#cb", s)?.value)?.taxa || 0;
      return { sub, taxa: t, total: sub + t };
    };
    // Entrega por raio: mapa + CEP/localização calculam a taxa e preenchem o endereço.
    if (porRaio) {
      ctl = localizador($("#loc", s), lj, { inicial: salvo.lat != null ? { lat: salvo.lat, lng: salvo.lng, cep: salvo.cep, rua: salvo.rua, bairro: salvo.bairro } : { cep: salvo.cep }, aoMudar: (r, dados) => {
        loc = r;
        const d = r || dados || {};
        // Preenche a rua sozinho, mas não apaga o que a pessoa já digitou.
        const campo = $("#ce", s);
        if (d.rua && (!campo.value.trim() || campo.value === autoEnd)) campo.value = autoEnd = d.rua + (d.numero ? ", " + d.numero : ", ");
        atualizar();
      } });
    }
    const atualizar = () => {
      $$("[data-m]", s).forEach((b) => b.setAttribute("aria-pressed", b.dataset.m === modo));
      $("#end", s).hidden = modo !== "entrega";
      $("#trocoBox", s).hidden = $("#cp", s).value !== "Dinheiro";
      $("#linhas", s).innerHTML = sacola.map((l, i) => `<div class="cl"><div class="n"><b>${esc(l.nome)}</b>${l.det.map((d) => `<small>${esc(d)}</small>`).join("")}${l.obs ? `<small>Obs: ${esc(l.obs)}</small>` : ""}<small>${brl(l.unit * l.qtd)}</small></div>
        <div class="mini"><button class="ed" data-ed="${i}">Editar</button><button data-menos="${i}" aria-label="Diminuir">−</button><span>${l.qtd}</span><button data-mais="${i}" aria-label="Aumentar">+</button></div></div>`).join("") || `<p class="vazio">Sacola vazia.</p>`;
      const t = total();
      $("#sum", s).innerHTML = `<div><span>Itens</span><span>${brl(t.sub)}</span></div>${modo === "entrega" ? `<div><span>Entrega${porRaio && loc ? ` (${loc.area || kmTxt(loc.km)})` : ""}</span><span>${porRaio && !loc ? "informe o endereço" : brl(t.taxa)}</span></div>` : ""}<div class="t"><span>Total</span><span>${brl(t.total)}</span></div>`;
      $$("[data-menos]", s).forEach((b) => (b.onclick = () => { const l = sacola[b.dataset.menos]; if (--l.qtd <= 0) sacola.splice(b.dataset.menos, 1); atualizar(); desenhar(); }));
      $$("[data-mais]", s).forEach((b) => (b.onclick = () => { sacola[b.dataset.mais].qtd++; atualizar(); desenhar(); }));
      $$("[data-ed]", s).forEach((b) => (b.onclick = () => editarItem(sacola[b.dataset.ed], "delivery", (novo) => { sacola[b.dataset.ed] = novo; atualizar(); desenhar(); })));
      $("#enviar", s).disabled = !sacola.length || (modo === "entrega" && porRaio && (!loc || loc.fora));
    };
    $$("[data-m]", s).forEach((b) => (b.onclick = () => { modo = b.dataset.m; atualizar(); }));
    $$("select", s).forEach((x) => (x.onchange = atualizar));
    $("#enviar", s).onclick = async () => {
      const st = statusOnline(loja());
      if (!st.aberto) return ($("#err", s).textContent = `${st.texto}. Não estamos aceitando pedidos agora.`);
      const c = { nome: $("#cn", s).value.trim(), telefone: $("#ct", s).value.trim(), endereco: $("#ce", s).value.trim(), bairro: porRaio ? loc?.bairro || "" : $("#cb", s)?.value || "", referencia: $("#cr", s).value.trim() };
      if (porRaio && loc && !loc.fora) Object.assign(c, { lat: loc.ponto[0], lng: loc.ponto[1], distanciaKm: loc.km != null ? Math.round(loc.km * 10) / 10 : null, area: loc.area || "", cep: loc.cep || "" });
      const e = $("#err", s);
      if (!c.nome) return (e.textContent = "Coloque seu nome.");
      if (c.telefone.replace(/\D/g, "").length < 10) return (e.textContent = "Coloque um WhatsApp com DDD.");
      if (modo === "entrega" && !c.endereco) return (e.textContent = "Coloque o endereço de entrega.");
      if (modo === "entrega" && porRaio && !loc) return (e.textContent = "Use sua localização ou o CEP para calcular a entrega.");
      if (modo === "entrega" && porRaio && loc.fora) return (e.textContent = "Esse endereço está fora da nossa área de entrega.");
      const t = total();
      const forma = $("#cp", s).value;
      const trocoPara = forma === "Dinheiro" ? numero($("#cx", s).value) : 0;
      if (trocoPara && trocoPara < t.total) return (e.textContent = "O troco precisa ser maior que o total.");
      const btn = $("#enviar", s);
      btn.disabled = true; btn.textContent = "Enviando…";
      try {
        const id = await criarPedido({
          tipo: modo, origem: "online", cliente: modo === "entrega" ? c : { nome: c.nome, telefone: c.telefone },
          itens: sacola.map((l) => ({ ...l })), taxaEntrega: t.taxa, pagamento: { forma, trocoPara }, obs: $("#co", s).value.trim(),
        });
        gravarLocal({ ...c, modo, ultimo: id });
        sacola.length = 0;
        fecharSheet();
        toast("Pedido enviado! Acompanhe aqui em cima.");
        acompanhar(id);
        desenhar();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (x) { erro(x); btn.disabled = false; btn.textContent = "Fazer pedido"; }
    };
    atualizar();
  };

  // Acompanhamento do pedido (consulta a cada 15 segundos)
  const acompanhar = async (id) => {
    clearTimeout(timer);
    if (!id) return;
    try { acompanhando = await store.obter("pedidos", id); } catch { acompanhando = null; }
    desenharAcomp();
    const fim = !acompanhando || ["concluido", "cancelado"].includes(acompanhando.status);
    if (!fim) timer = setTimeout(() => acompanhar(id), 15000);
  };
  const desenharAcomp = () => {
    const el = $("#acomp", raiz);
    if (!el) return;
    const p = acompanhando;
    if (!p || (p.status === "concluido" && Date.now() - (p.concluidoEm || 0) > 3600e3)) { el.innerHTML = ""; return; }
    const passos = p.tipo === "entrega" ? ["novo", "preparo", "saiu", "concluido"] : ["novo", "preparo", "pronto", "concluido"];
    const atual = passos.indexOf(p.status);
    const nomes = { ...ETAPAS, novo: "Pedido recebido", concluido: p.tipo === "entrega" ? "Entregue" : "Retirado", pronto: "Pronto para retirar" };
    el.innerHTML = p.status === "cancelado"
      ? `<div class="track"><h3>Pedido cancelado</h3><p class="muted">${esc(p.motivo || "Fale com a gente pelo telefone.")}</p><button class="btn sec sm" id="okAc">Ok</button></div>`
      : `<div class="track"><h3>Seu pedido${p.numero ? ` #${p.numero}` : ""}</h3><p class="muted">Feito às ${hora(p.criadoEm)} · ${brl(totalPedido(p))}</p>
        <ol class="steps">${passos.map((k, i) => `<li class="${i < atual ? "done" : i === atual ? "now" : ""}">${esc(nomes[k])}</li>`).join("")}</ol></div>`;
    const ok = $("#okAc", el);
    if (ok) ok.onclick = () => { gravarLocal({ ultimo: null }); acompanhando = null; desenharAcomp(); };
  };

  // O horário muda com o tempo: atualiza o "Aberto até…" sem redesenhar a tela toda.
  const relogio = setInterval(() => {
    const e = document.getElementById("statusOnline"), st = statusOnline(loja());
    if (e) { e.textContent = `${st.aberto ? "🟢" : "🔴"} ${st.texto}`; e.className = st.aberto ? "st-aberto" : "st-fechado"; }
  }, 30000);
  const parar = aoMudar(desenhar);
  desenhar();
  acompanhar(lerLocal().ultimo);
  return () => { parar(); clearTimeout(timer); clearInterval(relogio); };
}
