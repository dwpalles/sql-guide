// Multi-language overlays for VARIANTS_MAP notes and INVALID_MAP reasons.
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

const VARIANT_NOTE_ES: Record<string, string> = {
  "!=": "equivalente a <>",
  "LEFT OUTER JOIN": "OUTER es opcional",
  "RIGHT OUTER JOIN": "OUTER es opcional",
  "FULL OUTER JOIN": "OUTER es opcional",
  "LEN": "SQL Server — usa LENGTH en MySQL/SQLite",
  "CEILING": "sinónimo de CEIL",
  "GETDATE": "SQL Server — equivalente a NOW()",
  "SYSDATE": "Oracle — equivalente a NOW()",
  "MINUS": "Oracle — equivalente a EXCEPT",
  "IF": "solo MySQL — usa CASE WHEN para código portable",
  "REPLACE INTO": "solo MySQL — equivalente a MERGE/upsert",
  "ROWNUM": "legado de Oracle — usa ROW_NUMBER() OVER",
  "CHARINDEX": "SQL Server — equivalente a INSTR()",
  "STR_TO_DATE": "MySQL — equivalente a TO_DATE()",
  "NVL2": "Oracle — usa COALESCE para código portable",
  "SUBSTR": "sinónimo de SUBSTRING",
  "ILIKE": "PostgreSQL — LIKE sin distinguir mayúsculas",
  "REGEXP": "MySQL — expresión regular, más potente que LIKE",
};

const VARIANT_NOTE_FR: Record<string, string> = {
  "!=": "équivalent à <>",
  "LEFT OUTER JOIN": "OUTER est optionnel",
  "RIGHT OUTER JOIN": "OUTER est optionnel",
  "FULL OUTER JOIN": "OUTER est optionnel",
  "LEN": "SQL Server — utilisez LENGTH sur MySQL/SQLite",
  "CEILING": "synonyme de CEIL",
  "GETDATE": "SQL Server — équivalent à NOW()",
  "SYSDATE": "Oracle — équivalent à NOW()",
  "MINUS": "Oracle — équivalent à EXCEPT",
  "IF": "MySQL uniquement — utilisez CASE WHEN pour du code portable",
  "REPLACE INTO": "MySQL uniquement — équivalent à MERGE/upsert",
  "ROWNUM": "héritage Oracle — utilisez ROW_NUMBER() OVER",
  "CHARINDEX": "SQL Server — équivalent à INSTR()",
  "STR_TO_DATE": "MySQL — équivalent à TO_DATE()",
  "NVL2": "Oracle — utilisez COALESCE pour du code portable",
  "SUBSTR": "synonyme de SUBSTRING",
  "ILIKE": "PostgreSQL — LIKE insensible à la casse",
  "REGEXP": "MySQL — expression régulière, plus puissante que LIKE",
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

const INVALID_REASON_ES: Record<string, string> = {
  "FIND": "SQL no tiene FIND — usa SELECT + WHERE para buscar",
  "SEARCH": "SQL no tiene SEARCH — usa WHERE con LIKE para buscar texto",
  "LOOP": "SQL no tiene LOOP genérico — usa WHILE dentro de procedimientos",
  "NEW": "SQL no tiene NEW — usa INSERT para añadir datos",
  "PRINT": "SQL no tiene PRINT — usa SELECT para mostrar valores",
  "ADD": "ADD por sí solo no es válido — usa INSERT INTO (datos) o ALTER TABLE ADD (columna)",
  "REMOVE": "SQL no tiene REMOVE — usa DELETE para datos o DROP para objetos",
  "MODIFY": "MODIFY por sí solo no es válido — usa ALTER TABLE MODIFY (estructura) o UPDATE (datos)",
  "CHANGE": "SQL no tiene CHANGE — usa UPDATE (datos) o ALTER TABLE MODIFY (estructura)",
  "EDIT": "SQL no tiene EDIT — usa UPDATE ... SET para modificar datos",
  "GET": "SQL no tiene GET — usa SELECT para recuperar datos",
  "FETCH": "FETCH por sí solo está incompleto — usa FETCH FIRST N ROWS ONLY (ANSI) o CURSOR FETCH",
  "UPSERT": "SQL no tiene UPSERT — usa MERGE INTO para insertar o actualizar",
  "LIST": "SQL no tiene LIST — usa SELECT para listar datos",
  "SHOW": "SHOW es específico de MySQL (SHOW TABLES, SHOW INDEX) — no es SQL estándar",
  "DESCRIBE": "DESCRIBE es específico de MySQL — no funciona en SQLite",
  "DELIMITER": "DELIMITER no es SQL — es un comando del cliente MySQL. Define un separador alternativo a \";\" dentro de bloques. No existe en SQLite, PostgreSQL ni HackerRank",
  "UNSIGNED": "UNSIGNED es específico de MySQL — no es compatible con SQLite. Usa CHECK (col >= 0) como equivalente",
  "AUTO": "AUTO por sí solo no es válido — usa AUTO_INCREMENT (MySQL) o SERIAL (PostgreSQL)",
};

const INVALID_REASON_FR: Record<string, string> = {
  "FIND": "SQL n'a pas de FIND — utilisez SELECT + WHERE pour rechercher",
  "SEARCH": "SQL n'a pas de SEARCH — utilisez WHERE avec LIKE pour rechercher du texte",
  "LOOP": "SQL n'a pas de LOOP générique — utilisez WHILE dans les procédures",
  "NEW": "SQL n'a pas de NEW — utilisez INSERT pour ajouter des données",
  "PRINT": "SQL n'a pas de PRINT — utilisez SELECT pour afficher des valeurs",
  "ADD": "ADD seul n'est pas valide — utilisez INSERT INTO (données) ou ALTER TABLE ADD (colonne)",
  "REMOVE": "SQL n'a pas de REMOVE — utilisez DELETE pour les données ou DROP pour les objets",
  "MODIFY": "MODIFY seul n'est pas valide — utilisez ALTER TABLE MODIFY (structure) ou UPDATE (données)",
  "CHANGE": "SQL n'a pas de CHANGE — utilisez UPDATE (données) ou ALTER TABLE MODIFY (structure)",
  "EDIT": "SQL n'a pas de EDIT — utilisez UPDATE ... SET pour modifier des données",
  "GET": "SQL n'a pas de GET — utilisez SELECT pour récupérer des données",
  "FETCH": "FETCH seul est incomplet — utilisez FETCH FIRST N ROWS ONLY (ANSI) ou CURSOR FETCH",
  "UPSERT": "SQL n'a pas de UPSERT — utilisez MERGE INTO pour insérer ou mettre à jour",
  "LIST": "SQL n'a pas de LIST — utilisez SELECT pour lister des données",
  "SHOW": "SHOW est spécifique à MySQL (SHOW TABLES, SHOW INDEX) — pas du SQL standard",
  "DESCRIBE": "DESCRIBE est spécifique à MySQL — ne fonctionne pas sur SQLite",
  "DELIMITER": "DELIMITER n'est pas du SQL — c'est une commande du client MySQL. Il définit un séparateur alternatif à \";\" dans les blocs. N'existe pas dans SQLite, PostgreSQL ni HackerRank",
  "UNSIGNED": "UNSIGNED est spécifique à MySQL — non supporté dans SQLite. Utilisez CHECK (col >= 0) comme équivalent",
  "AUTO": "AUTO seul n'est pas valide — utilisez AUTO_INCREMENT (MySQL) ou SERIAL (PostgreSQL)",
};

const VARIANTS: Record<Exclude<Lang, "pt">, Record<string, string>> = {
  en: VARIANT_NOTE_EN,
  es: VARIANT_NOTE_ES,
  fr: VARIANT_NOTE_FR,
};
const INVALIDS: Record<Exclude<Lang, "pt">, Record<string, string>> = {
  en: INVALID_REASON_EN,
  es: INVALID_REASON_ES,
  fr: INVALID_REASON_FR,
};

export function variantNote(token: string, lang: Lang): string {
  if (lang === "pt") return VARIANTS_MAP[token]?.note ?? "";
  return VARIANTS[lang]?.[token] ?? VARIANTS_MAP[token]?.note ?? "";
}

export function invalidReason(token: string, lang: Lang): string {
  if (lang === "pt") return INVALID_MAP[token]?.reason ?? "";
  return INVALIDS[lang]?.[token] ?? INVALID_MAP[token]?.reason ?? "";
}
