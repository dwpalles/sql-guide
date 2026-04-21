export type SqlCategory =
  | "SELECT"
  | "WHERE"
  | "JOIN"
  | "GROUP BY"
  | "Agregação"
  | "Subqueries"
  | "DDL"
  | "DML"
  | "Índices"
  | "Funções String"
  | "Funções Data"
  | "Funções Matemáticas";

export interface SqlCommand {
  id: string;
  name: string;
  category: SqlCategory;
  syntax: string;
  description: string;
  example: string;
}

export const CATEGORIES: SqlCategory[] = [
  "SELECT",
  "WHERE",
  "JOIN",
  "GROUP BY",
  "Agregação",
  "Subqueries",
  "DDL",
  "DML",
  "Índices",
  "Funções String",
  "Funções Data",
  "Funções Matemáticas",
];

export const SCHEMA_DESCRIPTION = `-- Banco de dados de e-commerce
clientes(id, nome, email, cidade, data_cadastro)
categorias(id, nome)
produtos(id, nome, preco, estoque, categoria_id)
pedidos(id, cliente_id, data_pedido, status, total)
itens_pedido(id, pedido_id, produto_id, quantidade, preco_unitario)`;

export const SQL_COMMANDS: SqlCommand[] = [
  // ---------- SELECT ----------
  {
    id: "select-all",
    name: "SELECT *",
    category: "SELECT",
    syntax: "SELECT * FROM tabela;",
    description: "Retorna todas as colunas e linhas de uma tabela.",
    example: `SELECT * FROM clientes;`,
  },
  {
    id: "select-columns",
    name: "SELECT colunas",
    category: "SELECT",
    syntax: "SELECT col1, col2 FROM tabela;",
    description: "Seleciona apenas as colunas especificadas.",
    example: `SELECT nome, email FROM clientes;`,
  },
  {
    id: "select-distinct",
    name: "SELECT DISTINCT",
    category: "SELECT",
    syntax: "SELECT DISTINCT coluna FROM tabela;",
    description: "Retorna valores únicos, eliminando duplicatas.",
    example: `SELECT DISTINCT cidade FROM clientes;`,
  },
  {
    id: "select-alias",
    name: "AS (Alias)",
    category: "SELECT",
    syntax: "SELECT coluna AS apelido FROM tabela;",
    description: "Renomeia uma coluna ou tabela no resultado.",
    example: `SELECT nome AS cliente, email AS contato
FROM clientes;`,
  },
  {
    id: "select-limit",
    name: "LIMIT / OFFSET",
    category: "SELECT",
    syntax: "SELECT * FROM tabela LIMIT n OFFSET m;",
    description: "Limita o número de linhas retornadas, opcionalmente pulando algumas.",
    example: `SELECT * FROM produtos
ORDER BY preco DESC
LIMIT 10 OFFSET 0;`,
  },
  {
    id: "order-by",
    name: "ORDER BY",
    category: "SELECT",
    syntax: "SELECT * FROM tabela ORDER BY coluna [ASC|DESC];",
    description: "Ordena os resultados pela(s) coluna(s) especificada(s).",
    example: `SELECT nome, preco FROM produtos
ORDER BY preco DESC, nome ASC;`,
  },

  // ---------- WHERE ----------
  {
    id: "where-equals",
    name: "WHERE =",
    category: "WHERE",
    syntax: "SELECT * FROM tabela WHERE coluna = valor;",
    description: "Filtra linhas que atendem a uma condição de igualdade.",
    example: `SELECT * FROM pedidos
WHERE status = 'entregue';`,
  },
  {
    id: "where-and-or",
    name: "AND / OR / NOT",
    category: "WHERE",
    syntax: "WHERE cond1 AND cond2 OR NOT cond3",
    description: "Combina múltiplas condições no filtro.",
    example: `SELECT * FROM produtos
WHERE preco > 100 AND estoque > 0;`,
  },
  {
    id: "where-in",
    name: "IN",
    category: "WHERE",
    syntax: "WHERE coluna IN (v1, v2, v3)",
    description: "Verifica se um valor pertence a uma lista.",
    example: `SELECT * FROM clientes
WHERE cidade IN ('São Paulo', 'Rio de Janeiro', 'Curitiba');`,
  },
  {
    id: "where-between",
    name: "BETWEEN",
    category: "WHERE",
    syntax: "WHERE coluna BETWEEN x AND y",
    description: "Filtra valores dentro de um intervalo inclusivo.",
    example: `SELECT * FROM produtos
WHERE preco BETWEEN 50 AND 200;`,
  },
  {
    id: "where-like",
    name: "LIKE",
    category: "WHERE",
    syntax: "WHERE coluna LIKE 'padrão%'",
    description: "Busca por padrão de texto. % = qualquer sequência, _ = um caractere.",
    example: `SELECT * FROM clientes
WHERE email LIKE '%@gmail.com';`,
  },
  {
    id: "where-null",
    name: "IS NULL / IS NOT NULL",
    category: "WHERE",
    syntax: "WHERE coluna IS NULL",
    description: "Filtra linhas com valores nulos ou não nulos.",
    example: `SELECT * FROM pedidos
WHERE data_pedido IS NOT NULL;`,
  },

  // ---------- JOIN ----------
  {
    id: "inner-join",
    name: "INNER JOIN",
    category: "JOIN",
    syntax: "FROM a INNER JOIN b ON a.id = b.a_id",
    description: "Retorna apenas linhas com correspondência em ambas as tabelas.",
    example: `SELECT p.id, c.nome, p.total
FROM pedidos p
INNER JOIN clientes c ON c.id = p.cliente_id;`,
  },
  {
    id: "left-join",
    name: "LEFT JOIN",
    category: "JOIN",
    syntax: "FROM a LEFT JOIN b ON a.id = b.a_id",
    description: "Retorna todas as linhas da tabela esquerda, e as correspondentes da direita (NULL se não houver).",
    example: `SELECT c.nome, p.id AS pedido_id
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id;`,
  },
  {
    id: "right-join",
    name: "RIGHT JOIN",
    category: "JOIN",
    syntax: "FROM a RIGHT JOIN b ON a.id = b.a_id",
    description: "Retorna todas as linhas da tabela direita, e as correspondentes da esquerda.",
    example: `SELECT c.nome, p.id
FROM clientes c
RIGHT JOIN pedidos p ON p.cliente_id = c.id;`,
  },
  {
    id: "full-join",
    name: "FULL OUTER JOIN",
    category: "JOIN",
    syntax: "FROM a FULL OUTER JOIN b ON a.id = b.a_id",
    description: "Retorna todas as linhas de ambas as tabelas, com NULL onde não houver correspondência.",
    example: `SELECT c.nome, p.id
FROM clientes c
FULL OUTER JOIN pedidos p ON p.cliente_id = c.id;`,
  },
  {
    id: "self-join",
    name: "SELF JOIN",
    category: "JOIN",
    syntax: "FROM tabela a JOIN tabela b ON a.col = b.col",
    description: "Junta uma tabela com ela mesma usando aliases.",
    example: `SELECT a.nome AS produto_a, b.nome AS produto_b
FROM produtos a
JOIN produtos b ON a.categoria_id = b.categoria_id
WHERE a.id < b.id;`,
  },

  // ---------- GROUP BY ----------
  {
    id: "group-by",
    name: "GROUP BY",
    category: "GROUP BY",
    syntax: "SELECT col, AGG(...) FROM t GROUP BY col;",
    description: "Agrupa linhas com os mesmos valores em colunas especificadas.",
    example: `SELECT cidade, COUNT(*) AS total_clientes
FROM clientes
GROUP BY cidade;`,
  },
  {
    id: "having",
    name: "HAVING",
    category: "GROUP BY",
    syntax: "GROUP BY col HAVING condição_agregada",
    description: "Filtra grupos após a agregação (WHERE filtra antes).",
    example: `SELECT cliente_id, COUNT(*) AS pedidos
FROM pedidos
GROUP BY cliente_id
HAVING COUNT(*) > 5;`,
  },

  // ---------- Agregação ----------
  {
    id: "count",
    name: "COUNT()",
    category: "Agregação",
    syntax: "COUNT(*) | COUNT(coluna) | COUNT(DISTINCT coluna)",
    description: "Conta o número de linhas ou valores não nulos.",
    example: `SELECT COUNT(*) AS total_pedidos
FROM pedidos
WHERE status = 'entregue';`,
  },
  {
    id: "sum",
    name: "SUM()",
    category: "Agregação",
    syntax: "SUM(coluna_numérica)",
    description: "Soma os valores de uma coluna numérica.",
    example: `SELECT SUM(total) AS receita_total
FROM pedidos
WHERE status = 'entregue';`,
  },
  {
    id: "avg",
    name: "AVG()",
    category: "Agregação",
    syntax: "AVG(coluna_numérica)",
    description: "Calcula a média aritmética dos valores.",
    example: `SELECT categoria_id, AVG(preco) AS preco_medio
FROM produtos
GROUP BY categoria_id;`,
  },
  {
    id: "min-max",
    name: "MIN() / MAX()",
    category: "Agregação",
    syntax: "MIN(coluna), MAX(coluna)",
    description: "Retorna o menor e o maior valor de uma coluna.",
    example: `SELECT MIN(preco) AS mais_barato,
       MAX(preco) AS mais_caro
FROM produtos;`,
  },

  // ---------- Subqueries ----------
  {
    id: "subquery-where",
    name: "Subquery em WHERE",
    category: "Subqueries",
    syntax: "WHERE coluna = (SELECT ... FROM ...)",
    description: "Usa o resultado de uma consulta dentro de outra.",
    example: `SELECT nome, preco
FROM produtos
WHERE preco > (SELECT AVG(preco) FROM produtos);`,
  },
  {
    id: "subquery-in",
    name: "Subquery com IN",
    category: "Subqueries",
    syntax: "WHERE col IN (SELECT col FROM ...)",
    description: "Filtra com base em um conjunto vindo de outra consulta.",
    example: `SELECT * FROM clientes
WHERE id IN (
  SELECT cliente_id FROM pedidos WHERE total > 1000
);`,
  },
  {
    id: "exists",
    name: "EXISTS",
    category: "Subqueries",
    syntax: "WHERE EXISTS (SELECT 1 FROM ... WHERE ...)",
    description: "Verifica se a subconsulta retorna pelo menos uma linha.",
    example: `SELECT c.nome FROM clientes c
WHERE EXISTS (
  SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id
);`,
  },
  {
    id: "cte",
    name: "WITH (CTE)",
    category: "Subqueries",
    syntax: "WITH nome AS (SELECT ...) SELECT ... FROM nome;",
    description: "Common Table Expression: subconsulta nomeada e reutilizável.",
    example: `WITH top_clientes AS (
  SELECT cliente_id, SUM(total) AS gasto
  FROM pedidos
  GROUP BY cliente_id
)
SELECT c.nome, t.gasto
FROM top_clientes t
JOIN clientes c ON c.id = t.cliente_id
ORDER BY t.gasto DESC
LIMIT 5;`,
  },

  // ---------- DDL ----------
  {
    id: "create-table",
    name: "CREATE TABLE",
    category: "DDL",
    syntax: "CREATE TABLE nome ( coluna tipo [restrições], ... );",
    description: "Cria uma nova tabela no banco de dados.",
    example: `CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);`,
  },
  {
    id: "alter-table",
    name: "ALTER TABLE",
    category: "DDL",
    syntax: "ALTER TABLE nome ADD|DROP|ALTER COLUMN ...;",
    description: "Modifica a estrutura de uma tabela existente.",
    example: `ALTER TABLE produtos
ADD COLUMN descricao TEXT;`,
  },
  {
    id: "drop-table",
    name: "DROP TABLE",
    category: "DDL",
    syntax: "DROP TABLE [IF EXISTS] nome;",
    description: "Remove uma tabela e todos os seus dados permanentemente.",
    example: `DROP TABLE IF EXISTS log_temporario;`,
  },
  {
    id: "truncate",
    name: "TRUNCATE",
    category: "DDL",
    syntax: "TRUNCATE TABLE nome;",
    description: "Remove todas as linhas de uma tabela rapidamente, mantendo a estrutura.",
    example: `TRUNCATE TABLE itens_pedido;`,
  },

  // ---------- DML ----------
  {
    id: "insert",
    name: "INSERT INTO",
    category: "DML",
    syntax: "INSERT INTO tabela (col1, col2) VALUES (v1, v2);",
    description: "Insere uma ou mais linhas em uma tabela.",
    example: `INSERT INTO clientes (nome, email, cidade)
VALUES ('Ana Souza', 'ana@example.com', 'São Paulo');`,
  },
  {
    id: "update",
    name: "UPDATE",
    category: "DML",
    syntax: "UPDATE tabela SET col = valor WHERE condição;",
    description: "Atualiza linhas existentes em uma tabela.",
    example: `UPDATE produtos
SET preco = preco * 1.10
WHERE categoria_id = 3;`,
  },
  {
    id: "delete",
    name: "DELETE",
    category: "DML",
    syntax: "DELETE FROM tabela WHERE condição;",
    description: "Remove linhas de uma tabela. Sempre use WHERE!",
    example: `DELETE FROM pedidos
WHERE status = 'cancelado'
  AND data_pedido < '2023-01-01';`,
  },
  {
    id: "upsert",
    name: "INSERT ... ON CONFLICT",
    category: "DML",
    syntax: "INSERT ... ON CONFLICT (col) DO UPDATE SET ...",
    description: "Insere ou atualiza (upsert) caso haja conflito de chave única.",
    example: `INSERT INTO categorias (id, nome)
VALUES (1, 'Eletrônicos')
ON CONFLICT (id) DO UPDATE
SET nome = EXCLUDED.nome;`,
  },

  // ---------- Índices ----------
  {
    id: "create-index",
    name: "CREATE INDEX",
    category: "Índices",
    syntax: "CREATE INDEX nome ON tabela (coluna);",
    description: "Cria um índice para acelerar consultas em colunas específicas.",
    example: `CREATE INDEX idx_pedidos_cliente
ON pedidos (cliente_id);`,
  },
  {
    id: "unique-index",
    name: "CREATE UNIQUE INDEX",
    category: "Índices",
    syntax: "CREATE UNIQUE INDEX nome ON tabela (coluna);",
    description: "Cria um índice que também impõe unicidade dos valores.",
    example: `CREATE UNIQUE INDEX idx_clientes_email
ON clientes (email);`,
  },
  {
    id: "drop-index",
    name: "DROP INDEX",
    category: "Índices",
    syntax: "DROP INDEX [IF EXISTS] nome;",
    description: "Remove um índice existente.",
    example: `DROP INDEX IF EXISTS idx_pedidos_cliente;`,
  },

  // ---------- Funções String ----------
  {
    id: "concat",
    name: "CONCAT()",
    category: "Funções String",
    syntax: "CONCAT(str1, str2, ...)",
    description: "Concatena duas ou mais strings.",
    example: `SELECT CONCAT(nome, ' <', email, '>') AS contato
FROM clientes;`,
  },
  {
    id: "upper-lower",
    name: "UPPER() / LOWER()",
    category: "Funções String",
    syntax: "UPPER(str), LOWER(str)",
    description: "Converte texto para maiúsculas ou minúsculas.",
    example: `SELECT UPPER(nome) AS nome_caps
FROM produtos;`,
  },
  {
    id: "substring",
    name: "SUBSTRING()",
    category: "Funções String",
    syntax: "SUBSTRING(str FROM início FOR tamanho)",
    description: "Extrai parte de uma string.",
    example: `SELECT SUBSTRING(email FROM 1 FOR 3) AS prefixo
FROM clientes;`,
  },
  {
    id: "length",
    name: "LENGTH()",
    category: "Funções String",
    syntax: "LENGTH(str)",
    description: "Retorna o número de caracteres de uma string.",
    example: `SELECT nome, LENGTH(nome) AS tamanho
FROM produtos
ORDER BY tamanho DESC;`,
  },

  // ---------- Funções Data ----------
  {
    id: "now",
    name: "NOW() / CURRENT_DATE",
    category: "Funções Data",
    syntax: "NOW(), CURRENT_DATE, CURRENT_TIMESTAMP",
    description: "Retorna a data e/ou hora atual.",
    example: `SELECT * FROM pedidos
WHERE data_pedido >= CURRENT_DATE - INTERVAL '7 days';`,
  },
  {
    id: "date-part",
    name: "EXTRACT()",
    category: "Funções Data",
    syntax: "EXTRACT(parte FROM data)",
    description: "Extrai parte de uma data (year, month, day, etc).",
    example: `SELECT EXTRACT(YEAR FROM data_pedido) AS ano,
       COUNT(*) AS pedidos
FROM pedidos
GROUP BY ano
ORDER BY ano;`,
  },
  {
    id: "date-trunc",
    name: "DATE_TRUNC()",
    category: "Funções Data",
    syntax: "DATE_TRUNC('parte', data)",
    description: "Trunca uma data para a precisão indicada (mês, dia, hora...).",
    example: `SELECT DATE_TRUNC('month', data_pedido) AS mes,
       SUM(total) AS receita
FROM pedidos
GROUP BY mes
ORDER BY mes;`,
  },

  // ---------- Funções Matemáticas ----------
  {
    id: "round",
    name: "ROUND()",
    category: "Funções Matemáticas",
    syntax: "ROUND(número, casas_decimais)",
    description: "Arredonda um número para o número de casas indicado.",
    example: `SELECT nome, ROUND(preco, 2) AS preco
FROM produtos;`,
  },
  {
    id: "ceil-floor",
    name: "CEIL() / FLOOR()",
    category: "Funções Matemáticas",
    syntax: "CEIL(n), FLOOR(n)",
    description: "Arredonda para cima ou para baixo, respectivamente.",
    example: `SELECT preco,
       CEIL(preco) AS teto,
       FLOOR(preco) AS piso
FROM produtos;`,
  },
  {
    id: "abs-mod",
    name: "ABS() / MOD()",
    category: "Funções Matemáticas",
    syntax: "ABS(n), MOD(a, b)",
    description: "Valor absoluto e resto da divisão entre dois números.",
    example: `SELECT id, ABS(estoque - 100) AS distancia,
       MOD(id, 2) AS paridade
FROM produtos;`,
  },
];
