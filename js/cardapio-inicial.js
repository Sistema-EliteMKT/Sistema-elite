// Cardápio inicial (importado do protótipo da Pizzaria Amarílis).
// É só o ponto de partida: depois, tudo é editado pelo Caixa > Cardápio.
// canal: "todos" (mesa e delivery) · "mesa" (só no salão) · "delivery" (só entrega/retirada)
// grupoAdicional: qual lista de adicionais aparece para o garçom (na categoria ou no produto)
export const CATEGORIAS = [
 {
  "id": "pizzas",
  "nome": "Pizzas",
  "setor": "pizza",
  "nota": "Grande (8 pedaços) ou brotinho (4 pedaços). Todas com azeitona e orégano.",
  "prefixo": "",
  "grupoPizza": "salgada",
  "ordem": 1,
  "grupoAdicional": "Pizza"
 },
 {
  "id": "especiais",
  "nome": "Especiais",
  "setor": "pizza",
  "nota": "Na pizza de dois sabores, vale o preço do sabor mais caro.",
  "prefixo": "",
  "grupoPizza": "salgada",
  "ordem": 2,
  "grupoAdicional": "Pizza"
 },
 {
  "id": "doces",
  "nome": "Pizzas doces",
  "setor": "pizza",
  "nota": "Adicione confete, coco ralado ou granulado por + R$ 12.",
  "prefixo": "",
  "grupoPizza": "doce",
  "ordem": 3,
  "grupoAdicional": ""
 },
 {
  "id": "esfihas",
  "nome": "Esfihas",
  "setor": "esfiha",
  "nota": "",
  "prefixo": "Esfiha ",
  "grupoPizza": "",
  "ordem": 4,
  "grupoAdicional": "Esfiha"
 },
 {
  "id": "esfdoces",
  "nome": "Esfihas doces",
  "setor": "esfiha",
  "nota": "",
  "prefixo": "Esfiha doce ",
  "grupoPizza": "",
  "ordem": 5,
  "grupoAdicional": ""
 },
 {
  "id": "beirutes",
  "nome": "Beirutes",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 6,
  "grupoAdicional": "Beirute"
 },
 {
  "id": "pasteis",
  "nome": "Pastéis",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "Pastel ",
  "grupoPizza": "",
  "ordem": 7,
  "grupoAdicional": "Pastel"
 },
 {
  "id": "porcoes",
  "nome": "Porções",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 8,
  "grupoAdicional": ""
 },
 {
  "id": "pratos",
  "nome": "Pratos",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 9,
  "grupoAdicional": ""
 },
 {
  "id": "bebidas",
  "nome": "Refrigerantes e águas",
  "setor": "bebidas",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 10,
  "grupoAdicional": ""
 },
 {
  "id": "cervejas",
  "nome": "Cervejas",
  "setor": "bebidas",
  "nota": "Proibida a venda de bebida alcoólica para menores de 18 anos.",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 11,
  "grupoAdicional": ""
 },
 {
  "id": "sucos-drinks",
  "nome": "Sucos e drinks",
  "setor": "preparo",
  "nota": "Proibida a venda de bebida alcoólica para menores de 18 anos.",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 12,
  "grupoAdicional": ""
 }
];

export const PRODUTOS = [{"id":"abo","cat":"pizzas","nome":"Abobrinha","desc":"Abobrinha, mussarela, alho, orégano e azeitona","preco":74,"precoBroto":52,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":1},{"id":"atu","cat":"pizzas","nome":"Atum","desc":"Atum, cebola, azeitonas e mussarela ou requeijão","preco":85,"precoBroto":60,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":2},{"id":"bac","cat":"pizzas","nome":"Bacon","desc":"Bacon e mussarela","preco":74,"precoBroto":52,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":3},{"id":"bai","cat":"pizzas","nome":"Baiana","desc":"Calabresa, ovos, molho de pimenta, pimenta biquinho, cebola e azeitona","preco":74,"precoBroto":52,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":4},{"id":"bau","cat":"pizzas","nome":"Bauru","desc":"Presunto, tomate e mussarela ou requeijão","preco":74,"precoBroto":52,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":5},{"id":"bpp","cat":"pizzas","nome":"Bauru de peito de peru","desc":"Peito de peru, tomate e mussarela ou requeijão","preco":84,"precoBroto":60,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":6},{"id":"bro","cat":"pizzas","nome":"Brócolis","desc":"Brócolis refogado, mussarela ou requeijão","preco":74,"precoBroto":52,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":7},{"id":"brb","cat":"pizzas","nome":"Brócolis com bacon","desc":"Brócolis refogado, bacon, tomate, palmito e mussarela","preco":80,"precoBroto":56,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":8},{"id":"cqu","cat":"pizzas","nome":"Cachorro quente","desc":"Salsicha ao molho, mussarela, milho e batata palha","preco":74,"precoBroto":52,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":9},{"id":"cai","cat":"pizzas","nome":"Caipira","desc":"Frango desfiado, milho e requeijão","preco":80,"precoBroto":56,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":10},{"id":"cal","cat":"pizzas","nome":"Calabresa","desc":"Calabresa, cebola e mussarela ou requeijão","preco":74,"precoBroto":52,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":11},{"id":"cub","cat":"pizzas","nome":"Cubana","desc":"Frango desfiado, palmito, mussarela ou requeijão","preco":80,"precoBroto":56,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":12},{"id":"esc","cat":"pizzas","nome":"Escarola","desc":"Escarola temperada com alho, mussarela ou requeijão","preco":74,"precoBroto":52,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":13},{"id":"fra","cat":"pizzas","nome":"Frango","desc":"Frango desfiado com mussarela ou requeijão","preco":74,"precoBroto":52,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":14},{"id":"frb","cat":"pizzas","nome":"Frango com bacon","desc":"Frango desfiado, bacon e mussarela ou requeijão","preco":87,"precoBroto":61,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":15},{"id":"fcb","cat":"pizzas","nome":"Frango c/ cheddar e batata palha","desc":"Frango desfiado, cheddar e batata palha","preco":85,"precoBroto":60,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":16},{"id":"lin","cat":"pizzas","nome":"Linguiça toscana","desc":"Linguiça toscana, mussarela e cebola","preco":85,"precoBroto":60,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":17},{"id":"lom","cat":"pizzas","nome":"Lombo com palmito","desc":"Lombinho canadense, palmito, mussarela ou requeijão","preco":80,"precoBroto":56,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":18},{"id":"mar","cat":"pizzas","nome":"Marguerita","desc":"Mussarela, manjericão e rodelas de tomate","preco":74,"precoBroto":52,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":19},{"id":"mil","cat":"pizzas","nome":"Milho ao creme","desc":"Milho verde, mussarela e creme de leite","preco":74,"precoBroto":52,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":20},{"id":"mus","cat":"pizzas","nome":"Mussarela","desc":"Mussarela, azeitonas e tomate","preco":74,"precoBroto":52,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":21},{"id":"pal","cat":"pizzas","nome":"Palmito","desc":"Palmito, mussarela ou requeijão","preco":74,"precoBroto":52,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":22},{"id":"pda","cat":"pizzas","nome":"Pão de alho","desc":"Pão de alho, pasta de alho, mussarela e parmesão","preco":85,"precoBroto":60,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":23},{"id":"pau","cat":"pizzas","nome":"Paulista","desc":"Calabresa, ovos, tomate e mussarela ou requeijão","preco":80,"precoBroto":56,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":24},{"id":"pep","cat":"pizzas","nome":"Peito de peru","desc":"Peito de peru, cebola, tomate, mussarela ou requeijão","preco":85,"precoBroto":60,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":25},{"id":"per","cat":"pizzas","nome":"Peruana","desc":"Atum, ovos, tomate, mussarela ou requeijão","preco":90,"precoBroto":63,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":26},{"id":"pom","cat":"pizzas","nome":"Pomodoro","desc":"Tomate, parmesão, alho, azeitonas e mussarela","preco":80,"precoBroto":56,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":27},{"id":"por","cat":"pizzas","nome":"Portuguesa","desc":"Presunto, palmito, ervilha, ovo, cebola e mussarela","preco":80,"precoBroto":56,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":28},{"id":"ppp","cat":"pizzas","nome":"Portuguesa c/ peito de peru","desc":"Peito de peru, palmito, ervilha, ovo, cebola e mussarela","preco":90,"precoBroto":63,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":29},{"id":"qqj","cat":"pizzas","nome":"Quatro queijos","desc":"Mussarela, parmesão, provolone e requeijão","preco":90,"precoBroto":63,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":30},{"id":"ruc","cat":"pizzas","nome":"Rúcula","desc":"Rúcula, mussarela, tomate seco, azeitonas e orégano","preco":80,"precoBroto":56,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":31},{"id":"sic","cat":"pizzas","nome":"Siciliana","desc":"Bacon, champignon e mussarela","preco":85,"precoBroto":60,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":32},{"id":"tos","cat":"pizzas","nome":"Toscana","desc":"Calabresa, bacon, palmito e mussarela ou requeijão","preco":85,"precoBroto":60,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":33},{"id":"veg","cat":"pizzas","nome":"Vegetariana","desc":"Brócolis, escarola, palmito, milho e queijo minas","preco":85,"precoBroto":60,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":34},{"id":"cse","cat":"especiais","nome":"Carne seca","desc":"Carne seca com beringela ou jiló, parmesão e mussarela","preco":97,"precoBroto":68,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":1},{"id":"cqq","cat":"especiais","nome":"Cinco queijos","desc":"Gorgonzola, mussarela, parmesão, provolone e requeijão","preco":100,"precoBroto":70,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":2},{"id":"cos","cat":"especiais","nome":"Costela","desc":"Costela bovina desfiada, mussarela, parmesão, rúcula e tomate seco","preco":105,"precoBroto":73,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":3},{"id":"cup","cat":"especiais","nome":"Cupim","desc":"Cupim desfiado, mussarela, parmesão e rúcula","preco":105,"precoBroto":73,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":4},{"id":"fil","cat":"especiais","nome":"Filadélfia","desc":"Frango desfiado, bacon e cream cheese","preco":90,"precoBroto":63,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":5},{"id":"fac","cat":"especiais","nome":"Frango ao creme","desc":"Frango, champignon, presunto, creme de leite, mussarela e parmesão","preco":90,"precoBroto":63,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":6},{"id":"fap","cat":"especiais","nome":"Frango ao creme c/ peru","desc":"Frango, champignon, peito de peru, creme de leite, mussarela e parmesão","preco":100,"precoBroto":70,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":7},{"id":"mae","cat":"especiais","nome":"Marguerita especial","desc":"Mussarela de búfala, parmesão, tomate seco e manjericão","preco":100,"precoBroto":70,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":8},{"id":"mam","cat":"especiais","nome":"Moda Amarílis","desc":"Peito de peru, mussarela, pimentão, cebola, orégano e azeitonas","preco":97,"precoBroto":68,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":9},{"id":"mpu","cat":"especiais","nome":"Moda Pucheti","desc":"Calabresa, presunto, tomate e mussarela","preco":97,"precoBroto":68,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":10},{"id":"mue","cat":"especiais","nome":"Mussarela especial","desc":"Mussarela de búfala, rúcula, tomate seco e azeitonas","preco":100,"precoBroto":70,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":11},{"id":"nor","cat":"especiais","nome":"Nordestina","desc":"Carne seca, mussarela, pimentão, cebola e parmesão ou requeijão","preco":97,"precoBroto":68,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":12},{"id":"pee","cat":"especiais","nome":"Peperone","desc":"Peperone, cebola, parmesão e mussarela ou requeijão","preco":100,"precoBroto":70,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":13},{"id":"pzo","cat":"especiais","nome":"Pizzaiolo","desc":"Batata frita, bacon, mussarela e cheddar ou requeijão","preco":97,"precoBroto":68,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":14},{"id":"poe","cat":"especiais","nome":"Portuguesa especial","desc":"Peito de peru, palmito, tomate seco e mussarela de búfala","preco":100,"precoBroto":70,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":15},{"id":"stc","cat":"especiais","nome":"Strogonoff de carne","desc":"Strogonoff de carne, batata palha e mussarela","preco":97,"precoBroto":68,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":16},{"id":"stf","cat":"especiais","nome":"Strogonoff de frango","desc":"Strogonoff de frango, batata palha e mussarela","preco":97,"precoBroto":68,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":17},{"id":"dab","cat":"doces","nome":"Abacaxi com chocolate branco","desc":"","preco":85,"precoBroto":null,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":1},{"id":"dbc","cat":"doces","nome":"Banana com canela","desc":"","preco":80,"precoBroto":null,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":2},{"id":"dbh","cat":"doces","nome":"Banana com chocolate","desc":"","preco":85,"precoBroto":null,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":3},{"id":"dbo","cat":"doces","nome":"Banoffe","desc":"Banana, doce de leite e requeijão","preco":90,"precoBroto":null,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":4},{"id":"dch","cat":"doces","nome":"Cheesecake","desc":"Cream cheese, chocolate branco e calda de morango","preco":90,"precoBroto":null,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":5},{"id":"dcm","cat":"doces","nome":"Chocolate com morango","desc":"Ao leite, branco ou misto","preco":80,"precoBroto":null,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":6},{"id":"dcs","cat":"doces","nome":"Chocolate com sorvete de creme","desc":"Não disponível para entrega","preco":92,"precoBroto":null,"veg":false,"opcoes":[],"tipo":"pizza","canal":"mesa","ativo":true,"ordem":7},{"id":"drj","cat":"doces","nome":"Romeu e Julieta","desc":"Queijo com goiabada","preco":85,"precoBroto":null,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":8},{"id":"esfihas-1","cat":"esfihas","nome":"Carne","desc":"Carne moída temperada com alho, cebola e tomate","preco":8,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"esfihas-2","cat":"esfihas","nome":"Carne com queijo","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"esfihas-3","cat":"esfihas","nome":"Queijo","desc":"","preco":8,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"esfihas-4","cat":"esfihas","nome":"Calabresa","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"esfihas-5","cat":"esfihas","nome":"Frango","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"esfihas-6","cat":"esfihas","nome":"Frango com bacon","desc":"","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"esfihas-7","cat":"esfihas","nome":"Bauru","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"esfihas-8","cat":"esfihas","nome":"Atum","desc":"","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"esfihas-9","cat":"esfihas","nome":"Marguerita","desc":"","preco":10,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"esfihas-10","cat":"esfihas","nome":"Pizza","desc":"","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":10},{"id":"esfihas-11","cat":"esfihas","nome":"Portuguesa","desc":"","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":11},{"id":"esfihas-12","cat":"esfihas","nome":"Palmito","desc":"","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":12},{"id":"esfihas-13","cat":"esfihas","nome":"Escarola","desc":"","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":13},{"id":"esfihas-14","cat":"esfihas","nome":"Brócolis com bacon","desc":"","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":14},{"id":"esfihas-15","cat":"esfihas","nome":"Cinco queijos","desc":"","preco":12,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":15},{"id":"esfihas-16","cat":"esfihas","nome":"Costela","desc":"Especialidade da casa","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":16},{"id":"esfihas-17","cat":"esfihas","nome":"Carne seca com beringela","desc":"Especialidade da casa","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":17},{"id":"esfihas-18","cat":"esfihas","nome":"Filadélfia","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":18},{"id":"esfihas-19","cat":"esfihas","nome":"Strogonoff de carne","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":19},{"id":"esfihas-20","cat":"esfihas","nome":"Vaca atolada","desc":"Especialidade da casa","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":20},{"id":"esfdoces-1","cat":"esfdoces","nome":"Chocolate ao leite","desc":"Acompanha morango","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"esfdoces-2","cat":"esfdoces","nome":"Chocolate branco","desc":"","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"esfdoces-3","cat":"esfdoces","nome":"Banana com canela","desc":"","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"esfdoces-4","cat":"esfdoces","nome":"Banoffe","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"esfdoces-5","cat":"esfdoces","nome":"Abacaxi nevado","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"esfdoces-6","cat":"esfdoces","nome":"Nutella","desc":"Acompanha morango","preco":14,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"esfdoces-7","cat":"esfdoces","nome":"Romeu e Julieta","desc":"","preco":14,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"beirutes-1","cat":"beirutes","nome":"Beirute tradicional","desc":"Pão sírio, presunto, mussarela, ovo, requeijão, maionese, alface e tomate","preco":47,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"beirutes-2","cat":"beirutes","nome":"Beirute de carne","desc":"","preco":52,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"beirutes-3","cat":"beirutes","nome":"Beirute de calabresa","desc":"","preco":52,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"beirutes-4","cat":"beirutes","nome":"Beirute de frango","desc":"","preco":52,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"beirutes-5","cat":"beirutes","nome":"Beirute de peito de peru","desc":"","preco":55,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"beirutes-6","cat":"beirutes","nome":"Beirute de costela","desc":"","preco":55,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"pasteis-1","cat":"pasteis","nome":"Carne","desc":"","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"pasteis-2","cat":"pasteis","nome":"Queijo","desc":"","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"pasteis-3","cat":"pasteis","nome":"Pizza","desc":"Tomate, orégano e mussarela","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"pasteis-4","cat":"pasteis","nome":"Bauru","desc":"","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"pasteis-5","cat":"pasteis","nome":"Frango com requeijão","desc":"","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"pasteis-6","cat":"pasteis","nome":"Costela","desc":"","preco":24,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"pasteis-7","cat":"pasteis","nome":"Portuguesa","desc":"","preco":24,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"pasteis-8","cat":"pasteis","nome":"Banana com chocolate","desc":"","preco":24,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"porcoes-1","cat":"porcoes","nome":"Batata frita","desc":"","preco":39,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1,"grupoAdicional":"Batata frita"},{"id":"porcoes-2","cat":"porcoes","nome":"Batata frita com requeijão","desc":"","preco":42,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2,"grupoAdicional":"Batata frita"},{"id":"porcoes-3","cat":"porcoes","nome":"Batata com bacon e queijo","grupoAdicional":"Batata frita","desc":"","preco":48,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"porcoes-4","cat":"porcoes","nome":"Frango a passarinho (600g)","desc":"","preco":59,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"porcoes-5","cat":"porcoes","nome":"Tilápia frita (600g)","desc":"","preco":78,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"porcoes-6","cat":"porcoes","nome":"Contra filé acebolado (600g)","desc":"Acompanha pão de alho","preco":106,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"porcoes-7","cat":"porcoes","nome":"Picanha acebolada (600g)","desc":"Acompanha pão de alho","preco":123,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"porcoes-8","cat":"porcoes","nome":"Mini kibe (500g)","desc":"","preco":45,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"pratos-1","cat":"pratos","nome":"Contra filé grelhado","desc":"Arroz, feijão, salada e fritas","preco":58,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"pratos-2","cat":"pratos","nome":"Filé de frango","desc":"Arroz, feijão, salada e fritas","preco":46,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"pratos-3","cat":"pratos","nome":"Picanha","desc":"Arroz, feijão, salada e fritas","preco":62,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"pratos-4","cat":"pratos","nome":"Strogonoff de carne","desc":"Arroz, feijão, salada e fritas","preco":56,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"pratos-5","cat":"pratos","nome":"Panqueca de carne","desc":"","preco":38,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5,"grupoAdicional":"Panqueca"},{"id":"pratos-6","cat":"pratos","nome":"Panqueca quatro queijos","desc":"","preco":43,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6,"grupoAdicional":"Panqueca"},{"id":"pratos-7","cat":"pratos","nome":"Batata recheada strogonoff","desc":"","preco":31,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"pratos-8","cat":"pratos","nome":"Salada completa","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"bebidas-1","cat":"bebidas","nome":"Água sem gás","desc":"","preco":5,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"bebidas-2","cat":"bebidas","nome":"Água com gás","desc":"","preco":6,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"bebidas-3","cat":"bebidas","nome":"Refrigerante lata","desc":"","preco":9,"veg":false,"opcoes":["Coca-Cola","Coca Zero","Guaraná Antártica","Fanta Uva","Fanta Laranja","Sprite"],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"bebidas-4","cat":"bebidas","nome":"Refrigerante 600ml","desc":"","preco":12,"veg":false,"opcoes":["Coca-Cola","Coca Zero","Guaraná Antártica"],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"bebidas-5","cat":"bebidas","nome":"Coca-Cola 2 litros","desc":"","preco":22,"veg":false,"opcoes":["Normal","Zero"],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"bebidas-6","cat":"bebidas","nome":"Refrigerante 2 litros","desc":"","preco":20,"veg":false,"opcoes":["Guaraná Antártica","Fanta Uva","Fanta Laranja","Sprite"],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"bebidas-7","cat":"bebidas","nome":"H2O","desc":"","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"bebidas-8","cat":"bebidas","nome":"Energético","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"bebidas-9","cat":"sucos-drinks","nome":"Suco natural","desc":"","preco":13,"veg":false,"opcoes":["Laranja","Abacaxi","Abacaxi com hortelã","Limão","Maracujá","Morango","Uva","Acerola"],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"bebidas-10","cat":"sucos-drinks","nome":"Jarra de suco grande","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"cervejas-1","cat":"cervejas","nome":"Brahma lata","desc":"","preco":8,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"cervejas-2","cat":"cervejas","nome":"Skol lata","desc":"","preco":8,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"cervejas-3","cat":"cervejas","nome":"Heineken long neck","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"cervejas-4","cat":"cervejas","nome":"Heineken zero long neck","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"cervejas-5","cat":"cervejas","nome":"Corona long neck","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"cervejas-6","cat":"cervejas","nome":"Brahma 600ml","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"cervejas-7","cat":"cervejas","nome":"Original 600ml","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"cervejas-8","cat":"cervejas","nome":"Heineken 600ml","desc":"","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"cervejas-9","cat":"sucos-drinks","nome":"Caipirinha de cachaça","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"cervejas-10","cat":"sucos-drinks","nome":"Caipiroska","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"cervejas-11","cat":"sucos-drinks","nome":"Caipirinha de cerveja","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"cervejas-12","cat":"sucos-drinks","nome":"Piña colada","desc":"","preco":28,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"cervejas-13","cat":"cervejas","nome":"Taça de vinho tinto suave","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9}];

export const BORDAS = [
 {
  "nome": "Cheddar",
  "preco": 15
 },
 {
  "nome": "Requeijão",
  "preco": 15
 },
 {
  "nome": "Parmesão",
  "preco": 20
 },
 {
  "nome": "Chocolate",
  "preco": 20
 },
 {
  "nome": "Creme de alho",
  "preco": 21
 },
 {
  "nome": "Catupiry Original",
  "preco": 23
 }
];

export const TAXAS_ENTREGA = [
 {
  "nome": "Centro",
  "taxa": 5
 },
 {
  "nome": "Bairros próximos",
  "taxa": 7
 },
 {
  "nome": "Bairros afastados",
  "taxa": 10
 },
 {
  "nome": "Zona rural",
  "taxa": 15
 }
];

// Adicionais lançados só na mesa (lista passada pela Jennifer).
// livre: "Outros adicionais" pede para o garçom escrever qual é (ex.: bacon).
export const ADICIONAIS = [
 {
  "grupo": "Esfiha",
  "nome": "Catupiry Original",
  "preco": 3
 },
 {
  "grupo": "Esfiha",
  "nome": "Peito de peru",
  "preco": 3
 },
 {
  "grupo": "Esfiha",
  "nome": "Outros adicionais",
  "preco": 2,
  "livre": true
 },
 {
  "grupo": "Pizza",
  "nome": "Catupiry Original (pizza inteira)",
  "preco": 33.8
 },
 {
  "grupo": "Pizza",
  "nome": "Catupiry Original (meia pizza)",
  "preco": 16.9
 },
 {
  "grupo": "Pizza",
  "nome": "Peito de peru (pizza inteira)",
  "preco": 33.8
 },
 {
  "grupo": "Pizza",
  "nome": "Peito de peru (meia pizza)",
  "preco": 16.9
 },
 {
  "grupo": "Pizza",
  "nome": "Outros adicionais (pizza inteira)",
  "preco": 20,
  "livre": true
 },
 {
  "grupo": "Pizza",
  "nome": "Outros adicionais (meia pizza)",
  "preco": 10,
  "livre": true
 },
 {
  "grupo": "Pastel",
  "nome": "Catupiry Original",
  "preco": 6
 },
 {
  "grupo": "Pastel",
  "nome": "Peito de peru",
  "preco": 6
 },
 {
  "grupo": "Pastel",
  "nome": "Outros adicionais",
  "preco": 3,
  "livre": true
 },
 {
  "grupo": "Beirute",
  "nome": "Catupiry Original",
  "preco": 8
 },
 {
  "grupo": "Beirute",
  "nome": "Peito de peru",
  "preco": 8
 },
 {
  "grupo": "Beirute",
  "nome": "Outros adicionais",
  "preco": 6,
  "livre": true
 },
 {
  "grupo": "Batata frita",
  "nome": "Catupiry Original",
  "preco": 10
 },
 {
  "grupo": "Batata frita",
  "nome": "Outros adicionais",
  "preco": 6,
  "livre": true
 },
 {
  "grupo": "Panqueca",
  "nome": "Catupiry Original",
  "preco": 6
 },
 {
  "grupo": "Panqueca",
  "nome": "Peito de peru",
  "preco": 6
 },
 {
  "grupo": "Panqueca",
  "nome": "Outros adicionais",
  "preco": 4,
  "livre": true
 }
];
