export type SqlCategory =
  | "DDL"
  | "DML"
  | "SELECT"
  | "JOIN"
  | "Agregação"
  | "Subqueries";

export interface SqlCommand {
  id: string;
  name: string;
  category: SqlCategory;
  syntax: string;
  description: string;
  example: string;
}

export const CATEGORIES: SqlCategory[] = [
  "DDL",
  "DML",
  "SELECT",
  "JOIN",
  "Agregação",
  "Subqueries",
];

export const SCHEMA_DESCRIPTION = `-- Banco de dados de e-commerce
clientes(id, nome, email, cidade, estado, data_cadastro)
categorias(id, nome)
produtos(id, nome, preco, estoque, id_categoria)
pedidos(id, id_cliente, data_pedido, status, total)
itens_pedido(id, id_pedido, id_produto, quantidade, preco_unitario)`;

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Row = [name: string, description: string, example: string];

const build = (category: SqlCategory, rows: Row[]): SqlCommand[] =>
  rows.map(([name, description, example]) => ({
    id: `${slug(category)}-${slug(name)}`,
    name,
    category,
    description,
    example,
    syntax: example.split("\n")[0],
  }));

export const SQL_COMMANDS: SqlCommand[] = [
  ...build("DDL", [
    ["CREATE DATABASE", "Criar um novo banco de dados", "CREATE DATABASE ecommerce;"],
    ["USE", "Selecionar o banco a ser utilizado", "USE ecommerce;"],
    [
      "CREATE TABLE",
      "Criar uma nova tabela",
      `CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  cidade VARCHAR(80),
  estado CHAR(2),
  data_cadastro DATE DEFAULT (CURRENT_DATE)
);`,
    ],
    [
      "CREATE TABLE (FK)",
      "Criar tabela com chave estrangeira",
      `CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT NOT NULL,
  data_pedido DATETIME DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pendente',
  total DECIMAL(10,2),
  FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);`,
    ],
    ["ALTER TABLE ADD", "Adicionar nova coluna", "ALTER TABLE clientes ADD telefone VARCHAR(20);"],
    [
      "ALTER TABLE DROP COLUMN",
      "Remover uma coluna existente",
      "ALTER TABLE clientes DROP COLUMN telefone;",
    ],
    [
      "ALTER TABLE MODIFY",
      "Alterar o tipo de uma coluna",
      "ALTER TABLE produtos MODIFY preco DECIMAL(12,2);",
    ],
    ["DROP TABLE", "Excluir uma tabela permanentemente", "DROP TABLE clientes_sp;"],
    [
      "TRUNCATE TABLE",
      "Limpar todos os dados, mantém a estrutura",
      "TRUNCATE TABLE itens_pedido;",
    ],
  ]),
  ...build("DML", [
    ["SELECT *", "Selecionar todas as colunas", "SELECT * FROM clientes;"],
    [
      "SELECT colunas",
      "Selecionar colunas específicas",
      "SELECT nome, email, cidade FROM clientes;",
    ],
    [
      "INSERT INTO VALUES",
      "Inserir um novo registro",
      `INSERT INTO clientes (nome, email, cidade, estado)
VALUES ('Ana Lima', 'ana@email.com', 'São Paulo', 'SP');`,
    ],
    [
      "UPDATE SET",
      "Atualizar dados de registros",
      `UPDATE produtos
SET preco = preco * 1.10
WHERE id_categoria = 1;`,
    ],
    [
      "DELETE FROM",
      "Deletar registros",
      `DELETE FROM pedidos
WHERE status = 'cancelado';`,
    ],
  ]),
  ...build("SELECT", [
    ["WHERE", "Filtrar registros por condição", "SELECT * FROM clientes WHERE estado = 'SP';"],
    [
      "AND / OR",
      "Combinar múltiplas condições",
      `SELECT * FROM pedidos
WHERE status = 'pendente' AND total > 100;`,
    ],
    [
      "IN",
      "Verificar se valor está numa lista",
      "SELECT * FROM clientes WHERE estado IN ('SP', 'RJ', 'MG');",
    ],
    [
      "BETWEEN",
      "Verificar se valor está num intervalo",
      "SELECT * FROM pedidos WHERE total BETWEEN 100 AND 500;",
    ],
    ["LIKE", "Busca por padrão de texto", "SELECT * FROM clientes WHERE nome LIKE 'Ana%';"],
    [
      "IS NULL / IS NOT NULL",
      "Verificar valores nulos",
      "SELECT * FROM clientes WHERE email IS NOT NULL;",
    ],
    ["ORDER BY", "Ordenar resultados", "SELECT * FROM produtos ORDER BY preco DESC;"],
    [
      "LIMIT / OFFSET",
      "Limitar quantidade de resultados",
      "SELECT * FROM produtos ORDER BY preco LIMIT 10 OFFSET 20;",
    ],
    [
      "GROUP BY",
      "Agrupar resultados",
      "SELECT estado, COUNT(*) FROM clientes GROUP BY estado;",
    ],
    [
      "HAVING",
      "Filtrar grupos",
      `SELECT estado, COUNT(*) FROM clientes
GROUP BY estado
HAVING COUNT(*) > 10;`,
    ],
    ["DISTINCT", "Eliminar duplicatas", "SELECT DISTINCT estado FROM clientes;"],
    [
      "AS (alias)",
      "Renomear coluna ou tabela",
      "SELECT nome AS cliente, total AS valor_total FROM pedidos;",
    ],
  ]),
  ...build("JOIN", [
    [
      "INNER JOIN",
      "Retorna registros com correspondência nos dois lados",
      `SELECT c.nome, p.total
FROM clientes c
INNER JOIN pedidos p ON c.id = p.id_cliente;`,
    ],
    [
      "LEFT JOIN",
      "Retorna todos da esquerda mais correspondências",
      `SELECT c.nome, p.total
FROM clientes c
LEFT JOIN pedidos p ON c.id = p.id_cliente;`,
    ],
    [
      "RIGHT JOIN",
      "Retorna todos da direita mais correspondências",
      `SELECT c.nome, p.total
FROM clientes c
RIGHT JOIN pedidos p ON c.id = p.id_cliente;`,
    ],
    [
      "FULL OUTER JOIN",
      "Retorna todos de ambos os lados",
      `SELECT c.nome, p.total
FROM clientes c
FULL OUTER JOIN pedidos p ON c.id = p.id_cliente;`,
    ],
    [
      "SELF JOIN",
      "Juntar tabela com ela mesma",
      `SELECT a.nome AS cliente, b.nome AS indicado
FROM clientes a
JOIN clientes b ON a.id = b.id_indicador;`,
    ],
    [
      "CROSS JOIN",
      "Produto cartesiano entre tabelas",
      `SELECT c.nome, p.nome
FROM categorias c
CROSS JOIN produtos p;`,
    ],
  ]),
  ...build("Agregação", [
    [
      "COUNT()",
      "Contar registros",
      "SELECT COUNT(*) FROM pedidos WHERE status = 'entregue';",
    ],
    [
      "SUM()",
      "Somar valores",
      "SELECT SUM(total) FROM pedidos WHERE MONTH(data_pedido) = 5;",
    ],
    [
      "AVG()",
      "Calcular média",
      "SELECT AVG(preco) FROM produtos WHERE id_categoria = 1;",
    ],
    [
      "MAX() / MIN()",
      "Valor máximo e mínimo",
      "SELECT MAX(total), MIN(total) FROM pedidos;",
    ],
    [
      "COUNT(DISTINCT)",
      "Contar valores únicos",
      "SELECT COUNT(DISTINCT id_cliente) FROM pedidos;",
    ],
  ]),
  ...build("Subqueries", [
    [
      "Subquery no WHERE",
      "Usar resultado de SELECT como filtro",
      `SELECT * FROM produtos
WHERE preco > (SELECT AVG(preco) FROM produtos);`,
    ],
    [
      "Subquery no FROM",
      "Usar SELECT como tabela temporária",
      `SELECT sub.estado, sub.total
FROM (
  SELECT estado, COUNT(*) AS total
  FROM clientes
  GROUP BY estado
) sub
WHERE sub.total > 5;`,
    ],
    [
      "WITH (CTE)",
      "Common Table Expression reutilizável",
      `WITH top_clientes AS (
  SELECT id_cliente, SUM(total) AS gasto
  FROM pedidos
  GROUP BY id_cliente
)
SELECT c.nome, t.gasto
FROM top_clientes t
JOIN clientes c ON c.id = t.id_cliente
ORDER BY t.gasto DESC
LIMIT 5;`,
    ],
    [
      "EXISTS",
      "Verificar se subquery retorna resultado",
      `SELECT * FROM clientes c
WHERE EXISTS (
  SELECT 1 FROM pedidos p WHERE p.id_cliente = c.id
);`,
    ],
    [
      "IN com subquery",
      "Filtrar por resultado de outra consulta",
      `SELECT * FROM clientes
WHERE id IN (
  SELECT id_cliente FROM pedidos WHERE total > 500
);`,
    ],
  ]),
];
