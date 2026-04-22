export interface Exercise {
  id: string;
  level: "fácil" | "médio" | "difícil";
  title: string;
  prompt: string;
  answer: string;
}

// Schema e-commerce: clientes, categorias, produtos, pedidos, itens_pedido.
// 100 exercícios — 40 fácil, 40 médio, 20 difícil.
export const EXERCISES: Exercise[] = [
  // ============================================================
  // FÁCIL — 40 exercícios (SELECT, WHERE, ORDER BY, LIMIT, simples)
  // ============================================================
  {
    id: "f01",
    level: "fácil",
    title: "Listar todos os clientes",
    prompt: "Liste todas as colunas de todos os clientes.",
    answer: "SELECT *\nFROM clientes;",
  },
  {
    id: "f02",
    level: "fácil",
    title: "Nome e e-mail dos clientes",
    prompt: "Mostre apenas o nome e o e-mail de todos os clientes.",
    answer: "SELECT nome, email\nFROM clientes;",
  },
  {
    id: "f03",
    level: "fácil",
    title: "Clientes de SP",
    prompt: "Liste o nome e e-mail dos clientes do estado 'SP'.",
    answer: "SELECT nome, email\nFROM clientes\nWHERE estado = 'SP';",
  },
  {
    id: "f04",
    level: "fácil",
    title: "Clientes de São Paulo (cidade)",
    prompt: "Liste todos os clientes da cidade 'São Paulo'.",
    answer: "SELECT *\nFROM clientes\nWHERE cidade = 'São Paulo';",
  },
  {
    id: "f05",
    level: "fácil",
    title: "Clientes ordenados por nome",
    prompt: "Liste todos os clientes em ordem alfabética pelo nome.",
    answer: "SELECT *\nFROM clientes\nORDER BY nome ASC;",
  },
  {
    id: "f06",
    level: "fácil",
    title: "Produtos sem estoque",
    prompt: "Liste todos os produtos com estoque igual a zero.",
    answer: "SELECT *\nFROM produtos\nWHERE estoque = 0;",
  },
  {
    id: "f07",
    level: "fácil",
    title: "Produtos com estoque",
    prompt: "Liste todos os produtos com estoque maior que zero.",
    answer: "SELECT *\nFROM produtos\nWHERE estoque > 0;",
  },
  {
    id: "f08",
    level: "fácil",
    title: "Produtos acima de 100",
    prompt: "Liste produtos com preço maior que 100.",
    answer: "SELECT *\nFROM produtos\nWHERE preco > 100;",
  },
  {
    id: "f09",
    level: "fácil",
    title: "Produtos abaixo de 50",
    prompt: "Liste produtos com preço menor que 50.",
    answer: "SELECT *\nFROM produtos\nWHERE preco < 50;",
  },
  {
    id: "f10",
    level: "fácil",
    title: "Produtos entre 50 e 200",
    prompt: "Liste produtos com preço entre 50 e 200 (inclusive).",
    answer: "SELECT *\nFROM produtos\nWHERE preco BETWEEN 50 AND 200;",
  },
  {
    id: "f11",
    level: "fácil",
    title: "Top 10 produtos mais caros",
    prompt: "Mostre os 10 produtos mais caros.",
    answer: "SELECT *\nFROM produtos\nORDER BY preco DESC\nLIMIT 10;",
  },
  {
    id: "f12",
    level: "fácil",
    title: "Produto mais barato",
    prompt: "Mostre o produto de menor preço.",
    answer: "SELECT *\nFROM produtos\nORDER BY preco ASC\nLIMIT 1;",
  },
  {
    id: "f13",
    level: "fácil",
    title: "Categorias cadastradas",
    prompt: "Liste todas as categorias.",
    answer: "SELECT *\nFROM categorias\nORDER BY nome;",
  },
  {
    id: "f14",
    level: "fácil",
    title: "Pedidos pendentes",
    prompt: "Liste todos os pedidos com status 'pendente'.",
    answer: "SELECT *\nFROM pedidos\nWHERE status = 'pendente';",
  },
  {
    id: "f15",
    level: "fácil",
    title: "Pedidos pagos",
    prompt: "Liste todos os pedidos com status 'pago'.",
    answer: "SELECT *\nFROM pedidos\nWHERE status = 'pago';",
  },
  {
    id: "f16",
    level: "fácil",
    title: "Pedidos cancelados",
    prompt: "Liste pedidos com status 'cancelado'.",
    answer: "SELECT *\nFROM pedidos\nWHERE status = 'cancelado';",
  },
  {
    id: "f17",
    level: "fácil",
    title: "Pedidos acima de 500",
    prompt: "Liste pedidos com total maior que 500.",
    answer: "SELECT *\nFROM pedidos\nWHERE total > 500;",
  },
  {
    id: "f18",
    level: "fácil",
    title: "Clientes com Gmail",
    prompt: "Liste clientes cujo e-mail termina com '@gmail.com'.",
    answer: "SELECT nome, email\nFROM clientes\nWHERE email LIKE '%@gmail.com';",
  },
  {
    id: "f19",
    level: "fácil",
    title: "Clientes começando com A",
    prompt: "Liste clientes cujo nome começa com 'A'.",
    answer: "SELECT *\nFROM clientes\nWHERE nome LIKE 'A%';",
  },
  {
    id: "f20",
    level: "fácil",
    title: "Produtos com 'fone' no nome",
    prompt: "Liste produtos cujo nome contém 'fone'.",
    answer: "SELECT *\nFROM produtos\nWHERE nome LIKE '%fone%';",
  },
  {
    id: "f21",
    level: "fácil",
    title: "Estados únicos",
    prompt: "Liste todos os estados distintos onde há clientes.",
    answer: "SELECT DISTINCT estado\nFROM clientes\nORDER BY estado;",
  },
  {
    id: "f22",
    level: "fácil",
    title: "Cidades únicas",
    prompt: "Liste todas as cidades distintas dos clientes.",
    answer: "SELECT DISTINCT cidade\nFROM clientes\nORDER BY cidade;",
  },
  {
    id: "f23",
    level: "fácil",
    title: "Status distintos de pedido",
    prompt: "Mostre os valores distintos de status presentes em pedidos.",
    answer: "SELECT DISTINCT status\nFROM pedidos;",
  },
  {
    id: "f24",
    level: "fácil",
    title: "Total de clientes",
    prompt: "Mostre quantos clientes existem no banco.",
    answer: "SELECT COUNT(*) AS total_clientes\nFROM clientes;",
  },
  {
    id: "f25",
    level: "fácil",
    title: "Total de produtos",
    prompt: "Mostre quantos produtos existem.",
    answer: "SELECT COUNT(*) AS total_produtos\nFROM produtos;",
  },
  {
    id: "f26",
    level: "fácil",
    title: "Total de pedidos",
    prompt: "Mostre quantos pedidos existem.",
    answer: "SELECT COUNT(*) AS total_pedidos\nFROM pedidos;",
  },
  {
    id: "f27",
    level: "fácil",
    title: "Pedidos a partir de 2024",
    prompt: "Liste pedidos feitos em ou após 01/01/2024.",
    answer: "SELECT *\nFROM pedidos\nWHERE data_pedido >= '2024-01-01';",
  },
  {
    id: "f28",
    level: "fácil",
    title: "Pedidos de janeiro de 2024",
    prompt: "Liste pedidos feitos no mês de janeiro de 2024.",
    answer:
      "SELECT *\nFROM pedidos\nWHERE data_pedido >= '2024-01-01'\n  AND data_pedido <  '2024-02-01';",
  },
  {
    id: "f29",
    level: "fácil",
    title: "Clientes cadastrados em 2024",
    prompt: "Liste clientes com data_cadastro em 2024.",
    answer:
      "SELECT *\nFROM clientes\nWHERE data_cadastro >= '2024-01-01'\n  AND data_cadastro <  '2025-01-01';",
  },
  {
    id: "f30",
    level: "fácil",
    title: "Clientes de SP ou RJ",
    prompt: "Liste clientes do estado 'SP' ou 'RJ'.",
    answer: "SELECT *\nFROM clientes\nWHERE estado IN ('SP', 'RJ');",
  },
  {
    id: "f31",
    level: "fácil",
    title: "Clientes fora de SP",
    prompt: "Liste clientes que NÃO são do estado 'SP'.",
    answer: "SELECT *\nFROM clientes\nWHERE estado <> 'SP';",
  },
  {
    id: "f32",
    level: "fácil",
    title: "Clientes sem cidade",
    prompt: "Liste clientes que não possuem cidade cadastrada.",
    answer: "SELECT *\nFROM clientes\nWHERE cidade IS NULL;",
  },
  {
    id: "f33",
    level: "fácil",
    title: "Clientes com cidade preenchida",
    prompt: "Liste clientes que possuem cidade cadastrada.",
    answer: "SELECT *\nFROM clientes\nWHERE cidade IS NOT NULL;",
  },
  {
    id: "f34",
    level: "fácil",
    title: "Produtos por preço (desc)",
    prompt: "Liste produtos ordenados do mais caro ao mais barato.",
    answer: "SELECT nome, preco\nFROM produtos\nORDER BY preco DESC;",
  },
  {
    id: "f35",
    level: "fácil",
    title: "Renomear coluna com alias",
    prompt: "Liste o nome do produto como 'produto' e o preço como 'valor'.",
    answer: "SELECT nome AS produto, preco AS valor\nFROM produtos;",
  },
  {
    id: "f36",
    level: "fácil",
    title: "Pedidos do cliente 1",
    prompt: "Liste todos os pedidos do cliente de id = 1.",
    answer: "SELECT *\nFROM pedidos\nWHERE id_cliente = 1;",
  },
  {
    id: "f37",
    level: "fácil",
    title: "Itens do pedido 10",
    prompt: "Liste todos os itens do pedido de id = 10.",
    answer: "SELECT *\nFROM itens_pedido\nWHERE id_pedido = 10;",
  },
  {
    id: "f38",
    level: "fácil",
    title: "Produtos da categoria 2",
    prompt: "Liste produtos da categoria de id = 2.",
    answer: "SELECT *\nFROM produtos\nWHERE id_categoria = 2;",
  },
  {
    id: "f39",
    level: "fácil",
    title: "Top 5 pedidos mais caros",
    prompt: "Liste os 5 pedidos com maior total.",
    answer: "SELECT *\nFROM pedidos\nORDER BY total DESC\nLIMIT 5;",
  },
  {
    id: "f40",
    level: "fácil",
    title: "Pedidos mais recentes",
    prompt: "Liste os 10 pedidos mais recentes pela data_pedido.",
    answer: "SELECT *\nFROM pedidos\nORDER BY data_pedido DESC\nLIMIT 10;",
  },

  // ============================================================
  // MÉDIO — 40 exercícios (JOIN, GROUP BY, agregações, HAVING)
  // ============================================================
  {
    id: "m01",
    level: "médio",
    title: "Total de pedidos por cliente",
    prompt:
      "Para cada cliente, mostre o nome e a quantidade total de pedidos. Ordene do maior para o menor.",
    answer:
      "SELECT c.nome, COUNT(p.id) AS total_pedidos\nFROM clientes c\nLEFT JOIN pedidos p ON p.id_cliente = c.id\nGROUP BY c.nome\nORDER BY total_pedidos DESC;",
  },
  {
    id: "m02",
    level: "médio",
    title: "Receita por categoria",
    prompt:
      "Calcule a receita total (quantidade × preco_unitario) por categoria de produto.",
    answer:
      "SELECT cat.nome AS categoria, SUM(ip.quantidade * ip.preco_unitario) AS receita\nFROM itens_pedido ip\nJOIN produtos p   ON p.id = ip.id_produto\nJOIN categorias cat ON cat.id = p.id_categoria\nGROUP BY cat.nome\nORDER BY receita DESC;",
  },
  {
    id: "m03",
    level: "médio",
    title: "Pedidos com nome do cliente",
    prompt: "Liste id do pedido, data, total e nome do cliente.",
    answer:
      "SELECT p.id, p.data_pedido, p.total, c.nome\nFROM pedidos p\nJOIN clientes c ON c.id = p.id_cliente\nORDER BY p.data_pedido DESC;",
  },
  {
    id: "m04",
    level: "médio",
    title: "Produtos com nome da categoria",
    prompt: "Liste o nome do produto, preço e nome da categoria.",
    answer:
      "SELECT p.nome AS produto, p.preco, c.nome AS categoria\nFROM produtos p\nJOIN categorias c ON c.id = p.id_categoria;",
  },
  {
    id: "m05",
    level: "médio",
    title: "Itens com nome do produto",
    prompt: "Liste os itens de pedido com nome do produto, quantidade e preço unitário.",
    answer:
      "SELECT ip.id_pedido, p.nome AS produto, ip.quantidade, ip.preco_unitario\nFROM itens_pedido ip\nJOIN produtos p ON p.id = ip.id_produto;",
  },
  {
    id: "m06",
    level: "médio",
    title: "Quantidade de produtos por categoria",
    prompt: "Mostre o nome da categoria e quantos produtos cada uma tem.",
    answer:
      "SELECT c.nome AS categoria, COUNT(p.id) AS qtd_produtos\nFROM categorias c\nLEFT JOIN produtos p ON p.id_categoria = c.id\nGROUP BY c.nome\nORDER BY qtd_produtos DESC;",
  },
  {
    id: "m07",
    level: "médio",
    title: "Valor médio do pedido",
    prompt: "Calcule o valor médio (média de total) dos pedidos.",
    answer: "SELECT AVG(total) AS ticket_medio\nFROM pedidos;",
  },
  {
    id: "m08",
    level: "médio",
    title: "Receita total da loja",
    prompt: "Calcule a receita total somando o total de todos os pedidos.",
    answer: "SELECT SUM(total) AS receita_total\nFROM pedidos;",
  },
  {
    id: "m09",
    level: "médio",
    title: "Maior e menor pedido",
    prompt: "Mostre o maior e o menor valor de total entre os pedidos.",
    answer:
      "SELECT MAX(total) AS maior_pedido, MIN(total) AS menor_pedido\nFROM pedidos;",
  },
  {
    id: "m10",
    level: "médio",
    title: "Pedidos por status",
    prompt: "Mostre quantos pedidos existem em cada status.",
    answer:
      "SELECT status, COUNT(*) AS qtd\nFROM pedidos\nGROUP BY status\nORDER BY qtd DESC;",
  },
  {
    id: "m11",
    level: "médio",
    title: "Receita por status",
    prompt: "Some o total dos pedidos agrupando por status.",
    answer:
      "SELECT status, SUM(total) AS receita\nFROM pedidos\nGROUP BY status\nORDER BY receita DESC;",
  },
  {
    id: "m12",
    level: "médio",
    title: "Clientes por estado",
    prompt: "Conte quantos clientes existem em cada estado.",
    answer:
      "SELECT estado, COUNT(*) AS qtd\nFROM clientes\nGROUP BY estado\nORDER BY qtd DESC;",
  },
  {
    id: "m13",
    level: "médio",
    title: "Clientes por cidade",
    prompt: "Conte quantos clientes existem em cada cidade.",
    answer:
      "SELECT cidade, COUNT(*) AS qtd\nFROM clientes\nGROUP BY cidade\nORDER BY qtd DESC;",
  },
  {
    id: "m14",
    level: "médio",
    title: "Estados com mais de 10 clientes",
    prompt: "Mostre estados que têm mais de 10 clientes.",
    answer:
      "SELECT estado, COUNT(*) AS qtd\nFROM clientes\nGROUP BY estado\nHAVING COUNT(*) > 10\nORDER BY qtd DESC;",
  },
  {
    id: "m15",
    level: "médio",
    title: "Categorias com mais de 5 produtos",
    prompt: "Mostre categorias que têm mais de 5 produtos.",
    answer:
      "SELECT c.nome AS categoria, COUNT(p.id) AS qtd\nFROM categorias c\nJOIN produtos p ON p.id_categoria = c.id\nGROUP BY c.nome\nHAVING COUNT(p.id) > 5;",
  },
  {
    id: "m16",
    level: "médio",
    title: "Receita por cliente",
    prompt: "Some o total de pedidos por cliente, ordenando da maior para menor.",
    answer:
      "SELECT c.nome, SUM(p.total) AS receita\nFROM clientes c\nJOIN pedidos p ON p.id_cliente = c.id\nGROUP BY c.nome\nORDER BY receita DESC;",
  },
  {
    id: "m17",
    level: "médio",
    title: "Ticket médio por cliente",
    prompt: "Calcule o valor médio do total dos pedidos de cada cliente.",
    answer:
      "SELECT c.nome, AVG(p.total) AS ticket_medio\nFROM clientes c\nJOIN pedidos p ON p.id_cliente = c.id\nGROUP BY c.nome\nORDER BY ticket_medio DESC;",
  },
  {
    id: "m18",
    level: "médio",
    title: "Quantidade vendida por produto",
    prompt: "Para cada produto, some a quantidade vendida em itens_pedido.",
    answer:
      "SELECT p.nome, SUM(ip.quantidade) AS total_vendido\nFROM produtos p\nLEFT JOIN itens_pedido ip ON ip.id_produto = p.id\nGROUP BY p.nome\nORDER BY total_vendido DESC;",
  },
  {
    id: "m19",
    level: "médio",
    title: "Receita por produto",
    prompt:
      "Calcule a receita total (quantidade × preco_unitario) de cada produto.",
    answer:
      "SELECT p.nome, SUM(ip.quantidade * ip.preco_unitario) AS receita\nFROM produtos p\nJOIN itens_pedido ip ON ip.id_produto = p.id\nGROUP BY p.nome\nORDER BY receita DESC;",
  },
  {
    id: "m20",
    level: "médio",
    title: "Pedidos com mais de 3 itens",
    prompt: "Liste o id dos pedidos que têm mais de 3 itens.",
    answer:
      "SELECT id_pedido, COUNT(*) AS qtd_itens\nFROM itens_pedido\nGROUP BY id_pedido\nHAVING COUNT(*) > 3;",
  },
  {
    id: "m21",
    level: "médio",
    title: "Pedidos por mês",
    prompt: "Conte quantos pedidos existem em cada mês.",
    answer:
      "SELECT DATE_FORMAT(data_pedido, '%Y-%m') AS mes, COUNT(*) AS qtd\nFROM pedidos\nGROUP BY mes\nORDER BY mes;",
  },
  {
    id: "m22",
    level: "médio",
    title: "Receita por mês",
    prompt: "Some o total de pedidos agrupando por mês.",
    answer:
      "SELECT DATE_FORMAT(data_pedido, '%Y-%m') AS mes, SUM(total) AS receita\nFROM pedidos\nGROUP BY mes\nORDER BY mes;",
  },
  {
    id: "m23",
    level: "médio",
    title: "Pedidos por ano",
    prompt: "Conte quantos pedidos existem em cada ano.",
    answer:
      "SELECT YEAR(data_pedido) AS ano, COUNT(*) AS qtd\nFROM pedidos\nGROUP BY ano\nORDER BY ano;",
  },
  {
    id: "m24",
    level: "médio",
    title: "Clientes cadastrados por mês",
    prompt: "Conte quantos clientes se cadastraram em cada mês.",
    answer:
      "SELECT DATE_FORMAT(data_cadastro, '%Y-%m') AS mes, COUNT(*) AS qtd\nFROM clientes\nGROUP BY mes\nORDER BY mes;",
  },
  {
    id: "m25",
    level: "médio",
    title: "Pedidos do cliente 'Maria'",
    prompt: "Liste pedidos cujo nome do cliente seja 'Maria'.",
    answer:
      "SELECT p.*\nFROM pedidos p\nJOIN clientes c ON c.id = p.id_cliente\nWHERE c.nome = 'Maria';",
  },
  {
    id: "m26",
    level: "médio",
    title: "Pedidos pagos com nome do cliente",
    prompt: "Liste pedidos com status 'pago' incluindo o nome do cliente.",
    answer:
      "SELECT p.id, p.total, c.nome\nFROM pedidos p\nJOIN clientes c ON c.id = p.id_cliente\nWHERE p.status = 'pago';",
  },
  {
    id: "m27",
    level: "médio",
    title: "Receita de pedidos pagos por estado",
    prompt: "Some o total dos pedidos pagos agrupando por estado do cliente.",
    answer:
      "SELECT c.estado, SUM(p.total) AS receita\nFROM pedidos p\nJOIN clientes c ON c.id = p.id_cliente\nWHERE p.status = 'pago'\nGROUP BY c.estado\nORDER BY receita DESC;",
  },
  {
    id: "m28",
    level: "médio",
    title: "Top 5 categorias por receita",
    prompt: "Mostre as 5 categorias com maior receita total.",
    answer:
      "SELECT cat.nome, SUM(ip.quantidade * ip.preco_unitario) AS receita\nFROM itens_pedido ip\nJOIN produtos p ON p.id = ip.id_produto\nJOIN categorias cat ON cat.id = p.id_categoria\nGROUP BY cat.nome\nORDER BY receita DESC\nLIMIT 5;",
  },
  {
    id: "m29",
    level: "médio",
    title: "Top 10 clientes por receita",
    prompt: "Liste os 10 clientes que mais gastaram.",
    answer:
      "SELECT c.nome, SUM(p.total) AS gasto\nFROM clientes c\nJOIN pedidos p ON p.id_cliente = c.id\nGROUP BY c.nome\nORDER BY gasto DESC\nLIMIT 10;",
  },
  {
    id: "m30",
    level: "médio",
    title: "Produtos nunca vendidos",
    prompt: "Liste produtos que nunca apareceram em itens_pedido.",
    answer:
      "SELECT p.*\nFROM produtos p\nLEFT JOIN itens_pedido ip ON ip.id_produto = p.id\nWHERE ip.id IS NULL;",
  },
  {
    id: "m31",
    level: "médio",
    title: "Pedidos sem itens",
    prompt: "Liste pedidos que não possuem nenhum item registrado.",
    answer:
      "SELECT p.*\nFROM pedidos p\nLEFT JOIN itens_pedido ip ON ip.id_pedido = p.id\nWHERE ip.id IS NULL;",
  },
  {
    id: "m32",
    level: "médio",
    title: "Quantidade média por item",
    prompt: "Calcule a quantidade média vendida por linha de itens_pedido.",
    answer: "SELECT AVG(quantidade) AS media\nFROM itens_pedido;",
  },
  {
    id: "m33",
    level: "médio",
    title: "Preço médio por categoria",
    prompt: "Calcule o preço médio dos produtos por categoria.",
    answer:
      "SELECT c.nome, AVG(p.preco) AS preco_medio\nFROM categorias c\nJOIN produtos p ON p.id_categoria = c.id\nGROUP BY c.nome\nORDER BY preco_medio DESC;",
  },
  {
    id: "m34",
    level: "médio",
    title: "Estoque total por categoria",
    prompt: "Some o estoque dos produtos por categoria.",
    answer:
      "SELECT c.nome, SUM(p.estoque) AS estoque_total\nFROM categorias c\nJOIN produtos p ON p.id_categoria = c.id\nGROUP BY c.nome\nORDER BY estoque_total DESC;",
  },
  {
    id: "m35",
    level: "médio",
    title: "Pedidos do dia",
    prompt: "Liste pedidos feitos hoje.",
    answer: "SELECT *\nFROM pedidos\nWHERE DATE(data_pedido) = CURRENT_DATE;",
  },
  {
    id: "m36",
    level: "médio",
    title: "Pedidos dos últimos 30 dias",
    prompt: "Liste pedidos feitos nos últimos 30 dias.",
    answer:
      "SELECT *\nFROM pedidos\nWHERE data_pedido >= CURRENT_DATE - INTERVAL 30 DAY;",
  },
  {
    id: "m37",
    level: "médio",
    title: "Receita por dia da semana",
    prompt: "Some o total dos pedidos agrupando por dia da semana.",
    answer:
      "SELECT DAYNAME(data_pedido) AS dia, SUM(total) AS receita\nFROM pedidos\nGROUP BY dia\nORDER BY receita DESC;",
  },
  {
    id: "m38",
    level: "médio",
    title: "Quantidade de itens por pedido",
    prompt: "Mostre id do pedido e a soma de quantidades de itens.",
    answer:
      "SELECT id_pedido, SUM(quantidade) AS total_itens\nFROM itens_pedido\nGROUP BY id_pedido\nORDER BY total_itens DESC;",
  },
  {
    id: "m39",
    level: "médio",
    title: "Pedidos com total acima da média",
    prompt: "Liste pedidos cujo total seja maior que a média geral.",
    answer:
      "SELECT *\nFROM pedidos\nWHERE total > (SELECT AVG(total) FROM pedidos);",
  },
  {
    id: "m40",
    level: "médio",
    title: "Categorias sem produtos",
    prompt: "Liste categorias que não possuem nenhum produto associado.",
    answer:
      "SELECT c.*\nFROM categorias c\nLEFT JOIN produtos p ON p.id_categoria = c.id\nWHERE p.id IS NULL;",
  },

  // ============================================================
  // DIFÍCIL — 20 exercícios (subqueries, CTE, window functions, lógica avançada)
  // ============================================================
  {
    id: "d01",
    level: "difícil",
    title: "Top 3 produtos mais vendidos",
    prompt:
      "Liste os 3 produtos com a maior soma de quantidade vendida em itens_pedido.",
    answer:
      "SELECT p.nome, SUM(ip.quantidade) AS total_vendido\nFROM itens_pedido ip\nJOIN produtos p ON p.id = ip.id_produto\nGROUP BY p.nome\nORDER BY total_vendido DESC\nLIMIT 3;",
  },
  {
    id: "d02",
    level: "difícil",
    title: "Clientes sem pedidos",
    prompt: "Liste os nomes dos clientes que nunca fizeram um pedido.",
    answer:
      "SELECT c.nome\nFROM clientes c\nLEFT JOIN pedidos p ON p.id_cliente = c.id\nWHERE p.id IS NULL;",
  },
  {
    id: "d03",
    level: "difícil",
    title: "Segundo produto mais caro",
    prompt: "Encontre o segundo produto mais caro (sem usar LIMIT 1 OFFSET 1).",
    answer:
      "SELECT *\nFROM produtos\nWHERE preco = (\n  SELECT MAX(preco) FROM produtos\n  WHERE preco < (SELECT MAX(preco) FROM produtos)\n);",
  },
  {
    id: "d04",
    level: "difícil",
    title: "Ranking de clientes por receita",
    prompt:
      "Crie um ranking de clientes por receita usando window function (RANK).",
    answer:
      "SELECT c.nome,\n       SUM(p.total) AS receita,\n       RANK() OVER (ORDER BY SUM(p.total) DESC) AS posicao\nFROM clientes c\nJOIN pedidos p ON p.id_cliente = c.id\nGROUP BY c.nome;",
  },
  {
    id: "d05",
    level: "difícil",
    title: "Top 1 produto por categoria",
    prompt:
      "Para cada categoria, encontre o produto mais vendido (maior soma de quantidade).",
    answer:
      "WITH vendas AS (\n  SELECT p.id_categoria, p.nome AS produto, SUM(ip.quantidade) AS qtd,\n         ROW_NUMBER() OVER (PARTITION BY p.id_categoria ORDER BY SUM(ip.quantidade) DESC) AS rn\n  FROM produtos p\n  JOIN itens_pedido ip ON ip.id_produto = p.id\n  GROUP BY p.id_categoria, p.nome\n)\nSELECT c.nome AS categoria, v.produto, v.qtd\nFROM vendas v\nJOIN categorias c ON c.id = v.id_categoria\nWHERE v.rn = 1;",
  },
  {
    id: "d06",
    level: "difícil",
    title: "Receita acumulada por mês",
    prompt:
      "Mostre a receita por mês e a receita acumulada (running total) ao longo dos meses.",
    answer:
      "SELECT DATE_FORMAT(data_pedido, '%Y-%m') AS mes,\n       SUM(total) AS receita_mes,\n       SUM(SUM(total)) OVER (ORDER BY DATE_FORMAT(data_pedido, '%Y-%m')) AS acumulado\nFROM pedidos\nGROUP BY mes\nORDER BY mes;",
  },
  {
    id: "d07",
    level: "difícil",
    title: "Variação mensal de receita (LAG)",
    prompt:
      "Mostre a receita do mês e a variação em relação ao mês anterior usando LAG.",
    answer:
      "WITH r AS (\n  SELECT DATE_FORMAT(data_pedido, '%Y-%m') AS mes, SUM(total) AS receita\n  FROM pedidos\n  GROUP BY mes\n)\nSELECT mes, receita,\n       receita - LAG(receita) OVER (ORDER BY mes) AS variacao\nFROM r\nORDER BY mes;",
  },
  {
    id: "d08",
    level: "difícil",
    title: "Clientes com mais de 5 pedidos pagos",
    prompt:
      "Liste clientes que tenham 5 ou mais pedidos com status 'pago'.",
    answer:
      "SELECT c.nome, COUNT(*) AS pedidos_pagos\nFROM clientes c\nJOIN pedidos p ON p.id_cliente = c.id\nWHERE p.status = 'pago'\nGROUP BY c.nome\nHAVING COUNT(*) >= 5;",
  },
  {
    id: "d09",
    level: "difícil",
    title: "% de receita por categoria",
    prompt:
      "Para cada categoria, mostre a receita e o percentual em relação à receita total.",
    answer:
      "WITH rec AS (\n  SELECT cat.nome AS categoria, SUM(ip.quantidade * ip.preco_unitario) AS receita\n  FROM itens_pedido ip\n  JOIN produtos p ON p.id = ip.id_produto\n  JOIN categorias cat ON cat.id = p.id_categoria\n  GROUP BY cat.nome\n)\nSELECT categoria,\n       receita,\n       ROUND(100 * receita / SUM(receita) OVER (), 2) AS pct\nFROM rec\nORDER BY receita DESC;",
  },
  {
    id: "d10",
    level: "difícil",
    title: "Clientes que compraram em todas as categorias",
    prompt:
      "Liste clientes que já compraram pelo menos um produto de cada categoria existente.",
    answer:
      "SELECT c.nome\nFROM clientes c\nJOIN pedidos p       ON p.id_cliente = c.id\nJOIN itens_pedido ip ON ip.id_pedido = p.id\nJOIN produtos pr     ON pr.id = ip.id_produto\nGROUP BY c.id, c.nome\nHAVING COUNT(DISTINCT pr.id_categoria) = (SELECT COUNT(*) FROM categorias);",
  },
  {
    id: "d11",
    level: "difícil",
    title: "Primeiro pedido de cada cliente",
    prompt: "Para cada cliente, mostre o primeiro pedido feito (data mais antiga).",
    answer:
      "SELECT c.nome, p.id, p.data_pedido, p.total\nFROM clientes c\nJOIN pedidos p ON p.id_cliente = c.id\nWHERE p.data_pedido = (\n  SELECT MIN(p2.data_pedido) FROM pedidos p2 WHERE p2.id_cliente = c.id\n);",
  },
  {
    id: "d12",
    level: "difícil",
    title: "Último pedido de cada cliente",
    prompt: "Para cada cliente, mostre o pedido mais recente.",
    answer:
      "SELECT c.nome, p.id, p.data_pedido, p.total\nFROM clientes c\nJOIN pedidos p ON p.id_cliente = c.id\nWHERE p.data_pedido = (\n  SELECT MAX(p2.data_pedido) FROM pedidos p2 WHERE p2.id_cliente = c.id\n);",
  },
  {
    id: "d13",
    level: "difícil",
    title: "Produtos acima do preço médio da categoria",
    prompt:
      "Liste produtos cujo preço seja maior que o preço médio da própria categoria.",
    answer:
      "SELECT p.*\nFROM produtos p\nWHERE p.preco > (\n  SELECT AVG(p2.preco)\n  FROM produtos p2\n  WHERE p2.id_categoria = p.id_categoria\n);",
  },
  {
    id: "d14",
    level: "difícil",
    title: "Coorte de clientes por mês de cadastro",
    prompt:
      "Para cada mês de cadastro, mostre quantos clientes se cadastraram e quantos deles já fizeram ao menos um pedido.",
    answer:
      "SELECT DATE_FORMAT(c.data_cadastro, '%Y-%m') AS coorte,\n       COUNT(DISTINCT c.id) AS clientes,\n       COUNT(DISTINCT p.id_cliente) AS com_pedido\nFROM clientes c\nLEFT JOIN pedidos p ON p.id_cliente = c.id\nGROUP BY coorte\nORDER BY coorte;",
  },
  {
    id: "d15",
    level: "difícil",
    title: "Top 3 produtos por categoria",
    prompt:
      "Para cada categoria, liste os 3 produtos mais vendidos (por quantidade).",
    answer:
      "WITH ranked AS (\n  SELECT p.id_categoria, p.nome AS produto, SUM(ip.quantidade) AS qtd,\n         ROW_NUMBER() OVER (PARTITION BY p.id_categoria ORDER BY SUM(ip.quantidade) DESC) AS rn\n  FROM produtos p\n  JOIN itens_pedido ip ON ip.id_produto = p.id\n  GROUP BY p.id_categoria, p.nome\n)\nSELECT c.nome AS categoria, r.produto, r.qtd\nFROM ranked r\nJOIN categorias c ON c.id = r.id_categoria\nWHERE r.rn <= 3\nORDER BY categoria, r.qtd DESC;",
  },
  {
    id: "d16",
    level: "difícil",
    title: "Receita do mês x mesmo mês ano anterior",
    prompt:
      "Compare a receita de cada mês com a do mesmo mês do ano anterior usando LAG de 12 meses.",
    answer:
      "WITH r AS (\n  SELECT DATE_FORMAT(data_pedido, '%Y-%m') AS mes, SUM(total) AS receita\n  FROM pedidos\n  GROUP BY mes\n)\nSELECT mes, receita,\n       LAG(receita, 12) OVER (ORDER BY mes) AS receita_ano_anterior,\n       receita - LAG(receita, 12) OVER (ORDER BY mes) AS variacao\nFROM r\nORDER BY mes;",
  },
  {
    id: "d17",
    level: "difícil",
    title: "Clientes que só compraram uma categoria",
    prompt:
      "Liste clientes que compraram produtos de apenas uma categoria distinta.",
    answer:
      "SELECT c.nome\nFROM clientes c\nJOIN pedidos p       ON p.id_cliente = c.id\nJOIN itens_pedido ip ON ip.id_pedido = p.id\nJOIN produtos pr     ON pr.id = ip.id_produto\nGROUP BY c.id, c.nome\nHAVING COUNT(DISTINCT pr.id_categoria) = 1;",
  },
  {
    id: "d18",
    level: "difícil",
    title: "Pedidos com total divergente da soma dos itens",
    prompt:
      "Liste pedidos cujo total registrado seja diferente da soma de quantidade × preco_unitario dos seus itens.",
    answer:
      "SELECT p.id, p.total,\n       SUM(ip.quantidade * ip.preco_unitario) AS total_calculado\nFROM pedidos p\nJOIN itens_pedido ip ON ip.id_pedido = p.id\nGROUP BY p.id, p.total\nHAVING p.total <> SUM(ip.quantidade * ip.preco_unitario);",
  },
  {
    id: "d19",
    level: "difícil",
    title: "Recompra: clientes com 2+ pedidos",
    prompt:
      "Liste clientes que fizeram pelo menos 2 pedidos e o intervalo médio em dias entre eles.",
    answer:
      "WITH dif AS (\n  SELECT id_cliente, data_pedido,\n         DATEDIFF(data_pedido, LAG(data_pedido) OVER (PARTITION BY id_cliente ORDER BY data_pedido)) AS dias\n  FROM pedidos\n)\nSELECT c.nome, AVG(dif.dias) AS intervalo_medio_dias\nFROM dif\nJOIN clientes c ON c.id = dif.id_cliente\nWHERE dif.dias IS NOT NULL\nGROUP BY c.nome\nHAVING COUNT(*) >= 1;",
  },
  {
    id: "d20",
    level: "difícil",
    title: "Top 10% clientes por receita",
    prompt:
      "Liste os clientes que estão no top 10% por receita total usando NTILE.",
    answer:
      "WITH r AS (\n  SELECT c.id, c.nome, SUM(p.total) AS receita,\n         NTILE(10) OVER (ORDER BY SUM(p.total) DESC) AS decil\n  FROM clientes c\n  JOIN pedidos p ON p.id_cliente = c.id\n  GROUP BY c.id, c.nome\n)\nSELECT nome, receita\nFROM r\nWHERE decil = 1\nORDER BY receita DESC;",
  },
];
