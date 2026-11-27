// NF-e para empresa (nota grande, modelo 55): escolhe a mesa/comanda, digita o CNPJ (os dados aparecem sozinhos),
// as empresas ficam salvas para as próximas vezes. O agente do caixa emite pelo Focus e o PDF abre daqui.
import { $, $$, esc, brl, toast, erro, abrirSheet, fecharSheet, cabecalhoSheet } from "../ui.js";
import { D, loja, subtotal, itensValidos, rotuloComanda, tituloPedido, calcularNfe, criarNfeEmpresa } from "../regras.js";
import { store } from "../store.js";

const so = (v) => String(v || "").replace(/\D/g, "");
const fmtCnpj = (v) => so(v).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

// Confere os dois dígitos do CNPJ (pega erro de digitação antes de pedir a nota).
export function cnpjValido(v) {
  const c = so(v);
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const dig = (n) => { let s = 0, p = n - 7; for (let i = 0; i < n; i++) { s += Number(c[i]) * p--; if (p < 2) p = 9; } const r = s % 11; return r < 2 ? 0 : 11 - r; };
  return dig(12) === Number(c[12]) && dig(13) === Number(c[13]);
}

// Dados públicos do CNPJ (razão social e endereço). A inscrição estadual não vem: a Rita digita se a empresa tiver.
async function buscarCnpj(cnpj) {
  const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${so(cnpj)}`, { signal: AbortSignal.timeout(12000) });
  if (!r.ok) throw new Error(r.status === 404 ? "CNPJ não encontrado" : "a busca do CNPJ não respondeu");
  const d = await r.json();
  const rua = [d.descricao_tipo_de_logradouro, d.logradouro].filter(Boolean).join(" ").trim();
  return { razaoSocial: d.razao_social || "", logradouro: rua, numero: d.numero || "", bairro: d.bairro || "", municipio: d.municipio || "", uf: d.uf || "", cep: so(d.cep), email: (d.email || "").toLowerCase(), complemento: d.complemento || "" };
}

const abertosParaNota = () => D.abertos
  .filter((p) => !p.pago && p.status !== "cancelado" && !p.nfeEmpresa && itensValidos(p).length)
  .sort((a, b) => (a.tipo === "mesa" ? 0 : 1) - (b.tipo === "mesa" ? 0 : 1) || (a.mesa || 0) - (b.mesa || 0) || (a.criadoEm || 0) - (b.criadoEm || 0));

export async function abrirNfeEmpresa({ usuario, aoEmitir = () => {} } = {}) {
  const abertos = abertosParaNota();
  let salvas = [];
  try { salvas = (await store.consultar("clientes", ["tipo", "==", "empresa"])).sort((a, b) => String(a.razaoSocial).localeCompare(String(b.razaoSocial))); } catch {}
  const taxa = Number(loja().taxaServico) || 0;
  const rot = (p) => (p.tipo === "mesa" ? `Mesa ${p.mesa} · ${rotuloComanda(p)}${p.nome && p.nome !== "Mesa inteira" ? " · " + p.nome : ""}` : tituloPedido(p));
  const campo = (id, rotulo, extra = "", cls = "") => `<div ${cls ? `class="${cls}"` : ""}><label class="f" for="${id}">${rotulo}</label><input class="in" id="${id}" ${extra}></div>`;
  const s = abrirSheet(`${cabecalhoSheet("NF-e para empresa", "Nota fiscal grande, com os dados da empresa")}<div class="sh-b">
    <div class="grp">1. Qual mesa ou pedido?</div>
    ${abertos.length ? `<div class="opts">${abertos.map((p) => `<label class="opt"><input type="checkbox" name="nfp" value="${esc(p.id)}"><span>${esc(rot(p))}${p.pessoas ? ` · ${p.pessoas} pessoa${p.pessoas > 1 ? "s" : ""}` : ""}</span><em>${brl(subtotal(p))}</em></label>`).join("")}</div>` : `<p class="vazio">Não há mesa nem pedido aberto. Peça a nota quando a conta ainda estiver aberta.</p>`}
    ${taxa > 0 ? `<label class="opt"><input type="checkbox" id="nfServ" checked><span>Cobrar a taxa de serviço (${taxa}%) na nota</span></label>` : ""}
    <div class="sum" id="nfSum"></div>
    <div class="grp">2. Empresa</div>
    ${salvas.length ? `<label class="f" for="nfSalvas">Empresas já cadastradas</label><select class="in" id="nfSalvas"><option value="">Escolher uma empresa salva…</option>${salvas.map((e) => `<option value="${esc(e.id)}">${esc(e.razaoSocial)} · ${esc(fmtCnpj(e.id))}</option>`).join("")}</select>` : ""}
    ${campo("nfCnpj", "CNPJ da empresa", 'inputmode="numeric" placeholder="Só números" autocomplete="off"')}
    <small class="muted" id="nfMsg"></small>
    <div class="opts dois">${campo("nfRaz", "Razão social")}${campo("nfIe", "Inscrição estadual <small>(vazio se não tiver)</small>", 'inputmode="numeric"')}
      ${campo("nfCep", "CEP", 'inputmode="numeric"')}${campo("nfRua", "Rua")}${campo("nfNum", "Número")}${campo("nfBai", "Bairro")}
      ${campo("nfCid", "Cidade")}${campo("nfUf", "UF", 'maxlength="2"')}${campo("nfEmail", "E-mail <small>(opcional)</small>", 'type="email"')}</div>
    <label class="opt"><input type="checkbox" id="nfSalvar" checked><span>Salvar esta empresa para as próximas vezes</span></label>
    <div class="grp">3. O que vai na nota?</div>
    <div class="opts dois"><label class="opt"><input type="radio" name="nfmodo" value="itens" checked><span>Os itens do pedido</span></label>
      <label class="opt"><input type="radio" name="nfmodo" value="refeicao"><span>Refeição por pessoa</span></label></div>
    <div id="nfPesBox" hidden>${campo("nfPes", "Quantas pessoas?", 'inputmode="numeric" placeholder="Ex.: 11"')}<small class="muted">O valor total é dividido igualmente: N refeições com o mesmo valor cada.</small></div>
    <p class="muted pq">Esta venda não gera o cupom fiscal comum: a nota para empresa substitui. Depois, receba a conta normalmente.</p>
    <div class="err" id="err"></div>
    <button class="btn ok cheio grande" id="nfOk">Emitir NF-e</button></div>`, { largo: true });

  const escolhidos = () => abertos.filter((p) => $$('input[name="nfp"]:checked', s).some((i) => i.value === p.id));
  const modo = () => $('input[name="nfmodo"]:checked', s).value;
  const calc = () => { const ps = escolhidos(); return ps.length ? calcularNfe(ps, { modo: modo(), pessoas: Number($("#nfPes", s).value) || 0, comServico: $("#nfServ", s)?.checked ?? false }) : null; };
  const resumo = () => {
    const ps = escolhidos(), c = calc();
    $("#nfSum", s).innerHTML = c
      ? `<div><span>Itens</span><span>${brl(c.bruto)}</span></div>${c.servico ? `<div><span>Taxa de serviço</span><span>${brl(c.servico)}</span></div>` : ""}${c.desconto ? `<div><span>Cupom</span><span>- ${brl(c.desconto)}</span></div>` : ""}<div class="t"><span>Total da nota</span><span>${brl(c.total)}</span></div>${modo() === "refeicao" && Number($("#nfPes", s).value) > 0 ? `<div><span>${Math.round(Number($("#nfPes", s).value))} refeições de</span><span>${brl(c.total / Math.round(Number($("#nfPes", s).value)))}</span></div>` : ""}`
      : `<div><span>Escolha a mesa ou o pedido</span><span></span></div>`;
    if (modo() === "refeicao" && !$("#nfPes", s).value) { const n = ps.reduce((t, p) => t + (Number(p.pessoas) || 0), 0); if (n) $("#nfPes", s).value = n; }
  };
  $$('input[name="nfp"]', s).forEach((i) => (i.onchange = resumo));
  $("#nfServ", s) && ($("#nfServ", s).onchange = resumo);
  $("#nfPes", s).oninput = resumo;
  $$('input[name="nfmodo"]', s).forEach((i) => (i.onchange = () => { $("#nfPesBox", s).hidden = modo() !== "refeicao"; resumo(); }));
  resumo();

  const preencher = (e) => {
    const v = (id, x) => ($(id, s).value = x ?? "");
    v("#nfRaz", e.razaoSocial); v("#nfIe", e.ie); v("#nfCep", e.cep); v("#nfRua", e.logradouro); v("#nfNum", e.numero);
    v("#nfBai", e.bairro); v("#nfCid", e.municipio); v("#nfUf", e.uf); v("#nfEmail", e.email);
  };
  $("#nfSalvas", s) && ($("#nfSalvas", s).onchange = (ev) => {
    const e = salvas.find((x) => x.id === ev.target.value);
    if (!e) return;
    $("#nfCnpj", s).value = fmtCnpj(e.id); preencher(e); $("#nfMsg", s).textContent = "Empresa salva ✓ confira os dados.";
  });
  let buscando = "";
  $("#nfCnpj", s).oninput = async () => {
    const c = so($("#nfCnpj", s).value), msg = $("#nfMsg", s);
    if (c.length < 14) { msg.textContent = ""; return; }
    if (!cnpjValido(c)) { msg.textContent = "Esse CNPJ não parece certo. Confira os números."; return; }
    const salva = salvas.find((x) => x.id === c);
    if (salva) { preencher(salva); msg.textContent = "Empresa salva ✓ confira os dados."; return; }
    if (buscando === c) return;
    buscando = c; msg.textContent = "Buscando os dados da empresa…";
    try { const d = await buscarCnpj(c); if (so($("#nfCnpj", s).value) !== c) return; preencher({ ...d, ie: $("#nfIe", s).value }); msg.textContent = "Dados encontrados ✓ confira e digite a inscrição estadual, se a empresa tiver."; }
    catch (x) { buscando = ""; msg.textContent = `${x.message}. Preencha os dados à mão.`; }
  };

  $("#nfOk", s).onclick = async (ev) => {
    const e = $("#err", s), ps = escolhidos(), cnpj = so($("#nfCnpj", s).value), v = (id) => $(id, s).value.trim();
    if (!ps.length) return (e.textContent = "Escolha a mesa ou o pedido.");
    if (!cnpjValido(cnpj)) return (e.textContent = "Confira o CNPJ da empresa.");
    const empresa = { cnpj, razaoSocial: v("#nfRaz"), ie: so(v("#nfIe")), cep: so(v("#nfCep")), logradouro: v("#nfRua"), numero: v("#nfNum") || "S/N", bairro: v("#nfBai"), municipio: v("#nfCid"), uf: v("#nfUf").toUpperCase(), email: v("#nfEmail") };
    if (!empresa.razaoSocial) return (e.textContent = "Coloque a razão social.");
    if (empresa.cep.length !== 8) return (e.textContent = "Coloque o CEP com 8 números.");
    if (!empresa.logradouro || !empresa.bairro || !empresa.municipio) return (e.textContent = "Complete o endereço: rua, bairro e cidade.");
    if (!/^[A-Z]{2}$/.test(empresa.uf)) return (e.textContent = "Coloque a sigla do estado (ex.: SP).");
    const pessoas = Math.round(Number(v("#nfPes")) || 0);
    if (modo() === "refeicao" && pessoas < 1) return (e.textContent = "Diga quantas pessoas.");
    ev.currentTarget.disabled = true;
    try {
      if ($("#nfSalvar", s).checked) await store.salvar("clientes", cnpj, { tipo: "empresa", ...empresa, atualizadoEm: Date.now() });
      const nota = await criarNfeEmpresa({ pedidos: ps, empresa, modo: modo(), pessoas, comServico: $("#nfServ", s)?.checked ?? false }, usuario);
      fecharSheet();
      toast(`NF-e pedida para ${empresa.razaoSocial}. O PDF aparece na lista em instantes.`, "bom");
      aoEmitir(nota);
    } catch (x) { e.textContent = x.message; ev.currentTarget.disabled = false; }
  };
}

// Lista das NF-e para empresa (as últimas), com o PDF, tentar de novo e cancelar.
export function cardNfeLista(el) {
  let lista = [], tim = null, carregando = false;
  const rot = { pendente: "na fila (o agente do caixa envia)", enviando: "enviando…", processando: "a SEFAZ está conferindo…", autorizada: "autorizada ✓", erro: "ERRO", cancelar: "cancelando…", cancelada: "cancelada" };
  const transit = (n) => ["pendente", "enviando", "processando", "cancelar"].includes(n.status);
  const desenhar = () => {
    el.innerHTML = `<div class="grp">NF-e para empresa</div>
      <div class="linha-btn wrap"><button class="btn ghost sm" id="nfeAtual">Atualizar lista</button></div>
      <div id="nfeItens">${lista.map((n) => `<div class="cl"><div class="n"><b>${esc(n.destinatario?.razaoSocial || "")} · ${brl(n.total)}</b><small>${n.numero ? `NF-e nº ${esc(n.numero)} · ` : ""}${esc(n.origem || "")} · ${esc(rot[n.status] || n.status)}${n.ambiente === "homologacao" ? " · TESTE" : ""}${n.erro ? ` · ${esc(n.erro)}` : ""}${n.erroCancelamento ? ` · não cancelou: ${esc(n.erroCancelamento)}` : ""}</small></div>
        <div class="v">${n.danfe && n.status !== "cancelada" ? `<a class="btn ghost sm" href="${esc(n.danfe)}" target="_blank" rel="noopener">Abrir PDF</a>` : ""}${n.status === "erro" ? `<button class="btn ghost sm" data-nre="${esc(n.id)}">Tentar de novo</button>` : ""}${n.status === "autorizada" ? `<button class="btn ghost sm" data-ncx="${esc(n.id)}">Cancelar</button>` : ""}</div></div>`).join("") || `<p class="vazio">Nenhuma NF-e para empresa ainda.</p>`}</div>`;
    $("#nfeAtual", el).onclick = carregar;
    $$("[data-nre]", el).forEach((b) => (b.onclick = () => store.salvar("notas", b.dataset.nre, { status: "pendente", erro: "" }).then(() => { toast("Vai tentar de novo"); setTimeout(carregar, 1200); }).catch(erro)));
    $$("[data-ncx]", el).forEach((b) => (b.onclick = () => {
      const motivo = (prompt("Motivo do cancelamento (mínimo 15 letras):", "Venda cancelada a pedido do cliente") || "").trim();
      if (!motivo) return;
      if (motivo.length < 15) return toast("O motivo precisa ter pelo menos 15 letras.");
      store.salvar("notas", b.dataset.ncx, { status: "cancelar", cancelarMotivo: motivo, erroCancelamento: "" }).then(() => { toast("Cancelando a NF-e…"); setTimeout(carregar, 1500); }).catch(erro);
    }));
  };
  const carregar = async () => {
    if (!el.isConnected) return;
    clearTimeout(tim);
    if (carregando) return;
    carregando = true;
    try { lista = (await store.consultar("notas", ["tipo", "==", "nfe"])).sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0)).slice(0, 25); desenhar(); }
    catch (x) { el.innerHTML = `<div class="grp">NF-e para empresa</div><p class="falta">Não consegui carregar: ${esc(x.message || x)}</p>`; }
    carregando = false;
    if (el.isConnected) tim = setTimeout(carregar, lista.some(transit) ? 5000 : 60000);
  };
  desenhar();
  carregar();
  return () => setTimeout(carregar, 1500); // recarrega depois de pedir uma NF-e nova
}
