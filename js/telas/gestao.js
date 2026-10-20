// Abas de gestão do caixa: motoboys, impressão, relatório do dia, cardápio e ajustes.
import { $, $$, esc, brl, hora, toast, erro, pedirTexto, confirmar, abrirSheet, fecharSheet, cabecalhoSheet, numero, valorCampo } from "../ui.js";
import { D, loja, totalPedido, itensValidos, tituloPedido, reimprimir, filaImpressao, canalDe, vendasPorGarcom, pagarEquipe } from "../regras.js";

const gruposAdicionais = () => [...new Set((loja().adicionais || []).map((a) => a.grupo).filter(Boolean))];
const opcoesGrupo = (atual, vazio) => `<option value="">${vazio}</option>${gruposAdicionais().map((g) => `<option ${g === atual ? "selected" : ""}>${esc(g)}</option>`).join("")}`;
const CANAIS = [["todos", "Mesa e delivery"], ["mesa", "Só mesa"], ["delivery", "Só delivery/retirada"]];
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

// Versão do agente de impressão que esta versão do sistema espera (agente-impressao/agente.js).
const VERSAO_AGENTE = "2026.10.20-4";

// -------------------------------------------------------------- Freelancers
export function abaEquipe(el, { usuario, admin }) {
  const vendas = vendasPorGarcom();
  const pago = (nome) => D.saidas.filter((x) => x.nome === nome).reduce((s, x) => s + x.valor, 0);
  const garcons = D.usuarios.filter((u) => u.ativo !== false && u.papel === "garcom");
  // garçom que trabalhou hoje mas foi tirado do cadastro continua aparecendo
  const nomes = new Set(garcons.map((u) => u.nome));
  const extras = Object.keys(vendas).filter((n) => !nomes.has(n)).map((nome) => ({ nome, id: "", papel: "garcom" }));
  const total = D.saidas.reduce((s, x) => s + x.valor, 0);
  const sugestao = (u) => (Number(u.diaria) || 0) + ((vendas[u.nome]?.servico || 0) * (Number(u.pctServico) || 0)) / 100;
  el.innerHTML = `<div class="kpis"><div class="kpi"><b>${brl(total)}</b><span>pago hoje à equipe</span></div>
      <div class="kpi"><b>${D.saidas.length}</b><span>pagamentos</span></div></div>
    <div class="linha-btn wrap"><button class="btn pri" id="outro">+ Pagar outra pessoa</button><span class="muted pq">Ajudante de cozinha, motoboy, extra… Cadastre garçons freelancers em Ajustes › Equipe.</span></div>
    <div class="grade">${[...garcons, ...extras].map((u) => {
      const v = vendas[u.nome] || { comandas: 0, vendas: 0, servico: 0 };
      const ja = pago(u.nome);
      return `<div class="card"><div class="card-h"><div><b>${esc(u.nome)}</b><small>Garçom${u.freelancer ? " · freelancer" : ""}${u.diaria ? ` · diária ${brl(u.diaria)}` : ""}${u.pctServico ? ` · ${u.pctServico}% do serviço` : ""}</small></div>${ja ? `<span class="pill ok">Pago ${brl(ja)}</span>` : ""}</div>
        <div class="sum"><div><span>Comandas atendidas hoje</span><span>${v.comandas}</span></div><div><span>Vendas nas comandas</span><span>${brl(v.vendas)}</span></div>
          <div><span>Taxa de serviço recebida</span><span>${brl(v.servico)}</span></div></div>
        <button class="btn ${ja ? "ghost" : "ok"} cheio" data-pagar="${esc(u.nome)}" data-sug="${sugestao(u).toFixed(2)}" data-fun="Garçom">${ja ? "Pagar mais" : "Pagar"}${sugestao(u) ? ` · ${brl(sugestao(u))}` : ""}</button></div>`;
    }).join("") || `<p class="vazio">Nenhum garçom cadastrado.</p>`}</div>
    <div class="card"><b>Pagamentos de hoje</b>${D.saidas.map((x) => `<div class="cl"><div class="n"><b>${esc(x.nome)}</b><small>${hora(x.criadoEm)} · ${esc(x.funcao || "")} · ${esc(x.forma)}${x.obs ? " · " + esc(x.obs) : ""} · por ${esc(x.por)}</small></div>
      <div class="v">${brl(x.valor)}${admin ? `<button class="mini-x" data-del="${x.id}" title="Apagar">×</button>` : ""}</div></div>`).join("") || `<p class="muted pq">Nenhum pagamento ainda.</p>`}</div>`;

  const pagar = ({ nome = "", funcao = "Garçom", valor = 0 } = {}) => {
    const formas = loja().formasPagamento || ["Dinheiro", "Pix"];
    const s = abrirSheet(`${cabecalhoSheet("Pagar freelancer", "Sai do caixa e entra no fechamento do dia")}<div class="sh-b">
      <label class="f" for="fn">Nome</label><input class="in" id="fn" value="${esc(nome)}">
      <label class="f" for="ff">Função</label><select class="in" id="ff">${["Garçom", "Cozinha", "Pizzaiolo", "Bar", "Motoboy", "Limpeza", "Outro"].map((f) => `<option ${f === funcao ? "selected" : ""}>${f}</option>`).join("")}</select>
      <div class="opts dois"><div><label class="f" for="fv">Valor (R$)</label><input class="in grande" id="fv" inputmode="decimal" value="${valor ? valorCampo(valor) : ""}"></div>
        <div><label class="f" for="fp">Pago em</label><select class="in" id="fp">${formas.filter((f) => ["Dinheiro", "Pix"].includes(f)).concat(formas.filter((f) => !["Dinheiro", "Pix"].includes(f))).map((f) => `<option>${esc(f)}</option>`).join("")}</select></div></div>
      <label class="f" for="fo">Observação (ex.: diária + 10%)</label><input class="in" id="fo">
      <div class="err" id="ferr"></div><button class="btn ok cheio grande" id="ok">Registrar pagamento</button></div>`);
    setTimeout(() => $(nome ? "#fv" : "#fn", s).focus(), 50);
    $("#ok", s).onclick = async (ev) => {
      const dados = { nome: $("#fn", s).value.trim(), funcao: $("#ff", s).value, valor: numero($("#fv", s).value), forma: $("#fp", s).value, obs: $("#fo", s).value.trim() };
      if (!dados.nome || !(dados.valor > 0)) return ($("#ferr", s).textContent = "Coloque o nome e o valor.");
      ev.currentTarget.disabled = true;
      try { await pagarEquipe(dados, usuario); fecharSheet(); toast(`Pagamento de ${brl(dados.valor)} registrado ✓`, "bom"); } catch (e) { erro(e); ev.currentTarget.disabled = false; }
    };
  };
  $("#outro", el).onclick = () => pagar({ funcao: "Cozinha" });
  $$("[data-pagar]", el).forEach((b) => (b.onclick = () => pagar({ nome: b.dataset.pagar, funcao: b.dataset.fun, valor: Number(b.dataset.sug) })));
  $$("[data-del]", el).forEach((b) => (b.onclick = async () => {
    if (await confirmar("Apagar pagamento", "Apagar este pagamento? O valor volta para o caixa.", { ok: "Apagar", perigo: true })) store.apagar("saidas", b.dataset.del).catch(erro);
  }));
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
      const sal = lj.setores.filter((s) => s.impressora === imp.id).length;
      const del = lj.setores.filter((s) => (s.impressoraDelivery || s.impressora) === imp.id).length;
      const setores = [sal && `salão (${sal} setores)`, del && `delivery/retirada (${del} setores)`].filter(Boolean);
      const ult = js.find((j) => j.status === "impresso");
      return `<div class="card"><div class="card-h"><div><b>🖨️ ${esc(imp.nome)}</b><small>${setores.length ? esc(setores.join(", ")) : "nenhum setor"}${lj.impressoraConta === imp.id ? " · contas e vias" : ""}</small></div>
        <span class="pill ${fila ? "alerta" : "ok"}">${fila ? `${fila} na fila` : "em dia"}</span></div>
        <small class="muted">${ult ? `Último impresso às ${hora(ult.impressoEm || ult.criadoEm)}` : "Nada impresso hoje"}</small>
        ${ult && ult.por !== "navegador" ? (ult.agente === VERSAO_AGENTE ? `<small class="ok-txt">Agente atualizado (${esc(ult.agente)})</small>`
          : `<small class="ruim-txt"><b>Agente desatualizado${ult.agente ? ` (${esc(ult.agente)})` : ""}.</b> Troque os arquivos do agente no computador do caixa para o tamanho da letra e o corte funcionarem.</small>`) : ""}
        <div class="opts dois letra"><div><label class="f" for="tam-${imp.id}">Tamanho da letra</label><select class="in" id="tam-${imp.id}" data-tam="${imp.id}">
            ${[["grande", "Grande (dupla)"], ["medio", "Médio"], ["pequeno", "Pequeno"]].map(([v, l]) => `<option value="${v}" ${(imp.tamanho || "medio") === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div><label class="f" for="fon-${imp.id}">Fonte</label><select class="in" id="fon-${imp.id}" data-fon="${imp.id}">
            ${[["arial", "Arial (igual ao sistema antigo)"], ["A", "Da impressora"], ["B", "Da impressora, compacta"]].map(([v, l]) => `<option value="${v}" ${(imp.fonte || "arial") === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div><label class="f" for="cor-${imp.id}">Corte do papel</label><select class="in" id="cor-${imp.id}" data-cor="${imp.id}">
            ${[["total", "Automático (separa)"], ["parcial", "Parcial (pontinha)"], ["compat", "Compatível (antigas)"], ["nenhum", "Sem corte"]].map(([v, l]) => `<option value="${v}" ${(imp.corte || "total") === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div><label class="f" for="ava-${imp.id}">Espaço antes do corte</label><select class="in" id="ava-${imp.id}" data-ava="${imp.id}">
            ${[2, 3, 4, 5, 6, 8].map((v) => `<option value="${v}" ${Number(imp.avanco ?? 4) === v ? "selected" : ""}>${v} linhas</option>`).join("")}</select></div>
          <div><label class="f" for="col-${imp.id}">Letras por linha</label><select class="in" id="col-${imp.id}" data-col="${imp.id}">
            ${[[48, "48 (80 mm)"], [42, "42 (Bematech 80 mm)"], [32, "32 (58 mm)"]].map(([v, l]) => `<option value="${v}" ${Number(imp.colunas || 48) === v ? "selected" : ""}>${l}</option>`).join("")}</select></div></div>
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
      { t: `Salão: ${lj.setores.filter((s) => s.impressora === imp.id).map((s) => s.nome).join(", ") || "-"}` },
      { t: `Delivery: ${lj.setores.filter((s) => (s.impressoraDelivery || s.impressora) === imp.id).map((s) => s.nome).join(", ") || "-"}` },
      { t: new Date().toLocaleString("pt-BR") }, { t: "Acentuação: ção ã é ü" }, { sep: true },
      { t: "1x Coca-Cola 2 litros (Normal)", b: true, g: true }, { t: "1x Pizza grande meio a meio", b: true, g: true }, { t: "   1/2 Calabresa", b: true },
      { sep: true }, { t: "1x Pizza grande Calabresa  74,00", e: "1x Pizza grande Calabresa", d: "74,00" }, { t: "TOTAL R$  74,00", e: "TOTAL R$", d: "74,00", b: true }, { sep: true }, { t: "Sistema Elite · Elite MKT", c: true },
    ])]).then(() => toast("Teste enviado para a fila")).catch(erro);
  }));
  // Tamanho/fonte: salva na hora e vale para os próximos cupons dessa impressora.
  const mudarEstilo = (id, campo, valor) => store.salvar("config", "loja", { impressoras: lj.impressoras.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)) })
    .then(() => toast("Salvo. Clique em Imprimir teste para conferir.", "bom")).catch(erro);
  $$("[data-tam]", el).forEach((e) => (e.onchange = () => mudarEstilo(e.dataset.tam, "tamanho", e.value)));
  $$("[data-fon]", el).forEach((e) => (e.onchange = () => mudarEstilo(e.dataset.fon, "fonte", e.value)));
  $$("[data-col]", el).forEach((e) => (e.onchange = () => mudarEstilo(e.dataset.col, "colunas", Number(e.value))));
  $$("[data-cor]", el).forEach((e) => (e.onchange = () => mudarEstilo(e.dataset.cor, "corte", e.value)));
  $$("[data-ava]", el).forEach((e) => (e.onchange = () => mudarEstilo(e.dataset.ava, "avanco", Number(e.value))));
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
  const saidas = D.saidas.reduce((s, x) => s + x.valor, 0);
  const saidasDinheiro = D.saidas.filter((x) => x.forma === "Dinheiro").reduce((s, x) => s + x.valor, 0);
  const gaveta = (porForma.Dinheiro || 0) - saidasDinheiro;
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
      <div class="card"><b>Caixa</b><div class="sum"><div><span>Dinheiro recebido</span><span>${brl(porForma.Dinheiro || 0)}</span></div>
        <div><span>Pagamentos a freelancers</span><span>− ${brl(saidas)}</span></div>
        <div class="t"><span>Dinheiro na gaveta</span><span>${brl(gaveta)}</span></div>
        <div><span>Recebido − pagamentos</span><span>${brl(total - saidas)}</span></div></div></div>
      <div class="card"><b>Mais vendidos hoje</b><div class="sum">${top.map(([n, q]) => `<div><span>${esc(n)}</span><span>${q}</span></div>`).join("") || `<p class="vazio">—</p>`}</div></div>
    </div>
    <div class="linha-btn"><button class="btn pri" id="fech">Imprimir fechamento do dia</button></div>
    <div class="card"><b>Recebimentos</b>${pags.map((p) => `<div class="cl"><div class="n"><b>${p.mesa ? `Mesa ${p.mesa}` : nomesTipo[p.tipo] || ""} ${p.numeros?.length ? "#" + p.numeros.join(", #") : ""}${p.nomes?.length ? " · " + esc(p.nomes.join(", ")) : ""}</b><small>${hora(p.criadoEm)} · ${esc(p.pagamentos.map((x) => `${x.forma} ${brl(x.valor)}`).join(" + "))} · ${esc(p.por || "")}</small></div><div class="v">${brl(p.total)}</div></div>`).join("") || `<p class="vazio">Nada ainda.</p>`}</div>`;
  $("#fech", el).onclick = () => {
    const w = Number(loja().colunas) || 48;
    const lado = (a, b) => ({ t: a + " ".repeat(Math.max(1, w - a.length - b.length)) + b, e: a, d: b });
    const r = (v) => v.toFixed(2).replace(".", ",");
    const linhas = [
      { t: loja().nome, b: true, c: true }, { t: "FECHAMENTO DO DIA", b: true, g: true, c: true },
      { t: new Date().toLocaleString("pt-BR"), c: true }, { t: `Por: ${usuario.nome}`, c: true }, { sep: true },
      ...Object.entries(porForma).map(([f, v]) => lado(f, r(v))), { sep: true },
      ...Object.entries(porTipo).map(([t, v]) => lado(nomesTipo[t] || t, r(v))),
      lado("Serviço", r(servico)), lado("Descontos", r(desconto)), lado("Cancelados", String(cancel.length)), { sep: true },
      { ...lado("TOTAL RECEBIDO", r(total)), b: true, g: true }, lado("Contas", String(pags.length)), { sep: true },
      ...(D.saidas.length ? [{ t: "PAGAMENTOS A FREELANCERS", b: true }, ...D.saidas.map((x) => lado(`${x.nome} (${x.forma})`, r(x.valor))), { ...lado("Total pago", r(saidas)), b: true }, { sep: true }] : []),
      { ...lado("DINHEIRO NA GAVETA", r(gaveta)), b: true }, { sep: true },
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
    ${cat ? `<div class="card"><div class="card-h"><div><b>${esc(cat.nome)}</b><small>Setor: ${esc(nomeSetor(cat.setor))}${cat.grupoPizza ? " · monta pizza (meio a meio, borda)" : ""}${cat.grupoAdicional ? ` · adicionais de ${esc(cat.grupoAdicional)} na mesa` : ""}</small></div><button class="btn ghost sm" id="edCat">Editar categoria</button></div>
      <div class="linha-btn"><button class="btn pri sm" id="novoProd">+ Produto</button></div>
      ${prods.map((p) => `<div class="cl ${p.ativo === false ? "off" : ""}"><div class="n"><b>${esc(p.nome)}</b><small>${esc(p.desc || "")}</small>${p.ativo === false ? `<small class="ruim-txt">Esgotado / fora do cardápio</small>` : ""}</div>
        <div class="v">${brl(p.preco)}${p.precoBroto ? `<small>broto ${brl(p.precoBroto)}</small>` : ""}<select class="in mini-sel" data-cn="${esc(p.id)}" aria-label="Onde vende">${CANAIS.map(([v, l]) => `<option value="${v}" ${canalDe(p) === v ? "selected" : ""}>${l}</option>`).join("")}</select><label class="sw" title="Disponível"><input type="checkbox" data-av="${esc(p.id)}" ${p.ativo === false ? "" : "checked"}><span></span></label><button class="btn ghost sm" data-ep="${esc(p.id)}">Editar</button></div></div>`).join("") || `<p class="vazio">Nenhum produto nesta categoria.</p>`}</div>` : ""}
    <div class="grade">
      <div class="card"><div class="card-h"><b>Bordas (pizzas salgadas)</b><button class="btn ghost sm" id="edBordas">Editar</button></div>${(lj.bordas || []).map((b) => `<div class="cl"><span>${esc(b.nome)}</span><span>${brl(b.preco)}</span></div>`).join("")}</div>
      <div class="card"><div class="card-h"><b>Adicionais (só mesa)</b><button class="btn ghost sm" id="edAdic">Editar</button></div>${gruposAdicionais().map((g) => `<div class="grp">${esc(g)}</div>${(lj.adicionais || []).filter((a) => a.grupo === g).map((b) => `<div class="cl"><span>${esc(b.nome)}${b.livre ? ` <small class="muted">(garçom escreve qual)</small>` : ""}</span><span>${brl(b.preco)}</span></div>`).join("")}`).join("") || `<p class="muted pq">Nenhum adicional cadastrado.</p>`}</div>
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
  $("#edAdic", el).onclick = editarAdicionais;
  $$("[data-cn]", el).forEach((b) => (b.onchange = () => store.salvar("produtos", b.dataset.cn, { canal: b.value, semEntrega: b.value === "mesa" })
    .then(() => toast(`Agora: ${CANAIS.find(([v]) => v === b.value)[1]}`)).catch(erro)));
}

function editarProduto(p) {
  const s = abrirSheet(`${cabecalhoSheet(p.id ? "Editar produto" : "Novo produto")}<div class="sh-b">
    <label class="f" for="pn">Nome</label><input class="in" id="pn" value="${esc(p.nome || "")}">
    <label class="f" for="pd">Descrição</label><input class="in" id="pd" value="${esc(p.desc || "")}">
    <label class="f" for="pc">Categoria</label><select class="in" id="pc">${D.categorias.map((c) => `<option value="${esc(c.id)}" ${c.id === p.cat ? "selected" : ""}>${esc(c.nome)}</option>`).join("")}</select>
    <div class="opts dois"><div><label class="f" for="pp">Preço (R$)</label><input class="in" id="pp" inputmode="decimal" value="${p.preco != null ? valorCampo(p.preco) : ""}"></div>
      <div><label class="f" for="pb">Preço brotinho (só pizza)</label><input class="in" id="pb" inputmode="decimal" value="${p.precoBroto ? valorCampo(p.precoBroto) : ""}"></div></div>
    <label class="f" for="po">Opções para escolher (separe por vírgula, ex.: Coca-Cola, Guaraná)</label><input class="in" id="po" value="${esc((p.opcoes || []).join(", "))}">
    <label class="f" for="pad">Adicionais na mesa</label><select class="in" id="pad"><option value="__cat" ${p.grupoAdicional == null ? "selected" : ""}>Os da categoria</option>${opcoesGrupo(p.grupoAdicional === "" ? "" : p.grupoAdicional, "Nenhum").replace('<option value="">Nenhum</option>', `<option value="" ${p.grupoAdicional === "" ? "selected" : ""}>Nenhum</option>`)}</select>
    <label class="f" for="ps">Setor de impressão</label><select class="in" id="ps"><option value="">O mesmo da categoria</option>${loja().setores.map((x) => `<option value="${esc(x.id)}" ${x.id === p.setor ? "selected" : ""}>${esc(x.nome)}</option>`).join("")}</select>
    <label class="opt"><input type="checkbox" id="pz" ${p.tipo === "pizza" ? "checked" : ""}><span>É pizza (tamanho, meio a meio, borda)</span></label>
    <label class="opt"><input type="checkbox" id="pv" ${p.veg ? "checked" : ""}><span>Vegetariano</span></label>
    <label class="f" for="pe">Onde vende</label><select class="in" id="pe">${CANAIS.map(([v, l]) => `<option value="${v}" ${canalDe(p) === v ? "selected" : ""}>${l}</option>`).join("")}</select>
    <label class="opt"><input type="checkbox" id="pa" ${p.ativo === false ? "" : "checked"}><span>Disponível</span></label>
    <div class="linha-btn">${p.id ? `<button class="btn perigo" id="del">Excluir</button>` : ""}<button class="btn pri" id="ok">Salvar</button></div></div>`);
  $("#ok", s).onclick = async () => {
    const nome = $("#pn", s).value.trim();
    const preco = numero($("#pp", s).value);
    if (!nome || !preco) return toast("Coloque nome e preço.");
    const dados = {
      nome, desc: $("#pd", s).value.trim(), cat: $("#pc", s).value, preco, precoBroto: numero($("#pb", s).value) || null,
      opcoes: $("#po", s).value.split(",").map((x) => x.trim()).filter(Boolean), setor: $("#ps", s).value || null, grupoAdicional: $("#pad", s).value === "__cat" ? null : $("#pad", s).value,
      tipo: $("#pz", s).checked ? "pizza" : "simples", veg: $("#pv", s).checked, canal: $("#pe", s).value, semEntrega: $("#pe", s).value === "mesa", ativo: $("#pa", s).checked,
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
    <label class="f" for="cad">Adicionais que o garçom pode lançar</label><select class="in" id="cad">${opcoesGrupo(c.grupoAdicional, "Nenhum")}</select>
    <label class="f" for="co">Ordem no cardápio</label><input class="in" id="co" type="number" value="${c.ordem ?? D.categorias.length + 1}">
    <div class="linha-btn">${c.id ? `<button class="btn perigo" id="del">Excluir</button>` : ""}<button class="btn pri" id="ok">Salvar</button></div></div>`);
  $("#ok", s).onclick = async () => {
    const nome = $("#cn", s).value.trim();
    if (!nome) return toast("Coloque o nome.");
    const id = c.id || nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || novoId();
    try {
      await store.salvar("categorias", id, { nome, setor: $("#cs", s).value, nota: $("#cno", s).value.trim(), prefixo: $("#cp", s).value, grupoPizza: $("#cg", s).value, grupoAdicional: $("#cad", s).value, ordem: Number($("#co", s).value) || 0 });
      sessionStorage.setItem("se_cat", id); fecharSheet(); toast("Salvo ✓");
    } catch (e) { erro(e); }
  };
  $("#del", s) && ($("#del", s).onclick = async () => {
    if (D.produtos.some((p) => p.cat === c.id)) return toast("Tire ou mude os produtos dessa categoria antes.");
    if (await confirmar("Excluir categoria", `Excluir "${c.nome}"?`, { ok: "Excluir", perigo: true })) store.apagar("categorias", c.id).catch(erro);
  });
}

// Adicionais: grupo (Pizza, Esfiha…), nome, preço e se o garçom escreve qual é ("Outros adicionais").
function editarAdicionais() {
  const itens = structuredClone(loja().adicionais || []);
  const s = abrirSheet(`${cabecalhoSheet("Adicionais (só mesa)", "O grupo liga o adicional à categoria ou ao produto")}<div class="sh-b">
    <datalist id="dlGrupos">${gruposAdicionais().map((g) => `<option value="${esc(g)}">`).join("")}</datalist>
    <div id="ls"></div><button class="btn ghost sm" id="mais">+ Adicional</button><div class="linha-btn"><button class="btn pri" id="ok">Salvar</button></div></div>`, { largo: true });
  const des = () => {
    $("#ls", s).innerHTML = `<div class="ad-linha ad-cab"><span>Grupo</span><span>Nome</span><span>Preço</span><span>Escreve qual</span><span></span></div>` + itens.map((x, i) => `<div class="ad-linha">
      <input class="in" data-g="${i}" list="dlGrupos" value="${esc(x.grupo || "")}" placeholder="Ex.: Pizza" aria-label="Grupo">
      <input class="in" data-n="${i}" value="${esc(x.nome)}" placeholder="Ex.: Catupiry Original" aria-label="Nome">
      <input class="in" data-v="${i}" inputmode="decimal" value="${valorCampo(x.preco)}" aria-label="Preço">
      <label class="sw" title="Garçom escreve qual é"><input type="checkbox" data-l="${i}" ${x.livre ? "checked" : ""}><span></span></label>
      <button class="mini-x" data-x="${i}" aria-label="Tirar">×</button></div>`).join("");
    $$("[data-g]", s).forEach((e) => (e.oninput = () => (itens[e.dataset.g].grupo = e.value.trim())));
    $$("[data-n]", s).forEach((e) => (e.oninput = () => (itens[e.dataset.n].nome = e.value)));
    $$("[data-v]", s).forEach((e) => (e.oninput = () => (itens[e.dataset.v].preco = numero(e.value))));
    $$("[data-l]", s).forEach((e) => (e.onchange = () => (itens[e.dataset.l].livre = e.checked)));
    $$("[data-x]", s).forEach((e) => (e.onclick = () => { itens.splice(+e.dataset.x, 1); des(); }));
  };
  $("#mais", s).onclick = () => { itens.push({ grupo: itens[itens.length - 1]?.grupo || "", nome: "", preco: 0 }); des(); };
  $("#ok", s).onclick = () => store.salvar("config", "loja", { adicionais: itens.filter((x) => x.nome.trim() && x.grupo) })
    .then(() => { fecharSheet(); toast("Adicionais salvos ✓"); }).catch(erro);
  des();
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

    <div class="card inteiro"><b>Impressoras e setores</b>
      <p class="muted pq">Cada setor escolhe em qual impressora sai quando o pedido é do salão (mesas) e quando é de delivery/retirada. Vários setores na mesma impressora saem no mesmo papel, divididos por título.</p>
      <div id="imps"></div><button class="btn ghost sm" id="maisImp">+ Impressora</button>
      <div class="grp">Setores</div><div id="sets"></div><button class="btn ghost sm" id="maisSet">+ Setor</button>
      <label class="f" for="aic">Conta da mesa, via de entrega e fechamento saem na</label><select class="in" id="aic"></select>
      <label class="f" for="acol">Largura da bobina</label><select class="in" id="acol"><option value="48" ${lj.colunas == 48 ? "selected" : ""}>80 mm</option><option value="32" ${lj.colunas == 32 ? "selected" : ""}>58 mm</option></select>
      <label class="opt"><input type="checkbox" id="aps" ${lj.papelPorSetor ? "checked" : ""}><span>Um papel separado para cada setor (desmarcado: tudo junto, dividido por setor)</span></label>
      <button class="btn pri" id="salvarImp">Salvar impressoras</button></div>

    <div class="card"><b>Equipe</b><p class="muted pq">Cada pessoa entra com o próprio PIN. Garçom só vê as mesas; caixa vê o painel; administrador vê também os Ajustes.</p>
      ${D.usuarios.map((u) => `<div class="cl ${u.ativo === false ? "off" : ""}"><div class="n"><b>${esc(u.nome)}</b><small>${{ admin: "Administrador", caixa: "Caixa", garcom: "Garçom" }[u.papel] || u.papel}${u.freelancer ? ` · freelancer${u.diaria ? " · diária " + brl(u.diaria) : ""}` : ""}${u.ativo === false ? " · desativado" : ""}</small></div><div class="v"><button class="btn ghost sm" data-eu="${esc(u.id)}">Editar</button></div></div>`).join("")}
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
    $("#imps", el).innerHTML = imps.map((i, k) => `<div class="forma imp"><input class="in" data-in="${k}" value="${esc(i.nome)}" aria-label="Nome da impressora"><code>${esc(i.id)}</code>${imps.length > 1 ? `<button class="mini-x" data-ix="${k}">×</button>` : ""}</div>`).join("");
    const opImp = (sel) => imps.map((i) => `<option value="${esc(i.id)}" ${i.id === sel ? "selected" : ""}>${esc(i.nome)}</option>`).join("");
    $("#sets", el).innerHTML = `<div class="set-linha set-cab"><span>Setor</span><span>Salão (mesas)</span><span>Delivery / retirada</span><span></span></div>` + sets.map((x, k) => `<div class="set-linha"><input class="in" data-sn="${k}" value="${esc(x.nome)}" aria-label="Nome do setor">
      <select class="in" data-si="${k}" aria-label="Impressora do salão">${opImp(x.impressora)}</select>
      <select class="in" data-sd="${k}" aria-label="Impressora do delivery">${opImp(x.impressoraDelivery || x.impressora)}</select>${sets.length > 1 ? `<button class="mini-x" data-sx="${k}">×</button>` : "<span></span>"}</div>`).join("");
    const atual = $("#aic", el).value || lj.impressoraConta;
    $("#aic", el).innerHTML = imps.map((i) => `<option value="${esc(i.id)}" ${i.id === atual ? "selected" : ""}>${esc(i.nome)}</option>`).join("");
    $$("[data-in]", el).forEach((e) => (e.oninput = () => (imps[e.dataset.in].nome = e.value)));
    $$("[data-ix]", el).forEach((e) => (e.onclick = () => { const [r] = imps.splice(+e.dataset.ix, 1); sets.forEach((s) => { if (s.impressora === r.id) s.impressora = imps[0].id; if (s.impressoraDelivery === r.id) s.impressoraDelivery = imps[0].id; }); des(); }));
    $$("[data-sn]", el).forEach((e) => (e.oninput = () => (sets[e.dataset.sn].nome = e.value)));
    $$("[data-si]", el).forEach((e) => (e.onchange = () => (sets[e.dataset.si].impressora = e.value)));
    $$("[data-sd]", el).forEach((e) => (e.onchange = () => (sets[e.dataset.sd].impressoraDelivery = e.value)));
    $$("[data-sx]", el).forEach((e) => (e.onclick = () => { sets.splice(+e.dataset.sx, 1); des(); }));
  };
  $("#maisImp", el).onclick = () => { imps.push({ id: "imp" + (Math.max(0, ...imps.map((i) => parseInt(i.id.replace(/\D/g, "")) || 0)) + 1), nome: `Impressora ${imps.length + 1}` }); des(); };
  $("#maisSet", el).onclick = async () => {
    const nome = await pedirTexto("Novo setor", "Nome do setor (ex.: Sobremesas)");
    if (!nome) return;
    const id = nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
    if (!sets.some((s) => s.id === id)) sets.push({ id, nome, impressora: imps[0].id, impressoraDelivery: imps[0].id });
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
      <label class="opt"><input type="checkbox" id="ufr" ${u.freelancer ? "checked" : ""}><span>Freelancer (recebe por dia)</span></label>
      <div class="opts dois" id="ufrBox"><div><label class="f" for="udi">Diária (R$)</label><input class="in" id="udi" inputmode="decimal" value="${u.diaria ? valorCampo(u.diaria) : ""}"></div>
        <div><label class="f" for="upc">% da taxa de serviço</label><input class="in" id="upc" type="number" min="0" max="100" value="${u.pctServico ?? ""}" placeholder="0"></div></div>
      <label class="opt"><input type="checkbox" id="ua" ${u.ativo === false ? "" : "checked"}><span>Ativo</span></label>
      <div class="linha-btn"><button class="btn pri" id="ok">Salvar</button></div></div>`);
    $("#up", s).value = u.papel;
    const fr = () => ($("#ufrBox", s).hidden = !$("#ufr", s).checked);
    $("#ufr", s).onchange = fr; fr();
    $("#ok", s).onclick = async () => {
      const nome = $("#un", s).value.trim(), pin = $("#upin", s).value.trim();
      if (!nome || !/^\d{4,6}$/.test(pin)) return toast("Coloque o nome e um PIN de 4 a 6 números.");
      if (D.usuarios.some((x) => x.pin === pin && x.id !== u.id && x.ativo !== false)) return toast("Esse PIN já é de outra pessoa.");
      const papel = $("#up", s).value, ativo = $("#ua", s).checked;
      if (u.papel === "admin" && (papel !== "admin" || !ativo) && D.usuarios.filter((x) => x.papel === "admin" && x.ativo !== false).length <= 1) return toast("Precisa ficar pelo menos um administrador.");
      const extra = { freelancer: $("#ufr", s).checked, diaria: numero($("#udi", s).value), pctServico: Number($("#upc", s).value) || 0 };
      try { await store.salvar("usuarios", u.id || novoId(), { nome, papel, pin, ativo, ...extra }); fecharSheet(); toast("Salvo ✓"); } catch (e) { erro(e); }
    };
  };
  $("#novoU", el).onclick = () => editarU();
  $$("[data-eu]", el).forEach((b) => (b.onclick = () => editarU(D.usuarios.find((u) => u.id === b.dataset.eu))));
  $("#copiar", el).onclick = () => navigator.clipboard?.writeText(linkCardapio).then(() => toast("Link copiado")).catch(() => $("#link", el).select());
}

