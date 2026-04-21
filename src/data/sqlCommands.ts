export type SqlCategory =
  | "DDL"
  | "DML"
  | "SELECT"
  | "JOIN"
  | "Agregação"
  | "Subqueries"
  | "Operadores"
  | "Funções String"
  | "Funções Matemáticas"
  | "Funções Data/Hora"
  | "Conversão"
  | "Window Functions"
  | "Set Operations"
  | "Constraints"
  | "Índices"
  | "Views"
  | "Transações"
  | "Stored Procedures"
  | "Triggers"
  | "DCL (Permissões)"
  | "Utilitários";

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
  "Operadores",
  "Funções String",
  "Funções Matemáticas",
  "Funções Data/Hora",
  "Conversão",
  "Window Functions",
  "Set Operations",
  "Constraints",
  "Índices",
  "Views",
  "Transações",
  "Stored Procedures",
  "Triggers",
  "DCL (Permissões)",
  "Utilitários",
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
    ["COUNT()", "Contar registros", "SELECT COUNT(*) FROM pedidos WHERE status = 'entregue';"],
    ["SUM()", "Somar valores", "SELECT SUM(total) FROM pedidos WHERE MONTH(data_pedido) = 5;"],
    ["AVG()", "Calcular média", "SELECT AVG(preco) FROM produtos WHERE id_categoria = 1;"],
    ["MAX() / MIN()", "Valor máximo e mínimo", "SELECT MAX(total), MIN(total) FROM pedidos;"],
    ["COUNT(DISTINCT)", "Contar valores únicos", "SELECT COUNT(DISTINCT id_cliente) FROM pedidos;"],
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
    [
      "CTEs encadeadas",
      "Múltiplas CTEs em sequência",
      `WITH gastos AS (
  SELECT id_cliente, SUM(total) AS gasto
  FROM pedidos
  GROUP BY id_cliente
), top10 AS (
  SELECT * FROM gastos ORDER BY gasto DESC LIMIT 10
)
SELECT c.nome, t.gasto
FROM top10 t
JOIN clientes c ON c.id = t.id_cliente;`,
    ],
    [
      "WITH RECURSIVE",
      "CTE recursiva (hierarquias / sequências)",
      `WITH RECURSIVE numeros AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM numeros WHERE n < 12
)
SELECT n AS mes FROM numeros;`,
    ],
  ]),
  ...build("Operadores", [
    ["= (igual)", "Comparação de igualdade", "SELECT * FROM produtos WHERE id_categoria = 2;"],
    ["<> ou !=", "Diferente de", "SELECT * FROM pedidos WHERE status <> 'cancelado';"],
    [">  <  >=  <=", "Comparações numéricas", "SELECT * FROM produtos WHERE preco >= 100;"],
    ["AND", "E lógico — ambas condições verdadeiras", "SELECT * FROM clientes WHERE estado = 'SP' AND cidade = 'Campinas';"],
    ["OR", "OU lógico — ao menos uma verdadeira", "SELECT * FROM pedidos WHERE status = 'pago' OR status = 'enviado';"],
    ["NOT", "Negação lógica", "SELECT * FROM produtos WHERE NOT estoque = 0;"],
    ["IN (...)", "Pertence a uma lista", "SELECT * FROM clientes WHERE estado IN ('SP','RJ','MG');"],
    ["NOT IN (...)", "Não pertence a uma lista", "SELECT * FROM produtos WHERE id_categoria NOT IN (4, 5);"],
    ["BETWEEN ... AND", "Intervalo inclusivo", "SELECT * FROM pedidos WHERE total BETWEEN 50 AND 200;"],
    ["LIKE 'x%'", "Começa com", "SELECT * FROM clientes WHERE nome LIKE 'Mar%';"],
    ["LIKE '%x%'", "Contém", "SELECT * FROM produtos WHERE nome LIKE '%notebook%';"],
    ["IS NULL / IS NOT NULL", "Testar valores nulos", "SELECT * FROM clientes WHERE email IS NULL;"],
    ["EXISTS", "Subquery retorna ao menos 1 linha", `SELECT * FROM clientes c
WHERE EXISTS (SELECT 1 FROM pedidos p WHERE p.id_cliente = c.id);`],
    ["ALL", "Verdadeiro para todos os valores", "SELECT * FROM produtos WHERE preco > ALL (SELECT preco FROM produtos WHERE id_categoria = 3);"],
    ["ANY / SOME", "Verdadeiro para qualquer valor", "SELECT * FROM produtos WHERE preco > ANY (SELECT preco FROM produtos WHERE id_categoria = 3);"],
  ]),
  ...build("Funções String", [
    ["UPPER()", "Converte para maiúsculas", "SELECT UPPER(nome) FROM clientes;"],
    ["LOWER()", "Converte para minúsculas", "SELECT LOWER(email) FROM clientes;"],
    ["LENGTH()", "Tamanho da string em caracteres", "SELECT nome, LENGTH(nome) FROM produtos;"],
    ["CONCAT()", "Concatena strings", "SELECT CONCAT(nome, ' - ', estado) AS cliente FROM clientes;"],
    ["CONCAT_WS()", "Concatena com separador", "SELECT CONCAT_WS(', ', cidade, estado) FROM clientes;"],
    ["SUBSTRING()", "Extrai parte da string", "SELECT SUBSTRING(nome, 1, 3) FROM clientes;"],
    ["LEFT() / RIGHT()", "Pega N caracteres da esquerda/direita", "SELECT LEFT(nome, 5), RIGHT(email, 10) FROM clientes;"],
    ["TRIM()", "Remove espaços nas pontas", "SELECT TRIM(nome) FROM clientes;"],
    ["LTRIM() / RTRIM()", "Remove espaços à esquerda/direita", "SELECT LTRIM('  abc'), RTRIM('abc  ');"],
    ["REPLACE()", "Substitui parte do texto", "SELECT REPLACE(email, '@old.com', '@new.com') FROM clientes;"],
    ["INSTR()", "Posição de uma substring", "SELECT nome, INSTR(email, '@') FROM clientes;"],
    ["LPAD() / RPAD()", "Preenche string até tamanho fixo", "SELECT LPAD(id, 6, '0') FROM produtos;"],
  ]),
  ...build("Funções Matemáticas", [
    ["ROUND()", "Arredonda para N casas", "SELECT ROUND(AVG(total), 2) FROM pedidos;"],
    ["CEIL()", "Arredonda para cima", "SELECT CEIL(preco) FROM produtos;"],
    ["FLOOR()", "Arredonda para baixo", "SELECT FLOOR(preco) FROM produtos;"],
    ["ABS()", "Valor absoluto", "SELECT ABS(estoque - 100) FROM produtos;"],
    ["MOD()", "Resto da divisão", "SELECT id, MOD(id, 2) FROM produtos;"],
    ["POWER()", "Potência", "SELECT POWER(preco, 2) FROM produtos;"],
    ["SQRT()", "Raiz quadrada", "SELECT SQRT(estoque) FROM produtos;"],
    ["RAND()", "Número aleatório entre 0 e 1", "SELECT * FROM produtos ORDER BY RAND() LIMIT 5;"],
    ["TRUNCATE()", "Trunca para N casas (sem arredondar)", "SELECT TRUNCATE(preco, 1) FROM produtos;"],
  ]),
  ...build("Funções Data/Hora", [
    ["NOW()", "Data e hora atuais", "SELECT NOW();"],
    ["CURDATE()", "Data atual", "SELECT CURDATE();"],
    ["YEAR() / MONTH() / DAY()", "Extrai partes da data", "SELECT YEAR(data_pedido), MONTH(data_pedido) FROM pedidos;"],
    ["HOUR()", "Hora de um datetime", "SELECT HOUR(data_pedido) FROM pedidos;"],
    ["DATEDIFF()", "Dias entre duas datas", "SELECT DATEDIFF(NOW(), data_cadastro) FROM clientes;"],
    ["DATE_ADD()", "Soma intervalo a uma data", "SELECT DATE_ADD(data_pedido, INTERVAL 7 DAY) FROM pedidos;"],
    ["DATE_SUB()", "Subtrai intervalo de uma data", "SELECT DATE_SUB(NOW(), INTERVAL 30 DAY);"],
    ["DATE_FORMAT()", "Formatar data como string", "SELECT DATE_FORMAT(data_pedido, '%d/%m/%Y') FROM pedidos;"],
    ["STR_TO_DATE()", "Converter string para data", "SELECT STR_TO_DATE('21/04/2026', '%d/%m/%Y');"],
    ["TIMESTAMPDIFF()", "Diferença em unidade específica", "SELECT TIMESTAMPDIFF(MONTH, data_cadastro, NOW()) FROM clientes;"],
    ["LAST_DAY()", "Último dia do mês", "SELECT LAST_DAY(data_pedido) FROM pedidos;"],
    ["DAYOFWEEK()", "Dia da semana (1=Domingo)", "SELECT DAYOFWEEK(data_pedido) FROM pedidos;"],
  ]),
  ...build("Conversão", [
    ["CAST()", "Converter valor para outro tipo", "SELECT CAST(preco AS CHAR) FROM produtos;"],
    ["CONVERT()", "Sintaxe alternativa de conversão", "SELECT CONVERT(total, DECIMAL(10,2)) FROM pedidos;"],
    ["COALESCE()", "Primeiro valor não-nulo da lista", "SELECT COALESCE(email, telefone, 'sem contato') FROM clientes;"],
    ["NULLIF()", "Retorna NULL se os valores forem iguais", "SELECT NULLIF(estoque, 0) FROM produtos;"],
    ["ISNULL() / IFNULL()", "Substitui NULL por valor padrão", "SELECT IFNULL(email, 'sem-email') FROM clientes;"],
    ["IF()", "Condição ternária inline", "SELECT nome, IF(estoque = 0, 'Esgotado', 'Disponível') FROM produtos;"],
    ["GREATEST()", "Maior valor de uma lista", "SELECT GREATEST(preco, 10) FROM produtos;"],
    ["LEAST()", "Menor valor de uma lista", "SELECT LEAST(preco, 1000) FROM produtos;"],
    ["FORMAT()", "Formatar número com separadores", "SELECT FORMAT(total, 2) FROM pedidos;"],
    ["JSON_EXTRACT()", "Extrair campo de coluna JSON", "SELECT JSON_EXTRACT(metadados, '$.cor') FROM produtos;"],
    [
      "CASE WHEN",
      "Lógica condicional em múltiplos ramos",
      `SELECT nome,
  CASE
    WHEN total > 500 THEN 'Alto'
    WHEN total > 100 THEN 'Médio'
    ELSE 'Baixo'
  END AS faixa
FROM pedidos;`,
    ],
  ]),
  ...build("Window Functions", [
    [
      "OVER ()",
      "Define a janela de cálculo da função",
      "SELECT nome, total, SUM(total) OVER () AS total_geral FROM pedidos;",
    ],
    [
      "PARTITION BY",
      "Divide a janela em grupos",
      `SELECT nome, preco,
  AVG(preco) OVER (PARTITION BY id_categoria) AS media_categoria
FROM produtos;`,
    ],
    [
      "ORDER BY dentro de OVER",
      "Ordena linhas dentro da janela",
      `SELECT data_pedido, total,
  SUM(total) OVER (ORDER BY data_pedido) AS acumulado
FROM pedidos;`,
    ],
    [
      "ROW_NUMBER()",
      "Número sequencial por partição",
      `SELECT nome, preco,
  ROW_NUMBER() OVER (PARTITION BY id_categoria ORDER BY preco DESC) AS rn
FROM produtos;`,
    ],
    [
      "RANK()",
      "Ranking com gaps em empates",
      "SELECT nome, total, RANK() OVER (ORDER BY total DESC) AS posicao FROM pedidos;",
    ],
    [
      "DENSE_RANK()",
      "Ranking sem gaps em empates",
      "SELECT nome, total, DENSE_RANK() OVER (ORDER BY total DESC) AS posicao FROM pedidos;",
    ],
    [
      "NTILE()",
      "Divide os resultados em N grupos iguais",
      "SELECT nome, total, NTILE(4) OVER (ORDER BY total) AS quartil FROM pedidos;",
    ],
    [
      "LAG()",
      "Acessa o valor da linha anterior",
      `SELECT data_pedido, total,
  LAG(total) OVER (ORDER BY data_pedido) AS pedido_anterior
FROM pedidos;`,
    ],
    [
      "LEAD()",
      "Acessa o valor da próxima linha",
      `SELECT data_pedido, total,
  LEAD(total) OVER (ORDER BY data_pedido) AS proximo
FROM pedidos;`,
    ],
    [
      "FIRST_VALUE()",
      "Primeiro valor da janela",
      `SELECT nome, preco,
  FIRST_VALUE(nome) OVER (PARTITION BY id_categoria ORDER BY preco DESC) AS mais_caro
FROM produtos;`,
    ],
    [
      "LAST_VALUE()",
      "Último valor da janela",
      `SELECT nome, preco,
  LAST_VALUE(nome) OVER (
    PARTITION BY id_categoria ORDER BY preco
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS mais_caro
FROM produtos;`,
    ],
    [
      "SUM() OVER",
      "Soma acumulada / por janela",
      `SELECT data_pedido, total,
  SUM(total) OVER (ORDER BY data_pedido) AS acumulado
FROM pedidos;`,
    ],
    [
      "AVG() OVER",
      "Média móvel / por janela",
      `SELECT data_pedido, total,
  AVG(total) OVER (ORDER BY data_pedido ROWS 6 PRECEDING) AS media_7d
FROM pedidos;`,
    ],
  ]),
  ...build("Set Operations", [
    [
      "UNION",
      "Une resultados removendo duplicatas",
      `SELECT cidade FROM clientes WHERE estado = 'SP'
UNION
SELECT cidade FROM clientes WHERE estado = 'RJ';`,
    ],
    [
      "UNION ALL",
      "Une resultados mantendo duplicatas",
      `SELECT id_cliente FROM pedidos WHERE total > 500
UNION ALL
SELECT id_cliente FROM pedidos WHERE status = 'entregue';`,
    ],
    [
      "INTERSECT",
      "Apenas registros comuns aos dois SELECTs",
      `SELECT id_cliente FROM pedidos WHERE total > 500
INTERSECT
SELECT id_cliente FROM pedidos WHERE status = 'entregue';`,
    ],
    [
      "EXCEPT / MINUS",
      "Registros do primeiro que não estão no segundo",
      `SELECT id FROM clientes
EXCEPT
SELECT id_cliente FROM pedidos;`,
    ],
  ]),
  ...build("Constraints", [
    ["PRIMARY KEY", "Chave primária — identifica unicamente", "ALTER TABLE clientes ADD PRIMARY KEY (id);"],
    ["FOREIGN KEY", "Chave estrangeira — referência a outra tabela", "ALTER TABLE pedidos ADD FOREIGN KEY (id_cliente) REFERENCES clientes(id);"],
    ["UNIQUE", "Valor único na coluna", "ALTER TABLE clientes ADD CONSTRAINT uq_email UNIQUE (email);"],
    ["NOT NULL", "Não permite valores nulos", "ALTER TABLE produtos MODIFY nome VARCHAR(100) NOT NULL;"],
    ["CHECK", "Validação por condição", "ALTER TABLE produtos ADD CONSTRAINT chk_preco CHECK (preco >= 0);"],
    ["DEFAULT", "Valor padrão da coluna", "ALTER TABLE pedidos ALTER status SET DEFAULT 'pendente';"],
    ["AUTO_INCREMENT", "Incremento automático", "ALTER TABLE clientes MODIFY id INT AUTO_INCREMENT;"],
    [
      "ON DELETE CASCADE",
      "Apagar filhos ao apagar o pai",
      `ALTER TABLE itens_pedido
ADD CONSTRAINT fk_itens_pedido
FOREIGN KEY (id_pedido) REFERENCES pedidos(id)
ON DELETE CASCADE;`,
    ],
    [
      "ON UPDATE CASCADE",
      "Propagar UPDATE da PK para a FK",
      `ALTER TABLE pedidos
ADD CONSTRAINT fk_pedidos_cliente
FOREIGN KEY (id_cliente) REFERENCES clientes(id)
ON UPDATE CASCADE;`,
    ],
    [
      "ADD CONSTRAINT",
      "Adicionar constraint nomeada",
      "ALTER TABLE produtos ADD CONSTRAINT chk_estoque CHECK (estoque >= 0);",
    ],
  ]),
  ...build("Índices", [
    ["CREATE INDEX", "Criar índice simples", "CREATE INDEX idx_estado ON clientes(estado);"],
    ["CREATE UNIQUE INDEX", "Índice único", "CREATE UNIQUE INDEX idx_email ON clientes(email);"],
    ["CREATE INDEX (composto)", "Índice em múltiplas colunas", "CREATE INDEX idx_cli_data ON pedidos(id_cliente, data_pedido);"],
    ["DROP INDEX", "Remover índice", "DROP INDEX idx_estado ON clientes;"],
    ["EXPLAIN", "Analisar plano de execução de uma query", "EXPLAIN SELECT * FROM pedidos WHERE id_cliente = 5;"],
    ["SHOW INDEX", "Listar índices da tabela", "SHOW INDEX FROM pedidos;"],
    ["ANALYZE TABLE", "Atualizar estatísticas do otimizador", "ANALYZE TABLE pedidos;"],
  ]),
  ...build("Views", [
    [
      "CREATE VIEW",
      "Criar view a partir de SELECT",
      `CREATE VIEW vw_pedidos_clientes AS
SELECT c.nome, p.total, p.data_pedido
FROM clientes c
JOIN pedidos p ON c.id = p.id_cliente;`,
    ],
    ["SELECT em VIEW", "Consultar uma view", "SELECT * FROM vw_pedidos_clientes WHERE total > 100;"],
    [
      "CREATE OR REPLACE VIEW",
      "Recriar view existente",
      `CREATE OR REPLACE VIEW vw_top_produtos AS
SELECT nome, preco FROM produtos ORDER BY preco DESC LIMIT 10;`,
    ],
    ["DROP VIEW", "Remover view", "DROP VIEW vw_pedidos_clientes;"],
  ]),
  ...build("Transações", [
    ["START TRANSACTION", "Iniciar uma transação", "START TRANSACTION;"],
    ["COMMIT", "Confirmar alterações", "COMMIT;"],
    ["ROLLBACK", "Desfazer alterações", "ROLLBACK;"],
    ["SAVEPOINT", "Marcar ponto na transação", "SAVEPOINT antes_update;"],
    ["ROLLBACK TO SAVEPOINT", "Voltar a um savepoint", "ROLLBACK TO SAVEPOINT antes_update;"],
    [
      "Transação completa",
      "Bloco transacional típico",
      `START TRANSACTION;
UPDATE produtos SET estoque = estoque - 1 WHERE id = 10;
INSERT INTO pedidos (id_cliente, total) VALUES (5, 99.90);
COMMIT;`,
    ],
  ]),
  ...build("Stored Procedures", [
    [
      "CREATE PROCEDURE",
      "Criar procedimento armazenado",
      `DELIMITER //
CREATE PROCEDURE sp_total_cliente(IN p_id INT)
BEGIN
  SELECT SUM(total) FROM pedidos WHERE id_cliente = p_id;
END //
DELIMITER ;`,
    ],
    ["CALL", "Executar procedure", "CALL sp_total_cliente(5);"],
    ["DROP PROCEDURE", "Remover procedure", "DROP PROCEDURE sp_total_cliente;"],
    [
      "CREATE FUNCTION",
      "Criar função que retorna valor",
      `CREATE FUNCTION fn_desconto(preco DECIMAL(10,2))
RETURNS DECIMAL(10,2) DETERMINISTIC
RETURN preco * 0.9;`,
    ],
    [
      "DECLARE / SET",
      "Declarar e atribuir variáveis locais",
      `DELIMITER //
CREATE PROCEDURE sp_calc()
BEGIN
  DECLARE v_total DECIMAL(10,2);
  SET v_total = (SELECT SUM(total) FROM pedidos);
  SELECT v_total;
END //
DELIMITER ;`,
    ],
    [
      "IF / ELSEIF / ELSE",
      "Fluxo condicional dentro de procedures",
      `DELIMITER //
CREATE PROCEDURE sp_classifica(IN p_total DECIMAL(10,2))
BEGIN
  IF p_total > 500 THEN
    SELECT 'Alto';
  ELSEIF p_total > 100 THEN
    SELECT 'Médio';
  ELSE
    SELECT 'Baixo';
  END IF;
END //
DELIMITER ;`,
    ],
  ]),
  ...build("Triggers", [
    [
      "CREATE TRIGGER (BEFORE)",
      "Disparar antes de uma operação",
      `CREATE TRIGGER trg_validar_preco
BEFORE INSERT ON produtos
FOR EACH ROW
SET NEW.preco = IF(NEW.preco < 0, 0, NEW.preco);`,
    ],
    [
      "CREATE TRIGGER (AFTER)",
      "Disparar após uma operação",
      `CREATE TRIGGER trg_log_pedido
AFTER INSERT ON pedidos
FOR EACH ROW
INSERT INTO log_pedidos(id_pedido, criado_em) VALUES (NEW.id, NOW());`,
    ],
    ["DROP TRIGGER", "Remover trigger", "DROP TRIGGER trg_log_pedido;"],
    ["SHOW TRIGGERS", "Listar triggers", "SHOW TRIGGERS;"],
  ]),
  ...build("DCL (Permissões)", [
    ["CREATE USER", "Criar usuário do banco", "CREATE USER 'app'@'%' IDENTIFIED BY 'senha_forte';"],
    ["GRANT", "Conceder privilégios", "GRANT SELECT, INSERT ON ecommerce.* TO 'app'@'%';"],
    ["GRANT ALL", "Conceder todos os privilégios", "GRANT ALL PRIVILEGES ON ecommerce.* TO 'admin'@'localhost';"],
    ["REVOKE", "Remover privilégios", "REVOKE INSERT ON ecommerce.* FROM 'app'@'%';"],
    ["FLUSH PRIVILEGES", "Recarregar tabela de privilégios", "FLUSH PRIVILEGES;"],
    ["DROP USER", "Remover usuário", "DROP USER 'app'@'%';"],
    ["SHOW GRANTS", "Ver privilégios de um usuário", "SHOW GRANTS FOR 'app'@'%';"],
  ]),
  ...build("Utilitários", [
    ["SHOW DATABASES", "Listar bancos de dados", "SHOW DATABASES;"],
    ["SHOW TABLES", "Listar tabelas do banco atual", "SHOW TABLES;"],
    ["DESCRIBE", "Estrutura de uma tabela", "DESCRIBE clientes;"],
    ["SHOW CREATE TABLE", "Ver DDL completo da tabela", "SHOW CREATE TABLE pedidos;"],
    ["EXPLAIN", "Analisar plano de execução", "EXPLAIN SELECT * FROM pedidos WHERE id_cliente = 5;"],
    ["SHOW PROCESSLIST", "Conexões/queries em execução", "SHOW PROCESSLIST;"],
    ["SHOW STATUS", "Status do servidor", "SHOW STATUS LIKE 'Threads_connected';"],
    ["SET", "Definir variável de sessão", "SET @meu_total = (SELECT SUM(total) FROM pedidos);"],
  ]),
];
