// =====================================================================
//  CONFIGURAÇÃO DO SISTEMA ELITE
//  Quase tudo (nome da loja, mesas, impressoras, cardápio, garçons,
//  motoboys) é mudado pelo próprio sistema em Caixa > Ajustes.
//  Aqui ficam só a conexão com o banco e a marca.
// =====================================================================

// 1) FIREBASE (banco de dados online, plano gratuito)
//    Enquanto estiver vazio, o sistema roda em MODO DEMONSTRAÇÃO:
//    os dados ficam só neste navegador (abas do mesmo computador se falam).
//    Veja o README.md para o passo a passo de como preencher.
export const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: "",
};

// 2) MARCA DO SISTEMA (aparece em todas as telas e no fim de cada cupom)
export const MARCA = {
  sistema: "Sistema Elite",
  empresa: "Elite MKT",
  logo: "assets/elite-logo.svg",
  site: "",          // ex.: "elitemkt.com.br" (aparece no rodapé, se preenchido)
  instagram: "@elitefilmsdigital",
};

// 3) VALORES INICIAIS DA LOJA (usados só na primeira vez; depois, Caixa > Ajustes)
export const LOJA_INICIAL = {
  nome: "Pizzaria Amarílis",
  telefone: "(19) 3827-1026",
  endereco: "",
  logo: "assets/logo-cliente.png",
  logoClaro: "assets/logo-cliente-claro.png",
  slogan: "Pizzas, esfihas e muito mais. Peça pelo app e receba em casa.",
  nMesas: 20,
  taxaServico: 10,            // % sugerido no fechamento da mesa (pode tirar na hora)
  aceitaOnline: true,         // cardápio do cliente aceita pedidos
  colunas: 48,                // 48 = bobina 80 mm · 32 = bobina 58 mm
  papelPorSetor: false,       // false: um papel por impressora, dividido por setor · true: um papel para cada setor
  impressoras: [
    { id: "imp1", nome: "Cozinha" },
    { id: "imp2", nome: "Bar" },
  ],
  // 5 setores: 3 na cozinha e 2 no bar
  setores: [
    { id: "pizza", nome: "Pizzas", impressora: "imp1" },
    { id: "esfiha", nome: "Esfihas", impressora: "imp1" },
    { id: "cozinha", nome: "Cozinha (porções, pastéis e pratos)", impressora: "imp1" },
    { id: "bebidas", nome: "Refrigerantes e cervejas (pegar e levar)", impressora: "imp2" },
    { id: "preparo", nome: "Sucos e drinks (preparar)", impressora: "imp2" },
  ],
  impressoraConta: "imp1",    // onde sai a conta da mesa e a via de entrega
  formasPagamento: ["Dinheiro", "Pix", "Crédito", "Débito", "Vale-refeição"],
};

// Usuários criados na primeira vez (troque os PINs em Caixa > Ajustes > Equipe).
export const EQUIPE_INICIAL = [
  { id: "admin", nome: "Administrador", papel: "admin", pin: "1234" },
  { id: "caixa", nome: "Caixa", papel: "caixa", pin: "1111" },
  { id: "garcom1", nome: "Garçom 1", papel: "garcom", pin: "2222" },
];
