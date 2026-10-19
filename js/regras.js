// Regras do negócio: estado ao vivo, totais, comandas, pedidos, pagamentos e cupons de impressão.
import { store, novoId } from "./store.js";
import { LOJA_INICIAL, EQUIPE_INICIAL, MARCA } from "./config.js";
import { CATEGORIAS, PRODUTOS, BORDAS, TAXAS_ENTREGA, ADICIONAIS } from "./cardapio-inicial.js";
import { hoje } from "./ui.js";

// ---------------------------------------------------------------------------
//  Estado ao vivo (o que está no banco, sempre atualizado)
// ---------------------------------------------------------------------------
export const D = {
  loja: null, categorias: [], produtos: [], usuarios: [], motoboys: [],
  abertos: [], doDia: [], impressoes: [], pagamentos: [],
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
  return { status: conta ? "conta" : "ocupada", comandas: cs, total, desde };
}

export const comandaAberta = (numero) =>
  D.abertos.find((p) => p.tipo === "mesa" && String(p.numero) === String(numero));

// Abre a comanda (número do cartão físico). Uma comanda aberta não pode ser aberta
// de novo em outra mesa: a "trava" garante isso mesmo com dois garçons ao mesmo tempo.
export async function abrirComanda(mesa, numero, nome, garcom) {
  numero = String(numero || "").trim();
  if (!/^\d{1,5}$/.test(numero)) throw new Error("Digite o número da comanda.");
  const travaId = `comanda-${numero}`;
  const id = novoId();
  const trava = { aberta: true, pedido: id, mesa, dia: hoje(), em: Date.now() };
  let ocupada = null;
  await store.transacao("travas", travaId, (t) => {
    if (t?.aberta) { ocupada = t; return null; }
    return trava;
  });
  if (ocupada) {
    const p = await store.obter("pedidos", ocupada.pedido);
    if (p?.aberto) throw Object.assign(new Error(`A comanda ${numero} já está aberta na mesa ${p.mesa}.`), { mesa: p.mesa, comanda: p.id });
    // Trava esquecida (comanda já fechada): libera e usa.
    await store.transacao("travas", travaId, (t) => {
      if (t?.aberta && t.pedido !== ocupada.pedido) throw new Error(`A comanda ${numero} acabou de ser aberta em outra mesa.`);
      return trava;
    });
  }
  await store.salvar("pedidos", id, {
    tipo: "mesa", mesa, numero, nome: (nome || "").trim(), aberto: true, status: "aberta",
    itens: [], garcom: garcom?.nome || "", criadoEm: Date.now(), dia: hoje(),
  });
  return id;
}

const liberarComandas = (pedidos) =>
  pedidos.filter((p) => p.tipo === "mesa" && p.numero).map((p) => ({ tipo: "salvar", col: "travas", id: `comanda-${p.numero}`, dados: { aberta: false, pedido: p.id } }));

// Lança itens numa comanda e manda para as impressoras dos setores.
export async function lancarItens(comandaId, itens, quem) {
  const agora = Date.now();
  const novos = itens.map((i) => ({ ...i, key: i.key || novoId(), enviadoEm: agora, por: quem?.nome || "" }));
  let pedido;
  await store.transacao("pedidos", comandaId, (atual) => {
    if (!atual || !atual.aberto) throw new Error("Essa comanda já foi fechada.");
    pedido = { id: comandaId, ...atual };
    return { itens: [...(atual.itens || []), ...novos], status: atual.status === "conta" ? "aberta" : atual.status };
  });
  await imprimirProducao({ ...pedido, itens: novos }, quem);
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

export async function criarPedido(dados, quem) {
  const online = dados.origem === "online";
  const base = {
    ...dados, aberto: true, criadoEm: Date.now(), dia: hoje(),
    status: online ? "novo" : "preparo",
    itens: dados.itens.map((i) => ({ ...i, key: i.key || novoId(), enviadoEm: online ? null : Date.now() })),
  };
  if (!online) base.numero = await store.proximoNumero(hoje());
  const id = await store.criar("pedidos", base);
  if (!online) await imprimirNovoPedido({ id, ...base }, quem);
  return id;
}

export async function aceitarPedido(p, quem) {
  const numero = p.numero || (await store.proximoNumero(hoje()));
  const itens = p.itens.map((i) => ({ ...i, enviadoEm: Date.now() }));
  await store.salvar("pedidos", p.id, { status: "preparo", numero, itens, aceitoEm: Date.now() });
  await imprimirNovoPedido({ ...p, numero, itens }, quem);
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
//  Cupons (texto para impressora térmica)
// ---------------------------------------------------------------------------
// Cada linha: { t: texto, b: negrito, g: grande, c: centralizado } ou { sep: true }
const L = (t, o = {}) => ({ t: String(t ?? ""), ...o });
const SEP = { sep: true };
const larg = () => Number(loja().colunas) || 48;
const lado = (a, b, w = larg()) => {
  a = String(a); b = String(b);
  const n = w - b.length;
  if (a.length > n - 1) a = a.slice(0, n - 1);
  return a + " ".repeat(Math.max(1, n - a.length)) + b;
};
const r$ = (v) => (Number(v) || 0).toFixed(2).replace(".", ",");
const hh = (t = Date.now()) => new Date(t).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
const rodape = () => [SEP, L(`${MARCA.sistema} · ${MARCA.empresa}`, { c: true })];

const titulo = (p) => {
  if (p.tipo === "mesa") return `MESA ${p.mesa} · COMANDA ${p.numero || "-"}${p.nome && p.nome !== "Mesa inteira" ? " · " + p.nome : ""}`;
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

export function cupomProducao(p, itens, setor, quem, { cancelamento = false } = {}) {
  const linhas = [];
  if (cancelamento) linhas.push(L("*** CANCELADO ***", { b: true, g: true, c: true }));
  linhas.push(L(nomeSetor(setor).toUpperCase(), { b: true, c: true }), SEP);
  linhas.push(L(titulo(p), { b: true, g: true }));
  if (p.tipo !== "mesa" && p.cliente?.nome) linhas.push(L(p.cliente.nome, { b: true }));
  linhas.push(L(`${hh()}${quem?.nome ? " · " + quem.nome : ""}`));
  linhas.push(SEP, ...linhasItens(itens));
  if (cancelamento && itens[0]?.motivo) linhas.push(SEP, L(`Motivo: ${itens[0].motivo}`));
  if (p.obs && p.tipo !== "mesa") linhas.push(SEP, L(`OBS DO PEDIDO: ${p.obs}`, { b: true }));
  linhas.push(...rodape());
  return linhas;
}

// Vários setores no mesmo papel: cabeçalho uma vez, depois cada setor com seu título.
function cupomJunto(p, grupos, quem, { cancelamento = false } = {}) {
  const linhas = [];
  if (cancelamento) linhas.push(L("*** CANCELADO ***", { b: true, g: true, c: true }));
  linhas.push(L(titulo(p), { b: true, g: true }));
  if (p.tipo !== "mesa" && p.cliente?.nome) linhas.push(L(p.cliente.nome, { b: true }));
  linhas.push(L(`${hh()}${quem?.nome ? " · " + quem.nome : ""}`));
  for (const [s, its] of grupos) {
    linhas.push(SEP, L(`== ${nomeSetor(s).toUpperCase()} ==`, { b: true, c: true }), ...linhasItens(its));
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
    if (pedidos.length > 1 || (p.tipo === "mesa" && p.nome && p.nome !== "Mesa inteira")) linhas.push(SEP, L(p.tipo === "mesa" ? `Comanda ${p.numero}${p.nome ? " · " + p.nome : ""}` : p.nome || titulo(p), { b: true }));
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
  } else if (p0.tipo === "mesa" && pedidos.length === 1 && total > 0) {
    // ajuda o cliente a dividir
    linhas.push(SEP, L(`Dividido por 2: ${r$(total / 2)} · por 3: ${r$(total / 3)} · por 4: ${r$(total / 4)}`));
  }
  linhas.push(SEP, L("NÃO É DOCUMENTO FISCAL", { c: true }), ...rodape());
  return linhas;
}

export function cupomEntrega(p) {
  const lj = loja();
  const c = p.cliente || {};
  const linhas = [L(lj.nome, { b: true, c: true }), SEP, L(titulo(p), { b: true, g: true }), L(hh(p.criadoEm))];
  if (p.origem === "online") linhas.push(L("Pedido pelo cardápio online"));
  linhas.push(SEP, L(c.nome || "Cliente", { b: true, g: true }));
  if (c.telefone) linhas.push(L(`Tel: ${c.telefone}`, { b: true }));
  if (p.tipo === "entrega") {
    linhas.push(L(c.endereco || "", { b: true }));
    if (c.bairro) linhas.push(L(`Bairro: ${c.bairro}`, { b: true }));
    if (c.referencia) linhas.push(L(`Ref: ${c.referencia}`));
  }
  linhas.push(SEP, ...linhasItens(itensValidos(p), { precos: true }));
  if (p.taxaEntrega) linhas.push(L(lado("Taxa de entrega", r$(p.taxaEntrega))));
  linhas.push(SEP, L(lado("TOTAL R$", r$(totalPedido(p))), { b: true, g: true }));
  const pg = p.pagamento || {};
  if (pg.forma) linhas.push(L(`Pagamento: ${pg.forma}${p.pago ? " (PAGO)" : ""}`, { b: true }));
  if (pg.trocoPara) linhas.push(L(`Troco para ${r$(pg.trocoPara)} · levar ${r$(pg.trocoPara - totalPedido(p))}`, { b: true }));
  if (p.obs) linhas.push(SEP, L(`OBS: ${p.obs}`, { b: true }));
  if (p.motoboy?.nome) linhas.push(L(`Motoboy: ${p.motoboy.nome}`));
  linhas.push(SEP, L("NÃO É DOCUMENTO FISCAL", { c: true }), ...rodape());
  return linhas;
}

// ---------------------------------------------------------------------------
//  Fila de impressão
// ---------------------------------------------------------------------------
export function impressoraDoSetor(setor) {
  const lj = loja();
  return lj.setores.find((s) => s.id === setor)?.impressora || lj.impressoras[0]?.id;
}

export function filaImpressao(impressora, tituloJob, linhas, extra = {}) {
  return { tipo: "criar", col: "impressoes", dados: { impressora, titulo: tituloJob, linhas, status: "pendente", criadoEm: Date.now(), dia: hoje(), ...extra } };
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
  const nome = `${titulo(p)}${opts.cancelamento ? " (cancelado)" : ""}`;
  if (lj.papelPorSetor) {
    for (const [s, its] of porSetor) ops.push(filaImpressao(impressoraDoSetor(s), `${nomeSetor(s)} · ${nome}`, cupomProducao(p, its, s, quem, opts), { setor: s, pedido: p.id }));
  } else {
    // Um papel por impressora, com os setores separados por título.
    const porImp = new Map();
    for (const [s, its] of porSetor) {
      const imp = impressoraDoSetor(s);
      if (!porImp.has(imp)) porImp.set(imp, []);
      porImp.get(imp).push([s, its]);
    }
    for (const [imp, grupos] of porImp) ops.push(filaImpressao(imp, nome, cupomJunto(p, grupos, quem, opts), { pedido: p.id }));
  }
  await store.lote(ops);
}

async function imprimirNovoPedido(p, quem) {
  await imprimirProducao(p, quem);
  await store.lote([filaImpressao(loja().impressoraConta, `Via ${titulo(p)}`, cupomEntrega(p), { pedido: p.id })]);
}

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
