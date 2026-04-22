export interface Exercise {
  id: string;
  level: "fácil" | "médio" | "difícil";
  title: string;
  prompt: string;
  answer: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: "ex1",
    level: "fácil",
    title: "Listar clientes de SP",
    prompt: "Liste o nome e e-mail de todos os clientes do estado 'SP'.",
    answer: "SELECT nome, email\nFROM clientes\nWHERE estado = 'SP';",
  },
  {
    id: "ex2",
    level: "fácil",
    title: "Produtos sem estoque",
    prompt: "Liste todos os produtos com estoque igual a zero.",
    answer: "SELECT *\nFROM produtos\nWHERE estoque = 0;",
  },
  {
    id: "ex3",
    level: "médio",
    title: "Total de pedidos por cliente",
    prompt:
      "Para cada cliente, mostre o nome e a quantidade total de pedidos. Ordene do maior para o menor.",
    answer:
      "SELECT c.nome, COUNT(p.id) AS total_pedidos\nFROM clientes c\nLEFT JOIN pedidos p ON p.id_cliente = c.id\nGROUP BY c.nome\nORDER BY total_pedidos DESC;",
  },
  {
    id: "ex4",
    level: "médio",
    title: "Receita por categoria",
    prompt:
      "Calcule a receita total (quantidade × preco_unitario) por categoria de produto.",
    answer:
      "SELECT cat.nome AS categoria, SUM(ip.quantidade * ip.preco_unitario) AS receita\nFROM itens_pedido ip\nJOIN produtos p ON p.id = ip.id_produto\nJOIN categorias cat ON cat.id = p.id_categoria\nGROUP BY cat.nome\nORDER BY receita DESC;",
  },
  {
    id: "ex5",
    level: "difícil",
    title: "Top 3 produtos mais vendidos",
    prompt:
      "Liste os 3 produtos com a maior soma de quantidade vendida em itens_pedido.",
    answer:
      "SELECT p.nome, SUM(ip.quantidade) AS total_vendido\nFROM itens_pedido ip\nJOIN produtos p ON p.id = ip.id_produto\nGROUP BY p.nome\nORDER BY total_vendido DESC\nLIMIT 3;",
  },
  {
    id: "ex6",
    level: "difícil",
    title: "Clientes sem pedidos",
    prompt: "Liste os nomes dos clientes que nunca fizeram um pedido.",
    answer:
      "SELECT c.nome\nFROM clientes c\nLEFT JOIN pedidos p ON p.id_cliente = c.id\nWHERE p.id IS NULL;",
  },
];
