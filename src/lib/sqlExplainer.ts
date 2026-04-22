// Lightweight SQL "step-by-step" explainer used by the Doctor panel.
// Parses the most common clauses of SELECT/INSERT/UPDATE/DELETE/CREATE/etc.
// and returns a list of explanation steps with e-commerce context.

import type { Lang } from "@/i18n";

export interface ExplainStep {
  /** clause keyword, uppercase (e.g. "SELECT", "FROM", "WHERE") */
  clause: string;
  /** raw text snippet captured from the user's SQL */
  snippet: string;
  /** plain-language explanation, localized */
  explanation: string;
  /** optional contextual note tied to the e-commerce schema */
  context?: string;
}

const SCHEMA_TABLES = [
  "clientes",
  "categorias",
  "produtos",
  "pedidos",
  "itens_pedido",
] as const;

const TABLE_HINTS_PT: Record<string, string> = {
  clientes: "tabela clientes (id, nome, email, cidade, estado, data_cadastro)",
  categorias: "tabela categorias (id, nome)",
  produtos: "tabela produtos (id, nome, preco, estoque, id_categoria)",
  pedidos: "tabela pedidos (id, id_cliente, data_pedido, status, total)",
  itens_pedido:
    "tabela itens_pedido (id, id_pedido, id_produto, quantidade, preco_unitario)",
};

const TABLE_HINTS_EN: Record<string, string> = {
  clientes: "clientes table (id, nome, email, cidade, estado, data_cadastro)",
  categorias: "categorias table (id, nome)",
  produtos: "produtos table (id, nome, preco, estoque, id_categoria)",
  pedidos: "pedidos table (id, id_cliente, data_pedido, status, total)",
  itens_pedido:
    "itens_pedido table (id, id_pedido, id_produto, quantidade, preco_unitario)",
};

function stripStringsAndComments(sql: string): string {
  return sql
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/'[^']*'/g, "''")
    .replace(/"[^"]*"/g, '""');
}

function findKnownTables(text: string): string[] {
  const lower = text.toLowerCase();
  return SCHEMA_TABLES.filter((t) => new RegExp(`\\b${t}\\b`).test(lower));
}

function tableContextNote(text: string, lang: Lang): string | undefined {
  const found = findKnownTables(text);
  if (found.length === 0) return undefined;
  const hints = lang === "en" ? TABLE_HINTS_EN : TABLE_HINTS_PT;
  const prefix = lang === "en" ? "In the e-commerce schema" : "No schema e-commerce";
  return `${prefix}: ${found.map((t) => hints[t]).join(" · ")}.`;
}

/** Split a SELECT statement into its main clauses. */
function explainSelect(sql: string, lang: Lang): ExplainStep[] {
  const steps: ExplainStep[] = [];
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();

  const clauseRegex =
    /\b(SELECT(?:\s+DISTINCT)?|FROM|(?:LEFT|RIGHT|FULL|INNER|CROSS)?\s*JOIN|ON|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT|OFFSET|UNION(?:\s+ALL)?)\b/gi;

  const matches: { clause: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = clauseRegex.exec(norm)) !== null) {
    matches.push({
      clause: m[1].replace(/\s+/g, " ").trim().toUpperCase(),
      index: m.index,
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : norm.length;
    const fullSnippet = norm.slice(start, end).replace(/;\s*$/, "").trim();
    const clauseUpper = matches[i].clause;
    const body = fullSnippet.replace(new RegExp(`^${clauseUpper}\\s*`, "i"), "").trim();
    const ctx = tableContextNote(body, lang);

    steps.push(buildStep(clauseUpper, fullSnippet, body, ctx, lang));
  }

  return steps;
}

function buildStep(
  clause: string,
  snippet: string,
  body: string,
  ctx: string | undefined,
  lang: Lang,
): ExplainStep {
  const en = lang === "en";
  let explanation = "";

  switch (clause) {
    case "SELECT":
    case "SELECT DISTINCT": {
      const cols = body || "*";
      const isStar = cols.trim() === "*";
      const isDistinct = clause === "SELECT DISTINCT";
      if (en) {
        explanation = isStar
          ? `Selects ${isDistinct ? "unique rows of " : ""}all columns from the resulting rows.`
          : `Defines which columns/expressions will be returned: ${cols}.${
              isDistinct ? " DISTINCT removes duplicate rows from the final result." : ""
            }`;
        if (/\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(cols)) {
          explanation +=
            " Aggregate functions are present — the result will be summarized (typically combined with GROUP BY).";
        }
      } else {
        explanation = isStar
          ? `Selecciona ${isDistinct ? "linhas únicas de " : ""}todas as colunas das linhas resultantes.`
          : `Define quais colunas/expressões serão devolvidas: ${cols}.${
              isDistinct ? " DISTINCT remove linhas duplicadas no resultado final." : ""
            }`;
        if (/\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(cols)) {
          explanation +=
            " Há funções de agregação — o resultado será resumido (geralmente combinado com GROUP BY).";
        }
      }
      break;
    }
    case "FROM": {
      const tables = findKnownTables(body);
      if (en) {
        explanation = tables.length
          ? `Indicates the data source: ${tables.join(", ")}.`
          : `Indicates which table (or subquery) the rows will come from: ${body}.`;
      } else {
        explanation = tables.length
          ? `Indica a origem dos dados: ${tables.join(", ")}.`
          : `Indica de qual tabela (ou subconsulta) virão as linhas: ${body}.`;
      }
      break;
    }
    case "JOIN":
    case "INNER JOIN":
    case "LEFT JOIN":
    case "RIGHT JOIN":
    case "FULL JOIN":
    case "CROSS JOIN": {
      const kind = clause.replace("JOIN", "").trim() || "INNER";
      const descPt: Record<string, string> = {
        INNER: "mantém apenas as linhas com correspondência nos dois lados",
        LEFT: "mantém todas as linhas da tabela à esquerda; sem par à direita vira NULL",
        RIGHT: "mantém todas as linhas da tabela à direita; sem par à esquerda vira NULL",
        FULL: "mantém linhas de ambos os lados, preenchendo os faltantes com NULL",
        CROSS: "produz o produto cartesiano (todas as combinações possíveis)",
      };
      const descEn: Record<string, string> = {
        INNER: "keeps only rows with matches on both sides",
        LEFT: "keeps all rows from the left table; rows with no match on the right become NULL",
        RIGHT: "keeps all rows from the right table; rows with no match on the left become NULL",
        FULL: "keeps rows from both sides, filling missing ones with NULL",
        CROSS: "produces the cartesian product (all possible combinations)",
      };
      explanation = en
        ? `Combines data with another table (${body}). ${kind} JOIN ${descEn[kind] ?? ""}.`
        : `Combina dados com outra tabela (${body}). ${kind} JOIN ${descPt[kind] ?? ""}.`;
      break;
    }
    case "ON": {
      explanation = en
        ? `Defines the join condition between tables: rows where ${body} is true are combined.`
        : `Define a condição de junção entre as tabelas: linhas onde ${body} é verdadeiro são combinadas.`;
      break;
    }
    case "WHERE": {
      if (en) {
        explanation = `Filters rows before any grouping: only those where ${body} is true pass through.`;
        if (/\b(LIKE|ILIKE)\b/i.test(body)) explanation += " (LIKE matches a text pattern.)";
        if (/\bIN\s*\(/i.test(body)) explanation += " (IN tests membership in a list.)";
        if (/\bBETWEEN\b/i.test(body)) explanation += " (BETWEEN tests an inclusive range.)";
        if (/\bIS\s+NULL\b/i.test(body)) explanation += " (IS NULL detects missing values.)";
      } else {
        explanation = `Filtra as linhas antes de qualquer agrupamento: só passam aquelas em que ${body} é verdadeiro.`;
        if (/\b(LIKE|ILIKE)\b/i.test(body)) explanation += " (LIKE faz busca por padrão de texto.)";
        if (/\bIN\s*\(/i.test(body)) explanation += " (IN testa pertencimento a uma lista.)";
        if (/\bBETWEEN\b/i.test(body)) explanation += " (BETWEEN testa intervalo inclusivo.)";
        if (/\bIS\s+NULL\b/i.test(body)) explanation += " (IS NULL detecta valores ausentes.)";
      }
      break;
    }
    case "GROUP BY": {
      explanation = en
        ? `Groups rows by ${body}. Each group becomes one row in the result, and aggregations (COUNT, SUM, AVG…) are computed per group.`
        : `Agrupa as linhas por ${body}. Cada grupo vira uma linha no resultado, e as agregações (COUNT, SUM, AVG…) são calculadas por grupo.`;
      break;
    }
    case "HAVING": {
      explanation = en
        ? `Filters the groups formed by GROUP BY: only groups where ${body} is true pass through. Use HAVING for conditions on aggregations (e.g. COUNT(*) > 5).`
        : `Filtra os grupos formados pelo GROUP BY: só passam grupos em que ${body} é verdadeiro. Use HAVING para condições sobre agregações (ex.: COUNT(*) > 5).`;
      break;
    }
    case "ORDER BY": {
      const isDesc = /\bDESC\b/i.test(body);
      explanation = en
        ? `Orders the final result by ${body} (${isDesc ? "descending" : "ascending"} order).`
        : `Ordena o resultado final por ${body} (ordem ${isDesc ? "decrescente" : "crescente"}).`;
      break;
    }
    case "LIMIT": {
      explanation = en
        ? `Limits the number of returned rows to ${body}.`
        : `Limita o número de linhas devolvidas a ${body}.`;
      break;
    }
    case "OFFSET": {
      explanation = en
        ? `Skips the first ${body} rows before starting to return results (useful for pagination).`
        : `Pula as primeiras ${body} linhas antes de começar a devolver resultados (útil para paginação).`;
      break;
    }
    case "UNION":
    case "UNION ALL": {
      if (en) {
        explanation =
          clause === "UNION"
            ? "Combines the results of two queries removing duplicate rows."
            : "Combines the results of two queries keeping all rows (including duplicates).";
      } else {
        explanation =
          clause === "UNION"
            ? "Junta o resultado de duas consultas removendo linhas duplicadas."
            : "Junta o resultado de duas consultas mantendo todas as linhas (incluindo duplicadas).";
      }
      break;
    }
    default:
      explanation = en ? `Clause ${clause}: ${body}`.trim() : `Cláusula ${clause}: ${body}`.trim();
  }

  return { clause, snippet, explanation, context: ctx };
}

function explainInsert(sql: string, lang: Lang): ExplainStep[] {
  const en = lang === "en";
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/INSERT\s+INTO\s+(\w+)\s*(\([^)]*\))?\s*(VALUES\s*\(.+\)|SELECT\s+.+)?/i);
  if (!m) return steps;
  const table = m[1];
  const cols = m[2] ?? "";
  const values = m[3] ?? "";
  const ctx = tableContextNote(table, lang);
  steps.push({
    clause: "INSERT INTO",
    snippet: `INSERT INTO ${table} ${cols}`.trim(),
    explanation: en
      ? cols
        ? `Inserts a new row into ${table}, filling columns ${cols.replace(/[()]/g, "")}.`
        : `Inserts a new row into ${table} (all columns, in the schema-defined order).`
      : cols
        ? `Insere uma nova linha em ${table}, preenchendo as colunas ${cols.replace(/[()]/g, "")}.`
        : `Insere uma nova linha em ${table} (todas as colunas, na ordem definida pelo schema).`,
    context: ctx,
  });
  if (values) {
    const isValues = values.toUpperCase().startsWith("VALUES");
    steps.push({
      clause: isValues ? "VALUES" : en ? "SELECT (source)" : "SELECT (origem)",
      snippet: values,
      explanation: en
        ? isValues
          ? "Lists the values to be inserted, in the same order as the columns."
          : "Instead of literal values, the data comes from another SELECT query (insert-from-select)."
        : isValues
          ? "Lista os valores que serão inseridos, na mesma ordem das colunas."
          : "Em vez de valores literais, os dados vêm de outra consulta SELECT (insert-from-select).",
    });
  }
  return steps;
}

function explainUpdate(sql: string, lang: Lang): ExplainStep[] {
  const en = lang === "en";
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?;?$/i);
  if (!m) return steps;
  const [, table, setPart, wherePart] = m;
  steps.push({
    clause: "UPDATE",
    snippet: `UPDATE ${table}`,
    explanation: en
      ? `Updates existing rows in the ${table} table.`
      : `Atualiza linhas existentes na tabela ${table}.`,
    context: tableContextNote(table, lang),
  });
  steps.push({
    clause: "SET",
    snippet: `SET ${setPart}`,
    explanation: en
      ? `Sets the new column values: ${setPart}.`
      : `Define os novos valores das colunas: ${setPart}.`,
  });
  if (wherePart) {
    steps.push({
      clause: "WHERE",
      snippet: `WHERE ${wherePart}`,
      explanation: en
        ? `Restricts the update to rows where ${wherePart} is true. ⚠️ Without WHERE, every row would be updated.`
        : `Restringe a atualização às linhas em que ${wherePart} é verdadeiro. ⚠️ Sem WHERE, todas as linhas seriam atualizadas.`,
    });
  } else {
    steps.push({
      clause: en ? "(no WHERE)" : "(sem WHERE)",
      snippet: "—",
      explanation: en
        ? "⚠️ Warning: without WHERE, every row in the table will be updated. Almost always a mistake."
        : "⚠️ Atenção: sem WHERE, todas as linhas da tabela serão atualizadas. Quase sempre é um erro.",
    });
  }
  return steps;
}

function explainDelete(sql: string, lang: Lang): ExplainStep[] {
  const en = lang === "en";
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?;?$/i);
  if (!m) return steps;
  const [, table, wherePart] = m;
  steps.push({
    clause: "DELETE FROM",
    snippet: `DELETE FROM ${table}`,
    explanation: en
      ? `Removes rows from the ${table} table.`
      : `Remove linhas da tabela ${table}.`,
    context: tableContextNote(table, lang),
  });
  if (wherePart) {
    steps.push({
      clause: "WHERE",
      snippet: `WHERE ${wherePart}`,
      explanation: en
        ? `Only rows where ${wherePart} is true will be removed.`
        : `Apenas as linhas em que ${wherePart} é verdadeiro serão removidas.`,
    });
  } else {
    steps.push({
      clause: en ? "(no WHERE)" : "(sem WHERE)",
      snippet: "—",
      explanation: en
        ? "⚠️ Without WHERE, ALL rows in the table will be deleted. Confirm this is what you want."
        : "⚠️ Sem WHERE, TODAS as linhas da tabela serão apagadas. Confirme se é mesmo isso que quer.",
    });
  }
  return steps;
}

function explainCreate(sql: string, lang: Lang): ExplainStep[] {
  const en = lang === "en";
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const m = norm.match(/CREATE\s+(TABLE|VIEW|INDEX|DATABASE|SCHEMA)\s+(\w+)/i);
  if (!m) return [];
  const [, kind, name] = m;
  return [
    {
      clause: `CREATE ${kind.toUpperCase()}`,
      snippet: norm.slice(0, 120) + (norm.length > 120 ? "…" : ""),
      explanation: en
        ? `Creates a ${kind.toLowerCase()} called "${name}".`
        : `Cria ${kind.toLowerCase()} chamado(a) "${name}".`,
      context: tableContextNote(name, lang),
    },
  ];
}

function explainAlter(sql: string, lang: Lang): ExplainStep[] {
  const en = lang === "en";
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const m = norm.match(/ALTER\s+TABLE\s+(\w+)\s+(.+);?$/i);
  if (!m) return [];
  const [, table, action] = m;
  return [
    {
      clause: "ALTER TABLE",
      snippet: norm,
      explanation: en
        ? `Modifies the structure of the ${table} table: ${action}.`
        : `Modifica a estrutura da tabela ${table}: ${action}.`,
      context: tableContextNote(table, lang),
    },
  ];
}

export function explainSql(input: string, lang: Lang = "pt"): ExplainStep[] {
  const en = lang === "en";
  const trimmed = input.trim();
  if (!trimmed) return [];
  const head = trimmed.toUpperCase();

  if (/^WITH\b/.test(head)) {
    const cteIntro: ExplainStep = {
      clause: "WITH (CTE)",
      snippet: trimmed.split(/\bSELECT\b/i)[0].trim(),
      explanation: en
        ? "Defines one or more Common Table Expressions (named subqueries) that can be referenced in the SELECT below."
        : "Define uma ou mais Common Table Expressions (subconsultas nomeadas) que podem ser referenciadas no SELECT abaixo.",
    };
    return [cteIntro, ...explainSelect(trimmed, lang)];
  }
  if (head.startsWith("SELECT")) return explainSelect(trimmed, lang);
  if (head.startsWith("INSERT")) return explainInsert(trimmed, lang);
  if (head.startsWith("UPDATE")) return explainUpdate(trimmed, lang);
  if (head.startsWith("DELETE")) return explainDelete(trimmed, lang);
  if (head.startsWith("CREATE")) return explainCreate(trimmed, lang);
  if (head.startsWith("ALTER")) return explainAlter(trimmed, lang);
  if (head.startsWith("DROP")) {
    const m = trimmed.match(/DROP\s+(TABLE|VIEW|INDEX|DATABASE)\s+(\w+)/i);
    if (m) {
      return [
        {
          clause: `DROP ${m[1].toUpperCase()}`,
          snippet: trimmed,
          explanation: en
            ? `Removes ${m[1].toLowerCase()} "${m[2]}" from the database. ⚠️ Destructive and usually irreversible.`
            : `Remove ${m[1].toLowerCase()} "${m[2]}" do banco. ⚠️ Operação destrutiva e geralmente irreversível.`,
          context: tableContextNote(m[2], lang),
        },
      ];
    }
  }
  if (head.startsWith("TRUNCATE")) {
    const m = trimmed.match(/TRUNCATE\s+(?:TABLE\s+)?(\w+)/i);
    if (m) {
      return [
        {
          clause: "TRUNCATE",
          snippet: trimmed,
          explanation: en
            ? `Empties ALL rows from the "${m[1]}" table but keeps its structure. Faster than DELETE without WHERE and usually cannot be rolled back.`
            : `Apaga TODAS as linhas da tabela "${m[1]}", mas mantém a estrutura. Mais rápido que DELETE sem WHERE e geralmente não pode ser revertido.`,
          context: tableContextNote(m[1], lang),
        },
      ];
    }
  }
  return [];
}
