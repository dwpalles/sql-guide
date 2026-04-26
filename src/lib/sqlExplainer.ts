// Lightweight SQL "step-by-step" explainer used by the Doctor panel.
// Parses the most common clauses of SELECT/INSERT/UPDATE/DELETE/CREATE/etc.
// and returns a list of explanation steps with e-commerce context.
// i18n: PT / EN / ES / FR.

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

const TABLE_HINTS: Record<Lang, Record<string, string>> = {
  pt: {
    clientes: "tabela clientes (id, nome, email, cidade, estado, data_cadastro)",
    categorias: "tabela categorias (id, nome)",
    produtos: "tabela produtos (id, nome, preco, estoque, id_categoria)",
    pedidos: "tabela pedidos (id, id_cliente, data_pedido, status, total)",
    itens_pedido:
      "tabela itens_pedido (id, id_pedido, id_produto, quantidade, preco_unitario)",
  },
  en: {
    clientes: "clientes table (id, nome, email, cidade, estado, data_cadastro)",
    categorias: "categorias table (id, nome)",
    produtos: "produtos table (id, nome, preco, estoque, id_categoria)",
    pedidos: "pedidos table (id, id_cliente, data_pedido, status, total)",
    itens_pedido:
      "itens_pedido table (id, id_pedido, id_produto, quantidade, preco_unitario)",
  },
  es: {
    clientes: "tabla clientes (id, nome, email, cidade, estado, data_cadastro)",
    categorias: "tabla categorias (id, nome)",
    produtos: "tabla produtos (id, nome, preco, estoque, id_categoria)",
    pedidos: "tabla pedidos (id, id_cliente, data_pedido, status, total)",
    itens_pedido:
      "tabla itens_pedido (id, id_pedido, id_produto, quantidade, preco_unitario)",
  },
  fr: {
    clientes: "table clientes (id, nome, email, cidade, estado, data_cadastro)",
    categorias: "table categorias (id, nome)",
    produtos: "table produtos (id, nome, preco, estoque, id_categoria)",
    pedidos: "table pedidos (id, id_cliente, data_pedido, status, total)",
    itens_pedido:
      "table itens_pedido (id, id_pedido, id_produto, quantidade, preco_unitario)",
  },
};

const SCHEMA_PREFIX: Record<Lang, string> = {
  pt: "No schema e-commerce",
  en: "In the e-commerce schema",
  es: "En el esquema de e-commerce",
  fr: "Dans le schéma e-commerce",
};

// Centralized translations.
const T = {
  selectStar: (isDistinct: boolean, lang: Lang): string => {
    const m: Record<Lang, [string, string]> = {
      pt: ["Seleciona ", "todas as colunas das linhas resultantes."],
      en: ["Selects ", "all columns from the resulting rows."],
      es: ["Selecciona ", "todas las columnas de las filas resultantes."],
      fr: ["Sélectionne ", "toutes les colonnes des lignes résultantes."],
    };
    const dPrefix: Record<Lang, string> = {
      pt: "linhas únicas de ",
      en: "unique rows of ",
      es: "filas únicas de ",
      fr: "les lignes uniques de ",
    };
    const [pre, post] = m[lang];
    return `${pre}${isDistinct ? dPrefix[lang] : ""}${post}`;
  },
  selectColumns: (cols: string, isDistinct: boolean, lang: Lang): string => {
    const base: Record<Lang, string> = {
      pt: `Define quais colunas/expressões serão devolvidas: ${cols}.`,
      en: `Defines which columns/expressions will be returned: ${cols}.`,
      es: `Define qué columnas/expresiones se devolverán: ${cols}.`,
      fr: `Définit quelles colonnes/expressions seront retournées : ${cols}.`,
    };
    const distinct: Record<Lang, string> = {
      pt: " DISTINCT remove linhas duplicadas no resultado final.",
      en: " DISTINCT removes duplicate rows from the final result.",
      es: " DISTINCT elimina filas duplicadas del resultado final.",
      fr: " DISTINCT supprime les lignes en doublon du résultat final.",
    };
    return base[lang] + (isDistinct ? distinct[lang] : "");
  },
  aggregationsHint: (lang: Lang): string => ({
    pt: " Há funções de agregação, o resultado será resumido (geralmente combinado com GROUP BY).",
    en: " Aggregate functions are present, the result will be summarized (typically combined with GROUP BY).",
    es: " Hay funciones de agregación, el resultado se resumirá (generalmente combinado con GROUP BY).",
    fr: " Des fonctions d'agrégation sont présentes, le résultat sera résumé (généralement combiné avec GROUP BY).",
  }[lang]),
  fromTables: (tables: string, lang: Lang): string => ({
    pt: `Indica a origem dos dados: ${tables}.`,
    en: `Indicates the data source: ${tables}.`,
    es: `Indica el origen de los datos: ${tables}.`,
    fr: `Indique la source des données : ${tables}.`,
  }[lang]),
  fromBody: (body: string, lang: Lang): string => ({
    pt: `Indica de qual tabela (ou subconsulta) virão as linhas: ${body}.`,
    en: `Indicates which table (or subquery) the rows will come from: ${body}.`,
    es: `Indica de qué tabla (o subconsulta) vendrán las filas: ${body}.`,
    fr: `Indique de quelle table (ou sous-requête) les lignes proviendront : ${body}.`,
  }[lang]),
  joinDesc: (kind: string, body: string, desc: string, lang: Lang): string => ({
    pt: `Combina dados com outra tabela (${body}). ${kind} JOIN ${desc}.`,
    en: `Combines data with another table (${body}). ${kind} JOIN ${desc}.`,
    es: `Combina datos con otra tabla (${body}). ${kind} JOIN ${desc}.`,
    fr: `Combine les données avec une autre table (${body}). ${kind} JOIN ${desc}.`,
  }[lang]),
  joinKindDesc: (lang: Lang): Record<string, string> => ({
    pt: {
      INNER: "mantém apenas as linhas com correspondência nos dois lados",
      LEFT: "mantém todas as linhas da tabela à esquerda; sem par à direita vira NULL",
      RIGHT: "mantém todas as linhas da tabela à direita; sem par à esquerda vira NULL",
      FULL: "mantém linhas de ambos os lados, preenchendo os faltantes com NULL",
      CROSS: "produz o produto cartesiano (todas as combinações possíveis)",
    },
    en: {
      INNER: "keeps only rows with matches on both sides",
      LEFT: "keeps all rows from the left table; rows with no match on the right become NULL",
      RIGHT: "keeps all rows from the right table; rows with no match on the left become NULL",
      FULL: "keeps rows from both sides, filling missing ones with NULL",
      CROSS: "produces the cartesian product (all possible combinations)",
    },
    es: {
      INNER: "mantiene solo las filas con coincidencia en ambos lados",
      LEFT: "mantiene todas las filas de la tabla izquierda; sin coincidencia a la derecha se vuelve NULL",
      RIGHT: "mantiene todas las filas de la tabla derecha; sin coincidencia a la izquierda se vuelve NULL",
      FULL: "mantiene filas de ambos lados, rellenando las faltantes con NULL",
      CROSS: "produce el producto cartesiano (todas las combinaciones posibles)",
    },
    fr: {
      INNER: "ne garde que les lignes avec correspondance des deux côtés",
      LEFT: "garde toutes les lignes de la table de gauche ; sans correspondance à droite devient NULL",
      RIGHT: "garde toutes les lignes de la table de droite ; sans correspondance à gauche devient NULL",
      FULL: "garde les lignes des deux côtés, en remplissant les manquantes par NULL",
      CROSS: "produit le produit cartésien (toutes les combinaisons possibles)",
    },
  }[lang]),
  on: (body: string, lang: Lang): string => ({
    pt: `Define a condição de junção entre as tabelas: linhas onde ${body} é verdadeiro são combinadas.`,
    en: `Defines the join condition between tables: rows where ${body} is true are combined.`,
    es: `Define la condición de unión entre las tablas: las filas donde ${body} es verdadero se combinan.`,
    fr: `Définit la condition de jointure entre les tables : les lignes où ${body} est vrai sont combinées.`,
  }[lang]),
  whereBase: (body: string, lang: Lang): string => ({
    pt: `Filtra as linhas antes de qualquer agrupamento: só passam aquelas em que ${body} é verdadeiro.`,
    en: `Filters rows before any grouping: only those where ${body} is true pass through.`,
    es: `Filtra las filas antes de cualquier agrupación: solo pasan aquellas donde ${body} es verdadero.`,
    fr: `Filtre les lignes avant tout regroupement : seules celles où ${body} est vrai passent.`,
  }[lang]),
  whereLike: (lang: Lang): string => ({
    pt: " (LIKE faz busca por padrão de texto.)",
    en: " (LIKE matches a text pattern.)",
    es: " (LIKE busca un patrón de texto.)",
    fr: " (LIKE recherche un motif de texte.)",
  }[lang]),
  whereIn: (lang: Lang): string => ({
    pt: " (IN testa pertencimento a uma lista.)",
    en: " (IN tests membership in a list.)",
    es: " (IN comprueba pertenencia a una lista.)",
    fr: " (IN teste l'appartenance à une liste.)",
  }[lang]),
  whereBetween: (lang: Lang): string => ({
    pt: " (BETWEEN testa intervalo inclusivo.)",
    en: " (BETWEEN tests an inclusive range.)",
    es: " (BETWEEN comprueba un intervalo inclusivo.)",
    fr: " (BETWEEN teste un intervalle inclusif.)",
  }[lang]),
  whereNull: (lang: Lang): string => ({
    pt: " (IS NULL detecta valores ausentes.)",
    en: " (IS NULL detects missing values.)",
    es: " (IS NULL detecta valores ausentes.)",
    fr: " (IS NULL détecte les valeurs manquantes.)",
  }[lang]),
  groupBy: (body: string, lang: Lang): string => ({
    pt: `Agrupa as linhas por ${body}. Cada grupo vira uma linha no resultado, e as agregações (COUNT, SUM, AVG…) são calculadas por grupo.`,
    en: `Groups rows by ${body}. Each group becomes one row in the result, and aggregations (COUNT, SUM, AVG…) are computed per group.`,
    es: `Agrupa las filas por ${body}. Cada grupo se convierte en una fila del resultado, y las agregaciones (COUNT, SUM, AVG…) se calculan por grupo.`,
    fr: `Regroupe les lignes par ${body}. Chaque groupe devient une ligne dans le résultat, et les agrégations (COUNT, SUM, AVG…) sont calculées par groupe.`,
  }[lang]),
  having: (body: string, lang: Lang): string => ({
    pt: `Filtra os grupos formados pelo GROUP BY: só passam grupos em que ${body} é verdadeiro. Use HAVING para condições sobre agregações (ex.: COUNT(*) > 5).`,
    en: `Filters the groups formed by GROUP BY: only groups where ${body} is true pass through. Use HAVING for conditions on aggregations (e.g. COUNT(*) > 5).`,
    es: `Filtra los grupos formados por GROUP BY: solo pasan los grupos donde ${body} es verdadero. Usa HAVING para condiciones sobre agregaciones (ej.: COUNT(*) > 5).`,
    fr: `Filtre les groupes formés par GROUP BY : seuls les groupes où ${body} est vrai passent. Utilisez HAVING pour les conditions sur les agrégations (ex. : COUNT(*) > 5).`,
  }[lang]),
  orderBy: (body: string, isDesc: boolean, lang: Lang): string => {
    const dir: Record<Lang, [string, string]> = {
      pt: ["decrescente", "crescente"],
      en: ["descending", "ascending"],
      es: ["descendente", "ascendente"],
      fr: ["décroissant", "croissant"],
    };
    const [d, a] = dir[lang];
    const word = isDesc ? d : a;
    const m: Record<Lang, string> = {
      pt: `Ordena o resultado final por ${body} (ordem ${word}).`,
      en: `Orders the final result by ${body} (${word} order).`,
      es: `Ordena el resultado final por ${body} (orden ${word}).`,
      fr: `Trie le résultat final par ${body} (ordre ${word}).`,
    };
    return m[lang];
  },
  limit: (body: string, lang: Lang): string => ({
    pt: `Limita o número de linhas devolvidas a ${body}.`,
    en: `Limits the number of returned rows to ${body}.`,
    es: `Limita el número de filas devueltas a ${body}.`,
    fr: `Limite le nombre de lignes retournées à ${body}.`,
  }[lang]),
  offset: (body: string, lang: Lang): string => ({
    pt: `Pula as primeiras ${body} linhas antes de começar a devolver resultados (útil para paginação).`,
    en: `Skips the first ${body} rows before starting to return results (useful for pagination).`,
    es: `Omite las primeras ${body} filas antes de empezar a devolver resultados (útil para paginación).`,
    fr: `Saute les ${body} premières lignes avant de retourner des résultats (utile pour la pagination).`,
  }[lang]),
  union: (lang: Lang): string => ({
    pt: "Junta o resultado de duas consultas removendo linhas duplicadas.",
    en: "Combines the results of two queries removing duplicate rows.",
    es: "Une los resultados de dos consultas eliminando filas duplicadas.",
    fr: "Combine les résultats de deux requêtes en supprimant les lignes en doublon.",
  }[lang]),
  unionAll: (lang: Lang): string => ({
    pt: "Junta o resultado de duas consultas mantendo todas as linhas (incluindo duplicadas).",
    en: "Combines the results of two queries keeping all rows (including duplicates).",
    es: "Une los resultados de dos consultas manteniendo todas las filas (incluidas las duplicadas).",
    fr: "Combine les résultats de deux requêtes en conservant toutes les lignes (doublons compris).",
  }[lang]),
  defaultClause: (clause: string, body: string, lang: Lang): string => ({
    pt: `Cláusula ${clause}: ${body}`.trim(),
    en: `Clause ${clause}: ${body}`.trim(),
    es: `Cláusula ${clause}: ${body}`.trim(),
    fr: `Clause ${clause} : ${body}`.trim(),
  }[lang]),
  insertWithCols: (table: string, cols: string, lang: Lang): string => ({
    pt: `Insere uma nova linha em ${table}, preenchendo as colunas ${cols}.`,
    en: `Inserts a new row into ${table}, filling columns ${cols}.`,
    es: `Inserta una nueva fila en ${table}, rellenando las columnas ${cols}.`,
    fr: `Insère une nouvelle ligne dans ${table}, en remplissant les colonnes ${cols}.`,
  }[lang]),
  insertNoCols: (table: string, lang: Lang): string => ({
    pt: `Insere uma nova linha em ${table} (todas as colunas, na ordem definida pelo schema).`,
    en: `Inserts a new row into ${table} (all columns, in the schema-defined order).`,
    es: `Inserta una nueva fila en ${table} (todas las columnas, en el orden definido por el esquema).`,
    fr: `Insère une nouvelle ligne dans ${table} (toutes les colonnes, dans l'ordre défini par le schéma).`,
  }[lang]),
  valuesExpl: (lang: Lang): string => ({
    pt: "Lista os valores que serão inseridos, na mesma ordem das colunas.",
    en: "Lists the values to be inserted, in the same order as the columns.",
    es: "Lista los valores que se insertarán, en el mismo orden que las columnas.",
    fr: "Liste les valeurs à insérer, dans le même ordre que les colonnes.",
  }[lang]),
  selectSourceLabel: (lang: Lang): string => ({
    pt: "SELECT (origem)",
    en: "SELECT (source)",
    es: "SELECT (origen)",
    fr: "SELECT (source)",
  }[lang]),
  selectSourceExpl: (lang: Lang): string => ({
    pt: "Em vez de valores literais, os dados vêm de outra consulta SELECT (insert-from-select).",
    en: "Instead of literal values, the data comes from another SELECT query (insert-from-select).",
    es: "En lugar de valores literales, los datos vienen de otra consulta SELECT (insert-from-select).",
    fr: "Au lieu de valeurs littérales, les données proviennent d'une autre requête SELECT (insert-from-select).",
  }[lang]),
  updateBase: (table: string, lang: Lang): string => ({
    pt: `Atualiza linhas existentes na tabela ${table}.`,
    en: `Updates existing rows in the ${table} table.`,
    es: `Actualiza filas existentes en la tabla ${table}.`,
    fr: `Met à jour les lignes existantes dans la table ${table}.`,
  }[lang]),
  setExpl: (setPart: string, lang: Lang): string => ({
    pt: `Define os novos valores das colunas: ${setPart}.`,
    en: `Sets the new column values: ${setPart}.`,
    es: `Define los nuevos valores de las columnas: ${setPart}.`,
    fr: `Définit les nouvelles valeurs des colonnes : ${setPart}.`,
  }[lang]),
  updateWhere: (wherePart: string, lang: Lang): string => ({
    pt: `Restringe a atualização às linhas em que ${wherePart} é verdadeiro. ⚠️ Sem WHERE, todas as linhas seriam atualizadas.`,
    en: `Restricts the update to rows where ${wherePart} is true. ⚠️ Without WHERE, every row would be updated.`,
    es: `Restringe la actualización a las filas donde ${wherePart} es verdadero. ⚠️ Sin WHERE, todas las filas se actualizarían.`,
    fr: `Restreint la mise à jour aux lignes où ${wherePart} est vrai. ⚠️ Sans WHERE, toutes les lignes seraient mises à jour.`,
  }[lang]),
  noWhereLabel: (lang: Lang): string => ({
    pt: "(sem WHERE)",
    en: "(no WHERE)",
    es: "(sin WHERE)",
    fr: "(sans WHERE)",
  }[lang]),
  updateNoWhere: (lang: Lang): string => ({
    pt: "⚠️ Atenção: sem WHERE, todas as linhas da tabela serão atualizadas. Quase sempre é um erro.",
    en: "⚠️ Warning: without WHERE, every row in the table will be updated. Almost always a mistake.",
    es: "⚠️ Atención: sin WHERE, todas las filas de la tabla se actualizarán. Casi siempre es un error.",
    fr: "⚠️ Attention : sans WHERE, toutes les lignes de la table seront mises à jour. Presque toujours une erreur.",
  }[lang]),
  deleteBase: (table: string, lang: Lang): string => ({
    pt: `Remove linhas da tabela ${table}.`,
    en: `Removes rows from the ${table} table.`,
    es: `Elimina filas de la tabla ${table}.`,
    fr: `Supprime des lignes de la table ${table}.`,
  }[lang]),
  deleteWhere: (wherePart: string, lang: Lang): string => ({
    pt: `Apenas as linhas em que ${wherePart} é verdadeiro serão removidas.`,
    en: `Only rows where ${wherePart} is true will be removed.`,
    es: `Solo se eliminarán las filas donde ${wherePart} es verdadero.`,
    fr: `Seules les lignes où ${wherePart} est vrai seront supprimées.`,
  }[lang]),
  deleteNoWhere: (lang: Lang): string => ({
    pt: "⚠️ Sem WHERE, TODAS as linhas da tabela serão apagadas. Confirme se é mesmo isso que quer.",
    en: "⚠️ Without WHERE, ALL rows in the table will be deleted. Confirm this is what you want.",
    es: "⚠️ Sin WHERE, TODAS las filas de la tabla serán eliminadas. Confirma si es lo que quieres.",
    fr: "⚠️ Sans WHERE, TOUTES les lignes de la table seront supprimées. Confirmez que c'est bien ce que vous voulez.",
  }[lang]),
  createKind: (kindLower: string, name: string, lang: Lang): string => ({
    pt: `Cria ${kindLower} chamado(a) "${name}".`,
    en: `Creates a ${kindLower} called "${name}".`,
    es: `Crea ${kindLower} llamado(a) "${name}".`,
    fr: `Crée ${kindLower} nommé(e) "${name}".`,
  }[lang]),
  alterTable: (table: string, action: string, lang: Lang): string => ({
    pt: `Modifica a estrutura da tabela ${table}: ${action}.`,
    en: `Modifies the structure of the ${table} table: ${action}.`,
    es: `Modifica la estructura de la tabla ${table}: ${action}.`,
    fr: `Modifie la structure de la table ${table} : ${action}.`,
  }[lang]),
  cte: (lang: Lang): string => ({
    pt: "Define uma ou mais Common Table Expressions (subconsultas nomeadas) que podem ser referenciadas no SELECT abaixo.",
    en: "Defines one or more Common Table Expressions (named subqueries) that can be referenced in the SELECT below.",
    es: "Define una o más Common Table Expressions (subconsultas nombradas) que se pueden referenciar en el SELECT a continuación.",
    fr: "Définit une ou plusieurs Common Table Expressions (sous-requêtes nommées) qui peuvent être référencées dans le SELECT ci-dessous.",
  }[lang]),
  drop: (kindLower: string, name: string, lang: Lang): string => ({
    pt: `Remove ${kindLower} "${name}" do banco. ⚠️ Operação destrutiva e geralmente irreversível.`,
    en: `Removes ${kindLower} "${name}" from the database. ⚠️ Destructive and usually irreversible.`,
    es: `Elimina ${kindLower} "${name}" de la base de datos. ⚠️ Operación destructiva y generalmente irreversible.`,
    fr: `Supprime ${kindLower} "${name}" de la base de données. ⚠️ Opération destructive et généralement irréversible.`,
  }[lang]),
  truncate: (table: string, lang: Lang): string => ({
    pt: `Apaga TODAS as linhas da tabela "${table}", mas mantém a estrutura. Mais rápido que DELETE sem WHERE e geralmente não pode ser revertido.`,
    en: `Empties ALL rows from the "${table}" table but keeps its structure. Faster than DELETE without WHERE and usually cannot be rolled back.`,
    es: `Vacía TODAS las filas de la tabla "${table}" pero mantiene su estructura. Más rápido que DELETE sin WHERE y generalmente no se puede revertir.`,
    fr: `Vide TOUTES les lignes de la table "${table}" mais conserve sa structure. Plus rapide que DELETE sans WHERE et généralement irréversible.`,
  }[lang]),
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
  const hints = TABLE_HINTS[lang];
  return `${SCHEMA_PREFIX[lang]}: ${found.map((t) => hints[t]).join(" · ")}.`;
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
  let explanation = "";

  switch (clause) {
    case "SELECT":
    case "SELECT DISTINCT": {
      const cols = body || "*";
      const isStar = cols.trim() === "*";
      const isDistinct = clause === "SELECT DISTINCT";
      explanation = isStar
        ? T.selectStar(isDistinct, lang)
        : T.selectColumns(cols, isDistinct, lang);
      if (/\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(cols)) {
        explanation += T.aggregationsHint(lang);
      }
      break;
    }
    case "FROM": {
      const tables = findKnownTables(body);
      explanation = tables.length
        ? T.fromTables(tables.join(", "), lang)
        : T.fromBody(body, lang);
      break;
    }
    case "JOIN":
    case "INNER JOIN":
    case "LEFT JOIN":
    case "RIGHT JOIN":
    case "FULL JOIN":
    case "CROSS JOIN": {
      const kind = clause.replace("JOIN", "").trim() || "INNER";
      const desc = T.joinKindDesc(lang)[kind] ?? "";
      explanation = T.joinDesc(kind, body, desc, lang);
      break;
    }
    case "ON": {
      explanation = T.on(body, lang);
      break;
    }
    case "WHERE": {
      explanation = T.whereBase(body, lang);
      if (/\b(LIKE|ILIKE)\b/i.test(body)) explanation += T.whereLike(lang);
      if (/\bIN\s*\(/i.test(body)) explanation += T.whereIn(lang);
      if (/\bBETWEEN\b/i.test(body)) explanation += T.whereBetween(lang);
      if (/\bIS\s+NULL\b/i.test(body)) explanation += T.whereNull(lang);
      break;
    }
    case "GROUP BY": {
      explanation = T.groupBy(body, lang);
      break;
    }
    case "HAVING": {
      explanation = T.having(body, lang);
      break;
    }
    case "ORDER BY": {
      const isDesc = /\bDESC\b/i.test(body);
      explanation = T.orderBy(body, isDesc, lang);
      break;
    }
    case "LIMIT": {
      explanation = T.limit(body, lang);
      break;
    }
    case "OFFSET": {
      explanation = T.offset(body, lang);
      break;
    }
    case "UNION":
    case "UNION ALL": {
      explanation = clause === "UNION" ? T.union(lang) : T.unionAll(lang);
      break;
    }
    default:
      explanation = T.defaultClause(clause, body, lang);
  }

  return { clause, snippet, explanation, context: ctx };
}

function explainInsert(sql: string, lang: Lang): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/INSERT\s+INTO\s+(\w+)\s*(\([^)]*\))?\s*(VALUES\s*\(.+\)|SELECT\s+.+)?/i);
  if (!m) return steps;
  const table = m[1];
  const cols = m[2] ?? "";
  const values = m[3] ?? "";
  const ctx = tableContextNote(table, lang);
  const colsClean = cols.replace(/[()]/g, "");
  steps.push({
    clause: "INSERT INTO",
    snippet: `INSERT INTO ${table} ${cols}`.trim(),
    explanation: cols
      ? T.insertWithCols(table, colsClean, lang)
      : T.insertNoCols(table, lang),
    context: ctx,
  });
  if (values) {
    const isValues = values.toUpperCase().startsWith("VALUES");
    steps.push({
      clause: isValues ? "VALUES" : T.selectSourceLabel(lang),
      snippet: values,
      explanation: isValues ? T.valuesExpl(lang) : T.selectSourceExpl(lang),
    });
  }
  return steps;
}

function explainUpdate(sql: string, lang: Lang): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?;?$/i);
  if (!m) return steps;
  const [, table, setPart, wherePart] = m;
  steps.push({
    clause: "UPDATE",
    snippet: `UPDATE ${table}`,
    explanation: T.updateBase(table, lang),
    context: tableContextNote(table, lang),
  });
  steps.push({
    clause: "SET",
    snippet: `SET ${setPart}`,
    explanation: T.setExpl(setPart, lang),
  });
  if (wherePart) {
    steps.push({
      clause: "WHERE",
      snippet: `WHERE ${wherePart}`,
      explanation: T.updateWhere(wherePart, lang),
    });
  } else {
    steps.push({
      clause: T.noWhereLabel(lang),
      snippet: "—",
      explanation: T.updateNoWhere(lang),
    });
  }
  return steps;
}

function explainDelete(sql: string, lang: Lang): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const steps: ExplainStep[] = [];
  const m = norm.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?;?$/i);
  if (!m) return steps;
  const [, table, wherePart] = m;
  steps.push({
    clause: "DELETE FROM",
    snippet: `DELETE FROM ${table}`,
    explanation: T.deleteBase(table, lang),
    context: tableContextNote(table, lang),
  });
  if (wherePart) {
    steps.push({
      clause: "WHERE",
      snippet: `WHERE ${wherePart}`,
      explanation: T.deleteWhere(wherePart, lang),
    });
  } else {
    steps.push({
      clause: T.noWhereLabel(lang),
      snippet: "—",
      explanation: T.deleteNoWhere(lang),
    });
  }
  return steps;
}

function explainCreate(sql: string, lang: Lang): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const m = norm.match(/CREATE\s+(TABLE|VIEW|INDEX|DATABASE|SCHEMA)\s+(\w+)/i);
  if (!m) return [];
  const [, kind, name] = m;
  return [
    {
      clause: `CREATE ${kind.toUpperCase()}`,
      snippet: norm.slice(0, 120) + (norm.length > 120 ? "…" : ""),
      explanation: T.createKind(kind.toLowerCase(), name, lang),
      context: tableContextNote(name, lang),
    },
  ];
}

function explainAlter(sql: string, lang: Lang): ExplainStep[] {
  const norm = stripStringsAndComments(sql).replace(/\s+/g, " ").trim();
  const m = norm.match(/ALTER\s+TABLE\s+(\w+)\s+(.+);?$/i);
  if (!m) return [];
  const [, table, action] = m;
  return [
    {
      clause: "ALTER TABLE",
      snippet: norm,
      explanation: T.alterTable(table, action, lang),
      context: tableContextNote(table, lang),
    },
  ];
}

export function explainSql(input: string, lang: Lang = "pt"): ExplainStep[] {
  const trimmed = input.trim();
  if (!trimmed) return [];
  const head = trimmed.toUpperCase();

  if (/^WITH\b/.test(head)) {
    const cteIntro: ExplainStep = {
      clause: "WITH (CTE)",
      snippet: trimmed.split(/\bSELECT\b/i)[0].trim(),
      explanation: T.cte(lang),
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
          explanation: T.drop(m[1].toLowerCase(), m[2], lang),
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
          explanation: T.truncate(m[1], lang),
          context: tableContextNote(m[1], lang),
        },
      ];
    }
  }
  return [];
}
