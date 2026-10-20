// Regras do negócio: estado ao vivo, totais, comandas, pedidos, pagamentos e cupons de impressão.
import { store, novoId } from "./store.js";
import { LOJA_INICIAL, EQUIPE_INICIAL, MARCA } from "./config.js";
import { CATEGORIAS, PRODUTOS, BORDAS, TAXAS_ENTREGA, ADICIONAIS } from "./cardapio-inicial.js";
import { hoje } from "./ui.js";
import { temInternet } from "./rede.js";

// ---------------------------------------------------------------------------
//  Estado ao vivo (o que está no banco, sempre atualizado)
// ---------------------------------------------------------------------------
export const D = {
  loja: null, categorias: [], produtos: [], usuarios: [], motoboys: [],
  abertos: [], doDia: [], impressoes: [], pagamentos: [], saidas: [],
  get pedidos() {
    const m = new Map();
    for (const p of [...this.doDia, ...this.abertos]) m.set(p.id, p);
    return [...m.values()];
  },
};
const ouvintes = new Set();
export const aoMudar = (fn) => { ouvintes.add(fn); return () => ouvintes.delete(fn); };
let agendado = false;
const avisar = () => {
  if (agendado) return;
  agendado = true;
  requestAnimationFrame(() => { agendado = false; ouvintes.forEach((f) => f()); });
};
const ordem = (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || String(a.nome).localeCompare(b.nome);

let desligar = [];
// publico = cardápio do cliente (só lê cardápio e dados da loja)
export function conectar({ publico = false } = {}) {
  desligar.forEach((f) => f());
  const dia = hoje();
  desligar = [
    store.ouvirDoc("config", "loja", (d) => { D.loja = d; avisar(); }),
    store.ouvir("categorias", (docs) => { D.categorias = docs.sort(ordem); avisar(); }),
    store.ouvir("produtos", (docs) => { D.produtos = docs.sort(ordem); avisar(); }),
  ];
  if (publico) return;
  desligar.push(
    store.ouvir("usuarios", (docs) => { D.usuarios = docs.sort((a, b) => a.nome.localeCompare(b.nome)); avisar(); }),
    store.ouvir("motoboys", (docs) => { D.motoboys = docs.sort((a, b) => a.nome.localeCompare(b.nome)); avisar(); }),
    store.ouvir("pedidos", (docs) => { D.abertos = docs; avisar(); }, ["aberto", "==", true]),
    store.ouvir("pedidos", (docs) => { D.doDia = docs; avisar(); }, ["dia", "==", dia]),
    store.ouvir("impressoes", (docs) => { D.impressoes = docs.sort((a, b) => b.criadoEm - a.criadoEm); avisar(); }, ["dia", "==", dia]),
    store.ouvir("pagamentos", (docs) => { D.pagamentos = docs.sort((a, b) => b.criadoEm - a.criadoEm); avisar(); }, ["dia", "==", dia]),
    store.ouvir("saidas", (docs) => { D.saidas = docs.sort((a, b) => b.criadoEm - a.criadoEm); avisar(); }, ["dia", "==", dia]),
  );
  // Virou o dia com o sistema aberto: reconecta para pegar o dia novo.
  clearTimeout(conectar._t);
  const amanha = new Date(); amanha.setHours(24, 0, 5, 0);
  conectar._t = setTimeout(() => conectar({ publico }), amanha - Date.now());
}

export const loja = () => ({ ...LOJA_INICIAL, ...(D.loja || {}) });
export const produto = (id) => D.produtos.find((p) => p.id === id);
export const categoria = (id) => D.categorias.find((c) => c.id === id);
export const setorDe = (prod) => prod?.setor || categoria(prod?.cat)?.setor || "cozinha";
export const nomeSetor = (id) => loja().setores.find((s) => s.id === id)?.nome || id;

// Onde cada produto é vendido: "todos", "mesa" (só no salão) ou "delivery" (só entrega/retirada).
export const canalDe = (p) => p?.canal || (p?.semEntrega ? "mesa" : "todos");
export const vendeEm = (p, onde) => p.ativo !== false && (!onde || canalDe(p) === "todos" || canalDe(p) === onde);

// Primeira vez: grava loja, cardápio e equipe iniciais.
export async function semearSePreciso() {
  const atual = await store.obter("config", "loja");
  if (atual) return false;
  const ops = [
    { tipo: "salvar", col: "config", id: "loja", dados: { ...LOJA_INICIAL, bordas: BORDAS, taxasEntrega: TAXAS_ENTREGA, adicionais: ADICIONAIS, criadoEm: Date.now() } },
    ...CATEGORIAS.map((c) => ({ tipo: "salvar", col: "categorias", id: c.id, dados: (({ id, ...r }) => r)(c) })),
    ...PRODUTOS.map((p) => ({ tipo: "salvar", col: "produtos", id: p.id, dados: (({ id, ...r }) => r)(p) })),
    ...EQUIPE_INICIAL.map((u) => ({ tipo: "salvar", col: "usuarios", id: u.id, dados: { nome: u.nome, papel: u.papel, pin: u.pin, ativo: true } })),
  ];
  await store.lote(ops);
  return true;
}

// ---------------------------------------------------------------------------
//  Totais
// ---------------------------------------------------------------------------
export const itensValidos = (p) => (p.itens || []).filter((i) => !i.cancelado);
export const subtotal = (p) => itensValidos(p).reduce((s, i) => s + i.unit * i.qtd, 0);
export const totalPedido = (p) => subtotal(p) + (Number(p.taxaEntrega) || 0);
export const dinheiro = (v) => Math.round((Number(v) || 0) * 100) / 100;

// ---------------------------------------------------------------------------
//  Mesas e comandas
// ---------------------------------------------------------------------------
export const comandasDaMesa = (mesa) =>
  D.abertos.filter((p) => p.tipo === "mesa" && p.mesa === mesa).sort((a, b) => a.criadoEm - b.criadoEm);

export function situacaoMesa(mesa) {
  const cs = comandasDaMesa(mesa);
  if (!cs.length) return { status: "livre", comandas: cs, total: 0 };
  const total = cs.reduce((s, c) => s + subtotal(c), 0);
  const conta = cs.some((c) => c.status === "conta");
  const desde = Math.min(...cs.map((c) => c.criadoEm));
  const pessoas = cs.reduce((s, c) => s + (Number(c.pessoas) || 0), 0);
  return { status: conta ? "conta" : "ocupada", comandas: cs, total, desde, pessoas };
}

export const comandaAberta = (numero) =>
  D.abertos.find((p) => p.tipo === "mesa" && String(p.numero) === String(numero));

// Abre a comanda (número do cartão físico). Uma comanda aberta não pode ser aberta
// de novo em outra mesa: a "trava" garante isso mesmo com dois garçons ao mesmo tempo.
// atendente: nome do garçom responsável (pode ser outro, quando o caixa abre) · pessoas: nº de pessoas
// Sem número = lançamento direto na mesa (sem cartão de comanda): não tem trava.
export async function abrirComanda(mesa, numero, nome, garcom, { atendente = "", pessoas = 0 } = {}) {
  numero = String(numero || "").trim();
  if (!numero) return abrirSemComanda(mesa, nome, garcom, { atendente, pessoas });
  if (!/^\d{1,5}$/.test(numero)) throw new Error("O número da comanda tem que ser só números.");
  const travaId = `comanda-${numero}`;
  const id = novoId();
  const trava = { aberta: true, pedido: id, mesa, dia: hoje(), em: Date.now() };
  let ocupada = null;
  try {
    if (!temInternet()) throw Object.assign(new Error("Sem conexão com a internet."), { offline: true });
    await store.transacao("travas", travaId, (t) => {
      if (t?.aberta) { ocupada = t; return null; }
      return trava;
    });
  } catch (e) {
    if (!e.offline) throw e;
    // Sem internet: confere com o que este aparelho já sabe e abre mesmo assim.
    const ja = comandaAberta(numero);
    if (ja) throw Object.assign(new Error(`A comanda ${numero} já está aberta na mesa ${ja.mesa}.`), { mesa: ja.mesa, comanda: ja.id });
    await store.salvar("travas", travaId, trava);
  }
  if (ocupada) {
    const p = D.abertos.find((x) => x.id === ocupada.pedido) || (await store.obter("pedidos", ocupada.pedido));
    if (p?.aberto) throw Object.assign(new Error(`A comanda ${numero} já está aberta na mesa ${p.mesa}.`), { mesa: p.mesa, comanda: p.id });
    // Trava esquecida (comanda já fechada): libera e usa.
    await store.transacao("travas", travaId, (t) => {
      if (t?.aberta && t.pedido !== ocupada.pedido) throw new Error(`A comanda ${numero} acabou de ser aberta em outra mesa.`);
      return trava;
    });
  }
  await store.salvar("pedidos", id, {
    tipo: "mesa", mesa, numero, nome: (nome || "").trim(), aberto: true, status: "aberta",
    itens: [], garcom: atendente || garcom?.nome || "", pessoas: Number(pessoas) || 0, abertoPor: garcom?.nome || "", criadoEm: Date.now(), dia: hoje(),
  });
  return id;
}

// Uma mesa tem no máximo um lançamento "sem comanda" aberto: se já existe, usa ele.
async function abrirSemComanda(mesa, nome, garcom, { atendente = "", pessoas = 0 } = {}) {
  const ja = comandasDaMesa(mesa).find((c) => !c.numero);
  if (ja) return ja.id;
  const id = novoId();
  await store.salvar("pedidos", id, {
    tipo: "mesa", mesa, numero: "", nome: (nome || "").trim(), aberto: true, status: "aberta",
    itens: [], garcom: atendente || garcom?.nome || "", pessoas: Number(pessoas) || 0, abertoPor: garcom?.nome || "", criadoEm: Date.now(), dia: hoje(),
  });
  return id;
}

export const rotuloComanda = (c) => (c?.numero ? `Comanda ${c.numero}` : "Sem comanda");

const liberarComandas = (pedidos) =>
  pedidos.filter((p) => p.tipo === "mesa" && p.numero).map((p) => ({ tipo: "salvar", col: "travas", id: `comanda-${p.numero}`, dados: { aberta: false, pedido: p.id } }));

// Lança itens numa comanda e manda para as impressoras dos setores.
export async function lancarItens(comandaId, itens, quem) {
  const agora = Date.now();
  const novos = itens.map((i) => ({ ...i, key: i.key || novoId(), enviadoEm: agora, por: quem?.nome || "" }));
  const pedido = D.abertos.find((x) => x.id === comandaId) || (await store.obter("pedidos", comandaId));
  if (!pedido || !pedido.aberto) throw new Error("Essa comanda já foi fechada.");
  // arrayUnion: funciona sem internet e não apaga o que outro garçom lançou ao mesmo tempo.
  await store.adicionarItens("pedidos", comandaId, novos, pedido.status === "conta" ? { status: "aberta" } : {});
  await imprimirProducao({ ...pedido, itens: novos }, quem);
}

// Altera um item já lançado (quantidade, escolhas e/ou valor).
// Se mudou o que foi pedido, imprime "ALTERADO" no setor com o antes e o agora; só valor não imprime.
export async function alterarItem(pedidoId, key, novo, quem) {
  const p = D.pedidos.find((x) => x.id === pedidoId) || (await store.obter("pedidos", pedidoId));
  if (!p) throw new Error("Pedido não encontrado.");
  if (p.tipo === "mesa" && !p.aberto) throw new Error("Essa comanda já foi fechada.");
  if (p.pago) throw new Error("Esse pedido já foi pago. Cancele o pagamento antes de alterar.");
  const antes = (p.itens || []).find((i) => i.key === key && !i.cancelado);
  if (!antes) throw new Error("Item não encontrado.");
  const item = {
    ...antes, ...novo, key, enviadoEm: antes.enviadoEm, por: antes.por,
    alteradoPor: quem?.nome || "", alteradoEm: Date.now(), ...(antes.unitOriginal == null && Number(novo.unit) !== Number(antes.unit) ? { unitOriginal: antes.unit } : {}),
  };
  // Transação: não apaga item que outro garçom lançou ao mesmo tempo. Sem internet, grava direto.
  try {
    if (!temInternet()) throw Object.assign(new Error("offline"), { offline: true });
    await store.transacao("pedidos", pedidoId, (atual) => ({ itens: (atual?.itens || []).map((i) => (i.key === key ? item : i)) }));
  } catch (e) {
    if (!e.offline) throw e;
    await store.salvar("pedidos", pedidoId, { itens: (p.itens || []).map((i) => (i.key === key ? item : i)) });
  }
  const assinatura = (i) => JSON.stringify([i.qtd, i.nome, i.det || [], i.obs || ""]);
  if (antes.enviadoEm && assinatura(antes) !== assinatura(item)) {
    await imprimirProducao({ ...p, itens: [item] }, quem, { alteracao: antes });
  }
  return item;
}

export async function cancelarItem(pedidoId, key, motivo, quem) {
  let item, pedido;
  await store.transacao("pedidos", pedidoId, (atual) => {
    if (!atual) return null;
    pedido = { id: pedidoId, ...atual };
    const itens = (atual.itens || []).map((i) => {
      if (i.key !== key || i.cancelado) return i;
      item = { ...i, cancelado: true, motivo, canceladoPor: quem?.nome || "", canceladoEm: Date.now() };
      return item;
    });
    return item ? { itens } : null;
  });
  if (item && item.enviadoEm) await imprimirProducao({ ...pedido, itens: [item] }, quem, { cancelamento: true });
}

export async function moverItem(origemId, key, destinoId) {
  let item;
  await store.transacao("pedidos", origemId, (atual) => {
    item = (atual?.itens || []).find((i) => i.key === key && !i.cancelado);
    return item ? { itens: atual.itens.filter((i) => i.key !== key) } : null;
  });
  if (!item) return;
  await store.transacao("pedidos", destinoId, (atual) => ({ itens: [...(atual?.itens || []), item] }));
}

export async function trocarMesa(comandaIds, novaMesa) {
  const cs = D.abertos.filter((p) => comandaIds.includes(p.id));
  await store.lote([
    ...comandaIds.map((id) => ({ tipo: "salvar", col: "pedidos", id, dados: { mesa: novaMesa } })),
    ...cs.filter((c) => c.numero).map((c) => ({ tipo: "salvar", col: "travas", id: `comanda-${c.numero}`, dados: { mesa: novaMesa } })),
  ]);
}

export const pedirConta = (ids, sim = true) =>
  store.lote(ids.map((id) => ({ tipo: "salvar", col: "pedidos", id, dados: { status: sim ? "conta" : "aberta" } })));

export async function cancelarComanda(id, motivo, quem) {
  const p = D.abertos.find((x) => x.id === id) || (await store.obter("pedidos", id));
  await store.lote([
    { tipo: "salvar", col: "pedidos", id, dados: { aberto: false, status: "cancelada", motivo, canceladoPor: quem?.nome || "", fechadoEm: Date.now() } },
    ...liberarComandas([p]),
  ]);
  const enviados = itensValidos(p).filter((i) => i.enviadoEm);
  if (enviados.length) await imprimirProducao({ ...p, itens: enviados }, quem, { cancelamento: true });
}

// ---------------------------------------------------------------------------
//  Delivery, retirada e balcão
// ---------------------------------------------------------------------------
export const ETAPAS = {
  novo: "Aguardando aceite",
  preparo: "Em preparo",
  pronto: "Pronto",
  saiu: "Saiu para entrega",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

// Sem internet, numera pelo que este aparelho já viu hoje (o caixa é quem numera).
async function numeroDoPedido() {
  try {
    if (!temInternet()) throw Object.assign(new Error("Sem conexão com a internet."), { offline: true });
    return await store.proximoNumero(hoje());
  }
  catch (e) {
    if (!e.offline) throw e;
    return Math.max(0, ...D.doDia.filter((p) => p.tipo !== "mesa").map((p) => Number(p.numero) || 0)) + 1;
  }
}

export async function criarPedido(dados, quem) {
  const online = dados.origem === "online";
  const base = {
    ...dados, aberto: true, criadoEm: Date.now(), dia: hoje(),
    status: online ? "novo" : "preparo",
    itens: dados.itens.map((i) => ({ ...i, key: i.key || novoId(), enviadoEm: online ? null : Date.now() })),
  };
  if (!online) base.numero = await numeroDoPedido();
  const id = await store.criar("pedidos", base);
  if (!online) await imprimirNovoPedido({ id, ...base }, quem);
  return id;
}

export async function aceitarPedido(p, quem) {
  const numero = p.numero || (await numeroDoPedido());
  const itens = p.itens.map((i) => ({ ...i, enviadoEm: Date.now() }));
  await store.salvar("pedidos", p.id, { status: "preparo", numero, itens, aceitoEm: Date.now(), aceitoPor: quem?.nome || "" });
  await imprimirNovoPedido({ ...p, numero, itens, aceitoPor: quem?.nome || "" }, quem);
}

export const mudarEtapa = (p, status, extra = {}) =>
  store.salvar("pedidos", p.id, { status, [`${status}Em`]: Date.now(), ...extra });

export async function cancelarPedido(p, motivo, quem) {
  await store.salvar("pedidos", p.id, { status: "cancelado", aberto: false, motivo, canceladoPor: quem?.nome || "", fechadoEm: Date.now() });
  const enviados = itensValidos(p).filter((i) => i.enviadoEm);
  if (enviados.length) await imprimirProducao({ ...p, itens: enviados }, quem, { cancelamento: true });
}

// ---------------------------------------------------------------------------
//  Pagamento (fecha comandas da mesa ou conclui pedido)
// ---------------------------------------------------------------------------
// pedidos: lista de pedidos/comandas pagos juntos; valores: {servico, desconto, pagamentos:[{forma,valor}]}
export async function registrarPagamento(pedidos, valores, quem) {
  const sub = dinheiro(pedidos.reduce((s, p) => s + totalPedido(p), 0));
  const total = dinheiro(sub + (Number(valores.servico) || 0) - (Number(valores.desconto) || 0));
  const pago = dinheiro(valores.pagamentos.reduce((s, x) => s + (Number(x.valor) || 0), 0));
  if (pago + 0.004 < total) throw new Error(`Falta receber ${(total - pago).toFixed(2).replace(".", ",")}.`);
  const troco = dinheiro(pago - total);
  const pid = novoId();
  const agora = Date.now();
  const mesa = pedidos[0].tipo === "mesa" ? pedidos[0].mesa : null;
  const pag = {
    dia: hoje(), criadoEm: agora, por: quem?.nome || "", mesa, tipo: pedidos[0].tipo,
    pedidos: pedidos.map((p) => p.id), numeros: pedidos.map((p) => p.numero).filter(Boolean),
    nomes: pedidos.map((p) => p.nome || p.cliente?.nome || "").filter(Boolean),
    subtotal: sub, servico: dinheiro(valores.servico), desconto: dinheiro(valores.desconto), total,
    pagamentos: valores.pagamentos.filter((x) => Number(x.valor) > 0).map((x) => ({ forma: x.forma, valor: dinheiro(x.valor) })),
    troco, cpf: valores.cpf || "",
  };
  // Comanda paga fecha na hora; pedido de entrega/retirada continua aberto até ser concluído.
  const fim = (p) => (p.tipo === "mesa" ? { status: "fechada", aberto: false } : {});
  await store.lote([
    { tipo: "criar", col: "pagamentos", id: pid, dados: pag },
    ...pedidos.map((p) => ({ tipo: "salvar", col: "pedidos", id: p.id, dados: { pago: true, pagamentoId: pid, pagoEm: agora, ...fim(p) } })),
    ...liberarComandas(pedidos),
  ]);
  return { id: pid, ...pag };
}

// Pedido de entrega/retirada concluído (e pago) sai da tela de pedidos abertos.
export const concluirPedido = (p) => store.salvar("pedidos", p.id, { status: "concluido", aberto: false, concluidoEm: Date.now() });

// ---------------------------------------------------------------------------
//  Equipe do dia (garçons e freelancers)
// ---------------------------------------------------------------------------
// Vendas e taxa de serviço de cada garçom hoje (pelo nome gravado na comanda).
export function vendasPorGarcom() {
  const r = {};
  const linha = (nome) => (r[nome] ||= { nome, comandas: 0, vendas: 0, servico: 0 });
  for (const c of D.pedidos) {
    if (c.tipo !== "mesa" || c.status === "cancelada" || !c.garcom) continue;
    const l = linha(c.garcom);
    l.comandas++;
    l.vendas += subtotal(c);
  }
  // Serviço pago é dividido entre as comandas da conta, pelo valor de cada uma.
  for (const pg of D.pagamentos) {
    if (!pg.servico || pg.tipo !== "mesa") continue;
    const cs = pg.pedidos.map((id) => D.pedidos.find((p) => p.id === id)).filter(Boolean);
    const soma = cs.reduce((s, c) => s + subtotal(c), 0) || 1;
    for (const c of cs) if (c.garcom) linha(c.garcom).servico += (pg.servico * subtotal(c)) / soma;
  }
  return r;
}

// Pagamento a freelancer/equipe: sai do caixa e entra no fechamento.
export const pagarEquipe = (dados, quem) =>
  store.criar("saidas", { ...dados, valor: dinheiro(dados.valor), dia: hoje(), criadoEm: Date.now(), por: quem?.nome || "" });

// ---------------------------------------------------------------------------
//  Cupons (texto para impressora térmica)
// ---------------------------------------------------------------------------
// Cada linha: { t: texto, b: negrito, g: grande, c: centralizado } ou { sep: true }
// Linha com texto à esquerda e valor à direita: guarda as duas partes (e, d) para cada
// impressora alinhar na sua largura; "t" já vem alinhado em 48 colunas para quem não sabe.
const L = (t, o = {}) => (t && typeof t === "object" ? { t: t.t, e: t.e, d: t.d, ...o } : { t: String(t ?? ""), ...o });
const SEP = { sep: true };
const larg = () => Number(loja().colunas) || 48;
const lado = (a, b, w = larg()) => {
  a = String(a); b = String(b);
  const n = w - b.length;
  const ac = a.length > n - 1 ? a.slice(0, n - 1) : a;
  return { t: ac + " ".repeat(Math.max(1, n - ac.length)) + b, e: a, d: b };
};
const r$ = (v) => (Number(v) || 0).toFixed(2).replace(".", ",");
const hh = (t = Date.now()) => new Date(t).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
const rodape = () => [SEP, L(`${MARCA.sistema} · ${MARCA.empresa}`, { c: true })];

const titulo = (p) => {
  if (p.tipo === "mesa") return `MESA ${p.mesa}${p.numero ? ` · COMANDA ${p.numero}` : ""}${p.nome && p.nome !== "Mesa inteira" ? " · " + p.nome : ""}`;
  const n = p.numero ? ` #${p.numero}` : "";
  if (p.tipo === "entrega") return `ENTREGA${n}`;
  if (p.tipo === "retirada") return `RETIRADA${n}`;
  return `BALCÃO${n}`;
};

function linhasItens(itens, { precos = false } = {}) {
  const out = [];
  for (const i of itens) {
    if (precos) out.push(L(lado(`${i.qtd}x ${i.nome}`, r$(i.unit * i.qtd))));
    else out.push(L(`${i.qtd}x ${i.nome}`, { b: true, g: true }));
    for (const d of i.det || []) out.push(L(`   ${d}`, { b: !precos }));
    if (i.obs) out.push(L(`   OBS: ${i.obs}`, { b: true }));
  }
  return out;
}

// alteracao: o item como era antes (sai "ANTES: ..." embaixo do item novo)
const linhasAntes = (a) => (a ? [SEP, L(`ANTES: ${a.qtd}x ${a.nome}`), ...(a.det || []).map((d) => L(`   ${d}`)), ...(a.obs ? [L(`   OBS: ${a.obs}`)] : [])] : []);

export function cupomProducao(p, itens, setor, quem, { cancelamento = false, alteracao = null } = {}) {
  const linhas = [];
  if (cancelamento) linhas.push(L("*** CANCELADO ***", { b: true, g: true, c: true }));
  if (alteracao) linhas.push(L("*** ALTERADO ***", { b: true, g: true, c: true }));
  linhas.push(L(nomeSetor(setor).toUpperCase(), { b: true, c: true }), SEP);
  linhas.push(L(titulo(p), { b: true, g: true }));
  if (p.tipo !== "mesa" && p.cliente?.nome) linhas.push(L(p.cliente.nome, { b: true }));
  linhas.push(L(`${hh()}${quem?.nome ? " · " + quem.nome : ""}`));
  linhas.push(SEP, ...(alteracao ? [L("AGORA:", { b: true })] : []), ...linhasItens(itens), ...linhasAntes(alteracao));
  if (cancelamento && itens[0]?.motivo) linhas.push(SEP, L(`Motivo: ${itens[0].motivo}`));
  if (p.obs && p.tipo !== "mesa") linhas.push(SEP, L(`OBS DO PEDIDO: ${p.obs}`, { b: true }));
  linhas.push(...rodape());
  return linhas;
}

// Vários setores no mesmo papel: cabeçalho uma vez, depois cada setor com seu título.
function cupomJunto(p, grupos, quem, { cancelamento = false, alteracao = null } = {}) {
  const linhas = [];
  if (cancelamento) linhas.push(L("*** CANCELADO ***", { b: true, g: true, c: true }));
  if (alteracao) linhas.push(L("*** ALTERADO ***", { b: true, g: true, c: true }));
  linhas.push(L(titulo(p), { b: true, g: true }));
  if (p.tipo !== "mesa" && p.cliente?.nome) linhas.push(L(p.cliente.nome, { b: true }));
  linhas.push(L(`${hh()}${quem?.nome ? " · " + quem.nome : ""}`));
  for (const [s, its] of grupos) {
    linhas.push(SEP, L(`== ${nomeSetor(s).toUpperCase()} ==`, { b: true, c: true }), ...linhasItens(its), ...linhasAntes(alteracao));
  }
  if (cancelamento && grupos[0]?.[1][0]?.motivo) linhas.push(SEP, L(`Motivo: ${grupos[0][1][0].motivo}`));
  if (p.obs && p.tipo !== "mesa") linhas.push(SEP, L(`OBS DO PEDIDO: ${p.obs}`, { b: true }));
  linhas.push(...rodape());
  return linhas;
}

export function cupomConta(pedidos, { servico = 0, desconto = 0, pagamento = null } = {}) {
  const lj = loja();
  const p0 = pedidos[0];
  const linhas = [L(lj.nome, { b: true, g: true, c: true })];
  if (lj.telefone) linhas.push(L(lj.telefone, { c: true }));
  if (lj.endereco) linhas.push(L(lj.endereco, { c: true }));
  linhas.push(SEP, L(p0.tipo === "mesa" ? `CONTA · MESA ${p0.mesa}` : titulo(p0), { b: true, g: true }), L(hh()));
  for (const p of pedidos) {
    if (pedidos.length > 1 || (p.tipo === "mesa" && p.nome && p.nome !== "Mesa inteira")) linhas.push(SEP, L(p.tipo === "mesa" ? `${rotuloComanda(p)}${p.nome ? " · " + p.nome : ""}` : p.nome || titulo(p), { b: true }));
    else linhas.push(SEP);
    linhas.push(...linhasItens(itensValidos(p), { precos: true }));
    if (p.taxaEntrega) linhas.push(L(lado("Taxa de entrega", r$(p.taxaEntrega))));
  }
  const sub = pedidos.reduce((s, p) => s + totalPedido(p), 0);
  linhas.push(SEP, L(lado("Subtotal", r$(sub))));
  if (servico) linhas.push(L(lado(`Serviço`, r$(servico))));
  if (desconto) linhas.push(L(lado("Desconto", "-" + r$(desconto))));
  const total = sub + (servico || 0) - (desconto || 0);
  linhas.push(L(lado("TOTAL R$", r$(total)), { b: true, g: true }));
  if (pagamento) {
    linhas.push(SEP);
    for (const x of pagamento.pagamentos) linhas.push(L(lado(x.forma, r$(x.valor))));
    if (pagamento.troco) linhas.push(L(lado("Troco", r$(pagamento.troco))));
  } else if (p0.tipo === "mesa" && total > 0) {
    // ajuda o cliente a dividir
    const pessoas = pedidos.reduce((s, p) => s + (Number(p.pessoas) || 0), 0);
    if (pessoas > 1) linhas.push(SEP, L(lado(`Por pessoa (${pessoas})`, r$(total / pessoas)), { b: true }));
    else linhas.push(SEP, L(`Dividido por 2: ${r$(total / 2)} · por 3: ${r$(total / 3)} · por 4: ${r$(total / 4)}`));
  }
  linhas.push(SEP, L("NÃO É DOCUMENTO FISCAL", { c: true }), ...rodape());
  return linhas;
}

export function cupomEntrega(p) {
  const lj = loja();
  const c = p.cliente || {};
  const linhas = [L(lj.nome, { b: true, c: true }), SEP, L(titulo(p), { b: true, g: true }), L(`Horário: ${hh(p.criadoEm)}`)];
  linhas.push(L(`Tipo: ${{ entrega: "DELIVERY", retirada: "RETIRADA", balcao: "BALCÃO" }[p.tipo] || ""}${p.origem === "online" ? " (pelo cardápio online)" : ""}`));
  const operador = p.criadoPor || p.aceitoPor;
  if (operador) linhas.push(L(`Operador: ${operador}`));
  linhas.push(SEP, L(c.nome || "Cliente", { b: true, g: true }));
  if (c.telefone) linhas.push(L(`Tel: ${c.telefone}`, { b: true }));
  if (p.tipo === "entrega") {
    linhas.push(L(c.endereco || "", { b: true }));
    if (c.bairro) linhas.push(L(`Bairro: ${c.bairro}`, { b: true }));
    if (c.referencia) linhas.push(L(`Complemento/ref.: ${c.referencia}`));
  }
  const its = itensValidos(p);
  const nItens = its.reduce((s, i) => s + i.qtd, 0);
  linhas.push(SEP, L(`ITENS (${nItens})`, { b: true }), ...linhasItens(its, { precos: true }));
  linhas.push(SEP, L(lado(`Itens (${nItens})`, r$(subtotal(p)))));
  if (p.desconto) linhas.push(L(lado("Desconto", "-" + r$(p.desconto))));
  if (p.taxaEntrega) linhas.push(L(lado("Entrega", r$(p.taxaEntrega))));
  linhas.push(SEP, L(lado("TOTAL R$", r$(totalPedido(p))), { b: true, g: true }));
  const pg = p.pagamento || {};
  if (pg.forma) linhas.push(L(`Pagamento: ${pg.forma}${p.pago ? " (PAGO)" : ""}`, { b: true }));
  if (pg.trocoPara) linhas.push(L(`Troco para ${r$(pg.trocoPara)} · levar ${r$(pg.trocoPara - totalPedido(p))}`, { b: true }));
  else if (pg.forma === "Dinheiro" && !p.pago) linhas.push(L("Troco: não precisa", { b: true }));
  if (p.obs) linhas.push(SEP, L(`OBS: ${p.obs}`, { b: true }));
  if (p.motoboy?.nome) linhas.push(L(`Motoboy: ${p.motoboy.nome}`));
  linhas.push(SEP, L("NÃO É DOCUMENTO FISCAL", { c: true }), ...rodape());
  return linhas;
}

// ---------------------------------------------------------------------------
//  Fila de impressão
// ---------------------------------------------------------------------------
// Mesa (salão) usa a impressora do setor; delivery/retirada/balcão usa a "impressoraDelivery".
export function impressoraDoSetor(setor, tipo = "mesa") {
  const lj = loja();
  const s = lj.setores.find((x) => x.id === setor);
  const imp = tipo === "mesa" ? s?.impressora : s?.impressoraDelivery || s?.impressora;
  return imp || lj.impressoras[0]?.id;
}

// criadoEm sempre crescente: a impressora imprime na ordem em que os papéis foram pedidos.
let ultimoCupom = 0;
// Desvio de emergência (aba Impressoras): se uma impressora parar, os cupons dela vão para outra.
export const desvioDe = (id) => {
  const para = loja().desvios?.[id];
  return para && para !== id && loja().impressoras.some((i) => i.id === para) ? para : null;
};
const nomeImpressora = (id) => loja().impressoras.find((i) => i.id === id)?.nome || id;
const cabecalhoDesvio = (de) => [{ t: `** DESVIADO: ERA DA ${nomeImpressora(de).toUpperCase()} **`, b: true, c: true }, { sep: true }];

// Sem internet, o computador do caixa pode imprimir na hora pelo navegador (veja estacao.js).
let imprimirLocal = null;
export const aoImprimirSemInternet = (fn) => (imprimirLocal = fn);

export function filaImpressao(impressora, tituloJob, linhas, extra = {}) {
  ultimoCupom = Math.max(Date.now(), ultimoCupom + 1);
  const para = desvioDe(impressora);
  if (para) { extra = { ...extra, desviadoDe: impressora }; linhas = [...cabecalhoDesvio(impressora), ...linhas]; impressora = para; }
  // tamanho/fonte escolhidos em Impressoras vão junto com o cupom (o agente usa direto)
  const imp = loja().impressoras.find((i) => i.id === impressora) || {};
  const estilo = {
    tamanho: imp.tamanho || "medio", fonte: imp.fonte || "arial", corte: imp.corte || "total", avanco: Number(imp.avanco ?? 4),
    ...(imp.colunas ? { colunas: Number(imp.colunas) } : {}),
  };
  const dados = { impressora, titulo: tituloJob, linhas, estilo, status: "pendente", criadoEm: ultimoCupom, dia: hoje(), ...extra };
  // Já sai impresso daqui: quando a internet voltar, o agente não imprime de novo.
  if (imprimirLocal?.(dados)) Object.assign(dados, { status: "impresso", por: "navegador", impressoEm: Date.now() });
  return { tipo: "criar", col: "impressoes", dados };
}

// Liga/desliga o desvio e leva junto o que ficou parado na fila da impressora que parou.
export async function desviarImpressora(de, para) {
  const lj = loja();
  const desvios = { ...(lj.desvios || {}) };
  desvios[de] = para && para !== de ? para : ""; // "" desliga (apagar a chave não funciona com gravação parcial)
  await store.salvar("config", "loja", { desvios });
  if (!para || para === de) return 0;
  const imp = lj.impressoras.find((i) => i.id === para) || {};
  const parados = D.impressoes.filter((j) => j.impressora === de && ["pendente", "erro"].includes(j.status));
  await Promise.all(parados.map((j) => store.salvar("impressoes", j.id, {
    impressora: para, status: "pendente", erro: null, tentativas: 0, desviadoDe: de,
    linhas: [...cabecalhoDesvio(de), ...j.linhas],
    estilo: { ...(j.estilo || {}), tamanho: imp.tamanho || "medio", fonte: imp.fonte || "arial", ...(imp.colunas ? { colunas: Number(imp.colunas) } : {}) },
  })));
  return parados.length;
}

// p.itens = só os itens que devem sair agora (novos ou cancelados)
export async function imprimirProducao(p, quem, opts = {}) {
  const itens = p.itens;
  if (!itens.length) return;
  const lj = loja();
  const porSetor = new Map();
  for (const i of itens) {
    const s = i.setor || setorDe(produto(i.produtoId));
    if (!porSetor.has(s)) porSetor.set(s, []);
    porSetor.get(s).push(i);
  }
  const ops = [];
  const nome = `${titulo(p)}${opts.cancelamento ? " (cancelado)" : opts.alteracao ? " (alterado)" : ""}`;
  // separado: um papel para cada setor (padrão da loja em Ajustes, ou forçado pelo botão)
  if (opts.separado ?? lj.papelPorSetor) {
    for (const [s, its] of porSetor) ops.push(filaImpressao(impressoraDoSetor(s, p.tipo), `${nomeSetor(s)} · ${nome}`, cupomProducao(p, its, s, quem, opts), { setor: s, pedido: p.id }));
  } else {
    // Um papel por impressora, com os setores separados por título.
    const porImp = new Map();
    for (const [s, its] of porSetor) {
      const imp = impressoraDoSetor(s, p.tipo);
      if (!porImp.has(imp)) porImp.set(imp, []);
      porImp.get(imp).push([s, its]);
    }
    for (const [imp, grupos] of porImp) ops.push(filaImpressao(imp, nome, cupomJunto(p, grupos, quem, opts), { pedido: p.id }));
  }
  await store.lote(ops);
}

// Delivery/retirada: primeiro o papel com tudo (via com endereço e valores), depois os papéis de cada setor.
async function imprimirNovoPedido(p, quem) {
  await store.lote([filaImpressao(loja().impressoraConta, `Via ${titulo(p)}`, cupomEntrega(p), { pedido: p.id })]);
  await imprimirProducao(p, quem);
}

// Botão "Imprimir por setor": reimprime o pedido inteiro, um papel para cada setor.
export const imprimirPorSetor = (p, quem) => imprimirProducao({ ...p, itens: itensValidos(p) }, quem, { separado: true });

// Botão "Imprimir tudo junto": reimprime o pedido inteiro num papel só, dividido por setor.
export const imprimirJunto = (p, quem) => imprimirProducao({ ...p, itens: itensValidos(p) }, quem, { separado: false });

const tituloConta = (pedidos) => (pedidos[0].tipo === "mesa" && pedidos.length > 1 ? `MESA ${pedidos[0].mesa}` : titulo(pedidos[0]));
export const imprimirConta = (pedidos, valores) =>
  store.lote([filaImpressao(loja().impressoraConta, `Conta ${tituloConta(pedidos)}`, cupomConta(pedidos, valores))]);

export const imprimirComprovante = (pedidos, pag) =>
  store.lote([filaImpressao(loja().impressoraConta, `Comprovante ${tituloConta(pedidos)}`, cupomConta(pedidos, { servico: pag.servico, desconto: pag.desconto, pagamento: pag }))]);

export const imprimirVia = (p) =>
  store.lote([filaImpressao(loja().impressoraConta, `Via ${titulo(p)}`, cupomEntrega(p), { pedido: p.id })]);

export const reimprimir = (job) =>
  store.lote([filaImpressao(job.impressora, job.titulo + " (reimpressão)", job.linhas)]);

export const tituloPedido = titulo;
