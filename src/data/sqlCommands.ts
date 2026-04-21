// AUTO-GENERATED from SQL_Referencia.html — do not edit by hand.
// Re-run /tmp/extract.mjs to regenerate.

export interface SqlRow {
  /** command label, e.g. "CREATE TABLE" */
  name: string;
  /** short description in pt-BR */
  description: string;
  /** runnable SQL example using the e-commerce schema */
  example: string;
}

export interface SqlGroup {
  id: string;
  label: string;
  full: string;
  note: string;
  color: string;
  bg: string;
  rows: SqlRow[];
}

export const SQL_GROUPS: SqlGroup[] = [
  {
    "id": "ddl",
    "label": "DDL",
    "full": "1. DDL — Data Definition Language",
    "note": "Criar, alterar e excluir estruturas (tabelas, colunas, bancos).",
    "color": "#58a6ff",
    "bg": "rgba(88,166,255,.12)",
    "rows": [
      {
        "name": "CREATE DATABASE",
        "description": "Criar um novo banco de dados",
        "example": "CREATE DATABASE ecommerce;"
      },
      {
        "name": "USE",
        "description": "Selecionar o banco a ser utilizado",
        "example": "USE ecommerce;"
      },
      {
        "name": "CREATE TABLE",
        "description": "Criar uma nova tabela",
        "example": "CREATE TABLE clientes (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nome VARCHAR(100) NOT NULL,\n  email VARCHAR(150) UNIQUE,\n  cidade VARCHAR(80),\n  estado CHAR(2),\n  data_cadastro DATE DEFAULT (CURRENT_DATE)\n);"
      },
      {
        "name": "CREATE TABLE (FK)",
        "description": "Criar tabela com chave estrangeira",
        "example": "CREATE TABLE pedidos (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  id_cliente INT NOT NULL,\n  data_pedido DATETIME DEFAULT NOW(),\n  status VARCHAR(20) DEFAULT 'pendente',\n  total DECIMAL(10,2),\n  FOREIGN KEY (id_cliente) REFERENCES clientes(id)\n);"
      },
      {
        "name": "CREATE TABLE ... AS SELECT",
        "description": "Criar tabela a partir de uma consulta",
        "example": "CREATE TABLE clientes_sp AS\n  SELECT * FROM clientes WHERE estado = 'SP';"
      },
      {
        "name": "ALTER TABLE ... ADD",
        "description": "Adicionar nova coluna",
        "example": "ALTER TABLE clientes ADD telefone VARCHAR(20);"
      },
      {
        "name": "ALTER TABLE ... DROP COLUMN",
        "description": "Remover uma coluna existente",
        "example": "ALTER TABLE clientes DROP COLUMN telefone;"
      },
      {
        "name": "ALTER TABLE ... MODIFY",
        "description": "Alterar o tipo de uma coluna",
        "example": "ALTER TABLE produtos MODIFY preco DECIMAL(12,2);"
      },
      {
        "name": "ALTER TABLE ... RENAME COLUMN",
        "description": "Renomear uma coluna",
        "example": "ALTER TABLE clientes RENAME COLUMN nome TO nome_completo;"
      },
      {
        "name": "DROP TABLE",
        "description": "Excluir uma tabela permanentemente",
        "example": "DROP TABLE clientes_sp;"
      },
      {
        "name": "DROP DATABASE",
        "description": "Excluir um banco de dados",
        "example": "DROP DATABASE ecommerce;"
      },
      {
        "name": "TRUNCATE TABLE",
        "description": "Limpar todos os dados (mantém a estrutura)",
        "example": "TRUNCATE TABLE itens_pedido;"
      },
      {
        "name": "RENAME TABLE",
        "description": "Renomear uma tabela",
        "example": "RENAME TABLE itens_pedido TO pedido_itens;"
      }
    ]
  },
  {
    "id": "dml",
    "label": "DML",
    "full": "2. DML — Data Manipulation Language",
    "note": "Consultar, inserir, atualizar e excluir dados.",
    "color": "#3fb950",
    "bg": "rgba(63,185,80,.12)",
    "rows": [
      {
        "name": "SELECT *",
        "description": "Selecionar todas as colunas da tabela",
        "example": "SELECT * FROM clientes;"
      },
      {
        "name": "SELECT colunas",
        "description": "Selecionar colunas específicas",
        "example": "SELECT nome, email, cidade FROM clientes;"
      },
      {
        "name": "INSERT INTO ... VALUES",
        "description": "Inserir um novo registro",
        "example": "INSERT INTO clientes (nome, email, cidade, estado)\nVALUES ('Ana Lima', 'ana@email.com', 'São Paulo', 'SP');"
      },
      {
        "name": "INSERT INTO ... (múltiplos)",
        "description": "Inserir vários registros de uma vez",
        "example": "INSERT INTO categorias (nome) VALUES\n  ('Eletrônicos'), ('Roupas'), ('Livros');"
      },
      {
        "name": "INSERT INTO ... SELECT",
        "description": "Inserir dados vindos de outra consulta",
        "example": "INSERT INTO clientes_vip (id_cliente)\n  SELECT id FROM clientes WHERE total_compras > 5000;"
      },
      {
        "name": "UPDATE ... SET",
        "description": "Atualizar dados de registros existentes",
        "example": "UPDATE produtos SET preco = preco * 1.10\n  WHERE id_categoria = 1;"
      },
      {
        "name": "UPDATE ... SET (múltiplos)",
        "description": "Atualizar várias colunas ao mesmo tempo",
        "example": "UPDATE pedidos\n  SET status = 'enviado', total = 250.00\n  WHERE id = 42;"
      },
      {
        "name": "DELETE FROM",
        "description": "Deletar registros que atendem à condição",
        "example": "DELETE FROM pedidos\n  WHERE status = 'cancelado'\n  AND data_pedido < '2023-01-01';"
      },
      {
        "name": "MERGE INTO",
        "description": "Inserir ou atualizar — upsert",
        "example": "MERGE INTO produtos p\nUSING novos_produtos n ON (p.id = n.id)\nWHEN MATCHED THEN UPDATE SET p.preco = n.preco\nWHEN NOT MATCHED THEN INSERT VALUES (n.id, n.nome, n.preco);"
      }
    ]
  },
  {
    "id": "dcl",
    "label": "DCL",
    "full": "3. DCL — Data Control Language",
    "note": "Gerenciar permissões e acessos de usuários.",
    "color": "#f0883e",
    "bg": "rgba(240,136,62,.12)",
    "rows": [
      {
        "name": "GRANT SELECT",
        "description": "Conceder permissão de leitura",
        "example": "GRANT SELECT ON ecommerce.clientes TO 'analista'@'localhost';"
      },
      {
        "name": "GRANT INSERT, UPDATE",
        "description": "Conceder permissões específicas",
        "example": "GRANT INSERT, UPDATE ON ecommerce.pedidos TO 'vendedor'@'localhost';"
      },
      {
        "name": "GRANT ALL",
        "description": "Conceder todas as permissões",
        "example": "GRANT ALL PRIVILEGES ON ecommerce.* TO 'admin'@'localhost';"
      },
      {
        "name": "GRANT ... WITH GRANT OPTION",
        "description": "Permitir que usuário repasse permissões",
        "example": "GRANT SELECT ON ecommerce.produtos TO 'gerente' WITH GRANT OPTION;"
      },
      {
        "name": "REVOKE",
        "description": "Revogar uma permissão concedida",
        "example": "REVOKE INSERT ON ecommerce.pedidos FROM 'vendedor'@'localhost';"
      },
      {
        "name": "REVOKE ALL",
        "description": "Revogar todas as permissões",
        "example": "REVOKE ALL PRIVILEGES ON ecommerce.* FROM 'ex_analista';"
      }
    ]
  },
  {
    "id": "tcl",
    "label": "TCL",
    "full": "4. TCL — Transaction Control Language",
    "note": "Controlar transações para garantir consistência dos dados.",
    "color": "#f85149",
    "bg": "rgba(248,81,73,.12)",
    "rows": [
      {
        "name": "BEGIN / START TRANSACTION",
        "description": "Iniciar uma transação explícita",
        "example": "START TRANSACTION;"
      },
      {
        "name": "COMMIT",
        "description": "Confirmar e salvar todas as operações",
        "example": "INSERT INTO pedidos (id_cliente, total) VALUES (5, 199.90);\nCOMMIT;"
      },
      {
        "name": "ROLLBACK",
        "description": "Desfazer todas as operações da transação",
        "example": "UPDATE produtos SET estoque = estoque - 1 WHERE id = 10;\nROLLBACK; -- desfaz, estoque volta ao original"
      },
      {
        "name": "SAVEPOINT",
        "description": "Criar ponto de restauração intermediário",
        "example": "SAVEPOINT antes_desconto;"
      },
      {
        "name": "ROLLBACK TO SAVEPOINT",
        "description": "Desfazer somente até o savepoint",
        "example": "UPDATE produtos SET preco = preco * 0.9;\nROLLBACK TO SAVEPOINT antes_desconto;"
      },
      {
        "name": "RELEASE SAVEPOINT",
        "description": "Remover um savepoint criado",
        "example": "RELEASE SAVEPOINT antes_desconto;"
      }
    ]
  },
  {
    "id": "select",
    "label": "SELECT",
    "full": "5. Cláusulas do SELECT",
    "note": "Filtrar, agrupar, ordenar, limitar e combinar resultados.",
    "color": "#adbac7",
    "bg": "rgba(173,186,199,.10)",
    "rows": [
      {
        "name": "WHERE",
        "description": "Filtrar linhas por uma condição",
        "example": "SELECT * FROM produtos WHERE preco > 100;"
      },
      {
        "name": "WHERE composto",
        "description": "Múltiplas condições combinadas",
        "example": "SELECT * FROM pedidos\n  WHERE status = 'pendente' AND total > 500;"
      },
      {
        "name": "GROUP BY",
        "description": "Agrupar linhas para usar com agregação",
        "example": "SELECT id_categoria, COUNT(*) AS qtd\n  FROM produtos GROUP BY id_categoria;"
      },
      {
        "name": "HAVING",
        "description": "Filtrar grupos — usado após GROUP BY",
        "example": "SELECT id_cliente, SUM(total) AS total_gasto\n  FROM pedidos GROUP BY id_cliente\n  HAVING SUM(total) > 1000;"
      },
      {
        "name": "ORDER BY ASC",
        "description": "Ordenar resultado crescente",
        "example": "SELECT * FROM produtos ORDER BY preco ASC;"
      },
      {
        "name": "ORDER BY DESC",
        "description": "Ordenar resultado decrescente",
        "example": "SELECT * FROM pedidos ORDER BY data_pedido DESC;"
      },
      {
        "name": "ORDER BY múltiplo",
        "description": "Ordenar por várias colunas",
        "example": "SELECT * FROM clientes ORDER BY estado ASC, nome ASC;"
      },
      {
        "name": "LIMIT",
        "description": "Limitar número de linhas",
        "example": "SELECT * FROM produtos ORDER BY preco DESC LIMIT 5;"
      },
      {
        "name": "LIMIT + OFFSET",
        "description": "Paginação — pular N linhas",
        "example": "SELECT * FROM produtos ORDER BY id LIMIT 10 OFFSET 20;"
      },
      {
        "name": "DISTINCT",
        "description": "Retornar apenas valores únicos",
        "example": "SELECT DISTINCT estado FROM clientes;"
      },
      {
        "name": "AS (alias coluna)",
        "description": "Renomear coluna no resultado",
        "example": "SELECT nome, preco * 1.1 AS preco_com_taxa FROM produtos;"
      },
      {
        "name": "AS (alias tabela)",
        "description": "Dar apelido a tabela na query",
        "example": "SELECT c.nome, p.total\n  FROM clientes c JOIN pedidos p ON c.id = p.id_cliente;"
      },
      {
        "name": "UNION",
        "description": "Combinar resultados sem duplicatas",
        "example": "SELECT cidade FROM clientes WHERE estado='SP'\nUNION\nSELECT cidade FROM fornecedores WHERE estado='SP';"
      },
      {
        "name": "UNION ALL",
        "description": "Combinar resultados mantendo duplicatas",
        "example": "SELECT id_produto FROM itens_pedido WHERE id_pedido=1\nUNION ALL\nSELECT id_produto FROM itens_pedido WHERE id_pedido=2;"
      },
      {
        "name": "INTERSECT",
        "description": "Retornar somente linhas em comum",
        "example": "SELECT id_cliente FROM pedidos WHERE status='entregue'\nINTERSECT\nSELECT id_cliente FROM pedidos WHERE status='pendente';"
      },
      {
        "name": "EXCEPT / MINUS",
        "description": "Diferença entre dois conjuntos",
        "example": "SELECT id FROM clientes\nEXCEPT\nSELECT id_cliente FROM pedidos; -- clientes sem pedido"
      },
      {
        "name": "TOP (SQL Server)",
        "description": "Retornar N primeiras linhas",
        "example": "SELECT TOP 10 * FROM produtos ORDER BY preco DESC;"
      },
      {
        "name": "FETCH FIRST (padrão SQL)",
        "description": "Limitar linhas no padrão ANSI",
        "example": "SELECT * FROM produtos ORDER BY preco DESC\n  FETCH FIRST 5 ROWS ONLY;"
      }
    ]
  },
  {
    "id": "operadores",
    "label": "Operadores",
    "full": "6. Operadores",
    "note": "Comparação, lógicos, aritméticos e especiais usados em condições.",
    "color": "#d29922",
    "bg": "rgba(210,153,34,.12)",
    "rows": [
      {
        "name": "=",
        "description": "Igual a",
        "example": "SELECT * FROM pedidos WHERE status = 'entregue';"
      },
      {
        "name": "<> ou !=",
        "description": "Diferente de",
        "example": "SELECT * FROM pedidos WHERE status <> 'cancelado';"
      },
      {
        "name": "> / <",
        "description": "Maior que / Menor que",
        "example": "SELECT * FROM produtos WHERE preco > 500;"
      },
      {
        "name": ">= / <=",
        "description": "Maior ou igual / Menor ou igual",
        "example": "SELECT * FROM itens_pedido WHERE quantidade >= 3;"
      },
      {
        "name": "AND",
        "description": "Ambas as condições verdadeiras",
        "example": "SELECT * FROM produtos WHERE preco > 100 AND estoque > 0;"
      },
      {
        "name": "OR",
        "description": "Pelo menos uma condição verdadeira",
        "example": "SELECT * FROM pedidos\n  WHERE status = 'pendente' OR status = 'processando';"
      },
      {
        "name": "NOT",
        "description": "Negação de uma condição",
        "example": "SELECT * FROM clientes WHERE NOT estado = 'SP';"
      },
      {
        "name": "IN (...)",
        "description": "Valor pertence a uma lista",
        "example": "SELECT * FROM pedidos\n  WHERE status IN ('pendente', 'processando', 'enviado');"
      },
      {
        "name": "NOT IN (...)",
        "description": "Valor não pertence à lista",
        "example": "SELECT * FROM produtos WHERE id_categoria NOT IN (2, 4);"
      },
      {
        "name": "BETWEEN ... AND",
        "description": "Valor dentro de um intervalo inclusivo",
        "example": "SELECT * FROM produtos WHERE preco BETWEEN 50 AND 200;"
      },
      {
        "name": "LIKE 'x%'",
        "description": "Começa com determinado texto",
        "example": "SELECT * FROM clientes WHERE nome LIKE 'Ana%';"
      },
      {
        "name": "LIKE '%x%'",
        "description": "Contém o texto em qualquer posição",
        "example": "SELECT * FROM produtos WHERE nome LIKE '%notebook%';"
      },
      {
        "name": "IS NULL",
        "description": "Verifica se o valor é nulo",
        "example": "SELECT * FROM clientes WHERE telefone IS NULL;"
      },
      {
        "name": "IS NOT NULL",
        "description": "Verifica se o valor não é nulo",
        "example": "SELECT * FROM pedidos WHERE data_envio IS NOT NULL;"
      },
      {
        "name": "EXISTS",
        "description": "Verdadeiro se subquery retorna ≥ 1 linha",
        "example": "SELECT nome FROM clientes c\n  WHERE EXISTS (\n    SELECT 1 FROM pedidos p WHERE p.id_cliente = c.id\n  );"
      },
      {
        "name": "ALL",
        "description": "Comparação com todos os valores da subquery",
        "example": "SELECT nome FROM produtos\n  WHERE preco > ALL (\n    SELECT preco FROM produtos WHERE id_categoria = 3\n  );"
      },
      {
        "name": "ANY / SOME",
        "description": "Verdadeiro se comparação com algum valor for true",
        "example": "SELECT nome FROM produtos\n  WHERE preco > ANY (\n    SELECT preco FROM produtos WHERE id_categoria = 2\n  );"
      },
      {
        "name": "+  -  *  /  %",
        "description": "Operadores aritméticos",
        "example": "SELECT nome, preco * quantidade AS subtotal\n  FROM itens_pedido ip JOIN produtos p ON ip.id_produto = p.id;"
      }
    ]
  },
  {
    "id": "agregacao",
    "label": "Agregação",
    "full": "7. Funções de Agregação",
    "note": "Operam sobre conjuntos de linhas e retornam um único valor resumido.",
    "color": "#58a6ff",
    "bg": "rgba(88,166,255,.10)",
    "rows": [
      {
        "name": "COUNT(*)",
        "description": "Contar total de linhas",
        "example": "SELECT COUNT(*) AS total_pedidos FROM pedidos;"
      },
      {
        "name": "COUNT(coluna)",
        "description": "Contar valores não nulos de uma coluna",
        "example": "SELECT COUNT(email) AS com_email FROM clientes;"
      },
      {
        "name": "COUNT(DISTINCT col)",
        "description": "Contar valores distintos",
        "example": "SELECT COUNT(DISTINCT id_cliente) AS compradores FROM pedidos;"
      },
      {
        "name": "SUM(coluna)",
        "description": "Somar os valores de uma coluna",
        "example": "SELECT SUM(total) AS receita FROM pedidos WHERE status = 'entregue';"
      },
      {
        "name": "AVG(coluna)",
        "description": "Calcular a média dos valores",
        "example": "SELECT AVG(total) AS ticket_medio FROM pedidos;"
      },
      {
        "name": "MAX(coluna)",
        "description": "Retornar o maior valor",
        "example": "SELECT MAX(preco) AS mais_caro FROM produtos;"
      },
      {
        "name": "MIN(coluna)",
        "description": "Retornar o menor valor",
        "example": "SELECT MIN(preco) AS mais_barato FROM produtos;"
      },
      {
        "name": "SUM + GROUP BY",
        "description": "Soma agrupada",
        "example": "SELECT id_categoria, SUM(preco * estoque) AS valor_estoque\n  FROM produtos GROUP BY id_categoria;"
      },
      {
        "name": "STDDEV()",
        "description": "Desvio padrão dos valores",
        "example": "SELECT STDDEV(total) AS desvio FROM pedidos;"
      },
      {
        "name": "GROUP_CONCAT() MySQL",
        "description": "Concatenar valores em um grupo",
        "example": "SELECT id_cliente, GROUP_CONCAT(id ORDER BY id) AS ids_pedidos\n  FROM pedidos GROUP BY id_cliente;"
      },
      {
        "name": "STRING_AGG() PostgreSQL/SQL Server",
        "description": "Concatenar com separador",
        "example": "SELECT id_cliente, STRING_AGG(CAST(id AS VARCHAR), ', ')\n  FROM pedidos GROUP BY id_cliente;"
      }
    ]
  },
  {
    "id": "string",
    "label": "String",
    "full": "8. Funções de String",
    "note": "Manipular, transformar, cortar e buscar padrões em textos.",
    "color": "#3fb950",
    "bg": "rgba(63,185,80,.10)",
    "rows": [
      {
        "name": "UPPER(col)",
        "description": "Converter texto para maiúsculas",
        "example": "SELECT UPPER(nome) FROM clientes;"
      },
      {
        "name": "LOWER(col)",
        "description": "Converter texto para minúsculas",
        "example": "SELECT LOWER(email) FROM clientes;"
      },
      {
        "name": "LENGTH(col)",
        "description": "Retornar o tamanho da string",
        "example": "SELECT nome, LENGTH(nome) AS tamanho FROM clientes;"
      },
      {
        "name": "CONCAT(a, b)",
        "description": "Concatenar strings",
        "example": "SELECT CONCAT(nome, ' - ', cidade) AS label FROM clientes;"
      },
      {
        "name": "CONCAT_WS(sep, ...)",
        "description": "Concatenar com separador definido",
        "example": "SELECT CONCAT_WS(', ', cidade, estado) AS local FROM clientes;"
      },
      {
        "name": "SUBSTRING(col, pos, len)",
        "description": "Extrair parte de uma string",
        "example": "SELECT SUBSTRING(email, 1, INSTR(email,'@')-1) AS usuario FROM clientes;"
      },
      {
        "name": "LEFT(col, n)",
        "description": "N primeiros caracteres",
        "example": "SELECT LEFT(nome, 10) AS nome_curto FROM clientes;"
      },
      {
        "name": "RIGHT(col, n)",
        "description": "N últimos caracteres",
        "example": "SELECT RIGHT(email, 10) AS dom_parcial FROM clientes;"
      },
      {
        "name": "TRIM(col)",
        "description": "Remover espaços nas duas extremidades",
        "example": "UPDATE clientes SET nome = TRIM(nome);"
      },
      {
        "name": "REPLACE(col, de, para)",
        "description": "Substituir texto dentro da string",
        "example": "UPDATE produtos SET nome = REPLACE(nome, 'USB-C', 'Tipo-C');"
      },
      {
        "name": "INSTR(col, str)",
        "description": "Posição de uma substring",
        "example": "SELECT INSTR(email, '@') AS pos_arroba FROM clientes;"
      },
      {
        "name": "REVERSE(col)",
        "description": "Inverter a string",
        "example": "SELECT REVERSE(nome) FROM clientes LIMIT 3;"
      },
      {
        "name": "LPAD(col, n, pad)",
        "description": "Preencher à esquerda até N caracteres",
        "example": "SELECT LPAD(CAST(id AS CHAR), 6, '0') AS id_fmt FROM pedidos;"
      },
      {
        "name": "RPAD(col, n, pad)",
        "description": "Preencher à direita até N caracteres",
        "example": "SELECT RPAD(nome, 30, '.') AS nome_fmt FROM produtos;"
      },
      {
        "name": "FORMAT(col, n)",
        "description": "Formatar número com N casas decimais",
        "example": "SELECT nome, FORMAT(preco, 2) AS preco_br FROM produtos;"
      }
    ]
  },
  {
    "id": "matematica",
    "label": "Matemática",
    "full": "9. Funções Matemáticas",
    "note": "Arredondamento, potências, módulo e outros cálculos numéricos.",
    "color": "#f85149",
    "bg": "rgba(248,81,73,.10)",
    "rows": [
      {
        "name": "ROUND(col, n)",
        "description": "Arredondar para N casas decimais",
        "example": "SELECT ROUND(preco, 2) AS preco_arred FROM produtos;"
      },
      {
        "name": "CEIL(col)",
        "description": "Arredondar para cima (teto)",
        "example": "SELECT CEIL(total) AS total_teto FROM pedidos;"
      },
      {
        "name": "FLOOR(col)",
        "description": "Arredondar para baixo (piso)",
        "example": "SELECT FLOOR(preco) AS preco_piso FROM produtos;"
      },
      {
        "name": "ABS(col)",
        "description": "Valor absoluto (sem sinal)",
        "example": "SELECT ABS(preco - 100) AS dif_de_100 FROM produtos;"
      },
      {
        "name": "MOD(a, b)",
        "description": "Resto da divisão inteira",
        "example": "SELECT id, MOD(id, 2) AS par_impar FROM pedidos;"
      },
      {
        "name": "POWER(base, exp)",
        "description": "Elevar à potência",
        "example": "SELECT POWER(total, 2) AS total_quad FROM pedidos LIMIT 5;"
      },
      {
        "name": "SQRT(col)",
        "description": "Raiz quadrada",
        "example": "SELECT SQRT(total) AS raiz_total FROM pedidos;"
      },
      {
        "name": "RAND()",
        "description": "Número aleatório entre 0 e 1",
        "example": "SELECT * FROM produtos ORDER BY RAND() LIMIT 3;"
      },
      {
        "name": "SIGN(col)",
        "description": "Retorna -1, 0 ou 1 conforme o sinal",
        "example": "SELECT total, SIGN(total - 500) AS acima_500 FROM pedidos;"
      }
    ]
  },
  {
    "id": "data",
    "label": "Data / Hora",
    "full": "10. Funções de Data e Hora",
    "note": "Obter, calcular e formatar datas e horas.",
    "color": "#bc8cff",
    "bg": "rgba(188,140,255,.10)",
    "rows": [
      {
        "name": "NOW()",
        "description": "Data e hora atuais",
        "example": "INSERT INTO pedidos (id_cliente, data_pedido) VALUES (7, NOW());"
      },
      {
        "name": "CURDATE()",
        "description": "Data atual sem hora",
        "example": "SELECT * FROM pedidos WHERE DATE(data_pedido) = CURDATE();"
      },
      {
        "name": "YEAR(data)",
        "description": "Extrair o ano",
        "example": "SELECT YEAR(data_cadastro) AS ano, COUNT(*) FROM clientes GROUP BY ano;"
      },
      {
        "name": "MONTH(data)",
        "description": "Extrair o mês",
        "example": "SELECT MONTH(data_pedido) AS mes, SUM(total) FROM pedidos GROUP BY mes;"
      },
      {
        "name": "DAY(data)",
        "description": "Extrair o dia",
        "example": "SELECT DAY(data_pedido) AS dia, COUNT(*) FROM pedidos GROUP BY dia;"
      },
      {
        "name": "HOUR(data)",
        "description": "Extrair a hora",
        "example": "SELECT HOUR(data_pedido) AS hora, COUNT(*) FROM pedidos GROUP BY hora;"
      },
      {
        "name": "EXTRACT(part FROM date)",
        "description": "Extrair parte da data — padrão SQL",
        "example": "SELECT EXTRACT(YEAR FROM data_pedido) AS ano,\n  SUM(total) FROM pedidos GROUP BY ano;"
      },
      {
        "name": "DATEDIFF(d1, d2)",
        "description": "Diferença em dias entre duas datas",
        "example": "SELECT id, DATEDIFF(NOW(), data_pedido) AS dias_em_aberto\n  FROM pedidos WHERE status = 'pendente';"
      },
      {
        "name": "DATE_ADD(data, INTERVAL n u)",
        "description": "Adicionar intervalo a uma data",
        "example": "SELECT id, DATE_ADD(data_pedido, INTERVAL 7 DAY) AS prazo\n  FROM pedidos;"
      },
      {
        "name": "DATE_SUB(data, INTERVAL n u)",
        "description": "Subtrair intervalo de uma data",
        "example": "SELECT * FROM clientes\n  WHERE data_cadastro > DATE_SUB(NOW(), INTERVAL 30 DAY);"
      },
      {
        "name": "DATE_FORMAT(data, fmt)",
        "description": "Formatar data como texto",
        "example": "SELECT DATE_FORMAT(data_pedido, '%d/%m/%Y %H:%i') AS data_br\n  FROM pedidos;"
      },
      {
        "name": "TIMESTAMPDIFF(u, d1, d2)",
        "description": "Diferença em unidade específica",
        "example": "SELECT nome,\n  TIMESTAMPDIFF(DAY, data_cadastro, NOW()) AS dias_cliente\n  FROM clientes;"
      },
      {
        "name": "DATEPART() SQL Server",
        "description": "Extrair parte da data — SQL Server",
        "example": "SELECT DATEPART(MONTH, data_pedido) AS mes, SUM(total)\n  FROM pedidos GROUP BY DATEPART(MONTH, data_pedido);"
      },
      {
        "name": "DATEADD() SQL Server",
        "description": "Adicionar intervalo — SQL Server",
        "example": "SELECT id, DATEADD(DAY, 7, data_pedido) AS prazo\n  FROM pedidos;"
      }
    ]
  },
  {
    "id": "conversao",
    "label": "Conversão",
    "full": "11. Conversão e Nulos",
    "note": "Converter tipos de dados e tratar valores nulos com segurança.",
    "color": "#d29922",
    "bg": "rgba(210,153,34,.10)",
    "rows": [
      {
        "name": "CAST(val AS tipo)",
        "description": "Converter para outro tipo — padrão SQL",
        "example": "SELECT CAST(preco AS CHAR) AS preco_texto FROM produtos;"
      },
      {
        "name": "CONVERT()",
        "description": "Converter tipo — SQL Server / MySQL",
        "example": "SELECT CONVERT(CHAR, preco) FROM produtos; -- SQL Server\nSELECT CONVERT(preco, CHAR); -- MySQL"
      },
      {
        "name": "COALESCE(a, b, c...)",
        "description": "Primeiro valor não nulo da lista",
        "example": "SELECT nome,\n  COALESCE(telefone, email, 'sem contato') AS contato\n  FROM clientes;"
      },
      {
        "name": "NULLIF(a, b)",
        "description": "Retorna NULL se a = b, senão retorna a",
        "example": "SELECT nome,\n  NULLIF(estoque, 0) AS estoque_real\n  FROM produtos; -- NULL em vez de zero"
      },
      {
        "name": "ISNULL() SQL Server",
        "description": "Substituir NULL — SQL Server",
        "example": "SELECT ISNULL(telefone, 'N/A') AS telefone FROM clientes;"
      },
      {
        "name": "IFNULL() MySQL",
        "description": "Substituir NULL — MySQL",
        "example": "SELECT IFNULL(telefone, 'N/A') AS telefone FROM clientes;"
      },
      {
        "name": "NVL() Oracle",
        "description": "Substituir NULL — Oracle",
        "example": "SELECT NVL(telefone, 'N/A') AS telefone FROM clientes;"
      },
      {
        "name": "TO_DATE() PostgreSQL/Oracle",
        "description": "Converter string em data",
        "example": "SELECT TO_DATE('25/12/2024', 'DD/MM/YYYY');"
      },
      {
        "name": "TO_CHAR() PostgreSQL/Oracle",
        "description": "Converter número/data em string",
        "example": "SELECT TO_CHAR(preco, 'FM999G999D99') FROM produtos;"
      }
    ]
  },
  {
    "id": "condicional",
    "label": "Condicional",
    "full": "12. Funções Condicionais",
    "note": "Lógica if/else inline dentro de consultas SQL.",
    "color": "#39c5cf",
    "bg": "rgba(57,197,207,.10)",
    "rows": [
      {
        "name": "CASE WHEN ... THEN ... ELSE ... END",
        "description": "Condicional com expressão livre",
        "example": "SELECT nome, preco,\n  CASE\n    WHEN preco < 50  THEN 'Barato'\n    WHEN preco <= 200 THEN 'Médio'\n    ELSE 'Caro'\n  END AS faixa_preco\nFROM produtos;"
      },
      {
        "name": "CASE col WHEN val THEN ... END",
        "description": "Condicional baseada em valor fixo",
        "example": "SELECT id, status,\n  CASE status\n    WHEN 'pendente' THEN '⏳ Aguardando'\n    WHEN 'enviado'  THEN '🚚 A caminho'\n    WHEN 'entregue' THEN '✅ Entregue'\n    ELSE '❌ Cancelado'\n  END AS label\nFROM pedidos;"
      },
      {
        "name": "CASE em ORDER BY",
        "description": "Ordenar com lógica condicional",
        "example": "SELECT * FROM pedidos ORDER BY\n  CASE status\n    WHEN 'urgente'  THEN 1\n    WHEN 'pendente' THEN 2\n    ELSE 3\n  END;"
      },
      {
        "name": "CASE em UPDATE",
        "description": "Atualizar com base em condição",
        "example": "UPDATE produtos SET preco = preco *\n  CASE\n    WHEN id_categoria = 1 THEN 1.10\n    WHEN id_categoria = 2 THEN 1.05\n    ELSE 1.0\n  END;"
      },
      {
        "name": "IIF() SQL Server",
        "description": "Condicional inline curta",
        "example": "SELECT nome,\n  IIF(estoque > 0, 'Disponível', 'Indisponível') AS disp\nFROM produtos;"
      }
    ]
  },
  {
    "id": "joins",
    "label": "JOINs",
    "full": "13. JOINs — Combinações de Tabelas",
    "note": "Diferentes formas de combinar dados de duas ou mais tabelas.",
    "color": "#bc8cff",
    "bg": "rgba(188,140,255,.12)",
    "rows": [
      {
        "name": "INNER JOIN",
        "description": "Apenas registros existentes nas duas tabelas",
        "example": "SELECT c.nome, p.id AS pedido, p.total\n  FROM clientes c\n  INNER JOIN pedidos p ON c.id = p.id_cliente;"
      },
      {
        "name": "LEFT JOIN",
        "description": "Todos da esquerda + correspondentes da direita",
        "example": "SELECT c.nome, p.id AS pedido\n  FROM clientes c\n  LEFT JOIN pedidos p ON c.id = p.id_cliente;\n-- Inclui clientes sem nenhum pedido (NULL)"
      },
      {
        "name": "RIGHT JOIN",
        "description": "Todos da direita + correspondentes da esquerda",
        "example": "SELECT c.nome, p.id\n  FROM clientes c\n  RIGHT JOIN pedidos p ON c.id = p.id_cliente;"
      },
      {
        "name": "FULL JOIN",
        "description": "Todos de ambas as tabelas",
        "example": "SELECT c.nome, p.id\n  FROM clientes c\n  FULL JOIN pedidos p ON c.id = p.id_cliente;"
      },
      {
        "name": "CROSS JOIN",
        "description": "Produto cartesiano — combina tudo com tudo",
        "example": "SELECT c.nome, cat.nome AS categoria\n  FROM clientes c\n  CROSS JOIN categorias cat;"
      },
      {
        "name": "SELF JOIN",
        "description": "Tabela se juntando com ela mesma",
        "example": "SELECT p1.nome AS produto, p2.nome AS similar\n  FROM produtos p1\n  JOIN produtos p2\n    ON p1.id_categoria = p2.id_categoria\n   AND p1.id <> p2.id;"
      },
      {
        "name": "JOIN em 3 tabelas",
        "description": "Encadear múltiplos JOINs",
        "example": "SELECT c.nome, p.id AS pedido,\n       pr.nome AS produto, ip.quantidade\n  FROM clientes c\n  JOIN pedidos p      ON c.id = p.id_cliente\n  JOIN itens_pedido ip ON p.id = ip.id_pedido\n  JOIN produtos pr    ON ip.id_produto = pr.id;"
      },
      {
        "name": "JOIN com subquery",
        "description": "JOIN com resultado de subconsulta",
        "example": "SELECT c.nome, t.total_gasto\n  FROM clientes c\n  JOIN (\n    SELECT id_cliente, SUM(total) AS total_gasto\n    FROM pedidos GROUP BY id_cliente\n  ) t ON c.id = t.id_cliente;"
      }
    ]
  },
  {
    "id": "subquery",
    "label": "Subqueries",
    "full": "14. Subqueries (Subconsultas)",
    "note": "Consultas dentro de consultas — escalares, de tabela, correlacionadas, EXISTS.",
    "color": "#f0883e",
    "bg": "rgba(240,136,62,.10)",
    "rows": [
      {
        "name": "Escalar (1 valor)",
        "description": "Subquery que retorna um único valor",
        "example": "SELECT nome, preco,\n  (SELECT AVG(preco) FROM produtos) AS media\nFROM produtos;"
      },
      {
        "name": "Comparação escalar",
        "description": "Filtrar com base em valor calculado",
        "example": "SELECT * FROM produtos\n  WHERE preco > (SELECT AVG(preco) FROM produtos);"
      },
      {
        "name": "IN com subquery",
        "description": "Filtrar pelo resultado de outra consulta",
        "example": "SELECT nome FROM clientes\n  WHERE id IN (\n    SELECT id_cliente FROM pedidos WHERE status = 'entregue'\n  );"
      },
      {
        "name": "NOT IN com subquery",
        "description": "Excluir registros da subquery",
        "example": "SELECT nome FROM clientes\n  WHERE id NOT IN (\n    SELECT DISTINCT id_cliente FROM pedidos\n  );\n-- Clientes que nunca compraram"
      },
      {
        "name": "EXISTS",
        "description": "Verdadeiro se subquery retorna ≥ 1 linha",
        "example": "SELECT c.nome FROM clientes c\n  WHERE EXISTS (\n    SELECT 1 FROM pedidos p\n    WHERE p.id_cliente = c.id\n      AND p.status = 'pendente'\n  );"
      },
      {
        "name": "NOT EXISTS",
        "description": "Verdadeiro se subquery não retorna nada",
        "example": "SELECT c.nome FROM clientes c\n  WHERE NOT EXISTS (\n    SELECT 1 FROM pedidos p WHERE p.id_cliente = c.id\n  );\n-- Clientes sem nenhum pedido"
      },
      {
        "name": "Tabela derivada (no FROM)",
        "description": "Subquery usada como tabela temporária",
        "example": "SELECT estado, AVG(total_cliente) AS media\n  FROM (\n    SELECT c.estado, SUM(p.total) AS total_cliente\n    FROM clientes c JOIN pedidos p ON c.id = p.id_cliente\n    GROUP BY c.id, c.estado\n  ) t\n  GROUP BY estado;"
      },
      {
        "name": "Correlacionada",
        "description": "Subquery que referencia a query externa",
        "example": "SELECT p.id, p.total,\n  (SELECT COUNT(*) FROM itens_pedido ip\n   WHERE ip.id_pedido = p.id) AS qtd_itens\nFROM pedidos p;"
      },
      {
        "name": "ALL",
        "description": "Compara com todos os valores da subquery",
        "example": "SELECT nome FROM produtos\n  WHERE preco > ALL (\n    SELECT preco FROM produtos WHERE id_categoria = 2\n  );"
      },
      {
        "name": "ANY / SOME",
        "description": "Verdadeiro se comparação com algum for true",
        "example": "SELECT nome FROM produtos\n  WHERE preco > ANY (\n    SELECT preco FROM produtos WHERE id_categoria = 3\n  );"
      }
    ]
  },
  {
    "id": "window",
    "label": "Window Fn",
    "full": "15. Window Functions (Funções de Janela)",
    "note": "Funções analíticas que operam sobre janelas de linhas sem colapsar o resultado.",
    "color": "#58a6ff",
    "bg": "rgba(88,166,255,.14)",
    "rows": [
      {
        "name": "OVER ()",
        "description": "Aplicar função sobre todas as linhas",
        "example": "SELECT nome, total,\n  AVG(total) OVER () AS media_geral\nFROM pedidos;"
      },
      {
        "name": "PARTITION BY",
        "description": "Dividir em partições por coluna",
        "example": "SELECT c.nome, p.total,\n  SUM(p.total) OVER (PARTITION BY c.estado) AS total_estado\nFROM clientes c JOIN pedidos p ON c.id = p.id_cliente;"
      },
      {
        "name": "ORDER BY (dentro OVER)",
        "description": "Ordenar dentro da janela",
        "example": "SELECT id, total,\n  RANK() OVER (ORDER BY total DESC) AS ranking\nFROM pedidos;"
      },
      {
        "name": "ROW_NUMBER()",
        "description": "Número de linha único por partição",
        "example": "SELECT ROW_NUMBER() OVER\n    (PARTITION BY id_cliente ORDER BY data_pedido DESC) AS ordem,\n  id_cliente, total\nFROM pedidos;"
      },
      {
        "name": "RANK()",
        "description": "Posição com saltos em empates",
        "example": "SELECT nome, preco,\n  RANK() OVER (ORDER BY preco DESC) AS rank_preco\nFROM produtos;"
      },
      {
        "name": "DENSE_RANK()",
        "description": "Posição sem saltos em empates",
        "example": "SELECT nome, preco,\n  DENSE_RANK() OVER (ORDER BY preco DESC) AS rank_denso\nFROM produtos;"
      },
      {
        "name": "NTILE(n)",
        "description": "Distribuir linhas em N grupos iguais",
        "example": "SELECT nome, total,\n  NTILE(4) OVER (ORDER BY total) AS quartil\nFROM pedidos;"
      },
      {
        "name": "LAG(col, n)",
        "description": "Valor de N linhas anteriores",
        "example": "SELECT id, total,\n  LAG(total, 1) OVER (ORDER BY data_pedido) AS pedido_ant\nFROM pedidos WHERE id_cliente = 3;"
      },
      {
        "name": "LEAD(col, n)",
        "description": "Valor de N linhas à frente",
        "example": "SELECT id, total,\n  LEAD(total, 1) OVER (ORDER BY data_pedido) AS proximo\nFROM pedidos WHERE id_cliente = 3;"
      },
      {
        "name": "FIRST_VALUE(col)",
        "description": "Primeiro valor na janela ordenada",
        "example": "SELECT nome,\n  FIRST_VALUE(nome) OVER (ORDER BY preco DESC) AS mais_caro\nFROM produtos;"
      },
      {
        "name": "SUM() acumulado",
        "description": "Soma acumulada ao longo do tempo",
        "example": "SELECT data_pedido, total,\n  SUM(total) OVER (\n    ORDER BY data_pedido\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS acumulado\nFROM pedidos;"
      },
      {
        "name": "AVG() média móvel",
        "description": "Média dos últimos N registros",
        "example": "SELECT data_pedido, total,\n  AVG(total) OVER (\n    ORDER BY data_pedido\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS media_movel_3\nFROM pedidos;"
      },
      {
        "name": "ROWS BETWEEN",
        "description": "Frame da janela por linhas",
        "example": "-- Soma de todas as anteriores + atual:\nROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW"
      }
    ]
  },
  {
    "id": "cte",
    "label": "CTEs",
    "full": "16. CTEs — Common Table Expressions",
    "note": "Consultas nomeadas temporárias para organizar queries complexas. Suportam recursão.",
    "color": "#3fb950",
    "bg": "rgba(63,185,80,.12)",
    "rows": [
      {
        "name": "WITH cte AS (...)",
        "description": "CTE simples — subquery nomeada",
        "example": "WITH pedidos_grandes AS (\n  SELECT * FROM pedidos WHERE total > 500\n)\nSELECT c.nome, p.total\n  FROM clientes c\n  JOIN pedidos_grandes p ON c.id = p.id_cliente;"
      },
      {
        "name": "CTEs encadeadas",
        "description": "Várias CTEs na mesma query",
        "example": "WITH\n  totais AS (\n    SELECT id_cliente, SUM(total) AS total_gasto\n    FROM pedidos GROUP BY id_cliente\n  ),\n  vip AS (\n    SELECT * FROM totais WHERE total_gasto > 2000\n  )\nSELECT c.nome, v.total_gasto\n  FROM clientes c JOIN vip v ON c.id = v.id_cliente;"
      },
      {
        "name": "WITH RECURSIVE",
        "description": "CTE recursiva — hierarquias e sequências",
        "example": "WITH RECURSIVE seq AS (\n  SELECT 1 AS n\n  UNION ALL\n  SELECT n + 1 FROM seq WHERE n < 10\n)\nSELECT * FROM seq; -- gera 1 a 10"
      }
    ]
  },
  {
    "id": "views",
    "label": "Views",
    "full": "17. Views",
    "note": "Consultas salvas como objetos do banco, reutilizáveis como tabelas.",
    "color": "#f0883e",
    "bg": "rgba(240,136,62,.12)",
    "rows": [
      {
        "name": "CREATE VIEW",
        "description": "Criar uma view — consulta salva",
        "example": "CREATE VIEW vw_pedidos_completos AS\n  SELECT c.nome AS cliente,\n         p.id AS pedido,\n         p.total, p.status, p.data_pedido\n  FROM clientes c\n  JOIN pedidos p ON c.id = p.id_cliente;"
      },
      {
        "name": "CREATE OR REPLACE VIEW",
        "description": "Criar ou substituir view existente",
        "example": "CREATE OR REPLACE VIEW vw_produtos_disponiveis AS\n  SELECT * FROM produtos WHERE estoque > 0;"
      },
      {
        "name": "SELECT em view",
        "description": "Consultar view como se fosse tabela",
        "example": "SELECT * FROM vw_pedidos_completos\n  WHERE status = 'pendente';"
      },
      {
        "name": "DROP VIEW",
        "description": "Excluir uma view",
        "example": "DROP VIEW vw_pedidos_completos;"
      },
      {
        "name": "WITH CHECK OPTION",
        "description": "Impedir inserção fora do filtro da view",
        "example": "CREATE VIEW vw_ativos AS\n  SELECT * FROM clientes WHERE ativo = 1\n  WITH CHECK OPTION;"
      }
    ]
  },
  {
    "id": "procedures",
    "label": "Procedures",
    "full": "18. Stored Procedures e Functions",
    "note": "Blocos de código SQL reutilizáveis armazenados no banco.",
    "color": "#f85149",
    "bg": "rgba(248,81,73,.10)",
    "rows": [
      {
        "name": "CREATE PROCEDURE",
        "description": "Criar stored procedure",
        "example": "CREATE PROCEDURE sp_pedidos_cliente(IN p_id INT)\nBEGIN\n  SELECT * FROM pedidos\n  WHERE id_cliente = p_id\n  ORDER BY data_pedido DESC;\nEND;"
      },
      {
        "name": "CALL",
        "description": "Executar uma stored procedure",
        "example": "CALL sp_pedidos_cliente(7);"
      },
      {
        "name": "EXEC (SQL Server)",
        "description": "Executar procedure no SQL Server",
        "example": "EXEC sp_pedidos_cliente @p_id = 7;"
      },
      {
        "name": "DROP PROCEDURE",
        "description": "Excluir stored procedure",
        "example": "DROP PROCEDURE sp_pedidos_cliente;"
      },
      {
        "name": "CREATE FUNCTION",
        "description": "Criar função escalar reutilizável",
        "example": "CREATE FUNCTION fn_total_cliente(p_id INT)\nRETURNS DECIMAL(10,2)\nBEGIN\n  DECLARE v_total DECIMAL(10,2);\n  SELECT SUM(total) INTO v_total\n  FROM pedidos WHERE id_cliente = p_id;\n  RETURN v_total;\nEND;"
      },
      {
        "name": "Usar função criada",
        "description": "Chamar a função em uma query",
        "example": "SELECT nome, fn_total_cliente(id) AS total_gasto\n  FROM clientes;"
      },
      {
        "name": "IN / OUT / INOUT",
        "description": "Tipos de parâmetros de procedure",
        "example": "CREATE PROCEDURE sp_resumo(\n  IN  p_id    INT,\n  OUT p_total DECIMAL(10,2)\n)\nBEGIN\n  SELECT SUM(total) INTO p_total\n  FROM pedidos WHERE id_cliente = p_id;\nEND;"
      },
      {
        "name": "DECLARE + SET",
        "description": "Declarar e usar variável local",
        "example": "DECLARE v_media DECIMAL(10,2);\nSET v_media = (SELECT AVG(total) FROM pedidos);\nSELECT * FROM pedidos WHERE total > v_media;"
      },
      {
        "name": "IF / ELSEIF / ELSE",
        "description": "Condicional dentro de procedure",
        "example": "IF v_total > 5000 THEN\n  SET v_cat = 'VIP';\nELSEIF v_total > 1000 THEN\n  SET v_cat = 'Premium';\nELSE\n  SET v_cat = 'Regular';\nEND IF;"
      },
      {
        "name": "WHILE loop",
        "description": "Laço de repetição em procedure",
        "example": "WHILE v_contador < 10 DO\n  INSERT INTO log_teste (valor) VALUES (v_contador);\n  SET v_contador = v_contador + 1;\nEND WHILE;"
      }
    ]
  },
  {
    "id": "triggers",
    "label": "Triggers",
    "full": "19. Triggers",
    "note": "Código disparado automaticamente em resposta a INSERT, UPDATE ou DELETE.",
    "color": "#bc8cff",
    "bg": "rgba(188,140,255,.10)",
    "rows": [
      {
        "name": "BEFORE INSERT",
        "description": "Executar antes de inserção",
        "example": "CREATE TRIGGER tg_pedido_before_insert\nBEFORE INSERT ON pedidos\nFOR EACH ROW\n  SET NEW.data_pedido = NOW();"
      },
      {
        "name": "AFTER INSERT",
        "description": "Executar depois de inserção",
        "example": "CREATE TRIGGER tg_item_after_insert\nAFTER INSERT ON itens_pedido\nFOR EACH ROW\n  UPDATE produtos\n  SET estoque = estoque - NEW.quantidade\n  WHERE id = NEW.id_produto;"
      },
      {
        "name": "BEFORE UPDATE",
        "description": "Executar antes de atualização",
        "example": "CREATE TRIGGER tg_produto_before_update\nBEFORE UPDATE ON produtos\nFOR EACH ROW\n  SET NEW.atualizado_em = NOW();"
      },
      {
        "name": "AFTER UPDATE",
        "description": "Executar depois de atualização",
        "example": "CREATE TRIGGER tg_pedido_after_update\nAFTER UPDATE ON pedidos\nFOR EACH ROW\n  INSERT INTO log_pedidos (id_pedido, status_ant, status_novo, dt)\n  VALUES (OLD.id, OLD.status, NEW.status, NOW());"
      },
      {
        "name": "BEFORE DELETE",
        "description": "Executar antes de exclusão",
        "example": "CREATE TRIGGER tg_pedido_before_delete\nBEFORE DELETE ON pedidos\nFOR EACH ROW\n  INSERT INTO pedidos_excluidos SELECT * FROM pedidos WHERE id = OLD.id;"
      },
      {
        "name": "DROP TRIGGER",
        "description": "Excluir um trigger",
        "example": "DROP TRIGGER tg_item_after_insert;"
      },
      {
        "name": "NEW / OLD",
        "description": "Acessar valores novos e antigos",
        "example": "-- NEW: valor após INSERT/UPDATE\n-- OLD: valor antes de UPDATE/DELETE\nSET NEW.total = NEW.quantidade * NEW.preco_unitario;"
      }
    ]
  },
  {
    "id": "indices",
    "label": "Índices",
    "full": "20. Índices e Performance",
    "note": "Estruturas que aceleram buscas e ferramentas para analisar performance.",
    "color": "#3fb950",
    "bg": "rgba(63,185,80,.10)",
    "rows": [
      {
        "name": "CREATE INDEX",
        "description": "Criar índice simples",
        "example": "CREATE INDEX idx_cliente_email ON clientes(email);"
      },
      {
        "name": "CREATE UNIQUE INDEX",
        "description": "Índice que garante unicidade",
        "example": "CREATE UNIQUE INDEX idx_produto_nome ON produtos(nome);"
      },
      {
        "name": "CREATE INDEX composto",
        "description": "Índice com múltiplas colunas",
        "example": "CREATE INDEX idx_pedido_cliente_data\n  ON pedidos(id_cliente, data_pedido);"
      },
      {
        "name": "DROP INDEX",
        "description": "Excluir um índice",
        "example": "DROP INDEX idx_cliente_email ON clientes;"
      },
      {
        "name": "EXPLAIN",
        "description": "Analisar plano de execução",
        "example": "EXPLAIN SELECT * FROM pedidos\n  WHERE id_cliente = 5 AND status = 'pendente';"
      },
      {
        "name": "EXPLAIN ANALYZE",
        "description": "Executar e analisar o plano real",
        "example": "EXPLAIN ANALYZE\n  SELECT c.nome, SUM(p.total)\n  FROM clientes c JOIN pedidos p ON c.id = p.id_cliente\n  GROUP BY c.id;"
      },
      {
        "name": "SHOW INDEX (MySQL)",
        "description": "Listar índices de uma tabela",
        "example": "SHOW INDEX FROM pedidos;"
      }
    ]
  },
  {
    "id": "constraints",
    "label": "Constraints",
    "full": "21. Constraints (Restrições)",
    "note": "Regras aplicadas às colunas para garantir qualidade e consistência dos dados.",
    "color": "#58a6ff",
    "bg": "rgba(88,166,255,.10)",
    "rows": [
      {
        "name": "PRIMARY KEY",
        "description": "Chave primária: único + não nulo",
        "example": "id INT AUTO_INCREMENT PRIMARY KEY"
      },
      {
        "name": "FOREIGN KEY",
        "description": "Chave estrangeira com referência",
        "example": "id_cliente INT,\nFOREIGN KEY (id_cliente) REFERENCES clientes(id)"
      },
      {
        "name": "UNIQUE",
        "description": "Garante valores únicos na coluna",
        "example": "email VARCHAR(150) UNIQUE"
      },
      {
        "name": "NOT NULL",
        "description": "Coluna não aceita valor nulo",
        "example": "nome VARCHAR(100) NOT NULL"
      },
      {
        "name": "CHECK",
        "description": "Impõe uma regra de validação",
        "example": "preco DECIMAL(10,2) CHECK (preco >= 0),\nquantidade INT CHECK (quantidade > 0)"
      },
      {
        "name": "DEFAULT",
        "description": "Valor padrão quando não informado",
        "example": "status VARCHAR(20) DEFAULT 'pendente',\ndata_pedido DATETIME DEFAULT NOW()"
      },
      {
        "name": "ON DELETE CASCADE",
        "description": "Excluir filhos ao excluir o pai",
        "example": "FOREIGN KEY (id_pedido) REFERENCES pedidos(id)\n  ON DELETE CASCADE"
      },
      {
        "name": "ON UPDATE CASCADE",
        "description": "Atualizar FK ao atualizar a PK pai",
        "example": "FOREIGN KEY (id_cliente) REFERENCES clientes(id)\n  ON UPDATE CASCADE"
      },
      {
        "name": "ON DELETE SET NULL",
        "description": "Setar NULL na FK ao excluir o pai",
        "example": "FOREIGN KEY (id_cliente) REFERENCES clientes(id)\n  ON DELETE SET NULL"
      }
    ]
  },
  {
    "id": "tipos",
    "label": "Tipos",
    "full": "22. Tipos de Dados",
    "note": "Principais tipos disponíveis em MySQL, PostgreSQL e SQL Server.",
    "color": "#adbac7",
    "bg": "rgba(173,186,199,.08)",
    "rows": [
      {
        "name": "INT / INTEGER",
        "description": "Número inteiro (−2B a 2B)",
        "example": "id INT AUTO_INCREMENT PRIMARY KEY"
      },
      {
        "name": "BIGINT",
        "description": "Inteiro grande (−9 quad a 9 quad)",
        "example": "views BIGINT DEFAULT 0"
      },
      {
        "name": "SMALLINT / TINYINT",
        "description": "Inteiro pequeno — economiza espaço",
        "example": "ativo TINYINT DEFAULT 1"
      },
      {
        "name": "DECIMAL(p, s)",
        "description": "Número decimal exato — ideal para dinheiro",
        "example": "preco DECIMAL(10, 2),  total DECIMAL(12,2)"
      },
      {
        "name": "FLOAT / DOUBLE",
        "description": "Decimal aproximado",
        "example": "peso_kg FLOAT, latitude DOUBLE"
      },
      {
        "name": "CHAR(n)",
        "description": "String de tamanho fixo",
        "example": "estado CHAR(2), cpf CHAR(11)"
      },
      {
        "name": "VARCHAR(n)",
        "description": "String de tamanho variável",
        "example": "nome VARCHAR(100), email VARCHAR(150)"
      },
      {
        "name": "TEXT / LONGTEXT",
        "description": "Texto longo sem limite fixo",
        "example": "descricao TEXT, observacoes LONGTEXT"
      },
      {
        "name": "DATE",
        "description": "Data — YYYY-MM-DD",
        "example": "data_cadastro DATE DEFAULT (CURRENT_DATE)"
      },
      {
        "name": "DATETIME / TIMESTAMP",
        "description": "Data e hora completas",
        "example": "data_pedido DATETIME DEFAULT NOW()"
      },
      {
        "name": "TIME",
        "description": "Apenas hora HH:MM:SS",
        "example": "horario_abertura TIME"
      },
      {
        "name": "BOOLEAN / BOOL",
        "description": "Verdadeiro ou falso (0/1 no MySQL)",
        "example": "ativo BOOLEAN DEFAULT TRUE"
      },
      {
        "name": "BLOB",
        "description": "Dados binários — imagens, arquivos",
        "example": "foto_produto BLOB"
      },
      {
        "name": "JSON",
        "description": "Dados no formato JSON",
        "example": "configuracoes JSON, atributos_extras JSON"
      },
      {
        "name": "ENUM",
        "description": "Conjunto fixo de valores possíveis",
        "example": "status ENUM('pendente','enviado','entregue','cancelado')"
      },
      {
        "name": "AUTO_INCREMENT / SERIAL",
        "description": "Valor gerado e incrementado automaticamente",
        "example": "id INT AUTO_INCREMENT PRIMARY KEY  -- MySQL\nid SERIAL PRIMARY KEY              -- PostgreSQL"
      }
    ]
  }
];
