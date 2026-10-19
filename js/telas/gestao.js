// Abas de gestão do caixa: motoboys, impressão, relatório do dia, cardápio e ajustes.
import { $, $$, esc, brl, hora, toast, erro, pedirTexto, confirmar, abrirSheet, fecharSheet, cabecalhoSheet, numero, valorCampo } from "../ui.js";
import { D, loja, totalPedido, itensValidos, tituloPedido, reimprimir, filaImpressao } from "../regras.js";
import { store, novoId } from "../store.js";
import { lerEstacao, gravarEstacao } from "../estacao.js";
import { htmlCupom } from "../imprimir-navegador.js";

// ----------------------------------------------------------------- Motoboys
export function abaMotoboys(el) {
  const entregas = D.doDia.filter((p) => p.tipo === "entrega" && p.motoboy?.id && p.status !== "cancelado");
  el.innerHTML = `<div class="linha-btn"><button class="btn pri" id="novoMb">+ Cadastrar motoboy</button></div>
    <div class="grade">${D.motoboys.map((m) => {
      const es = entregas.filter((p) => p.motoboy.id === m.id);
      const rua = es.filter((p) => p.status === "saiu");
      return `<div class="card"><div class="card-h"><div><b>🛵 ${esc(m.nome)}</b><small>${esc(m.telefone || "")} · ${m.ativo === false ? "fora do turno" : rua.length ? `${rua.length} na rua` : "livre"}</small></div>
        <button class="btn ghost sm" data-ed="${m.id}">Editar</button></div>
        <div class="sum"><div><span>Entregas hoje</span><span>${es.length}</span></div><div><span>Taxas de entrega</span><span>${brl(es.reduce((s, p) => s + (Number(p.taxaEntrega) || 0), 0))}</span></div>
        <div><span>Dinheiro a receber dele</span><span>${brl(es.filter((p) => p.pagamento?.forma === "Dinheiro").reduce((s, p) => s + totalPedido(p), 0))}</span></div></div>
        ${es.length ? `<details><summary>Ver entregas</summary>${es.map((p) => `<div class="cl"><div class="n"><b>${esc(tituloPedido(p))} · ${esc(p.cliente?.nome || "")}</b><small>${hora(p.saiuEm || p.criadoEm)} · ${esc(p.cliente?.bairro || "")} · ${esc(p.pagamento?.forma || "")}</small></div><div class="v">${brl(totalPedido(p))}</div></div>`).join("")}</details>` : ""}
        <label class="opt"><input type="checkbox" data-at="${m.id}" ${m.ativo === false ? "" : "checked"}><span>No turno hoje</span></label></div>`;
    }).join("") || `<p class="vazio">Nenhum motoboy cadastrado.</p>`}</div>`;
  const editar = (m = {}) => {
    const s = abrirSheet(`${cabecalhoSheet(m.id ? "Editar motoboy" : "Novo motoboy")}<div class="sh-b">
      <label class="f" for="mn">Nome</label><input class="in" id="mn" value="${esc(m.nome || "")}">
      <label class="f" for="mt">Telefone</label><input class="in" id="mt" type="tel" value="${esc(m.telefone || "")}">
      <div class="linha-btn">${m.id ? `<button class="btn perigo" id="del">Excluir</button>` : ""}<button class="btn pri" id="ok">Salvar</button></div></div>`);
    $("#ok", s).onclick = async () => {
      const nome = $("#mn", s).value.trim();
      if (!nome) return toast("Coloque o nome.");
      try { await store.salvar("motoboys", m.id || novoId(), { nome, telefone: $("#mt", s).value.trim(), ativo: m.ativo ?? true }); fecharSheet(); } catch (e) { erro(e); }
    };
    $("#del", s) && ($("#del", s).onclick = async () => { if (await confirmar("Excluir motoboy", `Excluir ${m.nome}? As entregas antigas continuam no relatório.`, { ok: "Excluir", perigo: true })) store.apagar("motoboys", m.id).catch(erro); });
  };
  $("#novoMb", el).onclick = () => editar();
  $$("[data-ed]", el).forEach((b) => (b.onclick = () => editar(D.motoboys.find((m) => m.id === b.dataset.ed))));
  $$("[data-at]", el).forEach((b) => (b.onchange = () => store.salvar("motoboys", b.dataset.at, { ativo: b.checked }).catch(erro)));
}

// ---------------------------------------------------------------- Impressão
export function abaImpressao(el, { admin }) {
  const lj = loja();
  const est = lerEstacao();
  const nomeImp = (id) => lj.impressoras.find((i) => i.id === id)?.nome || id;
  const st = { pendente: "Na fila", imprimindo: "Imprimindo", impresso: "Impresso", erro: "Erro" };
  el.innerHTML = `<div class="grade">
    ${lj.impressoras.map((imp) => {
      const js = D.impressoes.filter((j) => j.impressora === imp.id);
      const fila = js.filter((j) => j.status === "pendente").length;
      const setores = lj.setores.filter((s) => s.impressora === imp.id).map((s) => s.nome);
      const ult = js.find((j) => j.status === "impresso");
      return `<div class="card"><div class="card-h"><div><b>🖨️ ${esc(imp.nome)}</b><small>${setores.length ? esc(setores.join(", ")) : "nenhum setor"}${lj.impressoraConta === imp.id ? " · contas e vias" : ""}</small></div>
        <span class="pill ${fila ? "alerta" : "ok"}">${fila ? `${fila} na fila` : "em dia"}</span></div>
        <small class="muted">${ult ? `Último impresso às ${hora(ult.impressoEm || ult.criadoEm)}` : "Nada impresso hoje"}</small>
        <div class="linha-btn wrap"><button class="btn ghost sm" data-teste="${imp.id}">Imprimir teste</button></div></div>`;
    }).join("")}</div>
    <div class="card"><b>Imprimir por este computador</b>
      <p class="muted pq">Use se o agente de impressão não estiver instalado. Deixe esta tela aberta no computador ligado às impressoras. Para sair sem janela de confirmação, abra o Chrome com <code>--kiosk-printing</code> (veja o manual).</p>
      <label class="opt"><input type="checkbox" id="estAt" ${est.ativo ? "checked" : ""}><span>Este computador imprime os cupons</span></label>
      <div class="opts dois">${lj.impressoras.map((i) => `<label class="opt"><input type="checkbox" data-ei="${i.id}" ${est.impressoras.includes(i.id) ? "checked" : ""}><span>${esc(i.nome)}</span></label>`).join("")}</div></div>
    <div class="card"><b>Cupons de hoje</b>
      ${D.impressoes.slice(0, 80).map((j) => `<div class="cl"><div class="n"><b>${esc(j.titulo)}</b><small>${hora(j.criadoEm)} · ${esc(nomeImp(j.impressora))} · ${st[j.status] || j.status}${j.erro ? " · " + esc(j.erro) : ""}</small></div>
        <div class="v"><button class="btn ghost sm" data-ver="${j.id}">Ver</button><button class="btn ghost sm" data-re="${j.id}">Reimprimir</button></div></div>`).join("") || `<p class="vazio">Nenhum cupom hoje.</p>`}</div>`;
  const salvarEst = () => gravarEstacao({ ativo: $("#estAt", el).checked, impressoras: $$("[data-ei]", el).filter((i) => i.checked).map((i) => i.dataset.ei) });
  $("#estAt", el).onchange = () => { salvarEst(); toast($("#estAt", el).checked ? "Este computador vai imprimir" : "Impressão por este computador desligada"); };
  $$("[data-ei]", el).forEach((i) => (i.onchange = salvarEst));
  $$("[data-teste]", el).forEach((b) => (b.onclick = () => {
    const imp = lj.impressoras.find((i) => i.id === b.dataset.teste);
    store.lote([filaImpressao(imp.id, `Teste · ${imp.nome}`, [
      { t: "TESTE DE IMPRESSÃO", b: true, g: true, c: true }, { sep: true }, { t: imp.nome, b: true },
      { t: `Setores: ${lj.setores.filter((s) => s.impressora === imp.id).map((s) => s.nome).join(", ") || "-"}` },
      { t: new Date().toLocaleString("pt-BR") }, { t: "Acentuação: ção ã é ü" }, { sep: true }, { t: "Sistema Elite · Elite MKT", c: true },
    ])]).then(() => toast("Teste enviado para a fila")).catch(erro);
  }));
  $$("[data-re]", el).forEach((b) => (b.onclick = () => reimprimir(D.impressoes.find((j) => j.id === b.dataset.re)).then(() => toast("Enviado de novo")).catch(erro)));
  $$("[data-ver]", el).forEach((b) => (b.onclick = () => {
    const j = D.impressoes.find((x) => x.id === b.dataset.ver);
    abrirSheet(`${cabecalhoSheet(j.titulo)}<div class="sh-b"><iframe class="previa" title="Prévia do cupom" srcdoc="${esc(htmlCupom(j.linhas, lj.colunas))}"></iframe></div>`);
  }));
}

// ---------------------------------------------------------------- Relatório
export function abaRelatorio(el, { usuario }) {
  const pags = D.pagamentos;
  const total = pags.reduce((s, p) => s + p.total, 0);
  const porForma = {};
  for (const p of pags) for (const x of p.pagamentos) porForma[x.forma] = (porForma[x.forma] || 0) + x.valor;
  // troco sai do dinheiro
  const troco = pags.reduce((s, p) => s + (p.troco || 0), 0);
  if (porForma.Dinheiro) porForma.Dinheiro -= troco;
  const porTipo = {};
  for (const p of pags) porTipo[p.tipo] = (porTipo[p.tipo] || 0) + p.total;
  const pedidos = D.doDia.filter((p) => !["cancelado", "cancelada"].includes(p.status));
  const cancel = D.doDia.filter((p) => ["cancelado", "cancelada"].includes(p.status));
  const prod = {};
  for (const p of pedidos) for (const i of itensValidos(p)) prod[i.nome] = (prod[i.nome] || 0) + i.qtd;
  const top = Object.entries(prod).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const servico = pags.reduce((s, p) => s + (p.servico || 0), 0);
  const desconto = pags.reduce((s, p) => s + (p.desconto || 0), 0);
  const abertos = D.abertos.reduce((s, p) => s + (p.pago ? 0 : totalPedido(p)), 0);
  const nomesTipo = { mesa: "Mesas", entrega: "Entrega", retirada: "Retirada", balcao: "Balcão" };
  el.innerHTML = `<div class="kpis">
      <div class="kpi"><b>${brl(total)}</b><span>recebido hoje</span></div>
      <div class="kpi"><b>${pags.length}</b><span>contas recebidas</span></div>
      <div class="kpi"><b>${brl(pags.length ? total / pags.length : 0)}</b><span>ticket médio</span></div>
      <div class="kpi"><b>${brl(abertos)}</b><span>ainda a receber</span></div></div>
    <div class="grade">
      <div class="card"><b>Por forma de pagamento</b><div class="sum">${Object.entries(porForma).map(([f, v]) => `<div><span>${esc(f)}</span><span>${brl(v)}</span></div>`).join("") || `<p class="vazio">Nada recebido ainda.</p>`}</div></div>
      <div class="card"><b>Por tipo</b><div class="sum">${Object.entries(porTipo).map(([t, v]) => `<div><span>${nomesTipo[t] || t}</span><span>${brl(v)}</span></div>`).join("") || `<p class="vazio">—</p>`}
        <div><span>Taxa de serviço</span><span>${brl(servico)}</span></div><div><span>Descontos</span><span>${brl(desconto)}</span></div>
        <div><span>Cancelados</span><span>${cancel.length}</span></div></div></div>
      <div class="card"><b>Mais vendidos hoje</b><div class="sum">${top.map(([n, q]) => `<div><span>${esc(n)}</span><span>${q}</span></div>`).join("") || `<p class="vazio">—</p>`}</div></div>
    </div>
    <div class="linha-btn"><button class="btn pri" id="fech">Imprimir fechamento do dia</button></div>
    <div class="card"><b>Recebimentos</b>${pags.map((p) => `<div class="cl"><div class="n"><b>${p.mesa ? `Mesa ${p.mesa}` : nomesTipo[p.tipo] || ""} ${p.numeros?.length ? "#" + p.numeros.join(", #") : ""}${p.nomes?.length ? " · " + esc(p.nomes.join(", ")) : ""}</b><small>${hora(p.criadoEm)} · ${esc(p.pagamentos.map((x) => `${x.forma} ${brl(x.valor)}`).join(" + "))} · ${esc(p.por || "")}</small></div><div class="v">${brl(p.total)}</div></div>`).join("") || `<p class="vazio">Nada ainda.</p>`}</div>`;
  $("#fech", el).onclick = () => {
    const w = Number(loja().colunas) || 48;
    const lado = (a, b) => a + " ".repeat(Math.max(1, w - a.length - b.length)) + b;
    const r = (v) => v.toFixed(2).replace(".", ",");
    const linhas = [
      { t: loja().nome, b: true, c: true }, { t: "FECHAMENTO DO DIA", b: true, g: true, c: true },
      { t: new Date().toLocaleString("pt-BR"), c: true }, { t: `Por: ${usuario.nome}`, c: true }, { sep: true },
      ...Object.entries(porForma).map(([f, v]) => ({ t: lado(f, r(v)) })), { sep: true },
      ...Object.entries(porTipo).map(([t, v]) => ({ t: lado(nomesTipo[t] || t, r(v)) })),
      { t: lado("Serviço", r(servico)) }, { t: lado("Descontos", r(desconto)) }, { t: lado("Cancelados", String(cancel.length)) }, { sep: true },
      { t: lado("TOTAL RECEBIDO", r(total)), b: true, g: true }, { t: lado("Contas", String(pags.length)) }, { sep: true },
      { t: "Sistema Elite · Elite MKT", c: true },
    ];
    store.lote([filaImpressao(loja().impressoraConta, "Fechamento do dia", linhas)]).then(() => toast("Fechamento enviado para impressão")).catch(erro);
  };
}

// ----------------------------------------------------------------- Cardápio
export function abaCardapio(el) {
  const lj = loja();
  let catSel = sessionStorage.getItem("se_cat") || D.categorias[0]?.id;
  if (!D.categorias.some((c) => c.id === catSel)) catSel = D.categorias[0]?.id;
  const cat = D.categorias.find((c) => c.id === catSel);
  const prods = D.produtos.filter((p) => p.cat === catSel);
  const nomeSetor = (id) => lj.setores.find((s) => s.id === id)?.nome || id;
  el.innerHTML = `<div class="chips">${D.categorias.map((c) => `<button class="chip" data-cs="${esc(c.id)}" aria-pressed="${c.id === catSel}">${esc(c.nome)}</button>`).join("")}<button class="chip" id="novaCat">+ Categoria</button></div>
    ${cat ? `<div class="card"><div class="card-h"><div><b>${esc(cat.nome)}</b><small>Setor: ${esc(nomeSetor(cat.setor))}${cat.grupoPizza ? " · monta pizza (meio a meio, borda)" : ""}</small></div><button class="btn ghost sm" id="edCat">Editar categoria</button></div>
      <div class="linha-btn"><button class="btn pri sm" id="novoProd">+ Produto</button></div>
      ${prods.map((p) => `<div class="cl ${p.ativo === false ? "off" : ""}"><div class="n"><b>${esc(p.nome)}</b><small>${esc(p.desc || "")}</small>${p.ativo === false ? `<small class="ruim-txt">Esgotado / fora do cardápio</small>` : ""}</div>
        <div class="v">${brl(p.preco)}${p.precoBroto ? `<small>broto ${brl(p.precoBroto)}</small>` : ""}<label class="sw" title="Disponível"><input type="checkbox" data-av="${esc(p.id)}" ${p.ativo === false ? "" : "checked"}><span></span></label><button class="btn ghost sm" data-ep="${esc(p.id)}">Editar</button></div></div>`).join("") || `<p class="vazio">Nenhum produto nesta categoria.</p>`}</div>` : ""}
    <div class="grade">
      <div class="card"><div class="card-h"><b>Bordas (pizzas salgadas)</b><button class="btn ghost sm" id="edBordas">Editar</button></div>${(lj.bordas || []).map((b) => `<div class="cl"><span>${esc(b.nome)}</span><span>${brl(b.preco)}</span></div>`).join("")}</div>
      <div class="card"><div class="card-h"><b>Taxas de entrega</b><button class="btn ghost sm" id="edTaxas">Editar</button></div>${(lj.taxasEntrega || []).map((b) => `<div class="cl"><span>${esc(b.nome)}</span><span>${brl(b.taxa)}</span></div>`).join("")}</div>
    </div>`;
  $$("[data-cs]", el).forEach((b) => (b.onclick = () => { sessionStorage.setItem("se_cat", b.dataset.cs); abaCardapio(el); }));
  $$("[data-av]", el).forEach((b) => (b.onchange = () => store.salvar("produtos", b.dataset.av, { ativo: b.checked }).then(() => toast(b.checked ? "Disponível" : "Marcado como esgotado")).catch(erro)));
  $$("[data-ep]", el).forEach((b) => (b.onclick = () => editarProduto(D.produtos.find((p) => p.id === b.dataset.ep))));
  $("#novoProd", el) && ($("#novoProd", el).onclick = () => editarProduto({ cat: catSel, tipo: cat.grupoPizza ? "pizza" : "simples", ativo: true }));
  $("#edCat", el) && ($("#edCat", el).onclick = () => editarCategoria(cat));
  $("#novaCat", el).onclick = () => editarCategoria({});
  $("#edBordas", el).onclick = () => editarLista("Bordas", "bordas", "preco", "Preço");
  $("#edTaxas", el).onclick = () => editarLista("Taxas de entrega", "taxasEntrega", "taxa", "Taxa");
}

function editarProduto(p) {
  const s = abrirSheet(`${cabecalhoSheet(p.id ? "Editar produto" : "Novo produto")}<div class="sh-b">
    <label class="f" for="pn">Nome</label><input class="in" id="pn" value="${esc(p.nome || "")}">
    <label class="f" for="pd">Descrição</label><input class="in" id="pd" value="${esc(p.desc || "")}">
    <label class="f" for="pc">Categoria</label><select class="in" id="pc">${D.categorias.map((c) => `<option value="${esc(c.id)}" ${c.id === p.cat ? "selected" : ""}>${esc(c.nome)}</option>`).join("")}</select>
    <div class="opts dois"><div><label class="f" for="pp">Preço (R$)</label><input class="in" id="pp" inputmode="decimal" value="${p.preco != null ? valorCampo(p.preco) : ""}"></div>
      <div><label class="f" for="pb">Preço brotinho (só pizza)</label><input class="in" id="pb" inputmode="decimal" value="${p.precoBroto ? valorCampo(p.precoBroto) : ""}"></div></div>
    <label class="f" for="po">Opções para escolher (separe por vírgula, ex.: Coca-Cola, Guaraná)</label><input class="in" id="po" value="${esc((p.opcoes || []).join(", "))}">
    <label class="f" for="ps">Setor de impressão</label><select class="in" id="ps"><option value="">O mesmo da categoria</option>${loja().setores.map((x) => `<option value="${esc(x.id)}" ${x.id === p.setor ? "selected" : ""}>${esc(x.nome)}</option>`).join("")}</select>
    <label class="opt"><input type="checkbox" id="pz" ${p.tipo === "pizza" ? "checked" : ""}><span>É pizza (tamanho, meio a meio, borda)</span></label>
    <label class="opt"><input type="checkbox" id="pv" ${p.veg ? "checked" : ""}><span>Vegetariano</span></label>
    <label class="opt"><input type="checkbox" id="pe" ${p.semEntrega ? "checked" : ""}><span>Não vende para entrega</span></label>
    <label class="opt"><input type="checkbox" id="pa" ${p.ativo === false ? "" : "checked"}><span>Disponível</span></label>
    <div class="linha-btn">${p.id ? `<button class="btn perigo" id="del">Excluir</button>` : ""}<button class="btn pri" id="ok">Salvar</button></div></div>`);
  $("#ok", s).onclick = async () => {
    const nome = $("#pn", s).value.trim();
    const preco = numero($("#pp", s).value);
    if (!nome || !preco) return toast("Coloque nome e preço.");
    const dados = {
      nome, desc: $("#pd", s).value.trim(), cat: $("#pc", s).value, preco, precoBroto: numero($("#pb", s).value) || null,
      opcoes: $("#po", s).value.split(",").map((x) => x.trim()).filter(Boolean), setor: $("#ps", s).value || null,
      tipo: $("#pz", s).checked ? "pizza" : "simples", veg: $("#pv", s).checked, semEntrega: $("#pe", s).checked, ativo: $("#pa", s).checked,
      ordem: p.ordem ?? D.produtos.filter((x) => x.cat === $("#pc", s).value).length + 1,
    };
    try { await store.salvar("produtos", p.id || novoId(), dados); fecharSheet(); toast("Salvo ✓"); } catch (e) { erro(e); }
  };
  $("#del", s) && ($("#del", s).onclick = async () => {
    if (await confirmar("Excluir produto", `Excluir "${p.nome}" do cardápio? (Para tirar só hoje, use o botão de disponível.)`, { ok: "Excluir", perigo: true })) store.apagar("produtos", p.id).catch(erro);
  });
}

function editarCategoria(c) {
  const s = abrirSheet(`${cabecalhoSheet(c.id ? "Editar categoria" : "Nova categoria")}<div class="sh-b">
    <label class="f" for="cn">Nome</label><input class="in" id="cn" value="${esc(c.nome || "")}">
    <label class="f" for="cs">Setor (para qual impressora vai)</label><select class="in" id="cs">${loja().setores.map((x) => `<option value="${esc(x.id)}" ${x.id === c.setor ? "selected" : ""}>${esc(x.nome)}</option>`).join("")}</select>
    <label class="f" for="cno">Aviso para o cliente (opcional)</label><input class="in" id="cno" value="${esc(c.nota || "")}">
    <label class="f" for="cp">Prefixo no cupom (ex.: "Esfiha ")</label><input class="in" id="cp" value="${esc(c.prefixo || "")}">
    <label class="f" for="cg">Pizzas desta categoria se misturam com</label><select class="in" id="cg">
      <option value="">Não é pizza</option><option value="salgada" ${c.grupoPizza === "salgada" ? "selected" : ""}>Pizzas salgadas (com borda)</option><option value="doce" ${c.grupoPizza === "doce" ? "selected" : ""}>Pizzas doces</option></select>
    <label class="f" for="co">Ordem no cardápio</label><input class="in" id="co" type="number" value="${c.ordem ?? D.categorias.length + 1}">
    <div class="linha-btn">${c.id ? `<button class="btn perigo" id="del">Excluir</button>` : ""}<button class="btn pri" id="ok">Salvar</button></div></div>`);
  $("#ok", s).onclick = async () => {
    const nome = $("#cn", s).value.trim();
    if (!nome) return toast("Coloque o nome.");
    const id = c.id || nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || novoId();
    try {
      await store.salvar("categorias", id, { nome, setor: $("#cs", s).value, nota: $("#cno", s).value.trim(), prefixo: $("#cp", s).value, grupoPizza: $("#cg", s).value, ordem: Number($("#co", s).value) || 0 });
      sessionStorage.setItem("se_cat", id); fecharSheet(); toast("Salvo ✓");
    } catch (e) { erro(e); }
  };
  $("#del", s) && ($("#del", s).onclick = async () => {
    if (D.produtos.some((p) => p.cat === c.id)) return toast("Tire ou mude os produtos dessa categoria antes.");
    if (await confirmar("Excluir categoria", `Excluir "${c.nome}"?`, { ok: "Excluir", perigo: true })) store.apagar("categorias", c.id).catch(erro);
  });
}

// Edita uma lista {nome, valor} dentro de config/loja (bordas, taxas de entrega).
function editarLista(titulo, campo, chave, rotulo) {
  const itens = structuredClone(loja()[campo] || []);
  const s = abrirSheet(`${cabecalhoSheet(titulo)}<div class="sh-b"><div id="ls"></div><button class="btn ghost sm" id="mais">+ Adicionar</button><div class="linha-btn"><button class="btn pri" id="ok">Salvar</button></div></div>`);
  const des = () => {
    $("#ls", s).innerHTML = itens.map((x, i) => `<div class="forma"><input class="in" data-n="${i}" value="${esc(x.nome)}" placeholder="Nome"><input class="in" data-v="${i}" inputmode="decimal" value="${valorCampo(x[chave])}" aria-label="${rotulo}"><button class="mini-x" data-x="${i}">×</button></div>`).join("");
    $$("[data-n]", s).forEach((e) => (e.oninput = () => (itens[e.dataset.n].nome = e.value)));
    $$("[data-v]", s).forEach((e) => (e.oninput = () => (itens[e.dataset.v][chave] = numero(e.value))));
    $$("[data-x]", s).forEach((e) => (e.onclick = () => { itens.splice(+e.dataset.x, 1); des(); }));
  };
  $("#mais", s).onclick = () => { itens.push({ nome: "", [chave]: 0 }); des(); };
  $("#ok", s).onclick = () => store.salvar("config", "loja", { [campo]: itens.filter((x) => x.nome.trim()) }).then(() => { fecharSheet(); toast("Salvo ✓"); }).catch(erro);
  des();
}

// ------------------------------------------------------------------ Ajustes
export function abaAjustes(el) {
  const lj = loja();
  const linkCardapio = location.href.split("#")[0] + "#/cardapio";
  el.innerHTML = `<div class="grade">
    <div class="card"><b>Loja</b>
      <label class="f" for="an">Nome</label><input class="in" id="an" value="${esc(lj.nome)}">
      <label class="f" for="at">Telefone</label><input class="in" id="at" value="${esc(lj.telefone || "")}">
      <label class="f" for="ae">Endereço (sai na conta)</label><input class="in" id="ae" value="${esc(lj.endereco || "")}">
      <label class="f" for="as">Frase do cardápio</label><input class="in" id="as" value="${esc(lj.slogan || "")}">
      <div class="opts dois"><div><label class="f" for="am">Número de mesas</label><input class="in" id="am" type="number" min="1" max="200" value="${lj.nMesas}"></div>
        <div><label class="f" for="asv">Taxa de serviço (%)</label><input class="in" id="asv" type="number" min="0" max="30" value="${lj.taxaServico}"></div></div>
      <label class="f" for="af">Formas de pagamento (separe por vírgula)</label><input class="in" id="af" value="${esc((lj.formasPagamento || []).join(", "))}">
      <label class="opt"><input type="checkbox" id="ao" ${lj.aceitaOnline ? "checked" : ""}><span>Cardápio online aceitando pedidos</span></label>
      <button class="btn pri" id="salvarLoja">Salvar</button></div>

    <div class="card"><b>Impressoras e setores</b>
      <p class="muted pq">Cada setor manda seus itens para uma impressora. Pode ter vários setores na mesma impressora.</p>
      <div id="imps"></div><button class="btn ghost sm" id="maisImp">+ Impressora</button>
      <div class="grp">Setores</div><div id="sets"></div><button class="btn ghost sm" id="maisSet">+ Setor</button>
      <label class="f" for="aic">Conta da mesa, via de entrega e fechamento saem na</label><select class="in" id="aic"></select>
      <label class="f" for="acol">Largura da bobina</label><select class="in" id="acol"><option value="48" ${lj.colunas == 48 ? "selected" : ""}>80 mm</option><option value="32" ${lj.colunas == 32 ? "selected" : ""}>58 mm</option></select>
      <label class="opt"><input type="checkbox" id="aps" ${lj.papelPorSetor ? "checked" : ""}><span>Um papel separado para cada setor (desmarcado: tudo junto, dividido por setor)</span></label>
      <button class="btn pri" id="salvarImp">Salvar impressoras</button></div>

    <div class="card"><b>Equipe</b><p class="muted pq">Cada pessoa entra com o próprio PIN. Garçom só vê as mesas; caixa vê o painel; administrador vê também os Ajustes.</p>
      ${D.usuarios.map((u) => `<div class="cl ${u.ativo === false ? "off" : ""}"><div class="n"><b>${esc(u.nome)}</b><small>${{ admin: "Administrador", caixa: "Caixa", garcom: "Garçom" }[u.papel] || u.papel}${u.ativo === false ? " · desativado" : ""}</small></div><div class="v"><button class="btn ghost sm" data-eu="${esc(u.id)}">Editar</button></div></div>`).join("")}
      <button class="btn pri sm" id="novoU">+ Pessoa</button></div>

    <div class="card"><b>Cardápio online do cliente</b><p class="muted pq">Mande este link no WhatsApp, coloque na bio do Instagram ou imprima o QR Code na mesa.</p>
      <input class="in" readonly value="${esc(linkCardapio)}" id="link"><div class="linha-btn wrap"><button class="btn sec sm" id="copiar">Copiar link</button><a class="btn sec sm" href="${esc(linkCardapio)}" target="_blank" rel="noopener">Abrir</a>
      <a class="btn sec sm" target="_blank" rel="noopener" href="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(linkCardapio)}">QR Code</a></div></div>

    <div class="card"><b>Nota fiscal (NFC-e)</b><p class="muted pq">Ainda não ligada. Quando a loja tiver certificado digital A1, CSC da SEFAZ e os dados fiscais dos produtos (do contador), a emissão entra aqui no fechamento da conta. O CPF digitado no recebimento já fica guardado.</p></div>
  </div>`;

  // Loja
  $("#salvarLoja", el).onclick = () => store.salvar("config", "loja", {
    nome: $("#an", el).value.trim() || lj.nome, telefone: $("#at", el).value.trim(), endereco: $("#ae", el).value.trim(), slogan: $("#as", el).value.trim(),
    nMesas: Math.max(1, Math.min(200, Number($("#am", el).value) || lj.nMesas)), taxaServico: Math.max(0, Number($("#asv", el).value) || 0),
    formasPagamento: $("#af", el).value.split(",").map((x) => x.trim()).filter(Boolean), aceitaOnline: $("#ao", el).checked,
  }).then(() => toast("Salvo ✓")).catch(erro);

  // Impressoras e setores (editados em memória e salvos juntos)
  const imps = structuredClone(lj.impressoras);
  const sets = structuredClone(lj.setores);
  const des = () => {
    $("#imps", el).innerHTML = imps.map((i, k) => `<div class="forma"><input class="in" data-in="${k}" value="${esc(i.nome)}" aria-label="Nome da impressora"><code>${esc(i.id)}</code>${imps.length > 1 ? `<button class="mini-x" data-ix="${k}">×</button>` : ""}</div>`).join("");
    $("#sets", el).innerHTML = sets.map((x, k) => `<div class="forma"><input class="in" data-sn="${k}" value="${esc(x.nome)}" aria-label="Nome do setor"><select class="in" data-si="${k}">${imps.map((i) => `<option value="${esc(i.id)}" ${i.id === x.impressora ? "selected" : ""}>${esc(i.nome)}</option>`).join("")}</select>${sets.length > 1 ? `<button class="mini-x" data-sx="${k}">×</button>` : ""}</div>`).join("");
    const atual = $("#aic", el).value || lj.impressoraConta;
    $("#aic", el).innerHTML = imps.map((i) => `<option value="${esc(i.id)}" ${i.id === atual ? "selected" : ""}>${esc(i.nome)}</option>`).join("");
    $$("[data-in]", el).forEach((e) => (e.oninput = () => (imps[e.dataset.in].nome = e.value)));
    $$("[data-ix]", el).forEach((e) => (e.onclick = () => { const [r] = imps.splice(+e.dataset.ix, 1); sets.forEach((s) => s.impressora === r.id && (s.impressora = imps[0].id)); des(); }));
    $$("[data-sn]", el).forEach((e) => (e.oninput = () => (sets[e.dataset.sn].nome = e.value)));
    $$("[data-si]", el).forEach((e) => (e.onchange = () => (sets[e.dataset.si].impressora = e.value)));
    $$("[data-sx]", el).forEach((e) => (e.onclick = () => { sets.splice(+e.dataset.sx, 1); des(); }));
  };
  $("#maisImp", el).onclick = () => { imps.push({ id: "imp" + (Math.max(0, ...imps.map((i) => parseInt(i.id.replace(/\D/g, "")) || 0)) + 1), nome: `Impressora ${imps.length + 1}` }); des(); };
  $("#maisSet", el).onclick = async () => {
    const nome = await pedirTexto("Novo setor", "Nome do setor (ex.: Sobremesas)");
    if (!nome) return;
    const id = nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
    if (!sets.some((s) => s.id === id)) sets.push({ id, nome, impressora: imps[0].id });
    des();
  };
  $("#salvarImp", el).onclick = () => {
    const usados = new Set([...D.categorias.map((c) => c.setor), ...D.produtos.map((p) => p.setor).filter(Boolean)]);
    const falta = [...usados].filter((u) => !sets.some((s) => s.id === u));
    if (falta.length) return toast(`O setor "${falta[0]}" ainda é usado no cardápio. Mude as categorias antes de tirar.`);
    store.salvar("config", "loja", { impressoras: imps, setores: sets, impressoraConta: $("#aic", el).value, colunas: Number($("#acol", el).value), papelPorSetor: $("#aps", el).checked })
      .then(() => toast("Impressoras salvas ✓")).catch(erro);
  };
  des();

  // Equipe
  const editarU = (u = { papel: "garcom", ativo: true }) => {
    const s = abrirSheet(`${cabecalhoSheet(u.id ? "Editar pessoa" : "Nova pessoa")}<div class="sh-b">
      <label class="f" for="un">Nome</label><input class="in" id="un" value="${esc(u.nome || "")}">
      <label class="f" for="up">Função</label><select class="in" id="up"><option value="garcom">Garçom</option><option value="caixa">Caixa</option><option value="admin">Administrador</option></select>
      <label class="f" for="upin">PIN (4 a 6 números)</label><input class="in" id="upin" inputmode="numeric" maxlength="6" value="${esc(u.pin || "")}">
      <label class="opt"><input type="checkbox" id="ua" ${u.ativo === false ? "" : "checked"}><span>Ativo</span></label>
      <div class="linha-btn"><button class="btn pri" id="ok">Salvar</button></div></div>`);
    $("#up", s).value = u.papel;
    $("#ok", s).onclick = async () => {
      const nome = $("#un", s).value.trim(), pin = $("#upin", s).value.trim();
      if (!nome || !/^\d{4,6}$/.test(pin)) return toast("Coloque o nome e um PIN de 4 a 6 números.");
      if (D.usuarios.some((x) => x.pin === pin && x.id !== u.id && x.ativo !== false)) return toast("Esse PIN já é de outra pessoa.");
      const papel = $("#up", s).value, ativo = $("#ua", s).checked;
      if (u.papel === "admin" && (papel !== "admin" || !ativo) && D.usuarios.filter((x) => x.papel === "admin" && x.ativo !== false).length <= 1) return toast("Precisa ficar pelo menos um administrador.");
      try { await store.salvar("usuarios", u.id || novoId(), { nome, papel, pin, ativo }); fecharSheet(); toast("Salvo ✓"); } catch (e) { erro(e); }
    };
  };
  $("#novoU", el).onclick = () => editarU();
  $$("[data-eu]", el).forEach((b) => (b.onclick = () => editarU(D.usuarios.find((u) => u.id === b.dataset.eu))));
  $("#copiar", el).onclick = () => navigator.clipboard?.writeText(linkCardapio).then(() => toast("Link copiado")).catch(() => $("#link", el).select());
}

