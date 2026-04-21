// Lightweight SQL "step-by-step" explainer used by the Doctor panel.
// Parses the most common clauses of SELECT/INSERT/UPDATE/DELETE/CREATE/etc.
// and returns a list of explanation steps with e-commerce context.

export interface ExplainStep {
  /** clause keyword, uppercase (e.g. "SELECT", "FROM", "WHERE") */
  clause: string;
  /** raw text snippet captured from the user's SQL */
  snippet: string;
  /** plain-language explanation in PT-BR */
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

const TABLE_HINTS: Record<string, string> = {
  clientes: "tabela clientes (id, nome, email, cidade, estado, data_cadastro)",
  categorias: "tabela categorias (id, nome)",
  produtos: "tabela produtos (id, nome, preco, estoque, id_categoria)",
  pedidos: "tabela pedidos (id, id_cliente, data_pedido, status, total)",
  itens_pedido:
    "tabela itens_pedido (id, id_pedido, id_produto, quantidade, preco_unitario)",
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

function tableContextNote(text: string): string | undefined {
  const found = findKnownTables(text);
  if (found.length === 0) return undefined;
  return `No schema e-commerce: ${found.map((t) => TABLE_HINTS[t]).join(" · ")}.`;
}

/** Split a SELECT statement into its main clauses. */
function explainSelect(sql: string): ExplainStep[] {
  const steps: ExplainStep[] = [];
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();

  // Match clauses in order. Each regex captures up to the next clause keyword.
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
    const ctx = tableContextNote(body);

    steps.push(buildStep(clauseUpper, fullSnippet, body, ctx));
  }

  return steps;
}

function buildStep(
  clause: string,
  snippet: string,
  body: string,
  ctx: string | undefined,
): ExplainStep {
  let explanation = "";

  switch (clause) {
    case "SELECT":
    case "SELECT DISTINCT": {
      const cols = body || "*";
      const isStar = cols.trim() === "*";
      const isDistinct = clause === "SELECT DISTINCT";
      explanation = isStar
        ? `Selecciona ${isDistinct ? "linhas únicas de " : ""}todas as colunas das linhas resultantes.`
        : `Define quais colunas/expressões serão devolvidas: ${cols}.${
            isDistinct ? " DISTINCT remove linhas duplicadas no resultado final." : ""
          }`;
      if (/\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(cols)) {
        explanation +=
          " Há funções de agregação — o resultado será resumido (geralmente combinado com GROUP BY).";
      }
      break;
    }
    case "FROM": {
      const tables = findKnownTables(body);
      explanation = tables.length
        ? `Indica a origem dos dados: ${tables.join(", ")}.`
        : `Indica de qual tabela (ou subconsulta) virão as linhas: ${body}.`;
      break;
    }
    case "JOIN":
    case "INNER JOIN":
    case "LEFT JOIN":
    case "RIGHT JOIN":
    case "FULL JOIN":
    case "CROSS JOIN": {
      const kind = clause.replace("JOIN", "").trim() || "INNER";
      const desc: Record<string, string> = {
        INNER: "mantém apenas as linhas com correspondência nos dois lados",
        LEFT: "mantém todas as linhas da tabela à esquerda; sem par à direita vira NULL",
        RIGHT: "mantém todas as linhas da tabela à direita; sem par à esquerda vira NULL",
        FULL: "mantém linhas de ambos os lados, preenchendo os faltantes com NULL",
        CROSS: "produz o produto cartesiano (todas as combinações possíveis)",
      };
      explanation = `Combina dados com outra tabela (${body}). ${kind} JOIN ${desc[kind] ?? ""}.`;
      break;
    }
    case "ON": {
      explanation = `Define a condição de junção entre as tabelas: linhas onde ${body} é verdadeiro são combinadas.`;
      break;
    }
    case "WHERE": {
      explanation = `Filtra as linhas antes de qualquer agrupamento: só passam aquelas em que ${body} é verdadeiro.`;
      if (/\b(LIKE|ILIKE)\b/i.test(body)) explanation += " (LIKE faz busca por padrão de texto.)";
      if (/\bIN\s*\(/i.test(body)) explanation += " (IN testa pertencimento a uma lista.)";
      if (/\bBETWEEN\b/i.test(body)) explanation += " (BETWEEN testa intervalo inclusivo.)";
      if (/\bIS\s+NULL\b/i.test(body)) explanation += " (IS NULL detecta valores ausentes.)";
      break;
    }
    case "GROUP BY": {
      explanation = `Agrupa as linhas por ${body}. Cada grupo vira uma linha no resultado, e as agregações (COUNT, SUM, AVG…) são calculadas por grupo.`;
      break;
    }
    case "HAVING": {
      explanation = `Filtra os grupos formados pelo GROUP BY: só passam grupos em que ${body} é verdadeiro. Use HAVING para condições sobre agregações (ex.: COUNT(*) > 5).`;
      break;
    }
    case "ORDER BY": {
      const dir = /\bDESC\b/i.test(body) ? "decrescente" : "crescente";
      explanation = `Ordena o resultado final por ${body} (ordem ${dir}).`;
      break;
    }
    case "LIMIT": {
      explanation = `Limita o número de linhas devolvidas a ${body}.`;
      break;
    }
    case "OFFSET": {
      explanation = `Pula as primeiras ${body} linhas antes de começar a devolver resultados (útil para paginação).`;
      break;
    }
    case "UNION":
    case "UNION ALL": {
      explanation =
        clause === "UNION"
          ? "Junta o resultado de duas consultas removendo linhas duplicadas."
          : "Junta o resultado de duas consultas mantendo todas as linhas (incluindo duplicadas).";
      break;
    }
    default:
      explanation = `Cláusula ${clause}: ${body}`.trim();
  }

  return { clause, snippet, explanation, context: ctx };
}

function explainInsert(sql: string): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/INSERT\s+INTO\s+(\w+)\s*(\([^)]*\))?\s*(VALUES\s*\(.+\)|SELECT\s+.+)?/i);
  if (!m) return steps;
  const table = m[1];
  const cols = m[2] ?? "";
  const values = m[3] ?? "";
  const ctx = tableContextNote(table);
  steps.push({
    clause: "INSERT INTO",
    snippet: `INSERT INTO ${table} ${cols}`.trim(),
    explanation: cols
      ? `Insere uma nova linha em ${table}, preenchendo as colunas ${cols.replace(/[()]/g, "")}.`
      : `Insere uma nova linha em ${table} (todas as colunas, na ordem definida pelo schema).`,
    context: ctx,
  });
  if (values) {
    steps.push({
      clause: values.toUpperCase().startsWith("VALUES") ? "VALUES" : "SELECT (origem)",
      snippet: values,
      explanation: values.toUpperCase().startsWith("VALUES")
        ? "Lista os valores que serão inseridos, na mesma ordem das colunas."
        : "Em vez de valores literais, os dados vêm de outra consulta SELECT (insert-from-select).",
    });
  }
  return steps;
}

function explainUpdate(sql: string): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?;?$/i);
  if (!m) return steps;
  const [, table, setPart, wherePart] = m;
  steps.push({
    clause: "UPDATE",
    snippet: `UPDATE ${table}`,
    explanation: `Atualiza linhas existentes na tabela ${table}.`,
    context: tableContextNote(table),
  });
  steps.push({
    clause: "SET",
    snippet: `SET ${setPart}`,
    explanation: `Define os novos valores das colunas: ${setPart}.`,
  });
  if (wherePart) {
    steps.push({
      clause: "WHERE",
      snippet: `WHERE ${wherePart}`,
      explanation: `Restringe a atualização às linhas em que ${wherePart} é verdadeiro. ⚠️ Sem WHERE, todas as linhas seriam atualizadas.`,
    });
  } else {
    steps.push({
      clause: "(sem WHERE)",
      snippet: "—",
      explanation:
        "⚠️ Atenção: sem WHERE, todas as linhas da tabela serão atualizadas. Quase sempre é um erro.",
    });
  }
  return steps;
}

function explainDelete(sql: string): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?;?$/i);
  if (!m) return steps;
  const [, table, wherePart] = m;
  steps.push({
    clause: "DELETE FROM",
    snippet: `DELETE FROM ${table}`,
    explanation: `Remove linhas da tabela ${table}.`,
    context: tableContextNote(table),
  });
  if (wherePart) {
    steps.push({
      clause: "WHERE",
      snippet: `WHERE ${wherePart}`,
      explanation: `Apenas as linhas em que ${wherePart} é verdadeiro serão removidas.`,
    });
  } else {
    steps.push({
      clause: "(sem WHERE)",
      snippet: "—",
      explanation:
        "⚠️ Sem WHERE, TODAS as linhas da tabela serão apagadas. Confirme se é mesmo isso que quer.",
    });
  }
  return steps;
}

function explainCreate(sql: string): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const m = norm.match(/CREATE\s+(TABLE|VIEW|INDEX|DATABASE|SCHEMA)\s+(\w+)/i);
  if (!m) return [];
  const [, kind, name] = m;
  return [
    {
      clause: `CREATE ${kind.toUpperCase()}`,
      snippet: norm.slice(0, 120) + (norm.length > 120 ? "…" : ""),
      explanation: `Cria ${kind.toLowerCase()} chamado(a) "${name}".`,
      context: tableContextNote(name),
    },
  ];
}

function explainAlter(sql: string): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const m = norm.match(/ALTER\s+TABLE\s+(\w+)\s+(.+);?$/i);
  if (!m) return [];
  const [, table, action] = m;
  return [
    {
      clause: "ALTER TABLE",
      snippet: norm,
      explanation: `Modifica a estrutura da tabela ${table}: ${action}.`,
      context: tableContextNote(table),
    },
  ];
}

export function explainSql(input: string): ExplainStep[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  const head = trimmed.toUpperCase();

  if (/^WITH\b/.test(head)) {
    // CTE: explain the trailing SELECT
    const cteIntro: ExplainStep = {
      clause: "WITH (CTE)",
      snippet: trimmed.split(/\bSELECT\b/i)[0].trim(),
      explanation:
        "Define uma ou mais Common Table Expressions (subconsultas nomeadas) que podem ser referenciadas no SELECT abaixo.",
    };
    return [cteIntro, ...explainSelect(trimmed)];
  }
  if (head.startsWith("SELECT")) return explainSelect(trimmed);
  if (head.startsWith("INSERT")) return explainInsert(trimmed);
  if (head.startsWith("UPDATE")) return explainUpdate(trimmed);
  if (head.startsWith("DELETE")) return explainDelete(trimmed);
  if (head.startsWith("CREATE")) return explainCreate(trimmed);
  if (head.startsWith("ALTER")) return explainAlter(trimmed);
  if (head.startsWith("DROP")) {
    const m = trimmed.match(/DROP\s+(TABLE|VIEW|INDEX|DATABASE)\s+(\w+)/i);
    if (m) {
      return [
        {
          clause: `DROP ${m[1].toUpperCase()}`,
          snippet: trimmed,
          explanation: `Remove ${m[1].toLowerCase()} "${m[2]}" do banco. ⚠️ Operação destrutiva e geralmente irreversível.`,
          context: tableContextNote(m[2]),
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
          explanation: `Apaga TODAS as linhas da tabela "${m[1]}", mas mantém a estrutura. Mais rápido que DELETE sem WHERE e geralmente não pode ser revertido.`,
          context: tableContextNote(m[1]),
        },
      ];
    }
  }
  return [];
}
