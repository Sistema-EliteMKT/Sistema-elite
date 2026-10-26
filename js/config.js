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
  apiKey: "AIzaSyDesM9QPiWOlhQhPkMvkSeaGvj4urlvXvY",
  authDomain: "sistema-elite-amarilis.firebaseapp.com",
  projectId: "sistema-elite-amarilis",
  appId: "1:492577230327:web:0c80b61f8e2b1d1910f2f2",
};

// 2) MARCA DO SISTEMA (aparece em todas as telas e no fim de cada cupom)
export const MARCA = {
  sistema: "Sistema Elite",
  empresa: "Elite MKT",
  logo: "assets/elite-logo-128.png",
  site: "",          // ex.: "elitemkt.com.br" (aparece no rodapé, se preenchido)
  instagram: "@elitefilmsdigital",
};

// Horário de funcionamento do cardápio online, por dia da semana (0 = domingo). Muda em Caixa > Ajustes.
export const HORARIOS_PADRAO = {
  0: { ativo: true, de: "18:10", ate: "23:10" }, 1: { ativo: true, de: "18:10", ate: "22:45" }, 2: { ativo: true, de: "18:10", ate: "22:45" },
  3: { ativo: true, de: "18:10", ate: "22:45" }, 4: { ativo: true, de: "18:10", ate: "22:45" }, 5: { ativo: true, de: "18:10", ate: "23:10" },
  6: { ativo: true, de: "18:10", ate: "23:45" },
};

// 3) VALORES INICIAIS DA LOJA (usados só na primeira vez; depois, Caixa > Ajustes)
export const LOJA_INICIAL = {
  nome: "Pizzaria Amarílis",
  telefone: "(19) 3827-1026",
  endereco: "",
  logo: "assets/logo-cliente.png",
  logoClaro: "assets/logo-cliente-claro.png",
  slogan: "Pizzas, esfihas e muito mais. Peça pelo app e receba em casa.",
  nMesas: 36,
  taxaServico: 10,            // % sugerido no fechamento da mesa (pode tirar na hora)
  meiaPorcaoMesa: true,       // meia porção na mesa
  meiaPorcaoDelivery: false,  // meia porção no delivery/retirada (desligado: só na mesa)
  tempoEntregaMin: 40, tempoEntregaMax: 60,      // previsão para o cliente (minutos)
  tempoRetiradaMin: 20, tempoRetiradaMax: 30,
  aceitaOnline: true,         // false: cardápio fechado para pedidos (o horário fica em horarios / modoOnline / excecaoHoje)
  horarios: HORARIOS_PADRAO,
  colunas: 48,                // 48 = bobina 80 mm · 32 = bobina 58 mm
  imprimirCancelamento: false, // true: cancelar item/comanda também imprime o aviso CANCELADO no setor
  papelPorSetor: true,        // true: um papel para cada setor (Amarílis) · false: um papel por impressora, dividido por setor
  impressoras: [
    { id: "imp1", nome: "Caixa (Bematech MP-4200 TH)", tamanho: "medio", fonte: "arial", colunas: 42 },
    { id: "imp2", nome: "Bar (Control iD Print iD)", tamanho: "medio", fonte: "arial", colunas: 48 },
  ],
  // 5 setores. Cada setor tem uma impressora para o salão (mesas) e outra para delivery/retirada.
  // Amarílis: tudo do salão sai no bar; tudo de delivery e retirada sai no caixa.
  setores: [
    { id: "pizza", nome: "Pizzas", impressora: "imp2", impressoraDelivery: "imp1" },
    { id: "esfiha", nome: "Esfihas", impressora: "imp2", impressoraDelivery: "imp1", soViaDelivery: true }, // delivery: sem papel separado (a via completa serve)
    { id: "cozinha", nome: "Cozinha (porções, pastéis e pratos)", impressora: "imp2", impressoraDelivery: "imp1" },
    { id: "bebidas", nome: "Refrigerantes e cervejas (pegar e levar)", impressora: "imp2", impressoraDelivery: "imp1" },
    { id: "preparo", nome: "Sucos e drinks (preparar)", impressora: "imp2", impressoraDelivery: "imp1" },
  ],
  // Observações rápidas (botões na janela do item), por setor. Editáveis em Ajustes.
  obsRapidas: {
    pizza: ["Sem cebola", "Sem azeitona", "Sem orégano", "Bem assada"],
    esfiha: ["Sem cebola", "Bem assada"],
    cozinha: ["Sem cebola", "Sem salada", "Ao ponto", "Bem passado", "Sem pimenta"],
    bebidas: ["Copo com gelo", "Copo sem gelo", "Com limão", "Sem limão"],
    preparo: ["Copo com gelo", "Copo sem gelo", "Sem açúcar", "Pouco açúcar"],
  },
  impressoraContaGarcom: "imp2", // conta pedida pelo garçom: Print iD do bar
  impressoraConta: "imp1",    // onde sai a conta da mesa, a via de entrega e o fechamento
  formasPagamento: ["Dinheiro", "Pix", "Crédito", "Débito", "Vale-refeição"],
};

// Usuários criados na primeira vez (troque os PINs em Caixa > Ajustes > Equipe).
export const EQUIPE_INICIAL = [
  { id: "admin", nome: "Administrador", papel: "admin", pin: "1234" },
  { id: "caixa", nome: "Caixa", papel: "caixa", pin: "1111" },
  { id: "garcom1", nome: "Garçom 1", papel: "garcom", pin: "2222" },
];
