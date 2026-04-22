// English translations overlay for SQL_GROUPS (defined in ./sqlCommands.ts).
// Portuguese is the source of truth; this file mirrors the structure with EN
// strings for `full`, `note`, and each row's `description`. The `name` field
// (SQL keyword/clause) and `example` (actual SQL) are intentionally NOT
// translated — they are language-agnostic identifiers and runnable code.
//
// Lookup is by group `id` and row `name` so the overlay stays robust if the
// underlying `SQL_GROUPS` array order ever changes.

export interface SqlGroupEnOverlay {
  full: string;
  note: string;
  /** description by row.name */
  rows: Record<string, string>;
}

export const SQL_GROUPS_EN: Record<string, SqlGroupEnOverlay> = {
  ddl: {
    full: "1. DDL — Data Definition Language",
    note: "Create, alter, and drop structures (tables, columns, databases).",
    rows: {
      "CREATE DATABASE": "Create a new database",
      "USE": "Select the database to use",
      "CREATE TABLE": "Create a new table",
      "CREATE TABLE (FK)": "Create a table with a foreign key",
      "CREATE TABLE ... AS SELECT": "Create a table from a query",
      "ALTER TABLE ... ADD": "Add a new column",
      "ALTER TABLE ... DROP COLUMN": "Remove an existing column",
      "ALTER TABLE ... MODIFY": "Change a column's data type",
      "ALTER TABLE ... RENAME COLUMN": "Rename a column",
      "DROP TABLE": "Permanently delete a table",
      "DROP DATABASE": "Delete a database",
      "TRUNCATE TABLE": "Wipe all rows (keeps the structure)",
      "RENAME TABLE": "Rename a table",
    },
  },
  dml: {
    full: "2. DML — Data Manipulation Language",
    note: "Query, insert, update, and delete data.",
    rows: {
      "SELECT *": "Select every column from the table",
      "SELECT colunas": "Select specific columns",
      "INSERT INTO ... VALUES": "Insert a new row",
      "INSERT INTO ... (múltiplos)": "Insert several rows at once",
      "INSERT INTO ... SELECT": "Insert data from another query",
      "UPDATE ... SET": "Update existing rows",
      "UPDATE ... SET (múltiplos)": "Update several columns at once",
      "DELETE FROM": "Delete rows that match a condition",
      "MERGE INTO": "Insert or update — upsert",
    },
  },
  dcl: {
    full: "3. DCL — Data Control Language",
    note: "Manage user permissions and access.",
    rows: {
      "GRANT SELECT": "Grant read permission",
      "GRANT INSERT, UPDATE": "Grant specific permissions",
      "GRANT ALL": "Grant every permission",
      "GRANT ... WITH GRANT OPTION": "Allow the user to delegate permissions",
      "REVOKE": "Revoke a granted permission",
      "REVOKE ALL": "Revoke every permission",
    },
  },
  tcl: {
    full: "4. TCL — Transaction Control Language",
    note: "Control transactions to keep data consistent.",
    rows: {
      "BEGIN / START TRANSACTION": "Start an explicit transaction",
      "COMMIT": "Confirm and persist all operations",
      "ROLLBACK": "Undo every operation in the transaction",
      "SAVEPOINT": "Create an intermediate restore point",
      "ROLLBACK TO SAVEPOINT": "Undo only up to the savepoint",
      "RELEASE SAVEPOINT": "Remove a previously created savepoint",
    },
  },
  select: {
    full: "5. SELECT clauses",
    note: "Filter, group, sort, limit, and combine results.",
    rows: {
      "WHERE": "Filter rows by a condition",
      "WHERE composto": "Multiple combined conditions",
      "GROUP BY": "Group rows for aggregation",
      "HAVING": "Filter groups — used after GROUP BY",
      "ORDER BY ASC": "Sort the result ascending",
      "ORDER BY DESC": "Sort the result descending",
      "ORDER BY múltiplo": "Sort by several columns",
      "LIMIT": "Limit the number of rows",
      "LIMIT + OFFSET": "Pagination — skip N rows",
      "DISTINCT": "Return only unique values",
      "AS (alias coluna)": "Rename a column in the result",
      "AS (alias tabela)": "Give a table an alias inside the query",
      "UNION": "Combine results without duplicates",
      "UNION ALL": "Combine results keeping duplicates",
      "INTERSECT": "Return only rows in common",
      "EXCEPT / MINUS": "Difference between two result sets",
      "TOP (SQL Server)": "Return the first N rows",
      "FETCH FIRST (padrão SQL)": "Limit rows using the ANSI standard",
    },
  },
  operadores: {
    full: "6. Operators",
    note: "Comparison, logical, arithmetic, and special operators used in conditions.",
    rows: {
      "=": "Equal to",
      "<> ou !=": "Not equal to",
      "> / <": "Greater than / Less than",
      ">= / <=": "Greater or equal / Less or equal",
      "AND": "Both conditions are true",
      "OR": "At least one condition is true",
      "NOT": "Negate a condition",
      "IN (...)": "Value belongs to a list",
      "NOT IN (...)": "Value does not belong to the list",
      "BETWEEN ... AND": "Value within an inclusive range",
      "LIKE 'x%'": "Starts with a given text",
      "LIKE '%x%'": "Contains the text anywhere",
      "IS NULL": "Check whether a value is null",
      "IS NOT NULL": "Check whether a value is not null",
      "EXISTS": "True if the subquery returns ≥ 1 row",
      "ALL": "Compare against every value in the subquery",
      "ANY / SOME": "True if the comparison holds for any value",
      "+  -  *  /  %": "Arithmetic operators",
    },
  },
  agregacao: {
    full: "7. Aggregate functions",
    note: "Operate over sets of rows and return a single summary value.",
    rows: {
      "COUNT(*)": "Count the total number of rows",
      "COUNT(coluna)": "Count non-null values in a column",
      "COUNT(DISTINCT col)": "Count distinct values",
      "SUM(coluna)": "Sum the values in a column",
      "AVG(coluna)": "Compute the average of the values",
      "MAX(coluna)": "Return the largest value",
      "MIN(coluna)": "Return the smallest value",
      "SUM + GROUP BY": "Grouped sum",
      "STDDEV()": "Standard deviation of the values",
      "GROUP_CONCAT() MySQL": "Concatenate values within a group",
      "STRING_AGG() PostgreSQL/SQL Server": "Concatenate with a separator",
    },
  },
  string: {
    full: "8. String functions",
    note: "Manipulate, transform, slice, and search patterns in text.",
    rows: {
      "UPPER(col)": "Convert text to uppercase",
      "LOWER(col)": "Convert text to lowercase",
      "LENGTH(col)": "Return the length of the string",
      "CONCAT(a, b)": "Concatenate strings",
      "CONCAT_WS(sep, ...)": "Concatenate with a defined separator",
      "SUBSTRING(col, pos, len)": "Extract a slice of a string",
      "LEFT(col, n)": "First N characters",
      "RIGHT(col, n)": "Last N characters",
      "TRIM(col)": "Remove whitespace from both ends",
      "REPLACE(col, de, para)": "Replace text inside the string",
      "INSTR(col, str)": "Position of a substring",
      "REVERSE(col)": "Reverse the string",
      "LPAD(col, n, pad)": "Pad on the left up to N characters",
      "RPAD(col, n, pad)": "Pad on the right up to N characters",
      "FORMAT(col, n)": "Format a number with N decimal places",
    },
  },
  matematica: {
    full: "9. Math functions",
    note: "Rounding, powers, modulo, and other numeric calculations.",
    rows: {
      "ROUND(col, n)": "Round to N decimal places",
      "CEIL(col)": "Round up (ceiling)",
      "FLOOR(col)": "Round down (floor)",
      "ABS(col)": "Absolute value (no sign)",
      "MOD(a, b)": "Remainder of integer division",
      "POWER(base, exp)": "Raise to a power",
      "SQRT(col)": "Square root",
      "RAND()": "Random number between 0 and 1",
      "SIGN(col)": "Returns -1, 0, or 1 depending on the sign",
    },
  },
  data: {
    full: "10. Date and time functions",
    note: "Get, calculate, and format dates and times.",
    rows: {
      "NOW()": "Current date and time",
      "CURDATE()": "Current date without time",
      "YEAR(data)": "Extract the year",
      "MONTH(data)": "Extract the month",
      "DAY(data)": "Extract the day",
      "HOUR(data)": "Extract the hour",
      "EXTRACT(part FROM date)": "Extract a part of the date — SQL standard",
      "DATEDIFF(d1, d2)": "Difference in days between two dates",
      "DATE_ADD(data, INTERVAL n u)": "Add an interval to a date",
      "DATE_SUB(data, INTERVAL n u)": "Subtract an interval from a date",
      "DATE_FORMAT(data, fmt)": "Format a date as text",
      "TIMESTAMPDIFF(u, d1, d2)": "Difference in a specific unit",
      "DATEPART() SQL Server": "Extract a date part — SQL Server",
      "DATEADD() SQL Server": "Add an interval — SQL Server",
    },
  },
  conversao: {
    full: "11. Conversion and nulls",
    note: "Convert data types and handle null values safely.",
    rows: {
      "CAST(val AS tipo)": "Convert to another type — SQL standard",
      "CONVERT()": "Convert type — SQL Server / MySQL",
      "COALESCE(a, b, c...)": "First non-null value in the list",
      "NULLIF(a, b)": "Returns NULL if a = b, otherwise returns a",
      "ISNULL() SQL Server": "Replace NULL — SQL Server",
      "IFNULL() MySQL": "Replace NULL — MySQL",
      "NVL() Oracle": "Replace NULL — Oracle",
      "TO_DATE() PostgreSQL/Oracle": "Convert a string to a date",
      "TO_CHAR() PostgreSQL/Oracle": "Convert a number/date to a string",
    },
  },
  condicional: {
    full: "12. Conditional functions",
    note: "Inline if/else logic inside SQL queries.",
    rows: {
      "CASE WHEN ... THEN ... ELSE ... END": "Conditional with a free-form expression",
      "CASE col WHEN val THEN ... END": "Conditional based on a fixed value",
      "CASE em ORDER BY": "Sort using conditional logic",
      "CASE em UPDATE": "Update based on a condition",
      "IIF() SQL Server": "Short inline conditional",
    },
  },
  joins: {
    full: "13. JOINs — Combining tables",
    note: "Different ways to combine data from two or more tables.",
    rows: {
      "INNER JOIN": "Only rows that exist in both tables",
      "LEFT JOIN": "All rows from the left + matches from the right",
      "RIGHT JOIN": "All rows from the right + matches from the left",
      "FULL JOIN": "All rows from both tables",
      "CROSS JOIN": "Cartesian product — combine everything with everything",
      "SELF JOIN": "Joining a table with itself",
      "JOIN em 3 tabelas": "Chain multiple JOINs",
      "JOIN com subquery": "JOIN against a subquery result",
    },
  },
  subquery: {
    full: "14. Subqueries",
    note: "Queries within queries — scalar, table, correlated, EXISTS.",
    rows: {
      "Escalar (1 valor)": "Subquery returning a single value",
      "Comparação escalar": "Filter based on a computed value",
      "IN com subquery": "Filter by another query's result",
      "NOT IN com subquery": "Exclude rows from the subquery",
      "EXISTS": "True if the subquery returns ≥ 1 row",
      "NOT EXISTS": "True if the subquery returns nothing",
      "Tabela derivada (no FROM)": "Subquery used as a temporary table",
      "Correlacionada": "Subquery that references the outer query",
      "ALL": "Compare against every value in the subquery",
      "ANY / SOME": "True if the comparison holds for any value",
    },
  },
  window: {
    full: "15. Window functions",
    note: "Analytic functions that operate over windows of rows without collapsing the result.",
    rows: {
      "OVER ()": "Apply a function across all rows",
      "PARTITION BY": "Split into partitions by a column",
      "ORDER BY (dentro OVER)": "Order rows within the window",
      "ROW_NUMBER()": "Unique row number per partition",
      "RANK()": "Rank with gaps on ties",
      "DENSE_RANK()": "Rank without gaps on ties",
      "NTILE(n)": "Distribute rows into N equal groups",
      "LAG(col, n)": "Value from N rows before",
      "LEAD(col, n)": "Value from N rows ahead",
      "FIRST_VALUE(col)": "First value in the ordered window",
      "SUM() acumulado": "Running sum over time",
      "AVG() média móvel": "Average of the last N rows",
      "ROWS BETWEEN": "Window frame defined by rows",
    },
  },
  cte: {
    full: "16. CTEs — Common Table Expressions",
    note: "Named temporary queries that organize complex SQL. Recursion supported.",
    rows: {
      "WITH cte AS (...)": "Simple CTE — a named subquery",
      "CTEs encadeadas": "Several CTEs in the same query",
      "WITH RECURSIVE": "Recursive CTE — hierarchies and sequences",
    },
  },
  views: {
    full: "17. Views",
    note: "Saved queries stored as database objects, reusable like tables.",
    rows: {
      "CREATE VIEW": "Create a view — a saved query",
      "CREATE OR REPLACE VIEW": "Create or replace an existing view",
      "SELECT em view": "Query a view as if it were a table",
      "DROP VIEW": "Delete a view",
      "WITH CHECK OPTION": "Block inserts that fall outside the view's filter",
    },
  },
  procedures: {
    full: "18. Stored procedures and functions",
    note: "Reusable blocks of SQL code stored inside the database.",
    rows: {
      "CREATE PROCEDURE": "Create a stored procedure",
      "CALL": "Execute a stored procedure",
      "EXEC (SQL Server)": "Run a procedure on SQL Server",
      "DROP PROCEDURE": "Delete a stored procedure",
      "CREATE FUNCTION": "Create a reusable scalar function",
      "Usar função criada": "Call the function inside a query",
      "IN / OUT / INOUT": "Procedure parameter modes",
      "DECLARE + SET": "Declare and use a local variable",
      "IF / ELSEIF / ELSE": "Conditional inside a procedure",
      "WHILE loop": "Loop inside a procedure",
    },
  },
  triggers: {
    full: "19. Triggers",
    note: "Code that fires automatically in response to INSERT, UPDATE, or DELETE.",
    rows: {
      "BEFORE INSERT": "Run before an insert",
      "AFTER INSERT": "Run after an insert",
      "BEFORE UPDATE": "Run before an update",
      "AFTER UPDATE": "Run after an update",
      "BEFORE DELETE": "Run before a delete",
      "DROP TRIGGER": "Delete a trigger",
      "NEW / OLD": "Access new and old row values",
    },
  },
  indices: {
    full: "20. Indexes and performance",
    note: "Structures that speed up lookups, plus tools to analyze performance.",
    rows: {
      "CREATE INDEX": "Create a simple index",
      "CREATE UNIQUE INDEX": "Index that enforces uniqueness",
      "CREATE INDEX composto": "Index with multiple columns",
      "DROP INDEX": "Delete an index",
      "EXPLAIN": "Inspect the execution plan",
      "EXPLAIN ANALYZE": "Run and analyze the actual plan",
      "SHOW INDEX (MySQL)": "List the indexes of a table",
    },
  },
  constraints: {
    full: "21. Constraints",
    note: "Rules applied to columns to guarantee data quality and consistency.",
    rows: {
      "PRIMARY KEY": "Primary key: unique + not null",
      "FOREIGN KEY": "Foreign key with a reference",
      "UNIQUE": "Ensures unique values in the column",
      "NOT NULL": "Column does not accept null",
      "CHECK": "Enforces a validation rule",
      "DEFAULT": "Default value when none is provided",
      "ON DELETE CASCADE": "Delete children when the parent is deleted",
      "ON UPDATE CASCADE": "Update the FK when the parent PK changes",
      "ON DELETE SET NULL": "Set the FK to NULL when the parent is deleted",
    },
  },
  tipos: {
    full: "22. Data types",
    note: "Main types available in MySQL, PostgreSQL, and SQL Server.",
    rows: {
      "INT / INTEGER": "Integer (−2B to 2B)",
      "BIGINT": "Large integer (−9 quad to 9 quad)",
      "SMALLINT / TINYINT": "Small integer — saves space",
      "DECIMAL(p, s)": "Exact decimal — ideal for money",
      "FLOAT / DOUBLE": "Approximate decimal",
      "CHAR(n)": "Fixed-length string",
      "VARCHAR(n)": "Variable-length string",
      "TEXT / LONGTEXT": "Long text without a fixed limit",
      "DATE": "Date — YYYY-MM-DD",
      "DATETIME / TIMESTAMP": "Full date and time",
      "TIME": "Time only — HH:MM:SS",
      "BOOLEAN / BOOL": "True or false (0/1 in MySQL)",
      "BLOB": "Binary data — images, files",
      "JSON": "Data in JSON format",
      "ENUM": "Fixed set of allowed values",
      "AUTO_INCREMENT / SERIAL": "Value generated and incremented automatically",
    },
  },
};

import type { SqlGroup, SqlRow } from "./sqlCommands";
import type { Lang } from "@/i18n";

/** Localized accessors with PT fallback. */
export function groupFull(group: SqlGroup, lang: Lang): string {
  if (lang === "en") return SQL_GROUPS_EN[group.id]?.full ?? group.full;
  return group.full;
}
export function groupNote(group: SqlGroup, lang: Lang): string {
  if (lang === "en") return SQL_GROUPS_EN[group.id]?.note ?? group.note;
  return group.note;
}
export function rowDescription(groupId: string, row: SqlRow, lang: Lang): string {
  if (lang === "en") return SQL_GROUPS_EN[groupId]?.rows?.[row.name] ?? row.description;
  return row.description;
}
