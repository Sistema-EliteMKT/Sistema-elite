// Cardápio inicial (importado do cardápio da Pizzaria Amarílis no Insta Delivery, em 20/10/2026).
// É só o ponto de partida: depois, tudo é editado pelo Caixa > Cardápio.
// canal: "todos" (mesa e delivery) · "mesa" (só no salão) · "delivery" (só entrega/retirada)
// grupoAdicional: qual lista de adicionais aparece para o garçom (na categoria ou no produto)
// Pizzas: preco = grande (8 pedaços), precoBroto = média (4 pedaços).
export const CATEGORIAS = [
 {
  "id": "pizzas",
  "nome": "Pizzas",
  "setor": "pizza",
  "nota": "Grande (8 pedaços) ou média (4 pedaços). Na pizza de dois sabores, vale o preço do sabor mais caro.",
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
  "id": "bebidas",
  "nome": "Refrigerantes e águas",
  "setor": "bebidas",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 6,
  "grupoAdicional": ""
 },
 {
  "id": "sucos",
  "nome": "Sucos",
  "setor": "preparo",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 7,
  "grupoAdicional": ""
 },
 {
  "id": "drinks",
  "nome": "Drinks",
  "setor": "preparo",
  "nota": "Proibida a venda de bebida alcoólica para menores de 18 anos.",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 8,
  "grupoAdicional": ""
 },
 {
  "id": "cervejas",
  "nome": "Cervejas",
  "setor": "bebidas",
  "nota": "Proibida a venda de bebida alcoólica para menores de 18 anos.",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 9,
  "grupoAdicional": ""
 },
 {
  "id": "acai",
  "nome": "Açaí",
  "setor": "preparo",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 10,
  "grupoAdicional": "Açaí"
 },
 {
  "id": "porcoes",
  "nome": "Porções",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 11,
  "grupoAdicional": ""
 },
 {
  "id": "pratos",
  "nome": "Pratos executivos",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 12,
  "grupoAdicional": ""
 },
 {
  "id": "pasteis",
  "nome": "Pastéis",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 13,
  "grupoAdicional": "Pastel"
 },
 {
  "id": "pasteisdoces",
  "nome": "Pastéis doces",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 14,
  "grupoAdicional": "Pastel"
 },
 {
  "id": "beirutes",
  "nome": "Beirutes",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 15,
  "grupoAdicional": "Beirute"
 },
 {
  "id": "panquecas",
  "nome": "Panquecas",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 16,
  "grupoAdicional": "Panqueca"
 },
 {
  "id": "batata-recheada",
  "nome": "Batata Recheada",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "Batata Recheada ",
  "grupoPizza": "",
  "ordem": 17,
  "grupoAdicional": ""
 },
 {
  "id": "kibes",
  "nome": "Kibes",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 18,
  "grupoAdicional": ""
 },
 {
  "id": "rodizio",
  "nome": "Rodízio",
  "setor": "cozinha",
  "nota": "",
  "prefixo": "",
  "grupoPizza": "",
  "ordem": 19,
  "grupoAdicional": ""
 }
];

export const PRODUTOS = [{"id":"pizzas-abobrinha","cat":"pizzas","nome":"Abobrinha","desc":"Abobrinha, muçarela, alho, orégano e azeitona","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":1,"precoBroto":52},{"id":"pizzas-atum-com-mucarela","cat":"pizzas","nome":"Atum com Muçarela","desc":"Atum, cebola, azeitonas e muçarela","preco":85,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":2,"precoBroto":60},{"id":"pizzas-atum-com-requeijao","cat":"pizzas","nome":"Atum com Requeijão","desc":"Atum, cebola, azeitonas e requeijão","preco":85,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":3,"precoBroto":60},{"id":"pizzas-bacon-com-mucarela","cat":"pizzas","nome":"Bacon com Muçarela","desc":"Bacon em cubos com muçarela","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":4,"precoBroto":52},{"id":"pizzas-bacon-com-requeijao","cat":"pizzas","nome":"Bacon com Requeijão","desc":"Bacon em cubos com requeijão","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":5,"precoBroto":52},{"id":"pizzas-baiana","cat":"pizzas","nome":"Baiana","desc":"Calabresa suína, ovos, molho de pimenta, cebola e azeitona","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":6,"precoBroto":52},{"id":"pizzas-bauru-com-mucarela","cat":"pizzas","nome":"Bauru com Muçarela","desc":"Presunto, tomate e muçarela","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":7,"precoBroto":52},{"id":"pizzas-bauru-com-requeijao","cat":"pizzas","nome":"Bauru com Requeijão","desc":"Presunto, tomate e requeijão","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":8,"precoBroto":52},{"id":"pizzas-bauru-peito-de-peru","cat":"pizzas","nome":"Bauru Peito de Peru","desc":"Peito de peru, tomate e muçarela","preco":84,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":9,"precoBroto":60},{"id":"pizzas-brocolis-com-bacon","cat":"pizzas","nome":"Brócolis com Bacon","desc":"Brócolis refogado, bacon, tomate, palmito e muçarela","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":10,"precoBroto":56},{"id":"pizzas-brocolis-com-mucarela","cat":"pizzas","nome":"Brócolis com Muçarela","desc":"Brócolis refogado e muçarela (alho frito opcional)","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":11,"precoBroto":52},{"id":"pizzas-brocolis-com-requeijao","cat":"pizzas","nome":"Brócolis com Requeijão","desc":"Brócolis refogado e requeijão (alho frito opcional)","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":12,"precoBroto":52},{"id":"pizzas-cachorro-quente","cat":"pizzas","nome":"Cachorro Quente","desc":"Salsicha ao molho, muçarela, milho e batata palha","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":13,"precoBroto":52},{"id":"pizzas-caipira-com-mucarela","cat":"pizzas","nome":"Caipira com Muçarela","desc":"Frango desfiado, milho e muçarela","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":14,"precoBroto":56},{"id":"pizzas-caipira-com-requeijao","cat":"pizzas","nome":"Caipira com Requeijão","desc":"Frango desfiado, milho e requeijão","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":15,"precoBroto":56},{"id":"pizzas-calabresa-suina-com-mucarela","cat":"pizzas","nome":"Calabresa Suína com Muçarela","desc":"Calabresa Suína fatiada com cebola e muçarela","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":16,"precoBroto":52},{"id":"pizzas-calabresa-suina-com-requeijao","cat":"pizzas","nome":"Calabresa Suína com Requeijão","desc":"Calabresa suína fatiada com cebola e requeijão","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":17,"precoBroto":52},{"id":"pizzas-calabresa-suina-so-com-cebola","cat":"pizzas","nome":"Calabresa Suína só com Cebola","desc":"Calabresa suína fatiada com cebola","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":18,"precoBroto":52},{"id":"pizzas-cubana-com-mucarela","cat":"pizzas","nome":"Cubana com Muçarela","desc":"Frango desfiado, palmito e muçarela","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":19,"precoBroto":56},{"id":"pizzas-cubana-com-requeijao","cat":"pizzas","nome":"Cubana com Requeijão","desc":"Frango desfiado, palmito e requeijão","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":20,"precoBroto":56},{"id":"pizzas-escarola-com-mucarela","cat":"pizzas","nome":"Escarola com Muçarela","desc":"Escarola temperada com alho, muçarela ou requeijão","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":21,"precoBroto":52},{"id":"pizzas-escarola-com-requeijao","cat":"pizzas","nome":"Escarola com Requeijão","desc":"Escarola temperada com alho e requeijão","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":22,"precoBroto":52},{"id":"pizzas-frango-com-bacon-e-mucarela","cat":"pizzas","nome":"Frango com Bacon e Muçarela","desc":"Frango desfiado, bacon e muçarela","preco":87,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":23,"precoBroto":61},{"id":"pizzas-frango-com-bacon-e-requeijao","cat":"pizzas","nome":"Frango com Bacon e Requeijão","desc":"Frango desfiado, bacon e requeijão","preco":87,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":24,"precoBroto":61},{"id":"pizzas-frango-com-cheddar-e-batata-palha","cat":"pizzas","nome":"Frango com Cheddar e Batata Palha","desc":"Frango desfiado, cheddar e batata palha","preco":85,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":25,"precoBroto":60},{"id":"pizzas-frango-com-mucarela","cat":"pizzas","nome":"Frango com Muçarela","desc":"Frango desfiado com muçarela","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":26,"precoBroto":52},{"id":"pizzas-frango-com-requeijao","cat":"pizzas","nome":"Frango com Requeijão","desc":"Frango desfiado com requeijão","preco":74,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":27,"precoBroto":52},{"id":"pizzas-lombo-com-palmito-e-mucarela","cat":"pizzas","nome":"Lombo com Palmito e Muçarela","desc":"Lombinho canadense, palmito, muçarela ou requeijão","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":28,"precoBroto":56},{"id":"pizzas-lombo-com-palmito-e-requeijao","cat":"pizzas","nome":"Lombo com Palmito e Requeijão","desc":"Lombinho canadense, palmito e requeijão","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":29,"precoBroto":56},{"id":"pizzas-marguerita","cat":"pizzas","nome":"Marguerita","desc":"Muçarela, manjericão, e rodelas de tomate","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":30,"precoBroto":52},{"id":"pizzas-milho-ao-creme","cat":"pizzas","nome":"Milho ao Creme","desc":"Milho verde, muçarela e creme de leite","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":31,"precoBroto":52},{"id":"pizzas-milho-com-mucarela","cat":"pizzas","nome":"Milho com Muçarela","desc":"Milho verde com muçarela","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":32,"precoBroto":52},{"id":"pizzas-milho-com-requeijao","cat":"pizzas","nome":"Milho com Requeijão","desc":"Milho verde com requeijão","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":33,"precoBroto":52},{"id":"pizzas-mucarela","cat":"pizzas","nome":"Muçarela","desc":"Muçarela, azeitonas e tomate","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":34,"precoBroto":52},{"id":"pizzas-palmito-com-mucarela","cat":"pizzas","nome":"Palmito com Muçarela","desc":"Palmito picado e muçarela","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":35,"precoBroto":52},{"id":"pizzas-palmito-com-requeijao","cat":"pizzas","nome":"Palmito com Requeijão","desc":"Palmito picado com requeijão","preco":74,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":36,"precoBroto":52},{"id":"pizzas-pao-de-alho","cat":"pizzas","nome":"Pão de Alho","desc":"Pão de alho, pasta de alho, muçarela e parmesão","preco":85,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":37,"precoBroto":60},{"id":"pizzas-paulista-com-mucarela","cat":"pizzas","nome":"Paulista com Muçarela","desc":"Calabresa suína, palmito, rodelas de tomate e muçarela","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":38,"precoBroto":56},{"id":"pizzas-paulista-com-requeijao","cat":"pizzas","nome":"Paulista com Requeijão","desc":"Calabresa suína, palmito, rodelas de tomate e requeijão","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":39,"precoBroto":56},{"id":"pizzas-peito-de-peru-com-mucarela","cat":"pizzas","nome":"Peito de Peru com Muçarela","desc":"Peito de peru, cebola e muçarela","preco":85,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":40,"precoBroto":60},{"id":"pizzas-peito-de-peru-com-requeijao","cat":"pizzas","nome":"Peito de Peru com Requeijão","desc":"Peito de peru, cebola e requeijão","preco":85,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":41,"precoBroto":60},{"id":"pizzas-pomodoro","cat":"pizzas","nome":"Pomodoro","desc":"Rodelas de tomate, parmesão, alho, azeitonas e muçarela","preco":80,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":42,"precoBroto":56},{"id":"pizzas-portuguesa","cat":"pizzas","nome":"Portuguesa","desc":"Presunto, palmito, ervilha, ovo, cebola e muçarela","preco":80,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":43,"precoBroto":56},{"id":"pizzas-rucula","cat":"pizzas","nome":"Rúcula","desc":"Muçarela, rúcula, tomate seco, azeitonas e orégano","preco":80,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":44,"precoBroto":56},{"id":"pizzas-siciliana","cat":"pizzas","nome":"Siciliana","desc":"Bacon, champignon e muçarela","preco":85,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":45,"precoBroto":60},{"id":"pizzas-toscana-com-mucarela","cat":"pizzas","nome":"Toscana com Muçarela","desc":"Calabresa suína, palmito, bacon e muçarela ou requeijão","preco":85,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":46,"precoBroto":60},{"id":"pizzas-toscana-com-requeijao","cat":"pizzas","nome":"Toscana com Requeijão","desc":"Calabresa suína, palmito, bacon e requeijão","preco":85,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":47,"precoBroto":60},{"id":"pizzas-vegetariana","cat":"pizzas","nome":"Vegetariana","desc":"Brócolis refogado, escarola temperada, palmito, milho e queijo minas","preco":85,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":48,"precoBroto":60},{"id":"especiais-a-moda-amarilis","cat":"especiais","nome":"À Moda Amarílis","desc":"Peito de peru, muçarela, pimentão, cebola, orégano, azeitona","preco":97,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":1,"precoBroto":68},{"id":"especiais-a-moda-pucheti","cat":"especiais","nome":"À Moda Pucheti","desc":"Calabresa, presunto, tomate e muçarela","preco":97,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":2,"precoBroto":68},{"id":"especiais-carne-seca-com-beringela","cat":"especiais","nome":"Carne Seca com Beringela","desc":"Carne seca, beringela temperada, parmesão e muçarela","preco":97,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":3,"precoBroto":68},{"id":"especiais-cinco-queijos","cat":"especiais","nome":"Cinco Queijos","desc":"Muçarela, parmesão, provolone, requeijão e gorgonzola","preco":100,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":4,"precoBroto":70},{"id":"especiais-costela-com-rucula","cat":"especiais","nome":"Costela com Rúcula","desc":"Muçarela, costela, parmesão, rúcula, tomate seco e azeitonas","preco":105,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":5,"precoBroto":73},{"id":"especiais-cupim","cat":"especiais","nome":"Cupim","desc":"Cupim desfiado, muçarela, parmesão e rúcula","preco":105,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":6,"precoBroto":73},{"id":"especiais-filadelfia","cat":"especiais","nome":"Filadélfia","desc":"Frango desfiado, bacon e cream cheese","preco":90,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":7,"precoBroto":52.9},{"id":"especiais-frango-ao-creme","cat":"especiais","nome":"Frango ao Creme","desc":"Frango desfiado, champignon, presunto picado, creme de leite, parmesão e muçarela","preco":90,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":8,"precoBroto":63},{"id":"especiais-frango-ao-creme-peito-de-peru","cat":"especiais","nome":"Frango ao Creme Peito de Peru","desc":"Frango desfiado, champignon, peito de peru, creme de leite, parmesão e muçarela","preco":100,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":9,"precoBroto":70},{"id":"especiais-marguerita-especial","cat":"especiais","nome":"Marguerita Especial","desc":"Muçarela de búfala, manjericão, parmesão e tomate seco","preco":100,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":10,"precoBroto":70},{"id":"especiais-mucarela-especial","cat":"especiais","nome":"Muçarela Especial","desc":"Muçarela de búfala, rúcula, tomate seco e azeitonas","preco":100,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":11,"precoBroto":70},{"id":"especiais-nordestina","cat":"especiais","nome":"Nordestina","desc":"Muçarela, carne seca, pimentão, cebola, parmesão ou requeijão","preco":97,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":12,"precoBroto":68},{"id":"especiais-peperone-com-mucarela","cat":"especiais","nome":"Peperone com Muçarela","desc":"Peperone, cebola, parmesão e muçarela","preco":100,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":13,"precoBroto":70},{"id":"especiais-peperone-com-requeijao","cat":"especiais","nome":"Peperone com Requeijão","desc":"Peperone, cebola, parmesão e requeijão","preco":100,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":14,"precoBroto":70},{"id":"especiais-peruana-com-mucarela","cat":"especiais","nome":"Peruana com Muçarela","desc":"Atum, ovos e muçarela","preco":90,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":15,"precoBroto":63},{"id":"especiais-peruana-com-requeijao","cat":"especiais","nome":"Peruana com Requeijão","desc":"Atum, ovos e requeijão","preco":90,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":16,"precoBroto":63},{"id":"especiais-pizzaiolo-com-cheddar","cat":"especiais","nome":"Pizzaiolo com Cheddar","desc":"Batata frita com muçarela, bacon e cheddar","preco":97,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":17,"precoBroto":68},{"id":"especiais-pizzaiolo-com-requeijao","cat":"especiais","nome":"Pizzaiolo com Requeijão","desc":"Batata frita com muçarela, bacon e requeijão","preco":97,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":18,"precoBroto":68},{"id":"especiais-portuguesa-especial","cat":"especiais","nome":"Portuguesa Especial","desc":"Muçarela de búfala, tomate seco, peito de peru desfiado e palmito","preco":100,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":19,"precoBroto":70},{"id":"especiais-portuguesa-peito-de-peru","cat":"especiais","nome":"Portuguesa Peito de Peru","desc":"Peito de peru, palmito, ervilha, ovo, cebola e muçarela","preco":90,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":20,"precoBroto":63},{"id":"especiais-quatro-queijos","cat":"especiais","nome":"Quatro Queijos","desc":"Muçarela, provolone, parmesão e requeijão","preco":90,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":21,"precoBroto":63},{"id":"especiais-strogonoff-de-carne","cat":"especiais","nome":"Strogonoff de Carne","desc":"Strogonoff de carne, batata palha e muçarela","preco":97,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":22,"precoBroto":68},{"id":"especiais-strogonoff-de-frango","cat":"especiais","nome":"Strogonoff de Frango","desc":"Strogonoff de frango, batata palha e muçarela","preco":97,"veg":false,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":23,"precoBroto":68},{"id":"doces-banana-com-canela","cat":"doces","nome":"Banana com Canela","desc":"Banana, leite condensado e canela","preco":80,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":2,"precoBroto":56},{"id":"doces-banana-com-chocolate","cat":"doces","nome":"Banana com Chocolate","desc":"","preco":85,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":3,"precoBroto":56},{"id":"doces-banana-com-doce-de-leite","cat":"doces","nome":"Banana com Doce de Leite","desc":"","preco":85,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":4,"precoBroto":60},{"id":"doces-banana-nevada","cat":"doces","nome":"Banana Nevada","desc":"Banana com chocolate branco passado no forno","preco":85,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":5,"precoBroto":60},{"id":"doces-chocolate-ao-leite-com-morango","cat":"doces","nome":"Chocolate ao Leite com Morango","desc":"","preco":80,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":8,"precoBroto":56},{"id":"doces-chocolate-branco-com-morango","cat":"doces","nome":"Chocolate Branco com Morango","desc":"","preco":80,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":9,"precoBroto":56},{"id":"doces-chocolate-misto","cat":"doces","nome":"Chocolate Misto","desc":"Chocolate branco e chocolate ao leite","preco":80,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":11,"precoBroto":56},{"id":"doces-romeu-e-julieta","cat":"doces","nome":"Romeu e Julieta","desc":"Queijo com goiabada cremosa","preco":85,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":12,"precoBroto":60},{"id":"doces-abacaxi-com-chocolate-branco","cat":"doces","nome":"Abacaxi com Chocolate Branco","desc":"","preco":85,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":1,"precoBroto":null},{"id":"doces-banoffe","cat":"doces","nome":"Banoffe","desc":"Banana, doce de leite e requeijão","preco":90,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":6,"precoBroto":null},{"id":"doces-cheesecake","cat":"doces","nome":"Cheesecake","desc":"Cream cheese, chocolate branco e calda de morango","preco":90,"veg":true,"opcoes":[],"tipo":"pizza","canal":"todos","ativo":true,"ordem":7,"precoBroto":null},{"id":"doces-chocolate-com-sorvete-de-creme","cat":"doces","nome":"Chocolate com Sorvete de Creme","desc":"Não disponível para entrega","preco":92,"veg":true,"opcoes":[],"tipo":"pizza","canal":"mesa","ativo":true,"ordem":10,"precoBroto":null},{"id":"esfihas-abobrinha","cat":"esfihas","nome":"Abobrinha","desc":"Muçarela, abobrinha, parmesão e alho frito opcional","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"esfihas-atum-catupiry-original","cat":"esfihas","nome":"Atum Catupiry Original","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"esfihas-atum-com-mucarela","cat":"esfihas","nome":"Atum com Muçarela","desc":"Atum ralado com muçarela","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"esfihas-atum-com-requeijao","cat":"esfihas","nome":"Atum com Requeijão","desc":"Atum ralado com requeijão","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"esfihas-bacon-catupiry-original","cat":"esfihas","nome":"Bacon Catupiry Original","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"esfihas-bacon-com-mucarela","cat":"esfihas","nome":"Bacon com Muçarela","desc":"Bacon com muçarela","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"esfihas-bacon-com-requeijao","cat":"esfihas","nome":"Bacon com Requeijão","desc":"Bacon com requeijão","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"esfihas-baiana","cat":"esfihas","nome":"Baiana","desc":"Calabresa ralada, ovo, cebola, molho de imenta, e pimenta biquinho","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"esfihas-bauru-c-mucarela","cat":"esfihas","nome":"Bauru c/ Muçarela","desc":"Presunto, tomate e muçarela","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"esfihas-bauru-c-requeijao","cat":"esfihas","nome":"Bauru c/ Requeijão","desc":"Presunto, tomate e requeijão","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":10},{"id":"esfihas-brocolis-catupiry-original","cat":"esfihas","nome":"Brócolis Catupiry Original","desc":"Brócolis refogado e catupiry original","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":11},{"id":"esfihas-brocolis-com-mucarela","cat":"esfihas","nome":"Brócolis com Muçarela","desc":"Brócolis refogado com muçarela","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":12},{"id":"esfihas-brocolis-com-requeijao","cat":"esfihas","nome":"Brócolis com Requeijão","desc":"Brócolis refogado com requeijão","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":13},{"id":"esfihas-brocolis-bacon-e-catupiry-original","cat":"esfihas","nome":"Brócolis, Bacon e Catupiry Original","desc":"Brócolis refogado, bacon e catupiry original","preco":14,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":14},{"id":"esfihas-brocolis-bacon-e-mucarela","cat":"esfihas","nome":"Brócolis, Bacon e Muçarela","desc":"Brócolis refogado com muçarela e bacon","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":15},{"id":"esfihas-brocolis-bacon-e-requeijao","cat":"esfihas","nome":"Brócolis, Bacon e Requeijão","desc":"Brócolis refogado com requeijão e bacon","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":16},{"id":"esfihas-cachorro-quente","cat":"esfihas","nome":"Cachorro Quente","desc":"Muçarela, salsicha ao molho, milho verde e batata palha","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":17},{"id":"esfihas-caipira-catupiry-original","cat":"esfihas","nome":"Caipira Catupiry Original","desc":"Frango desfiado, milho e catupiry original","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":18},{"id":"esfihas-caipira-com-mucarela","cat":"esfihas","nome":"Caipira com Muçarela","desc":"Frango desfiado, milho e muçarela","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":19},{"id":"esfihas-caipira-com-requeijao","cat":"esfihas","nome":"Caipira com Requeijão","desc":"Frango desfiado, milho e requeijão","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":20},{"id":"esfihas-calabresa-so-com-cebola","cat":"esfihas","nome":"Calabresa só com Cebola","desc":"Calabresa suína ralada com cebola","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":21},{"id":"esfihas-calabresa-suina-catupiry-original","cat":"esfihas","nome":"Calabresa Suína Catupiry Original","desc":"Calabresa suína ralada com catupiry original","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":22},{"id":"esfihas-calabresa-suina-com-mucarela","cat":"esfihas","nome":"Calabresa Suína com Muçarela","desc":"Calabresa suína ralada com muçarela","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":23},{"id":"esfihas-calabresa-suina-com-requeijao","cat":"esfihas","nome":"Calabresa Suína com Requeijão","desc":"Calabresa suína ralada com requeijão","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":24},{"id":"esfihas-carne","cat":"esfihas","nome":"Carne","desc":"Carne moída","preco":8,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":25},{"id":"esfihas-carne-catupiry-original","cat":"esfihas","nome":"Carne Catupiry Original","desc":"Carne moída com catupiry original","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":26},{"id":"esfihas-carne-com-mucarela","cat":"esfihas","nome":"Carne com Muçarela","desc":"Carne moída com muçarela","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":27},{"id":"esfihas-carne-com-requeijao","cat":"esfihas","nome":"Carne com Requeijão","desc":"Carne moída com requeijão","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":28},{"id":"esfihas-carne-seca-com-beringela","cat":"esfihas","nome":"Carne Seca com Beringela","desc":"Beringela refogada, carne seca desfiada, parmesão e muçarela","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":29},{"id":"esfihas-carne-seca-com-jilo","cat":"esfihas","nome":"Carne Seca com Jiló","desc":"Jiló refogada, carne seca desfiada, parmesão e muçarela","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":30},{"id":"esfihas-carne-seca-com-mucarela","cat":"esfihas","nome":"Carne Seca com Muçarela","desc":"Carne seca desfiada e muçarela","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":31},{"id":"esfihas-carne-seca-com-requeijao","cat":"esfihas","nome":"Carne Seca com Requeijão","desc":"Carne seca desfiada e requeijão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":32},{"id":"esfihas-cinco-queijos","cat":"esfihas","nome":"Cinco Queijos","desc":"Muçarela, parmesão, provolone, requeijão e gorgonzola","preco":12,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":33},{"id":"esfihas-costela-com-parmesao","cat":"esfihas","nome":"Costela com Parmesão","desc":"Muçarela, costela desfiada, cebola e parmesão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":34},{"id":"esfihas-costela-com-requeijao","cat":"esfihas","nome":"Costela com Requeijão","desc":"Muçarela, costela desfiada, cebola e requeijão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":35},{"id":"esfihas-cupim-com-parmesao","cat":"esfihas","nome":"Cupim com Parmesão","desc":"Muçarela, rúcula, cupim desfiado, cebola e parmesão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":36},{"id":"esfihas-cupim-com-requeijao","cat":"esfihas","nome":"Cupim com Requeijão","desc":"Muçarela, rúcula, cupim desfiado, cebola e requeijão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":37},{"id":"esfihas-dois-queijos","cat":"esfihas","nome":"Dois Queijos","desc":"Muçarela e requeijão","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":38},{"id":"esfihas-escarola-com-mucarela","cat":"esfihas","nome":"Escarola com Muçarela","desc":"Escarola refogada com muçarela","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":39},{"id":"esfihas-escarola-com-requeijao","cat":"esfihas","nome":"Escarola com Requeijão","desc":"Escarola refogada com requeijão","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":40},{"id":"esfihas-escarola-mucarela-e-bacon","cat":"esfihas","nome":"Escarola, Muçarela e Bacon","desc":"Escarola refogada, muçarela e bacon","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":41},{"id":"esfihas-escarola-requeijao-e-bacon","cat":"esfihas","nome":"Escarola, Requeijão e Bacon","desc":"Escarola refogada, requeijão e bacon","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":42},{"id":"esfihas-filadelfia","cat":"esfihas","nome":"Filadélfia","desc":"Frango desfiado, bacon e cream cheese","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":43},{"id":"esfihas-frango-ao-creme","cat":"esfihas","nome":"Frango ao Creme","desc":"Muçarela, frango desfiado, presunto, champignon, creme de leite e parmesão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":44},{"id":"esfihas-frango-ao-creme-peito-de-peru","cat":"esfihas","nome":"Frango ao Creme Peito de Peru","desc":"Muçarela, frango desfiado, peito de peru, champignon, creme de leite e parmesão","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":45},{"id":"esfihas-frango-bacon-e-mucarela","cat":"esfihas","nome":"Frango Bacon e Muçarela","desc":"Frango desfiado, bacon e muçarela","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":46},{"id":"esfihas-frango-bacon-e-requeijao","cat":"esfihas","nome":"Frango Bacon e Requeijão","desc":"Frango desfiado, bacon e requeijão","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":47},{"id":"esfihas-frango-catupiry-original","cat":"esfihas","nome":"Frango Catupiry Original","desc":"Frango desfiado com catupiry original","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":48},{"id":"esfihas-frango-mucarela","cat":"esfihas","nome":"Frango Muçarela","desc":"Frango desfiado com muçarela","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":49},{"id":"esfihas-frango-requeijao","cat":"esfihas","nome":"Frango Requeijão","desc":"Frango desfiado com requeijão","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":50},{"id":"esfihas-linguica-toscana-parmesao","cat":"esfihas","nome":"Linguiça Toscana Parmesão","desc":"Muçarela, linguiça toscana, cebola e parmesão","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":51},{"id":"esfihas-linguica-toscana-requeijao","cat":"esfihas","nome":"Linguiça Toscana Requeijão","desc":"Muçarela, linguiça toscana, cebola e requeijão","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":52},{"id":"esfihas-lombo-com-mucarela","cat":"esfihas","nome":"Lombo com Muçarela","desc":"Lombo e muçarela","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":53},{"id":"esfihas-lombo-com-requeijao","cat":"esfihas","nome":"Lombo com Requeijão","desc":"Lombo e requeijão","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":54},{"id":"esfihas-lombo-palmito-e-mucarela","cat":"esfihas","nome":"Lombo Palmito e Muçarela","desc":"Lombo, palmito e muçarela","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":55},{"id":"esfihas-lombo-palmito-e-requeijao","cat":"esfihas","nome":"Lombo Palmito e Requeijão","desc":"Lombo, palmito e requeijão","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":56},{"id":"esfihas-lombo-palmito-catupiry-original","cat":"esfihas","nome":"Lombo, Palmito Catupiry Original","desc":"Lombo, palmito catupiry original","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":57},{"id":"esfihas-marguerita","cat":"esfihas","nome":"Marguerita","desc":"Molho tomate, muçarela, tomate, orégano e manjericão","preco":10,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":58},{"id":"esfihas-marguerita-ii","cat":"esfihas","nome":"Marguerita II","desc":"Muçarela de búfala, manjericão, parmesão e tomate seco","preco":12,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":59},{"id":"esfihas-milho-ao-creme","cat":"esfihas","nome":"Milho ao Creme","desc":"Milho, muçarela e creme de leite","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":60},{"id":"esfihas-milho-catupiry-original","cat":"esfihas","nome":"Milho Catupiry Original","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":61},{"id":"esfihas-milho-mucarela","cat":"esfihas","nome":"Milho Muçarela","desc":"Milho com muçarela","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":62},{"id":"esfihas-milho-requeijao","cat":"esfihas","nome":"Milho Requeijão","desc":"Milho com requeijão","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":63},{"id":"esfihas-palmito-bacon-e-catupiry-original","cat":"esfihas","nome":"Palmito Bacon e Catupiry Original","desc":"Palmito picado, bacon e catupiry original","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":64},{"id":"esfihas-palmito-bacon-e-mucarela","cat":"esfihas","nome":"Palmito Bacon e Muçarela","desc":"Palmito picado, bacon em cubos e muçarela","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":65},{"id":"esfihas-palmito-bacon-e-requeijao","cat":"esfihas","nome":"Palmito Bacon e Requeijão","desc":"Palmito picado, bacon em cubos e requeijão","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":66},{"id":"esfihas-palmito-catupiry-original","cat":"esfihas","nome":"Palmito Catupiry Original","desc":"Palmito picado com catupiry original","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":67},{"id":"esfihas-palmito-mucarela","cat":"esfihas","nome":"Palmito Muçarela","desc":"Palmito picado com muçarela","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":68},{"id":"esfihas-palmito-requeijao","cat":"esfihas","nome":"Palmito Requeijão","desc":"Palmito picado com requeijão","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":69},{"id":"esfihas-pao-de-alho","cat":"esfihas","nome":"Pão de Alho","desc":"Pão de alho, muçarela, parmesão e pasta de alho","preco":12,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":70},{"id":"esfihas-peito-de-peru-catupiry-original","cat":"esfihas","nome":"Peito de Peru Catupiry Original","desc":"Peito de peru catupiry original","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":71},{"id":"esfihas-peito-de-peru-mucarela","cat":"esfihas","nome":"Peito de Peru Muçarela","desc":"Peito de peru muçarela","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":72},{"id":"esfihas-peito-de-peru-requeijao","cat":"esfihas","nome":"Peito de Peru Requeijão","desc":"Peito de peru e requeijão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":73},{"id":"esfihas-peperone-catupiry-original","cat":"esfihas","nome":"Peperone Catupiry Original","desc":"Peperone, cebola, parmesão e catupiry original","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":74},{"id":"esfihas-peperone-mucarela","cat":"esfihas","nome":"Peperone Muçarela","desc":"Peperone, cebola, parmesão e muçarela","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":75},{"id":"esfihas-peperone-requeijao","cat":"esfihas","nome":"Peperone Requeijão","desc":"Peperone, cebola parmesão e requeijão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":76},{"id":"esfihas-pizza","cat":"esfihas","nome":"Pizza","desc":"Molho de tomate, muçarela, tomate e orégano","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":77},{"id":"esfihas-pizzaiolo-cheddar","cat":"esfihas","nome":"Pizzaiolo Cheddar","desc":"Batata frita, bacon e cheddar","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":78},{"id":"esfihas-pizzaiolo-requeijao","cat":"esfihas","nome":"Pizzaiolo Requeijão","desc":"Batata frita, bacon e requeijão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":79},{"id":"esfihas-pomodoro","cat":"esfihas","nome":"Pomodoro","desc":"Tomate, parmesão, muçarela e alho frito","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":80},{"id":"esfihas-portuguesa","cat":"esfihas","nome":"Portuguesa","desc":"Presunto, palmito, ervilha, ovo e muçarela","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":81},{"id":"esfihas-portuguesa-peito-de-peru","cat":"esfihas","nome":"Portuguesa Peito de Peru","desc":"Peito de peru, palmito, ervilha, ovo e muçarela","preco":14,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":82},{"id":"esfihas-provolone","cat":"esfihas","nome":"Provolone","desc":"","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":83},{"id":"esfihas-quatro-queijos","cat":"esfihas","nome":"Quatro Queijos","desc":"Muçarela, requeijão, provolone e parmesão","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":84},{"id":"esfihas-queijo","cat":"esfihas","nome":"Queijo","desc":"Muçarela","preco":8,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":85},{"id":"esfihas-queijo-com-alho","cat":"esfihas","nome":"Queijo com Alho","desc":"Muçarela e alho frito","preco":8,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":86},{"id":"esfihas-queijo-especial","cat":"esfihas","nome":"Queijo Especial","desc":"Muçarela de búfala, rúcula e tomate seco","preco":12,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":87},{"id":"esfihas-queijo-minas","cat":"esfihas","nome":"Queijo Minas","desc":"Queijo branco","preco":12,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":88},{"id":"esfihas-requeijao-premium","cat":"esfihas","nome":"Requeijão Premium","desc":"","preco":9,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":89},{"id":"esfihas-rucula-mucarela-e-tomate-seco","cat":"esfihas","nome":"Rúcula, Muçarela e Tomate Seco","desc":"","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":90},{"id":"esfihas-strogonoff-carne","cat":"esfihas","nome":"Strogonoff Carne","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":91},{"id":"esfihas-strogonoff-frango","cat":"esfihas","nome":"Strogonoff Frango","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":92},{"id":"esfihas-toscana-mucarela","cat":"esfihas","nome":"Toscana Muçarela","desc":"Calabresa, bacon, palmito e muçarela","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":93},{"id":"esfihas-toscana-requeijao","cat":"esfihas","nome":"Toscana Requeijão","desc":"Calabresa, bacon, palmito e requeijão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":94},{"id":"esfihas-vaca-atolada-parmesao","cat":"esfihas","nome":"Vaca Atolada Parmesão","desc":"Muçarela, costela desfiada, mandioca cozida, cebola e parmesão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":95},{"id":"esfihas-vaca-atolada-requeijao","cat":"esfihas","nome":"Vaca Atolada Requeijão","desc":"Muçarela, costela desfiada, mandioca cozida, cebola e requeijão","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":96},{"id":"esfdoces-abacaxi-com-chocolate-branco","cat":"esfdoces","nome":"Abacaxi com Chocolate Branco","desc":"Abacaxi picado com chocolate branco passado no fornopassado ao forno","preco":13,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"esfdoces-banana-com-canela","cat":"esfdoces","nome":"Banana com Canela","desc":"Banana, leite condensado e canela","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"esfdoces-banana-com-chocolate-ao-leite","cat":"esfdoces","nome":"Banana com Chocolate ao Leite","desc":"","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"esfdoces-banana-com-chocolate-branco","cat":"esfdoces","nome":"Banana com Chocolate Branco","desc":"","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"esfdoces-banana-com-doce-de-leite","cat":"esfdoces","nome":"Banana com Doce de Leite","desc":"","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"esfdoces-banana-nevada","cat":"esfdoces","nome":"Banana Nevada","desc":"Banana com chocolate branco passado no forno","preco":12,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"esfdoces-banoffe","cat":"esfdoces","nome":"Banoffe","desc":"Banana, requeijão, doce de leite e canela em pó","preco":13,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"esfdoces-cheesecake","cat":"esfdoces","nome":"Cheesecake","desc":"Cream cheese, chocolate branco, calda de morango e morango","preco":13,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"esfdoces-chocolate-ao-leite","cat":"esfdoces","nome":"Chocolate ao Leite","desc":"Com morango","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"esfdoces-chocolate-branco","cat":"esfdoces","nome":"Chocolate Branco","desc":"Com morango","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":10},{"id":"esfdoces-chocolate-misto","cat":"esfdoces","nome":"Chocolate Misto","desc":"Com morango","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":11},{"id":"esfdoces-mucarela-c-doce-de-leite","cat":"esfdoces","nome":"Muçarela c/ Doce de Leite","desc":"","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":12},{"id":"esfdoces-nutella-com-morango","cat":"esfdoces","nome":"Nutella com Morango","desc":"","preco":14,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":13},{"id":"esfdoces-nutella-especial","cat":"esfdoces","nome":"Nutella Especial","desc":"Nutella, leite em pó e bastante morango","preco":16,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":14},{"id":"esfdoces-romeu-e-julieta","cat":"esfdoces","nome":"Romeu e Julieta","desc":"Muçarela com goiabada","preco":11,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":15},{"id":"bebidas-agua-tonica-lata","cat":"bebidas","nome":"Água Tônica lata","desc":"","preco":10,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"bebidas-coca-cola-lata","cat":"bebidas","nome":"Coca-Cola lata","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"bebidas-coca-cola-zero-lata","cat":"bebidas","nome":"Coca-Cola Zero lata","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"bebidas-fanta-laranja-lata","cat":"bebidas","nome":"Fanta Laranja lata","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"bebidas-fanta-uva-lata","cat":"bebidas","nome":"Fanta Uva lata","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"bebidas-guarana-zero-lata","cat":"bebidas","nome":"Guaraná Zero lata","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"bebidas-schweppes-citrus-lata","cat":"bebidas","nome":"Schweppes Citrus lata","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"bebidas-sprite-lata","cat":"bebidas","nome":"Sprite lata","desc":"","preco":9,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"bebidas-coca-cola-600ml","cat":"bebidas","nome":"Coca-Cola 600ml","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"bebidas-coca-cola-zero-600ml","cat":"bebidas","nome":"Coca-Cola Zero 600ml","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":10},{"id":"bebidas-guarana-600ml","cat":"bebidas","nome":"Guaraná 600ml","desc":"","preco":12,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":11},{"id":"bebidas-coca-cola-1-5l","cat":"bebidas","nome":"Coca-Cola 1,5L","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":12},{"id":"bebidas-coca-cola-zero-1-5l","cat":"bebidas","nome":"Coca-Cola Zero 1,5L","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":13},{"id":"bebidas-guarana-1-5l","cat":"bebidas","nome":"Guaraná 1,5L","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":14},{"id":"bebidas-coca-cola-2l","cat":"bebidas","nome":"Coca-Cola 2L","desc":"","preco":22,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":15},{"id":"bebidas-coca-cola-zero-2l","cat":"bebidas","nome":"Coca-Cola Zero 2L","desc":"","preco":22,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":16},{"id":"bebidas-fanta-laranja-2l","cat":"bebidas","nome":"Fanta Laranja 2L","desc":"","preco":20,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":17},{"id":"bebidas-fanta-uva-2l","cat":"bebidas","nome":"Fanta Uva 2L","desc":"","preco":20,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":18},{"id":"bebidas-guarana-2l","cat":"bebidas","nome":"Guaraná 2L","desc":"","preco":20,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":19},{"id":"bebidas-sprite-2l","cat":"bebidas","nome":"Sprite 2L","desc":"","preco":20,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":20},{"id":"bebidas-agua-com-gas-500ml","cat":"bebidas","nome":"Água com gás 500ml","desc":"","preco":6,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":21},{"id":"bebidas-agua-sem-gas-500ml","cat":"bebidas","nome":"Água sem gás 500ml","desc":"","preco":5,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":22},{"id":"bebidas-h2o","cat":"bebidas","nome":"H2O","desc":"","preco":11,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":23},{"id":"bebidas-energetico","cat":"bebidas","nome":"Energético","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":24},{"id":"sucos-suco-abacaxi-500ml","cat":"sucos","nome":"Suco Abacaxi 500ml","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"sucos-suco-abacaxi-c-hortela-500ml","cat":"sucos","nome":"Suco Abacaxi c/ Hortelã 500ml","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"sucos-suco-acai-c-laranja-500ml","cat":"sucos","nome":"Suco Açaí c/ Laranja 500ml","desc":"","preco":16,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"sucos-suco-goiaba-500ml","cat":"sucos","nome":"Suco Goiaba 500ml","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"sucos-suco-laranja-500ml","cat":"sucos","nome":"Suco Laranja 500ml","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"sucos-suco-laranja-c-acerola-500ml","cat":"sucos","nome":"Suco Laranja c/ Acerola 500ml","desc":"","preco":16,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"sucos-suco-laranja-c-morango-500ml","cat":"sucos","nome":"Suco Laranja c/ Morango 500ml","desc":"","preco":16,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"sucos-suco-maracuja-500ml","cat":"sucos","nome":"Suco Maracujá 500ml","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"sucos-suco-maracuja-c-leite-500ml","cat":"sucos","nome":"Suco Maracujá c/ Leite 500ml","desc":"","preco":16,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"sucos-suco-morango-500ml","cat":"sucos","nome":"Suco Morango 500ml","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":10},{"id":"sucos-suco-morango-c-laranja-500ml","cat":"sucos","nome":"Suco Morango c/ Laranja 500ml","desc":"","preco":16,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":11},{"id":"sucos-suco-morango-c-leite-500ml","cat":"sucos","nome":"Suco Morango c/ Leite 500ml","desc":"","preco":16,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":12},{"id":"sucos-suco-abacaxi-c-hortela-1l","cat":"sucos","nome":"Suco Abacaxi c/ Hortelã 1L","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":13},{"id":"sucos-suco-abacaxi-1l","cat":"sucos","nome":"Suco Abacaxi 1L","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":14},{"id":"sucos-suco-acerola-1l","cat":"sucos","nome":"Suco Acerola 1L","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":15},{"id":"sucos-suco-goiaba-1l","cat":"sucos","nome":"Suco Goiaba 1L","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":16},{"id":"sucos-suco-laranja-1l","cat":"sucos","nome":"Suco Laranja 1L","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":17},{"id":"sucos-suco-laranja-c-acai-1l","cat":"sucos","nome":"Suco Laranja c/ Açaí 1L","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":18},{"id":"sucos-suco-laranja-c-acerola-1l","cat":"sucos","nome":"Suco Laranja c/ Acerola 1L","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":19},{"id":"sucos-suco-laranja-c-morango-1l","cat":"sucos","nome":"Suco Laranja c/ Morango 1L","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":20},{"id":"sucos-suco-maracuja-1l","cat":"sucos","nome":"Suco Maracujá 1L","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":21},{"id":"sucos-suco-maracuja-c-leite-1l","cat":"sucos","nome":"Suco Maracujá c/ Leite 1L","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":22},{"id":"sucos-suco-morango-1l","cat":"sucos","nome":"Suco Morango 1L","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":23},{"id":"sucos-suco-morango-c-leite-1l","cat":"sucos","nome":"Suco Morango c/ Leite 1L","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":24},{"id":"drinks-caipirinha-de-cachaca","cat":"drinks","nome":"Caipirinha de Cachaça","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":25},{"id":"drinks-caipiroska","cat":"drinks","nome":"Caipiroska","desc":"","preco":25,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":26},{"id":"drinks-caipirinha-de-cerveja","cat":"drinks","nome":"Caipirinha de Cerveja","desc":"","preco":30,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":27},{"id":"drinks-pina-colada","cat":"drinks","nome":"Piña Colada","desc":"","preco":28,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":28},{"id":"cervejas-amstel-lata","cat":"cervejas","nome":"Amstel lata","desc":"","preco":8,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"cervejas-antartica-lata","cat":"cervejas","nome":"Antártica lata","desc":"","preco":7,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"cervejas-brahma-lata","cat":"cervejas","nome":"Brahma lata","desc":"","preco":8,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"cervejas-imperio-lata","cat":"cervejas","nome":"Império lata","desc":"","preco":8,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"cervejas-skol-lata","cat":"cervejas","nome":"Skol lata","desc":"","preco":8,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"cervejas-heineken-long-neck","cat":"cervejas","nome":"Heineken Long Neck","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"cervejas-heineken-zero-long-neck","cat":"cervejas","nome":"Heineken Zero Long Neck","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"cervejas-corona-long-neck","cat":"cervejas","nome":"Corona Long Neck","desc":"","preco":13,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"cervejas-brahma-600ml","cat":"cervejas","nome":"Brahma 600ml","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"cervejas-original-600ml","cat":"cervejas","nome":"Original 600ml","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":10},{"id":"cervejas-heineken-600ml","cat":"cervejas","nome":"Heineken 600ml","desc":"","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":11},{"id":"cervejas-taca-de-vinho-tinto-suave","cat":"cervejas","nome":"Taça de Vinho Tinto Suave","desc":"","preco":17,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":12},{"id":"acai-acai-500ml","cat":"acai","nome":"Açaí 500ml","desc":"Açaí, leite em pó, leite condensado, granola, morango e banana","preco":28,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"porcoes-porcao-batata-com-cheddar","cat":"porcoes","nome":"Porção Batata com Cheddar","desc":"","preco":42,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1,"grupoAdicional":"Batata frita"},{"id":"porcoes-porcao-batata-com-queijo","cat":"porcoes","nome":"Porção Batata com Queijo","desc":"","preco":42,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2,"grupoAdicional":"Batata frita"},{"id":"porcoes-porcao-batata-com-requeijao","cat":"porcoes","nome":"Porção Batata com Requeijão","desc":"","preco":42,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3,"grupoAdicional":"Batata frita"},{"id":"porcoes-porcao-batata-frita","cat":"porcoes","nome":"Porção Batata Frita","desc":"","preco":39,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4,"grupoAdicional":"Batata frita"},{"id":"porcoes-porcao-batata-bacon-e-cheddar","cat":"porcoes","nome":"Porção Batata, Bacon e Cheddar","desc":"","preco":48,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5,"grupoAdicional":"Batata frita"},{"id":"porcoes-porcao-batata-bacon-e-queijo","cat":"porcoes","nome":"Porção Batata, Bacon e Queijo","desc":"","preco":48,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6,"grupoAdicional":"Batata frita"},{"id":"porcoes-porcao-batata-bacon-e-requeijao","cat":"porcoes","nome":"Porção Batata, Bacon e Requeijão","desc":"","preco":48,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7,"grupoAdicional":"Batata frita"},{"id":"porcoes-porcao-contra-file-acebolado-aprox-600gr","cat":"porcoes","nome":"Porção Contra Filé Acebolado (aprox. 600gr)","desc":"Acompanha Pão de Alho","preco":106,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"porcoes-porcao-frango-a-passarinho-aprox-600gr","cat":"porcoes","nome":"Porção Frango à Passarinho (aprox. 600gr)","desc":"","preco":59,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"porcoes-porcao-picanha-acebolada-aprox-600gr","cat":"porcoes","nome":"Porção Picanha Acebolada (aprox. 600gr)","desc":"Acompanha Pão de Alho","preco":123,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":10},{"id":"porcoes-porcao-tilapia-frita-aprox-600gr","cat":"porcoes","nome":"Porção Tilápia Frita (aprox. 600gr)","desc":"","preco":78,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":11},{"id":"pratos-prato-executivo-contra-file-grelhado","cat":"pratos","nome":"Prato Executivo - Contra Filé Grelhado","desc":"Arroz, feijão, salada e batata frita","preco":58,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"pratos-prato-executivo-file-de-frango","cat":"pratos","nome":"Prato Executivo - Filé de Frango","desc":"Arroz, feijão, salada e batata frita","preco":46,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"pratos-prato-executivo-file-de-tilapia-grelhada","cat":"pratos","nome":"Prato Executivo - Filé de Tilápia Grelhada","desc":"Arroz, feijão, salada e batata frita","preco":56,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"pratos-prato-executivo-picanha","cat":"pratos","nome":"Prato Executivo - Picanha","desc":"Arroz, feijão, salada e batata frita","preco":62,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"pratos-prato-executivo-strogonoff-carne","cat":"pratos","nome":"Prato Executivo - Strogonoff Carne","desc":"Acompanha arroz, feijão, salada e fritas","preco":56,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"pratos-prato-executivo-strogonoff-frango","cat":"pratos","nome":"Prato Executivo - Strogonoff Frango","desc":"Arroz, feijão, salada e batata frita","preco":56,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"pasteis-pastel-bauru","cat":"pasteis","nome":"Pastel Bauru","desc":"Tomate, presunto e muçarela","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"pasteis-pastel-calabresa-mucarela","cat":"pasteis","nome":"Pastel Calabresa Muçarela","desc":"Calabresa fatiada com muçarela","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"pasteis-pastel-calabresa-requeijao","cat":"pasteis","nome":"Pastel Calabresa Requeijão","desc":"Calabresa fatiada com requeijão","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"pasteis-pastel-carne","cat":"pasteis","nome":"Pastel Carne","desc":"","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"pasteis-pastel-carne-com-mucarela","cat":"pasteis","nome":"Pastel Carne com Muçarela","desc":"Carne moída e muçarela","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"pasteis-pastel-carne-com-requeijao","cat":"pasteis","nome":"Pastel Carne com Requeijão","desc":"Carne moída e requeijão","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"pasteis-pastel-carne-seca-mucarela","cat":"pasteis","nome":"Pastel Carne Seca Muçarela","desc":"Carne seca desfiada e muçarela","preco":24,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"pasteis-pastel-carne-seca-requeijao","cat":"pasteis","nome":"Pastel Carne Seca Requeijão","desc":"Carne seca desfiada e requeijão","preco":24,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"pasteis-pastel-costela-c-mucarela","cat":"pasteis","nome":"Pastel Costela c/ Muçarela","desc":"Costela desfiada e muçarela","preco":24,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"pasteis-pastel-costela-c-requeijao","cat":"pasteis","nome":"Pastel Costela c/ Requeijão","desc":"Costela desfiada e requeijão","preco":24,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":10},{"id":"pasteis-pastel-frango-com-mucarela","cat":"pasteis","nome":"Pastel Frango com Muçarela","desc":"Frango desfiado com muçarela","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":11},{"id":"pasteis-pastel-frango-com-requeijao","cat":"pasteis","nome":"Pastel Frango com Requeijão","desc":"Frango desfiado e Requeijão","preco":19,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":12},{"id":"pasteis-pastel-milho-com-mucarela","cat":"pasteis","nome":"Pastel Milho com Muçarela","desc":"Milho e muçarela","preco":19,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":13},{"id":"pasteis-pastel-milho-requeijao","cat":"pasteis","nome":"Pastel Milho Requeijão","desc":"Milho e requeijão","preco":19,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":14},{"id":"pasteis-pastel-mucarela","cat":"pasteis","nome":"Pastel Muçarela","desc":"","preco":19,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":15},{"id":"pasteis-pastel-palmito-com-mucarela","cat":"pasteis","nome":"Pastel Palmito com Muçarela","desc":"Palmito picado com muçarela","preco":19,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":16},{"id":"pasteis-pastel-palmito-com-requeijao","cat":"pasteis","nome":"Pastel Palmito com Requeijão","desc":"Palmito picado e requeijão","preco":19,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":17},{"id":"pasteis-pastel-pizza","cat":"pasteis","nome":"Pastel Pizza","desc":"Tomate, orégano e muçarela","preco":19,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":18},{"id":"pasteis-pastel-portuguesa","cat":"pasteis","nome":"Pastel Portuguesa","desc":"Presunto, palmito, ervilha, ovo e muçarela","preco":24,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":19},{"id":"pasteisdoces-pastel-banana-com-chocolate-ao-leite","cat":"pasteisdoces","nome":"Pastel Banana com Chocolate ao Leite","desc":"","preco":24,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"pasteisdoces-pastel-chocolate-ao-leite","cat":"pasteisdoces","nome":"Pastel Chocolate ao Leite","desc":"","preco":24,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"beirutes-beirute-calabresa-suina","cat":"beirutes","nome":"Beirute Calabresa Suína","desc":"Pão sírio, maionese, alface, tomate, ovo, presunto, muçarela, requeijão, calabresa suína e batata frita","preco":52,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"beirutes-beirute-carne","cat":"beirutes","nome":"Beirute Carne","desc":"Pão sírio, maionese, tomate, ovo, presunto, musçarela, requeijão, carne desfiada e batata frita","preco":52,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"beirutes-beirute-costela","cat":"beirutes","nome":"Beirute Costela","desc":"Pão sírio, costela desfiada, maionese, alface, tomate, ovo, presunto, muçarela, requeijão e batata frita","preco":55,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"beirutes-beirute-de-peito-de-peru","cat":"beirutes","nome":"Beirute de Peito de Peru","desc":"Pão sírio, peito de peru, muçarela, ovo, requeijão, alface e tomate","preco":55,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"beirutes-beirute-frango","cat":"beirutes","nome":"Beirute Frango","desc":"Pão sírio, maionese, alface, tomate, ovo, presunto, muçarela, requeijão, frango desfiado e batata frita","preco":52,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"beirutes-beirute-palmito","cat":"beirutes","nome":"Beirute Palmito","desc":"Pão sírio, maionese, alface, tomate, ovo, presunto, muçarela, requeijão, palmito picado e batata frita","preco":52,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"beirutes-beirute-strogonoff-carne","cat":"beirutes","nome":"Beirute Strogonoff Carne","desc":"Pão sírio, maionese, alface, tomate, ovo, presunto, muçarela, requeijão, strogonoff carne e batata frita","preco":55,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"beirutes-beirute-strogonoff-frango","cat":"beirutes","nome":"Beirute Strogonoff Frango","desc":"Pão sírio, maionese, alface, tomate, ovo, presunto, muçarela, requeijão, strogonoff frango e batata frita","preco":55,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"beirutes-beirute-tradicional","cat":"beirutes","nome":"Beirute Tradicional","desc":"Pão sírio, maionese, alface, tomate, ovo, presunto, muçarela e batata frita","preco":47,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":9},{"id":"panquecas-panqueca-carne-com-mucarela","cat":"panquecas","nome":"Panqueca Carne com Muçarela","desc":"Carne moída e muçarela","preco":38,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"panquecas-panqueca-carne-com-requeijao","cat":"panquecas","nome":"Panqueca Carne com Requeijão","desc":"Carne moída com requeijão","preco":38,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"panquecas-panqueca-de-frango-com-requeijao","cat":"panquecas","nome":"Panqueca de Frango com Requeijão","desc":"Frango desfiado e requeijão","preco":38,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"panquecas-panqueca-frango-com-mucarela","cat":"panquecas","nome":"Panqueca Frango com Muçarela","desc":"Frango desfiado e muçarela","preco":38,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":4},{"id":"panquecas-panqueca-palmito-com-mucarela","cat":"panquecas","nome":"Panqueca Palmito com Muçarela","desc":"Palmito picado e muçarela","preco":38,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":5},{"id":"panquecas-panqueca-palmito-com-requeijao","cat":"panquecas","nome":"Panqueca Palmito com Requeijão","desc":"Palmito picado com requeijão","preco":38,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":6},{"id":"panquecas-panqueca-presunto-e-queijo","cat":"panquecas","nome":"Panqueca Presunto e Queijo","desc":"","preco":38,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":7},{"id":"panquecas-panqueca-quatro-queijos","cat":"panquecas","nome":"Panqueca Quatro Queijos","desc":"Muçarela, requeijão, parmesão e provolone","preco":43,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":8},{"id":"batata-recheada-frango-desfiado-milho-bacon-requeijao-e-cheddar","cat":"batata-recheada","nome":"Frango Desfiado, Milho, Bacon, Requeijão e Cheddar","desc":"","preco":31,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"batata-recheada-strogonoff-de-carne","cat":"batata-recheada","nome":"Strogonoff de Carne","desc":"Com batata palha","preco":31,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"batata-recheada-strogonoff-de-frango","cat":"batata-recheada","nome":"Strogonoff de Frango","desc":"Com batata palha","preco":31,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":3},{"id":"kibes-kibe-carne","cat":"kibes","nome":"Kibe Carne","desc":"","preco":15,"veg":false,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":1},{"id":"kibes-porcao-mini-kibe","cat":"kibes","nome":"Porção Mini Kibe","desc":"10 mini kibe","preco":45,"veg":true,"opcoes":[],"tipo":"simples","canal":"todos","ativo":true,"ordem":2},{"id":"rodizio-rodizio-reserva","cat":"rodizio","nome":"Rodízio (reserva)","desc":"Rodízio reservas","preco":59.9,"veg":true,"opcoes":[],"tipo":"simples","canal":"mesa","ativo":true,"ordem":1}];

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
  "nome": "Goiabada",
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
  "nome": "Condomínio Boa Esperança",
  "taxa": 15
 },
 {
  "nome": "Condomínio California",
  "taxa": 20
 },
 {
  "nome": "Condomínio Manacas",
  "taxa": 10
 },
 {
  "nome": "Condomínio Manhatan",
  "taxa": 10
 },
 {
  "nome": "Condomínio Residencial das Palmeiras",
  "taxa": 18
 },
 {
  "nome": "Condomínio San Marino",
  "taxa": 10
 },
 {
  "nome": "Condomínio São Luis",
  "taxa": 10
 },
 {
  "nome": "Jd. do Sol",
  "taxa": 12
 },
 {
  "nome": "Núcleo Ayres",
  "taxa": 12
 },
 {
  "nome": "Parque das Palmeiras",
  "taxa": 10
 },
 {
  "nome": "Parque R. Piscina",
  "taxa": 12
 },
 {
  "nome": "Prédio",
  "taxa": 10
 },
 {
  "nome": "Res. Martinelli",
  "taxa": 10
 },
 {
  "nome": "Residencia Campo Florido",
  "taxa": 10
 },
 {
  "nome": "Residencial Ipê Amarelo",
  "taxa": 10
 },
 {
  "nome": "Rua Antes das Casinha",
  "taxa": 10
 },
 {
  "nome": "Outros Bairros",
  "taxa": 8
 }
];

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
 },
 {
  "grupo": "Açaí",
  "nome": "Banana",
  "preco": 0
 },
 {
  "grupo": "Açaí",
  "nome": "Granola",
  "preco": 0
 },
 {
  "grupo": "Açaí",
  "nome": "Leite condensado",
  "preco": 0
 },
 {
  "grupo": "Açaí",
  "nome": "Leite em pó",
  "preco": 0
 },
 {
  "grupo": "Açaí",
  "nome": "Morango",
  "preco": 0
 },
 {
  "grupo": "Açaí",
  "nome": "Nutella",
  "preco": 8
 }
];
