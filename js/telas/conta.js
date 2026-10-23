// Janela "Imprimir conta": escolhe as comandas e em qual impressora sai (salão ou caixa).
// O garçom abre com o salão (Print iD) marcado; o caixa abre com o caixa (Bematech). Dá para trocar
// na hora, caso uma das impressoras pare de funcionar.
import { $, $$, esc, brl, toast, erro, abrirSheet, fecharSheet, cabecalhoSheet } from "../ui.js";
import { loja, subtotal, rotuloComanda, pedirConta, imprimirConta, baseServico } from "../regras.js";

const servico = (cs) => Math.round(baseServico(cs) * (Number(loja().taxaServico) || 0)) / 100;

export function abrirConta(cs, { origem = "caixa", titulo = "Imprimir conta", aoImprimir = () => {} } = {}) {
  const lj = loja();
  const nome = (id) => lj.impressoras.find((i) => i.id === id)?.nome || id;
  const salao = lj.impressoraContaGarcom || lj.impressoras.find((i) => i.id !== lj.impressoraConta)?.id || lj.impressoraConta;
  const caixa = lj.impressoraConta;
  const opcoes = [["salao", salao, "Salão"], ["caixa", caixa, "Caixa"]].filter((o, i, a) => a.findIndex((x) => x[1] === o[1]) === i);
  const s = abrirSheet(`${cabecalhoSheet(titulo, cs[0].tipo === "mesa" ? `Mesa ${cs[0].mesa}` : "")}<div class="sh-b">
    ${cs.length > 1 ? `<div class="grp">Comandas <small>marque as que entram na conta</small></div><div class="opts">${cs.map((c) => `<label class="opt"><input type="checkbox" name="cm" value="${c.id}" checked><span>${esc(rotuloComanda(c))}${c.nome ? " · " + esc(c.nome) : ""}</span><em>${brl(subtotal(c))}</em></label>`).join("")}</div>` : ""}
    <div class="grp">Imprimir em <small>use a outra se uma impressora estiver com problema</small></div>
    <div class="opts">${opcoes.map(([k, id, rot]) => `<label class="opt"><input type="radio" name="dest" value="${esc(id)}" ${k === origem ? "checked" : ""}><span><b>${rot}</b> · ${esc(nome(id))}${k === origem ? " <small>(padrão)</small>" : ""}</span></label>`).join("")}</div>
    <div class="err" id="err"></div>
    <button class="btn or cheio grande" id="ok">Imprimir conta</button></div>`);
  $("#ok", s).onclick = async (ev) => {
    const sel = cs.length > 1 ? cs.filter((c) => $$('input[name="cm"]:checked', s).some((i) => i.value === c.id)) : cs;
    if (!sel.length) return ($("#err", s).textContent = "Marque pelo menos uma comanda.");
    const alvo = $('input[name="dest"]:checked', s)?.value;
    ev.currentTarget.disabled = true;
    try {
      await pedirConta(sel.map((c) => c.id));
      await imprimirConta(sel, { servico: servico(sel) }, { impressora: alvo });
      fecharSheet();
      toast(`Conta enviada para ${nome(alvo)}.`, "bom");
      aoImprimir(sel);
    } catch (e) { erro(e); ev.currentTarget.disabled = false; }
  };
}
