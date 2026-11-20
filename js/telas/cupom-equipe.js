// Pop-up do cupom do dia para quem fecha a conta (garçom e caixa): aparece só quando há cupom automático valendo,
// e não deixa avançar sem escolher "Aplicar" ou "Não aplicar".
import { esc, brl, abrirSheet, fecharSheet } from "../ui.js";
import { cupomPendente, descontoDoCupom, responderCupomEquipe, atualizarCupomEquipe } from "../regras.js";

const quando = (c) => (c.ate && c.de === c.ate ? "só hoje" : c.ate ? "por tempo limitado" : "");

// Resolve true (aplicar), false (não aplicar) ou undefined (fechou a janela sem escolher).
function perguntar(c, valor) {
  return new Promise((res) => {
    const s = abrirSheet(`<div class="sh-b cupom-eq">
      <div class="cupom-eq-t">🎉 Cupom do dia</div>
      <p><b>${esc(c.codigo)}</b>: ${Number(c.pct) || 0}% de desconto ${c.alvo === "pizzas" ? "só nas pizzas" : "em todos os itens"}${quando(c) ? ` (${quando(c)})` : ""}.</p>
      <div class="sum"><div class="t"><span>Desconto nesta conta</span><span>- ${brl(valor)}</span></div></div>
      <p class="muted pq">Aplicar o cupom nesta conta?</p>
      <div class="linha-btn"><button class="btn sec" data-r="0">Não aplicar</button><button class="btn ok" data-r="1">Aplicar cupom</button></div></div>`, { nivel: 2 });
    let feito = false;
    const fim = (v) => { if (feito) return; feito = true; obs.disconnect(); if (s.classList.contains("on")) fecharSheet(); res(v); };
    s.querySelectorAll("[data-r]").forEach((b) => (b.onclick = () => fim(b.dataset.r === "1")));
    // Fechou clicando fora: conta como "sem resposta" e a pergunta volta.
    const obs = new MutationObserver(() => { if (!s.classList.contains("on")) fim(undefined); });
    obs.observe(s, { attributes: true, attributeFilter: ["class"] });
  });
}

// Antes de imprimir a conta ou de receber: pergunta (se preciso) e deixa o desconto gravado nas contas.
export async function garantirCupomEquipe(pedidos) {
  await atualizarCupomEquipe(pedidos).catch(() => {});
  for (;;) {
    const c = cupomPendente(pedidos);
    if (!c) return;
    const valor = Math.round(pedidos.filter((p) => !p.cupom || p.cupom.equipe).reduce((t, p) => t + descontoDoCupom(p, c), 0) * 100) / 100;
    if (!(valor > 0)) return; // nada a descontar (ex.: cupom de pizza e a conta não tem pizza)
    const r = await perguntar(c, valor);
    if (r === undefined) continue;
    await responderCupomEquipe(pedidos, c, r);
  }
}
