// AUTO-GENERATED from SQL_Referencia.html — do not edit by hand.
// Re-run /tmp/extract.mjs to regenerate.

export interface CmdInfo { section: string; id: string; }
export interface VariantInfo { canonical: string; note: string; id: string; }
export interface InvalidInfo { suggest: string[]; reason: string; }

export const CMD_INFO: Record<string, CmdInfo> = {
  "CREATE DATABASE": {
    "section": "DDL",
    "id": "ddl"
  },
  "CREATE TABLE": {
    "section": "DDL",
    "id": "ddl"
  },
  "CREATE TABLE AS SELECT": {
    "section": "DDL",
    "id": "ddl"
  },
  "ALTER TABLE": {
    "section": "DDL",
    "id": "ddl"
  },
  "DROP TABLE": {
    "section": "DDL",
    "id": "ddl"
  },
  "DROP DATABASE": {
    "section": "DDL",
    "id": "ddl"
  },
  "TRUNCATE TABLE": {
    "section": "DDL",
    "id": "ddl"
  },
  "TRUNCATE": {
    "section": "DDL",
    "id": "ddl"
  },
  "RENAME TABLE": {
    "section": "DDL",
    "id": "ddl"
  },
  "CREATE": {
    "section": "DDL",
    "id": "ddl"
  },
  "DROP": {
    "section": "DDL",
    "id": "ddl"
  },
  "ALTER": {
    "section": "DDL",
    "id": "ddl"
  },
  "USE": {
    "section": "DDL",
    "id": "ddl"
  },
  "SELECT": {
    "section": "DML",
    "id": "dml"
  },
  "INSERT INTO": {
    "section": "DML",
    "id": "dml"
  },
  "INSERT": {
    "section": "DML",
    "id": "dml"
  },
  "UPDATE": {
    "section": "DML",
    "id": "dml"
  },
  "DELETE FROM": {
    "section": "DML",
    "id": "dml"
  },
  "DELETE": {
    "section": "DML",
    "id": "dml"
  },
  "MERGE INTO": {
    "section": "DML",
    "id": "dml"
  },
  "MERGE": {
    "section": "DML",
    "id": "dml"
  },
  "SET": {
    "section": "DML",
    "id": "dml"
  },
  "VALUES": {
    "section": "DML",
    "id": "dml"
  },
  "GRANT": {
    "section": "DCL",
    "id": "dcl"
  },
  "REVOKE": {
    "section": "DCL",
    "id": "dcl"
  },
  "COMMIT": {
    "section": "TCL",
    "id": "tcl"
  },
  "ROLLBACK": {
    "section": "TCL",
    "id": "tcl"
  },
  "SAVEPOINT": {
    "section": "TCL",
    "id": "tcl"
  },
  "BEGIN": {
    "section": "TCL",
    "id": "tcl"
  },
  "START TRANSACTION": {
    "section": "TCL",
    "id": "tcl"
  },
  "RELEASE SAVEPOINT": {
    "section": "TCL",
    "id": "tcl"
  },
  "FROM": {
    "section": "SELECT",
    "id": "select"
  },
  "WHERE": {
    "section": "SELECT",
    "id": "select"
  },
  "GROUP BY": {
    "section": "SELECT",
    "id": "select"
  },
  "HAVING": {
    "section": "SELECT",
    "id": "select"
  },
  "ORDER BY": {
    "section": "SELECT",
    "id": "select"
  },
  "LIMIT": {
    "section": "SELECT",
    "id": "select"
  },
  "OFFSET": {
    "section": "SELECT",
    "id": "select"
  },
  "DISTINCT": {
    "section": "SELECT",
    "id": "select"
  },
  "AS": {
    "section": "SELECT",
    "id": "select"
  },
  "UNION": {
    "section": "SELECT",
    "id": "select"
  },
  "UNION ALL": {
    "section": "SELECT",
    "id": "select"
  },
  "INTERSECT": {
    "section": "SELECT",
    "id": "select"
  },
  "EXCEPT": {
    "section": "SELECT",
    "id": "select"
  },
  "TOP": {
    "section": "SELECT",
    "id": "select"
  },
  "FETCH FIRST": {
    "section": "SELECT",
    "id": "select"
  },
  "AND": {
    "section": "Operadores",
    "id": "operadores"
  },
  "OR": {
    "section": "Operadores",
    "id": "operadores"
  },
  "NOT": {
    "section": "Operadores",
    "id": "operadores"
  },
  "IN": {
    "section": "Operadores",
    "id": "operadores"
  },
  "NOT IN": {
    "section": "Operadores",
    "id": "operadores"
  },
  "BETWEEN": {
    "section": "Operadores",
    "id": "operadores"
  },
  "LIKE": {
    "section": "Operadores",
    "id": "operadores"
  },
  "IS NULL": {
    "section": "Operadores",
    "id": "operadores"
  },
  "IS NOT NULL": {
    "section": "Operadores",
    "id": "operadores"
  },
  "EXISTS": {
    "section": "Operadores",
    "id": "operadores"
  },
  "NOT EXISTS": {
    "section": "Operadores",
    "id": "operadores"
  },
  "ALL": {
    "section": "Operadores",
    "id": "operadores"
  },
  "ANY": {
    "section": "Operadores",
    "id": "operadores"
  },
  "SOME": {
    "section": "Operadores",
    "id": "operadores"
  },
  "COUNT": {
    "section": "Agregação",
    "id": "agregacao"
  },
  "SUM": {
    "section": "Agregação",
    "id": "agregacao"
  },
  "AVG": {
    "section": "Agregação",
    "id": "agregacao"
  },
  "MAX": {
    "section": "Agregação",
    "id": "agregacao"
  },
  "MIN": {
    "section": "Agregação",
    "id": "agregacao"
  },
  "STDDEV": {
    "section": "Agregação",
    "id": "agregacao"
  },
  "GROUP_CONCAT": {
    "section": "Agregação",
    "id": "agregacao"
  },
  "STRING_AGG": {
    "section": "Agregação",
    "id": "agregacao"
  },
  "UPPER": {
    "section": "String",
    "id": "string"
  },
  "LOWER": {
    "section": "String",
    "id": "string"
  },
  "LENGTH": {
    "section": "String",
    "id": "string"
  },
  "CONCAT": {
    "section": "String",
    "id": "string"
  },
  "CONCAT_WS": {
    "section": "String",
    "id": "string"
  },
  "SUBSTRING": {
    "section": "String",
    "id": "string"
  },
  "SUBSTR": {
    "section": "String",
    "id": "string"
  },
  "LEFT": {
    "section": "String",
    "id": "string"
  },
  "RIGHT": {
    "section": "String",
    "id": "string"
  },
  "TRIM": {
    "section": "String",
    "id": "string"
  },
  "LTRIM": {
    "section": "String",
    "id": "string"
  },
  "RTRIM": {
    "section": "String",
    "id": "string"
  },
  "REPLACE": {
    "section": "String",
    "id": "string"
  },
  "INSTR": {
    "section": "String",
    "id": "string"
  },
  "REVERSE": {
    "section": "String",
    "id": "string"
  },
  "LPAD": {
    "section": "String",
    "id": "string"
  },
  "RPAD": {
    "section": "String",
    "id": "string"
  },
  "FORMAT": {
    "section": "String",
    "id": "string"
  },
  "ROUND": {
    "section": "Matemática",
    "id": "matematica"
  },
  "CEIL": {
    "section": "Matemática",
    "id": "matematica"
  },
  "FLOOR": {
    "section": "Matemática",
    "id": "matematica"
  },
  "ABS": {
    "section": "Matemática",
    "id": "matematica"
  },
  "MOD": {
    "section": "Matemática",
    "id": "matematica"
  },
  "POWER": {
    "section": "Matemática",
    "id": "matematica"
  },
  "SQRT": {
    "section": "Matemática",
    "id": "matematica"
  },
  "RAND": {
    "section": "Matemática",
    "id": "matematica"
  },
  "SIGN": {
    "section": "Matemática",
    "id": "matematica"
  },
  "NOW": {
    "section": "Data/Hora",
    "id": "data"
  },
  "CURDATE": {
    "section": "Data/Hora",
    "id": "data"
  },
  "YEAR": {
    "section": "Data/Hora",
    "id": "data"
  },
  "MONTH": {
    "section": "Data/Hora",
    "id": "data"
  },
  "DAY": {
    "section": "Data/Hora",
    "id": "data"
  },
  "HOUR": {
    "section": "Data/Hora",
    "id": "data"
  },
  "EXTRACT": {
    "section": "Data/Hora",
    "id": "data"
  },
  "DATEDIFF": {
    "section": "Data/Hora",
    "id": "data"
  },
  "DATE_ADD": {
    "section": "Data/Hora",
    "id": "data"
  },
  "DATE_SUB": {
    "section": "Data/Hora",
    "id": "data"
  },
  "DATE_FORMAT": {
    "section": "Data/Hora",
    "id": "data"
  },
  "TIMESTAMPDIFF": {
    "section": "Data/Hora",
    "id": "data"
  },
  "DATEPART": {
    "section": "Data/Hora",
    "id": "data"
  },
  "DATEADD": {
    "section": "Data/Hora",
    "id": "data"
  },
  "CAST": {
    "section": "Conversão",
    "id": "conversao"
  },
  "CONVERT": {
    "section": "Conversão",
    "id": "conversao"
  },
  "COALESCE": {
    "section": "Conversão",
    "id": "conversao"
  },
  "NULLIF": {
    "section": "Conversão",
    "id": "conversao"
  },
  "ISNULL": {
    "section": "Conversão",
    "id": "conversao"
  },
  "IFNULL": {
    "section": "Conversão",
    "id": "conversao"
  },
  "NVL": {
    "section": "Conversão",
    "id": "conversao"
  },
  "TO_DATE": {
    "section": "Conversão",
    "id": "conversao"
  },
  "TO_CHAR": {
    "section": "Conversão",
    "id": "conversao"
  },
  "CASE WHEN": {
    "section": "Condicional",
    "id": "condicional"
  },
  "CASE": {
    "section": "Condicional",
    "id": "condicional"
  },
  "WHEN": {
    "section": "Condicional",
    "id": "condicional"
  },
  "THEN": {
    "section": "Condicional",
    "id": "condicional"
  },
  "ELSE": {
    "section": "Condicional",
    "id": "condicional"
  },
  "END": {
    "section": "Condicional",
    "id": "condicional"
  },
  "IIF": {
    "section": "Condicional",
    "id": "condicional"
  },
  "INNER JOIN": {
    "section": "JOINs",
    "id": "joins"
  },
  "LEFT JOIN": {
    "section": "JOINs",
    "id": "joins"
  },
  "RIGHT JOIN": {
    "section": "JOINs",
    "id": "joins"
  },
  "FULL JOIN": {
    "section": "JOINs",
    "id": "joins"
  },
  "CROSS JOIN": {
    "section": "JOINs",
    "id": "joins"
  },
  "JOIN": {
    "section": "JOINs",
    "id": "joins"
  },
  "ON": {
    "section": "JOINs",
    "id": "joins"
  },
  "OVER": {
    "section": "Window Fn",
    "id": "window"
  },
  "PARTITION BY": {
    "section": "Window Fn",
    "id": "window"
  },
  "ROW_NUMBER": {
    "section": "Window Fn",
    "id": "window"
  },
  "RANK": {
    "section": "Window Fn",
    "id": "window"
  },
  "DENSE_RANK": {
    "section": "Window Fn",
    "id": "window"
  },
  "NTILE": {
    "section": "Window Fn",
    "id": "window"
  },
  "LAG": {
    "section": "Window Fn",
    "id": "window"
  },
  "LEAD": {
    "section": "Window Fn",
    "id": "window"
  },
  "FIRST_VALUE": {
    "section": "Window Fn",
    "id": "window"
  },
  "LAST_VALUE": {
    "section": "Window Fn",
    "id": "window"
  },
  "ROWS BETWEEN": {
    "section": "Window Fn",
    "id": "window"
  },
  "WITH RECURSIVE": {
    "section": "CTEs",
    "id": "cte"
  },
  "WITH": {
    "section": "CTEs",
    "id": "cte"
  },
  "CREATE VIEW": {
    "section": "Views",
    "id": "views"
  },
  "DROP VIEW": {
    "section": "Views",
    "id": "views"
  },
  "CREATE PROCEDURE": {
    "section": "Procedures",
    "id": "procedures"
  },
  "CALL": {
    "section": "Procedures",
    "id": "procedures"
  },
  "EXEC": {
    "section": "Procedures",
    "id": "procedures"
  },
  "CREATE FUNCTION": {
    "section": "Procedures",
    "id": "procedures"
  },
  "DECLARE": {
    "section": "Procedures",
    "id": "procedures"
  },
  "WHILE": {
    "section": "Procedures",
    "id": "procedures"
  },
  "CREATE TRIGGER": {
    "section": "Triggers",
    "id": "triggers"
  },
  "DROP TRIGGER": {
    "section": "Triggers",
    "id": "triggers"
  },
  "BEFORE INSERT": {
    "section": "Triggers",
    "id": "triggers"
  },
  "AFTER INSERT": {
    "section": "Triggers",
    "id": "triggers"
  },
  "BEFORE UPDATE": {
    "section": "Triggers",
    "id": "triggers"
  },
  "AFTER UPDATE": {
    "section": "Triggers",
    "id": "triggers"
  },
  "BEFORE DELETE": {
    "section": "Triggers",
    "id": "triggers"
  },
  "CREATE INDEX": {
    "section": "Índices",
    "id": "indices"
  },
  "DROP INDEX": {
    "section": "Índices",
    "id": "indices"
  },
  "EXPLAIN": {
    "section": "Índices",
    "id": "indices"
  },
  "PRIMARY KEY": {
    "section": "Constraints",
    "id": "constraints"
  },
  "FOREIGN KEY": {
    "section": "Constraints",
    "id": "constraints"
  },
  "UNIQUE": {
    "section": "Constraints",
    "id": "constraints"
  },
  "NOT NULL": {
    "section": "Constraints",
    "id": "constraints"
  },
  "CHECK": {
    "section": "Constraints",
    "id": "constraints"
  },
  "DEFAULT": {
    "section": "Constraints",
    "id": "constraints"
  },
  "AUTO_INCREMENT": {
    "section": "Tipos",
    "id": "tipos"
  },
  "SERIAL": {
    "section": "Tipos",
    "id": "tipos"
  }
};

export const VARIANTS_MAP: Record<string, VariantInfo> = {
  "!=": {
    "canonical": "<>",
    "note": "equivalente a <>",
    "id": "operadores"
  },
  "LEFT OUTER JOIN": {
    "canonical": "LEFT JOIN",
    "note": "OUTER é opcional",
    "id": "joins"
  },
  "RIGHT OUTER JOIN": {
    "canonical": "RIGHT JOIN",
    "note": "OUTER é opcional",
    "id": "joins"
  },
  "FULL OUTER JOIN": {
    "canonical": "FULL JOIN",
    "note": "OUTER é opcional",
    "id": "joins"
  },
  "LEN": {
    "canonical": "LENGTH",
    "note": "SQL Server — use LENGTH no MySQL/SQLite",
    "id": "string"
  },
  "CEILING": {
    "canonical": "CEIL",
    "note": "sinônimo de CEIL",
    "id": "matematica"
  },
  "GETDATE": {
    "canonical": "NOW",
    "note": "SQL Server — equivale a NOW()",
    "id": "data"
  },
  "SYSDATE": {
    "canonical": "NOW",
    "note": "Oracle — equivale a NOW()",
    "id": "data"
  },
  "MINUS": {
    "canonical": "EXCEPT",
    "note": "Oracle — equivale a EXCEPT",
    "id": "select"
  },
  "IF": {
    "canonical": "CASE WHEN",
    "note": "MySQL only — use CASE WHEN para código universal",
    "id": "condicional"
  },
  "REPLACE INTO": {
    "canonical": "MERGE INTO",
    "note": "MySQL only — equivale a MERGE/upsert",
    "id": "dml"
  },
  "ROWNUM": {
    "canonical": "ROW_NUMBER()",
    "note": "Oracle legacy — use ROW_NUMBER() OVER",
    "id": "window"
  },
  "CHARINDEX": {
    "canonical": "INSTR",
    "note": "SQL Server — equivale a INSTR()",
    "id": "string"
  },
  "STR_TO_DATE": {
    "canonical": "TO_DATE",
    "note": "MySQL — equivale a TO_DATE()",
    "id": "conversao"
  },
  "NVL2": {
    "canonical": "COALESCE",
    "note": "Oracle — use COALESCE para universal",
    "id": "conversao"
  },
  "SUBSTR": {
    "canonical": "SUBSTRING",
    "note": "sinônimo de SUBSTRING",
    "id": "string"
  },
  "ILIKE": {
    "canonical": "LIKE",
    "note": "PostgreSQL — LIKE case-insensitive",
    "id": "operadores"
  },
  "REGEXP": {
    "canonical": "LIKE",
    "note": "MySQL — expressão regular, mais poderoso que LIKE",
    "id": "operadores"
  }
};

export const INVALID_MAP: Record<string, InvalidInfo> = {
  "FIND": {
    "suggest": [
      "WHERE",
      "IN",
      "LIKE",
      "EXISTS"
    ],
    "reason": "SQL não tem FIND — use SELECT + WHERE para buscar"
  },
  "SEARCH": {
    "suggest": [
      "WHERE LIKE",
      "EXISTS"
    ],
    "reason": "SQL não tem SEARCH — use WHERE com LIKE para buscar texto"
  },
  "LOOP": {
    "suggest": [
      "WHILE",
      "CURSOR"
    ],
    "reason": "SQL não tem LOOP genérico — use WHILE em procedures"
  },
  "NEW": {
    "suggest": [
      "INSERT INTO",
      "CREATE TABLE"
    ],
    "reason": "SQL não tem NEW — use INSERT para adicionar dados"
  },
  "PRINT": {
    "suggest": [
      "SELECT"
    ],
    "reason": "SQL não tem PRINT — use SELECT para exibir valores"
  },
  "ADD": {
    "suggest": [
      "INSERT INTO",
      "ALTER TABLE ADD"
    ],
    "reason": "ADD sozinho não é válido — use INSERT INTO (dados) ou ALTER TABLE ADD (coluna)"
  },
  "REMOVE": {
    "suggest": [
      "DELETE FROM",
      "DROP TABLE"
    ],
    "reason": "SQL não tem REMOVE — use DELETE para dados ou DROP para objetos"
  },
  "MODIFY": {
    "suggest": [
      "ALTER TABLE MODIFY",
      "UPDATE"
    ],
    "reason": "MODIFY sozinho não é válido — use ALTER TABLE MODIFY (estrutura) ou UPDATE (dados)"
  },
  "CHANGE": {
    "suggest": [
      "UPDATE SET",
      "ALTER TABLE MODIFY"
    ],
    "reason": "SQL não tem CHANGE — use UPDATE (dados) ou ALTER TABLE MODIFY (estrutura)"
  },
  "EDIT": {
    "suggest": [
      "UPDATE SET"
    ],
    "reason": "SQL não tem EDIT — use UPDATE ... SET para modificar dados"
  },
  "GET": {
    "suggest": [
      "SELECT"
    ],
    "reason": "SQL não tem GET — use SELECT para recuperar dados"
  },
  "FETCH": {
    "suggest": [
      "FETCH FIRST",
      "CURSOR"
    ],
    "reason": "FETCH sozinho é incompleto — use FETCH FIRST N ROWS ONLY (ANSI) ou CURSOR FETCH"
  },
  "UPSERT": {
    "suggest": [
      "MERGE INTO",
      "INSERT OR REPLACE"
    ],
    "reason": "SQL não tem UPSERT — use MERGE INTO para inserir ou atualizar"
  },
  "LIST": {
    "suggest": [
      "SELECT"
    ],
    "reason": "SQL não tem LIST — use SELECT para listar dados"
  },
  "SHOW": {
    "suggest": [
      "SELECT",
      "SHOW INDEX"
    ],
    "reason": "SHOW é MySQL-specific (SHOW TABLES, SHOW INDEX) — não é padrão SQL"
  },
  "DESCRIBE": {
    "suggest": [
      "SELECT",
      "PRAGMA table_info"
    ],
    "reason": "DESCRIBE é MySQL-specific — não funciona no SQLite"
  },
  "DELIMITER": {
    "suggest": [
      "BEGIN...END",
      "CREATE PROCEDURE",
      "CREATE TRIGGER"
    ],
    "reason": "DELIMITER não é SQL — é um comando do cliente MySQL. Serve para definir um separador alternativo ao \";\" dentro de blocos. Não existe no SQLite, PostgreSQL ou HackerRank"
  },
  "UNSIGNED": {
    "suggest": [
      "INT",
      "DECIMAL",
      "CHECK"
    ],
    "reason": "UNSIGNED é MySQL-specific — não é suportado no SQLite. Use CHECK (col >= 0) para equivalente"
  },
  "AUTO": {
    "suggest": [
      "AUTO_INCREMENT",
      "SERIAL"
    ],
    "reason": "AUTO sozinho não é válido — use AUTO_INCREMENT (MySQL) ou SERIAL (PostgreSQL)"
  }
};

export const RELATED_MAP: Record<string, string[]> = {
  "SELECT": [
    "SELECT DISTINCT",
    "TOP",
    "FETCH FIRST"
  ],
  "INSERT INTO": [
    "INSERT INTO SELECT",
    "MERGE INTO"
  ],
  "UPDATE": [
    "MERGE INTO",
    "UPDATE múltiplas colunas"
  ],
  "DELETE FROM": [
    "TRUNCATE TABLE",
    "UPDATE (soft delete)"
  ],
  "MERGE INTO": [
    "INSERT INTO SELECT",
    "UPDATE + INSERT separados"
  ],
  "TRUNCATE TABLE": [
    "DELETE FROM",
    "DROP TABLE"
  ],
  "CREATE TABLE": [
    "CREATE TABLE AS SELECT",
    "ALTER TABLE"
  ],
  "ALTER TABLE": [
    "CREATE TABLE",
    "DROP TABLE"
  ],
  "DROP TABLE": [
    "TRUNCATE TABLE",
    "DROP DATABASE"
  ],
  "GRANT": [
    "REVOKE",
    "GRANT ALL"
  ],
  "REVOKE": [
    "GRANT"
  ],
  "COMMIT": [
    "ROLLBACK",
    "SAVEPOINT"
  ],
  "ROLLBACK": [
    "COMMIT",
    "ROLLBACK TO SAVEPOINT"
  ],
  "SAVEPOINT": [
    "ROLLBACK TO SAVEPOINT",
    "COMMIT"
  ],
  "FROM": [
    "JOIN",
    "WITH (CTE)",
    "subquery no FROM"
  ],
  "WHERE": [
    "AND",
    "OR",
    "HAVING"
  ],
  "AND": [
    "OR",
    "WHERE",
    "NOT"
  ],
  "OR": [
    "AND",
    "IN"
  ],
  "NOT": [
    "<>",
    "!=",
    "NOT IN",
    "NOT EXISTS"
  ],
  "GROUP BY": [
    "HAVING",
    "PARTITION BY",
    "DISTINCT"
  ],
  "HAVING": [
    "WHERE",
    "GROUP BY"
  ],
  "ORDER BY": [
    "LIMIT",
    "OFFSET",
    "TOP"
  ],
  "LIMIT": [
    "OFFSET",
    "TOP",
    "FETCH FIRST"
  ],
  "DISTINCT": [
    "GROUP BY",
    "SELECT DISTINCT"
  ],
  "UNION": [
    "UNION ALL",
    "INTERSECT",
    "EXCEPT"
  ],
  "UNION ALL": [
    "UNION",
    "INTERSECT"
  ],
  "INTERSECT": [
    "UNION",
    "INNER JOIN",
    "IN"
  ],
  "EXCEPT": [
    "NOT IN",
    "NOT EXISTS"
  ],
  "TOP": [
    "LIMIT",
    "FETCH FIRST"
  ],
  "FETCH FIRST": [
    "LIMIT",
    "TOP"
  ],
  "IN": [
    "EXISTS",
    "ANY",
    "OR múltiplos"
  ],
  "NOT IN": [
    "NOT EXISTS",
    "EXCEPT"
  ],
  "EXISTS": [
    "IN",
    "INNER JOIN"
  ],
  "NOT EXISTS": [
    "NOT IN",
    "LEFT JOIN IS NULL"
  ],
  "BETWEEN": [
    "<= AND >="
  ],
  "LIKE": [
    "ILIKE (PostgreSQL)",
    "REGEXP (MySQL)"
  ],
  "IS NULL": [
    "COALESCE",
    "IFNULL",
    "IS NOT NULL"
  ],
  "IS NOT NULL": [
    "IS NULL",
    "COALESCE"
  ],
  "ALL": [
    "MAX() com >="
  ],
  "ANY": [
    "MIN() com >=",
    "EXISTS"
  ],
  "COUNT": [
    "COUNT DISTINCT",
    "SUM",
    "AVG"
  ],
  "SUM": [
    "AVG",
    "COUNT",
    "MAX"
  ],
  "AVG": [
    "SUM / COUNT"
  ],
  "MAX": [
    "MIN",
    "FIRST_VALUE",
    "ALL"
  ],
  "MIN": [
    "MAX",
    "LAST_VALUE",
    "ANY"
  ],
  "INNER JOIN": [
    "LEFT JOIN",
    "EXISTS",
    "IN com subquery"
  ],
  "LEFT JOIN": [
    "RIGHT JOIN",
    "FULL JOIN"
  ],
  "RIGHT JOIN": [
    "LEFT JOIN",
    "FULL JOIN"
  ],
  "FULL JOIN": [
    "LEFT JOIN UNION RIGHT JOIN"
  ],
  "CROSS JOIN": [
    "produto cartesiano"
  ],
  "JOIN": [
    "INNER JOIN",
    "LEFT JOIN",
    "RIGHT JOIN"
  ],
  "CASE WHEN": [
    "IIF (SQL Server)",
    "IF (MySQL)"
  ],
  "IIF": [
    "CASE WHEN",
    "IF (MySQL)"
  ],
  "CAST": [
    "CONVERT"
  ],
  "CONVERT": [
    "CAST"
  ],
  "COALESCE": [
    "IFNULL (MySQL)",
    "ISNULL (SQL Server)",
    "NVL (Oracle)"
  ],
  "IFNULL": [
    "COALESCE",
    "ISNULL",
    "NVL"
  ],
  "ISNULL": [
    "COALESCE",
    "IFNULL",
    "NVL"
  ],
  "NVL": [
    "COALESCE",
    "IFNULL",
    "ISNULL"
  ],
  "NULLIF": [
    "CASE WHEN"
  ],
  "WITH": [
    "WITH RECURSIVE",
    "subquery no FROM"
  ],
  "WITH RECURSIVE": [
    "WITH",
    "WHILE"
  ],
  "CREATE VIEW": [
    "WITH (CTE)",
    "subquery"
  ],
  "OVER": [
    "PARTITION BY",
    "GROUP BY"
  ],
  "PARTITION BY": [
    "GROUP BY",
    "OVER"
  ],
  "ROW_NUMBER": [
    "RANK",
    "DENSE_RANK",
    "NTILE"
  ],
  "RANK": [
    "DENSE_RANK",
    "ROW_NUMBER"
  ],
  "DENSE_RANK": [
    "RANK",
    "ROW_NUMBER"
  ],
  "LAG": [
    "LEAD"
  ],
  "LEAD": [
    "LAG"
  ],
  "NOW": [
    "CURDATE",
    "GETDATE (SQL Server)",
    "SYSDATE (Oracle)"
  ],
  "DATEDIFF": [
    "TIMESTAMPDIFF",
    "DATE_SUB"
  ],
  "DATE_ADD": [
    "DATE_SUB",
    "DATEADD (SQL Server)"
  ],
  "DATE_SUB": [
    "DATE_ADD",
    "DATEDIFF"
  ],
  "YEAR": [
    "MONTH",
    "DAY",
    "EXTRACT"
  ],
  "MONTH": [
    "YEAR",
    "DAY",
    "EXTRACT"
  ],
  "DAY": [
    "YEAR",
    "MONTH",
    "EXTRACT"
  ],
  "EXTRACT": [
    "YEAR",
    "MONTH",
    "DAY",
    "DATEPART"
  ],
  "UPPER": [
    "LOWER"
  ],
  "LOWER": [
    "UPPER"
  ],
  "CONCAT": [
    "CONCAT_WS",
    "|| (SQLite/PostgreSQL)"
  ],
  "CONCAT_WS": [
    "CONCAT"
  ],
  "SUBSTRING": [
    "LEFT",
    "RIGHT"
  ],
  "LEFT": [
    "SUBSTRING",
    "RIGHT"
  ],
  "RIGHT": [
    "SUBSTRING",
    "LEFT"
  ],
  "TRIM": [
    "LTRIM",
    "RTRIM"
  ],
  "LTRIM": [
    "TRIM",
    "RTRIM"
  ],
  "RTRIM": [
    "TRIM",
    "LTRIM"
  ],
  "ROUND": [
    "CEIL",
    "FLOOR"
  ],
  "CEIL": [
    "FLOOR",
    "ROUND"
  ],
  "FLOOR": [
    "CEIL",
    "ROUND"
  ],
  "LPAD": [
    "RPAD"
  ],
  "RPAD": [
    "LPAD"
  ],
  "PRIMARY KEY": [
    "UNIQUE + NOT NULL"
  ],
  "FOREIGN KEY": [
    "ON DELETE CASCADE",
    "ON UPDATE CASCADE"
  ],
  "UNIQUE": [
    "PRIMARY KEY",
    "UNIQUE INDEX"
  ],
  "NOT NULL": [
    "CHECK",
    "DEFAULT"
  ],
  "AUTO_INCREMENT": [
    "SERIAL (PostgreSQL)"
  ],
  "SERIAL": [
    "AUTO_INCREMENT (MySQL)"
  ],
  "CREATE INDEX": [
    "CREATE UNIQUE INDEX",
    "EXPLAIN"
  ],
  "EXPLAIN": [
    "EXPLAIN ANALYZE"
  ]
};

export const MULTI_PATTERNS: string[] = [
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "START TRANSACTION",
  "RELEASE SAVEPOINT",
  "ROLLBACK TO SAVEPOINT",
  "NOT EXISTS",
  "NOT NULL",
  "NOT IN",
  "IS NOT NULL",
  "IS NULL",
  "GROUP BY",
  "ORDER BY",
  "PARTITION BY",
  "UNION ALL",
  "FETCH FIRST",
  "ROWS BETWEEN",
  "CASE WHEN",
  "WITH RECURSIVE",
  "INSERT INTO",
  "DELETE FROM",
  "MERGE INTO",
  "CREATE DATABASE",
  "CREATE TABLE",
  "CREATE VIEW",
  "CREATE INDEX",
  "CREATE PROCEDURE",
  "CREATE FUNCTION",
  "CREATE TRIGGER",
  "DROP TABLE",
  "DROP DATABASE",
  "DROP VIEW",
  "DROP INDEX",
  "DROP PROCEDURE",
  "DROP TRIGGER",
  "ALTER TABLE",
  "TRUNCATE TABLE",
  "RENAME TABLE",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "CROSS JOIN",
  "PRIMARY KEY",
  "FOREIGN KEY",
  "DATE_ADD",
  "DATE_SUB",
  "DATE_FORMAT",
  "BEFORE INSERT",
  "AFTER INSERT",
  "BEFORE UPDATE",
  "AFTER UPDATE",
  "BEFORE DELETE",
  "DENSE_RANK",
  "ROW_NUMBER",
  "FIRST_VALUE",
  "LAST_VALUE",
  "GROUP_CONCAT",
  "STRING_AGG",
  "CONCAT_WS",
  "STR_TO_DATE",
  "REPLACE INTO"
];
