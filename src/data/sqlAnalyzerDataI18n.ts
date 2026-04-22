// English overlays for VARIANTS_MAP notes and INVALID_MAP reasons.
// Key = the canonical token in sqlAnalyzerData.ts. Falls back to PT when missing.

import type { Lang } from "@/i18n";
import { VARIANTS_MAP, INVALID_MAP } from "@/data/sqlAnalyzerData";

const VARIANT_NOTE_EN: Record<string, string> = {
  "!=": "equivalent to <>",
  "LEFT OUTER JOIN": "OUTER is optional",
  "RIGHT OUTER JOIN": "OUTER is optional",
  "FULL OUTER JOIN": "OUTER is optional",
  "LEN": "SQL Server — use LENGTH on MySQL/SQLite",
  "CEILING": "synonym of CEIL",
  "GETDATE": "SQL Server — equivalent to NOW()",
  "SYSDATE": "Oracle — equivalent to NOW()",
  "MINUS": "Oracle — equivalent to EXCEPT",
  "IF": "MySQL only — use CASE WHEN for portable code",
  "REPLACE INTO": "MySQL only — equivalent to MERGE/upsert",
  "ROWNUM": "Oracle legacy — use ROW_NUMBER() OVER",
  "CHARINDEX": "SQL Server — equivalent to INSTR()",
  "STR_TO_DATE": "MySQL — equivalent to TO_DATE()",
  "NVL2": "Oracle — use COALESCE for portable code",
  "SUBSTR": "synonym of SUBSTRING",
  "ILIKE": "PostgreSQL — case-insensitive LIKE",
  "REGEXP": "MySQL — regular expression, more powerful than LIKE",
};

const INVALID_REASON_EN: Record<string, string> = {
  "FIND": "SQL has no FIND — use SELECT + WHERE to search",
  "SEARCH": "SQL has no SEARCH — use WHERE with LIKE to search text",
  "LOOP": "SQL has no generic LOOP — use WHILE inside procedures",
  "NEW": "SQL has no NEW — use INSERT to add data",
  "PRINT": "SQL has no PRINT — use SELECT to display values",
  "ADD": "ADD alone is not valid — use INSERT INTO (data) or ALTER TABLE ADD (column)",
  "REMOVE": "SQL has no REMOVE — use DELETE for data or DROP for objects",
  "MODIFY": "MODIFY alone is not valid — use ALTER TABLE MODIFY (structure) or UPDATE (data)",
  "CHANGE": "SQL has no CHANGE — use UPDATE (data) or ALTER TABLE MODIFY (structure)",
  "EDIT": "SQL has no EDIT — use UPDATE ... SET to modify data",
  "GET": "SQL has no GET — use SELECT to retrieve data",
  "FETCH": "FETCH alone is incomplete — use FETCH FIRST N ROWS ONLY (ANSI) or CURSOR FETCH",
  "UPSERT": "SQL has no UPSERT — use MERGE INTO to insert or update",
  "LIST": "SQL has no LIST — use SELECT to list data",
  "SHOW": "SHOW is MySQL-specific (SHOW TABLES, SHOW INDEX) — not standard SQL",
  "DESCRIBE": "DESCRIBE is MySQL-specific — does not work on SQLite",
  "DELIMITER": "DELIMITER is not SQL — it's a MySQL client command. It defines an alternative separator to \";\" inside blocks. Does not exist in SQLite, PostgreSQL or HackerRank",
  "UNSIGNED": "UNSIGNED is MySQL-specific — not supported in SQLite. Use CHECK (col >= 0) for an equivalent",
  "AUTO": "AUTO alone is not valid — use AUTO_INCREMENT (MySQL) or SERIAL (PostgreSQL)",
};

export function variantNote(token: string, lang: Lang): string {
  if (lang === "en") return VARIANT_NOTE_EN[token] ?? VARIANTS_MAP[token]?.note ?? "";
  return VARIANTS_MAP[token]?.note ?? "";
}

export function invalidReason(token: string, lang: Lang): string {
  if (lang === "en") return INVALID_REASON_EN[token] ?? INVALID_MAP[token]?.reason ?? "";
  return INVALID_MAP[token]?.reason ?? "";
}
